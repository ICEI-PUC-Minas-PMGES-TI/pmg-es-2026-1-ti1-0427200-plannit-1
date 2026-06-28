const logado = localStorage.getItem("logado");

if(logado !== "true"){
    window.location.href = "login.html";
}

const usuario = JSON.parse(localStorage.getItem("usuario"));

if(usuario){

    const boasVindas = document.getElementById("boasVindas");

    if(boasVindas){
        boasVindas.textContent = `Olá, ${usuario.nome}!`;
    }

}