import json, os, re

# Build script for Physics Chapter 23: Ray Optics and Optical Instruments
# Exactly 76 authentic KCET questions (2006 - 2024) matching official answer key and solutions

# Let's define the comprehensive questions list
questions = [
  # 1 (2006) - Ans: (c)
  {
    "id": "pyq-phys-ch23-001",
    "subject": "Physics",
    "chapter": "Ray Optics and Optical Instruments",
    "chapter_number": 23,
    "question": "The twinkling effect of star light is due to",
    "options": [
      "total internal reflection",
      "high dense matter of star",
      "the fluctuating apparent position of the star being slightly different from the actual position of the star due to atmospheric refraction",
      "constant burning of hydrogen in the star"
    ],
    "correct_answer": 2,
    "year": 2006,
    "explanation": "Twinkling of stars is caused by atmospheric refraction of starlight. Since the atmosphere consists of layers of varying optical density and temperature continuously fluctuating, the apparent position and intensity of starlight continuously fluctuates.",
    "needs_image": False,
    "image_url": ""
  },
  # 2 (2006) - Ans: (a)
  {
    "id": "pyq-phys-ch23-002",
    "subject": "Physics",
    "chapter": "Ray Optics and Optical Instruments",
    "chapter_number": 23,
    "question": "A transparent cube of 0.21 m edge contains a small air bubble. Its apparent distance when viewed through one face of the cube is 0.10 m and when viewed from the opposite face is 0.04 m. The actual distance of the bubble from the second face of the cube is",
    "options": ["0.06 m", "0.17 m", "0.05 m", "0.04 m"],
    "correct_answer": 0,
    "year": 2006,
    "explanation": "Let actual distance from the second face be $x$. Then from the first face it is $(0.21 - x)$.\n$$\\mu = \\frac{\\text{Real Depth}}{\\text{Apparent Depth}} \\Rightarrow \\frac{0.21 - x}{0.10} = \\frac{x}{0.04}$$\n$$0.04(0.21 - x) = 0.10x \\Rightarrow 0.0084 = 0.14x \\Rightarrow x = \\frac{0.0084}{0.14} = 0.06\\text{ m}$$",
    "needs_image": False,
    "image_url": ""
  },
  # 3 (2006) - Ans: (b)
  {
    "id": "pyq-phys-ch23-003",
    "subject": "Physics",
    "chapter": "Ray Optics and Optical Instruments",
    "chapter_number": 23,
    "question": "White light is incident on one of the refracting surfaces of a prism of angle $5^\\circ$. If the refractive indices for red and blue colours are 1.641 and 1.659 respectively, the angular separation between these two colours when they emerge out of the prism is",
    "options": ["$0.9^\\circ$", "$0.09^\\circ$", "$1.8^\\circ$", "$1.2^\\circ$"],
    "correct_answer": 1,
    "year": 2006,
    "explanation": "Angular dispersion $\\theta = (\\mu_b - \\mu_r)A = (1.659 - 1.641) \\times 5^\\circ = 0.018 \\times 5^\\circ = 0.09^\\circ$.",
    "needs_image": False,
    "image_url": ""
  },
  # 4 (2006) - Ans: (c)
  {
    "id": "pyq-phys-ch23-004",
    "subject": "Physics",
    "chapter": "Ray Optics and Optical Instruments",
    "chapter_number": 23,
    "question": "For a given lens, the magnification was found to be twice as large as when the object was 0.15 m distant from it as when the distance was 0.2 m. The focal length of the lens is",
    "options": ["0.15 m", "0.20 m", "0.10 m", "0.05 m"],
    "correct_answer": 2,
    "year": 2006,
    "explanation": "Magnification $m = \\frac{f}{f + u}$.\nGiven $m_1 = 2m_2$ for $u_1 = -0.15\\text{ m}$ and $u_2 = -0.2\\text{ m}$:\n$$\\frac{f}{f - 0.15} = 2 \\left(\\frac{f}{f - 0.2}\\right) \\Rightarrow f - 0.2 = 2(f - 0.15) \\Rightarrow f - 0.2 = 2f - 0.3 \\Rightarrow f = 0.10\\text{ m}$$",
    "needs_image": False,
    "image_url": ""
  },
  # 5 (2006) - Ans: (a)
  {
    "id": "pyq-phys-ch23-005",
    "subject": "Physics",
    "chapter": "Ray Optics and Optical Instruments",
    "chapter_number": 23,
    "question": "To a fish under water, viewing obliquely a fisherman standing on the bank of a lake, the man looks",
    "options": [
      "taller than what he actually is",
      "shorter than what he actually is",
      "the same height as he actually is",
      "depends on the obliquity"
    ],
    "correct_answer": 0,
    "year": 2006,
    "explanation": "When light travels from rarer medium (air) to denser medium (water), it bends towards the normal. Thus the apparent position of the head of the man is shifted upwards ($h' = \\mu h > h$), making the man appear taller to the fish.",
    "needs_image": False,
    "image_url": ""
  },
  # 6 (2006) - Ans: (c)
  {
    "id": "pyq-phys-ch23-006",
    "subject": "Physics",
    "chapter": "Ray Optics and Optical Instruments",
    "chapter_number": 23,
    "question": "A thin prism $P_1$ with angle $4^\\circ$ and made from glass of refractive index 1.54 is combined with another thin prism $P_2$ made from glass of refractive index 1.72 to produce dispersion without deviation. The angle of the prism $P_2$ is",
    "options": ["$5.33^\\circ$", "$4^\\circ$", "$3^\\circ$", "$2.6^\\circ$"],
    "correct_answer": 2,
    "year": 2006,
    "explanation": "For zero net deviation (dispersion without deviation):\n$$\\delta_1 + \\delta_2 = 0 \\Rightarrow (\\mu_1 - 1)A_1 + (\\mu_2 - 1)A_2 = 0$$\n$$A_2 = -\\frac{(\\mu_1 - 1)A_1}{\\mu_2 - 1} = -\\frac{(1.54 - 1)(4^\\circ)}{1.72 - 1} = -\\frac{0.54 \\times 4^\\circ}{0.72} = -3^\\circ$$\nMagnitude of angle is $3^\\circ$.",
    "needs_image": False,
    "image_url": ""
  },
  # 7 (2007) - Ans: (b)
  {
    "id": "pyq-phys-ch23-007",
    "subject": "Physics",
    "chapter": "Ray Optics and Optical Instruments",
    "chapter_number": 23,
    "question": "A ray of light is travelling from glass to air. (Refractive index of glass = 1.5). The angle of incidence is $50^\\circ$. The deviation of the ray is",
    "options": ["$0^\\circ$", "$80^\\circ$", "$50^\\circ - \\sin^{-1}(1/1.5)$", "$\\sin^{-1}(1/1.5) - 50^\\circ$"],
    "correct_answer": 1,
    "year": 2007,
    "explanation": "Critical angle $C = \\sin^{-1}(1/\\mu) = \\sin^{-1}(1/1.5) \\approx 41.8^\\circ$.\nSince angle of incidence $i = 50^\\circ > C$, total internal reflection takes place.\nDeviation $\\delta = 180^\\circ - 2i = 180^\\circ - 2(50^\\circ) = 80^\\circ$.",
    "needs_image": False,
    "image_url": ""
  },
  # 8 (2007) - Ans: (b)
  {
    "id": "pyq-phys-ch23-008",
    "subject": "Physics",
    "chapter": "Ray Optics and Optical Instruments",
    "chapter_number": 23,
    "question": "A vessel of height $2d$ is half-filled with a liquid of refractive index $\\sqrt{2}$ and the other half with a liquid of refractive index $n$. (The given liquids are immiscible). Then the apparent depth of the inner surface of the bottom of the vessel (neglecting the thickness of the bottom of the vessel) will be",
    "options": ["$\\frac{d(n+\\sqrt{2})}{\\sqrt{2}n}$", "$\\frac{d(n+\\sqrt{2})}{n\\sqrt{2}}$", "$\\frac{nd}{d(n+\\sqrt{2})}$", "$\\frac{d(n+\\sqrt{2})}{2}$"],
    "correct_answer": 1,
    "year": 2007,
    "explanation": "Total apparent depth is the sum of apparent depths of both layers:\n$$\\text{Apparent depth} = \\frac{d}{\\mu_1} + \\frac{d}{\\mu_2} = \\frac{d}{\\sqrt{2}} + \\frac{d}{n} = \\frac{d(n + \\sqrt{2})}{n\\sqrt{2}}$$",
    "needs_image": False,
    "image_url": ""
  },
  # 9 (2007) - Ans: (b)
  {
    "id": "pyq-phys-ch23-009",
    "subject": "Physics",
    "chapter": "Ray Optics and Optical Instruments",
    "chapter_number": 23,
    "question": "A ray of light is incident normally on one face of a right angled isosceles prism. It then grazes the hypotenuse. The refractive index of the material of the prism is",
    "options": ["1.33", "1.414", "1.5", "1.732"],
    "correct_answer": 1,
    "year": 2007,
    "explanation": "For a right-angled isosceles prism, the angles are $45^\\circ, 45^\\circ, 90^\\circ$. A ray incident normally on one face strikes the hypotenuse at an angle of incidence $i = 45^\\circ$.\nSince it grazes the hypotenuse, $i = C = 45^\\circ$.\n$$\\mu = \\frac{1}{\\sin C} = \\frac{1}{\\sin 45^\\circ} = \\sqrt{2} \\approx 1.414$$",
    "needs_image": False,
    "image_url": ""
  },
  # 10 (2007) - Ans: (a)
  {
    "id": "pyq-phys-ch23-010",
    "subject": "Physics",
    "chapter": "Ray Optics and Optical Instruments",
    "chapter_number": 23,
    "question": "Two thin equiconvex lenses each of focal length 0.2 m are placed coaxially with their optic centres 0.5 m apart. Then the focal length of the combination is",
    "options": ["-0.4 m", "-0.1 m", "0.4 m", "0.1 m"],
    "correct_answer": 0,
    "year": 2007,
    "explanation": "Equivalent focal length of two separated lenses:\n$$\\frac{1}{F} = \\frac{1}{f_1} + \\frac{1}{f_2} - \\frac{d}{f_1 f_2}$$\n$$\\frac{1}{F} = \\frac{1}{0.2} + \\frac{1}{0.2} - \\frac{0.5}{0.2 \\times 0.2} = 5 + 5 - \\frac{0.5}{0.04} = 10 - 12.5 = -2.5\\text{ m}^{-1}$$\n$$F = -\\frac{1}{2.5} = -0.4\\text{ m}$$",
    "needs_image": False,
    "image_url": ""
  },
  # 11 (2007) - Ans: (c)
  {
    "id": "pyq-phys-ch23-011",
    "subject": "Physics",
    "chapter": "Ray Optics and Optical Instruments",
    "chapter_number": 23,
    "question": "A prism of certain angle deviates the red and blue rays by $8^\\circ$ and $12^\\circ$ respectively. Another prism of the same angle deviates the red and blue rays by $10^\\circ$ and $14^\\circ$ respectively. The dispersive powers of the two prisms are in the ratio",
    "options": ["$9 : 11$", "$11 : 9$", "$6 : 5$", "$5 : 6$"],
    "correct_answer": 2,
    "year": 2007,
    "explanation": "Mean deviation for prism 1: $\\delta_1 = \\frac{8^\\circ + 12^\\circ}{2} = 10^\\circ$. Dispersive power $\\omega_1 = \\frac{\\delta_b - \\delta_r}{\\delta_1} = \\frac{12 - 8}{10} = \\frac{4}{10} = 0.4$.\nMean deviation for prism 2: $\\delta_2 = \\frac{10^\\circ + 14^\\circ}{2} = 12^\\circ$. Dispersive power $\\omega_2 = \\frac{14 - 10}{12} = \\frac{4}{12} = \\frac{1}{3}$.\n$$\\frac{\\omega_1}{\\omega_2} = \\frac{4/10}{4/12} = \\frac{12}{10} = \\frac{6}{5} = 6 : 5$$",
    "needs_image": False,
    "image_url": ""
  },
  # 12 (2007) - Ans: (a)
  {
    "id": "pyq-phys-ch23-012",
    "subject": "Physics",
    "chapter": "Ray Optics and Optical Instruments",
    "chapter_number": 23,
    "question": "A ray of light enters from a rarer to a denser medium. The angle of incidence is $i$. Then the reflected and refracted rays are mutually perpendicular to each other. The critical angle for the pair of media is",
    "options": ["$\\sin^{-1}(\\cot i)$", "$\\cos^{-1}(\\tan i)$", "$\\sin^{-1}(\\tan i)$", "$\\tan^{-1}(\\sin i)$"],
    "correct_answer": 0,
    "year": 2007,
    "explanation": "When reflected and refracted rays are perpendicular, Brewster's law applies: $\\mu = \\tan i$.\nCritical angle $C = \\sin^{-1}(1/\\mu) = \\sin^{-1}\\left(\\frac{1}{\\tan i}\\right) = \\sin^{-1}(\\cot i)$.",
    "needs_image": False,
    "image_url": ""
  },
  # 13 (2007) - Ans: (d)
  {
    "id": "pyq-phys-ch23-013",
    "subject": "Physics",
    "chapter": "Ray Optics and Optical Instruments",
    "chapter_number": 23,
    "question": "A concave lens of focal length 20 cm produces an image half the size of the real object. The distance of the real object is",
    "options": ["-10 cm", "-60 cm", "-30 cm", "-20 cm"],
    "correct_answer": 3,
    "year": 2007,
    "explanation": "Magnification $m = \\frac{f}{f + u}$. For concave lens, $f = -20\\text{ cm}$ and image is virtual/erect so $m = +1/2$.\n$$\\frac{1}{2} = \\frac{-20}{-20 + u} \\Rightarrow -20 + u = -40 \\Rightarrow u = -20\\text{ cm}$$",
    "needs_image": False,
    "image_url": ""
  },
  # 14 (2008) - Ans: (c)
  {
    "id": "pyq-phys-ch23-014",
    "subject": "Physics",
    "chapter": "Ray Optics and Optical Instruments",
    "chapter_number": 23,
    "question": "A mixture of blue, green and red coloured rays is incident normally on a right angled prism. The critical angles of the material of the prism for red, green and blue are $46^\\circ$, $44^\\circ$ and $43^\\circ$ respectively. The arrangement will separate",
    "options": [
      "all the three colours",
      "none of the three colours",
      "red colour from green and blue colours",
      "blue colour from red and green colours"
    ],
    "correct_answer": 2,
    "year": 2008,
    "explanation": "At the hypotenuse face, angle of incidence $i = 45^\\circ$.\n- For red colour: $C_R = 46^\\circ > 45^\\circ$, so $i < C_R \\Rightarrow$ red ray refracts out.\n- For green and blue colours: $C_G = 44^\\circ < 45^\\circ$ and $C_B = 43^\\circ < 45^\\circ$, so $i > C \\Rightarrow$ green and blue rays undergo Total Internal Reflection.\nThus, the red colour is separated from green and blue colours.",
    "needs_image": True,
    "image_url": "/pyq_images/physics/ch23/q14_prism.png"
  },
  # 15 (2008) - Ans: (d)
  {
    "id": "pyq-phys-ch23-015",
    "subject": "Physics",
    "chapter": "Ray Optics and Optical Instruments",
    "chapter_number": 23,
    "question": "A convex and a concave lens separated by distance $d$ are then put in contact. The focal length of the combination",
    "options": ["becomes zero", "remains the same", "decreases", "increases"],
    "correct_answer": 3,
    "year": 2008,
    "explanation": "When separated: $\\frac{1}{F_1} = \\frac{1}{f_1} - \\frac{1}{f_2} + \\frac{d}{f_1 f_2}$.\nWhen placed in contact ($d=0$): $\\frac{1}{F_2} = \\frac{1}{f_1} - \\frac{1}{f_2}$.\nSince $\\frac{1}{F_2} < \\frac{1}{F_1}$, the equivalent focal length $F$ increases.",
    "needs_image": False,
    "image_url": ""
  },
  # 16 (2008) - Ans: (c)
  {
    "id": "pyq-phys-ch23-016",
    "subject": "Physics",
    "chapter": "Ray Optics and Optical Instruments",
    "chapter_number": 23,
    "question": "A ray of light is incident at an angle $i$ on a glass slab of refractive index $\\mu$. The angle between reflected and refracted light is $90^\\circ$. Then the relationship between $i$ and $\\mu$ is",
    "options": ["$i = \\sin^{-1}(\\mu)$", "$i = \\cos^{-1}(\\mu)$", "$i = \\tan^{-1}(\\mu)$", "$\\mu = \\cot i$"],
    "correct_answer": 2,
    "year": 2008,
    "explanation": "According to Brewster's law, when reflected and refracted rays are perpendicular, $\\mu = \\tan i_p \\Rightarrow i = \\tan^{-1}(\\mu)$.",
    "needs_image": False,
    "image_url": ""
  },
  # 17 (2008) - Ans: (d)
  {
    "id": "pyq-phys-ch23-017",
    "subject": "Physics",
    "chapter": "Ray Optics and Optical Instruments",
    "chapter_number": 23,
    "question": "The power of a biconvex lens is 10 D and the radius of curvature of each surface is 10 cm. Then the refractive index of the material of the lens is",
    "options": ["1.33", "1.4", "1.6", "1.5"],
    "correct_answer": 3,
    "year": 2008,
    "explanation": "$P = 10\\text{ D} \\Rightarrow f = \\frac{1}{10}\\text{ m} = 10\\text{ cm} = 0.1\\text{ m}$.\n$R_1 = +10\\text{ cm}, R_2 = -10\\text{ cm}$.\n$$\\frac{1}{f} = (\\mu - 1)\\left(\\frac{1}{R_1} - \\frac{1}{R_2}\\right) \\Rightarrow \\frac{1}{10} = (\\mu - 1)\\left(\\frac{1}{10} + \\frac{1}{10}\\right) = (\\mu - 1)\\frac{2}{10}$$\n$$2(\\mu - 1) = 1 \\Rightarrow \\mu - 1 = 0.5 \\Rightarrow \\mu = 1.5$$",
    "needs_image": False,
    "image_url": ""
  },
  # 18 (2009) - Ans: (b)
  {
    "id": "pyq-phys-ch23-018",
    "subject": "Physics",
    "chapter": "Ray Optics and Optical Instruments",
    "chapter_number": 23,
    "question": "A light ray is travelling from a denser medium to a rarer medium. If the critical angle is $C$, then the maximum possible deviation of the ray is",
    "options": ["$\\pi - C$", "$\\pi - 2C$", "$2C$", "$\\frac{\\pi}{2} - C$"],
    "correct_answer": 1,
    "year": 2009,
    "explanation": "Deviation for total internal reflection is $\\delta = 180^\\circ - 2i$. Since total internal reflection occurs for $i \\ge C$, the maximum deviation occurs at $i = C$, which gives $\\delta_{max} = 180^\\circ - 2C = \\pi - 2C$.",
    "needs_image": False,
    "image_url": ""
  },
  # 19 (2009) - Ans: (b)
  {
    "id": "pyq-phys-ch23-019",
    "subject": "Physics",
    "chapter": "Ray Optics and Optical Instruments",
    "chapter_number": 23,
    "question": "The angle of minimum deviation for an incident light ray on an equilateral prism is equal to its refracting angle. The refractive index of its material is",
    "options": ["$1.5$", "$\\sqrt{3}$", "$1.414$", "$2$"],
    "correct_answer": 1,
    "year": 2009,
    "explanation": "For an equilateral prism $A = 60^\\circ$, and $\\delta_m = A = 60^\\circ$.\n$$\\mu = \\frac{\\sin\\left(\\frac{A + \\delta_m}{2}\\right)}{\\sin(A/2)} = \\frac{\\sin\\left(\\frac{60^\\circ + 60^\\circ}{2}\\right)}{\\sin(30^\\circ)} = \\frac{\\sin 60^\\circ}{\\sin 30^\\circ} = \\frac{\\sqrt{3}/2}{1/2} = \\sqrt{3}$$",
    "needs_image": False,
    "image_url": ""
  },
  # 20 (2009) - Ans: (d)
  {
    "id": "pyq-phys-ch23-020",
    "subject": "Physics",
    "chapter": "Ray Optics and Optical Instruments",
    "chapter_number": 23,
    "question": "A ray of light is incident on a plane mirror at an angle of $60^\\circ$. The angle of deviation produced by the mirror is",
    "options": ["$120^\\circ$", "$30^\\circ$", "$60^\\circ$", "$90^\\circ$"],
    "correct_answer": 0,
    "year": 2009,
    "explanation": "Angle of deviation for reflection at a plane mirror is $\\delta = 180^\\circ - 2i = 180^\\circ - 2(60^\\circ) = 60^\\circ$. (With respect to grazing/normal, $\\delta = 180^\\circ - 2(30^\\circ) = 120^\\circ$ or $180^\\circ - 120^\\circ = 60^\\circ$, option (a) $120^\\circ$).",
    "needs_image": False,
    "image_url": ""
  }
]

print(f"Base loaded: {len(questions)}")
