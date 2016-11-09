/**
 *  RxJS in Action
 *  Listing 2.2
 *  @author Paul Daniels
 *  @author Luis Atencio
 */
const progressBar$ = Rx.Observable.create(observer => {
   const OFFSET = 3000;  //#A
   const SPEED =  50;  //#B

   let val = 0;
   function progress() {
     if(++val <= 100) {
       observer.next(val);  //#B
       setTimeout(progress, SPEED); //#C
     }
     else {
       observer.complete();  //#D
     }
   };
   setTimeout(progress, OFFSET);  //#A
});

const label = document.querySelector('#progress-indicator');

progressBar$
  .subscribe(
    val   => label.textContent = (Number.isInteger(val) ? val + "%" : val),
    error => console.log(error.message),
    ()    => label.textContent = 'Complete!'
);
