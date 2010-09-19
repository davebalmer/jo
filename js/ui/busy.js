/**
	joBusy
	======
	
	The idea here is to make a generic "spinner" control which you
	can overlay on other controls. It's still in flux, don't use it
	just yet.
	
	Extends
	-------
	
	- joView
	
	Methods
	-------
	
	- `setMessage('Status')`
*/
	
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
