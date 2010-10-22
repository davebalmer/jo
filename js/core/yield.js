/**
	joDefer
	========
	
	Utility function which calls a given method within a given context after `n`
	milliseconds with optional static data.

	Use
	-----
	
		joDefer(Function, context, delay, data);
	
	Note that delay defaults to 100ms if not specified, and `data` is optional.

*/
function joDefer(call, context, delay, data) {
	if (!delay)
		var delay = 100;

	if (!context)
		var context = this;
		
	var timer = window.setTimeout(function() {
		call.call(context, data);
	}, delay);
	
	return timer;
};
