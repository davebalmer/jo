/**
	joNavbar
	========

	Floating navigation control. Usually tied to a joStack or joStackScroller.
	Will handle display of a "back" button (controllable in CSS) and show the
	title string of the current view in a stack (if it exists).

	Use
	---

		// make a stack
		var stack = new joStackScroller();

		// new navbar
		var x = new joNavbar();

		// link to a stack
		x.setStack(stack);

	Methods
	-------

	- `back()`

	  Signals the associated stack to move back in its stack (i.e. calls
	  the stack's `pop()` method).

	- `setStack(joStack or joStackScroller)`

	  Links this control to a stack.

*/

joNavbar = function(title) {
	if (title)
		this.firstTitle = title;

	var ui = [
		this.titlebar = new joView(title || '&nbsp;').setStyle('title'),
		this.flexrow = new joFlexrow([
			this.backButton = new joBackButton(joBackButton.prototype.backLabel).selectEvent.subscribe(this.back, this),
			""
		])
	];

	joContainer.call(this, ui);
};
joNavbar.extend(joContainer, {
	tagName: "jonavbar",
	stack: null,

	setUI: function(data) {
		this.flexrow.setData(data);
	},

	back: function() {
		if (this.stack)
			this.stack.pop();

		return this;
	},

	setStack: function(stack) {
		if (this.stack) {
			this.stack.pushEvent.unsubscribe(this.update, this);
			this.stack.popEvent.unsubscribe(this.update, this);
		}

		if (!stack) {
			this.stack = null;
			return this;
		}

		this.stack = stack;

		stack.pushEvent.subscribe(this.update, this);
		stack.popEvent.subscribe(this.update, this);

		this.refresh();

		return this;
	},

	update: function() {
		if (!this.stack)
			return this;

		joDOM.removeCSSClass(this.backButton, 'selected');
		joDOM.removeCSSClass(this.backButton, 'focus');

//		console.log('update ' + this.stack.data.length);

		if (this.stack.data.length > 1)
			joDOM.addCSSClass(this.backButton, 'active');
		else
			joDOM.removeCSSClass(this.backButton, 'active');

		var title = this.stack.getTitle();

		if (typeof title === 'string')
			this.titlebar.setData(title);
		else
			this.titlebar.setData(this.firstTitle);

		return this;
	},

	setTitle: function(title) {
		this.titlebar.setData(title);
		this.firstTitle = title;

		return this;
	}
});


/**
	joBackButton
	============

	A "back" button, which can be made to be shown only in appropriate
	platforms (e.g. iOS, Safari, Chrome) through CSS styling.

	See joNavbar for more information.

	Extends
	-------

	- joButton

*/
joBackButton = function() {
	joButton.apply(this, arguments);
};
joBackButton.extend(joButton, {
	backLabel: "",
	tagName: "jobackbutton"
});
