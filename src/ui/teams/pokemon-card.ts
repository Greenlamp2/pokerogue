import BattleScene from "#app/battle-scene.js";
import {addWindow} from "#app/ui/ui-theme";
import {addTextObject, TextStyle} from "#app/ui/text";
import {PlayerPokemon} from "#app/field/pokemon";

export default class PokemonCard extends Phaser.GameObjects.Container {
  public scene: BattleScene;
  private test: Phaser.GameObjects.Text;
  public width: number;
  public height: number;

  constructor(scene: BattleScene, x:number, y:number, width: number, height: number) {
    super(scene, x, y);
    this.scene = scene;
    this.width = width;
    this.height = height;
    this.setup();
  }

  setup(): void {
    const background = addWindow(this.scene, 0, 0, this.width, this.height);
    background.setOrigin(0, 0);
    this.add(background);

    this.test = addTextObject(this.scene, 4, 0, "Test", TextStyle.SETTINGS_LABEL);
    this.test.setOrigin(0, 0);
    this.add(this.test);
  }

  setPokemon(pokemon: PlayerPokemon): void {
    if (!pokemon) {
      return;
    }
    this.test.setText(pokemon.species.getName());
  }

  clear(): void {
    this.test.setText("");
  }
}
