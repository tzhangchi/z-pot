const Stat = require('./Stat');
const path = require('path');
const logger = require('./../../libs/logger');
const defaultIngoreDirs  = ['.git'];

module.exports = {
    exec({ reportDirPath, srcDirPath, reportTemplate }) {
        // logger.info(`reportCommand exec reportDirPath:${reportDirPath} srcDirPath:${srcDirPath}`)
        
        const statInstance = new Stat(srcDirPath, {
            ingoreDirs: [].concat(defaultIngoreDirs),
            ingoreFiles: [],
            ignoreComments: false, // 是否注释代码注释
            reportTemplate: reportTemplate,
            reportDirPath: reportDirPath
        }).boot();

        statInstance.generateReport();

    }
}