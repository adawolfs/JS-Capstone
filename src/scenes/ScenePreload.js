import Phaser from 'phaser';

class ScenePreload extends Phaser.Scene {
  constructor() {
    super({ key: 'ScenePreload' });
  }

  create() {
    this.scene.start('SceneIntro');
  }

}

export default ScenePreload;