/**
 * URL parsing and validation utilities
 */

export interface ParsedUrl {
  protocol: string;
  domain: string;
  fullUrl: string;
}

/**
 * Parse URL into protocol and domain/path components
 */
export function parseUrl(input: string): ParsedUrl {
  const trimmed = input.trim();
  
  // Check if URL has protocol
  const protocolMatch = trimmed.match(/^(https?:\/\/)/i);
  
  if (protocolMatch) {
    // URL has protocol - split it
    const protocol = protocolMatch[1].toLowerCase();
    const domain = trimmed.substring(protocol.length);
    return {
      protocol,
      domain,
      fullUrl: trimmed,
    };
  }
  
  // Check for protocol-relative URL (//example.com)
  if (trimmed.startsWith('//')) {
    return {
      protocol: 'https://',
      domain: trimmed.substring(2),
      fullUrl: `https://${trimmed.substring(2)}`,
    };
  }
  
  // No protocol - default to https://
  return {
    protocol: 'https://',
    domain: trimmed,
    fullUrl: `https://${trimmed}`,
  };
}

/**
 * Validate if domain has a TLD (Top-Level Domain)
 * Returns null if valid, or error info if missing TLD
 */
export interface TldError {
  hasError: true;
  message: string;
  position: number; // Character position where TLD should be
}

export function validateTld(domain: string): TldError | null {
  if (!domain || domain.trim() === '') {
    return null; // Empty domain is handled elsewhere
  }
  
  // Remove leading/trailing slashes and whitespace
  const cleanDomain = domain.trim().replace(/^\/+|\/+$/g, '');
  
  if (!cleanDomain) {
    return null;
  }
  
  // Extract the hostname part (before first /, ?, or #)
  const hostnameMatch = cleanDomain.match(/^([^\/\?#]+)/);
  if (!hostnameMatch) {
    return null;
  }
  
  const hostname = hostnameMatch[1];
  
  // Check for IP address (e.g., 192.168.1.1 or [::1])
  if (/^(\d+\.){3}\d+$/.test(hostname) || /^\[.+\]$/.test(hostname)) {
    return null; // IP addresses don't need TLD validation
  }
  
  // Check for localhost
  if (hostname.toLowerCase() === 'localhost' || hostname.startsWith('localhost:')) {
    return null; // localhost is valid
  }
  
  // Check if hostname has a dot (indicating potential TLD)
  // Valid TLDs: .com, .net, .org, .co.uk, .com.au, etc.
  // At minimum, we need at least one dot
  if (!hostname.includes('.')) {
    // No dot found - missing TLD
    return {
      hasError: true,
      message: 'URL is missing the top-level domain (TLD) like .com, .net, .org',
      position: hostname.length,
    };
  }
  
  // Check if the part after the last dot looks like a TLD
  const parts = hostname.split('.');
  const lastPart = parts[parts.length - 1];
  
  // TLD should be at least 2 characters (e.g., .com, .uk, .io)
  // But could be longer (e.g., .museum, .technology)
  // Also check for port numbers (e.g., example.com:8080)
  const tldPart = lastPart.split(':')[0];
  
  if (tldPart.length < 2) {
    // TLD too short
    return {
      hasError: true,
      message: 'URL is missing the top-level domain (TLD) like .com, .net, .org',
      position: hostname.length - lastPart.length,
    };
  }
  
  // Basic validation: TLD should be alphanumeric
  if (!/^[a-z0-9-]+$/i.test(tldPart)) {
    return {
      hasError: true,
      message: 'URL is missing the top-level domain (TLD) like .com, .net, .org',
      position: hostname.length - lastPart.length,
    };
  }
  
  return null; // Valid TLD found
}

/**
 * Normalize URL by combining protocol and domain
 */
export function normalizeUrl(protocol: string, domain: string): string {
  const cleanProtocol = protocol.trim();
  const cleanDomain = domain.trim();
  
  // Remove protocol from domain if it was accidentally included
  const domainWithoutProtocol = cleanDomain.replace(/^https?:\/\//i, '');
  
  // Combine protocol and domain
  return `${cleanProtocol}${domainWithoutProtocol}`;
}

/**
 * Calculate the character position in the input field where error should point
 * This accounts for the protocol field width
 */
export function getErrorPositionInInput(
  domain: string,
  errorPosition: number,
  protocolFieldWidth: number = 0
): number {
  // Error position is relative to the domain field
  // We need to account for any visual offset from the protocol field
  // For now, return the position as-is since we'll position the arrow relative to the domain input
  return errorPosition;
}

