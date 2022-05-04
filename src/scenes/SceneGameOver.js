import Phaser from 'phaser';
import ScrollingBackground from '../entities/entityScrollingBackground';
import { getLocalScores } from '../localStorage';
import { submitHighScore } from '../leaderboardCall';

class SceneGameOver extends Phaser.Scene {
  constructor() {
    super({ key: 'SceneGameOver' });
  }

  preload() {
    this.load.audio('gameOver', 'content/swImperialMarch.mp3');
    this.load.image('vader', 'content/vaderGameOver.jpg');
    this.load.image('gameOverTitle', 'content/titleGameOver2.png');
  }

  create() {
    this.gameOverTitle = this.add.image(
      this.game.config.width * 0.5,
      this.game.config.height * 0.1,
      'gameOverTitle',
    );

    if (window.mobileCheck()) {
      this.gameOverTitle.setScale(window.innerWidth / this.gameOverTitle.width );
    }

    this.gameOverImage = this.add.image(
      this.game.config.width * 0.5,
      this.game.config.height * 0.4,
      'vader',
    );

    if (window.mobileCheck()) {
      this.gameOverImage.setScale(window.innerWidth /this.gameOverImage.width );
    }

    this.scores = getLocalScores();
    this.gameOverSceneScore = this.add.text(
      this.game.config.width * 0.5,
      this.game.config.height * 0.6,
      `Score: ${this.scores[0]}`, {
        color: '#d0c600',
        fontFamily: 'sans-serif',
        fontSize: '30px',
        lineHeight: 1.3,
        align: 'center',
      },
    );

    this.sfx = {
      btnOver: this.sound.add('sndBtnOver', { volume: 0.1 }),
      btnDown: this.sound.add('sndBtnDown', { volume: 0.1 }),
    };

    this.song = this.sound.add('gameOver', { volume: 0.3 });
    this.song.play();

    this.btnRestart = this.add.sprite(
      this.game.config.width * 0.5,
      this.game.config.height * 0.9,
      'sprBtnRestart',
    );

    this.btnRestart.setInteractive();
    this.createButton(this.btnRestart, 'sprBtnRestart', 'sprBtnRestartHover', 'sprBtnRestartDown');
    this.btnRestart.on('pointerup', () => {
      this.btnRestart.setTexture('sprBtnRestart');
      this.song.stop();
      this.scene.start('SceneMain');
    }, this);

    this.btnRecord = this.add.sprite(
      this.game.config.width * 0.85,
      this.game.config.height * 0.9,
      'sprBtnRecord',
    );

    this.btnRecord.setInteractive();
    this.createButton(this.btnRecord, 'sprBtnRecord', 'sprBtnRecordHover', 'sprBtnRecordDown');
    this.btnRecord.on('pointerup', () => {
      this.btnRecord.setTexture('sprBtnRecord');
      this.song.stop();
      this.scene.start('SceneLeaderBoard');
    }, this);

    this.btnAbout = this.add.sprite(
      this.game.config.width * 0.15,
      this.game.config.height * 0.9,
      'sprBtnAbout',
    );

    this.btnAbout.setInteractive();
    this.createButton(this.btnAbout, 'sprBtnAbout', 'sprBtnAboutHover', 'sprBtnAboutDown');
    this.btnAbout.on('pointerup', () => {
      this.btnAbout.setTexture('sprBtnAbout');
      this.song.stop();
      this.scene.start('SceneAbout');
    }, this);

    this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    this.backgrounds = [];
    for (let i = 0; i < 5; i += 1) {
      const keys = ['sprBg0', 'sprBg1'];
      const key = keys[Phaser.Math.Between(0, keys.length - 1)];
      const bg = new ScrollingBackground(this, key, i * 10);
      this.backgrounds.push(bg);
    }

    this.userName = '';

    this.scoreForm = document.createElement('div');
    this.scoreForm.id = 'scoreForm';
    this.scoreForm.innerHTML = `
    <div id='scoreFormContainer' style="position: absolute;left: 1300px;top: 200px;">
      <input type="text" id="name" placeholder="Enter your name" style="font-size: 1.5rem width: ${this.game.config.width * 0.25}"><br>
      <input type="text" id="email" placeholder="Enter your email" style="font-size: 1.5rem width: ${this.game.config.width * 0.25}"><br>
      <input type="text" id="phone" placeholder="Enter your phone" style="font-size: 1.5rem width: ${this.game.config.width * 0.25}"><br>
      <input type="button" name="submitButton" value="Submit Score" style="font-size: 1.5rem">
    </div>
    `;

    // const container = document.getElementById('phaser');
    // container.appendChild(this.scoreForm);
    // this.scoreForm = document.getElementById('scoreForm');
    this.scoreForm.style = "background: red";


    const element = this.add.dom(500, 480, this.scoreForm);
    element.addListener('click');

    element.on('click', (event) => {
      if (event.target.name === 'submitButton') {
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const phoneInput = document.getElementById('phone');
        if (emailInput.value !== '' && nameInput.value !== '' && phoneInput.value !== '') {
          // element.removeListener('click');
          // element.setVisible(false);
          this.name = nameInput.value;
          this.email = emailInput.value;
          this.phone = phoneInput.value;
          this.submit = submitHighScore(this.name, this.email, this.phone, this.scores[0]);
          this.submit.then(() => {
            this.scene.scene.song.stop();
            this.scene.start('SceneLeaderBoard');
          });
        }
      }
    });
  }

  update() {
    for (let i = 0; i < this.backgrounds.length; i += 1) {
      this.backgrounds[i].update();
    }

    if (this.keySpace.isDown) {
      this.song.stop();
      this.scene.start('SceneMain');
    }
  }

  createButton(btn, spr, sprHover, sprDown) {
    btn.on('pointerover', () => {
      btn.setTexture(sprHover);
      this.sfx.btnOver.play();
    }, this);

    btn.on('pointerout', () => {
      btn.setTexture(spr);
    });

    btn.on('pointerdown', () => {
      btn.setTexture(sprDown);
      this.sfx.btnDown.play();
    }, this);
  }
}

export default SceneGameOver;