import TestScene from "./testScene.js";
const expect = chai.expect;
let scene;
let game;

describe('Phaser', function () {
  it('is an object', function () {
    chai.expect(Phaser).is.an('object');
  });

  it('is version 3.24.1', function () {
    expect(Phaser).has.property('VERSION', '3.80.1');
  });
});

describe('hooks', function () {
  before('create game', function (done) {
    game = new Phaser.Game({
      type: Phaser.HEADLESS,
      scene: {
        init: function () {
          done();
        }
      },
      callbacks: {
        postBoot: function () {
          game.loop.stop();
        }
      }
    });
  });

  beforeEach('create realscene', function () {
    scene = game.scene.add('test', TestScene, true);

  });

  afterEach('destroy scene', function () {
    game.scene.remove('test');
  });

  after('destroy game', function () {
    game.destroy(true, true);
    game.runDestroy();
  });

  describe('Test scene', function () {
    context('Calling methods from scene', function () {
      it('calling hello world', function () {
          expect(scene.getHelloWorld()).to.equal('hello world');
      });
    });
  });
});



mocha.run();