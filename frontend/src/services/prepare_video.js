/**
 * Given any YouTube watch-style URL or short youtu.be link,
 * return the corresponding embeddable URL.
 *
 * Examples:
 *  - https://www.youtube.com/watch?v=ABC123  → https://www.youtube.com/embed/ABC123
 *  - https://youtu.be/ABC123                → https://www.youtube.com/embed/ABC123
 *
 * If it doesn’t match, returns the original string.
 */
export function toYouTubeEmbed(url) {
    const match = url.match(
      /(?:youtu\.be\/|v=)([A-Za-z0-9_-]{11})/
    )
    if (!match) {
      return url
    }
    return `https://www.youtube.com/embed/${match[1]}`
}