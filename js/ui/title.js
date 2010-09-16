/**
	joTitle
	=======
	
	Title view, purely a visual presentation.
	
	Extends
	-------
	
	- joContainer

*/
joTitle = function(data) {
	joContainer.apply(this, arguments);
};
joTitle.extend(joContainer, {
	tagName: "jotitle"
});

