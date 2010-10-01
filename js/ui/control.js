/**
	joControl
	=========
	
	Interactive, data-driven control class which may be bound to a joDataSource,
	can receive focus events, and can fire off important events which other objects
	can listen for and react to.
	
	Extends
	-------
	
	- joView
	
	Events
	------
	
	- `changeEvent`
	- `selectEvent`
	
	Methods
	-------
	
	- `enable()`
	- `disable()`
	- `focus()`
	- `blur()`
	- `setDataSource(joDataSource)`
	- `setEvents()`
	
	CSS
	---
	
	`div.control`

*/
joControl = function(data) {
	this.selectEvent = new joSubject(this);
	this.enabled = true;

	if (data instanceof joDataSource) {
		// we want to bind directly to some data
		joView.call(this);
		this.setDataSource(data);
	}
	else {
		joView.apply(this, arguments);
	}
};
joControl.extend(joView, {
	tagName: "jocontrol",
	
	setEvents: function() {
		// not sure what we want to do here, want to use
		// gesture system, but that's not defined
		joEvent.on(this.container, "click", this.onMouseDown, this);
		joEvent.on(this.container, "blur", this.onBlur, this);
		joEvent.on(this.container, "focus", this.onFocus, this);
	},
	
	onMouseDown: function(e) {
		this.select(e);
	},
	
	select: function(e) {
		if (e)
			joEvent.stop(e);

		this.selectEvent.fire(this.data);
	},
	
	enable: function() {
		joDOM.removeCSSClass(this.container, 'disabled');
		this.container.contentEditable = true;
		this.enabled = true;
	},
	
	disable: function() {
		joDOM.addCSSClass(this.container, 'disabled');
		this.container.contentEditable = false;
		this.enabled = false;
	},

	onFocus: function(e) {
		joEvent.stop(e);
		joFocus.set(this);
	},
	
	onBlur: function(e) {
		this.data = (this.container.value) ? this.container.value : this.container.innerHTML;
		joEvent.stop(e);
		this.blur();
		this.changeEvent.fire(this.data);
	},
	
	focus: function(e) {
		joDOM.addCSSClass(this.container, 'focus');
		if (!e)
			this.container.focus();
	},
	
	blur: function() {
		joDOM.removeCSSClass(this.container, 'focus');
	},
	
	setDataSource: function(source) {
		this.dataSource = source;
//		this.refresh();
		source.changeEvent.subscribe(this.setData, this);
	}
});
