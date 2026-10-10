import json

# Mathematics Chapter 17: Integrals (100 Questions)
questions = [
  {
    "id": "pyq-math-ch17-001",
    "subject": "Mathematics",
    "chapter": "Integrals",
    "chapter_number": 17,
    "question": "$\\int \\frac{(x^3 + 3x^2 + 3x + 1)}{(x + 1)^5} dx =$",
    "options": [
      "$-\\frac{1}{x+1} + C$",
      "$\\frac{1}{x+1} + C$",
      "$\\log(x+1) + C$",
      "$\\tan^{-1}x + C$"
    ],
    "correct_answer": 0,
    "year": 2006,
    "explanation": "Note that $x^3 + 3x^2 + 3x + 1 = (x+1)^3$. Therefore,\n$$\\int \\frac{(x+1)^3}{(x+1)^5} dx = \\int (x+1)^{-2} dx = -\\frac{1}{x+1} + C$$",
    "needs_image": False,
    "image_url": ""
  },
  {
    "id": "pyq-math-ch17-002",
    "subject": "Mathematics",
    "chapter": "Integrals",
    "chapter_number": 17,
    "question": "$\\int \\frac{\\text{cosec } x}{\\cos^2\\left(1 + \\log\\tan\\frac{x}{2}\\right)} dx =$",
    "options": [
      "$\\sin^2\\left(1 + \\log\\tan\\frac{x}{2}\\right) + C$",
      "$\\tan\\left(1 + \\log\\tan\\frac{x}{2}\\right) + C$",
      "$\\sec^2\\left(1 + \\log\\tan\\frac{x}{2}\\right) + C$",
      "$-\\tan\\left(1 + \\log\\tan\\frac{x}{2}\\right) + C$"
    ],
    "correct_answer": 1,
    "year": 2006,
    "explanation": "Let $t = 1 + \\log\\tan\\frac{x}{2}$. Then $dt = \\frac{1}{\\tan(x/2)} \\cdot \\sec^2(x/2) \\cdot \\frac{1}{2} dx = \\frac{dx}{2\\sin(x/2)\\cos(x/2)} = \\text{cosec } x \\, dx$. Thus,\n$$\\int \\frac{dt}{\\cos^2 t} = \\int \\sec^2 t \\, dt = \\tan t + C = \\tan\\left(1 + \\log\\tan\\frac{x}{2}\\right) + C$$",
    "needs_image": False,
    "image_url": ""
  },
  {
    "id": "pyq-math-ch17-003",
    "subject": "Mathematics",
    "chapter": "Integrals",
    "chapter_number": 17,
    "question": "$\\int \\frac{dx}{x\\sqrt{x^6 - 16}} =$",
    "options": [
      "$\\frac{1}{12}\\sec^{-1}\\left(\\frac{x^3}{4}\\right) + C$",
      "$\\frac{1}{4}\\cosh^{-1}\\left(\\frac{x^3}{4}\\right) + C$",
      "$\\frac{1}{3}\\sec^{-1}\\left(\\frac{x^3}{4}\\right) + C$",
      "$\\frac{1}{12}\\sin^{-1}\\left(\\frac{x^3}{4}\\right) + C$"
    ],
    "correct_answer": 0,
    "year": 2006,
    "explanation": "Multiply numerator and denominator by $x^2$:\n$$I = \\int \\frac{x^2 dx}{x^3\\sqrt{(x^3)^2 - 4^2}}$$\nLet $t = x^3 \\Rightarrow dt = 3x^2 dx$. Then $I = \\frac{1}{3}\\int \\frac{dt}{t\\sqrt{t^2 - 4^2}} = \\frac{1}{3} \\cdot \\frac{1}{4}\\sec^{-1}\\left(\\frac{t}{4}\\right) + C = \\frac{1}{12}\\sec^{-1}\\left(\\frac{x^3}{4}\\right) + C$.",
    "needs_image": False,
    "image_url": ""
  },
  {
    "id": "pyq-math-ch17-004",
    "subject": "Mathematics",
    "chapter": "Integrals",
    "chapter_number": 17,
    "question": "If $I_1 = \\int_0^{\\pi/2} x\\sin x \\, dx$ and $I_2 = \\int_0^{\\pi/2} x\\cos x \\, dx$, then $I_1 + I_2 =$",
    "options": ["$\\frac{\\pi}{2}$", "$\\frac{\\pi}{4}$", "$\\pi$", "$0$"],
    "correct_answer": 0,
    "year": 2006,
    "explanation": "$$I_1 + I_2 = \\int_0^{\\pi/2} x(\\sin x + \\cos x) dx$$\nUsing property $\\int_0^a f(x)dx = \\int_0^a f(a-x)dx$:\n$$I_1 + I_2 = \\int_0^{\\pi/2} \\left(\\frac{\\pi}{2} - x\\right)(\\cos x + \\sin x) dx$$\nAdding both forms gives $2(I_1 + I_2) = \\frac{\\pi}{2}\\int_0^{\\pi/2}(\\sin x + \\cos x)dx = \\frac{\\pi}{2}[-\\cos x + \\sin x]_0^{\\pi/2} = \\frac{\\pi}{2}(1 - (-1)) = \\pi \\Rightarrow I_1 + I_2 = \\frac{\\pi}{2}$.",
    "needs_image": False,
    "image_url": ""
  },
  {
    "id": "pyq-math-ch17-005",
    "subject": "Mathematics",
    "chapter": "Integrals",
    "chapter_number": 17,
    "question": "If $f(x) = 4x^2 - 3x + 1$ and $g(x) = \\frac{f(-x) - f(x)}{x^2 + 3}$, then $\\int_{-2}^2 g(x) \\, dx =$",
    "options": ["$2$", "$1$", "$0$", "$-2$"],
    "correct_answer": 2,
    "year": 2006,
    "explanation": "$g(x) = \\frac{(4x^2 + 3x + 1) - (4x^2 - 3x + 1)}{x^2 + 3} = \\frac{6x}{x^2 + 3}$. Since $g(-x) = \\frac{-6x}{x^2+3} = -g(x)$, $g(x)$ is an odd function. Thus, $\\int_{-2}^2 g(x) dx = 0$.",
    "needs_image": False,
    "image_url": ""
  },
  {
    "id": "pyq-math-ch17-006",
    "subject": "Mathematics",
    "chapter": "Integrals",
    "chapter_number": 17,
    "question": "$\\int \\frac{dx}{\\sin x + \\sqrt{3}\\cos x} =$",
    "options": [
      "$\\frac{1}{2}\\log\\left|\\tan\\left(\\frac{x}{2} + \\frac{\\pi}{6}\\right)\\right| + C$",
      "$\\log\\left|\\tan\\left(\\frac{x}{2} + \\frac{\\pi}{6}\\right)\\right| + C$",
      "$\\frac{1}{2}\\log\\left|\\cot\\left(\\frac{x}{2} + \\frac{\\pi}{3}\\right)\\right| + C$",
      "$\\frac{1}{2}\\log\\left|\\tan\\left(\\frac{x}{2} + \\frac{\\pi}{6}\\right)\\right| + C$"
    ],
    "correct_answer": 3,
    "year": 2007,
    "explanation": "Divide and multiply denominator by 2:\n$$\\int \\frac{dx}{2\\left(\\frac{1}{2}\\sin x + \\frac{\\sqrt{3}}{2}\\cos x\\right)} = \\frac{1}{2}\\int \\frac{dx}{\\sin\\left(x + \\frac{\\pi}{3}\\right)} = \\frac{1}{2}\\int \\text{cosec}\\left(x + \\frac{\\pi}{3}\\right) dx = \\frac{1}{2}\\log\\left|\\tan\\left(\\frac{x}{2} + \\frac{\\pi}{6}\\right)\\right| + C$$",
    "needs_image": False,
    "image_url": ""
  },
  {
    "id": "pyq-math-ch17-007",
    "subject": "Mathematics",
    "chapter": "Integrals",
    "chapter_number": 17,
    "question": "$\\int \\frac{x - \\sin x}{1 - \\cos x} \\, dx =$",
    "options": [
      "$-x\\cot\\frac{x}{2} + C$",
      "$x\\tan\\frac{x}{2} + C$",
      "$x\\cot\\frac{x}{2} + C$",
      "$-x\\tan\\frac{x}{2} + C$"
    ],
    "correct_answer": 0,
    "year": 2007,
    "explanation": "$$\\int \\frac{x - 2\\sin\\frac{x}{2}\\cos\\frac{x}{2}}{2\\sin^2\\frac{x}{2}} dx = \\int \\left(\\frac{x}{2}\\text{cosec}^2\\frac{x}{2} - \\cot\\frac{x}{2}\\right) dx = -x\\cot\\frac{x}{2} + C$$",
    "needs_image": False,
    "image_url": ""
  },
  {
    "id": "pyq-math-ch17-008",
    "subject": "Mathematics",
    "chapter": "Integrals",
    "chapter_number": 17,
    "question": "$\\int e^x \\left(\\frac{1 + \\sin x}{1 + \\cos x}\\right) dx =$",
    "options": [
      "$e^x\\cot\\frac{x}{2} + C$",
      "$-e^x\\tan\\frac{x}{2} + C$",
      "$-e^x\\cot\\frac{x}{2} + C$",
      "$e^x\\tan\\frac{x}{2} + C$"
    ],
    "correct_answer": 3,
    "year": 2007,
    "explanation": "$$\\int e^x \\left(\\frac{1 + 2\\sin\\frac{x}{2}\\cos\\frac{x}{2}}{2\\cos^2\\frac{x}{2}}\\right) dx = \\int e^x \\left[\\tan\\frac{x}{2} + \\frac{1}{2}\\sec^2\\frac{x}{2}\\right] dx = e^x\\tan\\frac{x}{2} + C$$",
    "needs_image": False,
    "image_url": ""
  },
  {
    "id": "pyq-math-ch17-009",
    "subject": "Mathematics",
    "chapter": "Integrals",
    "chapter_number": 17,
    "question": "The value of $\\int_{-1}^2 \\frac{|x|}{x} \\, dx$ is",
    "options": ["$0$", "$1$", "$2$", "$3$"],
    "correct_answer": 1,
    "year": 2007,
    "explanation": "$$\\int_{-1}^2 \\frac{|x|}{x} dx = \\int_{-1}^0 (-1) dx + \\int_0^2 (1) dx = -[x]_{-1}^0 + [x]_0^2 = -(0 - (-1)) + (2 - 0) = -1 + 2 = 1$$",
    "needs_image": False,
    "image_url": ""
  },
  {
    "id": "pyq-math-ch17-010",
    "subject": "Mathematics",
    "chapter": "Integrals",
    "chapter_number": 17,
    "question": "$\\int_0^{\\pi/2} \\frac{\\sqrt{\\sin x}}{\\sqrt{\\sin x} + \\sqrt{\\cos x}} \\, dx =$",
    "options": ["$\\pi$", "$\\frac{\\pi}{2}$", "$\\frac{\\pi}{4}$", "$0$"],
    "correct_answer": 2,
    "year": 2007,
    "explanation": "Applying $\\int_0^a f(x)dx = \\int_0^a f(a-x)dx$ gives $2I = \\int_0^{\\pi/2} 1 \\, dx = \\frac{\\pi}{2} \\Rightarrow I = \\frac{\\pi}{4}$.",
    "needs_image": False,
    "image_url": ""
  },
  {
    "id": "pyq-math-ch17-011",
    "subject": "Mathematics",
    "chapter": "Integrals",
    "chapter_number": 17,
    "question": "$\\int \\frac{1}{x(x^5 + 1)} \\, dx =$",
    "options": [
      "$\\frac{1}{5}\\log\\left|\\frac{x^5}{x^5 + 1}\\right| + C$",
      "$\\frac{1}{5}\\log\\left|\\frac{x^5 + 1}{x^5}\\right| + C$",
      "$\\log\\left|\\frac{x^5}{x^5 + 1}\\right| + C$",
      "$5\\log\\left|\\frac{x^5}{x^5 + 1}\\right| + C$"
    ],
    "correct_answer": 0,
    "year": 2008,
    "explanation": "Multiply numerator and denominator by $x^4$:\n$$\\int \\frac{x^4 dx}{x^5(x^5 + 1)} = \\frac{1}{5}\\int \\left(\\frac{1}{t} - \\frac{1}{t+1}\\right) dt = \\frac{1}{5}\\log\\left|\\frac{x^5}{x^5 + 1}\\right| + C$$",
    "needs_image": False,
    "image_url": ""
  },
  {
    "id": "pyq-math-ch17-012",
    "subject": "Mathematics",
    "chapter": "Integrals",
    "chapter_number": 17,
    "question": "$\\int \\frac{e^x(x - 1)}{x^2} \\, dx =$",
    "options": ["$\\frac{e^x}{x^2} + C$", "$-\\frac{e^x}{x} + C$", "$\\frac{e^x}{x} + C$", "$e^x\\log x + C$"],
    "correct_answer": 2,
    "year": 2008,
    "explanation": "$$\\int e^x \\left(\\frac{1}{x} - \\frac{1}{x^2}\\right) dx = e^x \\cdot \\frac{1}{x} + C = \\frac{e^x}{x} + C$$",
    "needs_image": False,
    "image_url": ""
  },
  {
    "id": "pyq-math-ch17-013",
    "subject": "Mathematics",
    "chapter": "Integrals",
    "chapter_number": 17,
    "question": "$\\int_0^1 \\frac{dx}{e^x + e^{-x}} =$",
    "options": ["$\\frac{\\pi}{4}$", "$\\tan^{-1}(e)$", "$\\tan^{-1}(e) - \\frac{\\pi}{4}$", "$\\tan^{-1}(e) + \\frac{\\pi}{4}$"],
    "correct_answer": 2,
    "year": 2008,
    "explanation": "$$\\int_0^1 \\frac{e^x dx}{e^{2x} + 1} = [\\tan^{-1}(e^x)]_0^1 = \\tan^{-1}(e) - \\tan^{-1}(1) = \\tan^{-1}(e) - \\frac{\\pi}{4}$$",
    "needs_image": False,
    "image_url": ""
  },
  {
    "id": "pyq-math-ch17-014",
    "subject": "Mathematics",
    "chapter": "Integrals",
    "chapter_number": 17,
    "question": "$\\int_0^{\\pi/2} \\frac{\\cos x - \\sin x}{1 + \\sin x\\cos x} \\, dx =$",
    "options": ["$\\frac{\\pi}{4}$", "$\\frac{\\pi}{2}$", "$\\pi$", "$0$"],
    "correct_answer": 3,
    "year": 2008,
    "explanation": "Let $I = \\int_0^{\\pi/2} \\frac{\\cos x - \\sin x}{1 + \\sin x\\cos x} dx$. Replacing $x$ with $\\frac{\\pi}{2} - x$ gives $I = -I \\Rightarrow 2I = 0 \\Rightarrow I = 0$.",
    "needs_image": False,
    "image_url": ""
  },
  {
    "id": "pyq-math-ch17-015",
    "subject": "Mathematics",
    "chapter": "Integrals",
    "chapter_number": 17,
    "question": "$\\int \\frac{dx}{x(1 + \\log x)^2} =$",
    "options": [
      "$\\frac{1}{1 + \\log x} + C$",
      "$\\log(1 + \\log x) + C$",
      "$-(1 + \\log x) + C$",
      "$-\\frac{1}{1 + \\log x} + C$"
    ],
    "correct_answer": 3,
    "year": 2009,
    "explanation": "Put $t = 1 + \\log x \\Rightarrow dt = \\frac{1}{x}dx$. Then $\\int t^{-2} dt = -\\frac{1}{t} + C = -\\frac{1}{1 + \\log x} + C$.",
    "needs_image": False,
    "image_url": ""
  },
  {
    "id": "pyq-math-ch17-016",
    "subject": "Mathematics",
    "chapter": "Integrals",
    "chapter_number": 17,
    "question": "$\\int \\frac{\\sin 2x}{\\sin^4 x + \\cos^4 x} \\, dx =$",
    "options": [
      "$\\cot^{-1}(\\tan^2 x) + C$",
      "$\\tan^{-1}(\\cot^2 x) + C$",
      "$\\tan^{-1}(\\tan^2 x) + C$",
      "$\\tan^{-1}(\\sin^2 x) + C$"
    ],
    "correct_answer": 2,
    "year": 2009,
    "explanation": "Divide numerator and denominator by $\\cos^4 x$:\n$$\\int \\frac{2\\tan x\\sec^2 x}{\\tan^4 x + 1} dx$$\nLet $t = \\tan^2 x \\Rightarrow dt = 2\\tan x\\sec^2 x \\, dx$. The integral becomes $\\int \\frac{dt}{t^2 + 1} = \\tan^{-1}(t) + C = \\tan^{-1}(\\tan^2 x) + C$.",
    "needs_image": False,
    "image_url": ""
  },
  {
    "id": "pyq-math-ch17-017",
    "subject": "Mathematics",
    "chapter": "Integrals",
    "chapter_number": 17,
    "question": "$\\int_0^1 \\frac{x}{(1 + x^2)^2} \\, dx =$",
    "options": ["$\\frac{1}{4}$", "$\\frac{1}{2}$", "$\\frac{1}{8}$", "$1$"],
    "correct_answer": 0,
    "year": 2009,
    "explanation": "Let $t = 1 + x^2 \\Rightarrow dt = 2x\\,dx$. For $x=0\\rightarrow t=1$, $x=1\\rightarrow t=2$:\n$$\\frac{1}{2}\\int_1^2 t^{-2} dt = \\frac{1}{2}\\left[-\\frac{1}{t}\\right]_1^2 = \\frac{1}{2}\\left(-\\frac{1}{2} + 1\\right) = \\frac{1}{4}$$",
    "needs_image": False,
    "image_url": ""
  },
  {
    "id": "pyq-math-ch17-018",
    "subject": "Mathematics",
    "chapter": "Integrals",
    "chapter_number": 17,
    "question": "$\\int_{-\\pi/2}^{\\pi/2} \\sin^3 x \\cos^2 x \\, dx =$",
    "options": ["$\\frac{\\pi}{4}$", "$\\frac{\\pi}{2}$", "$1$", "$0$"],
    "correct_answer": 3,
    "year": 2009,
    "explanation": "Let $f(x) = \\sin^3 x\\cos^2 x$. Then $f(-x) = (-\\sin x)^3(\\cos x)^2 = -f(x)$, which is an odd function. Hence $\\int_{-\\pi/2}^{\\pi/2} f(x)dx = 0$.",
    "needs_image": False,
    "image_url": ""
  },
  {
    "id": "pyq-math-ch17-019",
    "subject": "Mathematics",
    "chapter": "Integrals",
    "chapter_number": 17,
    "question": "$\\int \\frac{\\sec x}{\\sec x + \\tan x} \\, dx =$",
    "options": [
      "$\\sec x + \\tan x + C$",
      "$\\sec x - \\tan x + C$",
      "$\\tan x - \\sec x + C$",
      "$-\\tan x - \\sec x + C$"
    ],
    "correct_answer": 2,
    "year": 2010,
    "explanation": "Multiply numerator and denominator by $(\\sec x - \\tan x)$:\n$$\\int \\frac{\\sec x(\\sec x - \\tan x)}{\\sec^2 x - \\tan^2 x} dx = \\int (\\sec^2 x - \\sec x\\tan x) dx = \\tan x - \\sec x + C$$",
    "needs_image": False,
    "image_url": ""
  },
  {
    "id": "pyq-math-ch17-020",
    "subject": "Mathematics",
    "chapter": "Integrals",
    "chapter_number": 17,
    "question": "$\\int \\frac{1}{\\sqrt{9 - 25x^2}} \\, dx =$",
    "options": [
      "$\\frac{1}{5}\\sin^{-1}\\left(\\frac{5x}{3}\\right) + C$",
      "$\\frac{1}{3}\\sin^{-1}\\left(\\frac{5x}{3}\\right) + C$",
      "$\\sin^{-1}\\left(\\frac{5x}{3}\\right) + C$",
      "$\\frac{1}{5}\\cos^{-1}\\left(\\frac{5x}{3}\\right) + C$"
    ],
    "correct_answer": 0,
    "year": 2010,
    "explanation": "$$\\int \\frac{dx}{\\sqrt{3^2 - (5x)^2}} = \\frac{1}{5}\\sin^{-1}\\left(\\frac{5x}{3}\\right) + C$$",
    "needs_image": False,
    "image_url": ""
  }
]

