/**
 *  RxJS in Action
 *  Listing 4.13
 *  @author Paul Daniels
 *  @author Luis Atencio
 */
Rx.Observable.fromEvent(document, 'mousemove')
  .throttleTime(2000)
  .subscribe(event => {
     console.log(`Mouse at: ${event.x} and ${event.y}`);
  });
