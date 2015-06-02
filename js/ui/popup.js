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
		console.log("hide");
//		joGesture.backEvent.release(this.hide, this);

		joEvent.on(this.container, joEvent.map.transitionend, this.onHide, this);
		this.container.className = 'hide';
//		joDefer(function() {
//		}, this);

		return this;
	},

	onHide: function() {
		console.log("onhide");
		joEvent.remove(this.container, joEvent.map.transitionend, this.onHide, this);
		this.hideEvent.fire();
	},

	onShow: function() {
		console.log("onshow");
		joEvent.remove(this.container, joEvent.map.transitionend, this.onShow, this);
		this.showEvent.fire();
	},

	show: function() {
		console.log("show");
		joEvent.remove(this.container, joEvent.map.transitionend, this.onShow, this);
		this.container.className = 'show';
//		joDefer(function() {
			this.showEvent.fire();
//		}, this);

//		joGesture.backEvent.capture(this.hide, this);

		return this;
	}
});
