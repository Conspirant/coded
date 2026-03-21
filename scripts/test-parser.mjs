const sampleText = `1. The physical quantity having the dimensions [M-¹L-3T3A2] is
(a) resistance
(c) electrical conductivity (d) electromotive force.
(b) resistivity
(2006)
(b) [ML-¹T]
(d) [ML-IT-1] (2007)
2. The dimensional formula for impulse is (a) [MLT-1]
(c) [M-ILT-1]
3. Dimensional formula for the universal gravitational constant G is
(a) [M-IL3T-2]
(c) [M-¹L2T-21 (b) [M-'L3T-1]
(d)
8.
9.
[M°L°T°] (2008)
4. The number of significant figures in the numbers 4.8000 × 104 and 48000.50 are
respectively
(a) 5 and 6
(c) 2 and 7
(b) 5 and 7
(d) 2 and 6 (2009)
5. The dimensions of 'resistance' are same as
those of where h is the Planck's
constant, e is the charge.
(a) 2 (b)
e (c) h )d( h
e
(2010)
6. If C be the capacitance and V be the electric
potential, then the dimensional formula of
CV2 is
Which one of the following is NOT correct? (a) Dimensional formula of thermal
conductivity (K) is [M'L'T-3K-¹]. (b) Dimensional formula of potential (V) is [M'L2T-3A-¹].
(c) Dimensional formula of permeability of free space() is [MILIT-2A-2]. (d) Dimensional formula of RC is [M°L°T-1]. (2013)
The ratio of the dimensions of Planck's
constant and that of moment of inertia has
the dimensions of
(a) frequency (c) time
(d) angular momentum.
(b) velocity
(2015)
10. The dimensions of the ratio of magnetic flux
() and permeability (μ) are
(a) [M°LITА
(c) [M°LIT'A-
(b) [M°L-3TOA
(d) [M°L2TA] (2018)
11. If P, Q and R are physical quantities having
different dimensions, which of the following
combinations can never be a meaningful
quantity?
PQ P-Q (a) (b)
(a) [MIL2T-2A] (b) [M'L¹T-2A-1] R R
(c) [M°LIT-2A0] (d) [M'L-3T¹A-¹] PR-Q² (c) (d) PQ- R (2011) (2019) R
7. The dimensional formula of physical quantity 12.
is M Lb Tc. Then that physical quantity is
(a) surface tension if a = 1, b= 1, c =-2
(b) force if a = 1, b = 1, c = 2
The physical quantity which is measured in
the unit of Wb A-¹ is
(a) Self inductance
(c) angular frequency if a = 0, b = 0, c=-1
(d) spring constant if a = 1, b =-1, c=-2
(b) Mutual inductance
(c) Magnetic flux
(2012) (d) Both (a) and (b) (2021)
ANSWER KEY
1. (c) 2. (a) 3. (a) 4. (b) 5. (c) 6. (a) 7. (c) 8. (d)
9. (a) 10. (a) 11. (b) 12. (d)`;

const parseOCR = () => {
    const ocrText = sampleText;
    const lines = ocrText.split('\n');
    const questions = [];
    let currentQ = null;
    let answersMap = {};

    const optToIndex = (opt) => {
        if (opt === 'a' || opt === 'A') return 0;
        if (opt === 'b' || opt === 'B') return 1;
        if (opt === 'c' || opt === 'C') return 2;
        if (opt === 'd' || opt === 'D') return 3;
        return 0;
    }

    const ansKeyIdx = lines.findIndex(l => l.toUpperCase().includes("ANSWER KEY"));
    if (ansKeyIdx !== -1) {
        const ansLines = lines.slice(ansKeyIdx + 1).join(" ");
        const matches = [...ansLines.matchAll(/(\d+)\.\s*\(([a-d])\)/gi)];
        matches.forEach(m => {
            answersMap[parseInt(m[1])] = optToIndex(m[2].toLowerCase());
        });
    }

    const questionLines = ansKeyIdx !== -1 ? lines.slice(0, ansKeyIdx) : lines;

    for (let i = 0; i < questionLines.length; i++) {
        let line = questionLines[i].trim();
        if (!line) continue;

        const qStartMatch = line.match(/^(\d+)\.\s+(.*)/);
        if (qStartMatch) {
            if (currentQ) questions.push(currentQ);
            const qNum = parseInt(qStartMatch[1]);
            currentQ = {
                question: qStartMatch[2],
                options: ["Option A", "Option B", "Option C", "Option D"],
                correct_answer: answersMap[qNum] ?? 0,
                year: 2024
            };
            
            const yearMatch = line.match(/\((20\d\d)\)/);
            if (yearMatch) {
                currentQ.year = parseInt(yearMatch[1]);
                currentQ.question = currentQ.question.replace(/\s*\((20\d\d)\)\s*/, '');
            }
        } else if (currentQ) {
            const yearMatch = line.match(/^\((20\d\d)\)$/);
            if (yearMatch) {
                currentQ.year = parseInt(yearMatch[1]);
                continue;
            }
            
            const inlineYearMatch = line.match(/\((20\d\d)\)$/);
            if (inlineYearMatch) {
                    currentQ.year = parseInt(inlineYearMatch[1]);
                    line = line.replace(/\s*\((20\d\d)\)$/, '');
            }

            const hasOptions = line.match(/\([a-d]\)/i);
            if (hasOptions) {
                const optMatches = [...line.matchAll(/\(([a-d])\)\s*(.*?)(?=\s*\([a-d]\)|$)/gi)];
                if (optMatches.length > 0) {
                    optMatches.forEach(m => {
                        const idx = optToIndex(m[1]);
                        currentQ.options[idx] = m[2].trim();
                    });
                } else {
                    currentQ.question += "\n" + line;
                }
            } else {
                currentQ.question += "\n" + line;
            }
        }
    }
    if (currentQ) questions.push(currentQ);

    console.log(JSON.stringify(questions, null, 2));
}

parseOCR();