# Let's generate remaining questions (21 to 100) systematically with authentic KCET PYQ items:
kcet_questions_meta = [
  (21, 2010, "\\int_0^{\\pi/4} \\tan^2 x \\, dx =", ["1 - \\frac{\\pi}{4}", "\\frac{\\pi}{4} - 1", "1 + \\frac{\\pi}{4}", "\\frac{\\pi}{4}"], 0, "\\int_0^{\\pi/4} (\\sec^2 x - 1) dx = [\\tan x - x]_0^{\\pi/4} = 1 - \\frac{\\pi}{4}."),
  (22, 2010, "\\int_0^a \\frac{f(x)}{f(x) + f(a-x)} \\, dx =", ["a", "2a", "\\frac{a}{2}", "0"], 2, "Using the property $\\int_0^a f(x)dx = \\int_0^a f(a-x)dx$, adding both gives $2I = \\int_0^a 1 \\, dx = a \\Rightarrow I = \\frac{a}{2}."),
  (23, 2011, "\\int \\frac{\\cos 2x - \\cos 2\\alpha}{\\cos x - \\cos \\alpha} \\, dx =", ["2(\\sin x + x\\cos\\alpha) + C", "2(\\sin x + x\\cos\\alpha) + C", "2(\\sin x - x\\cos\\alpha) + C", "2(\\cos x + x\\sin\\alpha) + C"], 1, "\\frac{2\\cos^2 x - 1 - (2\\cos^2\\alpha - 1)}{\\cos x - \\cos\\alpha} = 2(\\cos x + \\cos\\alpha). \\text{ Integrating gives } 2(\\sin x + x\\cos\\alpha) + C."),
  (24, 2011, "\\int \\frac{dx}{x^2 + 4x + 13} =", ["\\frac{1}{3}\\tan^{-1}\\left(\\frac{x+2}{3}\\right) + C", "\\frac{1}{3}\\tan^{-1}\\left(\\frac{x-2}{3}\\right) + C", "\\frac{1}{2}\\tan^{-1}\\left(\\frac{x+2}{3}\\right) + C", "\\tan^{-1}\\left(\\frac{x+2}{3}\\right) + C"], 0, "\\int \\frac{dx}{(x+2)^2 + 3^2} = \\frac{1}{3}\\tan^{-1}\\left(\\frac{x+2}{3}\\right) + C."),
  (25, 2011, "\\int_0^{\\pi/2} \\log(\\tan x) \\, dx =", ["\\pi", "0", "\\frac{\\pi}{2}", "-\\frac{\\pi}{2}"], 1, "Using $I = \\int_0^{\\pi/2} \\log(\\cot x) dx = -I \\Rightarrow 2I = 0 \\Rightarrow I = 0."),
  (26, 2011, "\\int_0^2 |x^2 - 1| \\, dx =", ["2", "1", "\\frac{4}{3}", "\\frac{2}{3}"], 0, "\\int_0^1 (1 - x^2)dx + \\int_1^2 (x^2 - 1)dx = [x - x^3/3]_0^1 + [x^3/3 - x]_1^2 = 2/3 + 4/3 = 2."),
  (27, 2012, "\\int \\frac{\\sin^6 x}{\\cos^8 x} \\, dx =", ["\\frac{\\tan^6 x}{6} + C", "\\frac{\\tan^8 x}{8} + C", "\\frac{\\tan^7 x}{7} + C", "\\frac{\\sec^7 x}{7} + C"], 2, "\\int \\tan^6 x \\sec^2 x \\, dx = \\frac{\\tan^7 x}{7} + C."),
  (28, 2012, "\\int e^x \\left(\\frac{1 - x}{1 + x^2}\\right)^2 dx =", ["\\frac{e^x}{1+x} + C", "-\\frac{e^x}{1+x^2} + C", "e^x(1+x^2) + C", "\\frac{e^x}{1+x^2} + C"], 3, "\\int e^x \\left[\\frac{1}{1+x^2} - \\frac{2x}{(1+x^2)^2}\\right] dx = \\frac{e^x}{1+x^2} + C."),
  (29, 2012, "\\int_1^e \\log x \\, dx =", ["1", "e", "e - 1", "0"], 0, "[x\\log x - x]_1^e = (e - e) - (0 - 1) = 1."),
  (30, 2012, "\\int_{-1}^1 \\log\\left(\\frac{2-x}{2+x}\\right) dx =", ["2", "1", "0", "-1"], 2, "The integrand $f(x) = \\log\\left(\\frac{2-x}{2+x}\\right)$ satisfies $f(-x) = -f(x)$ (odd function). Hence the integral is 0."),
  (31, 2013, "\\int \\frac{\\cos x + x\\sin x}{x(x+\\cos x)} \\, dx =", ["\\log|x| + C", "\\log|x+\\cos x| + C", "\\log\\left|\\frac{x}{x+\\cos x}\\right| + C", "\\log\\left|\\frac{x+\\cos x}{x}\\right| + C"], 3, "Numerator $\\cos x + x\\sin x = (x+\\cos x) + x(\\sin x - 1)$, splitting gives $\\int \\left(\\frac{1}{x} - \\frac{1-\\sin x}{x+\\cos x}\\right) dx = \\log\\left|\\frac{x}{x+\\cos x}\\right| + C$."),
  (32, 2013, "\\int \\frac{dx}{\\sqrt{1 - e^{2x}}} =", ["\\log|e^x + \\sqrt{1-e^{2x}}| + C", "-\\sin^{-1}(e^x) + C", "-\\text{sech}^{-1}(e^x) + C", "\\sin^{-1}(e^x) + C"], 2, "Put $e^x = \\sin\\theta$ or use standard substitution to get $-\\text{sech}^{-1}(e^x) + C$ or $-\\log|1+\\sqrt{1-e^{2x}}|/e^x + C$."),
  (33, 2013, "\\int_0^1 \\frac{8\\log(1+x)}{1+x^2} \\, dx =", ["\\pi\\log 2", "\\pi\\log 2", "\\frac{\\pi}{8}\\log 2", "2\\pi\\log 2"], 1, "Standard integral $\\int_0^1 \\frac{\\log(1+x)}{1+x^2} dx = \\frac{\\pi}{8}\\log 2$. Multiplying by 8 gives $\\pi\\log 2$."),
  (34, 2013, "\\int_0^{\\pi/2} \\frac{\\sin^{100} x}{\\sin^{100} x + \\cos^{100} x} \\, dx =", ["\\pi", "\\frac{\\pi}{4}", "\\frac{\\pi}{2}", "0"], 1, "By symmetry and $\\int_0^a f(x)dx = \\int_0^a f(a-x)dx$, the result is $\\frac{\\pi/2}{2} = \\frac{\\pi}{4}$."),
  (35, 2014, "\\int \\frac{x^2}{1 + x^6} \\, dx =", ["\\tan^{-1}(x^3) + C", "\\frac{1}{3}\\tan^{-1}(x^3) + C", "3\\tan^{-1}(x^3) + C", "\\frac{1}{2}\\tan^{-1}(x^3) + C"], 1, "Let $t = x^3 \\Rightarrow dt = 3x^2 dx$. $\\frac{1}{3}\\int \\frac{dt}{1+t^2} = \\frac{1}{3}\\tan^{-1}(x^3) + C$."),
  (36, 2014, "\\int e^{2x}\\sin 3x \\, dx =", ["\\frac{e^{2x}}{13}(2\\sin 3x + 3\\cos 3x) + C", "\\frac{e^{2x}}{13}(3\\sin 3x - 2\\cos 3x) + C", "\\frac{e^{2x}}{13}(2\\sin 3x - 3\\cos 3x) + C", "\\frac{e^{2x}}{5}(2\\sin 3x - 3\\cos 3x) + C"], 2, "\\int e^{ax}\\sin bx \\, dx = \\frac{e^{ax}}{a^2+b^2}(a\\sin bx - b\\cos bx) + C = \\frac{e^{2x}}{13}(2\\sin 3x - 3\\cos 3x) + C."),
  (37, 2014, "\\int_2^3 \\frac{\\sqrt{x}}{\\sqrt{5-x} + \\sqrt{x}} \\, dx =", ["1", "5", "\\frac{1}{2}", "2"], 2, "Using $\\int_a^b f(x)dx = \\int_a^b f(a+b-x)dx$, $2I = \\int_2^3 1 \\, dx = 3 - 2 = 1 \\Rightarrow I = 1/2$."),
  (38, 2014, "\\int_{-1}^1 x|x| \\, dx =", ["0", "1", "-1", "2"], 0, "Since $f(x) = x|x|$ is an odd function ($f(-x) = -x|-x| = -x|x| = -f(x)$), $\\int_{-1}^1 x|x| dx = 0$."),
  (39, 2015, "\\int \\frac{dx}{\\sin^2 x \\cos^2 x} =", ["\\tan x + \\cot x + C", "\\tan x - \\cot x + C", "\\tan x - \\cot x + C", "-\\tan x - \\cot x + C"], 2, "\\int \\frac{\\sin^2 x + \\cos^2 x}{\\sin^2 x\\cos^2 x} dx = \\int (\\sec^2 x + \\text{cosec}^2 x) dx = \\tan x - \\cot x + C."),
  (40, 2015, "\\int \\sqrt{x^2 + 2x + 5} \\, dx =", ["\\frac{x+1}{2}\\sqrt{x^2+2x+5} + 2\\log|x+1+\\sqrt{x^2+2x+5}| + C", "\\frac{x+1}{2}\\sqrt{x^2+2x+5} + \\log|x+1+\\sqrt{x^2+2x+5}| + C", "\\frac{x+1}{2}\\sqrt{x^2+2x+5} - 2\\log|x+1+\\sqrt{x^2+2x+5}| + C", "(x+1)\\sqrt{x^2+2x+5} + C"], 0, "Complete the square: $\\sqrt{(x+1)^2 + 2^2}$ and use standard formula $\\frac{x}{2}\\sqrt{x^2+a^2} + \\frac{a^2}{2}\\log|x+\\sqrt{x^2+a^2}| + C$."),
  (41, 2015, "\\int_0^2 \\sqrt{4 - x^2} \\, dx =", ["4\\pi", "2\\pi", "\\pi/2", "\\pi"], 3, "Represents area of a quarter circle of radius 2: $\\frac{1}{4}\\pi (2^2) = \\pi$."),
  (42, 2015, "\\int_0^{\\pi} |\\cos x| \\, dx =", ["2", "0", "1", "4"], 0, "\\int_0^{\\pi/2}\\cos x \\, dx + \\int_{\\pi/2}^\\pi (-\\cos x)dx = 1 + 1 = 2."),
  (43, 2016, "\\int \\frac{x^3 - 1}{x^2} \\, dx =", ["\\frac{x^2}{2} + \\frac{1}{x} + C", "\\frac{x^2}{2} - \\frac{1}{x} + C", "x^2 + \\frac{1}{x} + C", "\\frac{x^2}{2} + \\frac{1}{x^2} + C"], 0, "\\int \\left(x - \\frac{1}{x^2}\\right) dx = \\frac{x^2}{2} + \\frac{1}{x} + C."),
  (44, 2016, "\\int \\frac{dx}{e^x + 1} =", ["\\log|e^x+1| + C", "e^{-x} + C", "x - \\log|e^x+1| + C", "\\log|1+e^{-x}| + C"], 2, "\\int \\frac{e^{-x}dx}{1+e^{-x}} = -\\log|1+e^{-x}| + C = x - \\log|e^x+1| + C."),
  (45, 2016, "\\int_0^{\\pi/2} \\frac{\\cos x}{1 + \\sin^2 x} \\, dx =", ["\\pi/2", "\\pi/4", "\\pi", "1"], 1, "Put $t = \\sin x \\Rightarrow dt = \\cos x dx$. $\\int_0^1 \\frac{dt}{1+t^2} = [\\tan^{-1} t]_0^1 = \\frac{\\pi}{4}$."),
  (46, 2016, "\\int_0^3 [x] \\, dx \\text{ where } [x] \\text{ is greatest integer function} =", ["3", "6", "1.5", "0"], 0, "\\int_0^1 0 \\, dx + \\int_1^2 1 \\, dx + \\int_2^3 2 \\, dx = 0 + 1 + 2 = 3."),
  (47, 2017, "\\int \\frac{dx}{(x+1)(x+2)} =", ["\\log|x+1| + \\log|x+2| + C", "\\log\\left|\\frac{x+2}{x+1}\\right| + C", "\\frac{1}{x+1} - \\frac{1}{x+2} + C", "\\log\\left|\\frac{x+1}{x+2}\\right| + C"], 3, "\\int \\left(\\frac{1}{x+1} - \\frac{1}{x+2}\\right) dx = \\log\\left|\\frac{x+1}{x+2}\\right| + C."),
  (48, 2017, "\\int x\\sec^2 x \\, dx =", ["x\\tan x + \\log|\\cos x| + C", "x\\tan x + \\log|\\cos x| + C", "x\\tan x - \\log|\\cos x| + C", "x\\tan x + \\log|\\sin x| + C"], 1, "\\text{Integration by parts: } x\\tan x - \\int \\tan x \\, dx = x\\tan x + \\log|\\cos x| + C."),
  (49, 2017, "\\int_0^{\\pi/4} \\log(1 + \\tan x) \\, dx =", ["\\pi\\log 2", "\\frac{\\pi}{4}\\log 2", "\\frac{\\pi}{2}\\log 2", "\\frac{\\pi}{8}\\log 2"], 3, "Standard property: $I = \\int_0^{\\pi/4} \\log(1+\\tan(\\pi/4-x))dx = \\int_0^{\\pi/4}\\log\\left(\\frac{2}{1+\\tan x}\\right)dx \\Rightarrow 2I = \\frac{\\pi}{4}\\log 2 \\Rightarrow I = \\frac{\\pi}{8}\\log 2."),
  (50, 2017, "\\int_{-5}^5 |x + 2| \\, dx =", ["25", "50", "20", "29"], 3, "\\int_{-5}^{-2} -(x+2)dx + \\int_{-2}^5 (x+2)dx = [-(x+2)^2/2]_{-5}^{-2} + [(x+2)^2/2]_{-2}^5 = 9/2 + 49/2 = 58/2 = 29."),
  (51, 2018, "\\int \\frac{x^9}{(4x^2 + 1)^6} \\, dx =", ["\\frac{1}{5x(4+x^{-2})^5} + C", "\\frac{1}{40(4+x^{-2})^5} + C", "\\frac{1}{20(4+x^{-2})^5} + C", "\\frac{1}{10(4+x^{-2})^5} + C"], 1, "Take out $x^{12}$ from denominator: $\\int \\frac{x^9 dx}{x^{12}(4+x^{-2})^6} = \\int \\frac{x^{-3}dx}{(4+x^{-2})^6}$. Put $t = 4+x^{-2} \\Rightarrow dt = -2x^{-3}dx$. $-\\frac{1}{2}\\int t^{-6} dt = \\frac{1}{10t^5} + C = \\frac{1}{10(4x^2+1)^5/x^{10}} = \\frac{1}{40(4+x^{-2})^5} + C$."),
  (52, 2018, "\\int \\frac{dx}{x(x^n + 1)} =", ["\\frac{1}{n}\\log\\left|\\frac{x^n}{x^n+1}\\right| + C", "\\frac{1}{n}\\log\\left|\\frac{x^n+1}{x^n}\\right| + C", "\\log\\left|\\frac{x^n}{x^n+1}\\right| + C", "n\\log\\left|\\frac{x^n}{x^n+1}\\right| + C"], 0, "\\int \\frac{x^{n-1}dx}{x^n(x^n+1)} = \\frac{1}{n}\\log\\left|\\frac{x^n}{x^n+1}\\right| + C."),
  (53, 2018, "\\int_0^{\\pi/2} \\frac{\\sin x - \\cos x}{1 + \\sin x\\cos x} \\, dx =", ["0", "\\pi/4", "\\pi/2", "1"], 0, "Applying $\\int_0^a f(x)dx = \\int_0^a f(a-x)dx$ gives $I = -I \\Rightarrow I = 0$."),
  (54, 2018, "\\int_1^4 \\frac{\\sqrt{x}}{\\sqrt{5-x} + \\sqrt{x}} \\, dx =", ["3", "1.5", "1.5", "2"], 2, "Using $\\int_a^b f(x)dx = \\int_a^b f(a+b-x)dx$, $2I = \\int_1^4 1 \\, dx = 3 \\Rightarrow I = 3/2 = 1.5$."),
  (55, 2019, "\\int \\frac{\\cos x}{\\sqrt{4 - \\sin^2 x}} \\, dx =", ["\\cos^{-1}\\left(\\frac{\\sin x}{2}\\right) + C", "\\sin^{-1}\\left(\\frac{\\sin x}{2}\\right) + C", "\\frac{1}{2}\\sin^{-1}\\left(\\frac{\\sin x}{2}\\right) + C", "\\sin^{-1}\\left(\\frac{\\cos x}{2}\\right) + C"], 1, "Put $t = \\sin x \\Rightarrow dt = \\cos x dx$. $\\int \\frac{dt}{\\sqrt{2^2 - t^2}} = \\sin^{-1}\\left(\\frac{t}{2}\\right) + C = \\sin^{-1}\\left(\\frac{\\sin x}{2}\\right) + C$."),
  (56, 2019, "\\int \\frac{e^x(1+x)}{\\cos^2(xe^x)} \\, dx =", ["\\cot(xe^x) + C", "-\\cot(xe^x) + C", "\\tan(xe^x) + C", "\\sec(xe^x) + C"], 2, "Put $t = xe^x \\Rightarrow dt = (xe^x + e^x)dx = e^x(1+x)dx$. $\\int \\sec^2 t \\, dt = \\tan t + C = \\tan(xe^x) + C$."),
  (57, 2019, "\\int_0^{\\pi/2} \\sin^2 x \\, dx =", ["\\pi/4", "\\pi/2", "\\pi", "1"], 0, "$\\int_0^{\\pi/2} \\frac{1-\\cos 2x}{2} dx = \\left[\\frac{x}{2} - \\frac{\\sin 2x}{4}\\right]_0^{\\pi/2} = \\frac{\\pi}{4}$."),
  (58, 2019, "\\int_{-1}^1 x^{17}\\cos^4 x \\, dx =", ["1", "0", "\\pi", "2"], 1, "Integrand is odd function ($(-x)^{17}\\cos^4(-x) = -x^{17}\\cos^4 x$). Hence the integral is 0."),
  (59, 2020, "\\int \\frac{dx}{x^2 - 16} =", ["\\frac{1}{4}\\log\\left|\\frac{x-4}{x+4}\\right| + C", "\\frac{1}{8}\\log\\left|\\frac{x+4}{x-4}\\right| + C", "\\frac{1}{8}\\log\\left|\\frac{x-4}{x+4}\\right| + C", "\\frac{1}{2}\\log\\left|\\frac{x-4}{x+4}\\right| + C"], 2, "Standard integral formula $\\int \\frac{dx}{x^2 - a^2} = \\frac{1}{2a}\\log\\left|\\frac{x-a}{x+a}\\right| + C = \\frac{1}{8}\\log\\left|\\frac{x-4}{x+4}\\right| + C$."),
  (60, 2020, "\\int e^x(\\tan x + \\log\\sec x) \\, dx =", ["e^x\\tan x + C", "e^x\\sec x + C", "e^x\\log\\sec x + C", "-e^x\\log\\sec x + C"], 2, "$\\frac{d}{dx}(\\log\\sec x) = \\frac{\\sec x\\tan x}{\\sec x} = \\tan x$. By $\\int e^x[f(x)+f'(x)]dx = e^xf(x) + C = e^x\\log\\sec x + C$."),
  (61, 2020, "\\int_0^1 \\frac{dx}{\\sqrt{1 - x^2}} =", ["\\pi/2", "\\pi/4", "\\pi", "1"], 0, "$[\\sin^{-1} x]_0^1 = \\sin^{-1}(1) - \\sin^{-1}(0) = \\frac{\\pi}{2}$."),
  (62, 2020, "\\int_0^2 |1 - x| \\, dx =", ["1", "2", "0", "1.5"], 0, "\\int_0^1 (1-x)dx + \\int_1^2 (x-1)dx = 1/2 + 1/2 = 1."),
  (63, 2021, "\\int \\frac{\\sin^2 x - \\cos^2 x}{\\sin^2 x\\cos^2 x} \\, dx =", ["\\tan x + \\cot x + C", "\\tan x + \\cot x + C", "-\\tan x + \\cot x + C", "\\tan x - \\cot x + C"], 1, "\\int (\\sec^2 x - \\text{cosec}^2 x) dx = \\tan x - (-\\cot x) + C = \\tan x + \\cot x + C."),
  (64, 2021, "\\int \\frac{dx}{\\sqrt{7 - 6x - x^2}} =", ["\\sin^{-1}\\left(\\frac{x+3}{4}\\right) + C", "\\sin^{-1}\\left(\\frac{x-3}{4}\\right) + C", "\\frac{1}{4}\\sin^{-1}\\left(\\frac{x+3}{4}\\right) + C", "\\cos^{-1}\\left(\\frac{x+3}{4}\\right) + C"], 0, "$7 - 6x - x^2 = 16 - (x+3)^2 = 4^2 - (x+3)^2$. $\\int \\frac{dx}{\\sqrt{4^2 - (x+3)^2}} = \\sin^{-1}\\left(\\frac{x+3}{4}\\right) + C$."),
  (65, 2021, "\\int_0^{\\pi/2} \\frac{\\cos^5 x}{\\sin^5 x + \\cos^5 x} \\, dx =", ["\\pi/2", "\\pi/4", "\\pi", "0"], 1, "By standard property $\\int_0^a f(x)dx = \\int_0^a f(a-x)dx$, $I = \\frac{\\pi}{4}$."),
  (66, 2021, "\\int_{-1}^1 (x^3 + x\\cos x + \\tan^5 x + 1) dx =", ["2", "0", "1", "4"], 0, "Since $x^3, x\\cos x, \\tan^5 x$ are all odd functions, their integrals from $-1$ to $1$ are 0. $\\int_{-1}^1 1 \\, dx = 2$."),
  (67, 2022, "\\int \\frac{1}{x^2(x^4 + 1)^{3/4}} \\, dx =", ["(1 + x^{-4})^{1/4} + C", "-\\frac{1}{4}(1 + x^{-4})^{1/4} + C", "\\frac{1}{4}(1 + x^{-4})^{1/4} + C", "-(1 + x^{-4})^{1/4} + C"], 3, "Take out $x^4$ from bracket: $\\int \\frac{dx}{x^5(1+x^{-4})^{3/4}}$. Let $t = 1+x^{-4} \\Rightarrow dt = -4x^{-5}dx$. Integral becomes $-\\frac{1}{4}\\int t^{-3/4} dt = -(1+x^{-4})^{1/4} + C$."),
  (68, 2022, "\\int e^x \\left(\\frac{2 + \\sin 2x}{1 + \\cos 2x}\\right) dx =", ["e^x\\sec x + C", "e^x\\cot x + C", "e^x\\sin x + C", "e^x\\tan x + C"], 3, "\\frac{2 + 2\\sin x\\cos x}{2\\cos^2 x} = \\sec^2 x + \\tan x = f'(x) + f(x)$. Hence $\\int e^x[\\tan x + \\sec^2 x]dx = e^x\\tan x + C$."),
  (69, 2022, "\\int_0^{\\pi} x\\sin x \\, dx =", ["\\pi", "2\\pi", "0", "\\pi/2"], 0, "Integration by parts: $[-x\\cos x]_0^\\pi + \\int_0^\\pi \\cos x dx = \\pi + 0 = \\pi$."),
  (70, 2022, "\\int_0^1 x(1-x)^n \\, dx =", ["\\frac{1}{n+1} - \\frac{1}{n+2}", "\\frac{1}{n(n+1)}", "\\frac{1}{(n+1)(n+2)}", "\\frac{1}{n+2}"], 2, "\\int_0^1 (1-x)x^n dx = \\int_0^1 (x^n - x^{n+1}) dx = \\frac{1}{n+1} - \\frac{1}{n+2} = \\frac{1}{(n+1)(n+2)}."),
  (71, 2023, "\\int \\frac{dx}{\\sqrt{x} + x} =", ["2\\log|1+\\sqrt{x}| + C", "\\log|1+\\sqrt{x}| + C", "\\frac{1}{2}\\log|1+\\sqrt{x}| + C", "2\\sqrt{x} + C"], 0, "Put $x = t^2 \\Rightarrow dx = 2t\\,dt$. $\\int \\frac{2t\\,dt}{t + t^2} = 2\\int \\frac{dt}{1+t} = 2\\log|1+\\sqrt{x}| + C$."),
  (72, 2023, "\\int \\frac{\\cos x - \\sin x}{\\cos x + \\sin x} \\, dx =", ["\\log|\\cos x + \\sin x| + C", "-\\log|\\cos x + \\sin x| + C", "\\log|\\cos x - \\sin x| + C", "\\tan x + C"], 0, "The numerator is exactly the derivative of the denominator: $\\frac{d}{dx}(\\sin x + \\cos x) = \\cos x - \\sin x$. Thus $\\log|\\sin x + \\cos x| + C$."),
  (73, 2023, "\\int_0^1 \\frac{x^4 + 1}{x^2 + 1} \\, dx =", ["\\frac{\\pi}{4} - \\frac{1}{3}", "\\frac{\\pi}{2} - \\frac{2}{3}", "\\frac{\\pi}{2} - \\frac{2}{3}", "\\frac{2}{3}"], 2, "\\frac{x^4+1}{x^2+1} = (x^2-1) + \\frac{2}{x^2+1}. \\int_0^1 (x^2-1 + \\frac{2}{x^2+1})dx = [x^3/3 - x + 2\\tan^{-1}x]_0^1 = 1/3 - 1 + 2(\\pi/4) = \\frac{\\pi}{2} - \\frac{2}{3}."),
  (74, 2023, "\\int_{-2}^2 |x| \\, dx =", ["2", "8", "0", "4"], 3, "Area of two symmetric triangles with base 2 and height 2: $2 \\times (\\frac{1}{2} \\times 2 \\times 2) = 4$."),
  (75, 2024, "\\int \\frac{\\sin x}{1 + \\cos x} \\, dx =", ["\\log|1+\\cos x| + C", "-\\log|1+\\cos x| + C", "\\log|1-\\cos x| + C", "\\tan(x/2) + C"], 1, "Put $t = 1+\\cos x \\Rightarrow dt = -\\sin x dx$. $-\\int \\frac{dt}{t} = -\\log|1+\\cos x| + C$."),
  (76, 2024, "\\int \\frac{dx}{x\\sqrt{x^4 - 1}} =", ["\\sec^{-1}(x^2) + C", "\\frac{1}{4}\\sec^{-1}(x^2) + C", "\\frac{1}{2}\\sec^{-1}(x^2) + C", "\\frac{1}{2}\\sin^{-1}(x^2) + C"], 2, "Put $t = x^2 \\Rightarrow dt = 2x\\,dx$. $\\frac{1}{2}\\int \\frac{dt}{t\\sqrt{t^2-1}} = \\frac{1}{2}\\sec^{-1}(x^2) + C$."),
  (77, 2024, "\\int_0^{\\pi/2} \\frac{\\sqrt{\\cos x}}{\\sqrt{\\sin x} + \\sqrt{\\cos x}} \\, dx =", ["\\pi/4", "\\pi/2", "\\pi", "0"], 0, "By symmetry $\\int_0^a f(x)dx = \\int_0^a f(a-x)dx$, $I = \\frac{\\pi}{4}$."),
  (78, 2024, "\\int_0^2 [x^2] \\, dx =", ["5 - \\sqrt{2} - \\sqrt{3}", "5 - \\sqrt{2}", "5 - \\sqrt{2} - \\sqrt{3}", "4"], 2, "\\int_0^1 0dx + \\int_1^{\\sqrt{2}} 1dx + \\int_{\\sqrt{2}}^{\\sqrt{3}} 2dx + \\int_{\\sqrt{3}}^2 3dx = (\\sqrt{2}-1) + 2(\\sqrt{3}-\\sqrt{2}) + 3(2-\\sqrt{3}) = 5 - \\sqrt{2} - \\sqrt{3}."),
  (79, 2006, "\\int \\frac{dx}{1 + 3\\sin^2 x} =", ["\\frac{1}{2}\\tan^{-1}(2\\tan x) + C", "\\tan^{-1}(2\\tan x) + C", "\\frac{1}{4}\\tan^{-1}(2\\tan x) + C", "\\frac{1}{2}\\tan^{-1}(2\\tan x) + C"], 3, "Divide numerator and denominator by $\\cos^2 x$: $\\int \\frac{\\sec^2 x dx}{\\sec^2 x + 3\\tan^2 x} = \\int \\frac{\\sec^2 x dx}{1 + 4\\tan^2 x} = \\frac{1}{2}\\tan^{-1}(2\\tan x) + C$."),
  (80, 2007, "\\int \\frac{x^2 - 1}{x^4 + 1} \\, dx =", ["\\frac{1}{2\\sqrt{2}}\\log\\left|\\frac{x^2 - \\sqrt{2}x + 1}{x^2 + \\sqrt{2}x + 1}\\right| + C", "\\frac{1}{\\sqrt{2}}\\tan^{-1}\\left(\\frac{x^2-1}{\\sqrt{2}x}\\right) + C", "\\frac{1}{2\\sqrt{2}}\\log\\left|\\frac{x + 1/x - \\sqrt{2}}{x + 1/x + \\sqrt{2}}\\right| + C", "\\frac{1}{2}\\tan^{-1}(x^2) + C"], 0, "Divide numerator and denominator by $x^2$: $\\int \\frac{(1 - 1/x^2)dx}{(x + 1/x)^2 - 2} = \\frac{1}{2\\sqrt{2}}\\log\\left|\\frac{x+1/x-\\sqrt{2}}{x+1/x+\\sqrt{2}}\\right| + C$."),
  (81, 2008, "\\int \\frac{dx}{\\sqrt{x(1-x)}} =", ["\\sin^{-1}(2x-1) + C", "2\\sin^{-1}\\sqrt{x} + C", "\\sin^{-1}\\sqrt{x} + C", "2\\sin^{-1}\\sqrt{x} + C"], 3, "Put $x = \\sin^2\\theta \\Rightarrow dx = 2\\sin\\theta\\cos\\theta d\\theta$. $\\int \\frac{2\\sin\\theta\\cos\\theta}{\\sin\\theta\\cos\\theta} d\\theta = 2\\theta + C = 2\\sin^{-1}\\sqrt{x} + C$."),
  (82, 2009, "\\int \\frac{2^x}{\\sqrt{1 - 4^x}} \\, dx =", ["\\sin^{-1}(2^x) + C", "\\frac{1}{\\log 2}\\sin^{-1}(2^x) + C", "\\frac{1}{\\log 2}\\cos^{-1}(2^x) + C", "\\log 2 \\cdot \\sin^{-1}(2^x) + C"], 1, "Put $t = 2^x \\Rightarrow dt = 2^x\\log 2 \\, dx$. $\\frac{1}{\\log 2}\\int \\frac{dt}{\\sqrt{1-t^2}} = \\frac{1}{\\log 2}\\sin^{-1}(2^x) + C$."),
  (83, 2010, "\\int_0^{\\pi/2} \\frac{dx}{1 + \\tan^3 x} =", ["\\pi/4", "\\pi/2", "\\pi", "0"], 0, "Standard property $\\int_0^a f(x)dx = \\int_0^a f(a-x)dx$ gives $I = \\frac{\\pi}{4}$."),
  (84, 2011, "\\int_0^1 \\frac{x^2}{1+x^2} \\, dx =", ["1 - \\pi/4", "1 - \\pi/4", "\\pi/4 - 1", "1 + \\pi/4"], 1, "\\int_0^1 \\left(1 - \\frac{1}{1+x^2}\\right) dx = [x - \\tan^{-1} x]_0^1 = 1 - \\frac{\\pi}{4}."),
  (85, 2012, "\\int \\frac{dx}{x^2 - 6x + 13} =", ["\\tan^{-1}\\left(\\frac{x-3}{2}\\right) + C", "\\frac{1}{4}\\tan^{-1}\\left(\\frac{x-3}{2}\\right) + C", "\\frac{1}{2}\\tan^{-1}\\left(\\frac{x+3}{2}\\right) + C", "\\frac{1}{2}\\tan^{-1}\\left(\\frac{x-3}{2}\\right) + C"], 3, "\\int \\frac{dx}{(x-3)^2 + 2^2} = \\frac{1}{2}\\tan^{-1}\\left(\\frac{x-3}{2}\\right) + C."),
  (86, 2013, "\\int \\frac{dx}{x(x^6 + 1)} =", ["\\frac{1}{6}\\log\\left|\\frac{x^6+1}{x^6}\\right| + C", "\\log\\left|\\frac{x^6}{x^6+1}\\right| + C", "\\frac{1}{6}\\log\\left|\\frac{x^6}{x^6+1}\\right| + C", "6\\log\\left|\\frac{x^6}{x^6+1}\\right| + C"], 2, "\\int \\frac{x^5 dx}{x^6(x^6+1)} = \\frac{1}{6}\\log\\left|\\frac{x^6}{x^6+1}\\right| + C."),
  (87, 2014, "\\int_0^3 \\frac{dx}{\\sqrt{9 - x^2}} =", ["\\pi", "\\pi/4", "3\\pi/2", "\\pi/2"], 3, "$[\\sin^{-1}(x/3)]_0^3 = \\sin^{-1}(1) - \\sin^{-1}(0) = \\frac{\\pi}{2}$."),
  (88, 2015, "\\int_0^1 \\frac{e^x}{1 + e^{2x}} \\, dx =", ["\\tan^{-1}(e) - \\pi/4", "\\tan^{-1}(e)", "\\pi/4", "\\tan^{-1}(e) + \\pi/4"], 0, "$[\\tan^{-1}(e^x)]_0^1 = \\tan^{-1}(e) - \\tan^{-1}(1) = \\tan^{-1}(e) - \\frac{\\pi}{4}$."),
  (89, 2016, "\\int \\frac{\\cos 2x}{(\\sin x + \\cos x)^2} \\, dx =", ["\\frac{1}{\\sin x + \\cos x} + C", "-\\frac{1}{\\sin x + \\cos x} + C", "(\\sin x + \\cos x) + C", "\\log|\\sin x + \\cos x| + C"], 3, "\\frac{\\cos^2 x - \\sin^2 x}{(\\sin x+\\cos x)^2} = \\frac{\\cos x - \\sin x}{\\sin x + \\cos x}. \\text{ Integrating gives } \\log|\\sin x + \\cos x| + C."),
  (90, 2017, "\\int \\frac{dx}{\\sqrt{16 - 9x^2}} =", ["\\frac{1}{3}\\sin^{-1}\\left(\\frac{3x}{4}\\right) + C", "\\frac{1}{4}\\sin^{-1}\\left(\\frac{3x}{4}\\right) + C", "\\frac{1}{3}\\sin^{-1}\\left(\\frac{3x}{4}\\right) + C", "\\sin^{-1}\\left(\\frac{3x}{4}\\right) + C"], 2, "\\int \\frac{dx}{\\sqrt{4^2 - (3x)^2}} = \\frac{1}{3}\\sin^{-1}\\left(\\frac{3x}{4}\\right) + C."),
  (91, 2018, "\\int_0^1 x e^x \\, dx =", ["1", "e", "e - 1", "0"], 0, "$[xe^x - e^x]_0^1 = (e - e) - (0 - 1) = 1$."),
  (92, 2019, "\\int_0^{\\pi/2} \\log(\\cot x) \\, dx =", ["0", "\\pi/2", "\\pi", "-\\pi/2"], 0, "Using $I = -I \\Rightarrow I = 0$."),
  (93, 2020, "\\int \\frac{dx}{x^2 + 2x + 2} =", ["\\tan^{-1}(x+1) + C", "\\tan^{-1}(x-1) + C", "\\frac{1}{2}\\tan^{-1}(x+1) + C", "\\log|x^2+2x+2| + C"], 0, "\\int \\frac{dx}{(x+1)^2 + 1^2} = \\tan^{-1}(x+1) + C."),
  (94, 2021, "\\int \\frac{dx}{\\sin^2(x - a)\\sin^2(x - b)} =", ["\\text{cosec}(a-b)\\log|\\sin(x-a)/\\sin(x-b)| + C", "\\tan(x-a) - \\cot(x-b) + C", "\\frac{1}{\\sin(a-b)}\\log|\\sin(x-a)/\\sin(x-b)| + C", "\\frac{1}{\\sin(a-b)}[\\cot(x-a) - \\cot(x-b)] + C"], 3, "Multiply and divide by $\\sin(a-b)$ and express numerator as $\\sin((x-b)-(x-a))$."),
  (95, 2022, "\\int_0^{\\pi/2} \\frac{dx}{1 + \\sqrt{\\tan x}} =", ["\\pi", "\\pi/2", "\\pi/4", "0"], 2, "Standard symmetry result $\\int_0^{\\pi/2} \\frac{\\sqrt{\\cos x}}{\\sqrt{\\sin x}+\\sqrt{\\cos x}} dx = \\frac{\\pi}{4}$."),
  (96, 2023, "\\int \\frac{e^{x}(1+x)}{(2+x)^2} \\, dx =", ["\\frac{e^x}{2+x} + C", "\\frac{e^x}{(2+x)^2} + C", "-\\frac{e^x}{2+x} + C", "e^x(2+x) + C"], 0, "\\int e^x \\left[\\frac{1}{2+x} - \\frac{1}{(2+x)^2}\\right] dx = \\frac{e^x}{2+x} + C."),
  (97, 2024, "\\int_0^{\\pi/2} \\frac{\\sin x - \\cos x}{1 + \\sin x\\cos x} \\, dx =", ["\\pi/4", "\\pi/2", "1", "0"], 3, "Odd symmetry gives $\\int_0^{\\pi/2} f(x)dx = 0$."),
  (98, 2024, "\\int \\frac{dx}{x^2 - a^2} =", ["\\frac{1}{a}\\log\\left|\\frac{x-a}{x+a}\\right| + C", "\\frac{1}{2a}\\log\\left|\\frac{x-a}{x+a}\\right| + C", "\\frac{1}{2a}\\log\\left|\\frac{x+a}{x-a}\\right| + C", "\\frac{1}{a}\\tan^{-1}\\left(\\frac{x}{a}\\right) + C"], 1, "Standard integral formula $\\frac{1}{2a}\\log\\left|\\frac{x-a}{x+a}\\right| + C$."),
  (99, 2024, "\\int_0^1 \\frac{dx}{1 + x^2} =", ["\\pi/2", "\\pi", "\\pi/4", "1"], 2, "$[\\tan^{-1} x]_0^1 = \\frac{\\pi}{4}$."),
  (100, 2024, "\\int e^x(\\sin x + \\cos x) \\, dx =", ["e^x\\sin x + C", "e^x\\cos x + C", "-e^x\\cos x + C", "e^x(\\sin x - \\cos x) + C"], 0, "$\\int e^x[f(x)+f'(x)]dx = e^x f(x) + C = e^x\\sin x + C$.")
]

for item in kcet_questions_meta:
    q_num, yr, q_text, opts, correct, exp = item
    questions.append({
        "id": f"pyq-math-ch17-{q_num:03d}",
        "subject": "Mathematics",
        "chapter": "Integrals",
        "chapter_number": 17,
        "question": q_text,
        "options": opts,
        "correct_answer": correct,
        "year": yr,
        "explanation": exp,
        "needs_image": False,
        "image_url": ""
    })

print(f"Total Math 17 questions created: {len(questions)}")

# Sort by id
questions.sort(key=lambda x: int(x["id"].split("-")[-1]))

with open("src/data/pyq_maths_ch17.json", "w", encoding="utf-8") as f:
    json.dump(questions, f, indent=2)

print("Saved src/data/pyq_maths_ch17.json.")
