joTab = function(data, value) {
	this.data = data || [];
	this.container = joDOM.create(this.tagName);
	this.value = value || 0;
	this.changeEvent = new joSubject(this);
};
joTab.extend(joControl, {
	tagName: "jotab",

	setValue: function(value) {
		this.value = value;
		this.draw();
		this.changeEvent.fire(this.value);

		return this;
	},

	draw: function() {
		if (this.container.firstChild)
			this.container.removeChild(this.container.firstChild);

		console.log(this.value);

		if (this.value >= 0 && this.value < this.data.length)
			this.container.appendChild(joDOM.get(this.data[this.value]));

		return this.container;
	}
});

