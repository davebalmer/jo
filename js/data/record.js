joRecord = function(data) {
	joDataSource.call(this, data);
};
joRecord.extend(joDataSource, {
	delegate: {},
	
	link: function(p) {
		return this.getDelegate(p);
	},
	
	getDelegate: function(p) {
		if (!this.delegate[p])
			this.delegate[p] = new joProperty(this, p);
			
		return this.delegate[p];
	},
	
	getProperty: function(p) {
		console.log(p + "=" + this.data[p]);
		return this.data[p];
	},
	
	setProperty: function(p, data) {
		if (this.data[p] === data)
			return;
		
		this.data[p] = data;
		this.changeEvent.fire(this);
		
		if (this.autoSave)
			this.save();

		return this;
	},
	
	load: function() {
		console.log("TODO: extend the load() method");
		return this;
	},

	save: function() {
		console.log("TODO: extend the save() method");
		return this;
	}
});
	
joProperty = function(datasource, p) {
	joDataSource.call(this);

	this.changeEvent = new joSubject(this);
	datasource.changeEvent.subscribe(this.onSourceChange, this);

	this.datasource = datasource;
	this.p = p;
};
joProperty.extend(joDataSource, {
	setData: function(data) {
		if (this.datasource)
			this.datasource.setProperty(this.p, data);
		
		return this;
	},
	
	getData: function() {
		if (!this.datasource)
			return null;

		return this.datasource.getProperty(this.p);
	},
	
	onSourceChange: function() {
		this.changeEvent.fire(this.getData());
	}
});
