/**
	joGesture
	=========
	
	Global gesture handler.

	Events
	------
	
	- `defaultEvent`
	
	  Fired when `return` or `enter` key is pressed.
	
	- `backEvent`

	  Fired when `ESC` key is pressed (on webOS, the back gesture fires an `ESC` key),
	  also used to hook in hardware back buttons for different platforms (e.g.
	  Tizen, Android).
	
	- `resizeEvent`
	
	  Fired on window resize.

	- `forwardEvent`
	- `upEvent`
	- `downEvent`
	- `leftEvent`
	- `rightEvent`

	- `homeEvent`
	- `closeEvent`
	- `activateEvent`
	- `deactivateEvent`

*/
joGesture = {
	load: function() {
		this.upEvent = new joSubject(this);
		this.downEvent = new joSubject(this);
		this.leftEvent = new joSubject(this);
		this.rightEvent = new joSubject(this);
		this.forwardEvent = new joSubject(this);
		this.defaultEvent = new joSubject(this);
		this.backEvent = new joSubject(this);
		this.homeEvent = new joSubject(this);
		this.closeEvent = new joSubject(this);
		this.activateEvent = new joSubject(this);
		this.deactivateEvent = new joSubject(this);
		this.resizeEvent = new joSubject(this);
		
		this.setEvents();
	},
	
	// by default, set for browser
	setEvents: function() {
		joEvent.on(document.body, "keydown", this.onKeyDown, this);
		joEvent.on(document.body, "keyup", this.onKeyUp, this);
		
		joEvent.on(document.body, "unload", this.closeEvent, this);
		joEvent.on(window, "activate", this.activateEvent, this);
		joEvent.on(window, "deactivate", this.deactivateEvent, this);
		
		joEvent.on(window, "resize", this.resize, this);
	},

	resize: function() {
		this.resizeEvent.fire(window);
	},

	onKeyUp: function(e) {
		if (!e)
			e = window.event;
	
		if (e.keyCode == 18) {
			this.altkey = false;

			return;
		}

		if (e.keyCode == 27) {
			if (jo.flag.stopback) {
				joEvent.stop(e);
				joEvent.preventDefault(e);
			}

			this.backEvent.fire("back");
			return;
		}

		if (e.keyCode == 13) {
			joEvent.stop(e);
			joEvent.preventDefault(e);

			this.defaultEvent.fire("default");
			return;
		}

		// from here on, these are for simulating device events on a browser
		if (!this.altkey)
			return;
		
		joEvent.stop(e);
		
		switch (e.keyCode) {
			case 37:
				this.leftEvent.fire("left");
				break;
			case 38:
				this.upEvent.fire("up");
				break;
			case 39:
				this.rightEvent.fire("right");
				break;
			case 40:
				this.downEvent.fire("down");
				break;
			case 27:
				this.backEvent.fire("back");
				break;
			case 13:
				this.forwardEvent.fire("forward");
				break;
		}
	},
	
	onKeyDown: function(e) {
		if (!e)
			e = window.event;
			
		if (e.keyCode == 27) {
			joEvent.stop(e);
			joEvent.preventDefault(e);
		}
		else if (e.keyCode == 13 && joFocus.get() instanceof joInput) {
			joEvent.stop(e);
		}
		else if (e.keyCode == 18) {
			this.altkey = true;
		}
		
		return;
	}
};
