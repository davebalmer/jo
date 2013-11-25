// using joCache here to defer creation of this
// view until we actually use it
joCache.set("menu", function() {
	// some inline data and chaining going on here,
	// dont be afraid, it'll all make sense later
	var card = new joCard([
		new joMenu([
			{ title: "UI Widgets", id: "widgets" },
			{ title: "Simple Table View", id: "table" },
			{ title: "Embedded HTML Browser", id: "html" },
			{ title: "Popups & Dialogs", id: "popups" },
			{ title: "CSS Utility Functions", id: "themes" }
		]).selectEvent.subscribe(function(id) {
			App.stack.push(joCache.get(id));
		})
	]);
	
	// hey, you don't have to make messy chained and
	// inlined code; that's a coding style decision
	// Jo doesn't pretend it should make for you.
	card.setTitle("Jo App Framework Demos");
	
	// required
	return card;
});
