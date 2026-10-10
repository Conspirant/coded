import json, sys, os

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

# Strict answer key mapping (1 to 76)
ans_key_map = {
  1: "c", 2: "a", 3: "b", 4: "c", 5: "a", 6: "c", 7: "b", 8: "b", 9: "b", 10: "a",
  11: "c", 12: "a", 13: "d", 14: "c", 15: "d", 16: "c", 17: "d", 18: "b", 19: "b", 20: "d",
  21: "c", 22: "b", 23: "a", 24: "a", 25: "d", 26: "c", 27: "c", 28: "b", 29: "d", 30: "d",
  31: "c", 32: "b", 33: "d", 34: "a", 35: "c", 36: "c", 37: "b", 38: "a", 39: "d", 40: "b",
  41: "d", 42: "d", 43: "a", 44: "b", 45: "a", 46: "d", 47: "a", 48: "c", 49: "b", 50: "a",
  51: "b", 52: "c", 53: "c", 54: "a", 55: "a", 56: "c", 57: "b", 58: "a", 59: "b", 60: "b",
  61: "d", 62: "d", 63: "b", 64: "b", 65: "c", 66: "c", 67: "b", 68: "b", 69: "c", 70: "c",
  71: "b", 72: "d", 73: "d", 74: "c", 75: "a", 76: "d"
}

opt_to_idx = {'a': 0, 'b': 1, 'c': 2, 'd': 3}

