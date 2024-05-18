import {beforeAll, describe, expect, it} from "vitest";
import {initStatsKeys} from "#app/ui/game-stats-ui-handler";
import {initPokemonPrevolutions} from "#app/data/pokemon-evolutions";
import {initBiomes} from "#app/data/biomes";
import {initEggMoves} from "#app/data/egg-moves";
import {initPokemonForms} from "#app/data/pokemon-forms";
import {initMoves} from "#app/data/move";
import {initAbilities} from "#app/data/ability";
import {getPokemonSpecies, initSpecies} from "#app/data/pokemon-species";
import {PokemonMove} from "#app/field/pokemon";
import {Species} from "#app/data/enums/species";
import {PokemonFactory} from "#app/test/factories/pokemonFactory";
import {BattleFactory} from "#app/test/factories/battleFactory";
import {Moves} from "#app/data/enums/moves";
import {MoneyAchv} from "#app/system/achv";

// async function importModule() {
//   try {
//       initStatsKeys();
//       initPokemonPrevolutions();
//       initBiomes();
//       initEggMoves();
//       initPokemonForms();
//       initSpecies();
//       initMoves();
//       initAbilities();
//     const { PlayerPokemon } = await import('#app/field/pokemon');
//     return {
//       PlayerPokemon
//     }
//     // Dynamically import the module
//   } catch (error) {
//     // Log the error stack trace
//     console.error('Error during import:', error.stack);
//     // Rethrow the error to ensure the test fails
//     throw error;
//   }
// }

// test('import PlayerPokemon module', async () => {
//   const module = await importModule();
//   // Example assertion
//   expect(module.PlayerPokemon).toBeDefined();
// });

// // Define the test
// test('import FormChangePhase module', async () => {
//   const module = await importModule();
//   // Example assertion
//   expect(module.FormChangePhase).toBeDefined();
// });

// Define the test
// test('import WeatherType module', async () => {
//   const module = await importModule();
//   // Example assertion
//   expect(module.WeatherType).toBeDefined();
// });

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
    it('should create a species', () => {
        const species = getPokemonSpecies(Species.MEW);
        expect(species).not.toBeNull();
    });

    it('should create a pokemon', () => {
        const pokemon = new PokemonFactory({
            species: Species.MEW,
            level: 1,
        });
        expect(pokemon).not.toBeNull();
        expect(pokemon.level).toEqual(1);
        expect(pokemon.species).toEqual(Species.MEW);
    });

    it('should generate a moveset', () => {
        const pokemon = new PokemonFactory({
            species: Species.MEW,
            level: 1,
        });
        expect(pokemon.moveset[0].moveId).toBe(Moves.TACKLE);
        expect(pokemon.moveset[1].moveId).toBe(Moves.GROWL);
    });

    it('should create an ennemypokemon', () => {
        const ennemyPokemon = new PokemonFactory({
            species: Species.MEWTWO,
            level: 100,
        });
        expect(ennemyPokemon).not.toBeNull();
        expect(ennemyPokemon.level).toEqual(100);
        expect(ennemyPokemon.species).toEqual(Species.MEWTWO);
    });

    it('should create an ennemypokemon with specified moveset', () => {
        const ennemyPokemon = new PokemonFactory({
            species: Species.MEWTWO,
            level: 100,
            moveset: [
                new PokemonMove(Moves.ACID),
                new PokemonMove(Moves.ACROBATICS),
                new PokemonMove(Moves.FOCUS_ENERGY),
            ]
        });
        expect(ennemyPokemon.moveset[0].moveId).toBe(Moves.ACID);
        expect(ennemyPokemon.moveset[1].moveId).toBe(Moves.ACROBATICS);
        expect(ennemyPokemon.moveset[2].moveId).toBe(Moves.FOCUS_ENERGY);
    });

    it('test a new battle with 1 move used by player', () => {
        const pokemon = new PokemonFactory({
            species: Species.MEW,
            level: 1,
        });
        const ennemyPokemon = new PokemonFactory({
            species: Species.MEWTWO,
            level: 100,
        });
        const battle = new BattleFactory({
            player: [pokemon],
            opponent: [ennemyPokemon],
        })
        battle.newTurn().noPokemonSwap().playerPokemon(pokemon).doMove(pokemon.moveset[0]).target(ennemyPokemon).confirm();
        expect(battle.playMove(0).computeDamageReceived(ennemyPokemon).damageReceived[0]).toBe(12);
    });

    it ('should check achv', () => {
        const ach = new MoneyAchv("Achivement", 1000, null, 100);
        expect(ach.name).toBe("Achivement");
    });
});