'use strict';

const tests = [{
	description: 'Version --version',
	input: '--version',
	output: `1.0.0`
}, {
	description: 'Help --help',
	input: '--help',
	output: `
[4;1mDescription:[0m

  Test function-simple-concat

[4;1mUsage:[0m

  $ function-simple-concat [options]

[4;1mOptions:[0m

  [1m--p1[0m
  [1m--p2[0m
`
}, {
	description: '--p1=P1 --p2=P2',
	input: '--p1=P1 --p2=2',
	output: 'P1 2'
}];

module.exports = tests;