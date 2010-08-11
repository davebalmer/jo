/**
	joLog
	=====
	
	Wrapper for `console.log()` (or whatever device-specific logging you have). Also could
	be extended to send log information to a RESTful service as well, handy for devices
	which don't have decent logging abilities.
	
	Use
	---
	
	It's an all-in-one utility that's smart enough to ferret out whatever you throw at it
	and display it in the console.
	
		joLog("x=", x, "listdata=", listdata);
	
	Basically, fill it up with strings, variables, objects, arrays and the function will
	produce a string version of each argument (where appropriate; browser debuggers tend to
	display objects nicely) in the same console line. Simple, effective, easy to use.

*/

joLog = function() {
	// whoops, nothing to log; later we might downshift to something else
	if (typeof console === "undefined" || typeof console.log === "undefined" || !console.log)
		return;
		
	var strings = [];
	
	for (var i = 0; i < arguments.length; i++) {
		// TODO: stringify for objects and arrays
		strings.push(arguments[i]);
	}
	
	// spit out our line
	console.log(strings.join(" "));
}
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

/**
	joDOM
	======
	
	Singleton with utility methods for manipulating DOM elements.
	
	Methods
	-------

	- `get(id)`

	  Returns an HTMLElement which has the given id or if the
	  id is not a string returns the value of id.
	
	- `create(type, style)`
	
	  Type is a valid HTML tag type. Style is the same as `setStyle()`
	  method. Returns an HTMLElement.

			// simple
			var x = joDOM.create("div", "mycssclass");

			// more interesting
			var x = joDOM.create("div", {
				id: "name",
				className: "selected",
				background: "#fff",
				color: "#000"
			});

	- `setStyle(tag, style)`
	
	  Style can be an object literal with
	  style information (including "id" or "className") or a string. If
	  it's a string, it will simply use the style string as the className
	  for the new element.
	  
	  Note that the preferred and most cross-platform method for working
	  with the DOM is to use `className` and possibly `id` and put your
	  actual style information in your CSS file. That said, sometimes it's
	  easier to just set the background color in the code. Up to you.
	
	- `getParentWithin(node, ancestor)`

	  Returns an HTMLElement which is
	  the first child of the ancestor which is a parent of a given node.
	
	- `addCSSClass(HTMLElement, classname)`

	  Adds a CSS class to an element unless it is already there.
	
	- `removeCSSClass(HTMLElement, classname)`

	  Removes a CSS class from an element if it exists.
	
	- `toggleCSSClass(HTMLElement, classname)`

	  Auto add or remove a class from an element.

*/
joDOM = {
	enabled: false,
	
	get: function(id) {
		if (typeof id == "string")
			return document.getElementById(id);
		else
			return (typeof id == 'object' && id.tagName) ? id : null;
	},
	
	remove: function(node) {
		if (node.parentNode) {
			node.parentNode.removeChild(node);
		}
	},

	enable: function() {
		this.enabled = true;
	},
	
	getParentWithin: function(node, ancestor) {
		while (node.parentNode !== window && node.parentNode !== ancestor) {
			node = node.parentNode;
		}

		return node;
	},

	addCSSClass: function(node, classname) {
		if (typeof node.className != "undefined") {
			var n = node.className.split(/\s+/);

			for (var i = 0, l = n.length; i < l; i++) {
				if (n[i] == classname)
					return;
			}
			n.push(classname);
			node.className = n.join(" ");
		}
		else {
			node.className = classname;
		}
	},

	removeCSSClass: function(node, classname, toggle) {
		if (typeof node.className != "undefined") {
			var n = node.className.split(/\s+/);

			for (var i = 0, l = n.length; i < l; i++) {
				if (n[i] == classname) {
					if (l == 1)
						node.className = "";
					else {
						n.splice(i, i);
						node.className = n.join(" ");
					}
					return;
				}
			}

			if (toggle) {
				n.push(classname);
				node.className = n.join(" ");
			}
		}
		else {
			node.className = classname;
		}
	},

	toggleCSSClass: function(node, classname) {
		this.removeCSSClass(node, classname, true);
	},

	create: function(tag, style) {
		if (!this.enabled)
			return null;

		if (typeof tag == "object" && typeof tag.tagName == "string") {
			// being used to create a container for a joView
			var o = document.createElement(tag.tagName);

			if (tag.className)
				this.setStyle(o, tag.className);
		}
		else {
			var o = document.createElement(tag);

			if (style)
				this.setStyle(o, style);
		}
		
		return o;
	},
	
	setStyle: function(node, style) {
		if (typeof style === "string") {
			node.className = style;
		}
		else if (typeof style === "object") {
			for (var i in style) {
				switch (i) {
				case "id":
				case "className":
					node[i] = style[i];
					break;
				default:
					node.style[i] = style[i];
				}
			}
		}
		else if (typeof style !== "undefined") {
			throw("joDOM.setStyle(): unrecognized type for style argument; must be object or string.");
		}
	},
	
	applyCSS: function(style, oldnode) {
		// TODO: should insert before and then remove the old node
		if (oldnode)
			document.body.removeChild(oldnode);

		var css = joDOM.create('jostyle');
		css.innerHTML = "<style>" + style + "</style>";

		document.body.appendChild(css);

		return css;
	},
	
	loadCSS: function(filename, oldnode) {
		// you can just replace the source for a given
		// link if one is passed in
		if (oldnode)
			var css = oldnode;
		else
			var css = joDOM.create('link');
		
		css.rel = 'stylesheet';
		css.type = 'text/css';
		css.href = filename + (jo.debug ? ("?" + joTime.timestamp()) : "");

		if (!oldnode)
			document.body.appendChild(css);
		
		return css;
	}		
};
/**
	joEvent
	========
	
	Singleton with DOM event model utility methods. Ideally, application-level
	code shouldn't have to use this, but library code does.
	
	Methods
	-------
	- `on(HTMLElement, event, Function, context, data)`
	
	  Set a DOM event listener for an HTMLElement which calls a given Function
	  with an optional context for `this` and optional static data.
	
	- `stop(event)`
	
	  Prevent default and stop event propogation.
	
	- `getTarget(event)`
	
	  Returns the HTMLElement which a DOM event relates to.

*/

