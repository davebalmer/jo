/**
	joInterface
	===========
	
	*EXPERIMENTAL*

	> This utility method is experimental! Be very careful with it. *NOTE* that
	> for now, this class requires you to remove whitespace in your HTML. If you
	> don't know a good approach offhand to do that, then this thing probably isn't
	> ready for you yet.
	
	This class parses the DOM tree for a given element and attempts to
	attach appropriate joView subclasses to all the relevant HTML nodes.
	Returns an object with references to all elements with the `id`
	attribute set. This method helps turn HTML into HTML + JavaScript.
	
	Use
	---
	
		// an HTML element by its ID
		var x = new joInterface("someid");
		
		// a known HTML element
		var y = new joInterface(someHTMLElement);
		
		// the entire document body (careful, see below)
		var z = new joInterface();
	
	Returns
	-------
	
	A new object with a property for each element ID found. For example:
	
		<!-- this DOM structure -->
		<jocard id="login">
			<jotitle>Login</jotitle>
			<jogroup>
				<jolabel>Username</jolabel>
				<input id="username" type="text">
				<jolabel>Password</jolabel>
				<input id="password" type="password">
			</jogroup>
			<jobutton id="loginbutton">Login</jobutton>
		</jocard>
	
	Parsed with this JavaScript:
	
		// walk the DOM, find nodes, create controls for each
		var x = new joInterface("login");

	Produces these properties:
	
	- `x.login` is a reference to a `new joCard`
	- `x.username` is a reference to a `new joInput`
	- `x.password` is a reference to a `new joPassword`
	- `x.loginbutton` is a reference to a `new joButton`
	
	This in essence flattens your UI to a single set of properties you can
	use to access the controls that were created from your DOM structure.
	
	In addition, any unrecognized tags which have an `id` attribute set will
	also be loaded into the properties.
	
	Parsing complex trees
	---------------------
	
	Yes, you can make a joInterface that encapsulates your entire UI with HTML.
	This is not recommended for larger or more complex applications, some
	reasons being:
	
	- Rendering speed: if you're defining multiple views within a `<jostack>`
	  (or another subclass of joContainer), your users will see a flicker and
	  longer load time while the window renders your static tags and the extra
	  views for the stack are removed from view.
	
	- Double rendering: again with `<jostack>` tags, you're going to see a separate
	  render when the first view is redrawn (has to).
	
	- Load time: especially if you're doing a mobile app, this could be a biggie.
	  You are almost always going to be better off building the app controls with
	  JavaScript (especially in conjunction with joCache, which only creates DOM
	  nodes for a given view structure on demand).
	
	If you really want to use HTML as your primary means of defining your UI, you're
	better off putting your major UI components inside of a `<div>` (or other tag)
	with `display: none` set in its CSS property. Like this:
	
		<!-- in your CSS: .hideui { display: none } -->
		<div class="hideui" id="cards">
			<jocard id="about">
				<jotitle>About this app</jotitle>
				<johtml>
					This is my app, it is cool.
				</johtml>
				<jobutton>Done</jobutton>
			</jocard>
			<jocard id="login">
				... etc ...
			</jocard>
		</div>
		
	Then in your JavaScript:
	
		// pull in all our card views from HTML
		var cards = new joInterface("cards");
		
	Definitely use this class judiciously or you'll end up doing a lot of recatoring
	as your application grows.
	
	Flattening UI widget references
	-------------------------------
	
	This is both good and bad, depending on your coding style and complexity of
	your app. Because all the tags with an ID attribute (regardless of where they
	are in your tag tree) get a single corresponding property reference, things
	could get very messy in larger apps. Again, be smart.
	
*/
joInterface = function(parent) {
	// initialize our tag lookup object
	jo.initTagMap();
	
	// surprise! we're only using our prototype once and
	// just returning references to the nodes with ID attributes
	return this.get(parent);
};
joInterface.prototype = {
	get: function(parent) {
		parent = joDOM.get(parent);

		if (!parent)
			parent = document.body;

		var ui = {};

		// pure evil -- seriously
		var setContainer = joView.setContainer;
		var draw = joView.draw;
		
		parse(parent);

		// evil purged
		joView.setContainer = setContainer;
		joView.draw = draw;
		
		function parse(node) {
			if (!node)
				return;
			
			var args = "";

			// handle all the leaves first
			if (node.childNodes && node.firstChild) {
				// spin through child nodes, build our list
				var kids = node.childNodes;
				args = [];
				
				for (var i = 0, l = kids.length; i < l; i++) {
					var p = parse(kids[i]);

					if (p)
						args.push(p);
				}
			}

			// make this control
			return newview(node, args);
		}
		
		// create appropriate joView widget from the tag type,
		// otherwise return the node itself
		function newview(node, args) {
			var tag = node.tagName;
			var view = node;

//			console.log(tag, node.nodeType);
			
			if (jo.tagMap[tag]) {
				if (args instanceof Array && args.length) {
					if (args.length == 1)
						args = args[0];
				}

				if (args instanceof Text)
					args = node.nodeData;
				
				if (!args)
					args = node.value || node.checked || node.innerText || node.innerHTML;

//				console.log(args);
				
				joView.setContainer = function() {
					this.container = node;

					return this;
				};
				
				var o;
				
				if (typeof jo.tagMap[tag] === "function") {
					o = jo.tagMap[tag];
				}
				else {
					var t = node.type || node.getAttribute("type");
					o = jo.tagMap[tag][t];
				}
				
				if (typeof o === "function")
					view = new o(args);
				else
					joLog("joInterface can't process ", tag, "'type' attribute?");
			}
			
			// keep track of named controls
			if (node.id)
				ui[node.id] = view;
				
			return view;
		}
		
		// send back our object with named controls as properties
//		console.log(ui);
		return ui;
	}
};
