// Sélection de la gallerie dans le DOM

const gallery = document.querySelector(".gallery");


// Création d'un bouton pour afficher plus de cartes

const loadMoreButton = document.createElement("button");
loadMoreButton.className = "load-more";
loadMoreButton.innerText = "Charger plus";


// Variable qui va contenir les données à afficher dans la gallerie

let galleryData = "";



// Méthode qui permet de requêter l'api et récupérer des données

fetch("https://awesome-nft-app.herokuapp.com/")
  .then((response) => response.json())
  .then((data) => {
    gallery.innerHTML = "";
    addCards(data.assets);
    loadMoreButton.addEventListener("click", () => addCards(galleryData));
  }).catch(error => console.error(error.message));


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

