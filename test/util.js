let assert = require('assert');
let _ = require('../src').util;

/*eslint space-in-brackets: 0*/
/*eslint no-new-wrappers: 0*/
/*eslint no-array-constructor: 0*/
/*eslint no-new-object: 0*/
/*eslint no-new-func: 0*/
/*eslint no-new-wrappers: 0*/
/*eslint no-array-constructor: 0*/

describe('util', () => {
  it('isString', () => {
    assert(_.isString('a'));
    assert(_.isString(''));

    let values = [[], () => {}, true, 10, undefined, null, {}, new Date(), /abc/, new Error('test') ];
    values.forEach((v) => {
      assert.strictEqual(_.isString(v), false, `isString(${v})`);
    });
  });

  it('isFunction', () => {
    assert(_.isFunction(function() {}));
    assert(_.isFunction(() => {}));

    let values = ['a', [], true, 10, undefined, null, '', {}, new Date(), /abc/, new Error('test')];
    values.forEach((v) => {
      assert.strictEqual(_.isFunction(v), false, `isFunction(${v})`);
    });
  });

  it('isBoolean', () => {
    assert(_.isBoolean(true));
    assert(_.isBoolean(false));

    let values = ['a', [], () => {}, 10, undefined, null, '', {}, new Date(), /abc/, new Error('test') ];
    values.forEach((v) => {
      assert.strictEqual(_.isBoolean(v), false, `isBoolean(${v})`);
    });
  });

  it('isNumber', () => {
    assert(_.isNumber(0));
    assert(_.isNumber(1));
    assert(_.isNumber(1.1));
    assert(_.isNumber(new Number()));

    // negative
    assert(!_.isNumber(NaN));

    let values = ['a', [], () => {}, true, undefined, null, '', {}, new Date(), /abc/, new Error('test') ];
    values.forEach((v) => {
      assert.strictEqual(_.isNumber(v), false, `isNumber(${v})`);
    });
  });

  it('isInteger', () => {
    assert(_.isInteger(0));
    assert(_.isInteger(1));

    // negative
    assert(!_.isInteger(1.1));
    assert(!_.isInteger(NaN));

    let values = ['a', [], () => {}, true, undefined, null, '', {}, new Date(), /abc/, new Error('test') ];
    values.forEach((v) => {
      assert.strictEqual(_.isInteger(v), false, `isInteger(${v})`);
    });
  });

  it('isUndefined', () => {
    assert(_.isUndefined(undefined));

    let values = ['a', [], () => {}, false, 10, null, '', {}, new Date(), /abc/, new Error('test') ];
    values.forEach((v) => {
      assert.strictEqual(_.isUndefined(v), false, `isUndefined(${v})`);
    });
  });

  it('isArray', () => {
    assert(_.isArray([]));
    assert(_.isArray(new Array()));

    let values = ['a', () => {}, true, 10, undefined, null, '', {}, new Date(), /abc/, new Error('test') ];
    values.forEach((v) => {
      assert.strictEqual(_.isArray(v), false, `isArray(${v})`);
    });
  });

  it('isNull', () => {
    assert(_.isNull(null));

    let values = ['a', [], () => {}, false, 10, undefined, '', {}, new Date(), /abc/, new Error('test') ];
    values.forEach((v) => {
      assert.strictEqual(_.isNull(v), false, `isNull(${v})`);
    });
  });

  it('isEmpty', () => {
    assert(_.isEmpty(''));
    assert(_.isEmpty(null));
    assert(_.isEmpty(undefined));

    let values = ['a', [], () => {}, true, 10, {}, new Date(), /abc/, new Error('test') ];
    values.forEach((v) => {
      assert.strictEqual(_.isEmpty(v), false, `isEmpty(${v})`);
    });
  });

  it('isObject', () => {
    assert(_.isObject({}));
    assert(_.isObject({a: {}}));
    assert(_.isObject(new Object()));
    assert(_.isObject(new Error()));

    // negative
    assert(!_.isObject(null));
    assert(!_.isObject(new Date()));
    assert(!_.isObject(new RegExp()));
    assert(!_.isObject(new Function()));
    assert(!_.isObject(new Number()));
    assert(!_.isObject(new Array()));

    let values = ['a', [], () => {}, true, 10, undefined, null, '', new Date(), /abc/ ];
    values.forEach((v) => {
      assert.strictEqual(_.isObject(v), false, `isObject(${v})`);
    });
  });

  it('isDate', () => {
    assert(_.isDate(new Date()));

    let values = ['a', [], () => {}, true, 10, undefined, null, '', {}, /abc/, new Error('test') ];
    values.forEach((v) => {
      assert.strictEqual(_.isDate(v), false, `isDate(${v})`);
    });
  });

  it('isRegExp', () => {
    assert(_.isRegExp(/a/));
    assert(_.isRegExp(new RegExp()));

    let values = ['a', [], () => {}, true, 10, undefined, null, '', {}, new Date(), new Error('test') ];
    values.forEach((v) => {
      assert.strictEqual(_.isRegExp(v), false, `isRegExp(${v})`);
    });
  });

  it('isError', () => {
    assert(_.isError(new Error()));
    assert(_.isError(new EvalError()));
    assert(_.isError(new RangeError()));
    assert(_.isError(new ReferenceError()));
    assert(_.isError(new SyntaxError()));
    assert(_.isError(new TypeError()));
    assert(_.isError(new URIError()));

    let values = ['a', [], () => {}, true, 10, undefined, null, '', {}, new Date(), /abc/ ];
    values.forEach((v) => {
      assert.strictEqual(_.isError(v), false, `isError(${v})`);
    });
  });
});
