joNavbar = function(title) {
	if (title)
		this.firstTitle = title;
	
	var ui = [
		this.titlebar = new joView(title || '&nbsp;').setStyle('title'),
		new joFlexrow([this.back = new joBackButton('Back').selectEvent.subscribe(this.back, this), ""])
	];
	
	joContainer.call(this, ui);
};
joNavbar.extend(joContainer, {
	tagName: "jonavbar",
	stack: null,
	
	back: function() {
		if (this.stack)
			this.stack.pop();
	},
	
	setStack: function(stack) {
		if (this.stack) {
			this.stack.pushEvent.unsubscribe(this.update, this);
			this.stack.popEvent.unsubscribe(this.update, this);
		}
		
		if (!stack) {
			this.stack = null;
			return;
		}
		
		this.stack = stack;
		
		stack.pushEvent.subscribe(this.update, this);
		stack.popEvent.subscribe(this.update, this);

		this.refresh();
	},

	update: function() {
		if (!this.stack)
			return;
		
		joDOM.removeCSSClass(this.back, 'selected');
		joDOM.removeCSSClass(this.back, 'focus');

//		console.log('update ' + this.stack.data.length);
		
		if (this.stack.data.length > 1)
			joDOM.addCSSClass(this.back, 'active');
		else
			joDOM.removeCSSClass(this.back, 'active');
			
		var title = this.stack.getTitle();

		if (typeof title === 'string')
			this.titlebar.setData(title);
		else
			this.titlebar.setData(this.firstTitle);
	},
	
	setTitle: function(title) {
		this.titlebar.setData(title);
		this.firstTitle = title;
	}
});

joBackButton = function() {
	joButton.apply(this, arguments);
};
joBackButton.extend(joButton, {
	tagName: "jobackbutton"
});
