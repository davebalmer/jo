joCache.set("html", function() {
	// create an HTML file loader
	var file = new joFileSource("htmltest.html");

	// HTML control, hook it up to file and subscribe to URL clicks
	var html = new joHTML()
	.setDataSource(file)
	.selectEvent.subscribe(function(url) {
		// a link was clicked, tell our file source to load its url
		file.setQuery(url).load();
	});

	// for added fun, subscribe to the filesource and
	// keep a display of its URL and file size.
	var info = new joLabel();
	file.changeEvent.subscribe(function(data) {
		info.setData(file.query + " (" + data.length + " characters)");
	});

	// the UI for this card
	card = new joCard([
		new joGroup([
			new joHTML("<h1>Inline HTML</h1><p>This HTML was included inline, click the load button below to pull in another file asynchronously.</p>"),
			new joButton("Load HTML File")
			.selectEvent.subscribe(function() { file.load(); }, this)
		]),
		// this is our dynamic HTML control defined above
		new joGroup(html),
		info
	]).setTitle("Embedded HTML Browser");

	console.log(card);

	return card;
});

