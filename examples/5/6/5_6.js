/**
 *  RxJS in Action
 *  Listing 5.6
 *  Note: make sure you have turned on CORS sharing in you browser so that you can make
 *  cross-site requests
 *  @author Paul Daniels
 *  @author Luis Atencio
 */
 console.log('Note: Please turn on CORS in your browser');
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


 const csv = str => str.split(/,\s*/);
 const webservice = '/external/yahoo/d/quotes.csv?s=$symbol &f=sa&e=.csv';

 const currency = 'usd';

 const requestQuote$ = symbol =>
      Rx.Observable.fromPromise(
        ajax(webservice.replace(/\$symbol/, symbol)))
      .map(response => response.replace(/"/g, ''))
      .map(csv);

 const twoSecond$ = Rx.Observable.interval(2000);

 const fetchDataInterval$ = symbol => twoSecond$
      .mergeMap(() => requestQuote$(symbol));

 const symbols$ = Rx.Observable.of('FB', 'CTXS', 'AAPL');

 const table = document.querySelector('#stocks-table');

 const ticks$ = symbols$.mergeMap(fetchDataInterval$);

 const addRow = (id, symbol,  price) => {
 	 let row = document.createElement('tr');
   	 row.setAttribute('id', id);
   	 let symbolElem = document.createElement('td');
   	 let priceElem = document.createElement('td');

      symbolElem.innerHTML = new USDMoney(symbol).toString();
      priceElem.innerHTML = new USDMoney(price).toString();

      row.appendChild(symbolElem);
      row.appendChild(priceElem);
      table.appendChild(row);
 };

 const updateRow = (rowElem, symbol, price) => {
 	 let [symbolElem, priceElem] = rowElem.childNodes;
 	 symbolElem.innerHTML = new USDMoney(symbol).toString();
      priceElem.innerHTML = new USDMoney(price).toString();
 };

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
