const API = "http://localhost:3000";

document.addEventListener("DOMContentLoaded", () => {
    const inputLogin = document.getElementById("loginInput");
    const inputSenha = document.getElementById("senhaInput");
    const btnLogin = document.getElementById("btnLogin");
    const loginForm = document.getElementById("login-form");

    // === LOGIN ===
    const executarLogin = async (e) => {
        if (e) e.preventDefault();
        const login = inputLogin ? inputLogin.value.trim() : "";
        const senha = inputSenha ? inputSenha.value.trim() : "";

        if (!login || !senha) {
            alert("Preencha login e senha.");
            return;
        }

        try {
            const res = await fetch(`${API}/users`);
            const users = await res.json();
            const user = users.find(u => u.login === login && u.senha === senha);

            if (user) {
                sessionStorage.setItem("usuarioCorrente", JSON.stringify(user));
                if (user.tipo === "psicologo") {
                    window.location.href = "../../(Leonardo)psicologo.html";
                } else {
                    window.location.href = "../../(Gabriel)contato_psicologo.html";
                }
            } else {
                alert("Login ou senha incorretos.");
            }
        } catch (err) {
            console.error("Erro no login:", err);
            alert("Erro ao conectar. Verifique se o json-server está rodando.");
        }
    };

    if (btnLogin) btnLogin.addEventListener("click", executarLogin);
    if (loginForm) loginForm.addEventListener("submit", executarLogin);

    // === TOGGLE CAMPOS PSICÓLOGO ===
    const selectTipo = document.getElementById("txt_tipo");
    const camposPsi = document.getElementById("campos_psicologo");
    if (selectTipo && camposPsi) {
        selectTipo.addEventListener("change", () => {
            camposPsi.style.display = selectTipo.value === "psicologo" ? "block" : "none";
        });
    }

    // === REGISTRO ===
    const btnSalvar = document.getElementById("btn_salvar");
    if (btnSalvar) {
        btnSalvar.addEventListener("click", async () => {
            const tipo = selectTipo ? selectTipo.value : "cliente";
            const login = document.getElementById("txt_login")?.value.trim() || "";
            const nome = document.getElementById("txt_nome")?.value.trim() || "";
            const email = document.getElementById("txt_email")?.value.trim() || "";
            const senha = document.getElementById("txt_senha")?.value || "";
            const senha2 = document.getElementById("txt_senha2")?.value || "";

            if (!login || !nome || !email || !senha) {
                alert("Preencha todos os campos obrigatórios.");
                return;
            }
            if (senha !== senha2) {
                alert("As senhas não conferem.");
                return;
            }

            try {
                // Check duplicate login
                const res = await fetch(`${API}/users`);
                const users = await res.json();
                if (users.some(u => u.login === login)) {
                    alert("Este login já existe.");
                    return;
                }

                let psicologoId = null;

                // If psychologist, create profile first
                if (tipo === "psicologo") {
                    const psiData = {
                        crp: document.getElementById("txt_crp")?.value.trim() || "00/00000",
                        especialidade: document.getElementById("txt_especialidade")?.value.trim() || "Geral",
                        cidade: document.getElementById("txt_cidade")?.value.trim() || "Não informada",
                        tipoAtendimento: document.getElementById("txt_tipoAtendimento")?.value || "Online",
                        telefone: document.getElementById("txt_telefone")?.value.trim() || "",
                        valor: Number(document.getElementById("txt_valor")?.value) || 120,
                        duracao: Number(document.getElementById("txt_duracao")?.value) || 50,
                        descricao: document.getElementById("txt_descricao")?.value.trim() || "Psicólogo clínico."
                    };

                    const psiRes = await fetch(`${API}/psicologos`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(psiData)
                    });
                    const psiCriado = await psiRes.json();
                    psicologoId = psiCriado.id;
                }

                // Create user
                const novoUser = {
                    login, senha, nome, email, tipo,
                    ...(psicologoId !== null ? { psicologoId } : {})
                };

                const postRes = await fetch(`${API}/users`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(novoUser)
                });

                if (postRes.ok) {
                    const userCriado = await postRes.json();

                    // Update psicologos.userId
                    if (tipo === "psicologo" && psicologoId !== null) {
                        await fetch(`${API}/psicologos/${psicologoId}`, {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ userId: userCriado.id })
                        });
                    }

                    alert("Usuário registrado com sucesso! Faça login.");

                    // Close modal
                    const modal = bootstrap.Modal.getInstance(document.getElementById("registerModal"));
                    if (modal) modal.hide();
                } else {
                    alert("Erro ao salvar usuário.");
                }
            } catch (err) {
                console.error("Erro no registro:", err);
                alert("Erro de comunicação com o servidor.");
            }
        });
    }
});