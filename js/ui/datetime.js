joDate = function() {
	joInput.apply(this, arguments);
};
joDate.extend(joInput, {
	type: "date"
});


joTime = function() {
	joInput.apply(this, arguments);
};
joTime.extend(joInput, {
	type: "time"
});

