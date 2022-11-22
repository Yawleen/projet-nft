const URL = 'https://awesome-nft-app.herokuapp.com/';

// Variables -> sélection des éléments dans le dom récupération de la zone où on randomize les cards de NFT du jour et le bouton pour produire l'évènement au clic

const shuffleZone = document.querySelector(".shuffle-gallery");
const btnShuffle = document.querySelector(".shuffle-option");

// Méthode qui permet de requêter l'api et récupérer des données + qui permet de récupérer trois nft random

const getRandom = async () => {
  try {
    const response = await fetch(URL);
    const data = await response.json();
    const keys = data.assets;
    const nodeElements = document.querySelectorAll('.shuffle-card');
    const arrayElements = [...nodeElements];
    shuffle(0, keys.length, keys);

    if (arrayElements.length >= 3) {
      shuffleZone.innerHTML = '';
      shuffle(0, keys.length, keys); 
    }
  } catch (err) {
    console.error(err);
  }
};

function displayNFT(nft) {
  const element = document.createElement('div');
  element.classList.add('shuffle-card');
  element.innerHTML = `<div class="product-card">
        <div class="product-image">
          <img src="${nft.image_url}" alt="nft ${nft.name}">
        </div>
        <div class="product-info">
          <p class="product-name"><span>Nom</span> ${
            nft.name[0].toUpperCase() + nft.name.slice(1)
          }</p>
          ${
            nft.creator.username &&
            `<p class="product-creator"><span>Créateur</span> ${
                nft.creator.username[0].toUpperCase() +
                nft.creator.username.slice(1)
            }</p>`
          }
          <button class="more-info" onclick="window.open('../product/index.html?id=${
            nft.id
          }', '_blank')">Plus d'info</button>
        </div>
        </div>`;

  shuffleZone.append(element);

}

function shuffle(min, max, array) {
  let num, already = new Object;

  let tab = array;
  let start = min;
  let end = max;

      for (let i = 0; i < 3;) {
        num = (Math.random() * (end - start) + start) ^ 0;
        if (!(num in already)) {
          already[num] = num;
          i++;
          displayNFT(tab[num]);
        }
      }
}

getRandom();