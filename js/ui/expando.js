/**
	joExpando
	=========
	
	A compound UI element which allows the user to hide/show its contents.
	The first object passed in becomes the trigger control for the container,
	and the second becomes the container which expands and contracts. This
	action is controlled in the CSS by the presence of the "open" class.
	
	Use
	---
	
	This is a typical pattern:
	
		// normal look & feel
		var x = new joExpando([
			new joExpandoTitle("Options"),
			new joExpandoContent([
				new joLabel("Label"),
				new joInput("sample field")
			])
		]);
	
	Note that joExpando doesn't care what sort of controls you tell it
	to use. In this example, we have a joButton that hides and shows a
	DOM element:
		
		// you can use other things though
		var y = new joExpando([
			new joButton("More..."),
			joDOM.get("someelementid")
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
	this.openEvent = new joSubject(this);
	this.closeEvent = new joSubject(this);
	
	joContainer.apply(this, arguments);
};
joExpando.extend(joContainer, {
	tagName: "joexpando",
	
	draw: function() {
		if (!this.data || !this.container)
			return;
		
		joContainer.prototype.draw.apply(this, arguments);
		this.setToggleEvent();
	},
	
	setEvents: function() {
	},
	
	setToggleEvent: function() {
		joEvent.on(this.container.childNodes[0], "click", this.toggle, this);
	},
	
	toggle: function() {
		if (this.container.className.indexOf("open") >= 0)
			return this.close();
		else
			return this.open();
	},
	
	open: function() {
		joDOM.addCSSClass(this.container, "open");
		this.openEvent.fire();
		
		return this;
	},
	
	close: function() {
		joDOM.removeCSSClass(this.container, "open");
		this.closeEvent.fire();
		
		return this;
	}
});


/**
	joExpandoContent
	================
	
	New widget to contain expando contents. This is normally used with
	joExpando, but not required.
	
	Extends
	-------
	- joContainer
*/
joExpandoContent = function() {
	joContainer.apply(this, arguments);
};
joExpandoContent.extend(joContainer, {
	tagName: "joexpandocontent"
});


