const commands = require("./../commands/index");
const path = require("path");
describe("commands test", () => {
    it("default command process", () => {
        expect(commands.execCommand("default")).toEqual("defaultCommand");
    });
    it("report command process", () => {
        const reportDirPath = path.join(__dirname, "demo", "report"),
            srcDirPath = path.join(__dirname, "demo", "src"),
            reportTemplate = path.join(__dirname, "demo", "templates", "demo.template.md");
        expect(
            commands.execCommand("report", {
                reportDirPath,
                srcDirPath,
                reportTemplate,
            })
        ).toEqual("Line Count: 4");
    });
});
