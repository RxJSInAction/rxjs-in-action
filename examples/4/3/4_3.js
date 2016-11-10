/**
 *  RxJS in Action
 *  Listing 4.3
 *  @author Paul Daniels
 *  @author Luis Atencio
 */
const source$ = Rx.Observable.create(observer => {
    let num = 0;
    const id = setInterval(() => {
      observer.next(`Next ${num++}`);
	}, 2000); // #A

	return () => {  //#B
	   clearInterval(id);
	}
});

const subscription = source$.subscribe(
    next  => console.log(next),  //# C
    error => console.log(error.message),
       () => console.log('Done!')  //# D
  );

setTimeout(function () {  //#E
	subscription.unsubscribe();
}, 8000);
