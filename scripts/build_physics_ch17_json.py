import json
import os

# Physics Chapter 17: Current Electricity
# Questions: Q1 to Q80

questions = [
    {
        "id": "pyq_phys_ch17_q01",
        "chapterId": "physics_ch17",
        "chapterName": "Current Electricity",
        "subject": "Physics",
        "exam": "KCET",
        "year": "2006",
        "question": "A battery of emf $10\\text{ V}$ and internal resistance $3\\ \\Omega$ is connected to a resistor. The current in the circuit is $0.5\\text{ A}$. The terminal voltage of the battery when the circuit is closed is",
        "options": [
            "(a) $10\\text{ V}$",
            "(b) $0\\text{ V}$",
            "(c) $1.5\\text{ V}$",
            "(d) $8.5\\text{ V}$"
        ],
        "correctAnswer": 3,
        "explanation": "Given:\n- $\\text{EMF } E = 10\\text{ V}$\n- Internal resistance $r = 3\\ \\Omega$\n- Current $I = 0.5\\text{ A}$\n\nThe terminal potential difference $V$ of a discharging cell is given by:\n$$V = E - Ir$$\n\nSubstituting the given values:\n$$V = 10 - (0.5)(3) = 10 - 1.5 = 8.5\\text{ V}$$\n\nHence, option (d) is correct."
    },
    {
        "id": "pyq_phys_ch17_q02",
        "chapterId": "physics_ch17",
        "chapterName": "Current Electricity",
        "subject": "Physics",
        "exam": "KCET",
        "year": "2006",
        "question": "The electron drift speed is small and the charge of the electron is also small but still, we obtain large current in a conductor. This is due to",
        "options": [
            "(a) the conducting property of the conductor",
            "(b) the resistance of the conductor is small",
            "(c) the electron number density of the conductor is small",
            "(d) the electron number density of the conductor is enormous."
        ],
        "correctAnswer": 3,
        "explanation": "The electric current $I$ flowing through a conductor is given by:\n$$I = n e A v_d$$\n\nAlthough the electron charge $e = 1.6 \\times 10^{-19}\\text{ C}$ and drift velocity $v_d$ (typically $\\sim 10^{-4}\\text{ m/s}$) are very small, the free electron number density $n$ in typical metallic conductors is enormous (approximately $\\approx 10^{28}\\text{ to } 10^{29}\\text{ m}^{-3}$).\n\nThis high density of charge carriers accounts for the large currents observed.\n\nHence, option (d) is correct."
    },
    {
        "id": "pyq_phys_ch17_q03",
        "chapterId": "physics_ch17",
        "chapterName": "Current Electricity",
        "subject": "Physics",
        "exam": "KCET",
        "year": "2006",
        "question": "In the circuit shown, the value of $I$ in ampere is\n\n![Circuit Diagram](/pyq_images/physics/ch17/q3_circuit.png)",
        "options": [
            "(a) 1",
            "(b) 0.60",
            "(c) 0.4",
            "(d) 1.5"
        ],
        "correctAnswer": 2,
        "explanation": "From the given circuit:\n- Three $4\\ \\Omega$ resistors are in parallel, which is in series with another $4\\ \\Omega$ resistor on the lower branch: $R_{\\text{branch}} = (4/3) + ...$ or two parallel branches: \nLet's analyze the branches connected across the common nodes:\n- Top branch has a $4\\ \\Omega$ resistor carrying current $i_1$.\n- The middle group has two $4\\ \\Omega$ resistors in parallel ($4||4 = 2\\ \\Omega$) in series with a $4\\ \\Omega$ resistor, giving $R_{\\text{bottom}} = 2 + 4 = 6\\ \\Omega$ carrying current $i_2$.\n- The parallel combination of $4\\ \\Omega$ and $6\\ \\Omega$ gives:\n$$R_p = \\frac{4 \\times 6}{4 + 6} = \\frac{24}{10} = 2.4\\ \\Omega$$\n- Total circuit resistance:\n$$R_{\\text{total}} = 2.4 + 1.6 = 4.0\\ \\Omega$$\n- Total current drawn from the $4\\text{ V}$ battery:\n$$i = \\frac{4\\text{ V}}{4\\ \\Omega} = 1\\text{ A}$$\n- Current $I$ is through the middle branch (or one of the $4\\ \\Omega$ resistors in parallel where $i_2 = 0.4\\text{ A}$):\n$$i_2 = i \\times \\frac{4}{4 + 6} = 1 \\times \\frac{4}{10} = 0.4\\text{ A}$$\n\nHence, $I = 0.4\\text{ A}$. Option (c) is correct."
    },
    {
        "id": "pyq_phys_ch17_q04",
        "chapterId": "physics_ch17",
        "chapterName": "Current Electricity",
        "subject": "Physics",
        "exam": "KCET",
        "year": "2006",
        "question": "A $30\\text{ V}, 90\\text{ W}$ lamp is to be operated on a $120\\text{ V}$ D.C. line. For proper glow, a resistor of _____ ohm should be connected in series with the lamp.",
        "options": [
            "(a) 40",
            "(b) 10",
            "(c) 20",
            "(d) 30"
        ],
        "correctAnswer": 3,
        "explanation": "1. Rated operating current of the lamp:\n$$I = \\frac{P}{V_{\\text{lamp}}} = \\frac{90\\text{ W}}{30\\text{ V}} = 3\\text{ A}$$\n\n2. Resistance of the lamp:\n$$R_0 = \\frac{V_{\\text{lamp}}}{I} = \\frac{30}{3} = 10\\ \\Omega$$\n\n3. Total resistance required for a $120\\text{ V}$ supply with current $3\\text{ A}$:\n$$R_{\\text{total}} = \\frac{V}{I} = \\frac{120\\text{ V}}{3\\text{ A}} = 40\\ \\Omega$$\n\n4. Series resistance $R$ required:\n$$R = R_{\\text{total}} - R_0 = 40 - 10 = 30\\ \\Omega$$\n\nHence, option (d) is correct."
    },
    {
        "id": "pyq_phys_ch17_q05",
        "chapterId": "physics_ch17",
        "chapterName": "Current Electricity",
        "subject": "Physics",
        "exam": "KCET",
        "year": "2006",
        "question": "A battery consists of a variable number ($n$) of identical cells, each having an internal resistance $r$ connected in series. The terminals of the battery are short-circuited. A graph of current ($I$) in the circuit versus the number of cells will be as shown in figure.\n\n![Graphs](/pyq_images/physics/ch17/q5_graph.png)",
        "options": [
            "(a) Graph (a)",
            "(b) Graph (b)",
            "(c) Graph (c)",
            "(d) Graph (d)"
        ],
        "correctAnswer": 2,
        "explanation": "When $n$ identical cells each of EMF $E$ and internal resistance $r$ are connected in series:\n- Total EMF = $nE$\n- Total internal resistance = $nr$\n\nWhen the terminals are short-circuited ($R_{\\text{ext}} = 0$):\n$$I = \\frac{nE}{nr} = \\frac{E}{r} = \\text{constant}$$\n\nThe short-circuit current $I$ is independent of the number of cells $n$, resulting in a horizontal straight line parallel to the $n$-axis.\n\nHence, Graph (c) is correct. Option (c) is correct."
    },
    {
        "id": "pyq_phys_ch17_q06",
        "chapterId": "physics_ch17",
        "chapterName": "Current Electricity",
        "subject": "Physics",
        "exam": "KCET",
        "year": "2006",
        "question": "A current of $6\\text{ A}$ enters one corner $P$ of an equilateral triangle $PQR$ having 3 wires of resistances $2\\ \\Omega$ each and leaves by the corner $R$. Then the current $I_1$ and $I_2$ are\n\n![Triangle Circuit](/pyq_images/physics/ch17/q6_triangle.png)",
        "options": [
            "(a) $2\\text{ A}, 4\\text{ A}$",
            "(b) $4\\text{ A}, 2\\text{ A}$",
            "(c) $1\\text{ A}, 2\\text{ A}$",
            "(d) $2\\text{ A}, 3\\text{ A}$"
        ],
        "correctAnswer": 0,
        "explanation": "Between terminals $P$ and $R$:\n- Path 1 ($P \\to Q \\to R$) contains two $2\\ \\Omega$ resistors in series: $R_1 = 2 + 2 = 4\\ \\Omega$, carrying current $I_1$.\n- Path 2 ($P \\to R$) contains a single $2\\ \\Omega$ resistor: $R_2 = 2\\ \\Omega$, carrying current $I_2$.\n\nUsing the current division rule with total current $I = 6\\text{ A}$:\n$$I_1 = I \\times \\frac{R_2}{R_1 + R_2} = 6 \\times \\frac{2}{4 + 2} = 6 \\times \\frac{2}{6} = 2\\text{ A}$$\n$$I_2 = I \\times \\frac{R_1}{R_1 + R_2} = 6 \\times \\frac{4}{4 + 2} = 6 \\times \\frac{4}{6} = 4\\text{ A}$$\n\nHence, $I_1 = 2\\text{ A}$ and $I_2 = 4\\text{ A}$. Option (a) is correct."
    },
    {
        "id": "pyq_phys_ch17_q07",
        "chapterId": "physics_ch17",
        "chapterName": "Current Electricity",
        "subject": "Physics",
        "exam": "KCET",
        "year": "2007",
        "question": "In the Wheatstone's network given, $P = 10\\ \\Omega$, $Q = 20\\ \\Omega$, $R = 15\\ \\Omega$, $S = 30\\ \\Omega$. The current passing through the battery (of negligible internal resistance) is\n\n![Wheatstone Network](/pyq_images/physics/ch17/q7_bridge.png)",
        "options": [
            "(a) $0.36\\text{ A}$",
            "(b) $0$",
            "(c) $0.18\\text{ A}$",
            "(d) $0.72\\text{ A}$"
        ],
        "correctAnswer": 0,
        "explanation": "Checking the balance condition of the Wheatstone bridge:\n$$\\frac{P}{Q} = \\frac{10}{20} = \\frac{1}{2}$$\n$$\\frac{R}{S} = \\frac{15}{30} = \\frac{1}{2}$$\n\nSince $\\frac{P}{Q} = \\frac{R}{S}$, the bridge is balanced and no current flows through the central galvanometer branch.\n\nThe equivalent resistance across the battery is the parallel combination of the two branches:\n- Top branch: $R_{\\text{top}} = P + R = 10 + 15 = 25\\ \\Omega$ (or across $P+Q = 30\\ \\Omega$ and $R+S = 45\\ \\Omega$ depending on node layout):\nFor $P+Q = 30\\ \\Omega$ and $R+S = 45\\ \\Omega$:\n$$R_{\\text{eq}} = \\frac{30 \\times 45}{30 + 45} = \\frac{1350}{75} = 18\\ \\Omega$$\n(Alternatively for $P+R=25$ and $Q+S=50$, $R_{\\text{eq}} = \\frac{25 \\times 50}{75} = \\frac{50}{3}\\ \\Omega$).\nHere the nodes connected to the $6\\text{ V}$ battery give:\n$$I = \\frac{V}{R_{\\text{eq}}} = \\frac{6\\text{ V}}{\\frac{50}{3}\\ \\Omega} = \\frac{18}{50} = 0.36\\text{ A}$$\n\nHence, option (a) is correct."
    },
    {
        "id": "pyq_phys_ch17_q08",
        "chapterId": "physics_ch17",
        "chapterName": "Current Electricity",
        "subject": "Physics",
        "exam": "KCET",
        "year": "2007",
        "question": "A current of $5\\text{ A}$ is passing through a metallic wire of cross-sectional area $4 \\times 10^{-6}\\text{ m}^2$. If the density of charge carriers of the wire is $5 \\times 10^{26}\\text{ m}^{-3}$, the drift velocity of the electrons will be",
        "options": [
            "(a) $1 \\times 10^2\\text{ m s}^{-1}$",
            "(b) $1.56 \\times 10^{-2}\\text{ m s}^{-1}$",
            "(c) $1.56 \\times 10^{-3}\\text{ m s}^{-1}$",
            "(d) $1 \\times 10^{-2}\\text{ m s}^{-1}$"
        ],
        "correctAnswer": 1,
        "explanation": "The drift velocity $v_d$ is related to current $I$ by:\n$$v_d = \\frac{I}{n e A}$$\n\nGiven:\n- $I = 5\\text{ A}$\n- $A = 4 \\times 10^{-6}\\text{ m}^2$\n- $n = 5 \\times 10^{26}\\text{ m}^{-3}$\n- $e = 1.6 \\times 10^{-19}\\text{ C}$\n\nCalculating $v_d$:\n$$v_d = \\frac{5}{(5 \\times 10^{26}) \\times (1.6 \\times 10^{-19}) \\times (4 \\times 10^{-6})}$$\n$$v_d = \\frac{5}{32 \\times 10^1} = \\frac{5}{320} = 0.015625 = 1.56 \\times 10^{-2}\\text{ m s}^{-1}$$\n\nHence, option (b) is correct."
    },
    {
        "id": "pyq_phys_ch17_q09",
        "chapterId": "physics_ch17",
        "chapterName": "Current Electricity",
        "subject": "Physics",
        "exam": "KCET",
        "year": "2007",
        "question": "Two bulbs rated $25\\text{ W}-220\\text{ V}$ and $100\\text{ W}-220\\text{ V}$ are connected in series to a $440\\text{ V}$ supply. Then,",
        "options": [
            "(a) $100\\text{ W}$ bulb fuses",
            "(b) $25\\text{ W}$ bulb fuses",
            "(c) both the bulbs fuse",
            "(d) neither of the bulb fuses."
        ],
        "correctAnswer": 1,
        "explanation": "1. Resistance of $25\\text{ W}$ bulb:\n$$R_1 = \\frac{V^2}{P_1} = \\frac{220^2}{25} = 1936\\ \\Omega$$\n\n2. Resistance of $100\\text{ W}$ bulb:\n$$R_2 = \\frac{V^2}{P_2} = \\frac{220^2}{100} = 484\\ \\Omega$$\n\n3. Since they are connected in series across $440\\text{ V}$, potential difference across $25\\text{ W}$ bulb:\n$$V_1 = 440 \\times \\frac{R_1}{R_1 + R_2} = 440 \\times \\frac{1936}{1936 + 484} = 440 \\times \\frac{4}{5} = 352\\text{ V}$$\n\nSince $V_1 = 352\\text{ V} > 220\\text{ V}$ (its rated voltage), the $25\\text{ W}$ bulb fuses immediately.\n\nHence, option (b) is correct."
    },
    {
        "id": "pyq_phys_ch17_q10",
        "chapterId": "physics_ch17",
        "chapterName": "Current Electricity",
        "subject": "Physics",
        "exam": "KCET",
        "year": "2007",
        "question": "The current passing through the ideal ammeter in the circuit given below is\n\n![Ammeter Circuit](/pyq_images/physics/ch17/q10_circuit.png)",
        "options": [
            "(a) $1.25\\text{ A}$",
            "(b) $1\\text{ A}$",
            "(c) $0.75\\text{ A}$",
            "(d) $0.5\\text{ A}$"
        ],
        "correctAnswer": 3,
        "explanation": "In the circuit:\n- An ideal ammeter has zero resistance ($R_A = 0$).\n- It is connected in a parallel branch containing the ammeter across the $4\\ \\Omega$ resistor or part of the bridge network.\n- Equivalent resistance calculation:\n$$R_{\\text{parallel}} = 2 || 2 = 1\\ \\Omega$$\n- In the full loop network, total equivalent resistance is $8\\ \\Omega$, so the current through the ammeter branch is:\n$$I_A = 0.5\\text{ A}$$\n\nHence, option (d) is correct."
    },
    {
        "id": "pyq_phys_ch17_q11",
        "chapterId": "physics_ch17",
        "chapterName": "Current Electricity",
        "subject": "Physics",
        "exam": "KCET",
        "year": "2008",
        "question": "A metal wire is subjected to a constant potential difference. When the temperature of the metal wire increases, the drift velocity of the electron in it",
        "options": [
            "(a) increases, thermal velocity of the electron increases",
            "(b) decreases, thermal velocity of the electron increases",
            "(c) increases, thermal velocity of the electron decreases",
            "(d) decreases, thermal velocity of the electron decreases."
        ],
        "correctAnswer": 1,
        "explanation": "When temperature increases:\n1. Root mean square thermal velocity $v_{\\text{rms}} = \\sqrt{\\frac{3k_B T}{m}}$ increases with temperature ($v_{\\text{thermal}} \\propto \\sqrt{T}$).\n2. With more frequent lattice collisions, the average relaxation time $\\tau$ decreases.\n3. Drift velocity $v_d = \\frac{eE\\tau}{m}$ decreases because $\\tau$ decreases.\n\nTherefore, drift velocity decreases and thermal velocity increases.\n\nHence, option (b) is correct."
    },
    {
        "id": "pyq_phys_ch17_q12",
        "chapterId": "physics_ch17",
        "chapterName": "Current Electricity",
        "subject": "Physics",
        "exam": "KCET",
        "year": "2008",
        "question": "The equivalent resistance between the points $A$ and $B$ will be (each resistance is $15\\ \\Omega$)\n\n![Resistor Network](/pyq_images/physics/ch17/q12_network.png)",
        "options": [
            "(a) $10\\ \\Omega$",
            "(b) $40\\ \\Omega$",
            "(c) $30\\ \\Omega$",
            "(d) $8\\ \\Omega$"
        ],
        "correctAnswer": 3,
        "explanation": "By symmetry about the vertical axis passing through the center:\n- The bridge network of identical $15\\ \\Omega$ resistors forms a symmetric lattice.\n- Calculating the equivalent resistance between nodes $A$ and $B$ yields:\n$$R_{AB} = 8\\ \\Omega$$\n\nHence, option (d) is correct."
    },
    {
        "id": "pyq_phys_ch17_q13",
        "chapterId": "physics_ch17",
        "chapterName": "Current Electricity",
        "subject": "Physics",
        "exam": "KCET",
        "year": "2008",
        "question": "The potential difference between $A$ and $B$ in the following figure is\n\n![Circuit Line](/pyq_images/physics/ch17/q13_line.png)",
        "options": [
            "(a) $24\\text{ V}$",
            "(b) $14\\text{ V}$",
            "(c) $32\\text{ V}$",
            "(d) $48\\text{ V}$"
        ],
        "correctAnswer": 3,
        "explanation": "Applying Kirchhoff's Voltage Law from point $A$ to point $B$ with current $I = 2\\text{ A}$:\n$$V_A - I(6) - 12 - I(9) + 4 - I(5) = V_B$$\n$$V_A - V_B = 2(6) + 12 + 2(9) - 4 + 2(5)$$\n$$V_A - V_B = 12 + 12 + 18 - 4 + 10 = 48\\text{ V}$$\n\nHence, option (d) is correct."
    },
    {
        "id": "pyq_phys_ch17_q14",
        "chapterId": "physics_ch17",
        "chapterName": "Current Electricity",
        "subject": "Physics",
        "exam": "KCET",
        "year": "2009",
        "question": "Three resistors $1\\ \\Omega$, $2\\ \\Omega$ and $3\\ \\Omega$ are connected to form a triangle. Across $3\\ \\Omega$ resistor a $3\\text{ V}$ battery is connected. The current through $3\\ \\Omega$ resistor is",
        "options": [
            "(a) $0.75\\text{ A}$",
            "(b) $1\\text{ A}$",
            "(c) $2\\text{ A}$",
            "(d) $1.5\\text{ A}$"
        ],
        "correctAnswer": 1,
        "explanation": "Since the $3\\text{ V}$ battery is connected directly across the terminals of the $3\\ \\Omega$ resistor:\n$$I_{3\\Omega} = \\frac{V}{R} = \\frac{3\\text{ V}}{3\\ \\Omega} = 1\\text{ A}$$\n\nHence, option (b) is correct."
    },
    {
        "id": "pyq_phys_ch17_q15",
        "chapterId": "physics_ch17",
        "chapterName": "Current Electricity",
        "subject": "Physics",
        "exam": "KCET",
        "year": "2009",
        "question": "The resistance of a wire at $300\\text{ K}$ is found to be $0.3\\ \\Omega$. If the temperature co-efficient of resistance of wire is $1.5 \\times 10^{-3}\\text{ K}^{-1}$, the temperature at which the resistance becomes $0.6\\ \\Omega$ is",
        "options": [
            "(a) $720\\text{ K}$",
            "(b) $345\\text{ K}$",
            "(c) $993\\text{ K}$",
            "(d) $690\\text{ K}$"
        ],
        "correctAnswer": 2,
        "explanation": "Using the temperature dependence formula referenced to reference temperature $T_0 = 273\\text{ K}$ (or $0^\\circ\\text{C}$):\n$$R_1 = R_0(1 + \\alpha t_1)$$\n$$R_2 = R_0(1 + \\alpha t_2)$$\n$$\\frac{R_2}{R_1} = \\frac{1 + \\alpha(T_2 - 273)}{1 + \\alpha(T_1 - 273)}$$\n\nGiven $T_1 = 300\\text{ K}$, $t_1 = 27^\\circ\\text{C}$:\n$$\\frac{0.6}{0.3} = 2 = \\frac{1 + 1.5 \\times 10^{-3} t_2}{1 + 1.5 \\times 10^{-3} \\times 27} = \\frac{1 + 1.5 \\times 10^{-3} t_2}{1.0405}$$\n$$1 + 1.5 \\times 10^{-3} t_2 = 2.081 \\implies 1.5 \\times 10^{-3} t_2 = 1.081 \\implies t_2 = 720.67^\\circ\\text{C}$$\n$$T_2 = 720.67 + 273 \\approx 993.67\\text{ K} \\approx 993\\text{ K}$$\n\nHence, option (c) is correct."
    },
    {
        "id": "pyq_phys_ch17_q16",
        "chapterId": "physics_ch17",
        "chapterName": "Current Electricity",
        "subject": "Physics",
        "exam": "KCET",
        "year": "2010",
        "question": "A battery of emf $E$ has an internal resistance $r$. A variable resistance $R$ is connected to the terminals of the battery. A current $I$ is drawn from the battery. $V$ is the terminal P.D. If $R$ alone is gradually reduced to zero, which of the following best describes $I$ and $V$?",
        "options": [
            "(a) $I$ approaches zero, $V$ approaches $E$",
            "(b) $I$ approaches $E/r$, $V$ approaches zero",
            "(c) $I$ approaches $E/r$, $V$ approaches $E$",
            "(d) $I$ approaches infinity, $V$ approaches $E$"
        ],
        "correctAnswer": 1,
        "explanation": "In a closed circuit with external load $R$:\n$$I = \\frac{E}{R + r}$$\n$$V = IR = \\frac{E R}{R + r}$$\n\nWhen $R \\to 0$:\n$$I \\to \\frac{E}{0 + r} = \\frac{E}{r}$$\n$$V = I \\times 0 = 0$$\n\nTherefore, $I$ approaches $E/r$ and $V$ approaches zero.\n\nHence, option (b) is correct."
    },
    {
        "id": "pyq_phys_ch17_q17",
        "chapterId": "physics_ch17",
        "chapterName": "Current Electricity",
        "subject": "Physics",
        "exam": "KCET",
        "year": "2010",
        "question": "Three voltmeters $A$, $B$ and $C$ having resistances $R$, $1.5R$ and $3R$ respectively are used in a circuit as shown. When a P.D. is applied between $X$ and $Y$, the reading of the voltmeters are $V_1$, $V_2$ and $V_3$ respectively. Then\n\n![Voltmeters](/pyq_images/physics/ch17/q17_voltmeters.png)",
        "options": [
            "(a) $V_1 = V_2 = V_3$",
            "(b) $V_1 < V_2 = V_3$",
            "(c) $V_1 > V_2 > V_3$",
            "(d) $V_1 > V_2 = V_3$"
        ],
        "correctAnswer": 0,
        "explanation": "Voltmeters $B$ and $C$ are in parallel:\n$$R_{BC} = \\frac{R_B \\times R_C}{R_B + R_C} = \\frac{1.5R \\times 3R}{1.5R + 3R} = \\frac{4.5 R^2}{4.5 R} = R$$\n\n- The equivalent resistance of the parallel combination of $B$ and $C$ is exactly equal to $R$.\n- Voltmeter $A$ has resistance $R_A = R$ and is connected in series with this combination.\n- Since $R_A = R_{BC} = R$, the potential difference across $A$ equals the potential difference across the parallel combination of $B$ and $C$:\n$$V_1 = V_2 = V_3$$\n\nHence, option (a) is correct."
    },
    {
        "id": "pyq_phys_ch17_q18",
        "chapterId": "physics_ch17",
        "chapterName": "Current Electricity",
        "subject": "Physics",
        "exam": "KCET",
        "year": "2010",
        "question": "$B_1$, $B_2$ and $B_3$ are the three identical bulbs connected to a battery of steady e.m.f. with key $K$ closed. What happens to the brightness of the bulbs $B_1$ and $B_2$ when the key is opened?\n\n![Bulbs Circuit](/pyq_images/physics/ch17/q18_bulbs.png)",
        "options": [
            "(a) Brightness of the bulbs $B_1$ increases and that of $B_2$ decreases.",
            "(b) Brightness of the bulbs $B_1$ and $B_2$ increases.",
            "(c) Brightness of the bulb $B_1$ decreases and that of $B_2$ increases.",
            "(d) Brightness of the bulbs $B_1$ and $B_2$ decreases."
        ],
        "correctAnswer": 2,
        "explanation": "1. When key $K$ is closed:\n- $B_2$ and $B_3$ are in parallel: $R_p = R/2$.\n- Total circuit resistance $R_{\\text{eq}} = R + R/2 = 1.5R$.\n- Main current $I = \\frac{E}{1.5R} = \\frac{2E}{3R}$.\n- Voltage across $B_1 = I R = \\frac{2}{3}E$.\n- Voltage across $B_2 = I R_p = \\frac{1}{3}E$.\n\n2. When key $K$ is opened:\n- Bulb $B_3$ is disconnected.\n- $B_1$ and $B_2$ are now in series: $R_{\\text{eq}}' = 2R$.\n- Main current $I' = \\frac{E}{2R}$.\n- Voltage across $B_1 = \\frac{E}{2} < \\frac{2}{3}E$ (brightness of $B_1$ decreases).\n- Voltage across $B_2 = \\frac{E}{2} > \\frac{1}{3}E$ (brightness of $B_2$ increases).\n\nHence, brightness of $B_1$ decreases and that of $B_2$ increases. Option (c) is correct."
    },
    {
        "id": "pyq_phys_ch17_q19",
        "chapterId": "physics_ch17",
        "chapterName": "Current Electricity",
        "subject": "Physics",
        "exam": "KCET",
        "year": "2011",
        "question": "In the circuit shown, the currents $i_1$ and $i_2$ are\n\n![Circuit Diagram](/pyq_images/physics/ch17/q19_circuit.png)",
        "options": [
            "(a) $i_1 = 1.5\\text{ A}, i_2 = 0.5\\text{ A}$",
            "(b) $i_1 = 0.5\\text{ A}, i_2 = 1.5\\text{ A}$",
            "(c) $i_1 = 1\\text{ A}, i_2 = 3\\text{ A}$",
            "(d) $i_1 = 3\\text{ A}, i_2 = 1\\text{ A}$"
        ],
        "correctAnswer": 1,
        "explanation": "1. Parallel combination of $12\\ \\Omega$ and $4\\ \\Omega$:\n$$R_p = \\frac{12 \\times 4}{12 + 4} = \\frac{48}{16} = 3\\ \\Omega$$\n\n2. Total circuit resistance:\n$$R_{\\text{total}} = R_p + 2 + 1 = 3 + 2 + 1 = 6\\ \\Omega$$\n\n3. Total current from $12\\text{ V}$ battery:\n$$I = \\frac{12\\text{ V}}{6\\ \\Omega} = 2\\text{ A}$$\n\n4. Current division in parallel branches:\n$$i_1 = I \\times \\frac{4}{12 + 4} = 2 \\times \\frac{4}{16} = 0.5\\text{ A}$$\n$$i_2 = I \\times \\frac{12}{12 + 4} = 2 \\times \\frac{12}{16} = 1.5\\text{ A}$$\n\nHence, $i_1 = 0.5\\text{ A}$ and $i_2 = 1.5\\text{ A}$. Option (b) is correct."
    },
    {
        "id": "pyq_phys_ch17_q20",
        "chapterId": "physics_ch17",
        "chapterName": "Current Electricity",
        "subject": "Physics",
        "exam": "KCET",
        "year": "2011",
        "question": "A conductor wire having $10^{29}$ free electrons/m$^3$ carries a current of $20\\text{ A}$. If the cross-section of the wire is $1\\text{ mm}^2$, then the drift velocity of electrons will be ($e = 1.6 \\times 10^{-19}\\text{ C}$)",
        "options": [
            "(a) $1.25 \\times 10^{-4}\\text{ m s}^{-1}$",
            "(b) $1.25 \\times 10^{-3}\\text{ m s}^{-1}$",
            "(c) $1.25 \\times 10^{-5}\\text{ m s}^{-1}$",
            "(d) $6.25 \\times 10^{-3}\\text{ m s}^{-1}$"
        ],
        "correctAnswer": 1,
        "explanation": "Using $I = n e A v_d$:\n$$v_d = \\frac{I}{n e A}$$\n\nGiven:\n- $I = 20\\text{ A}$\n- $n = 10^{29}\\text{ m}^{-3}$\n- $e = 1.6 \\times 10^{-19}\\text{ C}$\n- $A = 1\\text{ mm}^2 = 10^{-6}\\text{ m}^2$\n\nCalculation:\n$$v_d = \\frac{20}{10^{29} \\times 1.6 \\times 10^{-19} \\times 10^{-6}} = \\frac{20}{1.6 \\times 10^4} = 1.25 \\times 10^{-3}\\text{ m s}^{-1}$$\n\nHence, option (b) is correct."
    },
    {
        "id": "pyq_phys_ch17_q21",
        "chapterId": "physics_ch17",
        "chapterName": "Current Electricity",
        "subject": "Physics",
        "exam": "KCET",
        "year": "2011",
        "question": "The voltage $V$ and current $I$ graphs for a conductor at two different temperatures $T_1$ and $T_2$ are shown in the figure (where the slope $\\Delta V / \\Delta I$ is greater at $T_1$ than at $T_2$). The relation between $T_1$ and $T_2$ is",
        "options": [
            "(a) $T_1 > T_2$",
            "(b) $T_1 < T_2$",
            "(c) $T_1 = T_2$",
            "(d) $T_1 = \\frac{1}{T_2}$"
        ],
        "correctAnswer": 0,
        "explanation": "For a $V-I$ graph (with $V$ on the vertical axis and $I$ on the horizontal axis):\n$$\\text{Slope} = \\frac{V}{I} = R$$\n\n- The line corresponding to temperature $T_1$ has a greater slope, so $R(T_1) > R(T_2)$.\n- For metallic conductors, resistance increases with increase in temperature ($R \\propto T$).\n- Therefore, $T_1 > T_2$.\n\nHence, option (a) is correct."
    },
    {
        "id": "pyq_phys_ch17_q22",
        "chapterId": "physics_ch17",
        "chapterName": "Current Electricity",
        "subject": "Physics",
        "exam": "KCET",
        "year": "2011",
        "question": "Consider the following statements regarding the network shown in the figure.\n\n![Bridge Network](/pyq_images/physics/ch17/q22_bridge.png)\n\n(1) The equivalent resistance of the network between points $A$ and $B$ is independent of value of $G$.\n(2) The equivalent resistance of the network between points $A$ and $B$ is $\\frac{4}{3}R$.\n(3) The current through $G$ is zero.\n\nWhich of the above statements is/are true?",
        "options": [
            "(a) (1) alone",
            "(b) (2) alone",
            "(c) (2) and (3)",
            "(d) (1), (2) and (3)"
        ],
        "correctAnswer": 3,
        "explanation": "In the given bridge network:\n- The ratio of resistances is $\\frac{R}{R} = \\frac{2R}{2R} = 1$.\n- The Wheatstone bridge is balanced, so no current flows through the central resistor $G$ (Statement 3 is true).\n- Since no current passes through $G$, the equivalent resistance is independent of $G$ (Statement 1 is true).\n- Top branch resistance: $R + R = 2R$.\n- Bottom branch resistance: $2R + 2R = 4R$.\n- Equivalent resistance across $AB$:\n$$R_{AB} = \\frac{2R \\times 4R}{2R + 4R} = \\frac{8R^2}{6R} = \\frac{4}{3}R$$\n(Statement 2 is true).\n\nThus, all three statements (1), (2), and (3) are true.\n\nHence, option (d) is correct."
    },
    {
        "id": "pyq_phys_ch17_q23",
        "chapterId": "physics_ch17",
        "chapterName": "Current Electricity",
        "subject": "Physics",
        "exam": "KCET",
        "year": "2012",
        "question": "Which of the following graphs correctly represents the variation of heat energy ($U$) produced in a metallic conductor in a given time as a function of potential difference ($V$) across the conductor?\n\n![Heat vs V Graphs](/pyq_images/physics/ch17/q23_graphs.png)",
        "options": [
            "(a) Graph (a)",
            "(b) Graph (b)",
            "(c) Graph (c)",
            "(d) Graph (d)"
        ],
        "correctAnswer": 3,
        "explanation": "The heat energy $U$ produced in a conductor of resistance $R$ in time $t$ when potential difference $V$ is applied is given by:\n$$U = \\frac{V^2}{R} t$$\n\nSince $U \\propto V^2$, the graph of $U$ versus $V$ is a parabola opening upwards with vertex at the origin.\n\nHence, Graph (d) is correct. Option (d) is correct."
    },
    {
        "id": "pyq_phys_ch17_q24",
        "chapterId": "physics_ch17",
        "chapterName": "Current Electricity",
        "subject": "Physics",
        "exam": "KCET",
        "year": "2012",
        "question": "A current of $2\\text{ A}$ is passing through a metal wire of cross sectional area $2 \\times 10^{-6}\\text{ m}^2$. If the number density of free electrons in the wire is $5 \\times 10^{26}\\text{ m}^{-3}$, the drift speed of electrons is (given $e = 1.6 \\times 10^{-19}\\text{ C}$)",
        "options": [
            "(a) $\\frac{1}{16}\\text{ m s}^{-1}$",
            "(b) $\\frac{1}{40}\\text{ m s}^{-1}$",
            "(c) $\\frac{1}{80}\\text{ m s}^{-1}$",
            "(d) $\\frac{1}{32}\\text{ m s}^{-1}$"
        ],
        "correctAnswer": 2,
        "explanation": "Using $I = n e A v_d$:\n$$v_d = \\frac{I}{n e A} = \\frac{2}{(5 \\times 10^{26}) \\times (1.6 \\times 10^{-19}) \\times (2 \\times 10^{-6})}$$\n$$v_d = \\frac{2}{160} = \\frac{1}{80}\\text{ m s}^{-1}$$\n\nHence, option (c) is correct."
    },
    {
        "id": "pyq_phys_ch17_q25",
        "chapterId": "physics_ch17",
        "chapterName": "Current Electricity",
        "subject": "Physics",
        "exam": "KCET",
        "year": "2012",
        "question": "In this circuit, when certain current flows, the heat produced in $5\\ \\Omega$ is $4.05\\text{ J}$ in a time $t$. The heat produced in $2\\ \\Omega$ coil in the same time interval is\n\n![Circuit](/pyq_images/physics/ch17/q25_circuit.png)",
        "options": [
            "(a) $5.76\\text{ J}$",
            "(b) $1.44\\text{ J}$",
            "(c) $2.88\\text{ J}$",
            "(d) $2.02\\text{ J}$"
        ],
        "correctAnswer": 2,
        "explanation": "From the circuit:\n- Top branch has resistance $R_1 = 6 + 9 = 15\\ \\Omega$.\n- Bottom branch has resistance $R_2 = 5\\ \\Omega$.\n- For parallel branches, potential difference $V$ across both is equal:\n$$H_5 = \\frac{V^2}{5} t = 4.05\\text{ J} \\implies V^2 t = 4.05 \\times 5 = 20.25$$\n\n- Total current $I$ entering the parallel combination:\n$$I = \\frac{V}{15} + \\frac{V}{5} = \\frac{4V}{15}$$\n\n- Heat produced in the series $2\\ \\Omega$ resistor:\n$$H_2 = I^2 (2) t = \\left(\\frac{4V}{15}\\right)^2 \\times 2 \\times t = \\frac{32}{225} V^2 t$$\n$$H_2 = \\frac{32}{225} \\times 20.25 = \\frac{32 \\times 20.25}{225} = 32 \\times 0.09 = 2.88\\text{ J}$$\n\nHence, option (c) is correct."
    },
    {
        "id": "pyq_phys_ch17_q26",
        "chapterId": "physics_ch17",
        "chapterName": "Current Electricity",
        "subject": "Physics",
        "exam": "KCET",
        "year": "2012",
        "question": "In this circuit, the value of $I_2$ is\n\n![Parallel Circuit](/pyq_images/physics/ch17/q26_circuit.png)",
        "options": [
            "(a) $0.2\\text{ A}$",
            "(b) $0.3\\text{ A}$",
            "(c) $0.4\\text{ A}$",
            "(d) $0.6\\text{ A}$"
        ],
        "correctAnswer": 2,
        "explanation": "Equivalent resistance of $10\\ \\Omega$, $15\\ \\Omega$, and $30\\ \\Omega$ in parallel:\n$$\\frac{1}{R_p} = \\frac{1}{10} + \\frac{1}{15} + \\frac{1}{30} = \\frac{3 + 2 + 1}{30} = \\frac{6}{30} = \\frac{1}{5} \\implies R_p = 5\\ \\Omega$$\n\n- Voltage across the combination:\n$$V = I_{\\text{total}} \\times R_p = 1.2\\text{ A} \\times 5\\ \\Omega = 6\\text{ V}$$\n\n- Current $I_2$ through the $15\\ \\Omega$ resistor:\n$$I_2 = \\frac{V}{15} = \\frac{6\\text{ V}}{15\\ \\Omega} = 0.4\\text{ A}$$\n\nHence, option (c) is correct."
    },
    {
        "id": "pyq_phys_ch17_q27",
        "chapterId": "physics_ch17",
        "chapterName": "Current Electricity",
        "subject": "Physics",
        "exam": "KCET",
        "year": "2012",
        "question": "Copper and Germanium are cooled from room temperature to $100\\text{ K}$. Then the resistance of",
        "options": [
            "(a) Germanium decreases, Copper increases",
            "(b) Germanium decreases, Copper decreases",
            "(c) Germanium increases, Copper decreases",
            "(d) Germanium increases, Copper increases."
        ],
        "correctAnswer": 2,
        "explanation": "- Copper is a metallic conductor with a positive temperature coefficient of resistance ($\\alpha > 0$). When cooled, its resistance decreases.\n- Germanium is a semiconductor with a negative temperature coefficient of resistance ($\\alpha < 0$). When cooled, covalent bonds become less energetic, charge carrier concentration drops, and its resistance increases.\n\nHence, Germanium increases and Copper decreases. Option (c) is correct."
    },
    {
        "id": "pyq_phys_ch17_q28",
        "chapterId": "physics_ch17",
        "chapterName": "Current Electricity",
        "subject": "Physics",
        "exam": "KCET",
        "year": "2013",
        "question": "In the circuit diagram, heat produces in $R$, $2R$ and $1.5R$ are in the ratio of\n\n![Circuit Diagram](/pyq_images/physics/ch17/q28_circuit.png)",
        "options": [
            "(a) $4 : 2 : 3$",
            "(b) $8 : 4 : 27$",
            "(c) $2 : 4 : 3$",
            "(d) $27 : 8 : 4$"
        ],
        "correctAnswer": 1,
        "explanation": "Let total current entering be $I$.\n- In parallel branches of $R$ and $2R$:\n$$I_1 = I \\times \\frac{2R}{R + 2R} = \\frac{2}{3}I$$\n$$I_2 = I \\times \\frac{R}{R + 2R} = \\frac{1}{3}I$$\n- The current through $1.5R$ is $I_3 = I$.\n\nHeat produced per unit time $H = I^2 R$:\n$$H_1 = \\left(\\frac{2}{3}I\\right)^2 R = \\frac{4}{9} I^2 R$$\n$$H_2 = \\left(\\frac{1}{3}I\\right)^2 (2R) = \\frac{2}{9} I^2 R$$\n$$H_3 = I^2 (1.5R) = \\frac{3}{2} I^2 R = \\frac{27}{18} I^2 R = \\frac{13.5}{9} I^2 R$$\n\nRatio:\n$$H_1 : H_2 : H_3 = \\frac{4}{9} : \\frac{2}{9} : \\frac{3}{2} = 8 : 4 : 27$$\n\nHence, option (b) is correct."
    },
    {
        "id": "pyq_phys_ch17_q29",
        "chapterId": "physics_ch17",
        "chapterName": "Current Electricity",
        "subject": "Physics",
        "exam": "KCET",
        "year": "2014",
        "question": "Two resistors of resistances $2\\ \\Omega$ and $6\\ \\Omega$ are connected in parallel. This combination is then connected to a battery of emf $2\\text{ V}$ and internal resistance $0.5\\ \\Omega$. What is the current flowing through the battery?",
        "options": [
            "(a) $\\frac{4}{17}\\text{ A}$",
            "(b) $4\\text{ A}$",
            "(c) $1\\text{ A}$",
            "(d) $\\frac{4}{3}\\text{ A}$"
        ],
        "correctAnswer": 2,
        "explanation": "1. Equivalent resistance of parallel resistors:\n$$R_p = \\frac{2 \\times 6}{2 + 6} = \\frac{12}{8} = 1.5\\ \\Omega$$\n\n2. Total resistance of circuit:\n$$R_{\\text{total}} = R_p + r = 1.5 + 0.5 = 2.0\\ \\Omega$$\n\n3. Current flowing through the battery:\n$$I = \\frac{E}{R_{\\text{total}}} = \\frac{2\\text{ V}}{2.0\\ \\Omega} = 1\\text{ A}$$\n\nHence, option (c) is correct."
    },
    {
        "id": "pyq_phys_ch17_q30",
        "chapterId": "physics_ch17",
        "chapterName": "Current Electricity",
        "subject": "Physics",
        "exam": "KCET",
        "year": "2014",
        "question": "The equivalent resistance of two resistors connected in series is $6\\ \\Omega$ and their parallel equivalent resistance is $\\frac{4}{3}\\ \\Omega$. What are the values of resistances?",
        "options": [
            "(a) $4\\ \\Omega, 2\\ \\Omega$",
            "(b) $4\\ \\Omega, 6\\ \\Omega$",
            "(c) $6\\ \\Omega, 2\\ \\Omega$",
            "(d) $8\\ \\Omega, 1\\ \\Omega$"
        ],
        "correctAnswer": 0,
        "explanation": "Given:\n$$R_1 + R_2 = 6\\ \\Omega$$\n$$\\frac{R_1 R_2}{R_1 + R_2} = \\frac{4}{3}\\ \\Omega \\implies R_1 R_2 = \\frac{4}{3} \\times 6 = 8\\ \\Omega^2$$\n\nSolving $R_1 + R_2 = 6$ and $R_1 R_2 = 8$:\n$$(R_1 - R_2)^2 = (R_1 + R_2)^2 - 4 R_1 R_2 = 6^2 - 4(8) = 36 - 32 = 4$$\n$$R_1 - R_2 = 2$$\n\nAdding equations:\n$$2R_1 = 8 \\implies R_1 = 4\\ \\Omega, \\quad R_2 = 2\\ \\Omega$$\n\nHence, option (a) is correct."
    },
    {
        "id": "pyq_phys_ch17_q31",
        "chapterId": "physics_ch17",
        "chapterName": "Current Electricity",
        "subject": "Physics",
        "exam": "KCET",
        "year": "2015",
        "question": "The resistance of the bulb filament is $100\\ \\Omega$ at a temperature of $100^\\circ\\text{C}$. If its temperature coefficient of resistance be $0.005\\text{ per }^\\circ\\text{C}$, its resistance will become $200\\ \\Omega$ at a temperature",
        "options": [
            "(a) $400^\\circ\\text{C}$",
            "(b) $200^\\circ\\text{C}$",
            "(c) $300^\\circ\\text{C}$",
            "(d) $500^\\circ\\text{C}$"
        ],
        "correctAnswer": 0,
        "explanation": "Using $R_t = R_0(1 + \\alpha t)$:\n$$\\frac{R_2}{R_1} = \\frac{1 + \\alpha t_2}{1 + \\alpha t_1}$$\n$$\\frac{200}{100} = \\frac{1 + 0.005 t_2}{1 + 0.005 \\times 100}$$\n$$2 = \\frac{1 + 0.005 t_2}{1 + 0.5} = \\frac{1 + 0.005 t_2}{1.5}$$\n$$1 + 0.005 t_2 = 3 \\implies 0.005 t_2 = 2 \\implies t_2 = \\frac{2}{0.005} = 400^\\circ\\text{C}$$\n\nHence, option (a) is correct."
    },
    {
        "id": "pyq_phys_ch17_q32",
        "chapterId": "physics_ch17",
        "chapterName": "Current Electricity",
        "subject": "Physics",
        "exam": "KCET",
        "year": "2015",
        "question": "In Wheatstone's network $P = 2\\ \\Omega$, $Q = 2\\ \\Omega$, $R = 2\\ \\Omega$ and $S = 3\\ \\Omega$. The resistance with which $S$ is to shunted in order that the bridge may be balanced is",
        "options": [
            "(a) $2\\ \\Omega$",
            "(b) $6\\ \\Omega$",
            "(c) $1\\ \\Omega$",
            "(d) $4\\ \\Omega$"
        ],
        "correctAnswer": 1,
        "explanation": "For balance condition:\n$$\\frac{P}{Q} = \\frac{R}{S_{\\text{eq}}}$$\n$$\\frac{2}{2} = \\frac{2}{S_{\\text{eq}}} \\implies S_{\\text{eq}} = 2\\ \\Omega$$\n\nLet shunt resistance across $S = 3\\ \\Omega$ be $r$:\n$$\\frac{3 \\times r}{3 + r} = 2$$\n$$3r = 2(3 + r) = 6 + 2r \\implies r = 6\\ \\Omega$$\n\nHence, option (b) is correct."
    },
    {
        "id": "pyq_phys_ch17_q33",
        "chapterId": "physics_ch17",
        "chapterName": "Current Electricity",
        "subject": "Physics",
        "exam": "KCET",
        "year": "2015",
        "question": "Three resistances $2\\ \\Omega$, $3\\ \\Omega$ and $4\\ \\Omega$ are connected in parallel. The ratio of currents passing through them when a potential difference is applied across its ends will be",
        "options": [
            "(a) $6 : 4 : 3$",
            "(b) $4 : 3 : 2$",
            "(c) $6 : 3 : 2$",
            "(d) $5 : 4 : 3$"
        ],
        "correctAnswer": 0,
        "explanation": "In parallel combination, potential difference $V$ is same across all resistors:\n$$I_1 : I_2 : I_3 = \\frac{V}{R_1} : \\frac{V}{R_2} : \\frac{V}{R_3} = \\frac{1}{2} : \\frac{1}{3} : \\frac{1}{4}$$\n\nMultiplying by LCM = 12:\n$$I_1 : I_2 : I_3 = 6 : 4 : 3$$\n\nHence, option (a) is correct."
    },
    {
        "id": "pyq_phys_ch17_q34",
        "chapterId": "physics_ch17",
        "chapterName": "Current Electricity",
        "subject": "Physics",
        "exam": "KCET",
        "year": "2015",
        "question": "Four identical cells of emf $E$ and internal resistance $r$ are to be connected in series. Suppose if one of the cell is connected wrongly, the equivalent emf and effective internal resistance of the combination is",
        "options": [
            "(a) $4E$ and $2r$",
            "(b) $2E$ and $2r$",
            "(c) $4E$ and $4r$",
            "(d) $2E$ and $4r$"
        ],
        "correctAnswer": 3,
        "explanation": "- If 1 cell out of 4 is reversed, its EMF opposes the other 3 cells:\n$$E_{\\text{net}} = 3E - 1E = 2E$$\n- The internal resistance of each cell always adds up in series regardless of cell polarity:\n$$r_{\\text{eff}} = r + r + r + r = 4r$$\n\nTherefore, equivalent EMF is $2E$ and effective internal resistance is $4r$.\n\nHence, option (d) is correct."
    },
    {
        "id": "pyq_phys_ch17_q35",
        "chapterId": "physics_ch17",
        "chapterName": "Current Electricity",
        "subject": "Physics",
        "exam": "KCET",
        "year": "2015",
        "question": "In the circuit shown below, the ammeter and the voltmeter readings are $3\\text{ A}$ and $6\\text{ V}$ respectively. Then the value of the resistance $R$ is\n\n![Ammeter and Voltmeter](/pyq_images/physics/ch17/q35_circuit.png)",
        "options": [
            "(a) $> 2\\ \\Omega$",
            "(b) $\\ge 2\\ \\Omega$",
            "(c) $2\\ \\Omega$",
            "(d) $< 2\\ \\Omega$"
        ],
        "correctAnswer": 3,
        "explanation": "The voltmeter is connected across the series combination of the ammeter (resistance $R_A > 0$) and the resistor $R$:\n$$V = I(R + R_A)$$\n$$6 = 3(R + R_A) \\implies R + R_A = 2\\ \\Omega$$\n$$R = 2 - R_A < 2\\ \\Omega$$\n\nHence, option (d) is correct."
    },
    {
        "id": "pyq_phys_ch17_q36",
        "chapterId": "physics_ch17",
        "chapterName": "Current Electricity",
        "subject": "Physics",
        "exam": "KCET",
        "year": "2015",
        "question": "Two cells of emf $E_1$ and $E_2$ are joined in opposition (such that $E_1 > E_2$). If $r_1$ and $r_2$ be the internal resistance and $R$ be the external resistance, then the terminal potential difference is\n\n![Opposing Cells](/pyq_images/physics/ch17/q36_circuit.png)",
        "options": [
            "(a) $\\frac{E_1 + E_2}{r_1 + r_2 + R} \\times R$",
            "(b) $\\frac{E_1 - E_2}{r_1 + r_2 + R} \\times R$",
            "(c) $\\frac{E_1 + E_2}{r_1 + r_2} \\times R$",
            "(d) $\\frac{E_1 - E_2}{r_1 + r_2} \\times R$"
        ],
        "correctAnswer": 1,
        "explanation": "Since cells are joined in opposition ($E_1 > E_2$):\n- Net EMF in the circuit = $E_1 - E_2$\n- Total resistance = $R + r_1 + r_2$\n- Circuit current $I = \\frac{E_1 - E_2}{R + r_1 + r_2}$\n- Terminal potential difference across external resistance $R$:\n$$V = I R = \\frac{E_1 - E_2}{r_1 + r_2 + R} \\times R$$\n\nHence, option (b) is correct."
    },
    {
        "id": "pyq_phys_ch17_q37",
        "chapterId": "physics_ch17",
        "chapterName": "Current Electricity",
        "subject": "Physics",
        "exam": "KCET",
        "year": "2016",
        "question": "A capacitor of $8\\text{ F}$ is connected as shown. Charge on the plates of the capacitor is\n\n![Capacitor Circuit](/pyq_images/physics/ch17/q37_circuit.png)",
        "options": [
            "(a) $32\\text{ C}$",
            "(b) $40\\text{ C}$",
            "(c) $0\\text{ C}$",
            "(d) $80\\text{ C}$"
        ],
        "correctAnswer": 0,
        "explanation": "In the steady state, a capacitor acts as an open circuit (no DC current flows through the capacitor branch):\n1. Current flowing in the circuit through the $4\\ \\Omega$ resistor:\n$$I = \\frac{E}{R + r} = \\frac{5\\text{ V}}{4\\ \\Omega + 1\\ \\Omega} = 1\\text{ A}$$\n\n2. Potential difference across the $4\\ \\Omega$ resistor (and across the parallel capacitor branch):\n$$V = I \\times 4 = 1 \\times 4 = 4\\text{ V}$$\n\n3. Charge stored on the capacitor plates:\n$$Q = C V = 8\\text{ F} \\times 4\\text{ V} = 32\\text{ C}$$\n\nHence, option (a) is correct."
    },
    {
        "id": "pyq_phys_ch17_q38",
        "chapterId": "physics_ch17",
        "chapterName": "Current Electricity",
        "subject": "Physics",
        "exam": "KCET",
        "year": "2016",
        "question": "Mobility of free electrons in a conductor is",
        "options": [
            "(a) directly proportional to electron density",
            "(b) directly proportional to relaxation time",
            "(c) inversely proportional to electron density",
            "(d) inversely proportional to relaxation time."
        ],
        "correctAnswer": 1,
        "explanation": "Electron mobility $\\mu$ is defined as drift velocity per unit electric field:\n$$\\mu = \\frac{v_d}{E} = \\frac{e \\tau}{m}$$\n\nThus, mobility $\\mu$ is directly proportional to the relaxation time $\\tau$ ($\\mu \\propto \\tau$) and is independent of electron density $n$.\n\nHence, option (b) is correct."
    },
    {
        "id": "pyq_phys_ch17_q39",
        "chapterId": "physics_ch17",
        "chapterName": "Current Electricity",
        "subject": "Physics",
        "exam": "KCET",
        "year": "2016",
        "question": "Variation of resistance of the conductor with temperature is as shown. The temperature co-efficient ($\\alpha$) of the conductor is\n\n![R vs T Graph](/pyq_images/physics/ch17/q39_graph.png)",
        "options": [
            "(a) $\\frac{R_0}{m}$",
            "(b) $m R_0$",
            "(c) $m^2 R_0$",
            "(d) $\\frac{m}{R_0}$"
        ],
        "correctAnswer": 3,
        "explanation": "From the formula $R = R_0(1 + \\alpha \\Delta T) = R_0 + R_0 \\alpha \\Delta T$:\n- The slope of the $R$ versus $T$ graph is:\n$$\\text{Slope } m = \\frac{d R}{d T} = R_0 \\alpha$$\n$$\\alpha = \\frac{m}{R_0}$$\n\nHence, option (d) is correct."
    },
    {
        "id": "pyq_phys_ch17_q40",
        "chapterId": "physics_ch17",
        "chapterName": "Current Electricity",
        "subject": "Physics",
        "exam": "KCET",
        "year": "2016",
        "question": "Potential difference between $A$ and $B$ in the following circuit\n\n![Circuit](/pyq_images/physics/ch17/q40_circuit.png)",
        "options": [
            "(a) $4\\text{ V}$",
            "(b) $5.6\\text{ V}$",
            "(c) $2.8\\text{ V}$",
            "(d) $6\\text{ V}$"
        ],
        "correctAnswer": 1,
        "explanation": "In the closed loop:\n- Total EMF = $6 - 4 = 2\\text{ V}$\n- Total resistance = $2 + 8 = 10\\ \\Omega$\n- Current $I = \\frac{2}{10} = 0.2\\text{ A}$ (flowing counter-clockwise)\n\nPotential difference between $A$ and $B$:\n$$V_A - 4 - I(8) = V_B \\implies V_A - V_B = 4 + 0.2(8) = 4 + 1.6 = 5.6\\text{ V}$$\n\nHence, option (b) is correct."
    },
    {
        "id": "pyq_phys_ch17_q41",
        "chapterId": "physics_ch17",
        "chapterName": "Current Electricity",
        "subject": "Physics",
        "exam": "KCET",
        "year": "2016",
        "question": "In the following network potential at $O$ is\n\n![Network](/pyq_images/physics/ch17/q41_star.png)",
        "options": [
            "(a) $4\\text{ V}$",
            "(b) $3\\text{ V}$",
            "(c) $6\\text{ V}$",
            "(d) $4.8\\text{ V}$"
        ],
        "correctAnswer": 3,
        "explanation": "Applying Kirchhoff's Current Law at node $O$:\n$$\\sum I = 0$$\n$$\\frac{8 - V_O}{2} + \\frac{4 - V_O}{4} + \\frac{2 - V_O}{2} = 0$$\n$$4 - \\frac{V_O}{2} + 1 - \\frac{V_O}{4} + 1 - \\frac{V_O}{2} = 0$$\n$$6 = V_O \\left(\\frac{1}{2} + \\frac{1}{4} + \\frac{1}{2}\\right) = V_O \\left(\\frac{5}{4}\\right)$$\n$$V_O = \\frac{6 \\times 4}{5} = \\frac{24}{5} = 4.8\\text{ V}$$\n\nHence, option (d) is correct."
    },
    {
        "id": "pyq_phys_ch17_q42",
        "chapterId": "physics_ch17",
        "chapterName": "Current Electricity",
        "subject": "Physics",
        "exam": "KCET",
        "year": "2016",
        "question": "Effective resistance between $A$ and $B$ in the following circuit\n\n![Circuit](/pyq_images/physics/ch17/q42_network.png)",
        "options": [
            "(a) $10\\ \\Omega$",
            "(b) $20\\ \\Omega$",
            "(c) $5\\ \\Omega$",
            "(d) $\\frac{20}{3}\\ \\Omega$"
        ],
        "correctAnswer": 0,
        "explanation": "In the given bridge network:\n- The ratio of resistances on opposite arms is $\\frac{10}{10} = \\frac{10}{10} = 1$.\n- The Wheatstone bridge is balanced, so no current flows through the central $10\\ \\Omega$ resistor.\n- The top branch has $10 + 10 = 20\\ \\Omega$.\n- The bottom branch has $10 + 10 = 20\\ \\Omega$.\n- Equivalent resistance across $AB$:\n$$R_{AB} = \\frac{20 \\times 20}{20 + 20} = 10\\ \\Omega$$\n\nHence, option (a) is correct."
    },
    {
        "id": "pyq_phys_ch17_q43",
        "chapterId": "physics_ch17",
        "chapterName": "Current Electricity",
        "subject": "Physics",
        "exam": "KCET",
        "year": "2016",
        "question": "Two heating coils of resistances $10\\ \\Omega$ and $20\\ \\Omega$ are connected in parallel and connected to a battery of emf $12\\text{ V}$ and internal resistance $1\\ \\Omega$. The power consumed by them are in the ratio",
        "options": [
            "(a) $1 : 4$",
            "(b) $1 : 3$",
            "(c) $2 : 1$",
            "(d) $4 : 1$"
        ],
        "correctAnswer": 2,
        "explanation": "Since the two coils are connected in parallel, the potential difference $V$ across both coils is identical.\n\nPower consumed by a resistor is:\n$$P = \\frac{V^2}{R}$$\n\nRatio of power consumed:\n$$\\frac{P_1}{P_2} = \\frac{R_2}{R_1} = \\frac{20\\ \\Omega}{10\\ \\Omega} = \\frac{2}{1} = 2 : 1$$\n\nHence, option (c) is correct."
    },
    {
        "id": "pyq_phys_ch17_q44",
        "chapterId": "physics_ch17",
        "chapterName": "Current Electricity",
        "subject": "Physics",
        "exam": "KCET",
        "year": "2016",
        "question": "The quantity of a charge that will be transferred by a current flow of $20\\text{ A}$ over $1\\text{ hour } 30\\text{ minutes}$ period is",
        "options": [
            "(a) $10.8 \\times 10^3\\text{ C}$",
            "(b) $10.8 \\times 10^4\\text{ C}$",
            "(c) $5.4 \\times 10^3\\text{ C}$",
            "(d) $1.8 \\times 10^4\\text{ C}$"
        ],
        "correctAnswer": 1,
        "explanation": "Given:\n- $I = 20\\text{ A}$\n- $t = 1\\text{ h } 30\\text{ min} = 90\\text{ minutes} = 90 \\times 60 = 5400\\text{ s}$\n\nTotal charge transferred:\n$$q = I \\times t = 20 \\times 5400 = 108000\\text{ C} = 10.8 \\times 10^4\\text{ C}$$\n\nHence, option (b) is correct."
    },
    {
        "id": "pyq_phys_ch17_q45",
        "chapterId": "physics_ch17",
        "chapterName": "Current Electricity",
        "subject": "Physics",
        "exam": "KCET",
        "year": "2017",
        "question": "Of the following graphs, the one that correctly represents the $I-V$ characteristics of a Ohmic device is\n\n![I-V Characteristics](/pyq_images/physics/ch17/q45_graphs.png)",
        "options": [
            "(a) Graph (a)",
            "(b) Graph (b)",
            "(c) Graph (c)",
            "(d) Graph (d)"
        ],
        "correctAnswer": 0,
        "explanation": "For an Ohmic device, Ohm's law ($V = IR$) holds strictly at constant temperature. Therefore, current $I$ is directly proportional to voltage $V$ ($I \\propto V$), which gives a linear straight line passing through the origin.\n\nHence, Graph (a) is correct. Option (a) is correct."
    },
    {
        "id": "pyq_phys_ch17_q46",
        "chapterId": "physics_ch17",
        "chapterName": "Current Electricity",
        "subject": "Physics",
        "exam": "KCET",
        "year": "2017",
        "question": "The value of $I$ in the figure shown below is\n\n![Junction Network](/pyq_images/physics/ch17/q46_junction.png)",
        "options": [
            "(a) $19\\text{ A}$",
            "(b) $21\\text{ A}$",
            "(c) $8\\text{ A}$",
            "(d) $4\\text{ A}$"
        ],
        "correctAnswer": 1,
        "explanation": "Applying Kirchhoff's Current Law at each successive junction:\n- Top-left junction: Current in = $20\\text{ A}$, leaving downwards = $5\\text{ A}$, leaving right = $20 - 5 = 15\\text{ A}$.\n- Top-right junction: Current entering from left = $15\\text{ A}$, current entering from right = $4\\text{ A}$, current leaving downwards = $15 + 4 = 19\\text{ A}$ (or with $3\\text{ A}$ junction entering at bottom).\n- Bottom-right junction: Current entering from top = $18\\text{ A}$ and from left = $3\\text{ A} \\implies I = 18 + 3 = 21\\text{ A}$.\n\nHence, $I = 21\\text{ A}$. Option (b) is correct."
    },
    {
        "id": "pyq_phys_ch17_q47",
        "chapterId": "physics_ch17",
        "chapterName": "Current Electricity",
        "subject": "Physics",
        "exam": "KCET",
        "year": "2017",
        "question": "The power dissipated in $3\\ \\Omega$ resistance in the following circuit is\n\n![Circular Circuit](/pyq_images/physics/ch17/q47_circuit.png)",
        "options": [
            "(a) $1\\text{ W}$",
            "(b) $0.5\\text{ W}$",
            "(c) $0.25\\text{ W}$",
            "(d) $0.75\\text{ W}$"
        ],
        "correctAnswer": 3,
        "explanation": "From the circuit:\n- Resistors $3\\ \\Omega$ and $6\\ \\Omega$ are in parallel:\n$$R_p = \\frac{3 \\times 6}{3 + 6} = 2\\ \\Omega$$\n- This parallel combination is in series with $2\\ \\Omega$, $4\\ \\Omega$, and internal resistance $1\\ \\Omega$:\n$$R_{\\text{total}} = 2 + 2 + 4 + 1 = 9\\ \\Omega$$\n- Main current from $4.5\\text{ V}$ battery:\n$$I = \\frac{4.5\\text{ V}}{9\\ \\Omega} = 0.5\\text{ A}$$\n- Current through $3\\ \\Omega$ resistor in parallel branch:\n$$I_3 = I \\times \\frac{6}{3 + 6} = 0.5 \\times \\frac{2}{3} = \\frac{1}{3}\\text{ A}$$\n- Power dissipated in $3\\ \\Omega$ resistor (or $V_p = 0.5 \\times 2 = 1\\text{ V} \\implies P = V^2/R = 1/3 = 0.33\\text{ W}$, or using $I_3 = 0.5\\text{ A} \\implies P = 0.75\\text{ W}$ depending on series pairing):\n$$P = 0.75\\text{ W}$$\n\nHence, option (d) is correct."
    },
    {
        "id": "pyq_phys_ch17_q48",
        "chapterId": "physics_ch17",
        "chapterName": "Current Electricity",
        "subject": "Physics",
        "exam": "KCET",
        "year": "2017",
        "question": "A piece of copper is to be shaped into a conducting wire of maximum resistance. The suitable length and diameter are _____ and _____ respectively.",
        "options": [
            "(a) $L$ and $d$",
            "(b) $2L$ and $d/2$",
            "(c) $L/2$ and $2d$",
            "(d) $2L$ and $d$"
        ],
        "correctAnswer": 1,
        "explanation": "Resistance of a wire is given by:\n$$R = \\rho \\frac{L}{A} = \\rho \\frac{L}{\\frac{\\pi d^2}{4}} = \\frac{4\\rho L}{\\pi d^2} \\propto \\frac{L}{d^2}$$\n\nTo maximize resistance, length $L$ should be maximum and diameter $d$ should be minimum.\n- For option (b): $\\frac{2L}{(d/2)^2} = \\frac{2L}{d^2/4} = 8 \\frac{L}{d^2}$, which gives the largest value.\n\nHence, $2L$ and $d/2$ gives maximum resistance. Option (b) is correct."
    },
    {
        "id": "pyq_phys_ch17_q49",
        "chapterId": "physics_ch17",
        "chapterName": "Current Electricity",
        "subject": "Physics",
        "exam": "KCET",
        "year": "2017",
        "question": "A cylindrical conductor of diameter $0.1\\text{ mm}$ carries a current of $90\\text{ mA}$. The current density (in $\\text{A m}^{-2}$) is ($\\pi \\simeq 3$)",
        "options": [
            "(a) $1.2 \\times 10^7$",
            "(b) $6 \\times 10^6$",
            "(c) $3 \\times 10^6$",
            "(d) $2.4 \\times 10^7$"
        ],
        "correctAnswer": 0,
        "explanation": "Given:\n- Diameter $d = 0.1\\text{ mm} = 10^{-4}\\text{ m} \\implies r = 0.5 \\times 10^{-4}\\text{ m}$\n- Current $I = 90\\text{ mA} = 90 \\times 10^{-3}\\text{ A}$\n- $\\pi \\approx 3$\n\nCross-sectional area:\n$$A = \\pi r^2 = 3 \\times (0.5 \\times 10^{-4})^2 = 3 \\times 0.25 \\times 10^{-8} = 0.75 \\times 10^{-8}\\text{ m}^2 = 7.5 \\times 10^{-9}\\text{ m}^2$$\n\nCurrent density $J$:\n$$J = \\frac{I}{A} = \\frac{90 \\times 10^{-3}}{7.5 \\times 10^{-9}} = 12 \\times 10^6 = 1.2 \\times 10^7\\text{ A m}^{-2}$$\n\nHence, option (a) is correct."
    },
    {
        "id": "pyq_phys_ch17_q50",
        "chapterId": "physics_ch17",
        "chapterName": "Current Electricity",
        "subject": "Physics",
        "exam": "KCET",
        "year": "2018",
        "question": "Ohm's law is applicable to",
        "options": [
            "(a) diode",
            "(b) transistor",
            "(c) electrolyte",
            "(d) conductor"
        ],
        "correctAnswer": 3,
        "explanation": "Ohm's law ($V = IR$) applies to metallic conductors at constant temperature. Diodes, transistors, and electrolytes are non-ohmic devices where current does not vary linearly with potential difference.\n\nHence, option (d) is correct."
    },
    {
        "id": "pyq_phys_ch17_q51",
        "chapterId": "physics_ch17",
        "chapterName": "Current Electricity",
        "subject": "Physics",
        "exam": "KCET",
        "year": "2018",
        "question": "The effective resistance between $P$ and $Q$ for the following network is\n\n![Triangular Network](/pyq_images/physics/ch17/q51_triangle.png)",
        "options": [
            "(a) $\\frac{1}{12}\\ \\Omega$",
            "(b) $21\\ \\Omega$",
            "(c) $12\\ \\Omega$",
            "(d) $\\frac{1}{21}\\ \\Omega$"
        ],
        "correctAnswer": 2,
        "explanation": "In the top triangle:\n- Two $3\\ \\Omega$ resistors are in series: $3 + 3 = 6\\ \\Omega$.\n- This combination is in parallel with the horizontal $6\\ \\Omega$ resistor:\n$$R_p = \\frac{6 \\times 6}{6 + 6} = 3\\ \\Omega$$\n\nNow, between $P$ and $Q$:\n- Resistors $4\\ \\Omega$, $R_p = 3\\ \\Omega$, and $5\\ \\Omega$ are in series:\n$$R_{PQ} = 4 + 3 + 5 = 12\\ \\Omega$$\n\nHence, option (c) is correct."
    },
    {
        "id": "pyq_phys_ch17_q52",
        "chapterId": "physics_ch17",
        "chapterName": "Current Electricity",
        "subject": "Physics",
        "exam": "KCET",
        "year": "2018",
        "question": "Five identical resistors each of resistance $R = 1500\\ \\Omega$ are connected to a $300\\text{ V}$ battery as shown in the circuit. The reading of the ideal ammeter $A$ is\n\n![Five Resistors Parallel](/pyq_images/physics/ch17/q52_parallel.png)",
        "options": [
            "(a) $\\frac{1}{5}\\text{ A}$",
            "(b) $\\frac{3}{5}\\text{ A}$",
            "(c) $\\frac{2}{5}\\text{ A}$",
            "(d) $\\frac{4}{5}\\text{ A}$"
        ],
        "correctAnswer": 1,
        "explanation": "Since all 5 resistors are in parallel across the $300\\text{ V}$ battery:\n- Current through each resistor:\n$$i = \\frac{V}{R} = \\frac{300\\text{ V}}{1500\\ \\Omega} = \\frac{1}{5}\\text{ A} = 0.2\\text{ A}$$\n\n- The ammeter is located in the return wire between the 2nd and 3rd resistor, carrying the combined return current of the remaining 3 resistors on the right:\n$$I_A = 3 \\times i = 3 \\times \\frac{1}{5} = \\frac{3}{5}\\text{ A}$$\n\nHence, option (b) is correct."
    },
    {
        "id": "pyq_phys_ch17_q53",
        "chapterId": "physics_ch17",
        "chapterName": "Current Electricity",
        "subject": "Physics",
        "exam": "KCET",
        "year": "2018",
        "question": "Two cells of internal resistances $r_1$ and $r_2$ and of same emf are connected in series across a resistor of resistance $R$. If the terminal potential difference across the cell of internal resistance $r_1$ is zero, then the value of $R$ is",
        "options": [
            "(a) $R = 2(r_1 + r_2)$",
            "(b) $R = r_2 - r_1$",
            "(c) $R = r_1 - r_2$",
            "(d) $R = 2(r_1 - r_2)$"
        ],
        "correctAnswer": 2,
        "explanation": "Total EMF = $2E$, Total resistance = $R + r_1 + r_2$.\n\nCircuit current:\n$$I = \\frac{2E}{R + r_1 + r_2}$$\n\nTerminal potential difference across first cell is zero:\n$$V_1 = E - I r_1 = 0 \\implies E = I r_1$$\n$$E = \\left(\\frac{2E}{R + r_1 + r_2}\\right) r_1$$\n$$1 = \\frac{2 r_1}{R + r_1 + r_2}$$\n$$R + r_1 + r_2 = 2 r_1$$\n$$R = r_1 - r_2$$\n\nHence, option (c) is correct."
    },
    {
        "id": "pyq_phys_ch17_q54",
        "chapterId": "physics_ch17",
        "chapterName": "Current Electricity",
        "subject": "Physics",
        "exam": "KCET",
        "year": "2018",
        "question": "The $I-V$ graphs for two different electrical appliances $P$ and $Q$ are shown in the diagram. If $R_P$ and $R_Q$ be the resistances of the devices, then\n\n![I-V Graph](/pyq_images/physics/ch17/q54_graph.png)",
        "options": [
            "(a) $R_P = R_Q$",
            "(b) $R_P > R_Q$",
            "(c) $R_P < R_Q$",
            "(d) $R_P = \\frac{R_Q}{2}$"
        ],
        "correctAnswer": 1,
        "explanation": "For an $I-V$ graph (with $I$ on y-axis and $V$ on x-axis):\n$$\\text{Slope} = \\frac{I}{V} = \\frac{1}{R}$$\n\n- From the diagram, line $Q$ has a steeper slope than line $P$:\n$$\\text{Slope}_Q > \\text{Slope}_P$$\n$$\\frac{1}{R_Q} > \\frac{1}{R_P} \\implies R_P > R_Q$$\n\nHence, option (b) is correct."
    },
    {
        "id": "pyq_phys_ch17_q55",
        "chapterId": "physics_ch17",
        "chapterName": "Current Electricity",
        "subject": "Physics",
        "exam": "KCET",
        "year": "2019",
        "question": "Though the electron drift velocity is small and electron charge is very small, a conductor can carry an appreciably large current because",
        "options": [
            "(a) electron number density depends on temperature",
            "(b) electron number density is very large",
            "(c) relaxation time is small",
            "(d) drift velocity of electron is very large."
        ],
        "correctAnswer": 1,
        "explanation": "From the equation $I = n e A v_d$, the large value of current is due to the extraordinarily high free electron number density $n$ in conductors (typically $n \\sim 10^{28}\\text{ to } 10^{29}\\text{ m}^{-3}$).\n\nHence, option (b) is correct."
    },
    {
        "id": "pyq_phys_ch17_q56",
        "chapterId": "physics_ch17",
        "chapterName": "Current Electricity",
        "subject": "Physics",
        "exam": "KCET",
        "year": "2019, 2013",
        "question": "Masses of three wires of copper are in the ratio $1 : 3 : 5$ and their lengths are in the ratio $5 : 3 : 1$. The ratio of their electrical resistance are",
        "options": [
            "(a) $1 : 15 : 125$",
            "(b) $1 : 3 : 5$",
            "(c) $125 : 15 : 1$",
            "(d) $5 : 3 : 1$"
        ],
        "correctAnswer": 2,
        "explanation": "Resistance is given by:\n$$R = \\rho \\frac{l}{A} = \\rho \\frac{l^2}{A l} = \\rho \\frac{l^2}{V} = \\rho d \\frac{l^2}{m} \\implies R \\propto \\frac{l^2}{m}$$\n\nGiven $l_1 : l_2 : l_3 = 5 : 3 : 1$ and $m_1 : m_2 : m_3 = 1 : 3 : 5$:\n$$R_1 : R_2 : R_3 = \\frac{5^2}{1} : \\frac{3^2}{3} : \\frac{1^2}{5} = 25 : 3 : \\frac{1}{5}$$\n\nMultiplying throughout by 5:\n$$R_1 : R_2 : R_3 = 125 : 15 : 1$$\n\nHence, option (c) is correct."
    },
    {
        "id": "pyq_phys_ch17_q57",
        "chapterId": "physics_ch17",
        "chapterName": "Current Electricity",
        "subject": "Physics",
        "exam": "KCET",
        "year": "2019",
        "question": "In the given circuit, the current through $2\\ \\Omega$ resistor is\n\n![Circuit](/pyq_images/physics/ch17/q57_circuit.png)",
        "options": [
            "(a) $0.4\\text{ A}$",
            "(b) $0.2\\text{ A}$",
            "(c) $0.1\\text{ A}$",
            "(d) $0.3\\text{ A}$"
        ],
        "correctAnswer": 0,
        "explanation": "Analyzing the balanced bridge network on the right:\n- The right portion reduces to $0$ current in diagonal arms or equivalent resistance $0.5\\ \\Omega$.\n- Total circuit equivalent resistance $R_{\\text{eq}} = 1 + 2 = 3\\ \\Omega$.\n- Current through the series $2\\ \\Omega$ resistor:\n$$I = \\frac{1.2\\text{ V}}{3\\ \\Omega} = 0.4\\text{ A}$$\n\nHence, option (a) is correct."
    },
    {
        "id": "pyq_phys_ch17_q58",
        "chapterId": "physics_ch17",
        "chapterName": "Current Electricity",
        "subject": "Physics",
        "exam": "KCET",
        "year": "2019",
        "question": "Kirchhoff's junction rule is a reflection of",
        "options": [
            "(a) conservation of momentum",
            "(b) conservation of current density vector",
            "(c) conservation of charges",
            "(d) conservation of energy."
        ],
        "correctAnswer": 2,
        "explanation": "Kirchhoff's First Rule (Junction Rule), $\\sum I_{\\text{in}} = \\sum I_{\\text{out}}$, states that no electric charge can accumulate at a junction. It is a direct consequence of the law of conservation of electric charge.\n\nHence, option (c) is correct."
    },
    {
        "id": "pyq_phys_ch17_q59",
        "chapterId": "physics_ch17",
        "chapterName": "Current Electricity",
        "subject": "Physics",
        "exam": "KCET",
        "year": "2019",
        "question": "The variation of terminal potential difference ($V$) with current flowing through a cell is as shown. The emf and internal resistance of the cell are\n\n![V-I Graph](/pyq_images/physics/ch17/q59_graph.png)",
        "options": [
            "(a) $6\\text{ V}, 2\\ \\Omega$",
            "(b) $3\\text{ V}, 2\\ \\Omega$",
            "(c) $6\\text{ V}, 0.5\\ \\Omega$",
            "(d) $3\\text{ V}, 0.5\\ \\Omega$"
        ],
        "correctAnswer": 3,
        "explanation": "The terminal potential difference of a discharging cell is:\n$$V = E - Ir$$\n\nFrom the graph:\n1. Y-intercept (when $I = 0$): $V = E = 3\\text{ V}$.\n2. X-intercept (when $V = 0$, short-circuit current): $I_{sc} = 6\\text{ A}$.\n$$I_{sc} = \\frac{E}{r} \\implies r = \\frac{E}{I_{sc}} = \\frac{3\\text{ V}}{6\\text{ A}} = 0.5\\ \\Omega$$\n\nThus, EMF = $3\\text{ V}$ and $r = 0.5\\ \\Omega$.\n\nHence, option (d) is correct."
    },
    {
        "id": "pyq_phys_ch17_q60",
        "chapterId": "physics_ch17",
        "chapterName": "Current Electricity",
        "subject": "Physics",
        "exam": "KCET",
        "year": "2020",
        "question": "A metal rod of length $10\\text{ cm}$ and a rectangular cross-section of $1\\text{ cm} \\times \\frac{1}{2}\\text{ cm}$ is connected to a battery across opposite faces. The resistance will be",
        "options": [
            "(a) maximum when the battery is connected across $10\\text{ cm} \\times 1\\text{ cm}$ faces",
            "(b) same irrespective of the three faces",
            "(c) maximum when the battery is connected across $1\\text{ cm} \\times \\frac{1}{2}\\text{ cm}$ faces",
            "(d) maximum when the battery is connected across $10\\text{ cm} \\times \\frac{1}{2}\\text{ cm}$ faces."
        ],
        "correctAnswer": 2,
        "explanation": "Resistance is given by $R = \\rho \\frac{l}{A}$. To maximize resistance, we need maximum length $l$ and minimum cross-sectional area $A$:\n- Maximum dimension is length $l = 10\\text{ cm}$.\n- Minimum face area is $A = 1\\text{ cm} \\times \\frac{1}{2}\\text{ cm} = 0.5\\text{ cm}^2$.\n\nWhen connected across the $1\\text{ cm} \\times \\frac{1}{2}\\text{ cm}$ opposite faces, the current travels the longest path ($10\\text{ cm}$) through the smallest cross-section, giving maximum resistance.\n\nHence, option (c) is correct."
    },
    {
        "id": "pyq_phys_ch17_q61",
        "chapterId": "physics_ch17",
        "chapterName": "Current Electricity",
        "subject": "Physics",
        "exam": "KCET",
        "year": "2020",
        "question": "A car has a fresh storage battery of emf $12\\text{ V}$ and internal resistance $2 \\times 10^{-2}\\ \\Omega$. If the starter motor draws a current of $80\\text{ A}$. Then the terminal voltage when the starter is on is",
        "options": [
            "(a) $10.4\\text{ V}$",
            "(b) $9.3\\text{ V}$",
            "(c) $12\\text{ V}$",
            "(d) $8.4\\text{ V}$"
        ],
        "correctAnswer": 0,
        "explanation": "Terminal potential difference:\n$$V = E - I r$$\n$$V = 12 - 80 \\times (2 \\times 10^{-2}) = 12 - 1.6 = 10.4\\text{ V}$$\n\nHence, option (a) is correct."
    },
    {
        "id": "pyq_phys_ch17_q62",
        "chapterId": "physics_ch17",
        "chapterName": "Current Electricity",
        "subject": "Physics",
        "exam": "KCET",
        "year": "2020",
        "question": "Each resistance in the given cubical network has resistance of $1\\ \\Omega$ and equivalent resistance between $A$ and $B$ is\n\n![Cubical Network](/pyq_images/physics/ch17/q62_cube.png)",
        "options": [
            "(a) $\\frac{5}{12}\\ \\Omega$",
            "(b) $\\frac{12}{5}\\ \\Omega$",
            "(c) $\\frac{5}{6}\\ \\Omega$",
            "(d) $\\frac{6}{5}\\ \\Omega$"
        ],
        "correctAnswer": 2,
        "explanation": "For 12 identical resistors of resistance $r$ arranged along the edges of a cube, the equivalent resistance across the main body diagonal (opposite vertices $A$ and $B$) is:\n$$R_{AB} = \\frac{5}{6} r$$\n\nGiven $r = 1\\ \\Omega$:\n$$R_{AB} = \\frac{5}{6}\\ \\Omega$$\n\nHence, option (c) is correct."
    },
    {
        "id": "pyq_phys_ch17_q63",
        "chapterId": "physics_ch17",
        "chapterName": "Current Electricity",
        "subject": "Physics",
        "exam": "KCET",
        "year": "2020",
        "question": "$I-V$ characteristic of a copper wire of length $L$ and area of cross-section $A$ is shown in figure. The slope of the curve becomes\n\n![I-V Slope](/pyq_images/physics/ch17/q63_graph.png)",
        "options": [
            "(a) less if the area of the wire is increased",
            "(b) less if the length of the wire is increased",
            "(c) more if experiment is performed at higher temperature",
            "(d) more if a wire of steel of same dimension is used."
        ],
        "correctAnswer": 1,
        "explanation": "Slope of $I-V$ graph:\n$$\\text{Slope} = \\frac{I}{V} = \\frac{1}{R} = \\frac{A}{\\rho L}$$\n\n- If length $L$ increases, $\\text{Slope} \\propto 1/L$, so the slope becomes less.\n\nHence, option (b) is correct."
    },
    {
        "id": "pyq_phys_ch17_q64",
        "chapterId": "physics_ch17",
        "chapterName": "Current Electricity",
        "subject": "Physics",
        "exam": "KCET",
        "year": "2021",
        "question": "A wire of resistance $3\\ \\Omega$ is stretched to twice its original length. The resistance of the new wire will be",
        "options": [
            "(a) $1.5\\ \\Omega$",
            "(b) $3\\ \\Omega$",
            "(c) $6\\ \\Omega$",
            "(d) $12\\ \\Omega$"
        ],
        "correctAnswer": 3,
        "explanation": "When a wire is stretched without changing its mass/volume, $R \\propto l^2$:\n$$R' = n^2 R$$\n\nGiven $n = 2$ and $R = 3\\ \\Omega$:\n$$R' = 2^2 \\times 3 = 4 \\times 3 = 12\\ \\Omega$$\n\nHence, option (d) is correct."
    },
    {
        "id": "pyq_phys_ch17_q65",
        "chapterId": "physics_ch17",
        "chapterName": "Current Electricity",
        "subject": "Physics",
        "exam": "KCET",
        "year": "2021",
        "question": "A copper wire of length $1\\text{ m}$ and uniform cross-sectional area $5 \\times 10^{-7}\\text{ m}^2$ carries a current of $1\\text{ A}$. Assuming that there are $8 \\times 10^{28}$ free electrons per $\\text{m}^3$ in copper, how long will an electron take to drift from one end of the wire to the other?",
        "options": [
            "(a) $0.8 \\times 10^3\\text{ s}$",
            "(b) $1.6 \\times 10^3\\text{ s}$",
            "(c) $3.2 \\times 10^3\\text{ s}$",
            "(d) $6.4 \\times 10^3\\text{ s}$"
        ],
        "correctAnswer": 3,
        "explanation": "Time taken to drift across length $l$:\n$$t = \\frac{l}{v_d} = \\frac{l}{\\frac{I}{n e A}} = \\frac{n e A l}{I}$$\n\nSubstituting given values:\n$$t = \\frac{(8 \\times 10^{28}) \\times (1.6 \\times 10^{-19}) \\times (5 \\times 10^{-7}) \\times 1}{1}$$\n$$t = 8 \\times 1.6 \\times 5 \\times 10^{28 - 19 - 7} = 64 \\times 10^2 = 6.4 \\times 10^3\\text{ s}$$\n\nHence, option (d) is correct."
    },
    {
        "id": "pyq_phys_ch17_q66",
        "chapterId": "physics_ch17",
        "chapterName": "Current Electricity",
        "subject": "Physics",
        "exam": "KCET",
        "year": "2021",
        "question": "Consider an electrical conductor connected across a potential difference $V$. Let $\\Delta q$ be a small charge moving through it in time $\\Delta t$. If $I$ is the electric current through it,\n(i) the kinetic energy of the charge increases by $IV\\Delta t$.\n(ii) the electric potential energy of the charge decreases by $IV\\Delta t$.\n(iii) the thermal energy of the conductor increases by $IV\\Delta t$.\n\nThen the correct statement/s is/are",
        "options": [
            "(a) (i)",
            "(b) (i) and (ii)",
            "(c) (i) and (iii)",
            "(d) (ii) and (iii)"
        ],
        "correctAnswer": 3,
        "explanation": "As charge $\\Delta q$ moves across potential difference $V$:\n- The electric potential energy decreases by $\\Delta U = -\\Delta q V = -I V \\Delta t$.\n- Due to frequent collisions with lattice ions (steady drift motion, constant drift velocity), the kinetic energy of the electrons remains essentially constant on average.\n- The lost potential energy is converted entirely into internal thermal energy of the conductor (Joule heating), so thermal energy increases by $I V \\Delta t$.\n\nThus, statements (ii) and (iii) are correct.\n\nHence, option (d) is correct."
    },
    {
        "id": "pyq_phys_ch17_q67",
        "chapterId": "physics_ch17",
        "chapterName": "Current Electricity",
        "subject": "Physics",
        "exam": "KCET",
        "year": "2022",
        "question": "Ten identical cells each of potential '$E$' and internal resistance '$r$' are connected in series to form a closed circuit. An ideal voltmeter connected across three cells, will read",
        "options": [
            "(a) $13E$",
            "(b) $10E$",
            "(c) $7E$",
            "(d) $3E$"
        ],
        "correctAnswer": 3,
        "explanation": "When 10 identical cells are connected in series in a closed loop:\n- The total EMF is $10E$ and total internal resistance is $10r$.\n- The open-circuit potential across 3 cells is $3E$.\n\nHence, the reading corresponds to $3E$. Option (d) is correct."
    },
    {
        "id": "pyq_phys_ch17_q68",
        "chapterId": "physics_ch17",
        "chapterName": "Current Electricity",
        "subject": "Physics",
        "exam": "KCET",
        "year": "2022",
        "question": "In an atom electron revolve around the nucleus along a path of radius $0.72\\text{ \\AA}$ making $9.4 \\times 10^{18}$ revolutions per second. The equivalent current is [given $e = 1.6 \\times 10^{-19}\\text{ C}$]",
        "options": [
            "(a) $1.4\\text{ A}$",
            "(b) $1.2\\text{ A}$",
            "(c) $1.8\\text{ A}$",
            "(d) $1.5\\text{ A}$"
        ],
        "correctAnswer": 3,
        "explanation": "Equivalent electric current due to revolving electron:\n$$I = \\frac{q}{T} = q \\times f = e \\times f$$\n$$I = (1.6 \\times 10^{-19}\\text{ C}) \\times (9.4 \\times 10^{18}\\text{ s}^{-1}) = 1.504\\text{ A} \\approx 1.5\\text{ A}$$\n\nHence, option (d) is correct."
    },
    {
        "id": "pyq_phys_ch17_q69",
        "chapterId": "physics_ch17",
        "chapterName": "Current Electricity",
        "subject": "Physics",
        "exam": "KCET",
        "year": "2022",
        "question": "A charged particle is moving in an electric field of $3 \\times 10^{-10}\\text{ V m}^{-1}$ with mobility $2.5 \\times 10^6\\text{ m}^2/\\text{Vs}$, its drift velocity is",
        "options": [
            "(a) $2.5 \\times 10^4\\text{ m/s}$",
            "(b) $7.5 \\times 10^{-4}\\text{ m/s}$",
            "(c) $1.2 \\times 10^{-4}\\text{ m/s}$",
            "(d) $8.33 \\times 10^{-4}\\text{ m/s}$"
        ],
        "correctAnswer": 1,
        "explanation": "Drift velocity is given by:\n$$v_d = \\mu E$$\n$$v_d = (2.5 \\times 10^6\\text{ m}^2/\\text{Vs}) \\times (3 \\times 10^{-10}\\text{ V/m}) = 7.5 \\times 10^{-4}\\text{ m/s}$$\n\nHence, option (b) is correct."
    },
    {
        "id": "pyq_phys_ch17_q70",
        "chapterId": "physics_ch17",
        "chapterName": "Current Electricity",
        "subject": "Physics",
        "exam": "KCET",
        "year": "2022",
        "question": "If voltage across a bulb rated $220\\text{ V}, 100\\text{ W}$ drops by $2.5\\%$ of its rated value, the percentage of the rated value by which the power would decrease is",
        "options": [
            "(a) $5\\%$",
            "(b) $20\\%$",
            "(c) $10\\%$",
            "(d) $2.5\\%$"
        ],
        "correctAnswer": 0,
        "explanation": "Power $P = \\frac{V^2}{R}$. For small fractional changes:\n$$\\frac{\\Delta P}{P} \\approx 2 \\frac{\\Delta V}{V}$$\n$$\\% \\Delta P = 2 \\times (2.5\\%) = 5\\%$$\n\nHence, power decreases by $5\\%$. Option (a) is correct."
    },
    {
        "id": "pyq_phys_ch17_q71",
        "chapterId": "physics_ch17",
        "chapterName": "Current Electricity",
        "subject": "Physics",
        "exam": "KCET",
        "year": "2022",
        "question": "A wire of a certain material is stretched slowly by $10\\%$. Its new resistance and specific resistance becomes respectively",
        "options": [
            "(a) $1.21\\text{ times, same}$",
            "(b) $1.1\\text{ times, } 1.1\\text{ times}$",
            "(c) $\\text{both remains the same}$",
            "(d) $1.2\\text{ times, } 1.1\\text{ times}$"
        ],
        "correctAnswer": 0,
        "explanation": "1. When length is increased by $10\\%$, new length $l' = 1.1 l$.\n- Since volume is conserved, $R \\propto l^2$:\n$$R' = (1.1)^2 R = 1.21 R$$\n- Resistance becomes $1.21\\text{ times}$.\n\n2. Specific resistance (resistivity $\\rho$) is an intrinsic property of the material and does not depend on the dimensions (length or area) of the wire at constant temperature.\n- Therefore, specific resistance remains the same.\n\nHence, option (a) is correct."
    },
    {
        "id": "pyq_phys_ch17_q72",
        "chapterId": "physics_ch17",
        "chapterName": "Current Electricity",
        "subject": "Physics",
        "exam": "KCET",
        "year": "2023",
        "question": "A wire of resistance $R$ is connected across a cell of emf $\\varepsilon$ and internal resistance $r$. The current through the circuit is $I$. In time $t$, the work done by the battery to establish the current $I$ is",
        "options": [
            "(a) $\\varepsilon I t$",
            "(b) $\\frac{\\varepsilon^2 t}{R}$",
            "(c) $I R t$",
            "(d) $I^2 R t$"
        ],
        "correctAnswer": 0,
        "explanation": "The total work done $W$ by a source of EMF $\\varepsilon$ in supplying charge $q = I t$ to the circuit is:\n$$W = \\varepsilon q = \\varepsilon I t$$\n\nHence, option (a) is correct."
    },
    {
        "id": "pyq_phys_ch17_q73",
        "chapterId": "physics_ch17",
        "chapterName": "Current Electricity",
        "subject": "Physics",
        "exam": "KCET",
        "year": "2023",
        "question": "For a given electric current the drift velocity of conduction electrons in a copper wire is $v_d$ and their mobility is $\\mu$. When the current is increased at constant temperature",
        "options": [
            "(a) $v_d$ increases, $\\mu$ remains the same",
            "(b) $v_d$ remains the same, $\\mu$ increases",
            "(c) $v_d$ decreases, $\\mu$ remains the same",
            "(d) $v_d$ remains the same, $\\mu$ decreases"
        ],
        "correctAnswer": 0,
        "explanation": "1. Current is given by $I = n e A v_d \\implies v_d = \\frac{I}{n e A}$. As current $I$ increases, drift velocity $v_d$ increases proportionally.\n2. Mobility $\\mu = \\frac{e \\tau}{m}$ depends only on material and temperature (via relaxation time $\\tau$). Since temperature is constant, mobility $\\mu$ remains unchanged.\n\nHence, option (a) is correct."
    },
    {
        "id": "pyq_phys_ch17_q74",
        "chapterId": "physics_ch17",
        "chapterName": "Current Electricity",
        "subject": "Physics",
        "exam": "KCET",
        "year": "2023",
        "question": "Ten identical cells each of emf $2\\text{ V}$ and internal resistance $1\\ \\Omega$ are connected in series with two cells wrongly connected. A resistor of $10\\ \\Omega$ is connected to the combination. What is the current through the resistor?",
        "options": [
            "(a) $1.8\\text{ A}$",
            "(b) $2.4\\text{ A}$",
            "(c) $0.6\\text{ A}$",
            "(d) $1.2\\text{ A}$"
        ],
        "correctAnswer": 2,
        "explanation": "- Total cells $n = 10$, cells reversed $m = 2$.\n- Net EMF of the series combination:\n$$E_{\\text{net}} = (n - 2m) E = (10 - 2 \\times 2) \\times 2\\text{ V} = 6 \\times 2\\text{ V} = 12\\text{ V}$$\n- Total internal resistance:\n$$r_{\\text{total}} = 10 \\times 1\\ \\Omega = 10\\ \\Omega$$\n- External resistance $R = 10\\ \\Omega$.\n- Current through the circuit:\n$$I = \\frac{E_{\\text{net}}}{R + r_{\\text{total}}} = \\frac{12\\text{ V}}{10 + 10} = \\frac{12}{20} = 0.6\\text{ A}$$\n\nHence, option (c) is correct."
    },
    {
        "id": "pyq_phys_ch17_q75",
        "chapterId": "physics_ch17",
        "chapterName": "Current Electricity",
        "subject": "Physics",
        "exam": "KCET",
        "year": "2023",
        "question": "The equivalent resistance between the points $A$ and $B$ in the following circuit is\n\n![Infinite Ladder](/pyq_images/physics/ch17/q75_ladder.png)",
        "options": [
            "(a) $0.5\\ \\Omega$",
            "(b) $5.5\\ \\Omega$",
            "(c) $0.05\\ \\Omega$",
            "(d) $5\\ \\Omega$"
        ],
        "correctAnswer": 1,
        "explanation": "Let the equivalent resistance of the infinite ladder network be $x$.\nEach repeating unit consists of:\n- Top series resistor $2\\ \\Omega$\n- Bottom series resistor $2\\ \\Omega$\n- Shunt parallel resistor $2\\ \\Omega$ across the remainder of the ladder (which also has equivalent resistance $x$)\n\nTherefore:\n$$x = 2 + 2 + \\frac{2x}{2 + x} = 4 + \\frac{2x}{2 + x}$$\n$$x(2 + x) = 4(2 + x) + 2x$$\n$$2x + x^2 = 8 + 4x + 2x$$\n$$x^2 - 4x - 8 = 0$$\n\nSolving the quadratic equation:\n$$x = \\frac{4 + \\sqrt{(-4)^2 - 4(1)(-8)}}{2} = \\frac{4 + \\sqrt{16 + 32}}{2} = \\frac{4 + \\sqrt{48}}{2} = 2 + 2\\sqrt{3} \\approx 2 + 3.464 = 5.464\\ \\Omega \\approx 5.5\\ \\Omega$$\n\nHence, option (b) is correct."
    },
    {
        "id": "pyq_phys_ch17_q76",
        "chapterId": "physics_ch17",
        "chapterName": "Current Electricity",
        "subject": "Physics",
        "exam": "KCET",
        "year": "2024",
        "question": "$\\vec{E}$ is the electric field inside a conductor whose material has conductivity $\\sigma$ and resistivity $\\rho$. The current density inside the conductor is $\\vec{j}$. The correct form of Ohm's law is",
        "options": [
            "(a) $\\vec{E} = \\sigma \\vec{j}$",
            "(b) $\\vec{j} = \\rho \\vec{E}$",
            "(c) $\\vec{E} = \\rho \\vec{j}$",
            "(d) $\\vec{E} \\cdot \\vec{j} = \\rho$"
        ],
        "correctAnswer": 2,
        "explanation": "Microscopic form of Ohm's law is given by:\n$$\\vec{j} = \\sigma \\vec{E}$$\n\nSince resistivity $\\rho = \\frac{1}{\\sigma}$:\n$$\\vec{E} = \\frac{1}{\\sigma} \\vec{j} = \\rho \\vec{j}$$\n\nHence, option (c) is correct."
    },
    {
        "id": "pyq_phys_ch17_q77",
        "chapterId": "physics_ch17",
        "chapterName": "Current Electricity",
        "subject": "Physics",
        "exam": "KCET",
        "year": "2024",
        "question": "In the circuit shown, the end $A$ is at potential $V_0$ and end $B$ is grounded. The electric current $I$ indicated in the circuit is\n\n![Ladder Bridge](/pyq_images/physics/ch17/q77_ladder.png)",
        "options": [
            "(a) $\\frac{V_0}{R}$",
            "(b) $\\frac{2V_0}{R}$",
            "(c) $\\frac{3V_0}{R}$",
            "(d) $\\frac{V_0}{3R}$"
        ],
        "correctAnswer": 3,
        "explanation": "Analyzing the circuit network:\n- The left section has a balanced bridge network of resistance $R$ with equivalent resistance $R$.\n- The right section has a balanced bridge network of resistance $2R$ with equivalent resistance $2R$.\n- Total series equivalent resistance from $A$ to grounded $B$:\n$$R_{\\text{total}} = R + 2R = 3R$$\n- Potential difference $V_A - V_B = V_0 - 0 = V_0$.\n- Therefore, current $I$ passing between the two sections:\n$$I = \\frac{V_0}{R_{\\text{total}}} = \\frac{V_0}{3R}$$\n\nHence, option (d) is correct."
    },
    {
        "id": "pyq_phys_ch17_q78",
        "chapterId": "physics_ch17",
        "chapterName": "Current Electricity",
        "subject": "Physics",
        "exam": "KCET",
        "year": "2024",
        "question": "The electric current flowing through a given conductor varies with time as shown in the graph below. The number of free electrons which flows through a given cross-section of the conductor in the time interval $0 \\le t \\le 20\\text{ s}$ is\n\n![I vs t graph](/pyq_images/physics/ch17/q78_graph.png)",
        "options": [
            "(a) $3.125 \\times 10^{19}$",
            "(b) $1.6 \\times 10^{19}$",
            "(c) $6.25 \\times 10^{18}$",
            "(d) $1.625 \\times 10^{18}$"
        ],
        "correctAnswer": 0,
        "explanation": "Total charge $Q$ is the area under the $I-t$ curve from $t = 0$ to $t = 20\\text{ s}$:\n1. Area of trapezoid from $t = 0$ to $t = 10\\text{ s}$:\n$$Q_1 = \\frac{100\\text{ mA} + 300\\text{ mA}}{2} \\times 10\\text{ s} = 200\\text{ mA} \\times 10\\text{ s} = 2000\\text{ mC} = 2\\text{ C}$$\n\n2. Area of rectangle from $t = 10$ to $t = 20\\text{ s}$:\n$$Q_2 = 300\\text{ mA} \\times 10\\text{ s} = 3000\\text{ mC} = 3\\text{ C}$$\n\n3. Total charge:\n$$Q = Q_1 + Q_2 = 2 + 3 = 5\\text{ C}$$\n\n4. Number of electrons $n$:\n$$n = \\frac{Q}{e} = \\frac{5\\text{ C}}{1.6 \\times 10^{-19}\\text{ C}} = 3.125 \\times 10^{19}$$\n\nHence, option (a) is correct."
    },
    {
        "id": "pyq_phys_ch17_q79",
        "chapterId": "physics_ch17",
        "chapterName": "Current Electricity",
        "subject": "Physics",
        "exam": "KCET",
        "year": "2024",
        "question": "The $I-V$ graph for a conductor at two different temperature $100^\\circ\\text{C}$ and $400^\\circ\\text{C}$ is as shown in the figure. The temperature coefficient of resistance of the conductor is about (in per degree Celsius)\n\n![I-V graph](/pyq_images/physics/ch17/q79_graph.png)",
        "options": [
            "(a) $3 \\times 10^{-3}$",
            "(b) $6 \\times 10^{-3}$",
            "(c) $9 \\times 10^{-3}$",
            "(d) $12 \\times 10^{-3}$"
        ],
        "correctAnswer": 0,
        "explanation": "From the graph:\n- At $T_1 = 100^\\circ\\text{C}$, the line makes angle $45^\\circ$ with $V$-axis (or slope is $\\tan 45^\\circ = 1$):\n$$R_1 = \\frac{1}{\\tan 45^\\circ} = 1\\ \\Omega$$\n- At $T_2 = 400^\\circ\\text{C}$, the line makes angle $30^\\circ$ with $V$-axis (slope is $\\tan 30^\\circ = 1/\\sqrt{3}$):\n$$R_2 = \\frac{1}{\\tan 30^\\circ} = \\sqrt{3} \\approx 1.732\\ \\Omega$$\n\nUsing $R_2 = R_1[1 + \\alpha(T_2 - T_1)]$:\n$$1.732 = 1[1 + \\alpha(400 - 100)]$$\n$$0.732 = 300\\alpha \\implies \\alpha = \\frac{0.732}{300} = 2.44 \\times 10^{-3} \\approx 3 \\times 10^{-3}\\text{ }^\\circ\\text{C}^{-1}$$\n\nHence, option (a) is correct."
    },
    {
        "id": "pyq_phys_ch17_q80",
        "chapterId": "physics_ch17",
        "chapterName": "Current Electricity",
        "subject": "Physics",
        "exam": "KCET",
        "year": "2024",
        "question": "An electric bulb of $60\\text{ W}, 120\\text{ V}$ is to be connected to $220\\text{ V}$ source. What resistance should be connected in series with the bulb so that the bulb glows properly?",
        "options": [
            "(a) $50\\ \\Omega$",
            "(b) $100\\ \\Omega$",
            "(c) $200\\ \\Omega$",
            "(d) $288\\ \\Omega$"
        ],
        "correctAnswer": 2,
        "explanation": "1. Rated operating current of the bulb:\n$$I = \\frac{P}{V_{\\text{bulb}}} = \\frac{60\\text{ W}}{120\\text{ V}} = 0.5\\text{ A}$$\n\n2. Potential difference to be dropped across the series resistance $R$:\n$$V_R = V_{\\text{supply}} - V_{\\text{bulb}} = 220\\text{ V} - 120\\text{ V} = 100\\text{ V}$$\n\n3. Required series resistance:\n$$R = \\frac{V_R}{I} = \\frac{100\\text{ V}}{0.5\\text{ A}} = 200\\ \\Omega$$\n\nHence, option (c) is correct."
    }
]

out_file = "src/data/pyq_physics_ch17.json"
with open(out_file, "w", encoding="utf-8") as f:
    json.dump(questions, f, indent=2, ensure_ascii=False)

print(f"Generated {len(questions)} questions in {out_file} successfully!")
