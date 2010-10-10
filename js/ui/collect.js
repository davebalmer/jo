/**
	joCollect
	=========
	
	*DEPRECATED* use joInterface instead. This function is planned
	to die when jo goes beta.

*/
joCollect = {
	get: function(parent) {
		// this is what happens when you announced something not
		// quite fully baked
		return new joInterface(parent);
	}
};
