import UI, {Mode} from "#app/ui/ui";
import BattleScene from "#app/battle-scene";
import {Moves} from "#enums/moves";
import {initCommonAnims, initMoveAnim, loadCommonAnimAssets, loadMoveAnimAssets} from "#app/data/battle-anims";
import PokemonSpriteSparkleHandler from "#app/field/pokemon-sprite-sparkle-handler";
import {GameModes, getGameMode} from "#app/game-mode";
import * as Overrides from "#app/overrides";
import * as Utils from "#app/utils";
import {PokeballType} from "#app/data/pokeball";
import {Localizable} from "#app/interfaces/locales";
import {allSpecies} from "#app/data/pokemon-species";
import {allMoves} from "#app/data/move";
import {allAbilities} from "#app/data/ability";
import {getModifierPoolForType, ModifierPoolType} from "#app/modifier/modifier-type";


export class DesignerScene extends BattleScene {

  constructor() {
    super("designer");
  }
  launchBattle() {
    const uiContainer = this.add.container(0, 0);
    uiContainer.setName("container-ui");
    uiContainer.setDepth(2);
    uiContainer.setScale(6);

    const field = this.add.container(0, 0);
    field.setScale(6);
    field.setName("container-field");

    this.field = field;

    const fieldUI = this.add.container(0, this.game.canvas.height);
    fieldUI.setName("container-field-ui");
    fieldUI.setDepth(1);
    fieldUI.setScale(6);

    this.fieldUI = fieldUI;

    this.spriteSparkleHandler = new PokemonSpriteSparkleHandler();
    this.spriteSparkleHandler.setup(this);

    this.uiContainer = uiContainer;
    const loadPokemonAssets = [];

    this.reset(false, false, true);

    const ui = new UI(this);
    this.uiContainer.add(ui);

    this.ui = ui;

    ui.setup();

    const defaultMoves = [ Moves.TACKLE, Moves.TAIL_WHIP, Moves.FOCUS_ENERGY, Moves.STRUGGLE ];

    Promise.all([
      Promise.all(loadPokemonAssets),
      initCommonAnims(this).then(() => loadCommonAnimAssets(this, true)),
      Promise.all([ Moves.TACKLE, Moves.TAIL_WHIP, Moves.FOCUS_ENERGY, Moves.STRUGGLE ].map(m => initMoveAnim(this, m))).then(() => loadMoveAnimAssets(this, defaultMoves, true)),
      this.initStarterColors()
    ]).then(() => {
      this.ui.setMode(Mode.SETTINGS);
      console.log("all good");
    });
  }

  reset(clearScene: boolean = false, clearData: boolean = false, reloadI18n: boolean = false): void {
    this.gameMode = getGameMode(GameModes.CLASSIC);

    this.setSeed(Overrides.SEED_OVERRIDE || Utils.randomString(24));
    console.log("Seed:", this.seed);

    this.disableMenu = false;
    this.score = 0;
    this.money = 0;
    this.lockModifierTiers = false;

    this.party = [];
    this.modifiers = [];
    this.enemyModifiers = [];
    this.currentBattle = null;

    this.pokeballCounts = Object.fromEntries(Utils.getEnumValues(PokeballType).filter(p => p <= PokeballType.MASTER_BALL).map(t => [ t, 0 ]));
    this.pokeballCounts[PokeballType.POKEBALL] += 5;

    this.updateGameInfo();

    if (reloadI18n) {
      const localizable: Localizable[] = [
        ...allSpecies,
        ...allMoves,
        ...allAbilities,
        ...Utils.getEnumValues(ModifierPoolType).map(mpt => getModifierPoolForType(mpt)).map(mp => Object.values(mp).flat().map(mt => mt.modifierType).filter(mt => "localize" in mt).map(lpb => lpb as unknown as Localizable)).flat()
      ];
      for (const item of localizable) {
        item.localize();
      }
    }
  }

  initDesigner() {
    this.ui = new UI(this);
  }
}
