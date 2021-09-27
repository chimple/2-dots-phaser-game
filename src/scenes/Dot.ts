export default class Dot extends Phaser.Scene {
  constructor() {
    super("Dot");
  }
  private player: Phaser.GameObjects.Image;
  private width: number;
  private height: number;
  private startY: number;
  private distance: number;
  private ball1: Phaser.GameObjects.Image;
  private ball2: Phaser.GameObjects.Image;
  private scoreBoard: Phaser.GameObjects.Text;
  private score = 0;
  private gameOver = false;
  private tween: Phaser.Tweens.Tween;
  private highScore: any;
  private localStorageName = "highScore";
  private isFirst = true;
  private isBlue = true;
  private isEnd = true;
  private tweenBall1: Phaser.Tweens.Tween;
  private tweenBall2: Phaser.Tweens.Tween;
  private timer: any
  private counter = 10;
  private timeUP: any;
  private timeText: any;

  create() {
    this.width = this.scale.width;
    this.height = this.scale.height;
    this.startY = this.height / 4;
    this.distance = this.height * 0.75;
    this.player = this.add
      .image(this.width / 2, this.distance - 40 , "blue1")
      .setData('color', 'blue')
      .setScale(0.5);
    this.ball1 = this.add
      .image(this.width / 2.5, this.startY, "blueball")
      .setScale(0.5);
    this.ball1.setData('color', 'blue');
    this.ball2 = this.add
      .image((this.width / 2.5) + 90 , this.startY, "redball")
      .setScale(0.5);
    this.ball2.setData('color', 'red');
    this.scoreBoard = this.add
      .text(this.width/8, 0, "00")
      .setFontSize(45)
      .setFontFamily("agencyr")
      .setColor("#000000")
      .setOrigin(0.5, 0);

      this.timeText = this.make.text({
        x: this.width / 2,
        y: this.height * 0.08,
        text: '10',
        style: {
            fontSize: '45px',
            color: '#000000',
            align: 'center',
            fontFamily: 'agencyr'
        },
        add: true
    });

      this.timeUP = this.make.text({
        x: this.width / 4 ,
        y: this.height / 2,
        text: '',
        style: {
            fontSize: '60px',
            color: '#aa393f',
            align: 'center',
            fontFamily: 'Zekton'
        },
        add: true
    });

    this.tweenBall1 = this.tweens.add({
        targets: this.ball1,
        anchor: 0.5,
        yoyo: true,
        repeat: -1,
        ease: 'Quintic.easeInOut',
        onUpdate: () =>
            Phaser.Actions.RotateAround([this.ball1], { x: (this.width / 2.5) + 51, y: this.startY }, 0.07)
    });

    this.tweenBall2 = this.tweens.add({
      targets: this.ball2,
      anchor: 0.5,
      yoyo: true,
      repeat: -1,
      ease: 'Quintic.easeInOut',
      onUpdate: () =>
          Phaser.Actions.RotateAround([this.ball2], { x: (this.width / 2.5) + 60, y: this.startY   }, 0.07)
  });

    this.tween = this.tweens.add({
      timeScale: 1,
      anchor: 0.0,
      targets: this.player,
      x: this.width / 2,
      y: this.startY + 85 ,
      yoyo: true,
      onComplete: () => {
        this.isEnd = true;
        if (this.isFirst) {
          this.isFirst = false;
        } else {
          this.onCollition(true);
        }
      },
      paused: true
    });

    this.timer = this.time.addEvent({
      callback: this.timerEventCallBack,
      callbackScope: this,
      delay: 1000,
      loop:true
  });
    
    this.highScore =
      localStorage.getItem(this.localStorageName) == null
        ? 0
        : localStorage.getItem(this.localStorageName);
    this.input.on(
      "pointerdown",
      () => {
        if (!this.gameOver) this.onClick();
      },
      this
    );
  }

  timerEventCallBack() {
    if(this.counter > 0) {
      this.timeText.setText(this.counter);
        this.counter--;
        
    }
    else {
      this.sound.play("gameover");
      this.tween.stop();
      this.tweenBall1.stop();
      this.tweenBall2.stop();
      this.gameOver = true;
    this.timeUP.setText('TIME UP!!');
    setTimeout(() => {
      this.scene.start("StartScreen", {
        score: this.score,
        isGameOver: true,
      });
      this.scene.remove("Pong");
    }, 1000);
}
}

  onCollition(isUp: boolean) {
    var isSameColor : boolean;
    this.sound.play("collide");
    if((this.width / 2- this.ball1.x) > (this.ball2.x - this.width / 2) ) {
      if(this.ball2.getData('color') === 
      this.player.getData('color')) {
        isSameColor = true;
      }
      else {
        isSameColor = false;
      }
    }
    else {
      if(this.ball1.getData('color') === 
      this.player.getData('color')) {
        isSameColor = true;
      }
      else {
        isSameColor = false;
      }
    }
    console.log(this.width / 2);
    console.log(this.ball1.x);
    console.log(this.ball2.x);
    console.log(isSameColor);
    if (isSameColor) {
      this.score++;
      this.scoreBoard.setText(
        (this.score < 10 ? "0" : "") + this.score.toString()
      );
      const value = Phaser.Math.Between(0, 1);
      if (value === 0) {
        this.isBlue = true;
        this.player.setTexture(isUp ? "blue1" : "blue2").setData('color', 'blue');
      } else {
        this.isBlue = false;
        this.player.setTexture(isUp ? "red1" : "red2").setData('color', 'red');
      }

    } else {
      if (Number(this.highScore) < this.score) {
        localStorage.setItem(this.localStorageName, this.score.toString());
        this.highScore = this.score;
      }
      this.sound.play("gameover");
      this.tween.stop();
      this.tweenBall1.stop();
      this.tweenBall2.stop();
      this.timer.destroy();
      this.gameOver = true;
      this.add
        .text(this.width / 2, this.height / 2, "Game Over")
        .setFontSize(60)
        .setColor("#aa393f")
        .setFontStyle("bold")
        .setFontFamily("Zekton")
        .setOrigin(0.5);
      setTimeout(() => {
        this.scene.start("StartScreen", {
          score: this.score,
          isGameOver: true,
        });
        this.scene.remove("Pong");
      }, 1000);
    }
  }
  onClick() {
    this.sound.play("tap");
    this.counter = 10;
    this.tween.play();
  }
}
