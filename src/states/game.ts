import * as Assets from '../assets';
import GeometricUtils from '../utils/geometricUtils';

const TILE_HEIGHT = 64;
const TILE_WIDTH = 128;

export default class Game extends Phaser.State {
  private backgroundTemplateSprite: Phaser.Sprite = null;
  private cursors: Phaser.CursorKeys = null;
  private mapSprites: Phaser.Sprite[][] = [];
  private map: number[][] = [
    [1, 1, 1, 1, 1, 1, 1, 2],
    [1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 1, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1],
    [2, 1, 1, 1, 1, 1, 1, 1]
  ];

  public create(): void {
    this.drawBackground();
    this.drawMap();
    this.drawBorders();
    this.game.camera.x = this.game.world.centerX;
    this.game.camera.y = this.game.world.centerY;
    this.cursors = this.game.input.keyboard.createCursorKeys();
  }

  checkMouseBorder() {
    if (this.game.input.activePointer.x !== -1) {
      if (
        this.game.input.activePointer.x >
        this.game.width - this.game.state.offsetX - 50
      ) {
        this.game.camera.x += 4;
      } else if (this.game.input.activePointer.x < this.game.state.offsetX + 50) {
        this.game.camera.x -= 4;
      }
    }
    if (this.game.input.activePointer.y !== -1) {
      if (
        this.game.input.activePointer.y >
        this.game.height - this.game.state.offsetY - 50
      ) {
        this.game.camera.y += 4;
      } else if (this.game.input.activePointer.y < 50) {
        this.game.camera.y -= 4;
      }
    }
  }

  checkArrows() {
    if (this.cursors.up.isDown) {
      this.game.camera.y -= 4;
    } else if (this.cursors.down.isDown) {
      this.game.camera.y += 4;
    }

    if (this.cursors.left.isDown) {
      this.game.camera.x -= 4;
    } else if (this.cursors.right.isDown) {
      this.game.camera.x += 4;
    }
  }

  update() {
    this.checkMouseBorder();
    this.checkArrows();
  }

  render() {
    this.game.debug.cameraInfo(this.game.camera, 32, 32);
  }

  drawBorders() {
    const leftBorder = this.game.add.graphics();
    leftBorder.beginFill(0xff0000);
    leftBorder.drawRect(0, 0, this.game.state.offsetX, this.game.height);
    leftBorder.endFill();
    leftBorder.fixedToCamera = true;

    const rightBorder = this.game.add.graphics();
    leftBorder.beginFill(0xff0000);
    leftBorder.drawRect(
      this.game.width - this.game.state.offsetX,
      0,
      this.game.width,
      this.game.height
    );
    leftBorder.endFill();
    leftBorder.fixedToCamera = true;
  }

  drawBackground() {
    this.backgroundTemplateSprite = this.game.add.sprite(
      this.game.width / 2,
      this.game.height / 2,
      Assets.Images.ImagesBackgroundTemplate.getName()
    );
    this.backgroundTemplateSprite.fixedToCamera = true;
    this.backgroundTemplateSprite.anchor.setTo(0.5);
  }

  drawMap() {
    for (const [rowIndex, row] of this.map.entries()) {
      this.mapSprites.push([]);
      for (const [columnIndex, column] of row.entries()) {
        const x = (columnIndex * TILE_WIDTH) / 2;
        const y = rowIndex * TILE_HEIGHT;
        const tileType = this.map[rowIndex][columnIndex];
        this.mapSprites[rowIndex][columnIndex] = this.placeTile(
          new Phaser.Point(x, y),
          tileType
        );
      }
    }
  }

  placeTile(target: Phaser.Point, tileType: number): Phaser.Sprite {
    const tileTypeToAsset = [
      Assets.Images.ImagesTilesTile001Piso.getName(),
      Assets.Images.ImagesTilesTile001.getName(),
      Assets.Images.ImagesTilesTile002.getName()
    ];

    const { x: isoX, y: isoY } = GeometricUtils.cartesianToIsometric(target);

    const tile = this.game.add.sprite(
      this.game.world.centerX +
        isoX +
        this.game.state.offsetX +
        TILE_WIDTH / 2 +
        (TILE_WIDTH * this.map.length) / 2,
      this.game.world.centerY + isoY + TILE_HEIGHT * 2,
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

    return tile;
  }
}
