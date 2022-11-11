// Sélection d'éléments dans le DOM

const gallery = document.querySelector(".gallery");
const creatorsFilter = document.querySelector("#filter-by-creators");
const creatorsList = document.querySelector(".creators-list");
const creatorsReset = document.querySelector(".creators-reset");
const creatorSearchBar = document.querySelector("#search-bar-creator");

// Création d'un bouton pour afficher plus de cartes

const loadMoreButton = document.createElement("button");
loadMoreButton.className = "load-more";
loadMoreButton.innerText = "Charger plus";

// Variable qui va contenir les données à afficher dans la gallerie

let galleryData = "";

// Variable qui va contenir les créateurs sélectionnés par l'utilisateur pour filter par créateur

let selectedCreators = [];

// Gestionnaire d'événement qui va permettre de fermer le filtre de créateurs lorsqu'utilisateur clique en dehors du filtre

document.addEventListener("click", (e) => {
  if (
    !e.target.closest("#creators-filter-container") &&
    creatorsFilter.classList.contains("active")
  ) {
    creatorsFilter.classList.remove("active");
  }
});

// Méthode qui permet de requêter l'api et récupérer des données

fetch("https://awesome-nft-app.herokuapp.com/")
  .then((response) => response.json())
  .then((data) => {
    gallery.innerHTML = "";
    addCards(data.assets);
    loadMoreButton.addEventListener("click", () => addCards(galleryData));
    creatorsFilter.addEventListener("click", (e) =>
      e.target.classList.toggle("active")
    );
    fillCreatorsList(data.assets);
    creatorsReset.addEventListener("click", () =>
      resetCreatorsSelection(data.assets)
    );
    creatorSearchBar.addEventListener("input", (e) => {
      creatorsList.innerHTML = "";
      const searchCreatorResults = data.assets.filter((nftObj) =>
        nftObj.creator.username
          .toLowerCase()
          .startsWith(e.target.value.toLowerCase().trimStart())
      );

      searchCreatorResults.forEach((nftObj) => {
        if (nftObj.creator.username !== "") {
          const listItem = document.createElement("li");
          selectedCreators.includes(nftObj.creator.username)
            ? listItem.classList.add("creator-item", "selected")
            : listItem.classList.add("creator-item");
          listItem.innerText = nftObj.creator.username;
          listItem.addEventListener("click", (e) =>
            handleCreatorsSelection(e, data.assets)
          );
          creatorsList.appendChild(listItem);
        }
      });
    });
  })
  .catch((error) => console.error(error.message));

// Fonction qui crée des cartes à partir du tableau de données retourné par l'api

function createCards(dataArr) {
  let nftCards = "";

  for (const data of dataArr) {
    nftCards += `<div class="product-card">
        <div class="product-image">
          <img src="${data.image_url}" alt="nft ${data.name}">
        </div>
        <div class="product-info">
          <p class="product-name"><span>Nom</span> ${
            data.name[0].toUpperCase() + data.name.slice(1)
          }</p>
          ${
            data.creator.username &&
            `<p class="product-creator"><span>Créateur</span> ${
              data.creator.username[0].toUpperCase() +
              data.creator.username.slice(1)
            }</p>`
          }
          ${
            data.description &&
            `<p class="product-description"><span>Description</span> ${
              data.description[0].toUpperCase() + data.description.slice(1)
            }</p>`
          }
          <p class="product-sales"><span>Nombre de ventes</span> ${
            data.sales
          }</p>
          <button class="more-info" onclick="window.open('../product/index.html?id=${
            data.id
          }', '_blank')">Plus d'info</button>
        </div>
    </div>`;
  }

  return nftCards;
}

// Fonction qui injecte dans le DOM les cartes créées

function addCards(dataArr, maxToDisplay = 6) {
  galleryData = dataArr;

  gallery.after(loadMoreButton);

  const dataToDisplay = dataArr.slice(
    gallery.children.length,
    gallery.children.length + maxToDisplay
  );

  if (gallery.children.length + maxToDisplay >= dataArr.length) {
    const productCards = createCards(dataToDisplay);
    gallery.innerHTML += productCards;
    loadMoreButton.remove();
    return;
  }

  const productCards = createCards(dataToDisplay);
  gallery.innerHTML += productCards;
}

// Fonction qui réinitialise les créateurs sélectionnés

function resetCreatorsSelection(dataArr) {
  selectedCreators = [];
  Array.from(creatorsList.children).forEach(
    (creatorItem) => (creatorItem.className = "creator-item")
  );
  gallery.innerHTML = "";
  addCards(dataArr);
}

// Fonction qui permet de remplir la liste de créateurs avec les données renvoyées par l'api

function fillCreatorsList(dataArr) {
  dataArr
    .map((nftObj) => nftObj.creator.username)
    .filter((creator) => creator !== "")
    .forEach((creator) => {
      const listItem = document.createElement("li");
      listItem.className = "creator-item";
      listItem.innerText = creator;
      listItem.addEventListener("click", (e) =>
        handleCreatorsSelection(e, dataArr)
      );
      creatorsList.appendChild(listItem);
    });
}

// Fonction qui permet de filtrer par créateur

function filterByCreator(dataArr) {
  return dataArr.filter((nftObj) =>
    selectedCreators.includes(nftObj.creator.username)
  );
}

// Fonction qui permet de sélectionner des créateurs

function selectCreator(creatorName, dataArr) {
  selectedCreators.push(creatorName);
  const filteredCreators = filterByCreator(dataArr);
  gallery.innerHTML = "";
  addCards(filteredCreators);
}

// Fonction qui permet de désélectionner des créateurs

function unselectCreator(creatorName, dataArr) {
  const creatorToDelete = selectedCreators.findIndex(
    (creator) => creator === creatorName
  );
  selectedCreators.splice(creatorToDelete, 1);
  if (selectedCreators.length !== 0) {
    const filteredCreators = filterByCreator(dataArr);
    gallery.innerHTML = "";
    addCards(filteredCreators);
    return;
  }
  gallery.innerHTML = "";
  addCards(dataArr);
}

// Fonction qui gère la sélection et la déselection d'un créateur

function handleCreatorsSelection(e, dataArr) {
  e.target.classList.toggle("selected");
  e.target.classList.contains("selected")
    ? selectCreator(e.target.innerText, dataArr)
    : unselectCreator(e.target.innerText, dataArr);
}
