jo.load();

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
	//	joPasswordInput.prototype.tagName = "input";
	//	joPasswordInput.prototype.className = "stuff";

	function init() {
		joLog("App.init()");
		
		// silly, but you you can load style tags with a string
		// which may be moderately useful. the node is returned,
		// so in theory you could replace it or remove it.
		// a more practical case would be to use the loadCSS() method
		// to load in an additional stylesheet
		cssnode = joDOM.applyCSS("jocard { background-color: #ccc; background-image: url(../css/aluminum/brushedgrey.png); background-repeat: no-repeat; background-attachment: fixed; -webkit-background-origin: content-box; -webkit-background-size: 100%; background-size: 100.5%; -moz-background-size: 100%; } .htmlgroup { background: #fff; }");
		
		bodycssnode = joDOM.loadCSS("../docs/html/doc.css");
				
		stack = new joStack();
		stack.setStyle("page");
		
		login = new joCard([
			new joTitle("Login"),
			new joGroup([
				new joLabel("Username"),
				nameinput = new joInput("Dave"),
				new joLabel("Password"),
				new joPasswordInput("heyjo"),
			]),
			new joFooter([
				new joDivider(),
				button = new joButton("Login"),
				cancelbutton = new joButton("Cancel")
			])
		]);
		cancelbutton.disable();
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
				{ title: "Checklist", id: "checklist" },
				{ title: "Help", id: "help" }
			])
		]);
		menu.activate = function() {
			// maybe this should be built into joMenu...
			list.deselect();
		};

		list.selectEvent.subscribe(function(id) {
			if (id == "login") {
				stack.push(login);
			}
		}, this);

		moreback.selectEvent.subscribe(function() { stack.pop(); }, this);
		button.selectEvent.subscribe(click.bind(this));
		backbutton.selectEvent.subscribe(back, this);
		html.selectEvent.subscribe(link, this);
		
		stack.pushEvent.subscribe(blip, this);
		stack.popEvent.subscribe(bloop, this);
		
		joGesture.forwardEvent.subscribe(stack.forward, stack);
		joGesture.backEvent.subscribe(stack.pop, stack);
		
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