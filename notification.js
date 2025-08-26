const notification = () => {
  const btn = document.querySelector(".notification_btn");
  btn.addEventListener("click", (ev) => {
    ev.preventDefault();
    let myNotification = null;//initialisation
    const options = {//les options de la notification
      body: "Ceci est une notification",
      icon: "icons/favicon-256x256.png",
      vibrate: [100, 50, 100],
      tag: "notification",
    };
    if (!("Notification") in window) {//si le navigateur ne supporte pas les notifications
      alert("Votre navigateur ne supporte pas les notifications");
    } else if (Notification.permission === "granted") {//si nous avons les droits
      console.log("notification granted");
      myNotification = new Notification("Hello", options);
    } else {//si nous n'avons pas les droits, on va les demander
      Notification.requestPermission().then((result) => {
        if (result === "denied") {
          console.log("notification denied");
        } else if (result === "granted") {
          console.log("notification granted");
          myNotification = new Notification("Hello", options);
        }
      });
      
    }
    myNotification.onclick = () => {
      window.open("https://google.com", "_blank");
    };
});//end of click btn
}//end of notification

notification()//calling the function