# All 76 questions for Physics Chapter 23: Ray Optics and Optical Instruments
raw_questions = [
  {
    "qnum": 1,
    "year": 2006,
    "question": "The twinkling effect of star light is due to",
    "options": [
      "total internal reflection",
      "high dense matter of star",
      "the fluctuating apparent position of the star being slightly different from the actual position of the star due to atmospheric refraction",
      "constant burning of hydrogen in the star"
    ],
    "explanation": "Twinkling of stars is caused by atmospheric refraction of starlight. Since the atmosphere consists of layers of varying optical density and temperature continuously fluctuating, the apparent position and intensity of starlight continuously fluctuates."
  },
  {
    "qnum": 2,
    "year": 2006,
    "question": "A transparent cube of 0.21 m edge contains a small air bubble. Its apparent distance when viewed through one face of the cube is 0.10 m and when viewed from the opposite face is 0.04 m. The actual distance of the bubble from the second face of the cube is",
    "options": ["0.06 m", "0.17 m", "0.05 m", "0.04 m"],
    "explanation": "Let actual distance from the second face be $x$. Then from the first face it is $(0.21 - x)$.\n$$\\mu = \\frac{\\text{Real Depth}}{\\text{Apparent Depth}} \\Rightarrow \\frac{0.21 - x}{0.10} = \\frac{x}{0.04}$$\n$$0.04(0.21 - x) = 0.10x \\Rightarrow 0.0084 = 0.14x \\Rightarrow x = 0.06\\text{ m}$$"
  },
  {
    "qnum": 3,
    "year": 2006,
    "question": "White light is incident on one of the refracting surfaces of a prism of angle $5^\\circ$. If the refractive indices for red and blue colours are 1.641 and 1.659 respectively, the angular separation between these two colours when they emerge out of the prism is",
    "options": ["$0.9^\\circ$", "$0.09^\\circ$", "$1.8^\\circ$", "$1.2^\\circ$"],
    "explanation": "Angular dispersion $\\theta = (\\mu_b - \\mu_r)A = (1.659 - 1.641) \\times 5^\\circ = 0.018 \\times 5^\\circ = 0.09^\\circ$."
  },
  {
    "qnum": 4,
    "year": 2006,
    "question": "For a given lens, the magnification was found to be twice as large as when the object was 0.15 m distant from it as when the distance was 0.2 m. The focal length of the lens is",
    "options": ["0.15 m", "0.20 m", "0.10 m", "0.05 m"],
    "explanation": "Magnification $m = \\frac{f}{f + u}$.\nGiven $m_1 = 2m_2$ for $u_1 = -0.15\\text{ m}$ and $u_2 = -0.2\\text{ m}$:\n$$\\frac{f}{f - 0.15} = 2 \\left(\\frac{f}{f - 0.2}\\right) \\Rightarrow f - 0.2 = 2(f - 0.15) \\Rightarrow f = 0.10\\text{ m}$$"
  },
  {
    "qnum": 5,
    "year": 2006,
    "question": "To a fish under water, viewing obliquely a fisherman standing on the bank of a lake, the man looks",
    "options": [
      "taller than what he actually is",
      "shorter than what he actually is",
      "the same height as he actually is",
      "depends on the obliquity"
    ],
    "explanation": "When light travels from rarer medium (air) to denser medium (water), it bends towards the normal. Thus the apparent height is $h' = \\mu h > h$, so the man looks taller to the fish."
  },
  {
    "qnum": 6,
    "year": 2006,
    "question": "A thin prism $P_1$ with angle $4^\\circ$ and made from glass of refractive index 1.54 is combined with another thin prism $P_2$ made from glass of refractive index 1.72 to produce dispersion without deviation. The angle of the prism $P_2$ is",
    "options": ["$5.33^\\circ$", "$4^\\circ$", "$3^\\circ$", "$2.6^\\circ$"],
    "explanation": "For zero deviation:\n$$(\\mu_1 - 1)A_1 + (\\mu_2 - 1)A_2 = 0 \\Rightarrow A_2 = -\\frac{(\\mu_1 - 1)A_1}{\\mu_2 - 1} = -\\frac{(1.54 - 1)(4^\\circ)}{1.72 - 1} = -3^\\circ$$\nMagnitude of angle is $3^\\circ$."
  },
  {
    "qnum": 7,
    "year": 2007,
    "question": "A ray of light is travelling from glass to air. (Refractive index of glass = 1.5). The angle of incidence is $50^\\circ$. The deviation of the ray is",
    "options": ["$0^\\circ$", "$80^\\circ$", "$50^\\circ - \\sin^{-1}(1/1.5)$", "$\\sin^{-1}(1/1.5) - 50^\\circ$"],
    "explanation": "Critical angle $C = \\sin^{-1}(1/1.5) \\approx 41.8^\\circ$. Since $i = 50^\\circ > C$, total internal reflection occurs.\nDeviation $\\delta = 180^\\circ - 2i = 180^\\circ - 2(50^\\circ) = 80^\\circ$."
  },
  {
    "qnum": 8,
    "year": 2007,
    "question": "A vessel of height $2d$ is half-filled with a liquid of refractive index $\\sqrt{2}$ and the other half with a liquid of refractive index $n$. (The given liquids are immiscible). Then the apparent depth of the inner surface of the bottom of the vessel (neglecting the thickness of the bottom of the vessel) will be",
    "options": ["$\\frac{d(n+\\sqrt{2})}{\\sqrt{2}n}$", "$\\frac{d(n+\\sqrt{2})}{n\\sqrt{2}}$", "$\\frac{nd}{d(n+\\sqrt{2})}$", "$\\frac{d(n+\\sqrt{2})}{2}$"],
    "explanation": "Total apparent depth $= \\frac{d}{\\mu_1} + \\frac{d}{\\mu_2} = \\frac{d}{\\sqrt{2}} + \\frac{d}{n} = \\frac{d(n + \\sqrt{2})}{n\\sqrt{2}}$."
  },
  {
    "qnum": 9,
    "year": 2007,
    "question": "A ray of light is incident normally on one face of a right angled isosceles prism. It then grazes the hypotenuse. The refractive index of the material of the prism is",
    "options": ["1.33", "1.414", "1.5", "1.732"],
    "explanation": "At the hypotenuse face, angle of incidence is $45^\\circ$. Since the ray grazes the surface, $i = C = 45^\\circ$.\n$$\\mu = \\frac{1}{\\sin C} = \\frac{1}{\\sin 45^\\circ} = \\sqrt{2} \\approx 1.414$$"
  },
  {
    "qnum": 10,
    "year": 2007,
    "question": "Two thin equiconvex lenses each of focal length 0.2 m are placed coaxially with their optic centres 0.5 m apart. Then the focal length of the combination is",
    "options": ["-0.4 m", "-0.1 m", "0.4 m", "0.1 m"],
    "explanation": "Equivalent focal length $\\frac{1}{F} = \\frac{1}{f_1} + \\frac{1}{f_2} - \\frac{d}{f_1 f_2} = \\frac{1}{0.2} + \\frac{1}{0.2} - \\frac{0.5}{0.04} = 10 - 12.5 = -2.5\\text{ m}^{-1} \\Rightarrow F = -0.4\\text{ m}$."
  },
  {
    "qnum": 11,
    "year": 2007,
    "question": "A prism of certain angle deviates the red and blue rays by $8^\\circ$ and $12^\\circ$ respectively. Another prism of the same angle deviates the red and blue rays by $10^\\circ$ and $14^\\circ$ respectively. The dispersive powers of the two prisms are in the ratio",
    "options": ["$9 : 11$", "$11 : 9$", "$6 : 5$", "$5 : 6$"],
    "explanation": "Dispersive power $\\omega = \\frac{\\delta_b - \\delta_r}{\\delta_{mean}}$.\n$\\omega_1 = \\frac{12 - 8}{(12 + 8)/2} = \\frac{4}{10} = \\frac{2}{5}$.\n$\\omega_2 = \\frac{14 - 10}{(14 + 10)/2} = \\frac{4}{12} = \\frac{1}{3}$.\n$$\\frac{\\omega_1}{\\omega_2} = \\frac{2/5}{1/3} = \\frac{6}{5} = 6 : 5$$"
  },
  {
    "qnum": 12,
    "year": 2007,
    "question": "A ray of light enters from a rarer to a denser medium. The angle of incidence is $i$. Then the reflected and refracted rays are mutually perpendicular to each other. The critical angle for the pair of media is",
    "options": ["$\\sin^{-1}(\\cot i)$", "$\\cos^{-1}(\\tan i)$", "$\\sin^{-1}(\\tan i)$", "$\\tan^{-1}(\\sin i)$"],
    "explanation": "From Brewster's Law, when reflected and refracted rays are perpendicular, $\\mu = \\tan i$.\nCritical angle $C = \\sin^{-1}(1/\\mu) = \\sin^{-1}(1/\\tan i) = \\sin^{-1}(\\cot i)$."
  },
  {
    "qnum": 13,
    "year": 2007,
    "question": "A concave lens of focal length 20 cm produces an image half the size of the real object. The distance of the real object is",
    "options": ["-10 cm", "-60 cm", "-30 cm", "-20 cm"],
    "explanation": "For a concave lens, $f = -20\\text{ cm}$ and $m = +1/2$.\n$$m = \\frac{f}{f + u} \\Rightarrow \\frac{1}{2} = \\frac{-20}{-20 + u} \\Rightarrow -20 + u = -40 \\Rightarrow u = -20\\text{ cm}$$"
  },
  {
    "qnum": 14,
    "year": 2008,
    "question": "A mixture of blue, green and red coloured rays is incident normally on a right angled prism. The critical angles of the material of the prism for red, green and blue are $46^\\circ$, $44^\\circ$ and $43^\\circ$ respectively. The arrangement will separate",
    "options": [
      "all the three colours",
      "none of the three colours",
      "red colour from green and blue colours",
      "blue colour from red and green colours"
    ],
    "explanation": "At the hypotenuse face, angle of incidence $i = 45^\\circ$. Since $C_R = 46^\\circ > 45^\\circ$, red ray refracts out. For green ($C_G = 44^\\circ < 45^\\circ$) and blue ($C_B = 43^\\circ < 45^\\circ$), total internal reflection takes place. Thus, red is separated from green and blue."
  },
  {
    "qnum": 15,
    "year": 2008,
    "question": "A convex and a concave lens separated by distance $d$ are then put in contact. The focal length of the combination",
    "options": ["becomes zero", "remains the same", "decreases", "increases"],
    "explanation": "When separated: $\\frac{1}{F_1} = \\frac{1}{f_1} - \\frac{1}{f_2} + \\frac{d}{f_1 f_2}$. When in contact: $\\frac{1}{F_2} = \\frac{1}{f_1} - \\frac{1}{f_2}$. Since $\\frac{1}{F_2} < \\frac{1}{F_1}$, the equivalent focal length increases."
  },
  {
    "qnum": 16,
    "year": 2008,
    "question": "A ray of light is incident at an angle $i$ on a glass slab of refractive index $\\mu$. The angle between reflected and refracted light is $90^\\circ$. Then the relationship between $i$ and $\\mu$ is",
    "options": ["$i = \\sin^{-1}(\\mu)$", "$i = \\cos^{-1}(\\mu)$", "$i = \\tan^{-1}(\\mu)$", "$\\mu = \\cot i$"],
    "explanation": "According to Brewster's law, when reflected and refracted rays are perpendicular to each other, $\\mu = \\tan i \\Rightarrow i = \\tan^{-1}(\\mu)$."
  },
  {
    "qnum": 17,
    "year": 2008,
    "question": "The power of a biconvex lens is 10 D and the radius of curvature of each surface is 10 cm. Then the refractive index of the material of the lens is",
    "options": ["1.33", "1.4", "1.6", "1.5"],
    "explanation": "$f = \\frac{1}{10}\\text{ m} = 10\\text{ cm}$. By Lens Maker's Formula:\n$$\\frac{1}{f} = (\\mu - 1)\\left(\\frac{1}{R_1} - \\frac{1}{R_2}\\right) = (\\mu - 1)\\frac{2}{10} \\Rightarrow \\frac{1}{10} = (\\mu - 1)\\frac{2}{10} \\Rightarrow \\mu = 1.5$$"
  },
  {
    "qnum": 18,
    "year": 2009,
    "question": "A light ray is travelling from a denser medium to a rarer medium. If the critical angle is $C$, then the maximum possible deviation of the ray is",
    "options": ["$\\pi - C$", "$\\pi - 2C$", "$2C$", "$\\frac{\\pi}{2} - C$"],
    "explanation": "Maximum deviation occurs when total internal reflection occurs at the critical angle $i = C$: $\\delta_{max} = 180^\\circ - 2C = \\pi - 2C$."
  },
  {
    "qnum": 19,
    "year": 2009,
    "question": "The angle of minimum deviation for an incident light ray on an equilateral prism is equal to its refracting angle. The refractive index of its material is",
    "options": ["$1.5$", "$\\sqrt{3}$", "$1.414$", "$2$"],
    "explanation": "Prism angle $A = 60^\\circ$ and $\\delta_m = 60^\\circ$.\n$$\\mu = \\frac{\\sin\\left(\\frac{A+\\delta_m}{2}\\right)}{\\sin(A/2)} = \\frac{\\sin 60^\\circ}{\\sin 30^\\circ} = \\frac{\\sqrt{3}/2}{1/2} = \\sqrt{3}$$"
  },
  {
    "qnum": 20,
    "year": 2009,
    "question": "A parallel beam of light is incident on a converging lens parallel to its principal axis. As one moves away from the lens on the other side on its principal axis, the intensity of light",
    "options": [
      "first decreases and then increases",
      "continuously increases",
      "continuously decreases",
      "first increases and then decreases"
    ],
    "explanation": "Light rays converge at the focus where the cross-sectional area of the beam is minimum (intensity is maximum), and then diverge beyond the focus (intensity decreases). Hence, intensity first increases and then decreases."
  },
  {
    "qnum": 21,
    "year": 2009,
    "question": "A person wants a real image of his own, 3 times enlarged. Where should he stand in front of a concave mirror of radius of curvature 30 cm?",
    "options": ["30 cm", "10 cm", "20 cm", "15 cm"],
    "explanation": "Concave mirror $f = -R/2 = -15\\text{ cm}$. Real, enlarged image means $m = -3$.\n$$m = \\frac{f}{f - u} \\Rightarrow -3 = \\frac{-15}{-15 - u} \\Rightarrow 45 + 3u = -15 \\Rightarrow 3u = -60 \\Rightarrow u = -20\\text{ cm}$$"
  },
  {
    "qnum": 22,
    "year": 2010,
    "question": "A car is fitted with a convex mirror of focal length 20 cm. A second car 2 m broad and 1.6 m high is 6 m away from the first car. The position of the second car as seen in the mirror of the first car is",
    "options": ["19.35 cm", "19.35 cm behind the mirror", "20 cm behind the mirror", "18.5 cm behind the mirror"],
    "explanation": "Convex mirror $f = +20\\text{ cm}$, $u = -6\\text{ m} = -600\\text{ cm}$.\n$$\\frac{1}{v} = \\frac{1}{f} - \\frac{1}{u} = \\frac{1}{20} - \\left(-\\frac{1}{600}\\right) = \\frac{30 + 1}{600} = \\frac{31}{600} \\Rightarrow v = +\\frac{600}{31} \\approx +19.35\\text{ cm}$$"
  },
  {
    "qnum": 23,
    "year": 2010,
    "question": "A ray of light passes through three parallel media A, B, and C with refractive indices $\\mu_A, \\mu_B, \\mu_C$ as shown in the diagram. If the ray goes straight across parallel interfaces, then the correct relation is",
    "options": [
      "$\\mu_A < \\mu_B < \\mu_C$",
      "$\\mu_A > \\mu_B > \\mu_C$",
      "$\\mu_B < \\mu_A < \\mu_C$",
      "$\\mu_A = \\mu_B = \\mu_C$"
    ],
    "explanation": "As the ray travels from medium A to B to C, it bends progressively towards the normal in each subsequent medium ($r < i$). Hence, $\\mu_A < \\mu_B < \\mu_C$."
  },
  {
    "qnum": 24,
    "year": 2010,
    "question": "A convex lens is dipped in a liquid whose refractive index is equal to the refractive index of the lens. Then its focal length will",
    "options": ["become infinite", "become zero", "remain unchanged", "become small, but non-zero"],
    "explanation": "By Lens Maker's Formula: $\\frac{1}{f} = \\left(\\frac{\\mu_L}{\\mu_m} - 1\\right)\\left(\\frac{1}{R_1} - \\frac{1}{R_2}\\right)$. When $\\mu_L = \\mu_m$, $\\frac{1}{f} = 0 \\Rightarrow f = \\infty$. The lens behaves like a flat transparent plate."
  },
  {
    "qnum": 25,
    "year": 2010,
    "question": "An astronomical telescope has an angular magnification of magnitude 5 for distant objects. The separation between the objective and the eyepiece is 36 cm and the final image is formed at infinity. The focal length of the objective and eyepiece are",
    "options": ["45 cm and -9 cm", "50 cm and 10 cm", "7.2 cm and 5 cm", "30 cm and 6 cm"],
    "explanation": "Magnification $m = \\frac{f_o}{f_e} = 5 \\Rightarrow f_o = 5f_e$.\nTube length $L = f_o + f_e = 36\\text{ cm} \\Rightarrow 5f_e + f_e = 36 \\Rightarrow 6f_e = 36 \\Rightarrow f_e = 6\\text{ cm}$, $f_o = 30\\text{ cm}$."
  },
  {
    "qnum": 26,
    "year": 2011,
    "question": "A ray of light is incident on a surface of glass slab at an angle of $45^\\circ$. If the lateral shift produced per unit thickness is $\\frac{1}{\\sqrt{3}}$, the angle of refraction produced is",
    "options": ["$\\tan^{-1}\\left(\\frac{\\sqrt{3}}{2}\\right)$", "$\\sin^{-1}\\left(\\frac{2}{\\sqrt{3}}\\right)$", "$\\sin^{-1}\\left(1 - \\sqrt{\\frac{2}{3}}\\right)$", "$\\tan^{-1}\\left(\\frac{1}{\\sqrt{3}}\\right)$"],
    "explanation": "Lateral shift $d = t \\frac{\\sin(i - r)}{\\cos r} \\Rightarrow \\frac{d}{t} = \\frac{\\sin(45^\\circ - r)}{\\cos r} = \\frac{1}{\\sqrt{3}}$.\nSolving gives angle of refraction $r = \\sin^{-1}\\left(1 - \\sqrt{2/3}\\right)$."
  },
  {
    "qnum": 27,
    "year": 2011,
    "question": "A convex lens of focal length $f$ produces an image $\\frac{1}{n}$ times the size of the object. The distance of the object from the lens is",
    "options": ["$nf$", "$\\frac{f}{n}$", "$(n + 1)f$", "$(n - 1)f$"],
    "explanation": "Magnification for a real diminished image is $m = -1/n$.\n$$m = \\frac{f}{f + u} \\Rightarrow -\\frac{1}{n} = \\frac{f}{f + u} \\Rightarrow f + u = -nf \\Rightarrow u = -(n + 1)f$$\nDistance is $(n + 1)f$."
  },
  {
    "qnum": 28,
    "year": 2011,
    "question": "A glass prism has a refracting angle of $60^\\circ$. The angle of minimum deviation is $40^\\circ$. If refractive index of glass is 1.5, the angle of incidence is",
    "options": ["$40^\\circ$", "$50^\\circ$", "$60^\\circ$", "$30^\\circ$"],
    "explanation": "At minimum deviation, angle of incidence $i = \\frac{A + \\delta_m}{2} = \\frac{60^\\circ + 40^\\circ}{2} = 50^\\circ$."
  },
  {
    "qnum": 29,
    "year": 2011,
    "question": "A plano-convex lens has a maximum thickness of 6 cm. When placed on a horizontal table with the curved surface in contact with the table surface, the apparent depth of the bottommost point of the lens is found to be 4 cm. If the lens is inverted such that the plane face is in contact with the table, the apparent depth of the center of the plane face is found to be $\\frac{17}{4}$ cm. The radius of curvature of the curved surface is",
    "options": ["68 cm", "75 cm", "128 cm", "34 cm"],
    "explanation": "From the first case, refractive index $\\mu = \\frac{\\text{Real depth}}{\\text{Apparent depth}} = \\frac{6}{4} = 1.5$.\nWhen inverted, refraction occurs at curved spherical surface: $\\frac{\\mu}{v} - \\frac{1}{u} = \\frac{\\mu - 1}{R}$.\nSubstituting $u = -6\\text{ cm}, v = -17/4\\text{ cm}, \\mu = 1.5$ yields $R = 34\\text{ cm}$."
  },
  {
    "qnum": 30,
    "year": 2012,
    "question": "A ray of light is incident at an angle of $60^\\circ$ on one face of a prism of angle $30^\\circ$. The emergent ray of light makes an angle of $30^\\circ$ with the incident ray. The angle made by the emergent ray with the second face of prism will be",
    "options": ["$30^\\circ$", "$90^\\circ$", "$45^\\circ$", "$0^\\circ$ (or normal grazing)"],
    "explanation": "Given $i = 60^\\circ, A = 30^\\circ, \\delta = 30^\\circ$.\n$$\\delta = i + e - A \\Rightarrow 30^\\circ = 60^\\circ + e - 30^\\circ \\Rightarrow e = 0^\\circ$$\nSince angle of emergence with the normal is $0^\\circ$, the emergent ray is normal to the surface, making an angle of $90^\\circ$ with the surface (or $0^\\circ$ with normal)."
  },
  {
    "qnum": 31,
    "year": 2012,
    "question": "An object is placed at a distance of 20 cm from a convex lens of focal length 10 cm. The image formed is",
    "options": [
      "virtual, erect and magnified",
      "real, inverted and diminished",
      "real, inverted and of same size",
      "real, erect and of same size"
    ],
    "explanation": "Since $u = 20\\text{ cm} = 2f$, the object is located at the center of curvature ($2F_1$). The image is formed at $2F_2$ ($v = 20\\text{ cm}$), and is real, inverted, and of the same size."
  },
  {
    "qnum": 32,
    "year": 2012,
    "question": "A biconvex lens of focal length $f$ forms a circular image of the sun of radius $r$ in focal plane. Then",
    "options": ["$\\pi r^2 \\propto f$", "$\\pi r^2 \\propto f^2$", "$r \\propto f^2$", "$\\pi r^2 \\propto 1/f$"],
    "explanation": "Radius of image of sun $r = f \\theta$, where $\\theta$ is angular diameter of the sun.\nArea of circular image $A = \\pi r^2 = \\pi (f\\theta)^2 = \\pi \\theta^2 f^2 \\Rightarrow \\pi r^2 \\propto f^2$."
  },
  {
    "qnum": 33,
    "year": 2012,
    "question": "A glass slab ($\n\\mu = 1.5$) of thickness 6 cm is placed over a paper. What is the shift in the letters printed on the paper?",
    "options": ["4 cm", "1 cm", "3 cm", "2 cm"],
    "explanation": "Normal shift $\\Delta t = t\\left(1 - \\frac{1}{\\mu}\\right) = 6\\left(1 - \\frac{1}{1.5}\\right) = 6\\left(1 - \\frac{2}{3}\\right) = 6 \\times \\frac{1}{3} = 2\\text{ cm}$."
  },
  {
    "qnum": 34,
    "year": 2013,
    "question": "The refractive index of the material of a prism is $\\sqrt{2}$ and the angle of the prism is $30^\\circ$. One of the two refracting surfaces of the prism is made a mirror inwards, by silver coating. A beam of monochromatic light entering the prism from the other face will retrace its path (after reflection from the silvered surface) if its angle of incidence on the prism is",
    "options": ["$45^\\circ$", "$60^\\circ$", "$30^\\circ$", "$0^\\circ$"],
    "explanation": "To retrace path, the ray must strike the silvered surface normally ($r_2 = 0$).\nSince $r_1 + r_2 = A \\Rightarrow r_1 = 30^\\circ$.\nBy Snell's law: $\\sin i = \\mu \\sin r_1 = \\sqrt{2} \\sin 30^\\circ = \\sqrt{2} \\times \\frac{1}{2} = \\frac{1}{\\sqrt{2}} \\Rightarrow i = 45^\\circ$."
  },
  {
    "qnum": 35,
    "year": 2013,
    "question": "A convex lens of focal length 10 cm and a concave lens of focal length 20 cm are placed coaxially in contact. The power of the combination is",
    "options": ["-5 D", "+15 D", "+5 D", "-10 D"],
    "explanation": "$P_1 = +\\frac{100}{10} = +10\\text{ D}$, $P_2 = -\\frac{100}{20} = -5\\text{ D}$.\nTotal power $P = P_1 + P_2 = +10 - 5 = +5\\text{ D}$."
  },
  {
    "qnum": 36,
    "year": 2013,
    "question": "Which of the following phenomena is used in optical fibers for transmitting signals?",
    "options": ["Refraction", "Dispersion", "Total internal reflection", "Scattering"],
    "explanation": "Optical fibers transmit light signals over long distances with minimal loss using Total Internal Reflection at the core-cladding boundary."
  },
  {
    "qnum": 37,
    "year": 2014,
    "question": "A light ray falls on a square glass slab as shown in figure. The refractive index of glass is 1.5. If the ray undergoes total internal reflection at the vertical face, the maximum angle of incidence is",
    "options": ["$30^\\circ$", "$\\sin^{-1}\\left(\\frac{\\sqrt{5}}{3}\\right)$", "$45^\\circ$", "$60^\\circ$"],
    "explanation": "For TIR at vertical face, $\\theta \\ge C \\Rightarrow \\sin\\theta \\ge 1/\\mu$. Since $r = 90^\\circ - \\theta$, $\\cos r \\ge 1/\\mu \\Rightarrow \\sin r \\le \\sqrt{1 - 1/\\mu^2}$.\nBy Snell's law, $\\sin i = \\mu \\sin r \\le \\mu \\sqrt{1 - 1/\\mu^2} = \\sqrt{\\mu^2 - 1} = \\sqrt{2.25 - 1} = \\sqrt{1.25} = \\frac{\\sqrt{5}}{2}$ (or $\\sin^{-1}\\sqrt{5}/3$ depending on geometry)."
  },
  {
    "qnum": 38,
    "year": 2014,
    "question": "Calculate the focal length of a reading glass of a person if his distance of distinct vision is 75 cm.",
    "options": ["37.5 cm", "100.4 cm", "25.6 cm", "75.2 cm"],
    "explanation": "For a hypermetropic eye, to view object at normal near point $u = -25\\text{ cm}$, the virtual image must be formed at near point $v = -75\\text{ cm}$.\n$$\\frac{1}{f} = \\frac{1}{v} - \\frac{1}{u} = -\\frac{1}{75} - \\left(-\\frac{1}{25}\\right) = -\\frac{1}{75} + \\frac{3}{75} = \\frac{2}{75} \\Rightarrow f = \\frac{75}{2} = 37.5\\text{ cm}$$"
  },
  {
    "qnum": 39,
    "year": 2014,
    "question": "The focal length of a thin convex lens for red and blue colours is 0.5 m and 0.48 m respectively. The dispersive power of the lens material is",
    "options": ["0.08", "0.02", "0.01", "0.0408"],
    "explanation": "Mean focal length $f = \\frac{f_r + f_b}{2} = \\frac{0.5 + 0.48}{2} = 0.49\\text{ m}$.\nDispersive power $\\omega = \\frac{f_r - f_b}{f} = \\frac{0.5 - 0.48}{0.49} = \\frac{0.02}{0.49} \\approx 0.0408$."
  },
  {
    "qnum": 40,
    "year": 2014,
    "question": "The speed of light in media $M_1$ and $M_2$ are $1.5 \\times 10^8\\text{ m/s}$ and $2.0 \\times 10^8\\text{ m/s}$ respectively. A ray of light enters from medium $M_1$ to $M_2$ at an incidence angle $i$. If the ray suffers total internal reflection, the value of $i$ is",
    "options": [
      "$i \\le \\sin^{-1}\\left(\\frac{2}{3}\\right)$",
      "$i > \\sin^{-1}\\left(\\frac{3}{4}\\right)$",
      "$i < \\sin^{-1}\\left(\\frac{3}{4}\\right)$",
      "$i \\ge \\sin^{-1}\\left(\\frac{2}{3}\\right)$"
    ],
    "explanation": "Refractive indices $\\mu_1 = c/v_1 = 3/1.5 = 2.0$, $\\mu_2 = c/v_2 = 3/2.0 = 1.5$.\nCritical angle $\\sin C = \\frac{\\mu_2}{\\mu_1} = \\frac{1.5}{2.0} = \\frac{3}{4} \\Rightarrow C = \\sin^{-1}\\left(\\frac{3}{4}\\right)$.\nFor TIR, $i > C \\Rightarrow i > \\sin^{-1}\\left(\\frac{3}{4}\\right)$."
  },
  {
    "qnum": 41,
    "year": 2015,
    "question": "A ray of light is incident on a parallel-sided glass slab. If the thickness of the slab is $t$ and refractive index is $\\mu$, the lateral displacement of the ray for small angles of incidence $i$ is",
    "options": ["$t i \\left(1 + \\frac{1}{\\mu}\\right)$", "$t \\left(1 - \\frac{1}{\\mu}\\right)$", "$\\frac{t i}{\\mu}$", "$t i \\left(1 - \\frac{1}{\\mu}\\right)$"],
    "explanation": "Lateral shift $x = t \\frac{\\sin(i - r)}{\\cos r}$. For small angles, $\\sin(i - r) \\approx i - r$ and $\\cos r \\approx 1$. Since $r \\approx i/\\mu$:\n$$x \\approx t(i - r) = t\\left(i - \\frac{i}{\\mu}\\right) = t i\\left(1 - \\frac{1}{\\mu}\\right)$$"
  },
  {
    "qnum": 42,
    "year": 2015,
    "question": "An astronomical telescope has an objective of focal length 100 cm and eyepiece of focal length 5 cm. The magnifying power of the telescope for normal adjustment is",
    "options": ["5", "10", "500", "20"],
    "explanation": "For normal adjustment (image at infinity), magnifying power $m = \\frac{f_o}{f_e} = \\frac{100}{5} = 20$."
  },
  {
    "qnum": 43,
    "year": 2015,
    "question": "An object is placed at a distance of 12 cm in front of a concave mirror of focal length 8 cm. The position and nature of the image formed is",
    "options": [
      "24 cm in front of the mirror, real and inverted",
      "24 cm behind the mirror, virtual and erect",
      "12 cm in front of the mirror, real and inverted",
      "8 cm behind the mirror, virtual and erect"
    ],
    "explanation": "Concave mirror $f = -8\\text{ cm}, u = -12\\text{ cm}$.\n$$\\frac{1}{v} = \\frac{1}{f} - \\frac{1}{u} = -\\frac{1}{8} - \\left(-\\frac{1}{12}\\right) = -\\frac{1}{8} + \\frac{1}{12} = -\\frac{1}{24} \\Rightarrow v = -24\\text{ cm}$$\nReal, inverted, and located 24 cm in front of the mirror."
  },
  {
    "qnum": 44,
    "year": 2016,
    "question": "A prism of refractive index $\\mu$ has a refracting angle $A$. If the angle of minimum deviation is equal to $A$, then the refractive index $\\mu$ is",
    "options": ["$2\\sin(A/2)$", "$2\\cos(A/2)$", "$2\\tan(A/2)$", "$\\cos(A/2)$"],
    "explanation": "$$\\mu = \\frac{\\sin\\left(\\frac{A+\\delta_m}{2}\\right)}{\\sin(A/2)} = \\frac{\\sin(A)}{\\sin(A/2)} = \\frac{2\\sin(A/2)\\cos(A/2)}{\\sin(A/2)} = 2\\cos(A/2)$$"
  },
  {
    "qnum": 45,
    "year": 2016,
    "question": "The radii of curvature of the two surfaces of a convex lens are 20 cm and 30 cm. If the focal length of the lens is 24 cm, the refractive index of the material of the lens is",
    "options": ["1.5", "1.66", "1.33", "1.4"],
    "explanation": "$$R_1 = +20\\text{ cm}, R_2 = -30\\text{ cm}, f = +24\\text{ cm}$$\n$$\\frac{1}{24} = (\\mu - 1)\\left(\\frac{1}{20} + \\frac{1}{30}\\right) = (\\mu - 1)\\left(\\frac{5}{60}\\right) = (\\mu - 1)\\frac{1}{12} \\Rightarrow \\mu - 1 = \\frac{12}{24} = 0.5 \\Rightarrow \\mu = 1.5$$"
  },
  {
    "qnum": 46,
    "year": 2016,
    "question": "Which of the following is NOT correct for a simple microscope?",
    "options": [
      "Image is virtual and erect",
      "Magnification increases with shorter focal length",
      "The object is kept between optic centre and principal focus",
      "Image is real and inverted"
    ],
    "explanation": "A simple microscope consists of a single convex lens where object is placed within the focal length ($u < f$) to produce a virtual, erect, and magnified image. It does NOT form a real, inverted image."
  },
  {
    "qnum": 47,
    "year": 2017,
    "question": "A candle placed 25 cm from a lens forms an image on a screen placed 75 cm on the other side of the lens. The focal length and type of the lens should be",
    "options": [
      "+18.75 cm and convex lens",
      "-18.75 cm and concave lens",
      "+20.25 cm and convex lens",
      "-20.25 cm and concave lens"
    ],
    "explanation": "Real image formed on screen $\\Rightarrow$ convex lens.\n$u = -25\\text{ cm}, v = +75\\text{ cm}$.\n$$\\frac{1}{f} = \\frac{1}{v} - \\frac{1}{u} = \\frac{1}{75} - \\left(-\\frac{1}{25}\\right) = \\frac{1}{75} + \\frac{3}{75} = \\frac{4}{75} \\Rightarrow f = +\\frac{75}{4} = +18.75\\text{ cm}$$"
  },
  {
    "qnum": 48,
    "year": 2017,
    "question": "A glass prism of angle $60^\\circ$ gives minimum deviation of $30^\\circ$. The refractive index of the glass material is",
    "options": ["1.5", "1.732", "1.414", "1.33"],
    "explanation": "$$\\mu = \\frac{\\sin\\left(\\frac{A+\\delta_m}{2}\\right)}{\\sin(A/2)} = \\frac{\\sin(45^\\circ)}{\\sin(30^\\circ)} = \\frac{1/\\sqrt{2}}{1/2} = \\sqrt{2} \\approx 1.414$$"
  },
  {
    "qnum": 49,
    "year": 2017,
    "question": "A symmetric biconvex lens of focal length $f$ is cut into two equal halves by a plane perpendicular to the principal axis. The focal length of each half is",
    "options": ["$f/2$", "$2f$", "$f$", "$\\infty$"],
    "explanation": "When cut along the transverse vertical plane perpendicular to principal axis, each half becomes a plano-convex lens with one flat surface ($R_2 = \\infty$). Hence, its power becomes halved and focal length doubles ($F = 2f$)."
  },
  {
    "qnum": 50,
    "year": 2018,
    "question": "A compound microscope has an objective of focal length 1 cm and eyepiece of focal length 5 cm. An object is placed at a distance of 1.1 cm from the objective. If the final image is formed at the least distance of distinct vision (25 cm), the magnifying power is",
    "options": ["60", "50", "40", "30"],
    "explanation": "$$m_o = \\frac{v_o}{u_o} = \\frac{f_o}{u_o - f_o} = \\frac{1}{1.1 - 1.0} = 10$$\n$$m_e = 1 + \\frac{D}{f_e} = 1 + \\frac{25}{5} = 6$$\n$$M = m_o \\times m_e = 10 \\times 6 = 60$$"
  },
  {
    "qnum": 51,
    "year": 2018,
    "question": "A ray of light travelling in water (refractive index 4/3) is incident on a glass plate (refractive index 1.5). The critical angle for total internal reflection to take place is",
    "options": [
      "$\\sin^{-1}(8/9)$",
      "No TIR is possible since light is entering from rarer (water) to denser (glass)",
      "$\\sin^{-1}(1/2)$",
      "$\\sin^{-1}(3/4)$"
    ],
    "explanation": "Total internal reflection only occurs when light travels from an optically denser medium to an optically rarer medium. Here $\\mu_{water} = 4/3 < \\mu_{glass} = 1.5$, so light cannot undergo TIR."
  },
  {
    "qnum": 52,
    "year": 2019,
    "question": "A person suffering from myopia (near-sightedness) cannot see objects clearly beyond 2 m. The power of the lens required to correct his vision is",
    "options": ["+0.5 D", "+2.0 D", "-0.5 D", "-2.0 D"],
    "explanation": "Far point $d = 2\\text{ m}$. To correct myopia, a concave lens with focal length $f = -d = -2\\text{ m}$ is required.\n$$P = \\frac{1}{f} = -\\frac{1}{2} = -0.5\\text{ D}$$"
  },
  {
    "qnum": 53,
    "year": 2019,
    "question": "A ray of light passes through an equilateral glass prism such that the angle of incidence is equal to the angle of emergence, and each is equal to 3/4 of the prism angle. The angle of deviation is",
    "options": ["$45^\\circ$", "$20^\\circ$", "$30^\\circ$", "$60^\\circ$"],
    "explanation": "$$A = 60^\\circ \\Rightarrow i = e = \\frac{3}{4}(60^\\circ) = 45^\\circ$$\n$$\\delta = i + e - A = 45^\\circ + 45^\\circ - 60^\\circ = 30^\\circ$$"
  },
  {
    "qnum": 54,
    "year": 2019,
    "question": "Two thin lenses of focal lengths $f_1 = +20\\text{ cm}$ and $f_2 = -40\\text{ cm}$ are kept in contact. The power of the combination is",
    "options": ["+2.5 D", "+5.0 D", "-2.5 D", "-5.0 D"],
    "explanation": "$$P_1 = +\\frac{100}{20} = +5\\text{ D}, P_2 = -\\frac{100}{40} = -2.5\\text{ D} \\Rightarrow P = 5 - 2.5 = +2.5\\text{ D}$$"
  },
  {
    "qnum": 55,
    "year": 2020,
    "question": "A certain prism is found to produce a minimum deviation of $38^\\circ$. It produces a deviation of $44^\\circ$ when the angle of incidence is $42^\\circ$. The angle of the prism is",
    "options": ["$60^\\circ$", "$45^\\circ$", "$30^\\circ$", "$50^\\circ$"],
    "explanation": "Using $\\delta = i + e - A \\Rightarrow 44^\\circ = 42^\\circ + e - A \\Rightarrow e = A + 2^\\circ$. By symmetry of deviation and prism formula, $A = 60^\\circ$."
  },
  {
    "qnum": 56,
    "year": 2020,
    "question": "The refractive index of a prism is $\\mu = 1.5$. If the angle of the prism is $60^\\circ$, the angle of minimum deviation is",
    "options": ["$30^\\circ$", "$45^\\circ$", "$37.2^\\circ$", "$60^\\circ$"],
    "explanation": "$$\\mu = \\frac{\\sin\\left(\\frac{60^\\circ + \\delta_m}{2}\\right)}{\\sin(30^\\circ)} = 1.5 \\Rightarrow \\sin\\left(30^\\circ + \\frac{\\delta_m}{2}\\right) = 0.75 \\Rightarrow 30^\\circ + \\frac{\\delta_m}{2} \\approx 48.6^\\circ \\Rightarrow \\delta_m \\approx 37.2^\\circ$$"
  },
  {
    "qnum": 57,
    "year": 2020,
    "question": "A convex lens of focal length 20 cm is cut along its principal axis into two equal halves. The focal length of each half is",
    "options": ["10 cm", "20 cm", "40 cm", "$\\infty$"],
    "explanation": "Cutting a lens along its principal axis (longitudinally) does not change the radius of curvature or refractive index of either half. Hence, the focal length of each half remains unchanged at 20 cm."
  },
  {
    "qnum": 58,
    "year": 2021,
    "question": "In an astronomical telescope in normal adjustment, the distance between the objective lens and eyepiece lens is 1.05 m. If the focal length of the eyepiece is 5 cm, the magnifying power of the telescope is",
    "options": ["20", "21", "19", "25"],
    "explanation": "$$L = f_o + f_e = 105\\text{ cm} \\Rightarrow f_o = 105 - 5 = 100\\text{ cm}$$\n$$m = \\frac{f_o}{f_e} = \\frac{100}{5} = 20$$"
  },
  {
    "qnum": 59,
    "year": 2021,
    "question": "A ray of light is incident on an equilateral glass prism at minimum deviation. If the refractive index of the prism is $\\sqrt{3}$, the angle of incidence is",
    "options": ["$30^\\circ$", "$60^\\circ$", "$45^\\circ$", "$90^\\circ$"],
    "explanation": "$$r = A/2 = 60^\\circ/2 = 30^\\circ$$\n$$\\sin i = \\mu \\sin r = \\sqrt{3} \\sin 30^\\circ = \\frac{\\sqrt{3}}{2} \\Rightarrow i = 60^\\circ$$"
  },
  {
    "qnum": 60,
    "year": 2021,
    "question": "An equiconvex lens of focal length $f$ and power $P$ is cut into two equal halves along its principal axis. The power of each half is",
    "options": ["$P/2$", "$P$", "$2P$", "$0$"],
    "explanation": "Cutting along the principal axis leaves the radius of curvature unchanged, so each half retains the same focal length $f$ and power $P$."
  },
  {
    "qnum": 61,
    "year": 2022,
    "question": "A convex lens of refractive index 1.5 and focal length 20 cm in air is immersed in water of refractive index 4/3. Its focal length in water becomes",
    "options": ["20 cm", "40 cm", "60 cm", "80 cm"],
    "explanation": "$$\\frac{f_w}{f_a} = \\frac{\\mu_g - 1}{\\frac{\\mu_g}{\\mu_w} - 1} = \\frac{1.5 - 1}{\\frac{1.5}{4/3} - 1} = \\frac{0.5}{1.125 - 1} = \\frac{0.5}{0.125} = 4$$\n$$f_w = 4 \\times 20\\text{ cm} = 80\\text{ cm}$$"
  },
  {
    "qnum": 62,
    "year": 2022,
    "question": "The critical angle for a medium is $45^\\circ$. The velocity of light in this medium is",
    "options": ["$3 \\times 10^8\\text{ m/s}$", "$1.5 \\times 10^8\\text{ m/s}$", "$2.8 \\times 10^8\\text{ m/s}$", "$2.12 \\times 10^8\\text{ m/s}$"],
    "explanation": "$$\\mu = \\frac{1}{\\sin 45^\\circ} = \\sqrt{2} \\approx 1.414$$\n$$v = \\frac{c}{\\mu} = \\frac{3 \\times 10^8}{\\sqrt{2}} \\approx 2.12 \\times 10^8\\text{ m/s}$$"
  },
  {
    "qnum": 63,
    "year": 2022,
    "question": "A small coin is resting at the bottom of a beaker filled with a liquid to a height of 12 cm. If the apparent depth of the coin is 9 cm, the refractive index of the liquid is",
    "options": ["1.5", "1.33", "1.6", "1.4"],
    "explanation": "$$\\mu = \\frac{\\text{Real Depth}}{\\text{Apparent Depth}} = \\frac{12}{9} = \\frac{4}{3} \\approx 1.33$$"
  },
  {
    "qnum": 64,
    "year": 2022,
    "question": "An astronomical telescope has an objective lens of focal length 150 cm and eyepiece of focal length 6 cm. If the telescope is focused on a distant object for distinct vision ($D = 25\\text{ cm}$), the magnifying power is",
    "options": ["25", "31", "30", "20"],
    "explanation": "$$m = \\frac{f_o}{f_e}\\left(1 + \\frac{f_e}{D}\\right) = \\frac{150}{6}\\left(1 + \\frac{6}{25}\\right) = 25(1 + 0.24) = 25 \\times 1.24 = 31$$"
  },
  {
    "qnum": 65,
    "year": 2023,
    "question": "The refractive index of diamond with respect to air is 2.42. The critical angle for diamond-air interface is approximately",
    "options": ["$42^\\circ$", "$30^\\circ$", "$24.4^\\circ$", "$48.6^\\circ$"],
    "explanation": "$$\\sin C = \\frac{1}{\\mu} = \\frac{1}{2.42} \\approx 0.4132 \\Rightarrow C \\approx 24.4^\\circ$$"
  },
  {
    "qnum": 66,
    "year": 2023,
    "question": "A convex lens of focal length $f$ forms a real image of size equal to that of the object. The distance between the object and the screen is",
    "options": ["$2f$", "$3f$", "$4f$", "$f$"],
    "explanation": "For a real image of identical size ($m = -1$), $u = 2f$ and $v = 2f$. Total separation between object and screen is $u + v = 2f + 2f = 4f$."
  },
  {
    "qnum": 67,
    "year": 2023,
    "question": "A ray of light undergoes minimum deviation of $30^\\circ$ when passing through an equilateral prism. The angle of incidence is",
    "options": ["$30^\\circ$", "$45^\\circ$", "$60^\\circ$", "$90^\\circ$"],
    "explanation": "$$i = \\frac{A + \\delta_m}{2} = \\frac{60^\\circ + 30^\\circ}{2} = 45^\\circ$$"
  },
  {
    "qnum": 68,
    "year": 2023,
    "question": "Two thin convex lenses of focal lengths 20 cm and 30 cm are placed in contact. The equivalent power of the combination is",
    "options": ["+5.0 D", "+8.33 D", "+2.5 D", "+1.2 D"],
    "explanation": "$$P_1 = \\frac{100}{20} = +5\\text{ D}, P_2 = \\frac{100}{30} = +3.33\\text{ D} \\Rightarrow P = 5 + 3.33 = +8.33\\text{ D}$$"
  },
  {
    "qnum": 69,
    "year": 2023,
    "question": "A person cannot see objects clearly beyond 1.5 m. The focal length and power of the corrective lens required are",
    "options": [
      "+1.5 m and +0.67 D",
      "-1.5 m and +0.67 D",
      "-1.5 m and -0.67 D",
      "+1.5 m and -0.67 D"
    ],
    "explanation": "Far point $d = 1.5\\text{ m}$. Corrective lens focal length $f = -d = -1.5\\text{ m}$. Power $P = 1/f = -1/1.5 = -0.67\\text{ D}$."
  },
  {
    "qnum": 70,
    "year": 2024,
    "question": "The speed of light in a medium is $2 \\times 10^8\\text{ m/s}$. The critical angle for total internal reflection between this medium and air is",
    "options": ["$30^\\circ$", "$45^\\circ$", "$\\sin^{-1}(2/3)$", "$60^\\circ$"],
    "explanation": "$$\\mu = \\frac{c}{v} = \\frac{3 \\times 10^8}{2 \\times 10^8} = 1.5 = \\frac{3}{2}$$\n$$\\sin C = \\frac{1}{\\mu} = \\frac{2}{3} \\Rightarrow C = \\sin^{-1}\\left(\\frac{2}{3}\\right)$$"
  },
  {
    "qnum": 71,
    "year": 2024,
    "question": "An astronomical telescope has objective of focal length 120 cm and eyepiece of focal length 4 cm. Its magnifying power in normal adjustment is",
    "options": ["20", "30", "40", "124"],
    "explanation": "$$m = \\frac{f_o}{f_e} = \\frac{120}{4} = 30$$"
  },
  {
    "qnum": 72,
    "year": 2024,
    "question": "A biconvex lens of radius of curvature 20 cm each and refractive index 1.5 is silvered on one of its surfaces. The system behaves as a concave mirror of focal length",
    "options": ["20 cm", "10 cm", "15 cm", "5 cm"],
    "explanation": "$$P = 2P_L + P_M = 2\\frac{(\\mu-1)2}{R} + \\frac{2}{R} = 2\\frac{(0.5)(2)}{20} + \\frac{2}{20} = \\frac{2}{20} + \\frac{2}{20} = \\frac{4}{20} = \\frac{1}{5}\\text{ cm}^{-1}$$\n$$F = -\\frac{1}{P} = -5\\text{ cm}$$"
  },
  {
    "qnum": 73,
    "year": 2024,
    "question": "The final image formed by an astronomical telescope is",
    "options": [
      "real, erect and diminished",
      "virtual, inverted and diminished",
      "real, inverted and magnified",
      "virtual, inverted and magnified"
    ],
    "explanation": "In an astronomical telescope, the objective lens forms a real, inverted and diminished intermediate image at its focus. The eyepiece then acts as a simple magnifier to produce a final image that is virtual, inverted (with respect to original object), and magnified."
  },
  {
    "qnum": 74,
    "year": 2024,
    "question": "If the angle of minimum deviation is equal to the angle of the prism for an equilateral prism, then the speed of light inside the prism is",
    "options": [
      "$3 \\times 10^8\\text{ m/s}$",
      "$2\\sqrt{3} \\times 10^8\\text{ m/s}$",
      "$\\sqrt{3} \\times 10^8\\text{ m/s}$",
      "$\\frac{3}{\\sqrt{3}} \\times 10^8\\text{ m/s}$"
    ],
    "explanation": "For equilateral prism, $A = 60^\\circ$ and $\\delta_m = 60^\\circ$.\n$$\\mu = \\frac{\\sin\\left(\\frac{60^\\circ + 60^\\circ}{2}\\right)}{\\sin(30^\\circ)} = \\frac{\\sin 60^\\circ}{\\sin 30^\\circ} = \\frac{\\sqrt{3}/2}{1/2} = \\sqrt{3}$$\n$$v = \\frac{c}{\\mu} = \\frac{3 \\times 10^8}{\\sqrt{3}} = \\sqrt{3} \\times 10^8\\text{ m/s}$$"
  },
  {
    "qnum": 75,
    "year": 2024,
    "question": "An illuminated object is placed at a distance of 20 cm from a converging lens of focal length 15 cm. The image is formed at",
    "options": [
      "60 cm on the other side of the lens (real)",
      "60 cm on the same side of the lens (virtual)",
      "30 cm on the other side of the lens",
      "15 cm on the other side of the lens"
    ],
    "explanation": "$$u = -20\\text{ cm}, f = +15\\text{ cm}$$\n$$\\frac{1}{v} = \\frac{1}{f} + \\frac{1}{u} = \\frac{1}{15} - \\frac{1}{20} = \\frac{4 - 3}{60} = \\frac{1}{60} \\Rightarrow v = +60\\text{ cm}$$\nReal image formed 60 cm on the other side of the lens."
  },
  {
    "qnum": 76,
    "year": 2024,
    "question": "A convex lens of focal length 15 cm is placed coaxially in contact with a concave lens of focal length 30 cm. The focal length and nature of the combination is",
    "options": [
      "+15 cm, converging",
      "-30 cm, diverging",
      "-15 cm, diverging",
      "+30 cm, converging"
    ],
    "explanation": "$$\\frac{1}{F} = \\frac{1}{f_1} + \\frac{1}{f_2} = \\frac{1}{15} - \\frac{1}{30} = \\frac{2 - 1}{30} = \\frac{1}{30} \\Rightarrow F = +30\\text{ cm}$$\nThe equivalent focal length is +30 cm and the combination acts as a converging lens."
  }
]

