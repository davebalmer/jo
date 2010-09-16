joBusy = function(data) {
	joContainer.apply(this, arguments);
};
joBusy.extend(joContainer, {
	tagName: "jobusy",
	
	draw: function() {
		this.container.innerHTML = "";
		for (var i = 0; i < 9; i++)
			this.container.appendChild(joDom.create("jobusyblock"));
	},
	
	setMessage: function(msg) {
		this.message = msg || "";
	},
	
	setEvents: function() {
		return this;
	}
});
