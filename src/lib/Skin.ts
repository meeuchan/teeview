import Canvas from './Canvas'
import { EyeType, PartType } from './Parts'

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
    if (!this._cache[PartType.Body]) {
      this._cache[PartType.Body] = this._getPart(96, 96, 0, 0)
    }
    return this._cache[PartType.Body]
  }

  public getBodyShadow() {
    if (!this._cache[PartType.BodyShadow]) {
      this._cache[PartType.BodyShadow] = this._getPart(96, 96, 96, 0)
    }
    return this._cache[PartType.BodyShadow]
  }

  public getFoot() {
    if (!this._cache[PartType.Foot]) {
      this._cache[PartType.Foot] = this._getPart(64, 32, 192, 32)
    }
    return this._cache[PartType.Foot]
  }

  public getFootShadow() {
    if (!this._cache[PartType.FootShadow]) {
      this._cache[PartType.FootShadow] = this._getPart(64, 32, 192, 64)
    }
    return this._cache[PartType.FootShadow]
  }

  public getEye(eyes: EyeType) {
    const key = PartType.Eye + eyes
    if (!this._cache[key]) {
      const shouldFlip = eyes === EyeType.Sad
      if (EyeType.Sad) eyes = EyeType.Angry

      const eyeCanvas = this._getPart(32, 32, 64 + 32 * eyes, 96)
      this._cache[key] = shouldFlip ? Canvas.flip(eyeCanvas) : eyeCanvas
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
