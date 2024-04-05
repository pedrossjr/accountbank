const inquirer = require('inquirer')
const chalk = require('chalk')
const fs = require('fs')

const operacao = require('./operacoes.js')
const check = require('./imports.js')
const saque = require('./saque.js')

module.exports = {
    depositar() {
        inquirer.prompt([
            {
                name: 'AccountName',
                message: 'Digite o nome da sua conta para depositar: '
            }
        ])
        .then((answer) => {
            const accountName = answer.AccountName

            if(!check.checkAccount(accountName)) {
                return this.depositar()
            }

            inquirer.prompt([
                {
                    name: 'amount',
                    message: 'Digite o valor da quantia que deseja realizar o depósito: '
                }
            ]).then((answer) => {
                const amount = answer.amount

                this.addAmount(accountName, amount)
                operacao.Operation()
            }).catch(err => console.log(err))
        })
        .catch(err => console.log(err))
    },

    addAmount(accountName, amount) {
        const accountData = check.getAccount(accountName)
        if(!amount) {
            console.log(chalk.bgRed.black('Ocorreu um erro, tente novamente mais tarde!'))
            return this.depositar()
        }

        accountData.balance = parseFloat(amount) + parseFloat(accountData.balance)

        fs.writeFileSync(
            `accounts/${accountName}.json`, 
            JSON.stringify(accountData),
            function(err){
                console.log(err)
            },
        )

        console.log(chalk.green(`Depósito no valor de R$ ${amount} realizado com sucesso na conta ${accountName}.`))
    }
}