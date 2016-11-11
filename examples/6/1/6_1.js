/**
 *  RxJS in Action
 *  Listing 6.1
 *  @author Paul Daniels
 *  @author Luis Atencio
 */

function startWith(value) {
  return Rx.Observable.create(subscriber => {   //#A
    let source = this;
    try {
       subscriber.next(value); //#B
    }
    catch(err) {
       subscriber.error(err);
    }
    return source.subscribe(subscriber); //#C
  });
};


Rx.Observable.prototype.startWith = startWith;

Rx.Observable.range(1, 5)
  .startWith(0)
  .subscribe(console.log);
//-> 0,1,2,3,4,5
