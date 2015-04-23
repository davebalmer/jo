joData = {
	union: function() {
		var o = {};

		for (var i = 0; i < arguments.length; i++) {
			if (typeof arguments[i] === "object") {
				for (var j in arguments[i])
					o[j] = arguments[i][j];
			}
		}

		return o;
	},

	intersect: function(a, b) {
		var o = {};

		for (var i in a)
			o[i] = b[i];

		return o;
	},

	filter: function(a, b) {
		var o = {};

		for (var i in a) {
			if (a[i]) {
				if (typeof b[i] === "undefined"
				|| (typeof a === "string" && b[i] == "")
				|| (typeof a === "number" && b[i] < 0)) {
					return {};
				}
			}
			else {
				if (typeof a === "number")
					o[i] = 1 * b[i];
				else if (typeof a === "string")
					o[i] = "" + b[i];
				else
					o[i] = b[i];
			}
		}
	},

	test: function(a, b) {
		var o = {};

		for (var i in a) {
			if (a[i]) {
				if (typeof b[i] === "undefined"
				|| (typeof a === "string" && b[i] == "")
				|| (typeof a === "number" && b[i] < 0)) {
					o[i] = b[i];
				}
			}
		}

		return o;
	},

	validate: function(a, b) {
		var errors = 0;
		var o = this.test(a, b);

		for (var e in o)
			errors++;

		return !errors;
	}
};


function otoa(map, o) {
	var a = [];

	for (var i = 0; i < map.length; i++)
		a.push(o[map[i]]);

	return a;
}
