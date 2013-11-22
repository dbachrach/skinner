define(function (require) {
	var intervals = require("src/skinner/core/intervals");
	
	QUnit.module("skinner/core/intervals");
	
	QUnit.test("parseTimeInterval - undefined", function () { 
		QUnit.equal(intervals.parseTimeInterval(), undefined);
		QUnit.equal(intervals.parseTimeInterval(undefined), undefined);
	});

	QUnit.test("parseTimeInterval - failures", function () {
		QUnit.equal(intervals.parseTimeInterval("1"), undefined);
		QUnit.equal(intervals.parseTimeInterval("abc"), undefined);
		QUnit.equal(intervals.parseTimeInterval("seconds"), undefined);
		QUnit.equal(intervals.parseTimeInterval("5 xyz"), undefined);
		QUnit.equal(intervals.parseTimeInterval("1 secondz"), undefined);
		QUnit.equal(intervals.parseTimeInterval("-51 secondz"), undefined);
		QUnit.equal(intervals.parseTimeInterval("garbage 5 sec"), undefined);
		QUnit.equal(intervals.parseTimeInterval("6 sec garbage"), undefined);
		QUnit.equal(intervals.parseTimeInterval("garbage 7 sec garbage"), undefined);
	});

	QUnit.test("parseTimeInterval - seconds", function () {
		QUnit.equal(intervals.parseTimeInterval("1 second"), 1 * 1000);
		QUnit.equal(intervals.parseTimeInterval("5 seconds"), 5 * 1000);
		QUnit.equal(intervals.parseTimeInterval("201232 secs"), 201232 * 1000);
		QUnit.equal(intervals.parseTimeInterval("0 secs"), 0);
		QUnit.equal(intervals.parseTimeInterval("-5 sec"), -5 * 1000);
		QUnit.equal(intervals.parseTimeInterval("+5 sec"), 5 * 1000);
	});

	QUnit.test("parseTimeInterval - minutes", function () {
		QUnit.equal(intervals.parseTimeInterval("1 minute"), 60 * 1000);
		QUnit.equal(intervals.parseTimeInterval("5 minutes"), 5 * 60 * 1000);
		QUnit.equal(intervals.parseTimeInterval("201232 mins"), 201232 * 60 * 1000);
		QUnit.equal(intervals.parseTimeInterval("0 min"), 0);
		QUnit.equal(intervals.parseTimeInterval("-5 min"), -5 * 60 * 1000);
		QUnit.equal(intervals.parseTimeInterval("+5 min"), 5 * 60 * 1000);
	});

	QUnit.test("parseTimeInterval - hours", function () {
		QUnit.equal(intervals.parseTimeInterval("1 hour"), 1 * 60 * 60 * 1000);
		QUnit.equal(intervals.parseTimeInterval("5 hours"), 5 * 60 * 60 * 1000);
		QUnit.equal(intervals.parseTimeInterval("201232 hrs"), 201232 * 60 * 60 * 1000);
		QUnit.equal(intervals.parseTimeInterval("0 hr"), 0);
		QUnit.equal(intervals.parseTimeInterval("-5 hr"), -5 * 60 * 60 * 1000);
		QUnit.equal(intervals.parseTimeInterval("+5 hr"), 5 * 60 * 60 * 1000);
	});

	QUnit.test("parseTimeInterval - day", function () {
		QUnit.equal(intervals.parseTimeInterval("1 day"), 1 * 24 * 60 * 60 * 1000);
		QUnit.equal(intervals.parseTimeInterval("5 days"), 5 * 24 * 60 * 60 * 1000);
		QUnit.equal(intervals.parseTimeInterval("201232 days"), 201232 * 24 * 60 * 60 * 1000);
		QUnit.equal(intervals.parseTimeInterval("0 day"), 0);
		QUnit.equal(intervals.parseTimeInterval("-5 day"), -5 * 24 * 60 * 60 * 1000);
		QUnit.equal(intervals.parseTimeInterval("+5 day"), 5 * 24 * 60 * 60 * 1000);
	});

	QUnit.test("parseTimeInterval - year", function () {
		QUnit.equal(intervals.parseTimeInterval("1 year"), 1 * 365 * 24 * 60 * 60 * 1000);
		QUnit.equal(intervals.parseTimeInterval("5 years"), 5 * 365 * 24 * 60 * 60 * 1000);
		QUnit.equal(intervals.parseTimeInterval("201232 yrs"), 201232 * 365 * 24 * 60 * 60 * 1000);
		QUnit.equal(intervals.parseTimeInterval("0 yr"), 0);
		QUnit.equal(intervals.parseTimeInterval("-5 yr"), -5 * 365 * 24 * 60 * 60 * 1000);
		QUnit.equal(intervals.parseTimeInterval("+5 yr"), 5 * 365 * 24 * 60 * 60 * 1000);
	});
});
