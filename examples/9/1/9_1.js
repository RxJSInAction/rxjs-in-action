/**
 *  RxJS in Action
 *  Listing 9.1
 *  @author Paul Daniels
 *  @author Luis Atencio
 */
mocha.setup({ ui: 'bdd', checkLeaks: true});

const expect = chai.expect;

function isEmpty(value) {
  return typeof value == 'string' && !value.trim() || typeof value == 'undefined' || value === null;
}

function negate(fn) {
  return function (val) {
    return !fn(val);
  }
}

const notEmpty = negate(isEmpty);

describe('Validation', function () {
	it('Should validate that a string is not empty', function() {
	   expect(notEmpty('some input')).to.be.equal(true);

	   expect(notEmpty(' ')).to.be.equal(false);
	   expect(notEmpty(null)).to.be.equal(false);
	   expect(notEmpty(undefined)).to.be.equal(false);
     expect(notEmpty(undefined)).to.not.be.undefined
    });
});

mocha.run();
