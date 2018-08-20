import * as Assets from '../assets';
import GeometricUtils from '../utils/geometricUtils';

const TILE_HEIGHT = 64;
const TILE_WIDTH = 64;

export default class Game extends Phaser.State {
  private backgroundTemplateSprite: Phaser.Sprite = null;
  private cursors: Phaser.CursorKeys = null;
  private map: number[][] = [
    [1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 0, 1],
    [1, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1]
  ];

  public create(): void {
    this.backgroundTemplateSprite = this.game.add.sprite(
      this.game.width / 2,
      this.game.height / 2,
      Assets.Images.ImagesBackgroundTemplate.getName()
    );
    this.backgroundTemplateSprite.fixedToCamera = true;
    this.backgroundTemplateSprite.anchor.setTo(0.5);
    console.log(this.game.world.width / 2);
    console.log(this.game.world.centerX);
    console.log(this.game.width);
    this.cursors = this.game.input.keyboard.createCursorKeys();
  }

  update() {
    if (this.cursors.up.isDown) {
      this.game.camera.y -= 4;
      this.drawMap();
    } else if (this.cursors.down.isDown) {
      this.game.camera.y += 4;
      this.drawMap();
    }

    if (this.cursors.left.isDown) {
      this.game.camera.x -= 4;
      this.drawMap();
    } else if (this.cursors.right.isDown) {
      this.game.camera.x += 4;
      this.drawMap();
    }
  }

  render() {
    this.game.debug.cameraInfo(this.game.camera, 32, 32);
  }

  drawMap() {
    for (const [rowIndex, row] of this.map.entries()) {
      for (const [columnIndex, column] of row.entries()) {
        const x = columnIndex * TILE_WIDTH;
        const y = rowIndex * TILE_HEIGHT;
        const tileType = this.map[rowIndex][columnIndex];
        this.placeTile(new Phaser.Point(x, y), tileType);
      }
    }
  }

  placeTile(target: Phaser.Point, tileType: number): void {
    const tileTypeToAsset = [
      Assets.Images.ImagesTilesTile001Piso.getName(),
      Assets.Images.ImagesTilesTile001.getName()
    ];

    const { x: isoX, y: isoY } = GeometricUtils.cartesianToIsometric(target);

    const tile = this.game.add.sprite(
      this.game.world.centerX + isoX,
      this.game.world.centerY + isoY,
      tileTypeToAsset[tileType]
    );

    tile.anchor.setTo(1);
    tile.inputEnabled = true;
    tile.events.onInputDown.add(({ position }) =>
      console.log(
        GeometricUtils.getTileCoordinates(
          GeometricUtils.isometricToCartesian(position),
          TILE_HEIGHT
        )
      )
    );
  }
}
