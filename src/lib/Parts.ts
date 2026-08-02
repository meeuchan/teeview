export enum SkinPartType {
  Body = 'body',
  BodyShadow = 'bodyShadow',
  Foot = 'foot',
  FootShadow = 'footShadow',
  Eye = 'eye',
  Hand = 'hand',
  HandShadow = 'handShadow',
}

export enum TeePartType {
  Body = 'body',
  BodyShadow = 'bodyShadow',
  FrontFoot = 'frontFoot',
  FrontFootShadow = 'frontFootShadow',
  BackFoot = 'backFoot',
  BackFootShadow = 'backFootShadow',
  Eye = 'eye',
}

export enum EyeType {
  Normal,
  Angry,
  Pain,
  Happy,
  Ninja,
  Surprised,
  Blink,
  Sad,
}

export const EyeTypeLabels: Record<EyeType, string> = {
  [EyeType.Normal]: 'Normal',
  [EyeType.Angry]: 'Angry',
  [EyeType.Pain]: 'Pain',
  [EyeType.Happy]: 'Happy',
  [EyeType.Ninja]: 'Ninja',
  [EyeType.Surprised]: 'Surprised',
  [EyeType.Sad]: 'Sad',
  [EyeType.Blink]: 'Blink',
}

export enum PoseType {
  Idle,
  InAir,
  Sit,
}

export const PoseTypeLabels: Record<PoseType, string> = {
  [PoseType.Idle]: 'Idle',
  [PoseType.InAir]: 'In Air',
  [PoseType.Sit]: 'Sit',
}

export enum WeaponType {
  None,
  Hammer,
  Gun,
  Shotgun,
  Grenade,
  Laser,
  Ninja,
}

export const WeaponTypeLabels: Record<WeaponType, string> = {
  [WeaponType.None]: 'None',
  [WeaponType.Hammer]: 'Hammer',
  [WeaponType.Gun]: 'Gun',
  [WeaponType.Shotgun]: 'Shotgun',
  [WeaponType.Grenade]: 'Grenade',
  [WeaponType.Laser]: 'Laser',
  [WeaponType.Ninja]: 'Ninja',
}
