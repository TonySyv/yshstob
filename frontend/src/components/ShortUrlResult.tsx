import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { addFunnyQueryParam } from '../lib/qrParams';

interface ShortUrlResultProps {
  shortUrl: string;
  isConfirmed?: boolean;
}

export default function ShortUrlResult({ shortUrl, isConfirmed = true }: ShortUrlResultProps) {
  const [copied, setCopied] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrUrl, setQrUrl] = useState<string>('');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleQRClick = () => {
    // Generate QR URL with funny query param
    const urlWithParams = addFunnyQueryParam(shortUrl);
    setQrUrl(urlWithParams);
    setShowQRModal(true);
  };

  const handleCloseModal = () => {
    setShowQRModal(false);
  };

  const handleDownloadQR = () => {
    // Create a canvas element to convert SVG to PNG
    const svg = document.querySelector('#qr-code-svg') as SVGSVGElement;
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      // Set canvas size to match image
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Fill white background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      
      // Convert to blob and download
      canvas.toBlob((blob) => {
        URL.revokeObjectURL(url);
        if (blob) {
          const downloadUrl = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = downloadUrl;
          a.download = 'qrcode.png';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(downloadUrl);
        }
      }, 'image/png');
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      console.error('Failed to load SVG for download');
    };

    img.src = url;
  };

  return (
    <>
      <div className="mt-4 w-full animate-[fadeIn_0.3s_ease-out]">
        <div className="p-3">
          <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 mb-1.5 uppercase tracking-wider flex items-center gap-2">
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
                className="text-sm font-mono text-gray-900 dark:text-gray-100 whitespace-nowrap overflow-x-auto cursor-text bg-gray-50 dark:bg-gray-900/50 rounded-md px-3 py-2 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-colors"
                style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: 'rgba(156, 163, 175, 0.5) transparent'
                }}
              >
                {shortUrl}
              </div>
            </div>
            <div className="flex items-end gap-2 flex-shrink-0 sm:flex-shrink-0">
              <button
                onClick={handleQRClick}
                className="px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0 flex items-center gap-2 bg-gray-700 hover:bg-gray-800 active:bg-gray-900 text-white shadow-sm hover:shadow-md dark:bg-gray-600 dark:hover:bg-gray-700 dark:active:bg-gray-800"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
                <span>QR</span>
              </button>
              <button
                onClick={handleCopy}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0 flex items-center gap-2 min-w-[90px] ${
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

      {/* QR Code Modal */}
      {showQRModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-[fadeIn_0.2s_ease-out]"
          onClick={handleCloseModal}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          
          {/* Modal Content */}
          <div 
            className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-sm w-full animate-[fadeIn_0.3s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* QR Code */}
            <div className="flex flex-col items-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Scan to open
              </h3>
              <div className="bg-white p-4 rounded-lg mb-4">
                <QRCodeSVG
                  id="qr-code-svg"
                  value={qrUrl}
                  size={300}
                  level="M"
                  includeMargin={true}
                  fgColor="#000000"
                  bgColor="#ffffff"
                />
              </div>
              
              {/* URL with query params (for transparency) */}
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center mb-4 break-all font-mono">
                {qrUrl}
              </p>

              {/* Download Button */}
              <button
                onClick={handleDownloadQR}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-800 dark:bg-gray-600 dark:hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>Download</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

