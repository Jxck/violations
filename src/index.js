function toS(v) {
  return Object.prototype.toString.call(v);
}

export let util = {
  isString: (v) => typeof v === 'string',
  isFunction: (v) => typeof v === 'function',
  isBoolean: (v) => typeof v === 'boolean',
  isNumber: (v) => (typeof v === 'number' || v instanceof Number) && !isNaN(v),
  isInteger: (v) => typeof v === 'number' && Number.isInteger(v),
  isUndefined: (v) => typeof v === 'undefined',
  isArray: (v) => Array.isArray(v),
  isNull: (v) => v === null,
  isEmpty: (v) => util.isUndefined(v) || util.isNull(v) || v === '',
  isObject: (v) => typeof v === 'object' && !util.isArray(v) && !util.isNull(v) && !util.isDate(v) && !util.isRegExp(v) && !util.isNumber(v),
  isDate: (v) => toS(v) === '[object Date]',
  isRegExp: (v) => toS(v) === '[object RegExp]',
  isError: (v) => v instanceof Error,
  // https://html.spec.whatwg.org/multipage/forms.html#valid-e-mail-address
  isEmail: (v) => /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(v)
};

export class AssertionError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AssertionError';
    this.message = message;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, argument.callee);
    } else {
      var _err = new Error();
      var _stack = _err.stack;

      if (!_stack) {
        // IE10
        try { throw _err } catch (e) { _stack = e.stack }
      }
      this.stack = _stack;
    }
  }
}

export class Violate {
  constructor(rules) {
    // validate arguments
    if (rules === undefined) {
      throw new Error('constructor requires rules object');
    }

    this.rules = rules;
  }

  validate(values) {
    // validate arguments
    if (values === null || values === undefined) {
      return;
    }

    let violations = Object.keys(this.rules).map((key) => {
      // execute rules with undefined if values not exists.
      let value = values[key];

      let rule = this.rules[key];

      // apply rule if function
      if (util.isFunction(rule)) {
        return rule(value, key, util);
      }

      // create validator if rule is object
      let v = new Violate(rule);
      return v.validate(value);
    }).reduce((pre, curr) => {
      // filter undefined
      if (curr === undefined) {
        return pre;
      }

      // filter empty array
      if (Array.isArray(curr) && curr.length === 0) {
        return pre;
      }

      // merge into array
      return pre.concat(curr);
    }, []);

    // return violations if exists
    if (violations.length > 0) {
      return violations;
    }

    // return undefined if no violations
  }

  assert(values) {
    // delegate to this.validate
    let violations = this.validate(values);
    if (violations === undefined) {
      return;
    }

    throw new AssertionError(JSON.stringify(violations));
  }
}
