const fs = require('fs-extra');
const path = require('path');
const strip = require('decomment');

class Stat {
    constructor(rootPath, opts) {
        this.countInfo = {
            filesCount: 0, //文件数量统计
            dirsCount: 0, //目录数量统计
            fileLineCount: 0, //全部文件行数统计
            maxFileLine: 0, //单个文件最大的行数
            classCount: 0, //类统计
            bigFilesList: [] //大文件列表
        }
        this.bigFileLimit = opts.bigFileLimit || 400; //大文件行数的定义
        this.rootPath = rootPath; //扫描的根目录
        this.ingoreDirs = opts.ingoreDirs || []; //忽略的目录
        this.ingoreFiles = opts.ingoreFiles || []; //忽略的文件
        this.ignoreComments= opts.ignoreComments || false;
    }
    getFileCount() {

    }
    //从根目录递归收集文件和目录信息
    readFileList(dir, collectObj, {
        specifyFiles
    }={}) {
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
            if(this.ignoreComments){
                try {
                    fileContent = strip(fileContent);
                }catch(e){
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
            collectObj.classCount += this.getClassCountFromFileContent(fileContent);

            filesList.push(fullPath);
        }
        if (specifyFiles && specifyFiles.length) {
            specifyFiles.forEach(item => statFile(item,item));
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
                statFile(item,fullPath);
            }
        });
        return collectObj;

    }
    //获取文件的类个数，此处用 AST 替代 正则更准确
    getClassCountFromFileContent(fileContent) {
        let lines = fileContent.split('\n');
        let count = 0;
        for (var line of lines) {
            if (/class\s((.)*)/.exec(line)) {
                count++;
            }
        }
        return count;
    }
    //启动
    boot() {
        let collectObj = {
            filesList: [],
            dirsList: [],
            fileLinesList: [],
            classCount: 0,
            bigFilesList: []

        }
        if (!fs.statSync(this.rootPath).isDirectory()) {
            this.readFileList(this.rootPath, collectObj, {
                specifyFiles: [this.rootPath]
            });
        } else {
            this.readFileList(this.rootPath, collectObj);
        }

        this.countInfo.filesCount = collectObj.filesList.length;
        this.countInfo.dirsCount = collectObj.dirsList.length;
        this.countInfo.maxFileLine = collectObj.fileLinesList.sort(function (a, b) {
            return b - a;
        })[0];
        // console.log( collectObj.fileLinesList)
        this.countInfo.fileLineCount = collectObj.fileLinesList.reduce(function (prev, cur) {
            return prev + cur;
        }, 0)
        this.countInfo.classCount = collectObj.classCount;
        this.countInfo.bigFilesList = collectObj.bigFilesList;
        return this;
    }
    // 打印统计信息
    logStatDesc(desc) {
        let logs = []
        desc ? logs.push(desc) : null;
        logs.push(`统计时间: ${new Date().toLocaleDateString().replace('/','-')}`);
        logs.push(`文件数量统计: ${this.countInfo.filesCount} 个`);
        logs.push(`目录数量统计: ${this.countInfo.dirsCount} 个`);
        logs.push(`代码总行数统计: ${this.countInfo.fileLineCount} 行`);
        logs.push(`单个文件最大行统计: ${this.countInfo.maxFileLine} 行`);

        // console.log(`JavaScript Class统计: ${this.countInfo.classCount} 个`);
        console.log(logs.join('\n'));
        this.statLogs = logs;
        return this;
    }
    //打印工程建议
    logSuggestion() {
        let logs = []
        logs.push('---------------');
        logs.push('------- 工程建议 --------');

        logs.push(`这些文件超过 ${this.bigFileLimit} 行`);
        for (let file of this.countInfo.bigFilesList) {
            logs.push(file)
        }
        console.warn(logs.join('\n'));
    }
    // 统计日志写入文件
    writeStatRecords(key, dirName) {
        let filePath = path.join(dirName, key + '.txt');
        fs.ensureFileSync(filePath);
        fs.writeFileSync(filePath, this.statLogs.join('\n'), 'utf8');
    }
    //合并多个统计实例
    mergeStat(statInstance) {
        for (let key in this.countInfo) {
            if (Object.prototype.toString.call(this.countInfo[key]) === '[object Number]') {
                this.countInfo[key] += statInstance.countInfo[key];
            }
            if (Object.prototype.toString.call(this.countInfo[key]) === '[object Array]') {
                this.countInfo[key].push(statInstance.countInfo[key]);
            }
        }
        return this;
    }
}

module.exports = Stat;
