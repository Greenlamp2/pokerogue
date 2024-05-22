import sum from './sum.js';
import TestScene from "./testScene.js";

describe('sum', function () {
  it('should return sum of arguments', function () {
    chai.expect(sum(1, 2)).to.equal(3);
  });
  it('is an object', function () {
    chai.expect(Phaser).is.an('object');
  });
});
mocha.run();