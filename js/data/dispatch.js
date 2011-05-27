/**
	joDispatch
	==========
	
	Feed it a URL, and it routes to other sections of your code. Think of
	it as a mini "server" for handling local URL patterns. joDispatch does
	not load file on its own, keeping it flexible. There may be cases where
	you want to process a URL by loading several files, or by pulling from
	a remote server, or generating data -- you get the idea.
	
	This implication here is you could have an application which is almost
	entirely driven by URL requsts without having to leave your app's page.
	
	A basic use case would be an HTML help system with local files (or
	remote, all up to how you process the URLs).
	
	Use
	---
	
		// simple dispatcher, fires off loadEvent for every URL
		var x = new joDispatch();

		// setup a handler in your application
		x.loadEvent.subscribe(MyApp.loadHTML, MyApp);
		
		// process a URL through our dispatcher
		x.load("sample.html");
		
		// add a special handler for URLs which start with help
		x.addHandler("help/", function(param, url) {
			// param has everything PAST the 'help/' URL pattern
			return new joHTML(new joFileSource(param + ".html"));
		});
		
		// make a handler which, based on URL prefixed with 'remote/',
		// fetches data from your sever instead of a local file
		x.addHandler("remote/", function(param, url) {
			return new joHTML(new joFileSource("http://myserve.com" + param));
		});
	
*/

joDispatch = function(handler) {
	this.handlers = [];
	this.loadEvent = new joSubject(this);
	this.errorEvent = new joSubject(this);
};

joDispatch.prototype = {
	load: function(url) {
		var h = this.getHandler(url);
		
		if (!h) {
			joLog("joDispatch: no handler for URL", url);
			this.errorEvent.fire(url);
		}
		else {
			var p = url.substr(h.url.length);

			if (h.context)
				this.loadEvent.fire(h.call.call(h.context, p, url));
			else
				this.loadEvent.fire(h.call(p, url));
		}
		
		return this;
	},
	
	addHandler: function(url, call, context) {
		if (typeof url === 'undefined')
			return;
			
		this.handlers.push({
			url: url.toLowerCase(),
			call: call,
			context: (typeof context !== undefined) ? context : null
		});
		this.handlers = this.handlers.sort(compare);
		
		function compare(a, b) {
			if (a.url < b.url)
				return 1;
			else if (a.url == b.url)
				return 0;
			else return -1;
		}
		
		return this;
	},

	getHandler: function(url) {
		var h = this.handlers;
		url = url.toLowerCase();

		for (var i = 0, l = h.length; i < l; i++) {
			if (url.indexOf(h[i].url, 0) === 0)
				return h[i];
		}
		
		return null;
	}	
};
