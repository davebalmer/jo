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

	- joSelectTitle
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
	var v = value;
	if (value instanceof joDataSource)
		v = value.getData();

	var ui = [
		this.field = new joSelectTitle(),
		this.list = new joSelectList(data, value)
	];

//	this.field.setList(this.list);

	this.changeEvent = new joSubject(this);
	this.selectEvent = new joSubject(this);

	this.list.selectEvent.subscribe(function() {
		this.selectEvent.fire(this.list.value);
	}, this);

	this.list.changeEvent.subscribe(function() {
		this.changeEvent.fire(this.list.data);
	}, this);

//	this.openEvent.subscribe(function(a, b, c) {
//		this.field.setData("")
//	}, this);
//	this.closeEvent.subscribe(function(a, b, c) {
//		this.field.setData(this.)
//	}, this);


	this.defaultTitle = "Select...";

	joExpando.call(this, ui);
//	this.container.setAttribute("tabindex", 1);

	this.setTitle(data[v]);

	this.changeEvent.subscribe(this.setListValue, this);
	this.list.titleEvent.subscribe(this.setTitle, this);
//	this.selectEvent.subscribe(function() {
//	}, this);
};
joSelect.extend(joExpando, {
	setTitle: function(v) {
		if (v)
			joDOM.addCSSClass(this.field.container, "selected");
		else
			joDOM.removeCSSClass(this.field.container, "selected");

		console.log("v", v, this.field.container.className);

		this.field.setData(v || this.defaultTitle);
		this.close();

		return this;
	},

	setListValue: function(value) {
		this.value = value;
		this.setTitle(this.list.data[this.list.value]);
		this.close();

		console.log("setlistvalue", value, this.list.data[value]);

		return this;
	},

	setDefault: function(d) {
		this.defaultTitle = d;

		return this;
	},

	setValue: function(value, list) {
		if (list) {
			this.list.setData(value);
			this.close();
		}
		else {
			this.list.setValue(value);
			this.setTitle(this.list.data[value]);
		}

		console.log("setvalue", value, this.list.data[value]);

		return this;
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

/**
	joSelectTitle
	=============

	joSelect flavor of joExpandoTitle.

	Extends
	-------

	- joExpandoTitle
*/
joSelectTitle = function() {
	joExpandoTitle.apply(this, arguments);
};
joSelectTitle.extend(joExpandoTitle, {
/*
	list: null,

	setList: function(list) {
		this.list = list;

		return this;
	},

	setData: function(value) {
		if (this.list)
			joExpandoTitle.prototype.setData.call(this, this.list.getNodeData(value) || "Select...");
		else
			joExpandoTitle.prototype.setData.call(this, value);

		return this;
	}
*/
});
