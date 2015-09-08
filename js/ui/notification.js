/**
	joNotification
	==============


	Extends
	-------

	- joControl

*/
joNotification = function(data) {
	this.removeEvent = new joSubject(this);

	joControl.apply(this, arguments);
};
joNotification.extend(joControl, {
	tagName: "jonotification",
	setBottom: function(y) {
		this.container.style.bottom = y + "px";
	},

	getHeight: function() {
		return this.container.offsetHeight;
	},

	show: function() {
		console.log("show notification");

		joDefer(function() {
			this.setStyle("show");
		}, this);

		joDefer(this.hide, this, 5000);
	},

	hide: function() {
		console.log("hide notification");

		joDefer(function() {
			this.setStyle("");
		}, this);

		joDefer(function() {
			this.removeEvent.fire(this);
		}, this, 2000);
	}
});
