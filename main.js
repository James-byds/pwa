import { install } from "/install.js";

const APIurl = "https://ingrwf12.cepegra-frontend.xyz/cockpit1/api/content/item/voyages";

fetch(APIurl)
.then(res => res.json())
.then(data => {
  const voyage = document.querySelector(".voyage");
  console.log(data);
  voyage.innerHTML = data["voyages-label"];
  const description = document.querySelector(".description");
  description.innerHTML = data["voyages-description"];
  const prix = document.querySelector(".prix");
  prix.innerHTML = data["voyages-prix"];
  //data.voyages-prix ne fonctionne pas car le - n'est pas pris en compte
})

install();