# MagiCLI

[![Build Status](https://api.travis-ci.org/DiegoZoracKy/magicli.svg)](https://travis-ci.org/DiegoZoracKy/magicli) [![npm](https://img.shields.io/npm/v/magicli.svg)]() [![npm](https://img.shields.io/npm/l/magicli.svg)]()

Automagically generates command-line interfaces (CLI), for any module.
Just `require('magicli')();` and your module is ready to be executed via CLI.

The main goal is to have any module prepared to be executed via CLI (installed globally with `-g`, or by using **npx**):

## Goals

 * Minimal setup (*one line*)
 * Automatic options names based on functions parameters
 * Out of the box support to async functions (`Promises`, or any *thenable* lib)
 * A specific help section for each nested property (*"subcommands"*)
 * *Name*, *Description* and *Version* extracted from package.json
 * Simple API to hook into the execution flow (*stdin*, *before*, *after*)
 * Cover all possible cases of module.exports (*Function*, *Object* with nested properties, Destructuring parameters)

## Usage (the most simple and minimal way)

 * `npm install magicli`
 * Add the property **bin** to your package.json containing the value **./bin/magicli.js**
 * Create the file **./bin/magicli.js** with the following content:

```javascript
#!/usr/bin/env node

require('magicli')();
```

**Done!** Install your module with `-g`, or use it via **[npx](http://blog.npmjs.org/post/162869356040/introducing-npx-an-npm-package-runner)**, and run it with `--help` to see the result. The `--version` option will show the same value found at *package.json*. In the same way you can just run `node ./bin/magicli.js --help` to test it quickly, without installing it.

Let's suppose that **your-module** exports the function:

```javascript
module.exports = function(param1, param2) {
    return param1 + param2;
}
```

When calling it via CLI, with `--help`, you will get:

```bash
Description:

  Same description found at package.json

Usage:

  $ your-module [options]

Options:

  --param1
  --param2
```

The program will be expecting options with the same name as the parameters declared at the exported function, and it doesn't need to follow the same order. Example:

`$ your-module --param2="K" --param1="Z"` would result in: `ZK`.

### How it works

MagiCLI is capable of handling many styles of `exports`, like:

 * Functions
 * Object Literal
 * Nested properties
 * Class with static methods

And also any kind of parameters declaration (*Destructuring Parameters*, *Rest Parameters*).

If **your-module** were like this:
```javascript
// An Arrow function with Destructuring assignment and Default values
const mainMethod = ([p1, [p2]] = ['p1Default', ['p2Default']], { p3 = 'p3Default' } = {}) => `${p1}-${p2}-${p3}`;

// Object Literal containing a nested method
module.exports = {
	mainMethod,
	nested: {
		method: param => `nested method param value is: "${param}`
	}
};
```

`$ your-module --help` would result in:

```bash
Description:

  Same description found at package.json

Usage:

  $ your-module <command>

Commands:

  mainMethod
  nested-method
```

`$ your-module mainMethod --help` would be:

```bash
Usage:

  $ your-module mainMethod [options]

Options:

  --p1
  --p2
  --p3
```

`$ your-module nested-method --help` returns:

```bash
Usage:

  $ your-module nested-method [options]

Options:

  --param
```

Calling *mainMethod* without any parameter:
`$ your-module mainMethod`

results in:
` p1Default-p2Default-p3Default`

While defining the parameter for *nested-method*:
`$ your-module mainMethod nested-method --param=paramValue`

would return:
` nested method param value is: "paramValue"`

Note: Nested methods/properties will be turned into commands separated by `-`, and it can be configurable via options (`subcommandDelimiter`).

## Usage Options
`magicli({ commands = {}, validateRequiredParameters = false, help = {}, version = {}, pipe = {}, enumerability = 'enumerable', subcommandDelimiter = '-'})`

Options are provided to add more information about commands and its options, and also to support a better control of a command execution flow, without the need to change the source code of the module itself (for example, to `JSON.stringify` an `Object Literal` that is returned).



### enumerability

By default, only the enumerable nested properties will be considered. The possible values are: `'enumerable'` (default), `'nonenumerable'` or `'all'`.

### validateRequiredParameters
MagiCLI can validate the required parameters for a command and show the help in case some of them are missing. The default value is `false`.

### help

**help.option**
To define a different option name to show the help section. For example, if `'modulehelp'` is chosen, `--modulehelp` must be used instead of `--help` to show the help section.

**help.stripAnsi**
	Set to `true` to strip all ansi escape codes (colors, underline, etc.) and output just a raw text.



### version
**version.option**
To define a different option name to show the version. For example, if `'moduleversion'` is chosen, `--moduleversion` must be used instead of `--version` to show the version number.

### pipe (stdin, before and after)

The pipeline of a command execution is:

**stdin** (command.pipe.stdin || magicliOptions.pipe.stdin) =>

**magicliOptions.pipe.before** =>

**command.pipe.before** =>

**command.action** (the method in case) =>

**command.pipe.after** =>

**magicliOptions.pipe.after** =>

**stdout**

Where each of these steps can be handled if needed.

As it can be defined on *commands* option, for each command, **pipe** can also be defined in *options* to implement a common handler for all commands. The expected properties are:

**pipe.stdin**
`(stdinValue, args, positionalArgs, argsAfterEndOfOptions)`

Useful to get a value from *stdin* and set it to one of the expected *args*.

**pipe.before**
`(args, positionalArgs, argsAfterEndOfOptions)`

To transform the data being input, before it is passed in to the main command action.

**pipe.after**
`(result, parsedArgs, positionalArgs, argsAfterEndOfOptions)`

Note: **stdin** and **before** must always return *args*, and **after** must always return *result*, as these values will be passed in for the next function in the pipeline.

### commands
The options are effortlessly extracted from the parameters names, however it is possible to give more information about a command and its options, and also give instructions to the options parser.

**commands** expects an `Object Literal` where each key is the command name. It would be the module's name for the main function that is exported, and the command's name as it is shown at the *Commands:* section of `--help`. For example:
```javascript
commands: {
    'mainmodulename': {},
    'some-nested-method': {}
}
```

For each command the following properties can be configurable:

#### options
Is an *Array* of *Objects*, where each contains:

**name** (*required*)
The name of the parameter that will be described

**required**
To tell if the parameter is required.

**description**
To give hints or explain what the option is about.

**type**
To define how the parser should treat the option (Array, Object, String, Number, etc.).  Check [yargs-parser](https://github.com/yargs/yargs-parser) for instructions about *type*, as it is the engine being used to parse the options.

**alias**
To define an alias for the option.

#### pipe (stdin, before and after)

The pipeline of a command execution is:

**stdin** (command.pipe.stdin || magicliOptions.pipe.stdin) =>

**magicliOptions.pipe.before** =>

**command.pipe.before** =>

**command.action** (the method in case) =>

**command.pipe.after** =>

**magicliOptions.pipe.after** =>

**stdout**

Where each of these steps can be handled if needed.

As it can be defined on *options* to implement a common handler for all commands, **pipe** can also be defined for each command.

**pipe.stdin**
`(stdinValue, args, positionalArgs, argsAfterEndOfOptions)`

Useful to get a value from *stdin* and set it to one of the expected *args*.

**pipe.before**
`(args, positionalArgs, argsAfterEndOfOptions)`

To transform the data being input, before it is passed in to the main command action.

**pipe.after**
`(result, parsedArgs, positionalArgs, argsAfterEndOfOptions)`

Note: **stdin** and **before** must always return *args*, and **after** must always return *result*, as these values will be passed in for the next function in the pipeline.

If needed, a more thorough guide about this section can be found at [cliss](https://github.com/DiegoZoracKy/cliss) (as this is the module under the hood to handle that)

A full featured use of the module would look like:

```javascript
magicli({
	commands,
	enumerability,
	subcommandDelimiter,
	validateRequiredParameters,
	help: {
		option,
		stripAnsi
	},
	version: {
		option
	},
	pipe: {
		stdin: (stdinValue, args, positionalArgs, argsAfterEndOfOptions) => {},
		before: (args, positionalArgs, argsAfterEndOfOptions) => {},
		after: (result, parsedArgs, positionalArgs, argsAfterEndOfOptions) => {}
	}
});
```

## Example

To better explain with an example, let's get the following module and configure it with MagiCLI to:

 * Define **p1** as `String` (*mainMethod*)
 * Write a description for **p2** (*mainMethod*)
 * Define **p3** as required (*mainMethod*)
 * Get **p2** from stdin (*mainMethod*)
 * Use **before** (command) to upper case **param** (*nested-method*)
 * Use **after** (command) to JSON.stringify the result of (*nested-method*)
 * Use **after** (options) to decorate all outputs (*nested-method*)

**module** ("main" property of package.json)
```javascript
'use strict';

module.exports = {
	mainMethod: (p1, p2, { p3 = 'p3Default' } = {}) => `${p1}-${p2}-${p3}`,
	nested: {
		method: param => {

			// Example of a Promise being handled
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					resolve({ param });
				}, 2000);
			});
		}
	}
};
```

**magicli.js** ("bin" property of package.json)
```javascript
#!/usr/bin/env node


