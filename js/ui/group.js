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
	tagName: "jogroup"
});
