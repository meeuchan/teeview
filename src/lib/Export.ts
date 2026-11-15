import Canvas from './Canvas'

export type ExportMode = 'full' | 'emoji' | 'crop' | 'cropEmoji'

export const EMOJI_SIZE = 128

export function getExportCanvas(source: HTMLCanvasElement, mode: ExportMode) {
  switch (mode) {
    case 'full':
      return source
    case 'emoji':
      return Canvas.resizeSmooth(source, EMOJI_SIZE, EMOJI_SIZE)
    case 'crop':
      return Canvas.cropToContent(source)
    case 'cropEmoji':
      return Canvas.resizeContain(Canvas.cropToContent(source), EMOJI_SIZE, EMOJI_SIZE)
  }
}

export function downloadCanvas(canvas: HTMLCanvasElement, filename = 'tee.png') {
  const a = document.createElement('a')
  a.href = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream')
  a.download = filename
  a.click()
}

export const canCopyImage =
  typeof ClipboardItem !== 'undefined' && typeof navigator.clipboard?.write === 'function'

export async function copyCanvas(canvas: HTMLCanvasElement) {
  const blob = new Promise<Blob>((resolve, reject) =>
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error('Could not encode image.'))),
      'image/png',
    ),
  )
  await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
}
