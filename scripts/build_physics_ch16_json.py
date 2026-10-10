import json

questions = [
    {
        "id": "phys_ch16_q1",
        "subject": "Physics",
        "chapter": "Electrostatic Potential and Capacitance",
        "chapter_number": 16,
        "questionNumber": 1,
        "year": 2006,
        "question": "A parallel plate air capacitor has a capacitance $C$. When it is half filled with a dielectric of dielectric constant 5, the percentage increase in the capacitance will be",
        "options": [
            "400%",
            "66.6%",
            "33.3%",
            "200%"
        ],
        "correct_answer": 1,
        "explanation": "Original capacitance $C = \\frac{\\varepsilon_0 A}{d}$.\nWhen half-filled across the thickness ($d/2$ filled with dielectric $K=5$, and $d/2$ air), the two capacitors are in series:\n$$C_1 = \\frac{K \\varepsilon_0 A}{d/2} = \\frac{2K \\varepsilon_0 A}{d} = 10 C$$\n$$C_2 = \\frac{\\varepsilon_0 A}{d/2} = \\frac{2 \\varepsilon_0 A}{d} = 2 C$$\nEquivalent capacitance $C'$ in series:\n$$\\frac{1}{C'} = \\frac{1}{C_1} + \\frac{1}{C_2} = \\frac{1}{10C} + \\frac{1}{2C} = \\frac{1 + 5}{10C} = \\frac{6}{10C} = \\frac{3}{5C} \\implies C' = \\frac{5}{3}C$$\nPercentage increase in capacitance:\n$$\\frac{C' - C}{C} \\times 100 = \\left(\\frac{5}{3} - 1\\right) \\times 100 = \\frac{2}{3} \\times 100 = 66.6\\%$$",
        "needs_image": False
    },
    {
        "id": "phys_ch16_q2",
        "subject": "Physics",
        "chapter": "Electrostatic Potential and Capacitance",
        "chapter_number": 16,
        "questionNumber": 2,
        "year": 2006,
        "question": "The top of the atmosphere is at about $400\\text{ kV}$ with respect to the surface of the earth, corresponding to an electric field that decreases with altitude. Near the surface of the earth, the field is about $100\\text{ V m}^{-1}$. Still, we do not get an electric shock as we step out of our house into the open house because (assume the house to be a steel cage so that there is no field inside)",
        "options": [
            "there is a potential difference between our body and the ground",
            "$100\\text{ V m}^{-1}$ is not a high electric field so that we do not feel the shock",
            "our body and the ground forms an equipotential surface",
            "the atmosphere is not a conductor."
        ],
        "correct_answer": 3,
        "explanation": "Under ordinary dry weather conditions, the air near the earth's surface is an insulator (non-conductor). Because the atmosphere does not conduct electricity freely without ionization/breakdown, no continuous current flows through our body to the ground, preventing electric shocks.",
        "needs_image": False
    },
    {
        "id": "phys_ch16_q3",
        "subject": "Physics",
        "chapter": "Electrostatic Potential and Capacitance",
        "chapter_number": 16,
        "questionNumber": 3,
        "year": 2006,
        "question": "A gang capacitor is formed by interlocking a number of plates as shown in figure. The distance between the consecutive plates is $0.885\\text{ cm}$ and the overlapping area of the plates is $5\\text{ cm}^2$. The capacity of the unit is\n\n![Gang Capacitor](/pyq_images/physics/ch16/q3_gang_capacitor.png)",
        "options": [
            "$1.06\\text{ pF}$",
            "$4\\text{ pF}$",
            "$6.36\\text{ pF}$",
            "$12.72\\text{ pF}$"
        ],
        "correct_answer": 1,
        "explanation": "An interlocking arrangement of $N = 9$ plates forms $(N - 1) = 8$ parallel plate capacitors connected in parallel.\nCapacitance of a single pair:\n$$C_0 = \\frac{\\varepsilon_0 A}{d} = \\frac{8.854 \\times 10^{-12} \\times 5 \\times 10^{-4}}{0.885 \\times 10^{-2}} = \\frac{44.27 \\times 10^{-16}}{8.85 \\times 10^{-3}} = 0.5 \\times 10^{-12}\\text{ F} = 0.5\\text{ pF}$$\nTotal capacitance of the 8 parallel units:\n$$C = 8 \\times C_0 = 8 \\times 0.5\\text{ pF} = 4\\text{ pF}$$",
        "needs_image": True,
        "image_url": "/pyq_images/physics/ch16/q3_gang_capacitor.png"
    },
    {
        "id": "phys_ch16_q4",
        "subject": "Physics",
        "chapter": "Electrostatic Potential and Capacitance",
        "chapter_number": 16,
        "questionNumber": 4,
        "year": 2007,
        "question": "Two identical capacitors each of capacitance $5\\text{ mF}$ are charged to potentials $2\\text{ kV}$ and $1\\text{ kV}$ respectively. The -ve ends are connected together. When the +ve ends are also connected together, the loss of energy of the system is",
        "options": [
            "$160\\text{ J}$",
            "$0\\text{ J}$",
            "$5\\text{ J}$",
            "$1.25\\text{ J}$"
        ],
        "correct_answer": 3,
        "explanation": "Loss of electrostatic energy on connecting two capacitors with like polarities joined together:\n$$\\Delta U = \\frac{1}{2}\\frac{C_1 C_2}{C_1 + C_2}(V_1 - V_2)^2$$\nGiven $C_1 = C_2 = 5\\text{ mF} = 5 \\times 10^{-3}\\text{ F}$, $V_1 = 2\\text{ kV} = 2000\\text{ V}$, $V_2 = 1\\text{ kV} = 1000\\text{ V}$:\n$$\\Delta U = \\frac{1}{2} \\frac{(5 \\times 10^{-3})(5 \\times 10^{-3})}{10 \\times 10^{-3}} (2000 - 1000)^2 = \\frac{1}{2} \\times (2.5 \\times 10^{-3}) \\times (10^6) = 1.25 \\times 10^3\\text{ mJ} = 1.25\\text{ J}$$",
        "needs_image": False
    },
    {
        "id": "phys_ch16_q5",
        "subject": "Physics",
        "chapter": "Electrostatic Potential and Capacitance",
        "chapter_number": 16,
        "questionNumber": 5,
        "year": 2007,
        "question": "A parallel plate capacitor with air as the dielectric has capacitance $C$. A slab of dielectric constant $K$ and having the same thickness as the separation between the plates is introduced so as to fill one-fourth of the capacitor as shown in the figure. The new capacitance will be\n\n![Dielectric Slab](/pyq_images/physics/ch16/q5_dielectric_slab.png)",
        "options": [
            "$(K + 3)\\frac{C}{4}$",
            "$(K + 2)\\frac{C}{4}$",
            "$(K + 1)\\frac{C}{4}$",
            "$\\frac{KC}{4}$"
        ],
        "correct_answer": 0,
        "explanation": "The dielectric fills $1/4^{\\text{th}}$ of the plate area ($A_1 = A/4$) across the full separation $d$, while the remaining $3/4^{\\text{th}}$ ($A_2 = 3A/4$) contains air.\nThese two sections act as two capacitors in parallel:\n$$C_1 = \\frac{K\\varepsilon_0(A/4)}{d} = \\frac{K}{4} C$$\n$$C_2 = \\frac{\\varepsilon_0(3A/4)}{d} = \\frac{3}{4} C$$\nTotal equivalent capacitance:\n$$C' = C_1 + C_2 = \\frac{KC}{4} + \\frac{3C}{4} = (K + 3)\\frac{C}{4}$$",
        "needs_image": True,
        "image_url": "/pyq_images/physics/ch16/q5_dielectric_slab.png"
    },
    {
        "id": "phys_ch16_q6",
        "subject": "Physics",
        "chapter": "Electrostatic Potential and Capacitance",
        "chapter_number": 16,
        "questionNumber": 6,
        "year": 2007,
        "question": "The potential of the electric field produced by a point charge at any point $(x, y, z)$ is given by $V = 3x^2 + 5$, where $x, y, z$ are in metres and $V$ is in volts. The intensity of the electric field at $(-2, 1, 0)$ is",
        "options": [
            "$+17\\text{ V m}^{-1}$",
            "$-17\\text{ V m}^{-1}$",
            "$+12\\text{ V m}^{-1}$",
            "$-12\\text{ V m}^{-1}$"
        ],
        "correct_answer": 3,
        "explanation": "Electric field intensity is related to potential gradient by:\n$$E_x = -\\frac{\\partial V}{\\partial x} = -\\frac{d}{dx}(3x^2 + 5) = -6x$$\nAt point $(-2, 1, 0)$, $x = -2$:\n$$E_x = -6(-2) = +12\\text{ V m}^{-1}$$\n*(Note: In the original key, option d $-12\\text{ V m}^{-1}$ was marked based on the sign convention $\\frac{dV}{dx} = 6x = -12$)*.",
        "needs_image": False
    },
    {
        "id": "phys_ch16_q7",
        "subject": "Physics",
        "chapter": "Electrostatic Potential and Capacitance",
        "chapter_number": 16,
        "questionNumber": 7,
        "year": 2007,
        "question": "The potential of a large liquid drop when eight liquid drops are combined is $20\\text{ V}$. Then the potential of each single drop was",
        "options": [
            "$10\\text{ V}$",
            "$7.5\\text{ V}$",
            "$5\\text{ V}$",
            "$2.5\\text{ V}$"
        ],
        "correct_answer": 2,
        "explanation": "When 8 small drops of radius $r$ and charge $q$ combine into a big drop of radius $R$ and charge $Q = 8q$:\n$$\\text{Volume conservation: } \\frac{4}{3}\\pi R^3 = 8 \\times \\frac{4}{3}\\pi r^3 \\implies R = 2r$$\nPotential of big drop:\n$$V = \\frac{1}{4\\pi\\varepsilon_0}\\frac{Q}{R} = \\frac{1}{4\\pi\\varepsilon_0}\\frac{8q}{2r} = 4 \\left(\\frac{1}{4\\pi\\varepsilon_0}\\frac{q}{r}\\right) = 4 v$$\nGiven $V = 20\\text{ V}$:\n$$v = \\frac{V}{4} = \\frac{20}{4} = 5\\text{ V}$$",
        "needs_image": False
    },
    {
        "id": "phys_ch16_q8",
        "subject": "Physics",
        "chapter": "Electrostatic Potential and Capacitance",
        "chapter_number": 16,
        "questionNumber": 8,
        "year": 2008,
        "question": "Two identical metal spheres charged with $+12\\;\\mu\\text{F}$ and $-8\\;\\mu\\text{F}$ (charges $+12\\;\\mu\\text{C}$ and $-8\\;\\mu\\text{C}$) are kept at certain distance in air. They are brought into contact and then kept at the same distance. The ratio of the magnitudes of electrostatic forces between them before and after contact is",
        "options": [
            "24 : 1",
            "4 : 1",
            "12 : 1",
            "8 : 1"
        ],
        "correct_answer": 0,
        "explanation": "Before contact:\n$$F_1 = \\frac{1}{4\\pi\\varepsilon_0}\\frac{|q_1 q_2|}{r^2} = \\frac{1}{4\\pi\\varepsilon_0}\\frac{12 \\times 8}{r^2} = \\frac{96}{4\\pi\\varepsilon_0 r^2}$$\nAfter contact, identical spheres share charge equally:\n$$q' = \\frac{q_1 + q_2}{2} = \\frac{12 - 8}{2} = +2\\;\\mu\\text{C}$$\n$$F_2 = \\frac{1}{4\\pi\\varepsilon_0}\\frac{q'^2}{r^2} = \\frac{1}{4\\pi\\varepsilon_0}\\frac{2 \\times 2}{r^2} = \\frac{4}{4\\pi\\varepsilon_0 r^2}$$\nRatio:\n$$\\frac{F_1}{F_2} = \\frac{96}{4} = \\frac{24}{1}$$",
        "needs_image": False
    },
    {
        "id": "phys_ch16_q9",
        "subject": "Physics",
        "chapter": "Electrostatic Potential and Capacitance",
        "chapter_number": 16,
        "questionNumber": 9,
        "year": 2008,
        "question": "A small conducting sphere of radius $r$ is lying concentrically inside a bigger hollow conducting sphere of radius $R$. The bigger and smaller spheres are charged with $Q$ and $q$ ($Q > q$) and are insulated from each other. The potential difference between the spheres will be",
        "options": [
            "$\\frac{1}{4\\pi\\varepsilon_0}\\left(\\frac{q}{r} - \\frac{Q}{R}\\right)$",
            "$\\frac{1}{4\\pi\\varepsilon_0}\\left(\\frac{Q}{R} + \\frac{q}{r}\\right)$",
            "$\\frac{1}{4\\pi\\varepsilon_0}\\left(\\frac{q}{r} - \\frac{q}{R}\\right)$",
            "$\\frac{1}{4\\pi\\varepsilon_0}\\left(\\frac{q}{R} - \\frac{Q}{r}\\right)$"
        ],
        "correct_answer": 2,
        "explanation": "Potential on the inner sphere of radius $r$:\n$$V_r = \\frac{1}{4\\pi\\varepsilon_0}\\left(\\frac{q}{r} + \\frac{Q}{R}\\right)$$\nPotential on the outer sphere of radius $R$:\n$$V_R = \\frac{1}{4\\pi\\varepsilon_0}\\left(\\frac{q}{R} + \\frac{Q}{R}\\right)$$\nPotential difference between the spheres:\n$$V_r - V_R = \\frac{1}{4\\pi\\varepsilon_0}\\left(\\frac{q}{r} - \\frac{q}{R}\\right)$$\nNotice that the potential difference is completely independent of the outer charge $Q$.",
        "needs_image": False
    },
    {
        "id": "phys_ch16_q10",
        "subject": "Physics",
        "chapter": "Electrostatic Potential and Capacitance",
        "chapter_number": 16,
        "questionNumber": 10,
        "year": 2008,
        "question": "The charges $Q, +q$ and $+q$ are placed at the vertices of an equilateral triangle of side $l$. If the net electrostatic potential energy of the system is zero, the $Q$ is equal to",
        "options": [
            "$+q/2$",
            "zero",
            "$-q/2$",
            "$-q$"
        ],
        "correct_answer": 2,
        "explanation": "Total electrostatic potential energy of the 3-charge system:\n$$U = \\frac{1}{4\\pi\\varepsilon_0}\\left(\\frac{q \\cdot q}{l} + \\frac{Q \\cdot q}{l} + \\frac{Q \\cdot q}{l}\\right) = 0$$\n$$\\frac{q^2}{l} + \\frac{2Qq}{l} = 0 \\implies q^2 + 2Qq = 0$$\nDividing by $q \\neq 0$:\n$$q + 2Q = 0 \\implies Q = -\\frac{q}{2}$$",
        "needs_image": False
    },
    {
        "id": "phys_ch16_q11",
        "subject": "Physics",
        "chapter": "Electrostatic Potential and Capacitance",
        "chapter_number": 16,
        "questionNumber": 11,
        "year": 2008,
        "question": "How many $6\\;\\mu\\text{F}, 200\\text{ V}$ condensers are needed to make a condenser of $18\\;\\mu\\text{F}, 600\\text{ V}$?",
        "options": [
            "3",
            "27",
            "9",
            "18"
        ],
        "correct_answer": 1,
        "explanation": "1. To withstand $600\\text{ V}$ using $200\\text{ V}$ capacitors, number of capacitors in series in each row:\n   $$n = \\frac{600\\text{ V}}{200\\text{ V}} = 3$$\n2. Capacitance of each row of 3 in series:\n   $$C_{\\text{row}} = \\frac{6\\;\\mu\\text{F}}{3} = 2\\;\\mu\\text{F}$$\n3. To achieve total capacitance of $18\\;\\mu\\text{F}$, number of parallel rows needed:\n   $$m = \\frac{18\\;\\mu\\text{F}}{2\\;\\mu\\text{F}} = 9$$\n4. Total number of capacitors required:\n   $$N = n \\times m = 3 \\times 9 = 27$$",
        "needs_image": False
    },
    {
        "id": "phys_ch16_q12",
        "subject": "Physics",
        "chapter": "Electrostatic Potential and Capacitance",
        "chapter_number": 16,
        "questionNumber": 12,
        "year": 2008,
        "question": "The total energy stored in the condenser system shown in the figure will be\n\n![Condenser System](/pyq_images/physics/ch16/q12_circuit.png)",
        "options": [
            "$8\\;\\mu\\text{J}$",
            "$16\\;\\mu\\text{J}$",
            "$2\\;\\mu\\text{J}$",
            "$4\\;\\mu\\text{J}$"
        ],
        "correct_answer": 0,
        "explanation": "The $6\\;\\mu\\text{F}$ and $3\\;\\mu\\text{F}$ capacitors are connected in series:\n$$C_s = \\frac{6 \\times 3}{6 + 3} = \\frac{18}{9} = 2\\;\\mu\\text{F}$$\nThis series combination is in parallel with the $2\\;\\mu\\text{F}$ capacitor across the $2\\text{ V}$ source:\n$$C_{\\text{eq}} = 2\\;\\mu\\text{F} + 2\\;\\mu\\text{F} = 4\\;\\mu\\text{F}$$\nTotal energy stored:\n$$U = \\frac{1}{2} C_{\\text{eq}} V^2 = \\frac{1}{2} \\times (4\\;\\mu\\text{F}) \\times (2\\text{ V})^2 = \\frac{1}{2} \\times 4 \\times 4 = 8\\;\\mu\\text{J}$$",
        "needs_image": True,
        "image_url": "/pyq_images/physics/ch16/q12_circuit.png"
    },
    {
        "id": "phys_ch16_q13",
        "subject": "Physics",
        "chapter": "Electrostatic Potential and Capacitance",
        "chapter_number": 16,
        "questionNumber": 13,
        "year": 2009,
        "question": "The charge deposited on $4\\;\\mu\\text{F}$ capacitor in the circuit is\n\n![Capacitor Circuit](/pyq_images/physics/ch16/q13_circuit.png)",
        "options": [
            "$6 \\times 10^{-6}\\text{ C}$",
            "$12 \\times 10^{-6}\\text{ C}$",
            "$24 \\times 10^{-6}\\text{ C}$",
            "$36 \\times 10^{-6}\\text{ C}$"
        ],
        "correct_answer": 2,
        "explanation": "1. The parallel combination of $4\\;\\mu\\text{F}$ and $2\\;\\mu\\text{F}$ has capacitance $C_p = 4 + 2 = 6\\;\\mu\\text{F}$.\n2. This $C_p = 6\\;\\mu\\text{F}$ is in series with the $6\\;\\mu\\text{F}$ capacitor across $12\\text{ V}$.\n   $$C_{\\text{eq}} = \\frac{6 \\times 6}{6 + 6} = 3\\;\\mu\\text{F}$$\n3. Total charge drawn from battery $Q = C_{\\text{eq}} V = 3\\;\\mu\\text{F} \\times 12\\text{ V} = 36\\;\\mu\\text{C}$.\n4. Across the parallel branch, potential difference $V_p = \\frac{Q}{C_p} = \\frac{36\\;\\mu\\text{C}}{6\\;\\mu\\text{F}} = 6\\text{ V}$.\n5. Charge on the $4\\;\\mu\\text{F}$ capacitor:\n   $$Q_1 = C_1 V_p = 4\\;\\mu\\text{F} \\times 6\\text{ V} = 24\\;\\mu\\text{C} = 24 \\times 10^{-6}\\text{ C}$$",
        "needs_image": True,
        "image_url": "/pyq_images/physics/ch16/q13_circuit.png"
    },
    {
        "id": "phys_ch16_q14",
        "subject": "Physics",
        "chapter": "Electrostatic Potential and Capacitance",
        "chapter_number": 16,
        "questionNumber": 14,
        "year": 2009,
        "question": "The electric potential at any point $x, y, z$ in metres is given by $V = 3x^2$. The electric field at a point $(2\\text{ m}, 0, 1\\text{ m})$ is",
        "options": [
            "$12\\text{ V m}^{-1}$",
            "$-6\\text{ V m}^{-1}$",
            "$6\\text{ V m}^{-1}$",
            "$-12\\text{ V m}^{-1}$"
        ],
        "correct_answer": 3,
        "explanation": "$$E_x = -\\frac{\\partial V}{\\partial x} = -\\frac{d}{dx}(3x^2) = -6x$$\nAt point $(2\\text{ m}, 0, 1\\text{ m})$, $x = 2\\text{ m}$:\n$$E_x = -6(2) = -12\\text{ V m}^{-1}$$",
        "needs_image": False
    },
    {
        "id": "phys_ch16_q15",
        "subject": "Physics",
        "chapter": "Electrostatic Potential and Capacitance",
        "chapter_number": 16,
        "questionNumber": 15,
        "year": 2010,
        "question": "All capacitors used in the diagram are identical and each is of capacitance $C$. Then the effective capacitance between the points $A$ and $B$ is\n\n![Ladder Capacitors](/pyq_images/physics/ch16/q15_ladder.png)",
        "options": [
            "$1.5C$",
            "$6C$",
            "$C$",
            "$3C$"
        ],
        "correct_answer": 0,
        "explanation": "By labeling the nodes:\n- Points $A, P, R$ are at the same potential (node $A$).\n- Points $Q, S, U$ are at the same intermediate node.\n- Points $T, V, B$ are at node $B$.\nBetween node $A$ and the central node, there are 3 capacitors in parallel, giving $C_1 = 3C$.\nBetween the central node and node $B$, there are 3 capacitors in parallel, giving $C_2 = 3C$.\nThese two groups are in series between $A$ and $B$:\n$$C_{\\text{eq}} = \\frac{3C \\times 3C}{3C + 3C} = \\frac{9C^2}{6C} = 1.5C$$",
        "needs_image": True,
        "image_url": "/pyq_images/physics/ch16/q15_ladder.png"
    },
    {
        "id": "phys_ch16_q16",
        "subject": "Physics",
        "chapter": "Electrostatic Potential and Capacitance",
        "chapter_number": 16,
        "questionNumber": 16,
        "year": 2010,
        "question": "There is a uniform electric field of intensity $E$ which is as shown. How many labelled points have the same electric potential as the fully shaded point?\n\n![Electric Field Grid](/pyq_images/physics/ch16/q16_dots.png)",
        "options": [
            "2",
            "3",
            "8",
            "11"
        ],
        "correct_answer": 1,
        "explanation": "Equipotential surfaces in a uniform electric field are planes perpendicular to the electric field lines.\nAll points lying on the vertical line passing through the fully shaded dot are at the same electric potential.\nCounting along that same vertical column, there are 3 other labelled points on that line.",
        "needs_image": True,
        "image_url": "/pyq_images/physics/ch16/q16_dots.png"
    },
    {
        "id": "phys_ch16_q17",
        "subject": "Physics",
        "chapter": "Electrostatic Potential and Capacitance",
        "chapter_number": 16,
        "questionNumber": 17,
        "year": 2011,
        "question": "In the given network, the value of $C$, so that an equivalent capacitance between $A$ and $B$ is $3\\;\\mu\\text{F}$, is\n\n![Capacitor Network](/pyq_images/physics/ch16/q17_network.png)",
        "options": [
            "$\\frac{1}{5}\\;\\mu\\text{F}$",
            "$\\frac{31}{5}\\;\\mu\\text{F}$",
            "$48\\;\\mu\\text{F}$",
            "$36\\;\\mu\\text{F}$"
        ],
        "correct_answer": 2,
        "explanation": "Step-by-step circuit reduction:\n1. Top branch: $6\\;\\mu\\text{F}$ and $12\\;\\mu\\text{F}$ in series give $\\frac{6 \\times 12}{18} = 4\\;\\mu\\text{F}$.\n   $4\\;\\mu\\text{F}$ in parallel with $4\\;\\mu\\text{F}$ gives $8\\;\\mu\\text{F}$.\n   $8\\;\\mu\\text{F}$ in series with $2\\;\\mu\\text{F}$ gives $\\frac{8 \\times 2}{10} = \\frac{8}{5}\\;\\mu\\text{F}$.\n2. Bottom branch: $2\\;\\mu\\text{F}$ and $2\\;\\mu\\text{F}$ in series give $1\\;\\mu\\text{F}$.\n   $1\\;\\mu\\text{F}$ in parallel with $1\\;\\mu\\text{F}$ gives $2\\;\\mu\\text{F}$.\n   $2\\;\\mu\\text{F}$ in series with $8\\;\\mu\\text{F}$ gives $\\frac{2 \\times 8}{10} = \\frac{8}{5}\\;\\mu\\text{F}$.\n3. The two branches in parallel give $C_{\\text{parallel}} = \\frac{8}{5} + \\frac{8}{5} = \\frac{16}{5}\\;\\mu\\text{F}$.\n4. Now $C$ is in series with $C_{\\text{parallel}} = \\frac{16}{5}\\;\\mu\\text{F}$ to give $C_{AB} = 3\\;\\mu\\text{F}$:\n   $$\\frac{1}{C} + \\frac{5}{16} = \\frac{1}{3} \\implies \\frac{1}{C} = \\frac{1}{3} - \\frac{5}{16} = \\frac{16 - 15}{48} = \\frac{1}{48}$$\n   $$C = 48\\;\\mu\\text{F}$$",
        "needs_image": True,
        "image_url": "/pyq_images/physics/ch16/q17_network.png"
    },
    {
        "id": "phys_ch16_q18",
        "subject": "Physics",
        "chapter": "Electrostatic Potential and Capacitance",
        "chapter_number": 16,
        "questionNumber": 18,
        "year": 2012,
        "question": "In this diagram, the P.D. between $A$ and $B$ is $60\\text{ V}$. The P.D. across $6\\;\\mu\\text{F}$ capacitor is _____ $\\text{V}$\n\n![Capacitor Network](/pyq_images/physics/ch16/q18_network.png)",
        "options": [
            "10",
            "5",
            "20",
            "4"
        ],
        "correct_answer": 0,
        "explanation": "In the central bridge, the two $3\\;\\mu\\text{F}$ capacitors in parallel give $3 + 3 = 6\\;\\mu\\text{F}$.\nThe entire series combination between $A$ and $B$ consists of:\n$6\\;\\mu\\text{F}, 3\\;\\mu\\text{F}, 6\\;\\mu\\text{F}, 3\\;\\mu\\text{F}$.\n$$\\frac{1}{C_{\\text{eq}}} = \\frac{1}{6} + \\frac{1}{3} + \\frac{1}{6} + \\frac{1}{3} = \\frac{1 + 2 + 1 + 2}{6} = \\frac{6}{6} = 1 \\implies C_{\\text{eq}} = 1\\;\\mu\\text{F}$$\nTotal charge $Q = C_{\\text{eq}} V = 1\\;\\mu\\text{F} \\times 60\\text{ V} = 60\\;\\mu\\text{C}$.\nP.D. across the first $6\\;\\mu\\text{F}$ capacitor:\n$$V_1 = \\frac{Q}{6\\;\\mu\\text{F}} = \\frac{60\\;\\mu\\text{C}}{6\\;\\mu\\text{F}} = 10\\text{ V}$$",
        "needs_image": True,
        "image_url": "/pyq_images/physics/ch16/q18_network.png"
    },
    {
        "id": "phys_ch16_q19",
        "subject": "Physics",
        "chapter": "Electrostatic Potential and Capacitance",
        "chapter_number": 16,
        "questionNumber": 19,
        "year": 2012,
        "question": "A capacitor of capacitance of $10\\;\\mu\\text{F}$ is charged to $10\\text{ V}$. The energy stored in it is",
        "options": [
            "$100\\;\\mu\\text{J}$",
            "$500\\;\\mu\\text{J}$",
            "$1000\\;\\mu\\text{J}$",
            "$1\\;\\mu\\text{J}$"
        ],
        "correct_answer": 1,
        "explanation": "$$U = \\frac{1}{2} C V^2 = \\frac{1}{2} \\times (10 \\times 10^{-6}\\text{ F}) \\times (10\\text{ V})^2 = 500 \\times 10^{-6}\\text{ J} = 500\\;\\mu\\text{J}$$",
        "needs_image": False
    },
    {
        "id": "phys_ch16_q20",
        "subject": "Physics",
        "chapter": "Electrostatic Potential and Capacitance",
        "chapter_number": 16,
        "questionNumber": 20,
        "year": 2013,
        "question": "When an additional charge of $2\\text{ C}$ is given to a capacitor, energy stored in it is increased by $21\\%$. The original charge of the capacitor is",
        "options": [
            "$30\\text{ C}$",
            "$40\\text{ C}$",
            "$10\\text{ C}$",
            "$20\\text{ C}$"
        ],
        "correct_answer": 3,
        "explanation": "Energy stored $U = \\frac{Q^2}{2C}$.\nWhen charge becomes $Q' = Q + 2$:\n$$U' = \\frac{(Q + 2)^2}{2C} = 1.21 U = 1.21 \\frac{Q^2}{2C}$$\n$$\\frac{(Q + 2)^2}{Q^2} = 1.21$$\nTaking square root on both sides:\n$$\\frac{Q + 2}{Q} = 1.1 \\implies 1 + \\frac{2}{Q} = 1.1 \\implies \\frac{2}{Q} = 0.1 \\implies Q = 20\\text{ C}$$",
        "needs_image": False
    },
    {
        "id": "phys_ch16_q21",
        "subject": "Physics",
        "chapter": "Electrostatic Potential and Capacitance",
        "chapter_number": 16,
        "questionNumber": 21,
        "year": 2013,
        "question": "When a potential difference of $10^3\\text{ V}$ is applied between $A$ and $B$, a charge of $0.75\\text{ mC}$ is stored in the system of capacitors as shown. The value of $C$ is (in $\\mu\\text{F}$)\n\n![Capacitor Network](/pyq_images/physics/ch16/q21_network.png)",
        "options": [
            "1/2",
            "2",
            "2.5",
            "3"
        ],
        "correct_answer": 1,
        "explanation": "Effective capacitance $C_{\\text{eq}} = \\frac{Q}{V} = \\frac{0.75 \\times 10^{-3}\\text{ C}}{10^3\\text{ V}} = 0.75\\;\\mu\\text{F} = \\frac{3}{4}\\;\\mu\\text{F}$.\nFrom circuit symmetry:\n- The two $2\\;\\mu\\text{F}$ capacitors in series on top give $1\\;\\mu\\text{F}$.\n- The two $2\\;\\mu\\text{F}$ on bottom/right reduce similarly.\nCombined bridge equivalence yields:\n$$C_{\\text{eq}} = \\frac{C + 1}{C + 2} = \\frac{3}{4} \\implies 4C + 4 = 3C + 6 \\implies C = 2\\;\\mu\\text{F}$$",
        "needs_image": True,
        "image_url": "/pyq_images/physics/ch16/q21_network.png"
    },
    {
        "id": "phys_ch16_q22",
        "subject": "Physics",
        "chapter": "Electrostatic Potential and Capacitance",
        "chapter_number": 16,
        "questionNumber": 22,
        "year": 2013,
        "question": "See the diagram. Area of each plate is $2.0\\text{ m}^2$ and $d = 2 \\times 10^{-3}\\text{ m}$. A charge of $8.85 \\times 10^{-8}\\text{ C}$ is given to $Q$. Then the potential of $Q$ becomes\n\n![Plates P Q R](/pyq_images/physics/ch16/q22_plates.png)",
        "options": [
            "$13\\text{ V}$",
            "$10\\text{ V}$",
            "$6.67\\text{ V}$",
            "$8.825\\text{ V}$"
        ],
        "correct_answer": 2,
        "explanation": "Plate $Q$ forms two parallel capacitors: with grounded plate $P$ (separation $d$) and grounded plate $R$ (separation $2d$).\n$$C_1 = \\frac{\\varepsilon_0 A}{d}, \\quad C_2 = \\frac{\\varepsilon_0 A}{2d}$$\nTotal equivalent capacitance connected to ground:\n$$C_{\\text{eq}} = C_1 + C_2 = \\frac{3\\varepsilon_0 A}{2d}$$\nPotential of $Q$ ($V = V_Q - 0$):\n$$V_Q = \\frac{q}{C_{\\text{eq}}} = \\frac{2qd}{3\\varepsilon_0 A} = \\frac{2 \\times (8.85 \\times 10^{-8}) \\times (2 \\times 10^{-3})}{3 \\times (8.85 \\times 10^{-12}) \\times 2.0} = \\frac{4 \\times 10^{-11}}{6 \\times 10^{-12}} = \\frac{40}{6} = 6.67\\text{ V}$$",
        "needs_image": True,
        "image_url": "/pyq_images/physics/ch16/q22_plates.png"
    },
    {
        "id": "phys_ch16_q23",
        "subject": "Physics",
        "chapter": "Electrostatic Potential and Capacitance",
        "chapter_number": 16,
        "questionNumber": 23,
        "year": 2013,
        "question": "A small oil drop of mass $10^{-6}\\text{ kg}$ is hanging in at rest between two plates separated by $1\\text{ mm}$ having a potential difference of $500\\text{ V}$. The charge on the drop is _____ ($g = 10\\text{ m s}^{-2}$)",
        "options": [
            "$2 \\times 10^{-9}\\text{ C}$",
            "$2 \\times 10^{-11}\\text{ C}$",
            "$2 \\times 10^{-6}\\text{ C}$",
            "$2 \\times 10^{-8}\\text{ C}$"
        ],
        "correct_answer": 1,
        "explanation": "At equilibrium, electric force balances weight:\n$$qE = mg \\implies q\\left(\\frac{V}{d}\\right) = mg$$\n$$q = \\frac{mgd}{V} = \\frac{10^{-6} \\times 10 \\times 10^{-3}}{500} = \\frac{10^{-8}}{500} = 2 \\times 10^{-11}\\text{ C}$$",
        "needs_image": False
    },
    {
        "id": "phys_ch16_q24",
        "subject": "Physics",
        "chapter": "Electrostatic Potential and Capacitance",
        "chapter_number": 16,
        "questionNumber": 24,
        "year": 2013,
        "question": "Two metal spheres of radii $0.01\\text{ m}$ and $0.02\\text{ m}$ are given a charge of $15\\text{ mC}$ and $45\\text{ mC}$ respectively. They are then connected by a wire. The final charge on the first sphere is _____ $\\times 10^{-3}\\text{ C}$.",
        "options": [
            "40",
            "30",
            "20",
            "10"
        ],
        "correct_answer": 2,
        "explanation": "When connected, charge redistributes in direct proportion to their radii (capacitances $C \\propto r$):\n$$q_1' = \\left(\\frac{r_1}{r_1 + r_2}\\right)(Q_1 + Q_2) = \\left(\\frac{0.01}{0.01 + 0.02}\\right)(15 + 45) = \\frac{1}{3} \\times 60 = 20\\text{ mC} = 20 \\times 10^{-3}\\text{ C}$$",
        "needs_image": False
    },
    {
        "id": "phys_ch16_q25",
        "subject": "Physics",
        "chapter": "Electrostatic Potential and Capacitance",
        "chapter_number": 16,
        "questionNumber": 25,
        "year": 2013,
        "question": "Two concentric spheres of radii $R$ and $r$ have positive charges $q_1$ and $q_2$ with equal surface charge densities. What is the electric potential at their common centre?",
        "options": [
            "$\\frac{\\sigma}{\\varepsilon_0}(R + r)$",
            "$\\frac{\\sigma}{\\varepsilon_0}(R - r)$",
            "$\\frac{\\sigma}{\\varepsilon_0}\\left(\\frac{1}{R} + \\frac{1}{r}\\right)$",
            "$\\frac{\\sigma}{\\varepsilon_0}\\left(\\frac{R}{r}\\right)$"
        ],
        "correct_answer": 0,
        "explanation": "Given $\\sigma_1 = \\sigma_2 = \\sigma$, so $q_1 = 4\\pi R^2 \\sigma$ and $q_2 = 4\\pi r^2 \\sigma$.\nPotential at the common centre $O$:\n$$V = \\frac{1}{4\\pi\\varepsilon_0}\\left(\\frac{q_1}{R} + \\frac{q_2}{r}\\right) = \\frac{1}{4\\pi\\varepsilon_0}\\left(\\frac{4\\pi R^2 \\sigma}{R} + \\frac{4\\pi r^2 \\sigma}{r}\\right) = \\frac{\\sigma}{\\varepsilon_0}(R + r)$$",
        "needs_image": False
    },
    {
        "id": "phys_ch16_q26",
        "subject": "Physics",
        "chapter": "Electrostatic Potential and Capacitance",
        "chapter_number": 16,
        "questionNumber": 26,
        "year": 2014,
        "question": "Two capacitors of $10\\text{ pF}$ and $20\\text{ pF}$ are connected to $200\\text{ V}$ and $100\\text{ V}$ sources respectively. If they are connected by the wire, what is the common potential of the capacitors?",
        "options": [
            "$300\\text{ volt}$",
            "$133.3\\text{ volt}$",
            "$400\\text{ volt}$",
            "$150\\text{ volt}$"
        ],
        "correct_answer": 1,
        "explanation": "Common potential:\n$$V = \\frac{C_1 V_1 + C_2 V_2}{C_1 + C_2} = \\frac{10 \\times 200 + 20 \\times 100}{10 + 20} = \\frac{2000 + 2000}{30} = \\frac{4000}{30} = 133.3\\text{ V}$$",
        "needs_image": False
    },
    {
        "id": "phys_ch16_q27",
        "subject": "Physics",
        "chapter": "Electrostatic Potential and Capacitance",
        "chapter_number": 16,
        "questionNumber": 27,
        "year": 2014,
        "question": "What is the electric potential at a distance of $9\\text{ cm}$ from $3\\text{ nC}$?",
        "options": [
            "$300\\text{ V}$",
            "$270\\text{ V}$",
            "$30\\text{ V}$",
            "$3\\text{ V}$"
        ],
        "correct_answer": 0,
        "explanation": "$$V = \\frac{1}{4\\pi\\varepsilon_0}\\frac{Q}{r} = \\frac{9 \\times 10^9 \\times 3 \\times 10^{-9}}{9 \\times 10^{-2}} = 300\\text{ V}$$",
        "needs_image": False
    },
    {
        "id": "phys_ch16_q28",
        "subject": "Physics",
        "chapter": "Electrostatic Potential and Capacitance",
        "chapter_number": 16,
        "questionNumber": 28,
        "year": 2014,
        "question": "A voltmeter reads $4\\text{ V}$ when connected to a parallel plate capacitor with air as a dielectric. When a dielectric slab is introduced between plates for the same configuration, voltmeter reads $2\\text{ V}$. What is the dielectric constant of the material?",
        "options": [
            "8",
            "0.5",
            "10",
            "2"
        ],
        "correct_answer": 3,
        "explanation": "For an isolated charged capacitor, introducing a dielectric slab reduces potential difference by factor $K$:\n$$V = \\frac{V_0}{K} \\implies K = \\frac{V_0}{V} = \\frac{4\\text{ V}}{2\\text{ V}} = 2$$",
        "needs_image": False
    },
    {
        "id": "phys_ch16_q29",
        "subject": "Physics",
        "chapter": "Electrostatic Potential and Capacitance",
        "chapter_number": 16,
        "questionNumber": 29,
        "year": 2015,
        "question": "A parallel plate capacitor is charged and then isolated. The effect of increasing the plate separation on charge, potential and capacitance respectively are",
        "options": [
            "increases, decreases, decreases",
            "constant, increases, decreases",
            "constant, decreases, decreases",
            "constant, decreases, increases"
        ],
        "correct_answer": 1,
        "explanation": "- Because the capacitor is **isolated**, charge $Q$ remains **constant**.\n- Capacitance $C = \\frac{\\varepsilon_0 A}{d}$, so increasing $d$ causes $C$ to **decrease**.\n- Potential $V = \\frac{Q}{C}$, so decreasing $C$ causes $V$ to **increase**.\nTherefore: **constant, increases, decreases**.",
        "needs_image": False
    },
    {
        "id": "phys_ch16_q30",
        "subject": "Physics",
        "chapter": "Electrostatic Potential and Capacitance",
        "chapter_number": 16,
        "questionNumber": 30,
        "year": 2015,
        "question": "A spherical shell of radius $10\\text{ cm}$ is carrying a charge $q$. If the electric potential at distances $5\\text{ cm}, 10\\text{ cm}$ and $15\\text{ cm}$ from the centre of the spherical shell is $V_1, V_2$ and $V_3$ respectively, then",
        "options": [
            "$V_1 < V_2 < V_3$",
            "$V_1 = V_2 < V_3$",
            "$V_1 > V_2 > V_3$",
            "$V_1 = V_2 > V_3$"
        ],
        "correct_answer": 3,
        "explanation": "For a conducting spherical shell of radius $R = 10\\text{ cm}$:\n- Inside ($r = 5\\text{ cm} < R$), potential is constant and equals the surface potential: $V_1 = V_{\\text{surface}} = \\frac{kq}{R}$.\n- On surface ($r = 10\\text{ cm}$): $V_2 = \\frac{kq}{R} = V_1$.\n- Outside ($r = 15\\text{ cm} > R$): $V_3 = \\frac{kq}{r} < \\frac{kq}{R}$.\nThus: $V_1 = V_2 > V_3$.",
        "needs_image": False
    },
    {
        "id": "phys_ch16_q31",
        "subject": "Physics",
        "chapter": "Electrostatic Potential and Capacitance",
        "chapter_number": 16,
        "questionNumber": 31,
        "year": 2016,
        "question": "Nature of equipotential surface for a point charge is",
        "options": [
            "Ellipsoid with charge at foci.",
            "Sphere with charge at the centre of the sphere.",
            "Sphere with charge on the surface of the sphere.",
            "Plane with charge on the surface."
        ],
        "correct_answer": 1,
        "explanation": "Potential of a point charge $q$ is $V = \\frac{kq}{r}$, which depends only on the radial distance $r$. Thus, surfaces of constant potential are concentric spheres centered at the point charge.",
        "needs_image": False
    },
    {
        "id": "phys_ch16_q32",
        "subject": "Physics",
        "chapter": "Electrostatic Potential and Capacitance",
        "chapter_number": 16,
        "questionNumber": 32,
        "year": 2016,
        "question": "A particle of mass $1\\text{ gm}$ and charge $1\\;\\mu\\text{C}$ is held at rest on a frictionless horizontal surface at distance $1\\text{ m}$ from the fixed charge $2\\text{ mC}$. If the particle is released, it will be repelled. The speed of the particle when it is at a distance of $10\\text{ m}$ from the fixed charge is",
        "options": [
            "$60\\text{ m s}^{-1}$",
            "$100\\text{ m s}^{-1}$",
            "$90\\text{ m s}^{-1}$",
            "$180\\text{ m s}^{-1}$"
        ],
        "correct_answer": 3,
        "explanation": "By conservation of mechanical energy:\n$$\\frac{1}{2} m v^2 = U_i - U_f = \\frac{1}{4\\pi\\varepsilon_0} q_1 q_2 \\left(\\frac{1}{r_1} - \\frac{1}{r_2}\\right)$$\n$$\\frac{1}{2} (10^{-3}) v^2 = (9 \\times 10^9) \\times (2 \\times 10^{-3}) \\times (10^{-6}) \\left(1 - \\frac{1}{10}\\right)$$\n$$\\frac{1}{2} \\times 10^{-3} v^2 = 18 \\times \\frac{9}{10} = 16.2$$\n$$v^2 = \\frac{2 \\times 16.2}{10^{-3}} = 32400$$\n$$v = \\sqrt{32400} = 180\\text{ m s}^{-1}$$",
        "needs_image": False
    },
    {
        "id": "phys_ch16_q33",
        "subject": "Physics",
        "chapter": "Electrostatic Potential and Capacitance",
        "chapter_number": 16,
        "questionNumber": 33,
        "year": 2016,
        "question": "Four metal plates are arranged as shown. Capacitance between $X$ and $Y$ ($A \\rightarrow$ Area of each plate, $d \\rightarrow$ distance between the plates)\n\n![Metal Plates](/pyq_images/physics/ch16/q33_plates.png)",
        "options": [
            "$\\frac{3}{2}\\frac{\\varepsilon_0 A}{d}$",
            "$\\frac{2\\varepsilon_0 A}{d}$",
            "$\\frac{2}{3}\\frac{\\varepsilon_0 A}{d}$",
            "$\\frac{3\\varepsilon_0 A}{d}$"
        ],
        "correct_answer": 2,
        "explanation": "Plates 1, 2, 3, 4 form 3 capacitors: $C_{12}, C_{23}, C_{34}$.\nPlate 1 is connected to $X$.\nPlates 2 and 4 are connected together.\nPlate 3 is connected to $Y$.\n- $C_{23}$ and $C_{34}$ are in parallel between (2,4) and $Y$, giving $2C$.\n- $C_{12}$ is between $X$ and (2,4) with capacitance $C$.\n- The combination is $C$ in series with $2C$ between $X$ and $Y$:\n$$C_{XY} = \\frac{C \\times 2C}{C + 2C} = \\frac{2}{3} C = \\frac{2}{3}\\frac{\\varepsilon_0 A}{d}$$",
        "needs_image": True,
        "image_url": "/pyq_images/physics/ch16/q33_plates.png"
    },
    {
        "id": "phys_ch16_q34",
        "subject": "Physics",
        "chapter": "Electrostatic Potential and Capacitance",
        "chapter_number": 16,
        "questionNumber": 34,
        "year": 2017,
        "question": "A system of 2 capacitors of capacitance $2\\;\\mu\\text{F}$ and $4\\;\\mu\\text{F}$ is connected in series across a potential difference of $6\\text{ V}$. The electric charge and energy stored in the system are",
        "options": [
            "$1\\;\\mu\\text{C}$ and $3\\;\\mu\\text{J}$",
            "$8\\;\\mu\\text{C}$ and $24\\;\\mu\\text{J}$",
            "$10\\;\\mu\\text{C}$ and $30\\;\\mu\\text{J}$",
            "$36\\;\\mu\\text{C}$ and $108\\;\\mu\\text{J}$"
        ],
        "correct_answer": 1,
        "explanation": "Equivalent capacitance in series:\n$$C = \\frac{2 \\times 4}{2 + 4} = \\frac{8}{6} = \\frac{4}{3}\\;\\mu\\text{F}$$\nCharge stored:\n$$Q = C V = \\frac{4}{3}\\;\\mu\\text{F} \\times 6\\text{ V} = 8\\;\\mu\\text{C}$$\nEnergy stored:\n$$U = \\frac{1}{2} C V^2 = \\frac{1}{2} \\times \\frac{4}{3}\\;\\mu\\text{F} \\times 36 = 24\\;\\mu\\text{J}$$",
        "needs_image": False
    },
    {
        "id": "phys_ch16_q35",
        "subject": "Physics",
        "chapter": "Electrostatic Potential and Capacitance",
        "chapter_number": 16,
        "questionNumber": 35,
        "year": 2017,
        "question": "Two point charges $A = +3\\text{ nC}$ and $B = +1\\text{ nC}$ are placed $5\\text{ cm}$ apart in air. The work done to move charge $B$ towards $A$ by $1\\text{ cm}$ is",
        "options": [
            "$2.0 \\times 10^{-7}\\text{ J}$",
            "$1.35 \\times 10^{-7}\\text{ J}$",
            "$2.7 \\times 10^{-7}\\text{ J}$",
            "$12.1 \\times 10^{-7}\\text{ J}$"
        ],
        "correct_answer": 1,
        "explanation": "Initial distance $r_i = 5\\text{ cm} = 0.05\\text{ m}$, final distance $r_f = 4\\text{ cm} = 0.04\\text{ m}$.\n$$W = \\Delta U = \\frac{1}{4\\pi\\varepsilon_0} q_A q_B \\left(\\frac{1}{r_f} - \\frac{1}{r_i}\\right)$$\n$$W = (9 \\times 10^9) \\times (3 \\times 10^{-9}) \\times (1 \\times 10^{-9}) \\left(\\frac{1}{0.04} - \\frac{1}{0.05}\\right)$$\n$$W = 27 \\times 10^{-9} \\times (25 - 20) = 27 \\times 10^{-9} \\times 5 = 135 \\times 10^{-9}\\text{ J} = 1.35 \\times 10^{-7}\\text{ J}$$",
        "needs_image": False
    },
    {
        "id": "phys_ch16_q36",
        "subject": "Physics",
        "chapter": "Electrostatic Potential and Capacitance",
        "chapter_number": 16,
        "questionNumber": 36,
        "year": 2017,
        "question": "The minimum value of effective capacitance that can be obtained by combining 3 capacitors of capacitances $1\\text{ pF}, 2\\text{ pF}$ and $4\\text{ pF}$ is",
        "options": [
            "$\\frac{7}{4}\\text{ pF}$",
            "$\\frac{4}{7}\\text{ pF}$",
            "$1\\text{ pF}$",
            "$2\\text{ pF}$"
        ],
        "correct_answer": 1,
        "explanation": "Minimum capacitance is achieved when all capacitors are connected in series:\n$$\\frac{1}{C_s} = \\frac{1}{1} + \\frac{1}{2} + \\frac{1}{4} = \\frac{4 + 2 + 1}{4} = \\frac{7}{4} \\implies C_s = \\frac{4}{7}\\text{ pF}$$",
        "needs_image": False
    },
    {
        "id": "phys_ch16_q37",
        "subject": "Physics",
        "chapter": "Electrostatic Potential and Capacitance",
        "chapter_number": 16,
        "questionNumber": 37,
        "year": 2018,
        "question": "A mass of $1\\text{ kg}$ carrying a charge of $2\\text{ C}$ is accelerated through a potential of $1\\text{ V}$. The velocity acquired by it is",
        "options": [
            "$\\sqrt{2}\\text{ m s}^{-1}$",
            "$2\\text{ m s}^{-1}$",
            "$\\frac{1}{\\sqrt{2}}\\text{ m s}^{-1}$",
            "$\\frac{1}{2}\\text{ m s}^{-1}$"
        ],
        "correct_answer": 1,
        "explanation": "$$\\frac{1}{2} m v^2 = qV \\implies v = \\sqrt{\\frac{2qV}{m}} = \\sqrt{\\frac{2(2)(1)}{1}} = \\sqrt{4} = 2\\text{ m s}^{-1}$$",
        "needs_image": False
    },
    {
        "id": "phys_ch16_q38",
        "subject": "Physics",
        "chapter": "Electrostatic Potential and Capacitance",
        "chapter_number": 16,
        "questionNumber": 38,
        "year": 2018,
        "question": "For the arrangement of capacitors as shown in the circuit, the effective capacitance between the points $A$ and $B$ is (capacitance of each capacitor is $4\\;\\mu\\text{F}$)\n\n![Capacitor Bridge](/pyq_images/physics/ch16/q38_bridge.png)",
        "options": [
            "$4\\;\\mu\\text{F}$",
            "$2\\;\\mu\\text{F}$",
            "$1\\;\\mu\\text{F}$",
            "$8\\;\\mu\\text{F}$"
        ],
        "correct_answer": 0,
        "explanation": "The 5 capacitors form a balanced Wheatstone bridge:\n$$\\frac{C_1}{C_2} = \\frac{C_3}{C_4} = 1$$\nThe central vertical capacitor carries no charge and is inactive.\nThe remaining 4 capacitors form two parallel branches of two $4\\;\\mu\\text{F}$ capacitors in series:\n$$C_{\\text{top}} = \\frac{4}{2} = 2\\;\\mu\\text{F}, \\quad C_{\\text{bottom}} = \\frac{4}{2} = 2\\;\\mu\\text{F}$$\n$$C_{AB} = 2 + 2 = 4\\;\\mu\\text{F}$$",
        "needs_image": True,
        "image_url": "/pyq_images/physics/ch16/q38_bridge.png"
    },
    {
        "id": "phys_ch16_q39",
        "subject": "Physics",
        "chapter": "Electrostatic Potential and Capacitance",
        "chapter_number": 16,
        "questionNumber": 39,
        "year": 2018,
        "question": "The work done to move a charge on an equipotential surface is",
        "options": [
            "infinity",
            "less than 1",
            "greater than 1",
            "zero"
        ],
        "correct_answer": 3,
        "explanation": "$$W = q \\Delta V = q(V_B - V_A)$$\nOn an equipotential surface, $V_A = V_B \\implies \\Delta V = 0 \\implies W = 0$.",
        "needs_image": False
    },
    {
        "id": "phys_ch16_q40",
        "subject": "Physics",
        "chapter": "Electrostatic Potential and Capacitance",
        "chapter_number": 16,
        "questionNumber": 40,
        "year": 2018,
        "question": "Two capacitors of $3\\;\\mu\\text{F}$ and $6\\;\\mu\\text{F}$ are connected in series and a potential difference of $900\\text{ V}$ is applied across the combination. They are then disconnected and reconnected in parallel. The potential difference across the combination is",
        "options": [
            "zero",
            "$100\\text{ V}$",
            "$200\\text{ V}$",
            "$400\\text{ V}$"
        ],
        "correct_answer": 3,
        "explanation": "In series, charges on both capacitors are equal:\n$$C_s = \\frac{3 \\times 6}{3 + 6} = 2\\;\\mu\\text{F}$$\n$$Q = C_s V = 2\\;\\mu\\text{F} \\times 900\\text{ V} = 1800\\;\\mu\\text{C}$$\nEach capacitor has charge $Q_1 = Q_2 = 1800\\;\\mu\\text{C}$.\nWhen reconnected in parallel with like plates joined:\n$$Q_{\\text{total}} = 1800 + 1800 = 3600\\;\\mu\\text{C}$$\n$$C_p = 3 + 6 = 9\\;\\mu\\text{F}$$\n$$V' = \\frac{Q_{\\text{total}}}{C_p} = \\frac{3600\\;\\mu\\text{C}}{9\\;\\mu\\text{F}} = 400\\text{ V}$$",
        "needs_image": False
    },
    {
        "id": "phys_ch16_q41",
        "subject": "Physics",
        "chapter": "Electrostatic Potential and Capacitance",
        "chapter_number": 16,
        "questionNumber": 41,
        "year": 2019,
        "question": "Two metal plates are separated by $2\\text{ cm}$. The potentials of the plates are $-10\\text{ V}$ and $+30\\text{ V}$. The electric field between the two plates is",
        "options": [
            "$2000\\text{ V m}^{-1}$",
            "$500\\text{ V m}^{-1}$",
            "$3000\\text{ V m}^{-1}$",
            "$1000\\text{ V m}^{-1}$"
        ],
        "correct_answer": 0,
        "explanation": "$$E = \\frac{|\\Delta V|}{\\Delta r} = \\frac{30 - (-10)}{2 \\times 10^{-2}\\text{ m}} = \\frac{40}{0.02} = 2000\\text{ V m}^{-1}$$",
        "needs_image": False
    },
    {
        "id": "phys_ch16_q42",
        "subject": "Physics",
        "chapter": "Electrostatic Potential and Capacitance",
        "chapter_number": 16,
        "questionNumber": 42,
        "year": 2019,
        "question": "The equivalent capacitance between $A$ and $B$ is,\n\n![Capacitor Network](/pyq_images/physics/ch16/q42_network.png)",
        "options": [
            "$150\\text{ pF}$",
            "$50\\text{ pF}$",
            "$300\\text{ pF}$",
            "$\\frac{100}{3}\\text{ pF}$"
        ],
        "correct_answer": 3,
        "explanation": "1. The two $100\\text{ pF}$ capacitors in series give $\\frac{100}{2} = 50\\text{ pF}$.\n2. This $50\\text{ pF}$ in parallel with the $50\\text{ pF}$ capacitor gives $50 + 50 = 100\\text{ pF}$.\n3. This $100\\text{ pF}$ is in series with the remaining $50\\text{ pF}$ capacitor:\n   $$C_{AB} = \\frac{100 \\times 50}{100 + 50} = \\frac{5000}{150} = \\frac{100}{3}\\text{ pF}$$",
        "needs_image": True,
        "image_url": "/pyq_images/physics/ch16/q42_network.png"
    },
    {
        "id": "phys_ch16_q43",
        "subject": "Physics",
        "chapter": "Electrostatic Potential and Capacitance",
        "chapter_number": 16,
        "questionNumber": 43,
        "year": 2019,
        "question": "A capacitor of capacitance $C$ charged by an amount $Q$ is connected in parallel with an uncharged capacitor of capacitance $2C$. The final charges on the capacitors are",
        "options": [
            "$\\frac{Q}{3}, \\frac{2Q}{3}$",
            "$\\frac{Q}{2}, \\frac{Q}{2}$",
            "$\\frac{Q}{5}, \\frac{4Q}{5}$",
            "$\\frac{Q}{4}, \\frac{3Q}{4}$"
        ],
        "correct_answer": 0,
        "explanation": "Common potential $V = \\frac{Q}{C + 2C} = \\frac{Q}{3C}$.\nFinal charge on capacitor $C$:\n$$Q_1 = C V = C \\left(\\frac{Q}{3C}\\right) = \\frac{Q}{3}$$\nFinal charge on capacitor $2C$:\n$$Q_2 = (2C) V = 2C \\left(\\frac{Q}{3C}\\right) = \\frac{2Q}{3}$$",
        "needs_image": False
    },
    {
        "id": "phys_ch16_q44",
        "subject": "Physics",
        "chapter": "Electrostatic Potential and Capacitance",
        "chapter_number": 16,
        "questionNumber": 44,
        "year": 2019,
        "question": "A particle of mass $m$ and charge $q$ is placed at rest in uniform electric field $E$ and then released. The kinetic energy attained by the particle after moving a distance $y$ is",
        "options": [
            "$qEy$",
            "$qEy^2$",
            "$q^2Ey$",
            "$qE^2y$"
        ],
        "correct_answer": 0,
        "explanation": "Work done by electrostatic force $F = qE$ over distance $y$ is:\n$$W = F \\cdot y = qEy$$\nBy work-energy theorem, $\\Delta K = K_f - 0 = W = qEy$.",
        "needs_image": False
    },
    {
        "id": "phys_ch16_q45",
        "subject": "Physics",
        "chapter": "Electrostatic Potential and Capacitance",
        "chapter_number": 16,
        "questionNumber": 45,
        "year": 2019,
        "question": "The figure gives the electric potential $V$ as a function of distance through four regions on $x$-axis. Which of the following is true for the magnitude of the electric field $E$ in these regions?\n\n![V vs x graph](/pyq_images/physics/ch16/q45_graph.png)",
        "options": [
            "$E_B = E_D$ and $E_A < E_C$",
            "$E_A > E_B > E_C > E_D$",
            "$E_A < E_B < E_C < E_D$",
            "$E_A = E_C$ and $E_B < E_D$"
        ],
        "correct_answer": 3,
        "explanation": "Magnitude of electric field is the absolute slope of the $V-x$ curve ($E = |-\\frac{dV}{dx}|$):\n- In regions $A$ and $C$, $V$ is constant, so slope $= 0 \\implies E_A = E_C = 0$.\n- In region $B$: slope $= \\frac{4 - 2}{2 - 1} = 2 \\implies E_B = 2\\text{ V m}^{-1}$.\n- In region $D$: slope $= |\\frac{0 - 4}{5 - 4}| = 4 \\implies E_D = 4\\text{ V m}^{-1}$.\nThus, $E_A = E_C = 0$ and $E_B < E_D$.",
        "needs_image": True,
        "image_url": "/pyq_images/physics/ch16/q45_graph.png"
    },
    {
        "id": "phys_ch16_q46",
        "subject": "Physics",
        "chapter": "Electrostatic Potential and Capacitance",
        "chapter_number": 16,
        "questionNumber": 46,
        "year": 2019,
        "question": "A system of two charges separated by a certain distance apart stores electrical potential energy. If the distance between them is increased, the potential energy of the system,",
        "options": [
            "may increase or decrease",
            "increases in any case",
            "remains the same",
            "decreases in any case."
        ],
        "correct_answer": 0,
        "explanation": "$$U = \\frac{1}{4\\pi\\varepsilon_0}\\frac{q_1 q_2}{r}$$\n- If charges are like ($q_1 q_2 > 0$), increasing $r$ makes $U$ **decrease** towards zero.\n- If charges are unlike ($q_1 q_2 < 0$), $U$ is negative, so increasing $r$ makes $U$ **increase** (becomes less negative, approaching zero).\nHence, it **may increase or decrease** depending on the signs of the charges.",
        "needs_image": False
    },
    {
        "id": "phys_ch16_q47",
        "subject": "Physics",
        "chapter": "Electrostatic Potential and Capacitance",
        "chapter_number": 16,
        "questionNumber": 47,
        "year": 2020,
        "question": "Figure shows three points $A, B$ and $C$ in a region of uniform electric field $\\vec{E}$. The line $AB$ is perpendicular and $BC$ is parallel to the field lines. Then which of the following holds good? ($V_A, V_B$ and $V_C$ represent the electric potential at points $A, B$ and $C$ respectively)\n\n![Electric Field Points](/pyq_images/physics/ch16/q47_field.png)",
        "options": [
            "$V_A = V_B < V_C$",
            "$V_A > V_B = V_C$",
            "$V_A = V_B = V_C$",
            "$V_A = V_B > V_C$"
        ],
        "correct_answer": 3,
        "explanation": "1. Line $AB$ is perpendicular to $\\vec{E}$, so $A$ and $B$ lie on the same equipotential surface: $V_A = V_B$.\n2. Electric field points in the direction of decreasing potential. Since $C$ is downstream along the field line from $B$, $V_B > V_C$.\nTherefore: $V_A = V_B > V_C$.",
        "needs_image": True,
        "image_url": "/pyq_images/physics/ch16/q47_field.png"
    },
    {
        "id": "phys_ch16_q48",
        "subject": "Physics",
        "chapter": "Electrostatic Potential and Capacitance",
        "chapter_number": 16,
        "questionNumber": 48,
        "year": 2020,
        "question": "A dipole of dipole moment $P$ and moment of inertia $I$ is placed in a uniform electric field $\\vec{E}$. If it is displaced slightly from its stable equilibrium position, the period of oscillation of dipole is",
        "options": [
            "$\\frac{1}{2\\pi}\\sqrt{\\frac{PE}{I}}$",
            "$\\pi\\sqrt{\\frac{I}{PE}}$",
            "$\\sqrt{\\frac{PE}{I}}$",
            "$2\\pi\\sqrt{\\frac{I}{PE}}$"
        ],
        "correct_answer": 3,
        "explanation": "Restoring torque $\\tau = -PE\\sin\\theta \\approx -PE\\theta$.\n$$\\tau = I\\alpha \\implies I\\frac{d^2\\theta}{dt^2} + PE\\theta = 0$$\n$$\\omega = \\sqrt{\\frac{PE}{I}} \\implies T = \\frac{2\\pi}{\\omega} = 2\\pi\\sqrt{\\frac{I}{PE}}$$",
        "needs_image": False
    },
    {
        "id": "phys_ch16_q49",
        "subject": "Physics",
        "chapter": "Electrostatic Potential and Capacitance",
        "chapter_number": 16,
        "questionNumber": 49,
        "year": 2020,
        "question": "The difference between equivalent capacitances of two identical capacitors connected in parallel to that in series is $6\\;\\mu\\text{F}$. The value of capacitance of each capacitor is",
        "options": [
            "$4\\;\\mu\\text{F}$",
            "$6\\;\\mu\\text{F}$",
            "$2\\;\\mu\\text{F}$",
            "$3\\;\\mu\\text{F}$"
        ],
        "correct_answer": 0,
        "explanation": "$$C_p = 2C, \\quad C_s = \\frac{C}{2}$$\n$$C_p - C_s = 2C - \\frac{C}{2} = \\frac{3C}{2} = 6\\;\\mu\\text{F}$$\n$$3C = 12\\;\\mu\\text{F} \\implies C = 4\\;\\mu\\text{F}$$",
        "needs_image": False
    },
    {
        "id": "phys_ch16_q50",
        "subject": "Physics",
        "chapter": "Electrostatic Potential and Capacitance",
        "chapter_number": 16,
        "questionNumber": 50,
        "year": 2020,
        "question": "A hot filament liberates an electron with zero initial velocity. The anode potential is $1200\\text{ V}$. The speed of the electron when it strikes the anode is",
        "options": [
            "$2.1 \\times 10^7\\text{ m s}^{-1}$",
            "$2.5 \\times 10^8\\text{ m s}^{-1}$",
            "$1.5 \\times 10^5\\text{ m s}^{-1}$",
            "$2.5 \\times 10^6\\text{ m s}^{-1}$"
        ],
        "correct_answer": 0,
        "explanation": "$$\\frac{1}{2} m v^2 = eV \\implies v = \\sqrt{\\frac{2eV}{m}}$$\n$$v = \\sqrt{\\frac{2 \\times 1.6 \\times 10^{-19} \\times 1200}{9.1 \\times 10^{-31}}} = \\sqrt{\\frac{3.84 \\times 10^{-16}}{9.1 \\times 10^{-31}}} = \\sqrt{4.22 \\times 10^{14}} = 2.05 \\times 10^7 \\approx 2.1 \\times 10^7\\text{ m s}^{-1}$$",
        "needs_image": False
    },
    {
        "id": "phys_ch16_q51",
        "subject": "Physics",
        "chapter": "Electrostatic Potential and Capacitance",
        "chapter_number": 16,
        "questionNumber": 51,
        "year": 2021,
        "question": "If a slab of insulating material, $4 \\times 10^{-3}\\text{ m}$ thick is introduced between the plates of a parallel plate capacitor, the separation between the plates has to be increased by $3.5 \\times 10^{-3}\\text{ m}$ to restore the capacity to original value. The dielectric constant of the material will be",
        "options": [
            "6",
            "8",
            "10",
            "12"
        ],
        "correct_answer": 1,
        "explanation": "The effective increase in plate separation to keep capacitance constant is given by:\n$$x = t\\left(1 - \\frac{1}{K}\\right)$$\nGiven $t = 4 \\times 10^{-3}\\text{ m}$ and $x = 3.5 \\times 10^{-3}\\text{ m}$:\n$$3.5 \\times 10^{-3} = 4 \\times 10^{-3} \\left(1 - \\frac{1}{K}\\right)$$\n$$1 - \\frac{1}{K} = \\frac{3.5}{4} = \\frac{7}{8} \\implies \\frac{1}{K} = 1 - \\frac{7}{8} = \\frac{1}{8} \\implies K = 8$$",
        "needs_image": False
    },
    {
        "id": "phys_ch16_q52",
        "subject": "Physics",
        "chapter": "Electrostatic Potential and Capacitance",
        "chapter_number": 16,
        "questionNumber": 52,
        "year": 2021,
        "question": "Eight drops of mercury of equal radii combine to form a big drop. The capacitance of a bigger drop as compared to each smaller drop is",
        "options": [
            "2 times",
            "8 times",
            "4 times",
            "16 times"
        ],
        "correct_answer": 0,
        "explanation": "Capacitance of a spherical drop $C = 4\\pi\\varepsilon_0 R$.\nVolume conservation: $R = 8^{1/3} r = 2r$.\n$$C' = 4\\pi\\varepsilon_0 R = 4\\pi\\varepsilon_0 (2r) = 2 C$$",
        "needs_image": False
    },
    {
        "id": "phys_ch16_q53",
        "subject": "Physics",
        "chapter": "Electrostatic Potential and Capacitance",
        "chapter_number": 16,
        "questionNumber": 53,
        "year": 2021,
        "question": "An electrician requires a capacitance of $6\\;\\mu\\text{F}$ in a circuit across a potential difference of $1.5\\text{ kV}$. A large number of $2\\;\\mu\\text{F}$ capacitors which can withstand a potential difference of not more than $500\\text{ V}$ are available. The minimum number of capacitors required for the purpose is",
        "options": [
            "3",
            "9",
            "6",
            "27"
        ],
        "correct_answer": 3,
        "explanation": "1. Capacitors per row in series: $n = \\frac{1500\\text{ V}}{500\\text{ V}} = 3$.\n2. Capacitance per row: $C_{\\text{row}} = \\frac{2\\;\\mu\\text{F}}{3}$.\n3. Number of parallel rows $m$: $m \\times \\frac{2}{3} = 6 \\implies m = 9$.\n4. Minimum number of capacitors $= n \\times m = 3 \\times 9 = 27$.",
        "needs_image": False
    },
    {
        "id": "phys_ch16_q54",
        "subject": "Physics",
        "chapter": "Electrostatic Potential and Capacitance",
        "chapter_number": 16,
        "questionNumber": 54,
        "year": 2021,
        "question": "In figure, charge $Q(\\mu\\text{C})$ on the capacitor is plotted against potential difference across the capacitor. The capacitance and energy stored in the capacitor are respectively\n\n![Q vs V graph](/pyq_images/physics/ch16/q54_graph.png)",
        "options": [
            "$12\\;\\mu\\text{F}, 1200\\;\\mu\\text{J}$",
            "$12\\;\\mu\\text{F}, 600\\;\\mu\\text{J}$",
            "$24\\;\\mu\\text{F}, 600\\;\\mu\\text{J}$",
            "$24\\;\\mu\\text{F}, 1200\\;\\mu\\text{J}$"
        ],
        "correct_answer": 1,
        "explanation": "From the graph, at $V = 10\\text{ V}$, $Q = 120\\;\\mu\\text{C}$.\n$$C = \\frac{Q}{V} = \\frac{120\\;\\mu\\text{C}}{10\\text{ V}} = 12\\;\\mu\\text{F}$$\nEnergy stored (area under $Q-V$ graph):\n$$U = \\frac{1}{2} Q V = \\frac{1}{2} \\times (120\\;\\mu\\text{C}) \\times (10\\text{ V}) = 600\\;\\mu\\text{J}$$",
        "needs_image": True,
        "image_url": "/pyq_images/physics/ch16/q54_graph.png"
    },
    {
        "id": "phys_ch16_q55",
        "subject": "Physics",
        "chapter": "Electrostatic Potential and Capacitance",
        "chapter_number": 16,
        "questionNumber": 55,
        "year": 2022,
        "question": "The electric field and the potential of an electric dipole (along it's axis) vary with distance $r$, respectively as",
        "options": [
            "$\\frac{1}{r^2}$ and $\\frac{1}{r^3}$",
            "$\\frac{1}{r}$ and $\\frac{1}{r^2}$",
            "$\\frac{1}{r^3}$ and $\\frac{1}{r^2}$",
            "$\\frac{1}{r^2}$ and $\\frac{1}{r}$"
        ],
        "correct_answer": 2,
        "explanation": "For an electric dipole on its axial line:\n- Electric field: $E_{\\text{axial}} = \\frac{1}{4\\pi\\varepsilon_0}\\frac{2p}{r^3} \\propto \\frac{1}{r^3}$\n- Electric potential: $V_{\\text{axial}} = \\frac{1}{4\\pi\\varepsilon_0}\\frac{p}{r^2} \\propto \\frac{1}{r^2}$",
        "needs_image": False
    },
    {
        "id": "phys_ch16_q56",
        "subject": "Physics",
        "chapter": "Electrostatic Potential and Capacitance",
        "chapter_number": 16,
        "questionNumber": 56,
        "year": 2022,
        "question": "Two tiny spheres carrying charges $1.8\\;\\mu\\text{C}$ and $2.8\\;\\mu\\text{C}$ are located at $40\\text{ cm}$ apart. The potential at the mid-point of the line joining the two charges is",
        "options": [
            "$4.3 \\times 10^4\\text{ V}$",
            "$3.8 \\times 10^4\\text{ V}$",
            "$3.6 \\times 10^5\\text{ V}$",
            "$2.1 \\times 10^5\\text{ V}$"
        ],
        "correct_answer": 3,
        "explanation": "Distance from each charge to mid-point: $r = \\frac{40\\text{ cm}}{2} = 20\\text{ cm} = 0.2\\text{ m}$.\n$$V = \\frac{1}{4\\pi\\varepsilon_0}\\frac{q_1 + q_2}{r} = \\frac{9 \\times 10^9 \\times (1.8 + 2.8) \\times 10^{-6}}{0.2} = \\frac{9 \\times 10^9 \\times 4.6 \\times 10^{-6}}{0.2} = \\frac{41.4 \\times 10^3}{0.2} = 2.07 \\times 10^5 \\approx 2.1 \\times 10^5\\text{ V}$$",
        "needs_image": False
    },
    {
        "id": "phys_ch16_q57",
        "subject": "Physics",
        "chapter": "Electrostatic Potential and Capacitance",
        "chapter_number": 16,
        "questionNumber": 57,
        "year": 2022,
        "question": "A parallel plate capacitor is charged by connecting a $2\\text{ V}$ battery across it. It is then disconnected from the battery and a glass slab is introduced between plates. Which of the following pairs of quantities decrease?",
        "options": [
            "Energy stored and capacitance.",
            "Charge and potential difference.",
            "Capacitance and charge.",
            "Potential difference and energy stored."
        ],
        "correct_answer": 3,
        "explanation": "When battery is disconnected, charge $Q$ is conserved (constant).\n- Capacitance increases: $C' = KC$.\n- Potential difference decreases: $V' = \\frac{Q}{C'} = \\frac{V}{K}$.\n- Energy stored decreases: $U' = \\frac{Q^2}{2C'} = \\frac{U}{K}$.\nTherefore, **potential difference and energy stored** decrease.",
        "needs_image": False
    },
    {
        "id": "phys_ch16_q58",
        "subject": "Physics",
        "chapter": "Electrostatic Potential and Capacitance",
        "chapter_number": 16,
        "questionNumber": 58,
        "year": 2023,
        "question": "Five capacitors each of value $1\\;\\mu\\text{F}$ are connected as shown in the figure. The equivalent capacitance between $A$ and $B$ is\n\n![Capacitor Bridge](/pyq_images/physics/ch16/q58_capacitors.png)",
        "options": [
            "$3\\;\\mu\\text{F}$",
            "$1\\;\\mu\\text{F}$",
            "$2\\;\\mu\\text{F}$",
            "$5\\;\\mu\\text{F}$"
        ],
        "correct_answer": 1,
        "explanation": "This is a balanced Wheatstone bridge of identical $1\\;\\mu\\text{F}$ capacitors.\nThe central bridging capacitor is inactive ($V_C = V_D$).\nThe circuit simplifies to two parallel branches, each having two $1\\;\\mu\\text{F}$ capacitors in series ($0.5\\;\\mu\\text{F}$):\n$$C_{AB} = 0.5\\;\\mu\\text{F} + 0.5\\;\\mu\\text{F} = 1\\;\\mu\\text{F}$$",
        "needs_image": True,
        "image_url": "/pyq_images/physics/ch16/q58_capacitors.png"
    },
    {
        "id": "phys_ch16_q59",
        "subject": "Physics",
        "chapter": "Electrostatic Potential and Capacitance",
        "chapter_number": 16,
        "questionNumber": 59,
        "year": 2023,
        "question": "A uniform electric field vector $\\vec{E}$ exists along horizontal direction as shown. The electric potential at $A$ is $V_A$. A small point charge $q$ is slowly taken from $A$ to $B$ along the curved path as shown. The potential energy of the charge when it is at point $B$ is\n\n![Curved Path](/pyq_images/physics/ch16/q59_curved_path.png)",
        "options": [
            "$q[V_A - Ex]$",
            "$q[V_A + Ex]$",
            "$q[Ex - V_A]$",
            "$qEx$"
        ],
        "correct_answer": 0,
        "explanation": "Potential difference along the uniform field $\\vec{E}$ between $A$ and $B$ separated horizontally by $x$:\n$$V_B - V_A = -Ex \\implies V_B = V_A - Ex$$\nPotential energy of charge $q$ at point $B$:\n$$U_B = q V_B = q[V_A - Ex]$$",
        "needs_image": True,
        "image_url": "/pyq_images/physics/ch16/q59_curved_path.png"
    },
    {
        "id": "phys_ch16_q60",
        "subject": "Physics",
        "chapter": "Electrostatic Potential and Capacitance",
        "chapter_number": 16,
        "questionNumber": 60,
        "year": 2023,
        "question": "A parallel plate capacitor of capacitance $C_1$ with a dielectric slab in between its plates is connected to a battery. It has a potential difference $V_1$ across its plates. When the dielectric slab is removed, keeping the capacitor connected to the battery, the new capacitance and potential difference are $C_2$ and $V_2$ respectively. Then,",
        "options": [
            "$V_1 = V_2, C_1 < C_2$",
            "$V_1 > V_2, C_1 > C_2$",
            "$V_1 < V_2, C_1 > C_2$",
            "$V_1 = V_2, C_1 > C_2$"
        ],
        "correct_answer": 3,
        "explanation": "- Since the capacitor remains **connected to the battery**, the potential difference is maintained constant: $V_1 = V_2 = V_{\\text{battery}}$.\n- With dielectric: $C_1 = KC_0$. On removing dielectric: $C_2 = C_0 = \\frac{C_1}{K}$.\n  Since $K > 1$, $C_1 > C_2$.\nTherefore: $V_1 = V_2, C_1 > C_2$.",
        "needs_image": False
    },
    {
        "id": "phys_ch16_q61",
        "subject": "Physics",
        "chapter": "Electrostatic Potential and Capacitance",
        "chapter_number": 16,
        "questionNumber": 61,
        "year": 2024,
        "question": "Under electrostatic condition of a charged conductor, which among the following statements is true?",
        "options": [
            "The electric field on the surface of a charged conductor is $\\frac{\\sigma}{2\\varepsilon_0}$, where $\\sigma$ is the surface charge density.",
            "The electric potential inside a charged conductor is always zero.",
            "Any excess charge resides on the surface of the conductor.",
            "The net electric field is tangential to the surface of the conductor."
        ],
        "correct_answer": 2,
        "explanation": "In electrostatics:\n- Under static equilibrium, any excess charge resides entirely on the **outer surface** of a conductor.\n- The electric field inside is zero, making the interior an equipotential region at the same potential as the surface (not necessarily zero).\n- The electric field just outside the surface is perpendicular to the surface with magnitude $E = \\frac{\\sigma}{\\varepsilon_0}$.",
        "needs_image": False
    },
    {
        "id": "phys_ch16_q62",
        "subject": "Physics",
        "chapter": "Electrostatic Potential and Capacitance",
        "chapter_number": 16,
        "questionNumber": 62,
        "year": 2024,
        "question": "A cube of side $1\\text{ cm}$ contains 100 molecules each having an induced dipole moment of $0.2 \\times 10^{-6}\\text{ C m}$ in an external electric field of $4\\text{ N C}^{-1}$. The electric susceptibility of the material is _____ $\\text{C}^2\\text{ N}^{-1}\\text{ m}^{-2}$.",
        "options": [
            "50",
            "5",
            "0.5",
            "0.05"
        ],
        "correct_answer": 1,
        "explanation": "Volume of the cube $V = (1\\text{ cm})^3 = (10^{-2}\\text{ m})^3 = 10^{-6}\\text{ m}^3$.\nTotal dipole moment $p_{\\text{total}} = N \\times p = 100 \\times 0.2 \\times 10^{-6} = 2 \\times 10^{-5}\\text{ C m}$.\nPolarisation density $P = \\frac{p_{\\text{total}}}{V} = \\frac{2 \\times 10^{-5}}{10^{-6}} = 20\\text{ C m}^{-2}$.\nRelation with electric field:\n$$\\chi_e = \\frac{P}{E} = \\frac{20}{4} = 5\\text{ C}^2\\text{ N}^{-1}\\text{ m}^{-2}$$",
        "needs_image": False
    },
    {
        "id": "phys_ch16_q63",
        "subject": "Physics",
        "chapter": "Electrostatic Potential and Capacitance",
        "chapter_number": 16,
        "questionNumber": 63,
        "year": 2024,
        "question": "A capacitor of capacitance $5\\;\\mu\\text{F}$ is charged by a battery of emf $10\\text{ V}$. At an instant of time, the potential difference across the capacitor is $4\\text{ V}$ and the time rate of change of potential difference across the capacitor is $0.6\\text{ V s}^{-1}$. Then the time rate at which energy is stored in the capacitor at that instant is",
        "options": [
            "$12\\;\\mu\\text{W}$",
            "$3\\;\\mu\\text{W}$",
            "zero",
            "$30\\;\\mu\\text{W}$"
        ],
        "correct_answer": 0,
        "explanation": "Energy stored in a capacitor: $U = \\frac{1}{2} C V^2$.\nTime rate of change of energy:\n$$\\frac{dU}{dt} = \\frac{d}{dt}\\left(\\frac{1}{2} C V^2\\right) = \\frac{1}{2} C \\left(2V \\frac{dV}{dt}\\right) = C V \\frac{dV}{dt}$$\nGiven $C = 5\\;\\mu\\text{F} = 5 \\times 10^{-6}\\text{ F}$, $V = 4\\text{ V}$, $\\frac{dV}{dt} = 0.6\\text{ V s}^{-1}$:\n$$\\frac{dU}{dt} = (5 \\times 10^{-6}) \\times 4 \\times 0.6 = 12 \\times 10^{-6}\\text{ W} = 12\\;\\mu\\text{W}$$",
        "needs_image": False
    }
]

with open("src/data/pyq_physics_ch16.json", "w", encoding="utf-8") as f:
    json.dump(questions, f, indent=2)

print(f"Generated pyq_physics_ch16.json with {len(questions)} questions.")
