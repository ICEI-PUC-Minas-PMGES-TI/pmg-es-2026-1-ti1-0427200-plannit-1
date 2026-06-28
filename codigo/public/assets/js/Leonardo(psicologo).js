const API = "http://localhost:3000";
const HORARIOS = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

// === AUTH CHECK ===
const user = JSON.parse(sessionStorage.getItem("usuarioCorrente"));
if (!user) {
  window.location.href = "modulos/login/login.html";
} else if (user.tipo !== "psicologo") {
  window.location.href = "(Gabriel)contato_psicologo.html";
}

const psicologoId = user.psicologoId;

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
    if (page === "agenda") carregarAgenda();
    if (page === "perfil") carregarPerfil();
  });
});

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
    const res = await fetch(`${API}/solicitacoes?psicologoId=${psicologoId}`);
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
      div.className = "card";
      div.style.marginBottom = "15px";
      const statusClass = c.status === "confirmada" ? "status-confirmada" : "status-cancelada";
      div.innerHTML = `
                <h3 style="font-size:1.1rem">${c.clienteNome}</h3>
                <p><strong>Data:</strong> ${c.data}</p>
                <p><strong>Horário:</strong> ${c.horario}</p>
                <p><strong>Status:</strong> <span class="${statusClass}">${c.status.toUpperCase()}</span></p>
                ${c.status === "confirmada" ? `<div class="buttons"><button class="btn-recusar" data-id="${c.id}">Cancelar</button></div>` : ""}
            `;
      const btnCancel = div.querySelector(".btn-recusar");
      if (btnCancel) {
        btnCancel.addEventListener("click", () => cancelarConsulta(c.id));
      }
      container.appendChild(div);
    });
  } catch (err) {
    console.error("Erro:", err);
    container.innerHTML = "<p>Erro ao carregar consultas.</p>";
  }
}

async function cancelarConsulta(id) {
  if (!confirm("Cancelar esta consulta?")) return;

  try {
    await fetch(`${API}/solicitacoes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "cancelada" })
    });
    carregarConsultas();
  } catch (err) {
    console.error("Erro ao cancelar:", err);
  }
}

// === AGENDA ===
const agendaData = document.getElementById("agendaData");
const hoje = new Date().toISOString().split("T")[0];
if (agendaData) agendaData.value = hoje;

agendaData?.addEventListener("change", carregarAgenda);

async function carregarAgenda() {
  const container = document.getElementById("listaAgenda");
  const data = agendaData ? agendaData.value : hoje;
  container.innerHTML = "<p>Carregando...</p>";

  try {
    const res = await fetch(`${API}/solicitacoes?psicologoId=${psicologoId}&data=${data}&status=confirmada`);
    const confirmadas = await res.json();
    const horariosOcupados = {};
    confirmadas.forEach(c => {
      horariosOcupados[c.horario] = c;
    });

    container.innerHTML = "";

    HORARIOS.forEach(h => {
      const div = document.createElement("div");
      div.className = "card";
      div.style.marginBottom = "10px";

      if (horariosOcupados[h]) {
        const c = horariosOcupados[h];
        div.innerHTML = `
                    <p><strong>${h}</strong> — <span style="color:#2563eb">${c.clienteNome}</span></p>
                    <div class="buttons">
                        <button class="btn-recusar" data-id="${c.id}">Cancelar</button>
                    </div>
                `;
        div.querySelector(".btn-recusar").addEventListener("click", async () => {
          await cancelarConsulta(c.id);
          carregarAgenda();
        });
      } else {
        div.innerHTML = `<p><strong>${h}</strong> — <span style="color:#16a34a">Livre</span></p>`;
        div.style.opacity = "0.6";
      }

      container.appendChild(div);
    });
  } catch (err) {
    console.error("Erro:", err);
    container.innerHTML = "<p>Erro ao carregar agenda.</p>";
  }
}

// === PERFIL ===
async function carregarPerfil() {
  const card = document.getElementById("perfilCard");
  card.innerHTML = "<p>Carregando...</p>";

  try {
    const res = await fetch(`${API}/psicologos/${psicologoId}`);
    const psi = await res.json();

    card.innerHTML = `
            <p><strong>Nome:</strong> ${user.nome}</p>
            <p><strong>CRP:</strong> ${psi.crp}</p>
            <p><strong>Especialidade:</strong> ${psi.especialidade}</p>
            <p><strong>Tipo de Atendimento:</strong> ${psi.tipoAtendimento}</p>
            <p><strong>Cidade:</strong> ${psi.cidade}</p>
            <p><strong>Telefone:</strong> ${psi.telefone}</p>
            <p><strong>Valor:</strong> R$ ${psi.valor},00</p>
            <p><strong>Duração:</strong> ${psi.duracao} min</p>
            <p><strong>Descrição:</strong> ${psi.descricao}</p>
        `;
  } catch (err) {
    console.error("Erro:", err);
    card.innerHTML = "<p>Erro ao carregar perfil.</p>";
  }
}

// === INIT ===
carregarConsultas();