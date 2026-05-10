"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { UserPlus, Activity, Presentation, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { format } from "date-fns";

export default function AddCase() {
  const router = useRouter();
  const { addCase } = useAppStore();
  
  const [name, setName] = useState("");
  const [type, setType] = useState<"BM" | "EM6W">("BM");
  const [notes, setNotes] = useState("");
  
  const handleSave = () => {
    if (!name) return;
    
    addCase({
      name,
      type,
      notes,
      date: format(new Date(), "PP")
    });

    // Provide a neat little delay for the button animation to complete
    setTimeout(() => {
      router.push("/");
    }, 200);
  };

  return (
    <div className="p-6 min-h-full flex flex-col">
      <header className="mb-8 mt-4">
        <motion.h1 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-extrabold text-slate-800 tracking-tight leading-tight"
        >
          Add Record
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-slate-500 mt-0.5 text-xs font-semibold uppercase tracking-wider"
        >
          Log your newly discussed cases
        </motion.p>
      </header>

      <div className="flex-1 space-y-6">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="space-y-2"
        >
          <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-wider">Prospect Name</label>
          <div className="relative">
            <div className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400">
              <UserPlus size={20} strokeWidth={2.5} />
            </div>
            <input 
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Khun A, P' Som"
              className="w-full bg-white border border-slate-200 shadow-sm rounded-2xl p-4 pl-12 text-slate-800 font-medium placeholder:text-slate-300 focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all"
            />
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-wider">Topic Discussed</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setType("BM")}
              className={cn(
                "p-4 rounded-2xl border-2 flex flex-col gap-2 transition-all",
                type === "BM" 
                  ? "bg-blue-50 border-blue-200 text-blue-600 shadow-[0_0_15px_rgba(59,130,246,0.1)]" 
                  : "bg-white border-slate-100 text-slate-400 hover:bg-slate-50 shadow-sm"
              )}
            >
              <Presentation size={24} strokeWidth={type === "BM" ? 2.5 : 2} />
              <span className="font-bold text-sm">Business Model</span>
            </button>
            <button
              onClick={() => setType("EM6W")}
              className={cn(
                "p-4 rounded-2xl border-2 flex flex-col gap-2 transition-all",
                type === "EM6W" 
                  ? "bg-emerald-50 border-emerald-200 text-emerald-600 shadow-[0_0_15px_rgba(16,185,129,0.1)]" 
                  : "bg-white border-slate-100 text-slate-400 hover:bg-slate-50 shadow-sm"
              )}
            >
              <Activity size={24} strokeWidth={type === "EM6W" ? 2.5 : 2} />
              <span className="font-bold text-sm">EM6W Program</span>
            </button>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="space-y-2"
        >
          <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-wider">Additional Notes</label>
          <textarea 
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Key takeaways, objections, next follow up date..."
            className="w-full bg-slate-50 border border-slate-200 shadow-inner rounded-3xl p-5 text-slate-700 font-medium placeholder:text-slate-400 focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 min-h-[140px] resize-none transition-all"
          />
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8 mb-4 border-t border-slate-100 pt-6"
      >
        <button
          onClick={handleSave}
          disabled={!name}
          className="w-full flex items-center justify-center gap-2 bg-slate-900 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-800 text-white px-6 py-4 rounded-full font-bold shadow-[0_8px_20px_-10px_rgba(0,0,0,0.4)] transition-all active:scale-[0.98]"
        >
          <Save size={20} />
          Save Record
        </button>
      </motion.div>
    </div>
  );
}
