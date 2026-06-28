document.getElementById("formLogin").addEventListener("submit", function(event){

    event.preventDefault();

    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    const usuario = JSON.parse(localStorage.getItem("usuario"));

    if(!usuario){
        alert("Nenhuma conta cadastrada.");
        return;
    }

    if(email === usuario.email && senha === usuario.senha){

        localStorage.setItem("logado", "true");

        window.location.href = "index.html";

    } else {

        alert("E-mail ou senha incorretos.");

    }

});