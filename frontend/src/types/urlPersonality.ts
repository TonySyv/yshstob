/**
 * Type definitions for the personality-driven URL input system
 */

export type MoodType = 'sassy' | 'bored' | 'bruh' | 'bro' | 'party' | 'chill' | 'wholesome';

export type BehaviorType =
  | 'started_typing'
  | 'cleared_all'
  | 'pasted_big'
  | 'removed_tld'
  | 'added_tld'
  | 'broke_validity'
  | 'fixed_error'
  | 'oscillating'
  | 'typing';

export type PatternType =
  | 'missingTld'
  | 'missingProtocol'
  | 'invalid_general'
  | 'insanely_long'
  | 'utm_tracking'
  | 'login_page'
  | 'admin_page'
  | 'ip_address'
  | 'valid';

export interface UrlFlags {
  valid: boolean;
  hasProtocol?: boolean;
  isHttp?: boolean;
  isHttps?: boolean;
  hasTld?: boolean;
  tld?: string;
  isIp?: boolean;
  isLong?: boolean;
  isVeryLong?: boolean;
  hasQuery?: boolean;
  hasUtm?: boolean;
  hasFragment?: boolean;
  isLikelyLogin?: boolean;
  isLikelyAdmin?: boolean;
  hasMultipleSubdomains?: boolean;
}

export interface InputState {
  value: string;
  parsed: URL | null;
  flags: UrlFlags;
}

export interface MessageResult {
  message: string;
  mood: MoodType;
  behavior: BehaviorType;
  pattern: PatternType;
  parsed: URL | null;
}

