/**
	joEvent
	========
	
	Singleton with DOM event model utility methods. Ideally, application-level
	code shouldn't have to use this, but library code does.
	
	Methods
	-------
	- `on(HTMLElement, event, Function, context, data)`
	
	  Set a DOM event listener for an HTMLElement which calls a given Function
	  with an optional context for `this` and optional static data. Returns a
	  reference to the handler function, which is required if you need to `remove()`
	  later.
	
	- `capture(HTMLElement, event, function, context, data)`
	
	  This is the same os `on()`, but captures the event at the node before its
	  children. If in doubt, use `on()` instead.
	
	- `remove(HTMLElement, event, handler)`
	
	  Removes a previously declared DOM event. Note that `handler` is the return
	  value of the `on()` and `capture()` methods.
	
	- `stop(event)`
	
	   Stop event propogation.
	
	- `preventDefault(event)`
	
	  Prevent default action for this event.
	
	- `block(event)`
	
	  Useful for preventing dragging the window around in some browsers, also highlighting
	  text in a desktop browser.
	
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

	map: {
		click: "click",
		transitionend: "transitionend"
	},

	touchy: false,
	
	getTarget: function(e) {
		if (!e)
			e = window.event;
		
		return e.target ? e.target : e.srcElement;
	},

	capture: function(element, event, call, context, data) {
		return this.on(element, event, call, context, data, true);
	},

	on: function(element, event, call, context, data, capture) {
		if (!call || !element)
			return false;
			
		if (this.touchy) {
			if (this.eventMap[event])
				event = this.eventMap[event];
		}

		element = joDOM.get(element);
//		data = data || "";

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
		}
		
		// annoying kludge for Mozilla
		wrappercall.capture = capture || false;

		if (!window.addEventListener)
			element.attachEvent("on" + event, wrappercall);
		else
			element.addEventListener(event, wrappercall, capture || false);
			
		return wrappercall;
	},
	
	remove: function(element, event, call, capture) {
		if (this.touchy) {
			if (this.eventMap[event]) {
				event = this.eventMap[event];
			}
		}

		if (typeof element.removeEventListener !== 'undefined')
			element.removeEventListener(event, call, capture || false);
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
			e = window.event;

		if (typeof e.target == 'undefined')
			e.target = e.srcElement;

		switch (e.target.nodeName.toLowerCase()) {
		case 'input':
		case 'textarea':
			return true;
		default:
			return false;
		}
	}
};
