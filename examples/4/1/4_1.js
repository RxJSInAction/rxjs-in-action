/**
 *  RxJS in Action
 *  Listing 3.7
 *  @author Paul Daniels
 *  @author Luis Atencio
 */
const source$ = Rx.Observable.create(observer => {
    const timeoutId = setTimeout(() => {
      observer.next();
      observer.complete();
    }, 1000);

    return () => clearTimeout(timeoutId);
  });

source$.subscribe(() =>
  document.querySelector('#panel').style.backgroundColor = 'red');
