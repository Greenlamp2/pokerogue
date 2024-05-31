import GameWrapper from "#app/test/essentials/gameWrapper";
import {Mode} from "#app/ui/ui";
import {generateStarter, getMovePosition, waitUntil} from "#app/test/essentials/utils";
import {
  CheckSwitchPhase,
  CommandPhase,
  EncounterPhase, LoginPhase, MessagePhase, PostSummonPhase, SelectGenderPhase,
  SelectStarterPhase, ShowAbilityPhase, TitlePhase, ToggleDoublePositionPhase, TurnInitPhase,
} from "#app/phases";
import {Command} from "#app/ui/command-ui-handler";
import TargetSelectUiHandler from "#app/ui/target-select-ui-handler";
import {Button} from "#app/enums/buttons";
import {GameDataType, PlayerGender} from "#app/system/game-data";
import BattleScene from "#app/battle-scene.js";
import PhaseInterceptor from "#app/test/essentials/phaseInterceptor";
import TextInterceptor from "#app/test/essentials/TextInterceptor";


export default class GameManager {
  public gameWrapper: GameWrapper;
  public scene: BattleScene;
  public phaseInterceptor: PhaseInterceptor;
  public textInterceptor: TextInterceptor;

  constructor() {
    this.gameWrapper = new GameWrapper();
    this.scene = new BattleScene();
    this.phaseInterceptor = new PhaseInterceptor(this.scene);
    this.textInterceptor = new TextInterceptor(this.scene);
    this.gameWrapper.setScene(this.scene);
  }

  setMode(mode: Mode) {
    this.scene.ui?.setMode(mode);
  }

  waitMode(mode: Mode): Promise<void> {
    return new Promise(async (resolve) => {
      await waitUntil(() => this.scene.ui?.getMode() === mode);
      return resolve();
    });
  }

  endPhase() {
    this.scene.getCurrentPhase().end();
  }

  onNextPrompt(phaseTarget: string, mode: Mode, callback: () => void) {
    this.phaseInterceptor.addToNextPrompt(phaseTarget, mode, callback);
  }

  newGame(gameMode): Promise<void> {
    return new Promise(async(resolve) => {
      await this.phaseInterceptor.run(LoginPhase);
      this.onNextPrompt("SelectGenderPhase", Mode.OPTION_SELECT, () => {
        this.scene.gameData.gender = PlayerGender.MALE;
        this.endPhase();
      });
      await this.phaseInterceptor.run(SelectGenderPhase, () => this.isCurrentPhase(TitlePhase));
      await this.phaseInterceptor.run(TitlePhase);
      await this.waitMode(Mode.TITLE);
      const starters = generateStarter(this.scene);
      const selectStarterPhase = new SelectStarterPhase(this.scene, gameMode);
      this.scene.pushPhase(new EncounterPhase(this.scene, false));
      selectStarterPhase.initBattle(starters);
      await this.phaseInterceptor.run(EncounterPhase);
      await this.phaseInterceptor.run(PostSummonPhase);
      await this.phaseInterceptor.run(ToggleDoublePositionPhase);
      this.onNextPrompt("CheckSwitchPhase", Mode.CONFIRM, () => {
        this.setMode(Mode.MESSAGE);
        this.endPhase();
      });
      await this.phaseInterceptor.run(CheckSwitchPhase);
      await this.phaseInterceptor.run(PostSummonPhase);
      await this.phaseInterceptor.run(ShowAbilityPhase, () => this.isCurrentPhase(TurnInitPhase));
      await this.phaseInterceptor.run(MessagePhase, () => this.isCurrentPhase(TurnInitPhase));
      await this.phaseInterceptor.run(TurnInitPhase);
      await this.phaseInterceptor.run(CommandPhase);
      return resolve();
    });
  }

  doAttack(moveIndex, pokemonIndex= 0, target= 0): Promise<void> {
    const mode = this.scene.ui?.getMode();
    return new Promise(async (resolve, reject) => {
      if (mode !== Mode.COMMAND) {
        return reject("Invalid mode");
      }
      this.scene.ui.setMode(Mode.FIGHT, (this.scene.getCurrentPhase() as CommandPhase).getFieldIndex());
      await waitUntil(() => this.scene.ui.getMode() === Mode.FIGHT);
      const movePosition = await this.getMovePosition(this.scene, pokemonIndex, moveIndex);
      (this.scene.getCurrentPhase() as CommandPhase).handleCommand(Command.FIGHT, movePosition, false);

      //Message if opp is KO, Command if waiting for player to choose next action
      await waitUntil(() => (this.isVictory() && this.scene.ui?.getMode() === Mode.MESSAGE) || this.scene.ui?.getMode() === Mode.COMMAND);
      return resolve();
    });
  }

  doAttackDouble(moveIndex, moveIndex2, target= 0, target2): Promise<void> {
    const mode = this.scene.ui?.getMode();
    return new Promise(async (resolve, reject) => {
      if (mode !== Mode.COMMAND) {
        return reject("Invalid mode");
      }
      this.scene.ui.setMode(Mode.FIGHT, (this.scene.getCurrentPhase() as CommandPhase).getFieldIndex());
      await waitUntil(() => this.scene.ui.getMode() === Mode.FIGHT);
      const movePosition = await getMovePosition(this.scene, 0, moveIndex);
      const movePosition2 = await getMovePosition(this.scene, 1, moveIndex2);
      (this.scene.getCurrentPhase() as CommandPhase).handleCommand(Command.FIGHT, movePosition, false);
      if (this.scene.currentBattle.double) {
        await waitUntil(() => this.scene.ui?.getMode() === Mode.TARGET_SELECT);
        let targetHandler = this.scene.ui.getHandler() as TargetSelectUiHandler;
        targetHandler.processInput(Button.ACTION);
        await waitUntil(() => this.scene.ui.getMode() === Mode.COMMAND);
        this.scene.ui.setMode(Mode.FIGHT, (this.scene.getCurrentPhase() as CommandPhase).getFieldIndex());
        await waitUntil(() => this.scene.ui.getMode() === Mode.FIGHT);
        (this.scene.getCurrentPhase() as CommandPhase).handleCommand(Command.FIGHT, movePosition2, false);
        await waitUntil(() => this.scene.ui?.getMode() === Mode.TARGET_SELECT);
        targetHandler = this.scene.ui.getHandler() as TargetSelectUiHandler;
        targetHandler.processInput(Button.ACTION);
      }


      //Message if opp is KO, Command if waiting for player to choose next action
      await waitUntil(() => (this.isVictory() && this.scene.ui?.getMode() === Mode.MESSAGE) || this.scene.ui?.getMode() === Mode.COMMAND);
      return resolve();
    });
  }

  isVictory() {
    return this.scene.currentBattle.enemyParty.every(pokemon => pokemon.isFainted());
  }

  isCurrentPhase(phaseTarget) {
    const targetName = typeof phaseTarget === "string" ? phaseTarget : phaseTarget.name;
    return this.scene.getCurrentPhase().constructor.name === targetName;
  }

  exportSaveToTest(): Promise<string> {
    return new Promise(async (resolve) => {
      await this.scene.gameData.saveAll(this.scene, true, true, true, true);
      this.scene.reset(true);
      await waitUntil(() => this.scene.ui?.getMode() === Mode.TITLE);
      await this.scene.gameData.tryExportData(GameDataType.SESSION, 0);
      await waitUntil(() => localStorage.hasOwnProperty("toExport"));
      return resolve(localStorage.getItem("toExport"));
    });
  }
}
