import Phaser from "phaser";
import assetPackUrl from "../static/assets/asset-pack.json";
import Dot from "./scenes/Dot";
import StartScreen from "./scenes/StartScreen";

class Boot extends Phaser.Scene {
  constructor() {
    super("Boot");
  }

  preload() {
    this.load.pack("pack", assetPackUrl);
  }

  create() {
    this.scene.start("StartScreen", { score: 0 });
  }
}

const game = new Phaser.Game({
  width: 540,
  height: 960,
  backgroundColor: "#ffffff",
  scale: {
    mode: Phaser.Scale.ScaleModes.HEIGHT_CONTROLS_WIDTH,
    autoCenter: Phaser.Scale.Center.CENTER_BOTH,
    
  },
  scene: [Boot, StartScreen,Dot],
});

game.scene.start("Boot");
