joScroller = function(data) {
	joContainer.apply(this, arguments);
	joDOM.setStyle(this.container, "scrollv");
};
joScroller.extend(joContainer, {
	tagName: "joscroller",

	scrollTo: function(y) {
		this.container.scrollTop = y;
	}
});
