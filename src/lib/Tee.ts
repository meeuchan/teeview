import Canvas from './Canvas'
import type { Skin } from './Skin'

export class Tee {
  private _skin: Skin
  private _size: number
  private _scale: number

  constructor(skin: Skin) {
    this._skin = skin
    this._size = skin.height * 0.75
    this._scale = this._size / 64
  }

  public render() {
    const body = this._renderBody()
    const bodyShadow = this._renderBodyShadow()
    const frontFoot = this._renderFrontFoot()
    const frontFootShadow = this._renderFrontFootShadow()
    const backFoot = this._renderBackFoot()
    const backFootShadow = this._renderBackFootShadow()
    return Canvas.merge(bodyShadow, backFootShadow, frontFootShadow, backFoot, body, frontFoot)
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
