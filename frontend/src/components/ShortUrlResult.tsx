import { useState } from 'react';

interface ShortUrlResultProps {
  shortUrl: string;
  isConfirmed?: boolean;
}

export default function ShortUrlResult({ shortUrl, isConfirmed = true }: ShortUrlResultProps) {
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
    <div className="mt-5 w-full animate-[fadeIn_0.3s_ease-out]">
      <div className="p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 min-w-0 w-full">
            <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 mb-2 uppercase tracking-wider flex items-center gap-2">
              Your short URL
              {!isConfirmed && (
                <span className="text-[10px] font-normal normal-case text-gray-400 dark:text-gray-500 flex items-center gap-1">
                  <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  confirming...
                </span>
              )}
            </p>
            <div 
              className="text-base font-mono text-gray-900 dark:text-gray-100 break-all cursor-text bg-gray-50 dark:bg-gray-900/50 rounded-md px-3 py-2 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-colors"
            >
              {shortUrl}
            </div>
          </div>
          <div className="flex items-end">
            <button
              onClick={handleCopy}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0 flex items-center gap-2 min-w-[100px] ${
                copied
                  ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-md'
                  : 'bg-gray-700 hover:bg-gray-800 active:bg-gray-900 text-white shadow-sm hover:shadow-md dark:bg-gray-600 dark:hover:bg-gray-700 dark:active:bg-gray-800'
              }`}
            >
            {copied ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                <span>Copied!</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span>Copy</span>
              </>
            )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

