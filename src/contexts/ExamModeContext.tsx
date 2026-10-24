import { createContext, useContext, useMemo, useState } from "react";

export type ExamMode = "KCET" | "KSEAB";

interface ExamModeContextValue {
  examMode: ExamMode;
  setExamMode: (mode: ExamMode) => void;
  toggleExamMode: () => void;
}

const ExamModeContext = createContext<ExamModeContextValue | undefined>(undefined);

export function ExamModeProvider({ children }: { children: React.ReactNode }) {
  const [examMode, setExamMode] = useState<ExamMode>(() => {
    return window.localStorage.getItem("coded_exam_mode") === "KSEAB" ? "KSEAB" : "KCET";
  });

  const changeMode = (mode: ExamMode) => {
    setExamMode(mode);
    window.localStorage.setItem("coded_exam_mode", mode);
  };

  const value = useMemo<ExamModeContextValue>(
    () => ({
      examMode,
      setExamMode: changeMode,
      toggleExamMode: () => changeMode(examMode === "KCET" ? "KSEAB" : "KCET"),
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
