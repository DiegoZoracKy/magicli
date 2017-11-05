# MagiCLI

[![Build Status](https://api.travis-ci.org/DiegoZoracKy/magicli.svg)](https://travis-ci.org/DiegoZoracKy/magicli) [![npm](https://img.shields.io/npm/v/magicli.svg)]() [![npm](https://img.shields.io/npm/l/magicli.svg)]()

Automagically generates command-line interfaces (CLI), for any module.
Just `require('magicli')();` and your module is ready to be run via CLI.

The goal is to have any module prepared to be executed via CLI (installed globally with `-g`, or by using **npx**):

## Goals

 * Out of the box support to async functions (`Promises`, or any *thenable* lib following the Promises/A+ spec)
 * Simple API
 * Cover all possible cases of module.exports (`Function`, `Object Literal` with nested properties, etc.)

## Usage

 * `npm install magicli --save`
 * Add the property `bin` to your package.json containing the value `./bin/magicli.js`
 * Create the file `./bin/magicli.js` with the following content:

```javascript
#!/usr/bin/env node

require('magicli')();
```

**That's it!** Install your module with `-g`, or use it via **npx**, and run it with `--help`. In the same way you can just run `node ./bin/magicli.js --help` to test it quickly, without installing it.

Let's suppose that `your-module` exports the function:

```javascript
module.exports = function(param1, param2) {
    return param1 + param2;
}
```

When calling it via CLI, with `--help`, you will get:

```bash
$ your-module --help

Same description found at package.json

Usage: your-module [options]

Options:
  --param1
  --param2
  --version  Show version number                                       [boolean]
  --help     Show help                                                 [boolean]
```

the program will be expecting the parameters names as options. It doesn't need to follow the same order as defined in the function. Example:

```bash
$ your-module --param2="Z" --param1="K"
```

## How it works

MagiCLI is capable of handling many types and styles of `exports`, for example:

 * Function
 * Literal Object
 * Class with static methods
 * Class with static methods

The It will work with any kind of function declaration, e.g.:
```javascript
// An Arrow function with Destructuring assignment and Default values
const fn = ([param1, [param2]] = ['z', ['k']], { param3 }) => {};
module.exports = fn;
```