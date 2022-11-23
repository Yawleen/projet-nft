const apiRequest = new Promise((resolve) => {
  // Récupération de l'ID du NFT grâce au lien
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const nftID = urlParams.get("id");

  // Récupération des informations d'un NFT en particulier en fonction du ID du NFT
  fetch("https://awesome-nft-app.herokuapp.com/nft/" + nftID)
    .then((response) => response.json())
    .then(function (data) {
      resolve(data);
    });
});

async function displayNFTDetails() {
  const nftInfos = await apiRequest;

  // Intégration des informations du NFT dans le DOM
  document.getElementById("nft").innerHTML = `
  <span class="material-symbols-outlined heart">favorite</span>
    <div id="nft-illustration">
        <img id="nft-illustration__image" src="${nftInfos.image_url}" alt="nft ${nftInfos.name}"/>
    </div>
    <div id="nft-details">
        <div id="nft-title">
            <p id="nft-title__text">${nftInfos.name}</p>
        </div>

        <div class="nft-info">
            <p class="nft-info__type">ID</p>
            <p id="nft-info__id">${nftInfos.id}</p>
        </div>

        ${nftInfos.creator.username && `
        <div class="nft-info">
            <p class="nft-info__type">Créé par <span id="nft-artist-name">${nftInfos.creator.username}</span></p>
        </div>`}

        <div class="nft-info">
            <p class="nft-info__type">Nombre de ventes</p>
            <p id="nft-info__sales">${nftInfos.sales}</p>
        </div>

        ${nftInfos.description && `
        <div class="nft-info">
            <p class="nft-info__type">Description</p>
            <p id="nft-info__description">${nftInfos.description}</p>
        </div>
        `}
    </div>
    `;

  // afficher un coeur rose si le nft a été ajouté aux favoris
  if (localStorage.getItem("favoris") !== null) {
    for (fav of JSON.parse(window.localStorage.favoris)) {
      if (fav === nftInfos.name) {
        document.getElementsByClassName("heart")[0].style.color = "#ff0008";
      }
    }
  }

  // ajout d'événements à l'icon coeur -> favoris
  document
    .getElementsByClassName("heart")[0]
    .addEventListener("click", function () {
      let favorisList = [];

      // l'item n'existe pas dans le localStorage
      if (localStorage.getItem("favoris") === null) {
        favorisList.push(nftInfos.name);
        localStorage.setItem("favoris", JSON.stringify(favorisList));
        document.getElementsByClassName("heart")[0].style.color = "#ff0008";
      } else {
        // l'item existe déjà dans le localStorage donc on ajoute un nouveau nft dans la liste des favoris
        let booleanDuplicate = false;
        for (fav of JSON.parse(window.localStorage.favoris)) {
          fav === nftInfos.name ? (booleanDuplicate = true) : null;
          favorisList.push(fav);
        }

        // ajout d'un NFT dans les favoris
        if (booleanDuplicate === false) {
          favorisList.push(nftInfos.name);
          document.getElementsByClassName("heart")[0].style.color = "#ff0008";
        } else {
          // retrait du NFT dans les favoris
          favorisList = favorisList.filter((item) => item !== nftInfos.name);
          document.getElementsByClassName("heart")[0].style.color = "#222";
        }

        localStorage.setItem("favoris", JSON.stringify(favorisList));
      }
    });
}

displayNFTDetails();