require('../magicli')({
	commands: {
		'mainMethod': {
			options: [{
				name: 'p1',
				description: 'Number will be converted to String',
				type: 'String'
			}, {
				name: 'p2',
				description: 'This parameter can be defined via stdin'
			}, {
				name: 'p3',
				required: true
			}],
			pipe: {
				stdin: (stdinValue, args, positionalArgs, argsAfterEndOfOptions) => {
					args.p2 = stdinValue;
					return args;
				}
			}
		},
		'nested-method': {
			options: [{
				name: 'param',
				description: 'Wait for it...'
			}],
			pipe: {
				before: (args, positionalArgs, argsAfterEndOfOptions) => {
					if (args.param) {
						args.param = args.param.toUpperCase();
					}
					return args;
				},

				after: JSON.stringify
			}
		}
	},
	pipe: {
		after: (result, positionalArgs, argsAfterEndOfOptions) => `======\n${result}\n======`
	}
});
```

## Tests

There is another repository called [MagiCLI Test Machine](https://github.com/DiegoZoracKy/magicli-test-machine), where many real published modules are being successfully tested. As the idea is to keep increasing the number of real modules tested, it made more sense to maintain a separated repository for that, instead of being constantly increasing the size of MagiCLI itself over time. I ask you to contribute with the growing numbers of those tests by adding your own module there via a pull request.

If you find some case that isn't being handled properly, please open an *issue* or feel free to create a PR ;)
