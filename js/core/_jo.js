/**
	jo
	===

	Singleton which the framework uses to store global infomation. It also is
	responsible for initializing the rest of the framework, detecting your environment,
	and notifying your application when jo is ready to use.
	
	Methods
	-------
	
	- `load()`
	
	  This method should be called after your DOM is loaded and before your app uses
	  jo. Typically, you can call this function from your document's `onLoad` method,
	  but it is recommended you use more device-specific "ready" notification if
	  they are available.
	
	- `getPlatform()`
	
	  Returns the platform you're running in as a string. Usually this is not needed,
	  but can be useful.
	
	- `getVersion()`
	
	  Returns the version of jo you loaded in the form of a string (e.g. `0.1.1`).
	
	- `matchPlatform(string)`
	  
	  Feed in a string list of desired platforms (e.g. `"mozilla chrome ipad"`),
	  and returns true if the identified platform is in the test list.

	Events
	------
	
	- `loadEvent`
	- `unloadEvent`
	
	  These events are fired after jo loads or unloads, and can be used in your
	  application to perform initialization or cleanup tasks.

	Function
	========
	
	jo extends the Function object to add a few goodies which augment JavaScript
	in a farily non-intrusive way.
	
	Methods
	-------
	
	- `extend(superclass, prototype)`
	
	  Gives you an easy way to extend a class using JavaScript's natural prototypal
	  inheritance. See Class Patterns for more information.
	
	- `bind(context)`

	  Returns a private function wrapper which automagically resolves context
	  for `this` when your method is called.
	
	HTMLElement
	===========
	
	This is a standard DOM element for JavaScript. Most of the jo views, continers
	and controls deal with these so your application doesn't need to.

	Methods
	-------
	
	Not a complete list by any means, but the useful ones for our
	purposes are:
	
	- `appendChild(node)`
	- `insertChild(before, node)`
	- `removeChild(node)`
	
	Properties
	----------
	
	jo uses these properties quite a bit:
	
	- `innerHTML`
	- `className`
	- `style`

*/

// syntactic sugar to make it easier to extend a class
Function.prototype.extend = function(superclass, proto) {
	// create our new subclass
	this.prototype = new superclass();

	// optional subclass methods and properties
	if (proto) {
		for (var i in proto)
			this.prototype[i] = proto[i];
	}
};

// add bind() method if we don't have it already
if (typeof Function.prototype.bind === 'undefined') {
	Function.prototype.bind = function(context) {
		var self = this;

		function callbind() {
			return self.apply(context, arguments);
		}

		return callbind;
	};
}

// just a place to hang our hat
jo = {
	platform: "webkit",
	version: "0.0.2",
	
	useragent: [
		'ipad',
		'iphone',
		'webos',
		'android',
		'opera',
		'chrome',
		'safari',
		'mozilla',
		'gecko',
		'explorer'
	],
	
	debug: false,
	setDebug: function(state) {
		this.debug = state;
	},
	
	load: function(call, context) {
		joDOM.enable();
		
		this.loadEvent = new joSubject(this);
		this.unloadEvent = new joSubject(this);

		document.body.onMouseDown = function(e) { e.preventDefault(); };
		document.body.onDragStart = function(e) { e.preventDefault(); };

		// quick test to see which environment we're in
		if (typeof navigator == 'object' && navigator.userAgent) {
			var agent = navigator.userAgent.toLowerCase();
			for (var i = 0; i < this.useragent.length; i++) {
				if (agent.indexOf(this.useragent[i]) >= 0) {
					this.platform = this.useragent[i];
					break;
				}
			}
		}
		
		if (joGesture)
			joGesture.load();

		joLog("Jo", this.version, "loaded for", this.platform, "environment.");

		this.loadEvent.fire();
	},
	
	getPlatform: function() {
		return this.platform;
	},
	
	matchPlatform: function(test) {
		return (test.indexOf(this.platform) >= 0);
	},
	
	getVersion: function() {
		return this.version;
	},
	
	getLanguage: function() {
		return this.language;
	}
};

