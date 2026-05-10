"use client";

import { motion } from "framer-motion";
import { Sparkles, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const CATEGORIES = [
  "สุขภาพและร่างกาย",
  "การเงินและความมั่นคง",
  "การงานและธุรกิจ",
  "ความสัมพันธ์และครอบครัว",
  "การพัฒนาตัวเอง",
  "ความสนุกและไลฟ์สไตล์",
  "จิตวิญญาณและความสุข",
  "การให้และสังคม"
];

export default function Dreams() {
  const [dreams, setDreams] = useState<string[]>(Array(10).fill(""));

  const handleInput = (index: number, val: string) => {
    const newDreams = [...dreams];
    newDreams[index] = val;
    setDreams(newDreams);
  };

  const fillRemaining = () => {
    // Expand to 100 on demand
    if (dreams.length < 100) {
      setDreams([...dreams, ...Array(100 - dreams.length).fill("")]);
    }
  };

  return (
    <div className="p-6 min-h-full flex flex-col pb-24">
      <header className="mb-6 mt-4">
        <Link href="/library" className="inline-flex items-center gap-1 text-slate-400 hover:text-slate-700 font-bold text-xs mb-4">
          <ChevronLeft size={16} />
          Back to Library
        </Link>
        <motion.h1 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-extrabold text-slate-800 tracking-tight leading-tight flex items-center gap-2"
        >
          <Sparkles className="text-purple-500" />
          100 Dream Board
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-slate-500 mt-1 text-sm font-medium"
        >
          ลากเส้นเชื่อมต่อเป้าหมายชีวิตของคุณผ่าน 8 หมวดหมู่หลัก วงล้อชีวิต (Wheel of Life)
        </motion.p>
      </header>

      {/* Example Categories horizontally scrollable */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide -mx-2 px-2 mb-4"
      >
        {CATEGORIES.map((cat, idx) => (
          <div key={idx} className="bg-slate-100 text-slate-600 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap">
            {cat}
          </div>
        ))}
      </motion.div>

      <div className="flex-1 space-y-3">
        {dreams.map((dream, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + (index % 10) * 0.05 }}
            className="flex items-center gap-3 relative"
          >
            <div className="w-8 h-8 flex-shrink-0 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center font-extrabold text-xs">
              {index + 1}
            </div>
            <input 
              type="text"
              value={dream}
              onChange={(e) => handleInput(index, e.target.value)}
              placeholder="e.g. อยากปลดหนี้ / พาครอบครัวไปเที่ยว..."
              className="w-full bg-white border border-slate-200 shadow-sm rounded-xl px-4 py-3 text-slate-800 font-medium placeholder:text-slate-300 focus:outline-none focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/10 transition-all text-sm"
            />
          </motion.div>
        ))}

        {dreams.length < 100 && (
          <motion.button 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={fillRemaining}
            className="w-full mt-6 bg-slate-900 border border-slate-200 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-colors"
          >
            Load 100 Rows
          </motion.button>
        )}
      </div>
    </div>
  );
}