joEvent = {
	getTarget: function(e) {
		if (!e)
			var e = window.event;
		
		return e.target ? e.target : e.srcElement;
	},

	on: function(element, event, call, context, data) {
		if (!call || !element)
			return;

		var element = joDOM.get(element);
		var call = call;
		var data = data || "";

		var wrappercall = function(e) {
			var target = joEvent.getTarget(e);
			
			if (context)
				call.call(context, e, data);
			else
				call(e, data);
		};
		
		if (!window.addEventListener)
			element.attachEvent("on" + event, wrappercall);
		else
			element.addEventListener(event, wrappercall, false);
	},

	stop: function(e) {
		if (e.stopPropagation)
			e.stopPropagation();
		else
			e.cancelBubble = true;
	},
	
	preventDefault: function(e) {
		e.preventDefault();
	},
	
	block: function(e) {
		if (window.event)
			var e = window.event;

		if (typeof e.target == 'undefined')
			e.target = e.srcElement;

		switch (e.target.nodeName.toLowerCase()) {
		case 'input':
		case 'textarea':
			return true;
			break;
		default:
			return false;
		}
	}
};
/**
	joSubject
	==========
	
	Class for custom events using the Observer Pattern. This is designed to be used
	inside a subject to create events observers can subscribe to. Unlike the classic
	observer pattern, a subject can fire more than one event and when called, and
	each observer gets data from the subject. This is very similar to YUI 2.x event model.
	
	Methods
	-------
	
	- `fire(data)`
	
	  Calls subscriber methods for all observers, and passes in: `data` from the subject,
	  a reference to the `subject` and any static `data` which was passed in the
	  `subscribe()` call.
	
	- `subscribe(Function, context, data)`
	- `unsubscribe(Function, context)`
	
	  Both `context` and `data` are optional. Also, you may use the `Function.bind(this)`
	  approach instead of passing in the `context` as a separate argument.
	
	Use
	-----
	
	### In the subject (or "publisher") object
	
		// inside the Subject, we setup an event observers can subscribe to
		this.changeEvent = new joSubject(this);
		
		// to fire the event inside the Subject
		this.changeEvent.fire(somedata);

	### In the observer (or "subscriber") object

		// simple case, using Function.bind()
		somesubject.changeEvent.subscribe(this.mymethod.bind());
		
		// explicit context (this)
		somesubject.changeEvent.subscribe(this.mymethod, this);
		
		// optional data which gets passed with the event fires
		somesubject.changeEvent.subscribe(this.mymethod, this, "hello");

	This is a very flexible way to handle messages between objects. Each subject
	may have multiple events which any number of observer objects can subscribe
	to.

*/
joSubject = function(subject) {
	this.subscriptions = [];
	this.subject = subject;	
};
joSubject.prototype = {
	subscribe: function(call, observer, data) {
		if (!call)
			return false;
		
/*
		var observer = observer || this;

		if (typeof data == 'undefined')
			var data = "";
*/
		var o = { "call": call };

		if (observer)
			o.observer = observer;

		if (data)
			o.data = data;
		
		this.subscriptions.push(o);
	
		return true;
	},
	
	unsubscribe: function(call, observer) {
		if (!call)
			return false;

//		var observer = observer || this;

		for (var i = 0, l = this.subscriptions.length; i < l; i++) {
			if (this.subscriptions[i].call === call
			&& (this.subscriptions[i].observer == "undefined" || this.subscriptions[i].observer === observer))
				this.subscriptions[i].slice(i, 1);
		}
	},

	fire: function(data) {
		if (typeof data == 'undefined')
			var data = "";
		
		for (var i = 0, l = this.subscriptions.length; i < l; i++) {
			var subjectdata = (typeof this.subscriptions[i].data !== 'undefined') ? this.subscriptions[i].data : null;

			// support for Function.bind()
			if (this.subscriptions[i].observer) {
				this.subscriptions[i].call.call(
					this.subscriptions[i].observer,
					data,
					this.subject,
					subjectdata
				);				
			}
			else {
				this.subscriptions[i].call(
					data,
					this.subject,
					subjectdata
				);				
			}
		}
	}
};
/**
	joYield
	========
	
	Utility function which calls a given method within a given context after `n`
	milliseconds with optional static data.

	Use
	-----
	
		joYield(Function, context, delay, data);
	
	Note that delay defaults to 100ms if not specified, and `data` is optional.

*/
function joYield(call, context, delay, data) {
	if (!delay)
		var delay = 100;

	if (!context)
		var context = this;
		
	var timer = window.setTimeout(function() {
		call.call(context, data);
	}, delay);
	
	return timer;
};
/**
	joChain
	========
	
	Class which strings asyncronous calls together.
	
	> In serious need of rework; doesn't meet original goal of sequencing
	> these calls. This class might also become deprecated.

	Methods
	-------
	
	- `add(Function, context, data)`
	- `start()`
	- `stop()`
	- `next()`

*/

joChain = function() {
	this.queue = [];
	this.active = false;
	
	this.addEvent = new joSubject("add", this);
	this.startEvent = new joSubject("start", this);
	this.stopEvent = new joSubject("stop", this);
	this.nextEvent = new joSubject("next", this);

	this.stop();
	
	this.delay = 100;
};
joChain.prototype = {
	add: function(call, context, data) {
		if (!context)
			var context = this;
		
		if (!data)
			var data = "";
			
		this.queue.push({
			"call":call,
			"context": context,
			"data": data
		});
		
		if (this.active && !this.timer)
			this.next();
	},
	
	start: function() {
		this.active = true;
		
		this.startEvent.fire();
		
		this.next();
	},
	
	stop: function() {
		this.active = false;

		if (this.timer != null)
			window.clearTimeout(this.timer);

		this.timer = null;
		
		this.stopEvent.fire();
	},
	
	next: function() {
		var nextcall = this.queue.shift();
		
		if (!nextcall) {
			this.timer = null;
			return;
		}
		
		this.nextEvent.fire(nextcall);

		nextcall.call.call(nextcall.context, nextcall.data);
		
		if (this.queue.length)
			this.timer = joEvent.yield(this.next, this, this.delay);
		else
			this.timer = null;
	}
};
/**
	joClipboard
	===========
	
	Singleton which abstracts the system clipboard. Note that this is a platform
	dependant interface. By default, the class will simply store the contents in
	a special joPreference named "joClipboardData" to provide clipboard capabilities
	within your app.
	
	> Even if you think you're just going to use the default behavior, it is
	> recommended that you never manipulate the "joClipboardData" preference directly.
	
	Methods
	-------
	
	- `get()`
	- `set(String)`

	  Low level methods which use just strings. At this time, you will need to
	  stringify your own data when setting, and extract your data when getting.
	
	- `cut(joControl)`
	- `copy(joControl)`
	- `paste(joControl)`

	  High level methods which work with any joControl or subclass. If a control
	  supports selections, `cut()` will automatically remove the selection after
	  copying its contents. Otherwise, `cut()` will work the same as `copy()`.
	
*/
joClipboard = {
	data: "",
	
	get: function() {
		return joPreference.get("joClipboardData") || this.data;
	},
	
	set: function(clip) {
		// don't feed it junk; stringify it first
		// TODO: detect non-strings and stringify them
		this.data = clip;
		joPreference.set("joClipboardData");
	}
};
/**
	joCache
	=======
	
	A singleton which makes it easy to setup deferred object creation and cached
	results. This is a performance menchanism initially designed for UI views, but
	could be extended to handle data requests and other object types.
	
	Methods
	-------
	
	- `set(key, call, context)`
	
	  Defines a factory (`call`) for building an object keyed from the `key` string.
	  The `context` argument is optional, but provides a reference for `this`.
	
	- `get(key)`
	
	  Returns an object based on the `key` string. If an object has not been created
	  which corresponds to the `key`, joCache will call the constructor defined to
	  create it and store the reference for future calls to `get()`.
	
	Use
	---
	
	Defining a view for on-demand use:
	
		joCache.set("home", function() {
			return new joCard([
				new joTitle("Home"),
				new joMenu([
					"Top Stories",
					"Latest News",
					"Old News",
					"No News"
				])
			]);
		});
	
	Displaying a view later:
	
		mystack.push(joCache.get("home"));
		
		// the first call to get() will instantiate
		// the view, subsequent calls will return the
		// view that was created the first time

*/

joCache = {
	cache: {},
	
	set: function(key, call, context) {
		if (call)
			this.cache[key] = { "call": call, "context": context || this };
	},
	
	get: function(key) {
		var cache = this.cache[key] || null;
		if (cache) {
			if (!cache.view)
				cache.view = cache.call(cache.context, cache.call);
				
			return cache.view;
		}
		else {
			return new joView("View not found: " + key);
		}
	}
};

