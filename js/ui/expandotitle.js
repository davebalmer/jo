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
	joView.apply(this, arguments);
};
joExpandoTitle.extend(joView, {
	tagName: "joexpandotitle",
	
	draw: function() {
		this.container.innerHTML = this.data + "<joicon></joicon>";
	}
});
