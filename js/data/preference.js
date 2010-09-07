/**
	joPreference
	============

	A class used for storing and retrieving preferences. Meant to be
	augmented with persistent storage methods for `set()` and `get()`.

	> This is a work in progress, and totally subject to change. Binding
	> persistent storage to GUI controls in a way that doesn't require
	> goofy syntax is tricky.

	Methods
	-------

	- `bind(key)`

	  Returns a joDataSource class for a key. Used to automagically bind
	  GUI controls in a two-way link with preference data for a key.

	- `get(key)`

	  Returns the current value for a key or `null` if there is no value.

	- `set(key, value)`

	  Sets an arbitrary value for a given key.

	Consumes
	--------

	- joDataSource
	- joSubject

	Events
	------

	- `changeEvent`

	> This is getting hairy. Sorting out the data types and adding different
	> data sources to the picture is getting messy.

*/

joPreference = function(data) {
	this.preference = data || {};
	this.changeEvent = new joSubject(this);
};
joPreference.prototype = {
	loadEvent: new joSubject(this),
	preference: {},

	setDataSource: function(source) {
		this.dataSource = source;
		source.loadEvent.subscribe(this.load, this);
//		this.load(source.getData());
	},
	
	load: function(data) {
		// shove the data in, would be nice if it accepted
		// an array of arrays (SQL) or an object with
		// properties (JSON)
		if (data instanceof Array) {
			// an array of arrays (we hope) like from SQL
			for (var i = 0; i < data.length; i++)
				this.set(data[i][0], data[i][1]);
		}
		else if (typeof data === "object") {
			this.data = data;
		}
	},
	
	save: function(key) {
		// set our data source with the new data... this
		// might get ugly
		if (key) {
			// single key
//			this.dataSource.set(key, this.data[key].get());
		}
		else {
			// otherwise we save all our stuff
//			for (var i in this.data) {
//				this.dataSource.set(i, this.data[i].get());
//			}
		}
	},
	
	getNumber: function(key) {
		return 0 + this.get(key);
	},
	
	getBoolen: function(key) {
		return 0 + this.parseInt(this.get(key));
	},
	
	get: function(key) {
		if (typeof this.preference[key] === 'undefined')
			return "";
		else
			return this.preference[key].get();
	},

	setBoolean: function(key, value) {
		this.set(key, (value) ? 1 : 0);
	},
	
	set: function(key, value) {
		if (typeof this.preference[key] === 'undefined')
			this.preference[key] = new joDataSource(value);
		else
			this.preference[key].set(value);
			
		this.save(key);
		this.changeEvent.fire(key);
	},

	bind: function(key) {
		var self = this;

		// create new key if it doesn't exist
		if (typeof this.preference[key] === 'undefined')
			return new joDataSource(key);
		else
			return this.preference[key];
	}
};

		
		