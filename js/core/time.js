/**
	joTime
	======
	
	Time utility functions. More will be added, but only as needed by the
	framework. There are entire libraries dedicated to extensive datetime
	manipulation, and Jo doesn't pretend to be one of them.
	
	Methods
	-------
	
	- `timestamp()`
	
	  Returns a current timestamp in milliseconds from 01/01/1970 from
	  the system clock.

	Constants
	---------

	- `SEC`, `MIN`, `HOUR`, `DAY`

	  Convenience global constants which make it easier to manipulate
	  timestamps.
	
	Use
	---
	
		var twoHoursLater = joTime.timestamp() + (HOUR * 2);
	
*/

var SEC = 1000;
var MIN = 60 * SEC;
var HOUR = 60 * MIN;
var DAY = 24 * HOUR;

joTime = {
	timestamp: function() {
		var now = new Date();
		return now / 1;
	}
};
