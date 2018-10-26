'use strict';

const main = async function(param1, param2) {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve(`o/ ${param1} ${param2}`);
		}, 1500);
	});
};

main.methodA = async function(paramA1, paramA2) {
	return `${paramA1}=${paramA2}`;
};

main.methodB = async function() {
	return `${paramB1}-${paramB2}`;
};

Object.defineProperty(main, 'methodNonEnumerable', {
	value: async function(paramC1, paramC2) {
		return `${paramC1}-${paramC2}`;
	}
});

main.a = {
	b: async (b1, b2) => `main.a.b: ${b1} ${b2}`
};

main.a.b.c = async (c1, c2) => `main.a.b.c: ${c1} ${c2}`;
main.a.b.c['d-e'] = {};
main.a.b.c['d-e'].f = async ({f1}, [[f2 = 'F2Default']] = [[]]) => ({ f1, f2 });

module.exports = main;