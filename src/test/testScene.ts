export default class TestScene extends Phaser.Scene {
  constructor() {
    super();
  }

  create() {
    console.log('created !');
    this.add.text(100, 100, "Hello World!", {fill: "#ffffff"});
  }

  getHelloWorld() {
    return "hello world";
  }
}