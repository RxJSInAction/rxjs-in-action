/**
 *  RxJS in Action
 *  Listing 7.4
 *  @author Paul Daniels
 *  @author Luis Atencio
 */

class Try {
    constructor(val) {
      this._val = val;
    }

    static of(val) {
       if(val === null || val.constructor === Error
          || val instanceof Error) {
	    	return new Failure(val);
	   }
       return new Success(val);
    }

    map(fn) {
       try {
          return Try.of(fn(this._val));
       }
       catch (e) {
          return Try.of(e);
       }
    }
}

class Success extends Try {

   getOrElse(anotherVal) {
     return this._val;
   }
}

class Failure extends Try {

  map(fn) {
    return this;
  }

  getOrElse(anotherVal) {
     return anotherVal;
   }
}

//---------------------------------//
//     Usage                      //
//---------------------------------//
// Error case
let value = Try.of(new Error('Some error!'))
   .map(val => val * val)
   .getOrElse(0);

console.log('Error case. Use default value: ' + value);

// Success case
value = Try.of(10)
   .map(val => val * val)
   .getOrElse(0);

console.log('Success case. 10^2: ' + value);
