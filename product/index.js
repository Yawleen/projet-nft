let apiRequest = new Promise((resolve, reject) => {
    // Récupération de l'ID du NFT grâce au lien 
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    //const nftID = urlParams.get('id'); 
    const nftID = 385541166; // Pour les tests
    console.log(nftID);
    // Récupération des informations d'un NFT en particulier en fonction du ID du NFT
    fetch('https://awesome-nft-app.herokuapp.com/nft/' + nftID).then(response => response.json())
        .then(function (data) {
            //console.log(data);
            resolve(data); 
        });
})

async function displayNFTDetails(){
    let nftInfos  = await apiRequest; 
    console.log(nftInfos); 

    // Intégration des informations du NFT dans le template HTML 
    const nftTitle = document.getElementById('nft_title');
    console.log(nftTitle);
}

displayNFTDetails();



