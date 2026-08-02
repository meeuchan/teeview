import Canvas from './Canvas'
import { RgbColor, type TeeColor } from './Color'
import type { GameSkin } from './GameSkin'
import { EyeType, PoseType, TeePartType, WeaponType } from './Parts'
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
  weapon?: WeaponType
  gameSkin?: GameSkin
}

const WEAPON_POSITION_OFFSETS: Partial<Record<WeaponType, { x: number; y: number }>> = {
  [WeaponType.Gun]: { x: 32, y: 4 },
  [WeaponType.Shotgun]: { x: 24, y: -2 },
  [WeaponType.Grenade]: { x: 24, y: -2 },
  [WeaponType.Laser]: { x: 24, y: -2 },
}

const HAND_OFFSETS: Partial<Record<WeaponType, { angle: number; x: number; y: number }>> = {
  [WeaponType.Gun]: { angle: -135, x: -15, y: 4 },
  [WeaponType.Shotgun]: { angle: -90, x: -5, y: 4 },
  [WeaponType.Grenade]: { angle: -90, x: -4, y: 7 },
}

const MIN_RENDER_SIZE = 192

const HAMMER_OFFSET = { x: 4, y: -20 }
const HAMMER_ATTACH_ANGLE = -0.1 * 360
const HAMMER_AFK_ROTATION = { left: 100, right: 500 }
const NINJA_ATTACH_ANGLE = -0.25 * 360

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

interface IWeaponAttachment {
  centerX: number
  centerY: number
  dirX: number
  dirY: number
  angle: number
  facingLeft: boolean
  rotation: number
}

export class Tee {
  private _skin: Skin
  private _size: number
  private _scale: number
  private _colors: ITeeColors | undefined
  private _cache: Record<string, HTMLCanvasElement> = {}
  private _canvasSize: number
  private _padding = 0

  constructor(skin: Skin, colors?: ITeeColors) {
    this._skin = skin
    this._size = Math.max(skin.height * 0.75, MIN_RENDER_SIZE)
    this._scale = this._size / 64
    this._canvasSize = this._size
    this._colors = colors
  }

