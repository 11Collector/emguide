"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Users, ArrowRightLeft, CheckSquare, Square, ChevronDown, ChevronUp } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

const PIPELINE_STAGES = [
  { id: 1, label: "9 Slides", color: "bg-slate-100 text-slate-700 border-slate-200" },
  { id: 2, label: "เข้าคอร์ส", color: "bg-blue-50 text-blue-700 border-blue-200" },
  { id: 3, label: "Meeting", color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  { id: 4, label: "Packs", color: "bg-purple-50 text-purple-700 border-purple-200" },
  { id: 5, label: "Take Off", color: "bg-pink-50 text-pink-700 border-pink-200" },
  { id: 6, label: "BT", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
];

const SLIDES_LIST = [
  { id: "business_model", label: "Business Model" },
  { id: "income_plan", label: "Income Plan" },
  { id: "2yrs_retired", label: "2 Years Retired" },
  { id: "uniqueness", label: "Business Uniqueness" },
  { id: "check_in", label: "Check In" },
  { id: "artistry", label: "Artistry" },
  { id: "espring_sky", label: "eSpring & Sky" },
  { id: "5step_silver", label: "5 Step To Silver" },
];

export default function Pipeline() {
  const { cases, updateCaseStage, toggleCaseSlide } = useAppStore();
  const [activeStage, setActiveStage] = useState(1);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  
  const pipelineCases = cases.map(c => ({
    ...c,
    stage: c.stage || 1,
    slides: c.slides || []
  }));

  const activeCases = pipelineCases.filter(c => c.stage === activeStage);

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    // Only toggle if not clicking on the select dropdown
    const target = e.target as HTMLElement;
    if (target.tagName.toLowerCase() === 'select' || target.closest('select')) return;
    
    if (expandedCard === id) {
      setExpandedCard(null);
    } else {
      setExpandedCard(id);
    }
  };

  return (
    <div className="p-6 min-h-full flex flex-col">
      <header className="mb-6 mt-4 flex justify-between items-end">
        <div>
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-extrabold text-slate-800 tracking-tight leading-tight"
          >
            9 Slides
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 mt-0.5 text-xs font-semibold uppercase tracking-wider"
          >
            Manage Your Prospects
          </motion.p>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Link href="/add" className="flex items-center gap-1.5 bg-slate-900 text-white px-4 py-2 rounded-full border border-slate-800 shadow-sm hover:bg-slate-800 transition-colors active:scale-95">
            <Plus size={16} strokeWidth={2.5} />
            <span className="text-xs font-bold">New</span>
          </Link>
        </motion.div>
      </header>

      {/* Stage Selector Horizontal Scroll */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide -mx-2 px-2"
      >
        {PIPELINE_STAGES.map((stage) => {
          const count = pipelineCases.filter(c => c.stage === stage.id).length;
          const isActive = activeStage === stage.id;
          
          return (
            <button
              key={stage.id}
              onClick={() => setActiveStage(stage.id)}
              className={cn(
                "flex-shrink-0 px-4 py-2.5 rounded-2xl border transition-all duration-300 flex items-center gap-2",
                isActive 
                  ? "bg-slate-900 border-slate-900 text-white shadow-md scale-100" 
                  : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50 scale-95"
              )}
            >
              <div className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold",
                isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
              )}>
                {count}
              </div>
              <span className="text-sm font-bold whitespace-nowrap">
                Phase {stage.id}: {stage.label}
              </span>
            </button>
          );
        })}
      </motion.div>

      {/* Kanban List View */}
      <div className="flex-1 mt-4 pb-12 space-y-3">
        <AnimatePresence mode="popLayout">
          {activeCases.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-12 px-6 border-2 border-dashed border-slate-200 rounded-3xl"
            >
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users size={28} className="text-slate-300" />
              </div>
              <h3 className="font-bold text-slate-700 mb-1">No prospects here</h3>
              <p className="text-xs text-slate-500 font-medium">Use the "New" button to add someone.</p>
            </motion.div>
          ) : (
            activeCases.map((prospect, idx) => {
              const currentStageDef = PIPELINE_STAGES.find(s => s.id === prospect.stage) || PIPELINE_STAGES[0];
              const isExpanded = expandedCard === prospect.id;
              
              return (
                <motion.div
                  key={prospect.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow"
                >
                  <div className={`absolute top-0 bottom-0 left-0 w-1.5 ${currentStageDef.color.split(' ')[0]}`} />
                  
                  {/* Card Header (Clickable to expand) */}
                  <div 
                    className="p-4 flex justify-between items-start ml-2 cursor-pointer"
                    onClick={(e) => toggleExpand(prospect.id, e)}
                  >
                    <div>
                      <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        {prospect.name}
                        {isExpanded ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                          {prospect.type}
                        </span>
                        <span className="text-[10px] items-center px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 font-bold">
                          {prospect.slides.length}/8 Slides
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {formatDistanceToNow(prospect.createdAt, { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                    
                    {/* Stage Select Dropdown */}
                    <div className="relative z-10">
                      <select 
                        className="appearance-none bg-slate-50 border border-slate-200 text-slate-600 text-[10px] font-bold rounded-xl px-3 py-1.5 pr-8 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                        value={prospect.stage}
                        onChange={(e) => updateCaseStage(prospect.id, parseInt(e.target.value))}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {PIPELINE_STAGES.map(s => (
                          <option key={s.id} value={s.id}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <ArrowRightLeft size={12} />
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
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 ml-2 border-t border-slate-50 pt-3">
                          {prospect.notes && (
                            <p className="mb-4 text-xs text-slate-500 font-medium bg-slate-50 p-3 rounded-xl border border-slate-100">
                              <span className="font-bold text-slate-700 block mb-1">Notes:</span>
                              {prospect.notes}
                            </p>
                          )}
                          
                          <div className="mb-2.5">
                            <h4 className="text-xs font-bold text-slate-800 tracking-wide uppercase">Slides Mastery</h4>
                            <p className="text-[10px] text-slate-500 font-medium">แวะเช็คได้ว่าเล่าสไลด์ไหนไปแล้วบ้าง (อิงจาก 9 Slides)</p>
                          </div>
                          
                          <div className="grid grid-cols-1 gap-2">
                            {SLIDES_LIST.map((slide) => {
                              const isChecked = prospect.slides.includes(slide.id);
                              return (
                                <button
                                  key={slide.id}
                                  onClick={() => toggleCaseSlide(prospect.id, slide.id)}
                                  className={cn(
                                    "flex items-center gap-3 p-2.5 rounded-xl text-left transition-colors border",
                                    isChecked 
                                      ? "bg-indigo-50/50 border-indigo-100 text-indigo-700" 
                                      : "bg-white border-slate-100 text-slate-600 hover:bg-slate-50"
                                  )}
                                >
                                  {isChecked ? (
                                    <CheckSquare size={18} className="text-indigo-600 shrink-0" />
                                  ) : (
                                    <Square size={18} className="text-slate-300 shrink-0" />
                                  )}
                                  <span className="text-xs font-bold">{slide.label}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
