/**
 *  RxJS in action
 *  Chapter #
 *  @author Paul Daniels
 *  @author Luis Atencio
 */
'use strict';

import {getUrlParams} from './utils/url';
import {buildTag} from "./utils/tag";
import {defaultHtml} from "./initial";
import {consoleProxy} from "./console";
import {cookies} from './utils/cookies';
import { Observable } from 'rxjs';
import $ from 'jquery';
import CodeMirror from 'codemirror';

cookies.watchCookie('example')
  .subscribe(x => console.log(`Cookie is ${x}`));

cookies.setCookie('example', '7.2');

cookies.setCookie('example', '7.3');

cookies.setCookie('example', '8.1');

Observable.of('css', 'html', 'javascript')
  .flatMap(
    tag => Observable.fromEvent(document.getElementById('show-' + tag), 'click'),
    (tag, value) => ({tag, el: value.target}))
  .subscribe(({el, tag}) => {
    const {classList, id} = el;

    classList.toggle('btn-primary');
    classList.toggle('btn-default');
    classList.toggle('active');

    document.getElementById(tag + '-container').classList.toggle('hidden');
  });

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

const exampleSelector = document.getElementById('example-change');

// Url params always take precedence over the cookies
const urlParams = getUrlParams(window.location.search);

Observable.from(exampleSelector.getElementsByTagName('option'))
  .filter(({value}) => value === urlParams['example'])
  .take(1)
  .subscribe(x => x.selected = 'selected');

const startWithIfPresent =
  (url, key) =>
    source =>
      url[key] ? source.startWith(url[key]) : source;

Observable.fromEvent(
  exampleSelector,
  'change',
  (e) => e.target.value
)
  .let(startWithIfPresent(urlParams, 'example'))
  .map((e) => e.split('.')) // Split the chapter and id
  .filter(value => value.length === 2) // Sanity check
  .flatMap(([chapter, id]) => {
    return $.getJSON(`/rest/api/example/${chapter}/${id}`);
  })
  .subscribe(({js, css, html}) => {
    js && jsEditor.setValue(js);
    css && cssEditor.setValue(css);
    html && htmlEditor.setValue(html);
  });

const onCodeChange = (tag) => () => {
  console.log(tag, '[UPDATE]: CODE CHANGE', Date.now());
};

const html$ = Observable.fromEvent(htmlEditor.doc, 'change',
  (instance, change) => instance.getValue())
  .do(onCodeChange('html'))
  .startWith(defaultHtml)
  .debounceTime(1000);

// Babel compiler options
const compile$ = Observable.of({
  presets: ['es2015'],
  // TODO Compile this separately and load independently
  plugins: [
    ["transform-object-rest-spread", {"useBuiltIns": true}]
  ]
});

const js$ = Observable.fromEvent(jsEditor, 'change',
  (instance, change) => instance.getValue())
  .do(onCodeChange('js'))
  .startWith('console.log("Welcome to RxJS in Action Code!")')
  .debounceTime(1000)
  .do(() => console.log('Compiling...'))
  .combineLatest(compile$, (code, opts) => {
    try {
      return Babel.transform(code, opts).code
    } catch (e) {
      console.warn('Problem compiling the code', e);
      //FIXME Probably should not be returning code that babel doesn't even know how to compile
      return code;
    }
  })
  .map(buildTag('script', {type: 'application/javascript'}, function (code) {
    //Naive way of preventing this from polluting the global namespace
    return `;(${consoleProxy.toString().trim()})();
      (function wrapper() {
            ${code}\n
      })()\n`;
  }));
  // .map(code =>
  //   buildTag('script', {
  //     type: 'application/javascript',
  //     src: 'babel-polyfill/dist/polyfill.min.js'
  //   })(' ') + '\n' + code
  // );

const css$ = Observable.fromEvent(cssEditor, 'change',
  (instance, change) => instance.getValue())
  .do(onCodeChange('css'))
  .startWith('')
  .debounceTime(1000)
  .map(buildTag('style'));

const update$ = js$.combineLatest(html$, css$,
  (javascript, html, css) => ({html, javascript, css}));

export const runtime$ = update$
  .debounceTime(1000)
  .do(onCodeChange('combined'))
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

      builder.push(javascript);
      builder.push(afterJs);
    } catch (e) {
      console.log('Could not render content! ', e);
    }

    return builder.join('\n');
  });
