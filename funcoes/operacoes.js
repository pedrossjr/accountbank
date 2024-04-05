const inquirer = require('inquirer')
const chalk = require('chalk')

const fs = require('fs')
const { get } = require('http')

const criarConta = require('./criar.js')
const consultarSaldo = require('./saldo.js')
const depositarValor = require('./deposito.js')
const sacarValor = require('./saque.js')
const cancelarConta = require('./cancelar.js')

module.exports = {
    Operation() {
        console.clear()
        console.log(chalk.bgGreen.black(' ** INICIANDO O ACCOUNT SYSTEM ** '))
    
        inquirer
            .prompt([
                {
                    type: 'list',
                    name:'action',
                    message:'ESCOLHA O TIPO DE TRANSAÇÃO:',
                    choices:[ '1 - Criar Conta', '2 - Consultar Saldo', '3 - Depositar', '4 - Sacar', '5 - Transferir', '6 - Empréstimo', '7 - Cancelar Conta', '8 - Sair'],
                },
        ]).then((answer) => {
            const action = answer['action']
            
            if (action === '1 - Criar Conta') {
                criarConta.createAccount()
            } else if (action === '2 - Consultar Saldo') {
                consultarSaldo.getAccountBalance()
            } else if (action === '3 - Depositar') {
                depositarValor.depositar()
            } else if (action === '4 - Sacar') {
                sacarValor.sacar()
            } else if (action === '5 - Transferir') {
                console.log(chalk.bgBlue.black('Função de transferência em desenvolvimento!'))
            } else if (action === '6 - Empréstimo') {
                console.log(chalk.bgBlue.black('Função de empréstimo em desenvolvimento!'))
            } else if (action === '7 - Cancelar Conta') {
                cancelarConta.cancelAccount()
            } else if (action === '8 - Sair') {
                console.log(chalk.bgBlue.black('Obrigado por usar o Account System!'))
                process.exit()
            }
        })
        .catch((err) => console.log(err))
    }
}