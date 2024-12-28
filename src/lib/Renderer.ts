import { TeeColor } from './Color'
import { Skin } from './Skin'
import { Tee, type ITeeColors, type ITeeOptions } from './Tee'

export type IRendererOptions = {
  skin: HTMLImageElement
  colors?: ITeeColors
} & ITeeOptions

export class Renderer {
  private _options: IRendererOptions | null = null
  private _skin: Skin | null = null
  private _tee: Tee | null = null

  public render(options: IRendererOptions) {
    if (
      !this._skin ||
      !this._options?.skin ||
      this._areImagesDifferent(this._options.skin, options.skin)
    ) {
      this._skin = new Skin(options.skin)
    }

    if (!this._tee || this._areColorsDifferent(this._options?.colors, options.colors)) {
      this._tee = new Tee(this._skin, options.colors)
    }

    this._options = options
    return this._tee.render(options)
  }

  private _areImagesDifferent(img1: HTMLImageElement, img2: HTMLImageElement) {
    return (
      img1.getAttribute('name') !== img2.getAttribute('name') ||
      img1.getAttribute('lastModified') !== img2.getAttribute('lastModified') ||
      img1.src !== img2.src
    )
  }

  private _areColorsDifferent(colors1?: ITeeColors, colors2?: ITeeColors) {
    if (colors1 === undefined && colors2 === undefined) return false
    if (colors1 === undefined || colors2 === undefined) return true

    return (
      !TeeColor.compare(colors1.body, colors2.body) || !TeeColor.compare(colors1.feet, colors2.feet)
    )
  }
}
