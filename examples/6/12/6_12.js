/**
 *  RxJS in Action
 *  Listing 6.12
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
     new Transaction('Bjarne Stroustrup', 'transfer', 1000, 'savings', 'CD')
  ];
}
const txDb = new PouchDB('transactions');

const writeTx$ = tx => Rx.Observable.of(tx)
  .timestamp()
  .map(obj => Object.assign({}, obj.value, {
                date: obj.timestamp
              })
   )
  .do(tx => console.log(`Processing transaction for: ${tx.name}`))
  .mergeMap(datedTx => Rx.Observable.fromPromise(txDb.post(datedTx)));

const count = {
  map: function (doc) {
    emit(doc.name);
  },
  reduce: '_count'
};

Rx.Observable.from(getTransactionsArray())
  .switchMap(writeTx$)
  .mergeMap(() => Rx.Observable.fromPromise(
     txDb.query(count, {reduce: true})))
  .subscribe(
    recs  => console.log('Total: ' + recs.rows[0].value),
    error => console.log('Error: ' + error),
    ()    => console.log('Query completed!')
  );
