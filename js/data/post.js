function joPost(url, data, call, context, timeout, silent) {
	var req = new XMLHttpRequest();

	// 30 second default on requests
	if (!timeout)
		timeout = 15 * SEC;

	var timer = (timeout > 0) ? setTimeout(onerror, timeout * SEC) : null;

	if (typeof App.setBusy !== "undefined" || !silent)
		App.setBusy(true);

	req.open('POST', url, true);
//	req.contentType = "application/json";
//	req.withCredentials = true;
	req.setRequestHeader("Content-Type", "application/json");
	req.onreadystatechange = onchange;
	req.send(data);

	function onchange(e) {
		if (timer)
			timer = clearTimeout(timer);

		if (req.readyState == 4) {
			if (!req.status || req.status !== 200)
				onerror(req.status);
			else
				handler(req.response, 0);
		}
	}

	function onerror(e) {
		handler(e, true);
	}

	function handler(data, error) {
		if (typeof App.setBusy !== undefined || !silent)
			App.setBusy(false);

		if (call) {
			if (context)
				call.call(context, data, error);
			else
				call(data, error);
		}
	}

	return req;
};

