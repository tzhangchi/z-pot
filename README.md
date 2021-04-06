# pot 

project overview tool, used to analyze the amount of code, the number of files, code statistics and so on.

项目概述工具，用于分析代码量、文件数、代码统计等。


## 安装

安装 `z-pot`

```shell
npm i -g z-pot

cd ${yourProject}

pot report
```

## Features
- [x] 文件统计
- [x] 自定义模板
- [] 文件类型分布
- [] 代码行数按区间分布
- [] 分析项目技术栈
- [] 分析项目git参与者

```

## 使用

```shell
Usage: pot <command> [options]

project overview tool

Options:
  -V, --version     output the version number
  -h, --help        output usage information

Commands:
  report [options]  获取项目概要信息

  Examples:

    $ pot report ## 获取项目概要信息
    $ pot report -t xxx ## 自定义模板，输出报告
```

## 自定义模板

模板上下文 Context
```
  this.statInfo = {
        createdTime: moment(new Date()).format('YYYY-MM-DD'),
        fileSize: 0, //文件物理大小
        filesCount: 0, //文件数量统计
        dirsCount: 0, //目录数量统计
        fileLineCount: 0, //全部文件行数统计
        maxFileLine: 0, //单个文件最大的行数
        bigFilesList: [] //大文件列表
    }
```
自定义模板内容 report.template.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    ${this.statInfo.createdTime}
</body>
</html>
```

```shell
pot report -t ./tests/report.template.html
ls pot_report_2021-04-05.html
```





