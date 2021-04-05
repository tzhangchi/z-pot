const Stat = require('./stat');

module.exports = {
    exec({ reportDirPath, srcDirPath }) {
        console.log('进行 report 统计')
        const path = require('path');
        const falconStat = new Stat(srcDirPath, {
            ingoreDirs: [],
            ingoreFiles: [],
            ignoreComments: false // 是否注释代码注释
        }).boot();

        falconStat.logStatDesc('').writeStatRecords('pot_report_2021-04-02', reportDirPath);

    }
}