import type { RgbColor } from './Color'

export default {
  create(width: number, height?: number) {
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height || width

    const ctx = canvas.getContext('2d')!

    return { canvas, ctx }
  },

  clone(canvas: HTMLCanvasElement) {
    const { canvas: clonedCanvas, ctx } = this.create(canvas.width, canvas.height)

    ctx.drawImage(canvas, 0, 0)

    return clonedCanvas
  },

  merge(...canvases: (HTMLCanvasElement | null)[]) {
    let mergedCanvas: HTMLCanvasElement | null = null
    let ctx: CanvasRenderingContext2D | null = null

    for (const canvas of canvases) {
      if (!canvas) continue

      if (!mergedCanvas || !ctx) {
        ;({ canvas: mergedCanvas, ctx } = this.create(canvas.width))
      }

      ctx.drawImage(canvas, 0, 0)
    }

    return mergedCanvas
  },

  resizeSmooth(canvas: HTMLCanvasElement, width: number, height?: number) {
    const { canvas: resizedCanvas, ctx } = this.create(width)

    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'
    ctx.drawImage(canvas, 0, 0, width, height || width)

    return resizedCanvas
  },

  cropToContent(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d')!
    const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height)

    let minX = canvas.width
    let minY = canvas.height
    let maxX = -1
    let maxY = -1

    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const alpha = data[(y * canvas.width + x) * 4 + 3]
        if (alpha === 0) continue

        if (x < minX) minX = x
        if (x > maxX) maxX = x
        if (y < minY) minY = y
        if (y > maxY) maxY = y
      }
    }

    if (maxX < minX || maxY < minY) return this.clone(canvas)

    const width = maxX - minX + 1
    const height = maxY - minY + 1

    const { canvas: croppedCanvas, ctx: croppedCtx } = this.create(width, height)
    croppedCtx.drawImage(canvas, minX, minY, width, height, 0, 0, width, height)

    return croppedCanvas
  },

  resizeContain(canvas: HTMLCanvasElement, width: number, height?: number) {
    height = height || width

    const scale = Math.min(width / canvas.width, height / canvas.height)
    const drawWidth = canvas.width * scale
    const drawHeight = canvas.height * scale
    const offsetX = (width - drawWidth) / 2
    const offsetY = (height - drawHeight) / 2

    const { canvas: resizedCanvas, ctx } = this.create(width, height)

    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'
    ctx.drawImage(canvas, offsetX, offsetY, drawWidth, drawHeight)

    return resizedCanvas
  },

  flip(canvas: HTMLCanvasElement) {
    const { canvas: flippedCanvas, ctx } = this.create(canvas.width)

    ctx.translate(canvas.width, 0)
    ctx.scale(-1, 1)
    ctx.drawImage(canvas, 0, 0)

    return flippedCanvas
  },

  flipY(canvas: HTMLCanvasElement) {
    const { canvas: flippedCanvas, ctx } = this.create(canvas.width, canvas.height)

    ctx.translate(0, canvas.height)
    ctx.scale(1, -1)
    ctx.drawImage(canvas, 0, 0)

    return flippedCanvas
  },

  scaleY(canvas: HTMLCanvasElement, scaleY: number, offsetY = 0) {
    const { canvas: scaledCanvas, ctx } = this.create(canvas.width, canvas.height)

    ctx.scale(1, scaleY)
    ctx.drawImage(canvas, 0, canvas.height * (scaleY + offsetY))

    return scaledCanvas
  },

  tint(canvas: HTMLCanvasElement, rgbColor: RgbColor, weightedGrayscale = false) {
    const { canvas: tintedCanvas, ctx } = this.create(canvas.width, canvas.height)

    ctx.drawImage(canvas, 0, 0)

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const pixels = imgData.data

    // based on engine/gfx/image_manipulation.cpp
    if (!weightedGrayscale) {
      for (let i = 0; i < pixels.length; i += 4) {
        const gray = 0.2126 * pixels[i] + 0.7152 * pixels[i + 1] + 0.0722 * pixels[i + 2]
        pixels[i] = gray * rgbColor.r
        pixels[i + 1] = gray * rgbColor.g
        pixels[i + 2] = gray * rgbColor.b
      }

      ctx.putImageData(imgData, 0, 0)

      return tintedCanvas
    }

    const gray = new Uint8ClampedArray(pixels.length / 4)
    const f = new Array(256).fill(0)

    for (let i = 0, p = 0; i < pixels.length; i += 4, p++) {
      gray[p] = 0.2126 * pixels[i] + 0.7152 * pixels[i + 1] + 0.0722 * pixels[i + 2]
      if (pixels[i + 3] > 128) f[gray[p]]++
    }

    let orgWeight = 0
    const newWeight = 192

    for (let i = 1; i < 256; i++) {
      if (f[orgWeight] < f[i]) orgWeight = i
    }

    const invOrgWeight = 255 - orgWeight
    const invNewWeight = 255 - newWeight

    for (let i = 0, p = 0; i < pixels.length; i += 4, p++) {
      let v = gray[p]

      if (v <= orgWeight && orgWeight == 0) v = 0
      else if (v <= orgWeight) v = (v / orgWeight) * newWeight
      else if (invOrgWeight == 0) v = newWeight
      else v = ((v - orgWeight) / invOrgWeight) * invNewWeight + newWeight

      pixels[i] = v * rgbColor.r
      pixels[i + 1] = v * rgbColor.g
      pixels[i + 2] = v * rgbColor.b
    }

    ctx.putImageData(imgData, 0, 0)

    return tintedCanvas
  },
}
