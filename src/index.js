export class violate {
  constructor(rules) {
    this.rules = rules;
  }

  validate(values) {
    let violations = Object.keys(values).map((name) => {
      let value = values[name];

      if (this.rules[name]) {
        return this.rules[name](value);
      }
    }).reduce((pre, curr) => {
      if (curr === undefined) {
        return pre;
      };

      return pre.concat(curr);
    }, []);

    return violations;
  }

  assert(values) {
    let violations = this.validate(values);

    // actually throw first error only
    violations.forEach((violation) => {
      console.assert(false, violation);
    });
  }
}
