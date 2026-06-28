let dadosUsuario;

fetch("conta.json")
.then(response => response.json())
.then(dados => {

    dadosUsuario = dados;

    const usuarioStorage =
    JSON.parse(localStorage.getItem("usuario"));

    if(usuarioStorage){

        document.getElementById("nomeUsuario").textContent =
            usuarioStorage.nome;

        document.getElementById("idadeUsuario").textContent =
            usuarioStorage.idade + " anos";

        document.getElementById("membroDesde").textContent =
            "Usuário desde " + usuarioStorage.dataCadastro;

    } else {

        document.getElementById("nomeUsuario").textContent =
            dados.usuario.nome;

        document.getElementById("idadeUsuario").textContent =
            dados.usuario.idade + " anos";

        document.getElementById("membroDesde").textContent =
            "Usuário desde " + dados.usuario.membroDesde;
    }
});

function mostrarConteudo(tipo){

    const area = document.getElementById("areaConteudo");

    let lista = [];

    switch(tipo){

        case "historico":
            lista = dadosUsuario.historicoConteudos;
            titulo = "Histórico de Conteúdos";
            break;

        case "completas":
            lista = dadosUsuario.atividadesCompletas;
            titulo = "Atividades Completas";
            break;

        case "afazer":
            lista = dadosUsuario.atividadesAFazer;
            titulo = "Atividades a Fazer";
            break;

        case "favoritos":
            lista = dadosUsuario.favoritos;
            titulo = "Atividades Favoritas";
            break;

        case "dificuldades":
            lista = dadosUsuario.dificuldades;
            titulo = "Dificuldades";
            break;

        case "psicologos":
            lista = dadosUsuario.psicologos;
            titulo = "Psicólogos Recomendados";
            break;
    }

    let html = `<h3>${titulo}</h3><ul>`;

    lista.forEach(item => {
        html += `<li>${item}</li>`;
    });

    html += "</ul>";

    area.innerHTML = html;
}