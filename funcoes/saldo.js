const inquirer = require('inquirer')
const chalk = require('chalk')
const fs = require('fs')

const operacao = require('./operacoes.js')
const check = require('./imports.js')
const saque = require('./saque.js')

module.exports = {

    getAccountBalance() {
        inquirer
        .prompt([
            {
                name: 'accountName',
                message: 'Digite o nome da sua conta: '
            }
        ]).then((answer) => {
            const accountName = answer.accountName

            if(!check.checkAccount(accountName)) {
                return getAccountBalance()
            }

            const accountData = check.getAccount(accountName)

            console.log(
                chalk.bgBlue.black(
                `O saldo da conta ${accountName} é de R$ ${accountData.balance.toFixed(2)}`,
                ),
            )

            inquirer
                .prompt([
                    {
                        type: 'list',
                        name: 'action',
                        message: 'Deseja realizar um saque? ',
                        choices:[ '1 - Sim', '2 - Não', '3 - Voltar ao menu principal' ],
                    }
                ]).then((answer) => {
                    const action = answer['action']
            
                    if(action === '1 - Sim') {
                        saque.sacar()
                    } else if (action === '2 - Não') {
                        console.log(chalk.bgBlue.black('Obrigado por usar o Account System!'))
                        process.exit()
                    } else if (action === '3 - Voltar ao menu principal') {
                        operacao.Operation()                       
                    }
                })
        }).catch((err) => console.log(err))
    }
}