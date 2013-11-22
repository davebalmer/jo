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
		joEvent.on(this.container, "mousedown", this.onMouseDown, this);
	},
	
	onMouseDown: function(e) {
		joEvent.stop(e);
		this.hide();
//		this.selectEvent.fire();
	},
	
	hide: function() {
		joDefer(function() {
			joEvent.on(this.container, joEvent.map.transitionend, this.onHide, this);
			this.container.className = '';
		}, this);
		
		return this;
	},
	
	show: function() {
		this.attach();

		joEvent.remove(this.container, joEvent.map.transitionend, this.onHide, this);
		joDefer(function() {
			this.container.className = 'show';
		}, this);

		// default parent to the document body
		if (!this.lastParent)
			this.lastParent = document.body;
		
		return this;
	},
	
	onShow: function() {
		this.showEvent.fire();
	},
	
	onHide: function() {
		joEvent.remove(this.container, joEvent.map.transitionend, this.onHide, this);
		this.detach();
		this.hideEvent.fire();
	}
});
