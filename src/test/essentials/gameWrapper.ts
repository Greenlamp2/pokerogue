/* eslint-disable */
import fs from "fs";
import game from "../phaser.setup";
import InputManager = Phaser.Input.InputManager;
import KeyboardManager = Phaser.Input.Keyboard.KeyboardManager;
import KeyboardPlugin = Phaser.Input.Keyboard.KeyboardPlugin;
import GamepadPlugin = Phaser.Input.Gamepad.GamepadPlugin;
import EventEmitter = Phaser.Events.EventEmitter;
import CanvasRenderer = Phaser.Renderer.Canvas.CanvasRenderer;
import UpdateList = Phaser.GameObjects.UpdateList;
import ScaleManager = Phaser.Scale.ScaleManager;
import MockGraphics from "#app/test/essentials/mocksContainer/mockGraphics";
import MockTextureManager from "#app/test/essentials/mocksContainer/mockTextureManager";
import Phaser from "phaser";
import BBCodeText from "phaser3-rex-plugins/plugins/bbcodetext";
import {blobToString, generateStarter, setPositionRelative, waitUntil} from "#app/test/essentials/utils";
import {expect, vi} from "vitest";
import mockLocalStorage from "#app/test/essentials/mockLocalStorage";
import mockConsoleLog from "#app/test/essentials/mockConsoleLog";
import MockLoader from "#app/test/essentials/mockLoader";
import {MockFetch} from "#app/test/essentials/mockFetch";
import * as Utils from "#app/utils";
import {Mode} from "#app/ui/ui";
import {CheckSwitchPhase, CommandPhase, EncounterPhase, SelectStarterPhase} from "#app/phases";
import ConfirmUiHandler from "#app/ui/confirm-ui-handler";
import {Button} from "#app/enums/buttons";
import InputText from "phaser3-rex-plugins/plugins/inputtext";
import {MockClock} from "#app/test/essentials/mockClock";
import {Command} from "#app/ui/command-ui-handler";
import {GameDataType} from "#app/system/game-data";
import TargetSelectUiHandler from "#app/ui/target-select-ui-handler";

Object.defineProperty(window, "localStorage", {
  value: mockLocalStorage(),
});
Object.defineProperty(window, "console", {
  value: mockConsoleLog(false),
});

Phaser.GameObjects.Container.prototype.setPositionRelative = setPositionRelative;
Phaser.GameObjects.Sprite.prototype.setPositionRelative = setPositionRelative;
Phaser.GameObjects.Image.prototype.setPositionRelative = setPositionRelative;
Phaser.GameObjects.NineSlice.prototype.setPositionRelative = setPositionRelative;
Phaser.GameObjects.Text.prototype.setPositionRelative = setPositionRelative;
BBCodeText.prototype.setPositionRelative = setPositionRelative;
Phaser.GameObjects.Rectangle.prototype.setPositionRelative = setPositionRelative;
InputText.prototype.setElement = () => null;
InputText.prototype.resize = () => null;
window.URL.createObjectURL = (blob: Blob) => {
  blobToString(blob).then((data: string) => {
    localStorage.setItem("toExport", data);
  })
  return null;
};
navigator.getGamepads = vi.fn().mockReturnValue([]);
global.fetch = vi.fn(MockFetch);
Utils.setCookie(Utils.sessionIdKey, 'fake_token');

export default class GameWrapper {
  public scenes: Map<string, Phaser.Scene> = new Map();
  private gameObj = game;
  public scene: {
    add: (_key: string, scene: Phaser.Scene) => void
  };
  private createScene: boolean;

