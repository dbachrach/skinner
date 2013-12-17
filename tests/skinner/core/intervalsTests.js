define(function (require) {
	var intervals = require("src/skinner/core/intervals");

	module("skinner/core/intervals");

	test("parseTimeInterval - undefined", function () {
		equal(intervals.parseTimeInterval(), undefined);
		equal(intervals.parseTimeInterval(undefined), undefined);
	});

	test("parseTimeInterval - failures", function () {
		equal(intervals.parseTimeInterval("1"), undefined);
		equal(intervals.parseTimeInterval("abc"), undefined);
		equal(intervals.parseTimeInterval("seconds"), undefined);
		equal(intervals.parseTimeInterval("5 xyz"), undefined);
		equal(intervals.parseTimeInterval("1 secondz"), undefined);
		equal(intervals.parseTimeInterval("-51 secondz"), undefined);
		equal(intervals.parseTimeInterval("garbage 5 sec"), undefined);
		equal(intervals.parseTimeInterval("6 sec garbage"), undefined);
		equal(intervals.parseTimeInterval("garbage 7 sec garbage"), undefined);
	});

	test("parseTimeInterval - seconds", function () {
		equal(intervals.parseTimeInterval("1 second"), 1 * 1000);
		equal(intervals.parseTimeInterval("5 seconds"), 5 * 1000);
		equal(intervals.parseTimeInterval("201232 secs"), 201232 * 1000);
		equal(intervals.parseTimeInterval("0 secs"), 0);
		equal(intervals.parseTimeInterval("-5 sec"), -5 * 1000);
		equal(intervals.parseTimeInterval("+5 sec"), 5 * 1000);
	});

	test("parseTimeInterval - minutes", function () {
		equal(intervals.parseTimeInterval("1 minute"), 60 * 1000);
		equal(intervals.parseTimeInterval("5 minutes"), 5 * 60 * 1000);
		equal(intervals.parseTimeInterval("201232 mins"), 201232 * 60 * 1000);
		equal(intervals.parseTimeInterval("0 min"), 0);
		equal(intervals.parseTimeInterval("-5 min"), -5 * 60 * 1000);
		equal(intervals.parseTimeInterval("+5 min"), 5 * 60 * 1000);
	});

	test("parseTimeInterval - hours", function () {
		equal(intervals.parseTimeInterval("1 hour"), 1 * 60 * 60 * 1000);
		equal(intervals.parseTimeInterval("5 hours"), 5 * 60 * 60 * 1000);
		equal(intervals.parseTimeInterval("201232 hrs"), 201232 * 60 * 60 * 1000);
		equal(intervals.parseTimeInterval("0 hr"), 0);
		equal(intervals.parseTimeInterval("-5 hr"), -5 * 60 * 60 * 1000);
		equal(intervals.parseTimeInterval("+5 hr"), 5 * 60 * 60 * 1000);
	});

	test("parseTimeInterval - day", function () {
		equal(intervals.parseTimeInterval("1 day"), 1 * 24 * 60 * 60 * 1000);
		equal(intervals.parseTimeInterval("5 days"), 5 * 24 * 60 * 60 * 1000);
		equal(intervals.parseTimeInterval("201232 days"), 201232 * 24 * 60 * 60 * 1000);
		equal(intervals.parseTimeInterval("0 day"), 0);
		equal(intervals.parseTimeInterval("-5 day"), -5 * 24 * 60 * 60 * 1000);
		equal(intervals.parseTimeInterval("+5 day"), 5 * 24 * 60 * 60 * 1000);
	});

	test("parseTimeInterval - year", function () {
		equal(intervals.parseTimeInterval("1 year"), 1 * 365 * 24 * 60 * 60 * 1000);
		equal(intervals.parseTimeInterval("5 years"), 5 * 365 * 24 * 60 * 60 * 1000);
		equal(intervals.parseTimeInterval("201232 yrs"), 201232 * 365 * 24 * 60 * 60 * 1000);
		equal(intervals.parseTimeInterval("0 yr"), 0);
		equal(intervals.parseTimeInterval("-5 yr"), -5 * 365 * 24 * 60 * 60 * 1000);
		equal(intervals.parseTimeInterval("+5 yr"), 5 * 365 * 24 * 60 * 60 * 1000);
	});
});
