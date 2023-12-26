

let user = localStorage.getItem("token")
console.log(user)


async function worksApi() {
    const url = "http://localhost:5678/api/works"
    const fetcher = await fetch (url)
    const json = await fetcher.json()
    return json 
};

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

    async function afficherProjetsModale() {
   
    let liste = await worksApi()

    for (let list of liste) {
        let modaleSupprBody = document.querySelector(".modaleSupprBody")
        let projet = document.createElement ("projet")
        projet.classList.add("projetModale")
        let imageProjet = document.createElement ("img")
        imageProjet.src = list.imageUrl
        imageProjet.id = list.id
        let delBtn = document.createElement("button")
        delBtn.id = ("delBtn")
        delBtn.innerText="X"

        // Test de suppression, remplacer par method fetch DELETE
        delBtn.addEventListener('click', () => { 
            imageProjet.remove() 
            delBtn.remove()
        }); 
    
        modaleSupprBody.appendChild(projet)
        projet.appendChild(imageProjet)
        projet.appendChild(delBtn)
    }
  
        

    }

        


afficherProjetsModale();

function openSupprModal() {

    document.querySelector (".overlayModale").style.display = "block"
    document.querySelector (".modaleSupprProjet").classList.add("modaleSupprOpen")
    
}

function openAddModale () {
    document.querySelector (".modaleAddProjet").classList.add("modaleAddOpen")
    document.querySelector (".modaleAddBody")
    document.getElementById("errorMessage").innerHTML = "";

    // On supprimme l'HTML de la modale de suppression et on recharge avec la liste actualisée si suppression de projet
    document.querySelector (".modaleSupprBody").innerHTML = ""
    afficherProjetsModale()
}

function closeModal() {
    document.querySelector (".modaleAddProjet").classList.remove("modaleAddOpen")
    document.querySelector (".modaleSupprProjet").classList.remove("modaleSupprOpen")
    document.querySelector (".overlayModale").style.display = "none"

    // cf précédent comm
    
    document.querySelector (".modaleSupprBody").innerHTML = ""
    afficherProjetsModale()
  
}

function retourModaleSuppr() {
    document.querySelector (".modaleAddProjet").classList.remove("modaleAddOpen")
    
}





function AjoutProjet() {
    let addForm = document.getElementById ("addForm")
    let addSubmit = document.getElementById ("addSubmit")
    
    addSubmit.addEventListener("click", (e) => {
        e.preventDefault()
        document.getElementById("errorMessage").innerHTML = "";
        let image = addForm.imageUrl.files[0]
        let titre = addForm.titre.value;
        let catId = addForm.categorie.value;
        console.log("Url de l'image: ", image)
        console.log("Titre du Projet: ", titre);
        console.log("Categorie du projet: ", catId)

        console.log(user)
        fetch("http://localhost:5678/api/works", { // Error 401, sûrement pb dd'authentification, user Id 1 au login et O au post des travaux???
            method: "POST",
            headers: { // Moyen de faire appel au localStorage de userData??? 
                Authorization:`Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTcwMzYwOTc3MSwiZXhwIjoxNzAzNjk2MTcxfQ.cJpu4zDtFkQxQQM0EuLuz11Fh-6yI6cj8X7KvYCwTu8`},
                // accept: "application/json", "Content-type": "multipart/form-data",},
            body: JSON.stringify({image: image, title: titre, category: catId }),
        })

        .then(authResponse => {
            console.log("authResponse: ", authResponse);

            if (authResponse.status === 201) {
                return authResponse.json();

            }

            else if (authResponse.status === 400) {
            errorMessage.innerHTML = "Bad Request";
                
            }

            else if (authResponse.status === 401) {
            errorMessage.innerHTML = "Unauthorized";
                
            } 
            
            else {
            errorMessage.textcontent = `Error: ${authResponse.status}`;
            }

            })

            .catch(error => console.error(error));
    })
}

AjoutProjet()
