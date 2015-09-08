/**
	joSelectList
	============

	A selection list of options used by joSelect.

	Extends
	-------

	- joList
*/

joSelectList = function() {
	this.titleEvent = new joSubject(this);
	joList.apply(this, arguments);
};
joSelectList.extend(joList, {
	tagName: "joselectlist",

	setValue: function(v) {
		joList.prototype.setValue.apply(this, arguments);

		if (typeof this.data !== "undefined" && this.data.length && v !== null && typeof this.data[1 * v] !== "undefined")
			this.titleEvent.fire(this.data[1 * v]);

		return this;
	}
});
