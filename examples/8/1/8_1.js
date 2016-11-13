/**
 *  RxJS in Action
 *  Listing 8.1
 *  @author Paul Daniels
 *  @author Luis Atencio
 */
const interval$ = Rx.Observable.interval(500);

const isEven = x => x % 2 === 0;

interval$
  .filter(isEven)
  .take(5)
  .subscribe(x => { //#A
      console.log(`Even number found: ${x}`);
   });

interval$
  .filter(R.compose(R.not, isEven))
  .take(5)
  .subscribe(x => { //#A
      console.log(`Odd number found: ${x}`);
   });
