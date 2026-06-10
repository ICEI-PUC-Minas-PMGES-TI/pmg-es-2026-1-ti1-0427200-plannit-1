
const headers = document.querySelectorAll('.filtro-header');

headers.forEach(header => {

    header.addEventListener('click', () => {

        const opcoes = header.nextElementSibling;
        const toggle = header.querySelector('.toggle');

        opcoes.classList.toggle('active');

        if(opcoes.classList.contains('active')){
            toggle.textContent = '-';
        }else{
            toggle.textContent = '+';
        }

    });

});



const checks = document.querySelectorAll('.filtro-check');
const psicologos = document.querySelectorAll('.psicologo');

checks.forEach(check => {

    check.addEventListener('change', () => {

        psicologos.forEach(card => {

            card.style.display = 'none';

        });

        const selecionados = [];

        document.querySelectorAll('.filtro-check:checked').forEach(item => {

            selecionados.push(item.value);

        });

        if(selecionados.length === 0){

            psicologos.forEach(card => {

                card.style.display = 'block';

            });

        }else{

            psicologos.forEach(card => {

                const tipo = card.getAttribute('data-tipo');
                const especialidade = card.getAttribute('data-especialidade');
                const avaliacao = card.getAttribute('data-avaliacao');
                const preco = card.getAttribute('data-preco');
                const disponibilidade = card.getAttribute('data-disponibilidade');

                if(
                    selecionados.includes(tipo) ||
                    selecionados.includes(especialidade) ||
                    selecionados.includes(avaliacao) ||
                    selecionados.includes(preco) ||
                    selecionados.includes(disponibilidade)
                ){

                    card.style.display = 'block';

                }

            });

        }

    });

});



const visitarBtns = document.querySelectorAll('.visitar');

const paginaLista = document.getElementById('pagina-lista');
const perfilPage = document.getElementById('perfil-page');

visitarBtns.forEach(btn => {

    btn.addEventListener('click', () => {

        paginaLista.style.display = 'none';

        perfilPage.classList.add('active');

    });

});

/* PESQUISA POR NOME */

const campoPesquisa = document.getElementById('pesquisa');

campoPesquisa.addEventListener('keyup', () => {

    const texto = campoPesquisa.value.toLowerCase();

    psicologos.forEach(card => {

        const nome = card.textContent.toLowerCase();

        if(nome.includes(texto)){

            card.style.display = 'block';

        }else{

            card.style.display = 'none';

        }

    });

});

/* ABRIR AGENDAMENTO */

const btnAgendar = document.querySelector('.btn-laranja');

const agendamentoPage = document.getElementById('agendamento-page');

btnAgendar.addEventListener('click', () => {

    perfilPage.style.display = 'none';

    agendamentoPage.classList.add('active');

});

/* BOTÃO VOLTAR */

function voltarPagina(){

    if(agendamentoPage.classList.contains('active')){

        agendamentoPage.classList.remove('active');

        perfilPage.style.display = 'block';

    }else if(perfilPage.classList.contains('active')){

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

    if(mesAtual > 11){
        mesAtual = 0;
    }

    mesTexto.textContent = meses[mesAtual];

});

document.getElementById('mes-anterior')
.addEventListener('click', () => {

    mesAtual--;

    if(mesAtual < 0){
        mesAtual = 11;
    }

    mesTexto.textContent = meses[mesAtual];

});

const horarios = document.querySelectorAll(".hora");

horarios.forEach(horario => {

    horario.addEventListener("click", () => {

        const agendamento = {
            paciente: "Gabriel Damazio",
            psicologo: "Dr. João Silva",
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



