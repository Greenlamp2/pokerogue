import {afterEach, beforeAll, beforeEach, describe, expect, it} from "vitest";
import Phaser from "phaser";
import GameManager from "#app/test/utils/gameManager";
import {Species} from "#app/data/enums/species";
import {decompress} from "#app/utils";
import { NATURES} from "pokenode-ts";
import { Gender } from "#app/data/gender.js";


describe("Export team feature", () => {
  let phaserGame: Phaser.Game;
  let game: GameManager;

  beforeAll(() => {
    phaserGame = new Phaser.Game({
      type: Phaser.HEADLESS,
    });
  });

  afterEach(() => {
    game.phaseInterceptor.restoreOg();
  });

  beforeEach(() => {
    game = new GameManager(phaserGame);
  });

  it("from a compressed code, import pokemon team", async() => {
    const expected = "19;98,39,33;0;9;1;0;1#444;328,33;0;19;2;0;0#491;228,466,50;0;20;0;0;0#262;555,336,33;0;5;2;0;1#888;533,98,232,44;0;1;0;0;0#644;225,422,568,246;0;10;0;0;0#";
    const codeTeam = "J0LU39SG90IQKY4328SNJ0AVK491228C466U50NA0WK262555CE6SG50AQKB5EULC232UYQWK6Y225C422C568C246NI0W";

    expect(expected).toBe(decompress(codeTeam));
  }, 20000);

  it("export a team - retrieve the code and check if the code is correct", async() => {
    await game.runToSummon([
      Species.RATTATA,
      Species.GABITE,
      Species.DARKRAI,
      Species.MIGHTYENA,
    ]);

    expect(game.scene.getParty()[0].moveset.map((m) => m.moveId)).toStrictEqual([98, 39, 33]);
    expect(game.scene.getParty()[1].moveset.map((m) => m.moveId)).toStrictEqual([328, 33]);
    expect(game.scene.getParty()[2].moveset.map((m) => m.moveId)).toStrictEqual([228, 466, 50]);
    expect(game.scene.getParty()[3].moveset.map((m) => m.moveId)).toStrictEqual([555, 336, 33]);

    expect(game.scene.getParty()[0].shiny).toBe(false);
    expect(game.scene.getParty()[1].shiny).toBe(false);
    expect(game.scene.getParty()[2].shiny).toBe(false);
    expect(game.scene.getParty()[3].shiny).toBe(false);

    expect(game.scene.getParty()[0].nature).toBe(NATURES.GENTLE);
    expect(game.scene.getParty()[1].nature).toBe(NATURES.QUIRKY);
    expect(game.scene.getParty()[2].nature).toBe(NATURES.NAIVE);
    expect(game.scene.getParty()[3].nature).toBe(NATURES.TIMID);

    expect(game.scene.getParty()[0].gender).toBe(Gender.MALE);
    expect(game.scene.getParty()[1].gender).toBe(Gender.FEMALE);
    expect(game.scene.getParty()[2].gender).toBe(Gender.GENDERLESS);
    expect(game.scene.getParty()[3].gender).toBe(Gender.FEMALE);

    expect(game.scene.getParty()[0].variant).toBe(0);
    expect(game.scene.getParty()[1].variant).toBe(0);
    expect(game.scene.getParty()[2].variant).toBe(0);
    expect(game.scene.getParty()[3].variant).toBe(0);

    expect(game.scene.getParty()[0].abilityIndex).toBe(1);
    expect(game.scene.getParty()[1].abilityIndex).toBe(0);
    expect(game.scene.getParty()[2].abilityIndex).toBe(0);
    expect(game.scene.getParty()[3].abilityIndex).toBe(1);

    const codeTeam = game.scene.exportTeam();
    const expected = "19;98,39,33;0;9;1;0;1#444;328,33;0;19;2;0;0#491;228,466,50;0;20;0;0;0#262;555,336,33;0;5;2;0;1#";
    expect(codeTeam).toBe("J0LU39SG90IQKY4328SNJ0AVK491228C466U50NA0WK262555CE6SG50AQ");
    expect(decompress(codeTeam)).toBe(expected);
  }, 20000);

  it("import team with code", async() => {
    await game.runToSummon();
    const codeTeam = "J0LU39SG90IQKY4328SNJ0AVK491228C466U50NA0WK262555CE6SG50AQ";
    const team = game.scene.importTeam(codeTeam);
    expect(team.length).toBe(4);
    expect(team[0].species.speciesId).toBe(Species.RATTATA);
    expect(team[1].species.speciesId).toBe(Species.GABITE);
    expect(team[2].species.speciesId).toBe(Species.DARKRAI);
    expect(team[3].species.speciesId).toBe(Species.MIGHTYENA);

    expect(team[0].moveset.map((m) => m.moveId)).toStrictEqual([98, 39, 33]);
    expect(team[1].moveset.map((m) => m.moveId)).toStrictEqual([328, 33]);
    expect(team[2].moveset.map((m) => m.moveId)).toStrictEqual([228, 466, 50]);
    expect(team[3].moveset.map((m) => m.moveId)).toStrictEqual([555, 336, 33]);

    expect(team[0].shiny).toBe(false);
    expect(team[1].shiny).toBe(false);
    expect(team[2].shiny).toBe(false);
    expect(team[3].shiny).toBe(false);

    expect(team[0].nature).toBe(NATURES.GENTLE);
    expect(team[1].nature).toBe(NATURES.QUIRKY);
    expect(team[2].nature).toBe(NATURES.NAIVE);
    expect(team[3].nature).toBe(NATURES.TIMID);

    expect(team[0].gender).toBe(Gender.MALE);
    expect(team[1].gender).toBe(Gender.FEMALE);
    expect(team[2].gender).toBe(Gender.GENDERLESS);
    expect(team[3].gender).toBe(Gender.FEMALE);

    expect(team[0].variant).toBe(0);
    expect(team[1].variant).toBe(0);
    expect(team[2].variant).toBe(0);
    expect(team[3].variant).toBe(0);

    expect(team[0].abilityIndex).toBe(1);
    expect(team[1].abilityIndex).toBe(0);
    expect(team[2].abilityIndex).toBe(0);
    expect(team[3].abilityIndex).toBe(1);
  });
});
