

function adminMode() {

    let token = localStorage.getItem("token")

    if (token) {
        document.getElementById("bandeauEdition").innerHTML=""
        let aside = document.getElementById("bandeauEdition")
        let modeEdition = document.createElement("aside")
        modeEdition.innerHTML = 
        `<p> <i class="fa-regular fa-pen-to-square" id=iconeEdition> </i>Mode Édition</p>`
         aside.appendChild(modeEdition)

        document.getElementById("log").innerHTML = "logout"
        document.getElementById("log").href = "#index.html"
        document.getElementById("log").addEventListener("click" , () => {
            logOut()
        })

        document.getElementById("portfolio").innerHTML=""
        document.getElementById("portfolio").innerHTML =

        `<h2>Mes Projets <button onclick="openSupprModal()" id="btnModifier"><i class="fa-regular fa-pen-to-square" id="iconeModifier"></i> modifier </button></h2>
		

        <div class="overlayModale" onclick="closeModal()"></div>
    
        <div class="modaleSupprProjet">
    
            <button class = btnModalClose onclick="closeModal()"><i class="fa-solid fa-xmark"></i></button>
    
            <div class="modaleSupprHead">
                <h3>Galerie Photo</h>
            </div>
            
            <div class="modaleSupprBody">
            </div>
    
            <div class="modaleSupprFoot">
                <button class="btnAjoutPhoto" onclick="openAddModale()">Ajouter une photo</button>
    
            </div>
    
        </div>
    
        <div class="modaleAddProjet">
    
            <button class = btnModalClose onclick="closeModal()"><i class="fa-solid fa-xmark"></i></button>
            <button class = btnRetourModaleSuppr onclick="retourModaleSuppr()"><i class="fa-solid fa-arrow-left"></i></button>
    
            <div class="modaleAddHead">
                <h3>Ajout Photo</h3>
            </div>
            
            <div class="modaleAddBody">
    
                <form action="http://localhost:5678/api/works" method="post" id = "addForm">
    
                    <div class="ajoutImageProjet">
    
                    <label for="image">
                    <span> + Ajouter photo</span>
                    </label>
    
                    <i class="fa-regular fa-image"></i>
                    <input type="file" name="image" id="image" onchange="loadFile(event)" accept=".png, .jpg">
                    
                    <p>jpg, png : 4mo max</p>
    
                    </div>
    
                    <div class="titreProjet">
                        <label for="title"> Titre </label>
                        <input type="text" name="title" id="title" disabled onkeyup="updateSubmitButton()" />
                    </div>
    
                    <div class="categorieProjet">
    
                        <label for="category">Catégorie</label>
                        <select name="category" id="category" disabled onclick="updateSubmitButton()">
                          <option value=""></option>
                          <option value="1">Objets</option>
                          <option value="2">Appartements</option>
                          <option value="3">Hôtels & Restaurant</option>
                          </select>
    
                    </div>
    
                
            </div>
    
                    <div class="modaleAddFoot">
                    <p id = "uploadStatus"></p>
                    <button class="btnValiderAjout" id ="addSubmit" disabled>Valider</button>
                    </div>
    
                </form>
    
        </div>
        
        <div class="gallery"></div>`
        

     } else {

     }
    }


    adminMode()


function logOut() {
    localStorage.clear()
    window.location= "index.html";
}






// on récupère les travaux sur l'API
async function worksApi() {
    const url = "http://localhost:5678/api/works"
    const fetcher = await fetch (url)
    const json = await fetcher.json()
    return json 
};


async function catApi() {
    const url = "http://localhost:5678/api/categories"
    const fetcher = await fetch(url)
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


async function afficherFiltresEtTri() {

    let token = localStorage.getItem("token")

    if (token) {

    } else {

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

}} 
;

afficherFiltresEtTri()


let accessToken = JSON.parse(localStorage.getItem("token"));

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
        delBtn.classList.add("delBtn")
        delBtn.id = imageProjet.id
        let deleteIcon = document.createElement("i")
        deleteIcon.setAttribute("class", "fa-regular fa-trash-can");
        delBtn.addEventListener("click" , deleteWork)

        // surement moyen de mieux faire, par exemple de la sortir et d'y faire appel, mais pour le moment ça fonctionne
        
        function deleteWork () {
            let id = delBtn.id
            let bearer = "Bearer " + accessToken
            const fetchDelHeader = new Headers()
    
            fetchDelHeader.append("Authorization" , bearer)
            fetchDelHeader.append("accept" , "*/*")
            
            
            fetch (`http://localhost:5678/api/works/${id}` , {
    
                headers : fetchDelHeader,
                method: "DELETE",
             })
                        
            document.querySelector (".modaleSupprBody").innerHTML = ""
            afficherProjetsModale()
            }

        

        modaleSupprBody.appendChild(projet)
        projet.appendChild(imageProjet)
        projet.appendChild(delBtn)
        delBtn.appendChild(deleteIcon)
    }
    }

    // on gère les maj de la liste des travaux en fonction des ajouts/suppression

