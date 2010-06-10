/**
	joCard
	======
	
	Special container for card views, more of an application-level view.
	
	Extends
	-------
	
	- joContainer
	
	Methods
	-------
	
	- `activate()`
	- `deactivate()`
	
	  These methods are called automatically by various joView objects, for
	  now joStack is the only one which does. Basically, allows you to add
	  application-level handlers to initialize or cleanup a joCard.
	
*/
joCard = function(data) {
	joContainer.apply(this, arguments);
};
joCard.extend(joContainer, {
	tagName: "jocard"
});

