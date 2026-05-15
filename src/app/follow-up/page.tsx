"use client";

import { useEffect, useState } from "react";
import { format, startOfMonth, endOfMonth, subMonths, addMonths } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, CheckCircle2, Circle, ChevronDown, ChevronUp, User, ChevronLeft, ChevronRight, Briefcase, ShoppingBag, Edit2, Check, X, Star, Headphones } from "lucide-react";
import Image from "next/image";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";


const BUSINESS_STEPS = ["BM", "BI", "2YRS", "UNIQUENESS", "CHECKIN", "5STEP"];
const PRODUCT_STEPS = ["6W", "ARTISTRY", "ESPRING", "HOUSEHOLD", "SKY", "DETOX"];
const EMPHASIS_PACKS = ["Boarding", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15"];

// Circular Progress Ring Component
function CircularProgressRing({ progress }: { progress: number }) {
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width="80" height="80" className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx="40"
          cy="40"
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="3"
        />
        {/* Progress circle */}
        <circle
          cx="40"
          cy="40"
          r={radius}
          fill="none"
          stroke="url(#progressGradient)"
          strokeWidth="3"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500"
          style={{ filter: 'drop-shadow(0 0 8px rgba(45,212,191,0.6))' }}
        />
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
      </svg>
      <span className="text-sm font-bold text-emerald-400">{progress}%</span>
    </div>
  );
}

