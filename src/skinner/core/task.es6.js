import $ from 'jquery';
import _ from 'lodash';
import Loader from './loader.js';
import Resolver from './resolver.js';
import ShowStatementParser from 'peg!src/skinner/core/parser/showStatement';

export default class Task {
  constructor(name, trial, pages, subject, additionalDimensionData, context) {
    super();

    this.name = name;
    this.trial = trial;
    this.pages = pages;
    this.subject = subject;
    this.additionalDimensionData = additionalDimensionData;
    this.context = context;
  }

  id() {
      const contextString = (_.isUndefined(this.context)) ? "" : "(" + this.context + ")";
      return this.name + contextString;
  }

  begin() {
      this.currentPageIndex = 0;
      this.showPage();
  }

  showPage() {
      if (this.pages.length <= this.currentPageIndex) {
          return this.moveToNextStep();
      }

      const pageData = Resolver.resolveData(this.pages[this.currentPageIndex], this.subject, this.additionalDimensionData, this.context);
      const showStatement = pageData.show;
      if (showStatement) {
          const showPage = ShowStatementParser.parse(showStatement);
          if (!showPage) {
              console.log("Ignoring this page.");
              this.nextPage();
              return;
          }
      }

      Loader.loadModule(pageData.type, "page")
        .then(Page => {
          this.currentPage = new Page(pageData, this);
          this.currentPage.show();
        });
  }

  next() {
      this.currentPage.next();
  }

  nextPage() {
      this.currentPageIndex++;
      this.showPage();
  }

  moveToNextStep() {
      this.trial.nextStep();
  }
}
