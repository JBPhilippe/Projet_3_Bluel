

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
        delBtn.innerText="X"
        document.querySelectorAll ("delBtn").onclick = delWorks();

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



    let addForm = document.getElementById ("addForm")
    let addSubmit = document.getElementById ("addSubmit")

    addSubmit.addEventListener('click', async event => {
    event.preventDefault();

    const data = new FormData(addForm);

    const fetchPostHeader = new Headers()
    fetchPostHeader.append("Authorization" , "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTcwMzc3MTA2NiwiZXhwIjoxNzAzODU3NDY2fQ.kl5BpW6H2mmaivWtJhxKSKk8t-MxKz8aYSiHY37Jsf4")
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



