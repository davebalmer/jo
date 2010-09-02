/**
	joSubject
	==========
	
	Class for custom events using the Observer Pattern. This is designed to be used
	inside a subject to create events observers can subscribe to. Unlike the classic
	observer pattern, a subject can fire more than one event when called, and
	each observer gets data from the subject. This is very similar to YUI 2.x event model.
	
	You can also "lock" the notification chain by using the `capture()` method, which
	tells the event to only notify the most recent subscriber (observer) which requested
	to capture the event exclusively.
	
	Methods
	-------
	
	- `subscribe(Function, context, data)`

	  Both `context` and `data` are optional. Also, you may use the `Function.bind(this)`
	  approach instead of passing in the `context` as a separate argument. All subscribers
	  will be notified when the event is fired.

	- `unsubscribe(Function, context)`
	
	  Does what you'd think.

	- `fire(data)`
	
	  Calls subscriber methods for all observers, and passes in: `data` from the subject,
	  a reference to the `subject` and any static `data` which was passed in the
	  `subscribe()` call.
	
	- `capture(Function, context, data)`
	
	  Only the last subscriber to capture this event will be notified until it is
	  released. Note that you can stack `capture()` calls to produce a modal event
	  heiarchy.
	
	- `release(Function, context)`
	
	  Removes the most recent subscription called with `capture()`, freeing up the next
	  subscribers in the list to be notified the next time the event is fired.
	
	Use
	---
	
	### In the subject (or "publisher") object
	
		// inside the Subject, we setup an event observers can subscribe to
		this.changeEvent = new joSubject(this);
		
		// to fire the event inside the Subject
		this.changeEvent.fire(somedata);

	### In the observer (or "subscriber") object

		// simple case, using Function.bind()
		somesubject.changeEvent.subscribe(this.mymethod.bind());
		
		// explicit context (this)
		somesubject.changeEvent.subscribe(this.mymethod, this);
		
		// optional data which gets passed with the event fires
		somesubject.changeEvent.subscribe(this.mymethod, this, "hello");

	This is a very flexible way to handle messages between objects. Each subject
	may have multiple events which any number of observer objects can subscribe
	to.

*/
joSubject = function(subject) {
	this.subscriptions = [];
	this.subject = subject;	
};
joSubject.prototype = {
	subscribe: function(call, observer, data) {
		if (!call)
			return false;
		
		var o = { "call": call };

		if (observer)
			o.observer = observer;

		if (data)
			o.data = data;
		
		this.subscriptions.push(o);
	
		return this.subject;
	},
	
	unsubscribe: function(call, observer) {
		if (!call)
			return false;

		for (var i = 0, l = this.subscriptions.length; i < l; i++) {
			var sub = this.subscriptions[i];
			if (sub.call === call && (typeof sub.observer == "undefined" || sub.observer === observer))
				sub.slice(i, 1);
		}
		
		return this.subject;
	},

	fire: function(data) {
		if (typeof data === 'undefined')
			var data = "";
			
		for (var i = 0, l = this.subscriptions.length; i < l; i++) {
			var sub = this.subscriptions[i];
			var subjectdata = (typeof sub.data !== 'undefined') ? sub.data : null;
			
			if (sub.observer)
				sub.call.call(sub.observer, data, this.subject, subjectdata);
			else
				sub.call(data, this.subject, subjectdata);
			
			// if this subscriber wants to capture events,
			// stop calling other subscribers
			if (sub.capture)
				break;
		}
	},

	capture: function(call, observer, data) {
		if (!call)
			return false;

		var o = { "call": call, capture: true };

		if (observer)
			o.observer = observer;

		if (data)
			o.data = data;
			
		this.subscriptions.unshift(o);

		return this.subject;
	},
	
	release: function(call, observer) {
		return this.unsubscribe(call, observer);
	}
};
