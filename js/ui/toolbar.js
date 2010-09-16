/**
	joToolbar
	=========

	Locks UI controls to the bottom of whatever you put this container into.
	
	Extends
	-------
	
	- joContainer

*/
joToolbar = function(data) {
	joContainer.apply(this, arguments);
};
joToolbar.extend(joContainer, {
	tagName: "jotoolbar"
});
