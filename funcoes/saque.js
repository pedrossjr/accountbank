const inquirer = require('inquirer')
const chalk = require('chalk')
const fs = require('fs')

const operacao = require('./operacoes.js')
const check = require('./imports.js')

module.exports = {
    sacar() {
        inquirer.prompt([
            {
                name: "accountName",
                message: "Digite o nome da conta para saque: ",
            }
        ]).then((answer) => {

            const accountName = answer.accountName

            if(!check.checkAccount(accountName)) {
                return this.sacar()
            }

            inquirer.prompt([
                {
                    name: "amount",
                    message: "Digite o valor que deseja realizar o saque: ",
                }
            ]).then((answer) => {
                const amount = answer.amount

                this.removeAmount(accountName, amount)
            })
            .catch((err) => console.log(err))

        }).catch(err => console.log(err))
    },

    removeAmount(accountName, amount) {
        const accountData = check.getAccount(accountName)

        if(!amount) {
            console.log(
                chalk.bgRed.black(`Ocorreu um erro, tente novamente mais tarde!`)
            )
            return this.sacar()
        }

        if(accountData.balance < amount) {
            console.log(
                chalk.bgRed.black(`Valor de ${amount} indisponível para saque!`)
            )
            return this.sacar()
        }

        accountData.balance = parseFloat(accountData.balance) - parseFloat(amount)

        fs.writeFileSync(
            `accounts/${accountName}.json`,
            JSON.stringify(accountData),
            function(err) {
                console.log(err)
            },
        )

        console.log(
            chalk.green(`Saque no valor de R$ ${amount} realizado com sucesso!`)
        )
        operacao.Operation()
    }
}