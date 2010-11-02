/**
	joClipboard
	===========
	
	Singleton which abstracts the system clipboard. Note that this is a platform
	dependant interface. By default, the class will simply store the contents in
	a special joPreference named "joClipboardData" to provide clipboard capabilities
	within your app.
	
	> Even if you think you're just going to use the default behavior, it is
	> recommended that you never manipulate the "joClipboardData" preference directly.
	
	Methods
	-------
	
	- `get()`
	- `set(String)`

	  Low level methods which use just strings. At this time, you will need to
	  stringify your own data when setting, and extract your data when getting.
	
	- `cut(joControl)`
	- `copy(joControl)`
	- `paste(joControl)`

	  High level methods which work with any joControl or subclass. If a control
	  supports selections, `cut()` will automatically remove the selection after
	  copying its contents. Otherwise, `cut()` will work the same as `copy()`.
	
	> Note: this is not working yet, steer clear (or contribute some working code!)
	
*/
joClipboard = {
	data: "",
	
	get: function() {
		return joPreference.get("joClipboardData") || this.data;
	},
	
	set: function(clip) {
		// don't feed it junk; stringify it first
		// TODO: detect non-strings and stringify them
		this.data = clip;
		joPreference.set("joClipboardData");
	}
};
