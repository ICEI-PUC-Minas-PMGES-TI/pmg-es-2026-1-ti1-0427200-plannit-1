document.addEventListener("DOMContentLoaded", function () {
    const isSubdir = window.location.pathname.includes("/modulos/") || window.location.pathname.includes("\\modulos\\");

    const rootPath = isSubdir ? "../../" : "./";
    const loginPath = isSubdir ? "login.html" : "./modulos/login/login.html";
    const configPath = isSubdir ? "../../(Antonio)configuracoes.html" : "./(Antonio)configuracoes.html";

    const userLogado = JSON.parse(sessionStorage.getItem("usuarioCorrente"));

    const pathClean = window.location.pathname.split("?")[0].split("#")[0];
    const currentFile = pathClean.split("/").pop().split("\\").pop() || "index.html";
    const isActive = (file) => currentFile === file ? "active" : "";

    const isPsicologo = userLogado && userLogado.tipo === 'psicologo';
    const linkPsicologos = isPsicologo ? `${rootPath}(Leonardo)psicologo.html` : `${rootPath}(Gabriel)contato_psicologo.html`;
    const activePsicologos = (isActive('(Gabriel)contato_psicologo.html') || isActive('(Leonardo)psicologo.html')) ? 'active' : '';

    let authButtons = `<a href="${loginPath}" class="btn-login-header">Entrar/Logar</a>`;
    if (userLogado) {
        authButtons = `
            <div style="display: flex; gap: 10px; align-items: center;">
                <a href="${configPath}" class="btn-login-header ${isActive('(Antonio)configuracoes.html')}" style="background: #2563eb !important;">Configurações</a>
                <a href="#" id="btnLogoutHeader" class="btn-login-header" style="background: #ef4444 !important; padding: 9px 14px !important;">Sair</a>
            </div>
        `;
    }

    const headerHTML = `
    <style>
        .topbar-plannit {
            background: #1e3a5f;
            color: white;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
            position: sticky;
            top: 0;
            z-index: 1000;
        }
        .barra-info {
            height: 70px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 30px;
            max-width: 1400px;
            margin: 0 auto;
            width: 100%;
            gap: 20px;
        }
        .logo {
            display: flex;
            align-items: center;
            gap: 12px;
            text-decoration: none;
            color: white;
        }
        .logo img {
            height: 40px;
            width: auto;
            object-fit: contain;
        }
        .logo span {
            font-size: 1.5rem;
            font-weight: bold;
            letter-spacing: 0.5px;
        }
        .menu ul {
            display: flex;
            list-style: none;
            gap: 15px;
            align-items: center;
            margin: 0;
        }
        .menu a {
            color: #e2e8f0;
            text-decoration: none;
            font-size: 0.95rem;
            font-weight: 500;
            padding: 8px 14px;
            border-radius: 8px;
            transition: 0.2s;
        }
        .menu a:hover, .menu a.active {
            color: #ffffff;
            background: rgba(255, 255, 255, 0.15);
        }
        .btn-login-header {
            background: #2563eb !important;
            color: white !important;
            font-weight: 600 !important;
            padding: 9px 20px !important;
            border-radius: 8px;
            box-shadow: 0 2px 6px rgba(37, 99, 235, 0.3);
            transition: 0.3s !important;
            display: inline-flex;
            align-items: center;
            gap: 8px;
        }
        .btn-login-header:hover {
            background: #1d4ed8 !important;
            transform: translateY(-2px);
        }
        @media (max-width: 900px) {
            .barra-info { height: auto; flex-direction: column; padding: 15px 20px; gap: 15px; }
            .menu ul { flex-wrap: wrap; justify-content: center; }
        }
    </style>
    <header class="topbar-plannit">
        <div class="barra-info">
            <a href="${rootPath}index.html" class="logo">
                <img src="${rootPath}assets/images/Plannit_logo.png" alt="Logo Plannit" onerror="this.style.display='none'">
                <span>Plannit</span>
            </a>
            <nav class="menu">
                <ul>
                    <li><a href="${rootPath}index.html" class="${isActive('index.html') || isActive('homepage.html') ? 'active' : ''}">Home</a></li>
                    <li><a href="${linkPsicologos}" class="${activePsicologos}">${isPsicologo ? 'Consultas' : 'Psicólogos'}</a></li>
                    <li><a href="${rootPath}(ian)planejador_rotina.html" class="${isActive('(ian)planejador_rotina.html')}">Planejador</a></li>
                    <li><a href="${rootPath}(Antonio)comunidade.html" class="${isActive('(Antonio)comunidade.html')}">Comunidade</a></li>
                    <li><a href="${rootPath}(Antonio)sobre.html" class="${isActive('(Antonio)sobre.html')}">Sobre</a></li>
                    <li id="authContainer">${authButtons}</li>
                </ul>
            </nav>
        </div>
    </header>
    `;

    const oldHeader = document.querySelector("header") || document.getElementById("header-plannit");
    if (oldHeader) {
        oldHeader.outerHTML = headerHTML;
    } else {
        document.body.insertAdjacentHTML("afterbegin", headerHTML);
    }

    const btnLogout = document.getElementById("btnLogoutHeader");
    if (btnLogout) {
        btnLogout.addEventListener("click", function (e) {
            e.preventDefault();
            sessionStorage.removeItem("usuarioCorrente");
            window.location.href = loginPath;
        });
    }
});
