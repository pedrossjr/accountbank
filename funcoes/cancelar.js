const inquirer = require('inquirer')
const chalk = require('chalk')
const fs = require('fs')

const operacao = require('./operacoes.js')
const check = require('./imports.js')

module.exports = {
    cancelAccount() {
        inquirer.prompt([
            {
                name: 'AccountName',
                message: 'Digite o nome da conta para cancelar: '
            },
        ])
        .then((answer) => {
            const accountName = answer.AccountName
            
            console.info(accountName)

            if(!fs.existsSync(`accounts/${accountName}.json`)) {
                console.log(
                    chalk.bgRed.black(`A conta ${accountName} não existe, escolha outra conta!`)
                )
                this.cancelAccount()
                return
            }

            const accountData = check.getAccount(accountName)

            if(accountData.balance > 0) {
                console.log(chalk.bgRed.black(`Sua conta ${accountName} possui saldo e não poderá ser cancelada!`))
            } else {
                fs.rmSync(
                    `accounts/${accountName}.json`, 
                    undefined,
                    function(err){
                        console.log(err)
                    },
                )

                console.log(chalk.green(`Sua conta ${accountName} foi cancelada com sucesso!`))
                operacao.Operation()
            }
        })
        .catch((err) => console.log(err))
    }
}