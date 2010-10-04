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
		
		// attach the value to a preference
		var y = new joInput(joPreference.bind("username"));
		
		// attach input control to a custom joDataSource
		var username = new joDataSource("bob");
		var z = new joInput(username);
	
	Extends
	-------
	
	- joControl
	
	Methods
	-------
	
	- `focus()`
	- `blur()`
	
	  You can manually set focus or call the `blur()` method (which also
	  triggers a data save).
	
	- `setData()`
	
	  Pass in either some arbitrary value for the control, or a reference to
	  a joDataSource if you want to automatically bind to a storage system
	  (e.g. joPreference).
	
*/
joInput = function(data) {
	joControl.apply(this, arguments);
};
joInput.extend(joControl, {
	tagName: "input",
	
	setData: function(data) {
		if (data !== this.data) {
			this.data = data;
			
			if (typeof this.container.value !== "undefined")
				this.container.value = data;
			else
				this.container.innerHTML = data;

			this.changeEvent.fire(this.data);
		}
	},
	
	getData: function() {
		if (typeof this.container.value !== "undefined")
			return this.container.value;
		else
			return this.container.innerHTML;
	},
	
	enable: function() {
		this.container.setAttribute("tabindex", "1");
		joControl.prototype.enable.call(this);
	},
	
	disable: function() {
		this.container.removeAttribute("tabindex");
		joControl.prototype.disable.call(this);
	},	
	
	createContainer: function() {
		var o = joDOM.create(this);
		
		if (!o)
			return;
	
		o.setAttribute("type", "text");
		o.setAttribute("tabindex", "1");
		o.contentEditable = this.enabled;
		
		return o;
	},

	setEvents: function() {
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

