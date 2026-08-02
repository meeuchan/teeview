export const getImageFromFile = (file: File) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = () => reject()
      img.src = reader.result as string
    }
    reader.onerror = () => reject()
    reader.readAsDataURL(file)
  })

export const getImageFromUrl = (url: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject()
    img.crossOrigin = 'Anonymous'
    img.src = url
  })

export const getSkinImageByNameOrUrl = async (nameOrUrl: string) => {
  let url = nameOrUrl
  if (!url.startsWith('http')) {
    url = 'https://ddnet.org/skins/skin/' + url + '.png'
  }

  const img = await getImageFromUrl(url)
  img.setAttribute('name', url)
  img.setAttribute('lastModified', 'x')

  if (img.width / img.height !== 2 || img.width < 256 || img.height < 128) {
    throw new Error('The image must have a 2:1 size ratio and a minimum size of 256x128px.')
  }

  return img
}

export interface IParsedSkinCommand {
  skinName?: string
  useCustomColors?: boolean
  bodyColorCode?: number
  feetColorCode?: number
}

export const parseSkinCommand = (command: string): IParsedSkinCommand => {
  const result: IParsedSkinCommand = {}

  for (const statement of command.split(/[;\n]+/)) {
    const trimmed = statement.trim()
    if (!trimmed) continue

    const [key, ...rest] = trimmed.split(/\s+/)
    const value = rest.join(' ')

    switch (key) {
      case 'player_skin':
        result.skinName = value
        break
      case 'player_color_body':
        result.bodyColorCode = Number(value)
        break
      case 'player_color_feet':
        result.feetColorCode = Number(value)
        break
      case 'player_use_custom_color':
        result.useCustomColors = value === '1'
        break
    }
  }

  return result
}

export const getEnumNumericKeys = (enumObj: object) => {
  return Object.keys(enumObj)
    .filter((key) => !isNaN(Number(key)))
    .map(Number)
}

export const debounce = <T extends unknown[], S>(
  func: (...args: T) => S,
  timeout = 300,
): ((...args: T) => void) => {
  let timer: number
  return (...args: T) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      func(...args)
    }, timeout)
  }
}
