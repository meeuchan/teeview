import Canvas from './Canvas'
import { EyeType, FaceType } from './Parts'
import type { Skin } from './Skin'

export interface ITeeOptions {
  eyes?: EyeType
  face?: FaceType
}

export class Tee {
  private _skin: Skin
  private _size: number
  private _scale: number

  constructor(skin: Skin) {
    this._skin = skin
    this._size = skin.height * 0.75
    this._scale = this._size / 64
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
      backFootShadow,
      frontFootShadow,
      backFoot,
      body,
      frontFoot,
      eyes,
    )
  }

  private _renderBody() {
    return this._renderPart(this._skin.getBody(), 96, 0, 0, 2 / 3)
  }

  private _renderBodyShadow() {
    return this._renderPart(this._skin.getBodyShadow(), 96, 0, 0, 2 / 3)
  }

  private _renderFrontFoot() {
    return this._renderPart(this._skin.getFoot(), 64, 6.875, 30)
  }

  private _renderFrontFootShadow() {
    return this._renderPart(this._skin.getFootShadow(), 64, 6.875, 30)
  }

  private _renderBackFoot() {
    return this._renderPart(this._skin.getFoot(), 64, -6.875, 30)
  }

  private _renderBackFootShadow() {
    return this._renderPart(this._skin.getFootShadow(), 64, -6.875, 30)
  }

  private _renderEyes(eye: EyeType, face: FaceType) {
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

    return canvas
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
