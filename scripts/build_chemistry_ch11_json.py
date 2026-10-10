import json

questions = [
  {
    "id": "chem_ch11_q1",
    "subject": "Chemistry",
    "chapter": "Electrochemistry",
    "chapter_number": 11,
    "year": 2006,
    "question": "Which of the following does not conduct electricity?",
    "options": [
      "Fused NaCl",
      "Solid NaCl",
      "Brine solution",
      "Copper"
    ],
    "correct_answer": 1,
    "explanation": "Solid NaCl does not conduct electricity due to the absence of free mobile ions in its rigid crystal lattice. In contrast, fused (molten) NaCl and brine solution contain free mobile ions, and copper conducts electricity via delocalized metallic electrons.",
    "needs_image": False
  },
  {
    "id": "chem_ch11_q2",
    "subject": "Chemistry",
    "chapter": "Electrochemistry",
    "chapter_number": 11,
    "year": 2006,
    "question": "When a quantity of electricity is passed through $\\text{CuSO}_4$ solution, $0.16\\text{ g}$ of copper gets deposited. If the same quantity of electricity is passed through acidulated water, then the volume of $\\text{H}_2$ liberated at STP will be [given : at. wt. of $\\text{Cu} = 64$]",
    "options": [
      "4.0 cm³",
      "56 cm³",
      "604 cm³",
      "8.0 cm³"
    ],
    "correct_answer": 1,
    "explanation": "According to Faraday's second law of electrolysis:\n$$\\frac{\\text{wt. of Cu deposited}}{\\text{wt. of H}_2\\text{ produced}} = \\frac{\\text{eq. wt. of Cu}}{\\text{eq. wt. of H}}$$\n$$\\text{eq. wt. of Cu} = \\frac{64}{2} = 32, \\quad \\text{eq. wt. of H} = 1$$\n$$\\frac{0.16}{w_{\\text{H}_2}} = \\frac{32}{1} \\implies w_{\\text{H}_2} = \\frac{0.16}{32} = 5 \\times 10^{-3}\\text{ g}$$\nVolume of $\\text{H}_2$ liberated at STP:\n$$V = \\frac{22400\\text{ cc}}{2\\text{ g}} \\times 5 \\times 10^{-3}\\text{ g} = 56\\text{ cc} = 56\\text{ cm}^3$$",
    "needs_image": False
  },
  {
    "id": "chem_ch11_q3",
    "subject": "Chemistry",
    "chapter": "Electrochemistry",
    "chapter_number": 11,
    "year": 2008,
    "question": "Which of the following electrolytic solutions has the least specific conductance?",
    "options": [
      "2 N",
      "0.002 N",
      "0.02 N",
      "0.2 N"
    ],
    "correct_answer": 0,
    "explanation": "Specific conductance of an electrolytic solution depends on ion mobility and effective concentration. In highly concentrated solutions (such as 2 N), interionic attractions become very strong, significantly reducing ion mobility. Hence, the solution of concentration 2 N exhibits the least specific conductance among the options.",
    "needs_image": False
  },
  {
    "id": "chem_ch11_q4",
    "subject": "Chemistry",
    "chapter": "Electrochemistry",
    "chapter_number": 11,
    "year": 2009,
    "question": "The standard electrode potential for the half cell reactions are\n$$\\text{Zn}^{2+} + 2e^- \\longrightarrow \\text{Zn}; \\; E^\\circ = -0.76\\text{ V}$$\n$$\\text{Fe}^{2+} + 2e^- \\longrightarrow \\text{Fe}; \\; E^\\circ = -0.44\\text{ V}$$\nThe e.m.f. of the cell reaction $\\text{Fe}^{2+} + \\text{Zn} \\longrightarrow \\text{Zn}^{2+} + \\text{Fe}$ is",
    "options": [
      "-1.20 V",
      "+1.20 V",
      "+0.32 V",
      "-0.32 V"
    ],
    "correct_answer": 2,
    "explanation": "In the reaction $\\text{Fe}^{2+} + \\text{Zn} \\longrightarrow \\text{Zn}^{2+} + \\text{Fe}$:\n- Oxidation at anode: $\\text{Zn} \\to \\text{Zn}^{2+} + 2e^-\\quad (E^\\circ_{\\text{ox}} = +0.76\\text{ V})$\n- Reduction at cathode: $\\text{Fe}^{2+} + 2e^- \\to \\text{Fe}\\quad (E^\\circ_{\\text{red}} = -0.44\\text{ V})$\n$$E^\\circ_{\\text{cell}} = E^\\circ_{\\text{cathode}} - E^\\circ_{\\text{anode}} = -0.44\\text{ V} - (-0.76\\text{ V}) = +0.32\\text{ V}$$",
    "needs_image": False
  },
  {
    "id": "chem_ch11_q5",
    "subject": "Chemistry",
    "chapter": "Electrochemistry",
    "chapter_number": 11,
    "year": 2009,
    "question": "In the electrolysis of acidulated water, it is desired to obtain $1.12\\text{ cc}$ of hydrogen per second under S.T.P. condition. The current to be passed is",
    "options": [
      "9.65 A",
      "19.3 A",
      "0.965 A",
      "1.93 A"
    ],
    "correct_answer": 0,
    "explanation": "$$\\text{No. of moles of } \\text{H}_2 = \\frac{1.12}{22400}$$\n$$\\text{No. of equivalents of hydrogen} = \\frac{1.12 \\times 2}{22400} = 10^{-4}$$\n$$\\text{No. of Faradays required} = 10^{-4}\\text{ F}$$\n$$\\text{Current } I = \\frac{Q}{t} = \\frac{96500 \\times 10^{-4}\\text{ C}}{1\\text{ s}} = 9.65\\text{ A}$$",
    "needs_image": False
  },
  {
    "id": "chem_ch11_q6",
    "subject": "Chemistry",
    "chapter": "Electrochemistry",
    "chapter_number": 11,
    "year": 2009,
    "question": "The one which decreases with dilution is",
    "options": [
      "conductance",
      "specific conductance",
      "equivalent conductance",
      "molar conductance."
    ],
    "correct_answer": 1,
    "explanation": "Specific conductance (conductivity $\\kappa$) is the conductance of ions present in unit volume ($1\\text{ cm}^3$) of the electrolytic solution. On dilution, the number of current-carrying ions per unit volume decreases, and therefore specific conductance decreases. In contrast, conductance, equivalent conductance, and molar conductance all increase on dilution.",
    "needs_image": False
  },
  {
    "id": "chem_ch11_q7",
    "subject": "Chemistry",
    "chapter": "Electrochemistry",
    "chapter_number": 11,
    "year": 2010,
    "question": "$9.65\\text{ C}$ of electric current is passed through fused anhydrous magnesium chloride. The magnesium metal thus obtained is completely converted into a Grignard reagent. The number of moles of the Grignard reagent obtained is",
    "options": [
      "5 × 10⁻⁴",
      "1 × 10⁻⁴",
      "5 × 10⁻⁵",
      "1 × 10⁻⁵"
    ],
    "correct_answer": 2,
    "explanation": "$$w = Z \\times Q = \\frac{\\text{Eq. wt.}}{96500} \\times Q$$\nFor $\\text{Mg}^{2+} + 2e^- \\to \\text{Mg}$, equivalent weight $= \\frac{24}{2} = 12\\text{ g/eq}$.\n$$w = \\frac{12}{96500} \\times 9.65 = 1.2 \\times 10^{-3}\\text{ g}$$\n$$\\text{Moles of Mg} = \\frac{1.2 \\times 10^{-3}}{24} = 5 \\times 10^{-5}\\text{ moles}$$\nSince $1\\text{ mole of Mg}$ gives $1\\text{ mole of Grignard reagent } (\\text{RMgX})$, the moles of Grignard reagent obtained is $5 \\times 10^{-5}$.",
    "needs_image": False
  },
  {
    "id": "chem_ch11_q8",
    "subject": "Chemistry",
    "chapter": "Electrochemistry",
    "chapter_number": 11,
    "year": 2010,
    "question": "The standard emf of galvanic cell involving $3$ moles of electrons in its redox reaction is $0.59\\text{ V}$. The equilibrium constant for the reaction of the cell is",
    "options": [
      "10²⁵",
      "10²⁰",
      "10¹⁵",
      "10³⁰"
    ],
    "correct_answer": 3,
    "explanation": "$$E^\\circ_{\\text{cell}} = \\frac{0.0591}{n} \\log_{10} K$$\nGiven $n = 3$ and $E^\\circ_{\\text{cell}} = 0.59\\text{ V}$:\n$$\\log_{10} K = \\frac{3 \\times 0.59}{0.0591} \\approx 30$$\n$$K = 10^{30}$$",
    "needs_image": False
  },
  {
    "id": "chem_ch11_q9",
    "subject": "Chemistry",
    "chapter": "Electrochemistry",
    "chapter_number": 11,
    "year": 2010,
    "question": "$E_1, E_2$ and $E_3$ are the emfs of the following three galvanic cells respectively.\n(i) $\\text{Zn}_{(s)}|\\text{Zn}^{2+}(0.1\\text{ M})\\,||\\,\\text{Cu}^{2+}(1\\text{ M})|\\text{Cu}_{(s)}$\n(ii) $\\text{Zn}_{(s)}|\\text{Zn}^{2+}(1\\text{ M})\\,||\\,\\text{Cu}^{2+}(1\\text{ M})|\\text{Cu}_{(s)}$\n(iii) $\\text{Zn}_{(s)}|\\text{Zn}^{2+}(1\\text{ M})\\,||\\,\\text{Cu}^{2+}(0.1\\text{ M})|\\text{Cu}_{(s)}$\nWhich one of the following is true?",
    "options": [
      "E₂ > E₁ > E₃",
      "E₁ > E₂ > E₃",
      "E₃ > E₁ > E₂",
      "E₃ > E₂ > E₁"
    ],
    "correct_answer": 1,
    "explanation": "By Nernst equation for the cell reaction $\\text{Zn} + \\text{Cu}^{2+} \\rightleftharpoons \\text{Zn}^{2+} + \\text{Cu}$:\n$$E_{\\text{cell}} = E^\\circ_{\\text{cell}} - \\frac{0.0591}{2} \\log \\frac{[\\text{Zn}^{2+}]}{[\\text{Cu}^{2+}]}$$\n- For cell (i): $\\frac{[\\text{Zn}^{2+}]}{[\\text{Cu}^{2+}]} = \\frac{0.1}{1} = 10^{-1} \\implies E_1 = E^\\circ + \\frac{0.0591}{2}$\n- For cell (ii): $\\frac{[\\text{Zn}^{2+}]}{[\\text{Cu}^{2+}]} = \\frac{1}{1} = 1 \\implies E_2 = E^\\circ$\n- For cell (iii): $\\frac{[\\text{Zn}^{2+}]}{[\\text{Cu}^{2+}]} = \\frac{1}{0.1} = 10 \\implies E_3 = E^\\circ - \\frac{0.0591}{2}$\nTherefore, $E_1 > E_2 > E_3$.",
    "needs_image": False
  },
  {
    "id": "chem_ch11_q10",
    "subject": "Chemistry",
    "chapter": "Electrochemistry",
    "chapter_number": 11,
    "year": 2010,
    "question": "The standard emf of a galvanic cell involving $2$ moles of electrons in its redox reaction is $0.59\\text{ V}$. The equilibrium constant for the redox reaction of the cell is",
    "options": [
      "10²⁰",
      "10⁵",
      "10",
      "10¹⁰"
    ],
    "correct_answer": 0,
    "explanation": "$$E^\\circ_{\\text{cell}} = \\frac{0.059}{n} \\log K_c$$\nGiven $n = 2$ and $E^\\circ_{\\text{cell}} = 0.59\\text{ V}$:\n$$0.59 = \\frac{0.059}{2} \\log K_c \\implies \\log K_c = 20$$\n$$K_c = 10^{20}$$",
    "needs_image": False
  },
  {
    "id": "chem_ch11_q11",
    "subject": "Chemistry",
    "chapter": "Electrochemistry",
    "chapter_number": 11,
    "year": 2012,
    "question": "The approximate time duration in hours to electroplate $30\\text{ g}$ of calcium from molten calcium chloride using a current of $5\\text{ amp}$ is [At. mass of $\\text{Ca} = 40$]",
    "options": [
      "8",
      "80",
      "10",
      "16"
    ],
    "correct_answer": 0,
    "explanation": "$$w = \\frac{\\text{Eq. wt.}}{96500} \\times I \\times t$$\nFor $\\text{Ca}^{2+} + 2e^- \\to \\text{Ca}$, equivalent weight $= \\frac{40}{2} = 20\\text{ g/eq}$.\n$$30 = \\frac{20}{96500} \\times 5 \\times t \\implies t = \\frac{30 \\times 96500}{100} = 28950\\text{ s}$$\n$$t = \\frac{28950}{3600} \\approx 8\\text{ hours}$$",
    "needs_image": False
  },
  {
    "id": "chem_ch11_q12",
    "subject": "Chemistry",
    "chapter": "Electrochemistry",
    "chapter_number": 11,
    "year": 2012,
    "question": "The equilibrium constant of the reaction : $\\text{A}_{(s)} + 2\\text{B}^+_{(aq)} \\rightleftharpoons \\text{A}^{2+}_{(aq)} + 2\\text{B}_{(s)}$; $E^\\circ_{\\text{cell}} = 0.0295\\text{ V}$ is $\\left[\\frac{2.303 RT}{F} = 0.059\\right]$",
    "options": [
      "10",
      "2 × 10²",
      "3 × 10²",
      "2 × 10⁵"
    ],
    "correct_answer": 0,
    "explanation": "$$E^\\circ_{\\text{cell}} = \\frac{0.0591}{n} \\log_{10} K$$\nHere $n = 2$ electrons are transferred, and $E^\\circ_{\\text{cell}} = 0.0295\\text{ V}$:\n$$0.0295 = \\frac{0.0591}{2} \\log_{10} K = 0.02955 \\log_{10} K$$\n$$\\log_{10} K \\approx 1 \\implies K = 10^1 = 10$$",
    "needs_image": False
  },
  {
    "id": "chem_ch11_q13",
    "subject": "Chemistry",
    "chapter": "Electrochemistry",
    "chapter_number": 11,
    "year": 2012,
    "question": "Which one of the following has a potential more than zero?",
    "options": [
      "Pt, ½ H₂ (1 atm) | HCl (1 M)",
      "Pt, ½ H₂ (1 atm) | HCl (2 M)",
      "Pt, ½ H₂ (1 atm) | HCl (0.1 M)",
      "Pt, ½ H₂ (1 atm) | HCl (0.5 M)"
    ],
    "correct_answer": 1,
    "explanation": "For the hydrogen electrode $\\text{H}^+ + e^- \\to \\frac{1}{2}\\text{H}_2$:\n$$E = E^\\circ - \\frac{0.0591}{1} \\log \\frac{P_{\\text{H}_2}^{1/2}}{[\\text{H}^+]}$$\nSince $E^\\circ = 0$ and $P_{\\text{H}_2} = 1\\text{ atm}$:\n$$E = +0.0591 \\log [\\text{H}^+] = -0.0591\\,\\text{pH}$$\nFor $2\\text{ M HCl}$, $[\\text{H}^+] = 2 > 1$, so $\\log(2) = +0.301 > 0$, making $E = +0.0591 \\times 0.301 = +0.0178\\text{ V} > 0$. For all other solutions where $[\\text{H}^+] \\le 1\\text{ M}$, $E \\le 0$.",
    "needs_image": False
  },
  {
    "id": "chem_ch11_q14",
    "subject": "Chemistry",
    "chapter": "Electrochemistry",
    "chapter_number": 11,
    "year": 2013,
    "question": "The emf of a galvanic cell constituted with the electrodes $\\text{Zn}^{2+}|\\text{Zn}\\,(-0.76\\text{ V})$ and $\\text{Fe}^{2+}|\\text{Fe}\\,(-0.41\\text{ V})$ is",
    "options": [
      "-0.35 V",
      "+1.17 V",
      "+0.35 V",
      "-1.17 V"
    ],
    "correct_answer": 2,
    "explanation": "$$E_{\\text{cell}} = E_{\\text{cathode}} - E_{\\text{anode}}$$\nSince $E^\\circ_{\\text{Fe}^{2+}/\\text{Fe}} (-0.41\\text{ V}) > E^\\circ_{\\text{Zn}^{2+}/\\text{Zn}} (-0.76\\text{ V})$, iron acts as the cathode and zinc as the anode:\n$$E_{\\text{cell}} = -0.41\\text{ V} - (-0.76\\text{ V}) = +0.35\\text{ V}$$",
    "needs_image": False
  },
  {
    "id": "chem_ch11_q15",
    "subject": "Chemistry",
    "chapter": "Electrochemistry",
    "chapter_number": 11,
    "year": 2014,
    "question": "For $\\text{Cr}_2\\text{O}_7^{2-} + 14\\text{H}^+ + 6e^- \\to 2\\text{Cr}^{3+} + 7\\text{H}_2\\text{O}$, $E^\\circ = 1.33\\text{ V}$. At $[\\text{Cr}_2\\text{O}_7^{2-}] = 4.5\\text{ millimole}$, $[\\text{Cr}^{3+}] = 15\\text{ millimole}$, $E$ is $1.067\\text{ V}$. The pH of the solution is nearly equal to",
    "options": [
      "2",
      "3",
      "5",
      "4"
    ],
    "correct_answer": 0,
    "explanation": "Nernst equation for the reaction:\n$$E = E^\\circ - \\frac{0.0591}{6} \\log \\frac{[\\text{Cr}^{3+}]^2}{[\\text{Cr}_2\\text{O}_7^{2-}][\\text{H}^+]^{14}}$$\n$$1.067 = 1.33 - 9.85 \\times 10^{-3} \\left[ 2\\log(15 \\times 10^{-3}) - \\log(4.5 \\times 10^{-3}) - 14\\log[\\text{H}^+] \\right]$$\n$$\\frac{1.067 - 1.33}{-9.85 \\times 10^{-3}} = \\frac{-0.263}{-0.00985} \\approx 26.7$$\n$$26.7 = 2(-1.82) - (-2.34) + 14\\,\\text{pH} = -3.64 + 2.34 + 14\\,\\text{pH}$$\n$$26.7 = -1.30 + 14\\,\\text{pH} \\implies 14\\,\\text{pH} = 28 \\implies \\text{pH} = 2$$",
    "needs_image": False
  },
  {
    "id": "chem_ch11_q16",
    "subject": "Chemistry",
    "chapter": "Electrochemistry",
    "chapter_number": 11,
    "year": 2014,
    "question": "Impure copper containing $\\text{Fe}, \\text{Au}, \\text{Ag}$ as impurities is electrolytically refined. A current of $140\\text{ A}$ for $482.5\\text{ s}$ decreased the mass of the anode by $22.26\\text{ g}$ and increased the mass of cathode by $22.011\\text{ g}$. Percentage of iron in impure copper is\n(Given : molar mass $\\text{Fe} = 55.5\\text{ g mol}^{-1}$, molar mass $\\text{Cu} = 63.54\\text{ g mol}^{-1}$)",
    "options": [
      "0.95",
      "0.85",
      "0.97",
      "0.90"
    ],
    "correct_answer": 3,
    "explanation": "Cathode mass increase ($22.011\\text{ g}$) is purely due to deposition of pure Cu.\nTotal charge passed $Q = I \\times t = 140 \\times 482.5 = 67550\\text{ C}$.\nMass of copper equivalent to this charge:\n$$w_{\\text{Cu}} = \\frac{63.54}{2 \\times 96500} \\times 67550 = 22.239\\text{ g}$$\nDifference in mass of Cu deposited vs dissolved:\n$$22.239 - 22.011 = 0.228\\text{ g Cu equivalent}$$\nThis charge difference oxidized iron:\n$$\\text{Mass of Fe} = 0.228 \\times \\frac{E_{\\text{Fe}}}{E_{\\text{Cu}}} = 0.228 \\times \\frac{27.75}{31.77} = 0.199\\text{ g}$$\n$$\\%\\text{ Fe} = \\frac{0.199}{22.26} \\times 100 \\approx 0.894\\% \\approx 0.90\\%$$",
    "needs_image": False
  },
  {
    "id": "chem_ch11_q17",
    "subject": "Chemistry",
    "chapter": "Electrochemistry",
    "chapter_number": 11,
    "year": 2014,
    "question": "For hydrogen - oxygen fuel cell at one atm and $298\\text{ K}$\n$$\\text{H}_{2(g)} + \\frac{1}{2}\\text{O}_{2(g)} \\to \\text{H}_2\\text{O}_{(l)}; \\; \\Delta G^\\circ = -240\\text{ kJ}$$\n$E^\\circ$ for the cell is approximately, (Given : $F = 96,500\\text{ C}$)",
    "options": [
      "2.48 V",
      "1.24 V",
      "2.5 V",
      "1.26 V"
    ],
    "correct_answer": 1,
    "explanation": "$$\\Delta G^\\circ = -nFE^\\circ$$\nFor the reaction $\\text{H}_2 + \\frac{1}{2}\\text{O}_2 \\to \\text{H}_2\\text{O}$, $n = 2$ electrons are transferred.\n$$-240000\\text{ J} = -2 \\times 96500 \\times E^\\circ$$\n$$E^\\circ = \\frac{240000}{193000} \\approx 1.2435\\text{ V} \\approx 1.24\\text{ V}$$",
    "needs_image": False
  },
  {
    "id": "chem_ch11_q18",
    "subject": "Chemistry",
    "chapter": "Electrochemistry",
    "chapter_number": 11,
    "year": 2015,
    "question": "How many coulombs of electricity are required for the oxidation of one mol of water to dioxygen?",
    "options": [
      "1.93 × 10⁴ C",
      "19.3 × 10⁵ C",
      "9.65 × 10⁴ C",
      "1.93 × 10⁵ C"
    ],
    "correct_answer": 3,
    "explanation": "The oxidation reaction of water to dioxygen is:\n$$\\text{H}_2\\text{O} \\longrightarrow 2\\text{H}^+ + \\frac{1}{2}\\text{O}_2 + 2e^-$$\n$1\\text{ mole of }\\text{H}_2\\text{O}$ requires $2\\text{ moles of electrons} = 2\\text{ F}$ of electricity:\n$$Q = 2 \\times 96500\\text{ C} = 193000\\text{ C} = 1.93 \\times 10^5\\text{ C}$$",
    "needs_image": False
  },
  {
    "id": "chem_ch11_q19",
    "subject": "Chemistry",
    "chapter": "Electrochemistry",
    "chapter_number": 11,
    "year": 2015,
    "question": "While charging the lead storage battery",
    "options": [
      "PbSO₄ on cathode is reduced to Pb",
      "PbSO₄ on anode is oxidized to PbO₂",
      "PbSO₄ on anode is reduced to Pb",
      "PbSO₄ on cathode is oxidized to Pb"
    ],
    "correct_answer": 2,
    "explanation": "During recharging of a lead storage battery, the cell operates as an electrolytic cell:\n- At cathode: $\\text{PbSO}_{4(s)} + 2\\text{H}_2\\text{O} \\longrightarrow \\text{PbO}_{2(s)} + \\text{SO}_4^{2-} + 4\\text{H}^+ + 2e^-$ (oxidation)\n- At anode: $\\text{PbSO}_{4(s)} + 2e^- \\longrightarrow \\text{Pb}_{(s)} + \\text{SO}_4^{2-}$ (reduction)\nOverall: $2\\text{PbSO}_4 + 2\\text{H}_2\\text{O} \\longrightarrow \\text{Pb} + \\text{PbO}_2 + 2\\text{H}_2\\text{SO}_4$.\nThus, $\\text{PbSO}_4$ on the anode (connected to the negative terminal) is reduced to $\\text{Pb}$.",
    "needs_image": False
  },
  {
    "id": "chem_ch11_q20",
    "subject": "Chemistry",
    "chapter": "Electrochemistry",
    "chapter_number": 11,
    "year": 2015,
    "question": "In $\\text{H}_2-\\text{O}_2$ fuel cell the reaction occurring at cathode is",
    "options": [
      "O₂(g) + 2H₂O(l) + 4e⁻ ⟶ 4OH⁻(aq)",
      "H⁺(aq) + OH⁻(aq) ⟶ H₂O(l)",
      "2H₂(g) + O₂(g) ⟶ 2H₂O(l)",
      "H⁺ + e⁻ ⟶ ½ H₂"
    ],
    "correct_answer": 0,
    "explanation": "In a hydrogen-oxygen fuel cell with alkaline electrolyte:\n- Anode reaction: $2\\text{H}_{2(g)} + 4\\text{OH}^-_{(aq)} \\longrightarrow 4\\text{H}_2\\text{O}_{(l)} + 4e^-$\n- Cathode reaction: $\\text{O}_{2(g)} + 2\\text{H}_2\\text{O}_{(l)} + 4e^- \\longrightarrow 4\\text{OH}^-_{(aq)}$\n- Overall reaction: $2\\text{H}_{2(g)} + \\text{O}_{2(g)} \\longrightarrow 2\\text{H}_2\\text{O}_{(l)}$",
    "needs_image": False
  },
  {
    "id": "chem_ch11_q21",
    "subject": "Chemistry",
    "chapter": "Electrochemistry",
    "chapter_number": 11,
    "year": 2016,
    "question": "Which of the following is incorrect in a galvanic cell?",
    "options": [
      "Oxidation occurs at anode.",
      "Reduction occurs at cathode.",
      "The electrode at which electrons are gained is called cathode.",
      "The electrode at which electrons are lost is called cathode."
    ],
    "correct_answer": 3,
    "explanation": "By definition, oxidation (loss of electrons) always takes place at the anode, and reduction (gain of electrons) takes place at the cathode. Therefore, stating that cathode is where electrons are lost is incorrect.",
    "needs_image": False
  },
  {
    "id": "chem_ch11_q22",
    "subject": "Chemistry",
    "chapter": "Electrochemistry",
    "chapter_number": 11,
    "year": 2016,
    "question": "A secondary cell is one which",
    "options": [
      "can be recharged",
      "can be recharged by passing current through it in the same direction",
      "can be recharged by passing current through it in the opposite direction",
      "cannot be recharged."
    ],
    "correct_answer": 2,
    "explanation": "A secondary cell (accumulator/storage cell) is an electrochemical cell that can be recharged after being discharged by passing direct current through it in the opposite direction to reverse the spontaneous redox reactions.",
    "needs_image": False
  },
  {
    "id": "chem_ch11_q23",
    "subject": "Chemistry",
    "chapter": "Electrochemistry",
    "chapter_number": 11,
    "year": 2016,
    "question": "The amount of current in faraday required for the reduction of $1\\text{ mol}$ of $\\text{Cr}_2\\text{O}_7^{2-}$ ions to $\\text{Cr}^{3+}$ is",
    "options": [
      "1 F",
      "2 F",
      "6 F",
      "4 F"
    ],
    "correct_answer": 2,
    "explanation": "The reduction half-reaction in acidic medium is:\n$$\\text{Cr}_2\\text{O}_7^{2-} + 14\\text{H}^+ + 6e^- \\longrightarrow 2\\text{Cr}^{3+} + 7\\text{H}_2\\text{O}$$\nSince $6\\text{ moles of electrons}$ are required per mole of $\\text{Cr}_2\\text{O}_7^{2-}$, the amount of electricity required is $6\\text{ Faradays}$ ($6\\text{ F}$).",
    "needs_image": False
  },
  {
    "id": "chem_ch11_q24",
    "subject": "Chemistry",
    "chapter": "Electrochemistry",
    "chapter_number": 11,
    "year": 2017,
    "question": "By passing electric current, $\\text{NaClO}_3$ is converted into $\\text{NaClO}_4$ according to the following equation:\n$$\\text{NaClO}_3 + \\text{H}_2\\text{O} \\longrightarrow \\text{NaClO}_4 + \\text{H}_2$$\nHow many moles of $\\text{NaClO}_4$ will be formed when three faradays of charge is passed through $\\text{NaClO}_3$?",
    "options": [
      "0.75",
      "3.0",
      "1.5",
      "1.0"
    ],
    "correct_answer": 2,
    "explanation": "The oxidation half-reaction is:\n$$\\text{ClO}_3^- + \\text{H}_2\\text{O} \\longrightarrow \\text{ClO}_4^- + 2\\text{H}^+ + 2e^-$$\n$2\\text{ moles of electrons} (2\\text{ F})$ produce $1\\text{ mol}$ of $\\text{NaClO}_4$.\nTherefore, $3\\text{ Faradays}$ will produce:\n$$\\frac{1}{2} \\times 3 = 1.5\\text{ moles of } \\text{NaClO}_4$$",
    "needs_image": False
  },
  {
    "id": "chem_ch11_q25",
    "subject": "Chemistry",
    "chapter": "Electrochemistry",
    "chapter_number": 11,
    "year": 2017,
    "question": "In the electrolysis of aqueous sodium chloride solution, which of the half cell reaction will occur at anode?",
    "options": [
      "Cl⁻(aq) ⟶ ½ Cl₂ + e⁻; E°cell = 1.36 volts",
      "2H₂O(l) ⟶ O₂ + 4H⁺ + 4e⁻; E°cell = 1.23 volts",
      "Na⁺(aq) + e⁻ ⟶ Na(s); E° = -2.71 volts",
      "H⁺(aq) + e⁻ ⟶ ½ H₂; E°cell = 0.00 volts"
    ],
    "correct_answer": 0,
    "explanation": "During the electrolysis of aqueous NaCl, two oxidation reactions are competitive at the anode:\n1) $\\text{Cl}^- \\to \\frac{1}{2}\\text{Cl}_2 + e^-, \\; E^\\circ = 1.36\\text{ V}$\n2) $2\\text{H}_2\\text{O} \\to \\text{O}_2 + 4\\text{H}^+ + 4e^-, \\; E^\\circ = 1.23\\text{ V}$\nAlthough the oxidation of water has a lower standard potential, the evolution of oxygen gas on the electrode requires a significant overpotential (overvoltage). Hence, oxidation of chloride ions to chlorine gas is kinetically favored and takes place at the anode.",
    "needs_image": False
  },
  {
    "id": "chem_ch11_q26",
    "subject": "Chemistry",
    "chapter": "Electrochemistry",
    "chapter_number": 11,
    "year": 2018,
    "question": "The charge required for the reduction of $1\\text{ mole}$ of $\\text{MnO}_4^-$ to $\\text{MnO}_2$ is",
    "options": [
      "1 F",
      "3 F",
      "5 F",
      "7 F"
    ],
    "correct_answer": 1,
    "explanation": "The half-reaction for reduction of $\\text{MnO}_4^-$ to $\\text{MnO}_2$ is:\n$$\\text{MnO}_4^- + 2\\text{H}_2\\text{O} + 3e^- \\longrightarrow \\text{MnO}_2 + 4\\text{OH}^-$$\nThe oxidation number of Mn changes from $+7$ in $\\text{MnO}_4^-$ to $+4$ in $\\text{MnO}_2$, which requires $3\\text{ moles of electrons} = 3\\text{ F}$.",
    "needs_image": False
  },
  {
    "id": "chem_ch11_q27",
    "subject": "Chemistry",
    "chapter": "Electrochemistry",
    "chapter_number": 11,
    "year": 2018,
    "question": "At a particular temperature, the ratio of molar conductance to specific conductance of $0.01\\text{ M } \\text{NaCl}$ solution is",
    "options": [
      "10⁵ cm³ mol⁻¹",
      "10³ cm³ mol⁻¹",
      "10 cm³ mol⁻¹",
      "10⁵ cm² mol⁻¹"
    ],
    "correct_answer": 0,
    "explanation": "Molar conductivity is given by $\\Lambda_m = \\frac{\\kappa \\times 1000}{M}$.\nTherefore, the ratio of molar conductance to specific conductance is:\n$$\\frac{\\Lambda_m}{\\kappa} = \\frac{1000}{M} = \\frac{1000}{0.01} = 10^5\\text{ cm}^3\\text{ mol}^{-1}$$",
    "needs_image": False
  },
  {
    "id": "chem_ch11_q28",
    "subject": "Chemistry",
    "chapter": "Electrochemistry",
    "chapter_number": 11,
    "year": 2018,
    "question": "For a cell involving two electron changes, $E^\\circ_{\\text{cell}} = 0.3\\text{ V}$ at $25^\\circ\\text{C}$. The equilibrium constant of the reaction is",
    "options": [
      "10⁻¹⁰",
      "3 × 10⁻²",
      "10",
      "10¹⁰"
    ],
    "correct_answer": 3,
    "explanation": "$$\\log_{10} K = \\frac{n E^\\circ_{\\text{cell}}}{0.0591} = \\frac{2 \\times 0.3}{0.0591} = \\frac{0.6}{0.0591} \\approx 10.15 \\approx 10$$\n$$K = 10^{10}$$",
    "needs_image": False
  },
  {
    "id": "chem_ch11_q29",
    "subject": "Chemistry",
    "chapter": "Electrochemistry",
    "chapter_number": 11,
    "year": 2019,
    "question": "One litre solution of $\\text{MgCl}_2$ is electrolyzed completely by passing a current of $1\\text{ A}$ for $16\\text{ min } 5\\text{ sec}$. The original concentration of $\\text{MgCl}_2$ solution was (Atomic mass of $\\text{Mg} = 24$)",
    "options": [
      "5 × 10⁻³ M",
      "5 × 10⁻² M",
      "0.5 × 10⁻³ M",
      "1.0 × 10⁻² M"
    ],
    "correct_answer": 0,
    "explanation": "$$t = 16\\text{ min } 5\\text{ s} = 965\\text{ s}$$\n$$Q = I \\times t = 1\\text{ A} \\times 965\\text{ s} = 965\\text{ C}$$\n$$\\text{Faradays passed} = \\frac{965}{96500} = 10^{-2}\\text{ F}$$\nSince deposition of $1\\text{ mol of Mg}$ requires $2\\text{ F}$:\n$$\\text{Moles of } \\text{MgCl}_2 = \\frac{10^{-2}}{2} = 5 \\times 10^{-3}\\text{ mol}$$\nIn $1\\text{ L}$ solution, the original concentration was $5 \\times 10^{-3}\\text{ M}$.",
    "needs_image": False
  },
  {
    "id": "chem_ch11_q30",
    "subject": "Chemistry",
    "chapter": "Electrochemistry",
    "chapter_number": 11,
    "year": 2019,
    "question": "An aqueous solution of $\\text{CuSO}_4$ is subjected to electrolysis using inert electrodes. The pH of the solution will",
    "options": [
      "increase",
      "remains unchanged",
      "decrease",
      "increase or decrease depending on the strength of the current."
    ],
    "correct_answer": 2,
    "explanation": "During the electrolysis of aqueous $\\text{CuSO}_4$ with inert electrodes:\n- Cathode: $\\text{Cu}^{2+} + 2e^- \\longrightarrow \\text{Cu}_{(s)}$\n- Anode: $2\\text{H}_2\\text{O}_{(l)} \\longrightarrow \\text{O}_{2(g)} + 4\\text{H}^+_{(aq)} + 4e^-$\nAs electrolysis proceeds, $\\text{H}^+$ ions accumulate in the solution, making it increasingly acidic, so the pH of the solution decreases.",
    "needs_image": False
  },
  {
    "id": "chem_ch11_q31",
    "subject": "Chemistry",
    "chapter": "Electrochemistry",
    "chapter_number": 11,
    "year": 2019,
    "question": "Given : $E^\\circ_{\\text{Mn}^{+7}|\\text{Mn}^{+2}} = 1.5\\text{ V}$ and $E^\\circ_{\\text{Mn}^{+4}|\\text{Mn}^{+2}} = 1.2\\text{ V}$, then $E^\\circ_{\\text{Mn}^{+7}|\\text{Mn}^{+4}}$ is",
    "options": [
      "0.3 V",
      "0.1 V",
      "1.7 V",
      "2.1 V"
    ],
    "correct_answer": 2,
    "explanation": "Potentials are intensive quantities and cannot be added directly; we use free energies $\\Delta G^\\circ = -nFE^\\circ$:\n1) $\\text{Mn}^{7+} + 5e^- \\to \\text{Mn}^{2+}; \\; \\Delta G_1^\\circ = -5 F (1.5) = -7.5 F$\n2) $\\text{Mn}^{4+} + 2e^- \\to \\text{Mn}^{2+}; \\; \\Delta G_2^\\circ = -2 F (1.2) = -2.4 F$\nSubtracting reaction (2) from (1) gives $\\text{Mn}^{7+} + 3e^- \\to \\text{Mn}^{4+}$:\n$$\\Delta G_3^\\circ = \\Delta G_1^\\circ - \\Delta G_2^\\circ = -7.5 F - (-2.4 F) = -5.1 F$$\n$$-3 F E^\\circ_3 = -5.1 F \\implies E^\\circ_3 = \\frac{5.1}{3} = 1.7\\text{ V}$$",
    "needs_image": False
  },
  {
    "id": "chem_ch11_q32",
    "subject": "Chemistry",
    "chapter": "Electrochemistry",
    "chapter_number": 11,
    "year": 2020,
    "question": "The pair of electrolytes that posses same value for the constant ($A$) in the Debye – Huckel – Onsagar equation, $\\lambda_m = \\lambda_m^\\circ - A\\sqrt{C}$ is",
    "options": [
      "NH₄Cl, NaBr",
      "NaBr, MgSO₄",
      "NaCl, CaCl₂",
      "MgSO₄, Na₂SO₄"
    ],
    "correct_answer": 0,
    "explanation": "In the Debye-Hückel-Onsager equation, constant $A$ depends on the type of electrolyte, i.e., the charges on the cation and anion. Both $\\text{NH}_4\\text{Cl}$ and $\\text{NaBr}$ are 1:1 electrolytes (each dissociates into univalent cations and univalent anions), so they possess the exact same value of constant $A$.",
    "needs_image": False
  },
  {
    "id": "chem_ch11_q33",
    "subject": "Chemistry",
    "chapter": "Electrochemistry",
    "chapter_number": 11,
    "year": 2020,
    "question": "Given $E^\\circ_{\\text{Fe}^{+3}/\\text{Fe}^{+2}} = +0.76\\text{ V}$ and $E^\\circ_{\\text{I}_2/\\text{I}^-} = +0.55\\text{ V}$. The equilibrium constant for the reaction taking place in galvanic cell consisting of above two electrodes is $\\left[\\frac{2.303RT}{F} = 0.06\\right]$",
    "options": [
      "1 × 10⁹",
      "3 × 10⁸",
      "5 × 10¹²",
      "1 × 10⁷"
    ],
    "correct_answer": 3,
    "explanation": "Cell reaction: $2\\text{Fe}^{3+} + 2\\text{I}^- \\longrightarrow 2\\text{Fe}^{2+} + \\text{I}_2$ ($n = 2$).\n$$E^\\circ_{\\text{cell}} = E^\\circ_{\\text{cathode}} - E^\\circ_{\\text{anode}} = 0.76 - 0.55 = 0.21\\text{ V}$$\n$$E^\\circ_{\\text{cell}} = \\frac{0.06}{n} \\log K_c \\implies 0.21 = \\frac{0.06}{2} \\log K_c = 0.03 \\log K_c$$\n$$\\log K_c = \\frac{0.21}{0.03} = 7 \\implies K_c = 10^7 = 1 \\times 10^7$$",
    "needs_image": False
  },
  {
    "id": "chem_ch11_q34",
    "subject": "Chemistry",
    "chapter": "Electrochemistry",
    "chapter_number": 11,
    "year": 2020,
    "question": "If an aqueous solution of $\\text{NaF}$ is electrolyzed between inert electrodes, the product obtained at anode is",
    "options": [
      "H₂",
      "Na",
      "O₂",
      "F₂"
    ],
    "correct_answer": 2,
    "explanation": "Fluorine has the highest standard reduction potential ($E^\\circ = +2.87\\text{ V}$), meaning fluoride ions ($F^-$) are extremely difficult to oxidize compared to water ($E^\\circ = +1.23\\text{ V}$). Therefore, water is oxidized preferentially at the anode, releasing oxygen gas ($\\text{O}_2$):\n$$2\\text{H}_2\\text{O} \\longrightarrow \\text{O}_2 + 4\\text{H}^+ + 4e^-$$",
    "needs_image": False
  },
  {
    "id": "chem_ch11_q35",
    "subject": "Chemistry",
    "chapter": "Electrochemistry",
    "chapter_number": 11,
    "year": 2021,
    "question": "Consider the following electrodes :\n$P = \\text{Zn}^{2+}\\,(0.0001\\text{ M})/\\text{Zn}$;\n$Q = \\text{Zn}^{2+}\\,(0.1\\text{ M})/\\text{Zn}$;\n$R = \\text{Zn}^{2+}\\,(0.01\\text{ M})/\\text{Zn}$;\n$S = \\text{Zn}^{2+}\\,(0.001\\text{ M})/\\text{Zn}$\n$E^\\circ_{\\text{Zn}/\\text{Zn}^{2+}} = -0.76\\text{ V}$ electrode potentials of the above electrode in volts are in the order",
    "options": [
      "P > S > R > Q",
      "S > R > Q > P",
      "Q > R > S > P",
      "P > Q > R > S"
    ],
    "correct_answer": 2,
    "explanation": "Reduction potential for $\\text{Zn}^{2+} + 2e^- \\to \\text{Zn}$ is given by Nernst equation:\n$$E_{\\text{red}} = E^\\circ_{\\text{red}} - \\frac{0.059}{2} \\log \\frac{1}{[\\text{Zn}^{2+}]} = E^\\circ_{\\text{red}} + \\frac{0.059}{2} \\log [\\text{Zn}^{2+}]$$\nAs $[\\text{Zn}^{2+}]$ increases, $E_{\\text{red}}$ becomes more positive (less negative):\n- $Q: 0.1\\text{ M} = 10^{-1} \\implies E = -0.76 + 0.0295(-1) = -0.7895\\text{ V}$\n- $R: 0.01\\text{ M} = 10^{-2} \\implies E = -0.76 + 0.0295(-2) = -0.819\\text{ V}$\n- $S: 0.001\\text{ M} = 10^{-3} \\implies E = -0.76 + 0.0295(-3) = -0.8485\\text{ V}$\n- $P: 0.0001\\text{ M} = 10^{-4} \\implies E = -0.76 + 0.0295(-4) = -0.878\\text{ V}$\nThus, the order of reduction potentials is $Q > R > S > P$.",
    "needs_image": False
  },
  {
    "id": "chem_ch11_q36",
    "subject": "Chemistry",
    "chapter": "Electrochemistry",
    "chapter_number": 11,
    "year": 2021,
    "question": "The resistance of $0.01\\text{ M } \\text{KCl}$ solution at $298\\text{ K}$ is $1500\\;\\Omega$. If the conductivity of $0.01\\text{ M } \\text{KCl}$ solution at $298\\text{ K}$ is $0.1466 \\times 10^{-3}\\text{ S cm}^{-1}$. The cell constant of the conductivity cell in $(\\text{cm}^{-1})$ is",
    "options": [
      "0.219",
      "0.291",
      "0.301",
      "0.194"
    ],
    "correct_answer": 0,
    "explanation": "$$\\text{Cell constant } G^* = \\kappa \\times R$$\n$$G^* = (0.1466 \\times 10^{-3}\\text{ S cm}^{-1}) \\times 1500\\;\\Omega = 0.2199\\text{ cm}^{-1} \\approx 0.219\\text{ cm}^{-1}$$",
    "needs_image": False
  },
  {
    "id": "chem_ch11_q37",
    "subject": "Chemistry",
    "chapter": "Electrochemistry",
    "chapter_number": 11,
    "year": 2021,
    "question": "$\\text{H}_{2(g)} + 2\\text{AgCl}_{(s)} \\rightleftharpoons 2\\text{Ag}_{(s)} + 2\\text{HCl}_{(aq)}$\n$E^\\circ_{\\text{cell}}$ at $25^\\circ\\text{C}$ for the cell is $0.22\\text{ V}$. The equilibrium constant at $25^\\circ\\text{C}$ is",
    "options": [
      "2.8 × 10⁷",
      "5.2 × 10⁸",
      "2.8 × 10⁵",
      "5.2 × 10⁴"
    ],
    "correct_answer": 0,
    "explanation": "In this cell reaction, $n = 2$ electrons are transferred.\n$$\\log K_c = \\frac{n E^\\circ_{\\text{cell}}}{0.059} = \\frac{2 \\times 0.22}{0.059} = \\frac{0.44}{0.059} \\approx 7.4576$$\n$$K_c = 10^{7.4576} = 10^{0.4576} \\times 10^7 \\approx 2.87 \\times 10^7 \\approx 2.8 \\times 10^7$$",
    "needs_image": False
  },
  {
    "id": "chem_ch11_q38",
    "subject": "Chemistry",
    "chapter": "Electrochemistry",
    "chapter_number": 11,
    "year": 2022,
    "question": "Specific conductance of $0.1\\text{ M } \\text{HNO}_3$ is $6.3 \\times 10^{-2}\\text{ ohm}^{-1}\\text{ cm}^{-1}$. The molar conductance of the solution is",
    "options": [
      "6.300 ohm⁻¹ cm² mol⁻¹",
      "63.0 ohm⁻¹ cm² mol⁻¹",
      "630 ohm⁻¹ cm² mol⁻¹",
      "315 ohm⁻¹ cm² mol⁻¹"
    ],
    "correct_answer": 2,
    "explanation": "$$\\Lambda_m = \\frac{\\kappa \\times 1000}{M}$$\n$$\\Lambda_m = \\frac{6.3 \\times 10^{-2} \\times 1000}{0.1} = \\frac{63}{0.1} = 630\\text{ ohm}^{-1}\\text{ cm}^2\\text{ mol}^{-1}$$",
    "needs_image": False
  },
  {
    "id": "chem_ch11_q39",
    "subject": "Chemistry",
    "chapter": "Electrochemistry",
    "chapter_number": 11,
    "year": 2022,
    "question": "In fuel cells, ______ are used as catalysts.",
    "options": [
      "zinc-mercury",
      "lead-manganese",
      "platinum-palladium",
      "nickel-cadmium"
    ],
    "correct_answer": 2,
    "explanation": "In hydrogen-oxygen fuel cells, finely divided catalysts such as platinum or palladium are embedded in the porous carbon electrodes to accelerate the electrochemical reaction rates at the electrodes.",
    "needs_image": False
  },
  {
    "id": "chem_ch11_q40",
    "subject": "Chemistry",
    "chapter": "Electrochemistry",
    "chapter_number": 11,
    "year": 2022,
    "question": "The molar conductivity is maximum for the solution of concentration",
    "options": [
      "0.005 M",
      "0.001 M",
      "0.004 M",
      "0.002 M"
    ],
    "correct_answer": 1,
    "explanation": "Molar conductivity $\\Lambda_m$ increases with decrease in electrolyte concentration (increase in dilution) due to diminished interionic forces and enhanced degree of dissociation. Therefore, $\\Lambda_m$ is maximum for the lowest concentration, which is $0.001\\text{ M}$.",
    "needs_image": False
  },
  {
    "id": "chem_ch11_q41",
    "subject": "Chemistry",
    "chapter": "Electrochemistry",
    "chapter_number": 11,
    "year": 2022,
    "question": "For spontaneity of a cell, which is correct?",
    "options": [
      "ΔG = +ve, ΔE = +ve",
      "ΔG = -ve, ΔE = +ve",
      "ΔG = 0, ΔE = 0",
      "ΔG = -ve, ΔE = 0"
    ],
    "correct_answer": 1,
    "explanation": "Thermodynamically, for a spontaneous cell reaction, the change in Gibbs free energy must be negative:\n$$\\Delta G < 0 \\; (\\Delta G = -\\text{ve})$$\nSince $\\Delta G = -nFE_{\\text{cell}}$, the cell potential must be positive:\n$$E_{\\text{cell}} > 0 \\; (\\Delta E = +\\text{ve})$$",
    "needs_image": False
  },
  {
    "id": "chem_ch11_q42",
    "subject": "Chemistry",
    "chapter": "Electrochemistry",
    "chapter_number": 11,
    "year": 2023,
    "question": "The resistance of $0.1\\text{ M}$ weak acid $\\text{HA}$ in a conductivity cell is $2 \\times 10^3\\;\\Omega$. The cell constant of the cell is $0.78\\text{ cm}^{-1}$ and $\\lambda_m^\\circ$ of acid $\\text{HA}$ is $390\\text{ S cm}^2\\text{ mol}^{-1}$. The pH of the solution is",
    "options": [
      "3.3",
      "4.2",
      "5",
      "3"
    ],
    "correct_answer": 3,
    "explanation": "$$\\kappa = \\frac{\\text{Cell constant}}{R} = \\frac{0.78}{2 \\times 10^3} = 3.9 \\times 10^{-4}\\text{ S cm}^{-1}$$\n$$\\Lambda_m = \\frac{\\kappa \\times 1000}{C} = \\frac{3.9 \\times 10^{-4} \\times 1000}{0.1} = 3.9\\text{ S cm}^2\\text{ mol}^{-1}$$\n$$\\alpha = \\frac{\\Lambda_m}{\\Lambda_m^\\circ} = \\frac{3.9}{390} = 0.01$$\n$$[\\text{H}^+] = C\\alpha = 0.1 \\times 0.01 = 10^{-3}\\text{ M}$$\n$$\\text{pH} = -\\log[\\text{H}^+] = -\\log(10^{-3}) = 3$$",
    "needs_image": False
  },
  {
    "id": "chem_ch11_q43",
    "subject": "Chemistry",
    "chapter": "Electrochemistry",
    "chapter_number": 11,
    "year": 2023,
    "question": "During the electrolysis of brine, by using inert electrodes,",
    "options": [
      "O₂ liberates at anode",
      "H₂ liberates at anode",
      "Na deposits on cathode",
      "Cl₂ liberates at anode."
    ],
    "correct_answer": 3,
    "explanation": "During the electrolysis of concentrated aqueous sodium chloride (brine) using inert electrodes:\n- At anode: $2\\text{Cl}^-_{(aq)} \\longrightarrow \\text{Cl}_{2(g)} + 2e^-$ (chlorine gas liberated)\n- At cathode: $2\\text{H}_2\\text{O}_{(l)} + 2e^- \\longrightarrow \\text{H}_{2(g)} + 2\\text{OH}^-_{(aq)}$ (hydrogen gas liberated)\nHence, $\\text{Cl}_2$ gas is liberated at the anode.",
    "needs_image": False
  },
  {
    "id": "chem_ch11_q44",
    "subject": "Chemistry",
    "chapter": "Electrochemistry",
    "chapter_number": 11,
    "year": 2023,
    "question": "Consider the following 4 electrodes :\n$A : \\text{Ag}^+(0.0001\\text{ M})/\\text{Ag}_{(s)}$;\n$B : \\text{Ag}^+(0.1\\text{ M})/\\text{Ag}_{(s)}$;\n$C : \\text{Ag}^+(0.01\\text{ M})/\\text{Ag}_{(s)}$;\n$D : \\text{Ag}^+(0.001\\text{ M})/\\text{Ag}_{(s)}$; $E^\\circ_{\\text{Ag}^+/\\text{Ag}} = +0.80\\text{ V}$\nThen reduction potentials in volts of the electrodes in the order",
    "options": [
      "B > C > D > A",
      "C > D > A > B",
      "A > D > C > B",
      "A > B > C > D"
    ],
    "correct_answer": 0,
    "explanation": "Nernst equation for $\\text{Ag}^+ + e^- \\to \\text{Ag}$:\n$$E = E^\\circ + 0.0591 \\log[\\text{Ag}^+] = 0.80 + 0.0591 \\log[\\text{Ag}^+]$\n- $B : [\\text{Ag}^+] = 0.1\\text{ M} = 10^{-1} \\implies E = 0.80 - 0.059 = 0.741\\text{ V}$\n- $C : [\\text{Ag}^+] = 0.01\\text{ M} = 10^{-2} \\implies E = 0.80 - 0.118 = 0.682\\text{ V}$\n- $D : [\\text{Ag}^+] = 0.001\\text{ M} = 10^{-3} \\implies E = 0.80 - 0.177 = 0.623\\text{ V}$\n- $A : [\\text{Ag}^+] = 0.0001\\text{ M} = 10^{-4} \\implies E = 0.80 - 0.236 = 0.564\\text{ V}$\nThus, the reduction potentials follow the order $B > C > D > A$.",
    "needs_image": False
  },
  {
    "id": "chem_ch11_q45",
    "subject": "Chemistry",
    "chapter": "Electrochemistry",
    "chapter_number": 11,
    "year": 2024,
    "question": "The value of '$A$' in the equation $\\lambda_m = \\lambda_m^\\circ - A\\sqrt{C}$ is same for the pair",
    "options": [
      "NaCl and CaCl₂",
      "CaCl₂ and MgSO₄",
      "NaCl and KBr",
      "MgCl₂ and NaCl"
    ],
    "correct_answer": 2,
    "explanation": "For strong electrolytes, the Debye-Hückel-Onsager constant $A$ depends on the type of electrolyte, i.e., the charges on the cation and anion. All electrolytes of the same valence type have the same constant $A$. Both $\\text{NaCl}$ and $\\text{KBr}$ are 1:1 electrolytes.",
    "needs_image": False
  },
  {
    "id": "chem_ch11_q46",
    "subject": "Chemistry",
    "chapter": "Electrochemistry",
    "chapter_number": 11,
    "year": 2024,
    "question": "A current of $3\\text{ A}$ is passed through a molten calcium salt for $1\\text{ hr } 47\\text{ min } 13\\text{ sec}$. The mass of calcium deposited is (Molar mass of $\\text{Ca} = 40\\text{ g mol}^{-1}$)",
    "options": [
      "6.0 g",
      "2.0 g",
      "8.0 g",
      "4.0 g"
    ],
    "correct_answer": 3,
    "explanation": "$$t = 1\\text{ hr } 47\\text{ min } 13\\text{ s} = 3600 + 47 \\times 60 + 13 = 6433\\text{ s}$$\n$$Q = I \\times t = 3 \\times 6433 = 19299\\text{ C} \\approx 19300\\text{ C}$$\n$$\\text{Ca}^{2+} + 2e^- \\longrightarrow \\text{Ca}$$\n$2 \\times 96500 = 193000\\text{ C}$ deposits $40\\text{ g}$ of $\\text{Ca}$.\n$$\\text{Mass of Ca deposited} = \\frac{40 \\times 19300}{193000} = 4.0\\text{ g}$$",
    "needs_image": False
  },
  {
    "id": "chem_ch11_q47",
    "subject": "Chemistry",
    "chapter": "Electrochemistry",
    "chapter_number": 11,
    "year": 2024,
    "question": "How many Coulombs are required to oxidise $0.1\\text{ mole}$ of $\\text{H}_2\\text{O}$ to oxygen?",
    "options": [
      "1.93 × 10⁵ C",
      "1.93 × 10⁴ C",
      "3.86 × 10⁴ C",
      "9.65 × 10³ C"
    ],
    "correct_answer": 1,
    "explanation": "$$\\text{H}_2\\text{O} \\longrightarrow 2\\text{H}^+ + \\frac{1}{2}\\text{O}_2 + 2e^-$$\n$1\\text{ mole of } \\text{H}_2\\text{O}$ requires $2\\text{ moles of electrons} = 2\\text{ F} = 2 \\times 96500\\text{ C} = 193000\\text{ C}$.\nFor $0.1\\text{ mole of } \\text{H}_2\\text{O}$:\n$$Q = 0.1 \\times 193000\\text{ C} = 1.93 \\times 10^4\\text{ C}$$",
    "needs_image": False
  }
]

with open('src/data/pyq_chemistry_ch11.json', 'w', encoding='utf-8') as f:
    json.dump(questions, f, indent=2, ensure_ascii=False)

print(f"Successfully generated pyq_chemistry_ch11.json with {len(questions)} questions.")
