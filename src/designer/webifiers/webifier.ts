import GameManager from "../../test/utils/gameManager.js";
import {useEffect, useState} from "react";
import Phaser from "phaser";
import BattleScene from "../../battle-scene.js";
// import MockTextureManager from "#test/utils/mocks/mockTextureManager";

const Webifier = (props) => {
  if (!props.handler) return null;

  return `${props.mode} -- ${props.handler.constructor.name}`;
};

export default Webifier;

class FakeScene {
  // mockTextureManager: MockTextureManager;
  public game = {
    canvas: {
      height: 1280,
      width: 1024,
    }
  }
  public add;
  constructor() {
    // this.mockTextureManager = new MockTextureManager(this);
    // this.add = this.mockTextureManager.add;
  }
}