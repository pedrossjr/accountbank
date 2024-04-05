const chalk = require('chalk')
const fs = require('fs')

module.exports = {
    checkAccount(accountName) {
        if(!fs.existsSync(`accounts/${accountName}.json`)) {
            console.log(chalk.bgRed.black(`A conta ${accountName} não existe, escolha outro nome!`))
            return false
        }
    
        return true
    },

    getAccount(accountName) {
        const accountJSON = fs.readFileSync(`accounts/${accountName}.json`, {
            encoding: 'utf8',
            flag: 'r'
        })
    
        return JSON.parse(accountJSON)
    }
}