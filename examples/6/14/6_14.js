/**
 *  RxJS in Action
 *  Listing 6.14
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

class Account {
  constructor(id, name, type, balance) {
     this._id = id;
     this.name = name;
     this.type = type;
     this.balance = balance;
  }

  id() {
    return this._id;
  }

  name() {
    return this.name;
  }

  type() {
    return this.type;
  }

  balance() {
    return this.balance;
  }
}

const accounts = [
     new Account('1', 'Emmet Brown', 'savings', 1000),
     new Account('2', 'Emmet Brown', 'checking', 2000),
     new Account('3', 'Emmet Brown', 'CD', 20000),
  ];

const accountsDb = new PouchDB('accounts');

const txDb = new PouchDB('transactions');

const writeTx$ = tx => Rx.Observable.of(tx)
  .timestamp()
  .map(obj => Object.assign({}, obj.value, {
                date: obj.timestamp
              })
   )
  .do(tx => console.log(`Processing account for: ${tx.name}`))
  .mergeMap(datedTx => Rx.Observable.fromPromise(accountsDb.post(datedTx)));

Rx.Observable.from(accounts)
  .concatMap(writeTx$)
  .subscribe(
    rec => console.log(`New record created: ${rec.id}`),
    err => console.log('Error: ' + err),
    ()  => console.log('Database populated!')
  );

function withdraw$({name, accountId, type, amount}) {
   return Rx.Observable.fromPromise(accountsDb.get(accountId))
     .do(doc => console.log(
         doc.balance < amount ?
          'WARN: This operation will cause an overdraft!' :
          'Sufficient funds'
      ))
     .mergeMap(doc => Rx.Observable.fromPromise(
        accountsDb.put({
         _id: doc._id,
         _rev: doc._rev,
         balance: doc.balance - amount
        }))
     )
     .filter(response => response.ok)
     .do(() =>
         console.log('Withdraw suceeded. Creating transaction document'))
     .concatMap(() => writeTx$(
           new Transaction(name, 'withdraw', amount, type)));
}

// Run the withdraw logic after the DB has been populated
console.log('Withdraw logic will run after the DB is populated');
setTimeout(() => {
  withdraw$({
    name: 'Emmet Brown',
    accountId: '3',
    type: 'checking',
    amount: 1000
  })
  .subscribe(
     tx    => console.log(`Transaction number: ${tx.id}`),
     error => console.log('Error: ' + error),
     ()    => console.log('Operation completed!!')
  );
}, 3000);
