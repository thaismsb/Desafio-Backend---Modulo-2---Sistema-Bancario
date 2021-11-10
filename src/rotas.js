const express = require("express");
const controladoresContas = require("./controladores/funcoes")
const rotas = express();

rotas.get("/contas", controladoresContas.listarContas);
rotas.post("/contas", controladoresContas.criarConta);
rotas.put("/contas/:numeroConta/usuario", controladoresContas.atualizarUsuarioConta);
rotas.delete("/contas/:numeroConta", controladoresContas.excluirConta);
rotas.post("/transacoes/depositar", controladoresContas.depositar);
rotas.post("/transacoes/sacar", controladoresContas.sacar);
rotas.post("/transacoes/transferir", controladoresContas.transferir);
rotas.get("/contas/saldo", controladoresContas.saldo);
rotas.get("/contas/extrato", controladoresContas.extrato);







module.exports = rotas;