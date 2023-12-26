
const loginForm = document.getElementById("loginForm");
const loginButton = document.getElementById("submit");

function validate_login() {
loginButton.addEventListener("click", (e) => {
    e.preventDefault()
    document.getElementById("errorMessage").innerHTML = "";
    let useremail = loginForm.mail.value;
    let userpassword = loginForm.password.value;
    // on oublie pas d'effacer les logs après hein
    console.log("email: ", useremail);
    console.log("Mdp: ", userpassword);
    
    if (!useremail || !userpassword) {
        document.getElementById("errorMessage").innerHTML = "Veuillez remplir tous les champs";
        return}
    
    fetch("http://localhost:5678/api/users/login" , {
            method: "POST",
            headers: {accept: "application/json", "Content-type": "application/json"},
            body: JSON.stringify({email: useremail, password: userpassword}),
        })

        .then(authResponse => {
            console.log("authResponse: ", authResponse);

            if (authResponse.status === 200) {
                return authResponse.json();
                

            }

            else if (authResponse.status === 401) {
            errorMessage.innerHTML = "Erreur dans l'identifiant ou le mot de passe";
                
            }

            else if (authResponse.status === 404) {
            errorMessage.innerHTML = "Erreur dans l'identifiant ou le mot de passe";
                
            } 
            
            else {
            errorMessage.textcontent = `Error: ${authResponse.status}`;
            }

            })

            
            .then(userData => {
                console.log("userData: ", userData);
                if (userData) {
                window.localStorage.setItem("token", JSON.stringify(userData.token));
                window.location= "admin.html";
                
            }
            })
            .catch(error => console.error(error));
        })};



validate_login();
