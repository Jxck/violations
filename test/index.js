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
      a: (a) => {
        if (a === undefined) return 'a is required';
        if (a !== 1) return 'a should be 1';
      },
      b: (b) => {
        if (b === undefined) return 'b is required';
        if (b !== 'b') return 'b should be "b"';
      }
    };

    let validator = new Violate(rules);

    it('valid', () => {
      let violations = validator.validate({ a: 1, b: 'b' });
      assert.strictEqual(violations, undefined);
    });

    it('valid with over argument', () => {
      let violations = validator.validate({ a: 1, b: 'b', c: (a) => a });
      assert.strictEqual(violations, undefined);
    });

    it('valid without not requied argument', () => {
      let violations = validator.validate({ a: 1 });
      assert.strictEqual(violations, undefined);
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
      ((a, b) => {
        let violations = validator.validate({ a: a, b: b });
        assert.strictEqual(violations.length, 1);
        assert.strictEqual(violations[0], 'b is required');
      })(1);
    });
  });

  describe('multiple error', () => {
    it('returns list errors', () => {
      let rules = {
        a: (a) => {
          return [
            'invalid a',
            'invalid b'
          ];
        }
      };

      let validator = new Violate(rules);
      let violations = validator.validate({ a: 1 });
      assert.strictEqual(violations.length, 2);
    });

    it('return empty errors', () => {
      let rules = {
        a: (a) => {
          return [
          ];
        }
      };

      let validator = new Violate(rules);
      let violations = validator.validate({ a: 1 });
      assert.strictEqual(violations, undefined);
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
