

let accessToken = JSON.parse(localStorage.getItem("token"));

//********************************************************************/

async function worksApi() {
    const url = "http://localhost:5678/api/works"
    const fetcher = await fetch (url)
    const json = await fetcher.json()
    return json 
};

//********************************************************************/

async function afficherTousProjet () {

let liste = await worksApi()
afficherProjets(liste)

}

afficherTousProjet()

// ***************************************************************/


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


//********************************************************************/



// Fonction affreuse, fonctionne mais affreuse //

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
        // Penser a régler le problème de l'incrémentation de l'index (supprimer le travail ET son index à chaque fois par exemple)
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

    


//*************************************************************** */

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
            disableAddFields()

        
})



//****************************************************************//

/********Création div imgPreview pour prévisualiser l'image avant d'upload *********/

let loadFile = function(event) {

let ajoutImage = document.querySelector(".ajoutImageProjet")
let image = document.createElement("img")
image.id = "imgPreview"

ajoutImage.appendChild(image)

let imgPreview = document.getElementById('imgPreview');

//uploadField.onchange = function() {
//    if(this.files[0].size > 2097152){         Voir pour mettre en place une taille maximum
//     alert("File is too big!");
 //      this.value = "";
   // };
imgPreview.src = URL.createObjectURL(event.target.files[0]);
enableAddFields ()
updateSubmitButton()
imgPreview.onload = function() {
URL.revokeObjectURL(imgPreview.src) // free memory
}
};


//********Activation du submit si tous les champs sont remplis ********/





function updateSubmitButton() {

  try {

    let img = document.getElementById('imgPreview').src
    let title = document.getElementById(`title`).value
    let category = document.getElementById(`category`).value

    if (img && title && category !== "") {
        
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

  
