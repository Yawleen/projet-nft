// Récupération des informations d'un NFT en particulier 

// Récupération de l'ID du NFT grâce au lien 
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const nftID = urlParams.get('id'); 
//const nftID = 385541166; // Pour les tests
console.log(nftID);

fetch('https://awesome-nft-app.herokuapp.com/nft/' + nftID)
  .then((response) => response.json())
  .then((data) => console.log(data));