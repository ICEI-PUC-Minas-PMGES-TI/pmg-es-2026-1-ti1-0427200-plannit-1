const apiSolicitacoes = 'http://localhost:3000/solicitacoes';
const apiAgenda = 'http://localhost:3000/agenda';

const menuItems = document.querySelectorAll('.menu-item');
const pages = document.querySelectorAll('.page');

menuItems.forEach(item => {

  item.addEventListener('click', () => {

    const page = item.getAttribute('data-page');

    pages.forEach(section => {
      section.classList.remove('active-page');
    });

    menuItems.forEach(menu => {
      menu.classList.remove('active');
    });

    document.getElementById(page).classList.add('active-page');

    item.classList.add('active');

  });

});

async function carregarSolicitacoes() {

  const resposta = await fetch(apiSolicitacoes);

  const dados = await resposta.json();

  const lista = document.getElementById('listaSolicitacoes');

  const contador = document.getElementById('contadorSolicitacoes');

  lista.innerHTML = '';

  contador.innerText = dados.length;

  dados.forEach(solicitacao => {

    lista.innerHTML += `

      <div class="card">

        <p>
          <strong>${solicitacao.nome}</strong>
        </p>

        <p>
          Motivo: ${solicitacao.motivo}
        </p>

        <div class="buttons">

          <button 
            class="btn-aceitar"
            data-id="${solicitacao.id}"
            data-nome="${solicitacao.nome}"
          >
            Aceitar
          </button>

          <button 
            class="btn-recusar"
            data-id="${solicitacao.id}"
          >
            Recusar
          </button>

        </div>

      </div>

    `;

  });

  const aceitarBtns = document.querySelectorAll('.btn-aceitar');

  aceitarBtns.forEach(btn => {

    btn.addEventListener('click', () => {

      const id = btn.getAttribute('data-id');

      const nome = btn.getAttribute('data-nome');

      aceitarSolicitacao(id, nome);

    });

  });

  const recusarBtns = document.querySelectorAll('.btn-recusar');

  recusarBtns.forEach(btn => {

    btn.addEventListener('click', () => {

      const id = btn.getAttribute('data-id');

      removerSolicitacao(id);

    });

  });

}

async function carregarAgenda() {

  const resposta = await fetch(apiAgenda);

  const dados = await resposta.json();

  const lista = document.getElementById('listaAgenda');

  const contador = document.getElementById('contadorAgenda');

  lista.innerHTML = '';

  contador.innerText = dados.length;

  dados.forEach(item => {

    lista.innerHTML += `

      <div class="card">

        <p>
          <strong>${item.nome}</strong>
        </p>

        <p>
          Horário: ${item.horario}
        </p>

      </div>

    `;

  });

}

async function criarSolicitacao() {

  const nome = document.getElementById('nomeInput').value;

  const motivo = document.getElementById('motivoInput').value;

  if(nome === '' || motivo === '') {

    alert('Preencha todos os campos');

    return;

  }

  await fetch(apiSolicitacoes, {

    method: 'POST',

    headers: {
      'Content-Type': 'application/json'
    },

    body: JSON.stringify({

      nome: nome,
      motivo: motivo

    })

  });

  document.getElementById('nomeInput').value = '';

  document.getElementById('motivoInput').value = '';

  fecharModal();

  carregarSolicitacoes();

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

  carregarSolicitacoes();

  carregarAgenda();

}

async function removerSolicitacao(id) {

  await fetch(`${apiSolicitacoes}/${id}`, {

    method: 'DELETE'

  });

  carregarSolicitacoes();

}

const modal = document.getElementById('modal');

document.getElementById('abrirModal')
.addEventListener('click', () => {

  modal.style.display = 'flex';

});

function fecharModal() {

  modal.style.display = 'none';

}

window.addEventListener('click', (e) => {

  if(e.target === modal) {

    fecharModal();

  }

});

document.getElementById('salvarSolicitacao')
.addEventListener('click', criarSolicitacao);

carregarSolicitacoes();

carregarAgenda();