/**
 * Check if a URL is a local image path (served from /public/images/).
 * Local images are already available on the server and don't need preloading.
 */
export function isLocalImage(url: string): boolean {
  return url.startsWith('/images/');
}
