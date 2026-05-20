// BOTÃO DE NOVO POST

const btnPost = document.getElementById("btnPost");

btnPost.addEventListener("click", () => {
    alert("Área de criação de posts será adicionada futuramente.");
});

// EXEMPLO DE LEITURA DO JSON

fetch("posts.json")
    .then(response => response.json())
    .then(data => {
        console.log("Posts carregados:", data);
    })
    .catch(error => {
        console.log("Erro ao carregar JSON:", error);
    });