// Funções de Controle dos Modais
const openM = id => document.getElementById(id).style.display = 'flex';
const closeM = () => document.querySelectorAll('.modal').forEach(m => m.style.display = 'none');

// Seleção dos Dias da Semana
const selDia = d => { 
    document.querySelectorAll('.dia').forEach(x => x.classList.remove('active')); 
    d.classList.add('active'); 
};

// Gerencia a marcação/desmarcação de tarefas
function tog(c) {
    let i = c.querySelector('input');
    
    // Evita loop caso o clique tenha vindo direto do próprio checkbox
    if (event.target !== i) {
        i.checked = !i.checked;
    }
    
    // Altera a classe visual baseado no estado final do checkbox
    c.querySelector('span').classList.toggle('done', i.checked);
    up();
}

// Atualiza a Barra e o Texto de Progresso
function up() {
    let t = document.querySelectorAll('.card input').length;
    let ok = document.querySelectorAll('.card input:checked').length;
    let p = t ? Math.round((ok / t) * 100) : 0;
    
    document.getElementById('b').style.width = p + '%';
    document.getElementById('p-txt').innerText = `${p}% (${ok} de ${t})`;
}

// Salva o Título do Bloco Superior
function savT() { 
    let valorInput = document.getElementById('i-t').value;
    document.getElementById('t').innerText = "📚 " + valorInput; 
    closeM(); 
}

// Cria uma nova tarefa dinamicamente
function addT() {
    let n = document.getElementById('i-n').value; 
    if (!n.trim()) return; // Ignora se o input estiver vazio
    
    const novaTarefaHTML = `
        <div class="card" onclick="tog(this)">
            <span>📝 ${n}</span>
            <input type="checkbox" onclick="event.stopPropagation(); tog(this.closest('.card'))">
        </div>
    `;
    
    document.getElementById('lista').insertAdjacentHTML('beforeend', novaTarefaHTML);
    document.getElementById('i-n').value = ''; 
    closeM(); 
    up();
}

// Sincroniza o estado de riscado inicial dos cards com os seus checkboxes no carregamento da página
function init() {
    document.querySelectorAll('.card').forEach(c => {
        let i = c.querySelector('input');
        c.querySelector('span').classList.toggle('done', i.checked);
    });
    up();
}

// Executa a inicialização quando o DOM estiver pronto
window.onload = init;