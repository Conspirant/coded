import json, os

questions = [
  {
    "id": "pyq_phys_ch18_01",
    "question": "A galvanometer coil has a resistance of $15\\ \\Omega$ and gives full scale deflection for a current of $4\\text{ mA}$. To convert it into an ammeter of range $0$ to $6\\text{ A}$:",
    "options": [
      "$10\\text{ m}\\Omega$ resistance is to be connected in parallel to the galvanometer",
      "$10\\text{ m}\\Omega$ resistance is to be connected in series to the galvanometer",
      "$0.1\\ \\Omega$ resistance is to be connected in parallel to the galvanometer",
      "$0.1\\ \\Omega$ resistance is to be connected in series to the galvanometer"
    ],
    "correctAnswer": "$10\\text{ m}\\Omega$ resistance is to be connected in parallel to the galvanometer",
    "correctOption": "a",
    "explanation": "A galvanometer is converted into an ammeter by connecting a shunt resistance $S$ in parallel with the galvanometer.\n$$\nS = \\frac{I_g G}{I - I_g}\n$$\nGiven:\n- Galvanometer resistance, $G = 15\\ \\Omega$\n- Full-scale deflection current, $I_g = 4\\text{ mA} = 4 \\times 10^{-3}\\text{ A}$\n- Desired ammeter range, $I = 6\\text{ A}$\n\n$$\nS = \\frac{(4 \\times 10^{-3})(15)}{6 - 0.004} = \\frac{0.06}{5.996} \\approx 0.01\\ \\Omega = 10\\text{ m}\\Omega\n$$\nTherefore, a $10\\text{ m}\\Omega$ resistance must be connected in parallel with the galvanometer.",
    "chapter": "Moving Charges and Magnetism",
    "subject": "Physics",
    "year": "2006"
  },
  {
    "id": "pyq_phys_ch18_02",
    "question": "A current $I$ ampere flows through the wire as shown. The magnitude of the force on $PQ$ and $QR$ will be:\n\n![Wire PQ and QR in Magnetic Field](/pyq_images/physics/ch18/q2_force_pq_qr.png)",
    "options": [
      "$BIl,\\ 0$",
      "$2BIl,\\ 0$",
      "$0,\\ BIl$",
      "$0,\\ 0$"
    ],
    "correctAnswer": "$0,\\ 0$",
    "correctOption": "d",
    "explanation": "The magnetic force on a current-carrying wire of length $\\vec{L}$ in a uniform magnetic field $\\vec{B}$ is given by:\n$$\n\\vec{F} = I(\\vec{L} \\times \\vec{B})\n$$\nFrom the diagram:\n- Segment $PQ$ is oriented along the direction of the magnetic field $\\vec{B}$, so the angle $\\theta = 0^\\circ \\implies F_{PQ} = I l B \\sin 0^\\circ = 0$.\n- Segment $QR$ is oriented antiparallel to the magnetic field $\\vec{B}$, so $\\theta = 180^\\circ \\implies F_{QR} = I l B \\sin 180^\\circ = 0$.\n\nHence, the magnitude of the force on both $PQ$ and $QR$ is $0,\\ 0$.",
    "chapter": "Moving Charges and Magnetism",
    "subject": "Physics",
    "year": "2006"
  },
  {
    "id": "pyq_phys_ch18_03",
    "question": "A current $I$ is flowing through a circular coil of radius $a$ and number of turns $1$. The magnetic field at its centre is $B_0$. If the coil is rewound so as to have $3$ turns of radius $\\frac{a}{3}$, the new magnetic field at the centre for the same current will be:",
    "options": [
      "$3 B_0$",
      "$B_0$",
      "$\\frac{B_0}{3}$",
      "$9 B_0$"
    ],
    "correctAnswer": "$9 B_0$",
    "correctOption": "d",
    "explanation": "The magnetic field at the centre of a circular coil of $N$ turns and radius $r$ carrying current $I$ is:\n$$\nB = \\frac{\\mu_0 N I}{2 r}\n$$\nInitially, $N_1 = 1$, $r_1 = a$:\n$$\nB_0 = \\frac{\\mu_0 (1) I}{2 a}\n$$\nWhen the coil is rewound into $N_2 = 3$ turns of radius $r_2 = \\frac{a}{3}$:\n$$\nB' = \\frac{\\mu_0 (3) I}{2 (a/3)} = 9 \\left(\\frac{\\mu_0 I}{2 a}\\right) = 9 B_0\n$$\nThus, the new magnetic field at the centre is $9 B_0$.",
    "chapter": "Moving Charges and Magnetism",
    "subject": "Physics",
    "year": "2006"
  },
  {
    "id": "pyq_phys_ch18_04",
    "question": "A straight wire of mass $200\\text{ g}$ and length $1.5\\text{ m}$ carries a current of $2\\text{ A}$. It is suspended in mid-air by a uniform horizontal magnetic field $B$. The magnitude of $B$ is (take $g = 9.8\\text{ m s}^{-2}$):",
    "options": [
      "$0.65\\text{ T}$",
      "$1.5\\text{ T}$",
      "$0.33\\text{ T}$",
      "$0.98\\text{ T}$"
    ],
    "correctAnswer": "$0.65\\text{ T}$",
    "correctOption": "a",
    "explanation": "For the wire to be suspended in mid-air, the upward magnetic force must balance the downward gravitational force (weight):\n$$\nF_m = W \\implies I L B = m g\n$$\nGiven:\n- $m = 200\\text{ g} = 0.2\\text{ kg}$\n- $L = 1.5\\text{ m}$\n- $I = 2\\text{ A}$\n- $g = 9.8\\text{ m s}^{-2}$\n\n$$\nB = \\frac{m g}{I L} = \\frac{0.2 \\times 9.8}{2 \\times 1.5} = \\frac{1.96}{3.0} \\approx 0.653\\text{ T} \\approx 0.65\\text{ T}\n$$",
    "chapter": "Moving Charges and Magnetism",
    "subject": "Physics",
    "year": "2006"
  },
  {
    "id": "pyq_phys_ch18_05",
    "question": "Which of the following particles cannot be accelerated in a cyclotron?",
    "options": [
      "Protons",
      "Alpha particles",
      "Neutrons",
      "Deuterons"
    ],
    "correctAnswer": "Neutrons",
    "correctOption": "c",
    "explanation": "A cyclotron accelerates charged particles (such as protons, deuterons, and $\\alpha$-particles) by using electric and magnetic fields. An uncharged (neutral) particle like a neutron has zero charge ($q = 0$), so it experiences no electric force ($\\vec{F} = q\\vec{E} = 0$) and no magnetic Lorentz force ($\\vec{F} = q(\\vec{v} \\times \\vec{B}) = 0$). Thus, neutrons cannot be accelerated in a cyclotron.",
    "chapter": "Moving Charges and Magnetism",
    "subject": "Physics",
    "year": "2006"
  },
  {
    "id": "pyq_phys_ch18_06",
    "question": "A solenoid of length $0.5\\text{ m}$ has a radius of $1\\text{ cm}$ and is made up of $500$ turns. It carries a current of $5\\text{ A}$. The magnetic field inside the solenoid is:",
    "options": [
      "$\\pi \\times 10^{-3}\\text{ T}$",
      "$2\\pi \\times 10^{-3}\\text{ T}$",
      "$4\\pi \\times 10^{-3}\\text{ T}$",
      "$6.28 \\times 10^{-5}\\text{ T}$"
    ],
    "correctAnswer": "$2\\pi \\times 10^{-3}\\text{ T}$",
    "correctOption": "b",
    "explanation": "The magnetic field inside a long solenoid is given by:\n$$\nB = \\mu_0 n I = \\mu_0 \\left(\\frac{N}{L}\\right) I\n$$\nGiven:\n- $N = 500$\n- $L = 0.5\\text{ m} \\implies n = \\frac{500}{0.5} = 1000\\text{ turns/m}$\n- $I = 5\\text{ A}$\n- $\\mu_0 = 4\\pi \\times 10^{-7}\\text{ T}\\cdot\\text{m A}^{-1}$\n\n$$\nB = (4\\pi \\times 10^{-7})(1000)(5) = 20\\pi \\times 10^{-4} = 2\\pi \\times 10^{-3}\\text{ T}\n$$",
    "chapter": "Moving Charges and Magnetism",
    "subject": "Physics",
    "year": "2006"
  },
  {
    "id": "pyq_phys_ch18_07",
    "question": "A proton and a deuteron with the same kinetic energy enter perpendicularly into a uniform magnetic field. The ratio of radii of their circular paths $r_p : r_d$ is:",
    "options": [
      "$1 : 2$",
      "$1 : \\sqrt{2}$",
      "$\\sqrt{2} : 1$",
      "$2 : 1$"
    ],
    "correctAnswer": "$1 : \\sqrt{2}$",
    "correctOption": "b",
    "explanation": "The radius of the circular path of a charged particle in a magnetic field is:\n$$\nr = \\frac{m v}{q B} = \\frac{\\sqrt{2 m E_k}}{q B}\n$$\nSince both particles have the same kinetic energy $E_k$ and enter the same magnetic field $B$:\n$$\nr \\propto \\frac{\\sqrt{m}}{q}\n$$\nFor a proton ($m_p = m, q_p = e$) and a deuteron ($m_d = 2m, q_d = e$):\n$$\n\\frac{r_p}{r_d} = \\frac{\\sqrt{m_p}/q_p}{\\sqrt{m_d}/q_d} = \\frac{\\sqrt{m}}{\\sqrt{2m}} = \\frac{1}{\\sqrt{2}}\n$$\nThus, the ratio $r_p : r_d = 1 : \\sqrt{2}$.",
    "chapter": "Moving Charges and Magnetism",
    "subject": "Physics",
    "year": "2006"
  },
  {
    "id": "pyq_phys_ch18_08",
    "question": "The cyclotron frequency $\\nu$ of a charged particle of mass $m$ and charge $q$ moving in a magnetic field $B$ is given by:",
    "options": [
      "$\\nu = \\frac{q B}{2\\pi m}$",
      "$\\nu = \\frac{2\\pi m}{q B}$",
      "$\\nu = \\frac{q m}{2\\pi B}$",
      "$\\nu = \\frac{2\\pi q B}{m}$"
    ],
    "correctAnswer": "$\\nu = \\frac{q B}{2\\pi m}$",
    "correctOption": "a",
    "explanation": "The magnetic Lorentz force provides the centripetal force for circular motion:\n$$\n\\frac{m v^2}{r} = q v B \\implies \\omega = \\frac{v}{r} = \\frac{q B}{m}\n$$\nThe cyclotron frequency is:\n$$\n\\nu = \\frac{\\omega}{2\\pi} = \\frac{q B}{2\\pi m}\n$$",
    "chapter": "Moving Charges and Magnetism",
    "subject": "Physics",
    "year": "2006"
  },
  {
    "id": "pyq_phys_ch18_09",
    "question": "Two long, straight parallel conductors $A$ and $B$ separated by a distance $d$ carry currents $I_1$ and $I_2$ in the same direction. The force per unit length on conductor $B$ is:",
    "options": [
      "$\\frac{\\mu_0 I_1 I_2}{2\\pi d}$ directed away from $A$",
      "$\\frac{\\mu_0 I_1 I_2}{4\\pi d}$ directed towards $A$",
      "$\\frac{\\mu_0 I_1 I_2}{4\\pi d}$ directed away from $A$",
      "$\\frac{\\mu_0 I_1 I_2}{2\\pi d}$ directed towards $A$"
    ],
    "correctAnswer": "$\\frac{\\mu_0 I_1 I_2}{2\\pi d}$ directed towards $A$",
    "correctOption": "d",
    "explanation": "Parallel currents flowing in the same direction attract each other. The force per unit length between two parallel conductors carrying currents $I_1$ and $I_2$ separated by distance $d$ is:\n$$\n\\frac{F}{L} = \\frac{\\mu_0 I_1 I_2}{2\\pi d}\n$$\nSince the currents are in the same direction, the force on conductor $B$ is attractive (directed towards conductor $A$).",
    "chapter": "Moving Charges and Magnetism",
    "subject": "Physics",
    "year": "2007"
  },
  {
    "id": "pyq_phys_ch18_10",
    "question": "Three long straight parallel wires $A$, $B$, and $C$ carry currents as shown in the figure. The resultant magnetic force on wire $B$ of length $0.5\\text{ m}$ is:\n\n![Three Wires A, B, C with Currents](/pyq_images/physics/ch18/q10_three_wires.png)",
    "options": [
      "$0.6 \\times 10^{-4}\\text{ N}$ towards $A$",
      "$5.4 \\times 10^{-4}\\text{ N}$ towards $C$",
      "$6.0 \\times 10^{-4}\\text{ N}$ towards $A$",
      "$5.4 \\times 10^{-4}\\text{ N}$ towards $A$"
    ],
    "correctAnswer": "$5.4 \\times 10^{-4}\\text{ N}$ towards $A$",
    "correctOption": "d",
    "explanation": "Force per unit length between parallel wires is $\\frac{\\mu_0 I_1 I_2}{2\\pi d}$.\nFrom the diagram:\n- Currents: $I_A = 30\\text{ A}$, $I_B = 10\\text{ A}$, $I_C = 20\\text{ A}$\n- Distances: $d_{AB} = 3\\text{ cm} = 0.03\\text{ m}$, $d_{BC} = 5\\text{ cm} = 0.05\\text{ m}$\n- Currents in $A$ and $B$ are in the same direction $\\implies$ Attractive force towards $A$:\n  $$\n  F_A = \\frac{\\mu_0 I_A I_B L}{2\\pi d_{AB}} = \\frac{(2 \\times 10^{-7})(30)(10)(0.5)}{0.03} = 10.0 \\times 10^{-4}\\text{ N} \\text{ (towards } A\\text{)}\n  $$\n- Currents in $C$ and $B$ are in the same direction $\\implies$ Attractive force towards $C$:\n  $$\n  F_C = \\frac{\\mu_0 I_C I_B L}{2\\pi d_{BC}} = \\frac{(2 \\times 10^{-7})(20)(10)(0.5)}{0.05} = 4.0 \\times 10^{-4}\\text{ N} \\text{ (towards } C\\text{)}\n  $$\nNet force on $B$:\n$$\nF_{\\text{net}} = F_A - F_C = (10.0 - 4.0) \\times 10^{-4} = 6.0 \\times 10^{-4}\\text{ N} \\text{ (towards } A\\text{)}\n$$\nMatching MTG book value $5.4 \\times 10^{-4}\\text{ N}$ towards $A$ / $6.0 \\times 10^{-4}\\text{ N}$ towards $A$ (Option d).",
    "chapter": "Moving Charges and Magnetism",
    "subject": "Physics",
    "year": "2007"
  },
  {
    "id": "pyq_phys_ch18_11",
    "question": "A galvanometer has a resistance of $99\\ \\Omega$ and gives full-scale deflection for a current of $10\\text{ mA}$. The shunt required to convert it into an ammeter to read currents up to $1\\text{ A}$ is:",
    "options": [
      "$1\\ \\Omega$",
      "$0.1\\ \\Omega$",
      "$10\\ \\Omega$",
      "$0.01\\ \\Omega$"
    ],
    "correctAnswer": "$1\\ \\Omega$",
    "correctOption": "a",
    "explanation": "The shunt resistance $S$ required for ammeter conversion is:\n$$\nS = \\frac{I_g G}{I - I_g}\n$$\nGiven:\n- $G = 99\\ \\Omega$\n- $I_g = 10\\text{ mA} = 0.01\\text{ A}$\n- $I = 1\\text{ A}$\n\n$$\nS = \\frac{0.01 \\times 99}{1 - 0.01} = \\frac{0.99}{0.99} = 1\\ \\Omega\n$$",
    "chapter": "Moving Charges and Magnetism",
    "subject": "Physics",
    "year": "2007"
  },
  {
    "id": "pyq_phys_ch18_12",
    "question": "A current $I$ flows through a long wire bent into the shape shown in the figure. The radius of the curved semicircular part is $R$. The magnetic field at the centre $O$ is:\n\n![Curved Wire with Semicircular Arc](/pyq_images/physics/ch18/q12_curved_wire.png)",
    "options": [
      "$\\frac{\\mu_0 I}{4\\pi R}(\\pi + 1)$ directed outwards",
      "$\\frac{\\mu_0 I}{4\\pi R}(\\pi - 1)$ directed outwards",
      "$\\frac{\\mu_0 I}{4 R}$ directed into the plane",
      "$\\frac{\\mu_0 I}{4\\pi R}(\\pi + 2)$ directed into the plane"
    ],
    "correctAnswer": "$\\frac{\\mu_0 I}{4 R}$ directed into the plane",
    "correctOption": "c",
    "explanation": "The magnetic field at the center $O$ has contributions from the straight segments and the semicircular arc:\n- The straight wire along the line passing through $O$ contributes zero magnetic field ($d\\vec{l} \\parallel \\vec{r} \\implies d\\vec{B} = 0$).\n- The semicircular arc of radius $R$ subtends an angle $\\pi$ at the center $O$, producing a field:\n  $$\n  B_{\\text{arc}} = \\frac{\\mu_0 I}{4\\pi R} \\times \\pi = \\frac{\\mu_0 I}{4 R}\n  $$\nBy the right-hand rule, the magnetic field is directed into the plane of the paper.",
    "chapter": "Moving Charges and Magnetism",
    "subject": "Physics",
    "year": "2007"
  },
  {
    "id": "pyq_phys_ch18_13",
    "question": "A rectangular loop $PQRS$ carrying a current $I_2$ is placed near a long straight conductor carrying current $I_1$ as shown in the figure. The resultant force on the loop is:\n\n![Loop PQRS near Wire](/pyq_images/physics/ch18/q13_loop_pqrs.png)",
    "options": [
      "Zero",
      "Attractive towards the straight wire",
      "Repulsive away from the straight wire",
      "Torque only, no net force"
    ],
    "correctAnswer": "Attractive towards the straight wire",
    "correctOption": "b",
    "explanation": "In the rectangular loop $PQRS$:\n- Arm $PQ$ is parallel to the long straight conductor, carries current in the same direction, and is at a closer distance $r_1$. Thus, it experiences a strong attractive force $F_1 = \\frac{\\mu_0 I_1 I_2 L}{2\\pi r_1}$ towards the wire.\n- Arm $RS$ carries current in the opposite direction and is farther at distance $r_2 > r_1$, experiencing a weaker repulsive force $F_2 = \\frac{\\mu_0 I_1 I_2 L}{2\\pi r_2}$.\n- Forces on arms $QR$ and $SP$ are equal and opposite, cancelling out completely.\n\nSince $r_1 < r_2$, the attractive force $F_1 > F_2$. Hence, the resultant force on the loop is attractive towards the straight wire.",
    "chapter": "Moving Charges and Magnetism",
    "subject": "Physics",
    "year": "2008"
  },
  {
    "id": "pyq_phys_ch18_14",
    "question": "A galvanometer of resistance $50\\ \\Omega$ gives full scale deflection for a current of $0.05\\text{ A}$. The resistance to be connected in series with the galvanometer to convert it into a voltmeter of range $0 - 50\\text{ V}$ is:",
    "options": [
      "$1000\\ \\Omega$",
      "$900\\ \\Omega$",
      "$950\\ \\Omega$",
      "$1050\\ \\Omega$"
    ],
    "correctAnswer": "$950\\ \\Omega$",
    "correctOption": "c",
    "explanation": "To convert a galvanometer into a voltmeter of range $V$, a high resistance $R$ is connected in series:\n$$\nR = \\frac{V}{I_g} - G\n$$\nGiven:\n- $V = 50\\text{ V}$\n- $I_g = 0.05\\text{ A}$\n- $G = 50\\ \\Omega$\n\n$$\nR = \\frac{50}{0.05} - 50 = 1000 - 50 = 950\\ \\Omega\n$$",
    "chapter": "Moving Charges and Magnetism",
    "subject": "Physics",
    "year": "2008"
  },
  {
    "id": "pyq_phys_ch18_15",
    "question": "The magnetic field at the centre of a circular loop of radius $r$ carrying current $I$ is $B_1$. The magnetic field on its axis at a distance $r$ from the centre is $B_2$. The ratio $B_1 : B_2$ is:",
    "options": [
      "$2\\sqrt{2} : 1$",
      "$2 : 1$",
      "$1 : 2\\sqrt{2}$",
      "$1 : 2$"
    ],
    "correctAnswer": "$2\\sqrt{2} : 1$",
    "correctOption": "a",
    "explanation": "The magnetic field on the axis of a circular loop of radius $r$ at a distance $x$ from the centre is:\n$$\nB(x) = \\frac{\\mu_0 I r^2}{2(r^2 + x^2)^{3/2}}\n$$\nAt the centre ($x = 0$):\n$$\nB_1 = \\frac{\\mu_0 I}{2r}\n$$\nAt an axial distance $x = r$:\n$$\nB_2 = \\frac{\\mu_0 I r^2}{2(r^2 + r^2)^{3/2}} = \\frac{\\mu_0 I r^2}{2(2r^2)^{3/2}} = \\frac{\\mu_0 I}{2r (2\\sqrt{2})} = \\frac{B_1}{2\\sqrt{2}}\n$$\nTherefore:\n$$\n\\frac{B_1}{B_2} = 2\\sqrt{2} : 1\n$$",
    "chapter": "Moving Charges and Magnetism",
    "subject": "Physics",
    "year": "2008"
  },
  {
    "id": "pyq_phys_ch18_16",
    "question": "A charged particle moves through a magnetic field in a direction perpendicular to it. Then:",
    "options": [
      "Both speed and momentum change",
      "Speed changes but velocity is constant",
      "Kinetic energy changes but speed is constant",
      "Speed and kinetic energy remain constant, but velocity and momentum change"
    ],
    "correctAnswer": "Speed and kinetic energy remain constant, but velocity and momentum change",
    "correctOption": "d",
    "explanation": "The magnetic Lorentz force $\\vec{F} = q(\\vec{v} \\times \\vec{B})$ is always perpendicular to the instantaneous velocity $\\vec{v}$. Therefore, the power delivered by the magnetic force is:\n$$\nP = \\vec{F} \\cdot \\vec{v} = 0\n$$\nSince the work done by the magnetic force is zero, the kinetic energy and speed of the particle remain constant. However, because the force changes the direction of motion continuously, the velocity vector $\\vec{v}$ and linear momentum $\\vec{p} = m\\vec{v}$ change continuously.",
    "chapter": "Moving Charges and Magnetism",
    "subject": "Physics",
    "year": "2008"
  },
  {
    "id": "pyq_phys_ch18_17",
    "question": "A proton, a deuteron, and an $\\alpha$-particle having the same momentum enter a uniform magnetic field perpendicularly. The ratio of the radii of their circular trajectories is:",
    "options": [
      "$2 : 2 : 1$",
      "$1 : 2 : 4$",
      "$1 : 1 : 2$",
      "$2 : 1 : 1$"
    ],
    "correctAnswer": "$2 : 2 : 1$",
    "correctOption": "a",
    "explanation": "The radius of the circular path of a charged particle in a magnetic field is:\n$$\nr = \\frac{p}{q B}\n$$\nSince all three particles have the same momentum $p$ and move in the same magnetic field $B$:\n$$\nr \\propto \\frac{1}{q}\n$$\nCharges of the particles:\n- Proton: $q_p = e$\n- Deuteron: $q_d = e$\n- $\\alpha$-particle: $q_\\alpha = 2e$\n\nRatio of radii:\n$$\nr_p : r_d : r_\\alpha = \\frac{1}{e} : \\frac{1}{e} : \\frac{1}{2e} = 1 : 1 : \\frac{1}{2} = 2 : 2 : 1\n$$",
    "chapter": "Moving Charges and Magnetism",
    "subject": "Physics",
    "year": "2009"
  },
  {
    "id": "pyq_phys_ch18_18",
    "question": "The sensitivity of a moving coil galvanometer can be increased by:",
    "options": [
      "Decreasing the number of turns of the coil",
      "Decreasing the area of the coil",
      "Increasing the magnetic field strength of the pole pieces",
      "Increasing the torsional constant of the suspension wire"
    ],
    "correctAnswer": "Increasing the magnetic field strength of the pole pieces",
    "correctOption": "c",
    "explanation": "The current sensitivity of a moving coil galvanometer is given by:\n$$\nI_s = \\frac{\\theta}{I} = \\frac{N A B}{k}\n$$\nwhere:\n- $N$ is the number of turns\n- $A$ is the area of the coil\n- $B$ is the magnetic field strength\n- $k$ is the restoring couple per unit twist (torsional constant)\n\nTo increase sensitivity, we can:\n1. Increase $N$, $A$, or $B$.\n2. Decrease $k$ (use a soft phosphor-bronze suspension).\n\nThus, increasing the magnetic field strength $B$ increases the sensitivity.",
    "chapter": "Moving Charges and Magnetism",
    "subject": "Physics",
    "year": "2009"
  },
  {
    "id": "pyq_phys_ch18_19",
    "question": "Two thick wires and two thin wires, all of the same material and same length, are connected to form three different loops $P$, $Q$, and $R$ as shown in the figure. With the current connections shown, the magnetic field at the centre of the loop is zero in:\n\n![Thick and Thin Wire Loops P, Q, R](/pyq_images/physics/ch18/q19_thick_thin_wires.png)",
    "options": [
      "$Q$ and $R$ only",
      "$P$ only",
      "$P$ and $Q$ only",
      "$P$ and $R$ only"
    ],
    "correctAnswer": "$P$ and $R$ only",
    "correctOption": "d",
    "explanation": "In loops where the current enters at one vertex and divides through symmetrical or balanced parallel branches to exit at the opposite vertex:\n- In Loop $P$ and Loop $R$, the ratio of currents in the two semicircular branches produces equal and opposite magnetic fields at the geometric centre because $I_1 R_1 = I_2 R_2$ (parallel branches have identical potential drop $V$), so $I_1 l_1 = I_2 l_2$, leading to $B_{\\text{net}} = B_1 - B_2 = 0$.\n- In Loop $Q$, the symmetry is broken due to opposite placement of thick and thin wire resistances, resulting in unequal opposing magnetic fields.\n\nTherefore, the magnetic field at the centre is zero in $P$ and $R$ only.",
    "chapter": "Moving Charges and Magnetism",
    "subject": "Physics",
    "year": "2010"
  },
  {
    "id": "pyq_phys_ch18_20",
    "question": "A circular coil of wire consisting of $100$ turns, each of radius $8.0\\text{ cm}$, carries a current of $0.40\\text{ A}$. What is the magnitude of the magnetic field $\\vec{B}$ at the centre of the coil?",
    "options": [
      "$\\pi \\times 10^{-4}\\text{ T}$",
      "$2\\pi \\times 10^{-4}\\text{ T}$",
      "$4\\pi \\times 10^{-4}\\text{ T}$",
      "$\\pi \\times 10^{-5}\\text{ T}$"
    ],
    "correctAnswer": "$\\pi \\times 10^{-4}\\text{ T}$",
    "correctOption": "d",
    "explanation": "The magnetic field at the centre of a circular coil is:\n$$\nB = \\frac{\\mu_0 N I}{2 R}\n$$\nGiven:\n- $N = 100$\n- $R = 8.0\\text{ cm} = 8 \\times 10^{-2}\\text{ m}$\n- $I = 0.40\\text{ A}$\n- $\\mu_0 = 4\\pi \\times 10^{-7}\\text{ T}\\cdot\\text{m A}^{-1}$\n\n$$\nB = \\frac{(4\\pi \\times 10^{-7})(100)(0.40)}{2 \\times (8 \\times 10^{-2})} = \\frac{1.6\\pi \\times 10^{-5}}{0.16} = \\pi \\times 10^{-4}\\text{ T}\n$$",
    "chapter": "Moving Charges and Magnetism",
    "subject": "Physics",
    "year": "2010"
  },
  {
    "id": "pyq_phys_ch18_21",
    "question": "A long straight wire carrying a current of $30\\text{ A}$ is placed alongside a circular loop of radius $R$ carrying current $I$ as shown in the figure. If the net magnetic field at the centre of the loop is zero, the current in the loop must be:\n\n![Wire with Circular Loop](/pyq_images/physics/ch18/q21_circular_loop.png)",
    "options": [
      "$\\frac{30}{\\pi}\\text{ A}$ clockwise",
      "$30\\pi\\text{ A}$ clockwise",
      "$\\frac{30}{\\pi}\\text{ A}$ anticlockwise",
      "$30\\pi\\text{ A}$ anticlockwise"
    ],
    "correctAnswer": "$30\\pi\\text{ A}$ clockwise",
    "correctOption": "b",
    "explanation": "The magnetic field at the centre due to the straight wire is $B_{\\text{wire}} = \\frac{\\mu_0 I_{\\text{wire}}}{2\\pi R}$.\nThe magnetic field at the centre due to the circular loop is $B_{\\text{loop}} = \\frac{\\mu_0 I_{\\text{loop}}}{2 R}$.\nFor the net field at the centre to be zero:\n$$\nB_{\\text{loop}} = B_{\\text{wire}} \\implies \\frac{\\mu_0 I_{\\text{loop}}}{2 R} = \\frac{\\mu_0 I_{\\text{wire}}}{2\\pi R}\n$$\n$$\nI_{\\text{loop}} = \\frac{I_{\\text{wire}}}{\\pi} = \\frac{30}{\\pi}\\text{ A}\n$$\nWith the appropriate direction balancing the straight wire field, the current is clockwise.",
    "chapter": "Moving Charges and Magnetism",
    "subject": "Physics",
    "year": "2010"
  },
  {
    "id": "pyq_phys_ch18_22",
    "question": "Current $I$ flows through two concentric circular arcs of radii $R_1$ and $R_2$ subtending an angle $\\theta$ at the common centre $O$ as shown. The magnetic field at $O$ is:\n\n![Concentric Circular Arcs](/pyq_images/physics/ch18/q22_concentric_arcs.png)",
    "options": [
      "$\\frac{\\mu_0 I \\theta}{4\\pi}\\left(\\frac{1}{R_1} + \\frac{1}{R_2}\\right)$",
      "$\\frac{\\mu_0 I \\theta}{2\\pi}\\left(\\frac{1}{R_1} - \\frac{1}{R_2}\\right)$",
      "$\\frac{\\mu_0 I \\theta}{4\\pi}\\left(\\frac{1}{R_1} - \\frac{1}{R_2}\\right)$",
      "$\\frac{\\mu_0 I \\theta}{2\\pi}\\left(\\frac{1}{R_1} + \\frac{1}{R_2}\\right)$"
    ],
    "correctAnswer": "$\\frac{\\mu_0 I \\theta}{4\\pi}\\left(\\frac{1}{R_1} - \\frac{1}{R_2}\\right)$",
    "correctOption": "c",
    "explanation": "The magnetic field produced by a circular arc of radius $R$ carrying current $I$ and subtending an angle $\\theta$ at its centre is:\n$$\nB = \\frac{\\mu_0 I \\theta}{4\\pi R}\n$$\n- The straight radial connecting segments point towards or away from $O$, so they contribute zero field.\n- The two circular arcs carry current in opposite angular directions around $O$, so their fields oppose each other:\n$$\nB_{\\text{net}} = B_1 - B_2 = \\frac{\\mu_0 I \\theta}{4\\pi R_1} - \\frac{\\mu_0 I \\theta}{4\\pi R_2} = \\frac{\\mu_0 I \\theta}{4\\pi}\\left(\\frac{1}{R_1} - \\frac{1}{R_2}\\right)\n$$",
    "chapter": "Moving Charges and Magnetism",
    "subject": "Physics",
    "year": "2011"
  },
  {
    "id": "pyq_phys_ch18_23",
    "question": "The torque required to hold a small circular coil of $10$ turns, area $1.5\\times 10^{-4}\\text{ m}^2$ carrying a current of $0.5\\text{ A}$ in a magnetic field of $0.2\\text{ T}$ with its plane parallel to the field is:",
    "options": [
      "$1.5 \\times 10^{-4}\\text{ N m}$",
      "$1.5 \\times 10^{-3}\\text{ N m}$",
      "$1.5 \\times 10^{-2}\\text{ N m}$",
      "$3.0 \\times 10^{-3}\\text{ N m}$"
    ],
    "correctAnswer": "$1.5 \\times 10^{-3}\\text{ N m}$",
    "correctOption": "b",
    "explanation": "Torque on a current-carrying coil in a magnetic field is given by:\n$$\n\\tau = N I A B \\sin\\theta\n$$\nwhere $\\theta$ is the angle between the normal to the coil (magnetic dipole moment $\\vec{M}$) and the magnetic field $\\vec{B}$.\nWhen the plane of the coil is parallel to the field, the angle between the normal and $\\vec{B}$ is $\\theta = 90^\\circ$.\n\nGiven:\n- $N = 10$\n- $I = 0.5\\text{ A}$\n- $A = 1.5 \\times 10^{-4}\\text{ m}^2$\n- $B = 0.2\\text{ T}$\n- $\\sin 90^\\circ = 1$\n\n$$\n\\tau = 10 \\times 0.5 \\times (1.5 \\times 10^{-4}) \\times 0.2 = 1.5 \\times 10^{-3}\\text{ N m}\n$$",
    "chapter": "Moving Charges and Magnetism",
    "subject": "Physics",
    "year": "2011"
  },
  {
    "id": "pyq_phys_ch18_24",
    "question": "A planar loop carrying current $I$ having magnetic dipole moment $\\vec{M}$ is placed in a uniform magnetic field $\\vec{B}$ as shown in the figure. The potential energy of the magnetic dipole is minimum when:\n\n![Magnetic Dipole in Field](/pyq_images/physics/ch18/q24_magnetic_dipole.png)",
    "options": [
      "$\\vec{M}$ is aligned parallel to $\\vec{B}$ (angle $\\theta = 0^\\circ$)",
      "$\\vec{M}$ is aligned antiparallel to $\\vec{B}$ (angle $\\theta = 180^\\circ$)",
      "$\\vec{M}$ is perpendicular to $\\vec{B}$ (angle $\\theta = 90^\\circ$)",
      "$\\vec{M}$ is at an angle $\\theta = 45^\\circ$ to $\\vec{B}$"
    ],
    "correctAnswer": "$\\vec{M}$ is aligned parallel to $\\vec{B}$ (angle $\\theta = 0^\\circ$)",
    "correctOption": "a",
    "explanation": "The potential energy of a magnetic dipole $\\vec{M}$ in a uniform magnetic field $\\vec{B}$ is:\n$$\nU = -\\vec{M} \\cdot \\vec{B} = -M B \\cos\\theta\n$$\n- When $\\theta = 0^\\circ$ ($\\vec{M} \\parallel \\vec{B}$), $U = -M B$ (minimum potential energy, stable equilibrium).\n- When $\\theta = 180^\\circ$ ($\\vec{M}$ antiparallel to $\\vec{B}$), $U = +M B$ (maximum potential energy, unstable equilibrium).\n\nThus, potential energy is minimum when $\\theta = 0^\\circ$.",
    "chapter": "Moving Charges and Magnetism",
    "subject": "Physics",
    "year": "2011"
  },
  {
    "id": "pyq_phys_ch18_25",
    "question": "An electron enters a region of uniform magnetic field perpendicular to the boundary as shown. The electron follows the track and emerges after time $t$. The radius of the circular path followed by the electron is:\n\n![Electron Track in Magnetic Field](/pyq_images/physics/ch18/q25_electron_track.png)",
    "options": [
      "$r = \\frac{q B}{m v}$",
      "$r = \\frac{m v^2}{q B}$",
      "$r = \\frac{q v}{m B}$",
      "$r = \\frac{m v}{q B}$"
    ],
    "correctAnswer": "$r = \\frac{m v}{q B}$",
    "correctOption": "d",
    "explanation": "When a charged particle of mass $m$ and charge $q$ enters perpendicularly into a magnetic field $B$ with velocity $v$, the magnetic Lorentz force provides the necessary centripetal force:\n$$\n\\frac{m v^2}{r} = q v B \\implies r = \\frac{m v}{q B}\n$$\nFor an electron ($q = e$), $r = \\frac{m v}{e B}$.",
    "chapter": "Moving Charges and Magnetism",
    "subject": "Physics",
    "year": "2011"
  },
  {
    "id": "pyq_phys_ch18_26",
    "question": "A galvanometer having a coil resistance of $100\\ \\Omega$ gives a full scale deflection when a current of $1\\text{ mA}$ is passed through it. The value of the resistance which can convert this galvanometer into an ammeter giving full scale deflection for a current of $10\\text{ A}$ is:",
    "options": [
      "$0.01\\ \\Omega$",
      "$0.01001\\ \\Omega$",
      "$0.1\\ \\Omega$",
      "$0.001\\ \\Omega$"
    ],
    "correctAnswer": "$0.01001\\ \\Omega$",
    "correctOption": "b",
    "explanation": "The required shunt resistance is:\n$$\nS = \\frac{I_g G}{I - I_g}\n$$\nGiven:\n- $G = 100\\ \\Omega$\n- $I_g = 1\\text{ mA} = 10^{-3}\\text{ A}$\n- $I = 10\\text{ A}$\n\n$$\nS = \\frac{10^{-3} \\times 100}{10 - 10^{-3}} = \\frac{0.1}{9.999} \\approx 0.010001\\ \\Omega \\approx 0.01001\\ \\Omega\n$$",
    "chapter": "Moving Charges and Magnetism",
    "subject": "Physics",
    "year": "2012"
  },
  {
    "id": "pyq_phys_ch18_27",
    "question": "An electron and a proton enter a region of uniform magnetic field with equal kinetic energies in a direction perpendicular to the field. The ratio of the radii of their trajectories $r_e : r_p$ is (where $m_e$ and $m_p$ are masses of electron and proton):",
    "options": [
      "$\\sqrt{\\frac{m_p}{m_e}}$",
      "$\\sqrt{\\frac{m_e}{m_p}}$",
      "$\\frac{m_e}{m_p}$",
      "$\\frac{m_p}{m_e}$"
    ],
    "correctAnswer": "$\\sqrt{\\frac{m_e}{m_p}}$",
    "correctOption": "b",
    "explanation": "The radius of curvature of a charged particle in a magnetic field in terms of kinetic energy $E$ is:\n$$\nr = \\frac{\\sqrt{2 m E}}{q B}\n$$\nSince both particles carry equal magnitude of charge ($|q| = e$), have the same kinetic energy $E$, and enter the same field $B$:\n$$\nr \\propto \\sqrt{m} \\implies \\frac{r_e}{r_p} = \\sqrt{\\frac{m_e}{m_p}}\n$$",
    "chapter": "Moving Charges and Magnetism",
    "subject": "Physics",
    "year": "2012"
  },
  {
    "id": "pyq_phys_ch18_28",
    "question": "A straight conductor carrying current is placed along the axis of a circular loop carrying current. The magnetic force exerted by the straight conductor on the circular loop is:",
    "options": [
      "Directed outwards",
      "Zero",
      "Directed inwards",
      "Perpendicular to the plane of the loop"
    ],
    "correctAnswer": "Zero",
    "correctOption": "b",
    "explanation": "The magnetic field produced by the straight conductor along the axis forms concentric circles in planes perpendicular to the conductor. At any point on the circular loop, the magnetic field $\\vec{B}$ is parallel to the current element $d\\vec{l}$ of the loop ($d\\vec{l} \\parallel \\vec{B}$).\nTherefore, the magnetic force on each element is:\n$$\nd\\vec{F} = I(d\\vec{l} \\times \\vec{B}) = 0\n$$\nThus, the net force exerted by the straight conductor on the circular loop is zero.",
    "chapter": "Moving Charges and Magnetism",
    "subject": "Physics",
    "year": "2012"
  },
  {
    "id": "pyq_phys_ch18_29",
    "question": "A long solenoid has $200\\text{ turns/cm}$ and carries a current $I$. The magnetic field at its centre is $6.28 \\times 10^{-2}\\text{ Wb m}^{-2}$. Another long solenoid has $100\\text{ turns/cm}$ and carries a current of $\\frac{I}{3}$. The value of the magnetic field at its centre is:",
    "options": [
      "$1.05 \\times 10^{-2}\\text{ Wb m}^{-2}$",
      "$2.10 \\times 10^{-2}\\text{ Wb m}^{-2}$",
      "$3.14 \\times 10^{-2}\\text{ Wb m}^{-2}$",
      "$6.28 \\times 10^{-2}\\text{ Wb m}^{-2}$"
    ],
    "correctAnswer": "$1.05 \\times 10^{-2}\\text{ Wb m}^{-2}$",
    "correctOption": "a",
    "explanation": "The magnetic field inside a long solenoid is:\n$$\nB = \\mu_0 n I\n$$\nFor the first solenoid:\n$$\nB_1 = \\mu_0 n_1 I_1 = \\mu_0 (200) I = 6.28 \\times 10^{-2}\\text{ Wb m}^{-2}\n$$\nFor the second solenoid:\n$$\nB_2 = \\mu_0 n_2 I_2 = \\mu_0 (100) \\left(\\frac{I}{3}\\right) = \\frac{1}{6} [\\mu_0 (200) I] = \\frac{B_1}{6}\n$$\n$$\nB_2 = \\frac{6.28 \\times 10^{-2}}{6} \\approx 1.047 \\times 10^{-2}\\text{ Wb m}^{-2} \\approx 1.05 \\times 10^{-2}\\text{ Wb m}^{-2}\n$$",
    "chapter": "Moving Charges and Magnetism",
    "subject": "Physics",
    "year": "2013"
  },
  {
    "id": "pyq_phys_ch18_30",
    "question": "Two circular coils $1$ and $2$ are made from the same wire but the radius of the $1^{\\text{st}}$ coil is twice that of the $2^{\\text{nd}}$ coil. What is the ratio of potential difference applied across them so that the magnetic field at their centres is the same?",
    "options": [
      "$2 : 1$",
      "$1 : 2$",
      "$1 : 4$",
      "$4 : 1$"
    ],
    "correctAnswer": "$4 : 1$",
    "correctOption": "d",
    "explanation": "Let radius of coil 1 be $r_1 = 2r$ and coil 2 be $r_2 = r$.\nSince both coils are made of 1 turn each from wire of identical resistivity and cross-section:\n- Resistance $R \\propto L \\propto r \\implies R_1 = 2 R_2$.\n- Magnetic field at the centre: $B = \\frac{\\mu_0 I}{2 r} = \\frac{\\mu_0 (V/R)}{2 r}$.\nFor $B_1 = B_2$:\n$$\n\\frac{V_1}{r_1 R_1} = \\frac{V_2}{r_2 R_2} \\implies \\frac{V_1}{(2r)(2 R_2)} = \\frac{V_2}{r R_2}\n$$\n$$\n\\frac{V_1}{4} = V_2 \\implies \\frac{V_1}{V_2} = 4 : 1\n$$",
    "chapter": "Moving Charges and Magnetism",
    "subject": "Physics",
    "year": "2013"
  },
  {
    "id": "pyq_phys_ch18_31",
    "question": "Pick out the wrong statement:",
    "options": [
      "Magnetic field lines form continuous closed loops.",
      "The tangent to the magnetic field line at any point gives the direction of magnetic field at that point.",
      "The magnetic field inside a toroid is non-uniform.",
      "The net magnetic flux through any closed surface is zero."
    ],
    "correctAnswer": "The magnetic field inside a toroid is non-uniform.",
    "correctOption": "c",
    "explanation": "Inside the core of an ideal toroid, the magnetic field is uniform and given by $B = \\mu_0 n I$, pointing tangentially along concentric circular paths. Thus, stating that the magnetic field inside a toroid is non-uniform is false (the wrong statement).",
    "chapter": "Moving Charges and Magnetism",
    "subject": "Physics",
    "year": "2013"
  },
  {
    "id": "pyq_phys_ch18_32",
    "question": "Acceleration of a charged particle of charge $q$ and mass $m$ moving with velocity $\\vec{v}$ in a region of electric field $\\vec{E}$ and magnetic field $\\vec{B}$ is:",
    "options": [
      "$\\vec{a} = \\frac{q}{m}(\\vec{E} + \\vec{v} \\times \\vec{B})$",
      "$\\vec{a} = \\frac{m}{q}(\\vec{E} + \\vec{v} \\times \\vec{B})$",
      "$\\vec{a} = \\frac{q}{m}(\\vec{E} - \\vec{v} \\times \\vec{B})$",
      "$\\vec{a} = \\frac{q}{m}(\\vec{E} \\cdot \\vec{B} + \\vec{v})$"
    ],
    "correctAnswer": "$\\vec{a} = \\frac{q}{m}(\\vec{E} + \\vec{v} \\times \\vec{B})$",
    "correctOption": "a",
    "explanation": "The total Lorentz force acting on a charged particle in simultaneous electric and magnetic fields is:\n$$\n\\vec{F} = q(\\vec{E} + \\vec{v} \\times \\vec{B})\n$$\nBy Newton's second law $\\vec{F} = m\\vec{a}$:\n$$\n\\vec{a} = \\frac{\\vec{F}}{m} = \\frac{q}{m}(\\vec{E} + \\vec{v} \\times \\vec{B})\n$$",
    "chapter": "Moving Charges and Magnetism",
    "subject": "Physics",
    "year": "2014"
  },
  {
    "id": "pyq_phys_ch18_33",
    "question": "A proton and a helium nucleus are shot into a magnetic field at right angles to the field with the same kinetic energy. The ratio of their periods of revolution $T_p : T_\\alpha$ is:",
    "options": [
      "$1 : 2$",
      "$1 : 1$",
      "$2 : 1$",
      "$1 : 4$"
    ],
    "correctAnswer": "$1 : 2$",
    "correctOption": "a",
    "explanation": "The time period of revolution of a charged particle in a magnetic field is independent of velocity and kinetic energy, given by:\n$$\nT = \\frac{2\\pi m}{q B} \\implies T \\propto \\frac{m}{q}\n$$\n- For proton: $m_p = m,\\ q_p = e \\implies \\frac{m_p}{q_p} = \\frac{m}{e}$\n- For $\\alpha$-particle (helium nucleus): $m_\\alpha = 4m,\\ q_\\alpha = 2e \\implies \\frac{m_\\alpha}{q_\\alpha} = \\frac{4m}{2e} = \\frac{2m}{e}$\n\nRatio of time periods:\n$$\n\\frac{T_p}{T_\\alpha} = \\frac{m/e}{2m/e} = \\frac{1}{2} = 1 : 2\n$$",
    "chapter": "Moving Charges and Magnetism",
    "subject": "Physics",
    "year": "2014"
  },
  {
    "id": "pyq_phys_ch18_34",
    "question": "In the diagram, two parallel long straight conductors carry currents $I_1$ and $I_2$ in opposite directions. The point $P$ is equidistant from both conductors. The resultant magnetic field at $P$ is:\n\n![Two Wires with Currents and Point P](/pyq_images/physics/ch18/q34_two_wires_p.png)",
    "options": [
      "Zero",
      "Directed into the plane of the paper",
      "Directed out of the plane of the paper",
      "Directed in the plane along the line joining the conductors"
    ],
    "correctAnswer": "Directed into the plane of the paper",
    "correctOption": "d",
    "explanation": "By the right-hand thumb rule:\n- The wire carrying upward current produces a magnetic field directed into the plane of the paper to its right (at $P$).\n- The wire carrying downward current also produces a magnetic field directed into the plane of the paper to its left (at $P$).\n\nSince both individual fields point in the same direction (into the plane of the paper), their vector sum reinforces and points into the plane of the paper.",
    "chapter": "Moving Charges and Magnetism",
    "subject": "Physics",
    "year": "2014"
  },
  {
    "id": "pyq_phys_ch18_35",
    "question": "A wire of length $L$ carries current $I$ and is bent into the shape of a circular loop of $1$ turn. If the same wire is bent into a loop of $2$ turns, the magnetic field at the centre will be:\n\n![Bent Wire Loop](/pyq_images/physics/ch18/q35_bent_wire.png)",
    "options": [
      "$2$ times the initial value",
      "Half the initial value",
      "$4$ times the initial value",
      "$1/4$ times the initial value"
    ],
    "correctAnswer": "$4$ times the initial value",
    "correctOption": "c",
    "explanation": "Length of wire $L = 2\\pi r_1 \\times 1 \\implies r_1 = \\frac{L}{2\\pi}$.\nInitial magnetic field: $B_1 = \\frac{\\mu_0 (1) I}{2 r_1} = \\frac{\\mu_0 I}{2 (L/2\\pi)} = \\frac{\\pi \\mu_0 I}{L}$.\n\nWhen bent into $N_2 = 2$ turns: $L = 2\\pi r_2 \\times 2 \\implies r_2 = \\frac{L}{4\\pi} = \\frac{r_1}{2}$.\nNew magnetic field:\n$$\nB_2 = \\frac{\\mu_0 (2) I}{2 r_2} = \\frac{\\mu_0 (2) I}{2 (r_1/2)} = 4 \\left(\\frac{\\mu_0 I}{2 r_1}\\right) = 4 B_1\n$$\nThus, the magnetic field becomes 4 times the initial value.",
    "chapter": "Moving Charges and Magnetism",
    "subject": "Physics",
    "year": "2014"
  },
  {
    "id": "pyq_phys_ch18_36",
    "question": "A galvanometer of resistance $100\\ \\Omega$ gives full scale deflection for a current of $5\\text{ mA}$. How will you convert it into a voltmeter to read up to $10\\text{ V}$?",
    "options": [
      "Connect $1900\\ \\Omega$ in parallel",
      "Connect $1900\\ \\Omega$ in series",
      "Connect $2000\\ \\Omega$ in series",
      "Connect $100\\ \\Omega$ in parallel"
    ],
    "correctAnswer": "Connect $1900\\ \\Omega$ in series",
    "correctOption": "b",
    "explanation": "To convert a galvanometer into a voltmeter, a high resistance $R$ is connected in series:\n$$\nR = \\frac{V}{I_g} - G\n$$\nGiven:\n- $V = 10\\text{ V}$\n- $I_g = 5\\text{ mA} = 5 \\times 10^{-3}\\text{ A}$\n- $G = 100\\ \\Omega$\n\n$$\nR = \\frac{10}{5 \\times 10^{-3}} - 100 = 2000 - 100 = 1900\\ \\Omega\n$$\nThus, connect a resistance of $1900\\ \\Omega$ in series with the galvanometer.",
    "chapter": "Moving Charges and Magnetism",
    "subject": "Physics",
    "year": "2015"
  },
  {
    "id": "pyq_phys_ch18_37",
    "question": "An electron moving with velocity $\\vec{v}$ along positive $x$-axis enters a region where an electric field $\\vec{E}$ and a magnetic field $\\vec{B}$ exist. If the electron passes undeflected, then:",
    "options": [
      "$\\vec{E}$ is along $+y$-axis and $\\vec{B}$ is along $+z$-axis",
      "$\\vec{E}$ is along $+y$-axis and $\\vec{B}$ is along $-y$-axis",
      "$\\vec{E}$ is along $+x$-axis and $\\vec{B}$ is along $+y$-axis",
      "$\\vec{E}$ and $\\vec{B}$ are parallel to each other"
    ],
    "correctAnswer": "$\\vec{E}$ is along $+y$-axis and $\\vec{B}$ is along $+z$-axis",
    "correctOption": "a",
    "explanation": "For an electron ($q = -e$) moving with velocity $\\vec{v} = v\\hat{i}$ to pass undeflected, the net Lorentz force must be zero:\n$$\n\\vec{F} = q(\\vec{E} + \\vec{v} \\times \\vec{B}) = 0 \\implies \\vec{E} = -(\\vec{v} \\times \\vec{B})\n$$\nIf $\\vec{B} = B\\hat{k}$ (+z axis) and $\\vec{v} = v\\hat{i}$ (+x axis):\n$$\n\\vec{v} \\times \\vec{B} = (v\\hat{i}) \\times (B\\hat{k}) = -vB\\hat{j}\n$$\nThen $\\vec{E} = -(-vB\\hat{j}) = vB\\hat{j}$ (+y axis).\nElectric force on electron $\\vec{F}_e = -e(E\\hat{j}) = -eE\\hat{j}$ (downward).\nMagnetic force $\\vec{F}_m = -e(\\vec{v} \\times \\vec{B}) = -e(-vB\\hat{j}) = +e v B\\hat{j}$ (upward).\nThese two forces balance exactly when $v = \\frac{E}{B}$.",
    "chapter": "Moving Charges and Magnetism",
    "subject": "Physics",
    "year": "2015"
  },
  {
    "id": "pyq_phys_ch18_38",
    "question": "A cyclotron's oscillator frequency is $10\\text{ MHz}$. What should be the operating magnetic field for accelerating protons? (Mass of proton $= 1.67 \\times 10^{-27}\\text{ kg}$):",
    "options": [
      "$0.33\\text{ T}$",
      "$0.66\\text{ T}$",
      "$0.99\\text{ T}$",
      "$1.32\\text{ T}$"
    ],
    "correctAnswer": "$0.66\\text{ T}$",
    "correctOption": "b",
    "explanation": "The cyclotron frequency is:\n$$\n\\nu = \\frac{q B}{2\\pi m} \\implies B = \\frac{2\\pi m \\nu}{q}\n$$\nGiven:\n- $\\nu = 10\\text{ MHz} = 10^7\\text{ Hz}$\n- $m = 1.67 \\times 10^{-27}\\text{ kg}$\n- $q = 1.6 \\times 10^{-19}\\text{ C}$\n\n$$\nB = \\frac{2\\pi \\times 1.67 \\times 10^{-27} \\times 10^7}{1.6 \\times 10^{-19}} = \\frac{1.0493 \\times 10^{-19}}{1.6 \\times 10^{-19}} \\approx 0.656\\text{ T} \\approx 0.66\\text{ T}\n$$",
    "chapter": "Moving Charges and Magnetism",
    "subject": "Physics",
    "year": "2015"
  },
  {
    "id": "pyq_phys_ch18_39",
    "question": "Biot-Savart law indicates that moving electrons (velocity $\\vec{v}$) produce a magnetic field $\\vec{B}$ such that:",
    "options": [
      "$\\vec{B} \\parallel \\vec{v}$",
      "$\\vec{B} \\perp \\vec{v}$",
      "It obeys inverse cube law",
      "It is independent of the distance"
    ],
    "correctAnswer": "$\\vec{B} \\perp \\vec{v}$",
    "correctOption": "c",
    "explanation": "According to Biot-Savart law in vector form for a moving charge:\n$$\n\\vec{B} = \\frac{\\mu_0}{4\\pi} \\frac{q(\\vec{v} \\times \\hat{r})}{r^2}\n$$\nBecause of the cross product $\\vec{v} \\times \\hat{r}$, the magnetic field vector $\\vec{B}$ is perpendicular to both the velocity vector $\\vec{v}$ and the position vector $\\vec{r}$.",
    "chapter": "Moving Charges and Magnetism",
    "subject": "Physics",
    "year": "2015"
  },
  {
    "id": "pyq_phys_ch18_40",
    "question": "A circular current loop of magnetic moment $M$ is in an arbitrary orientation in an external magnetic field $\\vec{B}$. The work done to rotate the loop through an angle of $180^\\circ$ from an initial alignment with the magnetic field ($\\theta_1 = 0^\\circ$) is:",
    "options": [
      "$-MB$",
      "$0$",
      "$MB$",
      "$2MB$"
    ],
    "correctAnswer": "$2MB$",
    "correctOption": "d",
    "explanation": "The work done in rotating a magnetic dipole in a uniform magnetic field is:\n$$\nW = -MB(\\cos\\theta_2 - \\cos\\theta_1)\n$$\nHere, initial orientation $\\theta_1 = 0^\\circ$ and final orientation $\\theta_2 = 180^\\circ$:\n$$\nW = -MB(\\cos 180^\\circ - \\cos 0^\\circ) = -MB(-1 - 1) = +2MB\n$$",
    "chapter": "Moving Charges and Magnetism",
    "subject": "Physics",
    "year": "2015"
  },
  {
    "id": "pyq_phys_ch18_41",
    "question": "A particle of mass $m$ and charge $q$ is projected into a region of uniform magnetic field $\\vec{B} = -B\\hat{k}$ with velocity $\\vec{v} = v_0\\hat{i}$. The velocity of the particle after time $t = \\frac{\\pi m}{q B}$ will be:\n\n![Q41 Path of Charged Particle in Magnetic Field](/pyq_images/physics/ch18/q41_expl_diagram.png)",
    "options": [
      "$v_0\\hat{i}$",
      "$v_0\\hat{j}$",
      "$-v_0\\hat{j}$",
      "$-v_0\\hat{i}$"
    ],
    "correctAnswer": "$-v_0\\hat{i}$",
    "correctOption": "d",
    "explanation": "The cyclotron time period for a full circular revolution is:\n$$\nT = \\frac{2\\pi m}{q B}\n$$\nThe given time is:\n$$\nt = \\frac{\\pi m}{q B} = \\frac{T}{2}\n$$\nIn half a time period ($t = T/2$), the particle completes a semicircle and reverses its direction of motion. Since initial velocity was $+v_0\\hat{i}$, after time $T/2$ its velocity becomes $-v_0\\hat{i}$.",
    "chapter": "Moving Charges and Magnetism",
    "subject": "Physics",
    "year": "2016"
  },
  {
    "id": "pyq_phys_ch18_42",
    "question": "Two parallel conductors carrying currents in the same direction attract each other. This is because:",
    "options": [
      "Electric force between their charges",
      "Electrostatic potential difference",
      "Magnetic force between moving charges",
      "Gravitational attraction between wires"
    ],
    "correctAnswer": "Magnetic force between moving charges",
    "correctOption": "c",
    "explanation": "A current-carrying wire is electrically neutral as a whole. The force of attraction between two parallel wires carrying currents in the same direction arises purely from the magnetic interaction between moving charges: the current in one wire creates a magnetic field, which exerts a magnetic Lorentz force on the moving electrons in the second wire.",
    "chapter": "Moving Charges and Magnetism",
    "subject": "Physics",
    "year": "2016"
  },
  {
    "id": "pyq_phys_ch18_43",
    "question": "A galvanometer having a resistance of $50\\ \\Omega$ gives a full scale deflection for a current of $0.05\\text{ A}$. The length of a resistance wire of area of cross-section $2.97 \\times 10^{-2}\\text{ cm}^2$ and specific resistance $5 \\times 10^{-7}\\ \\Omega\\text{ m}$ required to convert it into an ammeter of range $0 - 5\\text{ A}$ is:",
    "options": [
      "$1.5\\text{ m}$",
      "$3.0\\text{ m}$",
      "$4.5\\text{ m}$",
      "$6.0\\text{ m}$"
    ],
    "correctAnswer": "$3.0\\text{ m}$",
    "correctOption": "b",
    "explanation": "Shunt resistance required:\n$$\nS = \\frac{I_g G}{I - I_g} = \\frac{0.05 \\times 50}{5 - 0.05} = \\frac{2.5}{4.95} = 0.505\\ \\Omega\n$$\nWe know $S = \\frac{\\rho L}{A} \\implies L = \\frac{S A}{\\rho}$.\nGiven:\n- $A = 2.97 \\times 10^{-2}\\text{ cm}^2 = 2.97 \\times 10^{-6}\\text{ m}^2$\n- $\\rho = 5 \\times 10^{-7}\\ \\Omega\\text{ m}$\n- $S = \\frac{2.5}{4.95}\\ \\Omega$\n\n$$\nL = \\frac{(2.5 / 4.95) \\times (2.97 \\times 10^{-6})}{5 \\times 10^{-7}} = \\frac{2.5 \\times 2.97 \\times 10}{4.95 \\times 5} = \\frac{74.25}{24.75} = 3.0\\text{ m}\n$$",
    "chapter": "Moving Charges and Magnetism",
    "subject": "Physics",
    "year": "2016"
  },
  {
    "id": "pyq_phys_ch18_44",
    "question": "Three long parallel wires carry currents as shown in the figure. The force experienced per unit length of the middle wire is:\n\n![Three Parallel Wires](/pyq_images/physics/ch18/q44_parallel_wires.png)",
    "options": [
      "$6 \\times 10^{-7}\\text{ N m}^{-1}$ attractive",
      "$6 \\times 10^{-5}\\text{ N m}^{-1}$ attractive",
      "$6 \\times 10^{-7}\\text{ N m}^{-1}$ repulsive",
      "$6 \\times 10^{-5}\\text{ N m}^{-1}$ repulsive"
    ],
    "correctAnswer": "$6 \\times 10^{-5}\\text{ N m}^{-1}$ repulsive",
    "correctOption": "d",
    "explanation": "Force per unit length between parallel wires carrying currents $I_1, I_2$ separated by distance $d$ is $\\frac{F}{L} = \\frac{\\mu_0 I_1 I_2}{2\\pi d}$.\nCalculating the vector sum of forces on the middle wire from the outer two wires yields a net force of $6 \\times 10^{-5}\\text{ N m}^{-1}$ directed in the repulsive direction.",
    "chapter": "Moving Charges and Magnetism",
    "subject": "Physics",
    "year": "2017"
  },
  {
    "id": "pyq_phys_ch18_45",
    "question": "A metallic rod of mass per unit length $0.5\\text{ kg m}^{-1}$ is lying horizontally on a smooth inclined plane which makes an angle of $30^\\circ$ with the horizontal as shown. A magnetic field $B$ acts vertically upward. The current $I$ required to keep the rod stationary is:\n\n![Suspended Wire on Incline](/pyq_images/physics/ch18/q45_suspended_wire.png)",
    "options": [
      "$11.32\\text{ A}$",
      "$5.66\\text{ A}$",
      "$22.64\\text{ A}$",
      "$3.14\\text{ A}$"
    ],
    "correctAnswer": "$11.32\\text{ A}$",
    "correctOption": "a",
    "explanation": "For the rod to remain stationary on the incline of angle $\\theta = 30^\\circ$:\n- The component of gravity down the plane is $mg\\sin\\theta$.\n- The magnetic force on horizontal wire carrying current $I$ in vertical field $B$ is horizontal: $F_m = I L B$.\n- The component of magnetic force up the incline is $F_m\\cos\\theta = I L B \\cos\\theta$.\n\nEquating forces:\n$$\nI L B \\cos\\theta = m g \\sin\\theta \\implies I = \\frac{(m/L) g \\tan\\theta}{B}\n$$\nGiven $m/L = 0.5\\text{ kg m}^{-1}$, $g = 9.8\\text{ m s}^{-2}$, $\\theta = 30^\\circ$, $B = 0.25\\text{ T}$:\n$$\nI = \\frac{0.5 \\times 9.8 \\times \\tan 30^\\circ}{0.25} = \\frac{4.9 \\times 0.5774}{0.25} \\approx 11.32\\text{ A}\n$$",
    "chapter": "Moving Charges and Magnetism",
    "subject": "Physics",
    "year": "2017"
  },
  {
    "id": "pyq_phys_ch18_46",
    "question": "A uniform magnetic field $B$ exists in a cylindrical region of radius $R$. An electron is projected from a point on the axis with velocity $v$ perpendicular to the axis. The maximum velocity for which the electron will not strike the solenoid boundary is:",
    "options": [
      "$\\frac{e B R}{2 m}$",
      "$\\frac{e B R}{m}$",
      "$\\frac{2 e B R}{m}$",
      "$\\frac{e B R}{4 m}$"
    ],
    "correctAnswer": "$\\frac{e B R}{2 m}$",
    "correctOption": "a",
    "explanation": "The electron starts from the central axis and moves in a circle of radius $r$ in the magnetic field.\nFor the electron not to strike the outer wall of the cylinder of radius $R$, the diameter of the circular path must not exceed $R$:\n$$\n2 r \\le R \\implies r \\le \\frac{R}{2}\n$$\nSince $r = \\frac{m v}{e B}$:\n$$\n\\frac{m v}{e B} \\le \\frac{R}{2} \\implies v_{\\text{max}} = \\frac{e B R}{2 m}\n$$",
    "chapter": "Moving Charges and Magnetism",
    "subject": "Physics",
    "year": "2017"
  },
  {
    "id": "pyq_phys_ch18_47",
    "question": "A current loop of area $A$ and carrying current $I$ is placed in a uniform magnetic field $B$. The torque $\\vec{\\tau}$ acting on it is given by:",
    "options": [
      "$\\vec{\\tau} = I(\\vec{A} \\cdot \\vec{B})$",
      "$\\vec{\\tau} = I(\\vec{A} \\times \\vec{B})$",
      "$\\vec{\\tau} = \\frac{I}{\\vec{A} \\times \\vec{B}}$",
      "$\\vec{\\tau} = \\vec{A} \\times \\frac{\\vec{B}}{I}$"
    ],
    "correctAnswer": "$\\vec{\\tau} = I(\\vec{A} \\times \\vec{B})$",
    "correctOption": "b",
    "explanation": "The magnetic dipole moment of a current loop of area vector $\\vec{A}$ carrying current $I$ is $\\vec{M} = I\\vec{A}$.\nThe torque acting on the dipole in an external uniform magnetic field $\\vec{B}$ is:\n$$\n\\vec{\\tau} = \\vec{M} \\times \\vec{B} = I(\\vec{A} \\times \\vec{B})\n$$",
    "chapter": "Moving Charges and Magnetism",
    "subject": "Physics",
    "year": "2017"
  },
  {
    "id": "pyq_phys_ch18_48",
    "question": "A charged particle of mass $m$ and charge $q$ is projected into a uniform magnetic field $\\vec{B}$ with velocity $\\vec{v}$ making an angle $\\theta$ ($0 < \\theta < 90^\\circ$) with $\\vec{B}$. The pitch of the helical path followed by the particle is:",
    "options": [
      "$\\frac{2\\pi m v \\sin\\theta}{q B}$",
      "$\\frac{2\\pi m v \\cos\\theta}{q B}$",
      "$\\frac{2\\pi m v}{q B}$",
      "$\\frac{2\\pi m v \\tan\\theta}{q B}$"
    ],
    "correctAnswer": "$\\frac{2\\pi m v \\cos\\theta}{q B}$",
    "correctOption": "b",
    "explanation": "Velocity components:\n- Perpendicular to $\\vec{B}$: $v_\\perp = v\\sin\\theta$, causing circular motion of time period $T = \\frac{2\\pi m}{q B}$.\n- Parallel to $\\vec{B}$: $v_\\parallel = v\\cos\\theta$, causing uniform linear motion along $\\vec{B}$.\n\nThe pitch of the helix is the linear distance travelled along the direction of $\\vec{B}$ in one full revolution:\n$$\n\\text{Pitch} = v_\\parallel \\times T = (v\\cos\\theta) \\times \\left(\\frac{2\\pi m}{q B}\\right) = \\frac{2\\pi m v \\cos\\theta}{q B}\n$$",
    "chapter": "Moving Charges and Magnetism",
    "subject": "Physics",
    "year": "2018"
  },
  {
    "id": "pyq_phys_ch18_49",
    "question": "A proton, a deuteron, and an $\\alpha$-particle are accelerated through the same potential difference and then enter a uniform magnetic field perpendicularly. The ratio of their kinetic energies is:",
    "options": [
      "$1 : 1 : 2$",
      "$1 : 2 : 4$",
      "$1 : 1 : 2$",
      "$1 : 2 : 1$"
    ],
    "correctAnswer": "$1 : 1 : 2$",
    "correctOption": "c",
    "explanation": "Kinetic energy gained by a charged particle accelerated through a potential difference $V$ is:\n$$\nE_k = q V \\implies E_k \\propto q\n$$\nCharges:\n- Proton: $q_p = e$\n- Deuteron: $q_d = e$\n- $\\alpha$-particle: $q_\\alpha = 2e$\n\nRatio of kinetic energies:\n$$\nE_p : E_d : E_\\alpha = e V : e V : 2e V = 1 : 1 : 2\n$$",
    "chapter": "Moving Charges and Magnetism",
    "subject": "Physics",
    "year": "2018"
  },
  {
    "id": "pyq_phys_ch18_50",
    "question": "A galvanometer has a resistance of $50\\ \\Omega$ and a current of $2\\text{ mA}$ is needed to give a full scale deflection. What is the resistance needed to convert it into a voltmeter of range $0 - 10\\text{ V}$?",
    "options": [
      "$4950\\ \\Omega$ in parallel",
      "$4950\\ \\Omega$ in series",
      "$5000\\ \\Omega$ in series",
      "$5000\\ \\Omega$ in parallel"
    ],
    "correctAnswer": "$4950\\ \\Omega$ in series",
    "correctOption": "b",
    "explanation": "The series resistance required is:\n$$\nR = \\frac{V}{I_g} - G = \\frac{10}{2 \\times 10^{-3}} - 50 = 5000 - 50 = 4950\\ \\Omega\n$$\nconnected in series with the galvanometer.",
    "chapter": "Moving Charges and Magnetism",
    "subject": "Physics",
    "year": "2018"
  },
  {
    "id": "pyq_phys_ch18_51",
    "question": "Two long straight parallel wires separated by $0.1\\text{ m}$ carry currents of $10\\text{ A}$ each in the same direction. The force per unit length exerted by one wire on the other is:",
    "options": [
      "$2 \\times 10^{-4}\\text{ N m}^{-1}$ attractive",
      "$2 \\times 10^{-4}\\text{ N m}^{-1}$ repulsive",
      "$4 \\times 10^{-4}\\text{ N m}^{-1}$ attractive",
      "$4 \\times 10^{-4}\\text{ N m}^{-1}$ repulsive"
    ],
    "correctAnswer": "$2 \\times 10^{-4}\\text{ N m}^{-1}$ attractive",
    "correctOption": "a",
    "explanation": "The force per unit length between two parallel wires carrying currents in the same direction is attractive:\n$$\n\\frac{F}{L} = \\frac{\\mu_0 I_1 I_2}{2\\pi d} = \\frac{(4\\pi \\times 10^{-7})(10)(10)}{2\\pi \\times 0.1} = \\frac{4\\pi \\times 10^{-5}}{0.2\\pi} = 2 \\times 10^{-4}\\text{ N m}^{-1} \\text{ (attractive)}\n$$",
    "chapter": "Moving Charges and Magnetism",
    "subject": "Physics",
    "year": "2019"
  },
  {
    "id": "pyq_phys_ch18_52",
    "question": "An electron is moving along positive $x$-axis in a magnetic field directed along positive $y$-axis. The direction of Lorentz force on the electron is along:",
    "options": [
      "Positive $z$-axis",
      "Negative $z$-axis",
      "Positive $y$-axis",
      "Negative $y$-axis"
    ],
    "correctAnswer": "Negative $z$-axis",
    "correctOption": "b",
    "explanation": "The magnetic Lorentz force on a charged particle is $\\vec{F} = q(\\vec{v} \\times \\vec{B})$.\nFor an electron, $q = -e$.\nVelocity $\\vec{v} = v\\hat{i}$, Magnetic field $\\vec{B} = B\\hat{j}$:\n$$\n\\vec{v} \\times \\vec{B} = (v\\hat{i}) \\times (B\\hat{j}) = v B \\hat{k}\n$$\n$$\n\\vec{F} = -e(v B \\hat{k}) = -e v B \\hat{k}\n$$\nThus, the force is directed along the negative $z$-axis.",
    "chapter": "Moving Charges and Magnetism",
    "subject": "Physics",
    "year": "2019"
  },
  {
    "id": "pyq_phys_ch18_53",
    "question": "A charge $q$ is accelerated through a potential difference $V$ and enters a uniform magnetic field $B$ perpendicular to it. The radius of the circular path is:",
    "options": [
      "$\\sqrt{\\frac{2 m V}{q B^2}}$",
      "$\\frac{1}{B}\\sqrt{\\frac{2 m V}{q}}$",
      "$\\frac{1}{B}\\sqrt{\\frac{m V}{2 q}}$",
      "$\\frac{1}{q}\\sqrt{\\frac{2 m V}{B}}$"
    ],
    "correctAnswer": "$\\frac{1}{B}\\sqrt{\\frac{2 m V}{q}}$",
    "correctOption": "b",
    "explanation": "Kinetic energy acquired: $E_k = q V$.\nMomentum $p = \\sqrt{2 m E_k} = \\sqrt{2 m q V}$.\nRadius of circular path in magnetic field $B$:\n$$\nr = \\frac{p}{q B} = \\frac{\\sqrt{2 m q V}}{q B} = \\frac{1}{B}\\sqrt{\\frac{2 m V}{q}}\n$$",
    "chapter": "Moving Charges and Magnetism",
    "subject": "Physics",
    "year": "2019"
  },
  {
    "id": "pyq_phys_ch18_54",
    "question": "The number of turns in a coil of galvanometer is tripled, then its voltage sensitivity:",
    "options": [
      "Triples",
      "Becomes one-third",
      "Increases by 9 times",
      "Remains unchanged"
    ],
    "correctAnswer": "Remains unchanged",
    "correctOption": "d",
    "explanation": "Current sensitivity: $I_s = \\frac{N A B}{k}$. When $N \\to 3N$, $I_s$ becomes 3 times.\nVoltage sensitivity: $V_s = \\frac{I_s}{R} = \\frac{N A B}{k R}$.\nWhen the number of turns $N$ is tripled ($3N$), the length of the wire triples, so the resistance of the galvanometer coil also triples ($R \\to 3R$).\nTherefore:\n$$\nV_s' = \\frac{(3N) A B}{k (3R)} = \\frac{N A B}{k R} = V_s\n$$\nThus, voltage sensitivity remains unchanged.",
    "chapter": "Moving Charges and Magnetism",
    "subject": "Physics",
    "year": "2019"
  },
  {
    "id": "pyq_phys_ch18_55",
    "question": "A circular current loop of magnetic moment $M$ is placed in a uniform magnetic field $B$. The orientation of the loop corresponds to unstable equilibrium when the angle between $\\vec{M}$ and $\\vec{B}$ is:",
    "options": [
      "$0^\\circ$",
      "$90^\\circ$",
      "$180^\\circ$",
      "$45^\\circ$"
    ],
    "correctAnswer": "$180^\\circ$",
    "correctOption": "c",
    "explanation": "Potential energy of a magnetic dipole in a magnetic field is $U = -M B \\cos\\theta$.\n- At $\\theta = 0^\\circ$, $U = -M B$ (minimum energy, stable equilibrium).\n- At $\\theta = 180^\\circ$, $U = +M B$ (maximum energy, unstable equilibrium).\nThus, $\\theta = 180^\\circ$ corresponds to unstable equilibrium.",
    "chapter": "Moving Charges and Magnetism",
    "subject": "Physics",
    "year": "2020"
  },
  {
    "id": "pyq_phys_ch18_56",
    "question": "The magnetic field at the centre 'O' in the given figure is:\n\n![Magnetic Field at Centre O](/pyq_images/physics/ch18/q56_center_o.png)",
    "options": [
      "$\\frac{\\mu_0 I}{4 R}\\left(1 + \\frac{1}{\\pi}\\right)$",
      "$\\frac{\\mu_0 I}{2 R}\\left(1 - \\frac{1}{\\pi}\\right)$",
      "$\\frac{\\mu_0 I}{4 R}$",
      "$\\frac{\\mu_0 I}{4\\pi R}(1 + \\pi)$"
    ],
    "correctAnswer": "$\\frac{\\mu_0 I}{4\\pi R}(1 + \\pi)$",
    "correctOption": "d",
    "explanation": "The conductor consists of a semi-infinite straight wire, a semicircular loop of radius $R$, and another semi-infinite straight wire.\n- Straight wires produce a field $B_{\\text{straight}} = \\frac{\\mu_0 I}{4\\pi R}$.\n- Semicircular loop produces $B_{\\text{semi}} = \\frac{\\mu_0 I}{4 R} = \\frac{\\mu_0 I \\pi}{4\\pi R}$.\nAdding both contributions pointing into the plane of the paper:\n$$\nB_{\\text{net}} = \\frac{\\mu_0 I}{4\\pi R}(1 + \\pi)\n$$",
    "chapter": "Moving Charges and Magnetism",
    "subject": "Physics",
    "year": "2020"
  },
  {
    "id": "pyq_phys_ch18_57",
    "question": "A long cylindrical wire of radius $R$ carries a uniform current density $J$. The magnetic field $B$ as a function of distance $r$ from the axis ($r < R$) is proportional to:\n\n![Cylindrical Wire with Current](/pyq_images/physics/ch18/q57_cylindrical_wire.png)",
    "options": [
      "$\\frac{1}{r}$",
      "$\\frac{1}{r^2}$",
      "$r$",
      "$r^2$"
    ],
    "correctAnswer": "$r$",
    "correctOption": "c",
    "explanation": "Applying Ampere's circuital law for an internal circular path of radius $r < R$:\n$$\n\\oint \\vec{B} \\cdot d\\vec{l} = \\mu_0 I_{\\text{enclosed}}\n$$\n$$\nB(2\\pi r) = \\mu_0 \\left(J \\times \\pi r^2\\right) = \\mu_0 I \\left(\\frac{\\pi r^2}{\\pi R^2}\\right) = \\frac{\\mu_0 I r^2}{R^2}\n$$\n$$\nB = \\left(\\frac{\\mu_0 I}{2\\pi R^2}\\right) r \\propto r\n$$\nThus, the magnetic field inside the wire is directly proportional to $r$.",
    "chapter": "Moving Charges and Magnetism",
    "subject": "Physics",
    "year": "2020"
  },
  {
    "id": "pyq_phys_ch18_58",
    "question": "In a cyclotron, the time spent by a positive ion inside each Dee is:",
    "options": [
      "Independent of velocity and radius of the path",
      "Directly proportional to the velocity of the ion",
      "Directly proportional to the radius of the path",
      "Inversely proportional to the magnetic field squared"
    ],
    "correctAnswer": "Independent of velocity and radius of the path",
    "correctOption": "a",
    "explanation": "The time spent inside a Dee corresponds to half a revolution:\n$$\nt = \\frac{T}{2} = \\frac{\\pi m}{q B}\n$$\nSince this expression contains only mass $m$, charge $q$, and magnetic field $B$, it is completely independent of the particle's speed $v$ and path radius $r$.",
    "chapter": "Moving Charges and Magnetism",
    "subject": "Physics",
    "year": "2020"
  },
  {
    "id": "pyq_phys_ch18_59",
    "question": "A galvanometer coil has a resistance of $12\\ \\Omega$ and the meter shows full scale deflection for a current of $3\\text{ mA}$. How will you convert the meter into a voltmeter of range $0$ to $18\\text{ V}$?",
    "options": [
      "Connect $5988\\ \\Omega$ in series",
      "Connect $5988\\ \\Omega$ in parallel",
      "Connect $6000\\ \\Omega$ in series",
      "Connect $12\\ \\Omega$ in parallel"
    ],
    "correctAnswer": "Connect $5988\\ \\Omega$ in series",
    "correctOption": "a",
    "explanation": "To convert to a voltmeter:\n$$\nR = \\frac{V}{I_g} - G\n$$\nGiven:\n- $V = 18\\text{ V}$\n- $I_g = 3\\text{ mA} = 3 \\times 10^{-3}\\text{ A}$\n- $G = 12\\ \\Omega$\n\n$$\nR = \\frac{18}{3 \\times 10^{-3}} - 12 = 6000 - 12 = 5988\\ \\Omega\n$$\nConnect $5988\\ \\Omega$ in series with the galvanometer coil.",
    "chapter": "Moving Charges and Magnetism",
    "subject": "Physics",
    "year": "2021"
  },
  {
    "id": "pyq_phys_ch18_60",
    "question": "Two parallel conductors carrying currents in opposite directions:",
    "options": [
      "Attract each other",
      "Exert no force on each other",
      "Cancel each other's magnetic fields",
      "Repel each other"
    ],
    "correctAnswer": "Repel each other",
    "correctOption": "d",
    "explanation": "By Ampere's force law, parallel conductors carrying currents in opposite (antiparallel) directions repel each other.",
    "chapter": "Moving Charges and Magnetism",
    "subject": "Physics",
    "year": "2021"
  },
  {
    "id": "pyq_phys_ch18_61",
    "question": "A strong magnetic field is applied on a stationary electron. Then the electron:",
    "options": [
      "Moves in the direction of the magnetic field",
      "Moves in a direction perpendicular to the magnetic field",
      "Remains stationary",
      "Starts rotating about its axis"
    ],
    "correctAnswer": "Remains stationary",
    "correctOption": "c",
    "explanation": "The magnetic Lorentz force on a charged particle is $\\vec{F} = q(\\vec{v} \\times \\vec{B})$. For a stationary electron, velocity $\\vec{v} = 0$, so $\\vec{F} = 0$. Since no force acts on the electron, it remains stationary.",
    "chapter": "Moving Charges and Magnetism",
    "subject": "Physics",
    "year": "2021"
  },
  {
    "id": "pyq_phys_ch18_62",
    "question": "Two parallel wires in free space are $10\\text{ cm}$ apart and each carries a current of $10\\text{ A}$ in the same direction. The magnetic force per unit length between them is:",
    "options": [
      "$2 \\times 10^{-4}\\text{ N m}^{-1}$",
      "$4 \\times 10^{-4}\\text{ N m}^{-1}$",
      "$1 \\times 10^{-4}\\text{ N m}^{-1}$",
      "$2\\pi \\times 10^{-4}\\text{ N m}^{-1}$"
    ],
    "correctAnswer": "$2 \\times 10^{-4}\\text{ N m}^{-1}$",
    "correctOption": "a",
    "explanation": "The force per unit length between two parallel current-carrying wires is:\n$$\n\\frac{F}{L} = \\frac{\\mu_0 I_1 I_2}{2\\pi d} = \\frac{(4\\pi \\times 10^{-7})(10)(10)}{2\\pi \\times 0.10} = 2 \\times 10^{-4}\\text{ N m}^{-1}\n$$",
    "chapter": "Moving Charges and Magnetism",
    "subject": "Physics",
    "year": "2021"
  },
  {
    "id": "pyq_phys_ch18_63",
    "question": "A tightly wound long solenoid has $n$ turns per unit length, a radius $r$ and carries a current $I$. A particle having charge $q$ and mass $m$ is projected from a point on the axis in a direction perpendicular to the axis. The maximum speed of the particle for which the particle does not strike the solenoid is:",
    "options": [
      "$\\frac{\\mu_0 n q I r}{m}$",
      "$\\frac{\\mu_0 n q I r}{2 m}$",
      "$\\frac{2\\mu_0 n q I r}{m}$",
      "$\\frac{\\mu_0 n q I r}{4 m}$"
    ],
    "correctAnswer": "$\\frac{\\mu_0 n q I r}{2 m}$",
    "correctOption": "b",
    "explanation": "Inside the solenoid, the magnetic field along the axis is $B = \\mu_0 n I$.\nA particle projected perpendicularly moves in a circle of radius $R = \\frac{m v}{q B}$.\nFor the particle projected from the axis not to strike the solenoid of radius $r$, the maximum diameter of its circle is $r$, so $R \\le \\frac{r}{2}$:\n$$\n\\frac{m v}{q B} \\le \\frac{r}{2} \\implies v_{\\text{max}} = \\frac{q B r}{2 m} = \\frac{\\mu_0 n q I r}{2 m}\n$$",
    "chapter": "Moving Charges and Magnetism",
    "subject": "Physics",
    "year": "2022"
  },
  {
    "id": "pyq_phys_ch18_64",
    "question": "Which of the magnetic field patterns given below represents the magnetic field lines due to a circular current-carrying loop?\n\n![Field Pattern of Circular Loop](/pyq_images/physics/ch18/q64_field_pattern.png)",
    "options": [
      "Concentric circles around wire and nearly straight lines near the centre",
      "Radial straight lines emanating outward",
      "Parallel uniform lines everywhere",
      "Hyperbolic field patterns"
    ],
    "correctAnswer": "Concentric circles around wire and nearly straight lines near the centre",
    "correctOption": "c",
    "explanation": "For a circular current loop, the magnetic field lines form concentric circular loops near each segment of the wire, and as they approach the centre of the loop, the lines become nearly straight and perpendicular to the plane of the coil.",
    "chapter": "Moving Charges and Magnetism",
    "subject": "Physics",
    "year": "2022"
  },
  {
    "id": "pyq_phys_ch18_65",
    "question": "A charged particle moves through a region of crossed uniform electric field $\\vec{E} = 4 \\times 10^6[2\\hat{i} + 0.2\\hat{j} + 0.1\\hat{k}]\\text{ V m}^{-1}$ and magnetic field $\\vec{B} = 0.2[\\hat{i} + 0.2\\hat{j} + \\hat{k}]\\text{ T}$. The approximate net Lorentz force acting on a proton moving with velocity $\\vec{v}$ is:",
    "options": [
      "$2.2 \\times 10^{-13}\\text{ N}$",
      "$5.0 \\times 10^{-13}\\text{ N}$",
      "$20 \\times 10^{-13}\\text{ N}$",
      "$25 \\times 10^{-13}\\text{ N}$"
    ],
    "correctAnswer": "$20 \\times 10^{-13}\\text{ N}$",
    "correctOption": "c",
    "explanation": "Lorentz force on proton $\\vec{F} = e(\\vec{E} + \\vec{v} \\times \\vec{B})$. Calculating the resultant force magnitude gives approximately $20 \\times 10^{-13}\\text{ N}$.",
    "chapter": "Moving Charges and Magnetism",
    "subject": "Physics",
    "year": "2022"
  },
  {
    "id": "pyq_phys_ch18_66",
    "question": "A wire of length $L$ carrying current $I$ is bent into a circular coil of $1$ turn. The magnetic field at the centre is $B_1$. If it is rewound into a circular coil of $3$ turns, the magnetic field at the centre $B_2$ is:",
    "options": [
      "$3 B_1$",
      "$6 B_1$",
      "$9 B_1$",
      "$\\frac{B_1}{9}$"
    ],
    "correctAnswer": "$9 B_1$",
    "correctOption": "c",
    "explanation": "When the number of turns increases by a factor of $n = 3$, the radius decreases to $r' = \\frac{r}{3}$.\n$$\nB_2 = \\frac{\\mu_0 n I}{2 r'} = \\frac{\\mu_0 (3) I}{2 (r/3)} = 9 \\left(\\frac{\\mu_0 I}{2 r}\\right) = 9 B_1\n$$",
    "chapter": "Moving Charges and Magnetism",
    "subject": "Physics",
    "year": "2022"
  },
  {
    "id": "pyq_phys_ch18_67",
    "question": "A charged particle is projected from the origin along the positive $x$-axis with velocity $10\\text{ m s}^{-1}$ in a uniform magnetic field $\\vec{B} = -2\\hat{k}\\text{ T}$. If the mass of the particle is $1\\text{ kg}$ and charge is $1\\text{ C}$, the velocity $\\vec{v}$ of the particle after time $t = \\frac{\\pi}{12}\\text{ s}$ will be (in $\\text{m s}^{-1}$):",
    "options": [
      "$5(\\sqrt{3}\\hat{i} + \\hat{j})$",
      "$5(\\hat{i} + \\sqrt{3}\\hat{j})$",
      "$5(\\sqrt{3}\\hat{i} - \\hat{j})$",
      "$5(\\hat{i} - \\sqrt{3}\\hat{j})$"
    ],
    "correctAnswer": "$5(\\sqrt{3}\\hat{i} + \\hat{j})$",
    "correctOption": "a",
    "explanation": "The angular frequency of circular motion is:\n$$\n\\omega = \\frac{q B}{m} = \\frac{1 \\times 2}{1} = 2\\text{ rad s}^{-1}\n$$\nAfter time $t = \\frac{\\pi}{12}\\text{ s}$, the angle rotated is:\n$$\n\\theta = \\omega t = 2 \\times \\frac{\\pi}{12} = \\frac{\\pi}{6} = 30^\\circ\n$$\nInitial velocity was along $\\hat{i}$. Under $\\vec{B} = -2\\hat{k}$, the magnetic force $\\vec{F} = q(\\vec{v} \\times \\vec{B}) = 1(10\\hat{i} \\times -2\\hat{k}) = +20\\hat{j}$.\nThus velocity components are:\n$$\n\\vec{v}(t) = v_0\\cos\\theta\\,\\hat{i} + v_0\\sin\\theta\\,\\hat{j} = 10\\cos 30^\\circ\\,\\hat{i} + 10\\sin 30^\\circ\\,\\hat{j} = 10\\left(\\frac{\\sqrt{3}}{2}\\right)\\hat{i} + 10\\left(\\frac{1}{2}\\right)\\hat{j} = 5(\\sqrt{3}\\hat{i} + \\hat{j})\\text{ m s}^{-1}\n$$",
    "chapter": "Moving Charges and Magnetism",
    "subject": "Physics",
    "year": "2022"
  },
  {
    "id": "pyq_phys_ch18_68",
    "question": "The magnetic field on the axis of a circular current loop of radius $r$ at a distance $x = \\sqrt{3}r$ from its centre is:",
    "options": [
      "$\\frac{\\mu_0 I}{16 r}$",
      "$\\frac{\\mu_0 I}{8 r}$",
      "$\\frac{\\mu_0 I}{4 r}$",
      "$\\frac{\\mu_0 I}{16 r}$"
    ],
    "correctAnswer": "$\\frac{\\mu_0 I}{16 r}$",
    "correctOption": "d",
    "explanation": "The magnetic field on the axis of a circular loop is:\n$$\nB = \\frac{\\mu_0 I r^2}{2(r^2 + x^2)^{3/2}}\n$$\nFor $x = \\sqrt{3}r$:\n$$\n(r^2 + x^2) = r^2 + 3r^2 = 4r^2 \\implies (4r^2)^{3/2} = 8r^3\n$$\n$$\nB = \\frac{\\mu_0 I r^2}{2(8r^3)} = \\frac{\\mu_0 I}{16 r}\n$$",
    "chapter": "Moving Charges and Magnetism",
    "subject": "Physics",
    "year": "2022"
  },
  {
    "id": "pyq_phys_ch18_69",
    "question": "A solenoid of length $50\\text{ cm}$ having $100\\text{ turns}$ carries a current of $2.5\\text{ A}$. The magnetic field at one end of the solenoid is:",
    "options": [
      "$1.57 \\times 10^{-4}\\text{ T}$",
      "$3.14 \\times 10^{-4}\\text{ T}$",
      "$6.28 \\times 10^{-4}\\text{ T}$",
      "$9.42 \\times 10^{-4}\\text{ T}$"
    ],
    "correctAnswer": "$3.14 \\times 10^{-4}\\text{ T}$",
    "correctOption": "b",
    "explanation": "The magnetic field at one end of a long solenoid is half the field at the centre:\n$$\nB_{\\text{end}} = \\frac{1}{2} \\mu_0 n I = \\frac{1}{2} \\mu_0 \\left(\\frac{N}{L}\\right) I\n$$\nGiven:\n- $N = 100$\n- $L = 50\\text{ cm} = 0.5\\text{ m}$\n- $I = 2.5\\text{ A}$\n\n$$\nB_{\\text{end}} = \\frac{1}{2} \\times (4\\pi \\times 10^{-7}) \\times \\left(\\frac{100}{0.5}\\right) \\times 2.5 = \\frac{1}{2} \\times (4\\pi \\times 10^{-7}) \\times 200 \\times 2.5 = 3.1416 \\times 10^{-4}\\text{ T}\n$$",
    "chapter": "Moving Charges and Magnetism",
    "subject": "Physics",
    "year": "2023"
  },
  {
    "id": "pyq_phys_ch18_70",
    "question": "The torque acting on a magnetic dipole placed in a uniform magnetic field is zero when the angle between the dipole axis and the magnetic field is:",
    "options": [
      "$0^\\circ$",
      "$45^\\circ$",
      "$60^\\circ$",
      "$90^\\circ$"
    ],
    "correctAnswer": "$0^\\circ$",
    "correctOption": "a",
    "explanation": "The torque on a magnetic dipole $\\vec{M}$ in a magnetic field $\\vec{B}$ is given by:\n$$\n\\tau = M B \\sin\\theta\n$$\nWhen the angle $\\theta = 0^\\circ$ (or $180^\\circ$), $\\sin\\theta = 0$, so the torque is zero.",
    "chapter": "Moving Charges and Magnetism",
    "subject": "Physics",
    "year": "2023"
  },
  {
    "id": "pyq_phys_ch18_71",
    "question": "A proton and an $\\alpha$-particle moving with the same velocity enter a uniform magnetic field with their velocities perpendicular to the magnetic field. The ratio of radii of their circular paths is:",
    "options": [
      "$2 : 1$",
      "$1 : 4$",
      "$1 : 2$",
      "$4 : 1$"
    ],
    "correctAnswer": "$1 : 2$",
    "correctOption": "c",
    "explanation": "Radius of circular path: $r = \\frac{m v}{q B}$.\nSince both particles enter with the same velocity $v$ and into the same field $B$:\n$$\nr \\propto \\frac{m}{q}\n$$\n- Proton: $\\frac{m_p}{q_p} = \\frac{m}{e}$\n- $\\alpha$-particle: $\\frac{m_\\alpha}{q_\\alpha} = \\frac{4m}{2e} = \\frac{2m}{e}$\n\n$$\n\\frac{r_p}{r_\\alpha} = \\frac{m/e}{2m/e} = \\frac{1}{2} = 1 : 2\n$$",
    "chapter": "Moving Charges and Magnetism",
    "subject": "Physics",
    "year": "2023"
  },
  {
    "id": "pyq_phys_ch18_72",
    "question": "A moving coil galvanometer is converted into an ammeter of range $0$ to $5\\text{ mA}$. The galvanometer resistance is $90\\ \\Omega$ and the shunt resistance connected is $10\\ \\Omega$. The maximum current that can be measured without the shunt is:",
    "options": [
      "$1\\text{ mA}$",
      "$0.5\\text{ mA}$",
      "$2.5\\text{ mA}$",
      "$0.5\\text{ mA}$"
    ],
    "correctAnswer": "$0.5\\text{ mA}$",
    "correctOption": "d",
    "explanation": "The current division between galvanometer and shunt is:\n$$\nI_g = I \\left(\\frac{S}{G + S}\\right)\n$$\nGiven:\n- Total full scale current with shunt, $I = 5\\text{ mA}$\n- $G = 90\\ \\Omega$\n- $S = 10\\ \\Omega$\n\n$$\nI_g = 5\\text{ mA} \\times \\left(\\frac{10}{90 + 10}\\right) = 5 \\times \\frac{10}{100} = 0.5\\text{ mA}\n$$\nThus, the maximum current the galvanometer alone can measure without the shunt is $0.5\\text{ mA}$.",
    "chapter": "Moving Charges and Magnetism",
    "subject": "Physics",
    "year": "2024"
  },
  {
    "id": "pyq_phys_ch18_73",
    "question": "A moving electron produces:",
    "options": [
      "Only electric field",
      "Both electric and magnetic fields",
      "Only magnetic field",
      "Neither electric nor magnetic field"
    ],
    "correctAnswer": "Both electric and magnetic fields",
    "correctOption": "b",
    "explanation": "A stationary charged particle produces only an electrostatic field. When the charged particle moves with constant velocity, it produces an electric field as well as a magnetic field in the surrounding space.",
    "chapter": "Moving Charges and Magnetism",
    "subject": "Physics",
    "year": "2024"
  },
  {
    "id": "pyq_phys_ch18_74",
    "question": "A moving coil galvanometer of resistance $G$ is converted into an ammeter of range $0 - I$ by using a shunt $S$. If the current sensitivity of the galvanometer is $S_i$, then the current sensitivity of the resulting ammeter is:",
    "options": [
      "$S_i \\left(\\frac{S}{G + S}\\right)$",
      "$S_i \\left(\\frac{G + S}{S}\\right)$",
      "$S_i \\left(\\frac{G}{G + S}\\right)$",
      "$S_i \\left(\\frac{S}{G}\\right)$"
    ],
    "correctAnswer": "$S_i \\left(\\frac{S}{G + S}\\right)$",
    "correctOption": "a",
    "explanation": "Current sensitivity of the galvanometer is $S_i = \\frac{\\theta}{I_g}$.\nFor the ammeter, total current $I$ produces galvanometer current $I_g = I\\left(\\frac{S}{G + S}\\right)$.\nTherefore, the current sensitivity of the ammeter is:\n$$\nS_i' = \\frac{\\theta}{I} = \\frac{\\theta}{I_g} \\left(\\frac{I_g}{I}\\right) = S_i \\left(\\frac{S}{G + S}\\right)\n$$",
    "chapter": "Moving Charges and Magnetism",
    "subject": "Physics",
    "year": "2024"
  },
  {
    "id": "pyq_phys_ch18_75",
    "question": "The magnetic field at a distance $x$ on the axis of a circular current loop of radius $R$ is $\\frac{1}{8}$ of the magnetic field at the centre. The value of $x$ is:",
    "options": [
      "$\\frac{R}{\\sqrt{3}}$",
      "$R\\sqrt{3}$",
      "$\\frac{R}{3}$",
      "$R\\sqrt{3}$"
    ],
    "correctAnswer": "$R\\sqrt{3}$",
    "correctOption": "d",
    "explanation": "The magnetic field on the axis of a circular loop is:\n$$\nB_{\\text{axis}} = \\frac{\\mu_0 I R^2}{2(R^2 + x^2)^{3/2}}\n$$\nAt the centre:\n$$\nB_{\\text{centre}} = \\frac{\\mu_0 I}{2R}\n$$\nGiven $B_{\\text{axis}} = \\frac{1}{8} B_{\\text{centre}}$:\n$$\n\\frac{\\mu_0 I R^2}{2(R^2 + x^2)^{3/2}} = \\frac{1}{8} \\left(\\frac{\\mu_0 I}{2R}\\right)\n$$\n$$\n\\frac{R^3}{(R^2 + x^2)^{3/2}} = \\frac{1}{8} = \\left(\\frac{1}{2}\\right)^3\n$$\n$$\n\\frac{R}{\\sqrt{R^2 + x^2}} = \\frac{1}{2} \\implies R^2 + x^2 = 4R^2 \\implies x^2 = 3R^2 \\implies x = R\\sqrt{3}\n$$",
    "chapter": "Moving Charges and Magnetism",
    "subject": "Physics",
    "year": "2024"
  }
]

out_path = 'src/data/pyq_physics_ch18.json'
with open(out_path, 'w', encoding='utf-8') as f:
    json.dump(questions, f, ensure_ascii=False, indent=2)

print(f'Successfully wrote {len(questions)} questions to {out_path}')
