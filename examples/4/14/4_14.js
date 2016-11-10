/**
 *  RxJS in Action
 *  Listing 4.14
 *  @author Paul Daniels
 *  @author Luis Atencio
 */
const field = document.querySelector('.form-field');
const showHistoryButton = document.querySelector('#show-history');
const historyPanel = document.querySelector('#history');

const showHistory$ = Rx.Observable.fromEvent(showHistoryButton, 'click');

Rx.Observable.fromEvent(field, 'keyup')
.debounceTime(700)
.pluck('target', 'value')
.filter(R.compose(R.not, R.isEmpty)) //#A
.bufferWhen(() => showHistory$) //#B
.do(history => history.pop())
.subscribe(history => {
    let contents = '';
    if(history.length > 0) { //#C
       for(let item of history) {
         contents += '<li>' + item + '</li>';
       }
       historyPanel.innerHTML = contents;
    }
});