joTime = {
	timestamp: function() {
		var now = new Date();
		return now / 1;
	}
};
/**
	joDatabase
	===========

	Wrapper class for WebKit database.
	
	Methods
	-------
	
	- `open(datafile, size)`
	
	  `datafile` is a filename, `size` is an optional parameter for initial
	  allocation size for the database.
	
	- `close()`
	
	- `now()`
	
	  *Deprecated* convenience method which returns a SQLite-formatted date
	  string for use in queries. Should be replaced with a utility function
	  in joTime.
*/
joDatabase = function(datafile, size) {
	this.openEvent = new joEvent.Subject(this);
	this.closeEvent = new joEvent.Subject(this);
	this.errorEvent = new joEvent.Subject(this);

	this.datafile = datafile;
	this.size = size || 256000;
	this.db = null;
};
joDatabase.prototype = {
	open: function() {
//		if (typeof Mojo != "undefined")
//			this.db = openDatabase(this.datafile, "1.0", this.size);
//		else
		this.db = openDatabase(this.datafile, "1.0", this.datafile, this.size);

		if (this.db) {
			this.openEvent.fire();
		}
		else {
			joLog("DataBase Error", this.db);
			this.errorEvent.fire();
		}
	},
	
	close: function() {
		this.db.close();
		this.closeEvent.fire();
	},
	
	now: function(offset) {
		var date = new Date();
		
		if (offset)
			date.setDate(date.valueOf() + (offset * 1000 * 60 * 60 * 24));
		
		return date.format("yyyy-mm-dd");
	}
};
/**
	joDataSource
	=============

	Wraps data acquisition in an event-driven class. Objects can
	subscribe to the `changeEvent` to update their own data.

	This base class can be used as-is as a data dispatcher, but is
	designed to be extended to handle asyncronous file or SQL queries.

	Methods
	-------
	- `set()`
	- `get()`
	- `clear()`

	Events
	------

	- `changeEvent`
	- `errorEvent`
*/
joDataSource = function(data) {
	this.changeEvent = new joSubject(this);	
	this.errorEvent = new joSubject(this);

	if (typeof data !== "undefined")
		this.setData();
	else
		this.data = "";
};
joDataSource.prototype = {
	setQuery: function(query) {
		this.query = query;
	},
	
	getQuery: function() {
		return this.query;
	},
	
	setData: function(data) {
		this.data = data;
		this.changeEvent.fire(data);
	},
	
	getData: function() {
		return this.data;
	},
	
	getDataCount: function() {
		return this.getData().length;
	},
	
	getPageCount: function() {
		if (this.pageSize)
			return Math.floor(this.getData().length / this.pageSize) + 1;
		else
			return 1;
	},
	
	getPage: function(index) {
		var start = index * this.pageSize;
		var end = start + this.pageSize;
		
		if (end > this.getData().length)
			end = this.getData().length;
			
		if (start < 0)
			start = 0;

		return this.data.slice(start, end);
	},
	
	refresh: function() {
		// needs to make a new query object
	},
	
	setPageSize: function(length) {
		this.pageSize = length;
	},
	
	getPageSze: function() {
		return this.pageSize;
	},
	
	load: function(){
	}
};
/**
	joSQLDataSource
	================

	SQL flavor of joDataSource which uses "HTML5" SQL found in webkit.

	Methods
	-------

	- `setDatabase(joDatabase)`
	- `setQuery(query)`
	- `setParameters(arguments)`
	- `execute(query, arguments)`
	
	Events
	------
	
	- `changeEvent`
	
	  Fired when data is loaded after an `execute()` or when data is cleared.
	
	- `errorEvent`
	
	  Fired when some sort of SQL error happens.

	Extends
	-------

	- joDataSource
*/
joSQLDataSource = function(db, query, args) {
	this.db = db;
	this.query = (typeof query == 'undefined') ? "" : query;
	this.args = (typeof args == 'undefined') ? [] : args;
	
	this.changeEvent = new joEvent.subject(this);
	this.errorEvent = new joEvent.subject(this);
};
joSQLDataSource.prototype = {
	setDatabase: function(db) {
		this.db = db;
	},
	
	setQuery: function(query) {
		this.query = query;
	},

	setData: function(data) {
		this.data = data;
		this.changeEvent.fire();
	},

	clear: function() {
		this.data = [];
		this.changeEvent.fire();
	},

	setParameters: function(args) {
		this.args = args;
	},

	execute: function(query, args) {
		this.setQuery(query || "");
		this.setParameters(args);
		
		if (this.query)
			this.refresh();
	},
	
	refresh: function() {
		if (!this.db) {
			this.errorEvent.fire();
//			joLog("query error: no db!");
			return;
		}
		
		var self = this;

		if (arguments.length) {
			var args = [];
			for (var i = 0; i < arguments.length; i++)
				args.push(arguments[i]);
		}
		else {
			var args = this.args;
		}
		
		var query = this.query;

		function success(t, result) {
			self.data = [];

			for (var i = 0, l = result.rows.length; i < l; i++) {
				var row = result.rows.item(i);

				self.data.push(row);
			}
			
			self.changeEvent.fire(self.data);
		}
		
		function error() {
			joLog('SQL error', query, "argument count", args.length);
			self.errorEvent.fire();
		}
		
		this.db.db.transaction(function(t) {
			t.executeSql(query, args, success, error);
		});
	}
};
/**
	joPreference
	============

	A singleton used for storing and retrieving preferences. Meant to be
	augmented with persistent storage methods for `set()` and `get()`.

	> This is a work in progress, and totally subject to change. Binding
	> persistent storage to GUI controls in a way that doesn't require
	> goofy syntax is tricky.

	Methods
	-------

	- `bind(key)`

	  Returns a joDataSource class for a key. Used to automagically bind
	  GUI controls in a two-way link with preference data for a key.

	- `get(key)`

	  Returns the current value for a key or `null` if there is no value.

	- `set(key, value)`

	  Sets an arbitrary value for a given key.

	Consumes
	--------

	- joDataSource
	- joSubject

	Events
	------

	- `changeEvent`

	> This is getting hairy. Sorting out the data types and adding different
	> data sources to the picture is getting messy.

*/

joPreference = function(data) {
	this.preference = data || {};
};
joPreference.prototype = {
	loadEvent: new joSubject(this),
	preference: {},

	setDataSource: function(source) {
		this.dataSource = source;
		source.loadEvent.subscribe(this.load, this);
//		this.load(source.getData());
	},
	
	load: function(data) {
		// shove the data in, would be nice if it accepted
		// an array of arrays (SQL) or an object with
		// properties (JSON)
		if (data instanceof Array) {
			// an array of arrays (we hope) like from SQL
			for (var i = 0; i < data.length; i++)
				this.set(data[i][0], data[i][1]);
		}
		else if (typeof data === "object") {
			this.data = data;
		}
	},
	
	save: function(key) {
		// set our data source with the new data... this
		// might get ugly
		if (key) {
			// single key
			this.dataSource.set(key, this.data[key].get());
		}
		else {
			// otherwise we save all our stuff
			for (var i in this.data) {
				this.dataSource.set(i, this.data[i].get());
			}
		}
	},
	
	getNumber: function(key) {
		return 0 + this.get(key);
	},
	
	getBoolen: function(key) {
		return 0 + this.parseInt(this.get(key));
	},
	
	get: function(key) {
		if (typeof this.preference[key] === 'undefined')
			return "";
		else
			return this.preference[key].get();
	},

	setBoolean: function(key, value) {
		this.set(key, (value) ? 1 : 0);
	},
	
	set: function(key, value) {
		if (typeof this.preference[key] === 'undefined')
			this.preference[key] = new joDataSource(value);
		else
			this.preference[key].set(value);
			
		this.save(key);
	},

	bind: function(key) {
		var self = this;

		// create new key if it doesn't exist
		if (typeof this.preference[key] === 'undefined')
			return new joDataSource();
		else
			return this.preference[key];
	}
};

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
	
