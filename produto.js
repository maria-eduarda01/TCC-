document.addEventListener("DOMContentLoaded", async () => {
    const lista = document.querySelector("#listaProdutos");
    const mensagem = document.querySelector("#mensagemProdutos");

    if (!lista) return;

    try {
        const dados = await requisicaoAPI("/produtos");

        const produtos = Array.isArray(dados)
            ? dados
            : dados.produtos;

        if (!Array.isArray(produtos)) {
            throw new Error("Formato de produtos inválido na API.");
        }

        if (produtos.length === 0) {
            lista.innerHTML =
                '<p class="vazio">Nenhum produto cadastrado.</p>';
            return;
        }

        lista.replaceChildren();

        produtos.forEach((produto) => {
            const card = document.createElement("article");
            card.className = "produto-card";

            const icone = document.createElement("div");
            icone.className = "produto-icone";
            icone.textContent = "🌿";

            const titulo = document.createElement("h3");
            titulo.textContent = produto.nome || produto.titulo || "Produto";

            const descricao = document.createElement("p");
            descricao.className = "produto-descricao";
            descricao.textContent =
                produto.descricao || produto.categoria || "Produto BioStore";

            const preco = document.createElement("p");
            preco.className = "preco";
            preco.textContent = formatarPreco(produto.preco);

            const botao = document.createElement("button");
            botao.type = "button";
            botao.textContent = "Adicionar ao carrinho";

            botao.addEventListener("click", () => {
                const id = produto.id;

                if (id === undefined || id === null) {
                    alert("Este produto não possui um ID válido.");
                    return;
                }

                const carrinho = JSON.parse(
                    localStorage.getItem("biostore_carrinho") || "[]"
                );

                const existente = carrinho.find(
                    item => String(item.id) === String(id)
                );

                if (existente) {
                    existente.quantidade += 1;
                } else {
                    carrinho.push({
                        id: produto.id,
                        nome: produto.nome || produto.titulo || "Produto",
                        preco: Number(produto.preco),
                        quantidade: 1
                    });
                }

                localStorage.setItem(
                    "biostore_carrinho",
                    JSON.stringify(carrinho)
                );

                alert("Produto adicionado ao carrinho!");
            });

            card.append(icone, titulo, descricao, preco, botao);
            lista.appendChild(card);
        });
    } catch (erro) {
        if (mensagem) {
            mensagem.textContent =
                "Não foi possível carregar os produtos: " + erro.message;
            mensagem.className = "mensagem erro";
        }

        lista.replaceChildren();

        const aviso = document.createElement("p");
        aviso.className = "vazio";
        aviso.textContent =
            "Verifique se o Back-end está ligado e se a rota /api/produtos existe.";

        lista.appendChild(aviso);
    }
});