import json

questions = [
    {
        "id": "kcet-2006-2007-chem-ch13-q1",
        "questionNumber": 1,
        "examYear": "2006, 2007",
        "question": "The highest magnetic moment is shown by the transition metal ion with the configuration",
        "options": [
            {"id": "a", "text": "3d^2"},
            {"id": "b", "text": "3d^5"},
            {"id": "c", "text": "3d^7"},
            {"id": "d", "text": "3d^9"}
        ],
        "correctOption": "b",
        "explanation": "Spin-only magnetic moment is given by $\\mu = \\sqrt{n(n+2)}\\text{ B.M.}$, where $n$ is the number of unpaired electrons.\n- $3d^2$: $n = 2$, $\\mu = \\sqrt{2(4)} = \\sqrt{8} \\approx 2.83\\text{ B.M.}$\n- $3d^5$: $n = 5$, $\\mu = \\sqrt{5(7)} = \\sqrt{35} \\approx 5.92\\text{ B.M.}$\n- $3d^7$: $n = 3$, $\\mu = \\sqrt{3(5)} = \\sqrt{15} \\approx 3.87\\text{ B.M.}$\n- $3d^9$: $n = 1$, $\\mu = \\sqrt{1(3)} = \\sqrt{3} \\approx 1.73\\text{ B.M.}$\n\nSince $3d^5$ has the maximum number of unpaired electrons ($n = 5$), it exhibits the highest magnetic moment."
    },
    {
        "id": "kcet-2006-chem-ch13-q2",
        "questionNumber": 2,
        "examYear": "2006",
        "question": "A transition metal ion exists in its highest oxidation state. It is expected to behave as",
        "options": [
            {"id": "a", "text": "a chelating agent"},
            {"id": "b", "text": "a central metal in a coordination compound"},
            {"id": "c", "text": "an oxidising agent"},
            {"id": "d", "text": "a reducing agent."}
        ],
        "correctOption": "c",
        "explanation": "When a transition metal ion exists in its highest oxidation state, it cannot lose any more electrons to increase its oxidation state further; it can only gain electrons (undergo reduction). Therefore, it acts as a strong oxidising agent (e.g., $\\text{Mn(VII)}$ in $\\text{KMnO}_4$, $\\text{Cr(VI)}$ in $\\text{K}_2\\text{Cr}_2\\text{O}_7$)."
    },
    {
        "id": "kcet-2006-chem-ch13-q3",
        "questionNumber": 3,
        "examYear": "2006",
        "question": "The formula mass of Mohr's salt is 392. The iron present in it is oxidised by KMnO4 in acid medium. The equivalent mass of Mohr's salt is",
        "options": [
            {"id": "a", "text": "392"},
            {"id": "b", "text": "31.6"},
            {"id": "c", "text": "278"},
            {"id": "d", "text": "156"}
        ],
        "correctOption": "a",
        "explanation": "Mohr's salt is ferrous ammonium sulphate, $\\text{(NH}_4)_2\\text{SO}_4\\cdot\\text{FeSO}_4\\cdot6\\text{H}_2\\text{O}$.\nIn acidic medium, $\\text{Fe}^{2+}$ is oxidised to $\\text{Fe}^{3+}$:\n$$\\text{Fe}^{2+} \\rightarrow \\text{Fe}^{3+} + e^-$$\nThe change in oxidation number of iron per mole of Mohr's salt is $(+3) - (+2) = 1$.\n$$\\text{Equivalent mass} = \\frac{\\text{Molar mass}}{n\\text{-factor}} = \\frac{392}{1} = 392$$"
    },
    {
        "id": "kcet-2007-chem-ch13-q4",
        "questionNumber": 4,
        "examYear": "2007",
        "question": "Formation of coloured solution is possible when metal ion in the compound contain",
        "options": [
            {"id": "a", "text": "lone pair of electrons"},
            {"id": "b", "text": "unpaired electrons"},
            {"id": "c", "text": "paired electrons"},
            {"id": "d", "text": "none of these."}
        ],
        "correctOption": "b",
        "explanation": "The colour of transition metal ions is attributed to $d$-$d$ transitions of unpaired electrons. Upon absorption of radiation in the visible region, an unpaired electron is excited from a lower energy $d$-orbital to a higher energy $d$-orbital. Hence, unpaired $d$-electrons are required for coloured solution formation."
    },
    {
        "id": "kcet-2007-chem-ch13-q5",
        "questionNumber": 5,
        "examYear": "2007",
        "question": "Which of the following forms a colourless solution in aqueous medium?",
        "options": [
            {"id": "a", "text": "Cr^3+"},
            {"id": "b", "text": "V^3+"},
            {"id": "c", "text": "Sc^3+"},
            {"id": "d", "text": "Ti^3+"}
        ],
        "correctOption": "c",
        "explanation": "Electronic configurations of the given ions:\n- $\\text{Cr}^{3+}: [\\text{Ar}] 3d^3 4s^0$ (3 unpaired electrons $\\rightarrow$ coloured, green/violet)\n- $\\text{V}^{3+}: [\\text{Ar}] 3d^2 4s^0$ (2 unpaired electrons $\\rightarrow$ coloured, green)\n- $\\text{Sc}^{3+}: [\\text{Ar}] 3d^0 4s^0$ (0 unpaired electrons $\\rightarrow$ colourless due to absence of $d$-$d$ transition)\n- $\\text{Ti}^{3+}: [\\text{Ar}] 3d^1 4s^0$ (1 unpaired electron $\\rightarrow$ coloured, purple)"
    },
    {
        "id": "kcet-2008-chem-ch13-q6",
        "questionNumber": 6,
        "examYear": "2008",
        "question": "Mercury is a liquid metal because",
        "options": [
            {"id": "a", "text": "it has a completely filled d-orbital that prevents d-d overlapping of orbitals"},
            {"id": "b", "text": "it has a completely filled d-orbital that causes d-d overlapping"},
            {"id": "c", "text": "it has a completely filled s-orbital"},
            {"id": "d", "text": "it has a small atomic size."}
        ],
        "correctOption": "a",
        "explanation": "Mercury ($\\text{Hg}$, $Z=80$) has the electronic configuration $[\\text{Xe}] 4f^{14} 5d^{10} 6s^2$. Because its $d$-orbitals are completely filled, there are no unpaired electrons available for metallic bonding or $d$-$d$ orbital overlap. The resulting metallic bonding is extremely weak, giving mercury a very low melting point ($-38.8^\\circ\\text{C}$) so it exists as a liquid at room temperature."
    },
    {
        "id": "kcet-2008-chem-ch13-q7",
        "questionNumber": 7,
        "examYear": "2008",
        "question": "When sulphur dioxide is passed in an acidified K2Cr2O7 solution, the oxidation state of sulphur is changed from",
        "options": [
            {"id": "a", "text": "+4 to +6"},
            {"id": "b", "text": "+6 to +4"},
            {"id": "c", "text": "+4 to 0"},
            {"id": "d", "text": "+4 to +2"}
        ],
        "correctOption": "a",
        "explanation": "Acidified potassium dichromate is a strong oxidising agent. When $\\text{SO}_2$ is passed into acidified $\\text{K}_2\\text{Cr}_2\\text{O}_7$ solution:\n$$\\text{K}_2\\text{Cr}_2\\text{O}_7 + \\text{H}_2\\text{SO}_4 + 3\\text{SO}_2 \\rightarrow \\text{K}_2\\text{SO}_4 + \\text{Cr}_2(\\text{SO}_4)_3 + \\text{H}_2\\text{O}$$\nIn $\\text{SO}_2$, the oxidation state of sulphur is $+4$.\nIn $\\text{SO}_4^{2-}$ (as in $\\text{Cr}_2(\\text{SO}_4)_3$ and $\\text{K}_2\\text{SO}_4$), the oxidation state of sulphur is $+6$.\nThus, sulphur changes from $+4$ to $+6$."
    },
    {
        "id": "kcet-2008-chem-ch13-q8",
        "questionNumber": 8,
        "examYear": "2008",
        "question": "Which of the following has the maximum number of unpaired d electrons?",
        "options": [
            {"id": "a", "text": "Ni^3+"},
            {"id": "b", "text": "Cu^+"},
            {"id": "c", "text": "Zn^2+"},
            {"id": "d", "text": "Fe^2+"}
        ],
        "correctOption": "d",
        "explanation": "Let's check the number of unpaired $d$-electrons:\n- $\\text{Ni}^{3+}$ ($Z=28$): $[\\text{Ar}]3d^7 \\rightarrow 3$ unpaired $d$-electrons\n- $\\text{Cu}^{+}$ ($Z=29$): $[\\text{Ar}]3d^{10} \\rightarrow 0$ unpaired $d$-electrons\n- $\\text{Zn}^{2+}$ ($Z=30$): $[\\text{Ar}]3d^{10} \\rightarrow 0$ unpaired $d$-electrons\n- $\\text{Fe}^{2+}$ ($Z=26$): $[\\text{Ar}]3d^6 \\rightarrow 4$ unpaired $d$-electrons\n\nTherefore, $\\text{Fe}^{2+}$ has the maximum number of unpaired $d$-electrons (4)."
    },
    {
        "id": "kcet-2009-chem-ch13-q9",
        "questionNumber": 9,
        "examYear": "2009",
        "question": "The incorrect statement in respect of chromyl chloride test is",
        "options": [
            {"id": "a", "text": "formation of lead chromate"},
            {"id": "b", "text": "formation of chromyl chloride"},
            {"id": "c", "text": "liberation of chlorine"},
            {"id": "d", "text": "formation of red vapours."}
        ],
        "correctOption": "c",
        "explanation": "In the chromyl chloride test for chloride ion:\n1. $\\text{NaCl} + \\text{K}_2\\text{Cr}_2\\text{O}_7 + \\text{H}_2\\text{SO}_4 \\rightarrow \\text{CrO}_2\\text{Cl}_2\\uparrow \\text{ (red-orange vapours)}$\n2. The vapours are passed into $\\text{NaOH}$ solution: $\\text{CrO}_2\\text{Cl}_2 + 4\\text{NaOH} \\rightarrow \\text{Na}_2\\text{CrO}_4\\text{ (yellow solution)} + 2\\text{NaCl} + 2\\text{H}_2\\text{O}$\n3. Adding acetic acid and lead acetate forms yellow lead chromate precipitate:\n$$\\text{Na}_2\\text{CrO}_4 + \\text{Pb(CH}_3\\text{COO)}_2 \\rightarrow \\text{PbCrO}_4\\downarrow + 2\\text{CH}_3\\text{COONa}$$\nChlorine gas ($\\text{Cl}_2$) is NOT liberated in this test."
    },
    {
        "id": "kcet-2009-chem-ch13-q10",
        "questionNumber": 10,
        "examYear": "2009",
        "question": "The magnetic moment of a transition metal ion is √15 B.M. Therefore the number of unpaired electrons present in it is",
        "options": [
            {"id": "a", "text": "4"},
            {"id": "b", "text": "1"},
            {"id": "c", "text": "2"},
            {"id": "d", "text": "3"}
        ],
        "correctOption": "d",
        "explanation": "Using the spin-only formula:\n$$\\mu = \\sqrt{n(n+2)} = \\sqrt{15}\\text{ B.M.}$$\n$$n(n+2) = 15 \\implies n^2 + 2n - 15 = 0 \\implies (n+5)(n-3) = 0$$\nSince $n > 0$, $n = 3$. Hence, 3 unpaired electrons are present."
    },
    {
        "id": "kcet-2010-chem-ch13-q11",
        "questionNumber": 11,
        "examYear": "2010",
        "question": "The spin only magnetic moment of Mn^4+ ion is nearly",
        "options": [
            {"id": "a", "text": "3 B.M."},
            {"id": "b", "text": "6 B.M."},
            {"id": "c", "text": "4 B.M."},
            {"id": "d", "text": "5 B.M."}
        ],
        "correctOption": "c",
        "explanation": "Manganese ($Z=25$) has ground state configuration $[\\text{Ar}]3d^5 4s^2$.\n$\\text{Mn}^{4+}$ has configuration $[\\text{Ar}]3d^3$.\nNumber of unpaired electrons $n = 3$.\n$$\\mu = \\sqrt{n(n+2)} = \\sqrt{3(3+2)} = \\sqrt{15} \\approx 3.87\\text{ B.M.} \\approx 4\\text{ B.M.}$$"
    },
    {
        "id": "kcet-2010-chem-ch13-q12",
        "questionNumber": 12,
        "examYear": "2010",
        "question": "A white crystalline salt A reacts with dilute HCl to liberate a suffocating gas B and also forms a yellow precipitate. The gas B turns potassium dichromate acidified with dilute H2SO4 to a green coloured solution C. A, B and C are respectively",
        "options": [
            {"id": "a", "text": "Na2SO3, SO2, Cr2(SO4)3"},
            {"id": "b", "text": "Na2S2O3, SO2, Cr2(SO4)3"},
            {"id": "c", "text": "Na2S, SO2, Cr2(SO4)3"},
            {"id": "d", "text": "Na2SO4, SO2, Cr2(SO4)3"}
        ],
        "correctOption": "b",
        "explanation": "Sodium thiosulphate ($\\text{Na}_2\\text{S}_2\\text{O}_3$, salt $A$) reacts with dilute $\\text{HCl}$ to liberate sulphur dioxide gas ($\\text{SO}_2$, suffocating gas $B$) and forms a yellow colloidal precipitate of sulphur:\n$$\\text{Na}_2\\text{S}_2\\text{O}_3 + 2\\text{HCl} \\rightarrow 2\\text{NaCl} + \\text{SO}_2\\uparrow + \\text{S}\\downarrow\\text{ (yellow)} + \\text{H}_2\\text{O}$$\nThe liberated $\\text{SO}_2$ reduces acidified potassium dichromate to green chromic sulphate ($\\text{Cr}_2(\\text{SO}_4)_3$, $C$):\n$$\\text{K}_2\\text{Cr}_2\\text{O}_7 + \\text{H}_2\\text{SO}_4 + 3\\text{SO}_2 \\rightarrow \\text{K}_2\\text{SO}_4 + \\text{Cr}_2(\\text{SO}_4)_3\\text{ (green)} + \\text{H}_2\\text{O}$$\nHence, $A = \\text{Na}_2\\text{S}_2\\text{O}_3$, $B = \\text{SO}_2$, $C = \\text{Cr}_2(\\text{SO}_4)_3$."
    },
    {
        "id": "kcet-2011-chem-ch13-q13",
        "questionNumber": 13,
        "examYear": "2011",
        "question": "The yellow precipitate formed during the chromyl chloride test is chemically",
        "options": [
            {"id": "a", "text": "chromic acid"},
            {"id": "b", "text": "lead chromate"},
            {"id": "c", "text": "lead acetate"},
            {"id": "d", "text": "sodium chromate."}
        ],
        "correctOption": "b",
        "explanation": "In the confirmatory step of the chromyl chloride test, the reddish vapours of $\\text{CrO}_2\\text{Cl}_2$ absorbed in $\\text{NaOH}$ form $\\text{Na}_2\\text{CrO}_4$. When treated with acetic acid and lead acetate, a yellow precipitate of lead chromate ($\\text{PbCrO}_4$) is formed:\n$$\\text{Na}_2\\text{CrO}_4 + \\text{Pb(CH}_3\\text{COO)}_2 \\rightarrow \\text{PbCrO}_4\\downarrow\\text{ (yellow ppt)} + 2\\text{CH}_3\\text{COONa}$$"
    },
    {
        "id": "kcet-2011-chem-ch13-q14",
        "questionNumber": 14,
        "examYear": "2011",
        "question": "The spin only magnetic moment of Fe^2+ ion (in B.M.) is approximately",
        "options": [
            {"id": "a", "text": "4"},
            {"id": "b", "text": "7"},
            {"id": "c", "text": "5"},
            {"id": "d", "text": "6"}
        ],
        "correctOption": "c",
        "explanation": "$\\text{Fe}^{2+}$ ($Z=26$): electronic configuration is $[\\text{Ar}]3d^6 4s^0$.\nNumber of unpaired electrons in $3d^6$ is $n = 4$.\n$$\\mu = \\sqrt{n(n+2)} = \\sqrt{4(4+2)} = \\sqrt{24} \\approx 4.898\\text{ B.M.} \\approx 5\\text{ B.M.}$$"
    },
    {
        "id": "kcet-2012-chem-ch13-q15",
        "questionNumber": 15,
        "examYear": "2012",
        "question": "Which one of the following has a magnetic moment of 1.75 B.M?",
        "options": [
            {"id": "a", "text": "Ti^3+"},
            {"id": "b", "text": "V^3+"},
            {"id": "c", "text": "Cr^3+"},
            {"id": "d", "text": "Fe^3+"}
        ],
        "correctOption": "a",
        "explanation": "Magnetic moment of $1.73-1.75\\text{ B.M.}$ corresponds to $n = 1$ unpaired electron (since $\\sqrt{1(3)} = \\sqrt{3} \\approx 1.732\\text{ B.M.}$).\n- $\\text{Ti}^{3+}: 3d^1 \\implies n = 1 \\implies \\mu = 1.73\\text{ B.M.}$\n- $\\text{V}^{3+}: 3d^2 \\implies n = 2 \\implies \\mu = 2.83\\text{ B.M.}$\n- $\\text{Cr}^{3+}: 3d^3 \\implies n = 3 \\implies \\mu = 3.87\\text{ B.M.}$\n- $\\text{Fe}^{3+}: 3d^5 \\implies n = 5 \\implies \\mu = 5.92\\text{ B.M.}$\n\nThus, $\\text{Ti}^{3+}$ has a magnetic moment of $\\approx 1.75\\text{ B.M.}$"
    },
    {
        "id": "kcet-2012-chem-ch13-q16",
        "questionNumber": 16,
        "examYear": "2012",
        "question": "The \"spin only\" magnetic moment of Ni^2+ in aqueous solution would be [At No. of Ni = 28]",
        "options": [
            {"id": "a", "text": "√6 B.M"},
            {"id": "b", "text": "√15 B.M"},
            {"id": "c", "text": "√2 B.M"},
            {"id": "d", "text": "√8 B.M"}
        ],
        "correctOption": "d",
        "explanation": "Nickel ($Z=28$): $\\text{Ni} = [\\text{Ar}]3d^8 4s^2$.\n$\\text{Ni}^{2+} = [\\text{Ar}]3d^8$.\nIn $3d^8$, there are 2 unpaired electrons ($n=2$).\n$$\\mu = \\sqrt{n(n+2)} = \\sqrt{2(2+2)} = \\sqrt{8}\\text{ B.M.}$$"
    },
    {
        "id": "kcet-2012-chem-ch13-q17",
        "questionNumber": 17,
        "examYear": "2012",
        "question": "Silver iodide is used for producing artificial rain because AgI",
        "options": [
            {"id": "a", "text": "is easy to spray at high altitude"},
            {"id": "b", "text": "is easy to synthesize"},
            {"id": "c", "text": "has crystal structure similar to ice"},
            {"id": "d", "text": "is insoluble in water."}
        ],
        "correctOption": "c",
        "explanation": "Silver iodide ($\\text{AgI}$) has a hexagonal crystal structure very similar to that of ice crystals. When finely dispersed into supercooled clouds (cloud seeding), $\\text{AgI}$ particles serve as excellent heterogeneous nucleation centers for the freezing of water droplets to form rain/snow."
    },
    {
        "id": "kcet-2013-chem-ch13-q18",
        "questionNumber": 18,
        "examYear": "2013",
        "question": "Which one of the following shows highest magnetic moment?",
        "options": [
            {"id": "a", "text": "Fe^2+"},
            {"id": "b", "text": "Co^2+"},
            {"id": "c", "text": "Cr^3+"},
            {"id": "d", "text": "Ni^2+"}
        ],
        "correctOption": "a",
        "explanation": "Number of unpaired electrons ($n$):\n- $_{26}\\text{Fe}^{2+}: [\\text{Ar}]3d^6 \\rightarrow n = 4$\n- $_{27}\\text{Co}^{2+}: [\\text{Ar}]3d^7 \\rightarrow n = 3$\n- $_{24}\\text{Cr}^{3+}: [\\text{Ar}]3d^3 \\rightarrow n = 3$\n- $_{28}\\text{Ni}^{2+}: [\\text{Ar}]3d^8 \\rightarrow n = 2$\n\nSince $\\text{Fe}^{2+}$ has the highest number of unpaired electrons ($n=4$), it exhibits the highest magnetic moment ($\\mu = \\sqrt{24} \\approx 4.9\\text{ B.M.})$."
    },
    {
        "id": "kcet-2013-chem-ch13-q19",
        "questionNumber": 19,
        "examYear": "2013",
        "question": "In a transition series, with the increase in atomic number, the paramagnetism",
        "options": [
            {"id": "a", "text": "increases gradually"},
            {"id": "b", "text": "decreases gradually"},
            {"id": "c", "text": "first increases to a maximum and then decreases"},
            {"id": "d", "text": "first decreases to a minimum and then increases."}
        ],
        "correctOption": "c",
        "explanation": "Paramagnetism depends directly on the number of unpaired electrons in the $d$-subshell. Moving across a transition series from group 3 to group 6/7 (e.g., $\\text{Sc}$ to $\\text{Cr}/\\text{Mn}$), the number of unpaired electrons increases from 1 to 5 (or 6), so paramagnetism increases to a maximum. Beyond the middle of the series, electrons pair up, decreasing the number of unpaired electrons to 0 at group 12 ($\\text{Zn}$). Thus, paramagnetism first increases to a maximum and then decreases."
    },
    {
        "id": "kcet-2014-chem-ch13-q20",
        "questionNumber": 20,
        "examYear": "2014",
        "question": "The IUPAC name of the complex ion formed when gold dissolves in aqua regia is",
        "options": [
            {"id": "a", "text": "tetrachloridoaurate (III)"},
            {"id": "b", "text": "tetrachloridoaurate (I)"},
            {"id": "c", "text": "tetrachloridoaurate (II)"},
            {"id": "d", "text": "dichloridoaurate (III)."}
        ],
        "correctOption": "a",
        "explanation": "Aqua regia ($3\\text{HCl} : 1\\text{HNO}_3$) dissolves noble metals like gold according to the reaction:\n$$\\text{Au} + 4\\text{H}^+ + \\text{NO}_3^- + 4\\text{Cl}^- \\rightarrow [\\text{AuCl}_4]^- + \\text{NO} + 2\\text{H}_2\\text{O}$$\nIn the complex anion $[\\text{AuCl}_4]^-$, oxidation state of $\\text{Au}$ is $x + 4(-1) = -1 \\implies x = +3$.\nThe IUPAC name of $[\\text{AuCl}_4]^-$ is tetrachloridoaurate(III)."
    },
    {
        "id": "kcet-2014-chem-ch13-q21",
        "questionNumber": 21,
        "examYear": "2014",
        "question": "Which one of these is not known?",
        "options": [
            {"id": "a", "text": "CuCl2"},
            {"id": "b", "text": "CuI2"},
            {"id": "c", "text": "CuF2"},
            {"id": "d", "text": "CuBr2"}
        ],
        "correctOption": "b",
        "explanation": "Cupric iodide ($\\text{CuI}_2$) is not known because $\\text{Cu}^{2+}$ easily oxidises $\\text{I}^-$ to iodine ($\\text{I}_2$) and is itself reduced to $\\text{Cu}^+$:\n$$2\\text{Cu}^{2+} + 4\\text{I}^- \\rightarrow \\text{Cu}_2\\text{I}_2\\downarrow + \\text{I}_2$$\nHence, $\\text{CuI}_2$ does not exist under ordinary conditions."
    },
    {
        "id": "kcet-2014-chem-ch13-q22",
        "questionNumber": 22,
        "examYear": "2014",
        "question": "The correct statement is",
        "options": [
            {"id": "a", "text": "the earlier members of lanthanoid series resemble calcium in their chemical properties"},
            {"id": "b", "text": "the extent of actinoid contraction is almost the same as lanthanoid contraction"},
            {"id": "c", "text": "in general, lanthanoids and actinoids do not show variable oxidation states"},
            {"id": "d", "text": "Ce^4+ in aqueous solution is not known."}
        ],
        "correctOption": "a",
        "explanation": "The earlier members of the lanthanoid series are quite reactive and chemically resemble calcium (they react with water liberating $\\text{H}_2$, form basic oxides and hydroxides). \n- Statement (b) is wrong because actinoid contraction is greater than lanthanoid contraction due to poorer shielding by $5f$ electrons.\n- Statement (c) is wrong because both show variable oxidation states.\n- Statement (d) is wrong because $\\text{Ce}^{4+}$ is well known and stable in aqueous solutions as a strong oxidising agent."
    },
    {
        "id": "kcet-2015-chem-ch13-q23",
        "questionNumber": 23,
        "examYear": "2015",
        "question": "In the reaction sequence: MSO4 --(NH4OH)--> X(ppt) --(Excess NH4OH)--> Y(clear solution) --(H2S)--> Z(ppt). Here M and Z are",
        "options": [
            {"id": "a", "text": "Zn, ZnS"},
            {"id": "b", "text": "Al, Al2S3"},
            {"id": "c", "text": "Cu, ZnS"},
            {"id": "d", "text": "Fe, FeS"}
        ],
        "correctOption": "a",
        "explanation": "With $\\text{ZnSO}_4$:\n1. $\\text{ZnSO}_4 + 2\\text{NH}_4\\text{OH} \\rightarrow \\text{Zn(OH)}_2\\downarrow\\text{ (white ppt } X) + (\\text{NH}_4)_2\\text{SO}_4$\n2. In excess $\\text{NH}_4\\text{OH}$, $\\text{Zn(OH)}_2$ dissolves to form the soluble complex tetraamminezinc(II) hydroxide $[\\text{Zn(NH}_3)_4](\\text{OH})_2$ (clear solution $Y$).\n3. Passing $\\text{H}_2\\text{S}$ into this solution precipitates white zinc sulphide ($\\text{ZnS}$, ppt $Z$):\n$$[\\text{Zn(NH}_3)_4]^{2+} + \\text{H}_2\\text{S} \\rightarrow \\text{ZnS}\\downarrow + 2\\text{NH}_4^+ + 2\\text{NH}_3$$\nThus, $M = \\text{Zn}$ and $Z = \\text{ZnS}$."
    },
    {
        "id": "kcet-2015-chem-ch13-q24",
        "questionNumber": 24,
        "examYear": "2015",
        "question": "The electronic configuration of Gd^2+ is (at. no. of Gd is 64)",
        "options": [
            {"id": "a", "text": "[Xe] 4f^7"},
            {"id": "b", "text": "[Xe] 4f^7 5d^1"},
            {"id": "c", "text": "[Xe] 4f^8"},
            {"id": "d", "text": "[Xe] 4f^7 5d^1 6s^2"}
        ],
        "correctOption": "b",
        "explanation": "Gadolinium ($Z=64$) has the ground state electronic configuration:\n$$\\text{Gd}: [\\text{Xe}] 4f^7 5d^1 6s^2$$\nUpon forming $\\text{Gd}^{2+}$, the two $6s$ electrons are removed first:\n$$\\text{Gd}^{2+}: [\\text{Xe}] 4f^7 5d^1$$"
    },
    {
        "id": "kcet-2015-chem-ch13-q25",
        "questionNumber": 25,
        "examYear": "2015",
        "question": "On heating potassium permanganate, one of the following compound is not obtained",
        "options": [
            {"id": "a", "text": "MnO"},
            {"id": "b", "text": "K2MnO4"},
            {"id": "c", "text": "O2"},
            {"id": "d", "text": "MnO2"}
        ],
        "correctOption": "a",
        "explanation": "Thermal decomposition of potassium permanganate occurs at $513\\text{ K}$:\n$$2\\text{KMnO}_4 \\xrightarrow{\\Delta} \\text{K}_2\\text{MnO}_4 + \\text{MnO}_2 + \\text{O}_2$$\nThe products obtained are potassium manganate ($\\text{K}_2\\text{MnO}_4$), manganese dioxide ($\\text{MnO}_2$), and oxygen gas ($\\text{O}_2$). Manganese(II) oxide ($\\text{MnO}$) is NOT obtained."
    },
    {
        "id": "kcet-2016-chem-ch13-q26",
        "questionNumber": 26,
        "examYear": "2016",
        "question": "The bivalent metal ion having maximum paramagnetic behaviour among the first transition series elements is",
        "options": [
            {"id": "a", "text": "Mn^2+"},
            {"id": "b", "text": "Cu^2+"},
            {"id": "c", "text": "Sc^2+"},
            {"id": "d", "text": "Cu+"}
        ],
        "correctOption": "a",
        "explanation": "- $\\text{Mn}^{2+}$ ($3d^5$): 5 unpaired electrons (maximum among $3d$ divalent ions)\n- $\\text{Cu}^{2+}$ ($3d^9$): 1 unpaired electron\n- $\\text{Sc}^{2+}$ ($3d^1$): 1 unpaired electron\n- $\\text{Cu}^{+}$ ($3d^{10}$): 0 unpaired electrons\n\nThus, $\\text{Mn}^{2+}$ shows the maximum paramagnetic behaviour."
    },
    {
        "id": "kcet-2016-chem-ch13-q27",
        "questionNumber": 27,
        "examYear": "2016",
        "question": "When a brown compound of Mn (A) is treated with HCl, it gives a gas (B). The gas (B) taken in excess reacts with NH3 to give an explosive compound (C). The compounds A, B and C are",
        "options": [
            {"id": "a", "text": "A = MnO2, B = Cl2, C = NCl3"},
            {"id": "b", "text": "A = MnO, B = Cl2, C = NH3Cl"},
            {"id": "c", "text": "A = Mn3O4, B = Cl2, C = NCl3"},
            {"id": "d", "text": "A = MnO3, B = Cl2, C = NCl2"}
        ],
        "correctOption": "a",
        "explanation": "1. Manganese dioxide ($\\text{MnO}_2$, brown solid $A$) reacts with concentrated $\\text{HCl}$ to liberate chlorine gas ($B$):\n$$\\text{MnO}_2 + 4\\text{HCl} \\rightarrow \\text{MnCl}_2 + \\text{Cl}_2\\uparrow (B) + 2\\text{H}_2\\text{O}$$\n2. When excess chlorine gas reacts with ammonia ($\\text{NH}_3$), it forms nitrogen trichloride ($\\text{NCl}_3$, explosive yellow liquid $C$):\n$$\\text{NH}_3 + 3\\text{Cl}_2\\text{ (excess)} \\rightarrow \\text{NCl}_3 (C) + 3\\text{HCl}$$\nTherefore, $A = \\text{MnO}_2$, $B = \\text{Cl}_2$, $C = \\text{NCl}_3$."
    },
    {
        "id": "kcet-2016-chem-ch13-q28",
        "questionNumber": 28,
        "examYear": "2016",
        "question": "Mn^2+ compounds are more stable than Fe^2+ compounds towards oxidation to their +3 state, because",
        "options": [
            {"id": "a", "text": "Mn^2+ is more stable with high 3rd ionisation energy"},
            {"id": "b", "text": "Mn^2+ is bigger in size"},
            {"id": "c", "text": "Mn^2+ has completely filled d-orbitals"},
            {"id": "d", "text": "Mn^2+ does not exist."}
        ],
        "correctOption": "a",
        "explanation": "$\\text{Mn}^{2+}$ has a stable half-filled $d^5$ configuration ($[\\text{Ar}]3d^5$), which imparts extra exchange energy and stability. Therefore, removing a third electron requires very high third ionisation energy ($I_3$). \nIn contrast, $\\text{Fe}^{2+}$ has a $3d^6$ configuration; losing one electron gives the stable half-filled $3d^5$ configuration of $\\text{Fe}^{3+}$. Thus, $\\text{Fe}^{2+}$ is easily oxidised to $\\text{Fe}^{3+}$, whereas $\\text{Mn}^{2+}$ resists oxidation to $\\text{Mn}^{3+}$."
    },
    {
        "id": "kcet-2017-chem-ch13-q29",
        "questionNumber": 29,
        "examYear": "2017",
        "question": "Which of the following statements is wrong regarding lanthanoids?",
        "options": [
            {"id": "a", "text": "Ln(III) compounds are predominantly ionic in character."},
            {"id": "b", "text": "Ln(III) hydroxides are mainly basic in nature."},
            {"id": "c", "text": "The ionic size of Ln(III) ions decreases with increasing atomic number."},
            {"id": "d", "text": "Ln(III) compounds are generally colourless."}
        ],
        "correctOption": "d",
        "explanation": "Many trivalent lanthanoid ions ($\\text{Ln}^{3+}$) are coloured in both solid state and aqueous solutions due to $f$-$f$ electronic transitions (e.g., $\\text{Pr}^{3+}$ is green, $\\text{Nd}^{3+}$ is pink/violet, $\\text{Sm}^{3+}$ is yellow). Only ions with $4f^0$ ($\\text{La}^{3+}$), $4f^7$ ($\\text{Gd}^{3+}$), or $4f^{14}$ ($\\text{Lu}^{3+}$) are colourless. Thus, the statement that $\\text{Ln(III)}$ compounds are generally colourless is incorrect."
    },
    {
        "id": "kcet-2018-chem-ch13-q30",
        "questionNumber": 30,
        "examYear": "2018",
        "question": "Which of the following is an amphoteric oxide?",
        "options": [
            {"id": "a", "text": "V2O5, Cr2O3"},
            {"id": "b", "text": "Mn2O7, Cr2O3"},
            {"id": "c", "text": "CrO, V2O5"},
            {"id": "d", "text": "V2O5, V2O4"}
        ],
        "correctOption": "a",
        "explanation": "Among transition metal oxides:\n- $\\text{V}_2\\text{O}_5$ and $\\text{Cr}_2\\text{O}_3$ are amphoteric (they dissolve in both acids and alkalis).\n- $\\text{Mn}_2\\text{O}_7$ is acidic.\n- $\\text{CrO}$ is basic.\n- $\\text{V}_2\\text{O}_4$ is amphoteric but mostly dissolves in acids to give $\\text{VO}^{2+}$.\nThus, both $\\text{V}_2\\text{O}_5$ and $\\text{Cr}_2\\text{O}_3$ are well-known amphoteric oxides."
    },
    {
        "id": "kcet-2018-chem-ch13-q31",
        "questionNumber": 31,
        "examYear": "2018",
        "question": "Which of the following oxidation states is common for all lanthanides?",
        "options": [
            {"id": "a", "text": "+2"},
            {"id": "b", "text": "+3"},
            {"id": "c", "text": "+4"},
            {"id": "d", "text": "+5"}
        ],
        "correctOption": "b",
        "explanation": "The principal and most stable oxidation state exhibited by all lanthanoids is $+3$. Although $+2$ and $+4$ oxidation states are occasionally shown by some elements (due to extra stability of $f^0, f^7, f^{14}$ configurations), $+3$ is universally common to all."
    },
    {
        "id": "kcet-2018-chem-ch13-q32",
        "questionNumber": 32,
        "examYear": "2018",
        "question": "The electronic configuration of transition element X, is +3, oxidation state is [Ar]3d^5. What is its atomic number?",
        "options": [
            {"id": "a", "text": "25"},
            {"id": "b", "text": "26"},
            {"id": "c", "text": "27"},
            {"id": "d", "text": "24"}
        ],
        "correctOption": "b",
        "explanation": "$\\text{X}^{3+}$ has the configuration $[\\text{Ar}]3d^5$.\nTo find the neutral element $\\text{X}$, we add back 3 electrons (two to $4s$ and one to $3d$):\n$$\\text{X}: [\\text{Ar}]3d^6 4s^2$$\nTotal number of electrons (atomic number $Z$) $= 18 + 6 + 2 = 26$ (Iron, $\\text{Fe}$)."
    },
    {
        "id": "kcet-2018-chem-ch13-q33",
        "questionNumber": 33,
        "examYear": "2018",
        "question": "KMnO4 acts as an oxidising agent in alkaline medium. When alkaline KMnO4 is treated with KI, iodide ion is oxidised to",
        "options": [
            {"id": "a", "text": "I2"},
            {"id": "b", "text": "IO^-"},
            {"id": "c", "text": "IO3^-"},
            {"id": "d", "text": "IO4^-"}
        ],
        "correctOption": "c",
        "explanation": "In faintly alkaline or neutral solution, $\\text{KMnO}_4$ oxidises iodide ($\\text{I}^-$) to iodate ($\\text{IO}_3^-$):\n$$2\\text{MnO}_4^- + \\text{H}_2\\text{O} + \\text{I}^- \\rightarrow 2\\text{MnO}_2 + 2\\text{OH}^- + \\text{IO}_3^-$$\n(In contrast, in acidic medium, iodide is oxidised to iodine, $\\text{I}_2$)."
    },
    {
        "id": "kcet-2019-chem-ch13-q34",
        "questionNumber": 34,
        "examYear": "2019",
        "question": "The elements in which electrons are progressively filled in 4f orbital are called",
        "options": [
            {"id": "a", "text": "actinoids"},
            {"id": "b", "text": "transition elements"},
            {"id": "c", "text": "lanthanoids"},
            {"id": "d", "text": "halogens."}
        ],
        "correctOption": "c",
        "explanation": "The elements in which the differentiating electrons enter the $4f$ subshell ($Z = 58$ to $71$, Cerium to Lutetium) are called lanthanoids (or lanthanides / $4f$ inner-transition elements). Actinoids correspond to filling of the $5f$ subshell."
    },
    {
        "id": "kcet-2019-chem-ch13-q35",
        "questionNumber": 35,
        "examYear": "2019",
        "question": "Incorrect statement with reference to Ce (Z = 58).",
        "options": [
            {"id": "a", "text": "Ce^4+ is a reducing agent."},
            {"id": "b", "text": "Ce in +3 oxidation state is more stable than in +4."},
            {"id": "c", "text": "Atomic size of Ce is more than that of Lu."},
            {"id": "d", "text": "Ce shows common oxidation states of +3 and +4."}
        ],
        "correctOption": "a",
        "explanation": "$\\text{Ce}^{4+}$ has the noble gas configuration $[\\text{Xe}]$, but $+3$ is the most stable oxidation state for all lanthanoids. Therefore, $\\text{Ce}^{4+}$ readily accepts an electron to revert to $\\text{Ce}^{3+}$, making $\\text{Ce}^{4+}$ a powerful oxidising agent (not a reducing agent). Thus, statement (a) is incorrect."
    },
    {
        "id": "kcet-2019-chem-ch13-q36",
        "questionNumber": 36,
        "examYear": "2019",
        "question": "A mixture of NaCl and K2Cr2O7 is heated with conc. H2SO4, deep red vapours are formed. Which of the following statements is false?",
        "options": [
            {"id": "a", "text": "The vapours give a yellow solution with NaOH."},
            {"id": "b", "text": "The vapours contain CrO2Cl2 only."},
            {"id": "c", "text": "The vapours contains CrO2Cl2 and Cl2."},
            {"id": "d", "text": "The vapours when passed into lead acetate in acetic acid gives a yellow precipitate."}
        ],
        "correctOption": "c",
        "explanation": "When solid $\\text{NaCl}$ and $\\text{K}_2\\text{Cr}_2\\text{O}_7$ are heated with conc. $\\text{H}_2\\text{SO}_4$, only chromyl chloride ($\\text{CrO}_2\\text{Cl}_2$) deep red vapours are produced:\n$$\\text{K}_2\\text{Cr}_2\\text{O}_7 + 4\\text{NaCl} + 6\\text{H}_2\\text{SO}_4 \\rightarrow 2\\text{CrO}_2\\text{Cl}_2\\uparrow + 2\\text{KHSO}_4 + 4\\text{NaHSO}_4 + 3\\text{H}_2\\text{O}$$\nNo free chlorine gas ($\\text{Cl}_2$) is formed. Thus, statement (c) is false."
    },
    {
        "id": "kcet-2019-chem-ch13-q37",
        "questionNumber": 37,
        "examYear": "2019",
        "question": "Which of the following statements is wrong?",
        "options": [
            {"id": "a", "text": "In highest oxidation states, the transition metals show acidic character."},
            {"id": "b", "text": "Mn^3+ and Co^3+ are oxidising agents in aqueous solution."},
            {"id": "c", "text": "Metals in highest oxidation states are more stable in oxides than in fluorides."},
            {"id": "d", "text": "All elements of 3d series exhibit variable oxidation states."}
        ],
        "correctOption": "d",
        "explanation": "Scandium ($\\text{Sc}$, $Z=21$) exhibits only a single oxidation state, $+3$, and Zinc ($\\text{Zn}$, $Z=30$) exhibits only $+2$. Therefore, not all elements of the $3d$ series exhibit variable oxidation states. Statement (d) is incorrect."
    },
    {
        "id": "kcet-2020-chem-ch13-q38",
        "questionNumber": 38,
        "examYear": "2020",
        "question": "Aqueous solution of a salt (A) forms a dense white precipitate with BaCl2 solution. The precipitate dissolves in dilute HCl to produce a gas (B) which decolourises acidified KMnO4 solution. A and B respectively are",
        "options": [
            {"id": "a", "text": "BaSO4, H2S"},
            {"id": "b", "text": "BaSO3, H2S"},
            {"id": "c", "text": "BaSO4, SO2"},
            {"id": "d", "text": "BaSO3, SO2"}
        ],
        "correctOption": "d",
        "explanation": "1. Sodium sulphite solution ($\\text{Na}_2\\text{SO}_3$, source of sulphite) reacts with $\\text{BaCl}_2$ to give a white precipitate of $\\text{BaSO}_3$:\n$$\\text{SO}_3^{2-} + \\text{Ba}^{2+} \\rightarrow \\text{BaSO}_3\\downarrow\\text{ (white ppt)}$$\n2. $\\text{BaSO}_3$ dissolves in dilute $\\text{HCl}$ to produce sulphur dioxide gas ($\\text{SO}_2$, gas $B$):\n$$\\text{BaSO}_3 + 2\\text{HCl} \\rightarrow \\text{BaCl}_2 + \\text{SO}_2\\uparrow + \\text{H}_2\\text{O}$$\n3. $\\text{SO}_2$ is a reducing agent that decolourises pink acidified $\\text{KMnO}_4$ solution:\n$$5\\text{SO}_2 + 2\\text{MnO}_4^- + 2\\text{H}_2\\text{O} \\rightarrow 5\\text{SO}_4^{2-} + 2\\text{Mn}^{2+}\\text{ (colourless)} + 4\\text{H}^+$$\nThus, the precipitate is $\\text{BaSO}_3$ and the gas is $\\text{SO}_2$."
    },
    {
        "id": "kcet-2020-chem-ch13-q39",
        "questionNumber": 39,
        "examYear": "2020",
        "question": "Identify the set of paramagnetic ions among the following :",
        "options": [
            {"id": "a", "text": "Ni^2+, Cu^2+, Zn^2+"},
            {"id": "b", "text": "Ti^3+, Cu^2+, Mn^3+"},
            {"id": "c", "text": "Sc^3+, Ti^3+, V^3+"},
            {"id": "d", "text": "V^2+, Co^2+, Ti^4+"}
        ],
        "correctOption": "b",
        "explanation": "Let's check each ion:\n- $\\text{Ti}^{3+}: 3d^1 \\rightarrow 1$ unpaired electron (paramagnetic)\n- $\\text{Cu}^{2+}: 3d^9 \\rightarrow 1$ unpaired electron (paramagnetic)\n- $\\text{Mn}^{3+}: 3d^4 \\rightarrow 4$ unpaired electrons (paramagnetic)\n\nIn the other options:\n- $\\text{Zn}^{2+}$ is $3d^{10}$ (diamagnetic, $n=0$)\n- $\\text{Sc}^{3+}$ is $3d^0$ (diamagnetic, $n=0$)\n- $\\text{Ti}^{4+}$ is $3d^0$ (diamagnetic, $n=0$)\n\nTherefore, set (b) contains only paramagnetic ions."
    },
    {
        "id": "kcet-2020-chem-ch13-q40",
        "questionNumber": 40,
        "examYear": "2020",
        "question": "How many moles of acidified K2Cr2O7 are required to liberate 6 moles of I2 from an aqueous solution of I-?",
        "options": [
            {"id": "a", "text": "1"},
            {"id": "b", "text": "0.25"},
            {"id": "c", "text": "0.5"},
            {"id": "d", "text": "2"}
        ],
        "correctOption": "d",
        "explanation": "The balanced redox reaction between acidified $\\text{K}_2\\text{Cr}_2\\text{O}_7$ and $\\text{I}^-$ is:\n$$\\text{Cr}_2\\text{O}_7^{2-} + 14\\text{H}^+ + 6\\text{I}^- \\rightarrow 2\\text{Cr}^{3+} + 3\\text{I}_2 + 7\\text{H}_2\\text{O}$$\nFrom stoichiometry:\n$1\\text{ mol of } \\text{K}_2\\text{Cr}_2\\text{O}_7$ produces $3\\text{ moles of } \\text{I}_2$.\nTo liberate $6\\text{ moles of } \\text{I}_2$:\n$$\\text{Moles of } \\text{K}_2\\text{Cr}_2\\text{O}_7 = \\frac{6}{3} = 2\\text{ moles}$$"
    },
    {
        "id": "kcet-2020-chem-ch13-q41",
        "questionNumber": 41,
        "examYear": "2020",
        "question": "Cu2Cl2 and CuCl2 in aqueous medium",
        "options": [
            {"id": "a", "text": "stability of Cu2Cl2 is equal to stability of CuCl2"},
            {"id": "b", "text": "both are unstable"},
            {"id": "c", "text": "Cu2Cl2 is more stable than CuCl2"},
            {"id": "d", "text": "CuCl2 is more stable than Cu2Cl2."}
        ],
        "correctOption": "d",
        "explanation": "In aqueous solution, $\\text{Cu}^{2+}$ ($\\,\\text{CuCl}_2$) is much more stable than $\\text{Cu}^{+}$ ($\\text{Cu}_2\\text{Cl}_2$). This is because the much higher (more negative) hydration enthalpy of $\\text{Cu}^{2+}_{(\\text{aq})}$ compensates for the second ionisation enthalpy of copper, causing $\\text{Cu}^+$ to disproportionate:\n$$2\\text{Cu}^+_{(\\text{aq})} \\rightarrow \\text{Cu}^{2+}_{(\\text{aq})} + \\text{Cu}_{(\\text{s})}$$\nHence, $\\text{CuCl}_2$ is more stable than $\\text{Cu}_2\\text{Cl}_2$ in aqueous medium."
    },
    {
        "id": "kcet-2020-chem-ch13-q42",
        "questionNumber": 42,
        "examYear": "2020",
        "question": "Which of the following does not represent property stated against it?",
        "options": [
            {"id": "a", "text": "Co^2+ < Fe^2+ < Mn^2+ - Ionic size"},
            {"id": "b", "text": "Ti < V < Mn - Number of oxidation states"},
            {"id": "c", "text": "Cr^2+ < Mn^2+ < Fe^2+ - Paramagnetic behaviour"},
            {"id": "d", "text": "Sc > Cr > Fe - Density"}
        ],
        "correctOption": "c",
        "explanation": "- For (c): Number of unpaired electrons are $\\text{Cr}^{2+} (3d^4, n=4)$, $\\text{Mn}^{2+} (3d^5, n=5)$, $\\text{Fe}^{2+} (3d^6, n=4)$. Thus, paramagnetism order is $\\text{Fe}^{2+} = \\text{Cr}^{2+} < \\text{Mn}^{2+}$, which contradicts (c).\n- For (d): Across the $3d$ series, density increases from $\\text{Sc}$ to $\\text{Cu}$ ($\\,\\text{Sc} < \\text{Cr} < \\text{Fe}$), so $\\text{Sc} > \\text{Cr} > \\text{Fe}$ is also false.\n(Both options (c) and (d) do not represent the correct property trend)."
    },
    {
        "id": "kcet-2020-chem-ch13-q43",
        "questionNumber": 43,
        "examYear": "2020",
        "question": "Which one of the following is correct for the elements from Sc to Cu?",
        "options": [
            {"id": "a", "text": "The lowest oxidation state shown by them is +2."},
            {"id": "b", "text": "4s orbital is completely filled in ground state."},
            {"id": "c", "text": "3d orbital is not completely filled in ground state."},
            {"id": "d", "text": "The ions in +2 oxidation states are paramagnetic."}
        ],
        "correctOption": "d",
        "explanation": "- (a) is incorrect because Copper shows $+1$ oxidation state ($\\text{Cu}_2\\text{O}, \\text{CuCl}$).\n- (b) is incorrect because $\\text{Cr}$ ($4s^1$) and $\\text{Cu}$ ($4s^1$) do not have a completely filled $4s$ orbital.\n- (c) is incorrect because $\\text{Cu}$ has a completely filled $3d^{10}$ subshell in its ground state.\n- (d) is correct because all $M^{2+}$ ions from $\\text{Sc}^{2+}$ ($3d^1$) through $\\text{Cu}^{2+}$ ($3d^9$) have partially filled $d$-orbitals with unpaired electrons, so they are all paramagnetic."
    },
    {
        "id": "kcet-2021-chem-ch13-q44",
        "questionNumber": 44,
        "examYear": "2021",
        "question": "Which of the following pairs has both the ions coloured in aqueous solution? [Atomic number of Sc = 21, Ti = 22, Ni = 28, Cu = 29, Mn = 25]",
        "options": [
            {"id": "a", "text": "Sc^3+, Mn^2+"},
            {"id": "b", "text": "Ni^2+, Ti^4+"},
            {"id": "c", "text": "Ti^3+, Cu+"},
            {"id": "d", "text": "Mn^2+, Ti^3+"}
        ],
        "correctOption": "d",
        "explanation": "A transition metal ion is coloured if it possesses partially filled $d$-orbitals ($d^1$ to $d^9$) to undergo $d$-$d$ transition:\n- $\\text{Sc}^{3+}: 3d^0$ (colourless)\n- $\\text{Ti}^{4+}: 3d^0$ (colourless)\n- $\\text{Cu}^{+}: 3d^{10}$ (colourless)\n- $\\text{Mn}^{2+}: 3d^5$ (pale pink) and $\\text{Ti}^{3+}: 3d^1$ (purple/violet)\n\nBoth $\\text{Mn}^{2+}$ and $\\text{Ti}^{3+}$ contain unpaired $d$-electrons and form coloured solutions."
    },
    {
        "id": "kcet-2022-chem-ch13-q45",
        "questionNumber": 45,
        "examYear": "2022",
        "question": "A transition metal exists in its highest oxidation state. It is expected to behave as",
        "options": [
            {"id": "a", "text": "an oxidising agent"},
            {"id": "b", "text": "a reducing agent"},
            {"id": "c", "text": "a chelating agent"},
            {"id": "d", "text": "a central metal in a co-ordination compound."}
        ],
        "correctOption": "a",
        "explanation": "When a transition metal exists in its maximum/highest possible oxidation state, it has no more valence electrons to lose; it can only accept electrons and undergo reduction. Therefore, it functions as an oxidising agent."
    },
    {
        "id": "kcet-2022-chem-ch13-q46",
        "questionNumber": 46,
        "examYear": "2022",
        "question": "What will be the value of x in Fe^x+, if the magnetic moment, μ = √24 B.M. ?",
        "options": [
            {"id": "a", "text": "0"},
            {"id": "b", "text": "+1"},
            {"id": "c", "text": "+2"},
            {"id": "d", "text": "+3"}
        ],
        "correctOption": "c",
        "explanation": "Given $\\mu = \\sqrt{24}\\text{ B.M.}$\n$$\\sqrt{n(n+2)} = \\sqrt{24} \\implies n(n+2) = 24 \\implies n = 4$$\nNumber of unpaired electrons $n = 4$.\nNeutral Iron ($Z=26$) has configuration $[\\text{Ar}]3d^6 4s^2$.\n- $\\text{Fe}^{2+}: [\\text{Ar}]3d^6 4s^0 \\rightarrow 4$ unpaired electrons ($n=4$).\n- $\\text{Fe}^{3+}: [\\text{Ar}]3d^5 4s^0 \\rightarrow 5$ unpaired electrons ($n=5$).\n\nThus, $x = +2$."
    },
    {
        "id": "kcet-2022-chem-ch13-q47",
        "questionNumber": 47,
        "examYear": "2022",
        "question": "The only lanthanoid which is radioactive",
        "options": [
            {"id": "a", "text": "promethium"},
            {"id": "b", "text": "praseodymium"},
            {"id": "c", "text": "lanthanum"},
            {"id": "d", "text": "cerium."}
        ],
        "correctOption": "a",
        "explanation": "Promethium ($\\text{Pm}$, $Z=61$) is the only strictly synthetic and radioactive member among all the 14 lanthanoid elements."
    },
    {
        "id": "kcet-2022-chem-ch13-q48",
        "questionNumber": 48,
        "examYear": "2022",
        "question": "All Cu(II) halides are known, except iodide, the reason for it is that",
        "options": [
            {"id": "a", "text": "Cu^2+ has much more negative hydration enthalpy"},
            {"id": "b", "text": "Cu^2+ ion has smaller size"},
            {"id": "c", "text": "iodide is bulky ion"},
            {"id": "d", "text": "Cu^2+ oxidises iodide to iodine."}
        ],
        "correctOption": "d",
        "explanation": "$\\text{Cu}^{2+}$ oxidises iodide ion ($\\text{I}^-$) to iodine ($\\text{I}_2$) spontaneously:\n$$2\\text{Cu}^{2+} + 4\\text{I}^- \\rightarrow \\text{Cu}_2\\text{I}_2\\downarrow + \\text{I}_2$$\nHence, cupric iodide ($\\text{CuI}_2$) cannot be formed."
    },
    {
        "id": "kcet-2023-chem-ch13-q49",
        "questionNumber": 49,
        "examYear": "2023",
        "question": "In which one of the following pairs, both the elements does not have (n-1)d^10 ns^2 configuration in its elementary state?",
        "options": [
            {"id": "a", "text": "Zn, Cd"},
            {"id": "b", "text": "Cd, Hg"},
            {"id": "c", "text": "Hg, Cn"},
            {"id": "d", "text": "Cu, Zn"}
        ],
        "correctOption": "d",
        "explanation": "- $\\text{Zn}: [\\text{Ar}]3d^{10} 4s^2$\n- $\\text{Cd}: [\\text{Kr}]4d^{10} 5s^2$\n- $\\text{Hg}: [\\text{Xe}]4f^{14} 5d^{10} 6s^2$\n- $\\text{Cn}: [\\text{Rn}]5f^{14} 6d^{10} 7s^2$\n- $\\text{Cu}: [\\text{Ar}]3d^{10} 4s^1$ (it has $(n-1)d^{10} ns^1$, not $ns^2$)\n\nIn pair (d), Copper ($\\text{Cu}$) has $3d^{10} 4s^1$, so the pair does not both have $(n-1)d^{10} ns^2$ configuration."
    },
    {
        "id": "kcet-2023-chem-ch13-q50",
        "questionNumber": 50,
        "examYear": "2023",
        "question": "Which of the following is correct with respect to melting point of a transition element?",
        "options": [
            {"id": "a", "text": "V > Cr"},
            {"id": "b", "text": "Cr > Mn"},
            {"id": "c", "text": "Mn > Fe"},
            {"id": "d", "text": "Ti > V"}
        ],
        "correctOption": "b",
        "explanation": "Manganese has an abnormally low melting point ($1519\\text{ K}$) compared to its neighbours chromium ($2180\\text{ K}$) and iron ($1811\\text{ K}$). This anomaly is due to its stable half-filled $3d^5$ configuration, which holds electrons tightly and results in weaker interatomic metallic bonding. Hence, melting point of $\\text{Cr} > \\text{Mn}$."
    },
    {
        "id": "kcet-2023-chem-ch13-q51",
        "questionNumber": 51,
        "examYear": "2023",
        "question": "aMnO4^- + bS2O3^2- + H2O -> xMnO2 + ySO4^2- + zOH^-. a and y respectively are",
        "options": [
            {"id": "a", "text": "8; 3"},
            {"id": "b", "text": "8; 6"},
            {"id": "c", "text": "3; 6"},
            {"id": "d", "text": "8; 8"}
        ],
        "correctOption": "b",
        "explanation": "Balancing the redox reaction in basic/neutral medium:\n1. Reduction half-reaction: $[\\text{MnO}_4^- + 2\\text{H}_2\\text{O} + 3e^- \\rightarrow \\text{MnO}_2 + 4\\text{OH}^-] \\times 8$\n2. Oxidation half-reaction: $[\\text{S}_2\\text{O}_3^{2-} + 10\\text{OH}^- \\rightarrow 2\\text{SO}_4^{2-} + 5\\text{H}_2\\text{O} + 8e^-] \\times 3$\n\nCombining both gives:\n$$8\\text{MnO}_4^- + 3\\text{S}_2\\text{O}_3^{2-} + \\text{H}_2\\text{O} \\rightarrow 8\\text{MnO}_2 + 6\\text{SO}_4^{2-} + 2\\text{OH}^-$$\nComparing with $a\\text{MnO}_4^- + b\\text{S}_2\\text{O}_3^{2-} + \\text{H}_2\\text{O} \\rightarrow x\\text{MnO}_2 + y\\text{SO}_4^{2-} + z\\text{OH}^-$:\n$a = 8, b = 3, x = 8, y = 6, z = 2$.\nTherefore, $a = 8$ and $y = 6$."
    },
    {
        "id": "kcet-2024-chem-ch13-q52",
        "questionNumber": 52,
        "examYear": "2024",
        "question": "Match the following.\nI. Zn^2+\nII. Cu^2+\nIII. Ni^2+\ni. d^8 configuration\nii. colourless\niii. μ = 1.73 B.M.\nCodes:\n    I    II    III",
        "options": [
            {"id": "a", "text": "i    ii    iii"},
            {"id": "b", "text": "ii   iii   i"},
            {"id": "c", "text": "ii   i     iii"},
            {"id": "d", "text": "i    iii   ii"}
        ],
        "correctOption": "b",
        "explanation": "- $\\text{I. Zn}^{2+}: [\\text{Ar}]3d^{10}$ has completely filled $d$-orbitals with 0 unpaired electrons $\\rightarrow$ colourless (ii)\n- $\\text{II. Cu}^{2+}: [\\text{Ar}]3d^9$ has 1 unpaired electron $\\rightarrow \\mu = \\sqrt{1(3)} = 1.73\\text{ B.M.}$ (iii)\n- $\\text{III. Ni}^{2+}: [\\text{Ar}]3d^8$ has $d^8$ configuration (i)\n\nHence, $\\text{I} \\rightarrow \\text{ii},\\; \\text{II} \\rightarrow \\text{iii},\\; \\text{III} \\rightarrow \\text{i}$ (Option b)."
    },
    {
        "id": "kcet-2024-chem-ch13-q53",
        "questionNumber": 53,
        "examYear": "2024",
        "question": "Which of the following statements related to lanthanoids is incorrect?",
        "options": [
            {"id": "a", "text": "Lanthanoids are silvery white soft metals."},
            {"id": "b", "text": "Samarium shows +2 oxidation state."},
            {"id": "c", "text": "Ce^+4 solutions are widely used as oxidising agents in titrimetric analysis."},
            {"id": "d", "text": "Colour of lanthanoid ion in solution is due to d-d transition."}
        ],
        "correctOption": "d",
        "explanation": "The colour of lanthanoid ions in aqueous solutions or solid salts arises from absorption of visible light due to $f$-$f$ electronic transitions within the $4f$ subshell, NOT $d$-$d$ transitions. Therefore, statement (d) is incorrect."
    },
    {
        "id": "kcet-2024-chem-ch13-q54",
        "questionNumber": 54,
        "examYear": "2024",
        "question": "The transition element (≈5%) present with lanthanoid metal in Misch metal is",
        "options": [
            {"id": "a", "text": "Mg"},
            {"id": "b", "text": "Fe"},
            {"id": "c", "text": "Zn"},
            {"id": "d", "text": "Co"}
        ],
        "correctOption": "b",
        "explanation": "Mischmetall is a well-known pyrophoric alloy containing approximately $95\\%$ lanthanoid metals (primarily Cerium $\\sim 50\\%$, Lanthanum $\\sim 25\\%$, Neodymium), $\\approx 5\\%$ Iron ($\\text{Fe}$), and traces of $\\text{S, C, Ca, Al}$."
    },
    {
        "id": "kcet-2024-chem-ch13-q55",
        "questionNumber": 55,
        "examYear": "2024",
        "question": "In the reaction between moist SO2 and acidified permanganate solution",
        "options": [
            {"id": "a", "text": "SO2 is oxidised to SO4^2-, MnO4^- is reduced to Mn^2+"},
            {"id": "b", "text": "SO2 is reduced to S, MnO4^- is oxidised to MnO4"},
            {"id": "c", "text": "SO2 is oxidised to SO3^2-, MnO4^- is reduced to MnO2"},
            {"id": "d", "text": "SO2 is reduced to H2S, MnO4^- is oxidised to MnO4"}
        ],
        "correctOption": "a",
        "explanation": "In acidic solution, permanganate ion ($\\text{MnO}_4^-$) is a powerful oxidising agent. It oxidises $\\text{SO}_2$ (where $\\text{S}$ is in $+4$ oxidation state) to sulphate ion $\\text{SO}_4^{2-}$ (oxidation state $+6$), while $\\text{MnO}_4^-$ (where $\\text{Mn}$ is in $+7$ state) is reduced to $\\text{Mn}^{2+}$ (oxidation state $+2$):\n$$5\\text{SO}_2 + 2\\text{MnO}_4^- + 2\\text{H}_2\\text{O} \\rightarrow 5\\text{SO}_4^{2-} + 2\\text{Mn}^{2+} + 4\\text{H}^+$$"
    }
]

formatted_questions = []
letter_to_idx = {'a': 0, 'b': 1, 'c': 2, 'd': 3}

for i, q in enumerate(questions, 1):
    year_str = q.get("examYear", "2024")
    try:
        # if multiple years like "2006, 2007", take first or last
        year_val = int(year_str.split(',')[-1].strip())
    except:
        year_val = 2024

    formatted_questions.append({
        "id": f"chem_ch13_q{i}",
        "subject": "Chemistry",
        "chapter": "The d- and f-Block Elements",
        "chapter_number": 13,
        "questionNumber": i,
        "year": year_val,
        "question": q["question"],
        "options": [opt["text"] for opt in q["options"]],
        "correct_answer": letter_to_idx.get(q["correctOption"].lower(), 0),
        "explanation": q["explanation"],
        "needs_image": False,
        "image_url": ""
    })

with open('src/data/pyq_chemistry_ch13.json', 'w', encoding='utf-8') as f:
    json.dump(formatted_questions, f, indent=2, ensure_ascii=False)

print(f"Successfully generated src/data/pyq_chemistry_ch13.json with {len(formatted_questions)} questions.")

