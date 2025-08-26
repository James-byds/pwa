const btn = document.querySelector(".install_btn");
let deferredPrompt = null;

btn.classList.add("hidden");

const install = () => {
  window.addEventListener("beforeinstallprompt", (e) => {
    //cet event ne se lancera que si le navigateur supporte les PWA
    e.preventDefault();
    console.log("beforeinstallprompt fired");
    deferredPrompt = e; // Store the event to be able to trigger the prompt
    btn.classList.remove("hidden");
  });
  
  btn.addEventListener("click", async (e) => {
  e.preventDefault();
  deferredPrompt.prompt();
  const result = await deferredPrompt.userChoice;
  if (result.outcome === "accepted") btn.classList.add("hidden");
  deferredPrompt = null;//reset
});

window.addEventListener("appinstalled", (e) => {
  console.log("appinstalled fired");
});
}

install()