  constructor(createScene:boolean = true) {
    localStorage.clear();
    this.createScene = createScene;
    this.gameObj.renderer = {};
    this.gameObj.renderer.maxTextures = -1;
    this.gameObj.renderer.gl = {};
    this.gameObj.renderer.deleteTexture = () => null;
    this.gameObj.renderer.canvasToTexture = () => ({});
    this.gameObj.renderer.createCanvasTexture = () => ({});
    this.gameObj.renderer.pipelines = {
      add: () => null,
    };
    this.gameObj.manager = new InputManager(this.gameObj, {});
    this.gameObj.pluginEvents = new EventEmitter();
    this.gameObj.domContainer = {} as HTMLDivElement;


    window.matchMedia = () => ({
      matches: false,
    });
    this.scene = {
      add: this.addScene.bind(this),
    };
    this.config = {
      seed: ["test"],
    };
  }
  newGame(scene, gameMode): Promise<void> {
    return new Promise(async (resolve, reject) => {
      if (scene.ui.getMode() !== Mode.TITLE) {
        return reject("Invalid mode");
      }
      const starters = generateStarter(scene);
      const selectStarterPhase = new SelectStarterPhase(scene, gameMode);
      scene.pushPhase(new EncounterPhase(scene, false));
      scene.sessionSlotId = 0;
      selectStarterPhase.initBattle(starters)
      await waitUntil(() => scene.ui.getMode() === Mode.CONFIRM || scene.ui.getMode() === Mode.COMMAND);
      if (scene.ui.getMode() === Mode.CONFIRM) { // if this is a trainer battle, we don't switch pokemon
        scene.ui.setMode(Mode.MESSAGE);
        (scene.getCurrentPhase() as CheckSwitchPhase).end(); // same as saying no to the switch box
        if (scene.currentBattle.double) {
          scene.ui.setMode(Mode.MESSAGE);
          (scene.getCurrentPhase() as CheckSwitchPhase).end(); // same as saying no to the switch box
        }
        await waitUntil(() => scene.ui.getMode() === Mode.COMMAND);
      }
      return resolve();
    });
  }

  doAttack(moveIndex, pokemonIndex= 0, target= 0): Promise<void> {
    const scene = this.scenes["battle"];
    let mode = scene.ui?.getMode();
    return new Promise(async (resolve, reject) => {
      if (mode !== Mode.COMMAND) {
        return reject("Invalid mode");
      }
      scene.ui.setMode(Mode.FIGHT, (scene.getCurrentPhase() as CommandPhase).getFieldIndex());
      await waitUntil(() => scene.ui.getMode() === Mode.FIGHT);
      const movePosition = await this.getMovePosition(scene, pokemonIndex, moveIndex);
      (scene.getCurrentPhase() as CommandPhase).handleCommand(Command.FIGHT, movePosition, false)

      //Message if opp is KO, Command if waiting for player to choose next action
      await waitUntil(() => (this.isVictory() && scene.ui?.getMode() === Mode.MESSAGE) || scene.ui?.getMode() === Mode.COMMAND);
      return resolve();
    });
  }

  doAttackDouble(moveIndex, moveIndex2, target= 0, target2): Promise<void> {
    const scene = this.scenes["battle"];
    let mode = scene.ui?.getMode();
    return new Promise(async (resolve, reject) => {
      if (mode !== Mode.COMMAND) {
        return reject("Invalid mode");
      }
      scene.ui.setMode(Mode.FIGHT, (scene.getCurrentPhase() as CommandPhase).getFieldIndex());
      await waitUntil(() => scene.ui.getMode() === Mode.FIGHT);
      const movePosition = await this.getMovePosition(scene, 0, moveIndex);
      const movePosition2 = await this.getMovePosition(scene, 1, moveIndex2);
      (scene.getCurrentPhase() as CommandPhase).handleCommand(Command.FIGHT, movePosition, false)
      if (scene.currentBattle.double) {
        await waitUntil(() => scene.ui?.getMode() === Mode.TARGET_SELECT);
        let targetHandler = scene.ui.getHandler() as TargetSelectUiHandler;
        targetHandler.processInput(Button.ACTION);
        await waitUntil(() => scene.ui.getMode() === Mode.COMMAND);
        scene.ui.setMode(Mode.FIGHT, (scene.getCurrentPhase() as CommandPhase).getFieldIndex());
        await waitUntil(() => scene.ui.getMode() === Mode.FIGHT);
        (scene.getCurrentPhase() as CommandPhase).handleCommand(Command.FIGHT, movePosition2, false)
        await waitUntil(() => scene.ui?.getMode() === Mode.TARGET_SELECT);
        targetHandler = scene.ui.getHandler() as TargetSelectUiHandler;
        targetHandler.processInput(Button.ACTION);
      }


      //Message if opp is KO, Command if waiting for player to choose next action
      await waitUntil(() => (this.isVictory() && scene.ui?.getMode() === Mode.MESSAGE) || scene.ui?.getMode() === Mode.COMMAND);
      return resolve();
    });
  }

  isVictory() {
    const scene = this.scenes["battle"];
    return scene.currentBattle.enemyParty.every(pokemon => pokemon.isFainted());
  }

  exportSaveToTest(): Promise<string> {
    const scene = this.scenes["battle"];
    return new Promise(async (resolve) => {
      await scene.gameData.saveAll(scene, true, true, true, true);
      scene.reset(true);
      await waitUntil(() => scene.ui?.getMode() === Mode.TITLE);
      await scene.gameData.tryExportData(GameDataType.SESSION, 0)
      await waitUntil(() => localStorage.hasOwnProperty("toExport"));
      return resolve(localStorage.getItem("toExport"));
    });
  }

