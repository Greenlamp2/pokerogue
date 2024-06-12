import BattleScene from "#app/battle-scene.js";
import {addWindow} from "#app/ui/ui-theme";
import {addTextObject, TextStyle} from "#app/ui/text";
import {PlayerPokemon} from "#app/field/pokemon";
import i18next from "i18next";
import {languageSettings} from "#app/ui/starter-select-ui-handler";
import PokemonIconAnimHandler from "#app/ui/pokemon-icon-anim-handler";
import * as Utils from "#app/utils";
import {Ability} from "#app/data/ability";

export default class PokemonCard extends Phaser.GameObjects.Container {
  public scene: BattleScene;
  private test: Phaser.GameObjects.Text;
  public width: number;
  public height: number;
  private shinyOverlay: Phaser.GameObjects.Image;
  private pokemon: PlayerPokemon;
  private iconAnimHandler: PokemonIconAnimHandler;
  private pokemonNumberText: Phaser.GameObjects.Text;
  private pokemonSprite: Phaser.GameObjects.Sprite;
  private pokemonNameText: Phaser.GameObjects.Text;
  private pokemonGenderText: Phaser.GameObjects.Text;
  private pokemonAbilityLabelText: Phaser.GameObjects.Text;
  private pokemonAbilityText: Phaser.GameObjects.Text;

  constructor(scene: BattleScene, x:number, y:number, width: number, height: number) {
    super(scene, x, y);
    this.scene = scene;
    this.width = width;
    this.height = height;
    this.setup();
  }

  setup(): void {
    const currentLanguage = i18next.resolvedLanguage;
    const langSettingKey = Object.keys(languageSettings).find(lang => currentLanguage.includes(lang));
    const textSettings = languageSettings[langSettingKey];

    const background = addWindow(this.scene, 0, 0, this.width, this.height);
    background.setOrigin(0, 0);
    this.add(background);

    this.shinyOverlay = this.scene.add.image(6, 5, "summary_overlay_shiny");
    this.shinyOverlay.setOrigin(0, 0);
    this.shinyOverlay.setVisible(false);
    this.add(this.shinyOverlay);

    this.iconAnimHandler = new PokemonIconAnimHandler();
    this.iconAnimHandler.setup(this.scene);

    this.pokemonNumberText = addTextObject(this.scene, 19, 1, "0000", TextStyle.SUMMARY);
    this.pokemonNumberText.setOrigin(0, 0);
    this.add(this.pokemonNumberText);

    this.pokemonNameText = addTextObject(this.scene, 45, 1, "", TextStyle.SUMMARY);
    this.pokemonNameText.setOrigin(0, 0);
    this.add(this.pokemonNameText);

    this.pokemonGenderText = addTextObject(this.scene, 96, 1, "", TextStyle.SUMMARY_ALT);
    this.pokemonGenderText.setOrigin(0, 0);
    this.add(this.pokemonGenderText);

    const starterInfoTextSize = textSettings?.starterInfoTextSize || 56;
    this.pokemonAbilityLabelText = addTextObject(this.scene, 6, 11 , i18next.t("starterSelectUiHandler:ability"), TextStyle.SUMMARY_ALT, { fontSize: starterInfoTextSize });
    this.pokemonAbilityLabelText.setOrigin(0, 0);
    this.add(this.pokemonAbilityLabelText);

    this.pokemonAbilityText = addTextObject(this.scene, 6, 18, "", TextStyle.SUMMARY_ALT, { fontSize: starterInfoTextSize });
    this.pokemonAbilityText.setOrigin(0, 0);
    this.add(this.pokemonAbilityText);
  }

  setPokemon(pokemon: PlayerPokemon): void {
    if (!pokemon) {
      return;
    }
    this.pokemon = pokemon;
    this.update();
  }

  update() {
    if (this.pokemon.shiny) {
      this.shinyOverlay.setVisible(true);
    } else {
      this.shinyOverlay.setVisible(false);
    }
    this.pokemonNumberText.setText(Utils.padInt(this.pokemon.species.speciesId, 4));
    this.pokemonNameText.setText(this.pokemon.name);
    const ability = new Ability(this.pokemon.abilityIndex, 3); // 0 - mean ability1
    ability.localize();
    this.pokemonAbilityText.setText(ability.name);

  }

  clear(): void {
    // this.test.setText("");
    this.shinyOverlay.setVisible(false);
    this.pokemonNumberText.setText("");
    this.pokemonNameText.setText("");
    this.pokemonAbilityText.setText("");
  }
}
