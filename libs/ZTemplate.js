module.exports = {
    process(template, context) {
        try {
            var reg = /\$\{([^\}]+)?\}/g;
            var regOut = /(^( )?(if|for|else|switch|case|break|{|}))(.*)?/g,
                code = 'var r=[];\n',
                cursor = 0;

            var add = function (line, js) {
                js ? (code += line.match(regOut) ? line + '\n' : 'r.push(' + line + ');\n') :
                    (code += line != '' ? 'r.push("' + line.replace(/"/g, '\\"') + '");\n' : '');
                return add;
            }
            while (match = reg.exec(template)) {
                add(template.slice(cursor, match.index))(match[1], true);
                cursor = match.index + match[0].length;
            }
            add(template.substr(cursor, template.length - cursor));
            code += 'return r.join("");';
           
            code = code.replace(/\n/g, '\'$n\';');
            // console.log(code);
            // console.log(context);
            return new Function(code.replace(/[\r\t\n]/g, '')).apply(context).replace(/'\$n';/g, '\n');
        } catch (e) {
            if(e){
                console.warn(e);
            }else{
                return 'ZTemplate process fail'
            }
        }
    }
}