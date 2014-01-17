define (["src/skinner/core/page"], function (Page) {
	"use strict";

    // ## Description
    // A TextPage displays textual content.

    // ## Options
    // - **title:** The title for the text page
    // - **content:** The content for the text page. The content can be inline as in Example 1,
    // or from a text file as in Example 2. The text file can contain template
    // variables using the `{{ name }}` syntax.

    // ## Examples

    // ### 1) Showing a text content
    // ```
    // - type: text
    //   title: Passage 1
    //   content: Here is a sample passage.
    // ```

    // ### 2) Showing a text content from a file.
    // This example will load the content from the file `passage1.txt` in the `content` directory.
    // ```
    // - type: text
    //   title: Passage 1
    //   content file: passage1.txt
    // ```

    var TextPage = Page.extend({
        init: function (data, task) {
            this._super(data, task);
        },
    });

    return TextPage;
});
