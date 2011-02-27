/**
	joSound
	========
	
	Play preloaded sound effects using the HTML5 `Audio` object. This module could
	be wildly different for various platforms. Be warned.

	Methods
	-------
	
	- `play()`
	- `pause()`
	- `rewind()`
	- `stop()`
	
	  Basic sound controls.
	
	- `setLoop(n)`
	
	  Tell the joSound to automatically loop `n` times. Set to `-1` to loop
	  continuously until `pause()`.
	
	- `setVolume(level)`
	
	  Level is a decimal value from `0` to `1`. So, half volume would be `0.5`.
	
	Events
	------
	
	- `endedEvent`
	- `errorEvent`

*/
joSound = function(filename, repeat) {
	this.endedEvent = new joSubject(this);
	this.errorEvent = new joSubject(this);
	
	if (typeof Audio == 'undefined')
		return;

	this.filename = filename;
	this.audio = new Audio();
	this.audio.autoplay = false;
	
	if (!this.audio)
		return;
		
	joDefer(function() {
		this.audio.src = filename;
		this.audio.load();
	}, this, 5);
	
	this.setRepeatCount(repeat);

	joEvent.on(this.audio, "ended", this.onEnded, this);

//	this.pause();
};
joSound.prototype = {
	play: function() {
		if (!this.audio || this.audio.volume === 0)
			return;

		this.audio.play();
		
		return this;
	},

	onEnded: function(e) {
		this.endedEvent.fire(this.repeat);

		if (++this.repeat < this.repeatCount)
			this.play();
		else
			this.repeat = 0;
	},
	
	setRepeatCount: function(repeat) {
		this.repeatCount = repeat;
		this.repeat = 0;

		return this;
	},
	
	pause: function() {
		if (!this.audio)
			return;

		this.audio.pause();

		return this;
	},

	rewind: function() {
		if (!this.audio)
			return;

		try {
			this.audio.currentTime = 0.0;			
		}
		catch (e) {
			joLog("joSound: can't rewind...");
		}
		
		this.repeat = 0;

		return this;
	},

	stop: function() {
		this.pause();
		this.rewind();
		
		this.repeat = 0;

		return this;
	},
	
	setVolume: function(vol) {
		if (!this.audio || vol < 0 || vol > 1)
			return;

		this.audio.volume = vol;

		return this;
	}
};
