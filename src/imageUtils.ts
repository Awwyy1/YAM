/**
 * Check if a URL is a local image path (served from /public/images/).
 * Local images are already available on the server and don't need preloading.
 */
export function isLocalImage(url: string): boolean {
  return url.startsWith('/images/');
}

/**
 * Preload a list of image URLs in parallel.
 * Resolves when all images have loaded (or failed individually).
 * Never rejects — failed images are silently skipped.
 */
export function preloadImages(urls: string[]): Promise<void> {
  return Promise.all(
    urls.map(
      (url) =>
        new Promise<void>((resolve) => {
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = () => resolve();
          img.src = url;
        })
    )
  ).then(() => {});
}
