/**
 *  RxJS in Action
 *  Listing 5.3
 *  Note: make sure you have turned on CORS sharing in your browser so that you can make
 *  cross-site requests
 *  @author Paul Daniels
 *  @author Luis Atencio
 */
const searchBox = document.querySelector('#search'); //-> <input>
const results = document.querySelector('#results');  //-> <ul>
const count = document.querySelector('#count');  //-> <ul>

const notEmpty = input => !!input && input.trim().length > 0;

const URL = 'https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&utf8=1&srsearch=';

const search$ = Rx.Observable.fromEvent(searchBox, 'keyup')
  .pluck('target','value')
  .debounceTime(500)
  .filter(notEmpty)
  .do(term => console.log(`Searching with term ${term}`))
  .map(query => URL + query)
  .mergeMap(query => Rx.Observable.ajax(query)
		.pluck('response', 'query', 'search')
		.defaultIfEmpty([]))
	.mergeMap(R.map(R.prop('title')))
  .subscribe(arr => {
    count.innerHTML = `${arr.length} results`;
    if(arr.length === 0) {
      clearResults(results);
    }
    else {
      appendResults(arr, results);
    }
  });


function clearResults(container) {
  while(container.childElementCount > 0) {
     container.removeChild(container.firstChild);
  }
}

function appendResults(result, container) {
    let li = document.createElement('li');
    let text = document.createTextNode(result);
    li.appendChild(text);
    container.appendChild(li);
}
