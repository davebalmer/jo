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
function joImage(url) {
	var container = new Image();

	this.image = container;
	this.container = container;
	var self = this;

	this.loadEvent = new joSubject(this);
	this.errorEvent = new joSubject(this);

	function onload() {
		self.loadEvent.fire();
	}

	function onerror() {
		self.errorEvent.fire();
	}

	container.onload = onload;
	container.onerror = onerror;
	container.src = url;
}
joImage.extend(joLabel, {
	tagName: "img",
	setImage: function(image) {
//		console.log("image", image);
		this.container.src = "url(" + image + ")";
	}
});

