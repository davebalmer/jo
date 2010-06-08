/**
	joGesture
	=========
	
	Experimental global gesture handler (keyboard, dpad, back, home, flick?).
	This needs a lot more fleshing out, so it's not ready for general
	concumption.

*/
joGesture = {
	load: function() {
		this.upEvent = new joSubject(this);
		this.downEvent = new joSubject(this);
		this.leftEvent = new joSubject(this);
		this.rightEvent = new joSubject(this);
		this.forwardEvent = new joSubject(this);
		this.backEvent = new joSubject(this);
		this.homeEvent = new joSubject(this);
		this.closeEvent = new joSubject(this);
		this.activateEvent = new joSubject(this);
		this.deactivateEvent = new joSubject(this);
		
		this.setEvents();
	},
	
	// by default, set for browser
	setEvents: function() {
		joEvent.on(document.body, "keydown", this.onKeyDown, this);
		joEvent.on(document.body, "keyup", this.onKeyUp, this);
	},

	onKeyUp: function(e) {
		if (!e)
			var e = window.event;
	
		joLog("keyup", e.keyCode, e.charCode);

		if (e.keyCode == 18) {
			this.altkey = false;
			joLog("alt OFF");
			return;
		}

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
			var e = window.event;
			
		joLog("keydown", e.keyCode, e.charCode);

		if (e.keyCode == 27) {
			this.backEvent.fire("back");
			return;
		}
		
		if (e.keyCode == 13 && joFocus.get() instanceof joInput) {
			joEvent.stop(e);
			return;
		}
		
		if (e.keyCode == 18) {
			joLog("alt ON");
			this.altkey = true;
			return;
		}
	}
};