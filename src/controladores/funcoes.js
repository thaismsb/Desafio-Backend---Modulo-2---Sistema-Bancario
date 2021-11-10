const { contas, depositos, saques, transferencias } = require("../bancodedados");
const { format } = require("date-fns");



function listarContas(req, res) {
    if (req.query.senha_banco === "Cubos123Bank") {
        res.status(200).json(contas);
    } else {
        res.status(404);
        res.json({ mensagem: "Senha incorreta" });
    }
}

let numeroConta = 1;

function criarConta(req, res) {
    const novaConta = {
        numero: numeroConta,
        saldo: 0,
        usuario: {
            nome: req.body.nome,
            cpf: req.body.cpf,
            data_nascimento: req.body.data_nascimento,
            telefone: req.body.telefone,
            email: req.body.email,
            senha: req.body.senha
        }
    }

    if (!req.body.nome || req.body.nome.trim() === "") {
        res.status(400).json({ mensagem: "Um nome válido precisa ser inserido." });
        return;
    }

    if (!req.body.cpf || req.body.cpf.trim() === "") {
        res.status(400).json({ mensagem: "Um cpf válido precisa ser inserido." });
        return;
    }


    if (!req.body.data_nascimento || req.body.data_nascimento.trim() === "") {
        res.status(400).json({ mensagem: "Uma data de nascimento válida precisa ser inserida." });
        return;
    }
    if (!req.body.telefone || req.body.telefone.trim() === "") {
        res.status(400).json({ mensagem: "Um telefone válido precisa ser inserido." });
        return;
    }

    if (!req.body.email || req.body.email.trim() === "") {
        res.status(400).json({ mensagem: "Um email válido precisa ser inserido." });
        return;
    }

    if (!req.body.senha || req.body.senha.trim() === "") {
        res.status(400).json({ mensagem: "Uma senha válida precisa ser inserida." });
        return;
    }


    if (contas.find(
        (conta) => conta.usuario.cpf === (req.body.cpf)
    )) {
        res.status(404).json({ mensagem: "Cpf inválido." });
        return;
    }

    if (contas.find(
        (conta) => conta.usuario.email === (req.body.email)
    )) {
        res.status(404).json({ mensagem: "Email inválido." });
        return;
    }

    contas.push(novaConta);
    res.status(201);
    res.json(novaConta);

    numeroConta += 1;
}

function atualizarUsuarioConta(req, res) {
    const conta = contas.find(
        (conta) => conta.numero === Number(req.params.numeroConta)
    );

    if (!conta) {
        res.status(404).json({ mensagem: "A conta informada não existe." });
        return;
    }

    if (!req.body.nome && req.body.nome.trim() === "" &&
        !req.body.cpf && req.body.cpf.trim() === "" &&
        !req.body.data_nascimento && req.body.data_nascimento.trim() === "" &&
        !req.body.telefone && req.body.telefone.trim() === "" &&
        !req.body.email && req.body.email.trim() === "" &&
        !req.body.senha && req.body.senha.trim() === "") {
        res.status(400).json("O servidor não entendeu a requisição pois está com uma sintaxe/formato inválido.");
        return;
    }



    if (conta) {

        if (contas.find(
            (conta) => conta.usuario.cpf === (req.body.cpf)
        )) {
            res.status(404);
            res.json({ erro: "o servidor não entendeu a requisição pois está com uma sintaxe/formato inválido" });
            return;
        } else {
            conta.usuario.cpf = req.body.cpf ? req.body.cpf : conta.usuario.cpf;
        }

        if (contas.find(
            (conta) => conta.usuario.email === (req.body.email)
        )) {
            res.status(404);
            res.json({ erro: "o servidor não entendeu a requisição pois está com uma sintaxe/formato inválido" });
            return;
        } else {
            conta.usuario.email = req.body.email ? req.body.email : conta.usuario.email;
        }
        conta.usuario.nome = req.body.nome ? req.body.nome : conta.usuario.nome;
        conta.usuario.data_nascimento = req.body.data_nascimento ? req.body.data_nascimento : conta.usuario.data_nascimento;
        conta.usuario.telefone = req.body.telefone ? req.body.telefone : conta.usuario.telefone;
        conta.usuario.senha = req.body.senha ? req.body.senha : conta.usuario.senha;

        res.status(200)
        res.json({ mensagem: "Conta atualizada com sucesso!" });
    }
};


function excluirConta(req, res) {
    const conta = contas.find(
        (conta) => conta.numero === Number(req.params.numeroConta)
    );

    if (!conta) {
        res.status(400);
        res.json("o servidor não entendeu a requisição pois está com uma sintaxe/formato inválido");
        return;
    }

    const indice = contas.indexOf(conta);

    contas.splice(indice, 1)

    res.status(200);
    res.json("Conta excluída com sucesso!")
};



