/**
	joShim
	======
	
	A simple screen dimmer. Used mostly for popups and other
	modal use cases.

	Methods
	-------
	- `show()`
	- `hide()`

	  These do what you'd expect.
	
	Extends
	-------
	- joView
	
	Events
	------
	
	- `showEvent`
	- `hideEvent`

*/

joShim = function() {
	this.showEvent = new joSubject(this);
	this.hideEvent = new joSubject(this);
	this.selectEvent = new joSubject(this);
	
	joContainer.apply(this, arguments);
};
joShim.extend(joContainer, {
	tagName: "joshim",
	
	setEvents: function() {
		joEvent.on(this.container, "click", this.onClick, this);
	},
	
	onClick: function(e) {
		joEvent.stop(e);
		this.selectEvent.fire();
	},
	
	hide: function() {
		this.container.className = '';
		joEvent.on(this.container, "webkitTransitionEnd", this.onHide, this);
	},
	
	show: function() {
		this.attach();

		this.container.className = 'show';
		joEvent.on(this.container, "webkitTransitionEnd", this.onShow, this);

		// default parent to the document body
		if (!this.lastParent)
			this.lastParent = document.body;
	},
	
	onShow: function() {
		this.showEvent.fire();
	},
	
	onHide: function() {
		this.detach();
		this.hideEvent.fire();
	}
});
