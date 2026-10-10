import json

questions = [
  {
    "id": "phys_ch12_q1",
    "subject": "Physics",
    "chapter": "Kinetic Theory",
    "chapter_number": 12,
    "year": 2006,
    "question": "A monoatomic gas is suddenly compressed to $(1/8)^{\\text{th}}$ of its initial volume adiabatically. The ratio of its final pressure to the initial pressure is (given the ratio of the specific heat of the given gas to be $5/3$)",
    "options": [
      "32",
      "40/3",
      "24/5",
      "8"
    ],
    "correct_answer": 0,
    "explanation": "For an adiabatic process:\n$$P_1 V_1^\\gamma = P_2 V_2^\\gamma \\implies \\frac{P_2}{P_1} = \\left(\\frac{V_1}{V_2}\\right)^\\gamma$$\nGiven $\\frac{V_1}{V_2} = 8$ and $\\gamma = \\frac{5}{3}$:\n$$\\frac{P_2}{P_1} = (8)^{5/3} = (2^3)^{5/3} = 2^5 = 32$$",
    "needs_image": False
  },
  {
    "id": "phys_ch12_q2",
    "subject": "Physics",
    "chapter": "Kinetic Theory",
    "chapter_number": 12,
    "year": 2007,
    "question": "During an adiabatic process, the cube of the pressure is found to be inversely proportional to the fourth power of the volume. Then the ratio of specific heats is",
    "options": [
      "1",
      "1.33",
      "1.67",
      "1.4"
    ],
    "correct_answer": 1,
    "explanation": "Given that $P^3 \\propto \\frac{1}{V^4} \\implies P^3 V^4 = \\text{constant}$.\nTaking the cube root on both sides:\n$$P V^{4/3} = \\text{constant}$$\nComparing with the adiabatic relation $P V^\\gamma = \\text{constant}$:\n$$\\gamma = \\frac{4}{3} \\approx 1.33$$",
    "needs_image": False
  },
  {
    "id": "phys_ch12_q3",
    "subject": "Physics",
    "chapter": "Kinetic Theory",
    "chapter_number": 12,
    "year": 2008,
    "question": "If $\\gamma$ is the ratio of specific heats and $R$ is the universal gas constant, then the molar specific heat at constant volume $C_V$ is given by",
    "options": [
      "$\\frac{R}{\\gamma - 1}$",
      "$\\frac{\\gamma R}{\\gamma - 1}$",
      "$\\gamma R$",
      "$\\frac{(\\gamma - 1)R}{\\gamma}$"
    ],
    "correct_answer": 0,
    "explanation": "From Mayer's relation:\n$$C_P - C_V = R$$\nAlso, $\\gamma = \\frac{C_P}{C_V} \\implies C_P = \\gamma C_V$.\nSubstituting into Mayer's relation:\n$$\\gamma C_V - C_V = R \\implies C_V(\\gamma - 1) = R \\implies C_V = \\frac{R}{\\gamma - 1}$$",
    "needs_image": False
  },
  {
    "id": "phys_ch12_q4",
    "subject": "Physics",
    "chapter": "Kinetic Theory",
    "chapter_number": 12,
    "year": 2010,
    "question": "The temperature of a gas contained in a closed vessel of constant volume increases by $1^\\circ\\text{C}$ when the pressure of the gas is increased by $1\\%$. The initial temperature of the gas is",
    "options": [
      "100 K",
      "273°C",
      "100°C",
      "200 K"
    ],
    "correct_answer": 0,
    "explanation": "At constant volume (Gay-Lussac's law), $P \\propto T \\implies \\frac{P_1}{T_1} = \\frac{P_2}{T_2}$.\nGiven $P_2 = P + 0.01P = 1.01P$ and $T_2 = T + 1$ (since an increase of $1^\\circ\\text{C}$ equals an increase of $1\\text{ K}$):\n$$\\frac{P}{T} = \\frac{1.01P}{T + 1} \\implies T + 1 = 1.01T \\implies 0.01T = 1 \\implies T = 100\\text{ K}$$",
    "needs_image": False
  },
  {
    "id": "phys_ch12_q5",
    "subject": "Physics",
    "chapter": "Kinetic Theory",
    "chapter_number": 12,
    "year": 2011,
    "question": "A perfect gas at $27^\\circ\\text{C}$ is heated at constant pressure so as to double its volume. The increase in temperature of the gas will be",
    "options": [
      "600°C",
      "327°C",
      "54°C",
      "300°C"
    ],
    "correct_answer": 3,
    "explanation": "Initial temperature $T_1 = 27^\\circ\\text{C} = 27 + 273 = 300\\text{ K}$.\nAt constant pressure (Charles's law):\n$$\\frac{V_1}{T_1} = \\frac{V_2}{T_2} \\implies T_2 = T_1 \\left(\\frac{V_2}{V_1}\\right)$$\nSince $V_2 = 2V_1$:\n$$T_2 = 300 \\times 2 = 600\\text{ K} = (600 - 273)^\\circ\\text{C} = 327^\\circ\\text{C}$$\nThe increase in temperature $\\Delta T$ is:\n$$\\Delta T = T_2 - T_1 = 327^\\circ\\text{C} - 27^\\circ\\text{C} = 300^\\circ\\text{C}$$",
    "needs_image": False
  },
  {
    "id": "phys_ch12_q6",
    "subject": "Physics",
    "chapter": "Kinetic Theory",
    "chapter_number": 12,
    "year": 2017,
    "question": "The mean energy of a molecule of an ideal gas is",
    "options": [
      "$kT$",
      "$\\frac{1}{2}kT$",
      "$\\frac{3}{2}kT$",
      "$2kT$"
    ],
    "correct_answer": 2,
    "explanation": "According to the kinetic theory of gases, each molecule of an ideal gas has 3 translational degrees of freedom. By the law of equipartition of energy, each degree of freedom contributes $\\frac{1}{2}kT$. Therefore, the mean translational kinetic energy of a molecule is:\n$$E = 3 \\times \\left(\\frac{1}{2}kT\\right) = \\frac{3}{2}kT$$",
    "needs_image": False
  },
  {
    "id": "phys_ch12_q7",
    "subject": "Physics",
    "chapter": "Kinetic Theory",
    "chapter_number": 12,
    "year": 2018,
    "question": "Pressure of an ideal gas is increased by keeping temperature constant. The kinetic energy of molecules",
    "options": [
      "decreases",
      "increases",
      "remains same",
      "increases or decreases depending on the nature of gas"
    ],
    "correct_answer": 2,
    "explanation": "The average kinetic energy of the molecules of an ideal gas depends solely on its absolute temperature:\n$$E_{\\text{avg}} = \\frac{3}{2} k_B T$$\nSince the temperature is kept constant, the kinetic energy of the molecules remains same, independent of the pressure.",
    "needs_image": False
  },
  {
    "id": "phys_ch12_q8",
    "subject": "Physics",
    "chapter": "Kinetic Theory",
    "chapter_number": 12,
    "year": 2019,
    "question": "One mole of $\\text{O}_2$ gas is heated at constant pressure starting at $27^\\circ\\text{C}$. How much energy must be added to the gas as heat to double its volume?",
    "options": [
      "$750 R$",
      "Zero",
      "$1050 R$",
      "$450 R$"
    ],
    "correct_answer": 2,
    "explanation": "Initial temperature $T_1 = 27^\\circ\\text{C} = 300\\text{ K}$.\nAt constant pressure, $V \\propto T$. To double the volume ($V_2 = 2V_1$), the temperature must double:\n$$T_2 = 2 T_1 = 600\\text{ K} \\implies \\Delta T = 600 - 300 = 300\\text{ K}$$\nFor diatomic oxygen gas ($\\text{O}_2$), $C_P = \\frac{7}{2}R$.\nThe heat energy added at constant pressure is:\n$$Q = n C_P \\Delta T = 1 \\times \\left(\\frac{7}{2}R\\right) \\times 300 = 1050 R$$",
    "needs_image": False
  },
  {
    "id": "phys_ch12_q9",
    "subject": "Physics",
    "chapter": "Kinetic Theory",
    "chapter_number": 12,
    "year": 2020,
    "question": "A certain amount of heat energy is supplied to a monoatomic ideal gas which expands at constant pressure. What fraction of the heat energy is converted into work?",
    "options": [
      "$\\frac{2}{5}$",
      "$\\frac{5}{7}$",
      "1",
      "$\\frac{2}{3}$"
    ],
    "correct_answer": 0,
    "explanation": "For an isobaric expansion of an ideal gas:\n- Heat supplied: $\\Delta Q = n C_P \\Delta T$\n- Work done: $\\Delta W = P \\Delta V = n R \\Delta T = n (C_P - C_V) \\Delta T$\nThe fraction of heat converted into work is:\n$$\\frac{\\Delta W}{\\Delta Q} = \\frac{C_P - C_V}{C_P} = 1 - \\frac{C_V}{C_P} = 1 - \\frac{1}{\\gamma}$$\nFor a monoatomic gas ($C_P = \\frac{5}{2}R$, $C_V = \\frac{3}{2}R$, $\\gamma = 5/3$):\n$$\\frac{\\Delta W}{\\Delta Q} = \\frac{\\frac{5}{2}R - \\frac{3}{2}R}{\\frac{5}{2}R} = \\frac{2}{5}$$",
    "needs_image": False
  },
  {
    "id": "phys_ch12_q10",
    "subject": "Physics",
    "chapter": "Kinetic Theory",
    "chapter_number": 12,
    "year": 2021,
    "question": "A gas mixture contains monoatomic and diatomic molecules of 2 moles each. The mixture has a total internal energy of (symbols have usual meanings)",
    "options": [
      "$3RT$",
      "$5RT$",
      "$8RT$",
      "$9RT$"
    ],
    "correct_answer": 2,
    "explanation": "Internal energy of an ideal gas is given by $U = n C_V T$:\n- For $2\\text{ moles}$ of monoatomic gas ($C_V = \\frac{3}{2}R$):\n$$U_1 = 2 \\times \\left(\\frac{3}{2}RT\\right) = 3RT$$\n- For $2\\text{ moles}$ of diatomic gas ($C_V = \\frac{5}{2}R$):\n$$U_2 = 2 \\times \\left(\\frac{5}{2}RT\\right) = 5RT$$\nTotal internal energy of the mixture:\n$$U = U_1 + U_2 = 3RT + 5RT = 8RT$$",
    "needs_image": False
  },
  {
    "id": "phys_ch12_q11",
    "subject": "Physics",
    "chapter": "Kinetic Theory",
    "chapter_number": 12,
    "year": 2023,
    "question": "The speed of sound in an ideal gas at a given temperature $T$ is $v$. Then rms speed of gas molecules at that temperature is $v_{\\text{rms}}$. The ratio of the velocities $v$ and $v_{\\text{rms}}$ for helium and oxygen gases are $X$ and $X'$ respectively. Then $\\frac{X}{X'}$ is equal to",
    "options": [
      "$\\frac{21}{\\sqrt{5}}$",
      "$\\frac{5}{\\sqrt{21}}$",
      "$\\sqrt{\\frac{5}{21}}$",
      "$\\frac{21}{5}$"
    ],
    "correct_answer": 1,
    "explanation": "Speed of sound: $v = \\sqrt{\\frac{\\gamma R T}{M}}$\nRMS speed of gas molecules: $v_{\\text{rms}} = \\sqrt{\\frac{3 R T}{M}}$\nThe ratio is:\n$$\\frac{v}{v_{\\text{rms}}} = \\sqrt{\\frac{\\gamma}{3}}$$\n1. For Helium (monoatomic, $\\gamma = 5/3$):\n$$X = \\sqrt{\\frac{5/3}{3}} = \\sqrt{\\frac{5}{9}} = \\frac{\\sqrt{5}}{3}$$\n2. For Oxygen (diatomic, $\\gamma = 7/5$):\n$$X' = \\sqrt{\\frac{7/5}{3}} = \\sqrt{\\frac{7}{15}}$$\nNow calculate the ratio $\\frac{X}{X'}$:\n$$\\frac{X}{X'} = \\frac{\\sqrt{5/9}}{\\sqrt{7/15}} = \\sqrt{\\frac{5}{9} \\times \\frac{15}{7}} = \\sqrt{\\frac{25}{21}} = \\frac{5}{\\sqrt{21}}$$",
    "needs_image": False
  },
  {
    "id": "phys_ch12_q12",
    "subject": "Physics",
    "chapter": "Kinetic Theory",
    "chapter_number": 12,
    "year": 2023,
    "question": "Pressure of ideal gas at constant volume is proportional to _______.",
    "options": [
      "force between the molecules",
      "average potential energy of the molecule",
      "total energy of the gas",
      "average kinetic energy of the molecules"
    ],
    "correct_answer": 3,
    "explanation": "According to the kinetic theory of gases, the pressure of an ideal gas is related to its kinetic energy density by:\n$$P = \\frac{2}{3} E_V$$\nwhere $E_V$ is the translational kinetic energy per unit volume. Since intermolecular potential energy is zero for an ideal gas, the pressure at constant volume is directly proportional to the average kinetic energy of the gas molecules.",
    "needs_image": False
  },
  {
    "id": "phys_ch12_q13",
    "subject": "Physics",
    "chapter": "Kinetic Theory",
    "chapter_number": 12,
    "year": 2024,
    "question": "The ratio of molar specific heats of oxygen is",
    "options": [
      "1.4",
      "1.67",
      "1.33",
      "1.28"
    ],
    "correct_answer": 0,
    "explanation": "Oxygen ($\\text{O}_2$) is a rigid diatomic gas at room temperature with 5 degrees of freedom (3 translational + 2 rotational):\n$$C_V = \\frac{5}{2}R, \\quad C_P = C_V + R = \\frac{7}{2}R$$\nThe ratio of molar specific heats is:\n$$\\gamma = \\frac{C_P}{C_V} = \\frac{7/2}{5/2} = \\frac{7}{5} = 1.4$$",
    "needs_image": False
  }
]

with open('src/data/pyq_physics_ch12.json', 'w', encoding='utf-8') as f:
    json.dump(questions, f, indent=2, ensure_ascii=False)

print(f"Successfully generated src/data/pyq_physics_ch12.json with {len(questions)} questions.")
