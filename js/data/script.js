/**
	joScript
	========
	
	Script tag loader function which can be used to dynamically load script
	files or make RESTful calls to many JSON services (provided they have some
	sort of callback ability).
	
	> Need a URL with some examples of this.
	
	Arguments
	---------
	
	- url
	- callback
	- context (usually `this`, and is optional)

	Returns
	-------
	
	Returns a reference to the `script` tag which was created in the DOM to make
	this request.
*/

function joScript(url, call, context) {
	var node = joDOM.create('script');
	node.onload = handler;
	node.src = url;
	document.body.appendChild(node);
	
	function handler() {
		call.call(context || this, node);
		
		// cleanup
		document.body.removeChild(node);
	}
}	

