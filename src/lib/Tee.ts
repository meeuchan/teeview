import Canvas from './Canvas'
import { RgbColor, type TeeColor } from './Color'
import { EyeType, PoseType, TeePartType } from './Parts'
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
  pose?: PoseType
  noFace?: boolean
  noFeet?: boolean
}

interface IFootFrame {
  x: number
  y: number
  rotation: number
}

interface IPoseFrame {
  bodyOffsetY: number
  backFoot: IFootFrame
  frontFoot: IFootFrame
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
    const eyeAngle = options?.eyeAngle === undefined ? 0 : options.eyeAngle
    const poseFrame = this._getPoseFrame(options?.pose ?? PoseType.Idle, eyeAngle)

    return Canvas.merge(
      options?.noFeet ? null : this._renderBackFootShadow(poseFrame),
      this._renderBodyShadow(poseFrame),
      options?.noFeet ? null : this._renderFrontFootShadow(poseFrame),
      options?.noFeet ? null : this._renderBackFoot(poseFrame),
      this._renderBody(poseFrame),
      options?.noFace
        ? null
        : this._renderEyes(options?.eyes ?? EyeType.Normal, eyeAngle, poseFrame.bodyOffsetY),
      options?.noFeet ? null : this._renderFrontFoot(poseFrame),
    )
  }

  private _getPoseFrame(pose: PoseType, eyeAngle: number | null): IPoseFrame {
    switch (pose) {
      case PoseType.InAir:
        return {
          bodyOffsetY: 0,
          backFoot: { x: -3, y: 30, rotation: -36 },
          frontFoot: { x: 3, y: 30, rotation: -36 },
        }
      case PoseType.Sit: {
        const sitLeft = eyeAngle !== null && eyeAngle >= 90 && eyeAngle <= 270
        return sitLeft
          ? {
              bodyOffsetY: 3,
              backFoot: { x: -12, y: 30, rotation: 36 },
              frontFoot: { x: -8, y: 30, rotation: 36 },
            }
          : {
              bodyOffsetY: 3,
              backFoot: { x: 12, y: 30, rotation: -36 },
              frontFoot: { x: 8, y: 30, rotation: -36 },
            }
      }
      case PoseType.Idle:
      default:
        return {
          bodyOffsetY: 0,
          backFoot: { x: -7, y: 30, rotation: 0 },
          frontFoot: { x: 7, y: 30, rotation: 0 },
        }
    }
  }

  private _renderBody(poseFrame: IPoseFrame) {
    const key = TeePartType.Body + poseFrame.bodyOffsetY
    if (!this._cache[key]) {
      let body = this._renderPart(this._skin.getBody(), 96, 0, poseFrame.bodyOffsetY, 2 / 3)
      if (this._colors?.body) {
        const color = RgbColor.fromTeeColor(this._colors.body)
        body = Canvas.tint(body, color, true)
      }
      this._cache[key] = body
    }
    return this._cache[key]
  }

  private _renderBodyShadow(poseFrame: IPoseFrame) {
    const key = TeePartType.BodyShadow + poseFrame.bodyOffsetY
    if (!this._cache[key]) {
      let bodyShadow = this._renderPart(
        this._skin.getBodyShadow(),
        96,
        0,
        poseFrame.bodyOffsetY,
        2 / 3,
      )
      if (this._colors?.body) {
        const color = RgbColor.fromTeeColor(this._colors.body)
        bodyShadow = Canvas.tint(bodyShadow, color)
      }
      this._cache[key] = bodyShadow
    }
    return this._cache[key]
  }

  private _renderFrontFoot(poseFrame: IPoseFrame) {
    const { x, y, rotation } = poseFrame.frontFoot
    const key = `${TeePartType.FrontFoot}${x}_${y}_${rotation}`
    if (!this._cache[key]) {
      let frontFoot = this._renderPart(this._skin.getFoot(), 64, x, y, 1, rotation)
      if (this._colors?.feet) {
        const color = RgbColor.fromTeeColor(this._colors.feet)
        frontFoot = Canvas.tint(frontFoot, color)
      }
      this._cache[key] = frontFoot
    }
    return this._cache[key]
  }

  private _renderFrontFootShadow(poseFrame: IPoseFrame) {
    const { x, y, rotation } = poseFrame.frontFoot
    const key = `${TeePartType.FrontFootShadow}${x}_${y}_${rotation}`
    if (!this._cache[key]) {
      let frontFootShadow = this._renderPart(this._skin.getFootShadow(), 64, x, y, 1, rotation)
      if (this._colors?.feet) {
        const color = RgbColor.fromTeeColor(this._colors.feet)
        frontFootShadow = Canvas.tint(frontFootShadow, color)
      }
      this._cache[key] = frontFootShadow
    }
    return this._cache[key]
  }

  private _renderBackFoot(poseFrame: IPoseFrame) {
    const { x, y, rotation } = poseFrame.backFoot
    const key = `${TeePartType.BackFoot}${x}_${y}_${rotation}`
    if (!this._cache[key]) {
      let backFoot = this._renderPart(this._skin.getFoot(), 64, x, y, 1, rotation)
      if (this._colors?.feet) {
        const color = RgbColor.fromTeeColor(this._colors.feet)
        backFoot = Canvas.tint(backFoot, color)
      }
      this._cache[key] = backFoot
    }
    return this._cache[key]
  }

  private _renderBackFootShadow(poseFrame: IPoseFrame) {
    const { x, y, rotation } = poseFrame.backFoot
    const key = `${TeePartType.BackFootShadow}${x}_${y}_${rotation}`
    if (!this._cache[key]) {
      let backFootShadow = this._renderPart(this._skin.getFootShadow(), 64, x, y, 1, rotation)
      if (this._colors?.feet) {
        const color = RgbColor.fromTeeColor(this._colors.feet)
        backFootShadow = Canvas.tint(backFootShadow, color)
      }
      this._cache[key] = backFootShadow
    }
    return this._cache[key]
  }

  private _renderEyes(eye: EyeType, angle: number | null, bodyOffsetY: number) {
    const key = TeePartType.Eye + eye + (angle ?? 'front') + '_' + bodyOffsetY
    if (!this._cache[key]) {
      const scale = 0.8
      const xBase = 19.2
      const yBase = 19.2 + bodyOffsetY
      let leftOffsetX: number
      let rightOffsetX: number
      let offsetY: number

      if (angle === null) {
        leftOffsetX = 15.04
        rightOffsetX = 23.36
        offsetY = 16 + bodyOffsetY
      } else {
        const rad = (angle * Math.PI) / 180
        const dirX = Math.cos(rad)
        const dirY = Math.sin(rad)
        const separation = (0.075 - 0.01 * Math.abs(dirX)) * 64
        const offsetX = dirX * 0.125 * 64
        leftOffsetX = xBase - separation + offsetX
        rightOffsetX = xBase + separation + offsetX
        offsetY = yBase + (-0.05 + dirY * 0.1) * 64
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
    rotation = 0,
  ) {
    const { canvas, ctx } = Canvas.create(this._size)

    const offsetX = normalOffsetX * this._scale
    const offsetY = normalOffsetY * this._scale

    const normalize = 1 / (part.width / normalSize)
    const width = part.width * normalize * scale * this._scale
    const height = part.height * normalize * scale * this._scale

    if (rotation) {
      const pivotX = offsetX + width / 2
      const pivotY = offsetY + height / 2
      ctx.translate(pivotX, pivotY)
      ctx.rotate((rotation * Math.PI) / 180)
      ctx.translate(-pivotX, -pivotY)
    }

    ctx.drawImage(part, 0, 0, part.width, part.height, offsetX, offsetY, width, height)

    return canvas
  }
}
