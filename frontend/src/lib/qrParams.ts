/**
 * Generate funny query parameters for QR codes
 * These params add personality without affecting redirect functionality
 */

const FUNNY_PARAMS = [
  'shortened=aggressively',
  'length=uncomfortable',
  'original=regrettable',
  'cleanup=necessary',
  'regret=immediate',
  'damage=done',
  'expectations=lowered',
  'dignity=optional',
  'context=lost',
];

/**
 * Get a random funny query parameter
 * @returns A query parameter string (e.g., "?shortened=aggressively")
 */
export function getFunnyQueryParam(): string {
  const randomIndex = Math.floor(Math.random() * FUNNY_PARAMS.length);
  return `?${FUNNY_PARAMS[randomIndex]}`;
}

/**
 * Add funny query parameter to a URL
 * @param url - The URL to add the query parameter to
 * @returns The URL with the funny query parameter appended
 */
export function addFunnyQueryParam(url: string): string {
  const param = getFunnyQueryParam();
  // Check if URL already has query params
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}${param.substring(1)}`;
}

