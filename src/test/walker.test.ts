import {beforeAll, describe, expect, it} from "vitest";
import {initStatsKeys} from "#app/ui/game-stats-ui-handler";
import {initPokemonPrevolutions} from "#app/data/pokemon-evolutions";
import {initBiomes} from "#app/data/biomes";
import {initEggMoves} from "#app/data/egg-moves";
import {initPokemonForms} from "#app/data/pokemon-forms";
import {initMoves} from "#app/data/move";
import {initAbilities} from "#app/data/ability";
import {initSpecies} from "#app/data/pokemon-species";
import {MoneyAchv} from "#app/system/achv";

describe("big tests", () => {
    beforeAll(async () => {
        initStatsKeys();
        initPokemonPrevolutions();
        initBiomes();
        initEggMoves();
        initPokemonForms();
        initSpecies();
        initMoves();
        initAbilities();
    })

    it ('should check achv', () => {
        const ach = new MoneyAchv("Achivement", 1000, null, 100);
        expect(ach.name).toBe("Achivement");
    });
});