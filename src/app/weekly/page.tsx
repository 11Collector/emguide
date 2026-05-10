"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ChevronRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: "checklist", title: "Weekly Checklist", desc: "เช็คลิสต์งานที่ควรทำทุกสัปดาห์" },
  { id: "progression", title: "Progression Update", desc: "สัปดาห์นี้ทำอะไรไปแล้วบ้าง ยอดถึงไหนอัปเดตหน่อย" },
  { id: "prospects", title: "New Prospects", desc: "มีใครน่าสนใจเข้ามาใหม่ จะคุยต่อยังไง" },
  { id: "plan", title: "Continuous Plan", desc: "ส่วนที่เหลือจะทำยังไง ปรับแผนแบบไหน" },
  { id: "qa", title: "Q & A", desc: "คำถามเพิ่มเติมเพื่อปรึกษาทีม" }
];

const WEEKLY_CHECKLIST = [
  "ทำ List รายชื่อ",
  "ทำ Case สินค้าอื่น",
  "ดูแลลูกค้าซื้อซ้ำ",
  "โทรนัดคนมาเข้าระบบ",
  "ทำ HM / ฝึก",
  "คุยกับ Upline",
  "ประเมินผล ยอด คน แผน"
];

export default function WeeklyUpdate() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [checkedTasks, setCheckedTasks] = useState<string[]>([]);
  const [form, setForm] = useState({
    progression: "",
    prospects: "",
    plan: "",
    qa: "",
  });

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) setCurrentStep((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    // Submit to Firebase logic will go here
  };

  const handleInputChange = (val: string) => {
    if (STEPS[currentStep].id !== "checklist") {
      setForm((prev) => ({ ...prev, [STEPS[currentStep].id]: val }));
    }
  };

  if (isSubmitted) {
    return (
      <div className="p-6 min-h-screen flex flex-col items-center justify-center -mt-10">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mb-6"
        >
          <Check size={40} strokeWidth={3} />
        </motion.div>
        <motion.h2 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-extrabold text-slate-800 mb-2"
        >
          Update Submitted!
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-slate-500 text-center text-sm font-medium"
        >
          Your weekly progress has been recorded. Let's keep pushing towards the goal!
        </motion.p>
        <button 
          onClick={() => {
            setIsSubmitted(false);
            setCurrentStep(0);
            setForm({ progression: "", prospects: "", plan: "", qa: "" });
            setCheckedTasks([]);
          }}
          className="mt-8 bg-slate-100 text-slate-600 px-6 py-3 rounded-xl font-bold hover:bg-slate-200 transition-colors"
        >
          Submit Another
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-full flex flex-col pb-24">
      <header className="mb-6 mt-4">
        <motion.h1 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-extrabold text-slate-800 tracking-tight leading-tight"
        >
          Weekly Check In
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-slate-500 mt-0.5 text-xs font-semibold uppercase tracking-wider"
        >
          Step {currentStep + 1} of {STEPS.length}
        </motion.p>
      </header>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 h-1.5 rounded-full mb-8 flex overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
          className="bg-blue-600 h-full"
        />
      </div>

      {/* Form Wizard */}
      <div className="flex-1 flex flex-col relative min-h-[300px]">
        <div className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="mb-4">
                <h3 className="font-bold text-slate-800 text-lg">
                  {STEPS[currentStep].title}
                </h3>
                <p className="text-sm text-slate-500 font-medium">
                  {STEPS[currentStep].desc}
                </p>
              </div>

              {STEPS[currentStep].id === "checklist" ? (
                <div className="space-y-3 mt-4">
                  {WEEKLY_CHECKLIST.map((task) => {
                    const isChecked = checkedTasks.includes(task);
                    return (
                      <button
                        key={task}
                        onClick={() => {
                          if (isChecked) {
                            setCheckedTasks(checkedTasks.filter(t => t !== task));
                          } else {
                            setCheckedTasks([...checkedTasks, task]);
                          }
                        }}
                        className={cn(
                          "w-full flex items-center gap-3 p-3.5 rounded-xl border transition-all text-left",
                          isChecked ? "bg-indigo-50 border-indigo-200 text-indigo-700" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                        )}
                      >
                        <div className={cn("w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-colors", isChecked ? "bg-indigo-500 text-white" : "bg-slate-100")}>
                          {isChecked && <CheckCircle2 size={14} />}
                        </div>
                        <span className="font-bold text-sm tracking-tight">{task}</span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <textarea
                  value={form[STEPS[currentStep].id as keyof typeof form] || ""}
                  onChange={(e) => handleInputChange(e.target.value)}
                  placeholder="พิมพ์รายละเอียดที่นี่..."
                  className="w-full h-40 bg-slate-50 text-slate-800 border-none rounded-2xl p-4 font-medium placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 resize-none"
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-3 mt-8">
          {currentStep > 0 && (
            <button 
              onClick={handlePrev}
              className="px-6 py-4 rounded-2xl font-bold bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
            >
              Back
            </button>
          )}
          
          <button 
            onClick={currentStep === STEPS.length - 1 ? handleSubmit : handleNext}
            className="flex-1 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors active:scale-[0.98]"
          >
            {currentStep === STEPS.length - 1 ? "Submit Record" : "Next Step"}
            {currentStep < STEPS.length - 1 && <ChevronRight size={18} strokeWidth={2.5} />}
          </button>
        </div>
      </div>
    </div>
  );
}
