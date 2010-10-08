/**
	joCollect
	=========
	
	Utility method parses the DOM tree for a given element and attempts to
	attach appropriate joView subclasses to all the nodes. Returns an
	object with references to all elements with the `id` attribute set. This
	method helps turn HTML into HTML + JavaScript.
	
	Calling
	-------
	
		// an HTML element by its ID
		var x = joCollect.get("someid");
		
		// a known HTML element
		var x = joCollect.get(someHTMLElement);`
	
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
		var x = joCollect.get("login");

	Produces these properties:
	
	- `x.login` is a reference to a `new joCard`
	- `x.username` is a reference to a `new joInput`
	- `x.password` is a reference to a `new joPassword`
	- `x.loginbutton` is a reference to a `new joButton`
	
	This in essence flattens your UI to a single set of properties you can
	use to access the controls that were created from your DOM structure.
	
	In addition, any unrecognized tags which have an `id` attribute set will
	also be loaded into the properties.
	
	While you could put your entire UI in your document body and call joCollect
	to build all your controls at once, this might not be the best thing to do,
	especially if you have a lot of controls.
	
	Also, keep in mind that unless you contain your controls in some sort
	of wrapper tag with `display:none` set in its CSS, your entire UI might flash
	briefly on the screen while the parser does its thing.
	
	> This utility method is experimental! Be very careful with it. *NOTE* that
	> for now, this method requires you to remove whitespace in your HTML. If you
	> don't know a good approach offhand to do that, this thing probably isn't
	> ready for you yet. :)

*/
joCollect = {
	loaded: 0,
	view: {},
	
	get: function(parent) {
		// we only want to spin through the DOM if the dev
		// uses this utility; this builds a list of all the
		// instances of joView in global space, used to match
		// up by tagName.
		if (!this.loaded++)
			jo.attachViewClasses();
			
		var parent = joDOM.get(parent);

//		console.log(parent);

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
			
			if (joCollect.view[tag]) {
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
				
				var o = (node.type) ? joCollect.view[tag][node.type] : joCollect.view[tag];
				var view = new o(args);

//				view.setData(args);
				
//				if (view instanceof joContainer)
//					view.draw(view);
					
//				if (view instanceof joExpando)
//					view.setToggleEvent();
					
			}
			
			// keep track of named controls
			if (node.id)
				ui[node.id] = view;
				
			return view;
		}
		
		// send back our object with named controls as properties
		return ui;
	}
};
