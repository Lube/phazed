import * as Assets from '../assets';

export default class Title extends Phaser.State {
  private backgroundTemplateSprite: Phaser.Sprite = null;
  private googleFontText: Phaser.Text = null;
  private localFontText: Phaser.Text = null;
  private pixelateShader: Phaser.Filter = null;
  private bitmapFontText: Phaser.BitmapText = null;
  private blurXFilter: Phaser.Filter.BlurX = null;
  private blurYFilter: Phaser.Filter.BlurY = null;
  private sfxAudiosprite: Phaser.AudioSprite = null;
  private mummySpritesheet: Phaser.Sprite = null;
  private sfxLaserSounds: Assets.Audiosprites.AudiospritesSfx.Sprites[] = null;

  public create(): void {
    this.backgroundTemplateSprite = this.game.add.sprite(
      this.game.world.centerX,
      this.game.world.centerY,
      Assets.Images.ImagesBackgroundTemplate.getName()
    );
    this.backgroundTemplateSprite.anchor.setTo(0.5);

    this.bitmapFontText = this.game.add.bitmapText(
      this.game.world.centerX,
      this.game.world.centerY + 20,
      Assets.BitmapFonts.FontsFontFnt.getName(),
      'Comenzar!',
      40
    );
    this.bitmapFontText.anchor.setTo(0.5);
    this.bitmapFontText.inputEnabled = true;
    this.bitmapFontText.events.onInputDown.add(() => {
      this.game.state.start('game');
    });

    this.game.state.start('game');
  }
}
