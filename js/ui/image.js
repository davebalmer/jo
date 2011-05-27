/**
	joImage
	=======
	
	Convenience wrapper for an image tag, handles image load
	and failure.
	
	Extends
	-------
	
	- joControl
	
	Methods
	-------

	- `setData(image)`
	
	  `image` can be a URL (including local files), base64 image data
	  string, or a reference to an `Image` object.
	  
	Events
	------
	
	- `loadEvent()`
	- `errorEvent()`
	
*/
joImage = function(data) {
	joControl.apply(this, arguments);
};
joImage.extend(joControl, {
	tagName: "img",
	
	createContainer: function() {
		var o = joDOM.create(this.tagName);
		if (!o)
			return;

		joEvent.on(o, "load", this.loadEvent.fire, this);
		joEvent.on(o, "error", this.errorEvent.fire, this);
		
		if (this.data)
			o.src = data;

		return o;
	},

	getImageData: function() {
		// baase64
	},
	
	setData: function(data) {
		this.data = data;

		// TODO: create Image instead, then attach to img tag?
		if (data)
			this.container.src = data;
	}
});
