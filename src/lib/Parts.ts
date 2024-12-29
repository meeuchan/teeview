export enum SkinPartType {
  Body = 'body',
  BodyShadow = 'bodyShadow',
  Foot = 'foot',
  FootShadow = 'footShadow',
  Eye = 'eye',
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

export enum FaceType {
  Right,
  Left,
  Front,
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

export const FaceTypeLabels: { [key in FaceType]: string } = {
  [FaceType.Right]: 'Right',
  [FaceType.Left]: 'Left',
  [FaceType.Front]: 'Front',
}
