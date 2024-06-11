import {afterEach, beforeAll, beforeEach, describe, expect, it} from "vitest";
import Phaser from "phaser";
import GameManager from "#app/test/utils/gameManager";
import {Species} from "#app/data/enums/species";
import {compress, decompress} from "#app/utils";


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

  it("export pokemon team to a compressed code", async() => {
    await game.runToSummon([
      Species.RATTATA,
      Species.GABITE,
      Species.DARKRAI,
      Species.MIGHTYENA,
      Species.ZACIAN,
      Species.ZEKROM
    ]);
    const codeTeam = game.scene.exportTeam();
    expect(codeTeam).toBe("19;98,39,33;0;9;1;0;1#444;328,33;0;19;2;0;0#491;228,466,50;0;20;0;0;0#262;555,336,33;0;5;2;0;1#888;533,98,232,44;0;1;0;0;0#644;225,422,568,246;0;10;0;0;0#");
    const a = codeTeam.endsWith("#") ? codeTeam.slice(0, -1) : codeTeam;
    expect(a).toBe("19;98,39,33;0;9;1;0;1#444;328,33;0;19;2;0;0#491;228,466,50;0;20;0;0;0#262;555,336,33;0;5;2;0;1#888;533,98,232,44;0;1;0;0;0#644;225,422,568,246;0;10;0;0;0");
    // 2) Formater tous les nombres pour avoir 3 chiffres
    const b = a.replace(/\d+/g, match => {
      return match.padStart(3, "0");
    });
    expect(b).toBe("019;098,039,033;000;009;001;000;001#444;328,033;000;019;002;000;000#491;228,466,050;000;020;000;000;000#262;555,336,033;000;005;002;000;001#888;533,098,232,044;000;001;000;000;000#644;225,422,568,246;000;010;000;000;000");
    // 3) Remplacer tous les 000 par N
    const c = b.replace(/000/g, "N");
    expect(c).toBe("019;098,039,033;N;009;001;N;001#444;328,033;N;019;002;N;N#491;228,466,050;N;020;N;N;N#262;555,336,033;N;005;002;N;001#888;533,098,232,044;N;001;N;N;N#644;225,422,568,246;N;010;N;N;N");
    // 4) Remplacer tous les , par C
    const d = c.replace(/,/g, "C");
    expect(d).toBe("019;098C039C033;N;009;001;N;001#444;328C033;N;019;002;N;N#491;228C466C050;N;020;N;N;N#262;555C336C033;N;005;002;N;001#888;533C098C232C044;N;001;N;N;N#644;225C422C568C246;N;010;N;N;N");
    // 5) Remplacer tous les # par K
    const e = d.replace(/#/g, "K");
    expect(e).toBe("019;098C039C033;N;009;001;N;001K444;328C033;N;019;002;N;NK491;228C466C050;N;020;N;N;NK262;555C336C033;N;005;002;N;001K888;533C098C232C044;N;001;N;N;NK644;225C422C568C246;N;010;N;N;N");
    // 6) Supprimer tous les ;
    const f = e.replace(/;/g, "");
    expect(f).toBe("019098C039C033N009001N001K444328C033N019002NNK491228C466C050N020NNNK262555C336C033N005002N001K888533C098C232C044N001NNNK644225C422C568C246N010NNN");
    // 7) if there is 3N in a row, replace the 3 N by a single W
    const g = f.replace(/N{3}/g, "W");
    expect(g).toBe("019098C039C033N009001N001K444328C033N019002NNK491228C466C050N020WK262555C336C033N005002N001K888533C098C232C044N001WK644225C422C568C246N010W");
    // 8) if there is 2N in a row, replace the 2 N by a single V
    const h = g.replace(/N{2}/g, "V");
    expect(h).toBe("019098C039C033N009001N001K444328C033N019002VK491228C466C050N020WK262555C336C033N005002N001K888533C098C232C044N001WK644225C422C568C246N010W");
    // if there is N00, replace the N00 by G
    const i = h.replace(/N00/g, "G");
    expect(i).toBe("019098C039C033G9001G1K444328C033N019002VK491228C466C050N020WK262555C336C033G5002G1K888533C098C232C044G1WK644225C422C568C246N010W");
    // replace C0 by U
    const j = i.replace(/C0/g, "U");
    expect(j).toBe("019098U39U33G9001G1K444328U33N019002VK491228C466U50N020WK262555C336U33G5002G1K888533U98C232U44G1WK644225C422C568C246N010W");
    // replace 33 by E
    const k = j.replace(/33/g, "E");
    expect(k).toBe("019098U39UEG9001G1K444328UEN019002VK491228C466U50N020WK262555CE6UEG5002G1K8885EU98C232U44G1WK644225C422C568C246N010W");
    // replace 01 by I
    const l = k.replace(/01/g, "I");
    expect(l).toBe("I9098U39UEG90IG1K444328UENI9002VK491228C466U50N020WK262555CE6UEG5002G1K8885EU98C232U44G1WK644225C422C568C246NI0W");
    // replace G1 by Q
    const m = l.replace(/G1/g, "Q");
    expect(m).toBe("I9098U39UEG90IQK444328UENI9002VK491228C466U50N020WK262555CE6UEG5002QK8885EU98C232U44QWK644225C422C568C246NI0W");
    // replace UE by S
    const n = m.replace(/UE/g, "S");
    expect(n).toBe("I9098U39SG90IQK444328SNI9002VK491228C466U50N020WK262555CE6SG5002QK8885EU98C232U44QWK644225C422C568C246NI0W");
    // replace 02 by A
    const o = n.replace(/02/g, "A");
    expect(o).toBe("I9098U39SG90IQK444328SNI90AVK491228C466U50NA0WK262555CE6SG50AQK8885EU98C232U44QWK644225C422C568C246NI0W");
    // replace 44 by Y
    const p = o.replace(/44/g, "Y");
    expect(p).toBe("I9098U39SG90IQKY4328SNI90AVK491228C466U50NA0WK262555CE6SG50AQK8885EU98C232UYQWK6Y225C422C568C246NI0W");
    // replace i9 by J
    const q = p.replace(/I9/g, "J");
    expect(q).toBe("J098U39SG90IQKY4328SNJ0AVK491228C466U50NA0WK262555CE6SG50AQK8885EU98C232UYQWK6Y225C422C568C246NI0W");
    // replace 98 by L
    const r = q.replace(/98/g, "L");
    expect(r).toBe("J0LU39SG90IQKY4328SNJ0AVK491228C466U50NA0WK262555CE6SG50AQK8885EULC232UYQWK6Y225C422C568C246NI0W");
    // replace 888 by B
    const s = r.replace(/888/g, "B");
    expect(s).toBe("J0LU39SG90IQKY4328SNJ0AVK491228C466U50NA0WK262555CE6SG50AQKB5EULC232UYQWK6Y225C422C568C246NI0W");

    expect(s).toBe(compress(codeTeam));
  }, 20000);

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
      Species.ZACIAN,
      Species.ZEKROM
    ]);

    expect(game.scene.getParty()[0].moveset.map((m) => m.moveId)).toStrictEqual([98, 39, 33]);
    expect(game.scene.getParty()[1].moveset.map((m) => m.moveId)).toStrictEqual([328, 33]);
    expect(game.scene.getParty()[2].moveset.map((m) => m.moveId)).toStrictEqual([228, 466, 50]);

    const codeTeam = game.scene.exportTeam();
    const expected = "19;98,39,33;0;9;1;0;1#444;328,33;0;19;2;0;0#491;228,466,50;0;20;0;0;0#262;555,336,33;0;5;2;0;1#888;533,98,232,44;0;1;0;0;0#644;225,422,568,246;0;10;0;0;0#";
    expect(expected).toBe(codeTeam);
    expect(compress(codeTeam)).toBe("J0LU39SG90IQKY4328SNJ0AVK491228C466U50NA0WK262555CE6SG50AQKB5EULC232UYQWK6Y225C422C568C246NI0W");
    expect(decompress(compress(codeTeam))).toBe(expected);
  }, 20000);

  it("import team with code", async() => {
    await game.runToSummon();
    const codeTeam = "J0LU39SG90IQKY4328SNJ0AVK491228C466U50NA0WK262555CE6SG50AQKB5EULC232UYQWK6Y225C422C568C246NI0W";
    const team = game.scene.importTeam(decompress(codeTeam));
    expect(team.length).toBe(6);
    expect(team[0].species.speciesId).toBe(Species.RATTATA);
    expect(team[1].species.speciesId).toBe(Species.GABITE);
    expect(team[2].species.speciesId).toBe(Species.DARKRAI);
    expect(team[3].species.speciesId).toBe(Species.MIGHTYENA);
    expect(team[4].species.speciesId).toBe(Species.ZACIAN);
    expect(team[5].species.speciesId).toBe(Species.ZEKROM);

    expect(team[0].moveset.map((m) => m.moveId)).toStrictEqual([98, 39, 33]);
    expect(team[1].moveset.map((m) => m.moveId)).toStrictEqual([328, 33]);
    expect(team[2].moveset.map((m) => m.moveId)).toStrictEqual([228, 466, 50]);
  });
});
