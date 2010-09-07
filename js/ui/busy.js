joBusy = function(data) {
	joContainer.apply(this, arguments);
};
joBusy.extend(joContainer, {
	tagName: "jobusy",
	message: "",
	
	setEvents: function() {
		return this;
	}
});
