const API_URL = "http://localhost:3000/api";

async function requisicaoAPI(endpoint, opcoes = {}) {
    const resposta = await fetch(`${API_URL}${endpoint}`, {
        ...opcoes,
        headers: {
            "Content-Type": "application/json",
            ...opcoes.headers
        }
    });

    const texto = await resposta.text();
    let dados = null;

    if (texto) {
        try {
            dados = JSON.parse(texto);
        } catch {
            dados = { mensagem: texto };
        }
    }

    if (!resposta.ok) {
        throw new Error(
            dados?.mensagem ||
            dados?.message ||
            `Erro na API: ${resposta.status}`
        );
    }

    return dados;
}

function formatarPreco(valor) {
    return Number(valor).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}