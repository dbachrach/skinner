define ({
	ParseTime: function(time) {
		matches = time.match(/(\d)+ *(.*)/);

		var number = parseInt(matches[0]);

		var unit = 1000;
		if (_.contains(["sec", "second", "seconds", "secs"], matches[1]) != -1) {
			unit = 1000;
		}
		else if (_.contains(["min", "minute", "minutes", "mins"], matches[1]) != -1) {
			unit = 60000;
		}

		console.log("Parsed time for " + number + ", unit: " + unit);
		return number * unit;
	}
});
