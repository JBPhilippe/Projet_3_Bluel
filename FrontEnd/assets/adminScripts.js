

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
        delBtn.classList.add("delBtn")
        delBtn.id = imageProjet.id
        let deleteIcon = document.createElement("i")
        deleteIcon.setAttribute("class" , "fa-regular fa-trash-can")
        document.querySelectorAll("delBtn")
        delBtn.addEventListener("click" , deleteWork)

        function deleteWork () {
            let id = delBtn.id
    
            const fetchDelHeader = new Headers()
    
            fetchDelHeader.append("Authorization" , "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTcwNDIwNDg1NywiZXhwIjoxNzA0MjkxMjU3fQ.LR2WrIX3GAvwIFi7ukiuz-R74M2vAmegQ1MyhVRvp48")
            fetchDelHeader.append("accept" , "*/*")
            
            
            fetch (`http://localhost:5678/api/works/${id}` , {
    
                headers : fetchDelHeader,
                method: "DELETE",
             })
             
            document.querySelector (".modaleSupprBody").innerHTML = ""
            afficherProjetsModale()
            console.log("j'ai supprimé le travail n°" + id)
            }

        

        modaleSupprBody.appendChild(projet)
        projet.appendChild(imageProjet)
        projet.appendChild(delBtn)
        delBtn.appendChild(deleteIcon)
    }
    }

    






function openSupprModal() {

    document.querySelector (".overlayModale").style.display = "block"
    document.querySelector (".modaleSupprProjet").classList.add("modaleSupprOpen")
    document.querySelector (".modaleSupprBody").innerHTML = ""
    afficherProjetsModale()
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
    document.querySelector (".gallery").innerHTML=""
    afficherProjetsModale()
    afficherTousProjet()

  
}

function retourModaleSuppr() {
    document.querySelector (".modaleAddProjet").classList.remove("modaleAddOpen")
    document.querySelector (".modaleSupprBody").innerHTML = ""
    afficherProjetsModale()
}



    let addForm = document.getElementById ("addForm")
    let addSubmit = document.getElementById ("addSubmit")

    addSubmit.addEventListener('click', async event => {
    event.preventDefault();

    const data = new FormData(addForm);

    const fetchPostHeader = new Headers()
    // Pb récupération token du localStorage à voir, mais fonctionne ac token en dur
    fetchPostHeader.append("Authorization" , "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTcwNDIwNDg1NywiZXhwIjoxNzA0MjkxMjU3fQ.LR2WrIX3GAvwIFi7ukiuz-R74M2vAmegQ1MyhVRvp48")
    fetchPostHeader.append("accept" , "application/json")

    console.log(Array.from(data));

    try { 
    const res = await fetch('http://localhost:5678/api/works',
          {
            headers: fetchPostHeader,
            method: 'POST',
            body: data,
          },
        );
    
        const resData = await res.json();
    
        console.log(resData);
      

    } catch (err) {
        console.log(err.message);
      }
})







  

async function afficherProjet() {
    let liste = await worksApi()
    console.table(liste)
}

afficherProjet()



