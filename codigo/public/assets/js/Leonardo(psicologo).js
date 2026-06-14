const apiSolicitacoes = 'http://localhost:3000/solicitacoes';
const apiAgenda = 'http://localhost:3000/agenda';

let paginaAtual = localStorage.getItem("paginaAtual") || "dashboard";

const menuItems = document.querySelectorAll('.menu-item');
const pages = document.querySelectorAll('.page');

menuItems.forEach(item => {

    item.addEventListener('click', () => {

        paginaAtual = item.dataset.page;
        
        localStorage.setItem("paginaAtual", paginaAtual);

        pages.forEach(page => {
            page.classList.remove('active-page');
        });

        menuItems.forEach(menu => {
            menu.classList.remove('active');
        });

        document.getElementById(paginaAtual)
            .classList.add('active-page');

        item.classList.add('active');

    });

});

function manterPaginaAtual() {

    pages.forEach(page => {
        page.classList.remove('active-page');
    });

    menuItems.forEach(menu => {
        menu.classList.remove('active');
    });

    document.getElementById(paginaAtual)
        .classList.add('active-page');

    document
        .querySelector(`[data-page="${paginaAtual}"]`)
        .classList.add('active');

}

async function carregarSolicitacoes() {

    const resposta = await fetch(apiSolicitacoes);
    const dados = await resposta.json();

    const lista = document.getElementById('listaSolicitacoes');
    const contador = document.getElementById('contadorSolicitacoes');

    lista.innerHTML = '';
    contador.innerText = dados.length;

    dados.forEach(item => {

        lista.innerHTML += `

        <div class="card">

            <p><strong>${item.nome}</strong></p>

            <p>Motivo: ${item.motivo}</p>

            <div class="buttons">

                <button
                    class="btn-aceitar"
                    data-id="${item.id}"
                    data-nome="${item.nome}">
                    Aceitar
                </button>

                <button
                    class="btn-recusar"
                    data-id="${item.id}">
                    Recusar
                </button>

            </div>

        </div>

        `;

    });

    document.querySelectorAll('.btn-aceitar')
        .forEach(btn => {

            btn.onclick = () => {

                aceitarSolicitacao(
                    btn.dataset.id,
                    btn.dataset.nome
                );

            };

        });

    document.querySelectorAll('.btn-recusar')
        .forEach(btn => {

            btn.onclick = () => {

                removerSolicitacao(
                    btn.dataset.id
                );

            };

        });

}

async function carregarAgenda() {

    const resposta = await fetch(apiAgenda);
    const dados = await resposta.json();

    const lista = document.getElementById('listaAgenda');
    const contador = document.getElementById('contadorAgenda');

    const filtro = document
        .getElementById('pesquisaAgenda')
        .value
        .toLowerCase();

    lista.innerHTML = '';
    contador.innerText = dados.length;

    dados
        .filter(item =>
            item.nome.toLowerCase().includes(filtro)
        )
        .forEach(item => {

            lista.innerHTML += `

            <div class="card">

                <p>
                    <strong>${item.nome}</strong>
                </p>

                <p>
                    Horário: ${item.horario}
                </p>

                <div class="buttons">

                    <button
                        class="btn-editar"
                        data-id="${item.id}">
                        Editar
                    </button>

                    <button
                        class="btn-excluir"
                        data-id="${item.id}">
                        Excluir
                    </button>

                </div>

            </div>

            `;

        });

    document.querySelectorAll('.btn-editar')
        .forEach(btn => {

            btn.onclick = () => {

                editarHorario(btn.dataset.id);

            };

        });

    document.querySelectorAll('.btn-excluir')
        .forEach(btn => {

            btn.onclick = () => {

                excluirAtendimento(btn.dataset.id);

            };

        });

}

async function criarSolicitacao() {

    const nome =
        document.getElementById('nomeInput').value;

    const motivo =
        document.getElementById('motivoInput').value;

    if (!nome || !motivo) {

        alert('Preencha todos os campos');
        return;

    }

    await fetch(apiSolicitacoes, {

        method: 'POST',

        headers: {
            'Content-Type': 'application/json'
        },

        body: JSON.stringify({
            nome,
            motivo
        })

    });

    document.getElementById('nomeInput').value = '';
    document.getElementById('motivoInput').value = '';

    fecharModal();

    await carregarSolicitacoes();

    manterPaginaAtual();

}

async function aceitarSolicitacao(id, nome) {

    await fetch(apiAgenda, {

        method: 'POST',

        headers: {
            'Content-Type': 'application/json'
        },

        body: JSON.stringify({

            nome: nome,
            horario: 'Horário a definir'

        })

    });

    await fetch(`${apiSolicitacoes}/${id}`, {

        method: 'DELETE'

    });

    await carregarSolicitacoes();
    await carregarAgenda();

    paginaAtual = "agenda";

    manterPaginaAtual();

}

async function removerSolicitacao(id) {

    await fetch(`${apiSolicitacoes}/${id}`, {

        method: 'DELETE'

    });

    await carregarSolicitacoes();

    manterPaginaAtual();

}

async function editarHorario(id) {

    const horario =
        prompt('Digite o novo horário');

    if (!horario) return;

    await fetch(`${apiAgenda}/${id}`, {

        method: 'PATCH',

        headers: {
            'Content-Type': 'application/json'
        },

        body: JSON.stringify({
            horario
        })

    });

    await carregarAgenda();

    manterPaginaAtual();

}

async function excluirAtendimento(id) {

    await fetch(`${apiAgenda}/${id}`, {

        method: 'DELETE'

    });

    await carregarAgenda();

    manterPaginaAtual();

}

const modal = document.getElementById('modal');

document
    .getElementById('abrirModal')
    .onclick = () => {

        modal.style.display = 'flex';

    };

function fecharModal() {

    modal.style.display = 'none';

}

window.onclick = (e) => {

    if (e.target === modal) {

        fecharModal();

    }

};

document
    .getElementById('salvarSolicitacao')
    .onclick = criarSolicitacao;

document
    .getElementById('pesquisaAgenda')
    .addEventListener('input', carregarAgenda);


manterPaginaAtual();
carregarSolicitacoes();
carregarAgenda();