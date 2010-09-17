/**
	joScreen
	========
	
	Abstraction layer for the device screen. Uses document.body as its
	DOM element and allows other controls to be nested within (usually
	a joStack or other high-level containers or controls).
	
	Extends
	-------
	
	- joContainer
	
	Use
	---
	
		var x = new joScreen([
			new joNav(),
			new joStack(),
			new joToolbar()
		]);

	> Experimental! This class may or may not stick around. Unless it ends
	  up doing more than be a named container, it might go away.
	
	Events
	------
	
	- `resizeEvent`
	- `menuEvent`
	- `activateEvent`
	- `deactivateEvent`
	- `backEvent`
	- `forwardEvent`
	
*/

joScreen = function(data) {
	this.resizeEvent = new joSubject(this);
	this.menuEvent = new joSubject(this);
	this.activateEvent = new joSubject(this);
	this.deactivateEvent = new joSubject(this);
	this.backEvent = new joSubject(this);
	this.forwardEvent = new joSubject(this);
	
	joContainer.apply(this, arguments);
};
joScreen.extend(joContainer, {
	setupEvents: function() {
		joEvent.on(window, "resize", this.resizeEvent.fire, this);
		joEvent.on(window, "appmenushow", this.menuEvent.fire, this);
		joEvent.on(window, "activate", this.activateEvent.fire, this);
		joEvent.on(window, "deactivate", this.deactivateEvent.fire, this);
		joEvent.on(window, "back", this.backEvent.fire, this);
	},
	
	createContainer: function() {
		return document.body;
	},
	
	showPopup: function(data) {
		// take a view, a DOM element or some HTML and
		// make it pop up in the screen.
		if (!this.popup) {
			this.popup = new joShim(new joPopup(data));
		}
		else {
			this.popup.setData(data);
		}
		
		this.popup.attach(this);
		this.popup.activate();
	},
	
	hidePopup: function() {
		if (this.popup)
			this.popup.detach(this);
	}
});

