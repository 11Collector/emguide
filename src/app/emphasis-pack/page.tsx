"use client";

import { motion } from "framer-motion";
import { ChevronLeft, Play, LayoutGrid } from "lucide-react";
import Link from "next/link";

const PACKS = [
  { id: 1, url: "https://youtube.com/playlist?list=PLCvOGvpolnHLh3qqdebSRQol8_QYFjOYU&si=wFLoacIYzb19mnAj" },
  { id: 2, url: "https://youtube.com/playlist?list=PLCvOGvpolnHJiC-KNqdxLMpIHsCR6pWAp&si=5IdWk2-5OUu-PhYs" },
  { id: 3, url: "https://youtube.com/playlist?list=PLCvOGvpolnHJHeqksz5kEYGuo8QXwLILq&si=v_l5L4xDF2qc9_Pt" },
  { id: 4, url: "https://youtube.com/playlist?list=PLCvOGvpolnHJ0d2e89EEqvn6prCPL3Ys2&si=aEHtxaOATZKbc6tM" },
  { id: 5, url: "https://youtube.com/playlist?list=PLCvOGvpolnHLU0kgUC7TtCx7sKZznZzuO&si=PSttgyXeM6_59Lfo" },
  { id: 6, url: "https://youtube.com/playlist?list=PLCvOGvpolnHI_LDRTjOA4YXsY96MvB_C3&si=uz4nXYiitA-IfuSl" },
  { id: 7, url: "https://www.youtube.com/playlist?list=PLCvOGvpolnHIn6pnOvpuFnE8yGHC0vWg4" },
  { id: 8, url: "https://youtube.com/playlist?list=PLCvOGvpolnHImJ3EDzn0ecQR3RhKkstsj&si=s85aFSxnBYchXXDK" },
  { id: 9, url: "https://youtube.com/playlist?list=PLCvOGvpolnHIl36d59DcM-glY_g98vJga&si=0o26_cxwuwt6XuqR" },
  { id: 10, url: "https://youtube.com/playlist?list=PLCvOGvpolnHLxqleacNyMwX5gatLY3lmf&si=Lf3qX7qbt_ohqbcT" },
  { id: 11, url: "https://youtube.com/playlist?list=PLCvOGvpolnHIQur46iQp5rLMiNCKmfx-a&si=5PzbO349So85URU3" },
  { id: 12, url: "https://www.youtube.com/playlist?list=PLCvOGvpolnHIv85b2Tnz3FfdTS9XhiLIb" },
  { id: 13, url: "https://youtube.com/playlist?list=PLCvOGvpolnHKDwbmy1Xyiqau_XGT6I2wp&si=BkV6xuWI1B_rDe90" },
  { id: 14, url: "https://youtube.com/playlist?list=PLCvOGvpolnHKRI1HgZlZ9C2PFIWhrGZ_l&si=sNhNsER0pQ9ov2:gE" },
  { id: 15, url: "https://youtube.com/playlist?list=PLCvOGvpolnHITUaeVIJv_z90T2A6adDtO&si=AtGhqWM_qrAKHYoN" }
];

export default function EmphasisPackPage() {
  return (
    <div className="min-h-[100dvh] flex flex-col pb-20 pt-16 px-4 bg-[#0B1120]">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 left-0 right-0 z-50 bg-[#0B1120]/80 backdrop-blur-xl border-b border-white/5"
      >
        <div className="flex items-center px-4 h-16">
          <Link
            href="/"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 active:scale-95 transition-all mr-4"
          >
            <ChevronLeft size={20} />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-white leading-tight">Emphasis Packs</h1>
            <p className="text-xs text-blue-400 font-medium">ลิงค์การเรียนรู้ในระบบ Emphasis</p>
          </div>
        </div>
      </motion.div>

      {/* Hero Icon */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col items-center justify-center mt-6 mb-8 relative"
      >
        <div className="absolute inset-0 bg-red-500/10 blur-3xl rounded-full" />
        <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center relative z-10 mb-4 shadow-[0_0_30px_rgba(239,68,68,0.15)]">
          <LayoutGrid size={32} className="text-red-400" />
        </div>
        <p className="text-slate-400 text-sm text-center max-w-[280px]">
          เลือก Pack ที่ต้องการเรียนรู้จาก Playlist บน YouTube
        </p>
      </motion.div>

      {/* Grid of Packs */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        {PACKS.map((pack, idx) => (
          <motion.a
            key={pack.id}
            href={pack.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + (idx * 0.05) }}
            className="bg-white/5 border border-white/10 rounded-2xl p-3 flex flex-col items-center justify-center gap-2 hover:bg-white/10 active:scale-[0.98] transition-all group overflow-hidden relative"
          >
            {/* Subtle gradient background on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/0 to-orange-500/0 group-hover:from-red-500/10 group-hover:to-orange-500/10 transition-colors" />
            
            <div className="w-10 h-10 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 group-hover:bg-red-500 group-hover:text-white transition-all relative z-10">
              <Play size={16} className="ml-1" fill="currentColor" />
            </div>
            
            <div className="text-center relative z-10">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Pack</span>
              <span className="text-xl font-black text-white">{pack.id}</span>
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  );
}
