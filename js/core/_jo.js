/**
- - -

	jo
	===

	Singleton which the framework uses to store global infomation.
	
	Properties
	----------
	
	- `version` is a String
	- `platform` is a String
	- `language` is an Array
	
	Methods
	-------
	
	- `getPlatform()`
	- `getVersion()`
	- `getLanguage()`

	- `setLanguage(primary, secondary, ...)`
		
	  You can use any string code for your language file, but it is recommended you use
	  the same codes used by browsers for consistency. You can specify more than one
	  code, and the corresponding files are loaded in order. This allows you to have
	  a specific subset of strings for a locale with a given language and a fallback
	  chain to more generalized strings.

	Events
	------
	
	- `loadEvent`
	- `unloadEvent`

	Class Hierarchy
	===============

	The following is a class hierarchy for the framework, organized
	by general function.
	
	> Note: these names are subject to refactoring. Trying out
	> Objective-C style naming conventions (e.g. `joList` instead of
	> `jo.Widget.ListView`). We'll see how it goes but so far I like it.

	User Interface
	--------------

	* joView
		* joContainer
			* joAlert
			* joCard
			* joDialog
			* joFieldset
			* joLayout
		* joControl
			* joButton
			* joCheckBox
			* joInput
				* joDateTime
				* joPasswordInput
				* joText
			* joList
				* joMenu
				* joTabBar
				* joToggle
			* joSelect
			* joScroller
			* joKnob
			* joSlider
		* joDivider
		* joLabel
		* joStack
		* joTable
		* joTitle

	Data
	----

	* joDatabase
	* joDataSource
		* joFileDataSource
		* joSQLDataSource
	* joFile

	Events
	------

	* joDispatch
	* joEvent
	* joSubject

	> Future additions: The following are currently being designed as a way
	> to abstract differences in DOM event calls between devices:  joTouch,
	> joGesture, joKeyboard, joJoystick, joOrientation. Loose names for now,
	> probably end up with something completely different.

	Processing
	----------

	* joChain
	* joYield
	* joWait

	Utility
	-------

	* joDOM
	* joJSON
	* joLocal
	* joString
	* joTime

	Debugging
	---------
	* joLog

	Application
	-----------

	* jo
	* joClipboard
	* joDevice
	* joFocus
	* joPreference
	* joUser

	Function
	========
	
	jo extends the Function object to add a few goodies.
	The goal here is to augment JavaScript in a farily non-intrusive
	way to give us some big benefits.
	
	Methods
	-------
	
	- `bind(Function)`
	
	  Returns a private function wrapper which automagically resolves
	  context for `this` when your method is called.

	- `extend(superclass, prototype)`
	
	  Gives you an easy way to extend a class using JavaScript's natural
	  prototypal inheritance. See Class Patterns for more information.
	
	HTMLElement
	===========
	
	Standard DOM element for JavaScript. Most of the jo widgets deal
	with these, but your application shouldn't need to.

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
	Function.prototype.bind = function() {
		var self = this;

		function callbind() {
			return self.apply(self, arguments);
		}

		return callbind;
	};
}

// just a place to hang our hat
jo = {
	platform: "Safari",
	version: "0.0.1",
	language: [ "en" ],
	
	load: function(call, context) {
		joDOM.enable();

		document.body.onMouseDown = function(e) { e.preventDefault(); };
		document.body.onDragStart = function(e) { e.preventDefault(); };
		
		joGesture.load();
		
//		if (window && typeof window.onFocus !== 'undefined')
//			window.onFocus = joFocus.refresh;
		
		// call some device specific stuff or whatever
	},
	
	getPlatform: function() {
		return this.platform;
	},
	
	getVersion: function() {
		return this.version;
	},
	
	getLanguage: function() {
		return this.language;
	}
};
