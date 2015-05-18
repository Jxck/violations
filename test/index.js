let assert = require('assert');
let Violate = require('../src').Violate;

describe('new', () => {
  it('with rule', () => {
    let rules = {};
    let validator = new Violate(rules);
    assert.strictEqual(validator.rules, rules);
  });

  it('without rules throw Error', () => {
    try {
      let violate = new Violate();
      assert.fail(false, 'cant be here', violate);
    } catch(err) {
      assert.strictEqual(err.message, 'constructor requires rules object');
    }
  });
});

describe('validate()', () => {
  describe('no argument', () => {
    let rules = {};
    let validator = new Violate(rules);
    it('without values returns undefined', () => {
      let violations = validator.validate();
      assert.strictEqual(violations, undefined);
    });

    it('with null returns undefined', () => {
      let violations = validator.validate(null);
      assert.strictEqual(violations, undefined);
    });
  });

  describe('with argument', () => {
    let rules = {
      _: (all) => {
        let violations = [];
        if (!all.a) violations.push('a is required');
        return violations;
      },
      a: (a) => {
        if (a !== 1) return 'a should be 1';
      },
      b: (b) => {
        if (b !== 'b') return 'b should be "b"';
      }
    };

    let validator = new Violate(rules);

    it('valid', () => {
      let violations = validator.validate({ a: 1, b: 'b' });
      assert.strictEqual(violations.length, 0);
    });

    it('valid with over argument', () => {
      let violations = validator.validate({ a: 1, b: 'b', c: (a) => a });
      assert.strictEqual(violations.length, 0);
    });

    it('valid without not requied argument', () => {
      let violations = validator.validate({ a: 1 });
      assert.strictEqual(violations.length, 0);
    });

    it('invalid single argument', () => {
      let violations = validator.validate({ a: 10, b: 'b' });
      assert.strictEqual(violations.length, 1);
      assert.strictEqual(violations[0], 'a should be 1');
    });

    it('invalid multi arguments', () => {
      let violations = validator.validate({ a: 10, b: 'c' });
      assert.strictEqual(violations.length, 2);
      assert.strictEqual(violations[0], 'a should be 1');
      assert.strictEqual(violations[1], 'b should be "b"');
    });

    it('invalid required', () => {
      let violations = validator.validate({ b: 'b' });
      assert.strictEqual(violations.length, 1);
      assert.strictEqual(violations[0], 'a is required');
    });
  });
});

describe('assert()', () => {
  let consoleassert;
  before(() => {
    consoleassert = console.assert;
  });

  after(() => {
    console.assert = consoleassert;
  });

  let rules = {};
  let validator = new Violate(rules);

  describe('dont call console.assert', () => {
    console.assert = () => {
      assert.fail(true);
    };

    it('without values', () => {
      validator.assert();
    });

    it('with null', () => {
      validator.assert(null);
    });

    console.assert = consoleassert;
  });
});