//		joLog("keyup", e.keyCode, e.charCode);

		if (e.keyCode == 18) {
			this.altkey = false;
//			joLog("alt OFF");
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
			
//		joLog("keydown", e.keyCode, e.charCode);

		if (e.keyCode == 27) {
			this.backEvent.fire("back");
			return;
		}
		
		if (e.keyCode == 13 && joFocus.get() instanceof joInput) {
			joEvent.stop(e);
			return;
		}
		
		if (e.keyCode == 18) {
//			joLog("alt ON");
			this.altkey = true;
			return;
		}
	}
};/**
	joView
	=======
	
	Base class for all other views, containers, controls and other visual doo-dads.
	
	Use
	-----
	
		var x = new joView(data);
	
	Where `data` is either a text or HTML string, an HTMLElement, or any joView object
	or subclass.
		
	Methods
	-------
	
	- `setData(data)`
	- `getData()`
	- `createContainer(type, classname)`
	- `setContainer(element)`
	- `getContainer()`
	- `clear()`
	- `refresh()`
	
*/
joView = function(data) {
//	joLog("new view", this.tagName);
	
	this.changeEvent = new joSubject(this);

	this.setContainer();

	if (data)
		this.setData(data);
};
joView.prototype = {
	tagName: "joview",
	
	getContainer: function() {
		return this.container;
	},

	setContainer: function(container) {
		this.container = joDOM.get(container);
			
		if (!this.container)
			this.container = this.createContainer();
		
		this.setEvents();
		
		return this;
	},
	
	createContainer: function() {
		return joDOM.create(this);
	},

	clear: function() {
		this.data = "";
		
		if (this.container)
			this.container.innerHTML = "";

		this.changeEvent.fire();
	},

	setData: function(data) {
		this.data = data;
		this.refresh();
		
		return this;
	},

	getData: function() {
		return this.data;
	},

	refresh: function() {
		if (!this.container || typeof this.data == "undefined")
			return 0;

		this.container.innerHTML = "";
		this.draw();

		this.changeEvent.fire(this.data);
	},

	draw: function() {
		this.container.innerHTML = this.data;
	},
	
	setStyle: function(style) {
		joDOM.setStyle(this.container, style);
		
		return this;
	},
	
	setEvents: function() {}
};
/**
	joContainer
	============
	
	A view which is designed to contain other views and controls. Subclass to provide
	different layout types. A container can be used to intantiate an entire tree of
	controls at once, and is a very powerful UI component in jo.
	
	Use
	-----
	
		// plain container
		var x = new joContainer(data);
		
		// HTML or plain text
		var y = new joContainer("Some HTML");
		
		// HTMLElement
		var w = new joContainer(joDOM.get("mydiv"));
		
		// nested inline structure with text, HTML, joViews or HTMLElements
		var z = new joContainer([
			new joTitle("Hello"),
			new joList([
				"Red",
				"Green",
				"Blue"
			]),
			new joFieldset([
				"Name", new joInput(joPreference.bind("name")),
				"Phone", new joInput(joPreference.bind("phone"))
			]),
			new joButton("Done")
		]);
	
	Extends
	-------
	
	- joView
	
	Events
	------
	
	- `changeEvent`
	
	Methods
	-------
	
	- `setData(data)`

	  The constructor calls this method if you provide `data` when you instantiate
	  (see example above)
	
	- `push(data)`
	
	  Same support as `setData()`, but places the new content at the end of the
	  existing content.

*/
joContainer = function(data) {
	joView.apply(this, arguments);
};
joContainer.extend(joView, {
	tagName: "jocontainer",
	
	getContent: function() {
		return this.container.childNodes;
	},
	
	setData: function(data) {
		this.data = data;
		this.refresh();
	},
	
	activate: function() {},
	
	deactivate: function() {},

	push: function(data) {
		if (typeof data === 'object') {
			if (data instanceof Array) {
				// we have a list of stuff
				for (var i = 0; i < data.length; i++)
					this.push(data[i]);
			}
			else if (data instanceof joView && data.container !== this.container) {
				// ok, we have a single widget here
				this.container.appendChild(data.container);
			}
			else if (data instanceof Object) {
				// DOM element attached directly
				this.container.appendChild(data);
			}
		}
		else {
			// shoving html directly in does work
			var o = document.createElement("div");
			o.innerHTML = data;
			this.container.appendChild(o);
		}
	},
	
	refresh: function() {
		this.container.innerHTML = "";
		this.draw();
	},
	
	draw: function() {
		this.push(this.data);
	}
});
/**
	joCard
	======
	
	Special container for card views, more of an application-level view.
	
	Extends
	-------
	
	- joContainer
	
	Methods
	-------
	
	- `activate()`
	- `deactivate()`
	
	  These methods are called automatically by various joView objects, for
	  now joStack is the only one which does. Basically, allows you to add
	  application-level handlers to initialize or cleanup a joCard.
	
*/
joCard = function(data) {
	joContainer.apply(this, arguments);
};
joCard.extend(joContainer, {
	tagName: "jocard"
});

/**
	joGroup
	=======
	
	Group of controls, purely visual.
	
	Extends
	-------

	- joContainer
	
*/
joGroup = function(data) {
	joContainer.apply(this, arguments);
};
joGroup.extend(joContainer, {
	tagName: "jogroup"
});


