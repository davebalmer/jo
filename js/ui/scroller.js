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
	
	setEvents: function() {
		joEvent.on(this.container, "mousedown", this.onDown, this);
		joEvent.on(this.container, "mouseup", this.onUp, this);
		joEvent.on(this.container, "mousemove", this.onMove, this);
		joEvent.on(this.container, "mouseout", this.onOut, this);
	},
	
	onFlick: function(e) {
		var str = "";
		for (var i in e)
			str += "; " + i + "=" + e[i];
	},
	
	onDown: function(e) {
//		joLog("onDown");
		joEvent.stop(e);

		this.points = [];
		this.points.unshift(this.getMouse(e));
		this.inMotion = true;
		this.quickSnap = false;

		joDOM.removeCSSClass(this.data, "flick");
		joDOM.removeCSSClass(this.data, "flickback");
	},
	
	onMove: function(e) {
//		joLog("onMove");
		e.preventDefault();

		// TODO: move the page to follow the mouse
		if (this.inMotion) {
//			joLog("move");
			joEvent.stop(e);
			var point = this.getMouse(e);
			
			var y = point.y - this.points[0].y;
			this.points.unshift(point);
			if (this.points.length > 5)
				this.points.pop();
			
			this.scrollBy(y, true);
		}
	},

	onOut: function(e) {
//		this.inMotion = false;
//		var target = joDOM.getParentWithin(joEvent.getTarget(e), this.container);
//		if (target !== this.data) {
//			joEvent.stop(e);
//			this.onUp(e);
//		}
	},

	onUp: function (e) {
//		joLog("onUp");
		
		if (!this.inMotion)
			return;

		joEvent.stop(e);

		this.inMotion = false;

		var dy = 0;
		for (var i = 0; i < this.points.length - 1; i++)
			dy += (this.points[i].y - this.points[i + 1].y);
		
		if (this.points.length > 4)
			e.preventDefault();

		// if the velocity is "high" then it was a flick
		if (Math.abs(dy) > 5 && !this.quickSnap) {
			joDOM.addCSSClass(this.container.childNodes[0], "flick");

			var flick = dy * (this.container.childNodes[0].offsetHeight / this.container.offsetHeight);

//			joYield(this.snapBack, this, 1000);
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
//		joLog(e.screenX, e.screenY, e.pageX, e.pageY, e.target, e.source);
		// TODO: This is picking up the element being touched's mouse position, so
		// need to follow the event chain up to the scroller's container.
		return { x: e.screenX, y: e.screenY };
	},
	
	scrollToElement: function (e) {
//		joDOM.addCSSClass(this.data, "flick");
//		this.data.style.top = -e.offsetTop + joDOM.getClientHeight() / 5 + "px";
	},
	
	scrollBy: function(y, test) {
		var top = this.container.childNodes[0].offsetTop;

		if (isNaN(top))
			top = 0;

		var dy = Math.floor(top + y);
		
		if (this.container.childNodes[0].offsetHeight <= this.container.offsetHeight)
			return;
			
		var max = 0 - this.container.childNodes[0].offsetHeight + this.container.offsetHeight;
//		var bump = Math.floor(this.container.offsetHeight * 0.2);
		
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
