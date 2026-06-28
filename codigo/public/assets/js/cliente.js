const API = "http://localhost:3000";
const HORARIOS = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

// === AUTH CHECK ===
const user = JSON.parse(sessionStorage.getItem("usuarioCorrente"));
if (!user) {
    window.location.href = "modulos/login/login.html";
} else if (user.tipo === "psicologo") {
    window.location.href = "(Leonardo)psicologo.html";
}

// === LOGOUT ===
document.getElementById("logoutBtn")?.addEventListener("click", () => {
    sessionStorage.removeItem("usuarioCorrente");
});

// === NAVEGAÇÃO SIDEBAR ===
const menuItems = document.querySelectorAll(".menu-item");
const pages = document.querySelectorAll(".page");

menuItems.forEach(item => {
    item.addEventListener("click", () => {
        const page = item.getAttribute("data-page");
        pages.forEach(s => s.classList.remove("active-page"));
        menuItems.forEach(m => m.classList.remove("active"));
        document.getElementById(page).classList.add("active-page");
        item.classList.add("active");

        if (page === "consultas") carregarConsultas();
        if (page === "perfil") carregarPerfil();
    });
});

// === PSICÓLOGOS GRID ===
let psicologosList = [];

async function carregarPsicologos() {
    try {
        const [resPsi, resUsers] = await Promise.all([
            fetch(`${API}/psicologos`),
            fetch(`${API}/users?tipo=psicologo`)
        ]);
        const psicologos = await resPsi.json();
        const usersPsi = await resUsers.json();

        // Merge nome from users
        psicologosList = psicologos.map(psi => {
            const userPsi = usersPsi.find(u => u.psicologoId == psi.id);
            return { ...psi, nome: userPsi ? userPsi.nome : "Psicólogo" };
        });

        renderizarGrid();
    } catch (err) {
        console.error("Erro ao carregar psicólogos:", err);
    }
}

