/**
 *  RxJS in Action
 *  Listing 4.10 + 4.11
 *  @author Paul Daniels
 *  @author Luis Atencio
 */
let testData = [
	  'github.com/Reactive-Extensions/RxJS',
	  'github.com/ReactiveX/RxJS',
	  'xgrommx.github.io/rx-book',
   'reactivex.io',
	  'egghead.io/technologies/rx',
	  'rxmarbles.com',
	  'https://www.manning.com/books/rxjs-in-action'
	];

const searchBox = document.querySelector('#search'); //-> <input>
const results = document.querySelector('#results');  //-> <ul>

const copyToArray = arrayLike => Array.prototype.slice.call(arrayLike);

function debounce(fn, time) {
  let timeoutId;
  return function() {
    const args = [fn, time]
        .concat(copyToArray(arguments)); //#C
    clearTimeout(timeoutId);  //#D
    timeoutId = window.setTimeout.apply(window, args); //#E
  }
}

function sendRequest(query) {
   console.log('querying...');
   let searchResults = [];
   if(query && query.length > 0) {
      for(result of testData) {
         if(result.startsWith(query)) {
             searchResults.push(result);
         }
      }
   }
   if(searchResults.length === 0) {
       clearResults(results);
   }
   else {
      for(let result of searchResults) {
         appendResult(result, results);
      }
   }
}

let debouncedRequest = debounce(sendRequest, 1000);

searchBox.addEventListener('keyup', function (event) {
  debouncedRequest(event.target.value);
});


function clearResults(container) {
  while(container.childElementCount > 0) {
     container.removeChild(container.firstChild);
  }
}

function appendResult(result, container) {
    let li = document.createElement('li');
    let text = document.createTextNode(result);
    li.appendChild(text);
    container.appendChild(li);
}
