"use client";

import { useEffect, useState } from "react";
import { format, startOfMonth, endOfMonth, isWithinInterval, parseISO } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2, 
  Circle,
  ShoppingBag,
  Headphones,
  BookOpen,
  Image as ImageIcon,
  UserPlus,
  MessageCircle,
  Gift,
  MessageSquareText,
  Briefcase,
  Users,
  LineChart,
  BarChart3,
  X,
  Sparkles
} from "lucide-react";
import Image from "next/image";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";

const DAILY_TASKS = [
  {
    category: "Myself",
    color: "from-blue-500 via-cyan-400 to-teal-400",
    glow: "bg-cyan-500/20",
    tasks: [
      { id: "myself-product", label: "ใช้สินค้า", icon: ShoppingBag, isCounter: false },
      { id: "myself-link", label: "ฟัง Link", icon: Headphones, isCounter: false },
      { id: "myself-book", label: "อ่านหนังสือ 15 หน้า", icon: BookOpen, isCounter: false },
    ]
  },
  {
    category: "My Social Media",
    color: "from-fuchsia-500 via-pink-500 to-rose-400",
    glow: "bg-fuchsia-500/20",
    tasks: [
      { id: "social-post", label: "Post", icon: ImageIcon, isCounter: false },
      { id: "social-add", label: "เพิ่มเพื่อน", icon: UserPlus, isCounter: false },
      { id: "social-reply", label: "Comment / Reply Story", icon: MessageCircle, isCounter: false },
      { id: "social-hbd", label: "HBD ใน Inbox", icon: Gift, isCounter: false },
    ]
  },
  {
    category: "My Business",
    color: "from-indigo-500 via-purple-500 to-fuchsia-500",
    glow: "bg-purple-500/20",
    tasks: [
      { id: "biz-approach", label: "ทักเข้าเรื่อง", icon: MessageSquareText, isCounter: true },
      { id: "biz-model", label: "EM6W / Business Model", icon: Briefcase, isCounter: false },
      { id: "biz-follow", label: "Follow up Sponsor", icon: Users, isCounter: false },
      { id: "biz-analyze", label: "วิเคราะห์งาน / Follow up Sheet", icon: LineChart, isCounter: false },
    ]
  }
];

const SUMMARY_QUOTES = [
  {
    h4: "ความเป็นเราพาเรามาได้เท่านี้\nอยากสำเร็จกว่านี้ต้องเปลี่ยนแปลงตัวเอง",
    p: "\"What Got You Here Won't Get You There\""
  },
  {
    h4: "ความฝันที่ยิ่งใหญ่\nเอาชนะได้ทุกปัญหาอุปสรรค",
    p: "\"Big Dreams Overcome Small Obstacles\""
  }
];

