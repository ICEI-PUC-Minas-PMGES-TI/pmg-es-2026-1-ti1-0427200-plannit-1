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