function openSupprModal() {

    document.querySelector (".overlayModale").style.display = "block"
    document.querySelector (".modaleSupprProjet").classList.add("modaleSupprOpen")
    document.querySelector (".modaleSupprBody").innerHTML = ""
    afficherProjetsModale()
}

function openAddModale () {
    document.querySelector (".modaleAddProjet").classList.add("modaleAddOpen")
    document.querySelector (".modaleAddBody")
    //Pensez à supprimmer la valeur des champs du tableau à l'ouverture de la modale

    // On supprimme l'HTML de la modale de suppression et on recharge avec la liste actualisée si suppression de projet
    document.querySelector (".modaleSupprBody").innerHTML = ""
    afficherProjetsModale()
}

function closeModal() {
    document.querySelector (".modaleAddProjet").classList.remove("modaleAddOpen")
    document.querySelector (".modaleSupprProjet").classList.remove("modaleSupprOpen")
    document.querySelector (".overlayModale").style.display = "none"
    resetForm()

    // cf précédent comm
    
    document.querySelector (".modaleSupprBody").innerHTML = ""
    document.querySelector (".gallery").innerHTML=""
    afficherProjetsModale()
    afficherTousProjet()
}

function retourModaleSuppr() {
    document.querySelector (".modaleAddProjet").classList.remove("modaleAddOpen")
    document.querySelector (".modaleSupprBody").innerHTML = ""
    afficherProjetsModale()
    resetForm()
}

//** On vide le formulaire et on supprime la div de preview d'image */
function resetForm() {

    try {
        let form = document.getElementById("addForm")
        form.reset()
        document.getElementById("uploadStatus").innerHTML=""

    // mettre condition si pas d'image car erreur autrement
    if (document.getElementById("imgPreview")) {
        let img = document.getElementById("imgPreview")
        img.remove()
        
        document.getElementById("addSubmit").disabled = true

    } else {
        //**Rien ne se passe si imgPreview n'est pas généré par un choix d'image ds la fonction loadFile() */
    }

    } catch (error) {
        console.log(error)
    }
    
}




// ******************************************************//
//*******AJOUT DE NOUVEAUX PROJETS********/

    let token = localStorage.getItem("token")
    if (token) {

    let addForm = document.getElementById ("addForm")
    let addSubmit = document.getElementById ("addSubmit")
    let bearer = "Bearer " + accessToken

    addSubmit.addEventListener('click', async event => {
        

    
    event.preventDefault();

    const data = new FormData(addForm);

    const fetchPostHeader = new Headers()
    
    fetchPostHeader.append("Authorization" , bearer)
    fetchPostHeader.append("accept" , "application/json")

    console.log(Array.from(data));

    
        fetch('http://localhost:5678/api/works',
          {
            headers: fetchPostHeader,
            method: 'POST',
            body: data,
          })

          .then(resp => resp.json())
            .then(json => console.log(JSON.stringify(json)))
            resetForm()
            document.getElementById("uploadStatus").innerHTML = "Projet ajouté!"
            disableAddFields()
}
)} else {

}




//****************************************************************//

/********Création div imgPreview pour prévisualiser l'image avant d'upload *********/

let loadFile = function(event) {

let ajoutImage = document.querySelector(".ajoutImageProjet")
let image = document.createElement("img")
image.id = "imgPreview"

ajoutImage.appendChild(image)

let imgPreview = document.getElementById('imgPreview');
   
imgPreview.src = URL.createObjectURL(event.target.files[0]);

enableAddFields ()
};

//******On vérifie la taille de l'image uploadée et on change le texte de status en fonction */

const image = document.getElementById('image');

const statusElement = document.getElementById('uploadStatus');

image.addEventListener('change', event => {
  const file = image.files[0];

  const maxFileSizeInMB = 4;
  const maxFileSizeInKB = 1024 * 1024 * maxFileSizeInMB;

  if (file.size > maxFileSizeInKB) {
    statusElement.innerHTML = `Please select a file that is ${maxFileSizeInMB}MB or less.`;
    disableAddFields()
  } else {
    
  }
});




//********Activation du submit si tous les champs sont remplis ********/


function updateSubmitButton() {

  try {

    let title = document.getElementById(`title`).value
    let category = document.getElementById(`category`).value

    if (title && category !== "") {
        
        document.getElementById("addSubmit").disabled = false

    } else {
        
        document.getElementById("addSubmit").disabled = true
    }
    
    
  } catch (error) {
    console.log(error)
    
  }
     
}

function enableAddFields () {

     document.getElementById("title").disabled = false
     document.getElementById("category").disabled = false
}

function disableAddFields () {
    document.getElementById("title").disabled = true
     document.getElementById("category").disabled = true
}


