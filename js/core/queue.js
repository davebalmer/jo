
joQueue = function() {
	this.queue = [];

	this.doneEvent = new joSubject(this);
};
joQueue.prototype = {
	push: function(call, delay, context, data) {
		this.queue.push({
			delay: delay,
			call: call,
			context: context,
			data: data
		});
	},

	tick: function() {
		var t = (new Date() * 1);

		if (this.next == 0 || t >= this.next) {
			var c = this.queue.shift();
			if (c.context)
				c.call.call(c.context, c.data || null);
			else
				c.call(c.data || null);

			if (this.queue.length)
				this.next = t + this.queue[0].delay;
		}

		if (this.queue.length) {
			var self = this;
			window.requestAnimationFrame(function() {
				self.tick.call(self);
			});
		}
		else {
			this.stop();
		}
	},

	start: function() {
		this.working = true;
		this.next = 0;

		if (this.queue.length) {
			joDefer(this.tick, this);
		}

		return this;
	},

	stop: function() {
		this.working = false;
		this.next = 0;

		this.doneEvent.fire();
	},

	getElapsed: function(last) {
		return (new Date() * 1) - last;
	},

	getTime: function() {
		return (new Date() * 1);
	},

	setLast: function(time) {
		if (!time)
			time = (new Date() * 1);

		this.last = time;

		return this;
	}
};