/**
	joFooter
	======
	
	Attempt to make a filler object which pushed subsequent joView objects
	further down in the container if possible (to attach its contents to
	the bottom of a card, for eaxmple).
	
	> This behavior requires a working box model to attach properly to the bottom
	> of your container view.
	
	Extends
	-------
	
	- joContainer

*/
joFooter = function(data) {
	joContainer.apply(this, arguments);
};
joFooter.extend(joContainer, {
	tagName: "jofooter"
});
/**
	joStack
	========
	
 	A UI container which keeps an array of views which can be pushed and popped.
	The DOM elements for a given view are removed from the DOM tree when popped
	so we keep the render tree clean.

	Extends
	-------
	
	- joView

	Methods
	-------
	
	- `push(joView | HTMLElement)`	
	- `pop()`
	- `home()`
	- `show()`
	- `hide()`
	- `forward()`
	- `back()`
	- `setLocked(boolean)`
	
	  The `setLocked()` method tells the stack to keep the first view pushed onto the
	  stack set; that is, `pop()` won't remove it. Most apps will probably use this,
	  so setting it as a default for now.
	
	Events
	------
	
	- `showEvent`
	- `hideEvent`
	- `homeEvent`
	- `pushEvent`
	- `popEvent`
	
	Notes
	-----
	
	Should set classNames to new/old views to allow for CSS transitions to be set
	(swiping in/out, cross fading, etc). Currently, it does none of this.
	
	Also, some weirdness with the new `forward()` and `back()` methods in conjuction
	with `push()` -- need to work on that, or just have your app rigged to `pop()`
	on back to keep the nesting simple.
	
*/
joStack = function(data) {
	this.visible = false;
	
	joView.apply(this, arguments);

	// default to keep first card on the stack; won't pop() off
	this.setLocked(true);

	this.pushEvent = new joSubject(this);
	this.popEvent = new joSubject(this);
	this.homeEvent = new joSubject(this);
	this.showEvent = new joSubject(this);
	this.hideEvent = new joSubject(this);
	
	this.data = [];
	this.index = 0;
	this.lastIndex = 0;
	this.lastNode = null;
};
joStack.extend(joView, {
	tagName: "jostack",
	
	setEvents: function() {
		// do not setup DOM events for the stack
	},
	
	onClick: function(e) {
		joEvent.stop(e);
	},
	
	forward: function() {
		if (this.index < this.data.length - 1) {
			this.index++;
			this.draw();
		}
	},
	
	back: function() {
		if (this.index > 0) {
			this.index--;
			this.draw();
		}
	},
	
	draw: function() {
		if (!this.container)
			this.createContainer();

		var container = this.container;
		var oldchild = this.lastNode;
		var newchild = getnode(this.data[this.index]);

		function getnode(o) {
			return (typeof o.container !== "undefined") ? o.container : o;
		}
		
		if (!newchild)
			return;
		
		if (this.index > this.lastIndex) {
			var oldclass = "prev";
			var newclass = "next";
			joDOM.addCSSClass(newchild, newclass);
		}
		else if (this.index < this.lastIndex) {
			var oldclass = "next";
			var newclass = "prev";
			joDOM.addCSSClass(newchild, newclass);
		}
		else {
			container.innerHTML = "";
		}

		joLog("appendChild");
		container.appendChild(newchild);

		// trigger animation
		joYield(animate, this, 1);
		
		function animate() {
			joLog("animate");

			if (newclass && newchild)
				joDOM.removeCSSClass(newchild, newclass);

			if (oldclass && oldchild)
				joDOM.addCSSClass(oldchild, oldclass);

			// TODO: add transition end event if available, this as fallback
			setTimeout(cleanup, 800);
		}
		
		function cleanup() {
			if (oldchild && oldchild !== newchild)
				container.removeChild(oldchild);
		}
		
		if (typeof this.data[this.index].activate !== "undefined")
			this.data[this.index].activate.call(this.data[this.index]);
		
		this.lastIndex = this.index;
		this.lastNode = newchild;
		
		// while we're using scrollTop instead of joScroller, reset top position
		this.container.scrollTop = "0";
		if (this.container.firstChild)
			this.container.firstChild.scrollTop = "0";
	},
	
	isVisible: function() {
		return this.visible;
	},
	
	push: function(o) {
//		if (!this.data || !this.data.length || o !== this.data[this.data.length - 1])
//			return;
		
		this.data.push(o);
			
		this.index = this.data.length - 1;

		this.draw();

		this.pushEvent.fire(o);
	},

	// lock the stack so the first pushed view stays put
	setLocked: function(state) {
		this.locked = (state) ? 1 : 0;
	},
	
	pop: function() {
		if (this.data.length > this.locked) {
			var o = this.data.pop();
			this.index = this.data.length - 1;

			this.draw();
			
			if (typeof o.activate !== "undefined")
				o.deactivate.call(o);

			if (!this.data.length)
				this.hide();
		}

		if (this.data.length > 0)
			this.popEvent.fire();
	},
	
	home: function(o) {
		if (this.data && this.data.length) {
			var o = this.data[0];
			
			this.data = [];
			this.data.push(o);
			this.draw();
			
			this.homeEvent.fire();
		}
	},
	
	showHome: function() {
		this.home();
		
		if (!this.visible) {
			this.visible = true;
			joDOM.addCSSClass(this.container, "show");
			this.showEvent.fire();
		}
	},
	
	show: function() {
		if (!this.visible) {
			this.visible = true;
			joDOM.addCSSClass(this.container, "show");

			joYield(this.showEvent.fire, this.showEvent, 500);
		}
	},
	
	hide: function() {
		if (this.visible) {
			this.visible = false;
			joDOM.removeCSSClass(this.container, "show");			

			joYield(this.hideEvent.fire, this.hideEvent, 500);
		}
	}
});
/**
	joScroller
	==========
	
	A scroller container.

	Extends
	-------
	
	- joContainer
	
	Methods
	-------
	
	- `scrollBy(position)`
	- `scrollTo(position)`
	- `scrollToView(joView)`
	
	  Scrolls to make the top of the specified view visible.

	CSS
	---
	
	- `div.joScroller`
	- `flick` physics defined for flicking
	- `flickback` snap-back physics after a flick
	
	> Not ready for use; going through a re-write.

*/

