/**
	joSQLDataSource
	================

	SQL flavor of joDataSource which uses "HTML5" SQL found in webkit.

	Methods
	-------

	- `setDatabase(joDatabase)`
	- `setQuery(query)`
	- `setParameters(arguments)`
	- `execute(query, arguments)`
	
	Events
	------
	
	- `changeEvent`
	
	  Fired when data is loaded after an `execute()` or when data is cleared.
	
	- `xerrorEvent`
	
	  Fired when some sort of SQL error happens.

	Extends
	-------

	- joDataSource
*/
joSQLDataSource = function(db, query, args) {
	this.db = db;
	this.query = (typeof query == 'undefined') ? "" : query;
	this.args = (typeof args == 'undefined') ? [] : args;
	
	this.changeEvent = new joEvent.subject(this);
	this.errorEvent = new joEvent.subject(this);
};
joSQLDataSource.prototype = {
	setDatabase: function(db) {
		this.db = db;
	},
	
	setQuery: function(query) {
		this.query = query;
	},

	setData: function(data) {
		this.data = data;
		this.changeEvent.fire();
	},

	clear: function() {
		this.data = [];
		this.changeEvent.fire();
	},

	setParameters: function(args) {
		this.args = args;
	},

	execute: function(query, args) {
		this.setQuery(query || "");
		this.setParameters(args);
		
		if (this.query)
			this.refresh();
	},
	
	refresh: function() {
		if (!this.db) {
			this.errorEvent.fire();
//			joLog("query error: no db!");
			return;
		}
		
		var self = this;

		if (arguments.length) {
			var args = [];
			for (var i = 0; i < arguments.length; i++)
				args.push(arguments[i]);
		}
		else {
			var args = this.args;
		}
		
		var query = this.query;

		function success(t, result) {
			self.data = [];

			for (var i = 0, l = result.rows.length; i < l; i++) {
				var row = result.rows.item(i);

				self.data.push(row);
			}
			
			self.changeEvent.fire(self.data);
		}
		
		function error() {
			joLog('SQL error', query, "argument count", args.length);
			self.errorEvent.fire();
		}
		
		this.db.db.transaction(function(t) {
			t.executeSql(query, args, success, error);
		});
	}
};
