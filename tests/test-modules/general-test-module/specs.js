'use strict';

const tests = [{
	description: 'Version with different option --moduleversion',
	input: '--moduleversion',
	output: `0.0.1`
}, {
	description: 'Help with different option --modulehelp + help.stripAnsi = true + non-enumerable method',
	input: '--modulehelp',
	output: `
Description:

  general-test-module description

Usage:

  $ general-test-module [options]
  $ general-test-module [command]

Options:

  --param1
  --param2

Commands:

  methodA
  methodB
  methodNonEnumerable
  a-b
  a-b-c
  a-b-c-d-e-f
`
},{
	description: 'Async + STDIN',
	stdin: 'echo "PARAM2" | ',
	input: '--param1=111',
	output: `"o/ 111 PARAM2"
=========`
}, {
	description: 'Method non-enumerable --modulehelp',
	input: 'methodNonEnumerable --modulehelp',
	output: `
Usage:

  $ general-test-module methodNonEnumerable [options]

Options:

  --paramC1
  --paramC2
`
}, {
	description: 'Method non-enumerable call',
	input: 'methodNonEnumerable --paramC1=val1 --paramC2=val2',
	output: `val1-val2
=========`
}, {
	description: 'Nested method with no required options',
	input: 'a-b-c --modulehelp',
	output: `
Usage:

  $ general-test-module a-b-c [options]

Options:

  --c1
  --c2
`
}, {
	description: 'Nested method with required options',
	input: 'a-b-c-d-e-f --modulehelp',
	output: `
Usage:

  $ general-test-module a-b-c-d-e-f <options>

Options:

  --f1    Required
  --f2
`
}, {
	description: 'Nested method without one required options',
	input: 'a-b-c-d-e-f --f2=2',
	output: `
Usage:

  $ general-test-module a-b-c-d-e-f <options>

Options:

  --f1    Required
  --f2
`
}, {
	description: 'Nested method passing only the required option',
	input: 'a-b-c-d-e-f --f1=2',
	output: `{"f1":2,"f2":"F2Default"}
=========`
}];

module.exports = tests;