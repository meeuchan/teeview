import type { EyeType, FaceType } from './Parts'
import { Skin } from './Skin'
import { Tee } from './Tee'

export interface IRendererOptions {
  skin: HTMLImageElement
  eyes?: EyeType
  face?: FaceType
}

export class Renderer {
  private _options: IRendererOptions | null = null
  private _skin: Skin | null = null

  public render(options: IRendererOptions) {
    if (
      !this._skin ||
      !this._options?.skin ||
      this._areImagesDifferent(this._options.skin, options.skin)
    ) {
      this._skin = new Skin(options.skin)
    }
    this._options = options

    const tee = new Tee(this._skin)
    return tee.render()
  }

  private _areImagesDifferent(img1: HTMLImageElement, img2: HTMLImageElement) {
    return (
      img1.getAttribute('name') !== img2.getAttribute('name') ||
      img1.getAttribute('lastModified') !== img2.getAttribute('lastModified') ||
      img1.src !== img2.src
    )
  }
}
