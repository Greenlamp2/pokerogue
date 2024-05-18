import PokemonData from "#app/system/pokemon-data";
import {Species} from "#app/data/enums/species";
import {Moves} from "#app/data/enums/moves";


export class PokemonFactory {
    private source: PokemonData;

    constructor(data) {
        this.source = new PokemonData({
            species: data.species,
            level: data.level,
            moveset: data.moveset,
        });
    }

    get level() {
        return this.source.level;
    }

    get species() {
        return this.source.species;
    }

    get moveset() {
        return this.source.moveset;
    }
}