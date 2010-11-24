/**
	joMenu
	======
	
	Simple menu class with optional icons.
	
	Extends
	-------
	
	- joList
	
	Methods
	-------
	
	- `setData(menudata)`
	
	  See the example below for the format of the menu data.
	
	Use
	---
	
		// simple inline menu; you can always setup the menu items (or change
		// them) but using the `setData()` method, same as any joView
		var menu = new joMenu([
			{ title: "About" },
			{ title: "Frequently Asked Questions", id: "faq" },
			{ title: "Visit our website", id: "visit", icon: "images/web" }
		]);
		
		// simple inline function event handler
		menu.selectEvent.subscribe(function(id) {
			switch (id) {
			case "0":
				// the "About" line; if no id, the index of the menu item is used
				stack.push(aboutCard);
				break;
			case "faq":
				stack.push(faqCard);
				break;
			case "visit":
				stack.push(visitCard);
				break;
			}
		});
	
	Advanced Use
	------------
	
	This could actually be called "more consistent and simple" use. If your menus
	are static, you could always setup an id-based dispatch delegate which pushes
	the appropriate card based on the menu `id` selected.

	You could use the `id` in conjunction with view keys you create with joCache.
	The handler would then be something like:
	
		menu.selectEvent.subscribe(function(id) {
			mystack.push(joCache.get(id));
		});

*/
joMenu = function() {
	joList.apply(this, arguments);
};
joMenu.extend(joList, {
	tagName: "jomenu",
	itemTagName: "jomenuitem",
	value: null,

	fireSelect: function(index) {
		if (typeof this.data[index].id !== "undefined" && this.data[index].id)
			this.selectEvent.fire(this.data[index].id);
		else
			this.selectEvent.fire(index);
	},
	
	formatItem: function(item, index) {
		var o = joDOM.create(this.itemTagName);
		
		// TODO: not thrilled with this system of finding the
		// selected item. It's flexible but annoying to code to.
		o.setAttribute("index", index);
		
		// quick/dirty
		if (typeof item === "object") {
			o.innerHTML = item.title;
			if (item.icon) {
				o.style.backgroundImage = "url(" + item.icon + ")";
				joDOM.addCSSClass(o, "icon");
			}
		}
		else {
			o.innerHTML = item;
		}
		
		return o;
	}
});
