/**
	joSelectList
	============
	
	A selection list of options used by joSelect.
	
	Extends
	-------
	
	- joList
*/

joSelectList = function() {
	joList.apply(this, arguments);
};
joSelectList.extend(joList, {
	tagName: "joselectlist"
});
