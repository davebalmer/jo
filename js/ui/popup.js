/**
	joPopup
	=======
	
	A simple popup control.
	
	Methods
	-------
	
	- `show()`
	- `hide()`
	
	  These do what you'd expect
	
	Extends
	-------
	
	- joContainer

*/

joPopup = function() {
	this.showEvent = new joSubject(this);
	this.hideEvent = new joSubject(this);
	
	joContainer.apply(this, arguments);
};
joPopup.extend(joContainer, {
	tagName: "jopopup",
	
	hide: function() {
		joEvent.on(this.container, "webkitTransitionEnd", this.onHide, this);
		
		this.container.className = 'hide';
	},
	
	onHide: function() {
		this.hideEvent.fire();
	},
	
	show: function() {
		this.container.className = 'show';
		this.showEvent.fire();
	}
});
