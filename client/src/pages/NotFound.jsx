import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Ghost, Home } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 animate-fade-in relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/[0.02] rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="w-full max-w-[420px] premium-glass rounded-[32px] p-12 text-center relative z-10 border border-white/5">
        <div className="relative mb-12">
          <div className="w-24 h-24 bg-white/5 border border-white/10 rounded-[32px] flex items-center justify-center mx-auto relative z-10">
            <Ghost className="w-12 h-12 text-white opacity-20 animate-pulse" />
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[120px] font-black text-white/[0.03] select-none tracking-tighter">
            404
          </div>
        </div>

        <h1 className="text-3xl font-bold tracking-tight mb-4 text-white uppercase font-outfit">Void Encountered</h1>
        
        <p className="text-zinc-500 text-[13px] leading-relaxed mb-10 font-light tracking-wide px-4">
          The coordinates you've provided do not exist within the Noir matrix. This sector has been expunged or never materialized.
        </p>

        <button
          onClick={() => navigate('/')}
          className="premium-button w-full h-[56px] rounded-2xl flex items-center justify-center space-x-3 text-[12px] uppercase tracking-[0.2em] font-bold group"
        >
          <Home className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
          <span>Return to Origin</span>
        </button>

        <div className="mt-8 pt-8 border-t border-white/5">
          <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-[0.3em]">
            Protocol Error: 0xDEADBEEF
          </p>
        </div>
      </div>

      <div className="mt-12 text-center opacity-30">
        <p className="text-[10px] uppercase tracking-[0.4em] font-medium text-white/60">
          Noir.Chat &bull; Sector Undefined
        </p>
      </div>
    </div>
  );
};

export default NotFound;
