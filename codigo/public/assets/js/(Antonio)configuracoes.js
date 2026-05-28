// BOTÃO SALVAR

const btnSalvar = document.querySelector(".btn-salvar");

btnSalvar.addEventListener("click", () => {

    alert("Alterações salvas com sucesso!");

});

// BOTÃO EXCLUIR

const btnExcluir = document.querySelector(".btn-excluir");

btnExcluir.addEventListener("click", () => {

    const confirmar = confirm(
        "Tem certeza que deseja excluir sua conta permanentemente?"
    );

    if (confirmar) {

        alert("Conta excluída com sucesso.");

    }

});

// BOTÕES DOS CARDS

const botoes = document.querySelectorAll(".item-config button");

botoes.forEach((botao) => {

    botao.addEventListener("click", () => {

        alert("Função em desenvolvimento.");

    });

});