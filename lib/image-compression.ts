export async function compressImage(base64String: string, maxWidth = 1200, quality = 0.8): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement("canvas")
      let width = img.width
      let height = img.height

      if (width > maxWidth) {
        height = (height * maxWidth) / width
        width = maxWidth
      }

      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext("2d")
      if (!ctx) {
        reject(new Error("Could not get canvas context"))
        return
      }

      ctx.drawImage(img, 0, 0, width, height)
      const compressedBase64 = canvas.toDataURL("image/jpeg", quality)
      resolve(compressedBase64)
    }
    img.onerror = () => reject(new Error("Failed to load image"))
    img.src = base64String
  })
}
