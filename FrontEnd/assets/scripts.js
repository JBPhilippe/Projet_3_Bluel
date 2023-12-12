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
    json.unshift({id:4, name:"Tous"}); //unshift est l'inverse de push, on ajoute l'objet au début de l'array
    return json
};


// L'idee est de parcourir l'array de catApi et de générer les boutons filtres => fonctionne pas à VOIR

async function afficherFiltres() {
    let liste = await catApi()
    for (let list of liste) {
        const barreFiltre = document.querySelector (".categories")
        const btnFiltre = document.createElement ("button")
        btnFiltre.innerText = list.name;
        //on attribue son id à chaque bouton dans l'html => IMPORTANT pour target le bouton
        btnFiltre.id = list.id; 
        barreFiltre.appendChild(btnFiltre);
        
    }
};

afficherFiltres()


//On parcourt la liste des travaux récupérés et on génère les travaux au fur et à mesure

async function afficherProjets() {

    let liste = await worksApi()
    for (let list of liste) {
        const sectionGallery = document.querySelector (".gallery")
        const projet = document.createElement ("figure")
        const imageProjet = document.createElement ("img")
        imageProjet.src = list.imageUrl
        const nomProjet = document.createElement ("p")
        nomProjet.innerText = list.title

// On rattache les elts au DOM pour l'affichage sur la page

        sectionGallery.appendChild(projet)
        projet.appendChild(imageProjet)
        projet.appendChild(nomProjet)
    }
};

afficherProjets();



/// Fonction de tri

async function TriCategorie () {

   let categorie = await catApi()

   for  (let i=0; i <= categorie.length ; i++) {
    
    //On boucle sur tous les indices !== de la catégorie "Tous"
    if (i !== 4) {  
        let btnTri = document.getElementById (categorie[i].id)
        btnTri.addEventListener ("click", async () =>{
    //On vide la page avant d'afficher la liste triée
        document.querySelector(".gallery").innerHTML=""; 
    //On récupère les travaux et on tri l'array pour n'avoir que les travaux correspondant à l'id de leur catégorie
        let travaux = await worksApi()
        let listeTri = travaux.filter((list) => list.categoryId === i);
        console.table(listeTri)

    // On boucle et on crée pour chaque bouton la liste des travaux à afficher
    for (let list of listeTri) {
        const sectionGallery = document.querySelector (".gallery")
        const projet = document.createElement ("figure")
        const imageProjet = document.createElement ("img")
        imageProjet.src = list.imageUrl
        const nomProjet = document.createElement ("p")
        nomProjet.innerText = list.title
    // On rattache les elts au DOM pour l'affichage sur la page
        sectionGallery.appendChild(projet)
        projet.appendChild(imageProjet)
        projet.appendChild(nomProjet)
    }
    
    })
    }

    //on gère le bouton de tri "Tous" à part
    else {
    //Vérification liste des travaux bien récupérée 
        let liste = await worksApi() 
    // Via l'attribution d'id vue dans fct catApi() on sait que la cat "Tous" a l'id 4
        let btnTri = document.getElementById ("4") 
        btnTri.addEventListener ("click", async () =>{
        document.querySelector(".gallery").innerHTML="";
    //on exécute simplement l'affichage de tous les projets
        afficherProjets()
        console.table(liste)
    })
    }
    }};

TriCategorie();