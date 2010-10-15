/**
	joScroller
	==========
	
	A scroller container. Ultimately, mobile webkit implementations
	should properly support scrolling elements that have the CSS
	`overflow` property set to `scroll` or `auto`. Why don't they,
	anyway? Until some sanity is adopted, we need to handle this scrolling
	issue ourselves. joScroller expects a single child to manage
	scrolling for.
	
	Use
	---
	
		// make a scroller and set its child later
		var x = new joScroller();
		x.setData(myCard);
		
		// define things inline, not always a good idea
		var y = new joScroller(new joList(mydata));
		
		// you can dump a big hunk of HTML in there, too
		// since jo wraps strings in a container element, this works
		var z = new joScroller('Some giant HTML as a string');

	Extends
	-------
	
	- joContainer
	
	Methods
	-------
	
	- `scrollBy(position)`
	- `scrollTo(position or joView or HTMLElement)`
	
	  Scrolls to the position or the view or element. If you
	  specify an element or view, make sure that element is a
	  child node, or you'll get interesting results.

	> Note that joScroller at this time only handles vertical scrolling.
	> At some point, it will either be expanded to handle both directions,
	> or more likely extended to make a horizontal scroller and a free
	> scroller.
	
*/

joScroller = function(data) {
	this.points = [];
	this.eventset = false;

	// Call Super
	joContainer.apply(this, arguments);
};
joScroller.extend(joContainer, {
	tagName: "joscroller",
	moved: false,
	inMotion: false,
	pacer: 0,
	velocity: 1.6,
	bump: 50,
	top: 0,
	mousemove: null,
	transitionEnd: "webkitTransitionEnd",
	
	setEvents: function() {
		joEvent.capture(this.container, "click", this.onClick, this);
		joEvent.on(this.container, "mousedown", this.onDown, this);
		joEvent.on(this.container, "mouseup", this.onUp, this);
/*		joEvent.on(this.container, "mouseout", this.onOut, this); */
	},
	
	onFlick: function(e) {
		// placeholder
	},
	
	onClick: function(e) {
		if (this.moved) {
			this.moved = false;
			joEvent.stop(e);
			joEvent.preventDefault(e);
		}
	},
	
	onDown: function(e) {
		joEvent.stop(e);

		this.reset();

		var node = this.container.firstChild;
		
		joDOM.removeCSSClass(node, "flick");
		joDOM.removeCSSClass(node, "flickback");
		joDOM.removeCSSClass(node, "flickfast");

		this.start = this.getMouse(e);
		this.points.unshift(this.start);
		this.inMotion = true;

		if (!this.mousemove)
			this.mousemove = joEvent.on(this.container, "mousemove", this.onMove, this);
	},
	
	reset: function() {
		this.points = [];
		this.quickSnap = false;
		this.moved = false;
		this.inMotion = false;
	},
	
	onMove: function(e) {
		if (!this.inMotion)
			return;
		
		joEvent.stop(e);
		e.preventDefault();
		
		var point = this.getMouse(e);
		
		var y = point.y - this.points[0].y;

		if (y == 0)
			return;
		
		this.points.unshift(point);

		if (this.points.length > 7)
			this.points.pop();

		// cleanup points if the user drags slowly to avoid unwanted flicks
		var self = this;
		this.timer = window.setTimeout(function() {
			if (self.points.length > 1)
				self.points.pop();
		}, 100);
		
		this.scrollBy(y, true);

		if (!this.moved && this.points.length > 3)
			this.moved = true;
	},

/*
	TODO: This needs some work. Since it's mostly for the browser
	version, not a high priority.
	
	onOut: function(e) {
		// placeholder
		if (!this.inMotion)
			return;
		
		if (e.clientX >= 0 && e.clientX <= this.container.offsetWidth
		&& e.clientY >= 0 && e.clientX <= this.container.offsetHeight) {
			return;
		}
		else {
			joEvent.stop(e);
			this.onUp(e);
			this.reset();
		}
	},
*/

	onUp: function (e) {
		if (!this.inMotion)
			return;

		joEvent.remove(this.container, "mousemove", this.mousemove);
		this.mousemove = null;

		this.inMotion = false;

		var end = this.getMouse(e);
		var node = this.container.firstChild;
		var top = this.getTop();
		
		joEvent.stop(e);

		var dy = 0;
		
		for (var i = 0; i < this.points.length - 1; i++)
			dy += (this.points[i].y - this.points[i + 1].y);

		var max = 0 - node.offsetHeight + this.container.offsetHeight - this.bump;
		
		// if the velocity is "high" then it was a flick
		if (Math.abs(dy) > 4 && !this.quickSnap) {
			var flick = dy * (this.velocity * (node.offsetHeight / this.container.offsetHeight));

			// we want to move quickly if we're going to land past
			// the top or bottom
			if (flick + top < max || flick + top > 0) {
				joDOM.addCSSClass(node, "flickfast");
			}
			else {
				joDOM.addCSSClass(node, "flick");
			}

			this.scrollBy(flick, false);
		}
		else {
			this.snapBack();
		}
	},
	
	getMouse: function(e) {
		return { x: e.screenX, y: e.screenY };
	},
	
	scrollBy: function(y, test) {
		var node = this.container.firstChild;
		var top = this.getTop();

		if (isNaN(top))
			top = 0;

		var dy = Math.floor(top + y);
		
		if (node.offsetHeight <= this.container.offsetHeight)
			return;
			
		var max = 0 - node.offsetHeight + this.container.offsetHeight;
		var ody = dy;
		
		if (dy > this.bump)
			dy = this.bump;
		else if (dy < max - this.bump)
			dy = max - this.bump;

		if (test)
			this.quickSnap = (ody != dy);

		this.eventset = joEvent.on(node, this.transitionEnd, this.snapBack, this);

		if (this.getTop() != dy)
			this.setTop(dy);
	},

	scrollTo: function(y, instant) {
		var node = this.container.firstChild;
		
		if (!node)
			return;

		if (typeof y == 'object') {
			if (y instanceof HTMLElement)
				var e = y;
			else if (y instanceof joView)
				var e = y.container;
				
			var t = 0 - e.offsetTop;
			var h = e.offsetHeight + 80;

			var y = top;

			var top = this.getTop();
			var bottom = top - this.container.offsetHeight;

			if (t - h < bottom)
				y = (t - h) + this.container.offsetHeight;

			if (y < t)
				y = t;
		}
		
		if (y < 0 - node.offsetHeight)
			y = 0 - node.offsetHeight;
		else if (y > 0)
			y = 0;

		if (!instant) {
			joDOM.addCSSClass(node, 'flick');
		}
		else {
			joDOM.removeCSSClass(node, 'flick');
			joDOM.removeCSSClass(node, 'flickback');
		}

		this.setTop(y);
	},

	// called after a flick transition to snap the view
	// back into our container if necessary.
	snapBack: function() {
		var node = this.container.firstChild;
		var top = this.getTop();

		var dy = top;
		var max = 0 - node.offsetHeight + this.container.offsetHeight;

		if (this.eventset)
			joEvent.remove(node, 'webkitTransitionEnd', this.eventset);

		joDOM.removeCSSClass(node, 'flick');
		joDOM.addCSSClass(node, 'flickback');
		
		if (dy > 0)
			this.setTop(0);
		else if (dy < max)
			this.setTop(max);
	},
	
	setTop: function(y) {
		var node = this.container.firstChild;

		// compatible
//		node.style.top = y + "px";
		
		// faster
		if (y == 0)
			node.style.webkitTransform = "";
		else
			node.style.webkitTransform = "translate3d(0, " + y + "px, 0)";

		node.jotop = y;
	},
	
	getTop: function() {
		return this.container.firstChild.jotop || 0;
	},
	
	setData: function(data) {
		joContainer.prototype.setData.apply(this, arguments);
	}
});
