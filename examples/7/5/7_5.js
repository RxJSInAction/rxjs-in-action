/**
 *  RxJS in Action
 *  Listing 7.5
 *  @author Paul Daniels
 *  @author Luis Atencio
 */

const computeHalf = x => Math.floor(x / 2);

Rx.Observable.of(2,4,5,8,10)
   .map(num => {
      if(num % 2 !== 0) {
        throw new Error(`Unexpected odd number: ${num}`); //#A
      }
      return num;
   })
   .map(computeHalf)
   .subscribe(
       function next(val) {
          console.log(val);
       },
       function error(err) {
          console.log(`Caught: ${err}`); //#B
       },
       function complete() {
          console.log('All done!');
       }
    );
