const ZTemplate = require('./../libs/ZTemplate');
const assert = require('assert');

const expected = ZTemplate.process("${this.txt}", { txt: 'hello word' });

assert.equal(expected, 'hello word', 'ZTemplate Process Succeed')