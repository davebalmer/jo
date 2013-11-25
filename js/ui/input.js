/**
	joInput
	=======
	
	Single-line text input control. When you instantiate or use `setData()`, you can
	either pass in an initial value or a reference to a joDataSource object which it,
	like other joControl instances, will bind to.
	
	Use
	---
	
		// simple value, simple field
		var x = new joInput(a);
		
		// OR set up a simple joRecord instance with some default data
		var pref = new joRecord({
			username: "Bob",
			password: "password"
		});
				
		// AND attach the value to a data structure property
		var y = new joInput(pref.link("username"));

		// set an input with a placehlder string
		var z = new joInput(b, "Placeholder");
	
	Extends
	-------
	
	- joControl
	
	Methods
	-------
	
	- `focus()`
	- `blur()`
	
	  You can manually set focus or call the `blur()` method (which also
	  triggers a data save).
	
	- `setData(string)`
	
	  Pass in either some arbitrary value for the control, or a reference to
	  a joDataSource if you want to automatically bind to a storage system
	  (e.g. joPreference).

	- `setPlaceholder(string)`
	
	  Display placeholder text on an empty input control (* not all
	  browsers support this).
	
*/
joInput = function(data, placeholder) {
	joControl.apply(this, arguments);

	if (placeholder)
		this.setPlaceholder(placeholder);
};
joInput.extend(joControl, {
	tagName: "input",
	type: "text",
	
	setData: function(data) {
		if (data !== this.data) {
			this.data = data;
			
			if (typeof this.container.value !== "undefined")
				this.container.value = data;
			else
				this.container.innerHTML = data;

			this.changeEvent.fire(this.data);
		}
		
		return this;
	},

	setPlaceholder: function(placeholder) {
		if (typeof this.container !== "undefined")
			this.container.setAttribute("placeholder", placeholder);
	},
	
	getData: function() {
		if (typeof this.container.value !== "undefined")
			return this.container.value;
		else
			return this.container.innerHTML;
	},
	
	enable: function() {
		this.container.setAttribute("tabindex", "1");
		return joControl.prototype.enable.call(this);
	},
	
	disable: function() {
		this.container.removeAttribute("tabindex");
		return joControl.prototype.disable.call(this);
	},	
	
	createContainer: function() {
		var o = joDOM.create(this);
		
		if (!o)
			return;
	
		o.setAttribute("type", this.type);
		o.setAttribute("tabindex", "1");
		o.contentEditable = this.enabled;
		
		return o;
	},

	setEvents: function() {
		if (!this.container)
			return;
		
		joControl.prototype.setEvents.call(this);
		joEvent.on(this.container, "keydown", this.onKeyDown, this);
	},
	
	onKeyDown: function(e) {
		if (e.keyCode == 13) {
			e.preventDefault();
			joEvent.stop(e);
		}
		return false;
	},
	
	draw: function() {
		if (this.container.value)
			this.value = this.data;
		else
			this.innerHTML = this.value;
	},
	
	onMouseDown: function(e) {
		joEvent.stop(e);
		this.focus();
	},
	
	storeData: function() {
		this.data = this.getData();
		if (this.dataSource)
			this.dataSource.set(this.value);
	}
});

