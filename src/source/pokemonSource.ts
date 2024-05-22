import {default as PokemonSpecies} from "#app/data/pokemon-species";
import {PokeballType} from "#app/data/pokeball";
import {Gender} from "#app/data/gender";
import {Variant} from "#app/data/variant";
import {Nature} from "#app/data/nature";
import {
  FieldPosition,
  PokemonBattleData,
  PokemonBattleSummonData,
  PokemonMove,
  PokemonSummonData,
  PokemonTurnData
} from "#app/field/pokemon";
import {Status} from "#app/data/status-effect";
import {Biome} from "#app/data/enums/biome";


export class PokemonSource {
  public id: integer;
  public species: PokemonSpecies;
  public pokeball: PokeballType;
  public level: integer;
  public formIndex: integer;
  public gender: Gender;
  public shiny: boolean;
  public abilityIndex: integer;
  public name: string;
  public variant: Variant;
  public exp: integer;
  public levelExp: integer;
  public hp: integer;
  public stats: integer[];
  public ivs: integer[];
  public passive: boolean;
  public nature: Nature;
  public natureOverride: Nature | -1;
  public moveset: PokemonMove[];
  public status: Status;
  public friendship: integer;
  public metLevel: integer;
  public luck: integer;
  public metBiome: Biome | -1;
  public pauseEvolutions: boolean;
  public pokerus: boolean;
  public fusionSpecies: PokemonSpecies;
  public fusionFormIndex: integer;
  public fusionAbilityIndex: integer;
  public fusionShiny: boolean;
  public fusionVariant: Variant;
  public fusionGender: Gender;
  public fusionLuck: integer;
  private summonDataPrimer: PokemonSummonData;
  public summonData: PokemonSummonData;
  public battleData: PokemonBattleData;
  public battleSummonData: PokemonBattleSummonData;
  public turnData: PokemonTurnData;
  public fieldPosition: FieldPosition;


  constructor() {

  }
}