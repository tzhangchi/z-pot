const fs = require('fs-extra');
const path = require('path');
const strip = require('decomment');
const moment = require('moment');
const ZTemplate = require('./../../libs/ZTemplate');
const logger = require('./../../libs/logger');


class Stat {
    constructor(rootPath, opts) {
        this.statInfo = {
            createdTime: moment(new Date()).format('YYYY-MM-DD'),
            filesCount: 0, //文件数量统计
            dirsCount: 0, //目录数量统计
            fileLineCount: 0, //全部文件行数统计
            maxFileLine: 0, //单个文件最大的行数
            bigFilesList: [] //大文件列表
        }
        this.bigFileLimit = opts.bigFileLimit || 400; //大文件行数的定义
        this.rootPath = rootPath; //扫描的根目录
        this.ingoreDirs = opts.ingoreDirs || []; //忽略的目录
        this.ingoreFiles = opts.ingoreFiles || []; //忽略的文件
        this.ignoreComments = opts.ignoreComments || false;
        this.reportDirPath = opts.reportDirPath;
        this.reportTemplate = opts.reportTemplate || 'report.template.md';;

    }
    getFileCount() {

    }
    //从根目录递归收集文件和目录信息
    readFileList(dir, collectObj, {
        specifyFiles
    } = {}) {
        let {
            filesList,
            dirsList,
            bigFilesList
        } = collectObj

        let statFile = (item, fullPath) => {
            if (this.ingoreFiles.includes(item)) {
                return;
            }
            //此时是文件
            let fileContent = fs.readFileSync(fullPath, 'utf-8');
            if (this.ignoreComments) {
                try {
                    fileContent = strip(fileContent);
                } catch (e) {
                    console.log(e)
                }
            }
            let fineLine = fileContent.split('\n').length;
            if (fineLine > this.bigFileLimit) {
                collectObj.bigFilesList.push(fullPath)
            }
            if (fineLine === 8963) {
                console.log(fullPath)
            }
            collectObj.fileLinesList.push(fineLine);

            filesList.push(fullPath);
        }
        if (specifyFiles && specifyFiles.length) {
            specifyFiles.forEach(item => statFile(item, item));
            return collectObj;
        }

        let files = fs.readdirSync(dir);
        files.forEach((item, index) => {
            var fullPath = path.join(dir, item);
            const stat = fs.statSync(fullPath);
            if (stat.isDirectory()) {
                if (this.ingoreDirs.includes(item)) {
                    return;
                }
                dirsList.push(fullPath);
                this.readFileList(path.join(dir, item), collectObj); //递归读取文件
            } else {
                statFile(item, fullPath);
            }
        });
        return collectObj;

    }
    //启动
    boot() {
        let collectObj = {
            filesList: [],
            dirsList: [],
            fileLinesList: [],
            bigFilesList: []

        }
        if (!fs.statSync(this.rootPath).isDirectory()) {
            this.readFileList(this.rootPath, collectObj, {
                specifyFiles: [this.rootPath]
            });
        } else {
            this.readFileList(this.rootPath, collectObj);
        }

        this.statInfo.filesCount = collectObj.filesList.length;
        this.statInfo.dirsCount = collectObj.dirsList.length;
        this.statInfo.maxFileLine = collectObj.fileLinesList.sort(function (a, b) {
            return b - a;
        })[0];
        // console.log( collectObj.fileLinesList)
        this.statInfo.fileLineCount = collectObj.fileLinesList.reduce(function (prev, cur) {
            return prev + cur;
        }, 0)
        this.statInfo.bigFilesList = collectObj.bigFilesList;
        return this;
    }
    // 创建报告
    generateReport() {
        const reportTemplate = this.reportTemplate;
        const reportType = reportTemplate.split('.')[reportTemplate.split('.').length - 1];
        const templateFilePath = path.join(__dirname, 'templates', reportTemplate);
        const reportTemplateContent = fs.readFileSync(templateFilePath,'utf8');
       
        const reportContent = ZTemplate.process(reportTemplateContent, {
            statInfo: this.statInfo
        });

        logger.info(`\n${reportContent}`)
        let filePath = path.join(this.reportDirPath, `pot_report_${this.statInfo.createdTime}.${reportType}`);
        fs.ensureFileSync(filePath);
        fs.writeFileSync(filePath, reportContent, 'utf8');

        return this;
    }
    //打印工程建议
    logSuggestion() {
        let logs = []
        logs.push('---------------');
        logs.push('------- 工程建议 --------');

        logs.push(`这些文件超过 ${this.bigFileLimit} 行`);
        for (let file of this.statInfo.bigFilesList) {
            logs.push(file)
        }
        console.warn(logs.join('\n'));
    }

    //合并多个统计实例
    mergeStat(statInstance) {
        for (let key in this.statInfo) {
            if (Object.prototype.toString.call(this.statInfo[key]) === '[object Number]') {
                this.statInfo[key] += statInstance.statInfo[key];
            }
            if (Object.prototype.toString.call(this.statInfo[key]) === '[object Array]') {
                this.statInfo[key].push(statInstance.statInfo[key]);
            }
        }
        return this;
    }
}

module.exports = Stat;
