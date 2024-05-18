export class SceneTest extends Phaser.Scene {

    constructor(config: Phaser.Types.Scenes.SettingsConfig) {
        super(config);
    }

    create() {
        this.add.text(100, 100, 'Hello Phaser!', { fill: '#0f0' });
    }
}

const config = {
  type: Phaser.HEADLESS, // Headless mode for testing
  width: 800,
  height: 600,
  scene: SceneTest
};

const game = new Phaser.Game(config);

export default game;