document.addEventListener("DOMContentLoaded", () => {

    const agendamento =
        JSON.parse(localStorage.getItem("agendamento"));

    if (agendamento) {

        document.getElementById("nomePaciente").textContent =
            agendamento.paciente;

        document.getElementById("nomePsicologo").textContent =
            agendamento.psicologo;

        document.getElementById("dataConsulta").textContent =
            agendamento.data;

        document.getElementById("horarioConsulta").textContent =
            agendamento.horario;

        document.getElementById("telefone1").textContent =
            agendamento.telefone1;

        document.getElementById("telefone2").textContent =
            agendamento.telefone2;
    }

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