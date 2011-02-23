/**
	- - -

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
	
	- `setMessage(status)`
	
	  You can update the status message in this busy box so users
	  have a better idea why the busy box is showing.
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
		
		return this;
	},
	
	setEvents: function() {
		return this;
	}
});
