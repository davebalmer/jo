/**
	joScroller
	==========
	
	A scroller container.

	Extends
	-------
	
	- joContainer
	
	Methods
	-------
	
	- `scrollBy(position)`
	- `scrollTo(position)`
	- `scrollToView(joView)`
	
	  Scrolls to make the top of the specified view visible.
	
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
	velocity: 1.4,
	bump: 50,
	
	setEvents: function() {
		joEvent.capture(this.container, "click", this.onClick, this);
		joEvent.on(this.container, "mousedown", this.onDown, this);
		joEvent.on(this.container, "mouseup", this.onUp, this);
		joEvent.on(this.container, "mousemove", this.onMove, this);
//		joEvent.capture(this.container, "mouseout", this.onOut, this);
	},
	
	onFlick: function(e) {
		// placeholder
	},
	
	onClick: function(e) {
		if (this.moved) {
			joLog("onClick, moved");
			this.moved = false;
			joEvent.stop(e);
			joEvent.preventDefault(e);
		}
	},
	
	onDown: function(e) {
		joEvent.stop(e);

		this.reset();

		var node = this.container.childNodes[0];
		
		joDOM.removeCSSClass(node, "flick");
		joDOM.removeCSSClass(node, "flickback");

		this.start = this.getMouse(e);
		this.points.unshift(this.start);
		this.inMotion = true;
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
		var point = this.getMouse(e);
		
		var y = point.y - this.points[0].y;
		this.points.unshift(point);

		if (this.points.length > 5)
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

	onOut: function(e) {
		// placeholder
		this.reset();
	},

	onUp: function (e) {
		if (!this.inMotion)
			return;

		this.inMotion = false;

		var end = this.getMouse(e);
		var node = this.container.firstChild;
		
		joEvent.stop(e);

		var dy = 0;
		for (var i = 0; i < this.points.length - 1; i++)
			dy += (this.points[i].y - this.points[i + 1].y);
		
		// if the velocity is "high" then it was a flick
		if (Math.abs(dy) > 5 && !this.quickSnap) {
			joDOM.addCSSClass(node, "flick");

			var flick = dy * (this.velocity * (node.offsetHeight / this.container.offsetHeight));

			if (!this.eventset) {
				this.eventset = true;
				joEvent.on(node, "webkitTransitionEnd", this.snapBack, this);
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
	
	scrollToElement: function (node) {
		this.scrollTo(node.offsetTop);
	},
	
	scrollBy: function(y, test) {
		var node = this.container.firstChild;
		var top = node.offsetTop;

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

		if (test) {
			if (ody != dy)
				this.quickSnap = true;
			else
				this.quickSnap = false;
		}

		if (node.offsetTop != dy)
			node.style.top = dy + "px";
	},

	scrollTo: function(y) {
		var node = this.container.firstChild;
		
		joDOM.removeCSSClass(node, 'flick');
		node.style.top = y + "px";
	},

	snapBack: function() {
		var node = this.container.firstChild;
		var top = parseInt(node.style.top);
		if (isNaN(top))
			top = 0;

		var dy = top;
		var max = 0 - node.offsetHeight + this.container.offsetHeight;

		joDOM.removeCSSClass(node, 'flick');
		joDOM.addCSSClass(node, 'flickback');
		
//		window.setTimeout(function() {
			if (dy > 0)
				node.style.top = "0px";
			else if (dy < max)
				node.style.top = max + "px";
//		}, 1);
	}
});
