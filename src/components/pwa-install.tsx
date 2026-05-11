"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, Share, PlusSquare, ArrowUp, Smartphone } from "lucide-react";
import Image from "next/image";

export function PWAInstall() {
  const [show, setShow] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsStandalone(true);
    }

    // Check if iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(userAgent));

    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setDeferredPrompt(null);
        setShow(false);
      }
    }
  };

  if (isStandalone) return null;

  return (
    <>
      <button
        onClick={() => setShow(true)}
        className="relative z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-300 text-[10px] uppercase font-bold tracking-widest hover:bg-white/10 transition-colors shadow-inner"
      >
        <Download size={12} /> Install App
      </button>

      <AnimatePresence>
        {show && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShow(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, y: 100, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0.95 }}
              className="relative w-full max-w-sm bg-slate-900 border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl"
            >
              <div className="absolute top-4 right-4">
                <button 
                  onClick={() => setShow(false)}
                  className="p-2 rounded-full bg-white/5 text-slate-400 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-8 pt-10">
                <div className="flex flex-col items-center text-center mb-8">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 p-4 shadow-lg mb-4">
                    <Image src="/logo.png" alt="Logo" width={80} height={80} className="w-full h-full object-contain" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Install EM DAILY</h3>
                  <p className="text-sm text-slate-400">
                    Add EM DAILY to your home screen for the best experience.
                  </p>
                </div>

                <div className="space-y-6">
                  {isIOS ? (
                    <div className="space-y-4">
                      <div className="flex items-start gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                          <Share size={18} />
                        </div>
                        <div className="text-sm">
                          <p className="text-slate-200 font-medium">1. Tap the Share button</p>
                          <p className="text-slate-400 text-xs">Look for the share icon in your browser's toolbar.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                          <PlusSquare size={18} />
                        </div>
                        <div className="text-sm">
                          <p className="text-slate-200 font-medium">2. Add to Home Screen</p>
                          <p className="text-slate-400 text-xs">Scroll down and select 'Add to Home Screen'.</p>
                        </div>
                      </div>
                    </div>
                  ) : deferredPrompt ? (
                    <button
                      onClick={handleInstall}
                      className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-lg shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                    >
                      <Download size={20} />
                      Install Now
                    </button>
                  ) : (
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/5 text-center">
                      <Smartphone className="mx-auto mb-3 text-slate-500" size={32} />
                      <p className="text-sm text-slate-400">
                        Open the browser menu and select <br />
                        <span className="text-slate-200 font-bold">"Add to Home Screen"</span>
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-8 pt-6 border-t border-white/5 flex justify-center">
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 uppercase font-bold tracking-widest">
                    <ArrowUp size={12} className="animate-bounce" />
                    Works like a native app
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
