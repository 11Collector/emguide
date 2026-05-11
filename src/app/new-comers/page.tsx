"use client";

import { useEffect, useState } from "react";
import { format, startOfMonth, endOfMonth, subMonths, addMonths } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Users, MapPin, ChevronLeft, ChevronRight, Briefcase, Edit2, Check, X, Star } from "lucide-react";
import Image from "next/image";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";
import { SwipeDeleteWrapper } from "@/components/swipe-delete-wrapper";

export default function NewComersPage() {
  const { newComers, addNewComer, updateNewComer, toggleNewComerFavorite } = useAppStore();
  const [isClient, setIsClient] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [filterTop, setFilterTop] = useState(false);
  
  // Track which comer is being edited
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>(null);

  const [form, setForm] = useState({
    name: "",
    platform: "",
    job: "",
    notes: "",
    scores: {
      money: 5,
      active: 5,
      friendly: 5,
      relation: 5
    }
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  // Month filtering
  const monthStart = startOfMonth(currentDate).getTime();
  const monthEnd = endOfMonth(currentDate).getTime();
  let currentMonthComers = (newComers || []).filter(c => c.createdAt >= monthStart && c.createdAt <= monthEnd);

  // Apply 7+ filter (Top Candidate: All fields >= 7)
  if (filterTop) {
    currentMonthComers = currentMonthComers.filter(c => {
      const m = Number(c.scores?.money ?? 0);
      const a = Number(c.scores?.active ?? 0);
      const f = Number(c.scores?.friendly ?? (c.scores as any)?.need ?? (c.scores as any)?.nice ?? 0);
      const r = Number(c.scores?.relation ?? 0);
      return m >= 7 && a >= 7 && f >= 7 && r >= 7;
    });
  }

  // Sort by Favorite then Total Score (Descending)
  currentMonthComers.sort((a, b) => {
    if (a.isFavorite && !b.isFavorite) return -1;
    if (!a.isFavorite && b.isFavorite) return 1;

    const getScore = (c: any) => 
      Number(c.scores?.money ?? 0) + 
      Number(c.scores?.active ?? 0) + 
      Number(c.scores?.friendly ?? (c.scores as any)?.need ?? (c.scores as any)?.nice ?? 0) + 
      Number(c.scores?.relation ?? 0);
    return getScore(b) - getScore(a);
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) return;
    addNewComer(form);
    setForm({
      name: "",
      platform: "",
      job: "",
      notes: "",
      scores: { money: 5, active: 5, friendly: 5, relation: 5 }
    });
    setShowAddForm(false);
  };

  const startEditing = (comer: any) => {
    setEditingId(comer.id);
    setEditForm({ ...comer });
  };

  const saveEdit = () => {
    if (editingId && editForm) {
      updateNewComer(editingId, {
        name: editForm.name,
        platform: editForm.platform,
        job: editForm.job,
        notes: editForm.notes,
        scores: editForm.scores
      });
      setEditingId(null);
      setEditForm(null);
    }
  };

  return (
    <div className="p-6 min-h-full flex flex-col text-slate-50 relative overflow-hidden">
      {/* Holo / Gen Z Background Orbs */}
      <div className="fixed top-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-pink-600/20 blur-[100px] pointer-events-none" />
      <div className="fixed bottom-[10%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-violet-600/20 blur-[120px] pointer-events-none" />

      <header className="mb-6 mt-4 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-[#0F172A] rounded-2xl flex items-center justify-center shrink-0 border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.1)] overflow-hidden relative backdrop-blur-md">
            <Image src="/logo.png" alt="Logo" fill className="object-contain p-2 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
          </div>
          <div>
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-200 via-purple-200 to-violet-300 tracking-tight leading-tight"
            >
              New Comers
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-slate-400 text-xs sm:text-sm font-medium mt-1 uppercase tracking-widest"
            >
              รายชื่อเพื่อนใหม่
            </motion.p>
          </div>
        </div>
        <div className="ml-auto flex flex-col items-end">
          <div className="text-[10px] font-bold text-pink-400 uppercase tracking-[0.2em]">
            {format(new Date(), "dd MMM yyyy")}
          </div>
        </div>
      </header>

      {/* Month Selector & Count */}
      <div className="flex items-center justify-between bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] rounded-2xl p-2 mb-6 relative z-10">
        <div className="flex items-center gap-1">
          <button onClick={() => setCurrentDate(subMonths(currentDate, 1))} className="p-2 text-slate-400 hover:text-pink-400 transition-colors">
            <ChevronLeft size={20} />
          </button>
          <span className="font-bold text-white uppercase tracking-widest text-xs min-w-[100px] text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-violet-300">
            {format(currentDate, "MMMM yy")}
          </span>
          <button onClick={() => setCurrentDate(addMonths(currentDate, 1))} className="p-2 text-slate-400 hover:text-pink-400 transition-colors">
            <ChevronRight size={20} />
          </button>
        </div>
        <div className="text-right px-3">
          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-tight">Total</div>
          <div className="text-lg font-extrabold text-pink-400 leading-tight">{currentMonthComers.length}</div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4 relative z-10 gap-2">
        <button 
          onClick={() => setFilterTop(!filterTop)}
          className={cn(
            "flex-1 px-4 py-2 rounded-full text-xs font-bold transition-all border shadow-lg flex items-center justify-center gap-1.5",
            filterTop 
              ? "bg-pink-500 text-white border-pink-400 shadow-pink-500/20" 
              : "bg-white/5 text-slate-400 border-white/10"
          )}
        >
          <Users size={14} /> Top Candidate
        </button>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-gradient-to-r from-pink-500 to-violet-500 text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1 shadow-[0_0_15px_rgba(236,72,153,0.4)] transition-transform hover:scale-105 border border-white/10"
        >
          <Plus size={16} /> Add New
        </button>
      </div>

      <AnimatePresence>
        {showAddForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleAdd}
            className="bg-white/5 backdrop-blur-xl p-5 rounded-3xl border border-white/10 mb-6 overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.3)] space-y-4 relative z-10"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-2xl -mt-10 -mr-10 pointer-events-none" />

            <div className="relative z-10">
              <label className="text-[10px] text-slate-400 font-bold mb-1 block uppercase tracking-wider">Name *</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={e => setForm({...form, name: e.target.value})}
                className="w-full bg-[#0F172A]/60 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-pink-400/50 text-sm shadow-inner"
                placeholder="ชื่อ / ชื่อเล่น"
              />
            </div>
            <div className="grid grid-cols-2 gap-3 relative z-10">
              <div>
                <label className="text-[10px] text-slate-400 font-bold mb-1 block uppercase tracking-wider">Job / Study</label>
                <input
                  type="text"
                  value={form.job}
                  onChange={e => setForm({...form, job: e.target.value})}
                  className="w-full bg-[#0F172A]/60 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-pink-400/50 text-sm shadow-inner"
                  placeholder="อาชีพ / การศึกษา"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 font-bold mb-1 block uppercase tracking-wider">Met from</label>
                <input
                  type="text"
                  value={form.platform}
                  onChange={e => setForm({...form, platform: e.target.value})}
                  className="w-full bg-[#0F172A]/60 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-pink-400/50 text-sm shadow-inner"
                  placeholder="รู้จักจาก (IG, งาน, ฯลฯ)"
                />
              </div>
            </div>

            <div className="relative z-10">
              <label className="text-[10px] text-slate-400 font-bold mb-1 block uppercase tracking-wider">Additional Notes</label>
              <textarea
                value={form.notes}
                onChange={e => setForm({...form, notes: e.target.value})}
                className="w-full bg-[#0F172A]/60 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-pink-400/50 text-sm h-16 resize-none shadow-inner"
                placeholder="ข้อมูลน่าสนใจ, ครอบครัว, ความสนใจ..."
              />
            </div>
            
            <div className="pt-3 border-t border-white/10 relative z-10">
              <label className="text-[10px] text-pink-400 font-bold mb-3 block uppercase tracking-wider text-center">Connection Scoring (0-10)</label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { key: 'money', label: 'Money' },
                  { key: 'active', label: 'Active' },
                  { key: 'friendly', label: 'Friendly' },
                  { key: 'relation', label: 'Relation' }
                ].map(({ key, label }) => {
                  const scoreKey = key as keyof typeof form.scores;
                  return (
                    <div key={key} className="flex flex-col items-center">
                      <label className="text-[9px] text-slate-400 font-bold mb-1 uppercase text-center h-6">{label}</label>
                      <input
                        type="number"
                        min="0"
                        max="10"
                        value={form.scores[scoreKey] === "" as any ? "" : form.scores[scoreKey]}
                        onChange={e => {
                          const val = e.target.value;
                          setForm({
                            ...form, 
                            scores: { ...form.scores, [scoreKey]: val === "" ? ("" as any) : parseInt(val) }
                          });
                        }}
                        className="w-10 bg-[#0F172A]/60 border border-white/10 rounded-lg py-1.5 text-white text-center focus:outline-none focus:border-pink-400/50 font-bold shadow-inner"
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            <button type="submit" className="w-full bg-white text-slate-900 font-bold py-3 rounded-xl transition-colors mt-4 relative z-10 shadow-lg hover:bg-slate-200">
              Save Contact
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="space-y-4 pb-20 relative z-10">
        {currentMonthComers.length === 0 ? (
          <div className="text-center py-12 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 border-dashed">
            <Users size={40} className="mx-auto text-slate-500 mb-3" />
            <p className="text-slate-400 text-xs font-medium uppercase tracking-widest">ยังไม่มีรายชื่อในเดือนนี้</p>
          </div>
        ) : (
          currentMonthComers.map((comer, i) => {
            const isEditing = editingId === comer.id;
            
            if (isEditing && editForm) {
              return (
                <motion.div
                  key={comer.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-black/40 backdrop-blur-xl p-5 rounded-3xl border border-pink-400/50 shadow-[0_0_20px_rgba(236,72,153,0.2)] relative space-y-4"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-pink-400 font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                      <Edit2 size={12} /> Edit Mode
                    </h3>
                    <div className="flex gap-2">
                      <button onClick={() => setEditingId(null)} className="p-1.5 bg-white/10 text-slate-300 rounded-lg hover:text-white hover:bg-white/20 transition-colors">
                        <X size={16} />
                      </button>
                      <button onClick={saveEdit} className="p-1.5 bg-emerald-500/80 text-white rounded-lg hover:bg-emerald-400 transition-colors shadow-[0_0_10px_rgba(16,185,129,0.5)]">
                        <Check size={16} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] text-slate-400 font-bold block uppercase mb-1">Name</label>
                      <input type="text" value={editForm.name || ""} onChange={e => setEditForm({...editForm, name: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:border-pink-400/50 focus:outline-none shadow-inner" />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 font-bold block uppercase mb-1">Platform</label>
                      <input type="text" value={editForm.platform || ""} onChange={e => setEditForm({...editForm, platform: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:border-pink-400/50 focus:outline-none shadow-inner" />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block uppercase mb-1">Job</label>
                    <input type="text" value={editForm.job || ""} onChange={e => setEditForm({...editForm, job: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:border-pink-400/50 focus:outline-none shadow-inner" />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block uppercase mb-1">Notes</label>
                    <textarea value={editForm.notes || ""} onChange={e => setEditForm({...editForm, notes: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white text-sm h-16 resize-none focus:border-pink-400/50 focus:outline-none shadow-inner" />
                  </div>

                  <div className="pt-3 border-t border-white/10">
                    <label className="text-[10px] text-pink-400 font-bold mb-2 block uppercase text-center tracking-wider">Connection Scores</label>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { key: 'money', label: 'Money' },
                        { key: 'active', label: 'Active' },
                        { key: 'friendly', label: 'Friendly' },
                        { key: 'relation', label: 'Relation' }
                      ].map(({ key, label }) => {
                        const scoreKey = key as keyof typeof editForm.scores;
                        // Use friendly, fallback to need, fallback to nice
                        const currentVal = editForm.scores[scoreKey] ?? (editForm.scores as any)['need'] ?? (editForm.scores as any)['nice'] ?? 0;
                        
                        return (
                          <div key={key} className="flex flex-col items-center">
                            <label className="text-[9px] text-slate-400 font-bold mb-1 uppercase text-center">{label}</label>
                            <input
                              type="number" min="0" max="10"
                              value={currentVal === "" as any ? "" : currentVal}
                              onChange={e => {
                                const val = e.target.value;
                                setEditForm({
                                  ...editForm, 
                                  scores: { ...editForm.scores, [scoreKey]: val === "" ? ("" as any) : parseInt(val) }
                                });
                              }}
                              className="w-10 bg-black/40 border border-white/10 rounded-lg py-1 text-white text-center focus:border-pink-400/50 focus:outline-none font-bold shadow-inner"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              );
            }

            return (
              <SwipeDeleteWrapper 
                key={comer.id}
                onDelete={() => {
                  const { deleteNewComer } = useAppStore.getState();
                  deleteNewComer(comer.id);
                }}
              >
                <div
                  className="bg-[#0F172A] p-4 rounded-3xl border border-white/10 shadow-[0_8px_32_rgba(0,0,0,0.3)] relative overflow-hidden group z-10"
                >
                  <div className="absolute top-4 right-4 z-20 flex gap-1">
                    <button onClick={() => startEditing(comer)} className="p-2 bg-black/40 hover:bg-black/60 rounded-xl text-slate-300 border border-white/10 transition-colors">
                      <Edit2 size={14} />
                    </button>
                  </div>

                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500/20 to-violet-500/20 border border-pink-400/30 flex items-center justify-center text-pink-300 shadow-inner">
                        <Users size={24} className="drop-shadow-lg" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-extrabold text-white text-lg leading-tight drop-shadow-md">{comer.name}</h3>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleNewComerFavorite(comer.id);
                            }}
                            className="transition-all active:scale-90"
                          >
                            <Star 
                              size={18} 
                              className={cn(
                                "transition-colors",
                                comer.isFavorite 
                                  ? "fill-yellow-400 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]" 
                                  : "text-slate-600 hover:text-slate-400"
                              )} 
                            />
                          </button>
                          <div className="px-2 py-0.5 rounded-md bg-pink-500/20 border border-pink-500/30 text-[9px] font-black text-pink-400 uppercase tracking-[0.05em]">
                            TOTAL : {
                              Number(comer.scores?.money ?? 0) + 
                              Number(comer.scores?.active ?? 0) + 
                              Number(comer.scores?.friendly ?? (comer.scores as any)?.need ?? (comer.scores as any)?.nice ?? 0) + 
                              Number(comer.scores?.relation ?? 0)
                            }
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-slate-400 text-[10px] mt-1 uppercase font-bold tracking-wider">
                          {comer.job && (
                            <span className="flex items-center gap-1 text-cyan-400 drop-shadow-md">
                              <Briefcase size={10} /> {comer.job}
                            </span>
                          )}
                          {comer.platform && (
                            <span className="flex items-center gap-1 text-fuchsia-400 drop-shadow-md">
                              <MapPin size={10} /> {comer.platform}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {comer.notes && (
                    <div className="mb-4 text-xs text-slate-300 bg-black/20 p-3 rounded-xl border border-white/5 shadow-inner">
                      {comer.notes}
                    </div>
                  )}
                  
                  <div className="grid grid-cols-4 gap-2 pt-3 border-t border-white/10">
                    <ScoreBadge label="Money" score={comer.scores.money} />
                    <ScoreBadge label="Active" score={comer.scores.active} />
                    <ScoreBadge label="Friendly" score={comer.scores.friendly ?? (comer.scores as any).need ?? (comer.scores as any).nice ?? 0} />
                    <ScoreBadge label="Relation" score={comer.scores.relation} />
                  </div>
                </div>
              </SwipeDeleteWrapper>
            );
          })
        )}
      </div>
    </div>
  );
}

function ScoreBadge({ label, score }: { label: string, score: number }) {
  const isHigh = score >= 8;
  const isMid = score >= 5 && score < 8;
  
  return (
    <div className="flex flex-col items-center">
      <div className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold mb-1 border shadow-inner",
        isHigh ? "bg-emerald-500/20 text-emerald-400 border-emerald-400/50 shadow-[0_0_10px_rgba(16,185,129,0.3)]" : 
        isMid ? "bg-amber-500/20 text-amber-400 border-amber-400/50 shadow-[0_0_10px_rgba(245,158,11,0.3)]" : "bg-black/40 text-slate-400 border-white/10"
      )}>
        {score}
      </div>
      <span className="text-[8px] uppercase font-bold text-slate-400 tracking-wider">{label}</span>
    </div>
  );
}
