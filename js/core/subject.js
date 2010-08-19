/**
	joSubject
	==========
	
	Class for custom events using the Observer Pattern. This is designed to be used
	inside a subject to create events observers can subscribe to. Unlike the classic
	observer pattern, a subject can fire more than one event and when called, and
	each observer gets data from the subject. This is very similar to YUI 2.x event model.
	
	Methods
	-------
	
	- `fire(data)`
	
	  Calls subscriber methods for all observers, and passes in: `data` from the subject,
	  a reference to the `subject` and any static `data` which was passed in the
	  `subscribe()` call.
	
	- `subscribe(Function, context, data)`
	- `unsubscribe(Function, context)`
	
	  Both `context` and `data` are optional. Also, you may use the `Function.bind(this)`
	  approach instead of passing in the `context` as a separate argument.
	
	Use
	-----
	
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
		
/*
		var observer = observer || this;

		if (typeof data == 'undefined')
			var data = "";
*/
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

//		var observer = observer || this;

		for (var i = 0, l = this.subscriptions.length; i < l; i++) {
			if (this.subscriptions[i].call === call
			&& (this.subscriptions[i].observer == "undefined" || this.subscriptions[i].observer === observer))
				this.subscriptions[i].slice(i, 1);
		}
		
		return this.subject;
	},

	fire: function(data) {
		if (typeof data == 'undefined')
			var data = "";
		
		for (var i = 0, l = this.subscriptions.length; i < l; i++) {
			var subjectdata = (typeof this.subscriptions[i].data !== 'undefined') ? this.subscriptions[i].data : null;

			// support for Function.bind()
			if (this.subscriptions[i].observer) {
				this.subscriptions[i].call.call(
					this.subscriptions[i].observer,
					data,
					this.subject,
					subjectdata
				);				
			}
			else {
				this.subscriptions[i].call(
					data,
					this.subject,
					subjectdata
				);				
			}
		}
	}
};
