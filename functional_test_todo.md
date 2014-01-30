# Functional Tests

Before an experiment, close the page, should work
During an experiment, close the page, it should warn
After an experiment, close the page, it should work
CSV Export data
Use html in title and content

Unit tests loader.js

Page with buttons, and page wihtout buttons, ensure they show/dontshow

Page with timer
Page with next button and timer
Page with next keyboard shortcuts
Page with next keyboard shortcuts, and then next page doens't have it, so you shouldn't nav when you press key (via key, next button, or timer)

Page with shown timer (true, false, and with 10 sec left)

Finish, typing 'results' shows results
Finish, intermediate "uploading", actual server upload with CSV, then confirm that page says finsihed

Distractor shows tetris
Countdown shows visible countdown

Test Page
---------
multiple choice questions shown
    - show answer labels only if setting is on
cued recall shown
    - focus is put in text box
    - spelling distance is reported
    - spelling distance not reported if disabled
free response shown
scale shown
mixed tests work
no timer tests
timed tests
1 question tests
correct answer/ no correct answer/ multiple correct answers
question id assignment is correct
randomizing questions, and id assignment is consistent
question reporting reports the length of time to answer
require correct answer doesn't let you move on and shows the ui message, (ensure this also doesnt screw up the question time counter for reporting how long it takes them to answer)
(in)correct answer plays correct sound or no sound if not turned on
reporting of test results only if report results is on
all report fields work correctly
Show test score shows a page at the end with correct scores
Correct scoring is working


Custom Page subclasses which exercise all the page overrides




DONE
Use {{}} in title and content (Tests resolver)
Use {{indexed }} in title and content (Tests indexed resolver)
Test show statment, see if it ignores the page. showif/unless is/isnot
