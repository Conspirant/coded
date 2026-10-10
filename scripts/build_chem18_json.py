import json

# Chemistry Chapter 18: Organic Compounds Containing Nitrogen (Amines)
# 40 Questions total

questions = [
    # Q1
    {
        "chapter": "Organic Compounds Containing Nitrogen",
        "chapter_number": 18,
        "subject": "Chemistry",
        "year": 2006,
        "question": "The basicity of aniline is less than that of cyclohexylamine. This is due to",
        "options": [
            "+R effect of -NH₂ group",
            "-I effect of -NH₂ group",
            "-R effect of -NH₂ group",
            "hyperconjugation effect"
        ],
        "correct_answer": 0,
        "explanation": "**Answer: (a)**\n\nIn aniline ($\\text{C}_6\\text{H}_5\\text{NH}_2$), the $-\\text{NH}_2$ group is directly attached to the benzene ring. Due to the $+R$ (resonance/mesomeric) effect, the lone pair of electrons on the nitrogen atom is delocalized over the aromatic benzene ring across various resonating structures. \n\nConsequently, the electron density on nitrogen decreases, making the lone pair less available for protonation. In contrast, in cyclohexylamine, there is no resonance delocalization, and the cyclohexyl ring exerts an electron-releasing $+I$ effect, making cyclohexylamine significantly more basic than aniline."
    },
    # Q2
    {
        "chapter": "Organic Compounds Containing Nitrogen",
        "chapter_number": 18,
        "subject": "Chemistry",
        "year": 2006,
        "question": "Which of the following would undergo Hofmann's bromamide degradation reaction?",
        "options": [
            "$\\text{R}-\\text{CO}-\\text{Cl}$",
            "$\\text{RCONHCH}_3$",
            "$\\text{RCONH}_2$",
            "$\\text{RCOOR}$"
        ],
        "correct_answer": 2,
        "explanation": "**Answer: (c)**\n\nHofmann bromamide degradation reaction is specifically given by primary acid amides ($\\text{RCONH}_2$). When treated with bromine in an aqueous or ethanolic solution of sodium/potassium hydroxide, primary amides degrade to form primary amines containing one less carbon atom:\n$$\\text{RCONH}_2 + \\text{Br}_2 + 4\\text{KOH} \\xrightarrow{\\Delta} \\text{R}-\\text{NH}_2 + \\text{K}_2\\text{CO}_3 + 2\\text{KBr} + 2\\text{H}_2\\text{O}$$"
    },
    # Q3
    {
        "chapter": "Organic Compounds Containing Nitrogen",
        "chapter_number": 18,
        "subject": "Chemistry",
        "year": 2007,
        "question": "Hofmann's bromamide reaction is used to convert",
        "options": [
            "acid to alcohol",
            "alcohol to acid",
            "amide to amine",
            "amine to amide"
        ],
        "correct_answer": 2,
        "explanation": "**Answer: (c)**\n\nHofmann bromamide degradation is a classical reaction for converting an unsubstituted primary acid amide into a primary amine with one carbon atom less:\n$$\\text{R}-\\text{CO}-\\text{NH}_2 \\xrightarrow{\\text{Br}_2 / \\text{KOH}} \\text{R}-\\text{NH}_2 + \\text{CO}_3^{2-}$$"
    },
    # Q4
    {
        "chapter": "Organic Compounds Containing Nitrogen",
        "chapter_number": 18,
        "subject": "Chemistry",
        "year": 2007,
        "question": "When an alkyl halide reacts with alcoholic ammonia in a sealed tube, the product formed will be",
        "options": [
            "a tertiary amine",
            "a secondary amine",
            "a primary amine",
            "a mixture of all the three amines and quaternary ammonium salt"
        ],
        "correct_answer": 3,
        "explanation": "**Answer: (d)**\n\nIn Hofmann ammonolysis of alkyl halides, nucleophilic substitution occurs successively:\n$$\\text{R-X} \\xrightarrow{\\text{NH}_3} \\text{R-NH}_2 \\xrightarrow{\\text{R-X}} \\text{R}_2\\text{NH} \\xrightarrow{\\text{R-X}} \\text{R}_3\\text{N} \\xrightarrow{\\text{R-X}} \\text{R}_4\\text{N}^+\\text{X}^- $$\nThus, a mixture of primary ($1^\\circ$), secondary ($2^\\circ$), tertiary ($3^\\circ$) amines and quaternary ammonium salt is obtained."
    },
    # Q5
    {
        "chapter": "Organic Compounds Containing Nitrogen",
        "chapter_number": 18,
        "subject": "Chemistry",
        "year": 2007,
        "question": "The maximum number of molecules of $\\text{CH}_3\\text{I}$ that can react with one molecule of $\\text{CH}_3\\text{NH}_2$ is",
        "options": [
            "3",
            "4",
            "2",
            "1"
        ],
        "correct_answer": 0,
        "explanation": "**Answer: (a)**\n\nStarting with methylamine ($\\text{CH}_3\\text{NH}_2$):\n1. $\\text{CH}_3\\text{NH}_2 + \\text{CH}_3\\text{I} \\rightarrow (\\text{CH}_3)_2\\text{NH} + \\text{HI}$ (1st molecule)\n2. $(\\text{CH}_3)_2\\text{NH} + \\text{CH}_3\\text{I} \\rightarrow (\\text{CH}_3)_3\\text{N} + \\text{HI}$ (2nd molecule)\n3. $(\\text{CH}_3)_3\\text{N} + \\text{CH}_3\\text{I} \\rightarrow [(\\text{CH}_3)_4\\text{N}]^+\\text{I}^-$ (3rd molecule - quaternary salt)\n\nHence, maximum 3 molecules of $\\text{CH}_3\\text{I}$ can react with one molecule of $\\text{CH}_3\\text{NH}_2$."
    },
    # Q6
    {
        "chapter": "Organic Compounds Containing Nitrogen",
        "chapter_number": 18,
        "subject": "Chemistry",
        "year": 2008,
        "question": "Amines behave as",
        "options": [
            "aprotic acids",
            "neutral compounds",
            "Lewis acids",
            "Lewis bases"
        ],
        "correct_answer": 3,
        "explanation": "**Answer: (d)**\n\nAmines possess an unshared lone pair of electrons on the nitrogen atom ($:\\text{NR}_3$). Since they can donate this electron pair to electron-deficient species (electrophiles/protons), they behave as Lewis bases."
    },
    # Q7
    {
        "chapter": "Organic Compounds Containing Nitrogen",
        "chapter_number": 18,
        "subject": "Chemistry",
        "year": 2009,
        "question": "Arrange the following in increasing order of their basic strengths in aqueous medium:\n$$\\text{CH}_3\\text{NH}_2,\\; (\\text{CH}_3)_2\\text{NH},\\; (\\text{CH}_3)_3\\text{N},\\; \\text{NH}_3$$",
        "options": [
            "$\\text{NH}_3 < (\\text{CH}_3)_3\\text{N} < \\text{CH}_3\\text{NH}_2 < (\\text{CH}_3)_2\\text{NH}$",
            "$(\\text{CH}_3)_3\\text{N} < (\\text{CH}_3)_2\\text{NH} < \\text{CH}_3\\text{NH}_2 < \\text{NH}_3$",
            "$\\text{CH}_3\\text{NH}_2 < (\\text{CH}_3)_2\\text{NH} < (\\text{CH}_3)_3\\text{N} < \\text{NH}_3$",
            "$\\text{NH}_3 < (\\text{CH}_3)_2\\text{NH} < (\\text{CH}_3)_3\\text{N} < \\text{CH}_3\\text{NH}_2$"
        ],
        "correct_answer": 0,
        "explanation": "**Answer: (a)**\n\nIn aqueous solution, the basic strength of methyl-substituted amines is governed by three combined effects: inductive effect ($+I$), steric hindrance, and hydration of the conjugate cation. \nFor methyl amines, the order of basicity in aqueous medium is:\n$$\\text{NH}_3 < (\\text{CH}_3)_3\\text{N} < \\text{CH}_3\\text{NH}_2 < (\\text{CH}_3)_2\\text{NH}$$\n(Secondary > Primary > Tertiary > Ammonia, i.e., $2^\\circ > 1^\\circ > 3^\\circ > \\text{NH}_3$)."
    },
    # Q8
    {
        "chapter": "Organic Compounds Containing Nitrogen",
        "chapter_number": 18,
        "subject": "Chemistry",
        "year": 2010,
        "question": "In the reaction sequence:\n$$\\text{CH}_3\\text{CH}_2\\text{Br} \\xrightarrow{\\text{aq. KOH}} \\text{A} \\xrightarrow{\\text{KMnO}_4/\\text{H}^+} \\text{B} \\xrightarrow{\\text{NH}_3, \\Delta} \\text{C} \\xrightarrow{\\text{Br}_2 / \\text{alkali}} \\text{D}$$\n'D' is",
        "options": [
            "$\\text{CH}_3\\text{Br}$",
            "$\\text{CH}_3\\text{CONH}_2$",
            "$\\text{CH}_3\\text{NH}_2$",
            "$\\text{CHBr}_3$"
        ],
        "correct_answer": 2,
        "explanation": "**Answer: (c)**\n\n![Reaction Scheme](/pyq_images/chemistry/ch18/q8_scheme.png)\n\nStep-by-step reactions:\n1. $\\text{CH}_3\\text{CH}_2\\text{Br} \\xrightarrow{\\text{aq. KOH}} \\text{CH}_3\\text{CH}_2\\text{OH}$ (Ethanol, $\\text{A}$)\n2. $\\text{CH}_3\\text{CH}_2\\text{OH} \\xrightarrow{\\text{KMnO}_4/\\text{H}^+} \\text{CH}_3\\text{COOH}$ (Ethanoic acid, $\\text{B}$)\n3. $\\text{CH}_3\\text{COOH} \\xrightarrow{\\text{NH}_3, \\Delta} \\text{CH}_3\\text{CONH}_2$ (Ethanamide, $\\text{C}$)\n4. $\\text{CH}_3\\text{CONH}_2 \\xrightarrow{\\text{Br}_2 / \\text{alkali}} \\text{CH}_3\\text{NH}_2$ (Methanamine, $\\text{D}$, via Hofmann bromamide degradation).\n\nTherefore, product $\\text{D}$ is $\\text{CH}_3\\text{NH}_2$."
    },
    # Q9
    {
        "chapter": "Organic Compounds Containing Nitrogen",
        "chapter_number": 18,
        "subject": "Chemistry",
        "year": 2010,
        "question": "Which one of the following forms propanenitrile as the major product?",
        "options": [
            "Ethyl bromide + alcoholic $\\text{KCN}$",
            "Propyl bromide + alcoholic $\\text{KCN}$",
            "Propyl bromide + alcoholic $\\text{AgCN}$",
            "Ethyl bromide + alcoholic $\\text{AgCN}$"
        ],
        "correct_answer": 0,
        "explanation": "**Answer: (a)**\n\nAlcoholic $\\text{KCN}$ is an ionic compound providing cyanide ions ($\\text{CN}^-$). Nucleophilic substitution of ethyl bromide by cyanide adds one extra carbon atom:\n$$\\text{CH}_3\\text{CH}_2\\text{Br} + \\text{KCN(alc.)} \\rightarrow \\text{CH}_3\\text{CH}_2\\text{CN} + \\text{KBr}$$\n$\\text{CH}_3\\text{CH}_2\\text{CN}$ is propanenitrile (ethyl cyanide)."
    },
    # Q10
    {
        "chapter": "Organic Compounds Containing Nitrogen",
        "chapter_number": 18,
        "subject": "Chemistry",
        "year": 2010,
        "question": "The correct sequence of reactions to convert $p$-nitrophenol into quinol involves",
        "options": [
            "reduction, diazotization and hydrolysis",
            "hydrolysis, diazotization and reduction",
            "hydrolysis, reduction and diazotization",
            "diazotization, reduction and hydrolysis"
        ],
        "correct_answer": 0,
        "explanation": "**Answer: (a)**\n\n![Quinol synthesis](/pyq_images/chemistry/ch18/expl10_scheme.png)\n\nConversion of $p$-nitrophenol to quinol (benzene-1,4-diol):\n1. **Reduction:** $p$-Nitrophenol $\\xrightarrow{\\text{Sn/HCl}} p$-aminophenol\n2. **Diazotization:** $p$-Aminophenol $\\xrightarrow{\\text{NaNO}_2/\\text{HCl},\\; 0-5^\\circ\\text{C}} p$-hydroxybenzenediazonium chloride\n3. **Hydrolysis:** $p$-Hydroxybenzenediazonium chloride $\\xrightarrow{\\text{H}_2\\text{O}/\\text{H}^+,\\; \\Delta} \\text{Quinol (benzene-1,4-diol)} + \\text{N}_2 + \\text{HCl}$."
    },
    # Q11
    {
        "chapter": "Organic Compounds Containing Nitrogen",
        "chapter_number": 18,
        "subject": "Chemistry",
        "year": 2011,
        "question": "The conversion of $m$-nitrophenol to resorcinol involves respectively",
        "options": [
            "hydrolysis, diazotization and reduction",
            "diazotization, reduction and hydrolysis",
            "hydrolysis, reduction and diazotization",
            "reduction, diazotization and hydrolysis"
        ],
        "correct_answer": 3,
        "explanation": "**Answer: (d)**\n\n![Resorcinol synthesis](/pyq_images/chemistry/ch18/expl11_scheme.png)\n\nTo convert $m$-nitrophenol to resorcinol (benzene-1,3-diol):\n1. **Reduction:** $m$-Nitrophenol $\\xrightarrow{\\text{Sn/HCl}} m$-aminophenol\n2. **Diazotization:** $m$-Aminophenol $\\xrightarrow{\\text{NaNO}_2/\\text{HCl},\\; 0-5^\\circ\\text{C}} m$-hydroxybenzenediazonium chloride\n3. **Hydrolysis (boiling with dilute acid):** $\\rightarrow \\text{Resorcinol (benzene-1,3-diol)} + \\text{N}_2$."
    },
    # Q12
    {
        "chapter": "Organic Compounds Containing Nitrogen",
        "chapter_number": 18,
        "subject": "Chemistry",
        "year": 2012,
        "question": "Benzylamine is a stronger base than aniline because",
        "options": [
            "the lone pair of electrons on the nitrogen atom in benzylamine is delocalised",
            "the lone pair of electrons on the nitrogen atom in aniline is delocalised",
            "the lone pair of electrons on the nitrogen atom in aniline is not involved in resonance",
            "benzylamine has a higher molecular mass than aniline"
        ],
        "correct_answer": 1,
        "explanation": "**Answer: (b)**\n\nIn aniline, the lone pair of electrons on the nitrogen atom is conjugated with the aromatic $\\pi$-system and delocalized over the benzene ring via resonance, reducing electron availability for donation. In benzylamine ($\\text{C}_6\\text{H}_5\\text{CH}_2\\text{NH}_2$), the $-\\text{NH}_2$ group is attached to an $sp^3$ carbon, so its lone pair is not conjugated with the ring and remains readily available for protonation."
    },
    # Q13
    {
        "chapter": "Organic Compounds Containing Nitrogen",
        "chapter_number": 18,
        "subject": "Chemistry",
        "year": 2013,
        "question": "Which of the following reagent produces an amine with fewer carbon atoms upon heating with an amide?",
        "options": [
            "$\\text{Br}_2$ in aqueous $\\text{KOH}$",
            "$\\text{Br}_2$ in alcoholic $\\text{KOH}$",
            "$\\text{Cl}_2$ in sodium",
            "Sodium in ether"
        ],
        "correct_answer": 0,
        "explanation": "**Answer: (a)**\n\nTreatment of a primary amide with bromine ($\\text{Br}_2$) in aqueous sodium or potassium hydroxide ($\\text{KOH}$) is the Hofmann bromamide degradation reaction. The resulting primary amine contains one carbon atom less than the parent amide:\n$$\\text{RCONH}_2 + \\text{Br}_2 + 4\\text{KOH(aq)} \\xrightarrow{\\Delta} \\text{R-NH}_2 + \\text{K}_2\\text{CO}_3 + 2\\text{KBr} + 2\\text{H}_2\\text{O}$$"
    },
    # Q14
    {
        "chapter": "Organic Compounds Containing Nitrogen",
        "chapter_number": 18,
        "subject": "Chemistry",
        "year": 2013,
        "question": "An aromatic compound $\\text{A}$ ($\\text{C}_7\\text{H}_9\\text{N}$) on reacting with $\\text{NaNO}_2/\\text{HCl}$ at $0^\\circ\\text{C}$ forms benzyl alcohol and nitrogen gas. The number of structural isomers possible for compound $\\text{A}$ is",
        "options": [
            "5",
            "4",
            "3",
            "2"
        ],
        "correct_answer": 0,
        "explanation": "**Answer: (a)**\n\nCompound $\\text{A}$ is benzylamine ($\\text{C}_6\\text{H}_5\\text{CH}_2\\text{NH}_2$), as primary aliphatic/aralkyl amines react with nitrous acid to give unstable diazonium ions that hydrolyze to benzyl alcohol and evolve $\\text{N}_2$ gas.\n\nThe molecular formula $\\text{C}_7\\text{H}_9\\text{N}$ has 5 aromatic structural isomers:\n1. Benzylamine: $\\text{C}_6\\text{H}_5\\text{CH}_2\\text{NH}_2$\n2. $o$-Toluidine: $o-\\text{CH}_3-\\text{C}_6\\text{H}_4-\\text{NH}_2$\n3. $m$-Toluidine: $m-\\text{CH}_3-\\text{C}_6\\text{H}_4-\\text{NH}_2$\n4. $p$-Toluidine: $p-\\text{CH}_3-\\text{C}_6\\text{H}_4-\\text{NH}_2$\n5. N-Methylaniline: $\\text{C}_6\\text{H}_5\\text{NHCH}_3$\n\nHence, 5 structural isomers are possible."
    },
    # Q15
    {
        "chapter": "Organic Compounds Containing Nitrogen",
        "chapter_number": 18,
        "subject": "Chemistry",
        "year": 2014,
        "question": "Which is the correct sequence of reagents used for the conversion of benzene to $m$-bromoaniline?",
        "options": [
            "$\\text{Br}_2/\\text{FeBr}_3,\\; \\text{conc. HNO}_3 + \\text{conc. H}_2\\text{SO}_4,\\; \\text{Sn/HCl}$",
            "$\\text{conc. HNO}_3 + \\text{conc. H}_2\\text{SO}_4,\\; \\text{Sn/HCl},\\; \\text{Br}_2/\\text{H}_2\\text{O}$",
            "$\\text{conc. HNO}_3 + \\text{conc. H}_2\\text{SO}_4,\\; \\text{Br}_2/\\text{FeBr}_3,\\; \\text{Sn/HCl}$",
            "$\\text{Br}_2/\\text{FeBr}_3,\\; \\text{Sn/HCl},\\; \\text{conc. HNO}_3 + \\text{conc. H}_2\\text{SO}_4$"
        ],
        "correct_answer": 2,
        "explanation": "**Answer: (c)**\n\n![Synthesis of m-bromoaniline](/pyq_images/chemistry/ch18/expl15_scheme.png)\n\n1. **Nitration:** Benzene $\\xrightarrow{\\text{conc. HNO}_3 + \\text{conc. H}_2\\text{SO}_4}$ Nitrobenzene (where $-\\text{NO}_2$ is meta-directing).\n2. **Bromination:** Nitrobenzene $\\xrightarrow{\\text{Br}_2/\\text{FeBr}_3} m$-Bromonitrobenzene.\n3. **Reduction:** $m$-Bromonitrobenzene $\\xrightarrow{\\text{Sn/HCl}} m$-Bromoaniline."
    },
    # Q16
    {
        "chapter": "Organic Compounds Containing Nitrogen",
        "chapter_number": 18,
        "subject": "Chemistry",
        "year": 2014,
        "question": "Ethanenitrile on reaction with $\\text{CH}_3\\text{MgBr}$ followed by hydrolysis gives compound 'A' which on reaction with dilute $\\text{NaOH}$ gives 'B'. 'B' is",
        "options": [
            "$\\text{CH}_3\\text{CH}_2\\text{COCH}_3$",
            "$(\\text{CH}_3)_2\\text{CHCOCH}_3$",
            "$(\\text{CH}_3)_2\\text{C(OH)CH}_2\\text{COCH}_3$",
            "$\\text{CH}_3\\text{COCH}_2\\text{CH}_3$"
        ],
        "correct_answer": 2,
        "explanation": "**Answer: (c)**\n\n1. $\\text{CH}_3\\text{C}\\equiv\\text{N} + \\text{CH}_3\\text{MgBr} \\rightarrow \\text{CH}_3-\\text{C}(\\text{CH}_3)=\\text{NMgBr} \\xrightarrow{\\text{H}_3\\text{O}^+} \\text{CH}_3\\text{COCH}_3$ (Acetone, 'A')\n2. Two molecules of acetone undergo self Aldol condensation in the presence of dilute $\\text{NaOH}$ to form diacetone alcohol ('B'):\n$$2\\text{CH}_3\\text{COCH}_3 \\xrightarrow{\\text{dil. NaOH}} (\\text{CH}_3)_2\\text{C(OH)}-\\text{CH}_2-\\text{CO}-\\text{CH}_3\\quad (\\text{4-hydroxy-4-methylpentan-2-one})$$"
    },
    # Q17
    {
        "chapter": "Organic Compounds Containing Nitrogen",
        "chapter_number": 18,
        "subject": "Chemistry",
        "year": 2015,
        "question": "Which of the following compounds gives a positive carbylamine test?",
        "options": [
            "$\\text{CH}_3\\text{CH}_2\\text{NH}_2$",
            "$(\\text{CH}_3\\text{CH}_2)_2\\text{NH}$",
            "$(\\text{CH}_3\\text{CH}_2)_3\\text{N}$",
            "$\\text{CH}_3\\text{CONH}_2$"
        ],
        "correct_answer": 0,
        "explanation": "**Answer: (a)**\n\nThe carbylamine test (isocyanide test) is a specific test given exclusively by primary ($1^\\circ$) aliphatic and aromatic amines. When heated with chloroform and alcoholic $\\text{KOH}$, primary amines yield extremely foul-smelling isocyanides (carbylamines):\n$$\\text{CH}_3\\text{CH}_2\\text{NH}_2 + \\text{CHCl}_3 + 3\\text{KOH(alc.)} \\xrightarrow{\\Delta} \\text{CH}_3\\text{CH}_2\\text{NC} + 3\\text{KCl} + 3\\text{H}_2\\text{O}$$\nSecondary, tertiary amines and amides do not show this test."
    },
    # Q18
    {
        "chapter": "Organic Compounds Containing Nitrogen",
        "chapter_number": 18,
        "subject": "Chemistry",
        "year": 2015,
        "question": "In the sequence of following reactions:\n$$\\text{C}_6\\text{H}_5\\text{NH}_2 \\xrightarrow{\\text{NaNO}_2/\\text{HCl},\\; 0-5^\\circ\\text{C}} \\text{X} \\xrightarrow{\\text{CuCN}} \\text{Y} \\xrightarrow{\\text{H}_2\\text{O}/\\text{H}^+} \\text{Z}$$\n'Z' is",
        "options": [
            "Benzamide",
            "Benzoic acid",
            "Benzylamine",
            "Aniline"
        ],
        "correct_answer": 1,
        "explanation": "**Answer: (b)**\n\n![Reaction Scheme](/pyq_images/chemistry/ch18/q18_scheme.png)\n\n1. $\\text{C}_6\\text{H}_5\\text{NH}_2 \\xrightarrow{\\text{NaNO}_2/\\text{HCl},\\; 0-5^\\circ\\text{C}} \\text{C}_6\\text{H}_5\\text{N}_2^+\\text{Cl}^-$ (Benzenediazonium chloride, $\\text{X}$)\n2. $\\text{C}_6\\text{H}_5\\text{N}_2^+\\text{Cl}^- \\xrightarrow{\\text{CuCN}} \\text{C}_6\\text{H}_5\\text{CN}$ (Benzonitrile, $\\text{Y}$)\n3. $\\text{C}_6\\text{H}_5\\text{CN} \\xrightarrow{\\text{H}_2\\text{O}/\\text{H}^+,\\; \\Delta} \\text{C}_6\\text{H}_5\\text{COOH} + \\text{NH}_4^+$ (Benzoic acid, $\\text{Z}$)."
    },
    # Q19
    {
        "chapter": "Organic Compounds Containing Nitrogen",
        "chapter_number": 18,
        "subject": "Chemistry",
        "year": 2016,
        "question": "In the reaction:\n$$\\text{2-Bromopropane} \\xrightarrow{\\text{alc. AgCN},\\; \\Delta} \\text{X} \\xrightarrow{\\text{LiAlH}_4} \\text{Y}$$\nThe product 'Y' is",
        "options": [
            "Propan-2-amine",
            "N-Methylpropan-2-amine",
            "N,N-Dimethylpropan-2-amine",
            "Propan-1-amine"
        ],
        "correct_answer": 1,
        "explanation": "**Answer: (b)**\n\n![Reaction Scheme](/pyq_images/chemistry/ch18/q19_scheme.png)\n\n1. Reaction of 2-bromopropane with alcoholic $\\text{AgCN}$ yields an isocyanide (isonitrile) as $\\text{AgCN}$ is predominantly covalent:\n$$\\text{CH}_3\\text{CH(Br)CH}_3 + \\text{AgCN} \\rightarrow \\text{CH}_3\\text{CH(NC)CH}_3\\quad (\\text{isopropyl isocyanide, X})$$\n2. Reduction of isocyanides with $\\text{LiAlH}_4$ forms secondary methylamines:\n$$\\text{CH}_3\\text{CH(NC)CH}_3 \\xrightarrow{\\text{LiAlH}_4} \\text{CH}_3\\text{CH(NHCH}_3)\\text{CH}_3\\quad (\\text{N-methylpropan-2-amine, Y})$$"
    },
    # Q20
    {
        "chapter": "Organic Compounds Containing Nitrogen",
        "chapter_number": 18,
        "subject": "Chemistry",
        "year": 2016,
        "question": "Which of the following does not give primary amine?",
        "options": [
            "Hydrolysis of alkyl isocyanides",
            "Reduction of alkyl isocyanides",
            "Reduction of amides with $\\text{LiAlH}_4$",
            "Reduction of nitriles with $\\text{LiAlH}_4$"
        ],
        "correct_answer": 1,
        "explanation": "**Answer: (b)**\n\n- Reduction of alkyl isocyanides ($\\text{R-NC}$) with $\\text{LiAlH}_4$ gives **secondary amines** ($\\text{R-NH-CH}_3$).\n- Reduction of nitriles ($\\text{R-CN}$) gives primary amines ($\\text{R-CH}_2\\text{NH}_2$).\n- Reduction of primary amides ($\\text{RCONH}_2$) gives primary amines ($\\text{R-CH}_2\\text{NH}_2$).\n- Hydrolysis of isocyanides gives primary amine ($\\text{R-NH}_2$) and formic acid."
    },
    # Q21
    {
        "chapter": "Organic Compounds Containing Nitrogen",
        "chapter_number": 18,
        "subject": "Chemistry",
        "year": 2017,
        "question": "Which of the following amine has the highest $\\text{p}K_b$ value?",
        "options": [
            "Aniline",
            "p-Nitroaniline",
            "p-Toluidine",
            "p-Methoxyaniline"
        ],
        "correct_answer": 1,
        "explanation": "**Answer: (b)**\n\nHighest $\\text{p}K_b$ value corresponds to the **weakest base** (since $\\text{p}K_b = -\\log K_b$). \nIn $p$-nitroaniline, the strongly electron-withdrawing $-\\text{NO}_2$ group exerts both strong $-I$ and $-R$ effects, drastically reducing the electron density on nitrogen and greatly destabilizing the conjugate ammonium cation. Hence, $p$-nitroaniline is the weakest base and has the largest $\\text{p}K_b$ value."
    },
    # Q22
    {
        "chapter": "Organic Compounds Containing Nitrogen",
        "chapter_number": 18,
        "subject": "Chemistry",
        "year": 2017,
        "question": "The gas leaked from a storage tank of Union Carbide plant in Bhopal was",
        "options": [
            "Methyl isocyanate",
            "Methyl isocyanide",
            "Ethyl isocyanate",
            "Phosgene"
        ],
        "correct_answer": 0,
        "explanation": "**Answer: (a)**\n\nThe toxic gas that leaked during the Bhopal Gas Tragedy (1984) was **Methyl Isocyanate (MIC, $\\text{CH}_3\\text{N=C=O}$)**."
    },
    # Q23
    {
        "chapter": "Organic Compounds Containing Nitrogen",
        "chapter_number": 18,
        "subject": "Chemistry",
        "year": 2018,
        "question": "Which of the following is most basic?",
        "options": [
            "Diphenylamine",
            "Triphenylamine",
            "p-Nitroaniline",
            "Benzylamine"
        ],
        "correct_answer": 3,
        "explanation": "**Answer: (d)**\n\n- In diphenylamine, triphenylamine, and $p$-nitroaniline, the nitrogen lone pair is delocalized into one or more aromatic benzene rings by resonance.\n- In **benzylamine** ($\\text{C}_6\\text{H}_5\\text{CH}_2\\text{NH}_2$), the $-\\text{NH}_2$ group is attached to an aliphatic $sp^3$ methylene group ($-\\text{CH}_2-$), so no resonance delocalization occurs into the benzene ring. Its lone pair is localized and fully available for donation, making benzylamine the strongest base among the given options."
    },
    # Q24
    {
        "chapter": "Organic Compounds Containing Nitrogen",
        "chapter_number": 18,
        "subject": "Chemistry",
        "year": 2018,
        "question": "The general formula of a diazonium salt is",
        "options": [
            "$\\text{R}-\\text{N}^+\\equiv \\text{N}\\;\\text{X}^-$",
            "$\\text{R}-\\text{N}_2^+\\text{X}^-$",
            "$\\text{R}-\\text{NH}_3^+\\text{X}^-$",
            "$\\text{R}_4\\text{N}^+\\text{X}^-$"
        ],
        "correct_answer": 1,
        "explanation": "**Answer: (b)**\n\nDiazonium salts have the general formula $\\text{R}-\\text{N}_2^+\\text{X}^-$ (or $\\text{Ar}-\\text{N}_2^+\\text{X}^-$), where $\\text{R}$ is an alkyl or aryl group, and $\\text{X}^-$ is an anion such as $\\text{Cl}^-$, $\\text{Br}^-$, $\\text{HSO}_4^-$, $\\text{BF}_4^-$, etc."
    },
    # Q25
    {
        "chapter": "Organic Compounds Containing Nitrogen",
        "chapter_number": 18,
        "subject": "Chemistry",
        "year": 2018,
        "question": "Which of the following reactions does not give nitrogen gas?",
        "options": [
            "$\\text{CH}_3\\text{NH}_2 + \\text{HNO}_2$",
            "$(\\text{NH}_4)_2\\text{Cr}_2\\text{O}_7 \\xrightarrow{\\Delta}$",
            "$\\text{NH}_4\\text{Cl} + \\text{NaNO}_2 \\xrightarrow{\\Delta}$",
            "$\\text{NH}_4\\text{NO}_3 \\xrightarrow{\\Delta}$"
        ],
        "correct_answer": 3,
        "explanation": "**Answer: (d)**\n\n- $\\text{CH}_3\\text{NH}_2 + \\text{HNO}_2 \\rightarrow \\text{CH}_3\\text{OH} + \\text{N}_2 + \\text{H}_2\\text{O}$ (Gives $\\text{N}_2$)\n- $(\\text{NH}_4)_2\\text{Cr}_2\\text{O}_7 \\xrightarrow{\\Delta} \\text{N}_2 + \\text{Cr}_2\\text{O}_3 + 4\\text{H}_2\\text{O}$ (Gives $\\text{N}_2$)\n- $\\text{NH}_4\\text{Cl} + \\text{NaNO}_2 \\xrightarrow{\\Delta} \\text{N}_2 + \\text{NaCl} + 2\\text{H}_2\\text{O}$ (Gives $\\text{N}_2$)\n- $\\text{NH}_4\\text{NO}_3 \\xrightarrow{\\Delta} \\text{N}_2\\text{O} + 2\\text{H}_2\\text{O}$ (Gives nitrous oxide, **not** $\\text{N}_2$)."
    },
    # Q26
    {
        "chapter": "Organic Compounds Containing Nitrogen",
        "chapter_number": 18,
        "subject": "Chemistry",
        "year": 2019,
        "question": "Which of the following will not undergo diazotization?",
        "options": [
            "Aniline",
            "N-Methylaniline",
            "p-Toluidine",
            "o-Chloroaniline"
        ],
        "correct_answer": 1,
        "explanation": "**Answer: (b)**\n\nDiazotization is specific to primary aromatic amines ($\\text{ArNH}_2$), producing stable arenediazonium salts at $0-5^\\circ\\text{C}$. \nN-Methylaniline is a **secondary aromatic amine** ($\\text{C}_6\\text{H}_5\\text{NHCH}_3$) and on reaction with nitrous acid ($\\text{HNO}_2$) forms a yellow oily N-nitrosoamine (N-nitroso-N-methylaniline), not a diazonium salt."
    },
    # Q27
    {
        "chapter": "Organic Compounds Containing Nitrogen",
        "chapter_number": 18,
        "subject": "Chemistry",
        "year": 2019,
        "question": "When aniline is treated with bromine water at room temperature, it gives",
        "options": [
            "o-Bromoaniline",
            "p-Bromoaniline",
            "a mixture of o- and p-bromoaniline",
            "2,4,6-tribromoaniline"
        ],
        "correct_answer": 3,
        "explanation": "**Answer: (d)**\n\nThe $-\\text{NH}_2$ group in aniline is strongly activating towards electrophilic aromatic substitution. In aqueous medium (polar solvent), aniline exists in equilibrium with phenoxide-like highly activated species, leading to simultaneous electrophilic substitution at all available ortho and para positions to form a white precipitate of **2,4,6-tribromoaniline**:\n$$\\text{C}_6\\text{H}_5\\text{NH}_2 + 3\\text{Br}_2\\text{(aq)} \\rightarrow \\text{C}_6\\text{H}_2\\text{Br}_3\\text{NH}_2\\downarrow + 3\\text{HBr}$$"
    },
    # Q28
    {
        "chapter": "Organic Compounds Containing Nitrogen",
        "chapter_number": 18,
        "subject": "Chemistry",
        "year": 2019,
        "question": "Aniline on heating with concentrated nitric acid and sulphuric acid gives $m$-nitroaniline as one of the major products (47%) because",
        "options": [
            "$\\text{HNO}_3$ acts as a reducing agent",
            "in acidic medium aniline is protonated to anilinium ion which is meta-directing",
            "$-\\text{NH}_2$ group is meta-directing",
            "$-\\text{NO}_2$ group is meta-directing"
        ],
        "correct_answer": 1,
        "explanation": "**Answer: (b)**\n\nIn strongly acidic nitrating mixture ($\\text{conc. HNO}_3 + \\text{conc. H}_2\\text{SO}_4$), aniline undergoes reversible protonation to form the anilinium ion ($-\\text{NH}_3^+$):\n$$\\text{C}_6\\text{H}_5\\text{NH}_2 + \\text{H}^+ \\rightleftharpoons \\text{C}_6\\text{H}_5\\text{NH}_3^+ $$\nThe positively charged anilinium group ($-\\text{NH}_3^+$) is strongly deactivating and meta-directing. Consequently, nitration gives $47\\%\\; m$-nitroaniline along with $51\\%\\; p$-nitroaniline and $2\\%\\; o$-nitroaniline."
    },
    # Q29
    {
        "chapter": "Organic Compounds Containing Nitrogen",
        "chapter_number": 18,
        "subject": "Chemistry",
        "year": 2020,
        "question": "Which of the following amine does not react with Hinsberg's reagent?",
        "options": [
            "$\\text{CH}_3\\text{CH}_2\\text{NH}_2$",
            "$(\\text{CH}_3\\text{CH}_2)_3\\text{N}$",
            "$(\\text{CH}_3\\text{CH}_2)_2\\text{NH}$",
            "$\\text{C}_6\\text{H}_5\\text{NH}_2$"
        ],
        "correct_answer": 1,
        "explanation": "**Answer: (b)**\n\nHinsberg's reagent is benzenesulphonyl chloride ($\\text{C}_6\\text{H}_5\\text{SO}_2\\text{Cl}$):\n- Primary amines react to form N-alkylbenzenesulphonamides containing an acidic hydrogen on nitrogen (soluble in $\\text{KOH}$).\n- Secondary amines react to form N,N-dialkylbenzenesulphonamides (insoluble in $\\text{KOH}$).\n- **Tertiary amines** ($(\\text{CH}_3\\text{CH}_2)_3\\text{N}$) have no replaceable hydrogen atom on the nitrogen, so they **do not react** with Hinsberg's reagent."
    },
    # Q30
    {
        "chapter": "Organic Compounds Containing Nitrogen",
        "chapter_number": 18,
        "subject": "Chemistry",
        "year": 2020,
        "question": "To prepare $p$-bromoaniline from aniline, the $-\\text{NH}_2$ group of aniline is first protected by acetylation with acetic anhydride because",
        "options": [
            "acetylation decreases the activating effect of the $-\\text{NH}_2$ group",
            "acetylation increases the activating effect of the $-\\text{NH}_2$ group",
            "acetylation makes $-\\text{NH}_2$ meta-directing",
            "aniline decomposes during direct bromination"
        ],
        "correct_answer": 0,
        "explanation": "**Answer: (a)**\n\n![Protection by acetylation](/pyq_images/chemistry/ch18/q30_options.png)\n\nDirect bromination of aniline leads to polysubstitution forming 2,4,6-tribromoaniline due to high activation. Acetylation with $(\\text{CH}_3\\text{CO})_2\\text{O}$ converts $-\\text{NH}_2$ into $-\\text{NHCOCH}_3$ (acetanilide). In acetanilide, the nitrogen lone pair is delocalized into the carbonyl group ($-\\text{C=O}$) via resonance, which reduces its electron-donating ability to the aromatic ring. This moderates the activation and enables monobromination specifically at the para position."
    },
    # Q31
    {
        "chapter": "Organic Compounds Containing Nitrogen",
        "chapter_number": 18,
        "subject": "Chemistry",
        "year": 2020,
        "question": "Hinsberg's reagent is",
        "options": [
            "$\\text{C}_6\\text{H}_5\\text{SO}_2\\text{Cl}$",
            "$\\text{C}_6\\text{H}_5\\text{SO}_2\\text{NH}_2$",
            "$\\text{CH}_3\\text{COCl} / \\text{pyridine}$",
            "$(\\text{CH}_3\\text{CO})_2\\text{O} / \\text{pyridine}$"
        ],
        "correct_answer": 0,
        "explanation": "**Answer: (a)**\n\n**Hinsberg's reagent** is **benzenesulphonyl chloride** ($\\text{C}_6\\text{H}_5\\text{SO}_2\\text{Cl}$), used to distinguish between primary ($1^\\circ$), secondary ($2^\\circ$), and tertiary ($3^\\circ$) amines."
    },
    # Q32
    {
        "chapter": "Organic Compounds Containing Nitrogen",
        "chapter_number": 18,
        "subject": "Chemistry",
        "year": 2021,
        "question": "In the reaction sequence:\n$$\\text{C}_6\\text{H}_5\\text{CH}_2\\text{Cl} \\xrightarrow{\\text{KCN(alc.)}} \\text{A} \\xrightarrow{\\text{H}_2 / \\text{Ni}} \\text{B}$$\nThe compound 'B' is",
        "options": [
            "$\\text{C}_6\\text{H}_5\\text{CH}_2\\text{CH}_2\\text{NH}_2$",
            "$\\text{C}_6\\text{H}_5\\text{CH}_2\\text{NH}_2$",
            "$\\text{C}_6\\text{H}_5\\text{NHCH}_3$",
            "$\\text{C}_6\\text{H}_5\\text{CH}_2\\text{CONH}_2$"
        ],
        "correct_answer": 0,
        "explanation": "**Answer: (a)**\n\n![Reaction Scheme](/pyq_images/chemistry/ch18/q32_scheme.png)\n\n1. Benzyl chloride reacts with alcoholic $\\text{KCN}$ to undergo nucleophilic substitution:\n$$\\text{C}_6\\text{H}_5\\text{CH}_2\\text{Cl} + \\text{KCN} \\rightarrow \\text{C}_6\\text{H}_5\\text{CH}_2\\text{CN} + \\text{KCl}\\quad (\\text{Phenylacetonitrile, A})$$\n2. Catalytic hydrogenation of nitrile 'A' with $\\text{H}_2/\\text{Ni}$ yields a primary amine:\n$$\\text{C}_6\\text{H}_5\\text{CH}_2\\text{CN} \\xrightarrow{2\\text{H}_2/\\text{Ni}} \\text{C}_6\\text{H}_5\\text{CH}_2\\text{CH}_2\\text{NH}_2\\quad (\\text{2-phenylethanamine, B})$$"
    },
    # Q33
    {
        "chapter": "Organic Compounds Containing Nitrogen",
        "chapter_number": 18,
        "subject": "Chemistry",
        "year": 2021,
        "question": "Gabriel phthalimide synthesis cannot be used for the preparation of aniline because",
        "options": [
            "phthalimide is insoluble in alcohol",
            "aryl halides do not undergo nucleophilic substitution with potassium phthalimide under mild conditions",
            "aniline undergoes side reactions with phthalimide",
            "aniline cannot be hydrolyzed from phthalimide"
        ],
        "correct_answer": 1,
        "explanation": "**Answer: (b)**\n\nIn Gabriel phthalimide synthesis, potassium phthalimide undergoes nucleophilic substitution ($S_N2$) with alkyl halides. Aryl halides (like chlorobenzene) do not undergo nucleophilic substitution with phthalimide anion under normal conditions due to partial double bond character of the $\\text{C}-\\text{Cl}$ bond arising from resonance, $sp^2$ hybridized ring carbon, and steric repulsion."
    },
    # Q34
    {
        "chapter": "Organic Compounds Containing Nitrogen",
        "chapter_number": 18,
        "subject": "Chemistry",
        "year": 2021,
        "question": "In the reaction:\n$$\\text{CH}_3-\\text{CH}_2-\\text{CH}=\\text{CH}_2 \\xrightarrow{\\text{HCl}} \\text{A} \\xrightarrow{\\text{alc. NH}_3} \\text{B}$$\nThe major product 'B' is",
        "options": [
            "$\\text{CH}_3\\text{CH}_2\\text{CH}_2\\text{CH}_2\\text{NH}_2$",
            "$\\text{CH}_3\\text{CH}_2\\text{CH(NH}_2)\\text{CH}_3$",
            "$(\\text{CH}_3)_3\\text{C}-\\text{NH}_2$",
            "$(\\text{CH}_3\\text{CH}_2)_2\\text{NH}$"
        ],
        "correct_answer": 1,
        "explanation": "**Answer: (b)**\n\n![Reaction Scheme](/pyq_images/chemistry/ch18/q34_scheme.png)\n\n1. Electrophilic addition of $\\text{HCl}$ to but-1-ene follows Markovnikov's rule:\n$$\\text{CH}_3\\text{CH}_2\\text{CH=CH}_2 + \\text{HCl} \\rightarrow \\text{CH}_3\\text{CH}_2\\text{CH(Cl)CH}_3\\quad (\\text{2-chlorobutane, A})$$\n2. Nucleophilic substitution with alcoholic $\\text{NH}_3$ yields 2-aminobutane (butan-2-amine):\n$$\\text{CH}_3\\text{CH}_2\\text{CH(Cl)CH}_3 + \\text{NH}_3 \\rightarrow \\text{CH}_3\\text{CH}_2\\text{CH(NH}_2)\\text{CH}_3 + \\text{HCl}\\quad (\\text{B})$$"
    },
    # Q35
    {
        "chapter": "Organic Compounds Containing Nitrogen",
        "chapter_number": 18,
        "subject": "Chemistry",
        "year": 2022,
        "question": "In carbylamine test for primary amines, the resulting foul smelling product is",
        "options": [
            "$\\text{R}-\\text{NC}$",
            "$\\text{R}-\\text{CN}$",
            "$\\text{R}-\\text{NCl}_2$",
            "$\\text{R}-\\text{NO}_2$"
        ],
        "correct_answer": 0,
        "explanation": "**Answer: (a)**\n\nWhen a primary amine is heated with chloroform and alcoholic $\\text{KOH}$, it forms an **alkyl isocyanide (carbylamine, $\\text{R-NC}$)** which has an extremely foul, pungent smell:\n$$\\text{R-NH}_2 + \\text{CHCl}_3 + 3\\text{KOH(alc.)} \\xrightarrow{\\Delta} \\text{R-NC} + 3\\text{KCl} + 3\\text{H}_2\\text{O}$$"
    },
    # Q36
    {
        "chapter": "Organic Compounds Containing Nitrogen",
        "chapter_number": 18,
        "subject": "Chemistry",
        "year": 2022,
        "question": "A secondary amine is",
        "options": [
            "a compound with an $-\\text{NH}_2$ group on the secondary carbon atom",
            "a compound in which two hydrogen atoms of $\\text{NH}_3$ have been replaced by alkyl/aryl groups",
            "an organic compound with two $-\\text{NH}_2$ groups",
            "a compound with an $-\\text{NH}_2$ group on the tertiary carbon atom"
        ],
        "correct_answer": 1,
        "explanation": "**Answer: (b)**\n\nIn organic chemistry, amines are classified by the number of organic (alkyl or aryl) groups directly attached to the nitrogen atom:\n- **Primary amine ($1^\\circ$):** $\\text{R}-\\text{NH}_2$ (one H of $\\text{NH}_3$ replaced)\n- **Secondary amine ($2^\\circ$):** $\\text{R}_2\\text{NH}$ (two H atoms of $\\text{NH}_3$ replaced by organic groups)\n- **Tertiary amine ($3^\\circ$):** $\\text{R}_3\\text{N}$ (all three H atoms of $\\text{NH}_3$ replaced)."
    },
    # Q37
    {
        "chapter": "Organic Compounds Containing Nitrogen",
        "chapter_number": 18,
        "subject": "Chemistry",
        "year": 2023,
        "question": "Identify A, B, and C in the sequence:\n$$\\text{CH}_3\\text{CH}_2\\text{Cl} \\xrightarrow{\\text{KCN(alc.)}} \\text{A} \\xrightarrow{\\text{LiAlH}_4} \\text{B} \\xrightarrow{\\text{HNO}_2} \\text{C}$$",
        "options": [
            "$\\text{A} = \\text{CH}_3\\text{CH}_2\\text{CN},\\; \\text{B} = \\text{CH}_3\\text{CH}_2\\text{CH}_2\\text{NH}_2,\\; \\text{C} = \\text{CH}_3\\text{CH}_2\\text{CH}_2\\text{OH}$",
            "$\\text{A} = \\text{CH}_3\\text{CH}_2\\text{NC},\\; \\text{B} = \\text{CH}_3\\text{CH}_2\\text{OH},\\; \\text{C} = \\text{CH}_3\\text{CH}_2\\text{CH}_2\\text{NH}_2$",
            "$\\text{A} = \\text{CH}_3\\text{CH}_2\\text{CN},\\; \\text{B} = \\text{CH}_3\\text{CH}_2\\text{COOH},\\; \\text{C} = \\text{CH}_3\\text{CH}_2\\text{OH}$",
            "$\\text{A} = \\text{CH}_3\\text{CH}_2\\text{Cl},\\; \\text{B} = \\text{CH}_3\\text{CH}_2\\text{NH}_2,\\; \\text{C} = \\text{CH}_3\\text{CH}_2\\text{OH}$"
        ],
        "correct_answer": 0,
        "explanation": "**Answer: (a)**\n\n![Reaction Scheme](/pyq_images/chemistry/ch18/q37_scheme.png)\n\n1. $\\text{CH}_3\\text{CH}_2\\text{Cl} + \\text{KCN(alc.)} \\rightarrow \\text{CH}_3\\text{CH}_2\\text{CN}$ (Propanenitrile, $\\text{A}$)\n2. $\\text{CH}_3\\text{CH}_2\\text{CN} \\xrightarrow{\\text{LiAlH}_4} \\text{CH}_3\\text{CH}_2\\text{CH}_2\\text{NH}_2$ (Propan-1-amine, $\\text{B}$)\n3. $\\text{CH}_3\\text{CH}_2\\text{CH}_2\\text{NH}_2 \\xrightarrow{\\text{HNO}_2} \\text{CH}_3\\text{CH}_2\\text{CH}_2\\text{OH} + \\text{N}_2 + \\text{H}_2\\text{O}$ (Propan-1-ol, $\\text{C}$)."
    },
    # Q38
    {
        "chapter": "Organic Compounds Containing Nitrogen",
        "chapter_number": 18,
        "subject": "Chemistry",
        "year": 2023,
        "question": "Aniline does not undergo",
        "options": [
            "nitration",
            "sulphonation",
            "Friedel-Crafts reaction",
            "bromination"
        ],
        "correct_answer": 2,
        "explanation": "**Answer: (c)**\n\nAniline does not undergo **Friedel-Crafts alkylation or acylation** because the Lewis acid catalyst ($\\text{AlCl}_3$) reacts with the basic lone pair of electrons on the nitrogen atom of aniline to form an adduct/complex:\n$$\\text{C}_6\\text{H}_5\\text{NH}_2 + \\text{AlCl}_3 \\rightarrow \\text{C}_6\\text{H}_5\\text{NH}_2^+-\\text{AlCl}_3^- $$\nThis acquires a positive charge on nitrogen, making the group strongly deactivating, which prevents any electrophilic aromatic substitution like Friedel-Crafts."
    },
    # Q39
    {
        "chapter": "Organic Compounds Containing Nitrogen",
        "chapter_number": 18,
        "subject": "Chemistry",
        "year": 2024,
        "question": "In the reaction:\n$$\\text{Aniline} \\xrightarrow{\\text{NaNO}_2/\\text{dil. HCl},\\; 0-5^\\circ\\text{C}} \\text{P} \\xrightarrow{\\text{HBF}_4} \\text{Q} \\xrightarrow{\\text{NaNO}_2/\\text{Cu},\\; \\Delta} \\text{R}$$\nP, Q and R respectively are",
        "options": [
            "$\\text{C}_6\\text{H}_5\\text{N}_2^+\\text{Cl}^-,\\; \\text{C}_6\\text{H}_5\\text{N}_2^+\\text{BF}_4^-,\\; \\text{C}_6\\text{H}_5\\text{NO}_2$",
            "$\\text{C}_6\\text{H}_5\\text{Cl},\\; \\text{C}_6\\text{H}_5\\text{F},\\; \\text{C}_6\\text{H}_5\\text{NO}_2$",
            "$\\text{C}_6\\text{H}_5\\text{N}_2^+\\text{Cl}^-,\\; \\text{C}_6\\text{H}_5\\text{F},\\; \\text{C}_6\\text{H}_5\\text{NO}_2$",
            "$\\text{C}_6\\text{H}_5\\text{NO}_2,\\; \\text{C}_6\\text{H}_5\\text{N}_2^+\\text{BF}_4^-,\\; \\text{C}_6\\text{H}_5\\text{Cl}$"
        ],
        "correct_answer": 0,
        "explanation": "**Answer: (a)**\n\n![Reaction Scheme](/pyq_images/chemistry/ch18/q39_scheme.png)\n\n1. **Diazotization:** $\\text{C}_6\\text{H}_5\\text{NH}_2 \\xrightarrow{\\text{NaNO}_2/\\text{HCl},\\; 0-5^\\circ\\text{C}} \\text{C}_6\\text{H}_5\\text{N}_2^+\\text{Cl}^-$ (Benzenediazonium chloride, $\\text{P}$)\n2. **Fluoroborate salt formation:** $\\text{C}_6\\text{H}_5\\text{N}_2^+\\text{Cl}^- \\xrightarrow{\\text{HBF}_4} \\text{C}_6\\text{H}_5\\text{N}_2^+\\text{BF}_4^-$ (Benzenediazonium fluoroborate, $\\text{Q}$)\n3. **Replacement by nitro group:** $\\text{C}_6\\text{H}_5\\text{N}_2^+\\text{BF}_4^- \\xrightarrow{\\text{NaNO}_2/\\text{Cu},\\; \\Delta} \\text{C}_6\\text{H}_5\\text{NO}_2 + \\text{N}_2 + \\text{NaBF}_4$ (Nitrobenzene, $\\text{R}$)."
    },
    # Q40
    {
        "chapter": "Organic Compounds Containing Nitrogen",
        "chapter_number": 18,
        "subject": "Chemistry",
        "year": 2024,
        "question": "In the reaction:\n$$\\text{Aniline} \\xrightarrow{\\text{NaNO}_2/\\text{dil. HCl},\\; 0-5^\\circ\\text{C}} \\text{P} \\xrightarrow{\\text{Phenol, NaOH}} \\text{Q}$$\n'Q' is",
        "options": [
            "$\\text{C}_6\\text{H}_5\\text{N}_2\\text{Cl}$",
            "ortho-hydroxyazobenzene",
            "para-hydroxyazobenzene",
            "meta-hydroxyazobenzene"
        ],
        "correct_answer": 2,
        "explanation": "**Answer: (c)**\n\n![Coupling Reaction](/pyq_images/chemistry/ch18/q40_scheme.png)\n\n1. Diazotization of aniline gives benzenediazonium chloride ($\\text{P}$, $\\text{C}_6\\text{H}_5\\text{N}_2^+\\text{Cl}^-$).\n2. Coupling of benzenediazonium chloride with phenol in mildly basic medium ($\\text{pH} = 9-10$, $\\text{NaOH}$) occurs exclusively at the para position of phenol to form an orange-coloured azo dye, **para-hydroxyazobenzene** ($\\text{Q}$):\n$$\\text{C}_6\\text{H}_5-\\text{N}_2^+\\text{Cl}^- + \\text{C}_6\\text{H}_5\\text{OH} \\xrightarrow{\\text{OH}^-,\\; 0-5^\\circ\\text{C}} \\text{C}_6\\text{H}_5-\\text{N}=\\text{N}-\\text{C}_6\\text{H}_4-\\text{OH}(p) + \\text{Cl}^- + \\text{H}_2\\text{O}$$"
    }
]

output_path = 'src/data/pyq_chemistry_ch18.json'
with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(questions, f, indent=2, ensure_ascii=False)

print(f"Total Chemistry 18 questions created: {len(questions)}")
print(f"Saved {output_path}.")
