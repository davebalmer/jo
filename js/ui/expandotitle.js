/**

	joExpandoTitle
	==============
	
	Common UI element to trigger a joExpando. Contains a stylable
	arrow image which indicates open/closed state.
	
	Extends
	-------
	
	- joView
	
	Use
	---
	
	See joExpando use.
	
*/
joExpandoTitle = function(data) {
	joControl.apply(this, arguments);
};
joExpandoTitle.extend(joControl, {
	tagName: "joexpandotitle",
	
	setData: function() {
		joView.prototype.setData.apply(this, arguments);
		this.draw();
	},
	
	draw: function() {
		this.container.innerHTML = this.data + "<joicon></joicon>";
	}
});