joScroller = function(data) {
	this.points = [];
	this.eventset = false;

	// Call Super
	joContainer.apply(this, arguments);
};
joScroller.velocity = 10;
joScroller.extend(joContainer, {
	tagName: "joscroller",
	
	setEvents: function() {
		joEvent.on(this.container, "mousedown", this.onDown, this);
		joEvent.on(this.container, "mouseup", this.onUp, this);
		joEvent.on(this.container, "mousemove", this.onMove, this);
		joEvent.on(this.container, "mouseout", this.onOut, this);
	},
	
	onFlick: function(e) {
		var str = "";
		for (var i in e)
			str += "; " + i + "=" + e[i];
	},
	
	onDown: function(e) {
//		joLog("onDown");
		joEvent.stop(e);

		this.points = [];
		this.points.unshift(this.getMouse(e));
		this.inMotion = true;
		this.quickSnap = false;

		joDOM.removeCSSClass(this.data, "flick");
		joDOM.removeCSSClass(this.data, "flickback");
	},
	
	onMove: function(e) {
//		joLog("onMove");
		e.preventDefault();

		// TODO: move the page to follow the mouse
		if (this.inMotion) {
//			joLog("move");
			joEvent.stop(e);
			var point = this.getMouse(e);
			
			var y = point.y - this.points[0].y;
			this.points.unshift(point);
			if (this.points.length > 5)
				this.points.pop();
			
			this.scrollBy(y, true);
		}
	},

	onOut: function(e) {
//		this.inMotion = false;
//		var target = joDOM.getParentWithin(joEvent.getTarget(e), this.container);
//		if (target !== this.data) {
//			joEvent.stop(e);
//			this.onUp(e);
//		}
	},

	onUp: function (e) {
//		joLog("onUp");
		
		if (!this.inMotion)
			return;

		joEvent.stop(e);

		this.inMotion = false;

		var dy = 0;
		for (var i = 0; i < this.points.length - 1; i++)
			dy += (this.points[i].y - this.points[i + 1].y);
		
		if (this.points.length > 4)
			e.preventDefault();

		// if the velocity is "high" then it was a flick
		if (Math.abs(dy) > 5 && !this.quickSnap) {
			joDOM.addCSSClass(this.container.childNodes[0], "flick");

			var flick = dy * (this.container.childNodes[0].offsetHeight / this.container.offsetHeight);

//			joYield(this.snapBack, this, 1000);
			if (!this.eventset) {
				this.eventset = true;
				joEvent.on(this.container.childNodes[0], "webkitTransitionEnd", this.snapBack, this);
			}

			this.scrollBy(flick, false);
		}
		else {
			this.snapBack();
		}
	},
	
	getMouse: function(e) {
//		joLog(e.screenX, e.screenY, e.pageX, e.pageY, e.target, e.source);
		// TODO: This is picking up the element being touched's mouse position, so
		// need to follow the event chain up to the scroller's container.
		return { x: e.screenX, y: e.screenY };
	},
	
	scrollToElement: function (e) {
//		joDOM.addCSSClass(this.data, "flick");
//		this.data.style.top = -e.offsetTop + joDOM.getClientHeight() / 5 + "px";
	},
	
	scrollBy: function(y, test) {
		var top = this.container.childNodes[0].offsetTop;

		if (isNaN(top))
			top = 0;

		var dy = Math.floor(top + y);
		
		if (this.container.childNodes[0].offsetHeight <= this.container.offsetHeight)
			return;
			
		var max = 0 - this.container.childNodes[0].offsetHeight + this.container.offsetHeight;
//		var bump = Math.floor(this.container.offsetHeight * 0.2);
		
		var bump = 100;

		var ody = dy;
		
		if (dy > bump)
			dy = bump;
		else if (dy < max - bump)
			dy = max - bump;

		if (test) {
			if (ody != dy)
				this.quickSnap = true;
			else
				this.quickSnap = false;
		}
		
		if (this.container.childNodes[0].offsetTop != dy)
			this.container.childNodes[0].style.top = dy + "px";
	},
	
	snapBack: function() {
		var top = parseInt(this.container.childNodes[0].style.top);

		if (isNaN(top))
			top = 0;

		var dy = top;
		var max = 0 - this.container.childNodes[0].offsetHeight + this.container.offsetHeight;

		joDOM.removeCSSClass(this.data, 'flick');
		joDOM.addCSSClass(this.data, 'flickback');
		
		if (dy > 0)
			this.container.childNodes[0].style.top = "0px";
		else if (dy < max)
			this.container.childNodes[0].style.top = max + "px";
	}
});
/**
	joExpando
	=========
	
	A compound UI element which allows the user to hide/show its contents.
	The first object passed in becomes the trigger control for the container,
	and the second becoms the container which expands and contracts. This
	action is controlled in the CSS by the presence of the "open" class.
	
	Use
	---
	
		var x = new joExpando([
			new joSection("Options"),
			new joContainer([
				new joLabel("Label"),
				new joInput("sample field")
			]
		]);
	
	Extends
	-------
	
	- joContainer
	
	Methods
	-------
	
	- `open()`
	- `close()`
	- `toggle()`
	
	Events
	------
	
	- `openEvent`
	- `closeEvent`

*/
joExpando = function(data) {
	joContainer.apply(this, arguments);
};
joExpando.extend(joContainer, {
	tagName: "joexpando",
	
	draw: function() {
		joContainer.prototype.draw.apply(this, arguments);
		this.setToggleEvent();
	},
	
	setToggleEvent: function() {
		joEvent.on(this.container.childNodes[0], "click", this.toggle, this);
	},
	
	toggle: function() {
		joDOM.toggleCSSClass(this.container, "open");
	},
	
	open: function() {
		joDOM.addCSSClass(this.container, "open");
		this.openEvent.fire();
	},
	
	close: function() {
		joDOM.removeCSSClass(this.container, "open");
		this.closeEvent.fire();
	}
});

joExpandoTitle = function(data) {
	joView.apply(this, arguments);
};
joExpandoTitle.extend(joView, {
	tagName: "joexpandotitle",
	
	draw: function() {
		this.container.innerHTML = this.data + "<joicon></joicon>";
	}
});
/**
	joControl
	=========
	
	Interactive, data-driven control class which may be bound to a joDataSource,
	can receive focus events, and can fire off important events which other objects
	can listen for and react to.
	
	Extends
	-------
	
	- joView
	
	Events
	------
	
	- `changeEvent`
	- `selectEvent`
	
	Methods
	-------
	
	- `enable()`
	- `disable()`
	- `focus()`
	- `blur()`
	- `setDataSource(joDataSource)`
	- `setEvents()`
	
	CSS
	---
	
	`div.control`

*/
joControl = function(data) {
	this.selectEvent = new joSubject(this);
	this.enabled = true;

	if (data instanceof joDataSource) {
		// we want to bind directly to some data
		joView.call(this);
		this.setDataSource(data);
	}
	else {
		joView.apply(this, arguments);
	}
};
joControl.extend(joView, {
	tagName: "jocontrol",
	
	setEvents: function() {
		// not sure what we want to do here, want to use
		// gesture system, but that's not defined
		joEvent.on(this.container, "click", this.onMouseDown, this);

		joEvent.on(this.container, "blur", this.onBlur, this);
		joEvent.on(this.container, "focus", this.onFocus, this);
	},
	
	onMouseDown: function(e) {
		this.select(e);
	},
	
	select: function(e) {
		if (e)
			joEvent.stop(e);

		this.selectEvent.fire(this.data);
	},
	
	enable: function() {
		joDOM.removeCSSClass(this.container, 'disabled');
		this.container.contentEditable = true;
		this.enabled = true;
	},
	
	disable: function() {
		joDOM.addCSSClass(this.container, 'disabled');
		this.container.contentEditable = false;
		this.enabled = false;
	},

	onFocus: function(e) {
		joLog("onFocus", this.data);
		joEvent.stop(e);
		joFocus.set(this);
	},
	
	onBlur: function(e) {
		joLog("onBlur", this.data);
		joEvent.stop(e);
		this.blur();
	},
	
	focus: function(e) {
		joDOM.addCSSClass(this.container, 'focus');
		if (!e)
			this.container.focus();
	},
	
	blur: function() {
		joDOM.removeCSSClass(this.container, 'focus');
	},
	
	setDataSource: function(source) {
		this.dataSource = source;
//		this.refresh();
		source.changeEvent.subscribe(this.setData, this);
	}
});
/**
	joButton
	========
	
	Button control.
	
		// simple invocation
		var x = new joButton("Done");
		
		// optionally pass in a CSS classname to style the button
		var y = new joButton("Cancel", "cancelbutton");
		
		// like other controls, you can pass in a joDataSource
		// which could be useful, so why not
		var z = new joButton(joPreference.bind("processname"));
	
	Extends
	-------
	
	- joControl
	
	Methods
	-------
	
	- enable()
	- disable()
	
*/

