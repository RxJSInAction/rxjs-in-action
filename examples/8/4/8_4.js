/**
 *  RxJS in Action
 *  Listing 8.4
 *  @author Paul Daniels
 *  @author Luis Atencio
 */

 //http://jsbin.com/yusoya/50/edit?html,js,output
const csv = str => str.split(/,\s*/);

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

class StockTicker extends EventEmitter {

  constructor(symbol) {
    super();
    this.symbol = symbol;
    this.intId = 0;
  }

  tick(symbol, price) {
    this.emit('tick', symbol, price);
  }

  start() {
    this.intId = setInterval(() => {
    const webservice =
      `http://finance.yahoo.com/d/quotes.csv?s=${this.symbol}&f=sa&e=.csv`;

      ajax(webservice).then(csv).then(
        ([symbol, price]) => {
         this.tick(symbol.replace(/\"/g, ''), price);
      });
    }, 2000);
  }
  stop() {
    clearInterval(this.intId);
  }
}

const ticker = new StockTicker('FB');
ticker.start();

const tick$ = Rx.Observable.fromEvent(ticker, 'tick',
        (symbol, price) => ({'symbol': symbol, 'price': price}))
   .catch(Rx.Observable.throw(new Error('Stock ticker exception')));

const symbolElem = document.querySelector('#company');
const priceElem = document.querySelector('#price');

const sub1 = tick$.subscribe(
       quoteDetails => {
           const USDMoney = Money.bind(null, 'USD');
           let  priceUSD = new USDMoney(quoteDetails.price);
           priceElem.innerHTML = priceUSD.toString();
           symbolElem.innerHTML = quoteDetails.symbol;
         },
         error => {
           ticker.stop();
         }
      );

const symbolElem2 = document.querySelector('#company2');
const priceElem2 = document.querySelector('#price2');

const sub2 = tick$.subscribe(
    quoteDetails => {
        const USDMoney = Money.bind(null, 'USD');
        let  priceUSD = new USDMoney(quoteDetails.price);
        priceElem2.innerHTML = priceUSD.toString();
        symbolElem2.innerHTML = quoteDetails.symbol;
      },
      error => {
        ticker.stop();
      }
   );

setTimeout(() => {
   ticker.stop();
}, 10000);
