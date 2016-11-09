/**
 *  RxJS in Action
 *  Listing 2.2
 *  @author Paul Daniels
 *  @author Luis Atencio
 */
 // Custom iterator that buffers a set of bufferSize elements
function BufferIterator(arr, bufferSize = 2) {
    this[Symbol.iterator] = function () {
        let nextIndex = 0;

        return {
            next: () => {
              if(nextIndex >= arr.length) {
                return {done: true};
              }
              else {
                let buffer = new Array(bufferSize);
                for(let i = 0; i < bufferSize; i++) {
                  buffer[i] = (arr[nextIndex++]);
                }
                return {value: buffer, done: false};
              }
            }
        }
    };
}

//--------------------------------------------------//
//                Usage                             //
//--------------------------------------------------//
const arr = [1, 2, 3, 4, 5, 6];

// Buffer a set of 2 elements on each iteration
for(let i of new BufferIterator(arr, 2)) {
    console.log(i);
} //-> [1, 2] [3, 4] [5, 6]

// Buffer a set of 3 elements on each iteration
for(let i of new BufferIterator(arr, 3)) {
    console.log(i);
} //-> [1, 2, 3] [4, 5, 6]
