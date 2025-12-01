/**
 * URL parsing and validation utilities using native browser URL() API
 */

import type { UrlFlags, PatternType } from '../types/urlPersonality';

/**
 * Parse URL using native browser URL() API
 * Attempts to parse as-is, then tries with https:// prefix if that fails
 */
export function parseUrl(input: string): URL | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  try {
    return new URL(trimmed);
  } catch {
    try {
      return new URL('https://' + trimmed);
    } catch {
      return null;
    }
  }
}

/**
 * Extract boolean flags from a parsed URL object
 */
export function getUrlFlags(parsed: URL | null): UrlFlags {
  if (!parsed) {
    return { valid: false };
  }

  const hostname = parsed.hostname;
  const hasTld = hostname.includes('.');
  const isIp = /^[0-9.]+$/.test(hostname);
  const isLocalhost = hostname.toLowerCase() === 'localhost' || hostname.startsWith('localhost:');
  
  // A URL is only valid if it has a TLD, is an IP address, or is localhost
  const isValid = hasTld || isIp || isLocalhost;

  return {
    valid: isValid,
    hasProtocol: parsed.protocol === 'http:' || parsed.protocol === 'https:',
    isHttp: parsed.protocol === 'http:',
    isHttps: parsed.protocol === 'https:',
    hasTld,
    tld: hostname.split('.').pop(),
    isIp,
    isLong: parsed.href.length > 200,
    isVeryLong: parsed.href.length > 500,
    hasQuery: parsed.search.length > 0,
    hasUtm: parsed.search.includes('utm_'),
    hasFragment: parsed.hash.length > 0,
    isLikelyLogin: /login|signin|auth/i.test(parsed.pathname),
    isLikelyAdmin: /admin|dashboard/i.test(parsed.pathname),
    hasMultipleSubdomains: hostname.split('.').length > 3,
  };
}

/**
 * Detect the structural pattern of a URL based on its flags
 */
export function detectStructurePattern(flags: UrlFlags): PatternType {
  if (!flags.valid) {
    // Try to determine why it's invalid
    if (!flags.hasTld) return 'missingTld';
    if (!flags.hasProtocol) return 'missingProtocol';
    return 'invalid_general';
  }

  if (flags.isVeryLong) return 'insanely_long';
  if (flags.hasUtm) return 'utm_tracking';
  if (flags.isLikelyLogin) return 'login_page';
  if (flags.isLikelyAdmin) return 'admin_page';
  if (flags.isIp) return 'ip_address';

  return 'valid';
}

/**
 * Normalize URL by combining protocol and domain
 * (Kept for backward compatibility with existing code)
 */
export function normalizeUrl(protocol: string, domain: string): string {
  const cleanProtocol = protocol.trim();
  const cleanDomain = domain.trim();

  // Remove protocol from domain if it was accidentally included
  const domainWithoutProtocol = cleanDomain.replace(/^https?:\/\//i, '');

  // Combine protocol and domain
  return `${cleanProtocol}${domainWithoutProtocol}`;
}
