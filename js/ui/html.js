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

