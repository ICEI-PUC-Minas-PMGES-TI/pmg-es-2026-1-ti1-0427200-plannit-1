// Funções de Controle dos Modais
const openM = id => document.getElementById(id).style.display = 'flex';
const closeM = () => document.querySelectorAll('.modal').forEach(m => m.style.display = 'none');

// Seleção de Dias do Calendário Strip
const selDia = d => { 
    document.querySelectorAll('.day-card').forEach(x => x.classList.remove('active')); 
    d.classList.add('active'); 
};

// Alternar estado da tarefa (Check/Uncheck)
function tog(card) {
    let checkbox = card.querySelector('input[type="checkbox"]');
    
    // Se o clique veio do card e não do próprio checkbox, inverte o checkbox manualmente
    if (event.target !== checkbox) {
        checkbox.checked = !checkbox.checked;
    }
    
    // Aplica a estilização de completo de acordo com o booleano do checkbox
    if (checkbox.checked) {
        card.classList.add('done');
    } else {
        card.classList.remove('done');
    }
    up();
}

// Atualiza a Barra de Progresso e o Texto dinamicamente
function up() {
    let total = document.querySelectorAll('.task-item input').length;
    let concluidas = document.querySelectorAll('.task-item input:checked').length;
    let porcentagem = total ? Math.round((concluidas / total) * 100) : 0;
    
    document.getElementById('b').style.width = porcentagem + '%';
    document.getElementById('p-txt').innerText = `${porcentagem}% (${concluidas} de ${total})`;
}

// Salva o título customizado do cabeçalho
function savT() { 
    let novoTitulo = document.getElementById('i-t').value;
    if(novoTitulo.trim() !== "") {
        document.getElementById('t').innerText = "📚 " + novoTitulo; 
    }
    closeM(); 
}

// Adiciona uma nova tarefa à lista injetando as classes estruturadas do novo CSS
function addT() {
    let nomeTarefa = document.getElementById('i-n').value; 
    if(!nomeTarefa.trim()) return;
    
    const novaTag = `
        <div class="task-item" onclick="tog(this)">
            <div class="task-icon">📝</div>
            <div class="task-info">
                <p>${nomeTarefa}</p>
                <div class="line"></div>
            </div>
            <div class="task-status">
                <input type="checkbox" onclick="event.stopPropagation(); tog(this.closest('.task-item'))">
            </div>
        </div>
    `;
    
    document.getElementById('lista').insertAdjacentHTML('beforeend', novaTag);
    document.getElementById('i-n').value = ''; 
    closeM(); 
    up();
}

// Executa o cálculo de progresso assim que a página terminar de carregar
window.onload = () => {
    up();
};