

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

        createEltsAdminMode ()

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

    if (document.getElementById("imgPreview")) {
        let img = document.getElementById("imgPreview")
        img.remove()
        
        document.getElementById("addSubmit").disabled = true

    } else {

    }

    if (document.getElementById("upLoadStatus")) {
        let status = document.getElementById("upLoadStatus")
        status.innerHTML = ""

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
            document.getElementById ("upLoadStatus")
            upLoadStatus.style.color = "green"
            upLoadStatus.textContent = "Projet ajoutés avec succès!"
            
           
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
        document.getElementById("upLoadStatus")
        upLoadStatus.style.color = "red"
        upLoadStatus.textContent =`Please select a file that is ${maxFileSizeInMB}MB or less.`
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




function createEltsAdminMode () {

    let portfolio = document.getElementById("portfolio")
    let h2 = document.createElement ("h2")
    h2.innerHTML = `Mes Projets <button onclick="openSupprModal()" id="btnModifier"><i class="fa-regular fa-pen-to-square" id="iconeModifier"></i> modifier </button>`
    portfolio.appendChild(h2)

    let overlayModale = document.createElement("div")
    overlayModale.classList.add("overlayModale")
    overlayModale.setAttribute ("onclick" , "closeModal()")
    portfolio.appendChild(overlayModale)

    //***Modale de suppression***/

    let modaleSupprProjet = document.createElement("div")
    modaleSupprProjet.classList.add("modaleSupprProjet")
    portfolio.appendChild(modaleSupprProjet)

    let btnModalClose = document.createElement("button")
    btnModalClose.innerHTML = `<i class="fa-solid fa-xmark"></i>`
    btnModalClose.classList.add("btnModalClose")
    btnModalClose.setAttribute("onclick" , "closeModal()")
    modaleSupprProjet.appendChild(btnModalClose)

    let modaleSupprHead = document.createElement("div")
    modaleSupprHead.classList.add("modaleSupprHead")
    modaleSupprProjet.appendChild(modaleSupprHead)

    let h3Del = document.createElement("h3")
    h3Del.textContent ="Galerie Photo"
    modaleSupprHead.appendChild(h3Del)

    let modaleSupprBody = document.createElement("div")
    modaleSupprBody.classList.add("modaleSupprBody")
    modaleSupprProjet.appendChild(modaleSupprBody)

    let modaleSupprFoot = document.createElement("div")
    modaleSupprFoot.classList.add("modaleSupprFoot")
    modaleSupprProjet.appendChild(modaleSupprFoot)

    let btnAjoutPhoto = document.createElement("button")
    btnAjoutPhoto.textContent = "Ajouter une photo"
    btnAjoutPhoto.classList.add("btnAjoutPhoto")
    btnAjoutPhoto.setAttribute("onclick" , "openAddModale()")
    modaleSupprFoot.appendChild(btnAjoutPhoto)

    /***Modale Ajout***/

    let modaleAddProjet = document.createElement("div")
    modaleAddProjet.classList.add("modaleAddProjet")
    portfolio.appendChild(modaleAddProjet)

    let btnModaleClose = document.createElement("button")
    btnModaleClose.innerHTML =`<i class="fa-solid fa-xmark"></i>`
    btnModaleClose.classList.add("btnModalClose")
    btnModaleClose.setAttribute("onclick" , "closeModal()")
    modaleAddProjet.appendChild(btnModalClose)

    let btnRetourModaleSuppr = document.createElement("button")
    btnRetourModaleSuppr.innerHTML =`<i class="fa-solid fa-arrow-left"></i>`
    btnRetourModaleSuppr.classList.add("btnRetourModaleSuppr")
    btnRetourModaleSuppr.setAttribute("onclick" , "retourModaleSuppr()")
    modaleAddProjet.appendChild(btnRetourModaleSuppr)

    let modaleAddHead = document.createElement("div")
    modaleAddHead.classList.add("modaleAddHead")
    modaleAddProjet.appendChild(modaleAddHead)

    let h3Add = document.createElement("h3")
    h3Add.textContent ="Ajout Photo"
    modaleAddHead.appendChild(h3Add)

    let modaleAddBody = document.createElement("div")
    modaleAddBody.classList.add("modaleAddBody")
    modaleAddProjet.appendChild(modaleAddBody)

    let form = document.createElement ("form")
    form.setAttribute("action" , "http://localhost:5678/api/works")
    form.setAttribute("method" , "post")
    form.id = "addForm"
    modaleAddBody.appendChild(form)

    let ajoutImageProjet = document.createElement("div")
    ajoutImageProjet.classList.add("ajoutImageProjet")
    form.appendChild(ajoutImageProjet)


     let label = document.createElement("label")
      label.setAttribute("for" , "image")
      ajoutImageProjet.appendChild(label)

      let span = document.createElement("span")
      span.innerHTML =`+ Ajouter photo`
      label.appendChild(span)

    let icone = document.createElement("i")
    icone.className ="fa-regular fa-image"
    ajoutImageProjet.appendChild(icone)

      let inputFile = document.createElement("input")
      inputFile.setAttribute("type" , "file")
      inputFile.setAttribute("name", "image")
      inputFile.setAttribute("id", "image")
      inputFile.setAttribute("onchange" , "imageToUpload(event)")
      inputFile.setAttribute("accept" , ".png, .jpg")
      ajoutImageProjet.appendChild(inputFile)


      let pInput = document.createElement("p")
      pInput.textContent =`jpg, png : 4mo max`
      ajoutImageProjet.appendChild(pInput)

      let titreProjet = document.createElement("div")
      titreProjet.classList.add("titreProjet")
      form.appendChild(titreProjet)

      let labelTitre = document.createElement("label")
      labelTitre.setAttribute("for" , "title")
      labelTitre.textContent = "Titre"
      titreProjet.appendChild(labelTitre)

      let inputTitre = document.createElement("input")
      inputTitre.setAttribute("type" , "text")
      inputTitre.setAttribute("name" , "title")
      inputTitre.setAttribute("id" , "title")
      inputTitre.setAttribute("onkeyup" , "updateSubmitButton()")
      titreProjet.appendChild(inputTitre)


      let categorieProjet = document.createElement("div")
      categorieProjet.classList.add("categorieProjet")
      form.appendChild(categorieProjet)

      let labelCategory = document.createElement("label")
      labelCategory.setAttribute("for" , "category")
      labelCategory.textContent = "Categories"
      categorieProjet.appendChild(labelCategory)

      let inputSelect = document.createElement("select")
      inputSelect.setAttribute("name" , "category")
      inputSelect.setAttribute("id" , "category")
      inputSelect.setAttribute("onclick" , "updateSubmitButton()")
      categorieProjet.appendChild(inputSelect)

      let optionValue0 = document.createElement("option")
      optionValue0.setAttribute("value" , "")
      optionValue0.selected = true
      optionValue0.textContent =""
      inputSelect.appendChild(optionValue0)

      let optionValue1 = document.createElement("option")
      optionValue1.setAttribute("value" , "1")
      optionValue1.textContent ="Objets"
      inputSelect.appendChild(optionValue1)

      let optionValue2 = document.createElement("option")
      optionValue2.setAttribute("value" , "2")
      optionValue2.textContent ="Appartements"
      inputSelect.appendChild(optionValue2)

      let optionValue3 = document.createElement("option")
      optionValue3.setAttribute("value" , "3")
      optionValue3.textContent ="Hôtels & Restaurant"
      inputSelect.appendChild(optionValue3)

      let modaleAddFoot = document.createElement("div")
      modaleAddFoot.classList.add("modaleAddFoot")
      form.appendChild(modaleAddFoot)

      let btnValiderAjout = document.createElement("button")
      btnValiderAjout.classList.add("btnValiderAjout")
      btnValiderAjout.setAttribute("id","addSubmit")
      btnValiderAjout.setAttribute("disabled" , "")
      btnValiderAjout.textContent ="Valider"
      modaleAddFoot.appendChild(btnValiderAjout)

      let upLoadStatus = document.createElement("p")
      upLoadStatus.id = "upLoadStatus"
      modaleAddFoot.appendChild(upLoadStatus)


      let gallery = document.createElement("div")
      gallery.classList.add("gallery")
      portfolio.appendChild(gallery)


}
       
