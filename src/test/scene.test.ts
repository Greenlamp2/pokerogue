import {afterAll, beforeAll, describe, it, expect, beforeEach, afterEach} from "vitest";
import Phaser from "phaser";
import TestScene from "./testScene";

HTMLCanvasElement.prototype.getContext = jest.fn();

describe("check if every variant's sprite are correctly set", () => {
  let game;
  let scene;
  let canvas;
  beforeAll( async () => {
    await new Promise((resolve) => {
      console.log('new');
      game = new Phaser.Game({
        type: Phaser.CANVAS,
        scene: {
          init: function () {
            console.log('inited');
            resolve();
          }
        },
        callbacks: {
          postBoot: function () {
            game.loop.stop();
          }
        },
      });
    })
  });

  afterAll( () => {
    game.destroy(true, true);
    game.runDestroy();
  });

  beforeEach(() => {
    scene = game.scene.add('test', TestScene, true);
  });

  afterEach(() => {
    game.scene.remove('test');
  });

  it('Phaser is an object', function () {
    expect(Phaser).not.toBeUndefined();
  });

  it('scene is an object', function () {
    expect(scene).not.toBeNull();
  });

  it('scene hello world', function () {
    expect(scene.getHelloWorld()).toBe("hello world");
  });


});