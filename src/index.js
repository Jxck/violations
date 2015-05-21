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

    let violations_all = [];

    // executre `_` first if exists
    if (this.rules._) {
      violations_all = this.rules._(values);
    }

    let violations_keys = Object.keys(values).map((key) => {
      // execute rules if exists to value
      let value = values[key];

      if (this.rules[key]) {
        return this.rules[key](value);
      }
    }).reduce((pre, curr) => {
      // filter undefined
      if (curr === undefined) {
        return pre;
      }

      // merge into array
      return pre.concat(curr);
    }, []);

    return violations_all.concat(violations_keys);
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
