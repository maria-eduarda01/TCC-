const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// 1. Configuração da conexão (mesmos dados do HeidiSQL)
const conexao = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'senai2026',       
    database: 'biostore',
    port: 3306
});

// 2. Testando a conexão com o banco
conexao.connect(function (erro) {
    if (erro) {
        console.log('Erro ao conectar no banco:', erro);
        return;
    }
    console.log('Conectado ao banco BioStore com sucesso!');
});

// 3. Rota simples para buscar os produtos do banco
app.get('/produtos', function (req, res) {
    conexao.query('SELECT * FROM produtos', function (erro, resultados) {
        if (erro) {
            res.status(500).json({ erro: 'Erro ao buscar produtos' });
            return;
        }
        res.json(resultados);
    });
});

// 4. Ligando o servidor na porta 3000
app.listen(3000, function () {
    console.log('Servidor rodando em http://localhost:3000');
});