let assert = require('assert');
let violate = require('../src').violate;

describe('new', () => {
  it('with rule', () => {
    let rules = {};
    let validator = new violate(rules);
    assert.strictEqual(validator.rules, rules);
  });

  it('without rules throw Error', () => {
    try {
      new violate();
    } catch(err) {
      assert.strictEqual(err.message, 'new violate requires rules object');
    }
  });
});

describe('validate', () => {
  let rules = {};
  let validator = new violate(rules);
  it('without values returns undefined', () => {
    let violations = validator.validate();
    assert.strictEqual(violations, undefined);
  });

  it('with null returns undefined', () => {
    let violations = validator.validate(null);
    assert.strictEqual(violations, undefined);
  });
});

describe('node', () => {
  describe('assert', () => {
    let rules = {};
    let validator = new violate(rules);

    it('without values doesnt throw AssertionError', () => {
      try {
        validator.assert();
      } catch(err) {
        assert.fail(false);
      }
    });

    it('with null doesnt throw AssertionError', () => {
      try {
        validator.assert(null);
      } catch(err) {
        assert.fail(false);
      }
    });
  });
});
