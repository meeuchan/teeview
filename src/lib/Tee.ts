import Canvas from './Canvas'
import { RgbColor, type TeeColor } from './Color'
import { EyeType, TeePartType } from './Parts'
import type { Skin } from './Skin'

export interface ITeeColors {
  body: TeeColor
  feet: TeeColor
}

export interface IColorPreset {
  useCustomColors: boolean
  body?: TeeColor
  feet?: TeeColor
}

export interface ITeeOptions {
  eyes?: EyeType
  eyeAngle?: number | null
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
    return Canvas.merge(
      options?.noFeet ? null : this._renderBackFootShadow(),
      this._renderBodyShadow(),
      options?.noFeet ? null : this._renderFrontFootShadow(),
      options?.noFeet ? null : this._renderBackFoot(),
      this._renderBody(),
      options?.noFace
        ? null
        : this._renderEyes(
            options?.eyes ?? EyeType.Normal,
            options?.eyeAngle === undefined ? 0 : options.eyeAngle,
          ),
      options?.noFeet ? null : this._renderFrontFoot(),
    )
  }

  private _renderBody() {
    if (!this._cache[TeePartType.Body]) {
      let body = this._renderPart(this._skin.getBody(), 96, 0, 0, 2 / 3)
      if (this._colors?.body) {
        const color = RgbColor.fromTeeColor(this._colors.body)
        body = Canvas.tint(body, color, true)
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
      let frontFoot = this._renderPart(this._skin.getFoot(), 64, 7, 30)
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
      let frontFootShadow = this._renderPart(this._skin.getFootShadow(), 64, 7, 30)
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
      let backFoot = this._renderPart(this._skin.getFoot(), 64, -7, 30)
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
      let backFootShadow = this._renderPart(this._skin.getFootShadow(), 64, -7, 30)
      if (this._colors?.feet) {
        const color = RgbColor.fromTeeColor(this._colors.feet)
        backFootShadow = Canvas.tint(backFootShadow, color)
      }
      this._cache[TeePartType.BackFootShadow] = backFootShadow
    }
    return this._cache[TeePartType.BackFootShadow]
  }

  private _renderEyes(eye: EyeType, angle: number | null) {
    const key = TeePartType.Eye + eye + (angle ?? 'front')
    if (!this._cache[key]) {
      const scale = 0.8
      let leftOffsetX: number
      let rightOffsetX: number
      let offsetY: number

      if (angle === null) {
        leftOffsetX = 15.04
        rightOffsetX = 23.36
        offsetY = 16
      } else {
        const rad = (angle * Math.PI) / 180
        const dirX = Math.cos(rad)
        const dirY = Math.sin(rad)
        const separation = (0.075 - 0.01 * Math.abs(dirX)) * 64
        const offsetX = dirX * 0.125 * 64
        leftOffsetX = 19.2 - separation + offsetX
        rightOffsetX = 19.2 + separation + offsetX
        offsetY = 19.2 + (-0.05 + dirY * 0.1) * 64
      }

      const leftEye = this._skin.getEye(eye)
      const rightEye = Canvas.flip(leftEye)

      const leftEyeCanvas = this._renderPart(leftEye, 32, leftOffsetX, offsetY, scale)
      const rightEyeCanvas = this._renderPart(rightEye, 32, rightOffsetX, offsetY, scale)
      let canvas = Canvas.merge(leftEyeCanvas, rightEyeCanvas)!

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
