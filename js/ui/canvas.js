/**
	joCanvas
	========

	Simple canvas wrapper control.
*/

function joCanvas(w, h) {
	this.canvas = joDOM.create("canvas");

	if (this.canvas)
		this.ctx = this.canvas.getContext("2d");

	this.ctx.imageSmoothingEnabled = false;
	this.ctx.mozImageSmoothingEnabled = false;
	this.ctx.oImageSmoothingEnabled = false;
	this.ctx.webkitImageSmoothingEnabled = false;

	if (w || h)
		this.setSize(w, h);
}
joCanvas.prototype = {
	getImage: function() {
		return this.canvas.toDataURL();
	},

	getCSSImage: function() {
		return "url(" + this.canvas.toDataURL() + ")";
	},

	clear: function() {
		this.ctx.clearRect(0, 0, this.width, this.height);
	},

	setSize: function(w, h) {
		if (!w)
			w = 50;

		if (!h)
			h = 50;

		this.canvas.setAttribute("width", w);
		this.canvas.setAttribute("height", h);

		this.width = w;
		this.height = h;

		return this;
	},

	getContext: function() {
		return this.ctx;
	},

	roundRect: function(sx, sy, ex, ey, r) {
		var r2d = Math.PI / 180;

		if ((ex - sx) - (2 * r) < 0)
			r = ((ex - sx) / 2);

		if ((ey - sy) - (2 * r) < 0 )
			r = ((ey - sy) / 2);

		var ctx = this.ctx;

		ctx.beginPath();
		ctx.moveTo(sx + r, sy);
		ctx.lineTo(ex - r, sy);
		ctx.arc(ex - r, sy + r, r, r2d * 270, r2d * 360);
		ctx.lineTo(ex, ey - r);
		ctx.arc(ex - r, ey - r, r, 0, r2d * 90);
		ctx.lineTo(sx + r, ey);
		ctx.arc(sx + r, ey - r, r, r2d * 90, r2d * 180);
		ctx.lineTo(sx, sy + r);
		ctx.arc(sx + r, sy + r, r, r2d * 180, r2d * 270);
		ctx.closePath();

		return this;
	},

	setFont: function(font) {
		this.ctx.font = font;

		return this;
	},

	ellipse: function(sx, sy, r) {
		this.ctx.beginPath();
		this.ctx.arc(sx, sy, r, 0, Math.PI * 2);
		this.ctx.closePath();

		return this;
	},

	getNode: function() {
		return this.canvas;
	}
};

