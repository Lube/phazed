export default class GeometricUtils {
  public static isometricToCartesian(origin: Phaser.Point) {
    return new Phaser.Point((2 * origin.y + origin.x) / 2, (2 * origin.y - origin.x) / 2);
  }

  public static cartesianToIsometric(origin: Phaser.Point) {
    return new Phaser.Point(origin.x - origin.y, (origin.x + origin.y) / 2);
  }

  public static getTileCoordinates(target: Phaser.Point, tileHeight: number) {
    return new Phaser.Point(
      Math.floor(target.x / tileHeight),
      Math.floor(target.y / tileHeight)
    );
  }
}