joButton = function(data, classname) {
	// call super
	joControl.apply(this, arguments);
	
	if (classname)
		this.container.className = classname;
};
joButton.extend(joControl, {
	tagName: "jobutton",
	
	createContainer: function() {
		var o = joDOM.create(this);
		o.setAttribute("tabindex", "1");
		
		return o;
	},

	enable: function() {
		this.container.setAttribute("tabindex", "1");
		joControl.prototype.enable.call(this);
	},
	
	disable: function() {
		// this doesn't seem to work in safari doh
		this.container.removeAttribute("tabindex");
		joControl.prototype.disable.call(this);
	}
});
/**
	joInput
	=======
	
	Single-line text input control. When you instantiate or use `setData()`, you can
	either pass in an initial value or a reference to a joDataSource object which it,
	like other joControl instances, will bind to.
	
	Use
	---
	
		// simple value, simple field
		var x = new joInput(a);
		
		// attach the value to a preference
		var y = new joInput(joPreference.bind("username"));
		
		// attach input control to a custom joDataSource
		var username = new joDataSource("bob");
		var z = new joInput(username);
	
	Extends
	-------
	
	- joControl
	
	Methods
	-------
	
	- `focus()`
	- `blur()`
	
	  You can manually set focus or call the `blur()` method (which also
	  triggers a data save).
	
	- `setData()`
	
	  Pass in either some arbitrary value for the control, or a reference to
	  a joDataSource if you want to automatically bind to a storage system
	  (e.g. joPreference).
	
*/
joInput = function(data) {
	joControl.apply(this, arguments);
};
joInput.extend(joControl, {
	tagName: "joinput",
	
	setData: function(data) {
		if (data !== this.data) {
			this.data = data;
			
			if (typeof this.container.value != "undefined")
				this.container.value = data;
			else
				this.container.innerHTML = data;

			this.changeEvent.fire(this.data);
		}
	},
	
	getData: function() {
		if (typeof this.container.value != "undefined")
			return this.container.value;
		else
			return this.container.innerHTML;
	},
	
	enable: function() {
		this.container.setAttribute("tabindex", "1");
		joControl.prototype.enable.call(this);
	},
	
	disable: function() {
		this.container.removeAttribute("tabindex");
		joControl.prototype.disable.call(this);
	},	
	
	createContainer: function() {
		var o = joDOM.create(this);
		
		if (!o)
			return;
	
		o.setAttribute("type", "text");
		o.setAttribute("tabindex", "1");
		o.contentEditable = this.enabled;
		
		return o;
	},

	setEvents: function() {
		joControl.prototype.setEvents.call(this);
		joEvent.on(this.container, "keydown", this.onKeyDown, this);
	},
	
	onKeyDown: function(e) {
		if (e.keyCode == 13) {
			e.preventDefault();
			joEvent.stop(e);
		}
		return false;
	},
	
	onMouseDown: function(e) {
		joEvent.stop(e);
		this.focus();
	},
	
	storeData: function() {
		this.data = this.getData();
		if (this.dataSource)
			this.dataSource.set(this.value);
	}
});

/**
	joFocus
	=======
	
	Singleton which manages global input and event focus among joControl objects.
	
	Methods
	-------
	
	- `set(joControl)`
	
	  Unsets focus on the last control, and sets focus on the control passed in.
	
	- `clear()`
	
	  Unsets focus on the last control.
	
	- `refresh()`
	
	  Sets focus back to the last control that was focused.

*/

joFocus = {
	last: null,

	set: function(control) {
		if (this.last && this.last !== control)
			this.last.blur();
	
		if (control && control instanceof joControl) {
			control.focus();
			this.last = control;
		}
	},
	
	get: function(control) {
		return this.last;
	},
	
	refresh: function() {
		joLog("joFocus.refresh()");
		if (this.last)
			this.last.focus();
	},
	
	clear: function() {
		this.set();
	}
};

/**
	joList
	=======
	
	A widget class which expects an array of any data type and renders the
	array as a list. The list control handles DOM interactions with only a
	single touch event to determine which item was selected.
	
	Extends
	-------
	
	- joControl
	
	Events
	------
	
	- `selectEvent`
	
	  Fired when an item is selected from the list. The data in the call is the
	  index of the item selected.
	
	- `changeEvent`
	
	  Fired when the data is changed for the list.
	
	Methods
	-------

	- `formatItem(data, index)`
	
	  When subclassing or augmenting, this is the method responsible for
	  rendering a list item's data.
	
	- `compareItems(a, b)`
	
	  For sorting purposes, this method is called and should be overriden
	  to support custom data types.
	
			// general logic and approriate return values
			if (a > b)
				return 1;
			else if (a == b)
				return 0;
			else
				return -1

	- `setIndex(index)`

	- `getIndex(index)`
	
	- `refresh()`
	
	- `setDefault(message)`
	
	  Will present this message (HTML string) when the list is empty.
	  Normally the list is empty; this is a convenience for "zero state"
	  UI requirements.

	- `getNodeData(index)`
	
	- `getLength()`
	
	- `next()`

	- `prev()`
	
	- `setAutoSort(boolean)`

*/
joList = function(container, data) {
	this.autoSort = false;
	this.lastNode = null;
	this.index = 0;
	
	joControl.apply(this, arguments);
};
joList.extend(joControl, {
	tagName: "jolist",
	
	setDefault: function(msg) {
		this.defaultMessage = msg;
	},
	
	draw: function() {
		var html = "";
		var length = 0;

		if (this.data.length == 0 && typeof this.defaultMessage != "undefined") {
			this.container.innerHTML = this.defaultMessage;
			return;
		}

		for (var i = 0, l = this.data.length; i < l; i++) {
			var element = this.formatItem(this.data[i], i, length);

			if (element == null)
				continue;
			
			if (typeof element == "string")
				html += element;
			else
				this.container.appendChild(element);

			++length;
		}

		// support setting the contents with innerHTML in one go,
		// or getting back HTMLElements ready to append to the contents
		if (html.length)
			this.container.innerHTML = html;
		
		return;
	},

	deselect: function() {
		if (typeof this.container == 'undefined'
		|| !this.container['childNodes'])
			return;

		var node = this.container.childNodes[this.index];
		if (node) {
			if (this.lastNode)
				joDOM.removeCSSClass(this.lastNode, "selected");
		}
	},
	
	setIndex: function(index, silent) {
		joLog("setIndex", index);
		this.index = index;

		if (typeof this.container == 'undefined'
		|| !this.container['childNodes'])
			return;

		var node = this.container.childNodes[this.index];
		if (node) {
			if (this.lastNode)
				joDOM.removeCSSClass(this.lastNode, "selected");

			joDOM.addCSSClass(node, "selected");
			this.lastNode = node;
		}
		
		if (index >= 0 && !silent)
			this.fireSelect(index);
	},
	
	fireSelect: function(index) {
		this.selectEvent.fire(index);
	},
	
	getIndex: function() {
		return this.index;
	},
	
	onMouseDown: function(e) {
		var node = joDOM.getParentWithin(joEvent.getTarget(e), this.container);
		var index = this.getNodeIndex(node);
		
		if (index >= 0) {
			joEvent.stop(e);

			this.setIndex(index);
		}
	},
	
	refresh: function() {
		this.index = 0;
		this.lastNode = null;

		if (this.autoSort)
			this.sort();

		joControl.prototype.refresh.apply(this);
	},

	getNodeData: function(index) {
		if (this.data && this.data.length && index >= 0 && index < this.data.length)
			return this.data[index];
		else
			return null;
	},
	
	getLength: function() {
		return this.length || this.data.length || 0;
	},
	
	sort: function() {
		this.data.sort(this.compareItems);
	},
	
	getNodeIndex: function(element) {
		var index = element.getAttribute('index');
		if (typeof index !== "undefined" && index != null)
		 	return parseInt(index)
		else
			return -1;
	},
	
	formatItem: function(itemData, index) {
		var element = document.createElement('jolistitem');
		element.innerHTML = itemData;
		element.setAttribute("index", index);

		return element;
	},

	compareItems: function(a, b) {
		if (a > b)
			return 1;
		else if (a == b)
			return 0;
		else
			return -1;
	},

	setAutoSort: function(state) {
		this.autoSort = state;
	},
	
	next: function() {
		if (this.getIndex() < this.getLength() - 1)
			this.setIndex(this.index + 1);
	},
	
	prev: function() {
		if (this.getIndex() > 0)
			this.setIndex(this.index - 1);
	}
});
/**
	joTabBar
	=========
	
	Tab bar widget.
	
	Extends
	-------
	
	- joList

	Model
	-----
	
	Data is expected to be an array of `{ data: "", label: ""}` objects,
	in the display order for the bar.

*/
joTabBar = function() {
	joList.apply(this, arguments);
};
joTabBar.extend(joList, {
	tagName: "jotabbar",
	
	formatItem: function(data, index) {
		var o = document.createElement("li");

		if (data.label)
			o.innerHTML = data.label;
		
		if (data.type)
			o.className = data.type;

		o.setAttribute("index", index);
		
		return o;
	}
});
/**
	joTitle
	=======
	
	Title view, purely a visual presentation.
	
	Extends
	-------
	
	- joView

*/
joTitle = function(data) {
	joControl.apply(this, arguments);
};
joTitle.extend(joControl, {
	tagName: "jotitle"
});

