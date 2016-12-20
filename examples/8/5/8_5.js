/**
 *  RxJS in Action
 *  Listing 8.5
 *  @author Paul Daniels
 *  @author Luis Atencio
 */
 const ajax = url => new Promise((resolve, reject) => {
     let req = new XMLHttpRequest();
     req.open('GET', url);
     req.onload = function() {
       if(req.status == 200) {
         let data = req.responseText;
         resolve(data);
       }
       else {
         reject(new Error(req.statusText));
       }
     };
     req.onerror = function () {
       reject(new Error('IO Error'));
     };
     req.send();
   });


const csv = str => str.split(/,\s*/); //#A
const cleanStr = str => str.replace(/\"|\s*/g, '');

// Proxying around CORS -> http://download.finance.yahoo.com
const webservice = '/external/yahoo/d/quotes.csv?s=$symbol&f=$options&e=.csv';

const requestQuote$ = (symbol, opts = 'sa') =>
   Rx.Observable.fromPromise(
       ajax(webservice.replace(/\$symbol/,symbol)
          .replace(/\$options/, opts)))
      .retry(3)
      .catch(err => Rx.Observable.throw(
          new Error('Stock data not available. Try again later!')))
      .map(cleanStr)  //#E
      .map(data => data.indexOf(',') > 0 ? csv(data) : data);


const twoSecond$ = Rx.Observable.interval(2000);

const fetchDataInterval$ = symbol => twoSecond$
     .mergeMap(() => requestQuote$(symbol)
          .distinctUntilChanged((previous, next) => {
              let prevPrice = parseFloat(previous[1]).toFixed(2);
              let nextPrice = parseFloat(next[1]).toFixed(2);
              return prevPrice === nextPrice;
          }));


const symbol$ = Rx.Observable.of('FB', 'CTXS', 'AAPL');

const ticks$ = symbol$.mergeMap(fetchDataInterval$).share();


ticks$.subscribe(
  ([symbol, price]) => {
     let id = 'row-' + symbol.toLowerCase();
     let row = document.querySelector(`#${id}`);
     if(!row) {
      addRow(id, symbol, price);
     }
     else {
      updateRow(row, symbol, price);
     }
  },
  error => console.log(error.message));

ticks$
  .mergeMap(([symbol, price]) =>
    Rx.Observable.of([symbol, price])
      .combineLatest(requestQuote$(symbol, 'o')))
  .map(R.flatten)
  .map(([symbol, current, open]) => [symbol, (current - open).toFixed(2)])
  .subscribe(([symbol, change]) => {
      let id = 'row-' + symbol.toLowerCase();
      let row = document.querySelector(`#${id}`);
      if(row) {
        updatePriceChange(row, change);
      }
    },
    error => console.log(`Fetch error occurred: ${error}`)
   );

const updatePriceChange = (rowElem, change) => {
   let [,, changeElem] = rowElem.childNodes;
   let priceClass = "green-text", priceIcon="up-green";
   if(parseFloat(change) < 0) {
       priceClass = "red-text"; priceIcon="down-red";
   }
   changeElem.innerHTML =
     `<span class="${priceClass}">
         <span class="${priceIcon}">
            (${parseFloat(Math.abs(change)).toFixed(2)})
         </span>
      </span>`;
};

const table = document.querySelector('#stocks-table');

const addRow = (id, symbol,  price) => {
  let row = document.createElement('tr');
    row.setAttribute('id', id);
    let symbolElem = document.createElement('td');
    let priceElem = document.createElement('td');
    let priceChangeElem = document.createElement('td');

     symbolElem.innerHTML = symbol;
     priceElem.innerHTML = new USDMoney(price).toString();
     priceChangeElem.innerHTML = new USDMoney(0).toString();

     row.appendChild(symbolElem);
     row.appendChild(priceElem);
     row.appendChild(priceChangeElem);
     table.appendChild(row);
};

const updateRow = (rowElem, symbol, price) => {
  let [symbolElem, priceElem] = rowElem.childNodes;
  symbolElem.innerHTML = symbol;
  priceElem.innerHTML = new USDMoney(price).toString();
};

const Money = function (currency, val) {
  return {
    currency: function () {
      return currency;
    },
    value: function () {
      return val;
    },
    toString: function () {
      return `${currency} ${val}`;
    }
  };
};

const USDMoney = Money.bind(null, 'USD');
