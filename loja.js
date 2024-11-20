const express = require('express');
const sql = require('mssql');
const bodyParser = require('body-parser');
const { config } = require('dotenv');
require('dotenv').config();

const app = express();
app.use(express.json());
app.post('/produtos', (req,res) => {
  console.log("resultado da pesquisa:", req.body);
  res.status(200).send(req.body);
})


const Config = {
  user: 'sa',
  password:'123456' ,
  server:'NOTEBOOK-DEBORA//SQLEXPRESS',
  database:'LojaDeProdutos',
  options: {
    encrypt: false, 
    enableArithAbort: true,
  },
  Port:1433
};

sql.connect(Config).then(() => console.log("Conectado ao banco de dados"))
.catch(err => console.error("Erro de conexão:", err));

app.post('/produtos', async (req, res) => {
  try {
      const { nome, preco } = req.body;

      if (!nome || !preco) {
          return res.status(400).send("Nome e preço são obrigatórios!");
      }

      const query = 'INSERT INTO Produtos (nome, preco) VALUES (@nome, @preco)';
      const request = new sql.Request();
      request.input('nome', sql.VarChar, nome);
      request.input('preco', sql.Decimal, preco);

      await request.query(query);
      res.status(201).send("Produto criado com sucesso!");
  } catch (err) {
      console.error("Erro ao criar produto:", err);
      res.status(500).send("Erro ao criar produto");
  }
});

app.get('/produtos', async (req, res) => {
  try {
      const query = 'SELECT * FROM Produtos';
      const result = await new sql.Request().query(query);

      if (result.recordset.length === 0) {
          return res.status(404).send("Nenhum produto encontrado.");
      }

      res.json(result.recordset);
  } catch (err) {
      console.error("Erro ao buscar produtos:", err);
      res.status(500).send("Erro ao buscar produtos");
  }
});

app.get('/produtos/:id', async (req, res) => {
  try {
      const { id } = req.params;

      if (!id) {
          return res.status(400).send("ID do produto é obrigatório!");
      }

      const query = 'SELECT * FROM Produtos WHERE id = @id';
      const request = new sql.Request();
      request.input('id', sql.Int, id);

      const result = await request.query(query);

      if (result.recordset.length === 0) {
          return res.status(404).send("Produto não encontrado");
      }

      res.json(result.recordset[0]);
  } catch (err) {
      console.error("Erro ao buscar produto:", err);
      res.status(500).send("Erro ao buscar produto");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});