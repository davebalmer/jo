/**
	joOption
	========
	
	This controls lets the user select one of a few options. Basically, this
	is a menu with a horizontal layout (depending on your CSS).
	
	Extends
	-------
	
	- joMenu
	
*/
joOption = function() {
	joMenu.apply(this, arguments);
};
joOption.extend(joMenu, {
	tagName: "jooption",
	itemTagName: "jooptionitem"
});
