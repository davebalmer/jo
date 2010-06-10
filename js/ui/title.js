/**
	joTitle
	=======
	
	Title view, purely a visual presentation.
	
	Extends
	-------
	
	- joView

*/
joTitle = function(data) {
	joControl.apply(this, arguments);
};
joTitle.extend(joControl, {
	tagName: "jotitle"
});