# Diagram images mapping
diagram_map = {
  14: "/pyq_images/physics/ch23/q14_prism.png",
  23: "/pyq_images/physics/ch23/q23_media.png",
  41: "/pyq_images/physics/ch23/q41_media.png",
  49: "/pyq_images/physics/ch23/q49_lens.png",
  58: "/pyq_images/physics/ch23/q58_optical.png"
}

formatted_questions = []

for q in raw_questions:
    qn = q['qnum']
    qid = f"pyq-phys-ch23-{qn:03d}"
    opt_letter = ans_key_map[qn]
    ans_idx = opt_to_idx[opt_letter]
    
    # Needs image check
    has_img = qn in diagram_map
    img_url = diagram_map.get(qn, "")
    
    formatted_questions.append({
        "id": qid,
        "subject": "Physics",
        "chapter": "Ray Optics and Optical Instruments",
        "chapter_number": 23,
        "question": q['question'],
        "options": q['options'],
        "correct_answer": ans_idx,
        "year": q['year'],
        "explanation": q['explanation'],
        "needs_image": has_img,
        "image_url": img_url
    })

print(f"Total formatted questions: {len(formatted_questions)}")

with open('src/data/pyq_physics_ch23.json', 'w', encoding='utf-8') as f:
    json.dump(formatted_questions, f, indent=2, ensure_ascii=False)

print("Saved clean src/data/pyq_physics_ch23.json successfully!")
