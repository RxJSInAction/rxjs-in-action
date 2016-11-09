/**
 *  RxJS in Action
 *  Listing 2.1
 *  @author Paul Daniels
 *  @author Luis Atencio
 */
const isEven = num => num % 2 === 0;
const square = num => num * num;
const add = (a, b) => a + b;
const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const result = arr.filter(isEven).map(square).reduce(add);  //-> 220
console.log(result);
