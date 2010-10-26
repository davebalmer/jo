/**
	joFlexrow
	=========
	
	Uses the flexible box model in CSS to stretch elements evenly across a row.
	
	Use
	---
	
		// a simple row of things
		var x = new joFlexrow([
			new joButton("OK"),
			new joButton("Cancel")
		]);
		
		// making a control stretch
		var y = new joFlexrow(new joInput("Bob"));
		
	Extends
	-------
	
	- joContainer

*/
joFlexrow = function(data) {
	joContainer.apply(this, arguments);
};
joFlexrow.extend(joContainer, {
	tagName: "joflexrow"
});

/**
	joFlexcol
	=========
	
	Uses the flexible box model in CSS to stretch elements evenly across a column.
	
	Use
	---
	
		// fill up a vertical space with things
		var x = new joFlexcol([
			new joNavbar(),
			new joStackScroller()
		]);
	
	Extends
	-------
	
	- joContainer

*/
joFlexcol = function(data) {
	joContainer.apply(this, arguments);
};
joFlexcol.extend(joContainer, {
	tagName: "joflexcol"
});
