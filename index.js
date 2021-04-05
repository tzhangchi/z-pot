#! /usr/bin/env node
console.log('感谢安装docs-cli模块!');
console.log(`当前版本: ${require('./package').version}`);
module.exports = {
  version: require('./package').version
}