const SVG_RASTER_WIDTH = 1024

const loadImage = (src: string, crossOrigin?: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject()
    if (crossOrigin) img.crossOrigin = crossOrigin
    img.src = src
  })

const readFileAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject()
    reader.readAsDataURL(file)
  })

const rasterizeSvg = async (svgImg: HTMLImageElement, width: number, height: number) => {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Could not create a canvas context.')

  ctx.drawImage(svgImg, 0, 0, width, height)

  return loadImage(canvas.toDataURL('image/png'))
}

export const getImageFromFile = async (file: File) => loadImage(await readFileAsDataUrl(file))

export const getRasterizedSvgImage = async (source: File | string, width = SVG_RASTER_WIDTH) => {
  const svgImg =
    typeof source === 'string'
      ? await loadImage(source, 'Anonymous')
      : await loadImage(await readFileAsDataUrl(source))

  return rasterizeSvg(svgImg, width, width / 2)
}

export const getImageFromUrl = (url: string) => loadImage(url, 'Anonymous')

export const getSkinImageByNameOrUrl = async (nameOrUrl: string) => {
  let url = nameOrUrl
  if (!url.startsWith('http')) {
    url = 'https://ddnet.org/skins/skin/' + url + '.png'
  }

  const img = url.endsWith('.svg') ? await getRasterizedSvgImage(url) : await getImageFromUrl(url)
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
