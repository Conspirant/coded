import { createContext, useContext, useMemo, useState } from "react";

export type ExamMode = "KCET";

interface ExamModeContextValue {
  examMode: ExamMode;
  setExamMode: (mode: ExamMode) => void;
  toggleExamMode: () => void;
}

const ExamModeContext = createContext<ExamModeContextValue | undefined>(undefined);

export function ExamModeProvider({ children }: { children: React.ReactNode }) {
  const [examMode] = useState<ExamMode>("KCET");

  const value = useMemo<ExamModeContextValue>(
    () => ({
      examMode: "KCET",
      setExamMode: () => {},
      toggleExamMode: () => {},
    }),
    [],
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
