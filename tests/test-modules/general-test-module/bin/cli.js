#!/usr/bin/env node

'use strict';

require('../../../../')({
	commands: {
		'a-b-c-d-e-f': {
			options: [{
				name: 'f1',
				required: true
			}],
			pipe: {
				after: JSON.stringify
			}
		},
		'general-test-module': {
			pipe: {
				stdin: (stdinValue, args) => {
					args.param2 = stdinValue;
					return args;
				},
				after: JSON.stringify
			}
		}
	},
	validateRequiredParameters: true,
	enumerability: 'all',
	help: {
		option: 'modulehelp',
		stripAnsi: true
	},
	version: {
		option: 'moduleversion'
	},
	pipe: {
		after: result => `${result}\n=========`
	}
});