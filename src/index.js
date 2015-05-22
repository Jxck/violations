export let util = {
  _toS: (v) => Object.prototype.toString.call(v),
  isString: (v) => typeof v === 'string',
  isFunction: (v) => typeof v === 'function',
  isBoolean: (v) => typeof v === 'boolean',
  isNumber: (v) => (typeof v === 'number' || v instanceof Number) && !Number.isNaN(v),
  isInteger: (v) => typeof v === 'number' && Number.isInteger(v),
  isUndefined: (v) => typeof v === 'undefined',
  isArray: (v) => Array.isArray(v),
  isNull: (v) => v === null,
  isEmpty: (v) => util.isUndefined(v) || util.isNull(v) || v === '',
  isObject: (v) => typeof v === 'object' && !util.isArray(v) && !util.isNull(v) && !util.isDate(v) && !util.isRegExp(v) && !util.isNumber(v),
  isDate: (v) => util._toS(v) === '[object Date]',
  isRegExp: (v) => util._toS(v) === '[object RegExp]',
  isError: (v) => v instanceof Error
};

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

      return this.rules[key](value, key, util);
    }).reduce((pre, curr) => {
      // filter undefined
      if (curr === undefined) {
        return pre;
      }

      if (Array.isArray(curr) && curr.length === 0) {
        return pre;
      }

      // merge into array
      return pre.concat(curr);
    }, []);

    if (violations.length > 0) {
      return violations;
    }
  }

  assert(values) {
    //  delegate to this.validate
    let violations = this.validate(values);
    if (violations === undefined) {
      return;
    }

    // use console.assert for isomorphic
    console.assert(false, violations);
  }
}
