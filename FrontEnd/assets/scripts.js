//localStorage.clear();

let user = localStorage.getItem("token")
console.log(user, "youyou")

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
    return json
};


// L'idee est de parcourir l'array de catApi et de générer les boutons filtres => fonctionne pas à VOIR

async function afficherTousProjet () {

let liste = await worksApi()
afficherProjets(liste)

}

afficherTousProjet()


function afficherProjets(liste) {

    for (let list of liste) {
        const sectionGallery = document.querySelector (".gallery")
        const projet = document.createElement ("figure")
        const imageProjet = document.createElement ("img")
        imageProjet.src = list.imageUrl
        const nomProjet = document.createElement ("p")
        nomProjet.innerText = list.title

        sectionGallery.appendChild(projet)
        projet.appendChild(imageProjet)
        projet.appendChild(nomProjet)
    }
};


async function afficherFiltresEtTri() {

    let listeTri = await catApi()
    listeTri.unshift({id:0, name:"Tous"})

    for (let list of listeTri) {
        const barreFiltre = document.querySelector (".categories")
        const btnFiltre = document.createElement ("button")
        btnFiltre.innerText = list.name;
        btnFiltre.id = list.id; 
        barreFiltre.appendChild(btnFiltre);
        
    }

    for  (let i=0; i < listeTri.length ; i++) {
    
    if (i !== 0) {  
        let btnTri = document.getElementById (listeTri[i].id)
        btnTri.addEventListener ("click", async () =>{
        document.querySelector(".gallery").innerHTML=""; 
        let travaux = await worksApi()
        let liste = travaux.filter((list) => list.categoryId === i);

        console.table(liste)
        
        afficherProjets(liste)
    })
    }

   
    else {
        let liste = await worksApi()
        let btnTri = document.getElementById ("0") 
        btnTri.addEventListener ("click", async () =>{
        document.querySelector(".gallery").innerHTML="";
    
        afficherProjets(liste)
        console.table(liste)
    })
    }
    }

};

afficherFiltresEtTri()

