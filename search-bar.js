// Sélection d'éléments dans le DOM

const searchBar = document.querySelector("#search-bar");
const searchBarDropdown = document.querySelector(".search-bar-dropdown");
const searchBarContainer = document.querySelector(".search-bar-container");
const resultsList = document.querySelector("#results-list");

// Gestionnaire d'événement qui va permettre de fermer le dropdown de la search bar lorsque l'utilisateur clique en dehors 

document.addEventListener("click", (e) => {
  if (!searchBarContainer.contains(e.target)) {
    searchBarDropdown.classList.remove("opened");
  }
});

// Méthode qui permet de requêter l'api et récupérer des données

const loadResults = async () => {
  try {
    const response = await fetch('https://awesome-nft-app.herokuapp.com/');
    const data = await response.json();
    nftList = data.assets;

    // Gestionnaire d'événement qui permet de vérifier ce que saisit l'utilisateur, filtrer les nfts qui commencent par la chaîne de caractères saisie puis les afficher dans une liste 

    searchBar.addEventListener("input", (e) => {
      const searchString = e.target.value.toLowerCase().trimStart();
      const filteredResults = nftList.filter((nft) =>
        nft.name.toLowerCase().startsWith(searchString)
      );

      if (filteredResults.length > 0) {
        resultsList.innerHTML = "";
        searchBarDropdown.classList.add("opened");
        filteredResults.length > 4
          ? (searchBarDropdown.style.overflowY = "scroll")
          : (searchBarDropdown.style.overflowY = "hidden");
        filteredResults.forEach((result) => {
          const resultItem = document.createElement("li");
          resultItem.className = "search-bar-result";
          resultItem.innerText = result.name;
          resultItem.addEventListener("click", () => {
            window.location.href = `./product/index.html?id=${result.id}`;
          });
          resultsList.appendChild(resultItem);
        });
      } else {
        searchBarDropdown.classList.remove("opened");
        resultsList.innerHTML = "";
      }
    });
  } catch (err) {
    console.error(err);
  }
};

loadResults();
