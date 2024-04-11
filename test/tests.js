'use strict';

var inspect = require('object-inspect');
var forEach = require('for-each');
var v = require('es-value-fixtures');

module.exports = function (groupBy, t) {
	t.test('callback function', function (st) {
		forEach(v.nonFunctions, function (nonFunction) {
			st['throws'](
				function () { groupBy([], nonFunction); },
				TypeError,
				inspect(nonFunction) + ' is not a function'
			);
		});

		st.end();
	});

	t.test('grouping', function (st) {
		st.deepEqual(
			groupBy([], function () { return 'a'; }),
			{ __proto__: null },
			'an empty array produces an empty object'
		);

		var arr = [0, -0, 1, 2, 3, 4, 5, NaN, Infinity, -Infinity];
		var parity = function (x) {
			if (x !== x) {
				return void undefined;
			}
			if (!isFinite(x)) {
				return '∞';
			}
			return x % 2 === 0 ? 'even' : 'odd';
		};
		var grouped = {
			__proto__: null,
			even: [0, -0, 2, 4],
			odd: [1, 3, 5],
			undefined: [NaN],
			'∞': [Infinity, -Infinity]
		};
		st.deepEqual(
			groupBy(arr, parity),
			grouped,
			inspect(arr) + ' group by parity groups to ' + inspect(grouped)
		);

		st.deepEqual(
			groupBy(arr, function (x, i) {
				st.equal(this, undefined, 'receiver is as expected'); // eslint-disable-line no-invalid-this
				st.equal(x, arr[i], 'second argument ' + i + ' is ' + inspect(arr[i]));
				return 42;
			}),
			{ __proto__: null, 42: arr },
			'thisArg and callback arguments are as expected'
		);

		st.test('strings', function (s2t) {
			var obj = groupBy('abcd💩', function (char) {
				return char < 'c' ? 'before' : 'after';
			});

			s2t.deepEqual(
				obj,
				{
					__proto__: null,
					before: ['a', 'b'],
					after: ['c', 'd', '💩']
				},
				'grouping a string works as expected'
			);

			var string = '🥰💩🙏😈';
			var obj2 = groupBy(string, function (char) {
				return char < '🙏' ? 'before' : 'after';
			});

			s2t.deepEqual(obj2, { __proto__: null, after: ['🥰', '🙏'], before: ['💩', '😈'] });

			s2t.end();
		});

		st.end();
	});
};
