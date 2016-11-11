/**
 *  RxJS in Action
 *  Listing 6.11
 *  @author Paul Daniels
 *  @author Luis Atencio
 */
 class Transaction {
  constructor(name, type, amount, from, to = null) {
     this.name = name;
     this.type = type;
     this.from = from;
     this.to   = to;
     this.amount = amount;
  }

  name() {
    return this.name;
  }

  from() {
    return this.from;
  }

  to() {
    return this.to;
  }

  amount() {
    return this.amount;
  }

  type() {
    return this.type;
  }
}

function getTransactionsArray() {
   return [
     new Transaction('Brendan Eich', 'withdraw', 500, 'checking'),
     new Transaction('George Lucas', 'deposit',  800, 'savings'),
     new Transaction('Emmet Brown', 'transfer', 2000, 'checking', 'savings'),
     new Transaction('Bjarne Stroustrup', 'transfer', 1000, 'savings', 'CD'),
     new Transaction('Bjarne Stroustrup', 'transfer', 1000, 'savings', 'CD'),
     new Transaction('Bjarne Stroustrup', 'transfer', 1000, 'savings', 'CD'),
     new Transaction('Bjarne Stroustrup', 'transfer', 1000, 'savings', 'CD'),
     new Transaction('Bjarne Stroustrup', 'transfer', 1000, 'savings', 'CD'),
     new Transaction('Bjarne Stroustrup', 'transfer', 1000, 'savings', 'CD'),
     new Transaction('Bjarne Stroustrup', 'transfer', 1000, 'savings', 'CD'),
     new Transaction('Bjarne Stroustrup', 'transfer', 1000, 'savings', 'CD'),
     new Transaction('Bjarne Stroustrup', 'transfer', 1000, 'savings', 'CD'),
     new Transaction('Bjarne Stroustrup', 'transfer', 1000, 'savings', 'CD'),
     new Transaction('Bjarne Stroustrup', 'transfer', 1000, 'savings', 'CD'),
     new Transaction('Bjarne Stroustrup', 'transfer', 1000, 'savings', 'CD'),
  ];
}
const txDb = new PouchDB('transactions');
const accountsDb = new PouchDB('accounts');

Rx.Observable.from(getTransactionsArray())
  .bufferCount(10)
  .timestamp()
  .map(obj => {
      return obj.value.map(tx => {
        return Object.assign({}, tx, {
            date: obj.timestamp
          })
      })
  })
  .do(txs => console.log(`Processing ${txs.length} transactions`))
  .mergeMap(datedTxs =>
        Rx.Observable.fromPromise(txDb.bulkDocs(datedTxs)))
  .subscribe(
    rec => console.log('New records created'),
    err => console.log('Error: ' + err),
    ()  => console.log('Database populated!')
  );
