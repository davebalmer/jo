joNavbar = function(stack) {
	var ui = [
		this.title = new joView('&nbsp;').setStyle('title'),
		new joFlexrow([this.back = new joBackButton('Back').selectEvent.subscribe(this.back, this), ""])
	];
	
	joContainer.call(this, ui);

	this.setStack(stack);
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

		console.log('update ' + this.stack.data.length);
		
		if (this.stack.data.length > 1)
			joDOM.addCSSClass(this.back, 'active');
		else
			joDOM.removeCSSClass(this.back, 'active');
			
		var title = this.stack.getTitle();

		if (title)
			this.title.setData(title);
	}
});

joBackButton = function() {
	joButton.apply(this, arguments);
};
joBackButton.extend(joButton, {
	tagName: "jobackbutton"
});
