const Stat = require('./Stat');
const path = require('path');
const logger = require('./../../libs/logger');
module.exports = {
    exec({ reportDirPath, srcDirPath, reportTemplate }) {
        logger.info(`reportCommand exec reportDirPath:${reportDirPath} srcDirPath:${srcDirPath}`)
        const falconStat = new Stat(srcDirPath, {
            ingoreDirs: [],
            ingoreFiles: [],
            ignoreComments: false, // 是否注释代码注释
            reportTemplate: reportTemplate,
            reportDirPath:reportDirPath
        }).boot();

        falconStat.generateReport();

    }
}