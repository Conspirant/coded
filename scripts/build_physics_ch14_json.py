import json

questions = [
  {
    "id": "phys_ch14_q1",
    "subject": "Physics",
    "chapter": "Waves",
    "chapter_number": 14,
    "year": 2006,
    "question": "A tuning fork A produces 4 beats per second with another tuning fork B of frequency 320 Hz. On filing one of the prongs of A, 4 beats per second are again heard when sounded with the same fork B. Then the frequency of the fork A before filing is",
    "options": [
      "328 Hz",
      "316 Hz",
      "324 Hz",
      "320 Hz"
    ],
    "correct_answer": 1,
    "explanation": "Frequency of fork B is $\\nu_B = 320\\text{ Hz}$.\nBefore filing, fork A produces 4 beats/s with B:\n$$\\nu_A = 320 \\pm 4 = 324\\text{ Hz or } 316\\text{ Hz}$$\nFiling a tuning fork removes mass and increases its frequency.\n- If $\\nu_A = 324\\text{ Hz}$, filing would make it $> 324\\text{ Hz}$, increasing the beat frequency to $> 4\\text{ Hz}$.\n- If $\\nu_A = 316\\text{ Hz}$, filing increases it through $320\\text{ Hz}$ up to $324\\text{ Hz}$, giving 4 beats/s again.\nHence, the frequency before filing was $316\\text{ Hz}$.",
    "needs_image": False
  },
  {
    "id": "phys_ch14_q2",
    "subject": "Physics",
    "chapter": "Waves",
    "chapter_number": 14,
    "year": 2006,
    "question": "When the length of the vibrating segment of a sonometer wire is increased by 1%, the percentage change in its frequency is",
    "options": [
      "$\\frac{100}{101}$",
      "$\\frac{99}{100}$",
      "1",
      "2"
    ],
    "correct_answer": 2,
    "explanation": "The fundamental frequency of a sonometer wire is:\n$$\\nu = \\frac{1}{2l}\\sqrt{\\frac{T}{m}} \\propto \\frac{1}{l}$$\nDifferentiating logarithmically:\n$$\\frac{\\Delta\\nu}{\\nu} = -\\frac{\\Delta l}{l}$$\nIn magnitude, a $1\\%$ increase in length results in a $1\\%$ decrease in frequency. Hence, the percentage change is $1\\%$.",
    "needs_image": False
  },
  {
    "id": "phys_ch14_q3",
    "subject": "Physics",
    "chapter": "Waves",
    "chapter_number": 14,
    "year": 2006,
    "question": "The equation of a simple harmonic wave is given by $y = 5\\sin\\frac{\\pi}{2}(100t - x)$ where $x$ and $y$ are in metre and time is in second. The period of the wave in second will be",
    "options": [
      "0.04",
      "0.01",
      "1",
      "5"
    ],
    "correct_answer": 0,
    "explanation": "Rewriting the wave equation:\n$$y = 5\\sin\\left(50\\pi t - \\frac{\\pi}{2}x\\right)$$\nComparing with standard equation $y = A\\sin(\\omega t - kx)$:\n$$\\omega = 50\\pi\\text{ rad s}^{-1}$$\nTime period:\n$$T = \\frac{2\\pi}{\\omega} = \\frac{2\\pi}{50\\pi} = \\frac{1}{25} = 0.04\\text{ s}$$",
    "needs_image": False
  },
  {
    "id": "phys_ch14_q4",
    "subject": "Physics",
    "chapter": "Waves",
    "chapter_number": 14,
    "year": 2006,
    "question": "The loudness and pitch of a sound note depends on",
    "options": [
      "intensity and frequency",
      "frequency and number of harmonics",
      "intensity and velocity",
      "frequency and velocity."
    ],
    "correct_answer": 0,
    "explanation": "Loudness is primarily determined by the intensity (amplitude squared) of the sound wave, while pitch is determined by the fundamental frequency of the wave.",
    "needs_image": False
  },
  {
    "id": "phys_ch14_q5",
    "subject": "Physics",
    "chapter": "Waves",
    "chapter_number": 14,
    "year": 2007,
    "question": "The maximum particle velocity in a wave motion is half the wave velocity. Then the amplitude of the wave is equal to",
    "options": [
      "$\\lambda / 4\\pi$",
      "$2\\lambda / \\pi$",
      "$\\lambda / 2\\pi$",
      "$\\lambda$"
    ],
    "correct_answer": 0,
    "explanation": "For wave $y = A\\sin(\\omega t - kx)$:\n- Maximum particle velocity: $v_{p,\\max} = A\\omega$\n- Wave propagation velocity: $v = \\frac{\\omega}{k} = \\frac{\\omega \\lambda}{2\\pi}$\nGiven $v_{p,\\max} = \\frac{v}{2}$:\n$$A\\omega = \\frac{1}{2}\\left(\\frac{\\omega \\lambda}{2\\pi}\\right) \\implies A = \\frac{\\lambda}{4\\pi}$$",
    "needs_image": False
  },
  {
    "id": "phys_ch14_q6",
    "subject": "Physics",
    "chapter": "Waves",
    "chapter_number": 14,
    "year": 2007,
    "question": "The ratio of the velocity of sound in hydrogen ($\\gamma = 7/5$) to that in helium ($\\gamma = 5/3$) at the same temperature is",
    "options": [
      "$\\sqrt{\\frac{5}{42}}$",
      "$\\sqrt{\\frac{5}{21}}$",
      "$\\frac{\\sqrt{42}}{5}$",
      "$\\frac{\\sqrt{21}}{5}$"
    ],
    "correct_answer": 2,
    "explanation": "Speed of sound in an ideal gas is $v = \\sqrt{\\frac{\\gamma RT}{M}}$.\nFor $\\text{H}_2$: $\\gamma_1 = 7/5, M_1 = 2\\text{ g mol}^{-1}$.\nFor $\\text{He}$: $\\gamma_2 = 5/3, M_2 = 4\\text{ g mol}^{-1}$.\n$$\\frac{v_1}{v_2} = \\sqrt{\\frac{\\gamma_1 M_2}{\\gamma_2 M_1}} = \\sqrt{\\frac{(7/5) \\times 4}{(5/3) \\times 2}} = \\sqrt{\\frac{28/5}{10/3}} = \\sqrt{\\frac{84}{50}} = \\sqrt{\\frac{42}{25}} = \\frac{\\sqrt{42}}{5}$$",
    "needs_image": False
  },
  {
    "id": "phys_ch14_q7",
    "subject": "Physics",
    "chapter": "Waves",
    "chapter_number": 14,
    "year": 2007,
    "question": "A glass tube is open at both the ends. A tuning fork of frequency $f$ resonates with the air column inside the tube. Now the tube is placed vertically inside water so that half the length of the tube is filled with water. Now the air column inside the tube is in unison with another fork of frequency $f'$. Then",
    "options": [
      "$f' = f$",
      "$f' = 4f$",
      "$f' = 2f$",
      "$f' = f/2$"
    ],
    "correct_answer": 0,
    "explanation": "![Resonance in tube](/pyq_images/physics/ch14/exp_q7.png)\n\nFor an open tube of length $l$ vibrating in fundamental mode:\n$$f = \\frac{v}{2l}$$\nWhen half the tube is filled with water, the remaining air column has length $l' = l/2$ and is closed at one end (water surface).\nThe fundamental frequency of this closed pipe is:\n$$f' = \\frac{v}{4l'} = \\frac{v}{4(l/2)} = \\frac{v}{2l} = f$$\nHence, $f' = f$.",
    "needs_image": False
  },
  {
    "id": "phys_ch14_q8",
    "subject": "Physics",
    "chapter": "Waves",
    "chapter_number": 14,
    "year": 2008,
    "question": "The equation of a simple harmonic wave is given by $y = 6\\sin 2\\pi(2t - 0.1x)$, where $x$ and $y$ are in mm and $t$ is in seconds. The phase difference between two particles 2 mm apart at any instant is",
    "options": [
      "$54^\\circ$",
      "$72^\\circ$",
      "$18^\\circ$",
      "$36^\\circ$"
    ],
    "correct_answer": 1,
    "explanation": "From the wave equation: $y = 6\\sin(4\\pi t - 0.2\\pi x)$.\nWave vector $k = 0.2\\pi = \\frac{2\\pi}{\\lambda} \\implies \\lambda = 10\\text{ mm}$.\nPhase difference for separation $\\Delta x = 2\\text{ mm}$:\n$$\\Delta\\phi = \\frac{2\\pi}{\\lambda}\\Delta x = \\frac{2\\pi}{10} \\times 2 = \\frac{2\\pi}{5}\\text{ rad} = \\frac{2}{5} \\times 180^\\circ = 72^\\circ$$",
    "needs_image": False
  },
  {
    "id": "phys_ch14_q9",
    "subject": "Physics",
    "chapter": "Waves",
    "chapter_number": 14,
    "year": 2008,
    "question": "A string vibrates with a frequency of 200 Hz. When its length is doubled and tension is altered, it begins to vibrate with a frequency of 300 Hz. The ratio of the new tension to the original tension is",
    "options": [
      "3 : 1",
      "1 : 3",
      "9 : 1",
      "1 : 9"
    ],
    "correct_answer": 2,
    "explanation": "Fundamental frequency $\\nu = \\frac{1}{2l}\\sqrt{\\frac{T}{\\mu}} \\implies T = 4 l^2 \\mu \\nu^2$.\n$$\\frac{T_2}{T_1} = \\left(\\frac{l_2}{l_1}\\right)^2 \\left(\\frac{\\nu_2}{\\nu_1}\\right)^2$$\nWith $l_2 = 2l_1, \\nu_1 = 200\\text{ Hz}, \\nu_2 = 300\\text{ Hz}$:\n$$\\frac{T_2}{T_1} = (2)^2 \\times \\left(\\frac{300}{200}\\right)^2 = 4 \\times \\frac{9}{4} = 9 : 1$$",
    "needs_image": False
  },
  {
    "id": "phys_ch14_q10",
    "subject": "Physics",
    "chapter": "Waves",
    "chapter_number": 14,
    "year": 2008,
    "question": "How many times more intense is a 60 dB sound than a 30 dB sound?",
    "options": [
      "100",
      "4",
      "1000",
      "2"
    ],
    "correct_answer": 2,
    "explanation": "Sound intensity level $L = 10\\log_{10}(I / I_0)$.\n$$\\Delta L = 60 - 30 = 30\\text{ dB}$$\n$$10\\log_{10}\\left(\\frac{I_2}{I_1}\\right) = 30 \\implies \\log_{10}\\left(\\frac{I_2}{I_1}\\right) = 3 \\implies \\frac{I_2}{I_1} = 10^3 = 1000$$",
    "needs_image": False
  },
  {
    "id": "phys_ch14_q11",
    "subject": "Physics",
    "chapter": "Waves",
    "chapter_number": 14,
    "year": 2009,
    "question": "Sound waves transfer",
    "options": [
      "only energy not momentum",
      "energy",
      "momentum",
      "both energy and momentum."
    ],
    "correct_answer": 3,
    "explanation": "Like all propagating waves, sound waves transfer both energy and momentum from one region of space to another without transporting matter.",
    "needs_image": False
  },
  {
    "id": "phys_ch14_q12",
    "subject": "Physics",
    "chapter": "Waves",
    "chapter_number": 14,
    "year": 2009,
    "question": "A stationary point source of sound emits sound uniformly in all directions in a non-absorbing medium. Two points P and Q are at a distance of 4 m and 9 m respectively from the source. The ratio of amplitudes of the waves at P and Q is",
    "options": [
      "3/2",
      "4/9",
      "2/3",
      "9/4"
    ],
    "correct_answer": 3,
    "explanation": "![Isotropic point source](/pyq_images/physics/ch14/exp_q12.png)\n\nFor a spherical wave emitted by an isotropic point source:\n$$I = \\frac{P}{4\\pi r^2} \\propto \\frac{1}{r^2}$$\nSince $I \\propto A^2$, amplitude is inversely proportional to distance:\n$$A \\propto \\frac{1}{r}$$\n$$\\frac{A_P}{A_Q} = \\frac{r_Q}{r_P} = \\frac{9}{4}$$",
    "needs_image": False
  },
  {
    "id": "phys_ch14_q13",
    "subject": "Physics",
    "chapter": "Waves",
    "chapter_number": 14,
    "year": 2009,
    "question": "$y = 3\\sin\\pi\\left(\\frac{t}{2} - \\frac{x}{4}\\right)$ represents an equation of a progressive wave, where $t$ is in second and $x$ is in metre. The distance travelled by the wave in 5 seconds is",
    "options": [
      "8 m",
      "10 m",
      "5 m",
      "32 m"
    ],
    "correct_answer": 1,
    "explanation": "The wave equation is $y = 3\\sin\\left(\\frac{\\pi}{2}t - \\frac{\\pi}{4}x\\right)$.\nHere $\\omega = \\pi / 2$ and $k = \\pi / 4$.\nWave speed:\n$$v = \\frac{\\omega}{k} = \\frac{\\pi / 2}{\\pi / 4} = 2\\text{ m s}^{-1}$$\nDistance travelled in $5\\text{ s}$:\n$$s = v \\times t = 2 \\times 5 = 10\\text{ m}$$",
    "needs_image": False
  },
  {
    "id": "phys_ch14_q14",
    "subject": "Physics",
    "chapter": "Waves",
    "chapter_number": 14,
    "year": 2009,
    "question": "A cylindrical tube open at both the ends has a fundamental frequency of 390 Hz in air. If $1/4^{\\text{th}}$ of the tube is immersed vertically in water the fundamental frequency of air column is",
    "options": [
      "260 Hz",
      "130 Hz",
      "390 Hz",
      "520 Hz"
    ],
    "correct_answer": 0,
    "explanation": "![Submerged tube](/pyq_images/physics/ch14/exp_q14.png)\n\nFor an open tube of length $L$:\n$$\\nu = \\frac{v}{2L} = 390\\text{ Hz}$$\nWhen $1/4^{\\text{th}}$ of the tube is immersed in water, the vibrating air column has length $L' = \\frac{3L}{4}$ and becomes closed at one end.\nThe fundamental frequency of this closed pipe is:\n$$\\nu' = \\frac{v}{4L'} = \\frac{v}{4(3L/4)} = \\frac{v}{3L} = \\frac{2}{3}\\left(\\frac{v}{2L}\\right) = \\frac{2}{3} \\times 390 = 260\\text{ Hz}$$",
    "needs_image": False
  },
  {
    "id": "phys_ch14_q15",
    "subject": "Physics",
    "chapter": "Waves",
    "chapter_number": 14,
    "year": 2010,
    "question": "A closed organ pipe and an open organ pipe of same length produce 2 beats/second while vibrating in their fundamental modes. The length of the open organ pipe is halved and that of closed pipe is doubled. Then, the number of beats produced per second while vibrating in the fundamental mode is",
    "options": [
      "2",
      "6",
      "8",
      "7"
    ],
    "correct_answer": 3,
    "explanation": "Initially, both pipes have length $L$:\n- Open pipe: $\\nu_o = \\frac{v}{2L}$\n- Closed pipe: $\\nu_c = \\frac{v}{4L} = \\frac{\\nu_o}{2}$\nGiven $\\nu_o - \\nu_c = 2$:\n$$\\nu_o - \\frac{\\nu_o}{2} = 2 \\implies \\nu_o = 4\\text{ Hz}, \\quad \\nu_c = 2\\text{ Hz}$$\nWhen open pipe length is halved and closed pipe length is doubled:\n$$\\nu_o' = \\frac{v}{2(L/2)} = 2\\nu_o = 8\\text{ Hz}$$\n$$\\nu_c' = \\frac{v}{4(2L)} = \\frac{\\nu_c}{2} = 1\\text{ Hz}$$\nNew beat frequency:\n$$\\text{Beats} = \\nu_o' - \\nu_c' = 8 - 1 = 7\\text{ beats/second}$$",
    "needs_image": False
  },
  {
    "id": "phys_ch14_q16",
    "subject": "Physics",
    "chapter": "Waves",
    "chapter_number": 14,
    "year": 2010,
    "question": "A uniform wire of length L, diameter D and density $\\rho$ is stretched under a tension T. The correct relation between its fundamental frequency 'f', the length L and the diameter D is",
    "options": [
      "$f \\propto \\frac{1}{LD}$",
      "$f \\propto \\frac{1}{L\\sqrt{D}}$",
      "$f \\propto \\frac{1}{D^2}$",
      "$f \\propto \\frac{1}{LD^2}$"
    ],
    "correct_answer": 0,
    "explanation": "Fundamental frequency of a stretched wire:\n$$f = \\frac{1}{2L}\\sqrt{\\frac{T}{\\mu}}$$\nLinear mass density $\\mu = \\rho \\cdot \\pi \\frac{D^2}{4}$.\nSubstituting $\\mu$:\n$$f = \\frac{1}{2L}\\sqrt{\\frac{4T}{\\pi D^2 \\rho}} = \\frac{1}{LD}\\sqrt{\\frac{T}{\\pi \\rho}} \\implies f \\propto \\frac{1}{LD}$$",
    "needs_image": False
  },
  {
    "id": "phys_ch14_q17",
    "subject": "Physics",
    "chapter": "Waves",
    "chapter_number": 14,
    "year": 2011,
    "question": "The equation of a wave is given by $y = 10\\sin\\left(\\frac{2\\pi}{45}t + \\alpha\\right)$. If the displacement is 5 cm at $t = 0$, then the total phase at $t = 7.5\\text{ sec}$ is",
    "options": [
      "$\\pi/3$",
      "$\\pi/2$",
      "$\\pi/6$",
      "$\\pi$"
    ],
    "correct_answer": 1,
    "explanation": "At $t = 0$, $y = 5\\text{ cm}$:\n$$5 = 10\\sin\\alpha \\implies \\sin\\alpha = \\frac{1}{2} \\implies \\alpha = \\frac{\\pi}{6}$$\nAt $t = 7.5\\text{ s} = \\frac{15}{2}\\text{ s}$, total phase is:\n$$\\phi = \\frac{2\\pi}{45}\\left(\\frac{15}{2}\\right) + \\alpha = \\frac{\\pi}{3} + \\frac{\\pi}{6} = \\frac{\\pi}{2}$$",
    "needs_image": False
  },
  {
    "id": "phys_ch14_q18",
    "subject": "Physics",
    "chapter": "Waves",
    "chapter_number": 14,
    "year": 2011,
    "question": "Two tuning forks, A and B, produce notes of frequencies 258 Hz and 262 Hz. An unknown note sounded with A produces certain beats. When the same note is sounded with B, the beat frequency gets doubled. The unknown frequency is",
    "options": [
      "250 Hz",
      "252 Hz",
      "254 Hz",
      "256 Hz"
    ],
    "correct_answer": 2,
    "explanation": "Let unknown frequency be $\\nu$.\nBeats with A (258 Hz): $b = |258 - \\nu|$.\nBeats with B (262 Hz): $2b = |262 - \\nu|$.\nFor $\\nu < 258$:\n$$258 - \\nu = b$$\n$$262 - \\nu = 2b$$\nSubtracting: $262 - 258 = b \\implies b = 4\\text{ Hz}$.\n$$\\nu = 258 - 4 = 254\\text{ Hz}$$",
    "needs_image": False
  },
  {
    "id": "phys_ch14_q19",
    "subject": "Physics",
    "chapter": "Waves",
    "chapter_number": 14,
    "year": 2011,
    "question": "A wire under tension vibrates with a fundamental frequency of 600 Hz. If the length of the wire is doubled, the radius is halved and the wire is made to vibrate under one-ninth the tension. Then the fundamental frequency will become",
    "options": [
      "200 Hz",
      "300 Hz",
      "600 Hz",
      "400 Hz"
    ],
    "correct_answer": 0,
    "explanation": "Fundamental frequency $\\nu = \\frac{1}{2Lr}\\sqrt{\\frac{T}{\\pi\\rho}}$.\n$$\\frac{\\nu_2}{\\nu_1} = \\left(\\frac{L_1}{L_2}\\right)\\left(\\frac{r_1}{r_2}\\right)\\sqrt{\\frac{T_2}{T_1}} = \\left(\\frac{1}{2}\\right)(2)\\sqrt{\\frac{1}{9}} = \\frac{1}{3}$$\n$$\\nu_2 = \\frac{600}{3} = 200\\text{ Hz}$$",
    "needs_image": False
  },
  {
    "id": "phys_ch14_q20",
    "subject": "Physics",
    "chapter": "Waves",
    "chapter_number": 14,
    "year": 2012,
    "question": "Which of the following is incorrect?",
    "options": [
      "If the wave is longitudinal, it must be a mechanical wave.",
      "If the wave is mechanical, it may or may not be transverse wave.",
      "Mechanical waves cannot propagate in vacuum.",
      "Diffraction helps us to distinguish between sound wave and light wave."
    ],
    "correct_answer": 3,
    "explanation": "Diffraction is a universal wave phenomenon exhibited by all waves. Polarization is the specific phenomenon that distinguishes transverse waves (such as light waves) from longitudinal waves (such as sound waves in air).",
    "needs_image": False
  },
  {
    "id": "phys_ch14_q21",
    "subject": "Physics",
    "chapter": "Waves",
    "chapter_number": 14,
    "year": 2012,
    "question": "Intensity level of sound whose intensity is $10^{-8}\\text{ W m}^{-2}$ is _______ dB",
    "options": [
      "8",
      "4",
      "40",
      "80"
    ],
    "correct_answer": 2,
    "explanation": "Sound intensity level in decibels:\n$$L = 10\\log_{10}\\left(\\frac{I}{I_0}\\right)$$\nWith threshold $I_0 = 10^{-12}\\text{ W m}^{-2}$:\n$$L = 10\\log_{10}\\left(\\frac{10^{-8}}{10^{-12}}\\right) = 10\\log_{10}(10^4) = 40\\text{ dB}$$",
    "needs_image": False
  },
  {
    "id": "phys_ch14_q22",
    "subject": "Physics",
    "chapter": "Waves",
    "chapter_number": 14,
    "year": 2013,
    "question": "The equation of a transverse wave is given by $y = 0.05\\sin\\pi(2t - 0.02x)$, where $x, y$ are in metre and $t$ is in second. The minimum distance of separation between two particles which are in phase and the wave velocity are respectively _______",
    "options": [
      "50 m, $50\\text{ m s}^{-1}$",
      "100 m, $100\\text{ m s}^{-1}$",
      "50 m, $100\\text{ m s}^{-1}$",
      "100 m, $50\\text{ m s}^{-1}$"
    ],
    "correct_answer": 1,
    "explanation": "Equation: $y = 0.05\\sin(2\\pi t - 0.02\\pi x)$.\n- $\\omega = 2\\pi\\text{ rad s}^{-1}$\n- $k = 0.02\\pi\\text{ rad m}^{-1}$\nMinimum distance between in-phase particles is one wavelength $\\lambda$:\n$$\\lambda = \\frac{2\\pi}{k} = \\frac{2\\pi}{0.02\\pi} = 100\\text{ m}$$\nWave velocity:\n$$v = \\frac{\\omega}{k} = \\frac{2\\pi}{0.02\\pi} = 100\\text{ m s}^{-1}$$",
    "needs_image": False
  },
  {
    "id": "phys_ch14_q23",
    "subject": "Physics",
    "chapter": "Waves",
    "chapter_number": 14,
    "year": 2013,
    "question": "The frequency of the second overtone of the open pipe is equal to the frequency of first overtone of the closed pipe. The ratio of the lengths of the open pipe and the closed pipe is",
    "options": [
      "2 : 1",
      "1 : 2",
      "1 : 3",
      "3 : 1"
    ],
    "correct_answer": 0,
    "explanation": "Frequency of second overtone of open pipe (3rd harmonic):\n$$\\nu_o = \\frac{3v}{2L_o}$$\nFrequency of first overtone of closed pipe (3rd harmonic):\n$$\\nu_c = \\frac{3v}{4L_c}$$\nGiven $\\nu_o = \\nu_c$:\n$$\\frac{3v}{2L_o} = \\frac{3v}{4L_c} \\implies 2L_o = 4L_c \\implies \\frac{L_o}{L_c} = \\frac{2}{1} = 2 : 1$$",
    "needs_image": False
  },
  {
    "id": "phys_ch14_q24",
    "subject": "Physics",
    "chapter": "Waves",
    "chapter_number": 14,
    "year": 2014,
    "question": "A metallic wire of 1 m length has a mass of $10 \\times 10^{-3}\\text{ kg}$. If a tension of 100 N is applied to a wire, what is the speed of transverse wave?",
    "options": [
      "$200\\text{ m s}^{-1}$",
      "$100\\text{ m s}^{-1}$",
      "$0.1\\text{ m s}^{-1}$",
      "$10\\text{ m s}^{-1}$"
    ],
    "correct_answer": 1,
    "explanation": "Linear mass density $\\mu = \\frac{m}{L} = \\frac{10 \\times 10^{-3}\\text{ kg}}{1\\text{ m}} = 10^{-2}\\text{ kg m}^{-1}$.\nTransverse wave speed:\n$$v = \\sqrt{\\frac{T}{\\mu}} = \\sqrt{\\frac{100}{10^{-2}}} = \\sqrt{10000} = 100\\text{ m s}^{-1}$$",
    "needs_image": False
  },
  {
    "id": "phys_ch14_q25",
    "subject": "Physics",
    "chapter": "Waves",
    "chapter_number": 14,
    "year": 2014,
    "question": "A pipe of 30 cm long and open at both the ends produces harmonics. Which harmonic mode of pipe resonates a 1.1 kHz source ? Given speed of sound in air = $330\\text{ m s}^{-1}$.",
    "options": [
      "Third harmonic",
      "Fifth harmonic",
      "Second harmonic",
      "Fourth harmonic"
    ],
    "correct_answer": 2,
    "explanation": "Length $L = 0.3\\text{ m}$, $v = 330\\text{ m s}^{-1}$, $\\nu_n = 1100\\text{ Hz}$.\nFor an open pipe:\n$$\\nu_n = \\frac{nv}{2L} \\implies 1100 = \\frac{n \\times 330}{2 \\times 0.3} = 550 n \\implies n = 2$$\nHence, it resonates in the second harmonic mode.",
    "needs_image": False
  },
  {
    "id": "phys_ch14_q26",
    "subject": "Physics",
    "chapter": "Waves",
    "chapter_number": 14,
    "year": 2015,
    "question": "A stretched string is vibrating in the second overtone, then the number of nodes and antinodes between the ends of the string are respectively",
    "options": [
      "3 and 2",
      "2 and 3",
      "4 and 3",
      "3 and 4"
    ],
    "correct_answer": 2,
    "explanation": "![Second overtone of string](/pyq_images/physics/ch14/exp_q26.png)\n\nIn the second overtone (3rd harmonic), the string vibrates in 3 loops.\nThe total number of nodes is $n + 1 = 3 + 1 = 4$ (including the fixed boundaries).\nThe number of antinodes is $n = 3$.\nHence, there are 4 nodes and 3 antinodes.",
    "needs_image": False
  },
  {
    "id": "phys_ch14_q27",
    "subject": "Physics",
    "chapter": "Waves",
    "chapter_number": 14,
    "year": 2015,
    "question": "When two tuning forks A and B are sounded together, 4 beats per second are heard. The frequency of the fork B is 384 Hz. When one of the prongs of the fork A is filed and sounded with B, the beat frequency increases, then the frequency of the fork A is",
    "options": [
      "388 Hz",
      "389 Hz",
      "380 Hz",
      "379 Hz"
    ],
    "correct_answer": 0,
    "explanation": "![Tuning fork beats](/pyq_images/physics/ch14/exp_q27.png)\n\nGiven $\\nu_B = 384\\text{ Hz}$, beat frequency $= 4\\text{ Hz}$.\n$$\\nu_A = 384 \\pm 4 = 388\\text{ Hz or } 380\\text{ Hz}$$\nFiling fork A increases its frequency:\n- If $\\nu_A = 380\\text{ Hz}$, filing increases it toward $384\\text{ Hz}$, reducing beats.\n- If $\\nu_A = 388\\text{ Hz}$, filing increases it further away from $384\\text{ Hz}$, increasing beats.\nSince beat frequency increases, the initial frequency of A was $388\\text{ Hz}$.",
    "needs_image": False
  },
  {
    "id": "phys_ch14_q28",
    "subject": "Physics",
    "chapter": "Waves",
    "chapter_number": 14,
    "year": 2017,
    "question": "The waves set up in a closed pipe are",
    "options": [
      "longitudinal and progressive",
      "longitudinal and stationary",
      "transverse and stationary",
      "transverse and progressive."
    ],
    "correct_answer": 1,
    "explanation": "Sound waves inside a closed organ pipe are longitudinal. Superposition of waves travelling in opposite directions after reflection forms standing waves. Thus, the waves are longitudinal and stationary.",
    "needs_image": False
  },
  {
    "id": "phys_ch14_q29",
    "subject": "Physics",
    "chapter": "Waves",
    "chapter_number": 14,
    "year": 2018,
    "question": "First overtone frequency of a closed pipe of length $l_1$ is equal to the $2^{\\text{nd}}$ harmonic frequency of an open pipe of length $l_2$. The ratio $l_1 / l_2 =$",
    "options": [
      "3/4",
      "4/3",
      "3/2",
      "2/3"
    ],
    "correct_answer": 0,
    "explanation": "First overtone of a closed pipe (3rd harmonic):\n$$\\nu_c = \\frac{3v}{4l_1}$$\nSecond harmonic of an open pipe:\n$$\\nu_o = \\frac{2v}{2l_2} = \\frac{v}{l_2}$$\nEquating frequencies:\n$$\\frac{3v}{4l_1} = \\frac{v}{l_2} \\implies \\frac{l_1}{l_2} = \\frac{3}{4}$$",
    "needs_image": False
  },
  {
    "id": "phys_ch14_q30",
    "subject": "Physics",
    "chapter": "Waves",
    "chapter_number": 14,
    "year": 2019,
    "question": "The equation of a stationary wave is $y = 2\\sin\\left(\\frac{\\pi x}{15}\\right)\\cos(48\\pi t)$. The distance between a node and its next antinode is",
    "options": [
      "22.5 units",
      "7.5 units",
      "30 units",
      "1.5 units"
    ],
    "correct_answer": 1,
    "explanation": "Comparing with $y = 2A\\sin(kx)\\cos(\\omega t)$:\n$$k = \\frac{\\pi}{15} = \\frac{2\\pi}{\\lambda} \\implies \\lambda = 30\\text{ units}$$\nThe distance between any node and the immediate next antinode is:\n$$d = \\frac{\\lambda}{4} = \\frac{30}{4} = 7.5\\text{ units}$$",
    "needs_image": False
  },
  {
    "id": "phys_ch14_q31",
    "subject": "Physics",
    "chapter": "Waves",
    "chapter_number": 14,
    "year": 2021,
    "question": "To propagate both longitudinal and transverse waves, a material must have",
    "options": [
      "bulk and shear moduli",
      "only bulk modulus",
      "only shear modulus",
      "Young's and bulk modulus."
    ],
    "correct_answer": 0,
    "explanation": "Longitudinal waves involve volumetric compression and expansion, requiring bulk modulus of elasticity. Transverse waves involve shearing deformation, requiring shear modulus (rigidity). Hence, a material must possess both bulk and shear moduli.",
    "needs_image": False
  }
]

with open('src/data/pyq_physics_ch14.json', 'w', encoding='utf-8') as f:
    json.dump(questions, f, indent=2, ensure_ascii=False)

print(f"Successfully generated src/data/pyq_physics_ch14.json with {len(questions)} questions.")