function renderizarGrid() {
    const grid = document.getElementById("gridPsicologos");
    grid.innerHTML = "";

    if (psicologosList.length === 0) {
        grid.innerHTML = "<p>Nenhum psicólogo cadastrado.</p>";
        return;
    }

    psicologosList.forEach(psi => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
            <h3>${psi.nome}</h3>
            <p><strong>CRP:</strong> ${psi.crp}</p>
            <p><strong>Especialidade:</strong> ${psi.especialidade}</p>
            <p><strong>Cidade:</strong> ${psi.cidade}</p>
            <p><strong>Atendimento:</strong> ${psi.tipoAtendimento}</p>
            <span class="tag">${psi.especialidade}</span>
            <p class="valor">R$ ${psi.valor},00</p>
            <p><small>${psi.duracao} min por sessão</small></p>
            <button class="btn-agendar" data-psi-id="${psi.id}">Agendar Consulta</button>
        `;
        card.querySelector(".btn-agendar").addEventListener("click", () => abrirModal(psi));
        grid.appendChild(card);
    });
}

// === MODAL AGENDAMENTO ===
const modal = document.getElementById("modalAgendamento");
const inputData = document.getElementById("inputData");
const slotsContainer = document.getElementById("slotsContainer");
let psiSelecionado = null;

// Set default date to today
const hoje = new Date().toISOString().split("T")[0];
if (inputData) inputData.value = hoje;

function abrirModal(psi) {
    psiSelecionado = psi;
    document.getElementById("modalTitulo").textContent = `Agendar com ${psi.nome}`;
    document.getElementById("modalPsiInfo").textContent = `${psi.especialidade} · R$ ${psi.valor},00 · ${psi.duracao} min`;
    inputData.value = hoje;
    modal.classList.add("active");
    carregarSlots();
}

document.getElementById("fecharModal")?.addEventListener("click", () => {
    modal.classList.remove("active");
});

inputData?.addEventListener("change", carregarSlots);

async function carregarSlots() {
    if (!psiSelecionado) return;
    const data = inputData.value;
    if (!data) return;

    try {
        const res = await fetch(`${API}/solicitacoes?psicologoId=${psiSelecionado.id}&data=${data}&status=confirmada`);
        const ocupados = await res.json();
        const horariosOcupados = ocupados.map(s => s.horario);

        slotsContainer.innerHTML = "<div class='slots-grid'></div>";
        const grid = slotsContainer.querySelector(".slots-grid");

        HORARIOS.forEach(h => {
            const slot = document.createElement("div");
            slot.className = "slot";
            slot.textContent = h;

            if (horariosOcupados.includes(h)) {
                slot.classList.add("ocupado");
                slot.title = "Horário já ocupado";
            } else {
                slot.addEventListener("click", () => marcarConsulta(data, h));
            }

            grid.appendChild(slot);
        });
    } catch (err) {
        console.error("Erro ao carregar slots:", err);
    }
}

async function marcarConsulta(data, horario) {
    if (!confirm(`Confirmar consulta em ${data} às ${horario} com ${psiSelecionado.nome}?`)) return;

    try {
        const solicitacao = {
            clienteId: user.id,
            clienteNome: user.nome,
            psicologoId: psiSelecionado.id,
            psicologoNome: psiSelecionado.nome,
            data: data,
            horario: horario,
            status: "confirmada"
        };

        const res = await fetch(`${API}/solicitacoes`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(solicitacao)
        });

        if (res.ok) {
            carregarSlots(); // Refresh slots
        } else {
            alert("Erro ao marcar consulta.");
        }
    } catch (err) {
        console.error("Erro ao marcar:", err);
        alert("Erro de comunicação.");
    }
}

// === CONSULTAS ===
let filtroAtual = "confirmada";

// Filter button listeners
document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        filtroAtual = btn.getAttribute("data-filtro");
        carregarConsultas();
    });
});

async function carregarConsultas() {
    const container = document.getElementById("listaConsultas");
    container.innerHTML = "<p>Carregando...</p>";

    try {
        const res = await fetch(`${API}/solicitacoes?clienteId=${user.id}`);
        let consultas = await res.json();

        // Apply filter
        if (filtroAtual !== "todas") {
            consultas = consultas.filter(c => c.status === filtroAtual);
        }

        // Sort by date
        consultas.sort((a, b) => a.data > b.data ? 1 : -1);

        container.innerHTML = "";

        if (consultas.length === 0) {
            const msgs = {
                confirmada: "Nenhuma consulta marcada.",
                cancelada: "Nenhuma consulta cancelada.",
                todas: "Nenhuma consulta no histórico."
            };
            container.innerHTML = `<p>${msgs[filtroAtual]}</p>`;
            return;
        }

        consultas.forEach(c => {
            const div = document.createElement("div");
            div.className = "consulta-card";
            const statusClass = c.status === "confirmada" ? "status-confirmada" : "status-cancelada";
            div.innerHTML = `
                <h3>${c.psicologoNome}</h3>
                <p><strong>Data:</strong> ${c.data}</p>
                <p><strong>Horário:</strong> ${c.horario}</p>
                <p><strong>Status:</strong> <span class="${statusClass}">${c.status.toUpperCase()}</span></p>
                ${c.status === "confirmada" ? `<button class="btn-cancelar" data-id="${c.id}">Cancelar</button>` : ""}
            `;
            const btnCancel = div.querySelector(".btn-cancelar");
            if (btnCancel) {
                btnCancel.addEventListener("click", () => cancelarConsulta(c.id));
            }
            container.appendChild(div);
        });
    } catch (err) {
        console.error("Erro ao carregar consultas:", err);
        container.innerHTML = "<p>Erro ao carregar consultas.</p>";
    }
}

async function cancelarConsulta(id) {
    if (!confirm("Tem certeza que deseja cancelar esta consulta?")) return;

    try {
        await fetch(`${API}/solicitacoes/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: "cancelada" })
        });
        alert("Consulta cancelada.");
        carregarConsultas();
    } catch (err) {
        console.error("Erro ao cancelar:", err);
    }
}

// === PERFIL ===
function carregarPerfil() {
    const card = document.getElementById("perfilCard");
    card.innerHTML = `
        <p><strong>Nome:</strong> ${user.nome}</p>
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Login:</strong> ${user.login}</p>
        <p><strong>Tipo:</strong> Cliente</p>
    `;
}

// === INIT ===
carregarPsicologos();
