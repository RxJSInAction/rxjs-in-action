/**
 *  RxJS in Action
 *  Listing 2.3
 *  @author Paul Daniels
 *  @author Luis Atencio
 */
 // Fibonnaci number generator
function* fibonacci() {
  let first = 1, second = 1;
  for(;;) {
    let sum = second + first;
    yield sum;
    first = second;
    second = sum;
  }
}

//--------------------------------------------------//
//                Usage                             //
//--------------------------------------------------//
const prettyPrint = (item) => console.log(JSON.stringify(item));
const iter = fibonacci();
prettyPrint(iter.next()); //-> {value: 2, done: false}
prettyPrint(iter.next()); //-> {value: 3, done: false}
prettyPrint(iter.next()); //-> {value: 5, done: false}
