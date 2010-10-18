/**
	joExpando
	=========
	
	A compound UI element which allows the user to hide/show its contents.
	The first object passed in becomes the trigger control for the container,
	and the second becomes the container which expands and contracts. This
	action is controlled in the CSS by the presence of the "open" class.
	
	Use
	---
	
		var x = new joExpando([
			new joExpandoTitle("Options"),
			new joContainer([
				new joLabel("Label"),
				new joInput("sample field")
			])
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
		if (!this.data)
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
			this.close();
		else
			this.open();
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


/**
	joExpandoContent
	================
	
	New widget to contain expando contents, used by joExpando.
	
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


