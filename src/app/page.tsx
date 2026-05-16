"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { CheckSquare, Briefcase, Users, UserPlus, Sparkles, ChevronRight, Play, RefreshCw } from "lucide-react";
import Link from "next/link";
import { format, startOfDay, endOfDay } from "date-fns";
import { PWAInstall } from "@/components/pwa-install";
import { useAppStore } from "@/store/useAppStore";

const QUOTES = [
  "เชื่อ UL ปรึกษาแบบคิดมาก่อนแล้ว",
  "อย่าติดปัญหาเดิมๆ",
  "ทำงานด้วยเหตุผล ไม่ทำตามอารมณ์",
  "ใครไม่ทำ เราทำ ใครไม่มา เรามา",
  "อยากมี DL แบบไหน เป็น DL แบบนั้น",
  "Sponsor frontline ตลอดเวลา",
  "จัดความสำคัญให้ AW แบบธุรกิจส่วนตัว",
  "เรียนรู้ครั้งเดียว",
  "Clear ปัญหาส่วนตัว",
  "แข่งกับตัวเอง ไม่แข่งกับใคร ลู่ใครลู่มัน",
  "ใช้เวลาคิดและทำงานให้ถึงเป้าหมาย ดีกว่าเสียเวลาหาข้อแก้ตัว",
  "อย่าหวังผลลัพธ์ใหม่ๆ จากการกระทำเดิมๆ",
  "ทุกความสำเร็จมีป้ายราคา อย่าต่อรองราคากับความสำเร็จ",
  "ทุกอย่างเริ่มต้นที่เรา อย่าโทษคนอื่น",
  "ความล้มเหลวที่สุดคือไม่กล้าแม้จะลองลงมือทำ",
  "ความพยายามชดเชยได้ทุกอย่างแม้กระทั่งพรสวรรค์"
];

const APP_FEATURES = [
  {
    href: "/daily",
    icon: <CheckSquare size={20} className="text-blue-400" />,
    title: "Daily Checklist",
    desc: "11 Steps to Success ติดตามงานรายวัน",
    color: "from-blue-500/20 to-cyan-500/20",
    border: "border-blue-500/30"
  },
  {
    href: "/2yrs",
    icon: <Briefcase size={20} className="text-indigo-400" />,
    title: "EM6W / Business Model",
    desc: "บันทึกและจัดการเคสรายบุคคล",
    color: "from-indigo-500/20 to-blue-500/20",
    border: "border-indigo-500/30"
  },
  {
    href: "/follow-up",
    icon: <Users size={20} className="text-cyan-400" />,
    title: "Follow Up",
    desc: "ติดตาม 9 Slide ตามระบบ",
    color: "from-cyan-500/20 to-sky-500/20",
    border: "border-cyan-500/30"
  },
  {
    href: "/new-comers",
    icon: <UserPlus size={20} className="text-sky-400" />,
    title: "New Comers",
    desc: "เพิ่มรายชื่อเพื่อนใหม่ที่พึ่งรู้จัก",
    color: "from-sky-500/20 to-blue-500/20",
    border: "border-sky-500/30"
  }
];

