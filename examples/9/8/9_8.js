/**
 *  RxJS in Action
 *  Listing 9.7
 *  @author Paul Daniels
 *  @author Luis Atencio
 */
mocha.setup({ ui: 'bdd', checkLeaks: true});

const expect = chai.expect;
const assert = chai.assert;

it('Emits values on an asynchronous scheduler', function (done) {
  let temp = [];
   Rx.Observable.range(1, 5, Rx.Scheduler.async)
      .do(console.log)
      .do([].push.bind(temp))
      .subscribe(value => {
	     expect(temp).to.have.length(value);
   	     expect(temp).to.contain(value);
      }, done, done);
});

mocha.run();
