import json

questions = [
  {
    "id": "phys_ch13_q1",
    "subject": "Physics",
    "chapter": "Oscillations",
    "chapter_number": 13,
    "year": 2010,
    "question": "Two simple harmonic motions are represented by $y_1 = 5[\\sin 2\\pi t + \\sqrt{3}\\cos 2\\pi t]$ and $y_2 = 5\\sin\\left(2\\pi t + \\frac{\\pi}{4}\\right)$. The ratio of their amplitudes is",
    "options": [
      "1 : 1",
      "2 : 1",
      "1 : 3",
      "$\\sqrt{3} : 1$"
    ],
    "correct_answer": 1,
    "explanation": "For the first SHM:\n$$y_1 = 5[\\sin 2\\pi t + \\sqrt{3}\\cos 2\\pi t] = 10\\left[\\frac{1}{2}\\sin 2\\pi t + \\frac{\\sqrt{3}}{2}\\cos 2\\pi t\\right] = 10\\sin\\left(2\\pi t + \\frac{\\pi}{3}\\right)$$\nAmplitude $A_1 = 10$.\nFor the second SHM:\n$$y_2 = 5\\sin\\left(2\\pi t + \\frac{\\pi}{4}\\right)$$\nAmplitude $A_2 = 5$.\nRatio of amplitudes:\n$$\\frac{A_1}{A_2} = \\frac{10}{5} = \\frac{2}{1} = 2 : 1$$",
    "needs_image": False
  },
  {
    "id": "phys_ch13_q2",
    "subject": "Physics",
    "chapter": "Oscillations",
    "chapter_number": 13,
    "year": 2011,
    "question": "A particle executing a simple harmonic motion has a period of 6 sec. The time taken by the particle to move from the mean position to half the amplitude, starting from the mean position is",
    "options": [
      "$\\frac{3}{2}\\text{ sec}$",
      "$\\frac{1}{2}\\text{ sec}$",
      "$\\frac{3}{4}\\text{ sec}$",
      "$\\frac{1}{4}\\text{ sec}$"
    ],
    "correct_answer": 1,
    "explanation": "Starting from the mean position, the displacement is given by:\n$$x = A\\sin(\\omega t)$$\nWhen $x = \\frac{A}{2}$:\n$$\\frac{A}{2} = A\\sin(\\omega t) \\implies \\sin(\\omega t) = \\frac{1}{2} = \\sin\\left(\\frac{\\pi}{6}\\right)$$\n$$\\omega t = \\frac{\\pi}{6} \\implies \\frac{2\\pi}{T} t = \\frac{\\pi}{6} \\implies t = \\frac{T}{12}$$\nGiven $T = 6\\text{ s}$:\n$$t = \\frac{6}{12} = \\frac{1}{2}\\text{ sec}$$",
    "needs_image": False
  },
  {
    "id": "phys_ch13_q3",
    "subject": "Physics",
    "chapter": "Oscillations",
    "chapter_number": 13,
    "year": 2012,
    "question": "The circular motion of a particle with constant speed is",
    "options": [
      "periodic but not SHM",
      "SHM but not periodic",
      "periodic and also SHM",
      "neither periodic nor SHM."
    ],
    "correct_answer": 0,
    "explanation": "In uniform circular motion with constant speed, the particle repeats its path at regular time intervals, so the motion is periodic. However, it does not move to-and-fro along a straight line under a linear restoring force directed toward a central point; thus it is not simple harmonic motion (SHM).",
    "needs_image": False
  },
  {
    "id": "phys_ch13_q4",
    "subject": "Physics",
    "chapter": "Oscillations",
    "chapter_number": 13,
    "year": 2012,
    "question": "A particle executes SHM with amplitude 0.2 m and time period 24 s. The time required for it to move from the mean position to a point 0.1 m from the mean position is",
    "options": [
      "2 s",
      "3 s",
      "8 s",
      "12 s"
    ],
    "correct_answer": 0,
    "explanation": "For SHM starting from the mean position:\n$$x = A\\sin(\\omega t)$$\nGiven $A = 0.2\\text{ m}$ and $x = 0.1\\text{ m}$:\n$$0.1 = 0.2\\sin(\\omega t) \\implies \\sin(\\omega t) = \\frac{1}{2} \\implies \\omega t = \\frac{\\pi}{6}$$\n$$t = \\frac{\\pi}{6\\omega} = \\frac{\\pi}{6} \\cdot \\frac{T}{2\\pi} = \\frac{T}{12}$$\nWith $T = 24\\text{ s}$:\n$$t = \\frac{24}{12} = 2\\text{ s}$$",
    "needs_image": False
  },
  {
    "id": "phys_ch13_q5",
    "subject": "Physics",
    "chapter": "Oscillations",
    "chapter_number": 13,
    "year": 2014,
    "question": "A 10 kg metal block is attached to a spring of spring constant $1000\\text{ N m}^{-1}$. A block is displaced from equilibrium position by 10 cm and released. The maximum acceleration of the block is",
    "options": [
      "$200\\text{ m s}^{-2}$",
      "$10\\text{ m s}^{-2}$",
      "$0.1\\text{ m s}^{-2}$",
      "$100\\text{ m s}^{-2}$"
    ],
    "correct_answer": 1,
    "explanation": "Here, amplitude $A = 10\\text{ cm} = 0.1\\text{ m}$, spring constant $k = 1000\\text{ N m}^{-1}$, mass $m = 10\\text{ kg}$.\nMaximum acceleration in SHM is:\n$$a_{\\max} = \\omega^2 A = \\frac{k}{m} A = \\frac{1000}{10} \\times 0.1 = 10\\text{ m s}^{-2}$$",
    "needs_image": False
  },
  {
    "id": "phys_ch13_q6",
    "subject": "Physics",
    "chapter": "Oscillations",
    "chapter_number": 13,
    "year": 2015,
    "question": "The ratio of kinetic energy to the potential energy of a particle executing SHM at a distance equal to half its amplitude, the distance being measured from its equilibrium position is",
    "options": [
      "4 : 1",
      "8 : 1",
      "3 : 1",
      "2 : 1"
    ],
    "correct_answer": 2,
    "explanation": "Kinetic energy: $K = \\frac{1}{2}m\\omega^2(A^2 - x^2)$.\nPotential energy: $U = \\frac{1}{2}m\\omega^2 x^2$.\nAt $x = \\frac{A}{2}$:\n$$K = \\frac{1}{2}m\\omega^2\\left(A^2 - \\frac{A^2}{4}\\right) = \\frac{1}{2}m\\omega^2\\left(\\frac{3A^2}{4}\\right)$$\n$$U = \\frac{1}{2}m\\omega^2\\left(\\frac{A^2}{4}\\right)$$\nRatio:\n$$\\frac{K}{U} = \\frac{3A^2 / 4}{A^2 / 4} = 3 : 1$$",
    "needs_image": False
  },
  {
    "id": "phys_ch13_q7",
    "subject": "Physics",
    "chapter": "Oscillations",
    "chapter_number": 13,
    "year": 2016,
    "question": "A particle executing SHM has maximum speed of $0.5\\text{ m s}^{-1}$ and maximum acceleration of $1.0\\text{ m s}^{-2}$. The angular frequency of oscillation is",
    "options": [
      "$2\\text{ rad s}^{-1}$",
      "$0.5\\text{ rad s}^{-1}$",
      "$2\\pi\\text{ rad s}^{-1}$",
      "$0.5\\pi\\text{ rad s}^{-1}$"
    ],
    "correct_answer": 0,
    "explanation": "Maximum velocity: $v_{\\max} = A\\omega = 0.5\\text{ m s}^{-1}$.\nMaximum acceleration: $a_{\\max} = A\\omega^2 = 1.0\\text{ m s}^{-2}$.\nAngular frequency:\n$$\\omega = \\frac{a_{\\max}}{v_{\\max}} = \\frac{1.0}{0.5} = 2\\text{ rad s}^{-1}$$",
    "needs_image": False
  },
  {
    "id": "phys_ch13_q8",
    "subject": "Physics",
    "chapter": "Oscillations",
    "chapter_number": 13,
    "year": 2017,
    "question": "Two simple pendulums A and B are made to oscillate simultaneously and it is found that A completes 10 oscillations in 20 s and B completes 8 oscillations in 10 s. The ratio of the lengths of A and B is",
    "options": [
      "5/4",
      "8/5",
      "25/64",
      "64/25"
    ],
    "correct_answer": 3,
    "explanation": "Frequency of pendulum A: $\\nu_A = \\frac{10}{20} = 0.5\\text{ Hz}$.\nFrequency of pendulum B: $\\nu_B = \\frac{8}{10} = 0.8\\text{ Hz}$.\nFor a simple pendulum:\n$$\\nu = \\frac{1}{2\\pi}\\sqrt{\\frac{g}{l}} \\implies \\nu \\propto \\frac{1}{\\sqrt{l}}$$\n$$\\frac{\\nu_A}{\\nu_B} = \\sqrt{\\frac{l_B}{l_A}} \\implies \\frac{0.5}{0.8} = \\frac{5}{8} = \\sqrt{\\frac{l_B}{l_A}}$$\nSquaring both sides:\n$$\\frac{l_B}{l_A} = \\frac{25}{64} \\implies \\frac{l_A}{l_B} = \\frac{64}{25}$$",
    "needs_image": False
  },
  {
    "id": "phys_ch13_q9",
    "subject": "Physics",
    "chapter": "Oscillations",
    "chapter_number": 13,
    "year": 2019,
    "question": "A piston is performing S.H.M. in the vertical direction with a frequency of 0.5 Hz. A block of 10 kg is placed on the piston. The maximum amplitude of the system such that the block remains in contact with the piston is",
    "options": [
      "1.5 m",
      "1 m",
      "0.1 m",
      "0.5 m"
    ],
    "correct_answer": 1,
    "explanation": "The block remains in contact with the piston as long as the maximum downward acceleration does not exceed $g$:\n$$a_{\\max} = \\omega^2 A \\le g$$\nWith $\\omega = 2\\pi f = 2\\pi(0.5) = \\pi\\text{ rad s}^{-1}$:\n$$A_{\\max} = \\frac{g}{\\omega^2} = \\frac{g}{\\pi^2} \\approx \\frac{9.87}{\\pi^2} \\approx 1\\text{ m}$$",
    "needs_image": False
  },
  {
    "id": "phys_ch13_q10",
    "subject": "Physics",
    "chapter": "Oscillations",
    "chapter_number": 13,
    "year": 2020,
    "question": "A tray of mass 12 kg is supported by two identical springs as shown in figure. When the tray is pressed down slightly and then released, it executes SHM with a time period of 1.5 s. The spring constant of each spring is\n\n![Tray supported by springs](/pyq_images/physics/ch13/q10.png)",
    "options": [
      "$105\\text{ N m}^{-1}$",
      "$\\infty$",
      "$50\\text{ N m}^{-1}$",
      "0"
    ],
    "correct_answer": 0,
    "explanation": "Both identical springs are connected in parallel, so the effective spring constant is:\n$$K_{\\text{eff}} = k + k = 2k$$\nTime period of oscillation:\n$$T = 2\\pi\\sqrt{\\frac{m}{K_{\\text{eff}}}} = 2\\pi\\sqrt{\\frac{12}{2k}} = 2\\pi\\sqrt{\\frac{6}{k}}$$\nGiven $T = 1.5\\text{ s}$:\n$$1.5 = 2\\pi\\sqrt{\\frac{6}{k}} \\implies \\frac{1.5}{2\\pi} = \\sqrt{\\frac{6}{k}}$$\n$$k = \\frac{6 \\times 4\\pi^2}{(1.5)^2} = \\frac{24 \\times 9.87}{2.25} \\approx 105.16\\text{ N m}^{-1}$$",
    "needs_image": True,
    "image_url": "/pyq_images/physics/ch13/q10.png"
  },
  {
    "id": "phys_ch13_q11",
    "subject": "Physics",
    "chapter": "Oscillations",
    "chapter_number": 13,
    "year": 2021,
    "question": "A pendulum oscillates simple harmonically if and only if\n(i) the size of the bob of pendulum is negligible in comparison with the length of the pendulum.\n(ii) the angular amplitude is less than $10^\\circ$.",
    "options": [
      "Both (i) and (ii) are correct.",
      "Both (i) and (ii) are incorrect.",
      "Only (i) is correct.",
      "Only (ii) is correct."
    ],
    "correct_answer": 0,
    "explanation": "For a simple pendulum to execute simple harmonic motion:\n1. The bob must approximate a point mass, meaning its size is negligible relative to the string length.\n2. The angular displacement must be small ($\\theta < 10^\\circ$) so that the restoring force is strictly proportional to displacement ($\\sin\\theta \\approx \\theta$).\nHence, both statements (i) and (ii) are correct.",
    "needs_image": False
  },
  {
    "id": "phys_ch13_q12",
    "subject": "Physics",
    "chapter": "Oscillations",
    "chapter_number": 13,
    "year": 2022,
    "question": "The displacement of a particle executing SHM is given by $x = 3\\sin\\left(2\\pi t + \\frac{\\pi}{4}\\right)$ where '$x$' is in metres and '$t$' is in seconds. The amplitude and maximum speed of the particle is",
    "options": [
      "$3\\text{ m}, 6\\pi\\text{ m s}^{-1}$",
      "$3\\text{ m}, 2\\pi\\text{ m s}^{-1}$",
      "$3\\text{ m}, 8\\pi\\text{ m s}^{-1}$",
      "$3\\text{ m}, 4\\pi\\text{ m s}^{-1}$"
    ],
    "correct_answer": 0,
    "explanation": "Comparing $x = 3\\sin\\left(2\\pi t + \\frac{\\pi}{4}\\right)$ with standard SHM equation $x = A\\sin(\\omega t + \\phi)$:\n- Amplitude $A = 3\\text{ m}$\n- Angular frequency $\\omega = 2\\pi\\text{ rad s}^{-1}$\nMaximum speed:\n$$v_{\\max} = A\\omega = 3 \\times 2\\pi = 6\\pi\\text{ m s}^{-1}$$",
    "needs_image": False
  },
  {
    "id": "phys_ch13_q13",
    "subject": "Physics",
    "chapter": "Oscillations",
    "chapter_number": 13,
    "year": 2024,
    "question": "For a particle executing simple harmonic motion (SHM), at its mean position",
    "options": [
      "velocity is zero and acceleration is maximum",
      "velocity is maximum and acceleration is zero",
      "both velocity and acceleration are maximum",
      "both velocity and acceleration are zero."
    ],
    "correct_answer": 1,
    "explanation": "At the mean position ($x = 0$):\n- Restoring force $F = -kx = 0$, hence acceleration $a = 0$.\n- Potential energy is zero and kinetic energy is maximum, hence velocity $v = A\\omega$ is maximum.",
    "needs_image": False
  }
]

with open('src/data/pyq_physics_ch13.json', 'w', encoding='utf-8') as f:
    json.dump(questions, f, indent=2, ensure_ascii=False)

print(f"Successfully generated src/data/pyq_physics_ch13.json with {len(questions)} questions.")
