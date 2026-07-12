import React, { useState } from 'react';
import { logError } from '../utils/logger';

interface CopyButtonProps {
  textToCopy: string;
  label?: string;
  className?: string;
}

const CopyButton: React.FC<CopyButtonProps> = ({
  textToCopy,
  label = 'Copy result',
  className = ''
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      logError(err, 'CopyButton');
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleCopy}
        // ⚡ Performance: Replaced `transition-all` with `transition` to prevent expensive
        // repaints and layout shifts on interactions.
        className={`group/copybtn relative p-1.5 rounded-full transition duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black ${
          copied
            ? 'bg-green-500/20 text-green-400 focus-visible:ring-green-400'
            : 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white'
        } ${className}`}
        aria-label={copied ? 'Copied to clipboard' : label}
      >
        <span
          className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-black/90 px-2 py-1 text-xs font-medium text-white opacity-0 transition-opacity group-hover/copybtn:opacity-100 group-focus-visible/copybtn:opacity-100 border border-white/10"
          aria-hidden="true"
        >
          {copied ? 'Copied!' : label}
        </span>
        <div className="relative flex items-center justify-center w-4 h-4">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={`absolute inset-0 transition duration-300 transform ${copied ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={`absolute inset-0 transition duration-300 transform ${copied ? 'opacity-0 scale-50' : 'opacity-100 scale-100'}`}>
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
        </div>
      </button>
      <span aria-live="polite" className="sr-only">
        {copied ? 'Copied to clipboard' : ''}
      </span>
    </>
  );
};

// ⚡ Performance: Memoized to prevent re-renders when parent form updates but textToCopy hasn't changed.
// This is useful in forms where keystrokes trigger parent re-renders but the result (and thus the copy button) remains stable.
export default React.memo(CopyButton);
