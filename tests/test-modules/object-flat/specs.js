'use strict';

const tests = [{
	description: 'Version --version',
	input: '--version',
	output: `0.0.0`
},{
	description: 'Help --help',
	input: '--help',
	output: `
[4;1mDescription:[0m

  Test object-flat

[4;1mUsage:[0m

  $ object-flat <command>

[4;1mCommands:[0m

  methodA
  methodB
`
}, {
	description: 'methodA --help',
	input: 'methodA --help',
	output: `
[4;1mUsage:[0m

  $ object-flat methodA [options]

[4;1mOptions:[0m

  [1m--param1[0m
  [1m--param2[0m
`
}, {
	description: 'methodB --help',
	input: 'methodB --help',
	output: `
[4;1mUsage:[0m

  $ object-flat methodB [options]

[4;1mOptions:[0m

  [1m--param1[0m
  [1m--param2[0m
`
}, {
	description: 'methodA --param2="Z" --param1="K"',
	input: 'methodA --param2="Z" --param1="K"',
	output: `K-Z`
}, {
	description: 'methodB --param1=3 --param2=2',
	input: 'methodB --param1=3 --param2=2',
	output: `1`
}];

module.exports = tests;