
# TODO

## For Triangle

### Triangle Specific
- [ ] Fill out instructions
- [ ] Example triangle
- [ ] Remove continue buttons from passages and add 9 min timer
- [ ] Play with the triangle color palette
- [ ] scoring for triangle

### Core
- [ ] Figure out how finishing works
- [ ] feedback: final score
- [ ] Choosing a condition

## Skinner Core

- [ ] Distractor page cleanup
- [ ] write docs
- [ ] % and %% variables should be available in templates?
- [ ] Notes about modified yaml parser to take out inline {} mapping.
- [ ] full support for experiment.yaml settings for reporting each thing and a global on/off switch per pagede2

## Stretch Goals
- [ ] Interrupters
- [ ] Flasher
- [ ] Pick statement: random from list.

## Postponed

- [ ] pretty animations?
- [ ] Create helper apps (tri start app, tri start package)
- [ ] Allow specifying module namespace in yaml
- [ ] pressing enter submits questions
- [ ] better way to load handlebars helpers?
- [ ] use npm for all dependencies
- [ ] set up package.json to have a test script that verifies code
- [ ] use an amd build of handlebars
- [ ] Create requirejs-yaml-plugin

## Finished

- [x] Make page background white box
- [x] Semantic UI everywhere
- [x] Define conditions
- [x] Program how conditions work
- [x] Record subject's actions
- [x] Retina support for triangle
- [x] Correct module loading
- [x] Condition options ({{}} in yaml, {{}} in txt files, yaml ifs)
- [x] Add distr to require map
- [x] Add sections concept to experiment
- [x] Move layouts into package folders
- [x] Modified YAML parser to support no {} style dictionaries
- [x] put text focus in cued recall box
- [x] Make it so question classes don't have to implement id and correctAnswer parts
- [x] wait for document ready via requirejs
- [x] switch to _package.yaml
- [x] only load package layout at startup
- [x] skinner.js to loader.js
- [x] make loadmoduledefinitions remember its state
- [x] load css for modules
- [x] turn off reporting for an individual tests
- [x] Multiple choice option: Show A/B/C/etc
- [x] Test questions should use handlebars
- [x] Parser for statements like repeat across and show if/unless
- [x] spell check for cuedrecall
- [x] Case insensitive answer scoring
- [x] Repeat task n times
- [x] jslint it all
- [x] EditorConfig
- [x] pages should use inheritance
- [x] lib folder for vendor stuff
- [x] report spelling distance option
- [x] keyboard for next/prev
- [x] move css into new folders
- [x] Convert to CSV
- [x] consider moving to lodash
- [x] PathFind has 3 copies. make one.
- [x] use handlebars for resolving dimensions and data
- [x] rename helpers.js
- [x] Sounds
- [x] Make all pages support Time, and figure out a clean way to do it with test and countdown pages
- [x] different question types for a question set
- [x] Figure out r.js and how to compile all of this into a single file
- [x] Task/Page ids for reporting, maybe add id() function to classes, and then reporting uses that
- [x] Add tests
- [x] trim whitespace from answers in questions.yaml
