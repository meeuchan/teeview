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
    img.src = url
  })

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
