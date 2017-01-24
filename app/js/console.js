/**
 *  RxJS in action
 *  Chapter #
 *  @author Paul Daniels
 *  @author Luis Atencio
 */
export function consoleProxy(console = window.console) {
  if(console && console.log) {
    //Set up iframe for redirection
    let iframe = parent.document.getElementById('console');
    let consoleFrame = iframe.contentWindow || iframe.contentDocument;
    if (consoleFrame.document) consoleFrame = consoleFrame.document;
    let write = (frame => {
      return content => {
        frame.open();
        frame.write(content);
        frame.close();
      };
    })(consoleFrame);
    write(''); // clear contents on change

    window.console = {
      log: (val) => {
        let previous = consoleFrame.body.innerHTML || '';
        write(previous.trim() + "<br />" + val);
      },
      warn: (val) => {
        let previous = consoleFrame.body.innerHTML || '';
        write(previous.trim() + "<br />" + val);
      },
      error: (val) => {
        let previous = consoleFrame.body.innerHTML || '';
        write(previous.trim() + "<br />" + val);
      }
    };
  }
}