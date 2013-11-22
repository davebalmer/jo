App = {
	load: function() {
		jo.load();
		
		// grab the HTML for our about box
		var about = joDOM.get("about").innerHTML;
			
		// this is a more complex UI with a nav bar and a toolbar
		this.scn = new joScreen(
			new joContainer([
				new joFlexcol([
					this.nav = new joNavbar(),
					this.stack = new joStackScroller()
				]),
				this.toolbar = new joToolbar("This is a footer")
			])
		);
		
		this.nav.setStack(this.stack);
		
		joCache.set("about", function() {
			var card = new joCard(about).setTitle("About");
			
			return card;
		});
			
		this.stack.push(joCache.get("menu"));
		console.log(this);
	}
};