/**
	joCaption
	=========
	
	Basically, a paragraph of text.
	
	Extends
	-------
	
	- joView
	
*/
joCaption = function(data) {
	joControl.apply(this, arguments);
};
joCaption.extend(joControl, {
	tagName: "jocaption"
});

/**
	joHTML
	======
	
	A simple HTML content control. One interesting feature is it intercepts all
	`<a>` tag interactions and fires off a `selectEvent` with the contents of
	the tag's `href` property.
	
	This is a relatively lightweight approach to displaying arbitrary HTML
	data inside your app, but it is _not_ recommended you allow external
	JavaScript inside the HTML chunk in question.
	
	Also keep in mind that your app document already _has_ `<html>`, `<head>` and
	`<body>` tags. When you use the `setData()` method on this view, _make sure
	you don't use any of these tags_ to avoid weird issues.
	
	> In a future version, it is feasible to load in stylesheets references in
	> the HTML document's `<head>` section. For now, that entire can of worms
	> will be avoided, and it's left up to you, the developer, to load in any
	> required CSS files using `joDOM.loadCSS()`.
	
	Extends
	-------
	
	- joControl
	
	Use
	---
	
		// simple html string
		var x = new joHTML("<h1>Hello World!</h1><p>Sup?</p>");
		
		// use a joDataSource like a file loader
		var y = new joHTML(new joFileSource("sample.html"));
	
*/
joHTML = function(data) {
	joControl.apply(this, arguments);
};
joHTML.extend(joControl, {
	tagName: "johtml",
	
	setEvents: function() {
		// limited events, no focus for example
		joEvent.on(this.container, "click", this.onClick, this);
	},
	
	// special sauce -- we want to trap any a href click events
	// and return them in our select event -- don't need to be
	// refreshing our entire page, after all
	onClick: function(e) {
		joEvent.stop(e);
		joEvent.preventDefault(e);
		
		// figure out what was clicked, look for an href
		var container = this.container;
		var hrefnode = findhref(joEvent.getTarget(e));
		
		if (hrefnode) {
			// whoa we have an <a> tag clicked
			this.selectEvent.fire(hrefnode.href);
		}
		
		function findhref(node) {
			if (!node)
				return null;

			if (node.href)
				return node;
				
			if (typeof node.parentNode !== "undefined" && node.parentNode !== container)
				return findhref(node.parentNode);
			else
				return null;
		}
	}
});

/**
	joMenu
	======
	
	Simple menu class with optional icons.
	
	Extends
	-------
	
	- joList
	
	Methods
	-------
	
	- `setData(menudata)`
	
	  See the example below for the format of the menu data.
	
	Use
	---
	
		// simple inline menu; you can always setup the menu items (or change
		// them) but using the `setData()` method, same as any joView
		var menu = new joMenu([
			{ title: "About" },
			{ title: "Frequently Asked Questions", id: "faq" },
			{ title: "Visit our website", id: "visit", icon: "images/web" }
		]);
		
		// simple inline function event handler
		menu.selectEvent.subscribe(function(id) {
			switch (id) {
			case "0":
				// the "About" line; if no id, the index of the menu item is used
				stack.push(aboutCard);
				break;
			case "faq":
				stack.push(faqCard);
				break;
			case "visit":
				stack.push(visitCard);
				break;
			}
		});
	
	Advanced Use
	------------
	
	This could actually be called "more consistent and simple" use. If your menus
	are static, you could always setup an id-based dispatch delegate which pushes
	the appropriate card based on the menu `id` selected.

	You could use the `id` in conjunction with view keys you create with joCache.
	The handler would then something like:
	
		menu.selectEvent.subscribe(function(id) {
			mystack.push(joCache.get(id));
		});

*/
joMenu = function(data) {
	joList.apply(this, arguments);
};
joMenu.extend(joList, {
	tagName: "jomenu",

	fireSelect: function(index) {
		if (typeof this.data[index].id !== "undefined" && this.data[index].id)
			this.selectEvent.fire(this.data[index].id);
		else
			this.selectEvent.fire(index);
	},
	
	formatItem: function(item, index) {
		var o = joDOM.create("jomenuitem");
		
		// TODO: not thrilled with this system of finding the
		// selected item. It's flexible but annoying to code to.
		o.setAttribute("index", index);
		
		// quick/dirty
		o.innerHTML = ((item.icon) ? '<img src="' + item.icon + '">' : "") + '<jomenutitle>' + item.title + '</jomenutitle>';
		
		return o;
	}
});
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
	- `load()`
	- `setLoop(n)`
	
	  Tell the joSound to automatically loop `n` times. Set to `-1` to loop
	  continuously until `pause()`.
	
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
		
	joYield(function() {
		this.audio.src = filename;
		this.audio.load();
	}, this, 5);
	
	this.setRepeatCount(repeat);

	joEvent.on(this.audio, "ended", this.onEnded, this);

//	this.pause();
};
joSound.prototype = {
	play: function() {
		if (!this.audio)
			return;

		this.audio.play();
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
		
		this.repeat = 0;
	},

	stop: function() {
		this.pause();
		this.rewind();
		
		this.repeat = 0;
	},
	
	setVolume: function(vol) {
		if (!this.audio || vol < 0 || vol > 1)
			return;

		this.audio.volume = vol;
	}
};
/**
	joPasswordInput
	===============
	
	Secret data input field (e.g. displays `******` instead of `secret`).
	
	Extends
	-------
	
	- joInput
	
	> Note that this requires CSS3 which is known not to be currently supported
	> in Opera or Internet Explorer.

*/
joPasswordInput = function(data) {
	joInput.apply(this, arguments);
};
joPasswordInput.extend(joInput, {
	className: "password"
});
/**
	joDivider
	=========
	
	Simple visual divider.
	
	Extends
	-------
	
	- joView

*/
joDivider = function(data) {
	joView.apply(this, arguments);
};
joDivider.extend(joView, {
	tagName: "jodivider"
});

/**
	joLabel
	=======
	
	Label view, purely a visual presentation. Usually placed in front
	of input fields and other controls.
	
	Extends
	-------
	
	- joView
	
*/
joLabel = function(data) {
	joControl.apply(this, arguments);
};
joLabel.extend(joControl, {
	tagName: "jolabel"
});

