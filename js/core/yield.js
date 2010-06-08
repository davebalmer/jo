/**
	joYield
	========
	
	Utility function which calls a given method after `n` milliseconds
	with optional context.

	Use
	-----
	
		joYield(Function, context, delay, data);
	
	Note that delay defaults to 100ms if not specified, and data is optional.

*/
function joYield(call, context, delay, data) {
	if (!delay)
		var delay = 100;

	if (!context)
		var context = this;
		
	var timer = window.setTimeout(function() {
		call.call(context, data);
	}, delay);
	
	return timer;
};
