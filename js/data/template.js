
joTemplate = function(template) {
	this.setTemplate(template || "");
};
joTemplate.prototype = {
	setTemplate: function(template) {
		if (template && typeof template == 'object' && template instanceof Array)
			this.template = template.join(" ");
		else
			this.template = template + "";

		return this;
	},

	apply: function(data) {
		var str = this.template + "";

		// pretty wasteful, but this is quick/dirty
		for (var i in data) {
			var key = "__" + i + "__";
			var reg = new RegExp(key, "g");
			str = str.replace(reg, data[i]);
		}

		return str;
	}
};
