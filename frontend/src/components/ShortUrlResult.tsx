import { useState } from 'react';

interface ShortUrlResultProps {
  shortUrl: string;
}

export default function ShortUrlResult({ shortUrl }: ShortUrlResultProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="mt-8 w-full max-w-2xl">
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-md">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Your short URL:</p>
            <p className="text-lg font-mono text-blue-600 dark:text-blue-400 break-all">
              {shortUrl}
            </p>
          </div>
          <button
            onClick={handleCopy}
            className="px-6 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium transition-colors duration-200 shadow-md hover:shadow-lg whitespace-nowrap"
          >
            {copied ? '✓ Copied!' : 'Copy'}
          </button>
        </div>
      </div>
    </div>
  );
}

