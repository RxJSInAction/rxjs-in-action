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

  router.get('/example/:chapter/:id', function(req, res, next) {
    const chapter = req.params.chapter;
    const id = req.params.id;

    const jsPath = buildFilePath(chapter, id, '.js');
    const cssPath = buildFilePath(chapter, id, '.css');
    const htmlPath = buildFilePath(chapter, id, '.html');

    Rx.Observable.forkJoin(
      observableRead(jsPath, 'utf8').catch(err => Rx.Observable.of('')),
      observableRead(cssPath, 'utf8').catch(err => Rx.Observable.of('')),
      observableRead(htmlPath, 'utf8').catch(err => defaultHtml),
      (js, css, html) => ({js, css, html})
    )
      .subscribe(contents => {
        res.end(JSON.stringify(contents));
      }, err => console.error(err));
  })

});

function buildFilePath(chapter, id, ext) {
  return `${__dirname}/examples/${chapter}/${id}/${chapter}_${id}${ext}`;
}
