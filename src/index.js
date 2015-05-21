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

    let violations = Object.keys(values).map((key) => {
      // execute rules if exists to value
      let value = values[key];

      if (this.rules[key]) {
        return this.rules[key](value, key);
      }
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
