#! /usr/bin/env node
let commander = require("commander");

const logger = require("./../libs/logger");

let execCommand = (commandName, options) => {
    require("../commands/index").execCommand(commandName, options);
};

commander
    .version(require("./../package.json").version)
    .description("project overview tool")
    .usage("<command> [options]");

commander
    .command("report")
    .option("-t, --template <templatePath>", "specify report template")
    .option("-s, --src <srcPath>", "specify project src path")
    .description("print project info")
    .action(function (options) {
        let processDirPath = process.cwd();
        logger.info(`workspace: ${processDirPath}`);
        execCommand("report", {
            reportDirPath: "" || processDirPath,
            srcDirPath: options.src || processDirPath,
            reportTemplate: options.template,
        });
    });

commander.on("--help", function () {
    console.log("");
    console.log("  Examples:");
    console.log("");
    console.log("    $ pot report ## build report");
    console.log("    $ pot report -t xxx ## custom report template");
    console.log("");
});

// 为所有帮助信息的最后一行加空白
commander.commands.forEach((c) => c.on("--help", () => console.log()));

commander.parse(process.argv);

if (!process.argv.slice(2).length) {
    commander.outputHelp();
}
