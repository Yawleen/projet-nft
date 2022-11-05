fetch('https://awesome-nft-app.herokuapp.com/')
  .then((response) => response.json())
  .then((data) => console.log(data));
