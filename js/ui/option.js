/**
	joOption
	========
	
	This controls lets the user select one of a few options. Basically, this
	is a menu with a horizontal layout (depending on your CSS).
	
	Use
	---
	
		// simple set of options
		var x = new joOption([
			"Red",
			"Blue",
			"Green"
		]);
		
		// set the current value
		x.setValue(2);
		
		// or, associate the value with a joRecord property
		var pref = new joRecord();
		
		var y = new joOption([
			"Orange",
			"Banana",
			"Grape",
			"Lime"
		], pref.link("fruit"));
		
		// you can even associate the list with a datasource
		var fruits = new joDataSource( ... some query stuff ...);
		var z = new joOption(fruits, pref.link("fruit"));
	
	
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
