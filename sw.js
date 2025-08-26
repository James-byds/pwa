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

const cacheVersion = 1;
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
  return self.clients.claim();//pour forcer l'activation de la nouvelle version
});

//proxy
self.addEventListener("fetch", (e) => {
  console.log("fetching");
  e.respondWith(//permet de renvoyer la requete
    caches.match(e.request).then((response) => {//si la requete est dans le cache
      return response || fetch(e.request);//renvoyer la requete sinon la faire sur le serveur
    })
  );
});