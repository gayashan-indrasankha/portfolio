/** Whether this browser can create a WebGL context, checked once at load. */
export const hasWebGL = (() => {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(canvas.getContext('webgl2') ?? canvas.getContext('webgl'))
  } catch {
    return false
  }
})()
