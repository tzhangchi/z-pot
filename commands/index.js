
const defaultCommand = require('./defaultCommand/defaultCommand');
const reportCommand = require('./reportCommand/reportCommand');

module.exports = {
    execCommand(commandName, options){
        switch (commandName){
            case 'report':
                reportCommand.exec(options); 
                break;
            case 'default':
                defaultCommand.exec(options); 
                break;
            
            
        }
    }
}