import BattleScene from "../../battle-scene";
import { TextStyle, addTextObject } from "../text";
import { Mode } from "../ui";
import * as Utils from "../../utils";
import { addWindow } from "../ui-theme";
import MessageUiHandler from "../message-ui-handler";
import i18next from "../../plugins/i18n";
import {Button} from "../../enums/buttons";
import StarterSelectUiHandler from "#app/ui/starter-select-ui-handler";

export enum MenuOptions {
  START,
  EXPORT_TEAM,
  IMPORT_TEAM,
}

export default class StarterSelectMenuUiHandler extends MessageUiHandler {
  private menuContainer: Phaser.GameObjects.Container;
  private menuMessageBoxContainer: Phaser.GameObjects.Container;

  private menuBg: Phaser.GameObjects.NineSlice;
  protected optionSelectText: Phaser.GameObjects.Text;

  private cursorObj: Phaser.GameObjects.Image;

  protected menuOptions: MenuOptions[];

  constructor(scene: BattleScene, mode?: Mode) {
    super(scene, mode);

    this.menuOptions = Utils.getEnumKeys(MenuOptions).map(m => parseInt(MenuOptions[m]) as MenuOptions);
  }

  setup() {
    const ui = this.getUi();

    this.menuContainer = this.scene.add.container(1, -(this.scene.game.canvas.height / 6) + 1);

    this.menuContainer.setInteractive(new Phaser.Geom.Rectangle(0, 0, this.scene.game.canvas.width / 6, this.scene.game.canvas.height / 6), Phaser.Geom.Rectangle.Contains);

    const menuMessageText = addTextObject(this.scene, 8, 8, "", TextStyle.WINDOW, { maxLines: 2 });
    menuMessageText.setWordWrapWidth(1224);
    menuMessageText.setOrigin(0, 0);

    this.optionSelectText = addTextObject(this.scene, 0, 0, this.menuOptions.map(o => `${i18next.t(`starterSelectMenuUiHandler:${MenuOptions[o]}`)}`).join("\n"), TextStyle.WINDOW, { maxLines: this.menuOptions.length });
    this.optionSelectText.setLineSpacing(12);

    this.menuBg = addWindow(this.scene, (this.scene.game.canvas.width / 6) - (this.optionSelectText.displayWidth + 25), 0, this.optionSelectText.displayWidth + 23, (this.scene.game.canvas.height / 6) - 2);
    this.menuBg.setOrigin(0, 0);

    this.optionSelectText.setPositionRelative(this.menuBg, 14, 6);

    this.menuContainer.add(this.menuBg);

    this.menuContainer.add(this.optionSelectText);

    ui.add(this.menuContainer);

    this.menuMessageBoxContainer = this.scene.add.container(0, 130);
    this.menuMessageBoxContainer.setVisible(false);
    this.menuContainer.add(this.menuMessageBoxContainer);

    const menuMessageBox = addWindow(this.scene, 0, -0, 220, 48);
    menuMessageBox.setOrigin(0, 0);
    this.menuMessageBoxContainer.add(menuMessageBox);

    this.menuMessageBoxContainer.add(menuMessageText);

    this.message = menuMessageText;

    this.menuContainer.add(this.menuMessageBoxContainer);

    this.setCursor(0);

    this.menuContainer.setVisible(false);
  }

  show(args: any[]): boolean {
    super.show(args);

    this.menuContainer.setVisible(true);
    this.setCursor(0);

    this.getUi().moveTo(this.menuContainer, this.getUi().length - 1);

    this.getUi().hideTooltip();

    this.scene.playSound("menu_open");

    return true;
  }

  processInput(button: Button): boolean {
    const ui = this.getUi();

    let success = false;
    const error = false;

    if (button === Button.ACTION) {
      const adjustedCursor = this.cursor;
      switch (adjustedCursor) {
      case MenuOptions.START:
        ui.revertMode().then(result => {
          const handler = this.scene.ui.getHandler() as StarterSelectUiHandler;
          success = handler.tryStart(true);
          if (success) {
            ui.playSelect();
          } else {
            ui.playError();
          }
        });
        break;
      case MenuOptions.EXPORT_TEAM:
        ui.setOverlayMode(Mode.EXPORT_TEAM);
        success = true;
        break;
      case MenuOptions.IMPORT_TEAM:
        ui.setOverlayMode(Mode.IMPORT_TEAM);
        success = true;
        break;
      }
    } else if (button === Button.CANCEL) {
      success = true;
      ui.revertMode().then(result => {
        if (!result) {
          ui.setMode(Mode.MESSAGE);
        }
      });
    } else {
      switch (button) {
      case Button.UP:
        if (this.cursor) {
          success = this.setCursor(this.cursor - 1);
        } else {
          success = this.setCursor(this.menuOptions.length - 1);
        }
        break;
      case Button.DOWN:
        if (this.cursor + 1 < this.menuOptions.length) {
          success = this.setCursor(this.cursor + 1);
        } else {
          success = this.setCursor(0);
        }
        break;
      }
    }

    if (success) {
      ui.playSelect();
    } else if (error) {
      ui.playError();
    }

    return success || error;
  }

  showText(text: string, delay?: number, callback?: Function, callbackDelay?: number, prompt?: boolean, promptDelay?: number): void {
    this.menuMessageBoxContainer.setVisible(!!text);

    super.showText(text, delay, callback, callbackDelay, prompt, promptDelay);
  }

  setCursor(cursor: integer): boolean {
    const ret = super.setCursor(cursor);

    if (!this.cursorObj) {
      this.cursorObj = this.scene.add.image(0, 0, "cursor");
      this.cursorObj.setOrigin(0, 0);
      this.menuContainer.add(this.cursorObj);
    }

    this.cursorObj.setPositionRelative(this.menuBg, 7, 9 + this.cursor * 16);

    return ret;
  }

  clear() {
    super.clear();
    this.menuContainer.setVisible(false);
    this.eraseCursor();
  }

  eraseCursor() {
    if (this.cursorObj) {
      this.cursorObj.destroy();
    }
    this.cursorObj = null;
  }
}
