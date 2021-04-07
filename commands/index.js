
const defaultCommand = require('./defaultCommand/defaultCommand');
const reportCommand = require('./reportCommand/reportCommand');

module.exports = {
    execCommand(commandName, options){
        let execResult;
        switch (commandName){
            case 'report':
                execResult = reportCommand.exec(options); 
                break;
            case 'default':
                execResult = defaultCommand.exec(options); 
                break;
        }
        return execResult;
    }
}