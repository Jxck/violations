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

      return this.rules[key](value, key);
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

    if (violations.length === 1) {
      return violations[0];
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
