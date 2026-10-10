import json, sys, os

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

# Official answer key for Physics Chapter 24: Wave Optics (1 to 55)
ans_key_map = {
    1: 'c', 2: 'c', 3: 'd', 4: 'a', 5: 'd', 6: 'c', 7: 'c', 8: 'd', 9: 'b', 10: 'd',
    11: 'c', 12: 'a', 13: 'c', 14: 'c', 15: 'b', 16: 'd', 17: 'a', 18: 'c', 19: 'a', 20: 'd',
    21: 'a', 22: 'a', 23: 'b', 24: 'b', 25: 'a', 26: 'd', 27: 'b', 28: 'c', 29: 'c', 30: 'a',
    31: 'c', 32: 'a', 33: 'b', 34: 'd', 35: 'a', 36: 'c', 37: 'a', 38: 'b', 39: 'd', 40: 'c',
    41: 'a', 42: 'a', 43: 'd', 44: 'a', 45: 'b', 46: 'b', 47: 'a', 48: 'b', 49: 'd', 50: 'd',
    51: 'd', 52: 'd', 53: 'a', 54: 'c', 55: 'b'
}

opt_to_idx = {'a': 0, 'b': 1, 'c': 2, 'd': 3}

raw_questions = [
  {
    "qnum": 1, "year": 2006,
    "question": "The width of the diffraction band varies",
    "options": [
      "inversely as the wavelength",
      "directly as the width of the slit",
      "directly as the distance between the slit and the screen",
      "inversely as the size of the source from which the slit is illuminated"
    ],
    "explanation": "Width of diffraction band $\\beta = \\frac{\\lambda D}{a}$, where $D$ is the distance between the slit and the screen, $\\lambda$ is the wavelength, and $a$ is the slit width. Thus, the fringe width varies directly as the distance between the slit and the screen."
  },
  {
    "qnum": 2, "year": 2006,
    "question": "A beam of light of intensity $I_0$ is incident on a pair of Nicols making an angle of $60^\\circ$ with each other. The intensity of light emerging from the pair is",
    "options": ["$I_0$", "$I_0/2$", "$I_0/4$", "$I_0/8$"],
    "explanation": "According to Malus's law, the transmitted intensity is:\n$$I = I_0 \\cos^2\\theta = I_0 (\\cos 60^\\circ)^2 = I_0 \\left(\\frac{1}{2}\\right)^2 = \\frac{I_0}{4}$$"
  },
  {
    "qnum": 3, "year": 2006,
    "question": "A beam of light of wavelength $600\\text{ nm}$ from a distant source falls on a single slit $1\\text{ mm}$ wide and the resulting diffraction pattern is observed on a screen $2\\text{ m}$ away. The distance between the first dark fringes on either side of the central bright fringe is",
    "options": ["$1.2\\text{ cm}$", "$1.2\\text{ mm}$", "$2.4\\text{ cm}$", "$2.4\\text{ mm}$"],
    "explanation": "Distance to the first minimum $x = \\frac{\\lambda D}{a} = \\frac{600 \\times 10^{-9} \\times 2}{1 \\times 10^{-3}} = 1.2 \\times 10^{-3}\\text{ m} = 1.2\\text{ mm}$.\nThe distance between the first dark fringes on either side is the width of central maximum:\n$$2x = 2 \\times 1.2\\text{ mm} = 2.4\\text{ mm}$$"
  },
  {
    "qnum": 4, "year": 2006,
    "question": "If white light is used in Newton's rings experiment, the colour observed in the reflected light is complementary to that observed in the transmitted light through the same point. This is due to",
    "options": [
      "$180^\\circ$ change of phase in one of the reflected waves",
      "$90^\\circ$ change of phase in one of the reflected waves",
      "$145^\\circ$ change of phase in one of the reflected waves",
      "$45^\\circ$ change of phase in one of the reflected waves"
    ],
    "explanation": "In reflection at a denser medium (air to glass boundary), an additional phase difference of $\\pi$ ($180^\\circ$) occurs (Stokes' law). There is no such phase shift for transmitted rays. Hence, the conditions for maxima and minima in reflected and transmitted systems are complementary."
  },
  {
    "qnum": 5, "year": 2007,
    "question": "Two coherent sources of intensity ratio $\\beta$ interfere. The intensity of interference at a point is $I_0$. If the sources were incoherent, the intensity at the same point will be",
    "options": ["$4I_0$", "$2I_0$", "$I_0$", "$I_0/2$"],
    "explanation": "For two identical coherent sources ($I_1 = I_2 = I'$), at central maximum $I_{\\max} = 4I' = I_0 \\implies I' = I_0/4$.\nIf the sources were incoherent, the resultant intensity is simply the sum of individual intensities:\n$$I = I_1 + I_2 = 2I' = 2(I_0/4) = \\frac{I_0}{2}$$"
  },
  {
    "qnum": 6, "year": 2007,
    "question": "In Young's double slit experiment with a sodium vapour lamp of wavelength $589\\text{ nm}$ and the slits $0.589\\text{ mm}$ apart, the half angular width of the central maximum is",
    "options": ["$\\sin^{-1}(0.01)$", "$\\sin^{-1}(0.0001)$", "$\\sin^{-1}(0.001)$", "$\\sin^{-1}(0.1)$"],
    "explanation": "Half angular width $\\theta$ is given by:\n$$\\sin\\theta = \\frac{\\lambda}{d} = \\frac{589 \\times 10^{-9}}{0.589 \\times 10^{-3}} = 10^{-3} = 0.001$$\n$$\\theta = \\sin^{-1}(0.001)$$"
  },
  {
    "qnum": 7, "year": 2007,
    "question": "A single slit Fraunhofer diffraction pattern is formed with white light. For what wavelength of light, the third secondary maximum in the diffraction pattern coincides with the second secondary maximum in the pattern for red light of wavelength $6500\\text{ \\AA}$?",
    "options": ["$4400\\text{ \\AA}$", "$4100\\text{ \\AA}$", "$4642.8\\text{ \\AA}$", "$9100\\text{ \\AA}$"],
    "explanation": "The position of secondary maxima in single slit diffraction is given by $(2n + 1)\\frac{\\lambda D}{2a}$.\nFor $n = 3$ (3rd secondary maximum, using $2n+1 = 2(3)+1 = 7$) and $n = 2$ ($2n+1 = 2(2)+1 = 5$):\n$$7\\lambda = 5 \\times 6500 \\implies \\lambda = \\frac{5 \\times 6500}{7} = 4642.8\\text{ \\AA}$$"
  },
  {
    "qnum": 8, "year": 2007,
    "question": "When the angle of incidence is $60^\\circ$ on the surface of a glass slab, it is found that the reflected ray is completely polarised. The velocity of light in glass is",
    "options": ["$2 \\times 10^8\\text{ m s}^{-1}$", "$\\sqrt{3} \\times 10^8\\text{ m s}^{-1}$", "$2 \\times 10^7\\text{ m s}^{-1}$", "$\\sqrt{3} \\times 10^7\\text{ m s}^{-1}$"],
    "explanation": "By Brewster's law:\n$$\\mu = \\tan i_p = \\tan 60^\\circ = \\sqrt{3}$$\n$$v = \\frac{c}{\\mu} = \\frac{3 \\times 10^8}{\\sqrt{3}} = \\sqrt{3} \\times 10^8\\text{ m s}^{-1}$$"
  },
  {
    "qnum": 9, "year": 2008,
    "question": "In Young's double slit experiment, a third slit is made in between the double slits. Then",
    "options": [
      "fringes of unequal width are formed",
      "contrast between bright and dark fringes is reduced",
      "intensity of fringes totally disappears",
      "only bright light is observed on the screen"
    ],
    "explanation": "Adding a third slit increases background illumination and causes multiple wave interference where minimum intensity is no longer completely dark, thereby reducing the contrast between bright and dark fringes."
  },
  {
    "qnum": 10, "year": 2008,
    "question": "In a Fraunhofer diffraction experiment at a single slit of width $a$, if the first secondary maximum is formed at an angle of diffraction $30^\\circ$, then the first secondary minimum is formed at an angle $\\theta$ given by",
    "options": [
      "$\\sin^{-1}\\left(\\frac{1}{4}\\right)$",
      "$\\tan^{-1}\\left(\\frac{2}{3}\\right)$",
      "$\\sin^{-1}\\left(\\frac{2}{3}\\right)$",
      "$\\sin^{-1}\\left(\\frac{1}{3}\\right)$"
    ],
    "explanation": "For the first secondary maximum: $a \\sin 30^\\circ = \\frac{3\\lambda}{2} \\implies a \\left(\\frac{1}{2}\\right) = \\frac{3\\lambda}{2} \\implies \\frac{\\lambda}{a} = \\frac{1}{3}$.\nFor the first secondary minimum: $a \\sin\\theta = \\lambda \\implies \\sin\\theta = \\frac{\\lambda}{a} = \\frac{1}{3} \\implies \\theta = \\sin^{-1}\\left(\\frac{1}{3}\\right)$."
  },
  {
    "qnum": 11, "year": 2008,
    "question": "An unpolarised beam of intensity $I_0$ falls on a polaroid. The intensity of the emergent light is",
    "options": ["$I_0/4$", "zero", "$I_0/2$", "$I_0$"],
    "explanation": "When unpolarised light of intensity $I_0$ passes through an ideal polaroid, half the intensity is transmitted: $I = I_0/2$."
  },
  {
    "qnum": 12, "year": 2009,
    "question": "Two sources are said to be coherent if they produce waves",
    "options": [
      "having a constant phase difference",
      "of equal wavelength",
      "of equal speed",
      "having same shape of wave front"
    ],
    "explanation": "Two sources are coherent if they maintain a constant phase difference over time."
  },
  {
    "qnum": 13, "year": 2009,
    "question": "For constructive interference, the path difference between the two interfering waves must be equal to",
    "options": ["$(2n + 1)\\lambda$", "$2n\\lambda$", "$n\\lambda$", "$(2n + 1)\\frac{\\lambda}{2}$"],
    "explanation": "Constructive interference occurs when the path difference $\\Delta x$ is an integral multiple of wavelength: $\\Delta x = n\\lambda$, where $n = 0, 1, 2, \\dots$"
  },
  {
    "qnum": 14, "year": 2009,
    "question": "According to Newton's corpuscular theory, the speed of light is",
    "options": [
      "same in all the media",
      "lesser in rarer medium",
      "lesser in denser medium",
      "independent of the medium"
    ],
    "explanation": "Newton assumed corpuscles are attracted by the particles of the denser medium, predicting light travels faster in denser media (which was later disproved by Foucault)."
  },
  {
    "qnum": 15, "year": 2010,
    "question": "Red light of wavelength $625\\text{ nm}$ is incident normally on an optical diffraction grating with $2 \\times 10^5\\text{ lines/m}$. Including central principal maxima, how many maxima may be observed on a screen which is far from the grating?",
    "options": ["$15$", "$17$", "$8$", "$16$"],
    "explanation": "Grating element $d = \\frac{1}{N} = \\frac{1}{2 \\times 10^5} = 5 \\times 10^{-6}\\text{ m}$.\nMaximum order $n_{\\max} = \\frac{d}{\\lambda} = \\frac{5 \\times 10^{-6}}{625 \\times 10^{-9}} = 8$.\nTotal number of maxima $= 2n_{\\max} + 1 = 2(8) + 1 = 17$."
  },
  {
    "qnum": 16, "year": 2010,
    "question": "The wavelength of the light used in Young's double slit experiment is $\\lambda$. The intensity at a point on the screen where the path difference is $\\lambda/6$ is $I$. If $I_0$ denotes the maximum intensity, then the ratio of $I$ and $I_0$ is",
    "options": ["$0.866$", "$0.5$", "$0.707$", "$0.75$"],
    "explanation": "Phase difference $\\phi = \\frac{2\\pi}{\\lambda} \\times \\Delta x = \\frac{2\\pi}{\\lambda} \\times \\frac{\\lambda}{6} = \\frac{\\pi}{3} = 60^\\circ$.\n$$I = I_0 \\cos^2\\left(\\frac{\\phi}{2}\\right) = I_0 \\cos^2(30^\\circ) = I_0 \\left(\\frac{\\sqrt{3}}{2}\\right)^2 = \\frac{3}{4}I_0 = 0.75I_0$$\n$$\\frac{I}{I_0} = 0.75$$"
  },
  {
    "qnum": 17, "year": 2010,
    "question": "What is the minimum thickness of a thin film required for constructive interference in the reflected light from it? Given, refractive index of film $= 1.5$, wavelength of light incident $= 600\\text{ nm}$.",
    "options": ["$100\\text{ nm}$", "$300\\text{ nm}$", "$50\\text{ nm}$", "$200\\text{ nm}$"],
    "explanation": "Condition for constructive interference in reflected light is:\n$$2\\mu t = \\left(n + \\frac{1}{2}\\right)\\lambda$$\nFor minimum thickness ($n = 0$):\n$$2\\mu t = \\frac{\\lambda}{2} \\implies t_{\\min} = \\frac{\\lambda}{4\\mu} = \\frac{600}{4(1.5)} = \\frac{600}{6} = 100\\text{ nm}$$"
  },
  {
    "qnum": 18, "year": 2010,
    "question": "The polarizing angle for a transparent medium is $i_p$ such that $\\sin i_p = 0.6$. The Brewster's angle for the same medium is",
    "options": ["$\\tan^{-1}(1.5)$", "$\\sin^{-1}(0.8)$", "$\\tan^{-1}(1.33)$", "$\\tan^{-1}(0.75)$"],
    "explanation": "Brewster's angle $\\theta_B$ is defined by $\\tan\\theta_B = \\mu$.\nGiven $\\sin i_p = 0.6 = \\frac{3}{5} \\implies \\cos i_p = 0.8$.\n$$\\tan\\theta_B = \\frac{\\sin i_p}{\\cos i_p} = \\frac{0.6}{0.8} = 0.75 \\implies \\theta_B = \\tan^{-1}(0.75)$$"
  },
  {
    "qnum": 19, "year": 2011,
    "question": "Light waves of same frequency and same amplitude travel in the same medium. When they interfere, the resultant amplitude at a point having phase difference $\\phi$ depends on",
    "options": ["phase", "amplitude", "frequency", "period"],
    "explanation": "Since amplitudes and frequencies are identical, the resultant amplitude $R = 2a\\cos(\\phi/2)$ depends purely on the phase difference $\\phi$."
  },
  {
    "qnum": 20, "year": 2011,
    "question": "Two monochromatic light waves of amplitudes $3A$ and $2A$ interfering at a point have a phase difference of $60^\\circ$. The intensity at that point will be proportional to",
    "options": ["$5A^2$", "$13A^2$", "$7A^2$", "$19A^2$"],
    "explanation": "$$R^2 = A_1^2 + A_2^2 + 2A_1 A_2 \\cos\\phi = (3A)^2 + (2A)^2 + 2(3A)(2A)\\cos 60^\\circ$$\n$$R^2 = 9A^2 + 4A^2 + 12A^2(1/2) = 13A^2 + 6A^2 = 19A^2$$\nIntensity is directly proportional to $R^2$, so $I \\propto 19A^2$."
  },
  {
    "qnum": 21, "year": 2011,
    "question": "To observe sustained interference pattern in Young's double slit experiment, we require:\n(1) monochromatic light\n(2) narrow and well collimated beam\n(3) coherent sources of light\nWhich of the above are essential conditions?",
    "options": ["(1), (2) and (3)", "(1) and (2)", "(2) and (3)", "(1) and (3)"],
    "explanation": "Monochromaticity, coherency, and narrow collimated beams are standard conditions for clear, high-contrast, sustained interference fringes."
  },
  {
    "qnum": 22, "year": 2011,
    "question": "A parallel beam of light of wavelength $6000\\text{ \\AA}$ gets diffracted by a single slit of width $0.3\\text{ mm}$. The angular position of the first minimum of diffracted light is",
    "options": ["$2 \\times 10^{-3}\\text{ rad}$", "$3 \\times 10^{-3}\\text{ rad}$", "$1.8 \\times 10^{-3}\\text{ rad}$", "$6 \\times 10^{-3}\\text{ rad}$"],
    "explanation": "$$\\theta = \\frac{\\lambda}{a} = \\frac{6000 \\times 10^{-10}\\text{ m}}{0.3 \\times 10^{-3}\\text{ m}} = \\frac{6 \\times 10^{-7}}{3 \\times 10^{-4}} = 2 \\times 10^{-3}\\text{ rad}$$"
  },
  {
    "qnum": 23, "year": 2011,
    "question": "The critical angle for a transparent medium is $C$ such that $\\sin C = \\frac{3}{5}$. The polarizing angle of the medium is",
    "options": ["$\\sin^{-1}(3/5)$", "$\\tan^{-1}(5/3)$", "$\\tan^{-1}(3/5)$", "$\\tan^{-1}(4/5)$"],
    "explanation": "$$\\mu = \\frac{1}{\\sin C} = \\frac{1}{3/5} = \\frac{5}{3}$$\nBy Brewster's law:\n$$\\tan i_p = \\mu = \\frac{5}{3} \\implies i_p = \\tan^{-1}\\left(\\frac{5}{3}\\right)$$"
  },
  {
    "qnum": 24, "year": 2012,
    "question": "Two polaroids are placed with their axes at right angles. A third polaroid is placed between them at $45^\\circ$ to both. If unpolarised light of intensity $I_0$ falls on the first polaroid, the transmitted intensity is",
    "options": ["$I_0/4$", "$I_0/8$", "$I_0/16$", "zero"],
    "explanation": "After first polaroid: $I_1 = I_0/2$.\nAfter middle polaroid (at $45^\\circ$ to first): $I_2 = I_1 \\cos^2 45^\\circ = \\frac{I_0}{2} \\left(\\frac{1}{\\sqrt{2}}\\right)^2 = \\frac{I_0}{4}$.\nAfter third polaroid (at $45^\\circ$ to middle): $I_3 = I_2 \\cos^2 45^\\circ = \\frac{I_0}{4} \\left(\\frac{1}{\\sqrt{2}}\\right)^2 = \\frac{I_0}{8}$."
  },
  {
    "qnum": 25, "year": 2012,
    "question": "In a Young's double slit experiment, if the two slits are of unequal widths, then",
    "options": [
      "the dark fringes are not perfectly dark",
      "the bright fringes will have unequal spacing",
      "the bright fringes will have unequal brightness",
      "fringes do not appear"
    ],
    "explanation": "When slit widths are unequal, the amplitudes $A_1 \\neq A_2$. Therefore, at minima $I_{\\min} \\propto (A_1 - A_2)^2 \\neq 0$, so the dark fringes are not completely dark."
  },
  {
    "qnum": 26, "year": 2012,
    "question": "In a Fraunhofer diffraction at a single slit, if the slit width is doubled, the width of the central diffraction maximum becomes",
    "options": ["doubled", "four times", "unchanged", "halved"],
    "explanation": "Width of central maximum is $\\beta_0 = \\frac{2\\lambda D}{a}$. When slit width $a$ is doubled, $\\beta_0$ is halved."
  },
  {
    "qnum": 27, "year": 2012,
    "question": "The phenomenon of polarization proves that light has",
    "options": ["particle nature", "transverse wave nature", "longitudinal wave nature", "dual nature"],
    "explanation": "Polarization can only occur in transverse waves where vibrations are perpendicular to the direction of wave propagation."
  },
  {
    "qnum": 28, "year": 2013,
    "question": "Which of the following optical phenomena support the wave theory of light?\n(1) Scattering\n(2) Interference\n(3) Diffraction\n(4) Velocity of light in denser medium is less than in rarer medium",
    "options": ["(1), (2), (3)", "(1), (2), (4)", "(2), (3), (4)", "(1), (3), (4)"],
    "explanation": "Interference, diffraction, and wave refraction where $v_{\\text{denser}} < v_{\\text{rarer}}$ are decisive evidence for wave theory."
  },
  {
    "qnum": 29, "year": 2013,
    "question": "A thin film of soap solution (refractive index $\\mu = 1.5$) illuminated by white light has a maximum at $600\\text{ nm}$ and a minimum at $450\\text{ nm}$ with no extrema in between for reflected light. The thickness of the film is",
    "options": ["$1 \\times 10^{-7}\\text{ m}$", "$2 \\times 10^{-7}\\text{ m}$", "$3 \\times 10^{-7}\\text{ m}$", "$4 \\times 10^{-7}\\text{ m}$"],
    "explanation": "For reflection: constructive at $2\\mu t = (n + 1/2)\\lambda_1$, destructive at $2\\mu t = n\\lambda_2$.\n$$(n + 1/2)(600) = n(450) \\implies 600n + 300 = 450n \\implies n = 1\\text{ (orders)}$$\n$$2(1.5)t = (1)(450 \\times 10^{-9}) \\implies 3t = 900 \\times 10^{-9} \\implies t = 3 \\times 10^{-7}\\text{ m}$$"
  },
  {
    "qnum": 30, "year": 2013,
    "question": "A polarimeter tube of length $0.2\\text{ m}$ filled with sugar solution of concentration $C$ produces a rotation of $9^\\circ$ in the plane of vibration of plane polarized light. The same sugar solution is transferred to another tube of length $0.3\\text{ m}$ of same radius. The remaining gap is filled by distilled water. Now the optical rotation produced is",
    "options": ["$9^\\circ$", "$6^\\circ$", "$13.5^\\circ$", "$3^\\circ$"],
    "explanation": "Specific rotation $S = \\frac{\\theta}{l \\times C} \\implies \\theta = S \\cdot l \\cdot C$.\nWhen the same quantity of sugar is diluted into a tube of length $l_2 = 0.3\\text{ m}$, the concentration becomes $C_2 = C \\times \\frac{0.2}{0.3}$.\nTherefore, $\\theta_2 = S \\times l_2 \\times C_2 = S \\times 0.3 \\times \\left(C \\times \\frac{0.2}{0.3}\\right) = S \\cdot 0.2 \\cdot C = \\theta_1 = 9^\\circ$."
  },
  {
    "qnum": 31, "year": 2014,
    "question": "A polarized light of intensity $I_0$ is passed through another polarizer whose pass axis makes an angle of $60^\\circ$ with the pass axis of the former. What is the intensity of emergent polarized light from second polarizer?",
    "options": ["$I_0/5$", "$I_0$", "$I_0/4$", "$I_0/6$"],
    "explanation": "According to Malus's law:\n$$I = I_0 \\cos^2(60^\\circ) = I_0 \\left(\\frac{1}{2}\\right)^2 = \\frac{I_0}{4}$$"
  },
  {
    "qnum": 32, "year": 2015,
    "question": "The polarizing angle of glass is $57^\\circ$. A ray of light which is incident at this angle will have an angle of refraction as",
    "options": ["$33^\\circ$", "$38^\\circ$", "$25^\\circ$", "$43^\\circ$"],
    "explanation": "At Brewster's angle, the reflected and refracted rays are perpendicular:\n$$i_p + r = 90^\\circ \\implies r = 90^\\circ - 57^\\circ = 33^\\circ$$"
  },
  {
    "qnum": 33, "year": 2015,
    "question": "To observe diffraction, the size of the obstacle or aperture",
    "options": [
      "should be $\\lambda/2$",
      "should be of the order of wavelength $\\lambda$",
      "has no relation to wavelength",
      "should be much larger than wavelength"
    ],
    "explanation": "Diffraction is prominent only when the dimensions of the obstacle or aperture are comparable to the wavelength of the wave ($a \\sim \\lambda$)."
  },
  {
    "qnum": 34, "year": 2016,
    "question": "In Young's double slit experiment the source is white light. One slit is covered with a red filter and the other with a blue filter. There shall be",
    "options": [
      "alternate red and blue fringes",
      "alternate dark and pink fringes",
      "alternate dark and yellow fringes",
      "no interference"
    ],
    "explanation": "Interference occurs only between coherent light waves of the same frequency/wavelength. Light through red and blue filters has different frequencies, so no sustained interference pattern is formed."
  },
  {
    "qnum": 35, "year": 2016,
    "question": "Light of wavelength $600\\text{ nm}$ is incident normally on a slit of width $0.2\\text{ mm}$. The angular width of central maxima in the diffraction pattern is (measured from minimum to minimum)",
    "options": [
      "$6 \\times 10^{-3}\\text{ rad}$",
      "$4 \\times 10^{-3}\\text{ rad}$",
      "$2.4 \\times 10^{-3}\\text{ rad}$",
      "$4.5 \\times 10^{-3}\\text{ rad}$"
    ],
    "explanation": "$$2\\theta = \\frac{2\\lambda}{a} = \\frac{2(600 \\times 10^{-9})}{0.2 \\times 10^{-3}} = \\frac{1200 \\times 10^{-9}}{2 \\times 10^{-4}} = 6 \\times 10^{-3}\\text{ rad}$$"
  },
  {
    "qnum": 36, "year": 2017,
    "question": "When a ray of light enters from a rarer medium to a denser medium, then",
    "options": [
      "wavelength and speed increase",
      "wavelength decreases but speed increases",
      "wavelength and speed decrease",
      "wavelength increases but speed decreases"
    ],
    "explanation": "Frequency $\\nu$ remains constant. In a denser medium, refractive index $\\mu > 1$, so speed $v = c/\\mu$ decreases, and wavelength $\\lambda = v/\\nu$ decreases proportionally."
  },
  {
    "qnum": 37, "year": 2017,
    "question": "In Young's double slit experiment, fringe width is found to be $0.4\\text{ mm}$. If the entire apparatus is immersed in water of refractive index $4/3$ without altering the geometry, the new fringe width will be",
    "options": ["$0.3\\text{ mm}$", "$0.53\\text{ mm}$", "$0.4\\text{ mm}$", "$0.16\\text{ mm}$"],
    "explanation": "$$\\beta' = \\frac{\\beta}{\\mu} = \\frac{0.4\\text{ mm}}{4/3} = 0.4 \\times \\frac{3}{4} = 0.3\\text{ mm}$$"
  },
  {
    "qnum": 38, "year": 2018,
    "question": "Parallel beam of light of wavelength $\\lambda$ falls normally on a single slit of width $a$. The angular width of principal maximum is",
    "options": ["$\\lambda/a$", "$2\\lambda/a$", "$a/\\lambda$", "$a/2\\lambda$"],
    "explanation": "The angular width of the central (principal) maximum in single slit Fraunhofer diffraction is $2\\theta = \\frac{2\\lambda}{a}$."
  },
  {
    "qnum": 39, "year": 2018,
    "question": "In a Fraunhofer diffraction at a single slit, if yellow light illuminating the slit is replaced by blue light, then diffraction bands",
    "options": ["remain unchanged", "become wider", "disappear", "become narrower"],
    "explanation": "Since $\\lambda_{\\text{blue}} < \\lambda_{\\text{yellow}}$ and fringe width $\\beta \\propto \\lambda$, the diffraction fringes become narrower."
  },
  {
    "qnum": 40, "year": 2018,
    "question": "In Young's double slit experiment, two wavelengths $\\lambda_1 = 780\\text{ nm}$ and $\\lambda_2 = 520\\text{ nm}$ are used to obtain interference fringes. If the $n^{\\text{th}}$ bright band due to $\\lambda_1$ coincides with $(n + 1)^{\\text{th}}$ bright band due to $\\lambda_2$, then the value of $n$ is",
    "options": ["$4$", "$3$", "$2$", "$6$"],
    "explanation": "$$n\\lambda_1 = (n + 1)\\lambda_2 \\implies n(780) = (n + 1)(520)$$\n$$\\frac{n + 1}{n} = \\frac{780}{520} = \\frac{3}{2} \\implies 2n + 2 = 3n \\implies n = 2$$"
  },
  {
    "qnum": 41, "year": 2018,
    "question": "In Young's double slit experiment, slits are separated by $2\\text{ mm}$ and the screen is placed at a distance of $1.2\\text{ m}$ from the slits. Light consisting of two wavelengths $6500\\text{ \\AA}$ and $5200\\text{ \\AA}$ are used. The separation between the fourth bright fringes of the two wavelengths is",
    "options": ["$0.312\\text{ mm}$", "$0.123\\text{ mm}$", "$0.213\\text{ mm}$", "$0.412\\text{ mm}$"],
    "explanation": "$$y_4(\\lambda_1) - y_4(\\lambda_2) = \\frac{4D}{d}(\\lambda_1 - \\lambda_2)$$\n$$= \\frac{4(1.2)}{2 \\times 10^{-3}}(6500 - 5200) \\times 10^{-10} = 2.4 \\times 10^3 \\times 1300 \\times 10^{-10} = 0.312 \\times 10^{-3}\\text{ m} = 0.312\\text{ mm}$$"
  },
  {
    "qnum": 42, "year": 2019,
    "question": "For a transparent medium, the polarizing angle is $i_p$. If the refractive index of the medium is $\\sqrt{3}$, the value of Brewster's angle is",
    "options": ["$60^\\circ$", "$30^\\circ$", "$90^\\circ$", "$45^\\circ$"],
    "explanation": "By Brewster's law:\n$$\\tan i_p = \\mu = \\sqrt{3} \\implies i_p = 60^\\circ$$"
  },
  {
    "qnum": 43, "year": 2019,
    "question": "In Young's double slit experiment, the maximum intensity on the screen is $K$. The intensity at a point where the path difference is $\\lambda/3$ is",
    "options": ["$4K$", "$K$", "$2K$", "$K/4$"],
    "explanation": "Phase difference $\\phi = \\frac{2\\pi}{\\lambda} \\times \\frac{\\lambda}{3} = \\frac{2\\pi}{3} = 120^\\circ$.\n$$I = K \\cos^2\\left(\\frac{\\phi}{2}\\right) = K \\cos^2(60^\\circ) = K \\left(\\frac{1}{2}\\right)^2 = \\frac{K}{4}$$"
  },
  {
    "qnum": 44, "year": 2020,
    "question": "Unpolarised light of intensity $32\\text{ W m}^{-2}$ passes through three polaroids such that the transmission axis of the last polaroid is crossed with that of the first. If the intensity of emergent light is $3\\text{ W m}^{-2}$, the angle between the transmission axes of the first two polaroids is",
    "options": ["$30^\\circ$", "$45^\\circ$", "$60^\\circ$", "$90^\\circ$"],
    "explanation": "Intensity after first polaroid: $I_1 = 32 / 2 = 16\\text{ W m}^{-2}$.\nLet angle be $\\theta$. Then angle between 2nd and 3rd is $90^\\circ - \\theta$.\n$$I_3 = I_1 \\cos^2\\theta \\sin^2\\theta = 16 \\left(\\frac{\\sin 2\\theta}{2}\\right)^2 = 4 \\sin^2(2\\theta)$$\n$$3 = 4 \\sin^2(2\\theta) \\implies \\sin(2\\theta) = \\frac{\\sqrt{3}}{2} \\implies 2\\theta = 60^\\circ \\implies \\theta = 30^\\circ$$"
  },
  {
    "qnum": 45, "year": 2020,
    "question": "The ratio of intensities of two interfering waves is $4 : 1$. The ratio of maximum to minimum intensity in the interference pattern is",
    "options": ["$3 : 1$", "$9 : 1$", "$5 : 1$", "$16 : 1$"],
    "explanation": "$$\\frac{I_{\\max}}{I_{\\min}} = \\left(\\frac{\\sqrt{I_1} + \\sqrt{I_2}}{\\sqrt{I_1} - \\sqrt{I_2}}\\right)^2 = \\left(\\frac{\\sqrt{4} + \\sqrt{1}}{\\sqrt{4} - \\sqrt{1}}\\right)^2 = \\left(\\frac{2 + 1}{2 - 1}\\right)^2 = \\left(\\frac{3}{1}\\right)^2 = 9 : 1$$"
  },
  {
    "qnum": 46, "year": 2021,
    "question": "In a Young's double slit experiment, if the distance between the two slits is halved and the distance between the slits and the screen is doubled, the fringe width will be",
    "options": ["halved", "four times", "doubled", "unchanged"],
    "explanation": "Fringe width $\\beta = \\frac{\\lambda D}{d}$.\n$$\\beta' = \\frac{\\lambda (2D)}{d/2} = 4\\left(\\frac{\\lambda D}{d}\\right) = 4\\beta$$"
  },
  {
    "qnum": 47, "year": 2021,
    "question": "A beam of light consists of two wavelengths $650\\text{ nm}$ and $520\\text{ nm}$. The distance between third bright fringe of $650\\text{ nm}$ and the fourth bright fringe of $520\\text{ nm}$ from the central maximum is (given $D/d = 1000$)",
    "options": ["$0.13\\text{ mm}$", "$0.26\\text{ mm}$", "$0.39\\text{ mm}$", "$0.52\\text{ mm}$"],
    "explanation": "$$y_3(650) = 3(650 \\times 10^{-9})(1000) = 1.95 \\times 10^{-3}\\text{ m} = 1.95\\text{ mm}$$\n$$y_4(520) = 4(520 \\times 10^{-9})(1000) = 2.08 \\times 10^{-3}\\text{ m} = 2.08\\text{ mm}$$\n$$\\Delta y = 2.08 - 1.95 = 0.13\\text{ mm}$$"
  },
  {
    "qnum": 48, "year": 2021,
    "question": "Polarising angle for a transparent medium is $60^\\circ$. The critical angle for the same medium is",
    "options": ["$\\sin^{-1}(1/2)$", "$\\sin^{-1}(1/\\sqrt{3})$", "$\\sin^{-1}(\\sqrt{3}/2)$", "$\\sin^{-1}(2/\\sqrt{3})$"],
    "explanation": "$$\\mu = \\tan 60^\\circ = \\sqrt{3}$$\n$$\\sin C = \\frac{1}{\\mu} = \\frac{1}{\\sqrt{3}} \\implies C = \\sin^{-1}\\left(\\frac{1}{\\sqrt{3}}\\right)$$"
  },
  {
    "qnum": 49, "year": 2022,
    "question": "In a single slit diffraction experiment, the first minimum for red light ($\\lambda = 660\\text{ nm}$) coincides with the first maximum of another wavelength $\\lambda'$. The value of $\\lambda'$ is",
    "options": ["$330\\text{ nm}$", "$550\\text{ nm}$", "$660\\text{ nm}$", "$440\\text{ nm}$"],
    "explanation": "First minimum of red light: $a\\sin\\theta = \\lambda_R$.\nFirst maximum of wavelength $\\lambda'$: $a\\sin\\theta = \\frac{3}{2}\\lambda'$.\n$$\\lambda_R = \\frac{3}{2}\\lambda' \\implies \\lambda' = \\frac{2}{3}\\lambda_R = \\frac{2}{3}(660) = 440\\text{ nm}$$"
  },
  {
    "qnum": 50, "year": 2022,
    "question": "In Young's double slit experiment, the fringe width is $\\beta$. If the entire apparatus is immersed in liquid of refractive index $\\mu$, the fringe width becomes",
    "options": ["$\\mu\\beta$", "$\\mu^2\\beta$", "$\\beta/\\mu^2$", "$\\beta/\\mu$"],
    "explanation": "In medium of refractive index $\\mu$, wavelength becomes $\\lambda' = \\lambda/\\mu$. Therefore, the new fringe width is $\\beta' = \\frac{\\lambda' D}{d} = \\frac{\\beta}{\\mu}$."
  },
  {
    "qnum": 51, "year": 2022,
    "question": "Two polaroids are crossed at $90^\\circ$ to each other. When an unpolarised light of intensity $I_0$ is incident on the combination, the transmitted intensity is",
    "options": ["$I_0/2$", "$I_0/4$", "$I_0/8$", "zero"],
    "explanation": "When two polaroids have crossed transmission axes ($\\theta = 90^\\circ$), by Malus's law $I = I_1 \\cos^2 90^\\circ = 0$."
  },
  {
    "qnum": 52, "year": 2023,
    "question": "According to Huygens principle, the surface of secondary wavelets at any later instant gives the new position of the wavefront. The speeds of propagation of primary wavefront and secondary wavelets are",
    "options": [
      "primary wavefronts are larger than those of secondary wavelets",
      "primary wavefronts are lesser than those of secondary wavelets",
      "primary wavefronts are greater than or equal to those of secondary wavelets",
      "primary wavefront and wavelets are equal"
    ],
    "explanation": "According to Huygens' principle, every point on a wavefront acts as a secondary source radiating wavelets with the same speed as the original wave in the medium."
  },
  {
    "qnum": 53, "year": 2023,
    "question": "An unpolarised light of intensity $I_0$ is passed through two polaroids kept one after the other with their planes parallel. The intensity of light emerging from the second polaroid is $I_0/4$. The angle between the pass axes of the polaroids is",
    "options": ["$45^\\circ$", "$0^\\circ$", "$60^\\circ$", "$30^\\circ$"],
    "explanation": "After first polaroid: $I_1 = I_0/2$.\nAfter second polaroid: $I_2 = I_1 \\cos^2\\theta = \\frac{I_0}{2}\\cos^2\\theta$.\nGiven $I_2 = I_0/4$:\n$$\\frac{I_0}{2}\\cos^2\\theta = \\frac{I_0}{4} \\implies \\cos^2\\theta = \\frac{1}{2} \\implies \\cos\\theta = \\frac{1}{\\sqrt{2}} \\implies \\theta = 45^\\circ$$"
  },
  {
    "qnum": 54, "year": 2023,
    "question": "In Young's double slit experiment, the intensity of light passing through each of the two slits is $2 \\times 10^{-2}\\text{ W m}^{-2}$. The fringe width is $\\beta$. At a point $P$ on the screen at distance $x = \\beta/3$ from central maximum, the total light intensity is",
    "options": [
      "$8 \\times 10^{-2}\\text{ W m}^{-2}$",
      "$4 \\times 10^{-2}\\text{ W m}^{-2}$",
      "$2 \\times 10^{-2}\\text{ W m}^{-2}$",
      "$16 \\times 10^{-2}\\text{ W m}^{-2}$"
    ],
    "explanation": "Path difference $\\Delta x = \\frac{d x}{D}$. Since $\\beta = \\frac{\\lambda D}{d}$, $x = \\beta/3 = \\frac{\\lambda D}{3d} \\implies \\Delta x = \\lambda/3$.\nPhase difference $\\phi = \\frac{2\\pi}{\\lambda}(\\lambda/3) = \\frac{2\\pi}{3} = 120^\\circ$.\nResultant intensity for two sources of individual intensity $I = 2 \\times 10^{-2}\\text{ W m}^{-2}$:\n$$I_{\\text{res}} = 4I \\cos^2(\\phi/2) = 4(2 \\times 10^{-2})\\cos^2(60^\\circ) = 8 \\times 10^{-2} \\left(\\frac{1}{4}\\right) = 2 \\times 10^{-2}\\text{ W m}^{-2}$$"
  },
  {
    "qnum": 55, "year": 2024,
    "question": "Three polaroid sheets are co-axially placed as indicated in the diagram. Pass axes of the polaroids 2 and 3 make $30^\\circ$ and $90^\\circ$ with pass axis of polaroid sheet 1. If $I_0$ is the intensity of the incident unpolarised light entering sheet 1, the intensity of the emergent light through sheet 3 is",
    "options": ["zero", "$\\frac{3}{32}I_0$", "$\\frac{3}{16}I_0$", "$\\frac{3}{8}I_0$"],
    "explanation": "After polaroid 1: $I_1 = I_0/2$.\nAngle between 1 and 2 is $\\theta_1 = 30^\\circ$:\n$$I_2 = I_1 \\cos^2(30^\\circ) = \\frac{I_0}{2}\\left(\\frac{\\sqrt{3}}{2}\\right)^2 = \\frac{3}{8}I_0$$\nAngle between 2 and 3 is $\\theta_2 = 90^\\circ - 30^\\circ = 60^\\circ$:\n$$I_3 = I_2 \\cos^2(60^\\circ) = \\frac{3}{8}I_0 \\left(\\frac{1}{2}\\right)^2 = \\frac{3}{32}I_0$$"
  }
]

formatted_questions = []
for q in raw_questions:
    qn = q['qnum']
    qid = f"pyq-phys-ch24-{qn:03d}"
    opt_letter = ans_key_map[qn]
    ans_idx = opt_to_idx[opt_letter]
    has_img = (qn == 55)
    img_url = "/pyq_images/physics/ch24/q55_polaroids.png" if has_img else ""
    
    formatted_questions.append({
        "id": qid,
        "subject": "Physics",
        "chapter": "Wave Optics",
        "chapter_number": 24,
        "question": q['question'],
        "options": q['options'],
        "correct_answer": ans_idx,
        "year": q['year'],
        "explanation": q['explanation'],
        "needs_image": has_img,
        "image_url": img_url
    })

print(f"Total formatted questions: {len(formatted_questions)}")

with open('src/data/pyq_physics_ch24.json', 'w', encoding='utf-8') as f:
    json.dump(formatted_questions, f, indent=2, ensure_ascii=False)

print("Saved clean src/data/pyq_physics_ch24.json successfully!")