  public render(options?: ITeeOptions) {
    const eyeAngle = options?.eyeAngle === undefined ? 0 : options.eyeAngle
    const pose = options?.pose ?? PoseType.Idle
    const poseFrame = this._getPoseFrame(pose, eyeAngle)
    const weapon = options?.weapon ?? WeaponType.None
    const hasWeapon = weapon !== WeaponType.None && !!options?.gameSkin

    this._canvasSize = hasWeapon ? this._size * 2.5 : this._size
    this._padding = hasWeapon ? this._size * 0.75 : 0

    const attachment = hasWeapon ? this._getWeaponAttachment(weapon, eyeAngle, pose) : null

    return Canvas.merge(
      attachment ? this._renderWeapon(weapon, options!.gameSkin!, attachment) : null,
      attachment ? this._renderHand(weapon, attachment) : null,
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

  private _getWeaponAttachment(
    weapon: WeaponType,
    eyeAngle: number | null,
    pose: PoseType,
  ): IWeaponAttachment {
    const angle = eyeAngle ?? 0
    const rad = (angle * Math.PI) / 180
    const dirX = Math.cos(rad)
    const dirY = Math.sin(rad)
    const facingLeft = dirX < 0
    const isSit = pose === PoseType.Sit

    const positionX = 32 * this._scale + this._padding
    const positionY = 36 * this._scale + this._padding

    if (weapon === WeaponType.Hammer) {
      const centerX = positionX - (facingLeft ? HAMMER_OFFSET.x * this._scale : 0)
      const centerY = positionY + HAMMER_OFFSET.y * this._scale + (isSit ? 3 * this._scale : 0)

      let rotation: number
      if (isSit) {
        const radians = facingLeft ? HAMMER_AFK_ROTATION.left : HAMMER_AFK_ROTATION.right
        let deg = ((radians * 180) / Math.PI) % 360
        if (deg > 180) deg -= 360
        rotation = deg
      } else {
        rotation = facingLeft ? -90 - HAMMER_ATTACH_ANGLE : -90 + HAMMER_ATTACH_ANGLE
      }

      return { centerX, centerY, dirX, dirY, angle, facingLeft, rotation }
    }

    if (weapon === WeaponType.Ninja) {
      const centerY = positionY + (isSit ? 3 * this._scale : 0)
      const rotation = facingLeft ? -90 - NINJA_ATTACH_ANGLE : -90 + NINJA_ATTACH_ANGLE

      return { centerX: positionX, centerY, dirX, dirY, angle, facingLeft, rotation }
    }

    const offset = WEAPON_POSITION_OFFSETS[weapon]
    if (!offset) {
      return { centerX: positionX, centerY: positionY, dirX, dirY, angle, facingLeft, rotation: angle }
    }

    const centerX = positionX + dirX * offset.x * this._scale
    const centerY =
      positionY +
      dirY * offset.x * this._scale +
      offset.y * this._scale +
      (isSit ? 3 * this._scale : 0)

    return { centerX, centerY, dirX, dirY, angle, facingLeft, rotation: angle }
  }

  private _renderWeapon(weapon: WeaponType, gameSkin: GameSkin, attachment: IWeaponAttachment) {
    const sprite = gameSkin.getWeapon(weapon, attachment.facingLeft)
    const size = gameSkin.getWeaponRenderSize(weapon)
    if (!sprite || !size) return null

    const width = size.width * this._scale
    const height = size.height * this._scale

    const { canvas, ctx } = Canvas.create(this._canvasSize)
    ctx.translate(attachment.centerX, attachment.centerY)
    ctx.rotate((attachment.rotation * Math.PI) / 180)
    ctx.drawImage(sprite, -width / 2, -height / 2, width, height)

    return canvas
  }

  private _renderHand(weapon: WeaponType, attachment: IWeaponAttachment) {
    const offset = HAND_OFFSETS[weapon]
    if (!offset) return null

    const { dirX, dirY, angle, facingLeft } = attachment
    const perpX = facingLeft ? dirY : -dirY
    const perpY = facingLeft ? -dirX : dirX

    const centerX =
      attachment.centerX + dirX * (1 + offset.x) * this._scale + perpX * offset.y * this._scale
    const centerY =
      attachment.centerY + dirY * (1 + offset.x) * this._scale + perpY * offset.y * this._scale
    const handAngle = angle + (facingLeft ? -offset.angle : offset.angle)

    const hand = this._getTintedPart('handTint', this._skin.getHand(), this._colors?.body)
    const handShadow = this._getTintedPart(
      'handShadowTint',
      this._skin.getHandShadow(),
      this._colors?.body,
    )

    const size = 20 * this._scale

    const { canvas, ctx } = Canvas.create(this._canvasSize)
    ctx.translate(centerX, centerY)
    ctx.rotate((handAngle * Math.PI) / 180)
    ctx.drawImage(handShadow, -size / 2, -size / 2, size, size)
    ctx.drawImage(hand, -size / 2, -size / 2, size, size)

    return canvas
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
    const key = TeePartType.Body + poseFrame.bodyOffsetY + '_' + this._canvasSize
    if (!this._cache[key]) {
      const body = this._getTintedPart('bodyTint', this._skin.getBody(), this._colors?.body, true)
      this._cache[key] = this._renderPart(body, 96, 0, poseFrame.bodyOffsetY, 2 / 3)
    }
    return this._cache[key]
  }

  private _renderBodyShadow(poseFrame: IPoseFrame) {
    const key = TeePartType.BodyShadow + poseFrame.bodyOffsetY + '_' + this._canvasSize
    if (!this._cache[key]) {
      const bodyShadow = this._getTintedPart(
        'bodyShadowTint',
        this._skin.getBodyShadow(),
        this._colors?.body,
      )
      this._cache[key] = this._renderPart(bodyShadow, 96, 0, poseFrame.bodyOffsetY, 2 / 3)
    }
    return this._cache[key]
  }

  private _renderFrontFoot(poseFrame: IPoseFrame) {
    const { x, y, rotation } = poseFrame.frontFoot
    const key = `${TeePartType.FrontFoot}${x}_${y}_${rotation}_${this._canvasSize}`
    if (!this._cache[key]) {
      const foot = this._getTintedPart('footTint', this._skin.getFoot(), this._colors?.feet)
      this._cache[key] = this._renderPart(foot, 64, x, y, 1, rotation)
    }
    return this._cache[key]
  }

  private _renderFrontFootShadow(poseFrame: IPoseFrame) {
    const { x, y, rotation } = poseFrame.frontFoot
    const key = `${TeePartType.FrontFootShadow}${x}_${y}_${rotation}_${this._canvasSize}`
    if (!this._cache[key]) {
      const footShadow = this._getTintedPart(
        'footShadowTint',
        this._skin.getFootShadow(),
        this._colors?.feet,
      )
      this._cache[key] = this._renderPart(footShadow, 64, x, y, 1, rotation)
    }
    return this._cache[key]
  }

  private _renderBackFoot(poseFrame: IPoseFrame) {
    const { x, y, rotation } = poseFrame.backFoot
    const key = `${TeePartType.BackFoot}${x}_${y}_${rotation}_${this._canvasSize}`
    if (!this._cache[key]) {
      const foot = this._getTintedPart('footTint', this._skin.getFoot(), this._colors?.feet)
      this._cache[key] = this._renderPart(foot, 64, x, y, 1, rotation)
    }
    return this._cache[key]
  }

  private _renderBackFootShadow(poseFrame: IPoseFrame) {
    const { x, y, rotation } = poseFrame.backFoot
    const key = `${TeePartType.BackFootShadow}${x}_${y}_${rotation}_${this._canvasSize}`
    if (!this._cache[key]) {
      const footShadow = this._getTintedPart(
        'footShadowTint',
        this._skin.getFootShadow(),
        this._colors?.feet,
      )
      this._cache[key] = this._renderPart(footShadow, 64, x, y, 1, rotation)
    }
    return this._cache[key]
  }

  private _renderEyes(eye: EyeType, angle: number | null, bodyOffsetY: number) {
    const key = TeePartType.Eye + eye + (angle ?? 'front') + '_' + bodyOffsetY + '_' + this._canvasSize
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

      const leftEye = this._getTintedPart('eyeTint' + eye, this._skin.getEye(eye), this._colors?.body)
      const rightEye = Canvas.flip(leftEye)

      const leftEyeCanvas = this._renderPart(leftEye, 32, leftOffsetX, offsetY, scale)
      const rightEyeCanvas = this._renderPart(rightEye, 32, rightOffsetX, offsetY, scale)
      this._cache[key] = Canvas.merge(leftEyeCanvas, rightEyeCanvas)!
    }
    return this._cache[key]
  }

  private _getTintedPart(
    cacheKey: string,
    part: HTMLCanvasElement,
    color: TeeColor | undefined,
    weighted = false,
  ) {
    if (!color) return part

    const key = `${cacheKey}_${color.code}`
    if (!this._cache[key]) {
      this._cache[key] = Canvas.tint(part, RgbColor.fromTeeColor(color), weighted)
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
    const { canvas, ctx } = Canvas.create(this._canvasSize)

    const offsetX = normalOffsetX * this._scale + this._padding
    const offsetY = normalOffsetY * this._scale + this._padding

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
