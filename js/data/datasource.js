/**
	joDataSource
	=============

	Wraps data acquisition in an event-driven class. Objects can
	subscribe to the `changeEvent` to update their own data.

	This base class can be used as-is as a data dispatcher, but is
	designed to be extended to handle asyncronous file or SQL queries.

	Methods
	-------
	- `set()`
	- `get()`
	- `clear()`

	Events
	------

	- `changeEvent`
	- `errorEvent`
*/
joDataSource = function(data) {
	this.changeEvent = new joSubject(this);	
	this.errorEvent = new joSubject(this);

	if (typeof data !== "undefined")
		this.setData();
	else
		this.data = "";
};
joDataSource.prototype = {
	setQuery: function(query) {
		this.query = query;
	},
	
	getQuery: function() {
		return this.query;
	},
	
	setData: function(data) {
		this.data = data;
		this.changeEvent.fire(data);
	},
	
	getData: function() {
		return this.data;
	},
	
	getDataCount: function() {
		return this.getData().length;
	},
	
	getPageCount: function() {
		if (this.pageSize)
			return Math.floor(this.getData().length / this.pageSize) + 1;
		else
			return 1;
	},
	
	getPage: function(index) {
		var start = index * this.pageSize;
		var end = start + this.pageSize;
		
		if (end > this.getData().length)
			end = this.getData().length;
			
		if (start < 0)
			start = 0;

		return this.data.slice(start, end);
	},
	
	refresh: function() {
		// needs to make a new query object
	},
	
	setPageSize: function(length) {
		this.pageSize = length;
	},
	
	getPageSze: function() {
		return this.pageSize;
	},
	
	load: function(){
	}
};
