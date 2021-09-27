import Dot from "./Dot";

export default class StartScreen extends Phaser.Scene {
  private width: number;
  private height: number;
  private score: any;
  private isGameOver: boolean;

  constructor() {
    super("StartScreen");
  }

  init(data: { score: any; isGameOver: boolean }) {
    this.score = data.score;
    this.isGameOver = data.isGameOver ?? false;
  }
  create() {
    this.width = this.scale.width;
    this.height = this.scale.height;
    this.add
      .image(this.width / 2, this.height * 0.02, "gameName")
      .setOrigin(0.5, -0.5)
      .setScale(0.4);
    this.add
      .text(this.width / 2, this.height * 0.3, "Score")
      .setFontSize(60)
      .setColor("#000000")
      //   .setFontStyle("bold")
      .setFontFamily("agencyr")
      .setOrigin(0.5, 0);
    this.add
      .text(this.width / 2, this.height * 0.37, this.score ?? "00")
      .setFontSize(45)
      .setFontFamily("agencyr")
      .setColor("#000000")
      .setOrigin(0.5, 0);
    this.add
      .text(this.width / 2, this.height * 0.55, "Best Score")
      .setFontSize(50)
      .setColor("#000000")
      .setFontFamily("agencyr")
      .setOrigin(0.5, 0);
    this.add
      .text(
        this.width / 2,
        this.height * 0.61,
        localStorage.getItem("highScore") ?? "0"
      )
      .setFontSize(45)
      .setFontFamily("agencyr")
      .setColor("#000000")
      .setOrigin(0.5, 0);

    const btn: Phaser.GameObjects.Image = this.add
      .image(this.width / 2, this.height * 0.68, "playButton")
      .setOrigin(0.5, 0)
      .setScale(0.4)
      .setInteractive()
      .on(
        "pointerdown",
        () => {
          this.tweens.add({
            targets: btn,
            scaleX: "*=0.8",
            scaleY: "*=0.8",
            duration: 80,
            yoyo: true,
            onComplete: () => {
              if (this.isGameOver) {
                this.scene.add("Dot", Dot);
              }
              this.scene.start("Dot");
            },
          });
        },
        this
      );
    this.add
      .text(
        this.width / 2,
        this.height * 0.925,
        `Tap to ${this.isGameOver === true ? "Re" : ""}start`
      )
      .setFontSize(45)
      .setColor("#E4546F")
      .setFontFamily("agencyr")
      .setOrigin(0.5, 0);
    // console.log(this);
  }
}
