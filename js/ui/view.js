/**
	joView
	=======
	
	Base class for widows, widgets and other visual doo-dads.
	
	Use
	-----
	
		var x = new joView(data);
		
	Methods
	-------
	
	- `setData(data)`
	- `getData()`
	- `setContainer(element)`
	- `getContainer()`
	- `createContainer(type, classname)`
	- `clear()`
	- `refresh()`
	
	CSS
	---
	
	`div.view`

*/
joView = function(data) {
	this.changeEvent = new joSubject(this);

	this.setContainer();

	if (data)
		this.setData(data);
};
joView.prototype = {
	getTag: function() {
		return this.tag;
	},
	
	getContainer: function() {
		return this.container;
	},

	setContainer: function(container) {
		this.container = joDOM.get(container);
			
		if (!this.container)
			this.container = this.createContainer();
		
		this.setEvents();
	},
	
	createContainer: function(tag, classname) {
		return joDOM.create(tag || "joview", classname);
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
	},
	
	setEvents: function() {}
};