export default function FollowUpPage() {
  const { cases, updateCaseStep, updateCaseNotes, toggleCaseFavorite, updateEmphasisPack } = useAppStore();
  const [isClient, setIsClient] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [tempNotes, setTempNotes] = useState("");

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  // Month filtering
  const monthStart = startOfMonth(currentDate).getTime();
  const monthEnd = endOfMonth(currentDate).getTime();
  const currentMonthCases = cases.filter(c => c.createdAt >= monthStart && c.createdAt <= monthEnd);

  // Sort by favorite, pack number, then completion percentage
  const totalSteps = BUSINESS_STEPS.length + PRODUCT_STEPS.length;
  const getPackNumber = (pack?: string) => {
    if (!pack) return -1;
    if (pack === "Boarding") return 0;
    return parseInt(pack) || -1;
  };

  const sortedCases = [...currentMonthCases].sort((a, b) => {
    if (a.isFavorite && !b.isFavorite) return -1;
    if (!a.isFavorite && b.isFavorite) return 1;

    const aPackNum = getPackNumber(a.emphasisPack);
    const bPackNum = getPackNumber(b.emphasisPack);
    if (aPackNum !== bPackNum) return bPackNum - aPackNum;

    const aCompleted = a.completedSteps?.length || 0;
    const bCompleted = b.completedSteps?.length || 0;
    return bCompleted - aCompleted;
  });

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
    setEditingNotesId(null);
  };

  const startEditingNotes = (e: React.MouseEvent, id: string, currentNotes: string) => {
    e.stopPropagation();
    setEditingNotesId(id);
    setTempNotes(currentNotes || "");
  };

  const saveNotes = (id: string) => {
    updateCaseNotes(id, tempNotes);
    setEditingNotesId(null);
  };

  const renderSteps = (cId: string, completed: string[], steps: string[], title: string, Icon: React.ElementType, colorClass: string) => {
    const total = steps.length;
    const done = steps.filter(s => completed.includes(s)).length;

    return (
      <div className="mb-6 last:mb-0">
        <h4 className={cn("text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2", colorClass)}>
          <Icon size={14} />
          {title} ({done}/{total})
        </h4>
        <div className="relative pl-2">
          {/* Connecting Line */}
          <div className="absolute left-[11px] top-4 bottom-4 w-0.5 bg-white/10 rounded-full" />
          
          <div className="space-y-4 relative z-10">
            {steps.map((step, idx) => {
              const isDone = completed.includes(step);
              const isNext = !isDone && (idx === 0 || completed.includes(steps[idx - 1]));
              
              return (
                <button
                  key={step}
                  onClick={() => updateCaseStep(cId, step)}
                  className="w-full flex items-center gap-4 text-left group"
                >
                  <div className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 z-10",
                    isDone ? "bg-white text-slate-900 shadow-[0_0_10px_rgba(255,255,255,0.5)]" : 
                    isNext ? cn("bg-black/40 border border-white/40 shadow-inner", colorClass) : "bg-black/20 text-white/20"
                  )}>
                    {isDone ? <CheckCircle2 size={14} /> : <Circle size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />}
                  </div>
                  <span className={cn(
                    "text-sm font-bold transition-colors",
                    isDone ? "text-white drop-shadow-md" : 
                    isNext ? "text-white/80" : "text-white/30"
                  )}>
                    {step}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 min-h-full flex flex-col text-slate-50 relative overflow-hidden">
      {/* Holo / Gen Z Background Orbs */}
      <div className="fixed top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-emerald-600/20 blur-[100px] pointer-events-none" />
      <div className="fixed bottom-[10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-teal-500/20 blur-[120px] pointer-events-none" />

      <header className="mb-6 mt-4 flex items-center gap-4 relative z-10">
        <div className="w-14 h-14 bg-[#0F172A] rounded-2xl flex items-center justify-center shrink-0 border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.1)] overflow-hidden relative backdrop-blur-md">
          <Image src="/logo.png" alt="Logo" fill className="object-contain p-2 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
        </div>
        <div>
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 via-teal-200 to-cyan-200 tracking-tight leading-tight"
          >
            Follow Up
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-slate-400 text-xs sm:text-sm font-medium mt-1 uppercase tracking-widest"
          >
            ติดตามผู้มุ่งหวัง
          </motion.p>
        </div>
        <div className="ml-auto flex flex-col items-end">
          <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.2em]">
            {format(new Date(), "dd MMM yyyy")}
          </div>
        </div>
      </header>

      {/* Month Selector */}
      <div className="flex items-center justify-between bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] rounded-2xl p-2 mb-6 relative z-10">
        <button onClick={() => setCurrentDate(subMonths(currentDate, 1))} className="p-2 text-slate-400 hover:text-emerald-400 transition-colors">
          <ChevronLeft size={20} />
        </button>
        <span className="font-bold text-white uppercase tracking-widest text-sm text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-300">
          {format(currentDate, "MMMM yyyy")}
        </span>
        <button onClick={() => setCurrentDate(addMonths(currentDate, 1))} className="p-2 text-slate-400 hover:text-emerald-400 transition-colors">
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="space-y-4 pb-12 relative z-10">
        {sortedCases.length === 0 ? (
          <div className="text-center py-12 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 border-dashed">
            <User size={32} className="mx-auto text-slate-500 mb-3" />
            <p className="text-slate-400 text-xs font-medium uppercase tracking-widest">ไม่มีรายชื่อให้ติดตามในเดือนนี้</p>
          </div>
        ) : (
          sortedCases.map((c, i) => {
            const completed = c.completedSteps || [];
            const progress = Math.round((completed.length / totalSteps) * 100);
            const isExpanded = expandedId === c.id;

            return (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i }}
                  className={cn(
                    "bg-[#0F172A] rounded-3xl border transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.3)] overflow-hidden relative z-10",
                    isExpanded ? "border-emerald-400/50 shadow-[0_0_20px_rgba(16,185,129,0.2)]" : "border-white/10"
                  )}
                >
                  {/* Header */}
                  <div
                    onClick={() => toggleExpand(c.id)}
                    className="w-full p-4 flex items-center justify-between text-left relative overflow-hidden cursor-pointer min-h-[100px]"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-teal-500/5" />
                    
                    <div className="flex items-center gap-4 relative z-10 w-full pr-4">
                      <div className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-inner border",
                        c.type === "BM" ? "bg-blue-500/20 border-blue-500/30 text-blue-400" : "bg-emerald-500/20 border-emerald-500/30 text-emerald-400"
                      )}>
                        <User size={24} className="drop-shadow-lg" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center w-full mb-1">
                          <div className="flex items-center gap-2 mr-2">
                            <h3 className="font-extrabold text-white text-base truncate max-w-[150px]">{c.name}</h3>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleCaseFavorite(c.id);
                              }}
                              className="transition-all active:scale-90 shrink-0"
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
                          <span className="text-emerald-400 font-extrabold text-sm drop-shadow-md">{progress}%</span>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          {c.emphasisPack && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-300 text-[10px] font-bold shrink-0">
                              <Headphones size={9} />
                              {c.emphasisPack === "Boarding" ? "Boarding" : `Pack ${c.emphasisPack}`}
                            </span>
                          )}
                          <p className="text-slate-400 text-xs truncate font-medium">
                            {c.notes ? c.notes : "ยังไม่มีบันทึกเพิ่มเติม..."}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 relative z-10 shrink-0">
                      <CircularProgressRing progress={progress} />
                      <div className="text-slate-400">
                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-white/10 bg-black/20"
                      >
                        {/* Emphasis Pack Section */}
                        <div className="p-5 border-b border-white/5">
                          <h4 className="text-[10px] font-extrabold text-purple-400 uppercase tracking-widest flex items-center gap-1.5 mb-3">
                            <Headphones size={12} /> Emphasis Pack
                          </h4>
                          <div className="flex flex-wrap gap-1.5">
                            {EMPHASIS_PACKS.map((pack) => {
                              const isActive = c.emphasisPack === pack;
                              return (
                                <motion.button
                                  key={pack}
                                  onClick={(e) => { e.stopPropagation(); updateEmphasisPack(c.id, pack); }}
                                  whileHover={{ scale: 1.12 }}
                                  whileTap={{ scale: 0.95 }}
                                  className={cn(
                                    "px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all duration-200 cursor-pointer",
                                    isActive
                                      ? "bg-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.7)] border border-purple-400/50"
                                      : "bg-white/5 text-slate-400 hover:bg-white/15 hover:text-slate-100 hover:shadow-[0_0_12px_rgba(168,85,247,0.3)] border border-transparent hover:border-purple-500/30"
                                  )}
                                >
                                  {pack === "Boarding" ? "Boarding" : `P${pack}`}
                                </motion.button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Notes Section */}
                        <div className="p-5 border-b border-white/5">
                          <div className="flex justify-between items-center mb-3">
                            <h4 className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                              <Edit2 size={12} /> Detail & Notes
                            </h4>
                            {editingNotesId !== c.id ? (
                              <button onClick={(e) => startEditingNotes(e, c.id, c.notes)} className="text-slate-400 hover:text-white p-1.5 bg-white/5 rounded-lg transition-colors">
                                <Edit2 size={12} />
                              </button>
                            ) : (
                              <div className="flex gap-2">
                                <button onClick={() => setEditingNotesId(null)} className="text-slate-400 hover:text-white p-1.5 bg-white/5 rounded-lg">
                                  <X size={14} />
                                </button>
                                <button onClick={() => saveNotes(c.id)} className="text-white p-1.5 bg-emerald-500/80 hover:bg-emerald-400 rounded-lg shadow-[0_0_10px_rgba(16,185,129,0.5)]">
                                  <Check size={14} />
                                </button>
                              </div>
                            )}
                          </div>
                          
                          {editingNotesId === c.id ? (
                            <textarea
                              value={tempNotes}
                              onChange={(e) => setTempNotes(e.target.value)}
                              className="w-full bg-black/40 border border-emerald-500/50 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-400 min-h-[80px] resize-none shadow-inner"
                              placeholder="บันทึกว่าคนนี้ต้องเติมเรื่องอะไรดี..."
                              autoFocus
                            />
                          ) : (
                            <p className="text-sm text-slate-200 bg-white/5 p-4 rounded-xl border border-white/5 min-h-[60px] leading-relaxed shadow-inner">
                              {c.notes || <span className="text-slate-500 font-medium italic">ยังไม่มีข้อมูล คลิกปุ่มแก้ไขเพื่อเพิ่มบันทึก</span>}
                            </p>
                          )}
                        </div>

                        <div className="px-5 py-6">
                          {renderSteps(c.id, completed, BUSINESS_STEPS, "Business Steps", Briefcase, "text-blue-400")}
                          <div className="h-6" />
                          {renderSteps(c.id, completed, PRODUCT_STEPS, "Product Steps", ShoppingBag, "text-teal-400")}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
