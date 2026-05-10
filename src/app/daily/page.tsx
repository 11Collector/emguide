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
  X
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
      { id: "myself-product", label: "ใช้สินค้า", icon: ShoppingBag },
      { id: "myself-link", label: "ฟัง Link", icon: Headphones },
      { id: "myself-book", label: "อ่านหนังสือ 15 หน้า", icon: BookOpen },
    ]
  },
  {
    category: "My Social Media",
    color: "from-fuchsia-500 via-pink-500 to-rose-400", // Holo Pink
    glow: "bg-fuchsia-500/20",
    tasks: [
      { id: "social-post", label: "Post", icon: ImageIcon },
      { id: "social-add", label: "เพิ่มเพื่อน", icon: UserPlus },
      { id: "social-reply", label: "Comment / Reply Story", icon: MessageCircle },
      { id: "social-hbd", label: "HBD ใน Inbox", icon: Gift },
    ]
  },
  {
    category: "My Business",
    color: "from-indigo-500 via-purple-500 to-fuchsia-500", // Holo Purple
    glow: "bg-purple-500/20",
    tasks: [
      { id: "biz-approach", label: "ทักเข้าเรื่อง (8 นัดได้ 1 เคส)", icon: MessageSquareText },
      { id: "biz-model", label: "EM6W / Model", icon: Briefcase },
      { id: "biz-follow", label: "Follow up Sponsor", icon: Users },
      { id: "biz-analyze", label: "วิเคราะห์งาน / Follow up Sheet", icon: LineChart },
    ]
  }
];

export default function DailyChecklist() {
  const { dailyStatus, getTasksForDate, toggleDailyTask } = useAppStore();
  const [isClient, setIsClient] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  
  const now = new Date();
  const todayStr = format(now, "yyyy-MM-dd");

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  const completedTasks = getTasksForDate(todayStr);
  
  const totalTasksCount = DAILY_TASKS.reduce((acc, cat) => acc + cat.tasks.length, 0);
  const progress = Math.round((completedTasks.length / totalTasksCount) * 100);

  // Calculate monthly summary
  const start = startOfMonth(now);
  const end = endOfMonth(now);
  const daysPassedInMonth = now.getDate(); // How many days have passed this month
  
  const taskCounts: Record<string, number> = {};
  let totalDaysActive = 0;

  Object.entries(dailyStatus).forEach(([dateStr, data]) => {
    const date = parseISO(dateStr);
    if (isWithinInterval(date, { start, end })) {
      totalDaysActive++;
      data.tasks.forEach(taskId => {
        taskCounts[taskId] = (taskCounts[taskId] || 0) + 1;
      });
    }
  });

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
                return (
                  <button
                    key={task.id}
                    onClick={() => toggleDailyTask(todayStr, task.id)}
                    className={cn(
                      "w-full flex items-center justify-between p-3.5 rounded-2xl transition-all duration-300 group",
                      isCompleted 
                        ? "bg-white/5 border border-white/5 shadow-inner" 
                        : "bg-[#0F172A]/40 border border-white/10 hover:bg-white/5 hover:border-white/20 hover:shadow-lg"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "p-2 rounded-xl transition-all duration-300",
                        isCompleted 
                          ? cn(category.glow, "text-white shadow-lg") 
                          : "bg-black/20 text-slate-400 group-hover:text-slate-300"
                      )}>
                        <task.icon size={16} />
                      </div>
                      <span className={cn(
                        "text-sm font-bold transition-all text-left",
                        isCompleted ? "text-slate-400 line-through decoration-slate-500/50" : "text-slate-200 group-hover:text-white"
                      )}>
                        {task.label}
                      </span>
                    </div>
                    <div>
                      {isCompleted ? (
                        <CheckCircle2 size={22} className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
                      ) : (
                        <Circle size={22} className="text-slate-600 group-hover:text-slate-400 transition-colors" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Holo Monthly Summary Modal */}
      <AnimatePresence>
        {showSummary && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#030712]/80 backdrop-blur-lg p-4"
            onClick={() => setShowSummary(false)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-[32px] bg-[#0F172A] border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.8)] p-6 max-h-[85vh] overflow-y-auto relative"
            >
              {/* Minimal Modal Header */}
              <div className="flex justify-between items-start mb-6 border-b border-white/5 pb-4">
                <div>
                  <h2 className="text-xl font-extrabold text-white">
                    สรุปภาพรวมรายเดือน
                  </h2>
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">
                    {format(now, "MMMM")} • ผ่านมาแล้ว {daysPassedInMonth} วัน
                  </p>
                </div>
                <button onClick={() => setShowSummary(false)} className="p-1.5 bg-white/5 hover:bg-white/10 rounded-full text-slate-400 transition-colors">
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-6">
                {DAILY_TASKS.map((category) => (
                  <div key={category.category}>
                    <h3 className={cn(
                      "text-[10px] font-bold uppercase tracking-widest mb-3 flex items-center gap-2",
                      category.color.includes("fuchsia") ? "text-pink-400" : category.color.includes("blue") ? "text-cyan-400" : "text-purple-400"
                    )}>
                      {category.category}
                    </h3>
                    
                    <div className="space-y-3">
                      {category.tasks.map((task) => {
                        const count = taskCounts[task.id] || 0;
                        const percent = Math.min(Math.round((count / daysPassedInMonth) * 100), 100);
                        
                        return (
                          <div key={task.id} className="bg-black/20 rounded-2xl p-3 border border-white/5">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <task.icon size={12} className="text-slate-400" />
                                <span className="text-xs font-bold text-slate-300">{task.label}</span>
                              </div>
                              <div className="flex items-center gap-2 text-[10px] font-bold">
                                <span className="text-slate-500">{count} วัน</span>
                                <span className="text-white bg-white/10 px-2 py-0.5 rounded-full">{percent}%</span>
                              </div>
                            </div>
                            <div className="w-full h-1 bg-black/40 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${percent}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className={cn("h-full rounded-full bg-gradient-to-r", category.color)} 
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
