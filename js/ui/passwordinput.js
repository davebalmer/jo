/**
	joPasswordInput
	===============
	
	Secret data input field (e.g. displays `******` instead of `secret`).
	
	Extends
	-------
	
	- joInput
	
	> Note that this requires CSS3 which is known not to be currently supported
	> in Opera or Internet Explorer.

*/
joPasswordInput = function(data) {
	joInput.apply(this, arguments);
};
joPasswordInput.extend(joInput, {
	className: "password",
	type: "password"
});
