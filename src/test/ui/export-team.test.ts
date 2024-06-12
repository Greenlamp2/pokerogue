import {afterEach, beforeAll, beforeEach, describe, expect, it} from "vitest";
import Phaser from "phaser";
import GameManager from "#app/test/utils/gameManager";
import {Species} from "#app/data/enums/species";
import {compress, decompress} from "#app/utils";
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

    expect(game.scene.getParty()[0].passive).toBeUndefined();
    expect(game.scene.getParty()[1].passive).toBeUndefined();
    expect(game.scene.getParty()[2].passive).toBeUndefined();
    expect(game.scene.getParty()[3].passive).toBeUndefined();

    const codeTeam = game.scene.exportTeam(false);
    expect(decompress(compress(codeTeam))).toBe(codeTeam);
  }, 20000);

  it("import team with code", async() => {
    await game.runToSummon();
    const codeTeam = "J0LU39SG90IQNKY4328SNJ0AWK491228C466U50NA0WNK262555CE6SG50AQN";
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

    expect(team[0].passive).toBe(false);
    expect(team[1].passive).toBe(false);
    expect(team[2].passive).toBe(false);
    expect(team[3].passive).toBe(false);
  });

  it("export test team to only what's available", async() => {
    await game.runToSummon([
      Species.BULBASAUR,
      Species.SQUIRTLE,
      Species.ZACIAN
    ]);
    // Bulbasaur, Squirtle, Zacian
    const codeTeam = game.scene.exportTeam();
    expect(codeTeam).not.toBeUndefined();
  });
  it("import only what's available", async() => {
    await game.runToSummon();
    // Bulbasaur, Squirtle, Zacian
    const codeTeam = "0IA2U45SG90IWK007055SU39NJ0IWKB5ECE6ULUYNI0WN";
    const team = game.scene.importTeam(codeTeam, true);
    expect(team.length).toBe(2);
  });
});
