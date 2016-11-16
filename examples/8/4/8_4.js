/**
 *  RxJS in Action
 *  Listing 8.4
 *  @author Paul Daniels
 *  @author Luis Atencio
 */

 //http://jsbin.com/yusoya/50/edit?html,js,output
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

const sub1 = ticks$.subscribe(
   quoteDetails => updatePanel1(quoteDetails.symbol, quoteDetails.price)
);

const sub1 = ticks$.subscribe(
   quoteDetails => updatePanel2(quoteDetails.symbol, quoteDetails.price)
);
