
const usuarioLogado = JSON.parse(sessionStorage.getItem('usuarioCorrente'));
if (!usuarioLogado) {
    window.location.href = 'modulos/login/login.html';
} else if (usuarioLogado.tipo === 'psicologo') {
    window.location.href = '(Leonardo)psicologo.html';
}

const logoutCliente = document.getElementById('logoutCliente');
if (logoutCliente) {
    logoutCliente.addEventListener('click', () => {
        sessionStorage.removeItem('usuarioCorrente');
    });
}

const headers = document.querySelectorAll('.filtro-header');

headers.forEach(header => {

    header.addEventListener('click', () => {

        const opcoes = header.nextElementSibling;
        const toggle = header.querySelector('.toggle');

        opcoes.classList.toggle('active');

        if (opcoes.classList.contains('active')) {
            toggle.textContent = '-';
        } else {
            toggle.textContent = '+';
        }

    });

});



const paginaLista = document.getElementById('pagina-lista');
const perfilPage = document.getElementById('perfil-page');

let listaPsicologosDados = [];

async function carregarPsicologos() {
    try {
        const res = await fetch("http://localhost:3000/psicologos");
        listaPsicologosDados = await res.json();
        filtrarERenderizar();
    } catch (err) {
        console.error("Erro ao carregar psicólogos:", err);
    }
}

function abrirPerfil(psi) {
    if (paginaLista) paginaLista.style.display = 'none';
    if (perfilPage) {
        perfilPage.classList.add('active');
        perfilPage.style.display = 'block';

        const perfilInfo = perfilPage.querySelector('.perfil-info div:nth-child(2)');
        if (perfilInfo) {
            perfilInfo.innerHTML = `
                <p><strong>Nome: ${psi.nome}</strong></p>
                <p class="status">🟢 ${psi.status || 'Online'}</p>
                <p>Psicólogo Clínico - ${psi.cidade || 'Belo Horizonte'}</p>
                <p>✔ CRP Verificado: ${psi.crp || '04/00000'}</p>
            `;
        }
        const avaliacaoDiv = perfilPage.querySelector('.perfil-top > div:nth-child(2)');
        if (avaliacaoDiv) {
            avaliacaoDiv.innerHTML = `⭐ ${psi.avaliacao || 5.0}`;
        }
        const sobreP = perfilPage.querySelector('h4:nth-of-type(1) + p');
        if (sobreP) {
            sobreP.textContent = psi.descricao || 'Especialista em psicologia clínica.';
        }
        const espP = perfilPage.querySelector('h4:nth-of-type(2) + p');
        if (espP) {
            espP.textContent = `[${psi.especialidade || 'Psicologia'}]`;
        }
        const infoP = perfilPage.querySelector('h4:nth-of-type(3) + p');
        if (infoP) {
            infoP.innerHTML = `
                💰 Valor: R$${psi.valor || 120} <br>
                ⏱ Sessão: ${psi.duracao || 50} minutos <br>
                💻 Atendimento ${psi.tipoAtendimento || 'Online'} <br>
                📍 ${psi.cidade || 'Belo Horizonte - MG'}
            `;
        }
    }
    sessionStorage.setItem('psicologoSelecionado', JSON.stringify(psi));
}

