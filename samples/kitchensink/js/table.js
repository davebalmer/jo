joCache.set("table", function() {
	var back;
	
	var card = new joCard([
		new joTable([
			["Name", "Phone", "Email"],
			["Bob", "555-1234", "bob@bob.not"],
			["Candy", "555-2345", "candy@candy.not"],
			["Doug", "555-3456", "doug@doug.not"],
			["Evan", "555-4567", "evan@evan.not"],
			["Frank", "555-5678", "frank@frank.not"]
		]).selectEvent.subscribe(function(index, table) {
			console.log(table.getNodeData(table.getRow()));
		}, this)
	]).setTitle("Table Demo");

	return card;
});
