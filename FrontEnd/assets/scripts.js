

let accessToken = JSON.parse(localStorage.getItem("token"))


function adminMode() {

    if (accessToken) {
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
                    <input type="file" name="image" id="image" onchange="imageToUpload(event)" accept=".png, .jpg">
                    
                    <p>jpg, png : 4mo max</p>
    
                    </div>
    
                    <div class="titreProjet">
                        <label for="title"> Titre </label>
                        <input type="text" name="title" id="title" onkeyup="updateSubmitButton()" />
                    </div>
    
                    <div class="categorieProjet">
    
                        <label for="category">Catégorie</label>
                        <select name="category" id="category" onclick="updateSubmitButton()">
                          <option value=""></option>
                          <option value="1">Objets</option>
                          <option value="2">Appartements</option>
                          <option value="3">Hôtels & Restaurant</option>
                          </select>
    
                    </div>
    
                
            </div>
    
                    <div class="modaleAddFoot">
                    <p id = "uploadSuccess"></p>
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

window.onbeforeunload = function (event) {
    if (event && event.type == "beforeunload") {
        localStorage.removeItem("token")      
    }
};


//*************************************************************/


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


//**** Affichage des projets dans les diverses instances ****/


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

    if (accessToken) {

    } else {

    let listeTri = await catApi()
    listeTri.unshift({id:0, name:"Tous"})

    for (let list of listeTri) {
        const barreFiltre = document.querySelector (".categories")
        const btnFiltre = document.createElement ("button")
        btnFiltre.innerText = list.name
        btnFiltre.id = list.id
        barreFiltre.appendChild(btnFiltre);
        
    }

    for  (let i=0; i < listeTri.length ; i++) {
    
    if (i !== 0) {  
        let btnTri = document.getElementById (listeTri[i].id)
        btnTri.addEventListener ("click", async () =>{
        document.querySelector(".gallery").innerHTML=""
        let travaux = await worksApi()
        let liste = travaux.filter((list) => list.categoryId === i)

        console.table(liste)
        
        afficherProjets(liste)
    })
    }

   
    else {
        let liste = await worksApi()
        let btnTri = document.getElementById ("0") 
        btnTri.addEventListener ("click", async () =>{
        document.querySelector(".gallery").innerHTML=""

        afficherProjets(liste)
        console.table(liste)
    })
    }
    }

}} 
;

afficherFiltresEtTri()



async function displayProjectsToDelete() {
   
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
            displayProjectsToDelete()
            }

        

        modaleSupprBody.appendChild(projet)
        projet.appendChild(imageProjet)
        projet.appendChild(delBtn)
        delBtn.appendChild(deleteIcon)
    }
    }

    
    
   //***** Gestion Ouverture/fermetures des modales *****//

function openSupprModal() {

    document.querySelector (".overlayModale").style.display = "block"
    document.querySelector (".modaleSupprProjet").classList.add("modaleSupprOpen")
    document.querySelector (".modaleSupprBody").innerHTML = ""
    displayProjectsToDelete()
}

function openAddModale () {
    document.querySelector (".modaleAddProjet").classList.add("modaleAddOpen")
    document.querySelector (".modaleAddBody")
    
    document.querySelector (".modaleSupprBody").innerHTML = ""
    displayProjectsToDelete()
}

function closeModal() {
    document.querySelector (".modaleAddProjet").classList.remove("modaleAddOpen")
    document.querySelector (".modaleSupprProjet").classList.remove("modaleSupprOpen")
    document.querySelector (".overlayModale").style.display = "none"
    resetForm()

    document.querySelector (".modaleSupprBody").innerHTML = ""
    document.querySelector (".gallery").innerHTML=""
    displayProjectsToDelete()
    afficherTousProjet()
}

function retourModaleSuppr() {
    document.querySelector (".modaleAddProjet").classList.remove("modaleAddOpen")
    document.querySelector (".modaleSupprBody").innerHTML = ""
    displayProjectsToDelete()
    resetForm()
}



function resetForm() {

    try {
        let form = document.getElementById("addForm")
        form.reset()
        document.getElementById("uploadStatus").innerHTML=""
        document.getElementById("uploadSuccess").innerHTML=""

    if (document.getElementById("imgPreview")) {
        let img = document.getElementById("imgPreview")
        img.remove()
        
        document.getElementById("addSubmit").disabled = true

    } else {

    }

    } catch (error) {
        console.log(error)
    }
    
}



//*******AJOUT DE NOUVEAUX PROJETS********/


function ajoutProjet() {

    if (accessToken) {

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
            document.getElementById("uploadSuccess").innerHTML = "Projet ajouté!"
            
           
}
)} else {

}
}

ajoutProjet();




//****************************************************************//



let imageToUpload = function(event) {

let ajoutImage = document.querySelector(".ajoutImageProjet")
let image = document.createElement("img")
image.id = "imgPreview"

ajoutImage.appendChild(image)

let imgPreview = document.getElementById('imgPreview')
   
imgPreview.src = URL.createObjectURL(event.target.files[0])
updateSubmitButton()

};



//********Activation du submit ********/


function updateSubmitButton() {

  try {
    let imgPreview = document.getElementById('imgPreview')
    let img = imgPreview.src
    let category = document.getElementById(`category`).value
    let title = document.getElementById(`title`).value
    
    let image = document.getElementById('image')
    let file = image.files[0]
    const maxFileSizeInMB = 4
    const maxFileSizeInKB = 1024 * 1024 * maxFileSizeInMB
    const statusElement = document.getElementById('uploadStatus')
    
    if (file.size > maxFileSizeInKB) {
        statusElement.innerHTML = `Please select a file that is ${maxFileSizeInMB}MB or less.`
        document.getElementById("addSubmit").disabled = true
        

    } else if (title && category && img !== "") {
        
        document.getElementById("addSubmit").disabled = false

    } else {
        document.getElementById("addSubmit").disabled = true
    }   


  } catch (error) {
    console.log(error)
    
  }
}