function filtrarERenderizar() {
    const container = document.getElementById("lista-psicologos");
    if (!container) return;

    const selecionados = Array.from(document.querySelectorAll('.filtro-check:checked')).map(item => item.value);
    const campoPesquisa = document.getElementById('pesquisa');
    const textoPesquisa = campoPesquisa ? campoPesquisa.value.toLowerCase() : "";

    container.innerHTML = "";

    if (listaPsicologosDados.length === 0) {
        container.innerHTML = "<p style='padding: 20px;'>Nenhum psicólogo encontrado no banco de dados.</p>";
        return;
    }

    listaPsicologosDados.forEach(psi => {
        const tipo = (psi.tipoAtendimento || "online").toLowerCase();
        const especialidadeNorm = (psi.especialidade || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        const avaliacaoStr = Math.floor(psi.avaliacao || 5).toString();

        let precoStr = "medio";
        if (psi.valor <= 80) precoStr = "baixo";
        else if (psi.valor > 150) precoStr = "alto";

        const disponibilidadeStr = (Number(psi.id) % 2 !== 0) ? "hoje" : "semana";

        let passaCheck = false;
        if (selecionados.length === 0) {
            passaCheck = true;
        } else {
            if (
                selecionados.includes(tipo) ||
                selecionados.includes(especialidadeNorm) ||
                selecionados.includes(avaliacaoStr) ||
                selecionados.includes(precoStr) ||
                selecionados.includes(disponibilidadeStr)
            ) {
                passaCheck = true;
            }
        }

        const passaTexto = !textoPesquisa || psi.nome.toLowerCase().includes(textoPesquisa) || (psi.especialidade && psi.especialidade.toLowerCase().includes(textoPesquisa));

        if (passaCheck && passaTexto) {
            const card = document.createElement("div");
            card.className = "card psicologo";
            card.setAttribute("data-tipo", tipo);
            card.setAttribute("data-especialidade", especialidadeNorm);
            card.setAttribute("data-avaliacao", avaliacaoStr);
            card.setAttribute("data-preco", precoStr);
            card.setAttribute("data-disponibilidade", disponibilidadeStr);

            const estrelas = "⭐".repeat(Math.round(psi.avaliacao || 5));

            card.innerHTML = `
                <h3>Perfil de psicólogo</h3>
                <div class="top-card">
                    <div class="foto"></div>
                    <div>
                        <p><strong>Nome: ${psi.nome}</strong></p>
                        <p><small>${psi.cidade || 'Belo Horizonte'}</small></p>
                    </div>
                </div>
                <p><strong>Especialidade:</strong> ${psi.especialidade || 'Geral'}</p>
                <p><strong>Valor:</strong> R$ ${psi.valor || 120} (${psi.tipoAtendimento || 'Online'})</p>
                <p>
                    <strong>Avaliação</strong>
                    <span class="avaliacao">${estrelas}</span>
                </p>
                <button class="btn visitar">Visitar perfil</button>
            `;

            card.querySelector(".visitar").addEventListener("click", () => {
                abrirPerfil(psi);
            });

            container.appendChild(card);
        }
    });
}

document.querySelectorAll('.filtro-check').forEach(check => {
    check.addEventListener('change', filtrarERenderizar);
});

const campoPesquisa = document.getElementById('pesquisa');
if (campoPesquisa) {
    campoPesquisa.addEventListener('keyup', filtrarERenderizar);
}

carregarPsicologos();

/* ABRIR AGENDAMENTO */

const btnAgendar = document.querySelector('.btn-laranja');

const agendamentoPage = document.getElementById('agendamento-page');

btnAgendar.addEventListener('click', () => {

    perfilPage.style.display = 'none';

    agendamentoPage.classList.add('active');

});

/* BOTÃO VOLTAR */

function voltarPagina() {

    if (agendamentoPage.classList.contains('active')) {

        agendamentoPage.classList.remove('active');

        perfilPage.style.display = 'block';

    } else if (perfilPage.classList.contains('active')) {

        perfilPage.classList.remove('active');

        paginaLista.style.display = 'flex';

    }

}

/* TROCAR MESES */

const meses = [
    "Janeiro 2026",
    "Fevereiro 2026",
    "Março 2026",
    "Abril 2026",
    "Maio 2026",
    "Junho 2026",
    "Julho 2026",
    "Agosto 2026",
    "Setembro 2026",
    "Outubro 2026",
    "Novembro 2026",
    "Dezembro 2026"
];

let mesAtual = 5;

const mesTexto = document.getElementById('mes-texto');

document.getElementById('proximo-mes')
    .addEventListener('click', () => {

        mesAtual++;

        if (mesAtual > 11) {
            mesAtual = 0;
        }

        mesTexto.textContent = meses[mesAtual];

    });

document.getElementById('mes-anterior')
    .addEventListener('click', () => {

        mesAtual--;

        if (mesAtual < 0) {
            mesAtual = 11;
        }

        mesTexto.textContent = meses[mesAtual];

    });

const horarios = document.querySelectorAll(".hora");

horarios.forEach(horario => {

    horario.addEventListener("click", () => {

        const usr = JSON.parse(sessionStorage.getItem("usuarioCorrente"));
        const psiSel = JSON.parse(sessionStorage.getItem("psicologoSelecionado")) || { nome: "Dr. João Silva", id: 1 };
        const agendamento = {
            paciente: usr ? usr.nome : "Gabriel Oliveira",
            psicologo: psiSel.nome,
            psicologoId: psiSel.id,
            data: "15/06/2026",
            horario: horario.textContent,
            telefone1: "(31) 3287-9144",
            telefone2: "(31) 98818-7301"
        };

        localStorage.setItem(
            "agendamento",
            JSON.stringify(agendamento)
        );

        window.location.href = "(Gabriel)confirmacao.html";

    });

});



