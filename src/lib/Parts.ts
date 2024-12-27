export enum PartType {
  Body = 'body',
  BodyShadow = 'bodyShadow',
  Foot = 'foot',
  FootShadow = 'footShadow',
  Eye = 'eye',
}

export enum EyeType {
  Normal,
  Angry,
  Hurt,
  Happy,
  Ninja,
  Surprised,
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
  [EyeType.Hurt]: 'Hurt',
  [EyeType.Happy]: 'Happy',
  [EyeType.Ninja]: 'Ninja',
  [EyeType.Surprised]: 'Surprised',
  [EyeType.Sad]: 'Sad',
}

export const FaceTypeLabels: { [key in FaceType]: string } = {
  [FaceType.Right]: 'Right',
  [FaceType.Left]: 'Left',
  [FaceType.Front]: 'Front',
}
