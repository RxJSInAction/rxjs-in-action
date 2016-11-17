/**
 *  RxJS in Action
 *  Listing 9.5
 *  @author Paul Daniels
 *  @author Luis Atencio
 */
mocha.setup({ ui: 'bdd', checkLeaks: true});

const expect = chai.expect;
const assert = chai.assert;

describe('Adding numbers', function () {
  it('Should add numbers together', function () {

    const adder = (total, delta) => total + delta;

    Rx.Observable.from([1, 2, 3, 4, 5, 6, 7, 8, 9])
      .reduce(adder)
      .subscribe(total => {
          expect(total).to.equal(45);
      });
   });
});

mocha.run();
