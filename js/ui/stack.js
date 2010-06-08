/**
	joStack
	========
	
	Stack widget which keeps an array of views which can be pushed and popped.
	The DOM elements for a given view are removed from the DOM tree when popped
	but a reference is kept to them, so we keep the render tree clean but don't
	have to redraw every time we put something back on the stack.

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
	(swiping in/out, cross fading, etc). Currently, it does none of this; fast but
	not too exciting.
	
	Also, some weirdness with the new `forward()` and `back()` methods in conjuction
	with `push()` -- need to work on that, or just have your app rigged to `pop()`
	on back to keep the nesting simple.
	
	The `setLocked()` method tells the stack to keep the first view pushed onto the
	stack set; that is, `pop()` won't remove it. Most apps will probably use this,
	so setting it as a default for now.

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
};
joStack.extend(joView, {
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
		
		if (this.container.childNodes && this.container.childNodes.length) {
			// TODO: add CSS className to views transitioning in and out
			// fine for now, but should allow for transitions later
			// opera sucks, so
			this.container.innerHTML = "";
//			this.container.removeChild(this.container.childNodes[0]);
		}

		var o = this.data[this.index];

		if (!o)
			return;
			
		if (o.container) {
			this.container.appendChild(o.container);

			if (typeof o.activate !== 'undefined')
				o.activate();
		}
		else {
			this.container.appendChild(o);
		}
		
		// while we're using scrollTop instead of joScroller, reset top position
		this.container.scrollTop = "0";
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

			if (typeof o.deactivate !== 'undefined')
				o.deactivate();

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
	},
	
	createContainer: function(tag, classname) {
		return joDOM.create(tag || "jostack", classname);
	}
});
