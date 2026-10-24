/**
 * Triggers a direct file download in the browser reliably across desktop and mobile.
 * Uses blob fetching first to force download without opening a new preview tab or getting blocked.
 */
export async function downloadFile(url: string, defaultFileName: string) {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.statusText}`)
    }
    const blob = await response.blob()
    const blobUrl = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = blobUrl
    link.download = defaultFileName || "download.pdf"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    setTimeout(() => window.URL.revokeObjectURL(blobUrl), 1000)
  } catch (err) {
    console.warn("Direct blob download failed, falling back to anchor click:", err)
    // Fallback: standard link trigger
    const link = document.createElement("a")
    link.href = url
    link.download = defaultFileName || "download.pdf"
    link.target = "_blank"
    link.rel = "noopener noreferrer"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}
