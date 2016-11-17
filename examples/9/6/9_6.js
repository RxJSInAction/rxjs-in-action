/**
 *  RxJS in Action
 *  Listing 9.5
 *  @author Paul Daniels
 *  @author Luis Atencio
 */
mocha.setup({ ui: 'bdd', checkLeaks: true});

const expect = chai.expect;
const assert = chai.assert;

it('Should add numbers together with delay', function (done) {
    	Rx.Observable.from([1, 2, 3, 4, 5, 6, 7, 8, 9])
        .reduce((total, delta) => total + delta)
        .delay(1000)
        .subscribe(total => {
           expect(total).to.equal(45);
         }, null, done);
});

mocha.run();
