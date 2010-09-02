/**
	joFocus
	=======
	
	Singleton which manages global input and event focus among joControl objects.
	
	Methods
	-------
	
	- `set(joControl)`
	
	  Unsets focus on the last control, and sets focus on the control passed in.
	
	- `clear()`
	
	  Unsets focus on the last control.
	
	- `refresh()`
	
	  Sets focus back to the last control that was focused.

*/

joFocus = {
	last: null,

	set: function(control) {
		if (this.last && this.last !== control)
			this.last.blur();
	
		if (control && control instanceof joControl) {
			control.focus();
			this.last = control;
		}
	},
	
	get: function(control) {
		return this.last;
	},
	
	refresh: function() {
//		joLog("joFocus.refresh()");
		if (this.last)
			this.last.focus();
	},
	
	clear: function() {
		this.set();
	}
};

