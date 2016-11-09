/**
 *  RxJS in action
 *  Chapter #
 *  @author Paul Daniels
 *  @author Luis Atencio
 */
'use strict';
const runtime$ = (function() {

  const defaultHtml =
`
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width">
    <title>RxJS in Action</title>
  </head>
  <body></body>
</html>
`.trim();

  // Builds a new code editor on the page
  const jsEditor = CodeMirror.fromTextArea(document.getElementById('javascript'), {
    mode: "javascript",
    theme: 'dracula',
    lineNumbers: true,
    readOnly: false,
    value: 'Test'
  });

  const htmlEditor = CodeMirror.fromTextArea(document.getElementById('html'), {
    mode: 'htmlmixed',
    theme: 'dracula',
    lineNumbers: true,
  });

  htmlEditor.setValue(defaultHtml);

  const cssEditor = CodeMirror.fromTextArea(document.getElementById('css'), {
    mode: 'css',
    theme: 'dracula',
    lineNumbers: true
  });

  const html$ = Rx.Observable.fromEvent(htmlEditor.doc, 'change',
    (instance, change) => instance.getValue())
    .startWith(defaultHtml);

  function buildTag(tagName, options, transform = x => x) {
    return (source) => {
      const attrs = [];
      for (let k in options) {
        options.hasOwnProperty(k) && attrs.push(`${k}=${options[k]}`);
      }

      return `<${tagName} ${attrs.join(' ')}>${transform(source)}</${tagName}>`;
    };
  }

  Rx.Observable.fromEvent(document.getElementById('example-change'), 'change')
    .map(e => e.target.value.split('.')) // Split the chapter and id
    .filter(value => value.length === 2) // Sanity check
    .flatMap(([chapter, id]) => {
      return $.getJSON(`/rest/api/example/${chapter}/${id}`);
    })
    .subscribe(({js, css, html}) => {
      js && jsEditor.setValue(js);
      css && cssEditor.setValue(css);
      html && htmlEditor.setValue(html);
    });

  const js$ = Rx.Observable.fromEvent(jsEditor, 'change',
    (instance, change) => instance.getValue())
    .startWith('')
    .debounceTime(3000)
    .map(buildTag('script', {type: 'application/javascript'}, function(code) {
      // console redirect
      const consolePoly =
    `
    if(console && console.log) {
        //Set up iframe for redirection
        let original = window.console;
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
          error: (err) => {
            let previous = consoleFrame.body.innerHTML || '';
            write(previous.trim() + "<br />" + val);
          }
        };
    }

    `.trim();
      return `${consolePoly}(function wrapper() {${code}})()`;
    }));

  const css$ = Rx.Observable.fromEvent(cssEditor, 'change',
    (instance, change) => instance.getValue())
    .startWith('')
    .map(buildTag('style'));

  const update$ = Rx.Observable.combineLatest(html$, js$, css$,
    (html, javascript, css) => ({html, javascript, css}));



  return update$
    .map(contents => {
      const {javascript, html, css} = contents;
      let builder = [];

      try {
        const endOfHead = html.indexOf('</head>');
        const endOfBody = html.indexOf('</body>');

        const beforeCss = html.substring(0, endOfHead);
        const afterCss = html.substring(endOfHead, endOfBody);
        const afterJs = html.substring(endOfBody);

        builder.push(beforeCss);
        builder.push(css);
        builder.push(afterCss);
        //Naive way of preventing this from polluting the global namespace
        //TODO: add methods to allow us to proxy the console or alerts.
        builder.push(javascript);
        builder.push(afterJs);
      } catch (e) {
        console.log('Could not render content! ', e);
      }

      return builder.join('\n');
    })
})();
