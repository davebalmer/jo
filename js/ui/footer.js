/**
	joFooter
	======
	
	Attempt to make a filler object which pushed subsequent joView objects
	further down in the container if possible (to attach its contents to
	the bottom of a card, for eaxmple).
	
	> This behavior requires a working box model to attach properly to the bottom
	> of your container view.
	
	Extends
	-------
	
	- joContainer

*/
joFooter = function(data) {
	joContainer.apply(this, arguments);
};
joFooter.extend(joContainer, {
	tagName: "jofooter"
});
