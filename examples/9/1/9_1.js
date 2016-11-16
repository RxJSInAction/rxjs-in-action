/**
 *  RxJS in Action
 *  Listing 9.1
 *  @author Paul Daniels
 *  @author Luis Atencio
 */
mocha.setup({ ui: 'bdd', checkLeaks: true});

const expect = chai.expect;
const expect = chai.expect;

describe('Validation', function () {
	it('Should validate that a string is not empty', function() { //#B
	   expect(notEmpty('some input')).to.be(true); //#B

	   expect(notEmpty(' ')).to.be(false);
	   expect(notEmpty(null)).to.be(false);
	   expect(notEmpty(undefined)).to.be(false);
    });
});

mocha.run();
