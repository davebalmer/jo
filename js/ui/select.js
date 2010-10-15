/**
	joSelect
	========
	
	Multi-select control which presents a set of options for the user
	to choose from.
	
	Methods
	-------
	
	- `setValue(value)`
	
	  Set the current value, based on the index for the option list.
	
	- `getValue()`
	
	  Returns the index of the current selected item.
		
	Extends
	-------
	
	- joExpando
	
	Consumes
	--------
	
	- joExpandoTitle
	- joSelectList
	
	Properties
	----------
	
	- `field`
	
	  Reference to the value field for this control.
	
	- `list`
	
	  Reference to the joSelectList for this control.
	
	Use
	---
	
		// pass in an array of options
		var x = new joSelect([ "Apples", "Oranges", "Grapes" ]);
		
		// pass in a current value
		var y = new joSelect([ "Apples", "Oranges", "Grapes" ], 2);
		
		// respond to the change event
		y.changeEvent = function(value, list) {
			console.log("Fruit: " + list.getNodeValue(value));
		});
	
*/
joSelect = function(data, value) {
	var ui = [
		this.field = new joSelectTitle(data[value || 0] || "Select"),
		this.list = new joSelectList(data, value)
	];
	
	this.changeEvent = this.list.changeEvent;
	this.selectEvent = this.list.selectEvent;
	
	joExpando.call(this, ui);
	this.container.setAttribute("tabindex", 1);

	this.list.selectEvent.subscribe(this.setValue, this);
};
joSelect.extend(joExpando, {
	setValue: function(value, list) {
		this.field.setData(list.getNodeData(value));
		this.close();
	},
	
	getValue: function() {
		return this.list.getValue();
	},
	
	setEvents: function() {
		joControl.prototype.setEvents.call(this);
	},
	
	onBlur: function(e) {
		joEvent.stop(e);
		joDOM.removeCSSClass(this, "focus");
		this.close();
	}
});


joSelectTitle = function() {
	joExpandoTitle.apply(this, arguments);
};
joSelectTitle.extend(joExpandoTitle, {
});
