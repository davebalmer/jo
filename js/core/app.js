joApp = function() {
	// nothing to do; just using for inheritance
};
joApp.prototype = {
	load: function() {
		jo.load();
		this.setupPlatform();
		this.screen = new joScreen();
	},

	quickTouch: false,
	title: "",

	notify: function(msg) {
		var notification;
		var that = this;

/*
		function nogo() {
			App.screen.alert(msg);
			console.log(">>> notify >>>", msg);

			joDefer(function() {
				App.screen.hidePopup();
			}, that, 5000);
		}
*/

//		function go() {

		notification = new Notification(App.title, {
			body: msg,
			icon: "favicon-192x192.png"
		});

		joDefer(function() {
			notification.close();
		}, that, 5000);

		return this;

//		}

// notifications got weird -- rope this off for now
//		if (!("Notification" in window)) {
//			nogo();
//			return;
//		}
//		else if (Notification.permission === "granted") {
//			// fine
//			go();
//		}
//		else if (Notification.permission !== 'denied') {
//			Notification.requestPermission(function (permission) {
//				if (Notification.permission === "granted")
//					go();
//				else
//					nogo();
//			});
//		}
	},

	setupPlatform: function() {
		// quick fix for ios' 300ms delay issue; Jo-specific fix
		if (jo.os == "ios" || jo.os == "android") {
			joEvent.map.click = "touchend";
			joEvent.capture(document.body, "touchmove", touchMove);
//			joEvent.capture(document.body, "touchmove", function() { App.quickTouch = 0; });
		}

		function touchMove(e) {
			if (!App.quickTouch) {
				App.quickTouch = true;
				joEvent.capture(document.body, "touchend", touchEnd);
			}
		}

		function touchEnd(e) {
			if (App.quickTouch) {
				joEvent.stop(e);
				App.quickTouch = false;
				joEvent.remove(document.body, "touchend", touchEnd);
			}
		}

		// set proper meta tags
		if (jo.os === "ios") {
			joDOM.addMeta('<meta name="viewport" content="user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, target-densitydpi=device-dpi" />');
			joDOM.addMeta("apple-mobile-web-app-status-bar-style", "black");
		}
		else {
			joDOM.addMeta('<meta name="viewport" content="user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1" />');
		}

		// neutralize font size
		if (jo.os === "ios" && jo.platform === "iphone") {
			document.body.style.fontSize = ".75rem";
			App.fontSizeList = [ ".6rem", ".75rem", ".9rem" ];
		}
		else if (jo.os === "ios") {
			document.body.style.fontSize = "1rem";
			App.fontSizeList = [ ".9rem", "1rem", "1.1rem"];
		}
		else if (jo.os === "android") {
			document.body.style.fontSize = ".9rem";
			App.fontSizeList = [ ".8rem", ".9rem", "1rem"];
		}
		else if (jo.platform === "firefox") {
			// firefox is the new IE6
			joDefer(function() {
				joDOM.applyCSS("jooption { display: flex; } jocard { margin-bottom: 3em; }");
			}, this);
			document.body.style.fontSize = ".9rem";
		}
		else {
			document.body.style.fontSize = ".9rem";
		}

		joDefer(function() {
			document.body.style.opacity = 1;
		}, this, 0);
	}
};
