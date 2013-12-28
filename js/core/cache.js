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

	- `clear(key)`

	  Frees up the object held by joCache for a given key. The goal is to free up
	  memory. Note that for your object (probably a view) to be truly free, you
	  should make sure you don't have any global references pointing to it. There
	  isn't a practical way to do this at the framework level, it requires some
	  careful coding.

	  A potentially useful side effect of this is you can force a fresh build of
	  your view by doing `joCache.clear("prefs").get("prefs")`.
	
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

	Clearing cache data:

		// useful if you want to free up memory
		joCache.clear("home");
*/

joCache = {
	cache: {},
	
	set: function(key, call, context) {
		if (call)
			this.cache[key] = { call: call, context: context || this };
			
		return this;
	},
	
	get: function(key) {
		var cache = this.cache[key] || null;
		if (cache) {
			if (!cache.view)
				cache.view = cache.call.apply(cache.context, arguments);
				
			return cache.view;
		}

		return null;
	},

	exists: function(key) {
		return this.cache[key];
	},

	clear: function(key) {
		if (typeof this.cache[key] === 'object')
			this.cache[key].view = null;
		
		return this;
	}
};

