const version = "v1.0";
//dans ce fichier on va configurer le service worker
// les elements comme window, document,etc n'existent pas dans le service worker

const urlsToCache = [
  "/",
  //html files
  "/index.html",
  "/style.css",
  //js scripts
  "/main.js",
  "/install.js",
  "/register-sw.js",
  "/sw.js",
  //icons 
  "/favicon.ico",
  "/icons/favicon-16x16.png",
  "/icons/favicon-32x32.png",
  "/icons/favicon-96x96.png",
  "/icons/favicon-256x256.png",
  "/screenshots/screenshot_landscape.jpg",
  "/screenshots/screenshot_port.jpg",
  "/manifest.json",
  //api
  "https://ingrwf12.cepegra-frontend.xyz/cockpit1/api/content/item/voyages"
];

const cacheVersion = 2;
const CACHE_NAME = `pwa-cache-${cacheVersion}`;

//install
self.addEventListener("install", (e) => {
  console.log("installing");
  e.waitUntil(
    caches.open(CACHE_NAME)//ouverture du cache
    .then((cache) => {return cache.addAll(urlsToCache); //mise en cache de tous les fichiers
    })
  );
  return self.skipWaiting(); //pour forcer l'installation
});

//activate
self.addEventListener("activate", (e) => {
  console.log("activating");
  let oldVersion = cacheVersion - 1;
  e.waitUntil(
    caches.has(`pwa-cache-${oldVersion}`).then((hasOldCache) => {
      if (hasOldCache) {
        caches.delete(`pwa-cache-${oldVersion}`)
        .then((r) => console.log('ancienne version supprimée :', r));
      }
    })
  )
  return self.clients.claim();//pour forcer l'activation de la nouvelle version
});

//proxy
// Intercepte toutes les requêtes réseau (fetch)
self.addEventListener("fetch", (e) => {
  // Ne prend en charge que les requêtes GET.
  // Pour POST/PUT/DELETE... on laisse le navigateur gérer (pas de respondWith).
  if (e.request.method !== "GET") return;

  // On remplace la réponse par notre logique de cache/réseau
  e.respondWith(
    // 1) Regarder d'abord dans le Cache Storage s'il existe déjà une réponse
    caches.match(e.request).then((cached) => {
      if (cached) return cached; // ✅ Ressource trouvée en cache → on la renvoie tout de suite (cache-first)

      // 2) Sinon, on va sur le réseau
      return fetch(e.request)
        .then((resp) => {
          // Les Response sont des streams consommables une seule fois.
          // On clone pour pouvoir à la fois renvoyer la réponse au navigateur ET l’enregistrer dans le cache.
          const clone = resp.clone();

          // On ne met en cache que si:
          // - la réponse est OK (status 200-299)
          // - la ressource est de même origine (évite de stocker des réponses opaques/CORS)
          if (
            resp.ok &&
            new URL(e.request.url).origin === self.location.origin
          ) {
            // Mise en cache en "runtime" (asynchrone, on n'attend pas)
            caches.open(CACHE_NAME).then((cache) => cache.put(e.request, clone));
          }

          // On renvoie la réponse réseau au navigateur
          return resp;
        })
        .catch(() => {
          // 3) Ici on arrive si le réseau échoue (offline, DNS, etc.)

          // Si la requête est une navigation (ex: refresh / saisie d'URL),
          // on renvoie l'index de la SPA pour avoir un fallback hors-ligne.
          if (e.request.mode === "navigate") {
            return caches.match("/index.html");
          }

          // Pour les autres requêtes (images, CSS, etc.) sans fallback spécifique,
          // on renvoie une réponse "Offline" 503.
          return new Response("Offline", {
            status: 503,
            statusText: "Offline",
          });
        });
    })
  );
});

//notifs push
let url= null
self.addEventListener("push", (ev) => {
  if(!(self.Notification && self.Notification.permission === "granted")) return;
  //si le navigateur ne supporte pas les notifications ou si nous n'avons pas les droits, on sort
  console.log("notif data ", ev.data);  
  const data = ev.data?.json() ?? {};//on recupere les data envoyees par le serveur
  const title = data.title || "Notification";//on recupere le titre
  url = data.url || "https://google.com";
  const message = data.message || "Ceci est une notification";
  const icon = "icons/favicon-256x256.png";
  const options = {
    body: message,
    icon,
  };
  const notification = registration.showNotification(data.title, options);
  self.addEventListener("notificationclick", (ev) => {
    ev.notification.close();
    ev.waitUntil(
      clients.openWindow(url)
    );
  })
});