export default function HomePage() {
  const { newComers } = useAppStore();
  const [quote, setQuote] = useState("");
  const [quoteKey, setQuoteKey] = useState(0);

  const todayComersCount = (newComers || []).filter(c => {
    const now = new Date();
    return c.createdAt >= startOfDay(now).getTime() && c.createdAt <= endOfDay(now).getTime();
  }).length;

  useEffect(() => {
    // Random quote based on the day of the year so it changes daily
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
    setQuote(QUOTES[dayOfYear % QUOTES.length]);
  }, []);

  const handleShuffle = () => {
    let newQuote;
    do {
      newQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
    } while (newQuote === quote && QUOTES.length > 1);
    
    setQuote(newQuote);
    setQuoteKey(prev => prev + 1);
  };

  return (
    <div className="min-h-[100dvh] pb-10 px-6 flex flex-col pt-8">

      {/* Date Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-slate-400 text-xs font-bold uppercase tracking-widest">
          WELCOME TO EM DAILY
        </div>
        <div className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.2em]">
          {format(new Date(), "dd MMM yyyy")}
        </div>
      </div>

      {/* Hero Logo & Install */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col items-center justify-center mb-8 relative"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-cyan-400/20 blur-3xl rounded-full" />
        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl shadow-[0_0_40px_rgba(255,255,255,0.1)] flex items-center justify-center p-4 relative z-10 mb-4">
          <Image src="/logo.png" alt="EM Logo" width={100} height={100} className="object-contain drop-shadow-xl" priority />
        </div>

        <PWAInstall />
      </motion.div>

      {/* Quote of the Day */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/10 p-6 rounded-3xl mb-8 relative overflow-hidden shadow-lg"
      >
        <div className="absolute -top-6 -left-6 text-white/5">
          <Sparkles size={100} />
        </div>
        
        <div className="flex justify-between items-center mb-3 relative z-10">
          <h2 className="text-xs font-bold text-blue-400 uppercase tracking-widest flex items-center gap-2">
            <Sparkles size={14} /> Mindset of the Day
          </h2>
          <button 
            onClick={handleShuffle}
            className="text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 p-1.5 rounded-full transition-all active:scale-90"
            aria-label="Shuffle quote"
          >
            <RefreshCw size={14} />
          </button>
        </div>
        
        <AnimatePresence mode="wait">
          <motion.p 
            key={quoteKey}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className="text-lg font-bold text-white leading-relaxed relative z-10 drop-shadow-md text-center px-2 min-h-[56px] flex items-center justify-center"
          >
            "{quote}"
          </motion.p>
        </AnimatePresence>
      </motion.div>

      {/* App Features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-8"
      >
        <h3 className="text-sm font-bold text-slate-300 mb-4 uppercase tracking-wider px-2 flex items-center gap-2">
          🎯 Tools
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {APP_FEATURES.map((feat, idx) => {
            const isNewComers = feat.href === "/new-comers";
            return (
              <motion.div
                key={idx}
                className="h-full"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + (idx * 0.1) }}
              >
                <Link href={feat.href} className={`bg-gradient-to-br ${feat.color} backdrop-blur-sm border ${feat.border} rounded-2xl p-4 flex flex-col items-center text-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all h-full relative`}>
                  {isNewComers && (
                    <div className="absolute top-2 right-2 flex items-center gap-1 bg-sky-500/20 border border-sky-500/30 rounded-full px-2 py-0.5">
                      <span className="text-sky-300 font-bold text-[10px]">{todayComersCount}</span>
                      <span className="text-sky-400/70 text-[9px]">วันนี้</span>
                    </div>
                  )}
                  <div className="bg-black/20 p-3 rounded-xl shadow-inner shrink-0">
                    {feat.icon}
                  </div>
                  <div className="flex-1 flex flex-col justify-center w-full mt-1">
                    <h4 className="font-bold text-white text-[13px] leading-tight mb-1">{feat.title}</h4>
                    <p className="text-[10px] text-slate-300 line-clamp-2 leading-snug">{feat.desc}</p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Boarding Pack Videos */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mb-8"
      >
        <div className="flex justify-between items-center mb-4 px-2">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Play size={14} className="fill-red-500 text-red-500" /> Boarding Pack
          </h3>
          <Link href="/emphasis-pack" className="text-[10px] text-red-400 font-bold uppercase tracking-wider flex items-center gap-1 hover:text-red-300 bg-red-500/10 px-3 py-1.5 rounded-full border border-red-500/20 active:scale-95 transition-all">
            ดูทั้งหมด <ChevronRight size={12} />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            {
              title: "Why Emphasis",
              speaker: "ภาคภูมิ นิติธรรม",
              url: "https://youtu.be/LuIrrAqeVZo?si=vYEXN6s25XoeGLu9",
              color: "from-red-500/20 to-orange-500/20",
              border: "border-red-500/30"
            },
            {
              title: "Business Partnership",
              speaker: "วิรุฬ โตศะศุข",
              url: "https://youtu.be/Az8wfW6jpuc?si=rRMFgoUeHWx5c46_",
              color: "from-orange-500/20 to-yellow-500/20",
              border: "border-orange-500/30"
            }
          ].map((vid, idx) => (
            <motion.a
              key={idx}
              href={vid.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9 + (idx * 0.1) }}
              className={`bg-gradient-to-br ${vid.color} backdrop-blur-sm border ${vid.border} rounded-2xl p-4 flex flex-col items-center text-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all h-full`}
            >
              <div className="bg-red-500/20 p-3 rounded-xl shadow-inner text-red-400 shrink-0">
                <Play size={20} fill="currentColor" />
              </div>
              <div className="flex-1 flex flex-col justify-center w-full mt-1">
                <h4 className="font-bold text-white text-[13px] leading-tight mb-1">{vid.title}</h4>
                <p className="text-[10px] text-slate-300 font-medium uppercase tracking-wider line-clamp-2 leading-snug">{vid.speaker}</p>
              </div>
            </motion.a>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
