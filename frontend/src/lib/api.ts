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
 */
export async function getSpeedometerData(): Promise<SpeedometerData> {
  const response = await analyticsApi.get<SpeedometerData>('/speedometer');
  return response.data;
}

