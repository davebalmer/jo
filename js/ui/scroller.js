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

	CSS
	---
	
	- `div.joScroller`
	- `flick` physics defined for flicking
	- `flickback` snap-back physics after a flick
	
	> Not ready for use; going through a re-write.

*/

joScroller = function(data) {
	this.points = [];
	this.eventset = false;

	// Call Super
	joContainer.apply(this, arguments);
};
joScroller.velocity = 10;
joScroller.extend(joContainer, {
	tagName: "joscroller",
	moved: false,
	
	setEvents: function() {
		joEvent.capture(this.container, "click", this.onClick, this);
		joEvent.on(this.container, "mousedown", this.onDown, this);
		joEvent.on(this.container, "mouseup", this.onUp, this);
		joEvent.on(this.container, "mousemove", this.onMove, this);
		joEvent.on(this.container, "mouseout", this.onOut, this);
	},
	
	onFlick: function(e) {
//		var str = "";
//		for (var i in e)
//			str += "; " + i + "=" + e[i];
	},
	
	onClick: function(e) {
		if (this.moved) {
			this.moved = false;
			joEvent.stop(e);
			joEvent.preventDefault(e);
		}
	},
	
	onDown: function(e) {
//		joLog("onDown");
		joEvent.stop(e);

		this.start = this.getMouse(e);
		this.points = [];
		this.points.unshift(this.start);
		this.inMotion = true;
		this.quickSnap = false;
		
//		joEvent.preventDefault(e);
		
		joDOM.removeCSSClass(this.container.childNodes[0], "flick");
		joDOM.removeCSSClass(this.container.childNodes[0], "flickback");
	},
	
	onMove: function(e) {
//		joLog("onMove");
//		e.preventDefault();

		// TODO: move the page to follow the mouse
		if (this.inMotion) {
//			joLog("move");
			joEvent.stop(e);
			var point = this.getMouse(e);
			
			var y = point.y - this.points[0].y;
			this.points.unshift(point);

			if (this.points.length > 5)
				this.points.pop();

			var self = this;
			this.timer = window.setTimeout(function() {
				if (self.points.length > 1)
					self.points.pop();
			}, 100);
			
			this.scrollBy(y, true);

			this.moved = true;
		}
	},

	onOut: function(e) {
//		this.inMotion = false;
//		var target = joDOM.getParentWithin(joEvent.getTarget(e), this.container);
//		if (target !== this.data) {
//			joEvent.stop(e);
//			this.onUp(e);
//		}
		this.moved = false;
	},

	onUp: function (e) {
		if (!this.inMotion)
			return;

		this.inMotion = false;

		var end = this.getMouse(e);
		
		joEvent.stop(e);
		if (Math.abs(this.start.y - end.y) > 10
		|| Math.abs(this.start.x - end.x) > 10) {
			joEvent.preventDefault(e);
		}

		var dy = 0;
		for (var i = 0; i < this.points.length - 1; i++)
			dy += (this.points[i].y - this.points[i + 1].y);
		
		// if the velocity is "high" then it was a flick
		if (Math.abs(dy) > 5 && !this.quickSnap) {
			joDOM.addCSSClass(this.container.childNodes[0], "flick");

			var flick = dy * (this.container.childNodes[0].offsetHeight / this.container.offsetHeight);

			if (!this.eventset) {
				this.eventset = true;
				joEvent.on(this.container.childNodes[0], "webkitTransitionEnd", this.snapBack, this);
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
	
	scrollToElement: function (e) {
		this.scrollTo(e.offsetTop);
	},
	
	scrollBy: function(y, test) {
		var top = this.container.childNodes[0].offsetTop;

		if (isNaN(top))
			top = 0;

		var dy = Math.floor(top + y);
		
		if (this.container.childNodes[0].offsetHeight <= this.container.offsetHeight)
			return;
			
		var max = 0 - this.container.childNodes[0].offsetHeight + this.container.offsetHeight;
		var bump = 100;
		var ody = dy;
		
		if (dy > bump)
			dy = bump;
		else if (dy < max - bump)
			dy = max - bump;

		if (test) {
			if (ody != dy)
				this.quickSnap = true;
			else
				this.quickSnap = false;
		}
		
		if (this.container.childNodes[0].offsetTop != dy)
			this.container.childNodes[0].style.top = dy + "px";
	},

	scrollTo: function(y) {
		joDOM.removeCSSClass(this.data, 'flick');
		this.container.childNodes[0].style.top = y + "px";
	},

	snapBack: function() {
		var top = parseInt(this.container.childNodes[0].style.top);

		if (isNaN(top))
			top = 0;

		var dy = top;
		var max = 0 - this.container.childNodes[0].offsetHeight + this.container.offsetHeight;

		joDOM.removeCSSClass(this.data, 'flick');
		joDOM.addCSSClass(this.data, 'flickback');
		
		if (dy > 0)
			this.container.childNodes[0].style.top = "0px";
		else if (dy < max)
			this.container.childNodes[0].style.top = max + "px";
	}
});
