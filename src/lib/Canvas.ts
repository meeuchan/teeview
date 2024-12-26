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

    ctx.save()
    ctx.translate(canvas.width, 0)
    ctx.scale(-1, 1)
    ctx.drawImage(canvas, 0, 0)
    ctx.restore()

    return flippedCanvas
  },
}
