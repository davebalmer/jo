/**
	joTitle
	=======
	
	Title-styled view.

*/
joTitle = function(data) {
	joControl.apply(this, arguments);
};
joTitle.extend(joControl, {
	createContainer: function() {
		return joDOM.create("jotitle");
	}
});

/**
	joLabel
	=======
	
	Label-styled view, should nestle close to the next control.
	
*/
joLabel = function(data) {
	joControl.apply(this, arguments);
};
joLabel.extend(joControl, {
	createContainer: function() {
		return joDOM.create("jolabel");
	}
});

/**
	joCaption
	=========
	
	Basically, a paragraph of text.
	
*/
joCaption = function(data) {
	joControl.apply(this, arguments);
};
joCaption.extend(joControl, {
	createContainer: function() {
		return joDOM.create("jocaption");
	}
});

/**
	joGroup
	=======
	
	Group of controls, purely visual.
	
	Extends
	-------

	- joContainer
	
*/
joGroup = function(data) {
	joContainer.apply(this, arguments);
};
joGroup.extend(joContainer, {
	createContainer: function() {
		return joDOM.create("jogroup");
	}
});


/**
	joDivider
	=========
	
	Simple divider.
	
*/
joDivider = function(data) {
	joView.apply(this, arguments);
};
joDivider.extend(joView, {
	createContainer: function() {
		return joDOM.create("jodivider");
	}
});

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
	createContainer: function() {
		return joDOM.create("jocard");
	}
});

/**
	joFooter
	======
	
	Attempt to make a filler object which pushed subsequent joView objects
	further down in the container if possible (to attach its contents to
	the bottom of a card, for eaxmple).
	
*/
joFooter = function(data) {
	joContainer.apply(this, arguments);
};
joFooter.extend(joContainer, {
	createContainer: function() {
		return joDOM.create("jofooter");
	}
});
