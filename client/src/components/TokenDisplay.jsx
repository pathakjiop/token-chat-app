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
    <div className="premium-card rounded-[32px] p-8 space-y-6 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
          <ShieldCheck className="w-12 h-12 text-white" />
      </div>
      
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-zinc-500 rounded-full animate-pulse"></div>
          <span className="text-[12px] font-black text-zinc-600 uppercase tracking-[0.4em]">Signal Origin</span>
        </div>
        {copied && (
          <span className="text-[10px] font-black text-white uppercase tracking-[0.3em] animate-fade-in">Copied to HUD</span>
        )}
      </div>

      <div 
        onClick={copyToClipboard}
        className="group/token relative cursor-pointer active:scale-[0.98] transition-all"
      >
        <div className="absolute inset-0 bg-white/[0.03] blur-2xl group-hover/token:bg-white/[0.08] transition-all rounded-full opacity-50"></div>
        <div className="relative flex items-center justify-between bg-black/60 border border-white/10 rounded-[24px] px-8 py-7 overflow-hidden backdrop-blur-md group-hover/token:border-white/20 transition-all">
          <div className="text-3xl font-mono font-black tracking-[0.25em] text-white">
            {token}
          </div>
          <div className="text-zinc-600 group-hover/token:text-white transition-colors p-2 bg-white/5 rounded-xl border border-white/5">
            {copied ? <Check className="w-5 h-5 text-white" /> : <Copy className="w-5 h-5" />}
          </div>
        </div>
      </div>

      <p className="text-[11px] text-zinc-700 font-bold uppercase tracking-[0.2em] text-center opacity-60">
          Click to synchronize spectral key
      </p>
    </div>
  );
};

export default TokenDisplay;