  getMovePosition(scene, pokemonIndex, moveIndex): Promise<number> {
    return new Promise(async (resolve) => {
      const playerPokemon = scene.getPlayerField()[pokemonIndex];
      const moveSet = playerPokemon.getMoveset();
      const index = moveSet.findIndex((move) => move.moveId === moveIndex);
      return resolve(index);
    });
  }

  private addScene(key: string, _scene: any): void {

    _scene.game = this.gameObj;
    _scene.scene = _scene;
    _scene.children = {
      removeAll: () => null,
    }
    _scene.sys = {
      queueDepthSort: () => null,
      game: this.gameObj,
      textures: {
        addCanvas: () => ({
          get: () => ({ // this.frame in Text.js
            source: {},
            setSize: () => null,
            glTexture: () => ({
              spectorMetadata: {},
            }),
          }),
        })
      },
      cache: {},
      scale: {},
      events: {
        on: () => null,
      },
      settings: {
        loader: {
          key: key,
        }
      }
    };
    _scene.sound = {
      play: () => null,
      pause: () => null,
      setRate: () => null,
      add: () => _scene.sound,
      get: () => _scene.sound,
      getAllPlaying: () => [],
      manager: {
        game: this.gameObj,
      },
      setVolume: () => null,
      on: (evt, callback) => callback(),
      key: "",
    };
    _scene.tweens = {
      add: (data) => {
        if (data.onComplete) {
          data.onComplete();
        }
      },
      getTweensOf: () => ([]),
      killTweensOf: () => ([]),
      chain: () => null,
      addCounter: (data) => {
        if (data.onComplete) {
          data.onComplete();
        }
      },
    }
    _scene.system = _scene.sys;
    _scene.systems = _scene.sys;
    _scene.renderer = this.gameObj.renderer;
    _scene.anims = this.gameObj.anims;
    _scene.sys.anims = this.gameObj.anims;
    _scene.sys.queueDepthSort = () => null;
    _scene.cache = this.gameObj.cache;
    _scene.plugins = this.gameObj.plugins;
    _scene.registry = this.gameObj.registry;
    _scene.scale = this.gameObj.scale;
    _scene.textures = this.gameObj.textures;
    _scene.sys.textures = this.gameObj.textures;
    _scene.events = this.gameObj.events;
    _scene.sys.events = new EventEmitter()
    _scene.sys.updateList = new UpdateList(_scene);
    _scene.manager = this.gameObj.manager;
    _scene.pluginEvents = this.gameObj.pluginEvents;
    _scene.input = this.gameObj.input;
    _scene.sys.input = this.gameObj.input;
    _scene.manager.keyboard = new KeyboardManager(_scene);
    _scene.pluginEvents = new EventEmitter();
    _scene.input.keyboard = new KeyboardPlugin(_scene);
    _scene.input.gamepad = new GamepadPlugin(_scene);
    _scene.load = new MockLoader(_scene);
    _scene.sys.cache = _scene.load.cacheManager;
    _scene.sys.scale = new ScaleManager(_scene);
    _scene.spritePipeline = {};
    _scene.fieldSpritePipeline = {};
    const mockTextureManager = new MockTextureManager(_scene);
    _scene.add = mockTextureManager.add;
    _scene.systems.displayList = _scene.add.displayList

    _scene.cachedFetch = (url, init) => {
      return new Promise((resolve) => {
        const newUrl = prependPath(url);
        let raw;
        try {
          raw = fs.readFileSync(newUrl, {encoding: "utf8", flag: "r"});
        } catch(e) {
          return resolve(createFetchResponse({}));
        }
        const data = JSON.parse(raw);
        const response = createFetchResponse(data);
        return resolve(response);
      });
    };
    _scene.make = {
      graphics: (config) => new MockGraphics(mockTextureManager, config),
      rexTransitionImagePack: () => ({
        transit: () => null,
      }),
    };
    _scene.time = new MockClock(_scene);

    // const a = this.gameObj;
    this.scenes[key] = _scene;
    if (!this.createScene) return;
    _scene.preload && _scene.preload();
    _scene.create();
  }
}

function prependPath(originalPath) {
  const prefix = "public";
  if (originalPath.startsWith("./")) {
    return originalPath.replace("./", `${prefix}/`);
  }
  return originalPath;
}
// Simulate fetch response
function createFetchResponse(data) {
  return {
    ok: true,
    status: 200,
    json: () => Promise.resolve(data),
    text: () => Promise.resolve(JSON.stringify(data)),
  };
}