// on récupère les travaux sur l'API
async function worksApi() {
    const url = "http://localhost:5678/api/works"
    const fetcher = await fetch (url)
    const json = await fetcher.json()
    return json 
};

// on récupère les catégories sur l'API et on y ajoute l'elt "Tous"
async function catApi() {
    const url = "http://localhost:5678/api/categories"
    const fetcher = await fetch(url)
    const json = await fetcher.json()
    json.unshift({id:4, name:"Tous"}); //unshift est l'inverse de push, on ajoute l'objet au début dde l'array
    return json
};


// on parcourt la liste des catégories récupérées et on génère les boutons de filtres
//ici on ne s'en sert pas, on crée les filtres directement en html

async function afficherFiltres() {
    let liste = await catApi()
    for (list of liste) {
        const barreFiltre = document.querySelector (".categories");
        const btnFiltre = document.createElement ("button");
        btnFiltre.innerText=list.name;

        barreFiltre.appendChild(btnFiltre);
    }
};

//On parcourt la liste des travaux récupérés et on génère les travaux au fur et à mesure

async function afficherProjets() {

    let liste = await worksApi()
    for (let list of liste) {
        const sectionGallery = document.querySelector (".gallery");
        const projet = document.createElement ("figure");
        const imageProjet = document.createElement ("img");
        imageProjet.src = list.imageUrl;
        const nomProjet = document.createElement ("p");
        nomProjet.innerText = list.title;

// On rattache les elts au DOM pour l'affichage sur la page

        sectionGallery.appendChild(projet);
        projet.appendChild(imageProjet);
        projet.appendChild(nomProjet);
    }

};

afficherProjets();



/// Fonctions des boutons de tri

function triTous () {
    let btnTriTous = document.getElementById ("btn1");

    btnTriTous.addEventListener ("click", async () => {
        document.querySelector(".gallery").innerHTML="";
        let liste = await worksApi();
        
        for (let list of liste) {
            const sectionCategories = document.querySelector (".gallery");
            const projet = document.createElement ("figure");
            const imageProjet = document.createElement ("img");
            imageProjet.src = list.imageUrl;
            const nomProjet = document.createElement ("p");
            nomProjet.innerText = list.title;

            sectionCategories.appendChild(projet);
            projet.appendChild(imageProjet);
            projet.appendChild(nomProjet);
        }
    })
}

triTous();


function triObjet () {

    let btnTriObjet = document.getElementById ("btn2");

    btnTriObjet.addEventListener ("click", async () => {
        document.querySelector(".gallery").innerHTML="";
        let liste = await worksApi();
        let objets = liste.filter((list) => list.categoryId === 1);
        
        for (let list of objets) {
            const sectionCategories = document.querySelector (".gallery");
            const projet = document.createElement ("figure");
            const imageProjet = document.createElement ("img");
            imageProjet.src = list.imageUrl;
            const nomProjet = document.createElement ("p");
            nomProjet.innerText = list.title;

            sectionCategories.appendChild(projet);
            projet.appendChild(imageProjet);
            projet.appendChild(nomProjet);
        }
    })
}

triObjet();

function triAppartemments () {

    let btnTriAppartemment = document.getElementById ("btn3");

    btnTriAppartemment.addEventListener ("click", async () => {
        document.querySelector(".gallery").innerHTML="";
        let liste = await worksApi();
        let objets = liste.filter((list) => list.categoryId === 2);
        
        for (let list of objets) {
            const sectionCategories = document.querySelector (".gallery");
            const projet = document.createElement ("figure");
            const imageProjet = document.createElement ("img");
            imageProjet.src = list.imageUrl;
            const nomProjet = document.createElement ("p");
            nomProjet.innerText = list.title;

            sectionCategories.appendChild(projet);
            projet.appendChild(imageProjet);
            projet.appendChild(nomProjet);
        }
    })
}

triAppartemments();

function triHotelRestau () {

    let btnTriHotelRestau = document.getElementById ("btn4");

    btnTriHotelRestau.addEventListener ("click", async () => {
        document.querySelector(".gallery").innerHTML="";
        let liste = await worksApi();
        let objets = liste.filter((list) => list.categoryId === 3);
        
        for (let list of objets) {
            const sectionCategories = document.querySelector (".gallery");
            const projet = document.createElement ("figure");
            const imageProjet = document.createElement ("img");
            imageProjet.src = list.imageUrl;
            const nomProjet = document.createElement ("p");
            nomProjet.innerText = list.title;

            sectionCategories.appendChild(projet);
            projet.appendChild(imageProjet);
            projet.appendChild(nomProjet);
        }
    })
}

triHotelRestau();

// Récupération des informations entrées dans le formulaire de logIn

