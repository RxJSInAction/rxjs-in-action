/**
 *  RxJS in Action
 *  Listing 4.15
 *  @author Paul Daniels
 *  @author Luis Atencio
 */
const password = document.getElementById('password-field');
const submit = document.getElementById('submit');
const outputField = document.getElementById('output');

const password$ = Rx.Observable.fromEvent(password, 'keyup')
    .map(({keyCode}) => keyCode - 48);

const submit$ = Rx.Observable.fromEvent(submit, 'click');

Rx.Observable.combineLatest(
  password$.bufferTime(7000).filter(R.compose(R.not, R.isEmpty)),
  submit$
)

  .take(10)
  .do(([maybePassword,]) => console.log('Password is: ' + maybePassword.join('-')))
  .subscribe(
    ([maybePassword,]) => {
      if (maybePassword.join('') === '1337') { //#C
        outputField.innerHTML = 'Correct Password!';
      } else {
        outputField.innerHTML = 'Wrong Password!';
      }
    },
    null,
    () => outputField.innerHTML += '\n No more tries accepted!');
