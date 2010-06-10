/**
	joLabel
	=======
	
	Label view, purely a visual presentation. Usually placed in front
	of input fields and other controls.
	
	Extends
	-------
	
	- joView
	
*/
joLabel = function(data) {
	joControl.apply(this, arguments);
};
joLabel.extend(joControl, {
	tagName: "jolabel"
});

