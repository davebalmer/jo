/**
	joToggle
	========
	
	Boolean widget (on or off).
	
	Methods
	-------
	
	- `setLabels(Array)`
	
	You can change the labels for this control, which default to "Off" and "On".
	
	Extends
	-------
	
	- joControl
	
	Use
	---
	
		// simple
		var x = new joToggle();
		
		// with value
		var y = new joToggle(true);
		
		// with custom labels
		var z = new joToggle().setLabels(["No", "Yes"]);
		
	See Data Driven Controls for more examples.
	
*/
joToggle = function(data) {
	joControl.call(this, data);
};
joToggle.extend(joControl, {
	tagName: "jotoggle",
	button: null,
	labels: ["Off", "On"],

	setLabels: function(labels) {
		if (labels instanceof Array)
			this.labels = labels;
		else if (arguments.length == 2)
			this.labels = arguments;

		this.draw();
			
		return this;
	},

	select: function(e) {
		if (e)
			joEvent.stop(e);

		this.setData((this.data) ? false : true);
		
		return this;
	},

	onBlur: function(e) {
		joEvent.stop(e);
		this.blur();
	},
	
	draw: function() {
		if (!this.container)
			return;

		if (!this.container.firstChild) {
			this.button = joDOM.create("div");
			this.container.appendChild(this.button);
		}
		
		this.button.innerHTML = this.labels[(this.data) ? 1 : 0];

		joDefer(function() {
			if (this.data)
				joDOM.addCSSClass(this.container, "on");
			else
				joDOM.removeCSSClass(this.container, "on");
		}, this);
	}
});
