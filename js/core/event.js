/**
	joEvent
	========
	
	Singleton with DOM event model utility methods. Ideally, application-level
	code shouldn't have to use this, but library code does.
	
	Methods
	-------
	- `on(HTMLElement, event, Function, context, data)`
	
	  Set a DOM event listener for an HTMLElement which calls a given Function
	  with an optional context for `this` and optional static data.
	
	- `stop(event)`
	
	  Prevent default and stop event propogation.
	
	- `getTarget(event)`
	
	  Returns the HTMLElement which a DOM event relates to.

*/

joEvent = {
	eventMap: {
		"mousedown": "touchstart",
		"mousemove": "touchmove",
		"mouseup": "touchend",
		"mouseout": "touchcancel"
	},
	touchy: false,
	
	getTarget: function(e) {
		if (!e)
			var e = window.event;
		
		return e.target ? e.target : e.srcElement;
	},

	capture: function(element, event, call, context, data) {
		this.on(element, event, call, context, data, true);
	},

	on: function(element, event, call, context, data, capture) {
		if (!call || !element)
			return false;
			
		if (this.touchy) {
			if (this.eventMap[event])
				event = this.eventMap[event];
		}

		var element = joDOM.get(element);
		var call = call;
		var data = data || "";

		function wrappercall(e) {
			// support touchy platforms,
			// might reverse this to turn non-touch into touch
			if (e.touches && e.touches.length == 1) {
				var touches = e.touches[0];
				e.pageX = touches.pageX;
				e.pageY = touches.pageY;
				e.screenX = touches.screenX;
				e.screenY = touches.screenY;
				e.clientX = touches.clientX;
				e.clientY = touches.clientY;
			}
			
			if (context)
				call.call(context, e, data);
			else
				call(e, data);
		};
		
		// annoying kludge for Mozilla
		wrappercall.capture = capture || false;

		if (!window.addEventListener)
			element.attachEvent("on" + event, wrappercall);
		else
			element.addEventListener(event, wrappercall, capture || false);
			
		return wrappercall;
	},
	
	remove: function(element, event, wrappercall) {
		element.removeEventListener(event, wrappercall, wrappercall.capture);
	},
		
	stop: function(e) {
		if (e.stopPropagation)
			e.stopPropagation();
		else
			e.cancelBubble = true;
	},
	
	preventDefault: function(e) {
		e.preventDefault();
	},
	
	block: function(e) {
		if (window.event)
			var e = window.event;

		if (typeof e.target == 'undefined')
			e.target = e.srcElement;

		switch (e.target.nodeName.toLowerCase()) {
		case 'input':
		case 'textarea':
			return true;
			break;
		default:
			return false;
		}
	}
};
