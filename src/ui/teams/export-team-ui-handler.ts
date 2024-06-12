import BattleScene from "#app/battle-scene.js";
import { Button } from "#app/enums/buttons.js";
import {Mode} from "#app/ui/ui";
import {addWindow} from "#app/ui/ui-theme";
import UiHandler from "#app/ui/ui-handler";
import PokemonCard from "#app/ui/teams/pokemon-card";
import StarterSelectUiHandler from "#app/ui/starter-select-ui-handler";
import {Gender} from "#app/data/gender";
import {PlayerPokemon} from "#app/field/pokemon";
import {compress} from "#app/utils";


export default class ExportTeamUIHandler extends UiHandler {
  private parentContainer: Phaser.GameObjects.Container;
  private teamContainer: Phaser.GameObjects.Container;
  private teamWindow: Phaser.GameObjects.NineSlice;
  private pokemonCards: PokemonCard[];
  private code: Phaser.GameObjects.Text;
  private codeBot: Phaser.GameObjects.Text;

  constructor(scene: BattleScene) {
    super(scene, Mode.EXPORT_TEAM);
  }

  setup(): void {
    const ui = this.getUi();

    this.parentContainer = this.scene.add
      .container(0, -this.getCanvasHeight())
      .setName("Export team Parent")
      .setVisible(false);
    this.parentContainer.setVisible(false);
    ui.add(this.parentContainer);

    const exportTeamBg = this.scene.add
      .rectangle(0, 0, this.getCanvasWidth(), this.getCanvasHeight(), 0x9a9a9a)
      .setOrigin(0, 0);
    this.parentContainer.add(exportTeamBg);

    this.teamContainer = this.scene.add
      .container(0, 0)
      .setName("Item Container");
    this.parentContainer.add(this.teamContainer);

    this.teamWindow = addWindow(this.scene, 0, 0, this.getCanvasWidth(), this.getCanvasHeight());
    this.teamWindow.setOrigin(0, 0);
    this.teamContainer.add(this.teamWindow);

    const width = (this.getCanvasWidth() / 2) - 4;
    const height = (this.getCanvasHeight() / 3) - 2;
    this.pokemonCards = [];
    for (let i=0; i<3; i++) {
      for (let j = 0; j<2; j++) {
        const pokemonCard = new PokemonCard(this.scene, 4 + j*width, 4 + i*height, width, height);
        this.pokemonCards.push(pokemonCard);
        this.teamContainer.add(pokemonCard);
      }
    }

    // this.code = addTextObject(this.scene, 8, height*3 + 4, "", TextStyle.MOVE_INFO_CONTENT);
    // this.code.setOrigin(0, 0);
    // this.parentContainer.add(this.code);
    //
    // this.codeBot = addTextObject(this.scene, 8, height*3 + 4 + this.code.height/6 -2, "", TextStyle.MOVE_INFO_CONTENT);
    // this.codeBot.setOrigin(0, 0);
    // this.parentContainer.add(this.codeBot);
  }

  show(args: any[]): boolean {
    super.show(args);
    this.parentContainer.setVisible(true);
    this.getUi().moveTo(this.parentContainer, this.getUi().length - 1);
    this.getUi().hideTooltip();
    this.fetchSelectedStarter();
    return true;
  }

  updateTeamDisplay(team: PlayerPokemon[], code: string) {
    for (const [index, card] of this.pokemonCards.entries()) {
      card.clear();
      card.setPokemon(team[index]);
      card.setVisible(true);
    }
    // const firstHalf = code.substring(0, 70);
    // this.code.setText(firstHalf);
    // if (code.length > 70) {
    //   const secondHalf = code.substring(70);
    //   this.codeBot.setText(secondHalf);
    //   this.codeBot.setVisible(true);
    // } else {
    //   this.codeBot.setVisible(false);
    // }
  }

  fetchSelectedStarter(): void {
    const handler: StarterSelectUiHandler = this.scene.ui.handlers[Mode.STARTER_SELECT] as StarterSelectUiHandler;
    const starters = handler.getStarters();
    const team: PlayerPokemon[] = [];
    let code = "";
    for (const starter of starters) {
      const starterProps =  this.scene.gameData.getSpeciesDexAttrProps(starter.species, starter.dexAttr);
      const starterFormIndex = Math.min(starterProps.formIndex, Math.max(starter.species.forms.length - 1, 0));
      const starterGender = starter.species.malePercent !== null
        ? !starterProps.female ? Gender.MALE : Gender.FEMALE
        : Gender.GENDERLESS;
      const starterPokemon = new PlayerPokemon(this.scene, starter.species, this.scene.gameMode.getStartingLevel(), starter.abilityIndex, starterFormIndex, starterGender, starterProps.shiny, starterProps.variant, undefined, starter.nature, undefined);
      team.push(starterPokemon);
      code += starterPokemon.export() + "#";
    }
    const compressedCode = compress(code);
    this.updateTeamDisplay(team, compressedCode);
  }

  private getCanvasWidth(): number {
    return this.scene.game.canvas.width / 6;
  }
  private getCanvasHeight(): number {
    return this.scene.game.canvas.height / 6;
  }

  clear() {
    super.clear();
    this.parentContainer.setVisible(false);
  }

  processInput(button: Button): boolean {
    let success = false;
    const error = false;
    switch (button) {
    case Button.CANCEL:
      this.getUi().revertMode();
      success = true;
      break;
    }
    return success || error;
  }
}
