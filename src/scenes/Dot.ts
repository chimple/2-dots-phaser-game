export default class Dot extends Phaser.Scene {
  constructor() {
    super("Dot");
  }
  private player: Phaser.GameObjects.Image;
  private width: number;
  private height: number;
  private startY: number;
  private y: number;
  private distance: number;
  private ball1: Phaser.GameObjects.Image;
  private ball2: Phaser.GameObjects.Image;
  private scoreBoard: Phaser.GameObjects.Text;
  private score = 0;
  private gameOver = false;
  private tween: Phaser.Tweens.Tween;
  private highScore: any;
  private localStorageName = "highScore";
  private isBlue = true;
  private tweenBall1: Phaser.Tweens.Tween;
  private tweenBall2: Phaser.Tweens.Tween;
  private timer: any
  private counter = 3;
  private timeUP: any;
  private timeText: any;
  private isUp: boolean;

  create() {
    this.isUp = false;
    this.width = this.scale.width;
    this.height = this.scale.height;
    this.startY = this.height / 4;
    this.y = this.height / 2;
    this.distance = this.height * 0.75;
    this.createPlayer();
    this.ball1 = this.add
      .image(this.width / 2.5, this.y, "blueball")
      .setTexture('blueball')
      .setScale(0.5);
    this.ball1.setData('color', 'blue');
    this.ball2 = this.add
      .image((this.width / 2.5) + 90 , this.y, "redball")
      .setScale(0.5);
    this.ball2.setData('color', 'red');
    this.scoreBoard = this.add
      .text(this.width/8, 0, "00")
      .setFontSize(45)
      .setFontFamily("agencyr")
      .setColor("#000000")
      .setOrigin(0.5, 0);

      this.timeText = this.make.text({
        x: this.width * 0.9,
        y: 0.0,
        text: '3',
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
        y: this.height / 3,
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
        anchor: 0.0,
        yoyo: true,
        repeat: -1,
        ease: 'Quintic.easeInOut',
        onUpdate: () =>
            Phaser.Actions.RotateAround([this.ball1], { x: (this.width / 2.5) + 50.8, y: this.y }, 0.12)
    });

    this.tweenBall2 = this.tweens.add({
      targets: this.ball2,
      anchor: 0.0,
      yoyo: true,
      repeat: -1,
      ease: 'Quintic.easeInOut',
      onUpdate: () =>
          Phaser.Actions.RotateAround([this.ball2], { x: (this.width / 2.5) + 60, y: this.y   }, 0.12)
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
      this.scene.remove("Dot");
    }, 1000);
}
}

  createPlayer() {
    const playerValue = Phaser.Math.Between(0, 1);
    if(playerValue === 0) {
      this.player = this.add
      .image(this.width / 2, ((this.height*0.95) - 40) , "blue2")
      .setData('color', 'blue')
      .setScale(0.5);

      this.isUp = false;
      this.tween = this.tweens.add({
        duration: 350,
        targets: this.player,
        x: this.width / 2,
        y: this.y + 83 ,
        yoyo: false,
        onComplete: () => {
          this.onCollition();
        },
        paused: true
      });
    }
    else {
      this.player = this.add
      .image(this.width / 2, 50.0 , "blue2")
      .setData('color', 'blue')
      .setScale(0.5);

      this.isUp = true;

      this.tween = this.tweens.add({
        duration: 350,
        targets: this.player,
        x: this.width / 2,
        y: this.y - 83 ,
        yoyo: false,
        onComplete: () => {
          this.onCollition();
        },
        paused: true
      });
    }
      const value = Phaser.Math.Between(0, 1);
      if (value === 0) {
        this.isBlue = true;
        this.player.setTexture(this.isUp ? "blue1" :"blue2").setData('color', 'blue');
      } else {
        this.isBlue = false;
        this.player.setTexture(this.isUp ? "red1" :"red2").setData('color', 'red');
      }
  }

  onCollition() {
    var isSameColor : boolean;
    var playerPos = this.isUp ?this.width/2 + (this.y - 83) : this.width/2 + (this.y + 83);
    var ball1Pos = this.isUp ? this.width/2 + this.ball2.y : this.width/2 + this.ball1.y;
    var ball2Pos = this.isUp ? this.width/2 + this.ball1.y : this.width/2 + this.ball2.y;
    this.sound.play("collide");
    if((playerPos - ball1Pos) > (playerPos - ball2Pos) ) {
      if(this.ball2.getData('color') === 
      this.player.getData('color')) {
        var particle = this.add.particles('redball')
        var emitter = particle.createEmitter({
          alpha: 0.5,
          speed: 60,
          blendMode: 'MULTIPLY',
          x: this.width/2,
          y: this.y - 10,
          lifespan: 0.005
        });
        emitter.setScale(1.5);
        
        isSameColor = true;
        this.time.delayedCall(300, function() {
          particle.destroy();
      });
      }
      else {
        isSameColor = false;
      }
    }
    else {
      if(this.ball1.getData('color') === 
      this.player.getData('color')) {
        var particle = this.add.particles('blueball')
        var emitter = particle.createEmitter({
          alpha: 0.5,
          speed: 60,
          blendMode: 'MULTIPLY',
          x: this.width/2,
          y: this.y - 10,
          lifespan: 0.05
        });
        emitter.setScale(1.5);
        
        isSameColor = true;
        this.time.delayedCall(500, function() {
          particle.destroy();
      });
      }
      else {
        isSameColor = false;
      }
    }
    console.log(playerPos);
    console.log(ball1Pos);
    console.log(ball2Pos);
    console.log(isSameColor);
    if (isSameColor) {
      this.score++;
      this.counter = 3;
      this.scoreBoard.setText(
        (this.score < 10 ? "0" : "") + this.score.toString()
      );
      this.player.destroy();
      this.createPlayer(); 
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
        this.scene.remove("Dot");
      }, 1000);
    }
  }
  onClick() {
    this.sound.play("tap");
    this.tween.play();
  }
}
