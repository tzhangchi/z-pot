const zTemplate = require("./../libs/ZTemplate");

describe("zTemplate test", () => {
  it("zTemplate process", () => {
    expect(
        zTemplate.process('hello ${this.name}', { name: 'zhangchi' })
    ).toEqual('hello zhangchi')
  });
});
