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
 * Check for common swearwords (basic detection)
 */
function hasSwearwords(text: string): boolean {
  const swearPatterns = /\b(shit|damn|hell|fuck|ass|bitch|bastard|crap|piss)\b/gi;
  return swearPatterns.test(text);
}

/**
 * Extract boolean flags from a parsed URL object
 */
export function getUrlFlags(parsed: URL | null, rawInput: string = ''): UrlFlags {
  if (!parsed) {
    // Check raw input for patterns even if URL parsing failed
    const hasSpaces = /\s/.test(rawInput);
    const portMatch = rawInput.match(/:(\d+)/);
    const hasPort = !!portMatch && portMatch[1] && portMatch[1].length > 0;
    const hasSwearwordsFlag = hasSwearwords(rawInput);
    // Don't mark as short if invalid - we only roast valid short URLs
    const isShort = false;
    // Dot without TLD: ends with dot, or has dot followed by space/nothing, or dot without valid TLD
    const dotWithoutTld = /\.\s*$/.test(rawInput) || /\.(?!\w{2,})/.test(rawInput);
    
    return {
      valid: false,
      hasSpaces,
      hasPort,
      hasSwearwords: hasSwearwordsFlag,
      isShort,
      dotWithoutTld,
    };
  }

  const hostname = parsed.hostname;
  const hasTld = hostname.includes('.') && hostname.split('.').pop() && hostname.split('.').pop()!.length >= 2;
  const isIp = /^[0-9.]+$/.test(hostname);
  const isLocalhost = hostname.toLowerCase() === 'localhost' || hostname.startsWith('localhost:');
  
  // Check for dot without TLD (e.g., "example." or "example. " or just a dot)
  const dotWithoutTld = hostname.endsWith('.') || (hostname.includes('.') && !hasTld);
  
  // A URL is only valid if it has a TLD, is an IP address, or is localhost
  const isValid = hasTld || isIp || isLocalhost;

  // Check raw input for additional patterns
  const hasSpaces = /\s/.test(rawInput);
  const portMatch = rawInput.match(/:(\d+)/);
  const hasPort = !!portMatch && portMatch[1] && portMatch[1].length > 0;
  const hasSwearwordsFlag = hasSwearwords(rawInput);
  // Only mark as short if valid - we're roasting about shortening, not validity
  const isShort = isValid && rawInput.length > 0 && rawInput.length < 30;

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
    hasSpaces,
    hasPort,
    hasSwearwords: hasSwearwordsFlag,
    isShort,
    dotWithoutTld,
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