function depositar(req, res) {
    let data = new Date();

    const registroDeDeposito = {
        data: format(data, "yyyy-MM-dd HH:mm:ss"),
        numero_conta: req.body.numero_conta,
        valor: req.body.valor
    }


    if (req.body.valor <= 0) {
        res.status(400);
        res.json({ erro: "Este depósito não é permitido" });
        return;

    }

    const conta = contas.find(conta =>

    (conta.numero === Number(req.body.numero_conta)

    ));

    if (conta) {

        conta.saldo += req.body.valor;

        res.status(200).json("Depósito realizado com sucesso!");

    } else {
        res.status(404).json({ erro: "Esta conta não existe" })
    };

    depositos.push(registroDeDeposito);

}


function sacar(req, res) {
    let data = new Date();

    if (!req.body.numero_conta || !req.body.valor || !req.body.senha) {
        res.status(400);
        res.json({ erro: "Todos os campos devem ser preenchidos e válidos." })
    }

    const conta = contas.find(
        (conta) => conta.numero === Number(req.body.numero_conta)
    );


    if (conta) {


        if (conta.numero === req.body.numero_conta) {

            if (conta.usuario.senha === req.body.senha) {

                if (conta.saldo >= req.body.valor && conta.saldo !== 0 && req.body.valor > 0 && req.body.valor !== 0) {
                    const registroDeSaque = {
                        data: format(data, "yyyy-MM-dd HH:mm:ss"),
                        numero_conta: req.body.numero_conta,
                        valor: req.body.valor
                    }

                    saques.push(registroDeSaque);
                    conta.saldo -= req.body.valor;

                    res.status(200).json({ mensagem: "Saque realizado com sucesso!" })

                } else {
                    res.status(404).json({ mensagem: "Operação inválida!" })
                }

            } else {
                res.status(404).json({ mensagem: "Senha incorreta" })
            }


        } else {
            res.status(404).json({ mensagem: "Esta conta não existe-segundo if" })
        }

    } else {
        res.status(404).json({ mensagem: "Esta conta não existe- primeiro if" })
    }
}



function transferir(req, res) {
    let data = new Date();

    const tranferenciasFeitas = {
        data: format(data, "yyyy-MM-dd HH:mm:ss"),
        numero_conta_origem: req.body.numero_conta_origem,
        numero_conta_destino: req.body.numero_conta_destino,
        valor: req.body.valor
    }

    if (req.body.numero_conta_origem === req.body.numero_conta_destino) {
        res.status(400).json({ mensagem: "O número da conta de origem não pode ser igual ao da consta de destino." });
        return;
    }

    const conta = contas.find(
        (conta) => conta.numero === Number(req.body.numero_conta_origem)
    );

    const contaDestino = contas.find(
        (contaDestino) => contaDestino.numero === Number(req.body.numero_conta_destino)
    )

    if (conta.saldo < req.body.valor || conta.saldo === 0) {
        res.status(400).json({ mensagem: "Não existe saldo suficiente para fazer essa transferência." })

    }

    if (!req.body.valor || req.body.valor <= 0) {

        res.status(404).json({ mensagem: "O valor digitado precisa ser um número válido" });
        return;
    }


    if (conta.usuario.senha !== req.body.senha) {
        res.status(404).json({ mensagem: "Senha incorreta." })
        return;
    }


    if (conta) {
        if (contaDestino) {

            conta.saldo -= req.body.valor;
            contaDestino.saldo += req.body.valor;

            res.status(200).json({ mensagem: "TransferÊncia realizada com sucesso!" });
        } else {
            res.status(404).json({ mensagem: "A conta de Destino não existe." })
        }

    } else {
        res.status(404).json({ mensagem: "A conta de Origem não existe." })
    }

    transferencias.push(tranferenciasFeitas);

}

function saldo(req, res) {

    const conta = contas.find(
        (conta) => conta.numero === Number(req.query.numero_conta)
    );

    if (req.query.senha !== conta.usuario.senha || !req.query.senha) {
        res.status(404).json({ mensagem: "Senha incorreta." })
        return;
    }

    if (conta) {
        res.status(200).json(conta.saldo);
    } else {
        res.status(404).json({ mensagem: "Esta conta não existe." })
    }

}

function extrato(req, res) {

    const conta = contas.find((conta) => conta.numero === Number(req.query.numero_conta));

    if (conta) {

        if (conta.usuario.senha === req.query.senha) {
            const Depositos = depositos.filter(item => item.numero_conta === Number(req.query.numero_conta))
            const Saques = saques.filter(item => item.numero_conta === Number(req.query.numero_conta))
            const TransferenciasEnviadas = transferencias.filter(item => item.numero_conta_origem === Number(req.query.numero_conta))
            const TransferenciasRecebidas = transferencias.filter(item => item.numero_conta_destino === Number(req.query.numero_conta))

            return res.status(200).json({
                Depositos,
                Saques,
                TransferenciasEnviadas,
                TransferenciasRecebidas
            })
        }
        return res.status(400).json({ mensagem: "Senha incorreta." })
    }

    res.status(404).json({ mensagem: "Conta não encontrada." })

}



module.exports = { listarContas, criarConta, atualizarUsuarioConta, excluirConta, depositar, sacar, transferir, saldo, extrato };
