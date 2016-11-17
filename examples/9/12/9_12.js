/**
 *  RxJS in Action
 *  Listing 9.12
 *  @author Paul Daniels
 *  @author Luis Atencio
 */
mocha.setup({ ui: 'bdd', checkLeaks: true});

const expect = chai.expect;
const assert = chai.assert;

const notEmpty = input => !!input && input.trim().length > 0;

function assertDeepEqual(actual, expected) {
  expect(actual).to.deep.equal(expected);
}

function frames(n = 1, unit = '-') {
	return (n === 1) ? unit :
	   unit + frames(n - 1, unit);
}

describe('Search component', function () {
	const results_1 = [
        'rxmarbles.com',
        'https://www.manning.com/books/rxjs-in-action'];

	const results_2 =
         ['https://www.manning.com/books/rxjs-in-action'];

	const searchFn = term => {
	   let r = [];
	   if(term.toLowerCase() === 'rx') {
       r = results_1;
	   }
	   else if (term.toLowerCase() === 'rxjs') {
       r =  results_2;
	   }
	   return Rx.Observable.of(r);
	};

    it('Should test the search stream with debouncing', function () {

       let searchTerms = {
	      a: 'r',
	      b: 'rx',
	      c: 'rxjs',
	   };

	   let scheduler = new Rx.TestScheduler(assertDeepEqual);
	   let source = scheduler.createHotObservable(
            '-(ab)-' + frames(50) +'-c|', searchTerms);

	   let r = search$(source, searchFn, '', scheduler);

        let expected = frames(50) + '-f------(s|';

   	   scheduler.expectObservable(r).toBe(expected,
		{
   		   'f': results_1,
    		   's': results_2
   		});

        scheduler.flush();
    });
});

const search$ = (source$, fetchResult$, url = '', scheduler = null) =>
	source$
	  .debounceTime(500, scheduler)
	  .filter(notEmpty)
	  .do(term => console.log(`Searching with term ${term}`))
	  .map(query => url + query)
	  .switchMap(fetchResult$);

mocha.run();
