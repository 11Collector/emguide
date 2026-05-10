"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Download, CheckSquare, Briefcase, Users, UserPlus, Sparkles, ChevronRight } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

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
    title: "Case Management",
    desc: "บันทึกเคส Business Model และ 6W",
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
  const [quote, setQuote] = useState("");
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Random quote based on the day of the year so it changes daily
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
    setQuote(QUOTES[dayOfYear % QUOTES.length]);

    // Handle PWA Install Prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else {
      alert("หากต้องการติดตั้งแอป: \nบน iOS (Safari) ให้กดปุ่ม Share แล้วเลือก 'Add to Home Screen' \nบน Android (Chrome) ให้กดเมนูจุด 3 จุด แล้วเลือก 'Install app' หรือ 'Add to Home Screen'");
    }
  };

  return (
    <div className="min-h-[100dvh] pb-24 px-6 flex flex-col pt-8">
      
      {/* Date Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-slate-400 text-xs font-bold uppercase tracking-widest">
          WELCOME TO EMGUIDE
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
        
        <button 
          onClick={handleInstallClick}
          className="relative z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-300 text-[10px] uppercase font-bold tracking-widest hover:bg-white/10 transition-colors shadow-inner"
        >
          <Download size={12} /> Install App
        </button>
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
        <h2 className="text-xs font-bold text-blue-400 mb-3 uppercase tracking-widest flex items-center gap-2 relative z-10">
          <Sparkles size={14} /> Mindset of the Day
        </h2>
        <p className="text-lg font-bold text-white leading-relaxed relative z-10 drop-shadow-md text-center px-2">
          "{quote}"
        </p>
      </motion.div>

      {/* App Features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-8"
      >
        <h3 className="text-sm font-bold text-slate-300 mb-4 uppercase tracking-wider px-2">How to use</h3>
        <div className="grid gap-3">
          {APP_FEATURES.map((feat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + (idx * 0.1) }}
            >
              <Link href={feat.href} className={`bg-gradient-to-r ${feat.color} backdrop-blur-sm border ${feat.border} rounded-2xl p-4 flex items-center gap-4 hover:brightness-110 active:scale-[0.98] transition-all`}>
                <div className="bg-black/20 p-3 rounded-xl shadow-inner">
                  {feat.icon}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-white text-sm">{feat.title}</h4>
                  <p className="text-xs text-slate-300 mt-0.5">{feat.desc}</p>
                </div>
                <ChevronRight size={16} className="text-white/30" />
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>



    </div>
  );
}
