import json, sys, os

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

# Official answer key for Physics Chapter 25: Dual Nature of Radiation and Matter (1 to 42)
ans_key_map = {
    1: 'c', 2: 'b', 3: 'c', 4: 'd', 5: 'd', 6: 'b', 7: 'a', 8: 'b', 9: 'c', 10: 'a',
    11: 'a', 12: 'c', 13: 'c', 14: 'd', 15: 'b', 16: 'd', 17: 'b', 18: 'c', 19: 'a', 20: 'd',
    21: 'd', 22: 'd', 23: 'd', 24: 'c', 25: 'd', 26: 'b', 27: 'c', 28: 'b', 29: 'b', 30: 'b',
    31: 'b', 32: 'c', 33: 'd', 34: 'd', 35: 'd', 36: 'a', 37: 'd', 38: 'd', 39: 'b', 40: 'a',
    41: 'c', 42: 'c'
}

opt_to_idx = {'a': 0, 'b': 1, 'c': 2, 'd': 3}

raw_questions = [
  {
    "qnum": 1, "year": 2006,
    "question": "Light of two different frequencies whose photons have energies $1\\text{ eV}$ and $2.5\\text{ eV}$ respectively illuminate a metallic surface whose work function is $0.5\\text{ eV}$ successively. The ratio of maximum speeds of emitted electrons is",
    "options": ["$1 : 4$", "$1 : 1$", "$1 : 2$", "$1 : 5$"],
    "explanation": "Maximum kinetic energy $K_{\\max} = \\frac{1}{2}mv_{\\max}^2 = E - W_0$.\nFor first light: $K_1 = 1 - 0.5 = 0.5\\text{ eV}$.\nFor second light: $K_2 = 2.5 - 0.5 = 2.0\\text{ eV}$.\n$$\\frac{v_1}{v_2} = \\sqrt{\\frac{K_1}{K_2}} = \\sqrt{\\frac{0.5}{2.0}} = \\sqrt{\\frac{1}{4}} = \\frac{1}{2}$$"
  },
  {
    "qnum": 2, "year": 2006,
    "question": "When ultraviolet rays fall on two photosensitive plates $A$ and $B$ having work functions $E_A = 0.74\\text{ eV}$ and $E_B = 0.91\\text{ eV}$, incident photon energy is $0.825\\text{ eV}$. Photoelectrons are emitted from",
    "options": ["both plates $A$ and $B$", "plate $A$ alone", "plate $B$ alone", "neither plate $A$ nor $B$"],
    "explanation": "Photoelectric emission occurs only when incident energy $h\\nu \\ge W_0$.\nHere $h\\nu = 0.825\\text{ eV} > E_A (0.74\\text{ eV})$ but $h\\nu < E_B (0.91\\text{ eV})$.\nTherefore, photoelectrons are emitted from plate $A$ alone."
  },
  {
    "qnum": 3, "year": 2006,
    "question": "The specific charge of an electron is",
    "options": [
      "$1.6 \\times 10^{-19}\\text{ C kg}^{-1}$",
      "$9.1 \\times 10^{-31}\\text{ C kg}^{-1}$",
      "$1.76 \\times 10^{11}\\text{ C kg}^{-1}$",
      "$1.76 \\times 10^{-11}\\text{ C kg}^{-1}$"
    ],
    "explanation": "Specific charge $\\frac{e}{m} = \\frac{1.6 \\times 10^{-19}\\text{ C}}{9.1 \\times 10^{-31}\\text{ kg}} \\approx 1.76 \\times 10^{11}\\text{ C kg}^{-1}$."
  },
  {
    "qnum": 4, "year": 2006,
    "question": "The de Broglie wavelength of a particle of mass $m$ and kinetic energy $K$ is given by",
    "options": ["$\\frac{h}{\\sqrt{mK}}$", "$\\frac{\\sqrt{2mK}}{h}$", "$\\frac{h}{2mK}$", "$\\frac{h}{\\sqrt{2mK}}$"],
    "explanation": "Kinetic energy $K = \\frac{p^2}{2m} \\implies p = \\sqrt{2mK}$.\nde Broglie wavelength $\\lambda = \\frac{h}{p} = \\frac{h}{\\sqrt{2mK}}$."
  },
  {
    "qnum": 5, "year": 2006,
    "question": "Which of the following graphs represents the variation of maximum kinetic energy ($E_k$) of the emitted photoelectrons with frequency ($\\nu$) in photoelectric effect correctly?\n\n![Graph](/pyq_images/physics/ch25/q5_graphs.png)",
    "options": ["Graph (a)", "Graph (b)", "Graph (c)", "Graph (d)"],
    "explanation": "According to Einstein's photoelectric equation: $E_k = h\\nu - h\\nu_0$. This is a straight line equation $y = mx - c$ with slope equal to Planck's constant $h$ and an intercept on the frequency axis equal to the threshold frequency $\\nu_0$ (Graph d)."
  },
  {
    "qnum": 6, "year": 2007,
    "question": "A photoelectric cell is illuminated by a point source of light $1\\text{ m}$ away. When the source is shifted to $2\\text{ m}$, then",
    "options": [
      "each emitted electron carries one quarter of the initial energy",
      "number of emitted electrons is one quarter of the initial number",
      "each emitted electron carries half the initial energy",
      "number of emitted electrons is halved"
    ],
    "explanation": "Intensity of light from a point source obeys the inverse-square law: $I \\propto \\frac{1}{r^2}$.\nAt $r = 2\\text{ m}$, $I$ becomes $\\frac{1}{4}$ of its initial value.\nSince photoelectric current (number of photoelectrons emitted per second) is directly proportional to intensity, the number of emitted electrons becomes one-fourth."
  },
  {
    "qnum": 7, "year": 2007,
    "question": "The threshold wavelength for photoelectric emission from a material is $5200\\text{ \\AA}$. Photoelectrons will be emitted when this material is illuminated with monochromatic radiation from a",
    "options": ["$50\\text{ W}$ ultraviolet lamp", "$1\\text{ W}$ infrared lamp", "$50\\text{ W}$ infrared lamp", "$10\\text{ W}$ infrared lamp"],
    "explanation": "Photoelectric emission requires $\\lambda \\le \\lambda_0 = 5200\\text{ \\AA}$.\nUltraviolet light has $\\lambda < 4000\\text{ \\AA} < 5200\\text{ \\AA}$, so emission occurs even for low intensity UV light. Infrared light has $\\lambda > 7500\\text{ \\AA} > 5200\\text{ \\AA}$, so no emission occurs regardless of power."
  },
  {
    "qnum": 8, "year": 2007,
    "question": "A particle of mass $m$ and charge $q$ is accelerated through a potential difference of $V$ volts. Its de Broglie wavelength is",
    "options": ["$\\frac{h}{mqV}$", "$\\frac{h}{\\sqrt{2mqV}}$", "$\\frac{h}{\\sqrt{mqV}}$", "$\\frac{qV}{\\sqrt{2m}}$"],
    "explanation": "Kinetic energy $K = qV$.\nde Broglie wavelength $\\lambda = \\frac{h}{p} = \\frac{h}{\\sqrt{2mK}} = \\frac{h}{\\sqrt{2mqV}}$."
  },
  {
    "qnum": 9, "year": 2008,
    "question": "A proton and an $\\alpha$-particle are accelerated through the same potential difference $V$. The ratio of their de Broglie wavelengths $\\frac{\\lambda_p}{\\lambda_\\alpha}$ is",
    "options": ["$1 : 1$", "$1 : 2\\sqrt{2}$", "$2\\sqrt{2} : 1$", "$4 : 1$"],
    "explanation": "$$\\lambda = \\frac{h}{\\sqrt{2mqV}} \\implies \\frac{\\lambda_p}{\\lambda_\\alpha} = \\sqrt{\\frac{m_\\alpha q_\\alpha}{m_p q_p}} = \\sqrt{\\frac{4m_p \\cdot 2e}{m_p \\cdot e}} = \\sqrt{8} = 2\\sqrt{2} : 1$$"
  },
  {
    "qnum": 10, "year": 2008,
    "question": "The work function of a substance is $4.0\\text{ eV}$. The longest wavelength of light that can cause photoelectron emission from this substance is approximately",
    "options": ["$310\\text{ nm}$", "$400\\text{ nm}$", "$540\\text{ nm}$", "$220\\text{ nm}$"],
    "explanation": "$$\\lambda_0 = \\frac{hc}{W_0} = \\frac{1240\\text{ eV}\\cdot\\text{nm}}{4.0\\text{ eV}} = 310\\text{ nm}$$"
  },
  {
    "qnum": 11, "year": 2009,
    "question": "In a photoelectric experiment, the stopping potential $V_0$ is measured for different frequencies $\\nu$. The slope of the graph of $V_0$ versus $\\nu$ is equal to",
    "options": ["$h/e$", "$h$", "$e/h$", "$W_0/e$"],
    "explanation": "From Einstein's equation: $eV_0 = h\\nu - W_0 \\implies V_0 = \\left(\\frac{h}{e}\\right)\\nu - \\frac{W_0}{e}$.\nThe slope of the graph of $V_0$ versus $\\nu$ is $\\frac{h}{e}$."
  },
  {
    "qnum": 12, "year": 2009,
    "question": "The ratio of de Broglie wavelength of an $\\alpha$-particle to that of a proton having the same kinetic energy is",
    "options": ["$2 : 1$", "$4 : 1$", "$1 : 2$", "$1 : 4$"],
    "explanation": "$$\\lambda = \\frac{h}{\\sqrt{2mK}} \\implies \\frac{\\lambda_\\alpha}{\\lambda_p} = \\sqrt{\\frac{m_p}{m_\\alpha}} = \\sqrt{\\frac{m_p}{4m_p}} = \\frac{1}{2}$$"
  },
  {
    "qnum": 13, "year": 2010,
    "question": "According to Einstein's photoelectric equation, the graph of kinetic energy of photoelectrons emitted from a metal versus frequency of incident radiation gives a straight line whose slope",
    "options": [
      "depends on the intensity of incident radiation",
      "depends on the nature of the metal and also on intensity",
      "is a universal constant independent of all other factors",
      "depends on the work function of the metal"
    ],
    "explanation": "The slope of $K_{\\max}$ versus $\\nu$ is Planck's constant $h$, which is a universal physical constant."
  },
  {
    "qnum": 14, "year": 2010,
    "question": "When light of frequency $2\\nu_0$ (where $\\nu_0$ is threshold frequency) is incident on a metal plate, maximum velocity of emitted electrons is $v_1$. When frequency is increased to $5\\nu_0$, maximum velocity is $v_2$. The ratio of $v_1$ to $v_2$ is",
    "options": ["$1 : 4$", "$1 : 1$", "$1 : 3$", "$1 : 2$"],
    "explanation": "$$\\frac{1}{2}mv_1^2 = h(2\\nu_0) - h\\nu_0 = h\\nu_0$$\n$$\\frac{1}{2}mv_2^2 = h(5\\nu_0) - h\\nu_0 = 4h\\nu_0$$\n$$\\frac{v_1^2}{v_2^2} = \\frac{1}{4} \\implies \\frac{v_1}{v_2} = \\frac{1}{2}$$"
  },
  {
    "qnum": 15, "year": 2011,
    "question": "The momentum of a photon of energy $E$ is",
    "options": ["$E/c^2$", "$E/c$", "$Ec$", "$E/2c$"],
    "explanation": "For a photon, $E = pc \\implies p = \\frac{E}{c}$."
  },
  {
    "qnum": 16, "year": 2011,
    "question": "An electron of mass $m$ has de Broglie wavelength $\\lambda$. The kinetic energy of the electron is",
    "options": ["$\\frac{h^2}{m\\lambda}$", "$\\frac{2h^2}{m\\lambda^2}$", "$\\frac{h^2}{4m^2\\lambda^2}$", "$\\frac{h^2}{2m\\lambda^2}$"],
    "explanation": "$$\\lambda = \\frac{h}{p} \\implies p = \\frac{h}{\\lambda}$$\n$$K = \\frac{p^2}{2m} = \\frac{h^2}{2m\\lambda^2}$$"
  },
  {
    "qnum": 17, "year": 2012,
    "question": "A photoelectric cell converts",
    "options": [
      "electric energy into light energy",
      "light energy into electric energy",
      "light energy into sound energy",
      "electric energy into magnetic energy"
    ],
    "explanation": "A photoelectric cell operates on the photoelectric effect to convert light (radiant) energy into electrical energy."
  },
  {
    "qnum": 18, "year": 2012,
    "question": "The stopping potential of electrons emitted from a metal surface illuminated by light of frequency $\\nu$ is $V_0$. When frequency is doubled, stopping potential becomes",
    "options": ["$2V_0$", "$V_0/2$", "more than $2V_0$", "between $V_0$ and $2V_0$"],
    "explanation": "$$eV_0 = h\\nu - W_0$$\n$$eV'_0 = h(2\\nu) - W_0 = 2(h\\nu - W_0) + W_0 = 2eV_0 + W_0$$\n$$V'_0 = 2V_0 + \\frac{W_0}{e} > 2V_0$$"
  },
  {
    "qnum": 19, "year": 2013,
    "question": "If the kinetic energy of a free particle is increased to 4 times its original value, its de Broglie wavelength becomes",
    "options": ["half", "double", "four times", "one-fourth"],
    "explanation": "$$\\lambda = \\frac{h}{\\sqrt{2mK}} \\propto \\frac{1}{\\sqrt{K}}$$\nWhen $K' = 4K$, $\\lambda' = \\frac{\\lambda}{\\sqrt{4}} = \\frac{\\lambda}{2}$ (halved)."
  },
  {
    "qnum": 20, "year": 2013,
    "question": "What is the de Broglie wavelength of an electron accelerated through a potential difference of $100\\text{ V}$?",
    "options": ["$1.227\\text{ nm}$", "$0.1227\\text{ \\AA}$", "$12.27\\text{ nm}$", "$0.1227\\text{ nm}$"],
    "explanation": "$$\\lambda = \\frac{1.227}{\\sqrt{V}}\\text{ nm} = \\frac{1.227}{\\sqrt{100}}\\text{ nm} = \\frac{1.227}{10}\\text{ nm} = 0.1227\\text{ nm} = 1.227\\text{ \\AA}$$"
  },
  {
    "qnum": 21, "year": 2014,
    "question": "If an electron and a proton have the same de Broglie wavelength, then with respect to their kinetic energies:",
    "options": [
      "kinetic energy of electron is equal to that of proton",
      "kinetic energy of proton is greater than that of electron",
      "both have zero kinetic energy",
      "kinetic energy of electron is greater than that of proton"
    ],
    "explanation": "$$K = \\frac{h^2}{2m\\lambda^2} \\propto \\frac{1}{m}$$\nSince $m_e \\ll m_p$, $K_e \\gg K_p$. Thus, the electron has greater kinetic energy."
  },
  {
    "qnum": 22, "year": 2014,
    "question": "A beam of light consists of photons of energy $3.5\\text{ eV}$. It is incident on a metal of work function $2.0\\text{ eV}$. The stopping potential is",
    "options": ["$3.5\\text{ V}$", "$2.0\\text{ V}$", "$5.5\\text{ V}$", "$1.5\\text{ V}$"],
    "explanation": "$$eV_0 = E - W_0 = 3.5\\text{ eV} - 2.0\\text{ eV} = 1.5\\text{ eV} \\implies V_0 = 1.5\\text{ V}$$"
  },
  {
    "qnum": 23, "year": 2015,
    "question": "The de Broglie wavelength of a ball of mass $0.12\\text{ kg}$ moving with a speed of $20\\text{ m s}^{-1}$ is (Planck's constant $h = 6.63 \\times 10^{-34}\\text{ J s}$)",
    "options": [
      "$2.76 \\times 10^{-34}\\text{ m}$",
      "$3.1 \\times 10^{-34}\\text{ m}$",
      "$1.5 \\times 10^{-34}\\text{ m}$",
      "$2.76 \\times 10^{-33}\\text{ m}$"
    ],
    "explanation": "$$\\lambda = \\frac{h}{mv} = \\frac{6.63 \\times 10^{-34}}{0.12 \\times 20} = \\frac{6.63 \\times 10^{-34}}{2.4} \\approx 2.76 \\times 10^{-33}\\text{ m}$$"
  },
  {
    "qnum": 24, "year": 2015,
    "question": "From the following graph of photocurrent versus collector potential for three different radiations of frequencies $\\nu_1, \\nu_2, \\nu_3$ with stopping potentials $V_{01}, V_{02}, V_{03}$ where $|V_{01}| < |V_{02}| < |V_{03}|$, then:\n\n![Graph](/pyq_images/physics/ch25/q24_stopping_potential.png)",
    "options": [
      "$\\nu_1 = \\nu_2 = \\nu_3$",
      "$\\nu_1 > \\nu_2 > \\nu_3$",
      "$\\nu_3 > \\nu_2 > \\nu_1$",
      "$\\nu_1 > \\nu_3 > \\nu_2$"
    ],
    "explanation": "Since stopping potential is directly proportional to frequency ($eV_0 = h\\nu - W_0$), greater magnitude of stopping potential implies higher incident frequency: $|V_{03}| > |V_{02}| > |V_{01}| \\implies \\nu_3 > \\nu_2 > \\nu_1$."
  },
  {
    "qnum": 25, "year": 2016,
    "question": "The threshold frequency for a photosensitive metal is $3.3 \\times 10^{14}\\text{ Hz}$. If incident frequency is $8.2 \\times 10^{14}\\text{ Hz}$, the cut-off voltage is",
    "options": ["$1.0\\text{ V}$", "$4.0\\text{ V}$", "$3.0\\text{ V}$", "$2.0\\text{ V}$"],
    "explanation": "$$V_0 = \\frac{h}{e}(\\nu - \\nu_0) = \\frac{6.63 \\times 10^{-34}}{1.6 \\times 10^{-19}}(8.2 - 3.3) \\times 10^{14}$$\n$$= 4.14 \\times 10^{-15} \\times 4.9 \\times 10^{14} \\approx 2.03\\text{ V} \\approx 2.0\\text{ V}$$"
  },
  {
    "qnum": 26, "year": 2016,
    "question": "A particle is moving three times as fast as an electron. The ratio of de Broglie wavelength of the particle to that of electron is $1.813 \\times 10^{-4}$. The mass of the particle is",
    "options": [
      "equal to mass of electron",
      "$1.67 \\times 10^{-27}\\text{ kg}$",
      "$9.1 \\times 10^{-31}\\text{ kg}$",
      "$1.67 \\times 10^{-24}\\text{ kg}$"
    ],
    "explanation": "$$\\frac{\\lambda}{\\lambda_e} = \\frac{m_e v_e}{m v} = \\frac{m_e}{m}\\left(\\frac{1}{3}\\right) = 1.813 \\times 10^{-4}$$\n$$m = \\frac{m_e}{3 \\times 1.813 \\times 10^{-4}} = \\frac{9.11 \\times 10^{-31}}{5.439 \\times 10^{-4}} \\approx 1.67 \\times 10^{-27}\\text{ kg}$$ (mass of a proton/neutron)."
  },
  {
    "qnum": 27, "year": 2017,
    "question": "From the following graph of photocurrent against collector plate potential for two different intensities of light $I_1$ and $I_2$, one can conclude:\n\n![Graph](/pyq_images/physics/ch25/q27_photocurrent.png)",
    "options": [
      "$I_1 = I_2$",
      "$I_1 < I_2$",
      "$I_1 > I_2$",
      "no conclusion can be drawn"
    ],
    "explanation": "Saturation current is directly proportional to intensity. Curve 1 reaches a higher saturation current than curve 2, so $I_1 > I_2$."
  },
  {
    "qnum": 28, "year": 2017,
    "question": "An electron, an $\\alpha$-particle, and a proton have the same kinetic energy. Which of these particles has the shortest de Broglie wavelength?",
    "options": ["electron", "$\\alpha$-particle", "proton", "all have same wavelength"],
    "explanation": "$$\\lambda = \\frac{h}{\\sqrt{2mK}}$$\nFor the same kinetic energy $K$, $\\lambda \\propto \\frac{1}{\\sqrt{m}}$. Since the $\\alpha$-particle has the largest mass ($m_\\alpha \\approx 4m_p$), it has the shortest de Broglie wavelength."
  },
  {
    "qnum": 29, "year": 2018,
    "question": "A photosensitive metallic surface has work function $h\\nu_0$. If photons of energy $2h\\nu_0$ fall on this surface, the electrons come out with maximum velocity of $4 \\times 10^6\\text{ m s}^{-1}$. When photon energy is increased to $5h\\nu_0$, maximum velocity of photoelectrons will be",
    "options": [
      "$2 \\times 10^7\\text{ m s}^{-1}$",
      "$8 \\times 10^6\\text{ m s}^{-1}$",
      "$8 \\times 10^5\\text{ m s}^{-1}$",
      "$2 \\times 10^6\\text{ m s}^{-1}$"
    ],
    "explanation": "$$\\frac{1}{2}m v_1^2 = 2h\\nu_0 - h\\nu_0 = h\\nu_0$$\n$$\\frac{1}{2}m v_2^2 = 5h\\nu_0 - h\\nu_0 = 4h\\nu_0$$\n$$\\frac{v_2^2}{v_1^2} = 4 \\implies v_2 = 2v_1 = 2(4 \\times 10^6) = 8 \\times 10^6\\text{ m s}^{-1}$$"
  },
  {
    "qnum": 30, "year": 2018,
    "question": "The following graph represents the variation of photocurrent with anode potential for a metal surface. Here $I_1, I_2, I_3$ represent intensities and $\\nu_1, \\nu_2, \\nu_3$ represent frequencies for curves 1, 2 and 3 respectively, then:\n\n![Graph](/pyq_images/physics/ch25/q30_anode_potential.png)",
    "options": [
      "$\\nu_1 = \\nu_2$ and $I_1 = I_2$",
      "$\\nu_1 = \\nu_2$ and $I_1 \\neq I_2$",
      "$\\nu_1 \\neq \\nu_2$ and $I_1 = I_2$",
      "$\\nu_1 = \\nu_3$ and $I_1 = I_3$"
    ],
    "explanation": "Curves 1 and 2 originate from the same stopping potential $-V_{01}$, which means $\\nu_1 = \\nu_2$. However, they saturate at different current levels, so their intensities are different ($I_1 \\neq I_2$)."
  },
  {
    "qnum": 31, "year": 2019,
    "question": "The work function of a metal is $3.0\\text{ eV}$. The threshold frequency of the metal is",
    "options": [
      "$7.24 \\times 10^{15}\\text{ Hz}$",
      "$7.24 \\times 10^{14}\\text{ Hz}$",
      "$7.24 \\times 10^{13}\\text{ Hz}$",
      "$7.24 \\times 10^{12}\\text{ Hz}$"
    ],
    "explanation": "$$\\nu_0 = \\frac{W_0}{h} = \\frac{3.0 \\times 1.6 \\times 10^{-19}\\text{ J}}{6.63 \\times 10^{-34}\\text{ J s}} = \\frac{4.8 \\times 10^{-19}}{6.63 \\times 10^{-34}} \\approx 7.24 \\times 10^{14}\\text{ Hz}$$"
  },
  {
    "qnum": 32, "year": 2019,
    "question": "In Davisson and Germer experiment, the first order diffraction maximum is observed at an angle of $50^\\circ$ for an accelerating potential of $54\\text{ V}$. The de Broglie wavelength associated with electrons is",
    "options": ["$0.123\\text{ nm}$", "$0.246\\text{ nm}$", "$0.166\\text{ nm}$", "$0.332\\text{ nm}$"],
    "explanation": "$$\\lambda = \\frac{1.227}{\\sqrt{V}}\\text{ nm} = \\frac{1.227}{\\sqrt{54}}\\text{ nm} = \\frac{1.227}{7.348}\\text{ nm} \\approx 0.167\\text{ nm} = 1.67\\text{ \\AA}$$"
  },
  {
    "qnum": 33, "year": 2020,
    "question": "An electron is accelerated through a potential difference of $V$ volts. If its initial velocity is zero, the de Broglie wavelength associated with it is",
    "options": ["$\\frac{12.27}{V}\\text{ \\AA}$", "$\\frac{1.227}{V}\\text{ \\AA}$", "$\\frac{12.27}{\\sqrt{V}}\\text{ nm}$", "$\\frac{12.27}{\\sqrt{V}}\\text{ \\AA}$"],
    "explanation": "$$\\lambda = \\frac{h}{\\sqrt{2m_e e V}} = \\frac{1.227}{\\sqrt{V}}\\text{ nm} = \\frac{12.27}{\\sqrt{V}}\\text{ \\AA}$$"
  },
  {
    "qnum": 34, "year": 2020,
    "question": "When a metal surface is illuminated by light of wavelength $\\lambda$, stopping potential is $V_0$. When the same surface is illuminated by light of wavelength $2\\lambda$, stopping potential is $V_0/4$. The work function of the metal is",
    "options": ["$\\frac{hc}{\\lambda}$", "$\\frac{hc}{2\\lambda}$", "$\\frac{hc}{4\\lambda}$", "$\\frac{hc}{3\\lambda}$"],
    "explanation": "$$eV_0 = \\frac{hc}{\\lambda} - W_0$$\n$$e\\left(\\frac{V_0}{4}\\right) = \\frac{hc}{2\\lambda} - W_0 \\implies eV_0 = \\frac{2hc}{\\lambda} - 4W_0$$\n$$\\frac{hc}{\\lambda} - W_0 = \\frac{2hc}{\\lambda} - 4W_0 \\implies 3W_0 = \\frac{hc}{\\lambda} \\implies W_0 = \\frac{hc}{3\\lambda}$$"
  },
  {
    "qnum": 35, "year": 2021,
    "question": "According to Einstein's photoelectric equation, the graph between kinetic energy of photoelectrons ejected and the frequency of incident radiation is:\n\n![Graph](/pyq_images/physics/ch25/q35_graphs.png)",
    "options": ["Graph (a)", "Graph (b)", "Graph (c)", "Graph (d)"],
    "explanation": "$$K_{\\max} = h\\nu - h\\nu_0$$\nThis represents a straight line with slope $h$ and an intercept $-\\Phi_0$ on the vertical axis and $\\nu_0$ on the frequency axis (Graph d)."
  },
  {
    "qnum": 36, "year": 2021,
    "question": "Light of wavelength $\\lambda$ falls on a photosensitive surface with work function $W$. The kinetic energy of the fastest electron emitted is $K$. If the wavelength is reduced to $\\lambda/2$, the kinetic energy of the fastest electron will be",
    "options": ["$2K + W$", "$2K$", "$K + W$", "$2K - W$"],
    "explanation": "$$K = \\frac{hc}{\\lambda} - W \\implies \\frac{hc}{\\lambda} = K + W$$\nFor $\\lambda' = \\lambda/2$:\n$$K' = \\frac{hc}{\\lambda/2} - W = 2\\left(\\frac{hc}{\\lambda}\\right) - W = 2(K + W) - W = 2K + W$$"
  },
  {
    "qnum": 37, "year": 2022,
    "question": "An electron, an $\\alpha$-particle, and a proton have de Broglie wavelengths $\\lambda_e, \\lambda_\\alpha, \\lambda_p$ respectively. If all are moving with the same velocity, then",
    "options": [
      "$\\lambda_e < \\lambda_p < \\lambda_\\alpha$",
      "$\\lambda_\\alpha = \\lambda_p = \\lambda_e$",
      "$\\lambda_p < \\lambda_\\alpha < \\lambda_e$",
      "$\\lambda_\\alpha < \\lambda_p < \\lambda_e$"
    ],
    "explanation": "$$\\lambda = \\frac{h}{mv}$$\nFor identical velocity $v$, $\\lambda \\propto \\frac{1}{m}$.\nSince $m_\\alpha > m_p > m_e$, it follows that $\\lambda_\\alpha < \\lambda_p < \\lambda_e$."
  },
  {
    "qnum": 38, "year": 2022,
    "question": "The stopping potential for photoelectrons emitted from a surface illuminated by light of frequency $\\nu$ is $V_0$. The work function of the metal is $W_0$. The maximum kinetic energy of the emitted photoelectrons is",
    "options": ["$h\\nu - eV_0$", "$W_0 - eV_0$", "$h\\nu + W_0$", "$eV_0$"],
    "explanation": "By definition, the stopping potential $V_0$ stops the most energetic photoelectrons: $K_{\\max} = eV_0$."
  },
  {
    "qnum": 39, "year": 2023,
    "question": "The de Broglie wavelength of an electron moving with kinetic energy $E$ is $\\lambda$. If the kinetic energy is doubled, the new de Broglie wavelength will be",
    "options": ["$2\\lambda$", "$\\lambda/\\sqrt{2}$", "$\\sqrt{2}\\lambda$", "$\\lambda/2$"],
    "explanation": "$$\\lambda = \\frac{h}{\\sqrt{2mE}} \\implies \\lambda' = \\frac{h}{\\sqrt{2m(2E)}} = \\frac{\\lambda}{\\sqrt{2}}$$"
  },
  {
    "qnum": 40, "year": 2023,
    "question": "When light of frequency $\\nu$ is incident on a photosensitive metal, stopping potential is $V_1$. When light of frequency $2\\nu$ is incident, stopping potential is $V_2$. Then Planck's constant $h$ is given by",
    "options": [
      "$\\frac{e(V_2 - V_1)}{\\nu}$",
      "$\\frac{e(V_2 + V_1)}{\\nu}$",
      "$\\frac{e(V_2 - V_1)}{2\\nu}$",
      "$\\frac{e(V_1 - V_2)}{\\nu}$"
    ],
    "explanation": "$$eV_1 = h\\nu - W_0$$\n$$eV_2 = 2h\\nu - W_0$$\nSubtracting the two equations:\n$$e(V_2 - V_1) = h(2\\nu - \\nu) = h\\nu \\implies h = \\frac{e(V_2 - V_1)}{\\nu}$$"
  },
  {
    "qnum": 41, "year": 2024,
    "question": "The threshold frequency for a certain metal is $\\nu_0$. When light of frequency $2\\nu_0$ is incident on it, maximum velocity of photoelectrons is $v$. When frequency of incident light is increased to $5\\nu_0$, maximum velocity of photoelectrons will be",
    "options": ["$v$", "$4v$", "$2v$", "$3v$"],
    "explanation": "$$\\frac{1}{2}m v_1^2 = h(2\\nu_0) - h\\nu_0 = h\\nu_0$$\n$$\\frac{1}{2}m v_2^2 = h(5\\nu_0) - h\\nu_0 = 4h\\nu_0$$\n$$\\frac{v_2^2}{v_1^2} = 4 \\implies v_2 = 2v_1 = 2v$$"
  },
  {
    "qnum": 42, "year": 2024,
    "question": "The photoelectric work function for a metal is $2.4\\text{ eV}$. Among the four wavelengths $3000\\text{ \\AA}$, $4000\\text{ \\AA}$, $5000\\text{ \\AA}$, and $6000\\text{ \\AA}$, the wavelength of light for which photoelectric emission CANNOT occur is",
    "options": ["$3000\\text{ \\AA}$", "$4000\\text{ \\AA}$", "$6000\\text{ \\AA}$", "$5000\\text{ \\AA}$"],
    "explanation": "$$\\lambda_0 = \\frac{hc}{W_0} = \\frac{12400\\text{ eV}\\cdot\\text{\\AA}}{2.4\\text{ eV}} \\approx 5167\\text{ \\AA}$$\nPhotoelectric emission occurs only for $\\lambda \\le \\lambda_0$.\nFor $\\lambda = 6000\\text{ \\AA} > 5167\\text{ \\AA}$, photon energy is less than the work function ($E \\approx 2.07\\text{ eV} < 2.4\\text{ eV}$), so emission cannot occur."
  }
]

