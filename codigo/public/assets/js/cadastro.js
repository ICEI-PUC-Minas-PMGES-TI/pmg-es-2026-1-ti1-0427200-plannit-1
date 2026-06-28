document.getElementById("formCadastro").addEventListener("submit", function(event) {

    event.preventDefault();

    const nome = document.getElementById("nome").value;
    const idade = document.getElementById("idade").value;
    const perfil = document.getElementById("perfil").value;
    const email = document.getElementById("email").value;
    const confirmarEmail = document.getElementById("confirmar-email").value;
    const senha = document.getElementById("senha").value;
    const confirmarSenha = document.getElementById("confirmar-senha").value;

    if(email !== confirmarEmail){
        alert("Os e-mails não coincidem.");
        return;
    }

    if(senha !== confirmarSenha){
        alert("As senhas não coincidem.");
        return;
    }

    const hoje = new Date();

    const mes = String(hoje.getMonth() + 1).padStart(2, "0");
    const ano = hoje.getFullYear();

    const usuario = {
        nome,
        idade,
        perfil,
        email,
        senha,
        dataCadastro: `${mes}/${ano}`
    };

    localStorage.setItem("usuario", JSON.stringify(usuario));

    localStorage.setItem("logado", "true");

    alert("Conta criada com sucesso!");

    window.location.href = "index.html";
});