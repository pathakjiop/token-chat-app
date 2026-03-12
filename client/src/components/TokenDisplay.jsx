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
    <div className="premium-card rounded-[24px] p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full"></div>
          <span className="text-[12px] font-black text-zinc-600 uppercase tracking-[0.2em]">Signal Origin</span>
        </div>
        {copied && (
          <span className="text-[10px] font-bold text-white uppercase tracking-widest animate-pulse">Copied to HUD</span>
        )}
      </div>
      <div 
        onClick={copyToClipboard}
        className="group relative cursor-pointer"
      >
        <div className="absolute inset-0 bg-white/5 blur-xl group-hover:bg-white/10 transition-all rounded-full"></div>
        <div className="relative flex items-center justify-between bg-black/40 border border-white/10 rounded-2xl px-6 py-5 overflow-hidden">
          <div className="text-2xl font-mono font-bold tracking-[0.2em] text-white">
            {token}
          </div>
          <div className="text-zinc-500 group-hover:text-white transition-colors">
            {copied ? <Check className="w-5 h-5 text-white" /> : <Copy className="w-5 h-5" />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenDisplay;

