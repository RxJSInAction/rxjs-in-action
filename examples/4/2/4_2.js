/**
 *  RxJS in Action
 *  Listing 4.2
 *  @author Paul Daniels
 *  @author Luis Atencio
 */
Rx.Observable.timer(1000) 
  .subscribe(()=>
     document.querySelector('#panel').style.backgroundColor = 'red');
