import json, os

questions = [
  {
    "id": "phys_ch19_q1",
    "subject": "Physics",
    "year": 2014,
    "question": "A susceptibility of a certain magnetic material is $400$. What is the class of the magnetic material?",
    "options": [
      "Ferromagnetic",
      "Diamagnetic",
      "Ferroelectric",
      "Paramagnetic"
    ],
    "explanation": "Magnetic susceptibility ($\\chi_m$) values for different classes of magnetic materials:\n- Diamagnetic: Small and negative ($-1 \\le \\chi_m < 0$)\n- Paramagnetic: Small and positive ($0 < \\chi_m < \\epsilon$)\n- Ferromagnetic: Very large and positive ($\\chi_m \\gg 1$, typically $\\chi_m > 100$)\n\nSince $\\chi_m = 400$ is large and positive, the material is ferromagnetic.",
    "chapter": "Magnetism and Matter",
    "chapter_number": 19,
    "correct_answer": 0,
    "needs_image": False
  },
  {
    "id": "phys_ch19_q2",
    "subject": "Physics",
    "year": 2015,
    "question": "If there is no torsion in the suspension thread, then the time period of a magnet of magnetic moment $M$ and moment of inertia $I$ executing angular SHM in a uniform magnetic field $B$ is:",
    "options": [
      "$T = \\frac{1}{2\\pi}\\sqrt{\\frac{I}{M B}}$",
      "$T = 2\\pi\\sqrt{\\frac{M B}{I}}$",
      "$T = \\frac{1}{2\\pi}\\sqrt{\\frac{M B}{I}}$",
      "$T = 2\\pi\\sqrt{\\frac{I}{M B}}$"
    ],
    "explanation": "The restoring torque acting on a magnetic dipole of magnetic moment $M$ displaced by an angle $\\theta$ from a uniform magnetic field $B$ is:\n$$\\tau = -M B \\sin\\theta \\approx -M B \\theta$$\nUsing $\\tau = I \\alpha = I \\frac{d^2\\theta}{dt^2}$:\n$$I \\frac{d^2\\theta}{dt^2} + M B \\theta = 0 \\implies \\frac{d^2\\theta}{dt^2} + \\left(\\frac{M B}{I}\\right)\\theta = 0$$\nThe angular frequency is $\\omega = \\sqrt{\\frac{M B}{I}}$, and the time period is:\n$$T = \\frac{2\\pi}{\\omega} = 2\\pi\\sqrt{\\frac{I}{M B}}$$",
    "chapter": "Magnetism and Matter",
    "chapter_number": 19,
    "correct_answer": 3,
    "needs_image": False
  },
  {
    "id": "phys_ch19_q3",
    "subject": "Physics",
    "year": 2017,
    "question": "The magnetic susceptibility $\\chi_m$ of a ferromagnetic substance is:",
    "options": [
      "$> 1$",
      "Zero",
      "$\\gg 1$",
      "$< 1$"
    ],
    "explanation": "For ferromagnetic substances, the magnetic dipole moments align strongly in the direction of the external magnetic field due to exchange coupling between domains, resulting in a very large and positive susceptibility ($\\chi_m \\gg 1$).",
    "chapter": "Magnetism and Matter",
    "chapter_number": 19,
    "correct_answer": 2,
    "needs_image": False
  },
  {
    "id": "phys_ch19_q4",
    "subject": "Physics",
    "year": 2017,
    "question": "A magnetic dipole of magnetic moment $6 \\times 10^{-2}\\text{ A m}^2$ and moment of inertia $12 \\times 10^{-6}\\text{ kg m}^2$ performs oscillations in a uniform magnetic field of $2 \\times 10^{-2}\\text{ T}$. The time taken by the dipole to complete $20$ oscillations is (take $\\pi \\approx 3$):",
    "options": [
      "$6\\text{ s}$",
      "$12\\text{ s}$",
      "$36\\text{ s}$",
      "$18\\text{ s}$"
    ],
    "explanation": "The time period of oscillation of a magnetic dipole in a magnetic field is:\n$$T = 2\\pi \\sqrt{\\frac{I}{M B}}$$\nGiven:\n- $I = 12 \\times 10^{-6}\\text{ kg m}^2$\n- $M = 6 \\times 10^{-2}\\text{ A m}^2$\n- $B = 2 \\times 10^{-2}\\text{ T}$\n- $\\pi \\approx 3.14 \\approx 3$\n\n$$T = 2(3.14) \\sqrt{\\frac{12 \\times 10^{-6}}{(6 \\times 10^{-2})(2 \\times 10^{-2})}} = 2(3.14) \\sqrt{\\frac{12 \\times 10^{-6}}{12 \\times 10^{-4}}} = 2(3.14) \\sqrt{10^{-2}} = 2(3.14)(0.1) = 0.628\\text{ s} \\approx 0.6\\text{ s}$$\nTime taken for $20$ oscillations:\n$$t = 20 \\times T = 20 \\times 0.6\\text{ s} = 12\\text{ s}$$",
    "chapter": "Magnetism and Matter",
    "chapter_number": 19,
    "correct_answer": 1,
    "needs_image": False
  },
  {
    "id": "phys_ch19_q5",
    "subject": "Physics",
    "year": 2017,
    "question": "Which of the following statements is correct for a bar magnet?",
    "options": [
      "A freely suspended bar magnet always aligns in the North-South direction",
      "Magnetic field lines inside a bar magnet do not exist",
      "Isolated magnetic poles (monopoles) exist in nature",
      "Magnetic field lines are discontinuous curves"
    ],
    "explanation": "A freely suspended bar magnet experiences a restoring torque in the Earth's magnetic field until its magnetic dipole moment aligns with the horizontal component of the Earth's magnetic field, pointing along the geographic North-South direction. Furthermore, magnetic field lines always form continuous closed loops and isolated magnetic monopoles do not exist.",
    "chapter": "Magnetism and Matter",
    "chapter_number": 19,
    "correct_answer": 0,
    "needs_image": False
  },
  {
    "id": "phys_ch19_q6",
    "subject": "Physics",
    "year": 2018,
    "question": "Three needles $N_1, N_2,$ and $N_3$ are made of a ferromagnetic, a paramagnetic, and a diamagnetic substance respectively. A magnet when brought close to them will:",
    "options": [
      "Attract all three of them",
      "Attract $N_1$ strongly, $N_2$ weakly and repel $N_3$ weakly",
      "Attract $N_1$ strongly but repel $N_2$ and $N_3$ weakly",
      "Attract $N_1$ and $N_2$ strongly but repel $N_3$"
    ],
    "explanation": "When exposed to a non-uniform magnetic field:\n- Ferromagnetic substances ($N_1$) are attracted strongly towards regions of stronger magnetic field.\n- Paramagnetic substances ($N_2$) are attracted weakly towards regions of stronger magnetic field.\n- Diamagnetic substances ($N_3$) are repelled weakly away from regions of stronger magnetic field.\n\nTherefore, the magnet attracts $N_1$ strongly, attracts $N_2$ weakly, and repels $N_3$ weakly.",
    "chapter": "Magnetism and Matter",
    "chapter_number": 19,
    "correct_answer": 1,
    "needs_image": False
  },
  {
    "id": "phys_ch19_q7",
    "subject": "Physics",
    "year": 2020,
    "question": "The ratio of magnetic field at the centre of a current carrying circular coil to its magnetic moment is $x$. If the current and the radius both are doubled, the new ratio will become:",
    "options": [
      "$\\frac{x}{4}$",
      "$\\frac{x}{8}$",
      "$2x$",
      "$4x$"
    ],
    "explanation": "The magnetic field at the centre of a circular coil carrying current $I$ and radius $r$ is:\n$$B = \\frac{\\mu_0 I}{2r}$$\nThe magnetic dipole moment is:\n$$M = I A = I (\\pi r^2)$$\nThe ratio of $B$ to $M$ is:\n$$\\frac{B}{M} = \\frac{\\mu_0 I / 2r}{I \\pi r^2} = \\frac{\\mu_0}{2\\pi r^3} = x$$\nNotice that the ratio $\\frac{B}{M}$ is independent of current $I$ and inversely proportional to $r^3$:\n$$\\frac{B}{M} \\propto \\frac{1}{r^3}$$\nWhen both current and radius are doubled ($r' = 2r$):\n$$\\left(\\frac{B}{M}\\right)' = \\frac{\\mu_0}{2\\pi (2r)^3} = \\frac{1}{8}\\left(\\frac{\\mu_0}{2\\pi r^3}\\right) = \\frac{x}{8}$$",
    "chapter": "Magnetism and Matter",
    "chapter_number": 19,
    "correct_answer": 1,
    "needs_image": False
  }
]

out_path = 'src/data/pyq_physics_ch19.json'
with open(out_path, 'w', encoding='utf-8') as f:
    json.dump(questions, f, ensure_ascii=False, indent=2)

print(f'Successfully wrote {len(questions)} questions to {out_path}')
