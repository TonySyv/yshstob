import { useEffect, useState } from 'react';
import { getSpeedometerData, getUrlCount, type SpeedometerData } from '../lib/api';

export default function Speedometer() {
  const [data, setData] = useState<SpeedometerData | null>(null);
  const [urlCount, setUrlCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [metrics, count] = await Promise.all([
          getSpeedometerData(),
          getUrlCount(),
        ]);
        setData(metrics);
        setUrlCount(count);
      } catch (err: any) {
        const errorMessage = err.message || err.response?.data?.message || 'Failed to load metrics. Please try again.';
        setError(errorMessage);
        console.error('Error fetching speedometer data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-lg text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 rounded-lg p-6 text-red-700 dark:text-red-400">
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const technicalTricks = [
    'Cloudflare Pages Functions - Edge computing for ultra-low latency',
    'KV Namespace for instant key-value lookups (sub-millisecond reads)',
    'Non-blocking analytics with waitUntil() - redirects never wait for analytics',
    'Direct 302 redirects - no server-side rendering overhead',
    'Minimal code path - optimized for the fastest possible redirect',
    'Edge caching - Cloudflare CDN caches responses globally',
    'No database queries - single KV lookup per redirect',
    'Async analytics - fire-and-forget pattern for tracking',
  ];

  const futureImprovements = [
    'Implement edge caching for frequently accessed URLs',
    'Add URL pre-warming for popular links',
    'Use Cloudflare Durable Objects for even faster lookups',
    'Implement predictive prefetching based on usage patterns',
    'Add compression for stored URLs to reduce KV read time',
    'Explore Cloudflare R2 for bulk storage with KV as hot cache',
    'Implement regional KV replication for lower latency',
    'Add HTTP/3 support for faster connection establishment',
    'Optimize redirect response headers (remove unnecessary ones)',
    'Implement connection pooling and keep-alive optimizations',
  ];

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="w-full max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          Speedometer Metrics
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-md">
            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
              Average Redirect Speed
            </h3>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {data.average_redirect_ms.toFixed(3)} ms
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-md">
            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
              Total Redirects
            </h3>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
              {data.total_redirects.toLocaleString()}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-md">
            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
              URLs Shortened
            </h3>
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              {urlCount !== null ? urlCount.toLocaleString() : '...'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-md">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              ⚡ Technical Tricks
            </h2>
            <ul className="space-y-3">
              {technicalTricks.map((trick, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-green-500 dark:text-green-400 mr-2">✓</span>
                  <span className="text-gray-700 dark:text-gray-300">{trick}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-md">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              🚀 Future Improvements
            </h2>
            <ul className="space-y-3">
              {futureImprovements.map((improvement, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-500 dark:text-blue-400 mr-2">→</span>
                  <span className="text-gray-700 dark:text-gray-300">{improvement}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

