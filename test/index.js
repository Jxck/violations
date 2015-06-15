let assert = require('assert');
let Violate = require('../src').Violate;

describe('new', () => {
  it('with empty rules holds empty rules', () => {
    let rules = {};
    let validator = new Violate(rules);
    assert.strictEqual(validator.rules, rules);
  });

  it('without rules holds empty rules', () => {
    let validator = new Violate();
    assert.strictEqual(JSON.stringify(validator.rules), '{}');
  });
});

describe('no argument', () => {
  let rules = {};
  let validator = new Violate(rules);

  describe('validate()', () => {
    it('without values returns undefined', () => {
      let violations = validator.validate();
      assert.strictEqual(violations, undefined);
    });

    it('with null returns undefined', () => {
      let violations = validator.validate(null);
      assert.strictEqual(violations, undefined);
    });
  });

  describe('assert()', () => {
    it('without values', () => {
      try {
        validator.assert();
      } catch(err) {
        assert.fail(true);
      }
    });

    it('with null', () => {
      try {
        validator.assert(null);
      } catch(err) {
        assert.fail(true);
      }
    });
  });
});

describe('with argument', () => {
  let rules = {
    a: (a) => {
      if (a === undefined) return 'a is required';
      if (a !== 1) return 'a should be 1';
    },
    b: (b) => {
      if (b === undefined) return; // b is optional
      if (b !== 'b') return 'b should be "b"';
    }
  };

  let validator = new Violate(rules);

  describe('validate()', () => {
    describe('success', () => {
      it('valid argument', () => {
        let violations = validator.validate({ a: 1, b: 'b' });
        assert.strictEqual(violations, undefined);
      });

      it('over argument', () => {
        let violations = validator.validate({ a: 1, b: 'b', c: (a) => a });
        assert.strictEqual(violations, undefined);
      });

      it('without not required argument', () => {
        let violations = validator.validate({ a: 1 });
        assert.strictEqual(violations, undefined);
      });
    });

    describe('fail', () => {
      it('invalid single argument', () => {
        let violations = validator.validate({ a: 10, b: 'b' });
        assert.strictEqual(violations.length, 1);
        assert.strictEqual(violations[0], 'a should be 1');
      });

      it('invalid multi arguments', () => {
        let violations = validator.validate({ a: 10, b: 'c' });
        assert.strictEqual(violations[0], 'a should be 1');
        assert.strictEqual(violations[1], 'b should be "b"');
      });

      it('invalid without required', () => {
        let violations = validator.validate({ b: 'b' });
        assert.strictEqual(violations.length, 1);
        assert.strictEqual(violations[0], 'a is required');
      });
    });
  });

  describe('assert()', () => {
    describe('success', () => {
      it('valid argument', () => {
        try {
          validator.validate({ a: 1, b: 'b' });
        } catch(err) {
          assert.fail(err);
        }
      });

      it('over argument', () => {
        try {
          validator.validate({ a: 1, b: 'b', c: (a) => a });
        } catch(err) {
          assert.fail(err);
        }
      });

      it('without not required argument', () => {
        try {
          validator.validate({ a: 1 });
        } catch(err) {
          assert.fail(err);
        }
      });
    });

    describe('fail', () => {
      it('invalid single argument', () => {
        try {
          validator.assert({ a: 10, b: 'b' });
        } catch(err) {
          let violations = JSON.parse(err.message);
          assert.strictEqual(violations.length, 1);
          assert.strictEqual(violations[0], 'a should be 1');
        }
      });

      it('invalid multi arguments', () => {
        try {
          validator.assert({ a: 10, b: 'c' });
        } catch(err) {
          let violations = JSON.parse(err.message);
          assert.strictEqual(violations.length, 2);
          assert.strictEqual(violations[0], 'a should be 1');
          assert.strictEqual(violations[1], 'b should be "b"');
        }
      });

      it('invalid without required', () => {
        try {
          validator.assert({ b: 'b' });
        } catch(err) {
          let violations = JSON.parse(err.message);
          assert.strictEqual(violations.length, 1);
          assert.strictEqual(violations[0], 'a is required');
        }
      });
    });
  });
});

describe('multiple error', () => {
  describe('validate', () => {
    it('returns list errors', () => {
      let rules = {
        a: () => {
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
        a: () => {
          return [
          ];
        }
      };

      let validator = new Violate(rules);
      let violations = validator.validate({ a: 1 });
      assert.strictEqual(violations, undefined);
    });
  });

  describe('assert', () => {
    it('returns list errors', () => {
      let rules = {
        a: () => {
          return [
            'invalid a',
            'invalid b'
          ];
        }
      };

      let validator = new Violate(rules);

      try {
        validator.assert({ a: 1 });
      } catch(err) {
        let violations = JSON.parse(err.message);
        assert.strictEqual(violations.length, 2);
      }
    });

    it('return empty errors', () => {
      let rules = {
        a: () => {
          return [
          ];
        }
      };

      let validator = new Violate(rules);

      try {
        validator.assert({ a: 1 });
      } catch(err) {
        assert.fail(err);
      }
    });
  });
});

describe('nested object', () => {
  let target = {
    a: 'a',
    b: {
      c: 'c',
      d: 'd'
    }
  };

  let rules = {
    a: (v) => {
      if (v !== 'a') return 'a should "a"';
    },
    b: {
      c: (v) => {
        if (v !== 'c') return 'c should "c"';
      },
      d: (v) => {
        if (v !== 'd') return 'd should "d"';
      }
    }
  };

  let validator = new Violate(rules);

  it('valid', () => {
    let violations = validator.validate(target);
    assert.strictEqual(violations, undefined);
  });

  it('validate fail', () => {
    let violations = validator.validate({ a: 0, b: { c: 0, d: 0 }});
    assert.deepEqual(violations, [ 'a should "a"', 'c should "c"', 'd should "d"' ]);
  });

  it('assert fail', () => {
    try {
      validator.assert({ a: 0, b: { c: 0, d: 0 }});
    } catch(e) {
      assert.deepEqual(JSON.parse(e.message), [ 'a should "a"', 'c should "c"', 'd should "d"' ]);
    }
  });
});
