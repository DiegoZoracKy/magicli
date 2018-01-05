#!/usr/bin/env node

'use strict'

const { name, description, version } = require('../package.json');
const path = require('path');
const fs = require('fs');

if (!process.argv[2]) {
	console.error('The first argument must be the path to a module or to a .js file');
	return;
}

const modulePath = path.resolve(process.argv[2]);
if (!fs.existsSync(modulePath)) {
	console.error('The first argument must be a valid path to a module or to a .js file');
	return;
}

process.argv = [process.argv[0], ...process.argv.slice(2)];
require('../')({ modulePath });