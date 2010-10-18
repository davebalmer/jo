/**
	joTextarea
	==========
	
	Multi-line text input control. When you instantiate or use `setData()`, you can
	either pass in an initial value or a reference to a joDataSource object which it,
	like other joControl instances, will bind to.
	
	Basically, this is just a multi-line version of joInput.
	
	Use
	---
	
		// simple multi-line field
		var sample = "This is some sample text to edit.";
		var x = new joTextarea(sample);
		
		// setting the style inline using chaining
		var f = new joTextarea(sample).setStyle({
			minHeight: "100px",
			maxHeight: "300px"
		});
		
		// adding a simple change event handler using chaining
		var h = new joTextarea(sample).changeEvent.subscribe(function(data) {
			joLog("text area changed:", data);
		});

		// attach the value to a preference
		var y = new joTextarea(joPreference.bind("username"));
		
		// attach input control to a custom joDataSource
		var username = new joDataSource("bob");
		var z = new joTextarea(username);
	
	Extends
	-------
	
	- joInput
	
*/
joTextarea = function(data) {
	joInput.apply(this, arguments);
};
joTextarea.extend(joInput, {
	tagName: "textarea",
	
	onKeyDown: function(e) {
		// here we want the enter key to work, overriding joInput's behavior
		return false;
	}
});

