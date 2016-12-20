/**
 *  RxJS in Action
 *  Listing 6.8
 *  @author Paul Daniels
 *  @author Luis Atencio
 */
 const Money = function (val, currency) {
   return {
     value: function () {
       return val;
     },
     currency: function () {
       return currency;
     },
     toString: function () {
       return `${currency} ${val}`;
     }
   };
 };

 const USDMoney = Money.bind(null, 'USD');

 const csv = str => str.split(/,\s*/); //#A

 // Proxying around CORS -> http://download.finance.yahoo.com
 const webservice = '/external/yahoo/d/quotes.csv?s=$symbol&f=sa&e=.csv';

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

 const requestQuote$ = symbol =>
      Rx.Observable.fromPromise(
        ajax(webservice.replace(/\$symbol/, symbol)))
      .map(response => response.replace(/"/g, ''))
      .map(csv);

 const twoSecond$ = Rx.Observable.interval(2000);

 const fetchDataInterval$ = symbol => twoSecond$
      .mergeMap(() => requestQuote$(symbol));

 const symbols = ['FB', 'AAPL', 'CTXS'];

const add = (x, y) => x + y;

Rx.Observable.forkJoin(symbols.map(requestQuote$))
 .map(data => data.map(arr => parseInt(arr[1])))
 .subscribe(allPrices => {
    console.log('Total Portfolio Value: ' +
        new USDMoney(allPrices.reduce(add).toLocaleString()));
 });
