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
        .addEventListener("click", async () => {

            const celular =
                document.getElementById("celular").value;

            if (!celular.trim()) {

                alert("Informe um número de celular.");

                return;
            }

            const usr = JSON.parse(sessionStorage.getItem("usuarioCorrente"));
            const nomePaciente = usr ? usr.nome : (agendamento ? agendamento.paciente : "Estudante");
            const dataConsulta = agendamento ? agendamento.data : "15/06/2026";
            const horarioConsulta = agendamento ? agendamento.horario : "08:00";

            await fetch("http://localhost:3000/solicitacoes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nome: nomePaciente,
                    motivo: `Solicitação de consulta (${dataConsulta} às ${horarioConsulta})`,
                    data: dataConsulta,
                    horario: horarioConsulta,
                    psicologoId: 1,
                    psicologo: "Dr. João Silva",
                    status: "Pendente"
                })
            });

            alert("Consulta solicitada com sucesso! Ficando pendente para aceitação do psicólogo.");

            localStorage.removeItem("agendamento");

            window.location.href = "(Gabriel)contato_psicologo.html";
        });
});