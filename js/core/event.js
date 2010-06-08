/**
	joEvent
	========
	
	Singleton with event model utility medthods.
	
	Methods
	-------
	- `on(HTMLElement, event, Function, context, data)`
	- `stop(event)`
	- `getTarget(event)`

*/

joEvent = {
	getTarget: function(e) {
		if (!e)
			var e = window.event;
		
		return e.target ? e.target : e.srcElement;
	},

	on: function(element, event, call, context, data) {
		if (!call || !element)
			return;

		var element = joDOM.get(element);
		var call = call;
		var data = data || "";

		var wrappercall = function(e) {
			var target = joEvent.getTarget(e);
			
			if (context)
				call.call(context, e, data);
			else
				call(e, data);
		};
		
		if (!window.addEventListener)
			element.attachEvent("on" + event, wrappercall);
		else
			element.addEventListener(event, wrappercall, false);
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
