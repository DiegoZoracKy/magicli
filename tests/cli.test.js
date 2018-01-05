'use strict';

const assert = require('assert');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

const testsPath = path.resolve(__dirname, './test-modules');
const tests = [
	'function-simple-concat',
	'object-flat'
];

tests.forEach(test => {
	describe(`CLI :: ${test}`, function() {
		const modulePath = path.resolve(testsPath, test);
		const moduleCliPath = path.resolve(__dirname, '../bin/cli.js') + ' ' + modulePath;
		const specs = require(path.resolve(modulePath, 'specs.js'));

		specs.forEach(spec => {
			const { input, output, description, stdin } = spec;

			it(description || input, function() {
				return execCli(moduleCliPath, input, stdin).then(result => assert.equal(result, output));
			});
		});
	});
});

function execCli(moduleCliPath, args, stdin = '') {
	return new Promise((resolve, reject) => {
		const cmd = `${stdin} node ${moduleCliPath} ${args}`;
		exec(cmd, (err, stdout, stderr) => {
			if (err || stderr) {
				return reject(err || stderr);
			}

			resolve(stdout.replace(/ +$/gm, '').replace(/\n$/, ''));
		}).stdin.end();
	});
}