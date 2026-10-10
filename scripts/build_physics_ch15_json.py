import json

questions = [
  {
    "id": "phys_ch15_q1",
    "subject": "Physics",
    "chapter": "Electric Charges and Fields",
    "chapter_number": 15,
    "year": 2006,
    "question": "A gaussian sphere encloses an electric dipole within it. The total flux across the sphere is",
    "options": [
      "zero",
      "half that due to a single charge",
      "double that due to a single charge",
      "dependent on the position of the dipole."
    ],
    "correct_answer": 0,
    "explanation": "Total electric flux through any closed surface enclosing a dipole is given by Gauss's law:\n$$\\phi = \\frac{q_{\\text{enclosed}}}{\\varepsilon_0} = \\frac{+q + (-q)}{\\varepsilon_0} = 0$$\nSince the net charge enclosed by the Gaussian surface is zero, the total electric flux is zero.",
    "needs_image": False
  },
  {
    "id": "phys_ch15_q2",
    "subject": "Physics",
    "chapter": "Electric Charges and Fields",
    "chapter_number": 15,
    "year": 2006,
    "question": "A comb run through one's dry hair attracts small bits of paper. This is due to",
    "options": [
      "comb is a good conductor",
      "paper is a good conductor",
      "the atoms in the paper get polarised by the charged comb",
      "the comb possesses magnetic properties."
    ],
    "correct_answer": 2,
    "explanation": "When run through dry hair, the comb gets electrified by friction. When brought near small neutral bits of paper, the electric field of the comb induces dielectric polarization in the atoms of the paper, pulling opposite induced charges closer and creating a net attractive electrostatic force.",
    "needs_image": False
  },
  {
    "id": "phys_ch15_q3",
    "subject": "Physics",
    "chapter": "Electric Charges and Fields",
    "chapter_number": 15,
    "year": 2006,
    "question": "A simple pendulum has a length $l$ and the mass of the bob is $m$. The bob is given a charge $q$ coulomb. The pendulum is suspended between the vertical plates of a charged parallel plate capacitor. If $E$ is the electric field strength between the plates, the time period of the pendulum is given by",
    "options": [
      "2π √(l/g)",
      "2π √(l / √(g + qE/m))",
      "2π √(l / √(g - qE/m))",
      "2π √(l / √(g² + (qE/m)²))"
    ],
    "correct_answer": 3,
    "explanation": "![Pendulum between capacitor plates](/pyq_images/physics/ch15/exp_q3.png)\nTime period of a simple pendulum is $T = 2\\pi \\sqrt{\\frac{l}{g'}}$, where $g'$ is the effective acceleration.\nGravitational acceleration $g$ acts vertically downwards, and the electrostatic acceleration $a = \\frac{qE}{m}$ acts horizontally perpendicular to $g$:\n$$g' = \\sqrt{g^2 + a^2} = \\sqrt{g^2 + \\left(\\frac{qE}{m}\\right)^2}$$\nTherefore, the time period is:\n$$T = 2\\pi \\sqrt{\\frac{l}{\\sqrt{g^2 + \\left(\\frac{qE}{m}\\right)^2}}}$$",
    "needs_image": True,
    "image_url": "/pyq_images/physics/ch15/exp_q3.png"
  },
  {
    "id": "phys_ch15_q4",
    "subject": "Physics",
    "chapter": "Electric Charges and Fields",
    "chapter_number": 15,
    "year": 2007,
    "question": "Two identical charges repel each other with a force equal to $10\\text{ mgwt}$ when they are $0.6\\text{ m}$ apart in air. ($g = 10\\text{ m s}^{-2}$). The value of each charge is",
    "options": [
      "2 mC",
      "2 × 10⁻⁷ mC",
      "2 nC",
      "2 µC"
    ],
    "correct_answer": 3,
    "explanation": "Force $F = 10\\text{ mgwt} = (10 \\times 10^{-6}\\text{ kg}) \\times (10\\text{ m s}^{-2}) = 10^{-4}\\text{ N}$.\nDistance $d = 0.6\\text{ m}$.\nBy Coulomb's law:\n$$F = \\frac{1}{4\\pi\\varepsilon_0}\\frac{q^2}{d^2}$$\n$$10^{-4} = \\frac{(9 \\times 10^9) \\times q^2}{(0.6)^2} = \\frac{9 \\times 10^9 \\times q^2}{0.36}$$\n$$q^2 = \\frac{10^{-4} \\times 0.36}{9 \\times 10^9} = 4 \\times 10^{-12} \\implies q = 2 \\times 10^{-6}\\text{ C} = 2\\;\\mu\\text{C}$$",
    "needs_image": False
  },
  {
    "id": "phys_ch15_q5",
    "subject": "Physics",
    "chapter": "Electric Charges and Fields",
    "chapter_number": 15,
    "year": 2009,
    "question": "An $\\alpha$-particle of mass $6.4 \\times 10^{-27}\\text{ kg}$ and charge $3.2 \\times 10^{-19}\\text{ C}$ is situated in a uniform electric field of $1.6 \\times 10^5\\text{ V m}^{-1}$. The velocity of the particle at the end of $2 \\times 10^{-2}\\text{ m}$ path when it starts from rest is",
    "options": [
      "2√3 × 10⁵ m s⁻¹",
      "8 × 10⁵ m s⁻¹",
      "16 × 10⁵ m s⁻¹",
      "4√2 × 10⁵ m s⁻¹"
    ],
    "correct_answer": 3,
    "explanation": "Electrostatic force on the $\\alpha$-particle:\n$$F = qE = (3.2 \\times 10^{-19}\\text{ C}) \\times (1.6 \\times 10^5\\text{ V m}^{-1}) = 5.12 \\times 10^{-14}\\text{ N}$$\nAcceleration:\n$$a = \\frac{F}{m} = \\frac{5.12 \\times 10^{-14}}{6.4 \\times 10^{-27}} = 8 \\times 10^{12}\\text{ m s}^{-2}$$\nUsing $v^2 = u^2 + 2as$ with $u = 0$ and $s = 2 \\times 10^{-2}\\text{ m}$:\n$$v^2 = 2 \\times (8 \\times 10^{12}) \\times (2 \\times 10^{-2}) = 32 \\times 10^{10}$$\n$$v = \\sqrt{32 \\times 10^{10}} = 4\\sqrt{2} \\times 10^5\\text{ m s}^{-1}$$",
    "needs_image": False
  },
  {
    "id": "phys_ch15_q6",
    "subject": "Physics",
    "chapter": "Electric Charges and Fields",
    "chapter_number": 15,
    "year": 2010,
    "question": "Two identical conducting balls $A$ and $B$ have positive charges $q_1$ and $q_2$ respectively. But $q_1 \\ne q_2$. The balls are brought together so that they touch each other and then kept in their original positions. The force between them is",
    "options": [
      "less than that before the balls touched",
      "greater than that before the balls touched",
      "same as that before the balls touched",
      "zero."
    ],
    "correct_answer": 1,
    "explanation": "![Conducting balls touching](/pyq_images/physics/ch15/exp_q6.png)\nInitial repulsive force: $F = \\frac{1}{4\\pi\\varepsilon_0}\\frac{q_1 q_2}{r^2}$.\nAfter contact, the charges redistribute equally: $q' = \\frac{q_1 + q_2}{2}$.\nNew force: $F' = \\frac{1}{4\\pi\\varepsilon_0}\\frac{\\left(\\frac{q_1 + q_2}{2}\\right)^2}{r^2}$.\nBy AM-GM inequality, for unequal positive numbers $q_1 \\ne q_2$:\n$$\\left(\\frac{q_1 + q_2}{2}\\right)^2 > q_1 q_2 \\implies F' > F$$",
    "needs_image": True,
    "image_url": "/pyq_images/physics/ch15/exp_q6.png"
  },
  {
    "id": "phys_ch15_q7",
    "subject": "Physics",
    "chapter": "Electric Charges and Fields",
    "chapter_number": 15,
    "year": 2010,
    "question": "Two small spheres of masses $M_1$ and $M_2$ are suspended by weightless insulating threads of lengths $L_1$ and $L_2$. The spheres carry charges $Q_1$ and $Q_2$ respectively. The spheres are suspended such that they are in level with one another and the threads are inclined to the vertical at angles of $\\theta_1$ and $\\theta_2$ as shown.\n\n![Spheres on threads](/pyq_images/physics/ch15/q7.png)\n\nWhich one of the following conditions is essential, if $\\theta_1 = \\theta_2$?",
    "options": [
      "M₁ ≠ M₂, but Q₁ = Q₂",
      "M₁ = M₂",
      "Q₁ = Q₂",
      "L₁ = L₂"
    ],
    "correct_answer": 1,
    "explanation": "![Force diagram on spheres](/pyq_images/physics/ch15/exp_q7.png)\nIn equilibrium:\n$$\\tan\\theta_1 = \\frac{F_1}{M_1 g}, \\quad \\tan\\theta_2 = \\frac{F_2}{M_2 g}$$\nBy Newton's third law, $F_1 = F_2 = F$.\nFor $\\theta_1 = \\theta_2$, $\\tan\\theta_1 = \\tan\\theta_2$:\n$$\\frac{F}{M_1 g} = \\frac{F}{M_2 g} \\implies M_1 = M_2$$",
    "needs_image": True,
    "image_url": "/pyq_images/physics/ch15/q7.png"
  },
  {
    "id": "phys_ch15_q8",
    "subject": "Physics",
    "chapter": "Electric Charges and Fields",
    "chapter_number": 15,
    "year": 2011,
    "question": "Two identical charged spheres of material density $\\rho$, suspended from the same point by inextensible strings of equal length make an angle $\\theta$ between the strings. When suspended in a liquid of density $\\sigma$ the angle $\\theta$ remains the same. The dielectric constant $K$ of the liquid is",
    "options": [
      "ρ / (ρ - σ)",
      "(ρ - σ) / ρ",
      "ρ / (ρ + σ)",
      "(ρ + σ) / ρ"
    ],
    "correct_answer": 0,
    "explanation": "![Spheres in liquid](/pyq_images/physics/ch15/exp_q8.png)\nIn air: $\\tan(\\theta/2) = \\frac{F}{mg}$.\nIn liquid: $F' = \\frac{F}{K}$ and effective weight $mg' = mg\\left(1 - \\frac{\\sigma}{\\rho}\\right)$.\nSince the angle remains unchanged:\n$$\\frac{F/K}{mg(1 - \\sigma/\\rho)} = \\frac{F}{mg} \\implies K = \\frac{1}{1 - \\sigma/\\rho} = \\frac{\\rho}{\\rho - \\sigma}$$",
    "needs_image": True,
    "image_url": "/pyq_images/physics/ch15/exp_q8.png"
  },
  {
    "id": "phys_ch15_q9",
    "subject": "Physics",
    "chapter": "Electric Charges and Fields",
    "chapter_number": 15,
    "year": 2011,
    "question": "The electric field at a point due to an electric dipole, on an axis inclined at an angle $\\theta (< 90^\\circ)$ to the dipole axis, is perpendicular to the dipole axis, if the angle $\\theta$ is",
    "options": [
      "tan⁻¹(2)",
      "tan⁻¹(1/2)",
      "tan⁻¹(√2)",
      "tan⁻¹(1/√2)"
    ],
    "correct_answer": 2,
    "explanation": "![Dipole field angle](/pyq_images/physics/ch15/exp_q9.png)\nThe angle $\\phi$ of the resultant electric field with the position vector $\\vec{r}$ satisfies:\n$$\\tan\\phi = \\frac{1}{2}\\tan\\theta$$\nSince the field is perpendicular to the dipole axis, $\\phi + \\theta = 90^\\circ \\implies \\phi = 90^\\circ - \\theta$:\n$$\\cot\\theta = \\frac{1}{2}\\tan\\theta \\implies \\tan^2\\theta = 2 \\implies \\theta = \\tan^{-1}(\\sqrt{2})$$",
    "needs_image": True,
    "image_url": "/pyq_images/physics/ch15/exp_q9.png"
  },
  {
    "id": "phys_ch15_q10",
    "subject": "Physics",
    "chapter": "Electric Charges and Fields",
    "chapter_number": 15,
    "year": 2012,
    "question": "In the uniform electric field of $E = 1 \\times 10^4\\text{ NC}^{-1}$, an electron is accelerated from rest. The velocity of the electron when it has travelled a distance of $2 \\times 10^{-2}\\text{ m}$ is nearly ______ $\\text{m s}^{-1}$ ($e/m$ of electron $\\simeq 1.8 \\times 10^{11}\\text{ C kg}^{-1}$)",
    "options": [
      "1.6 × 10⁶",
      "0.85 × 10⁶",
      "0.425 × 10⁶",
      "8.5 × 10⁶"
    ],
    "correct_answer": 3,
    "explanation": "$$a = \\frac{eE}{m}$$\n$$v = \\sqrt{2as} = \\sqrt{2 \\left(\\frac{e}{m}\\right) E s} = \\sqrt{2 \\times (1.8 \\times 10^{11}) \\times (10^4) \\times (2 \\times 10^{-2})} = \\sqrt{72 \\times 10^{12}} \\approx 8.5 \\times 10^6\\text{ m s}^{-1}$$",
    "needs_image": False
  },
  {
    "id": "phys_ch15_q11",
    "subject": "Physics",
    "chapter": "Electric Charges and Fields",
    "chapter_number": 15,
    "year": 2012,
    "question": "Two fixed charges $A$ and $B$ of $5\\;\\mu\\text{C}$ each are separated by a distance of $6\\text{ m}$. $C$ is the mid point of the line joining $A$ and $B$. A charge '$Q$' of $-5\\;\\mu\\text{C}$ is shot perpendicular to the line joining $A$ and $B$ through $C$ with a kinetic energy of $0.06\\text{ J}$. The charge '$Q$' comes to rest at a point $D$. The distance $CD$ is",
    "options": [
      "3 m",
      "√3 m",
      "3√3 m",
      "4 m"
    ],
    "correct_answer": 3,
    "explanation": "Initial potential energy at $C$ ($AC = BC = 3\\text{ m}$):\n$$U_i = 2 \\times \\frac{(9 \\times 10^9)(5 \\times 10^{-6})(-5 \\times 10^{-6})}{3} = -0.15\\text{ J}$$\nTotal energy: $E = K_i + U_i = 0.06 - 0.15 = -0.09\\text{ J}$.\nAt stopping point $D$ where $CD = x$:\n$$U_f = 2 \\times \\frac{(9 \\times 10^9)(5 \\times 10^{-6})(-5 \\times 10^{-6})}{\\sqrt{3^2 + x^2}} = \\frac{-0.45}{\\sqrt{9 + x^2}} = -0.09\\text{ J}$$\n$$\\sqrt{9 + x^2} = \\frac{0.45}{0.09} = 5 \\implies 9 + x^2 = 25 \\implies x = 4\\text{ m}$$",
    "needs_image": False
  },
  {
    "id": "phys_ch15_q12",
    "subject": "Physics",
    "chapter": "Electric Charges and Fields",
    "chapter_number": 15,
    "year": 2014,
    "question": "If a charge on the body is $1\\text{ nC}$, then how many electrons are present on the body ?",
    "options": [
      "6.25 × 10²⁷",
      "1.6 × 10¹⁹",
      "6.25 × 10²⁸",
      "6.25 × 10⁹"
    ],
    "correct_answer": 3,
    "explanation": "$$n = \\frac{q}{e} = \\frac{1 \\times 10^{-9}\\text{ C}}{1.6 \\times 10^{-19}\\text{ C}} = 6.25 \\times 10^9\\text{ electrons}$$",
    "needs_image": False
  },
  {
    "id": "phys_ch15_q13",
    "subject": "Physics",
    "chapter": "Electric Charges and Fields",
    "chapter_number": 15,
    "year": 2014,
    "question": "Two equal and opposite charges of masses $m_1$ and $m_2$ are accelerated in an uniform electric field through the same distance. What is the ratio of their accelerations if their ratio of masses is $\\frac{m_1}{m_2} = 0.5$ ?",
    "options": [
      "a₁ / a₂ = 2",
      "a₁ / a₂ = 0.5",
      "a₁ / a₂ = 3",
      "a₁ / a₂ = 1"
    ],
    "correct_answer": 0,
    "explanation": "Since charge magnitudes are equal, both experience the same electrostatic force magnitude $F = qE$.\n$$a_1 = \\frac{F}{m_1}, \\quad a_2 = \\frac{F}{m_2}$$\n$$\\frac{a_1}{a_2} = \\frac{m_2}{m_1} = \\frac{1}{0.5} = 2$$",
    "needs_image": False
  },
  {
    "id": "phys_ch15_q14",
    "subject": "Physics",
    "chapter": "Electric Charges and Fields",
    "chapter_number": 15,
    "year": 2014,
    "question": "What is the nature of Gaussian surface involved in Gauss law of electrostatic ?",
    "options": [
      "Magnetic",
      "Scalar",
      "Vector",
      "Electrical"
    ],
    "correct_answer": 2,
    "explanation": "In Gauss's law $\\oint \\vec{E} \\cdot d\\vec{s} = \\frac{q_{\\text{enclosed}}}{\\varepsilon_0}$, the surface area element $d\\vec{s}$ is an oriented vector pointing normal to the surface, making the Gaussian surface vector in nature.",
    "needs_image": False
  },
  {
    "id": "phys_ch15_q15",
    "subject": "Physics",
    "chapter": "Electric Charges and Fields",
    "chapter_number": 15,
    "year": 2014,
    "question": "A spherical conductor of radius $2\\text{ cm}$ is uniformly charged with $3\\text{ nC}$. What is the electric field at a distance of $3\\text{ cm}$ from the centre of the sphere ?",
    "options": [
      "3 × 10⁴ V m⁻¹",
      "3 × 10⁶ V m⁻¹",
      "3 × 10⁻⁴ V m⁻¹",
      "3 V m⁻¹"
    ],
    "correct_answer": 0,
    "explanation": "Outside the spherical conductor ($r = 0.03\\text{ m} > R = 0.02\\text{ m}$):\n$$E = \\frac{1}{4\\pi\\varepsilon_0}\\frac{q}{r^2} = \\frac{(9 \\times 10^9) \\times (3 \\times 10^{-9})}{(3 \\times 10^{-2})^2} = 3 \\times 10^4\\text{ V m}^{-1}$$",
    "needs_image": False
  },
  {
    "id": "phys_ch15_q16",
    "subject": "Physics",
    "chapter": "Electric Charges and Fields",
    "chapter_number": 15,
    "year": 2015,
    "question": "The angle between the dipole moment and electric field at any point on the equatorial plane is",
    "options": [
      "90°",
      "45°",
      "0°",
      "180°"
    ],
    "correct_answer": 3,
    "explanation": "On the equatorial plane, the electric field vector $\\vec{E}_{eq} = -\\frac{1}{4\\pi\\varepsilon_0}\\frac{\\vec{p}}{r^3}$ is directed anti-parallel to the dipole moment vector $\\vec{p}$. Therefore, the angle between them is $180^\\circ$.",
    "needs_image": False
  },
  {
    "id": "phys_ch15_q17",
    "subject": "Physics",
    "chapter": "Electric Charges and Fields",
    "chapter_number": 15,
    "year": 2015,
    "question": "Pick out the statement which is incorrect.",
    "options": [
      "The electric field lines forms closed loop.",
      "Field lines never intersect.",
      "The tangent drawn to a line of force represents the direction of electric field.",
      "A negative test charge experiences a force opposite to the direction of the field."
    ],
    "correct_answer": 0,
    "explanation": "Electrostatic field lines originate from positive charges and terminate on negative charges; they do not form closed loops because the electrostatic field is conservative.",
    "needs_image": False
  },
  {
    "id": "phys_ch15_q18",
    "subject": "Physics",
    "chapter": "Electric Charges and Fields",
    "chapter_number": 15,
    "year": 2015,
    "question": "Two spheres carrying charges $+6\\;\\mu\\text{C}$ and $+9\\;\\mu\\text{C}$, separated by a distance $d$, experiences a force of repulsion $F$. When a charge of $-3\\;\\mu\\text{C}$ is given to both the sphere and kept at the same distance as before, the new force of repulsion is",
    "options": [
      "3F",
      "F/9",
      "F",
      "F/3"
    ],
    "correct_answer": 3,
    "explanation": "![Spheres with charge addition](/pyq_images/physics/ch15/exp_q18.png)\nInitial force: $F \\propto (+6)(+9) = 54\\;\\mu\\text{C}^2$.\nAfter adding $-3\\;\\mu\\text{C}$:\n$q'_1 = +3\\;\\mu\\text{C}, \\; q'_2 = +6\\;\\mu\\text{C}$.\nNew force: $F' \\propto (+3)(+6) = 18\\;\\mu\\text{C}^2$.\n$$\\frac{F'}{F} = \\frac{18}{54} = \\frac{1}{3} \\implies F' = \\frac{F}{3}$$",
    "needs_image": True,
    "image_url": "/pyq_images/physics/ch15/exp_q18.png"
  },
  {
    "id": "phys_ch15_q19",
    "subject": "Physics",
    "chapter": "Electric Charges and Fields",
    "chapter_number": 15,
    "year": 2016,
    "question": "If there is only one type of charge in the universe, then ($\\vec{E} \\to$ Electric field, $d\\vec{s} \\to$ Area vector)",
    "options": [
      "∮ E · ds ≠ 0 on any surface",
      "∮ E · ds could not be defined",
      "∮ E · ds = ∞ if charge is inside",
      "∮ E · ds = 0 if charge is outside, = q/ε₀ if charge is inside"
    ],
    "correct_answer": 3,
    "explanation": "According to Gauss's law, total flux depends only on whether the charge is inside or outside the surface: $\\oint \\vec{E} \\cdot d\\vec{s} = 0$ if the charge is outside, and $\\oint \\vec{E} \\cdot d\\vec{s} = \\frac{q}{\\varepsilon_0}$ if the charge is inside.",
    "needs_image": False
  },
  {
    "id": "phys_ch15_q20",
    "subject": "Physics",
    "chapter": "Electric Charges and Fields",
    "chapter_number": 15,
    "year": 2016,
    "question": "An electron of mass $m$, charge $e$ falls through a distance $h$ meter in a uniform electric field $E$. Then time of fall",
    "options": [
      "t = √(2hm / eE)",
      "t = 2hm / eE",
      "t = √(2eE / hm)",
      "t = 2eE / hm"
    ],
    "correct_answer": 0,
    "explanation": "Acceleration of electron: $a = \\frac{eE}{m}$.\nFrom kinematics $h = \\frac{1}{2}at^2$:\n$$t = \\sqrt{\\frac{2h}{a}} = \\sqrt{\\frac{2hm}{eE}}$$",
    "needs_image": False
  },
  {
    "id": "phys_ch15_q21",
    "subject": "Physics",
    "chapter": "Electric Charges and Fields",
    "chapter_number": 15,
    "year": 2016,
    "question": "If $\\vec{E}_{ax}$ and $\\vec{E}_{eq}$ represents electric field at a point on the axial and equatorial line of a dipole. If points are at a distance $r$ from the centre of the dipole, for $r \\gg a$",
    "options": [
      "E⃗_ax = E⃗_eq",
      "E⃗_ax = -E⃗_eq",
      "E⃗_ax = -2E⃗_eq",
      "E⃗_eq = 2E⃗_ax"
    ],
    "correct_answer": 2,
    "explanation": "$$\\vec{E}_{ax} = \\frac{1}{4\\pi\\varepsilon_0}\\frac{2\\vec{p}}{r^3}, \\quad \\vec{E}_{eq} = -\\frac{1}{4\\pi\\varepsilon_0}\\frac{\\vec{p}}{r^3}$$\n$$\\vec{E}_{ax} = -2\\vec{E}_{eq}$$",
    "needs_image": False
  },
  {
    "id": "phys_ch15_q22",
    "subject": "Physics",
    "chapter": "Electric Charges and Fields",
    "chapter_number": 15,
    "year": 2017,
    "question": "Two spheres of electric charges $+2\\text{ nC}$ and $-8\\text{ nC}$ are placed at a distance $d$ apart. If they are allowed to touch each other, what is the new distance between them to get a repulsive force of same magnitude as before?",
    "options": [
      "d/2",
      "d",
      "3d/4",
      "4d/3"
    ],
    "correct_answer": 2,
    "explanation": "Initial force: $F = \\frac{k |(+2)(-8)|}{d^2} = \\frac{16k}{d^2}$.\nAfter touching, each sphere gets $q' = \\frac{+2 + (-8)}{2} = -3\\text{ nC}$.\nFor equal repulsive force: $\\frac{k (-3)^2}{r^2} = \\frac{16k}{d^2} \\implies \\frac{9}{r^2} = \\frac{16}{d^2} \\implies r = \\frac{3d}{4}$.",
    "needs_image": False
  },
  {
    "id": "phys_ch15_q23",
    "subject": "Physics",
    "chapter": "Electric Charges and Fields",
    "chapter_number": 15,
    "year": 2017,
    "question": "$4 \\times 10^{10}$ electrons are removed from a neutral metal sphere of diameter $20\\text{ cm}$ placed in air. The magnitude of the electric field (in $\\text{N C}^{-1}$) at a distance of $20\\text{ cm}$ from its centre is",
    "options": [
      "Zero",
      "5760",
      "640",
      "1440"
    ],
    "correct_answer": 3,
    "explanation": "![Sphere field calculation](/pyq_images/physics/ch15/exp_q23.png)\nTotal charge on sphere: $q = ne = 4 \\times 10^{10} \\times 1.6 \\times 10^{-19} = 6.4 \\times 10^{-9}\\text{ C}$.\nRadius $R = 10\\text{ cm} = 0.1\\text{ m}$.\nDistance $d = 20\\text{ cm} = 0.2\\text{ m} > R$:\n$$E = \\frac{1}{4\\pi\\varepsilon_0}\\frac{q}{d^2} = \\frac{(9 \\times 10^9) \\times (6.4 \\times 10^{-9})}{(0.2)^2} = \\frac{57.6}{0.04} = 1440\\text{ N C}^{-1}$$",
    "needs_image": True,
    "image_url": "/pyq_images/physics/ch15/exp_q23.png"
  },
  {
    "id": "phys_ch15_q24",
    "subject": "Physics",
    "chapter": "Electric Charges and Fields",
    "chapter_number": 15,
    "year": 2017,
    "question": "Three point charges of $+2q, +2q$ and $-4q$ are placed at the corners $A, B$ and $C$ of an equilateral triangle $ABC$ of side '$x$'. The magnitude of the electric dipole moment of this system is",
    "options": [
      "2√3 qx",
      "2 qx",
      "3 qx",
      "3√2 qx"
    ],
    "correct_answer": 0,
    "explanation": "![Triangle dipole vectors](/pyq_images/physics/ch15/exp_q24.png)\nResolving $-4q$ at $C$ into two $-2q$ charges forms two dipoles each of moment $p = 2qx$ inclined at $60^\\circ$:\n$$p_{\\text{net}} = \\sqrt{p^2 + p^2 + 2p^2 \\cos 60^\\circ} = \\sqrt{3p^2} = \\sqrt{3}(2qx) = 2\\sqrt{3}\\;qx$$",
    "needs_image": True,
    "image_url": "/pyq_images/physics/ch15/exp_q24.png"
  },
  {
    "id": "phys_ch15_q25",
    "subject": "Physics",
    "chapter": "Electric Charges and Fields",
    "chapter_number": 15,
    "year": 2018,
    "question": "The magnitude of point charge due to which the electric field $30\\text{ cm}$ away has the magnitude $2\\text{ N C}^{-1}$ will be",
    "options": [
      "2 × 10⁻¹¹ C",
      "3 × 10⁻¹¹ C",
      "5 × 10⁻¹¹ C",
      "9 × 10⁻¹¹ C"
    ],
    "correct_answer": 0,
    "explanation": "$$E = \\frac{1}{4\\pi\\varepsilon_0}\\frac{q}{r^2} \\implies 2 = \\frac{9 \\times 10^9 \\times q}{(0.3)^2} = 10^{11} q$$\n$$q = \\frac{2}{10^{11}} = 2 \\times 10^{-11}\\text{ C}$$",
    "needs_image": False
  },
  {
    "id": "phys_ch15_q26",
    "subject": "Physics",
    "chapter": "Electric Charges and Fields",
    "chapter_number": 15,
    "year": 2018,
    "question": "The force of repulsion between two identical positive charges when kept with a separation $r$ in air is $F$. Half the gap between the two charges is filled by a dielectric slab of dielectric constant $4$. Then the new force of repulsion between those two charges becomes",
    "options": [
      "F/3",
      "F/2",
      "F/4",
      "4F/9"
    ],
    "correct_answer": 3,
    "explanation": "Effective distance in air: $r_{\\text{eff}} = (r - t) + t\\sqrt{K} = \\left(r - \\frac{r}{2}\\right) + \\frac{r}{2}\\sqrt{4} = \\frac{r}{2} + r = \\frac{3r}{2}$.\n$$F' = \\frac{F}{(r_{\\text{eff}}/r)^2} = \\frac{F}{(3/2)^2} = \\frac{4F}{9}$$",
    "needs_image": False
  },
  {
    "id": "phys_ch15_q27",
    "subject": "Physics",
    "chapter": "Electric Charges and Fields",
    "chapter_number": 15,
    "year": 2019,
    "question": "A certain charge $2Q$ is divided at first into two parts $q_1$ and $q_2$. Later the charges are placed at a certain distance. If the force of interaction between two charges is maximum then $\\frac{Q}{q_1} =$",
    "options": [
      "1",
      "4",
      "0.5",
      "2"
    ],
    "correct_answer": 0,
    "explanation": "$q_2 = 2Q - q_1$. Force $F \\propto q_1(2Q - q_1) = 2Qq_1 - q_1^2$.\nFor maximum force, $\\frac{dF}{dq_1} = 2Q - 2q_1 = 0 \\implies q_1 = Q$.\nTherefore, $\\frac{Q}{q_1} = 1$.",
    "needs_image": False
  },
  {
    "id": "phys_ch15_q28",
    "subject": "Physics",
    "chapter": "Electric Charges and Fields",
    "chapter_number": 15,
    "year": 2019,
    "question": "An electric dipole is kept in non-uniform electric field. It generally experiences",
    "options": [
      "A torque but not a force",
      "A force and torque",
      "Neither a force nor a torque",
      "A force but not a torque."
    ],
    "correct_answer": 1,
    "explanation": "In a non-uniform electric field, the unequal forces acting on the two opposite charges do not cancel out, resulting in a net translational force in addition to a net rotational torque.",
    "needs_image": False
  },
  {
    "id": "phys_ch15_q29",
    "subject": "Physics",
    "chapter": "Electric Charges and Fields",
    "chapter_number": 15,
    "year": 2020,
    "question": "An infinitely long thin straight wire has uniform charge density of $\\frac{1}{4} \\times 10^{-2}\\text{ C m}^{-1}$. What is the magnitude of electric field at a distance $20\\text{ cm}$ from the axis of the wire?",
    "options": [
      "2.25 × 10⁸ N C⁻¹",
      "9 × 10⁸ N C⁻¹",
      "1.12 × 10⁸ N C⁻¹",
      "4.5 × 10⁸ N C⁻¹"
    ],
    "correct_answer": 0,
    "explanation": "$$E = \\frac{2k\\lambda}{r} = \\frac{2 \\times (9 \\times 10^9) \\times (0.25 \\times 10^{-2})}{0.2} = 2.25 \\times 10^8\\text{ N C}^{-1}$$",
    "needs_image": False
  },
  {
    "id": "phys_ch15_q30",
    "subject": "Physics",
    "chapter": "Electric Charges and Fields",
    "chapter_number": 15,
    "year": 2020,
    "question": "A point charge $q$ is placed at the corner of a cube of side $a$ as shown in the figure. What is the electric flux through the face $ABCD$?\n\n![Charge at cube corner](/pyq_images/physics/ch15/q30.png)",
    "options": [
      "q / 6ε₀",
      "q / 72ε₀",
      "0",
      "q / 24ε₀"
    ],
    "correct_answer": 2,
    "explanation": "![Flux through corner face](/pyq_images/physics/ch15/exp_q30.png)\nThe point charge $q$ lies at corner $A$, which belongs to the plane of face $ABCD$. The electric field lines radiate outwards from $A$ parallel to this plane, so $\\vec{E} \\perp d\\vec{A}$ and $\\cos 90^\\circ = 0$, yielding zero flux through face $ABCD$.",
    "needs_image": True,
    "image_url": "/pyq_images/physics/ch15/q30.png"
  },
  {
    "id": "phys_ch15_q31",
    "subject": "Physics",
    "chapter": "Electric Charges and Fields",
    "chapter_number": 15,
    "year": 2020,
    "question": "The electric field lines on the left have twice the separation on those on the right as shown in figure. If the magnitude of the field at $A$ is $40\\text{ V m}^{-1}$, what is the force on $20\\;\\mu\\text{C}$ charge kept at $B$?\n\n![Electric field lines](/pyq_images/physics/ch15/q31.png)",
    "options": [
      "16 × 10⁻⁴ V m⁻¹",
      "1 × 10⁻⁴ V m⁻¹",
      "4 × 10⁻⁴ V m⁻¹",
      "8 × 10⁻⁴ V m⁻¹"
    ],
    "correct_answer": 2,
    "explanation": "Line separation at $B$ is twice that at $A$, so $E_B = \\frac{E_A}{2} = \\frac{40}{2} = 20\\text{ V m}^{-1}$.\nForce on $q = 20\\;\\mu\\text{C}$:\n$$F = q E_B = (20 \\times 10^{-6}\\text{ C}) \\times (20\\text{ N C}^{-1}) = 4 \\times 10^{-4}\\text{ N}$$",
    "needs_image": True,
    "image_url": "/pyq_images/physics/ch15/q31.png"
  },
  {
    "id": "phys_ch15_q32",
    "subject": "Physics",
    "chapter": "Electric Charges and Fields",
    "chapter_number": 15,
    "year": 2020,
    "question": "When a soap bubble is charged",
    "options": [
      "the radius remains the same",
      "its radius may increase or decrease",
      "its radius increases",
      "its radius decreases."
    ],
    "correct_answer": 2,
    "explanation": "Due to mutual electrostatic repulsion between like charges uniformly distributed over its surface, an outward pressure is exerted on the bubble, causing its radius to expand/increase.",
    "needs_image": False
  },
  {
    "id": "phys_ch15_q33",
    "subject": "Physics",
    "chapter": "Electric Charges and Fields",
    "chapter_number": 15,
    "year": 2021,
    "question": "A copper rod $AB$ of length $l$ is rotated about end $A$ with a constant angular velocity $\\omega$. The electric field at a distance $x$ from the axis of rotation is",
    "options": [
      "mω²x / e",
      "mωx / el",
      "mx / ω²l",
      "me / ω²x"
    ],
    "correct_answer": 0,
    "explanation": "The centripetal force required for rotation of electrons at distance $x$ is provided by the electrostatic force:\n$$F_e = eE = m\\omega^2 x \\implies E = \\frac{m\\omega^2 x}{e}$$",
    "needs_image": False
  },
  {
    "id": "phys_ch15_q34",
    "subject": "Physics",
    "chapter": "Electric Charges and Fields",
    "chapter_number": 15,
    "year": 2021,
    "question": "Electric field due to infinite, straight uniformly charged wire varies with distance $r$ as",
    "options": [
      "r",
      "1/r",
      "1/r²",
      "r²"
    ],
    "correct_answer": 1,
    "explanation": "By Gauss's law for a line charge: $E = \\frac{\\lambda}{2\\pi\\varepsilon_0 r} \\implies E \\propto \\frac{1}{r}$.",
    "needs_image": False
  },
  {
    "id": "phys_ch15_q35",
    "subject": "Physics",
    "chapter": "Electric Charges and Fields",
    "chapter_number": 15,
    "year": 2021,
    "question": "A $2\\text{ gram}$ object, located in a region of uniform electric field $\\vec{E} = (300\\text{ N C}^{-1})\\hat{i}$ carries a charge $Q$. The object released from rest at $x = 0$, has a kinetic energy of $0.12\\text{ J}$ at $x = 0.5\\text{ m}$. Then $Q$ is",
    "options": [
      "400 µC",
      "-400 µC",
      "800 µC",
      "-800 µC"
    ],
    "correct_answer": 2,
    "explanation": "Work done: $W = F \\cdot s = Q E s = \\Delta K = 0.12\\text{ J}$.\n$$Q \\times 300 \\times 0.5 = 0.12 \\implies 150 Q = 0.12 \\implies Q = 8 \\times 10^{-4}\\text{ C} = 800\\;\\mu\\text{C}$$",
    "needs_image": False
  },
  {
    "id": "phys_ch15_q36",
    "subject": "Physics",
    "chapter": "Electric Charges and Fields",
    "chapter_number": 15,
    "year": 2021,
    "question": "Which of the statements is false in the case of polar molecules?",
    "options": [
      "Centers of positive and negative charges are separated in the absence of external electric field.",
      "Centers of positive and negative charges are separated in the presence of external electric field.",
      "Do not possess permanent dipole moments.",
      "Ionic molecule HCl is the example of polar molecule."
    ],
    "correct_answer": 2,
    "explanation": "Polar molecules possess permanent electric dipole moments even in the absence of an external field because the centers of positive and negative charges do not coincide. Hence, stating that they do not possess permanent dipole moments is false.",
    "needs_image": False
  },
  {
    "id": "phys_ch15_q37",
    "subject": "Physics",
    "chapter": "Electric Charges and Fields",
    "chapter_number": 15,
    "year": 2022,
    "question": "A charged particle of mass '$m$' and charge '$q$' is released from rest in an uniform electric field $\\vec{E}$. Neglecting the effect of gravity, the kinetic energy of the charged particle after '$t$' second is",
    "options": [
      "Eqm / t",
      "2E²t² / mq",
      "E²q²t² / 2m",
      "Eq²m / 2t²"
    ],
    "correct_answer": 2,
    "explanation": "Velocity after time $t$: $v = at = \\frac{qEt}{m}$.\nKinetic energy:\n$$K = \\frac{1}{2}mv^2 = \\frac{1}{2}m\\left(\\frac{qEt}{m}\\right)^2 = \\frac{E^2 q^2 t^2}{2m}$$",
    "needs_image": False
  },
  {
    "id": "phys_ch15_q38",
    "subject": "Physics",
    "chapter": "Electric Charges and Fields",
    "chapter_number": 15,
    "year": 2022,
    "question": "Four charges $+q, +2q, +q$ and $-2q$ are placed at the corners of a square $ABCD$ respectively. The force on a unit positive charge kept at the centre $O$ is",
    "options": [
      "along the diagonal AC",
      "zero",
      "perpendicular to AD",
      "along the diagonal BD"
    ],
    "correct_answer": 3,
    "explanation": "![Square diagonal forces](/pyq_images/physics/ch15/exp_q38.png)\nCharges at $A$ and $C$ ($+q$) exert equal and opposite forces on the unit charge at $O$, cancelling out.\nCharges at $B$ ($+2q$) and $D$ ($-2q$) both exert forces towards $D$, so the net resultant force acts along the diagonal $BD$.",
    "needs_image": True,
    "image_url": "/pyq_images/physics/ch15/exp_q38.png"
  },
  {
    "id": "phys_ch15_q39",
    "subject": "Physics",
    "chapter": "Electric Charges and Fields",
    "chapter_number": 15,
    "year": 2022,
    "question": "An electric dipole with dipole moment $4 \\times 10^{-9}\\text{ C m}$ is aligned at $30^\\circ$ with the direction of a uniform electric field of magnitude $5 \\times 10^4\\text{ N C}^{-1}$, the magnitude of the torque acting on the dipole is",
    "options": [
      "10⁻⁵ N m",
      "10⁻⁴ N m",
      "10 × 10⁻³ N m",
      "√3 × 10⁻⁴ N m"
    ],
    "correct_answer": 1,
    "explanation": "$$\\tau = pE\\sin\\theta = (4 \\times 10^{-9}) \\times (5 \\times 10^4) \\times \\sin 30^\\circ = 20 \\times 10^{-5} \\times 0.5 = 10^{-4}\\text{ N m}$$",
    "needs_image": False
  },
  {
    "id": "phys_ch15_q40",
    "subject": "Physics",
    "chapter": "Electric Charges and Fields",
    "chapter_number": 15,
    "year": 2022,
    "question": "A tiny spherical oil drop carrying a net charge $q$ is balanced in still air, with a vertical uniform electric field of strength $\\frac{81}{7}\\pi \\times 10^5\\text{ V/m}$. When the field is switched off, the drop is observed to fall with terminal velocity $2 \\times 10^{-3}\\text{ m s}^{-1}$. Here $g = 9.8\\text{ m/s}^2$. Viscosity of air is $1.8 \\times 10^{-5}\\text{ Ns/m}^2$ and the density of oil is $900\\text{ kg m}^{-3}$. The magnitude of '$q$' is",
    "options": [
      "1.6 × 10⁻¹⁹ C",
      "0.8 × 10⁻¹⁹ C",
      "3.2 × 10⁻¹⁹ C",
      "8 × 10⁻¹⁹ C"
    ],
    "correct_answer": 3,
    "explanation": "$$qE = mg = \\frac{4}{3}\\pi r^3 \\rho g \\implies q = \\frac{4\\pi r^3 \\rho g}{3E}$$\nUsing Stokes' law for terminal velocity: $r = \\sqrt{\\frac{9\\eta v}{2\\rho g}} = \\sqrt{\\frac{9 \\times 1.8 \\times 10^{-5} \\times 2 \\times 10^{-3}}{2 \\times 900 \\times 9.8}} \\approx 4.286 \\times 10^{-6}\\text{ m}$.\nSubstituting $r$ into the charge equation gives $q = 8 \\times 10^{-19}\\text{ C}$.",
    "needs_image": False
  },
  {
    "id": "phys_ch15_q41",
    "subject": "Physics",
    "chapter": "Electric Charges and Fields",
    "chapter_number": 15,
    "year": 2023,
    "question": "A positively charged glass rod is brought near uncharged metal sphere, which is mounted on an insulated stand. If the glass rod is removed, the net charge on the metal sphere is",
    "options": [
      "negative charge",
      "zero",
      "1.6 × 10⁻¹⁹ C",
      "positive charge"
    ],
    "correct_answer": 1,
    "explanation": "The charged rod merely polarizes the sphere. Since no charge was transferred or grounded, removing the rod allows the induced opposite charges to recombine and neutralize, leaving net zero charge.",
    "needs_image": False
  },
  {
    "id": "phys_ch15_q42",
    "subject": "Physics",
    "chapter": "Electric Charges and Fields",
    "chapter_number": 15,
    "year": 2023,
    "question": "In the situation shown in the diagram, magnitude of $q \\ll |Q|$ and $r \\gg a$.\n\n![Dipole and free charge](/pyq_images/physics/ch15/q42.png)\n\nThe net force on the free charge $-q$ and net torque on it about $O$ at the instant shown are respectively [$p = 2aQ$ is the dipole moment]",
    "options": [
      "1/(4πε₀) (pq/r³) î, -1/(4πε₀) (pq/r²) k̂",
      "1/(4πε₀) (pq/r²) k̂, 1/(4πε₀) (pq/r³) î",
      "-1/(4πε₀) (pq/r²) k̂, -1/(4πε₀) (pq/r³) î",
      "1/(4πε₀) (pq/r³) î, +1/(4πε₀) (pq/r²) k̂"
    ],
    "correct_answer": 0,
    "explanation": "Dipole moment $\\vec{p} = (2aQ)\\hat{i}$. Electric field at equatorial point $P(0, r, 0)$ is $\\vec{E} = -\\frac{1}{4\\pi\\varepsilon_0}\\frac{p}{r^3}\\hat{i}$.\nForce on $-q$: $\\vec{F} = (-q)\\vec{E} = \\frac{1}{4\\pi\\varepsilon_0}\\frac{pq}{r^3}\\hat{i}$.\nTorque about $O$: $\\vec{\\tau} = \\vec{r} \\times \\vec{F} = (r\\hat{j}) \\times \\left(\\frac{1}{4\\pi\\varepsilon_0}\\frac{pq}{r^3}\\hat{i}\\right) = -\\frac{1}{4\\pi\\varepsilon_0}\\frac{pq}{r^2}\\hat{k}$.",
    "needs_image": True,
    "image_url": "/pyq_images/physics/ch15/q42.png"
  },
  {
    "id": "phys_ch15_q43",
    "subject": "Physics",
    "chapter": "Electric Charges and Fields",
    "chapter_number": 15,
    "year": 2023,
    "question": "A cubical Gaussian surface has side of length $a = 10\\text{ cm}$. Electric field lines are parallel to $x$-axis as shown. The magnitudes of electric fields through surfaces $ABCD$ and $EFGH$ are $6\\text{ kN C}^{-1}$ and $9\\text{ kN C}^{-1}$ respectively. Then, the total charge enclosed by the cube is [Take $\\varepsilon_0 = 9 \\times 10^{-12}\\text{ F m}^{-1}$]\n\n![Cubical Gaussian surface](/pyq_images/physics/ch15/q43.png)",
    "options": [
      "-0.27 nC",
      "1.35 nC",
      "-1.35 nC",
      "0.27 nC"
    ],
    "correct_answer": 3,
    "explanation": "Area $A = (0.1)^2 = 10^{-2}\\text{ m}^2$.\n$\\Phi_{\\text{in}} = 6000 \\times 10^{-2} = 60\\text{ V m}$, $\\Phi_{\\text{out}} = 9000 \\times 10^{-2} = 90\\text{ V m}$.\n$\\Phi_{\\text{net}} = 90 - 60 = 30\\text{ V m}$.\n$$q = \\varepsilon_0 \\Phi_{\\text{net}} = (9 \\times 10^{-12}) \\times 30 = 2.7 \\times 10^{-10}\\text{ C} = 0.27\\text{ nC}$$",
    "needs_image": True,
    "image_url": "/pyq_images/physics/ch15/q43.png"
  },
  {
    "id": "phys_ch15_q44",
    "subject": "Physics",
    "chapter": "Electric Charges and Fields",
    "chapter_number": 15,
    "year": 2023,
    "question": "Electric field at a distance $r$ from an infinitely long uniformly charged straight conductor, having linear charge density $\\lambda$ is $E_1$. Another uniformly charged conductor having same linear charge density $\\lambda$ is bent into a semicircle of radius $r$. The electric field at its centre is $E_2$. Then",
    "options": [
      "E₂ = πrE₁",
      "E₂ = E₁/r",
      "E₁ = E₂",
      "E₁ = πrE₂"
    ],
    "correct_answer": 2,
    "explanation": "Infinitely long straight wire: $E_1 = \\frac{\\lambda}{2\\pi\\varepsilon_0 r}$.\nAt centre of semicircular ring: $E_2 = \\frac{2k\\lambda}{r} = \\frac{\\lambda}{2\\pi\\varepsilon_0 r}$.\nHence, $E_1 = E_2$.",
    "needs_image": False
  },
  {
    "id": "phys_ch15_q45",
    "subject": "Physics",
    "chapter": "Electric Charges and Fields",
    "chapter_number": 15,
    "year": 2024,
    "question": "A body has a charge of $-3.2\\;\\mu\\text{C}$. The number of excess electrons it has is",
    "options": [
      "5.12 × 10²⁵",
      "5 × 10¹²",
      "2 × 10¹³",
      "5.12 × 10¹³"
    ],
    "correct_answer": 2,
    "explanation": "$$n = \\frac{q}{e} = \\frac{3.2 \\times 10^{-6}\\text{ C}}{1.6 \\times 10^{-19}\\text{ C}} = 2 \\times 10^{13}$$",
    "needs_image": False
  },
  {
    "id": "phys_ch15_q46",
    "subject": "Physics",
    "chapter": "Electric Charges and Fields",
    "chapter_number": 15,
    "year": 2024,
    "question": "A point charge $A$ of $+10\\;\\mu\\text{C}$ and another point charge $B$ of $+20\\;\\mu\\text{C}$ are kept $1\\text{ m}$ apart in free space. The electrostatic force on $A$ due to $B$ is $\\vec{F}_1$ and the electrostatic force on $B$ due to $A$ is $\\vec{F}_2$. Then",
    "options": [
      "F⃗₁ = -2F⃗₂",
      "F⃗₁ = -F⃗₂",
      "2F⃗₁ = -F⃗₂",
      "F⃗₁ = F⃗₂"
    ],
    "correct_answer": 1,
    "explanation": "Electrostatic forces obey Newton's third law (action and reaction are equal and opposite):\n$$\\vec{F}_1 = -\\vec{F}_2$$",
    "needs_image": False
  },
  {
    "id": "phys_ch15_q47",
    "subject": "Physics",
    "chapter": "Electric Charges and Fields",
    "chapter_number": 15,
    "year": 2024,
    "question": "A uniform electric field $E = 3 \\times 10^5\\text{ N C}^{-1}$ is acting along the positive $Y$-axis. The electric flux through a rectangle of area $10\\text{ cm} \\times 30\\text{ cm}$ whose plane is parallel to the $Z-X$ plane is :",
    "options": [
      "12 × 10³ V m",
      "9 × 10³ V m",
      "15 × 10³ V m",
      "18 × 10³ V m"
    ],
    "correct_answer": 1,
    "explanation": "Plane is parallel to $Z-X$ plane, so area vector is along $\\hat{j}$:\n$$\\vec{A} = (0.10\\text{ m} \\times 0.30\\text{ m})\\hat{j} = 3 \\times 10^{-2}\\hat{j}\\text{ m}^2$$\n$$\\Phi = \\vec{E} \\cdot \\vec{A} = (3 \\times 10^5\\hat{j}) \\cdot (3 \\times 10^{-2}\\hat{j}) = 9 \\times 10^3\\text{ V m}$$",
    "needs_image": False
  },
  {
    "id": "phys_ch15_q48",
    "subject": "Physics",
    "chapter": "Electric Charges and Fields",
    "chapter_number": 15,
    "year": 2024,
    "question": "The total electric flux through a closed spherical surface of radius '$r$' enclosing an electric dipole of dipole moment $2aq$ is (Given, $\\varepsilon_0 =$ permittivity of free space)",
    "options": [
      "zero",
      "q / ε₀",
      "2q / ε₀",
      "8πr²q / ε₀"
    ],
    "correct_answer": 0,
    "explanation": "Net charge enclosed by the surface is $q_{\\text{enclosed}} = +q + (-q) = 0$. By Gauss's law, total electric flux is zero.",
    "needs_image": False
  }
]

with open('src/data/pyq_physics_ch15.json', 'w', encoding='utf-8') as f:
    json.dump(questions, f, indent=2, ensure_ascii=False)

print(f"Successfully generated pyq_physics_ch15.json with {len(questions)} questions.")
