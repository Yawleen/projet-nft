// Récupération des informations d'un NFT en particulier 
fetch('https://awesome-nft-app.herokuapp.com/nft/385541166')
  .then((response) => response.json())
  .then((data) => console.log(data));