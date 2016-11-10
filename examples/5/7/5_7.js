/**
 *  RxJS in Action
 *  Listing 5.7
 *  Note: make sure you have turned on CORS sharing in you browser so that you can make
 *  cross-site requests
 *  @author Paul Daniels
 *  @author Luis Atencio
 */
const panel = document.querySelector('#dragTarget');
const mouseDown$ = Rx.Observable.fromEvent(panel, 'mousedown');
const mouseUp$ = Rx.Observable.fromEvent(document, 'mouseup');
const mouseMove$ = Rx.Observable.fromEvent(document, 'mousemove');

//  Listing 5.8
const drag$ = mouseDown$.concatMap(() => mouseMove$.takeUntil(mouseUp$));

drag$.forEach(event => {
  panel.style.left = event.clientX + 'px';
  panel.style.top = event.clientY + 'px';
});
