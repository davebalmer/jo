/**
	joDialog
	========
	
	This is a higher level container that wraps a joPopup with a joShim.
*/
joDialog = function(data) {
	joShim.call(this, new joFlexcol([
		'',
		new joPopup(
			new joScroller(data)
		).setStyle("show"),
		''
	]));
};
joDialog.extend(joShim, {
});
