const inquirer = require('inquirer')
const chalk = require('chalk')
const fs = require('fs')

const operacao = require('./operacoes.js')

module.exports = {
    createAccount() {
        inquirer.prompt([
            {
                name: 'AccountName',
                message: 'Digite um nome para criar a sua conta: '
            },
        ])
        .then((answer) => {
            const accountName = answer.AccountName
            
            console.info(accountName)
            
            if (!fs.existsSync('accounts')) {
                fs.mkdirSync('accounts')
            }

            if(fs.existsSync(`accounts/${accountName}.json`)) {
                console.log(
                    chalk.bgRed.black(`A conta ${accountName} já existe, escolha outro nome!`)
                )
                this.createAccount()
                return
            }

            fs.writeFileSync(
                `accounts/${accountName}.json`, 
                '{"balance":0}', 
                function(err){
                    console.log(err)
                },
            )

            console.log(chalk.green(`Parabéns, sua conta ${accountName} foi criada com sucesso!`))
            operacao.Operation()
        })
        .catch((err) => console.log(err))
    }
}