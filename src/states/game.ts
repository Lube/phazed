import * as Assets from '../assets';
import GeometricUtils from '../utils/geometricUtils';

// [
//   [1,2,3], 00 => 20, 01 => 10, => 02 => 00
//   [1,2,3],
//   [1,2,3]
// ]

// [
//   [1,1,1],
//   [2,2,2],
//   [3,2,3]
// ]
const flipMatrix = matrix =>
  matrix[0].map((column, index) => matrix.map(row => row[index]).reverse());

const rotate = matrix => flipMatrix(matrix.slice());

const TILE_HEIGHT = 64;
const TILE_WIDTH = 128;

export default class Game extends Phaser.State {
  private backgroundTemplateSprite: Phaser.Sprite = null;
  private cursors: Phaser.CursorKeys = null;
  private mapSprites: Phaser.Sprite[][][] = [];
  private selectedSprite: Phaser.Sprite = null;
  private oldSelectedSpriteTexture: PIXI.Texture = null;
  private orientation: number = 0;
  private map: number[][][] = [
    [
      [1, 1, 1, 1, 1, 1, 1, 2],
      [1, 0, 0, 0, 0, 0, 2, 1],
      [1, 0, 0, 0, 0, 2, 0, 1],
      [1, 0, 0, 0, 2, 0, 0, 1],
      [1, 0, 0, 2, 0, 0, 0, 1],
      [1, 0, 2, 0, 0, 0, 0, 1],
      [1, 2, 0, 0, 0, 0, 0, 1],
      [2, 1, 1, 1, 1, 1, 1, 1]
    ],
    [
      [-1, -1, -1, -1, -1, -1, -1, -1],
      [-1, -1, -1, -1, -1, -1, 2, -1],
      [-1, -1, -1, -1, -1, 2, -1, -1],
      [-1, -1, -1, -1, 2, -1, -1, -1],
      [-1, -1, -1, 2, -1, -1, -1, -1],
      [-1, -1, 2, -1, -1, -1, -1, -1],
      [-1, 2, -1, -1, -1, -1, -1, -1],
      [-1, -1, -1, -1, -1, -1, -1, -1]
    ],
    [
      [-1, -1, -1, -1, -1, -1, -1, -1],
      [-1, -1, -1, -1, -1, -1, -1, -1],
      [-1, -1, -1, -1, -1, 2, -1, -1],
      [-1, -1, -1, -1, 2, -1, -1, -1],
      [-1, -1, -1, 2, -1, -1, -1, -1],
      [-1, -1, 2, -1, -1, -1, -1, -1],
      [-1, -1, -1, -1, -1, -1, -1, -1],
      [-1, -1, -1, -1, -1, -1, -1, -1]
    ],
    [
      [2, -1, -1, -1, -1, -1, -1, -1],
      [-1, 2, -1, -1, -1, -1, -1, -1],
      [-1, -1, 2, -1, -1, -1, -1, -1],
      [-1, -1, -1, 2, 2, -1, -1, -1],
      [-1, -1, -1, 2, -1, -1, -1, -1],
      [-1, -1, -1, -1, -1, -1, -1, -1],
      [-1, -1, -1, -1, -1, -1, -1, -1],
      [-1, -1, -1, -1, -1, -1, -1, 2]
    ]
  ];
  private updateQueue: Function[] = [];

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
      this.orientation = 0;
      this.drawMap();
    } else if (this.cursors.down.isDown) {
      this.orientation = 2;
      this.drawMap();
    }

    if (this.cursors.left.isDown) {
      this.orientation = 1;
      this.drawMap();
    } else if (this.cursors.right.isDown) {
      this.orientation = 3;
      this.drawMap();
    }
  }

  update() {
    this.checkMouseBorder();
    this.checkArrows();
    this.updateQueue.forEach(fn => fn());
    this.updateQueue = [];
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
    this.mapSprites.forEach(layer =>
      layer.forEach(row => row.forEach(sprite => sprite && sprite.destroy()))
    );
    this.mapSprites = [];
    for (const [heightIndex, grid] of this.map.entries()) {
      this.mapSprites.push([]);
      let transposed = grid;
      for (let index = 0; index < this.orientation; index++) {
        transposed = rotate(transposed);
      }
      for (const [rowIndex, row] of transposed.entries()) {
        this.mapSprites[heightIndex].push([]);
        for (const [columnIndex, column] of row.entries()) {
          const tileType = transposed[rowIndex][columnIndex];
          this.mapSprites[heightIndex][rowIndex][columnIndex] = this.placeTile(
            rowIndex,
            columnIndex,
            heightIndex,
            tileType
          );
        }
      }
    }
  }

  handleTileClick(xCoord: number, yCoord: number, zCoord: number) {
    return (): void => {
      this.updateQueue.push(() => {
        if (this.selectedSprite) {
          this.selectedSprite.loadTexture(this.oldSelectedSpriteTexture);
        }

        if (this.selectedSprite === this.mapSprites[xCoord][yCoord][zCoord]) {
          this.selectedSprite = null;
        } else {
          this.selectedSprite = this.mapSprites[xCoord][yCoord][zCoord];
          this.oldSelectedSpriteTexture = this.selectedSprite.texture;
          this.selectedSprite.loadTexture(Assets.Images.ImagesTilesTile002.getName());
        }
      });
    };
  }

  placeTile(x: number, y: number, z: number, tileType: number): Phaser.Sprite | null {
    const tileTypeToAsset = [
      Assets.Images.ImagesTilesTile001Piso.getName(),
      Assets.Images.ImagesTilesTile001.getName(),
      Assets.Images.ImagesTilesTile002.getName()
    ];

    if (tileType !== -1) {
      const target = new Phaser.Point((x * TILE_WIDTH) / 2, y * TILE_HEIGHT);

      const { x: isoX, y: isoY } = GeometricUtils.cartesianToIsometric(
        target,
        -z * TILE_HEIGHT
      );

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
      tile.events.onInputDown.add(this.handleTileClick(x, y, z));

      return tile;
    }

    return null;
  }
}
