/**
	joChain
	========
	
	Class which strings asyncronous calls together.
	
	> In serious need of rework; doesn't meet original goal of sequencing
	> these calls. This class might also become deprecated.

	Methods
	-------
	
	- `add(Function, context, data)`
	- `start()`
	- `stop()`
	- `next()`

*/

joChain = function() {
	this.queue = [];
	this.active = false;
	
	this.addEvent = new joSubject("add", this);
	this.startEvent = new joSubject("start", this);
	this.stopEvent = new joSubject("stop", this);
	this.nextEvent = new joSubject("next", this);

	this.stop();
	
	this.delay = 100;
};
joChain.prototype = {
	add: function(call, context, data) {
		if (!context)
			context = this;
		
		if (!data)
			data = "";
		
		this.queue.push({
			call: call,
			context: context,
			data: data
		});
		
		if (this.active && !this.timer)
			this.next();
	},
	
	start: function() {
		this.active = true;
		this.startEvent.fire();
		this.next();
	},
	
	stop: function() {
		this.active = false;

		if (this.timer)
			window.clearTimeout(this.timer);

		this.timer = null;
		
		this.stopEvent.fire();
	},
	
	next: function() {
		var nextcall = this.queue.shift();
		
		if (!nextcall) {
			this.timer = null;
			return;
		}
		
		this.nextEvent.fire(nextcall);

		nextcall.call.call(nextcall.context, nextcall.data);
		
		if (this.queue.length)
			this.timer = joEvent.yield(this.next, this, this.delay);
		else
			this.timer = null;
	}
};
