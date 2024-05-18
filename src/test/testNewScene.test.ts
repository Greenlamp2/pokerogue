import {beforeEach, describe, expect, it, vi, afterEach, test} from "vitest";
async function importModule() {
  try {
    // Dynamically import the module
    const { SpeciesFormKey } = await import('#app/enums/speciesFormKey');
    // const { getPokemonSpecies } = await import('#app/data/pokemon-species');
    // const { FormChangePhase } = await import('#app/form-change-phase');
    const { WeatherType } = await import('#app/data/weather');
    return {
        SpeciesFormKey,
        WeatherType
        // FormChangePhase
        // getPokemonSpecies
    };
  } catch (error) {
    // Log the error stack trace
    console.error('Error during import:', error.stack);
    // Rethrow the error to ensure the test fails
    throw error;
  }
}

// Define the test
test('import pokemon-species module', async () => {
  const module = await importModule();
  // Example assertion
  expect(module.SpeciesFormKey).toBeDefined();
});

// // Define the test
// test('import getPokemonSpecies module', async () => {
//   const module = await importModule();
//   // Example assertion
//   expect(module.getPokemonSpecies).toBeDefined();
// });

// // Define the test
// test('import FormChangePhase module', async () => {
//   const module = await importModule();
//   // Example assertion
//   expect(module.FormChangePhase).toBeDefined();
// });

// Define the test
test('import WeatherType module', async () => {
  const module = await importModule();
  // Example assertion
  expect(module.WeatherType).toBeDefined();
});
// describe("big tests", () => {
//     let pokemon;
//     let species;
//     beforeEach(async () => {
// 		// initSpecies();
// 		// initMoves();
// 		// initAbilities();
//         // pokemon = new PlayerPokemon(this, species, 1, undefined, undefined, undefined, false, undefined, undefined, undefined, undefined);
//     })
//
//     it('should create a species', () => {
//         expect(SpeciesFormKey).not.toBeUndefined();
//     });
//
//     it('should create a species', () => {
//         species = getPokemonSpecies(Species.MEW);
//         expect(species).not.toBeNull();
//     });
//
//     // it('should create a pokemon', () => {
//     //     expect(pokemon).not.toBeNull();
//     // });
// });