/**
	joStack
	========
	
 	A UI container which keeps an array of views which can be pushed and popped.
	The DOM elements for a given view are removed from the DOM tree when popped
	so we keep the render tree clean.

	Extends
	-------
	
	- joView

	Methods
	-------
	
	- `push(joView | HTMLElement)`	
	- `pop()`
	- `home()`
	- `show()`
	- `hide()`
	- `forward()`
	- `back()`
	- `setLocked(boolean)`
	
	  The `setLocked()` method tells the stack to keep the first view pushed onto the
	  stack set; that is, `pop()` won't remove it. Most apps will probably use this,
	  so setting it as a default for now.
	
	Events
	------
	
	- `showEvent`
	- `hideEvent`
	- `homeEvent`
	- `pushEvent`
	- `popEvent`
	
	Notes
	-----
	
	Should set classNames to new/old views to allow for CSS transitions to be set
	(swiping in/out, cross fading, etc). Currently, it does none of this.
	
	Also, some weirdness with the new `forward()` and `back()` methods in conjuction
	with `push()` -- need to work on that, or just have your app rigged to `pop()`
	on back to keep the nesting simple.
	
*/
joStack = function(data) {
	this.visible = false;
	
	joView.apply(this, arguments);

	// default to keep first card on the stack; won't pop() off
	this.setLocked(true);

	this.pushEvent = new joSubject(this);
	this.popEvent = new joSubject(this);
	this.homeEvent = new joSubject(this);
	this.showEvent = new joSubject(this);
	this.hideEvent = new joSubject(this);
	
	this.data = [];
	this.index = 0;
	this.lastIndex = 0;
	this.lastNode = null;
};
joStack.extend(joView, {
	tagName: "jostack",
	
	setEvents: function() {
		// do not setup DOM events for the stack
	},
	
	onClick: function(e) {
		joEvent.stop(e);
	},
	
	forward: function() {
		if (this.index < this.data.length - 1) {
			this.index++;
			this.draw();
		}
	},
	
	back: function() {
		if (this.index > 0) {
			this.index--;
			this.draw();
		}
	},
	
	draw: function() {
		if (!this.container)
			this.createContainer();

		// short term hack for webos
		// not happy with it but works for now
		jo.flag.stopback = this.index ? true : false;

		var container = this.container;
		var oldchild = this.lastNode;
		var newchild = getnode(this.data[this.index]);

		function getnode(o) {
			return (typeof o.container !== "undefined") ? o.container : o;
		}
		
		if (!newchild)
			return;
		
		if (this.index > this.lastIndex) {
			var oldclass = "prev";
			var newclass = "next";
			joDOM.addCSSClass(newchild, newclass);
		}
		else if (this.index < this.lastIndex) {
			var oldclass = "next";
			var newclass = "prev";
			joDOM.addCSSClass(newchild, newclass);
		}
		else {
			container.innerHTML = "";
		}

		joLog("appendChild");
		container.appendChild(newchild);

		// trigger animation
		joYield(animate, this, 1);
		
		function animate() {
			joLog("animate");

			if (newclass && newchild)
				joDOM.removeCSSClass(newchild, newclass);

			if (oldclass && oldchild)
				joDOM.addCSSClass(oldchild, oldclass);

			// TODO: add transition end event if available, this as fallback
//			setTimeout(cleanup, 300);
			if (!this.eventset) {
				this.eventset = true;
				joEvent.on(this.container.childNodes[0], "webkitTransitionEnd", cleanup, this);
			}
		}
		
		function cleanup() {
			if (oldchild && oldchild !== newchild)
				container.removeChild(oldchild);
		}
		
		if (typeof this.data[this.index].activate !== "undefined")
			this.data[this.index].activate.call(this.data[this.index]);
		
		this.lastIndex = this.index;
		this.lastNode = newchild;
		
		// while we're using scrollTop instead of joScroller, reset top position
		this.container.scrollTop = "0";
		if (this.container.firstChild)
			this.container.firstChild.scrollTop = "0";
	},
	
	isVisible: function() {
		return this.visible;
	},
	
	push: function(o) {
//		if (!this.data || !this.data.length || o !== this.data[this.data.length - 1])
//			return;
		
		this.data.push(o);
			
		this.index = this.data.length - 1;

		this.draw();

		this.pushEvent.fire(o);
	},

	// lock the stack so the first pushed view stays put
	setLocked: function(state) {
		this.locked = (state) ? 1 : 0;
	},
	
	pop: function() {
		if (this.data.length > this.locked) {
			var o = this.data.pop();
			this.index = this.data.length - 1;

			this.draw();
			
			if (typeof o.activate !== "undefined")
				o.deactivate.call(o);

			if (!this.data.length)
				this.hide();
		}

		if (this.data.length > 0)
			this.popEvent.fire();
	},
	
	home: function(o) {
		if (this.data && this.data.length) {
			var o = this.data[0];
			
			this.data = [];
			this.data.push(o);
			this.draw();
			
			this.homeEvent.fire();
		}
	},
	
	showHome: function() {
		this.home();
		
		if (!this.visible) {
			this.visible = true;
			joDOM.addCSSClass(this.container, "show");
			this.showEvent.fire();
		}
	},
	
	show: function() {
		if (!this.visible) {
			this.visible = true;
			joDOM.addCSSClass(this.container, "show");

			joYield(this.showEvent.fire, this.showEvent, 500);
		}
	},
	
	hide: function() {
		if (this.visible) {
			this.visible = false;
			joDOM.removeCSSClass(this.container, "show");			

			joYield(this.hideEvent.fire, this.hideEvent, 500);
		}
	}
});
