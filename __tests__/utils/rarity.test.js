const chai = require('chai');
const expect = require('chai').expect;
const assert = chai.assert;

const rarity = require('../../utils/rarity.js');

describe('Mocha Test Suite', function () {
   
    var randomNumber;
   
    before(function() {
   
      // Do this one time before any test is executed
      randomNumber = math.rand();
   
    });
   
    describe('A test for math.ceil', function(){
   
      it('Should equal 1', function (done) {
   
        expect(math.ceil(randomNumber) === 1).to.equal(true);
   
      });
    });
   
  });