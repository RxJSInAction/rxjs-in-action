/**
 *  RxJS in Action
 *  Listing 4.7
 *  @author Paul Daniels
 *  @author Luis Atencio
 */
Rx.Observable.of([1, 2, 3, 4, 5])
      .do(x => console.log(`Emitted: ${x}`)) //#A
      .delay(200)
      .subscribe(x => console.log(`Received: ${x}`));
