import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { format } from 'date-fns';
import { db } from '../lib/firebase';
import { doc, setDoc, collection, addDoc, getDocs } from 'firebase/firestore';

export interface CaseRecord {
  id: string;
  name: string;
  type: "BM" | "EM6W";
  date: string;
  notes: string;
  createdAt: number;
  stage?: number;
  slides?: string[];
  completedSteps?: string[];
}

export interface NewComer {
  id: string;
  name: string;
  platform: string;
  job?: string;
  notes?: string;
  scores: {
    money: number;
    active: number;
    friendly: number;
    relation: number;
  };
  createdAt: number;
}

export interface DailyActivity {
  [dateStr: string]: {
    tasks: string[];
  };
}

interface AppState {
  cases: CaseRecord[];
  newComers: NewComer[];
  totalPV: number;
  dailyStatus: DailyActivity;
  readBooks: number[];
  addCase: (newCase: Omit<CaseRecord, "id" | "createdAt">) => void;
  updateCaseStage: (id: string, stage: number) => void;
  updateCaseStep: (id: string, step: string) => void;
  updateCaseNotes: (id: string, notes: string) => void;
  toggleCaseSlide: (caseId: string, slideId: string) => void;
  setPV: (amount: number) => void;
  toggleDailyTask: (dateStr: string, taskId: string) => void;
  getTasksForDate: (dateStr: string) => string[];
  getStreak: (totalRequiredTasks: number) => number;
  toggleReadBook: (bookId: number) => void;
  fetchInitialData: () => Promise<void>;
  addNewComer: (comer: Omit<NewComer, "id" | "createdAt">) => void;
  updateNewComer: (id: string, updates: Partial<NewComer>) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      cases: [],
      newComers: [],
      totalPV: 0,
      dailyStatus: {},
      readBooks: [],
      addNewComer: (comer) => set((state) => {
        const newRecord = { ...comer, id: Date.now().toString(), createdAt: Date.now() };
        if (db) {
          setDoc(doc(db, "newComers", newRecord.id), newRecord).catch(e => console.error("Firebase sync error", e));
        }
        return {
          newComers: [newRecord, ...(state.newComers || [])]
        };
      }),
      updateNewComer: (id, updates) => set((state) => {
        const updatedComers = (state.newComers || []).map(c => 
          c.id === id ? { ...c, ...updates } : c
        );
        const target = updatedComers.find(c => c.id === id);
        if (db && target) {
          setDoc(doc(db, "newComers", id), target).catch(e => console.error(e));
        }
        return { newComers: updatedComers };
      }),
      addCase: (newCase) => set((state) => {
        const caseRecord = { ...newCase, id: Date.now().toString(), createdAt: Date.now(), completedSteps: [] };
        if (db) {
           setDoc(doc(db, "cases", caseRecord.id), caseRecord).catch(e => console.error("Firebase sync error", e));
        }
        return {
          cases: [caseRecord, ...state.cases]
        };
      }),
      updateCaseStage: (id, stage) => set((state) => {
        const updatedCases = state.cases.map(c => c.id === id ? { ...c, stage } : c);
        const targetCase = updatedCases.find(c => c.id === id);
        if (db && targetCase) {
          setDoc(doc(db, "cases", id), targetCase).catch(e => console.error(e));
        }
        return { cases: updatedCases };
      }),
      updateCaseStep: (id: string, step: string) => set((state) => {
        const updatedCases = state.cases.map(c => {
          if (c.id === id) {
            const steps = c.completedSteps || [];
            const newSteps = steps.includes(step) ? steps.filter(s => s !== step) : [...steps, step];
            return { ...c, completedSteps: newSteps };
          }
          return c;
        });
        const targetCase = updatedCases.find(c => c.id === id);
        if (db && targetCase) {
          setDoc(doc(db, "cases", id), targetCase).catch(e => console.error(e));
        }
        return { cases: updatedCases };
      }),
      updateCaseNotes: (id: string, notes: string) => set((state) => {
        const updatedCases = state.cases.map(c => c.id === id ? { ...c, notes } : c);
        const targetCase = updatedCases.find(c => c.id === id);
        if (db && targetCase) {
          setDoc(doc(db, "cases", id), targetCase).catch(e => console.error(e));
        }
        return { cases: updatedCases };
      }),
      toggleCaseSlide: (caseId, slideId) => set((state) => {
        const updatedCases = state.cases.map(c => {
          if (c.id === caseId) {
            const currentSlides = c.slides || [];
            const newSlides = currentSlides.includes(slideId)
              ? currentSlides.filter(s => s !== slideId)
              : [...currentSlides, slideId];
            return { ...c, slides: newSlides };
          }
          return c;
        });
        const targetCase = updatedCases.find(c => c.id === caseId);
        if (db && targetCase) {
          setDoc(doc(db, "cases", caseId), targetCase).catch(e => console.error(e));
        }
        return { cases: updatedCases };
      }),
      setPV: (amount) => set(() => {
        if (db) {
           setDoc(doc(db, "userStats", "pv"), { totalPV: amount }).catch(e => console.error(e));
        }
        return {
          totalPV: amount
        };
      }),
      toggleDailyTask: (dateStr, taskId) => set((state) => {
        const currentTasks = state.dailyStatus[dateStr]?.tasks || [];
        const isCompleted = currentTasks.includes(taskId);
        
        const newTasks = isCompleted 
          ? currentTasks.filter(t => t !== taskId)
          : [...currentTasks, taskId];

        const nextState = {
          dailyStatus: {
            ...state.dailyStatus,
            [dateStr]: { tasks: newTasks }
          }
        };

        if (db) {
           setDoc(doc(db, "dailyStatus", dateStr), { tasks: newTasks }).catch(e => console.error(e));
        }

        return nextState;
      }),
      getTasksForDate: (dateStr) => {
        return get().dailyStatus[dateStr]?.tasks || [];
      },
      getStreak: (totalRequiredTasks) => {
        const statuses = get().dailyStatus;
        const validDates = Object.entries(statuses)
          .filter(([_, data]) => data.tasks.length >= totalRequiredTasks)
          .map(([dateStr]) => dateStr)
          .sort()
          .reverse();

        if (validDates.length === 0) return 0;

        let streak = 0;
        let currentDate = new Date();
        
        // If today is not completely done, check yesterday
        if (!validDates.includes(format(currentDate, "yyyy-MM-dd"))) {
           const yesterday = new Date();
           yesterday.setDate(yesterday.getDate() - 1);
           if (!validDates.includes(format(yesterday, "yyyy-MM-dd"))) {
             return 0; // Streak broken
           }
           currentDate = yesterday;
        }

        // Count contiguous days backwards
        const checkDate = new Date(currentDate);
        while (validDates.includes(format(checkDate, "yyyy-MM-dd"))) {
          streak++;
          checkDate.setDate(checkDate.getDate() - 1);
        }

        return streak;
      },
      toggleReadBook: (bookId) => set((state) => {
        const isRead = state.readBooks?.includes(bookId);
        const newBooks = isRead 
          ? state.readBooks.filter(id => id !== bookId)
          : [...(state.readBooks || []), bookId];
          
        if (db) {
          setDoc(doc(db, "userStats", "books"), { readBooks: newBooks }).catch(e => console.error(e));
        }
        return { readBooks: newBooks };
      }),
      fetchInitialData: async () => {
        if (!db) return;
        try {
          // Fetch cases
          const casesSnap = await getDocs(collection(db, "cases"));
          const fetchedCases: CaseRecord[] = [];
          casesSnap.forEach(doc => {
            fetchedCases.push(doc.data() as CaseRecord);
          });
          // Sort cases newest first
          fetchedCases.sort((a, b) => b.createdAt - a.createdAt);

          // Fetch PV
          const pvSnap = await getDocs(collection(db, "userStats"));
          let fetchedPV = get().totalPV;
          let fetchedBooks = get().readBooks || [];
          pvSnap.forEach(doc => {
            if (doc.id === "pv") {
              fetchedPV = doc.data().totalPV || 0;
            }
            if (doc.id === "books") {
              fetchedBooks = doc.data().readBooks || [];
            }
          });

          // Fetch DailyStatus
          const dailySnap = await getDocs(collection(db, "dailyStatus"));
          const fetchedDaily: DailyActivity = {};
          dailySnap.forEach(doc => {
            fetchedDaily[doc.id] = { tasks: doc.data().tasks || [] };
          });

          set({ cases: fetchedCases, totalPV: fetchedPV, dailyStatus: fetchedDaily, readBooks: fetchedBooks });
        } catch (error) {
          console.error("Failed to fetch initial data from Firebase", error);
        }
      }
    }),
    {
      name: 'em-guide-storage',
    }
  )
);
