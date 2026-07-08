import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { format } from 'date-fns';

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
  isFavorite?: boolean;
  emphasisPack?: string;
  beginSessions?: boolean[];
  bridgeJoined?: boolean;
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
  isFavorite?: boolean;
}

export interface DailyActivity {
  [dateStr: string]: {
    tasks: string[];
    taskCounts?: Record<string, number>;
  };
}

interface AppState {
  cases: CaseRecord[];
  newComers: NewComer[];
  totalPV: number;
  monthlyPV: Record<string, number>;
  dailyStatus: DailyActivity;
  readBooks: number[];
  addCase: (newCase: Omit<CaseRecord, "id"> & { createdAt?: number }) => void;
  updateCaseStage: (id: string, stage: number) => void;
  updateCaseStep: (id: string, step: string) => void;
  updateCaseNotes: (id: string, notes: string) => void;
  toggleCaseSlide: (caseId: string, slideId: string) => void;
  setPV: (amount: number, monthStr?: string) => void;
  toggleDailyTask: (dateStr: string, taskId: string) => void;
  incrementDailyTask: (dateStr: string, taskId: string, delta: number) => void;
  getTaskCount: (dateStr: string, taskId: string) => number;
  getTasksForDate: (dateStr: string) => string[];
  getStreak: (totalRequiredTasks: number) => number;
  toggleReadBook: (bookId: number) => void;
  fetchInitialData: () => Promise<void>;
  addNewComer: (comer: Omit<NewComer, "id" | "createdAt">) => void;
  updateNewComer: (id: string, updates: Partial<NewComer>) => void;
  deleteNewComer: (id: string) => void;
  toggleNewComerFavorite: (id: string) => void;
  deleteCase: (id: string) => void;
  toggleCaseFavorite: (id: string) => void;
  updateEmphasisPack: (id: string, pack: string) => void;
  toggleBeginSession: (id: string, sessionIndex: number) => void;
  toggleBridgeJoined: (id: string) => void;
  celebratedDays: Record<string, boolean>;
  setCelebratedDay: (dateStr: string, isCelebrated: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      cases: [],
      newComers: [],
      totalPV: 0,
      monthlyPV: {},
      dailyStatus: {},
      readBooks: [],
      celebratedDays: {},
      setCelebratedDay: (dateStr, isCelebrated) => set((state) => {
        const current = !!state.celebratedDays[dateStr];
        if (current === isCelebrated) return state;

        const nextCelebrated = { ...state.celebratedDays };
        if (isCelebrated) {
          nextCelebrated[dateStr] = true;
        } else {
          delete nextCelebrated[dateStr];
        }
        return { celebratedDays: nextCelebrated };
      }),
      addNewComer: (comer) => set((state) => {
        const newRecord = { ...comer, id: Date.now().toString(), createdAt: Date.now() };
        return { newComers: [newRecord, ...(state.newComers || [])] };
      }),
      updateNewComer: (id, updates) => set((state) => ({
        newComers: (state.newComers || []).map(c => c.id === id ? { ...c, ...updates } : c)
      })),
      deleteNewComer: (id) => set((state) => ({
        newComers: (state.newComers || []).filter(c => c.id !== id)
      })),
      toggleNewComerFavorite: (id) => set((state) => ({
        newComers: (state.newComers || []).map(c => c.id === id ? { ...c, isFavorite: !c.isFavorite } : c)
      })),
      addCase: (newCase) => set((state) => {
        const initialSteps = newCase.type === "BM" ? ["BM"] : newCase.type === "EM6W" ? ["6W"] : [];
        const caseRecord = { ...newCase, id: Date.now().toString(), createdAt: newCase.createdAt || Date.now(), completedSteps: initialSteps };
        return { cases: [caseRecord, ...state.cases] };
      }),
      updateCaseStage: (id, stage) => set((state) => ({
        cases: state.cases.map(c => c.id === id ? { ...c, stage } : c)
      })),
      updateCaseStep: (id: string, step: string) => set((state) => ({
        cases: state.cases.map(c => {
          if (c.id !== id) return c;
          const steps = c.completedSteps || [];
          return { ...c, completedSteps: steps.includes(step) ? steps.filter(s => s !== step) : [...steps, step] };
        })
      })),
      updateCaseNotes: (id: string, notes: string) => set((state) => ({
        cases: state.cases.map(c => c.id === id ? { ...c, notes } : c)
      })),
      toggleCaseSlide: (caseId, slideId) => set((state) => ({
        cases: state.cases.map(c => {
          if (c.id !== caseId) return c;
          const slides = c.slides || [];
          return { ...c, slides: slides.includes(slideId) ? slides.filter(s => s !== slideId) : [...slides, slideId] };
        })
      })),
      deleteCase: (id) => set((state) => ({
        cases: state.cases.filter(c => c.id !== id)
      })),
      toggleCaseFavorite: (id) => set((state) => ({
        cases: state.cases.map(c => c.id === id ? { ...c, isFavorite: !c.isFavorite } : c)
      })),
      updateEmphasisPack: (id, pack) => set((state) => ({
        cases: state.cases.map(c => c.id === id ? { ...c, emphasisPack: c.emphasisPack === pack ? undefined : pack } : c)
      })),
      toggleBeginSession: (id, sessionIndex) => set((state) => ({
        cases: state.cases.map(c => {
          if (c.id !== id) return c;
          const sessions = [...(c.beginSessions || [false, false, false, false])];
          sessions[sessionIndex] = !sessions[sessionIndex];
          return { ...c, beginSessions: sessions };
        })
      })),
      toggleBridgeJoined: (id) => set((state) => ({
        cases: state.cases.map(c => c.id === id ? { ...c, bridgeJoined: !c.bridgeJoined } : c)
      })),
      setPV: (amount, monthStr) => set((state) => {
        const actualMonth = monthStr || format(new Date(), "yyyy-MM");
        const newMonthlyPV = { ...(state.monthlyPV || {}), [actualMonth]: amount };
        return {
          totalPV: amount,
          monthlyPV: newMonthlyPV
        };
      }),
      toggleDailyTask: (dateStr, taskId) => set((state) => {
        const currentData = state.dailyStatus[dateStr] || { tasks: [], taskCounts: {} };
        const currentTasks = currentData.tasks || [];
        const isCompleted = currentTasks.includes(taskId);
        
        const newTasks = isCompleted 
          ? currentTasks.filter(t => t !== taskId)
          : [...currentTasks, taskId];

        const nextState = {
          dailyStatus: {
            ...state.dailyStatus,
            [dateStr]: { ...currentData, tasks: newTasks }
          }
        };

        return nextState;
      }),
      incrementDailyTask: (dateStr, taskId, delta) => set((state) => {
        const currentData = state.dailyStatus[dateStr] || { tasks: [], taskCounts: {} };
        const counts = currentData.taskCounts || {};
        const newCount = Math.max(0, (counts[taskId] || 0) + delta);
        
        const target = taskId === "social-add" ? 4 : taskId === "biz-approach" ? 8 : 1;
        
        let newTasks = [...(currentData.tasks || [])];
        if (newCount >= target && !newTasks.includes(taskId)) {
          newTasks.push(taskId);
        } else if (newCount < target && newTasks.includes(taskId)) {
          newTasks = newTasks.filter(t => t !== taskId);
        }
        
        const nextState = {
          dailyStatus: {
            ...state.dailyStatus,
            [dateStr]: { 
              ...currentData, 
              tasks: newTasks,
              taskCounts: { ...counts, [taskId]: newCount }
            }
          }
        };

        return nextState;
      }),
      getTaskCount: (dateStr, taskId) => {
        return get().dailyStatus[dateStr]?.taskCounts?.[taskId] || 0;
      },
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
        return {
          readBooks: isRead
            ? state.readBooks.filter(id => id !== bookId)
            : [...(state.readBooks || []), bookId]
        };
      }),
      fetchInitialData: async () => {
        // Now handled by useFirebaseSync
      }
    }),
    {
      name: 'em-guide-storage',
      version: 1,
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          if (!persistedState.celebratedDays) {
            persistedState.celebratedDays = {};
          }
        }
        if (!persistedState.monthlyPV) {
          persistedState.monthlyPV = {};
        }
        return persistedState as AppState;
      },
      storage: createJSONStorage(() => ({
        getItem: (name) => {
          try {
            return localStorage.getItem(name);
          } catch (error) {
            console.error('Failed to get item from storage:', error);
            return null;
          }
        },
        setItem: (name, value) => {
          try {
            localStorage.setItem(name, value);
          } catch (error) {
            console.error('Failed to set item to storage:', error);
          }
        },
        removeItem: (name) => {
          try {
            localStorage.removeItem(name);
          } catch (error) {
            console.error('Failed to remove item from storage:', error);
          }
        },
      })),
    }
  )
);
