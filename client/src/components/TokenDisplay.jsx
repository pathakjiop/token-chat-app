import React from 'react';
import { Copy, Check } from 'lucide-react';

const TokenDisplay = ({ token }) => {
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!token) return null;

  return (
    <div className="bg-white px-4 py-3 border-b border-gray-100 flex items-center justify-between">
      <div>
        <div className="text-xs text-gray-500 font-medium tracking-wide pb-1">ROOM TOKEN</div>
        <div className="text-lg font-mono font-bold text-gray-800 tracking-wider">
          {token}
        </div>
      </div>
      <button
        onClick={copyToClipboard}
        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center space-x-2"
        title="Copy Token"
      >
        {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
        <span className="text-sm font-medium hidden sm:block">
          {copied ? 'Copied' : 'Copy Code'}
        </span>
      </button>
    </div>
  );
};

export default TokenDisplay;
