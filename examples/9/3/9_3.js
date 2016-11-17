/**
 *  RxJS in Action
 *  Listing 9.3
 *  @author Paul Daniels
 *  @author Luis Atencio
 */
mocha.setup({ ui: 'bdd', checkLeaks: true});

const expect = chai.expect;
const assert = chai.assert;

chai.use(chaiAsPromised);
const should = chai.should();

console.log('Ensure CORS is enabled in your browser. ' +
  'The chai-as-promised bundle is built using browserify and installed locally in this app');

describe('Ajax with promises', function () {
	it('Should fetch Wikipedia pages for search term "reactive programming"', function () {

     const searchTerm = 'reactive+programming';
     const url = `https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&utf8=1&srsearch=${searchTerm}`;

     return ajax(url)
         .should.be.fulfilled
         .should.eventually.have.property('query')
           .with.property('search').with.length(10);
   });
});


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


mocha.run();
