#!/usr/bin/env node

'use strict';

const fs = require('fs');
const path = require('path');
const forEachProperty = require('for-each-property');
const inspectProperty = require('inspect-property');
const cliss = require('cliss');
const findUp = require('find-up');

function requireMainModule(currentPath) {
	let packageJson = path.resolve(path.join(currentPath, '/package.json'));

	if (!fs.existsSync(packageJson)) {
		packageJson = findUp.sync('package.json', {
			cwd: packageJson
		});
	}

	const modulePath = path.dirname(packageJson);
	return {
		moduleRef: require(modulePath),
		packageJson: require(packageJson)
	};
}

function magicli({ commands = {}, validateRequiredParameters = false, help = {}, version = {}, pipe = {}, enumerability = 'enumerable', subcommandDelimiter = '-', modulePath } = {}) {
	const { moduleRef, packageJson } = requireMainModule(modulePath || require.main.filename);
	const moduleName = packageJson.name;
	const moduleVersion = packageJson.version;
	const moduleDescription = packageJson.description;
	const moduleApi = inspectProperty(moduleRef, null, { enumerability, delimiter: subcommandDelimiter, inspectProperties: true });

	// CLIss cliSpec
	const cliSpec = { name: moduleName, version: moduleVersion, description: moduleDescription };

	// Main command
	if (moduleApi.type === 'function') {
		cliSpec.action = moduleApi.functionInspection.fn;

		if (commands[moduleName]) {
			Object.assign(cliSpec, commands[moduleName]);
		}
	}

	// Subcommands
	forEachProperty(moduleApi.properties, (value, key) => {
		if (value.type !== 'function' || value.isClass) {
			return;
		}

		cliSpec.commands = cliSpec.commands || [];
		const subcommand = {
			name: key,
			action: value.functionInspection.fn
		};

		if (commands[subcommand.name]) {
			Object.assign(subcommand, commands[subcommand.name]);
		}

		cliSpec.commands.push(subcommand);
	});

	cliss(cliSpec, { options: { validateRequiredParameters }, help, version, pipe });
}

module.exports = magicli;