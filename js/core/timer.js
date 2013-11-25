/**
	joTimer
	=======
	
	Timer interval with events.
	
	Methods
	-------
	
	- `start()`

	  Start the timer from the last value.

	- `stop()`

	  Stop the timer, does not reset it. You can restart it with `start()`

	- `reset()`

	  Reset the timer to its original time.
	
	Use
	---
	
		var x = new joTimer(time, resolution);

	Where
	-----

	- `time` in seconds, the start time
	- `resolution` interval resolution in ms
	
*/

joTimer = function(sec, resolution) {
	this.setDuration(sec || 60);
	
	this.expiredEvent = new joSubject(this);
	this.startEvent = new joSubject(this);
	this.stopEvent = new joSubject(this);
	this.updateEvent = new joSubject(this);
	this.resetEvent = new joSubject(this);
	
	this.resolution = resolution || 100;
	
	this.init();
	this.started = 0;
	this.paused = 0;
};
joTimer.prototype = {
	start: function(silent) {
		var paused = this.paused;

		this.init();
		
		if (paused)
			this.started = joTime.timestamp() - paused;
		else
			this.started = joTime.timestamp();
		
		this.paused = 0;

		var self = this;
		
		this.interval = setInterval(function() {
			joDefer(self.update, self);
		}, this.resolution);
		
		if (!silent)
			this.startEvent.fire();

		return this;
	},
	
	init: function() {
		if (this.interval)
			clearInterval(this.interval);

		this.interval = null;
		this.lastRemaining = null;

		return this;
	},
	
	stop: function(silent) {
		this.init();
		this.paused = joTime.timestamp() - this.started;

		if (!silent)
			this.stopEvent.fire();

		return this;
	},

	pause: function() {
		if (this.interval) {
			clearInterval(this.interval);
			this.interval = 0;
		}
	},

	resume: function() {
		if (this.interval || this.paused)
			return;

		var self = this;
		this.interval = setInterval(function() {
			joDefer(self.update, self);
		}, this.resolution);
	},
	
	reset: function(silent) {
		this.started = joTime.timestamp();
		this.paused = 0;
		
		if (!silent)
			this.resetEvent.fire();

		return this;
	},
	
	setDuration: function(sec) {
		this.duration = sec * 1000;

		return this;
	},
	
	update: function() {
		var remaining = Math.round((this.duration - (joTime.timestamp() - this.started)) / 1000);

		if (this.lastRemaining == null || remaining < this.lastRemaining)
			this.updateEvent.fire(remaining);

		if (remaining <= 0)
			this.expired();

		this.lastRemaining = remaining;

		return this;
	},
	
	expired: function() {
		this.stop();
//		this.update();

		this.expiredEvent.fire();
	}
};
