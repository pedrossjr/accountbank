//módulos externo
const inquirer = require('inquirer')
const chalk = require('chalk')

//módulos internos
const fs = require('fs')
const { get } = require('http')


function operation(){
    console.clear()
    console.log(chalk.bgGreen.black(' ** INICIANDO O ACCOUNT SYSTEM ** '))

    inquirer
        .prompt([
            {
                type: 'list',
                name:'action',
                message:'ESCOLHA O TIPO DE TRANSAÇÃO:',
                choices:[ '1 - Criar Conta', '2 - Consultar Saldo', '3 - Depositar', '4 - Sacar', '5 - Transferir', '6 - Empréstimo', '7 - Sair'],
            },
    ]).then((answer) => {
        const action = answer['action']
        
        if(action === '1 - Criar Conta') {
            createAccount()
        } else if (action === '2 - Consultar Saldo') {
            getAccountBalance()
        } else if (action === '3 - Depositar') {
            deposito()
        } else if (action === '4 - Sacar') {
            withdraw ()
        } else if (action === '5 - Transferir') {
            withdraw ()
        } else if (action === '6 - Empréstimo') {
            withdraw ()
        } else if (action === '7 - Sair') {
            console.log(chalk.bgBlue.black('Obrigado por usar o Account System!'))
            process.exit()
        }
    })
    .catch((err) => console.log(err))
}

// create an account
function createAccount() {
    console.log(chalk.bgGreen.black('Parabéns por escolher nosso banco!'))
    console.log(chalk.green('Defina as opções da sua conta a seguir: '))
    criarConta.buildAccount()
}

function buildAccount() {
    
    inquirer.prompt([
        {
            name: 'AccountName',
            message: 'Digite um nome para a sua conta: '
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
            buildAccount()
            return
        }

        fs.writeFileSync(
            `accounts/${accountName}.json`, 
            '{"balance":0}', 
            function(err){
                console.log(err)
            },
        )

        console.log(chalk.green('Parabéns, a sua conta foi criada!'))
        operation()
    })
    .catch((err) => console.log(err))
}

// add an account to user account
function deposito() {
    inquirer.prompt([
        {
            name: 'AccountName',
            message: 'Qual o nome da sua conta: '
        }
    ])
    .then((answer) => {
        const accountName = answer.AccountName
        // verify if account exists
        if(!checkAccount(accountName)) {
            return deposito()
        }

        inquirer.prompt([
            {
                name: 'amount',
                message: 'Quanto você deseja depositar? '
            }
        ]).then((answer) => {
            const amount = answer.amount

            addAmount(accountName, amount)
            operation()
        }).catch(err => console.log(err))
    })
    .catch(err => console.log(err))
}

function checkAccount(accountName) {
    if(!fs.existsSync(`accounts/${accountName}.json`)) {
        console.log(chalk.bgRed.black('Esta conta não existe, escolha outro nome!'))
        return false
    }

    return true
}

function addAmount(accountName, amount) {
    const accountData = getAccount(accountName)
    if(!amount) {
        console.log(chalk.bgRed.black('Ocorreu um erro tente novamente mais tarde!'))
        return deposito()
    }

    accountData.balance = parseFloat(amount) + parseFloat(accountData.balance)

    fs.writeFileSync(
        `accounts/${accountName}.json`, 
        JSON.stringify(accountData),
        function(err){
            console.log(err)
        },
    )

    console.log(chalk.green(`Foi depositado o valor de R$ ${amount} na sua conta.`))
}

function getAccount(accountName) {
    const accountJSON = fs.readFileSync(`accounts/${accountName}.json`, {
        encoding: 'utf8',
        flag: 'r'
    })

    return JSON.parse(accountJSON)
}

function getAccountBalance() {
    inquirer
    .prompt([
        {
            name: 'accountName',
            message: 'Qual o nome da sua conta? '
        }
    ]).then((answer) => {
        const accountName = answer.accountName
        
        if(!checkAccount(accountName)) {
            return getAccountBalance()
        }

        const accountData = getAccount(accountName)

        console.log(
            chalk.bgBlue.black(
            `O saldo da conta é de R$ ${accountData.balance.toFixed(2)}`,
            ),
        )

        inquirer
            .prompt([
                {
                    type: 'list',
                    name: "action",
                    message: "Deseja realizar um saque? ",
                    choices:[ '1 - Sim', '2 - Não'],
                }
            ]).then((answer) => {
                const action = answer['action']
        
                if(action === '1 - Sim') {
                    withdraw()
                } else if (action === '2 - Não') {
                    console.log(chalk.bgBlue.black('Obrigado por usar o Account System!'))
                    process.exit()
                }
            })
    }).catch((err) => console.log(err))
}

// withdraw an amount from user account
function withdraw() {
    inquirer.prompt([
        {
            name: "accountName",
            message: "Qual o nome da sua conta? ",
        }
    ]).then((answer) => {

        const accountName = answer.accountName

        if(!checkAccount(accountName)) {
            return withdraw()
        }

        inquirer.prompt([
            {
                name: "amount",
                message: "Quanto você deseja sacar? ",
            }
        ]).then((answer) => {
            const amount = answer.amount

            removeAmount(accountName, amount)
        })
        .catch((err) => console.log(err))

    }).catch(err => console.log(err))
}

function removeAmount(accountName, amount) {
    const accountData = getAccount(accountName)

    if(!amount) {
        console.log(
            chalk.bgRed.black(`Ocorreu um erro, tente novamente mais tarde!`)
        )
        return withdraw()
    }

    if(accountData.balance < amount) {
        console.log(
            chalk.bgRed.black(`Valor indisponível para saque!`)
        )
        return withdraw()
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
        chalk.green(`Saque realizado de R$ ${amount}!`)
    )
    operation()
}

/*
Desafios

Transferências entre contas
Empréstimos
*/