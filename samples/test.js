/*
	NOTE:
	What follows is a mishmash of coding techniques put together as a rough
	test for the library. It it not intended as a "best practice" coding exmaple,
	but reather shows off some of the many approaches you can use to interact
	with the Jo framework.
*/

// required:
jo.load();
jo.setDebug(true);

// placed in a module pattern, not a terrible idea for application level code
var App = (function() {
	var stack;
	var button;
	var backbutton;
	var page;
	var login;
	var test;
	var more;
	var moreback;
	var urldata;
	var list;
	var menu;
	var cssnode;
	var blipsound = new joSound("blip2.wav");
	var bloopsound = new joSound("blip0.wav");
	var cancelbutton;

	/*
		EXAMPLE: if you want to configure what HTML tag and optional CSS class name a given
		UI class creates, you can change that by altering the properties in the class directly.
		NOTE: this should be done after jo is loaded, but before you create any new UI objects.
	*/
	// uncomment to try this out:
//		joInput.prototype.tagName = "input";
//		joInput.prototype.className = "stuff";

	function init() {		
		// silly, but you you can load style tags with a string
		// which may be moderately useful. the node is returned,
		// so in theory you could replace it or remove it.
		// a more practical case would be to use the loadCSS() method
		// to load in an additional stylesheet
		cssnode = joDOM.applyCSS(".htmlgroup { background: #fff; }");
		
		// more css, but deferred loading until after the app initializes
		joYield(function() {
			bodycssnode = joDOM.loadCSS("../docs/html/doc.css");
			
			// dynamic CSS loading based on platform, in this case FireFox
			// doesn't do stack transitions well, so we're downshifting

			if (jo.matchPlatform("chrome iphone ipad webkit safari webos"))
				joDOM.loadCSS("../css/aluminum/webkit.css");
			else
				joDOM.loadCSS("../css/aluminum/gecko.css");
			
			// as an optimization, I recommend in a downloadable app that
			// you create a custom CSS file for each platform using some
			// sort of make-like process.
		}, this);
		
		// chaining is supported on constructors and any setters
		stack = new joStack().setStyle("page");
		
		login = new joScroller(
			new joCard(
				new joContainer([
					new joTitle("Login"),
					new joGroup([
						new joLabel("Username"),
						nameinput = new joInput("Dave"),
						new joLabel("Password"),
						new joPasswordInput("heyjo"),
					]),
					new joDivider(),
					new joExpando([
						new joExpandoTitle("Advanced Settings"),
						new joGroup([
							new joLabel("Domain"),
							new joInput("localhost"),
							new joLabel("Port"),
							new joInput("80")
						])
					]),
					new joFooter([
						new joDivider(),
						button = new joButton("Login"),
						cancelbutton = new joButton("Back")
					])
				])
			)
		);
//	was demoing how to disable a control, but decided having a "back"
// button was more important right now
//		cancelbutton.disable();
		cancelbutton.selectEvent.subscribe(back, this);
		
		login.activate = function() {
			joFocus.set(nameinput);
			
			// not too happy about this; may turn this into two separate
			// calls to ensure the low-level one always gets called
			joCard.prototype.activate.call(this);
		};

		// some arbitrary HTML shoved into a joHTML control
		var html = new joHTML('<h1>Disclaimer</h1><p>This is a disclaimer. For more information, you can check <a href="moreinfo.html">this <b>file</b></a> for more info, or try your luck with <a href="someotherfile.html">this file</a>.');
		var htmlgroup;
		
		page = new joCard([
			new joTitle("Success"),
			new joLabel("HTML Control"),
			htmlgroup = new joGroup(html),
			new joCaption("Note that the HTML control above is using another stylesheet without impacting our controls."),
			new joFooter([
				new joDivider(),
				backbutton = new joButton("Back")
			])
		]);
		
		htmlgroup.setStyle("htmlgroup");
		
		more = new joCard([
			new joTitle("More Info"),
			new joGroup([
				new joCaption("Good job! This is more info. Not very informative, is it?"),
				new joCaption(urldata = new joDataSource(""))
			]),
			new joFooter([
				new joDivider(),
				moreback = new joButton("Back Again")
			])
		]);
		
		menu = new joCard([
			new joTitle("Menu"),
			list = new joMenu([
				{ title: "Login", id: "login" },
				{ title: "Textarea", id: "textarea" },
				{ title: "Help", id: "help" },
				{ title: "On Demand View", id: "test" }
			])
		]);
		menu.activate = function() {
			// maybe this should be built into joMenu...
			list.deselect();
		};

		list.selectEvent.subscribe(function(id) {
			if (id == "login")
				stack.push(login);
			else if (id != "help")
				stack.push(joCache.get(id));
		}, this);
		
		// we can defer creating views until they're needed
		// using joCache
		joCache.set("test", function() {
			var back;

			joLog("creating test view on demand");

			var card = new joCard([
				new joTitle("On-Demand View"),
				new joGroup([
					new joCaption("This view was created on-demand using joCache.get('test'). From now on,"
					+ "this view will not be recreated, but pulled from the cache.")
				]),
				new joDivider(),
				back = new joButton("Back")
			]);

			back.selectEvent.subscribe(function() {
				stack.pop();
			});

			return card;
		}, this);
		
		joCache.set("textarea", function() {
			var back;
			
			var card = new joCard([
				new joTitle("Auto-sized Textarea"),
				new joLabel(),
				new joTextarea("Here is some sample text in a multiline joTextarea control."
				+ " As you type, it will grow, but stop at its max height.").setStyle({
					minHeight: "100px",
					maxHeight: "300px"
				}),
				new joDivider(),
				back = new joButton("Back")
			]);

			back.selectEvent.subscribe(function() {
				stack.pop();
			});

			return card;
		}, this);

		moreback.selectEvent.subscribe(function() { stack.pop(); }, this);
		button.selectEvent.subscribe(click.bind(this));
		backbutton.selectEvent.subscribe(back, this);
		html.selectEvent.subscribe(link, this);
		
		stack.pushEvent.subscribe(blip, this);
		stack.popEvent.subscribe(bloop, this);
		
		joGesture.forwardEvent.subscribe(stack.forward, stack);
		joGesture.backEvent.subscribe(stack.pop, stack);
		
//		var scroller = new joScroller(stack);
		document.body.appendChild(stack.container);

		stack.push(menu);
	}
	
	function blip() {
		blipsound.play();
	}
	
	function bloop() {
		bloopsound.play();
	}
	
	function link(href) {
		joLog("HTML link clicked: " + href);
		urldata.setData(href);
		stack.push(more);
	}
	
	function click() {
		stack.push(page);
	}
	
	function back() {
		stack.pop();
	}
	
	// public stuff
	return {
		"init": init,
		"getStack": function() { return stack },
		"getButton": function() { return button }
	}
}());

App.init();
