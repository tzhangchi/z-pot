const Stat = require("./stat");
const path = require("path");
const logger = require("./../../libs/logger");
const defaultIngoreDirs = [".git", "node_modules"];
const defaultIngoreFileds = ["package-lock.json","yarn.lock"];

module.exports = {
  exec({ reportDirPath, srcDirPath, reportTemplate }) {
    // logger.info(`reportCommand exec reportDirPath:${reportDirPath} srcDirPath:${srcDirPath}`)

    const statInstance = new Stat(srcDirPath, {
      ingoreDirs: [].concat(defaultIngoreDirs),
      ingoreFiles: [].concat(defaultIngoreFileds),
      ignoreComments: false, // 是否注释代码注释
      reportTemplate: reportTemplate,
      reportDirPath: reportDirPath,
    }).boot();

    return statInstance.generateReport();
  }
};
