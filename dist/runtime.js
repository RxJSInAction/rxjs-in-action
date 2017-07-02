(function (rxjs,$,CodeMirror) {
'use strict';

$ = $ && 'default' in $ ? $['default'] : $;
CodeMirror = CodeMirror && 'default' in CodeMirror ? CodeMirror['default'] : CodeMirror;

/**
 *  RxJS in action
 *  Chapter #
 *  @author Paul Daniels
 *  @author Luis Atencio
 */
function getUrlParams(url) {
  var match = void 0,
      pl = /\+/g,
      // Regex for replacing addition symbol with a space
  search = /([^&=]+)=?([^&]*)/g,
      decode = function decode(s) {
    return decodeURIComponent(s.replace(pl, " "));
  },
      query = url.substring(1);

  var urlParams = {};
  while (match = search.exec(query)) {
    urlParams[decode(match[1])] = decode(match[2]);
  }return urlParams;
}

/**
 *  RxJS in action
 *  Chapter #
 *  @author Paul Daniels
 *  @author Luis Atencio
 */
function buildTag(tagName, options) {
  var transform = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function (x) {
    return x;
  };

  return function (source) {
    var attrs = [];
    for (var k in options) {
      options.hasOwnProperty(k) && attrs.push(k + '="' + options[k] + '"');
    }

    return '<' + tagName + ' ' + attrs.join(' ') + '>' + transform(source) + '</' + tagName + '>';
  };
}

/**
 *  RxJS in action
 *  Chapter #
 *  @author Paul Daniels
 *  @author Luis Atencio
 */
var defaultHtml = "\n<!DOCTYPE html>\n<html>\n  <head>\n    <meta charset=\"utf-8\">\n    <meta name=\"viewport\" content=\"width=device-width\">\n    <title>RxJS in Action</title>\n  </head>\n  <body></body>\n</html>\n".trim();

/**
 *  RxJS in action
 *  Chapter #
 *  @author Paul Daniels
 *  @author Luis Atencio
 */
function consoleProxy() {
  var console = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : window.console;

  if (console && console.log) {
    //Set up iframe for redirection
    var iframe = parent.document.getElementById('console');
    var consoleFrame = iframe.contentWindow || iframe.contentDocument;
    if (consoleFrame.document) consoleFrame = consoleFrame.document;
    var write = function (frame) {
      return function (content) {
        frame.open();
        frame.write(content);
        frame.close();
      };
    }(consoleFrame);
    write(''); // clear contents on change

    window.console = {
      log: function log(val) {
        var previous = consoleFrame.body.innerHTML || '';
        write(previous.trim() + "<br />" + val);
      },
      warn: function warn(val) {
        var previous = consoleFrame.body.innerHTML || '';
        write(previous.trim() + "<br />" + val);
      },
      error: function error(val) {
        var previous = consoleFrame.body.innerHTML || '';
        write(previous.trim() + "<br />" + val);
      }
    };
  }
}

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();



























var slicedToArray = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();

/**
 *  RxJS in action
 *  Chapter #
 *  @author Paul Daniels
 *  @author Luis Atencio
 */

var CookieManager = function () {
  function CookieManager() {
    classCallCheck(this, CookieManager);

    this._changed = new rxjs.Subject();
  }

  createClass(CookieManager, [{
    key: '_notifyChanged',
    value: function _notifyChanged(key) {
      this._changed.next(key);
    }
  }, {
    key: 'setCookie',
    value: function setCookie(key, value) {
      var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var path = opts.path,
          expires = opts.expires;

      var cookie = [key + '=' + value];
      path && cookie.push('path=' + path);
      expires && cookie.push('expires=' + expires);
      document.cookie = cookie.join('; ');
      this._notifyChanged(key);
    }
  }, {
    key: 'getCookie',
    value: function getCookie(key) {
      return rxjs.Observable.defer(function () {
        var cookies = document.cookie;
        var cookieStart = cookies.indexOf(key);

        if (cookieStart < 0) return rxjs.Observable.empty();else {
          var valueStart = cookies.indexOf('=', cookieStart) + 1;
          var cookieEnd = cookies.indexOf(';', cookieStart);
          cookieEnd = cookieEnd < 0 ? cookies.length : cookieEnd;

          return rxjs.Observable.of(cookies.substring(valueStart, cookieEnd));
        }
      });
    }
  }, {
    key: 'watchCookie',
    value: function watchCookie(key) {
      return this._changed.asObservable().filter(function (x) {
        return key === x;
      }).startWith(key).flatMapTo(this.getCookie(key));
    }
  }], [{
    key: 'removeCookie',
    value: function removeCookie(key) {
      document.cookie = key + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }
  }]);
  return CookieManager;
}();

var cookies = new CookieManager();

/**
 *  RxJS in action
 *  Chapter #
 *  @author Paul Daniels
 *  @author Luis Atencio
 */
cookies.watchCookie('example').subscribe(function (x) {
  return console.log('Cookie is ' + x);
});

cookies.setCookie('example', '7.2');

cookies.setCookie('example', '7.3');

cookies.setCookie('example', '8.1');

rxjs.Observable.of('css', 'html', 'javascript').flatMap(function (tag) {
  return rxjs.Observable.fromEvent(document.getElementById('show-' + tag), 'click');
}, function (tag, value) {
  return { tag: tag, el: value.target };
}).subscribe(function (_ref) {
  var el = _ref.el,
      tag = _ref.tag;
  var classList = el.classList,
      id = el.id;


  classList.toggle('btn-primary');
  classList.toggle('btn-default');
  classList.toggle('active');

  document.getElementById(tag + '-container').classList.toggle('hidden');
});

// Builds a new code editor on the page
var jsEditor = CodeMirror.fromTextArea(document.getElementById('javascript'), {
  mode: "javascript",
  theme: 'dracula',
  lineNumbers: true,
  readOnly: false,
  value: 'Test'
});

var htmlEditor = CodeMirror.fromTextArea(document.getElementById('html'), {
  mode: 'htmlmixed',
  theme: 'dracula',
  lineNumbers: true
});

htmlEditor.setValue(defaultHtml);

var cssEditor = CodeMirror.fromTextArea(document.getElementById('css'), {
  mode: 'css',
  theme: 'dracula',
  lineNumbers: true
});

var exampleSelector = document.getElementById('example-change');

// Url params always take precedence over the cookies
var urlParams = getUrlParams(window.location.search);

rxjs.Observable.from(exampleSelector.getElementsByTagName('option')).filter(function (_ref2) {
  var value = _ref2.value;
  return value === urlParams['example'];
}).take(1).subscribe(function (x) {
  return x.selected = 'selected';
});

var startWithIfPresent = function startWithIfPresent(url, key) {
  return function (source) {
    return url[key] ? source.startWith(url[key]) : source;
  };
};

rxjs.Observable.fromEvent(exampleSelector, 'change', function (e) {
  return e.target.value;
}).let(startWithIfPresent(urlParams, 'example')).map(function (e) {
  return e.split('.');
}) // Split the chapter and id
.filter(function (value) {
  return value.length === 2;
}) // Sanity check
.flatMap(function (_ref3) {
  var _ref4 = slicedToArray(_ref3, 2),
      chapter = _ref4[0],
      id = _ref4[1];

  return $.getJSON('/rest/api/example/' + chapter + '/' + id);
}).subscribe(function (_ref5) {
  var js = _ref5.js,
      css = _ref5.css,
      html = _ref5.html;

  js && jsEditor.setValue(js);
  css && cssEditor.setValue(css);
  html && htmlEditor.setValue(html);
});

var onCodeChange = function onCodeChange(tag) {
  return function () {
    console.log(tag, '[UPDATE]: CODE CHANGE', Date.now());
  };
};

var html$ = rxjs.Observable.fromEvent(htmlEditor.doc, 'change', function (instance, change) {
  return instance.getValue();
}).do(onCodeChange('html')).startWith(defaultHtml).debounceTime(1000);

// Babel compiler options
var compile$ = rxjs.Observable.of({
  presets: ['es2015'],
  // TODO Compile this separately and load independently
  plugins: [["transform-object-rest-spread", { "useBuiltIns": true }]]
});

var js$ = rxjs.Observable.fromEvent(jsEditor, 'change', function (instance, change) {
  return instance.getValue();
}).do(onCodeChange('js')).startWith('console.log("Welcome to RxJS in Action Code!")').debounceTime(1000).do(function () {
  return console.log('Compiling...');
}).combineLatest(compile$, function (code, opts) {
  try {
    return Babel.transform(code, opts).code;
  } catch (e) {
    console.warn('Problem compiling the code', e);
    //FIXME Probably should not be returning code that babel doesn't even know how to compile
    return code;
  }
}).map(buildTag('script', { type: 'application/javascript' }, function (code) {
  //Naive way of preventing this from polluting the global namespace
  return ';(' + consoleProxy.toString().trim() + ')();\n      (function wrapper() {\n            ' + code + '\n\n      })()\n';
}));
// .map(code =>
//   buildTag('script', {
//     type: 'application/javascript',
//     src: 'babel-polyfill/dist/polyfill.min.js'
//   })(' ') + '\n' + code
// );

var css$ = rxjs.Observable.fromEvent(cssEditor, 'change', function (instance, change) {
  return instance.getValue();
}).do(onCodeChange('css')).startWith('').debounceTime(1000).map(buildTag('style'));

var update$ = js$.combineLatest(html$, css$, function (javascript, html, css) {
  return { html: html, javascript: javascript, css: css };
});

var runtime$ = update$.debounceTime(1000).do(onCodeChange('combined')).map(function (contents) {
  var javascript = contents.javascript,
      html = contents.html,
      css = contents.css;

  var builder = [];

  try {
    var endOfHead = html.indexOf('</head>');
    var endOfBody = html.indexOf('</body>');

    var beforeCss = html.substring(0, endOfHead);
    var afterCss = html.substring(endOfHead, endOfBody);
    var afterJs = html.substring(endOfBody);

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

/**
 *  RxJS in action
 *  Chapter #
 *  @author Paul Daniels
 *  @author Luis Atencio
 */
// Get the contents of the iframe
var doc = $('#output').contents();

runtime$.subscribe(function (content) {
  // Rewrites the contents of the iframe
  // Prevents carry over from previous examples
  doc[0].open();
  doc[0].write(content);
  doc[0].close();
}, function (err) {
  console.warn("Something went wrong! Please refresh the page.", err);
});

}(Rx,$,CodeMirror));
//# sourceMappingURL=runtime.js.map
