/**
	joCache
	=======
	
	A singleton which makes it easy to setup deferred object creation and cached
	results. This is a performance menchanism initially designed for UI views, but
	could be extended to handle data requests and other object types.
	
	Methods
	-------
	
	- `set(key, call, context)`
	
	  Defines a factory (`call`) for building an object keyed from the `key` string.
	  The `context` argument is optional, but provides a reference for `this`.
	
	- `get(key)`
	
	  Returns an object based on the `key` string. If an object has not been created
	  which corresponds to the `key`, joCache will call the constructor defined to
	  create it and store the reference for future calls to `get()`.
	
	Use
	---
	
	Defining a view for on-demand use:
	
		joCache.set("home", function() {
			return new joCard([
				new joTitle("Home"),
				new joMenu([
					"Top Stories",
					"Latest News",
					"Old News",
					"No News"
				])
			]);
		});
	
	Displaying a view later:
	
		mystack.push(joCache.get("home"));
		
		// the first call to get() will instantiate
		// the view, subsequent calls will return the
		// view that was created the first time
		
		// you can pass parameters into your view factory
		var x = joCache.get("home", "My Title");
		
		// note that if you want to use joCache to cache
		// views which differ based on parameters passed in,
		// you probably want your own caching mechanism instead.

*/

joCache = {
	cache: {},
	
	set: function(key, call, context) {
		if (call)
			this.cache[key] = { "call": call, "context": context || this };
			
		return this;
	},
	
	get: function(key) {
		var cache = this.cache[key] || null;
		if (cache) {
			if (!cache.view)
				cache.view = cache.call.apply(cache.context, arguments);
				
			return cache.view;
		}
		else {
			return new joView("View not found: " + key);
		}
	}
};

