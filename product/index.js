let apiRequest = new Promise((resolve, reject) => {
    // Récupération de l'ID du NFT grâce au lien 
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const nftID = urlParams.get('id'); 
    //const nftID = 385541131; // Pour les tests
    console.log(nftID);
    // Récupération des informations d'un NFT en particulier en fonction du ID du NFT
    fetch('https://awesome-nft-app.herokuapp.com/nft/' + nftID).then(response => response.json())
        .then(function (data) {
            resolve(data); 
        });
})

async function displayNFTDetails(){
    let nftInfos  = await apiRequest; 
    console.log(nftInfos); 

    // Intégration des informations du NFT dans le template HTML 
    document.getElementById('nft_title').innerText = nftInfos.name;  
    document.getElementById('nft_id').innerText = nftInfos.id;  
    document.getElementById('nft_src').src = nftInfos.image_url;

    if (nftInfos.creator.username !== "") {
        console.log('in');
        document.getElementById('nft_artisteName').innerText = nftInfos.creator.username;
    }
    if (nftInfos.sales !== "") {
        console.log('in2');
        if (nftInfos.sales !== 0) {document.getElementById('nft_sales').innerText = nftInfos.sales;}
    }
    if (nftInfos.description !== "") {
        console.log('in3');
        document.getElementById('nft_description').innerText = nftInfos.description;
    }
    console.log(window.localStorage);

    // afficher un coeur rouge si le nft a été ajouté aux favoris 
    if (localStorage.getItem('favoris') !== null) {
        for (fav of JSON.parse(window.localStorage.favoris)) {
            if (fav === nftInfos.name){document.getElementsByClassName('heart')[0].style.color = 'red';}
        }
    }

    // ajout d'événements à l'icon coeur -> favoris 
    document.getElementsByClassName('heart')[0].addEventListener("click", function() {
        let favorisList = []; 
        // l'item n'existe pas dans le localStorage
        if (localStorage.getItem('favoris') === null) {
            favorisList.push(nftInfos.name);
            localStorage.setItem("favoris", JSON.stringify(favorisList));
            document.getElementsByClassName('heart')[0].style.color = 'red';
        }
        else { // l'item existe déjà dans le localStorage donc on ajoute un nouveau nft dans la liste des favoris 
            console.log(favorisList);
            let booleanDuplicate =  false; 
            for (fav of JSON.parse(window.localStorage.favoris)) {
                fav === nftInfos.name ? booleanDuplicate = true : null; 
                favorisList.push(fav);
            }

            // ajout d'un NFT dans les favoris 
            if ( booleanDuplicate === false) {
                favorisList.push(nftInfos.name);
                document.getElementsByClassName('heart')[0].style.color = 'red';
            }
            else { // retrait du NFT dans les favoris 
                favorisList = favorisList.filter(item => item !== nftInfos.name);
                document.getElementsByClassName('heart')[0].style.color = 'black';
            }
            console.log(favorisList);
            localStorage.setItem("favoris", JSON.stringify(favorisList));
        }
        console.log(window.localStorage);
    });
}

displayNFTDetails();



