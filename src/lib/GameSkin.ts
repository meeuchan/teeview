import Canvas from './Canvas'
import { WeaponType } from './Parts'

interface IWeaponSpec {
  gridX: number
  gridY: number
  cellsW: number
  cellsH: number
  visualSize: number
}

const WEAPON_SPECS: Partial<Record<WeaponType, IWeaponSpec>> = {
  [WeaponType.Hammer]: { gridX: 2, gridY: 1, cellsW: 4, cellsH: 3, visualSize: 96 },
  [WeaponType.Gun]: { gridX: 2, gridY: 4, cellsW: 4, cellsH: 2, visualSize: 64 },
  [WeaponType.Shotgun]: { gridX: 2, gridY: 6, cellsW: 8, cellsH: 2, visualSize: 96 },
  [WeaponType.Grenade]: { gridX: 2, gridY: 8, cellsW: 7, cellsH: 2, visualSize: 96 },
  [WeaponType.Laser]: { gridX: 2, gridY: 12, cellsW: 7, cellsH: 3, visualSize: 92 },
  [WeaponType.Ninja]: { gridX: 2, gridY: 10, cellsW: 8, cellsH: 2, visualSize: 96 },
}

export class GameSkin {
  private _img: HTMLImageElement
  private _cellSize: number
  private _cache: Record<string, HTMLCanvasElement> = {}

  constructor(img: HTMLImageElement) {
    this._img = img
    this._cellSize = img.width / 32
  }

  public getWeapon(weapon: WeaponType, flipped = false) {
    const spec = WEAPON_SPECS[weapon]
    if (!spec) return null

    const key = flipped ? `${weapon}_flipped` : `${weapon}`
    if (!this._cache[key]) {
      const { canvas, ctx } = Canvas.create(
        spec.cellsW * this._cellSize,
        spec.cellsH * this._cellSize,
      )

      ctx.drawImage(
        this._img,
        spec.gridX * this._cellSize,
        spec.gridY * this._cellSize,
        canvas.width,
        canvas.height,
        0,
        0,
        canvas.width,
        canvas.height,
      )

      this._cache[key] = flipped ? Canvas.flipY(canvas) : canvas
    }

    return this._cache[key]
  }

  public getWeaponRenderSize(weapon: WeaponType) {
    const spec = WEAPON_SPECS[weapon]
    if (!spec) return null

    const diagonal = Math.sqrt(spec.cellsW ** 2 + spec.cellsH ** 2)
    return {
      width: (spec.visualSize * spec.cellsW) / diagonal,
      height: (spec.visualSize * spec.cellsH) / diagonal,
    }
  }
}
