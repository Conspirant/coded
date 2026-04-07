import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type ExamMode = "KCET" | "COMEDK";

interface ExamModeContextValue {
  examMode: ExamMode;
  setExamMode: (mode: ExamMode) => void;
  toggleExamMode: () => void;
}

const EXAM_MODE_STORAGE_KEY = "kcet.exam-mode.v1";

const ExamModeContext = createContext<ExamModeContextValue | undefined>(undefined);

export function ExamModeProvider({ children }: { children: React.ReactNode }) {
  const [examMode, setExamModeState] = useState<ExamMode>("KCET");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(EXAM_MODE_STORAGE_KEY);
      if (stored === "KCET" || stored === "COMEDK") {
        setExamModeState(stored);
      }
    } catch {
      // Ignore storage errors and continue with default mode.
    }
  }, []);

  const setExamMode = (mode: ExamMode) => {
    setExamModeState(mode);
    try {
      localStorage.setItem(EXAM_MODE_STORAGE_KEY, mode);
    } catch {
      // Ignore storage errors and continue in-memory.
    }
  };

  const value = useMemo<ExamModeContextValue>(
    () => ({
      examMode,
      setExamMode,
      toggleExamMode: () => setExamMode(examMode === "KCET" ? "COMEDK" : "KCET"),
    }),
    [examMode],
  );

  return <ExamModeContext.Provider value={value}>{children}</ExamModeContext.Provider>;
}

export function useExamMode() {
  const context = useContext(ExamModeContext);
  if (!context) {
    throw new Error("useExamMode must be used within ExamModeProvider");
  }
  return context;
}

