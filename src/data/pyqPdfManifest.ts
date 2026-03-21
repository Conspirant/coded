export interface PyqPdfChapterMeta {
  chapterNumber: number;
  chapterName: string;
  printedStartPage: number;
  printedEndPage: number;
  approxPdfStartPage: number;
  approxPdfEndPage: number;
  note?: string;
}

export const PDF_TOTAL_PAGES = 240;

const printedPageToPdfPage = (printedPage: number) => {
  if (printedPage <= 1) return 3;
  return Math.floor(printedPage / 2) + 3;
};

const PHYSICS_CONTENTS = [
  { chapterNumber: 1, chapterName: "Units and Measurements", printedStartPage: 1 },
  { chapterNumber: 2, chapterName: "Motion in a Straight Line", printedStartPage: 3 },
  { chapterNumber: 3, chapterName: "Motion in a Plane", printedStartPage: 7 },
  { chapterNumber: 4, chapterName: "Laws of Motion", printedStartPage: 11 },
  { chapterNumber: 5, chapterName: "Work, Energy and Power", printedStartPage: 17 },
  { chapterNumber: 6, chapterName: "System of Particles and Rotational Motion", printedStartPage: 22 },
  { chapterNumber: 7, chapterName: "Gravitation", printedStartPage: 26 },
  { chapterNumber: 8, chapterName: "Mechanical Properties of Solids", printedStartPage: 30 },
  { chapterNumber: 9, chapterName: "Mechanical Properties of Fluids", printedStartPage: 32 },
  { chapterNumber: 10, chapterName: "Thermal Properties of Matter", printedStartPage: 37 },
  { chapterNumber: 11, chapterName: "Thermodynamics", printedStartPage: 43 },
  { chapterNumber: 12, chapterName: "Kinetic Theory", printedStartPage: 47 },
  { chapterNumber: 13, chapterName: "Oscillations", printedStartPage: 50 },
  { chapterNumber: 14, chapterName: "Waves", printedStartPage: 53 },
  { chapterNumber: 15, chapterName: "Electric Charges and Fields", printedStartPage: 60 },
  { chapterNumber: 16, chapterName: "Electrostatic Potential and Capacitance", printedStartPage: 70 },
  { chapterNumber: 17, chapterName: "Current Electricity", printedStartPage: 84 },
  { chapterNumber: 18, chapterName: "Moving Charges and Magnetism", printedStartPage: 103 },
  { chapterNumber: 19, chapterName: "Magnetism and Matter", printedStartPage: 120 },
  { chapterNumber: 20, chapterName: "Electromagnetic Induction", printedStartPage: 122 },
  { chapterNumber: 21, chapterName: "Alternating Current", printedStartPage: 128 },
  { chapterNumber: 22, chapterName: "Electromagnetic Waves", printedStartPage: 138 },
  { chapterNumber: 23, chapterName: "Ray Optics and Optical Instruments", printedStartPage: 141 },
  { chapterNumber: 24, chapterName: "Wave Optics", printedStartPage: 159 },
  { chapterNumber: 25, chapterName: "Dual Nature of Radiation and Matter", printedStartPage: 169 },
  { chapterNumber: 26, chapterName: "Atoms", printedStartPage: 178 },
  { chapterNumber: 27, chapterName: "Nuclei", printedStartPage: 187 },
  { chapterNumber: 28, chapterName: "Semiconductor Electronics", printedStartPage: 193 },
];

export const PYQ_PDF_CHAPTERS: PyqPdfChapterMeta[] = PHYSICS_CONTENTS.map((chapter, index, all) => {
  const nextStart = all[index + 1]?.printedStartPage ?? 196;
  const printedEndPage = nextStart - 1;

  return {
    ...chapter,
    printedEndPage,
    approxPdfStartPage: printedPageToPdfPage(chapter.printedStartPage),
    approxPdfEndPage: printedPageToPdfPage(printedEndPage),
    note:
      chapter.chapterNumber === 2
        ? "This chapter visibly includes graph-based questions in the scanned source."
        : undefined,
  };
});

export const PYQ_SCAN_LIMITATION =
  "The supplied book is a scanned image PDF. This repo can render its pages in-app, but it cannot auto-convert all questions into structured MCQs without OCR.";
