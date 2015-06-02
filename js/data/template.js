
joTemplate = function(template, data) {
	this.setTemplate(template || "", data || {});
};
joTemplate.prototype = {
	setTemplate: function(template, data) {
		if (template && typeof template == 'object' && template instanceof Array)
			this.template = template.join(" ");
		else
			this.template = template + "";

		this.data = data || {};

		return this;
	},

	apply: function(data) {
		var str = this.template + "";

		// pretty wasteful, but this is quick/dirty
		var o = joData.union(data, this.data);

		for (var i in o) {
			var key = "{{" + i + "}}";
			var reg = new RegExp(key, "g");

			if (typeof this.data[i] === "function") {
				str = str.replace(reg, this.data[i](data) || "");
			}
			else {
				str = str.replace(reg, data[i] || "");
			}
		}

		return str;
	}
};
