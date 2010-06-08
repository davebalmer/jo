/**
	joSound
	========
	
	Play preloaded sound effects. This module could be wildly different for
	various platforms. Be warned.

	Methods
	-------
	
	- `play()`

	- `pause()`

	- `rewind()`

	- `load()`

	- `setLoop(n)`
	
	  Tell the joSound to automatically loop `n` times. Set to `-1` to loop
	  continuously until `pause()`.
	
	Events
	------
	
	- `doneEvent`
	- `errorEvent`
*/
joSound = function(filename, loop) {
	if (typeof Audio == 'undefined')
		return;

//	if (typeof Mojo != 'undefined')
//		filename = Mojo.appPath + filename;

	this.filename = filename;

	this.audio = new Audio();
	
	if (!this.audio)
		return;
		
	this.audio.src = filename;
	this.audio.autoplay = false;

	// makes webOS 1.3.5 happy
	this.audio.load();
	this.pause();
	
	if (loop)
		joEvent.on(this.audio, "ended", this.play, this);
};
joSound.prototype = {
	play: function() {
		if (!this.audio)
			return;

		this.audio.play();
	},
	
	pause: function() {
		if (!this.audio)
			return;

		this.audio.pause();
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
	},

	stop: function() {
		this.pause();
		this.rewind();
	},
	
	setVolume: function(vol) {
		if (!this.audio)
			return;

		this.audio.volume = vol;
	}
};
