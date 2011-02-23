/**
	joPopup
	=======
	
	A simple popup control. Pass in the UI contents as you would
	any other subclass of joContainer (e.g. joCard).
	
	Methods
	-------
	
	- `show()`
	- `hide()`
	
	  These do what you'd expect.

	Extends
	-------

	- joContainer
	
	Events
	------
	
	- `showEvent`
	- `hideEvent`
	

*/

joPopup = function() {
	this.showEvent = new joSubject(this);
	this.hideEvent = new joSubject(this);
	
	joContainer.apply(this, arguments);
};
joPopup.extend(joContainer, {
	tagName: "jopopup",

	setEvents: function() {
		joEvent.on(this.container, "mousedown", this.onClick, this);
	},
	
	onClick: function(e) {
		joEvent.stop(e);
	},
	
	hide: function() {
		joEvent.on(this.container, "webkitTransitionEnd", this.onHide, this);
		this.container.className = 'hide';
		
		return this;
	},
	
	onHide: function() {
		this.hideEvent.fire();
	},
	
	show: function() {
		this.container.className = 'show';
		this.showEvent.fire();
		
		return this;
	}
});
