/**
	joScreen
	========
	
	Abstraction layer for the device screen. Uses document.body as its
	DOM element and allows other controls to be nested within (usually
	a joStack or other high-level containers or controls).
	
	Methods
	-------
	
	- `alert(title, message, buttons)`
	
	  Simple alert box. The `buttons` parameter is optional; a simple
	  "OK" button is added if nothing is specified.
	
	- `showPopup(joView)`
	- `hidePopup(joView)`
	
	  These methods allow you to do a completely custom modal joPopup.
	  Pass in either a joView, an array of them, or and HTMLElement
	  or a string, the same as you would when you create a joCard or
	  other child of joContainer.
	
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
		
		// show a simple alert dialog
		x.alert("Hello", "This is an alert");
		
		// a more complex alert
		x.alert("Hola", "Do you like this alert?", [
			{ label: "Yes", action: yesFunction, context: this },
			{ label: "No", action: noFunction, context: this }
		]);
		
		// a completely custom popup
		x.showPopup(myView);
	
	Events
	------
	
	- `resizeEvent`
	- `menuEvent`
	- `activateEvent`
	- `deactivateEvent`
	- `backEvent`
	- `forwardEvent`
	
*/

joScreen = function() {
	this.resizeEvent = new joSubject(this);
	this.menuEvent = new joSubject(this);
	this.activateEvent = new joSubject(this);
	this.deactivateEvent = new joSubject(this);
	this.backEvent = new joSubject(this);
	this.forwardEvent = new joSubject(this);
	
	joContainer.apply(this, arguments);
};
joScreen.extend(joContainer, {
	tagName: "screen",
	
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
	
	// show a popup made from your own UI controls
	showPopup: function(data) {
		// take a view, a DOM element or some HTML and
		// make it pop up in the screen.
		if (!this.popup) {
			this.shim = new joShim(
				new joFlexcol([
					'&nbsp',
					this.popup = new joPopup(data),
					'&nbsp'
				])
			);
		}
		else {
			this.popup.setData(data);
		}
		this.shim.hideEvent.subscribe(this.hideShim, this);
		this.popup.hideEvent.subscribe(this.hidePopup, this);
		this.shim.show();
		this.popup.show();
		
		return this;
	},

	hideShim: function() {
		this.shim = null;

		if (this.popup)
			this.popup.hide();

		return this;
	},
	
	hidePopup: function() {
		this.popup = null;

		if (this.shim)
			this.shim.hide();
			
		return this;
	},
	
	// shortcut to a simple alert dialog, not the most efficient
	// way to do this, but for now, it serves its purpose and
	// the API is clean enough.
	alert: function(title, msg, options, context) {
		var buttons = [];
		var callback;
		
		context = (typeof context === 'object') ? context : null;
		
		if (typeof options === 'object') {
			if (options instanceof Array) {
				// we have several options
				for (var i = 0; i < options.length; i++)
					addbutton(options[i]);
			}
			else {
				addbutton(options);
			}
		}
		else if (typeof options === 'string') {
			addbutton({ label: options });
		}
		else {
			if (typeof options === 'function')
				callback = options;

			addbutton();
		}
	
		var view = [
			new joTitle(title),
			new joHTML(msg),
			buttons
		];
		this.showPopup(view);
		
		var self = this;
		
		function addbutton(options) {
			if (!options)
				options = { label: 'OK' };

			var button = new joButton(options.label);
			button.selectEvent.subscribe(
				function() {
					if (options.action)
						options.action.call(options.context);
						
					defaultaction();
				}, options.context || self
			);
			
			buttons.push(button);
		}
		
		function defaultaction() {
			self.hidePopup();
			if (callback) {
				if (context)
					callback.call(context);
				else
					callback();
			}
		}
		
		return this;
	}
});

