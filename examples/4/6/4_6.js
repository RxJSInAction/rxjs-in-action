/**
 *  RxJS in Action
 *  Listing 4.6
 *  @author Paul Daniels
 *  @author Luis Atencio
 */
Rx.Observable.timer(1000)
   .delay(2000)
   .timeInterval()
   .map(int => Math.floor(int.interval / 1000))
   .subscribe(seconds => console.log(`${seconds} seconds`));
