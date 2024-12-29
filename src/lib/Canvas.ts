import type { RgbColor } from './Color'

export default {
  create(width: number, height?: number) {
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height || width

    const ctx = canvas.getContext('2d')!

    return { canvas, ctx }
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

  flip(canvas: HTMLCanvasElement) {
    const { canvas: flippedCanvas, ctx } = this.create(canvas.width)

    ctx.translate(canvas.width, 0)
    ctx.scale(-1, 1)
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

    for (let i = 0; i < pixels.length; i += 4) {
      const gray = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3
      pixels[i] = gray
      pixels[i + 1] = gray
      pixels[i + 2] = gray
    }

    if (weightedGrayscale) {
      const f = Array(256).fill(0)
      let orgWeight = 0
      const newWeight = 192

      for (let i = 0; i < pixels.length; i += 4) {
        if (pixels[i + 3] > 128) f[pixels[i]]++
      }

      for (let i = 1; i < 256; i++) {
        if (f[orgWeight] < f[i]) orgWeight = i
      }

      const invOrgWeight = 255 - orgWeight
      const invNewWeight = 255 - newWeight

      for (let i = 0; i < pixels.length; i += 4) {
        let v = pixels[i]

        if (v <= orgWeight && orgWeight == 0) v = 0
        else if (v <= orgWeight) v = (v / orgWeight) * newWeight
        else if (invOrgWeight == 0) v = newWeight
        else v = ((v - orgWeight) / invOrgWeight) * invNewWeight + newWeight

        pixels[i] = v
        pixels[i + 1] = v
        pixels[i + 2] = v
      }
    }

    for (let i = 0; i < pixels.length; i += 4) {
      pixels[i] = pixels[i] * rgbColor.r
      pixels[i + 1] = pixels[i + 1] * rgbColor.g
      pixels[i + 2] = pixels[i + 2] * rgbColor.b
    }

    ctx.putImageData(imgData, 0, 0)

    return tintedCanvas
  },
}
