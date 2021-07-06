const chalk = require('chalk');
const dateFormat = require('dateformat');
const util = require('util')

class Logger {
    static get prefix() {
        return chalk.gray(dateFormat(Date.now(), 'ddd HH:MM:ss:l'))
    }

    static formatInput(args) {
        return args.map((arg) => arg instanceof Object ? util.inspect(arg) : arg)
    }

    static command(...args) {
        args = this.formatInput(args)
        console.log(this.prefix + ' ' + chalk.green('[COMMAND]') + ' ' + args.join(' '))
    }

    static event(...args) {
        args = this.formatInput(args)
        console.log(this.prefix + ' ' + chalk.yellow('[EVENT]') + ' ' + args.join(' '))
    }

    static info(...args) {
        args = this.formatInput(args)
        console.log(this.prefix + ' ' + chalk.cyan('[>]') + ' ' + args.join(' '))
    } 

}

module.exports = Logger;