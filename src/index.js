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

    let requires = [];

    let passed = Object.keys(values);

    let required = Object.keys(this.rules);
    required.forEach((key) => {
      if (passed.indexOf(key) < 0) {
        requires.push(`${key} is required`);
      }
    });

    let violations = passed.map((name) => {
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
    }, []);

    return requires.concat(violations);
  }

  assert(values) {
    //  delegate to this.validate
    let violations = this.validate(values);
    if (violations === undefined) {
      return;
    }

    // actually throw first error only
    violations.forEach((violation) => {
      console.assert(false, violation);
    });
  }
}
