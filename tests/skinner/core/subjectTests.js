define(function (require) {
    var Subject = require("src/skinner/core/subject");

    module("skinner/core/subject");

    test("subject - condition assignment - single dimension, single value", function () {
        var subjectNumber = 1;
        var dimensions = {"dim1" : ["val1"]};
        var subject = new Subject(subjectNumber, dimensions);
        deepEqual(subject.condition, {"dim1": "val1"});

        subjectNumber = 2;
        subject = new Subject(subjectNumber, dimensions);
        deepEqual(subject.condition, {"dim1": "val1"});
    });

    test("subject - condition assignment - single dimension, multiple value", function () {
        var dimensions = {"dim1" : ["val1", "val2"]};
        var subjectNumber = 1;
        var subject = new Subject(subjectNumber, dimensions);
        deepEqual(subject.condition, {"dim1": "val1"});

        subjectNumber = 2;
        subject = new Subject(subjectNumber, dimensions);
        deepEqual(subject.condition, {"dim1": "val2"});

        subjectNumber = 3;
        subject = new Subject(subjectNumber, dimensions);
        deepEqual(subject.condition, {"dim1": "val1"});

        subjectNumber = 4;
        subject = new Subject(subjectNumber, dimensions);
        deepEqual(subject.condition, {"dim1": "val2"});
    });

    test("subject - condition assignment - multiple dimension, single value", function () {
        var dimensions = {"dim1" : ["val1"], "dim2" : ["val2"]};
        var subjectNumber = 1;
        var subject = new Subject(subjectNumber, dimensions);
        deepEqual(subject.condition, {"dim1": "val1", "dim2": "val2"});

        subjectNumber = 2;
        subject = new Subject(subjectNumber, dimensions);
        deepEqual(subject.condition, {"dim1": "val1", "dim2": "val2"});
    });

    test("subject - condition assignment - multiple dimension, multiple value", function () {
        var dimensions = {"dim1": ["val1", "val2"], "dim2": ["val3", "val4"]};
        var subjectNumber = 1;
        var subject = new Subject(subjectNumber, dimensions);
        deepEqual(subject.condition, {"dim1": "val1", "dim2": "val3"});

        subjectNumber = 2;
        subject = new Subject(subjectNumber, dimensions);
        deepEqual(subject.condition, {"dim1": "val2", "dim2": "val3"});

        subjectNumber = 3;
        subject = new Subject(subjectNumber, dimensions);
        deepEqual(subject.condition, {"dim1": "val1", "dim2": "val4"});

        subjectNumber = 4;
        subject = new Subject(subjectNumber, dimensions);
        deepEqual(subject.condition, {"dim1": "val2", "dim2": "val4"});

        dimensions = {"dim1": ["val1", "val2"], "dim2": ["val3", "val4"]};
        subjectNumber = 5;
        subject = new Subject(subjectNumber, dimensions);
        deepEqual(subject.condition, {"dim1": "val1", "dim2": "val3"});

        subjectNumber = 6;
        subject = new Subject(subjectNumber, dimensions);
        deepEqual(subject.condition, {"dim1": "val2", "dim2": "val3"});

        subjectNumber = 7;
        subject = new Subject(subjectNumber, dimensions);
        deepEqual(subject.condition, {"dim1": "val1", "dim2": "val4"});

        subjectNumber = 8;
        subject = new Subject(subjectNumber, dimensions);
        deepEqual(subject.condition, {"dim1": "val2", "dim2": "val4"});
    });

    test("subject - condition assignment - large multiple dimension, large multiple value", function () {
        var dimensions = {"dim1": ["val1", "val2", "val3"], "dim2": ["val4", "val5"], "dim3" : ["val6", "val7", "val8"]};
        var subjectNumber = 1;
        var subject = new Subject(subjectNumber, dimensions);
        deepEqual(subject.condition, {"dim1": "val1", "dim2": "val4", "dim3": "val6"});

        subjectNumber = 2;
        subject = new Subject(subjectNumber, dimensions);
        deepEqual(subject.condition, {"dim1": "val2", "dim2": "val4", "dim3": "val6"});

        subjectNumber = 3;
        subject = new Subject(subjectNumber, dimensions);
        deepEqual(subject.condition, {"dim1": "val3", "dim2": "val4", "dim3": "val6"});

        subjectNumber = 4;
        subject = new Subject(subjectNumber, dimensions);
        deepEqual(subject.condition, {"dim1": "val1", "dim2": "val5", "dim3": "val6"});

        subjectNumber = 5;
        subject = new Subject(subjectNumber, dimensions);
        deepEqual(subject.condition, {"dim1": "val2", "dim2": "val5", "dim3": "val6"});

        subjectNumber = 6;
        subject = new Subject(subjectNumber, dimensions);
        deepEqual(subject.condition, {"dim1": "val3", "dim2": "val5", "dim3": "val6"});

        subjectNumber = 7;
        subject = new Subject(subjectNumber, dimensions);
        deepEqual(subject.condition, {"dim1": "val1", "dim2": "val4", "dim3": "val7"});

        subjectNumber = 8;
        subject = new Subject(subjectNumber, dimensions);
        deepEqual(subject.condition, {"dim1": "val2", "dim2": "val4", "dim3": "val7"});

        subjectNumber = 9;
        subject = new Subject(subjectNumber, dimensions);
        deepEqual(subject.condition, {"dim1": "val3", "dim2": "val4", "dim3": "val7"});

        subjectNumber = 10;
        subject = new Subject(subjectNumber, dimensions);
        deepEqual(subject.condition, {"dim1": "val1", "dim2": "val5", "dim3": "val7"});

        subjectNumber = 11;
        subject = new Subject(subjectNumber, dimensions);
        deepEqual(subject.condition, {"dim1": "val2", "dim2": "val5", "dim3": "val7"});

        subjectNumber = 12;
        subject = new Subject(subjectNumber, dimensions);
        deepEqual(subject.condition, {"dim1": "val3", "dim2": "val5", "dim3": "val7"});

        subjectNumber = 13;
        subject = new Subject(subjectNumber, dimensions);
        deepEqual(subject.condition, {"dim1": "val1", "dim2": "val4", "dim3": "val8"});

        subjectNumber = 14;
        subject = new Subject(subjectNumber, dimensions);
        deepEqual(subject.condition, {"dim1": "val2", "dim2": "val4", "dim3": "val8"});

        subjectNumber = 15;
        subject = new Subject(subjectNumber, dimensions);
        deepEqual(subject.condition, {"dim1": "val3", "dim2": "val4", "dim3": "val8"});

        subjectNumber = 16;
        subject = new Subject(subjectNumber, dimensions);
        deepEqual(subject.condition, {"dim1": "val1", "dim2": "val5", "dim3": "val8"});

        subjectNumber = 17;
        subject = new Subject(subjectNumber, dimensions);
        deepEqual(subject.condition, {"dim1": "val2", "dim2": "val5", "dim3": "val8"});

        subjectNumber = 18;
        subject = new Subject(subjectNumber, dimensions);
        deepEqual(subject.condition, {"dim1": "val3", "dim2": "val5", "dim3": "val8"});

        // Repeat over 18 (condition size).

        subjectNumber = 19;
        subject = new Subject(subjectNumber, dimensions);
        deepEqual(subject.condition, {"dim1": "val1", "dim2": "val4", "dim3": "val6"});

        subjectNumber = 20;
        subject = new Subject(subjectNumber, dimensions);
        deepEqual(subject.condition, {"dim1": "val2", "dim2": "val4", "dim3": "val6"});

        subjectNumber = 21;
        subject = new Subject(subjectNumber, dimensions);
        deepEqual(subject.condition, {"dim1": "val3", "dim2": "val4", "dim3": "val6"});

        subjectNumber = 22;
        subject = new Subject(subjectNumber, dimensions);
        deepEqual(subject.condition, {"dim1": "val1", "dim2": "val5", "dim3": "val6"});

        subjectNumber = 23;
        subject = new Subject(subjectNumber, dimensions);
        deepEqual(subject.condition, {"dim1": "val2", "dim2": "val5", "dim3": "val6"});

        subjectNumber = 24;
        subject = new Subject(subjectNumber, dimensions);
        deepEqual(subject.condition, {"dim1": "val3", "dim2": "val5", "dim3": "val6"});

        subjectNumber = 25;
        subject = new Subject(subjectNumber, dimensions);
        deepEqual(subject.condition, {"dim1": "val1", "dim2": "val4", "dim3": "val7"});

        subjectNumber = 26;
        subject = new Subject(subjectNumber, dimensions);
        deepEqual(subject.condition, {"dim1": "val2", "dim2": "val4", "dim3": "val7"});

        subjectNumber = 27;
        subject = new Subject(subjectNumber, dimensions);
        deepEqual(subject.condition, {"dim1": "val3", "dim2": "val4", "dim3": "val7"});

        subjectNumber = 28;
        subject = new Subject(subjectNumber, dimensions);
        deepEqual(subject.condition, {"dim1": "val1", "dim2": "val5", "dim3": "val7"});

        subjectNumber = 29;
        subject = new Subject(subjectNumber, dimensions);
        deepEqual(subject.condition, {"dim1": "val2", "dim2": "val5", "dim3": "val7"});

        subjectNumber = 30;
        subject = new Subject(subjectNumber, dimensions);
        deepEqual(subject.condition, {"dim1": "val3", "dim2": "val5", "dim3": "val7"});

        subjectNumber = 31;
        subject = new Subject(subjectNumber, dimensions);
        deepEqual(subject.condition, {"dim1": "val1", "dim2": "val4", "dim3": "val8"});

        subjectNumber = 32;
        subject = new Subject(subjectNumber, dimensions);
        deepEqual(subject.condition, {"dim1": "val2", "dim2": "val4", "dim3": "val8"});

        subjectNumber = 33;
        subject = new Subject(subjectNumber, dimensions);
        deepEqual(subject.condition, {"dim1": "val3", "dim2": "val4", "dim3": "val8"});

        subjectNumber = 34;
        subject = new Subject(subjectNumber, dimensions);
        deepEqual(subject.condition, {"dim1": "val1", "dim2": "val5", "dim3": "val8"});

        subjectNumber = 35;
        subject = new Subject(subjectNumber, dimensions);
        deepEqual(subject.condition, {"dim1": "val2", "dim2": "val5", "dim3": "val8"});

        subjectNumber = 36;
        subject = new Subject(subjectNumber, dimensions);
        deepEqual(subject.condition, {"dim1": "val3", "dim2": "val5", "dim3": "val8"});
    });
});
