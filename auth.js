document.addEventListener("DOMContentLoaded", () => {
    const formularioLogin = document.querySelector("#formLogin");
    const formularioCadastro = document.querySelector("#formCadastro");

    function mostrarMensagem(elemento, mensagem, erro = false) {
        if (!elemento) return;

        elemento.textContent = mensagem;
        elemento.className = erro
            ? "mensagem erro"
            : "mensagem";
    }

    // LOGIN
    if (formularioLogin) {
        formularioLogin.addEventListener("submit", async (event) => {
            event.preventDefault();

            const mensagem = document.querySelector("#mensagemLogin");
            const botao = formularioLogin.querySelector("button");

            const email = formularioLogin.email.value.trim();
            const senha = formularioLogin.senha.value;

            if (!email || !senha) {
                mostrarMensagem(
                    mensagem,
                    "Preencha o e-mail e a senha.",
                    true
                );
                return;
            }

            botao.disabled = true;

            try {
                const dados = await requisicaoAPI("/auth/login", {
                    method: "POST",
                    body: JSON.stringify({ email, senha })
                });

                // Guardar apenas informações básicas do usuário.
                // Não guardar senha ou token sensível no localStorage.
                const usuario = dados.usuario || dados;

                if (!usuario.id && !usuario.email) {
                    throw new Error(
                        "A API não retornou os dados esperados do usuário."
                    );
                }

                localStorage.setItem(
                    "biostore_usuario",
                    JSON.stringify({
                        id: usuario.id,
                        nome: usuario.nome,
                        email: usuario.email
                    })
                );

                mostrarMensagem(
                    mensagem,
                    "Login realizado! Redirecionando..."
                );

                window.location.href = "produtos.html";
            } catch (erro) {
                mostrarMensagem(mensagem, erro.message, true);
            } finally {
                botao.disabled = false;
            }
        });
    }

    // CADASTRO
    if (formularioCadastro) {
        formularioCadastro.addEventListener("submit", async (event) => {
            event.preventDefault();

            const mensagem = document.querySelector("#mensagemCadastro");
            const botao = formularioCadastro.querySelector("button");

            const nome = formularioCadastro.nome.value.trim();
            const email = formularioCadastro.email.value.trim();
            const senha = formularioCadastro.senha.value;

            if (!nome || !email || !senha) {
                mostrarMensagem(
                    mensagem,
                    "Preencha todos os campos.",
                    true
                );
                return;
            }

            if (senha.length < 6) {
                mostrarMensagem(
                    mensagem,
                    "A senha deve ter pelo menos 6 caracteres.",
                    true
                );
                return;
            }

            botao.disabled = true;

            try {
                await requisicaoAPI("/auth/cadastro", {
                    method: "POST",
                    body: JSON.stringify({ nome, email, senha })
                });

                mostrarMensagem(
                    mensagem,
                    "Cadastro realizado! Agora você pode fazer login."
                );

                formularioCadastro.reset();
            } catch (erro) {
                mostrarMensagem(mensagem, erro.message, true);
            } finally {
                botao.disabled = false;
            }
        });
    }
});