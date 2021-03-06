# Violations

## description

get violated arguments for validation and assertion.
this helps `design by contract` principle for publish API.


## Usage

1, write your function, and decide a parameter type.

```js
/**
 * @param {string} name
 * @param {number} age
 */
function login(name, age) {
  // logic
}
```


2, write a rule for parameter, and create validator.

```js
let Violate = require('violations').Violate;

let rule = {
  name: (val) => {
    if (val === undefined) {
      return 'name is required';
    }
  },
  age: (val) => {
    if (val === undefined) {
      return 'age is required';
    }

    if (val < 0) {
      return 'name should larger than 0';
    }
  }
}

let validator = new Violate(rule);
```


3, assert parameter before logic, for avoid programmer error.

```js
/**
 * @param {string} name
 * @param {number} age
 */
function login(name, age) {
  validator.assert({ name: name, age: age });

  // logic
}
```

4, allow user to use validator before calling function.

```js
function main() {
  let name = input.params.name;
  let age = input.params.age;


  let violations = validator.validate({ name: name, age: age });
  if (violations) {
    violations.forEach((message) => {
      user.feedback(message);
    });

    return;
  }

  login(name, age);
}
```

if `validator.assert()` failed, it throws [`AssertionError`](https://github.com/Jxck/violations/blob/master/src/index.js#L23).

## API

### paramter

paramter for rules passed 3 args.

- val: value of param
- name: name of param
- \_: utility function

```js
let rule = {
  param: (val, name, _) => {
    if (_.isUndefined(value)) {
      return `${name} is required`;
    }
  }
}
```


### return errors

return single errors

```js
let rule = {
  param: (val, name, _) => {
    if (_.isUndefined(value)) {
      return `${name} is required`;
    }
  }
}

let violations = (new Violate(rule)).validate({ param: undefined });
cosnole.log(violations); // [ 'param is required' ]
```

return multiple errors

```js
let rule = {
  param: (val, name, _) => {
    let messages = [];
    if (value.length < 10) {
      messages.push(`${name} should longer than 10`);
    }

    if (value.match(/[0-9]*/)) {
      messages.push(`${name} should contain number`);
    }
  }
}

let violations = (new Violate(rule)).validate({ param: 'aaa' });
cosnole.log(violations); // [ 'param should longer than 10', 'param should contain number' ]
```

no errors

```js
let rule = {
  param: (val, name, _) => {
    if (_.isUndefined(value)) {
      return `${name} is required`;
    }
  }
}

let violations = (new Violate(rule)).validate({ param: 'a' });
cosnole.log(violations); // undefined
```

## optional parameter

if parameter is optional, write rule like this.


```js
let rule = {
  param: (val, name, _) => {
    if (_.isUndefined(value)) {
      return; // optional
    }
  }
}
```

## nested rules

if object was nested, write rule like this.

```js
let target = {
  a: 'a',
  b: {
    c: 'c',
    d: 'd'
  }
};

let rules = {
  a: (v) => {
    if (v !== 'a') return 'a should "a"';
  },
  b: {
    // nested
    c: (v) => {
      if (v !== 'c') return 'c should "c"';
    },
    d: (v) => {
      if (v !== 'd') return 'd should "d"';
    }
  }
}
```

## utility function

- isString
- isFunction
- isBoolean
- isNumber (not NaN)
- isInteger
- isUndefined
- isArray
- isNull
- isEmpty (undefined or null or '')
- isObject (object not null, Array, Date, RegExp, Number)
- isDate
- isRegExp
- isError (instanceof Error)
- isEmail (based on [whatwg regexp](https://html.spec.whatwg.org/multipage/forms.html#valid-e-mail-address))

## CHANGELOG

- v0.1.0: throw AssertionError if `assert()` failed instead of calling `console.assert()`

## License

MIT
