/**
 *  RxJS in Action
 *  Listing 9.7
 *  @author Paul Daniels
 *  @author Luis Atencio
 */
mocha.setup({ ui: 'bdd', checkLeaks: true});

const expect = chai.expect;
const assert = chai.assert;

console.log('Enable CORS in your browser');

it('Should fetch Wikipedia pages for search term "reactive programming" using an observable + promise',
function (done) {
   const searchTerm = 'reactive+programming';
   const url = `https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&utf8=1&srsearch=${searchTerm}`;

   const testFn = query => Rx.Observable.fromPromise(ajax(query))
      .subscribe(data => {
            expect(data).to.have.property('query')
              .with.property('search')
              .with.length(10);
           }, null, done);
   testFn(url);
});

mocha.run();

const ajax = url => new Promise((resolve, reject) => {
    let req = new XMLHttpRequest();
    //req.responseType = 'json';
    req.open('GET', url);
    req.onload = () => {
      if(req.status == 200) {
        let data = JSON.parse(req.responseText);
        resolve(data);
      }
      else {
        reject(new Error(req.statusText));
      }
    };
    req.onerror = () => {
      reject(new Error('IO Error'));
    };
    req.send();
  });
