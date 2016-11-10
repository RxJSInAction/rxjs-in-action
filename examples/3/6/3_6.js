/**
 *  RxJS in Action
 *  Listing 3.6
 *  @author Paul Daniels
 *  @author Luis Atencio
 */
function exclude(predicate) {
  return Rx.Observable.create(subscriber => {
      let source = this;
      return source.subscribe(value => {
           try {
              if(!predicate(value)) {
                  subscriber.next(value);
              }
           }
           catch(err) {
              subscriber.error(err);
           }
         },
         err => subscriber.error(err),
         () => subscriber.complete());
   });
}

Rx.Observable.prototype.exclude = exclude;

//--------------------------------------------------//
//                Usage                             //
//--------------------------------------------------//
Rx.Observable.from([1, 2, 3, 4, 5])
  .exclude(x => x % 2 === 0)
  .subscribe(console.log);
