/**
 *  RxJS in action
 *  Chapter #
 *  @author Paul Daniels
 *  @author Luis Atencio
 */
'use strict';
(function(content$) {

  // Get the contents of the iframe
  var	doc = $('#output').contents();

  content$.subscribe(
    content => {
      // Rewrites the contents of the iframe
      // Prevents carry over from previous examples
      doc[0].open();      
      doc[0].write(content);
      doc[0].close();
    },
    err => console.log("Something went wrong! Please refresh the page."))
})(runtime$);