export default function DailyChecklist() {
  const { dailyStatus, getTasksForDate, toggleDailyTask, incrementDailyTask, getTaskCount, celebratedDays, setCelebratedDay } = useAppStore();
  const [isClient, setIsClient] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  
  const now = new Date();
  const todayStr = format(now, "yyyy-MM-dd");

  const completedTasks = getTasksForDate(todayStr);
  const totalTasksCount = DAILY_TASKS.reduce((acc, cat) => acc + cat.tasks.length, 0);
  const progress = Math.round((completedTasks.length / totalTasksCount) * 100);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      const celebratedKey = `daily_${todayStr}`;
      if (progress === 100) {
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
  }, [progress, todayStr, isClient, celebratedDays, setCelebratedDay]);

  if (!isClient) return null;

  // Calculate monthly summary
  const start = startOfMonth(now);
  const end = endOfMonth(now);
  const daysPassedInMonth = now.getDate();
  
  const taskCounts: Record<string, number> = {};
  const categoryStats: Record<string, { completed: number, total: number }> = {};
  let totalTasksDone = 0;
  let activeDays = 0;

  // Initialize category stats
  DAILY_TASKS.forEach(cat => {
    categoryStats[cat.category] = { completed: 0, total: cat.tasks.length * daysPassedInMonth };
  });

  const activityData: { date: string, count: number, percent: number }[] = [];
  
  const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000);
  const summaryQuote = SUMMARY_QUOTES[dayOfYear % SUMMARY_QUOTES.length];

  for (let i = 1; i <= daysPassedInMonth; i++) {
    const d = new Date(now.getFullYear(), now.getMonth(), i);
    const dStr = format(d, "yyyy-MM-dd");
    const tasks = getTasksForDate(dStr);
    const count = tasks.length;
    const percent = Math.round((count / totalTasksCount) * 100);
    
    activityData.push({ date: dStr, count, percent });
    
    if (count > 0) {
      activeDays++;
      totalTasksDone += count;
      
      tasks.forEach(taskId => {
        taskCounts[taskId] = (taskCounts[taskId] || 0) + 1;
        
        // Find which category this task belongs to
        DAILY_TASKS.forEach(cat => {
          if (cat.tasks.some(t => t.id === taskId)) {
            categoryStats[cat.category].completed++;
          }
        });
      });
    }
  }

  const avgCompletion = activeDays > 0 ? Math.round((totalTasksDone / (totalTasksCount * daysPassedInMonth)) * 100) : 0;
  const streak = useAppStore.getState().getStreak(totalTasksCount); // Use the store's streak logic (100% completion)
  const currentStreak = useAppStore.getState().getStreak(1); // Any task done counts as active for streak in some contexts, but let's use 100% for prestige

  return (
    <div className="p-6 min-h-full flex flex-col text-slate-50 relative overflow-hidden">
      {/* Holo / Gen Z Background Orbs */}
      <div className="fixed top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-fuchsia-600/20 blur-[100px] pointer-events-none" />
      <div className="fixed bottom-[10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-cyan-600/20 blur-[120px] pointer-events-none" />
      <div className="fixed top-[40%] left-[20%] w-[40vw] h-[40vw] rounded-full bg-indigo-600/20 blur-[100px] pointer-events-none" />

      <header className="mb-8 mt-4 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-[#0F172A] rounded-2xl flex items-center justify-center shrink-0 border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.1)] overflow-hidden relative backdrop-blur-md">
            <Image src="/logo.png" alt="Logo" fill className="object-contain p-2 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
          </div>
          <div>
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-cyan-200 tracking-tight leading-tight"
            >
              Daily Checklist
            </motion.h1>
              <span className="text-slate-400 text-xs sm:text-sm font-medium mt-1 uppercase tracking-widest">
                {format(now, "EEEE, d MMM yyyy")}
              </span>
            </div>
        </div>
        <div className="flex flex-col items-end shrink-0">
          <div className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-[0.2em] mb-1">
            {format(now, "dd MMM yyyy")}
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setShowSummary(true)}
              className="w-12 h-12 bg-white/5 backdrop-blur-xl rounded-full border border-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-all shadow-lg hover:shadow-cyan-500/20"
            >
              <BarChart3 size={20} />
            </button>
          </div>
        </div>
      </header>
  
        {/* Progress Holographic Bar */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8 p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-500/10 via-cyan-500/10 to-transparent" />
          <div className="flex justify-between items-end mb-3 relative z-10">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ความคืบหน้าวันนี้</span>
              <h2 className="text-2xl font-extrabold text-white mt-1">{progress}% <span className="text-xs font-normal text-slate-400">สำเร็จ</span></h2>
            </div>
            <div className="text-xs font-bold bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-md">
              {completedTasks.length} / {totalTasksCount}
            </div>
          </div>
          <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden relative z-10 shadow-inner">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-400 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.6)]" 
            />
          </div>
        </motion.div>
  
        <div className="space-y-6 mb-8 relative z-10">
          {DAILY_TASKS.map((category, catIdx) => (
            <motion.div 
              key={category.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (catIdx + 1) }}
              className="bg-white/5 backdrop-blur-xl rounded-3xl p-5 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] relative overflow-hidden"
            >
              {/* Background Glow */}
              <div className={cn(
                "absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20 -mt-10 -mr-10",
                category.color.split(" ")[0].replace('from-', 'bg-') // Extract first color for glow
              )} />
  
              <h2 className={cn("bg-gradient-to-r", category.color, "text-transparent bg-clip-text text-xs font-extrabold uppercase tracking-widest mb-4 flex items-center gap-2 relative z-10")}>
                {category.category}
              </h2>

            <div className="space-y-3 relative z-10">
              {category.tasks.map((task) => {
                const isCompleted = completedTasks.includes(task.id);
                const count = getTaskCount(todayStr, task.id);
                const showCounter = task.isCounter;
                
                return (
                  <div
                    key={task.id}
                    className={cn(
                      "w-full flex items-center justify-between p-3.5 rounded-2xl transition-all duration-300 group",
                      isCompleted || (showCounter && count > 0)
                        ? "bg-white/5 border border-white/5 shadow-inner" 
                        : "bg-[#0F172A]/40 border border-white/10 hover:bg-white/5 hover:border-white/20 hover:shadow-lg"
                    )}
                  >
                    <button 
                      onClick={() => !showCounter && toggleDailyTask(todayStr, task.id)}
                      className={cn("flex items-center gap-3 flex-1 text-left", showCounter && "cursor-default")}
                    >
                      <div className={cn(
                        "p-2 rounded-xl transition-all duration-300",
                        isCompleted || (showCounter && count > 0)
                          ? cn(category.glow, "text-white shadow-lg") 
                          : "bg-black/20 text-slate-400 group-hover:text-slate-300"
                      )}>
                        <task.icon size={16} />
                      </div>
                      <span className={cn(
                        "text-sm font-bold transition-all",
                        (isCompleted || (showCounter && count > 0)) && !showCounter ? "text-slate-400 line-through decoration-slate-500/50" : "text-slate-200 group-hover:text-white"
                      )}>
                        {task.label}
                      </span>
                    </button>
                    
                    {showCounter ? (
                      <div className="flex items-center gap-3 ml-2 bg-black/40 rounded-xl p-1 border border-white/5">
                        <button 
                          onClick={(e) => { e.stopPropagation(); incrementDailyTask(todayStr, task.id, -1); }}
                          className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 active:scale-95 transition-all"
                        >
                          -
                        </button>
                        <span className="w-4 text-center text-sm font-bold text-white">{count}</span>
                        <button 
                          onClick={(e) => { e.stopPropagation(); incrementDailyTask(todayStr, task.id, 1); }}
                          className="w-7 h-7 flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg active:scale-95 transition-all"
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => toggleDailyTask(todayStr, task.id)}>
                        {isCompleted ? (
                          <CheckCircle2 size={22} className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
                        ) : (
                          <Circle size={22} className="text-slate-600 hover:text-slate-400 transition-colors" />
                        )}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        ))}
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
              className="w-full max-w-sm rounded-[32px] bg-gradient-to-br from-indigo-900/90 via-purple-900/90 to-[#0F172A] border border-fuchsia-500/30 shadow-[0_0_80px_rgba(217,70,239,0.3)] p-8 text-center relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-fuchsia-500/20 via-transparent to-transparent pointer-events-none" />
              
              <div className="mx-auto w-20 h-20 bg-gradient-to-tr from-fuchsia-500 to-cyan-400 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(217,70,239,0.5)] mb-6 relative z-10">
                <Sparkles size={40} className="text-white" />
              </div>
              
              <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-fuchsia-200 mb-3 relative z-10">
                ยอดเยี่ยมมาก!
              </h2>
              
              <p className="text-slate-300 text-sm font-medium leading-relaxed mb-8 relative z-10">
                คุณทำตามระบบสำเร็จไป 1 วันแล้ว<br/>
                <span className="text-fuchsia-300 font-bold">2 ปีต่อเนื่องสำเร็จแน่นอน 🎯</span>
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

      {/* Holo Monthly Summary Modal - Revamped to Dashboard */}
      <AnimatePresence>
        {showSummary && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#030712]/90 backdrop-blur-xl p-4"
            onClick={() => setShowSummary(false)}
          >
            <motion.div 
              initial={{ y: 100, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 100, opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-[40px] bg-[#0F172A]/80 border border-white/10 shadow-[0_20px_80px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[90vh] relative"
            >
              {/* Background Glows for Modal */}
              <div className="absolute top-[-10%] right-[-10%] w-40 h-40 bg-fuchsia-600/20 blur-[60px] pointer-events-none" />
              <div className="absolute bottom-[-10%] left-[-10%] w-40 h-40 bg-cyan-600/20 blur-[60px] pointer-events-none" />

              {/* Modal Header */}
              <div className="p-6 pb-0 flex justify-between items-center relative z-10">
                <div>
                  <h2 className="text-2xl font-black text-white tracking-tight">สรุปภาพรวมรายเดือน</h2>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] mt-1">
                    {format(now, "MMMM yyyy")}
                  </p>
                </div>
                <button 
                  onClick={() => setShowSummary(false)} 
                  className="w-10 h-10 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full flex items-center justify-center text-slate-400 transition-all active:scale-95"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6 relative z-10 custom-scrollbar">
                {/* Top Stats Row */}
                <div className="grid grid-cols-2 gap-4">
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-gradient-to-br from-white/10 to-transparent border border-white/10 rounded-[24px] p-5 relative overflow-hidden group"
                  >
                    <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-40 transition-opacity">
                      <BarChart3 size={24} className="text-cyan-400" />
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">ความสม่ำเสมอ</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-white">{avgCompletion}</span>
                      <span className="text-sm font-bold text-slate-500">%</span>
                    </div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-gradient-to-br from-white/10 to-transparent border border-white/10 rounded-[24px] p-5 relative overflow-hidden group"
                  >
                    <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-40 transition-opacity">
                      <Sparkles size={24} className="text-fuchsia-400" />
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">สำเร็จ 100%</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-rose-400">{streak}</span>
                      <span className="text-sm font-bold text-slate-500">วันติด</span>
                    </div>
                  </motion.div>
                </div>

                {/* Activity Grid */}
                <div className="bg-white/5 border border-white/5 rounded-[28px] p-5">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-[11px] font-black text-slate-300 uppercase tracking-widest">ปฏิทินกิจกรรม</h3>
                    <span className="text-[10px] text-slate-500 font-bold">{activeDays} / {daysPassedInMonth} วันที่ลงมือทำ</span>
                  </div>
                  <div className="grid grid-cols-7 gap-1.5">
                    {activityData.map((day, idx) => (
                      <motion.div 
                        key={idx}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.01 }}
                        className={cn(
                          "aspect-square rounded-md relative group cursor-help",
                          day.percent === 100 ? "bg-gradient-to-br from-cyan-400 to-blue-500 shadow-[0_0_8px_rgba(34,211,238,0.4)]" :
                          day.percent > 50 ? "bg-white/20" :
                          day.percent > 0 ? "bg-white/10" :
                          "bg-black/40 border border-white/5"
                        )}
                      >
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-white text-[#0F172A] text-[10px] font-black rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
                          วันที่ {idx + 1}: {day.percent}%
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex gap-1 items-center">
                      <div className="w-2 h-2 rounded-full bg-black/40 border border-white/5" />
                      <div className="w-2 h-2 rounded-full bg-white/10" />
                      <div className="w-2 h-2 rounded-full bg-white/20" />
                      <div className="w-2 h-2 rounded-full bg-cyan-400" />
                    </div>
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">ระดับความสม่ำเสมอ</span>
                  </div>
                </div>

                {/* Categories Stat - 3 Columns with Circular Progress */}
                <div className="space-y-4">
                  <h3 className="text-[11px] font-black text-slate-300 uppercase tracking-widest px-1">สถิติรายหมวดหมู่</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {DAILY_TASKS.map((category, idx) => {
                      const stats = categoryStats[category.category];
                      const percent = Math.round((stats.completed / stats.total) * 100) || 0;
                      
                      return (
                        <motion.div 
                          key={category.category}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 + (idx * 0.1) }}
                          className="bg-white/5 border border-white/5 rounded-[24px] p-3 flex flex-col items-center group hover:bg-white/[0.08] transition-all"
                        >
                          {/* Circular Progress */}
                          <div className="relative w-14 h-14 mb-3">
                            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                              {/* Background Circle */}
                              <circle 
                                className="text-white/5" 
                                strokeWidth="10" 
                                stroke="currentColor" 
                                fill="transparent" 
                                r="40" 
                                cx="50" 
                                cy="50" 
                              />
                              {/* Progress Circle */}
                              <motion.circle
                                initial={{ strokeDashoffset: 251.2 }}
                                animate={{ strokeDashoffset: 251.2 - (251.2 * percent) / 100 }}
                                transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 + (idx * 0.1) }}
                                className={cn(
                                  "drop-shadow-[0_0_5px_rgba(255,255,255,0.2)]",
                                  category.color.includes("blue") ? "text-cyan-400" : 
                                  category.color.includes("fuchsia") ? "text-fuchsia-400" : 
                                  "text-purple-400"
                                )}
                                strokeWidth="10"
                                strokeDasharray="251.2"
                                strokeLinecap="round"
                                stroke="currentColor"
                                fill="transparent"
                                r="40" cx="50" cy="50"
                              />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                              <span className="text-[10px] font-black text-white">{percent}%</span>
                            </div>
                          </div>

                          <div className="text-center">
                            <div className={cn("inline-block mb-1 opacity-80", category.color.includes("blue") ? "text-cyan-400" : category.color.includes("fuchsia") ? "text-fuchsia-400" : "text-purple-400")}>
                              {idx === 0 ? <UserPlus size={14} /> : idx === 1 ? <ImageIcon size={14} /> : <Briefcase size={14} />}
                            </div>
                            <h4 className="text-[9px] font-black text-slate-300 uppercase tracking-tighter leading-tight">
                              {category.category.replace("My ", "")}
                            </h4>
                          </div>

                          {/* Mini Task Counts */}
                          <div className="mt-3 flex flex-col gap-1 w-full">
                            <p className="text-[7px] font-black text-slate-500 uppercase tracking-widest mb-1 text-center">Top 3</p>
                            {[...category.tasks]
                              .sort((a, b) => (taskCounts[b.id] || 0) - (taskCounts[a.id] || 0))
                              .slice(0, 3)
                              .map(task => {
                                const count = taskCounts[task.id] || 0;
                                return (
                                  <div key={task.id} className="flex justify-between items-center bg-black/40 px-1.5 py-1 rounded-lg border border-white/5 w-full">
                                    <span className="text-[7px] font-medium text-slate-400 truncate mr-1">{task.label}</span>
                                    <span className="text-[8px] font-black text-cyan-400 shrink-0">{count}</span>
                                  </div>
                                );
                              })}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                <div className="pb-6">
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[24px] p-6 text-center shadow-lg relative overflow-hidden group">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />
                    <Sparkles className="mx-auto mb-3 text-white animate-pulse" size={32} />
                    <h4 className="text-[14px] font-black text-white mb-2 leading-tight whitespace-pre-line">
                      {summaryQuote.h4}
                    </h4>
                    <p className="text-indigo-100 text-[10px] font-bold opacity-90 italic">{summaryQuote.p}</p>
                  </div>
                </div>
              </div>
              
              {/* Modal Footer */}
              <div className="p-6 pt-2 bg-[#0F172A]/90 backdrop-blur-md border-t border-white/5 relative z-10">
                <button 
                  onClick={() => setShowSummary(false)}
                  className="w-full py-4 rounded-2xl bg-white text-[#0F172A] font-black text-sm uppercase tracking-widest hover:bg-slate-100 transition-all active:scale-95 shadow-xl shadow-white/5"
                >
                  ปิดหน้านี้
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
