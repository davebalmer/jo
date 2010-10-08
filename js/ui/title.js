/**
	joTitle
	=======
	
	Title view, purely a visual presentation.
	
	Extends
	-------
	
	- joContainer

*/
joTitle = function(data) {
	joView.apply(this, arguments);
};
joTitle.extend(joView, {
	tagName: "jotitle"
});

