import Canvas from './Canvas'
import { EyeType, SkinPartType } from './Parts'

export class Skin {
  private _img: HTMLImageElement
  private _cache: Record<string, HTMLCanvasElement> = {}
  private _scale: number

  public get width() {
    return this._img.width
  }
  public get height() {
    return this._img.height
  }

  constructor(img: HTMLImageElement) {
    this._img = img
    this._scale = img.width / 256
  }

  public getBody() {
    if (!this._cache[SkinPartType.Body]) {
      this._cache[SkinPartType.Body] = this._getPart(96, 96, 0, 0)
    }
    return this._cache[SkinPartType.Body]
  }

  public getBodyShadow() {
    if (!this._cache[SkinPartType.BodyShadow]) {
      this._cache[SkinPartType.BodyShadow] = this._getPart(96, 96, 96, 0)
    }
    return this._cache[SkinPartType.BodyShadow]
  }

  public getFoot() {
    if (!this._cache[SkinPartType.Foot]) {
      this._cache[SkinPartType.Foot] = this._getPart(64, 32, 192, 32)
    }
    return this._cache[SkinPartType.Foot]
  }

  public getFootShadow() {
    if (!this._cache[SkinPartType.FootShadow]) {
      this._cache[SkinPartType.FootShadow] = this._getPart(64, 32, 192, 64)
    }
    return this._cache[SkinPartType.FootShadow]
  }

  public getEye(eye: EyeType) {
    const key = SkinPartType.Eye + eye
    if (!this._cache[key]) {
      let skinEye = eye
      if (eye === EyeType.Sad) skinEye = EyeType.Angry
      if (eye === EyeType.Blink) skinEye = EyeType.Normal

      let eyeCanvas = this._getPart(32, 32, 64 + 32 * skinEye, 96)
      if (eye === EyeType.Sad) {
        eyeCanvas = Canvas.flip(eyeCanvas)
      }
      if (eye === EyeType.Blink) {
        eyeCanvas = Canvas.scaleY(eyeCanvas, 0.375, 0.4625)
      }
      this._cache[key] = eyeCanvas
    }
    return this._cache[key]
  }

  private _getPart(
    partWidth: number,
    partHeight: number,
    partOffsetX: number,
    partOffsetY: number,
  ) {
    const { canvas, ctx } = Canvas.create(partWidth * this._scale, partHeight * this._scale)

    ctx.drawImage(
      this._img,
      partOffsetX * this._scale,
      partOffsetY * this._scale,
      canvas.width,
      canvas.height,
      0,
      0,
      canvas.width,
      canvas.height,
    )

    return canvas
  }
}
