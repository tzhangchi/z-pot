const path = require("path");
let exec = require("child_process").exec;
function cli(args, cwd) {
    return new Promise((resolve) => {
        exec(
            `node ${path.resolve("./bin/pot")} ${args.join(" ")}`,
            { cwd },
            (error, stdout, stderr) => {
                resolve({
                    code: error && error.code ? error.code : 0,
                    error,
                    stdout,
                    stderr,
                });
            }
        );
    });
}
describe("bin test", () => {
    it("no args", async () => {
        let result = await cli([], ".");
        expect(result.code).toBe(0);
        expect(result.stdout).toContain("Usage: pot <command> [options]");
    });
    it("-h", async () => {
        let result = await cli(["-h"], ".");
        expect(result.code).toBe(0);
        expect(result.stdout).toContain("Usage: pot <command> [options]");
    });
    it("--help", async () => {
        let result = await cli(["--help"], ".");
        expect(result.code).toBe(0);
        expect(result.stdout).toContain("Usage: pot <command> [options]");
    });

    it("report --src ", async () => {
        //pot report --src ./tests/demo/src
        let result = await cli(["report", "--src", "./tests/demo/src"], ".");
        expect(result.code).toBe(0);
        expect(result.stdout).toContain('单个文件最大行统计: 4 行');
    });
});
