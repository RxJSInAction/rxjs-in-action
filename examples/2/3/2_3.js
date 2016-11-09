/**
 *  RxJS in Action
 *  Listing 2.3
 *  @author Paul Daniels
 *  @author Luis Atencio
 */
 // Fibonnaci number generator
function* fibonacci() {
  var first = 1, second = 1;
  for(;;) {
    var sum = second + first;
    yield sum;
    first = second;
    second = sum;
  }
}

//--------------------------------------------------//
//                Usage                             //
//--------------------------------------------------//
const iter = fibonacci();
iter.next(); //-> {value: 2, done: false}
iter.next(); //-> {value: 3, done: false}
iter.next(); //-> {value: 5, done: false}
