// API

const URL = 'https://awesome-nft-app.herokuapp.com/';

// Sélection d'éléments dans le DOM

const searchBar = document.querySelector("#search-bar");
const resultsList = document.querySelector('.gallery');
const main = document.querySelector('main');
const container = document.querySelector('.gallery-wrapper');
const separator = document.querySelector('.separator');


// Variable qui va contenir les résultats de la search-bar

let selectedResults = [];

// Action lorsqu'on remplit la barre de recherche
searchBar.addEventListener('keyup', (e) => {
    const btnLoader = document.querySelector('.load-more');
    const searchString = e.target.value.toLowerCase();
    const filteredResults = selectedResults.filter((r) => {
        return (
            r.name.toLowerCase().includes(searchString)
        )
    });

    displayResults(filteredResults);
    main.prepend(container);
    container.append(separator);
    btnLoader.style.display = 'none';

    // si il n'y a rien dans la barre de recherche, on remet tout comme c'était avant
    if(searchString.length === 0) {
        main.append(container);
        container.prepend(separator);
        btnLoader.style.display = 'block';
    } 
});

// Méthode qui permet de requêter l'api et récupérer des données

const loadResults = async () => {
    try {
        const response = await fetch(URL);
        const data = await response.json();
        selectedResults = data.assets;
    } catch (err) {
        console.error(err);
    }
};

// // Fonction qui crée les cartes à partir du tableau de données retourné par l'api

const displayResults = (results) => {
    const htmlString = results
      .map((result) => {
        return `<div class="product-card">
        <div class="product-image">
          <img src="${result.image_url}" alt="nft ${result.name}">
        </div>
        <div class="product-info">
          <p class="product-name"><span>Nom</span> ${
            result.name[0].toUpperCase() + result.name.slice(1)
          }</p>
          ${
            result.creator.username &&
            `<p class="product-creator"><span>Créateur</span> ${
              result.creator.username[0].toUpperCase() +
              result.creator.username.slice(1)
            }</p>`
          }
          ${
            result.description &&
            `<p class="product-description"><span>Description</span> ${
              result.description[0].toUpperCase() + result.description.slice(1)
            }</p>`
          }
          <p class="product-sales"><span>Nombre de ventes</span> ${
            result.sales
          }</p>
          <button class="more-info" onclick="window.location.href = './product/index.html?id=${
            result.id
          }'">Plus d'info</button>
        </div>
    </div>`;
      })
      .join('');
      resultsList.innerHTML = htmlString;
  }

  loadResults();