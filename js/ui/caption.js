/**
	joCaption
	=========
	
	Basically, a paragraph of text.
	
	Extends
	-------
	
	- joView
	
*/
joCaption = function(data) {
	joControl.apply(this, arguments);
};
joCaption.extend(joControl, {
	createContainer: function() {
		return joDOM.create("jocaption");
	}
});

