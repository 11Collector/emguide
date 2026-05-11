"use client";

import { useEffect, useState } from "react";
import { format, startOfMonth, endOfMonth, subMonths, addMonths } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Briefcase, TrendingUp, User, Target, ChevronLeft, ChevronRight, Sparkles, Star } from "lucide-react";
import Image from "next/image";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";
import { SwipeDeleteWrapper } from "@/components/swipe-delete-wrapper";

export default function TwoYearsPage() {
  const { cases, monthlyPV, addCase, setPV, celebratedDays, setCelebratedDay, toggleCaseFavorite } = useAppStore();
  const [isClient, setIsClient] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCase, setNewCase] = useState({ name: "", type: "BM", notes: "" });
  const [pvInput, setPvInput] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());

  const [showCelebration, setShowCelebration] = useState(false);

  // Month filtering
  const monthStart = startOfMonth(currentDate).getTime();
  const monthEnd = endOfMonth(currentDate).getTime();
  const currentMonthCases = cases
    .filter(c => c.createdAt >= monthStart && c.createdAt <= monthEnd)
    .sort((a, b) => {
      if (a.isFavorite && !b.isFavorite) return -1;
      if (!a.isFavorite && b.isFavorite) return 1;
      
      const aCompleted = a.completedSteps?.length || 0;
      const bCompleted = b.completedSteps?.length || 0;
      return bCompleted - aCompleted;
    });
  
  const monthStr = format(currentDate, "yyyy-MM");
  const currentMonthPV = monthlyPV?.[monthStr] || 0;

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      const monthStr = format(currentDate, "yyyy-MM");
      const celebratedKey = `case_celebration_${monthStr}`;
      
      if (currentMonthCases.length >= 15 && currentMonthPV >= 30000) {
        if (!celebratedDays[celebratedKey]) {
          setShowCelebration(true);
          setCelebratedDay(celebratedKey, true);
        }
      } else {
        if (celebratedDays[celebratedKey]) {
          setCelebratedDay(celebratedKey, false);
        }
      }
    }
  }, [currentMonthCases.length, currentMonthPV, currentDate, isClient, celebratedDays, setCelebratedDay, monthStr]);

  if (!isClient) return null;
  
  const handleAddCase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCase.name) return;
    addCase({
      name: newCase.name,
      type: newCase.type as "BM" | "EM6W",
      date: format(currentDate, "yyyy-MM-dd"), // keep actual date
      notes: newCase.notes,
      stage: 1, // default stage for Follow Up Sponsor
      createdAt: currentDate.getTime()
    });
    setNewCase({ name: "", type: "BM", notes: "" });
    setShowAddForm(false);
  };

  const handleUpdatePV = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(pvInput);
    if (!isNaN(val)) {
      setPV(val, monthStr);
      setPvInput("");
    }
  };


  return (
    <div className="p-6 min-h-full flex flex-col text-slate-50 relative overflow-hidden">
      {/* Holo / Gen Z Background Orbs */}
      <div className="fixed top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-600/20 blur-[100px] pointer-events-none" />
      <div className="fixed bottom-[10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-cyan-500/20 blur-[120px] pointer-events-none" />
      
      <header className="mb-6 mt-4 flex items-center gap-4 relative z-10">
        <div className="w-14 h-14 bg-[#0F172A] rounded-2xl flex items-center justify-center shrink-0 border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.1)] overflow-hidden relative backdrop-blur-md">
          <Image src="/logo.png" alt="Logo" fill className="object-contain p-2 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
        </div>
        <div>
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-cyan-200 tracking-tight leading-tight"
          >
            Case
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-slate-400 text-xs sm:text-sm font-medium mt-1 uppercase tracking-widest"
          >
            บันทึกเคสรายเดือน
          </motion.p>
        </div>
      </header>

      {/* Month Selector */}
      <div className="flex items-center justify-between bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] rounded-2xl p-2 mb-6 relative z-10">
        <button onClick={() => setCurrentDate(subMonths(currentDate, 1))} className="p-2 text-slate-400 hover:text-cyan-400 transition-colors">
          <ChevronLeft size={20} />
        </button>
        <span className="font-bold text-white uppercase tracking-widest text-sm text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300">
          {format(currentDate, "MMMM yyyy")}
        </span>
        <button onClick={() => setCurrentDate(addMonths(currentDate, 1))} className="p-2 text-slate-400 hover:text-cyan-400 transition-colors">
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 backdrop-blur-xl p-4 rounded-3xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-16 h-16 bg-cyan-400/20 rounded-full blur-xl -mt-5 -mr-5" />
          <div className="flex items-center gap-2 mb-2">
            <Target size={16} className="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Cases</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white">
            {currentMonthCases.length} <span className="text-sm font-medium text-slate-500">/ 15</span>
          </h2>
          <div className="w-full h-1.5 bg-black/40 rounded-full mt-3 overflow-hidden shadow-inner">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.8)]" 
              style={{ width: `${Math.min((currentMonthCases.length / 15) * 100, 100)}%` }} 
            />
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-indigo-600/40 to-purple-600/40 backdrop-blur-xl p-4 rounded-3xl border border-indigo-400/30 shadow-[0_8px_32px_rgba(0,0,0,0.3)] relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-16 h-16 bg-white/20 rounded-full blur-xl -mt-5 -mr-5" />
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={16} className="text-indigo-200" />
            <span className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest">PPV</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white truncate drop-shadow-md">
            {currentMonthPV.toLocaleString()}
          </h2>
          <form onSubmit={handleUpdatePV} className="mt-2 flex gap-2 relative z-10">
            <input
              type="number"
              placeholder="Add PPV"
              value={pvInput}
              onChange={e => setPvInput(e.target.value)}
              className="w-full bg-black/20 border border-white/10 rounded-xl px-2 py-1.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-indigo-400 min-w-0"
            />
            <button type="submit" className="bg-indigo-500/80 text-white p-1.5 rounded-xl shrink-0 hover:bg-indigo-400 transition-colors">
              <Plus size={14} />
            </button>
          </form>
        </motion.div>
      </div>

      <div className="flex justify-between items-center mb-4 relative z-10">
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest">New Cases</h3>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-all"
        >
          <Plus size={14} /> Add Case
        </button>
      </div>

      <AnimatePresence>
        {showAddForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleAddCase}
            className="bg-white/5 backdrop-blur-xl p-5 rounded-3xl border border-white/10 mb-6 overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.3)] space-y-4 relative z-10"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-400/10 rounded-full blur-2xl -mt-10 -mr-10 pointer-events-none" />

            <div className="relative z-10">
              <label className="text-[10px] text-slate-400 font-bold mb-1 block uppercase tracking-wider">Name / Identifier *</label>
              <input
                type="text"
                required
                value={newCase.name}
                onChange={e => setNewCase({...newCase, name: e.target.value})}
                className="w-full bg-[#0F172A]/60 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-400/50"
                placeholder="Name, Job, etc."
              />
            </div>
            <div className="relative z-10">
              <label className="text-[10px] text-slate-400 font-bold mb-1 block uppercase tracking-wider">Type</label>
              <div className="flex gap-2">
                {["BM", "EM6W"].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setNewCase({...newCase, type: type as "BM"})}
                    className={cn(
                      "flex-1 py-2.5 rounded-xl text-xs font-bold transition-all border",
                      newCase.type === type 
                        ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-transparent shadow-[0_0_15px_rgba(34,211,238,0.4)]" 
                        : "bg-[#0F172A]/60 text-slate-400 border-white/10 hover:bg-white/5"
                    )}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
            <div className="relative z-10">
              <label className="text-[10px] text-slate-400 font-bold mb-1 block uppercase tracking-wider">Job / Additional Info</label>
              <input
                type="text"
                value={newCase.notes}
                onChange={e => setNewCase({...newCase, notes: e.target.value})}
                className="w-full bg-[#0F172A]/60 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-400/50"
                placeholder="What do they do?"
              />
            </div>
            <button type="submit" className="w-full bg-white text-slate-900 font-bold py-3 rounded-xl transition-colors mt-2 shadow-lg hover:bg-slate-200 relative z-10">
              Save Case
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="space-y-4 pb-6 relative z-10">
        {currentMonthCases.length === 0 ? (
          <div className="text-center py-12 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 border-dashed">
            <User size={32} className="mx-auto text-slate-500 mb-3" />
            <p className="text-slate-400 text-xs font-medium uppercase tracking-widest">ยังไม่มีเคสในเดือนนี้</p>
          </div>
        ) : (
          currentMonthCases.map((c, i) => (
            <SwipeDeleteWrapper 
              key={c.id} 
              onDelete={() => {
                const { deleteCase } = useAppStore.getState();
                deleteCase(c.id);
              }}
            >
              <div
                className="bg-[#0F172A] p-4 rounded-3xl border border-white/10 shadow-lg flex items-center gap-4 relative z-10"
              >
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-inner border",
                  c.type === 'BM' ? 'bg-blue-500/20 border-blue-500/30 text-blue-400' : 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400'
                )}>
                  <User size={24} className="drop-shadow-lg" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-2 pr-2">
                      <h4 className="font-extrabold text-white text-base truncate max-w-[150px]">{c.name}</h4>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleCaseFavorite(c.id);
                        }}
                        className="transition-all active:scale-90"
                      >
                        <Star 
                          size={16} 
                          className={cn(
                            "transition-colors",
                            c.isFavorite 
                              ? "fill-yellow-400 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]" 
                              : "text-slate-600 hover:text-slate-400"
                          )} 
                        />
                      </button>
                    </div>
                    <span className={cn(
                      "text-[9px] font-extrabold px-2 py-1 rounded-full uppercase shrink-0",
                      c.type === 'BM' ? "bg-blue-500 text-white shadow-[0_0_10px_rgba(59,130,246,0.5)]" : "bg-emerald-500 text-white shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                    )}>
                      {c.type}
                    </span>
                  </div>
                  {c.notes && <p className="text-slate-400 text-xs truncate mt-1">{c.notes}</p>}
                </div>
              </div>
            </SwipeDeleteWrapper>
          ))
        )}
      </div>

      {/* Celebration Modal */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#030712]/80 backdrop-blur-md p-6"
            onClick={() => setShowCelebration(false)}
          >
            <motion.div 
              initial={{ scale: 0.8, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.8, y: 50, opacity: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-[32px] bg-gradient-to-br from-indigo-900/90 via-blue-900/90 to-[#0F172A] border border-cyan-500/30 shadow-[0_0_80px_rgba(34,211,238,0.3)] p-8 text-center relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-500/20 via-transparent to-transparent pointer-events-none" />
              
              <div className="mx-auto w-20 h-20 bg-gradient-to-tr from-cyan-500 to-blue-400 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(34,211,238,0.5)] mb-6 relative z-10">
                <Sparkles size={40} className="text-white" />
              </div>
              
              <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-200 mb-3 relative z-10">
                ยอดเยี่ยมมาก!
              </h2>
              
              <p className="text-slate-300 text-sm font-medium leading-relaxed mb-8 relative z-10">
                เดือนนี้คุณทำถึงตามระบบแล้ว<br/>
                <span className="text-cyan-300 font-bold">GO A70 ทำได้แน่นอน 💎</span>
              </p>
              
              <button 
                onClick={() => setShowCelebration(false)}
                className="w-full py-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 text-white font-bold transition-all active:scale-95 relative z-10"
              >
                ลุยต่อเลย!
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
