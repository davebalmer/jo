/**
	joScript
	========
	
	Script tag loader function which can be used to dynamically load script
	files or make RESTful calls to many JSON services (provided they have some
	sort of callback ability). This is a low-level utility function.
	
	> Need a URL with some examples of this.
	
	Calling
	-------

	`joScript(url, callback, context)`
	
	- url
	- callback is a function (supports bind, in which case context is optional)
	- context (usually `this`, and is optional)

	Returns
	-------
	
	Calls your handler method and passes a truthy value if there was an error.
	
	Use
	---
	
		joScript("myscript.js", function(error, url) {
			if (error)
				console.log("script " + url + " didn't load.");
		}, this);

*/
function joScript(url, call, context) {
	var node = joDOM.create('script');

	if (!node)
		return;

	node.onload = onload;
	node.onerror = onerror;
	node.src = url;
	document.body.appendChild(node);

	function onerror() {
		handler(true);
	}
	
	function onload() {
		handler(false);
	}
	
	function handler(error) {
		if (call) {
			if (context)
				call.call(context, error, url);
			else
				call(error, url);
		}

		document.body.removeChild(node);
		node = null;
	}
}	

