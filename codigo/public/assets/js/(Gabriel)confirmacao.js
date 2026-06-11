document.addEventListener("DOMContentLoaded", () => {

    fetch("http://localhost:3000/agendamentos")
    .then(resposta => resposta.json())
    .then(agendamentos => {

        const ultimoAgendamento =
            agendamentos[agendamentos.length - 1];

        document.getElementById("nomePaciente").textContent =
            "Gabriel Damazio";

        document.getElementById("nomePsicologo").textContent =
            ultimoAgendamento.psicologoNome;

        document.getElementById("dataConsulta").textContent =
            ultimoAgendamento.data;

        document.getElementById("horarioConsulta").textContent =
            ultimoAgendamento.horario;

        document.getElementById("telefone1").textContent =
            ultimoAgendamento.telefoneContato;

        document.getElementById("telefone2").textContent =
            ultimoAgendamento.telefoneContato;
    });
    document
        .getElementById("btnAgendar")
        .addEventListener("click", () => {

            const celular =
                document.getElementById("celular").value;

            if (!celular.trim()) {

                alert("Informe um número de celular.");

                return;
            }

            alert("Consulta agendada com sucesso!");

            localStorage.removeItem("agendamento");

            
            window.location.href = "public/(Gabriel)confirmacao.html";
        });
});