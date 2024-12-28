import Canvas from './Canvas'
import { RgbColor, type TeeColor } from './Color'
import { EyeType, FaceType, TeePartType } from './Parts'
import type { Skin } from './Skin'

export interface ITeeColors {
  body: TeeColor
  feet: TeeColor
}

export interface ITeeOptions {
  eyes?: EyeType
  face?: FaceType
  noFace?: boolean
  noFeet?: boolean
}

export class Tee {
  private _skin: Skin
  private _size: number
  private _scale: number
  private _colors: ITeeColors | undefined
  private _cache: Record<string, HTMLCanvasElement> = {}

  constructor(skin: Skin, colors?: ITeeColors) {
    this._skin = skin
    this._size = skin.height * 0.75
    this._scale = this._size / 64
    this._colors = colors
  }

  public render(options?: ITeeOptions) {
    const body = this._renderBody()
    const bodyShadow = this._renderBodyShadow()
    const frontFoot = this._renderFrontFoot()
    const frontFootShadow = this._renderFrontFootShadow()
    const backFoot = this._renderBackFoot()
    const backFootShadow = this._renderBackFootShadow()
    const eyes = this._renderEyes(options?.eyes || EyeType.Normal, options?.face || FaceType.Right)

    return Canvas.merge(
      bodyShadow,
      options?.noFeet ? null : backFootShadow,
      options?.noFeet ? null : frontFootShadow,
      options?.noFeet ? null : backFoot,
      body,
      options?.noFeet ? null : frontFoot,
      options?.noFace ? null : eyes,
    )
  }

  private _renderBody() {
    if (!this._cache[TeePartType.Body]) {
      let body = this._renderPart(this._skin.getBody(), 96, 0, 0, 2 / 3)
      if (this._colors?.body) {
        const color = RgbColor.fromTeeColor(this._colors.body)
        body = Canvas.tint(body, color)
      }
      this._cache[TeePartType.Body] = body
    }
    return this._cache[TeePartType.Body]
  }

  private _renderBodyShadow() {
    if (!this._cache[TeePartType.BodyShadow]) {
      let bodyShadow = this._renderPart(this._skin.getBodyShadow(), 96, 0, 0, 2 / 3)
      if (this._colors?.body) {
        const color = RgbColor.fromTeeColor(this._colors.body)
        bodyShadow = Canvas.tint(bodyShadow, color)
      }
      this._cache[TeePartType.BodyShadow] = bodyShadow
    }
    return this._cache[TeePartType.BodyShadow]
  }

  private _renderFrontFoot() {
    if (!this._cache[TeePartType.FrontFoot]) {
      let frontFoot = this._renderPart(this._skin.getFoot(), 64, 6.875, 30)
      if (this._colors?.feet) {
        const color = RgbColor.fromTeeColor(this._colors.feet)
        frontFoot = Canvas.tint(frontFoot, color)
      }
      this._cache[TeePartType.FrontFoot] = frontFoot
    }
    return this._cache[TeePartType.FrontFoot]
  }

  private _renderFrontFootShadow() {
    if (!this._cache[TeePartType.FrontFootShadow]) {
      let frontFootShadow = this._renderPart(this._skin.getFootShadow(), 64, 6.875, 30)
      if (this._colors?.feet) {
        const color = RgbColor.fromTeeColor(this._colors.feet)
        frontFootShadow = Canvas.tint(frontFootShadow, color)
      }
      this._cache[TeePartType.FrontFootShadow] = frontFootShadow
    }
    return this._cache[TeePartType.FrontFootShadow]
  }

  private _renderBackFoot() {
    if (!this._cache[TeePartType.BackFoot]) {
      let backFoot = this._renderPart(this._skin.getFoot(), 64, -6.875, 30)
      if (this._colors?.feet) {
        const color = RgbColor.fromTeeColor(this._colors.feet)
        backFoot = Canvas.tint(backFoot, color)
      }
      this._cache[TeePartType.BackFoot] = backFoot
    }
    return this._cache[TeePartType.BackFoot]
  }

  private _renderBackFootShadow() {
    if (!this._cache[TeePartType.BackFootShadow]) {
      let backFootShadow = this._renderPart(this._skin.getFootShadow(), 64, -6.875, 30)
      if (this._colors?.feet) {
        const color = RgbColor.fromTeeColor(this._colors.feet)
        backFootShadow = Canvas.tint(backFootShadow, color)
      }
      this._cache[TeePartType.BackFootShadow] = backFootShadow
    }
    return this._cache[TeePartType.BackFootShadow]
  }

  private _renderEyes(eye: EyeType, face: FaceType) {
    const key = TeePartType.Eye + eye + face
    if (!this._cache[key]) {
      let leftOffsetX = 23.0625
      let rightOffsetX = 31.375
      const offsetY = 15.9625
      const scale = 0.8

      if (face == FaceType.Front) {
        leftOffsetX = 15.05
        rightOffsetX = 23.3625
      }

      const leftEye = this._skin.getEye(eye)
      const rightEye = Canvas.flip(leftEye)

      const leftEyeCanvas = this._renderPart(leftEye, 32, leftOffsetX, offsetY, scale)
      const rightEyeCanvas = this._renderPart(rightEye, 32, rightOffsetX, offsetY, scale)
      let canvas = Canvas.merge(leftEyeCanvas, rightEyeCanvas)!

      if (face == FaceType.Left) {
        canvas = Canvas.flip(canvas)
      }

      if (this._colors?.body) {
        const color = RgbColor.fromTeeColor(this._colors.body)
        canvas = Canvas.tint(canvas, color)
      }
      this._cache[key] = canvas
    }
    return this._cache[key]
  }

  private _renderPart(
    part: HTMLCanvasElement,
    normalSize: number,
    normalOffsetX: number,
    normalOffsetY: number,
    scale = 1,
  ) {
    const { canvas, ctx } = Canvas.create(this._size)

    const offsetX = normalOffsetX * this._scale
    const offsetY = normalOffsetY * this._scale

    const normalize = 1 / (part.width / normalSize)
    const width = part.width * normalize * scale * this._scale
    const height = part.height * normalize * scale * this._scale

    ctx.drawImage(part, 0, 0, part.width, part.height, offsetX, offsetY, width, height)

    return canvas
  }
}
