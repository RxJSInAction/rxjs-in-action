/**
 *  RxJS in action
 *  Chapter #
 *  @author Paul Daniels
 *  @author Luis Atencio
 */
'use strict';
const connectRoute = require('connect-route');

/*
*
* Add all backend apis here
*
* */
const fs = require('fs');
const Rx = require('rxjs');

const observableRead = Rx.Observable.bindNodeCallback(fs.readFile);

module.exports = connectRoute(function(router) {

  const defaultHtml = observableRead(__dirname + '/examples/default/default.html', 'utf8');

  /**
   * Example of how to set up a new route
   */
  router.post('/echo', function(req, res, next) {
    res.end(JSON.stringify(req.body));
  });

  /**
   * Retrieves a specific listing by chapter and number
   */
  router.get('/example/:chapter/:id', function(req, res, next) {
    const chapter = req.params.chapter;
    const id = req.params.id;
    const basePath = buildFilePath(chapter, id);


    const jsPath = basePath('.js');
    const cssPath = basePath('.css');
    const htmlPath = basePath('.html');

    const defaultErrorHandler = (defaultValue = Rx.Observable.of('')) => (source) =>
        source.catch(err => defaultValue);

    Rx.Observable.forkJoin(
      observableRead(jsPath, 'utf8').let(defaultErrorHandler()),
      observableRead(cssPath, 'utf8').let(defaultErrorHandler()),
      observableRead(htmlPath, 'utf8').let(defaultErrorHandler(defaultHtml)),
      (js, css, html) => ({js, css, html})
    )
      .subscribe(contents => {
        res.end(JSON.stringify(contents));
      }, err => console.error(err));
  })

});

function buildFilePath(chapter, id) {
  return (ext) => `${__dirname}/examples/${chapter}/${id}/${chapter}_${id}${ext}`;
}
