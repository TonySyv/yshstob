import axios from 'axios';

// Axios instance for Redirect Worker
const redirectApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
});

// Axios instance for Analytics Worker
const analyticsApi = axios.create({
  baseURL: import.meta.env.VITE_ANALYTICS_URL || '',
});

export interface ShortUrlResponse {
  shortUrl: string;
  longUrl: string;
}

export interface SpeedometerData {
  average_redirect_ms: number;
  total_redirects: number;
  version: string;
  deploy_timestamp: string;
  commit_summary: string;
}

/**
 * Create a short URL from a long URL
 * @param longUrl - The URL to shorten
 * @param proposedCode - Optional client-generated code for optimistic UI
 */
export async function createShortUrl(
  longUrl: string,
  proposedCode?: string
): Promise<ShortUrlResponse> {
  const response = await redirectApi.post<ShortUrlResponse>('/api/shorten', {
    longUrl,
    proposedCode,
  });
  return response.data;
}

/**
 * Get speedometer metrics from Analytics Worker
 * Uses proxy route /speedometer which forwards to the analytics worker
 */
export async function getSpeedometerData(): Promise<SpeedometerData> {
  // Use relative URL to go through Pages Function proxy
  // This works even if VITE_ANALYTICS_URL is not set
  const response = await fetch('/speedometer', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch speedometer data: ${response.statusText}`);
  }

  return response.json();
}

