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

    let violations = this.rules._(values);

    violations = Object.keys(values).map((name) => {
      // execute rules if exists to value
      let value = values[name];

      if (this.rules[name]) {
        return this.rules[name](value);
      }
    }).reduce((pre, curr) => {
      // filter undefined
      if (curr === undefined) {
        return pre;
      }

      // merge into array
      return pre.concat(curr);
    }, []).concat(violations);

    return violations;
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