# Diagram images mapping
diagram_map = {
  5: "/pyq_images/physics/ch25/q5_graphs.png",
  24: "/pyq_images/physics/ch25/q24_stopping_potential.png",
  27: "/pyq_images/physics/ch25/q27_photocurrent.png",
  30: "/pyq_images/physics/ch25/q30_anode_potential.png",
  35: "/pyq_images/physics/ch25/q35_graphs.png"
}

formatted_questions = []
for q in raw_questions:
    qn = q['qnum']
    qid = f"pyq-phys-ch25-{qn:03d}"
    opt_letter = ans_key_map[qn]
    ans_idx = opt_to_idx[opt_letter]
    has_img = qn in diagram_map
    img_url = diagram_map.get(qn, "")
    
    formatted_questions.append({
        "id": qid,
        "subject": "Physics",
        "chapter": "Dual Nature of Radiation and Matter",
        "chapter_number": 25,
        "question": q['question'],
        "options": q['options'],
        "correct_answer": ans_idx,
        "year": q['year'],
        "explanation": q['explanation'],
        "needs_image": has_img,
        "image_url": img_url
    })

print(f"Total formatted questions: {len(formatted_questions)}")

with open('src/data/pyq_physics_ch25.json', 'w', encoding='utf-8') as f:
    json.dump(formatted_questions, f, indent=2, ensure_ascii=False)

print("Saved clean src/data/pyq_physics_ch25.json successfully!")
