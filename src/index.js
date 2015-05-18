class violate {
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

let rule = {
  name: (name) => {
    if (typeof name !== 'string') {
      return 'name should be string';
    }

    let messages = [];
    if (name.length < 10) {
      messages.push('name should longer than 10');
    }

    if (name.match(/[a-zA-Z]*/)) {
      messages.push('name should contain alphabet');
    }

    if (name.match(/[0-9]*/)) {
      messages.push('name should contain number');
    }

    if (name.match(/(#|@|&)/)) {
      messages.push('name should not contain "#", "@" "&"');
    }

    if (messages.length > 0) {
      return messages;
    }
  },

  age: (age) => {
    if (typeof age !== 'number') {
      return 'age should be number';
    }

    if (age < 0) {
      return 'age should be positive value';
    }
  }
}

let validator = new violate(rule);

function fn(name, age) {
  validator.assert({ name: name, age: age });
  console.log(name, age);
}

function main() {
  let name = '#&';
  let age = -1;

  let violations = validator.validate({ name: name, age: age, foo: 'bar' });
  violations.forEach((violation) => {
    console.log('\x1b[31m', violation, '\x1b[0m');
  });

  fn(name, age);
}

main();
