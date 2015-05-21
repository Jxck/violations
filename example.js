// RUNNNING: $ npm run example
let Violate = require('./src').Violate;

let rule = {
  name: (value, name) => {
    if (value === undefined) {
      return `${name} is required`;
    }

    if (typeof value !== `string`) {
      return `${name} should be string`;
    }

    let messages = [];
    if (value.length < 10) {
      messages.push(`${name} should longer than 10`);
    }

    if (value.match(/[a-zA-Z]*/)) {
      messages.push(`${name} should contain alphabet`);
    }

    if (value.match(/[0-9]*/)) {
      messages.push(`${name} should contain number`);
    }

    if (value.match(/(#|@|&)/)) {
      messages.push(`${name} should not contain "#", "@" "&"`);
    }

    return messages;
  },

  age: (value, name) => {
    if (value === undefined) {
      return `${name} is required`;
    }

    if (typeof value !== `number`) {
      return `${name} should be number`;
    }

    if (value < 0) {
      return `${name} should be positive value`;
    }
  }
};

let validator = new Violate(rule);

function fn(name, age) {
  // check and throw AssertionError

  console.log(`\x1b[32m
######################################################
↓↓↓  AssertionError Belows are Exepcted Behavior  ↓↓↓
######################################################
\x1b[0m`);
  validator.assert({ name: name, age: age });
  console.log(name, age);
}

function main() {
  let name = '#&';
  let age = -1;

  let violations = validator.validate({ name: name, age: age, foo: 'bar' });
  violations.forEach((violation) => {
    // use for user feedback
    console.log('\x1b[31m', violation, '\x1b[0m');
  });

  fn(name, age);
}

main();
