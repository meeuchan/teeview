export class TeeColor {
  private _h: number
  public get h() {
    return this._h
  }

  private _s: number
  public get s() {
    return this._s
  }

  private _l: number
  public get l() {
    return this._l
  }

  constructor(h = 0, s = 0, l = 0) {
    this._h = h
    this._s = s
    this._l = l
  }

  public toString() {
    return `tee(${this.h}, ${this.s}, ${this.l})`
  }
}

export class HslColor {
  private _h: number
  public get h() {
    return this._h
  }

  private _s: number
  public get s() {
    return this._s
  }

  private _l: number
  public get l() {
    return this._l
  }

  constructor(h = 0, s = 0, l = 0) {
    this._h = h
    this._s = s
    this._l = l
  }

  public static fromTeeColor(teeColor: TeeColor) {
    return new HslColor(teeColor.h / 255, teeColor.s / 255, 0.5 + (0.5 * teeColor.l) / 255)
  }

  public toString() {
    return `hsl(${(this.h * 360) | 0}, ${(this.s * 100) | 0}, ${(this.l * 100) | 0})`
  }
}

export class RgbColor {
  private _r: number
  public get r() {
    return this._r
  }

  private _g: number
  public get g() {
    return this._g
  }

  private _b: number
  public get b() {
    return this._b
  }

  constructor(r = 0, g = 0, b = 0) {
    this._r = r
    this._g = g
    this._b = b
  }

  public static fromHslColor(hslColor: HslColor) {
    let tempR = 0
    let tempG = 0
    let tempB = 0

    const h1 = hslColor.h * 6
    const c = (1 - Math.abs(2 * hslColor.l - 1)) * hslColor.s
    const x = c * (1 - Math.abs((h1 % 2) - 1))

    switch (h1 | 0) {
      case 0:
        tempR = c
        tempG = x
        break
      case 1:
        tempR = x
        tempB = c
        break
      case 2:
        tempG = c
        tempB = x
        break
      case 3:
        tempG = x
        tempB = c
        break
      case 4:
        tempR = x
        tempB = c
        break
      case 5:
      case 6:
        tempR = c
        tempB = x
        break
    }

    const m = hslColor.l - c / 2

    return new RgbColor(tempR + m, tempG + m, tempB + m)
  }

  public static fromTeeColor(teeColor: TeeColor) {
    return this.fromHslColor(HslColor.fromTeeColor(teeColor))
  }

  public toString() {
    return `rgb(${(this.r * 255) | 0}, ${(this.g * 255) | 0}, ${(this.b * 255) | 0})`
  }
}
