/**
	joDivider
	=========
	
	Simple visual divider.
	
	Extends
	-------
	
	- joView

*/
joDivider = function(data) {
	joView.apply(this, arguments);
};
joDivider.extend(joView, {
	tagName: "jodivider"
});

