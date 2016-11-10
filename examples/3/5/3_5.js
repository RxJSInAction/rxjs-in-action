/**
 *  RxJS in Action
 *  Listing 3.5
 *  @author Paul Daniels
 *  @author Luis Atencio
 */
const add = (x, y) => x + y;

Rx.Observable.from([
    {
       date: '2016-07-01',
       amount: -320.00,
    },
    {
       date: '2016-07-13',
       amount: 1000.00,
    },
    {
       date: '2016-07-22',
       amount: 45.0,
    },
  ])
  .pluck('amount')
  .reduce(add, 0)
  .subscribe(console.log);
