import React from 'react';
import { Copy, Check, ShieldCheck } from 'lucide-react';

const TokenDisplay = ({ token }) => {
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!token) return null;

  return (
    <div className="premium-card rounded-[28px] p-6 lg:p-7 space-y-4 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
          <ShieldCheck className="w-10 h-10 text-white" />
      </div>
      
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-1.5 h-1.5 bg-zinc-600 rounded-full animate-pulse"></div>
          <span className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.4em]">Signal Origin</span>
        </div>
        {copied && (
          <span className="text-[9px] font-black text-white uppercase tracking-[0.3em] animate-fade-in">HUD Updated</span>
        )}
      </div>

      <div 
        onClick={copyToClipboard}
        className="group/token relative cursor-pointer active:scale-[0.98] transition-all"
      >
        <div className="absolute inset-0 bg-white/[0.02] blur-xl group-hover/token:bg-white/[0.05] transition-all rounded-full opacity-40"></div>
        <div className="relative flex items-center justify-between bg-black/60 border border-white/5 rounded-[20px] px-6 py-5 overflow-hidden backdrop-blur-md group-hover/token:border-white/15 transition-all">
          <div className="text-xl font-mono font-black tracking-[0.25em] text-zinc-100 uppercase">
            {token}
          </div>
          <div className="text-zinc-800 group-hover/token:text-white transition-colors p-1.5 bg-white/5 rounded-lg border border-white/5">
            {copied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
          </div>
        </div>
      </div>

      <p className="text-[9px] text-zinc-800 font-bold uppercase tracking-[0.2em] text-center opacity-40">
          Sync spectral key
      </p>
    </div>
  );
};

export default TokenDisplay;


