/**
	joFlexrow
	=========
	
	Uses the box model to stretch elements evenly across a row.
	
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
	
	Uses the box model to stretch elements evenly across a column.
	
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
