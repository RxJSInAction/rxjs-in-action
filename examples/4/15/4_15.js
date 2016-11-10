/**
 *  RxJS in Action
 *  Listing 4.15
 *  @author Paul Daniels
 *  @author Luis Atencio
 */
const field1 = document.querySelector('#form-field-1');
const field2 = document.querySelector('#form-field-2');
const submit = document.querySelector('#submit');

const createField$ = elem =>
  Rx.Observable.fromEvent(elem, 'change')
    .pluck('target', 'value');

Rx.Observable.combineLatest(
    createField$(field1), createField$(field2))
.bufferTime(5000)
.map(R.compose(R.filter(R.compose(R.not, R.isEmpty)), R.flatten))
.subscribe(fields => {
    if(fields.length === 2) {
       submit.setAttribute('style', 'background-color: yellow');
    }
    else {
       submit.removeAttribute('style');
    }
});
