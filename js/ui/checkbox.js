joCheckbox = function() {
	joInput.apply(this, arguments);
	this.container.setAttribute("type", "checkbox");
};

joCheckbox.extend(joInput, {
	tagName: "input",
	setValue: function(v) {
		joInput.prototype.setValue.call(this, !!v);
	}
});
