"use client";

import { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX, SkipForward, Play, Pause, Music } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

const PLAYLIST = [
  { id: 1, title: "Light Of Life", url: "/audio/light-of-life.mp3" },
  { id: 2, title: "เวลาที่เหลือ", url: "/audio/wela-tee-lua.mp3" },
  { id: 3, title: "สุดแรง", url: "/audio/sud-raeng.mp3" },
  { id: 4, title: "เนบิวลา", url: "/audio/nebula.mp3" },
  { id: 5, title: "ติดปีก", url: "/audio/tid-peek.mp3" },
];

export function BackgroundMusic() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch((e) => console.error("Playback failed:", e));
      }
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      const newMuteStatus = !isMuted;
      audioRef.current.muted = newMuteStatus;
      setIsMuted(newMuteStatus);
    }
  };

  const nextTrack = () => {
    setCurrentIndex((prev) => (prev + 1) % PLAYLIST.length);
  };

  useEffect(() => {
    if (audioRef.current) {
      const newUrl = PLAYLIST[currentIndex].url;
      if (!audioRef.current.src.endsWith(newUrl)) {
        audioRef.current.src = newUrl;
        if (isPlaying) {
          audioRef.current.play().catch(() => {});
        }
      }
    }
  }, [currentIndex, isPlaying]);

  const handleEnded = () => {
    nextTrack();
  };

  return (
    <>
      <audio
        ref={audioRef}
        onEnded={handleEnded}
        preload="auto"
      />
      
      <AnimatePresence>
        {isHome && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed top-24 right-10 z-[40] flex flex-col items-end gap-1.5 pointer-events-none"
          >
            {/* Balanced Holo Controls */}
            <div className="flex items-center bg-white/5 backdrop-blur-2xl border border-white/10 rounded-full p-1 shadow-[0_0_20px_rgba(255,255,255,0.05)] pointer-events-auto">
              <button
                onClick={toggleMute}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  isMuted ? 'text-red-400 bg-red-400/10' : 'text-white/30 hover:text-white'
                }`}
              >
                {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
              </button>
              
              <button
                onClick={togglePlay}
                className={`w-10 h-10 rounded-full flex items-center justify-center border border-white/20 text-white shadow-lg active:scale-90 transition-all ${
                  isPlaying 
                  ? 'bg-slate-900 border-cyan-500/40 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.2)]' 
                  : 'bg-gradient-to-tr from-cyan-500/30 via-white/10 to-purple-500/30'
                }`}
              >
                {isPlaying ? (
                  <Pause size={18} fill="currentColor" strokeWidth={2.5} />
                ) : (
                  <Music size={18} strokeWidth={2.5} />
                )}
              </button>

              {isPlaying && (
                <button
                  onClick={nextTrack}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white/30 hover:text-white transition-all"
                >
                  <SkipForward size={14} />
                </button>
              )}
            </div>

            {/* Status Visualizer (Below controls) */}
            <AnimatePresence>
              {isPlaying && (
                <motion.div 
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-full px-2 py-1 flex items-center gap-1.5 shadow-[0_0_10px_rgba(34,211,238,0.05)]"
                >
                  <div className="flex gap-0.5 items-end h-1.5 w-2">
                    {[0.5, 0.7, 0.4].map((d, i) => (
                      <motion.div 
                        key={i}
                        animate={{ height: [1, 4, 2, 5, 1] }}
                        transition={{ repeat: Infinity, duration: d }}
                        className="w-0.5 bg-cyan-400 rounded-full"
                      />
                    ))}
                  </div>
                  <span className="text-[8px] font-bold text-white/50 truncate max-w-[120px] uppercase tracking-wider leading-none">
                    {PLAYLIST[currentIndex].title}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
