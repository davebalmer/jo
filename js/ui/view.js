/**
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
	- `setContainer(HTMLElement)`
	- `getContainer()`
	- `clear()`
	- `refresh()`

	- `attach(HTMLElement or joView)`
	- `detach(HTMLElement or joView)`
	
	  Convenience methods which allow you to append a view or DOM node to the
	  current view (or detach it).
	
*/
joView = function(data) {
	this.changeEvent = new joSubject(this);

	this.container = null;
	this.setContainer();

	if (data)
		this.setData(data);
	else
		this.data = null;
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
		
		return this;
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
		if (!this.container || typeof this.data === "undefined")
			return this;

		this.container.innerHTML = "";
		this.draw();

		this.changeEvent.fire(this.data);
		
		return this;
	},

	draw: function() {
		this.container.innerHTML = this.data;
	},
	
	setStyle: function(style) {
		joDOM.setStyle(this.container, style);
		
		return this;
	},
	
	attach: function(parent) {
		if (!this.container)
			return this;
		
		var node = joDOM.get(parent) || document.body;
		node.appendChild(this.container);
		
		return this;
	},
	
	detach: function(parent) {
		if (!this.container)
			return this;

		var node = joDOM.get(parent) || document.body;
		
		if (this.container && this.container.parentNode === node)
			node.removeChild(this.container);
		
		return this;
	},

	setSize: function(w, h) {
		this.container.style.width = w + "px";
		this.container.style.height = h + "px";

		return this;
	},

	setPosition: function(x, y) {
		this.container.style.position = "absolute";
		this.container.style.left = x + "px";
		this.container.style.top = y + "px";

		return this;
	},

	setId: function(id) {
		this.container.id = id;
		return this;
	},

	setEvents: function() {}
};
