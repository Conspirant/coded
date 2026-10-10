import json
import os

# Mathematics Chapter 14: Limits and Derivatives (Book Chapter 14)
# Questions: Q1 to Q29

questions = [
  {
    "id": "math_ch14_q1",
    "subject": "Mathematics",
    "chapter": "Limits and Derivatives",
    "chapter_number": 14,
    "year": 2006,
    "question": "The value of $\\lim_{x \\to 0} \\frac{5^x - 5^{-x}}{2x} =$",
    "options": [
      "log 5",
      "0",
      "1",
      "2 log 5"
    ],
    "correct_answer": 0,
    "explanation": "Rewriting the limit:\n$$\\lim_{x \\to 0} \\frac{5^x - 5^{-x}}{2x} = \\lim_{x \\to 0} \\frac{5^{2x} - 1}{2x \\cdot 5^x} = \\lim_{x \\to 0} \\left( \\frac{5^{2x} - 1}{2x} \\right) \\cdot \\lim_{x \\to 0} \\frac{1}{5^x}$$\n\nUsing the standard limit formula $\\lim_{u \\to 0} \\frac{a^u - 1}{u} = \\log a$ (with $u = 2x$):\n$$= (\\log 5) \\cdot \\frac{1}{5^0} = \\log 5$$\n\nHence, option (a) is correct.",
    "needs_image": False
  },
  {
    "id": "math_ch14_q2",
    "subject": "Mathematics",
    "chapter": "Limits and Derivatives",
    "chapter_number": 14,
    "year": 2007,
    "question": "$\\lim_{x \\to 1} \\frac{\\tan(x^2 - 1)}{x - 1}$ is equal to",
    "options": [
      "2",
      "1/2",
      "-2",
      "-1/2"
    ],
    "correct_answer": 0,
    "explanation": "This is of indeterminate form $\\frac{0}{0}$. Applying L'Hôpital's Rule or algebraic factorization:\n$$\\lim_{x \\to 1} \\frac{\\tan(x^2 - 1)}{x - 1} = \\lim_{x \\to 1} \\left[ \\frac{\\tan(x^2 - 1)}{x^2 - 1} \\cdot \\frac{x^2 - 1}{x - 1} \\right]$$\n$$= \\lim_{x \\to 1} \\frac{\\tan(x^2 - 1)}{x^2 - 1} \\cdot \\lim_{x \\to 1} (x + 1) = 1 \\cdot (1 + 1) = 2$$\n\nHence, option (a) is correct.",
    "needs_image": False
  },
  {
    "id": "math_ch14_q3",
    "subject": "Mathematics",
    "chapter": "Limits and Derivatives",
    "chapter_number": 14,
    "year": 2008,
    "question": "$\\lim_{x \\to \\infty} x \\sin\\left(\\frac{2}{x}\\right)$ is equal to",
    "options": [
      "2",
      "1/2",
      "∞",
      "0"
    ],
    "correct_answer": 0,
    "explanation": "Substitute $y = \\frac{1}{x}$. As $x \\to \\infty$, $y \\to 0$:\n$$\\lim_{x \\to \\infty} x \\sin\\left(\\frac{2}{x}\\right) = \\lim_{y \\to 0} \\frac{1}{y} \\sin(2y) = \\lim_{y \\to 0} 2 \\cdot \\frac{\\sin(2y)}{2y} = 2(1) = 2$$\n\nHence, option (a) is correct.",
    "needs_image": False
  },
  {
    "id": "math_ch14_q4",
    "subject": "Mathematics",
    "chapter": "Limits and Derivatives",
    "chapter_number": 14,
    "year": 2009,
    "question": "$\\lim_{n \\to \\infty} \\frac{3 \\cdot 2^{n+1} - 4 \\cdot 5^{n+1}}{5 \\cdot 2^n + 7 \\cdot 5^n} =$",
    "options": [
      "-20/7",
      "0",
      "3/5",
      "-4/7"
    ],
    "correct_answer": 0,
    "explanation": "Dividing the numerator and denominator by $5^n$:\n$$\\lim_{n \\to \\infty} \\frac{3 \\cdot 2 \\cdot \\left(\\frac{2}{5}\\right)^n - 4 \\cdot 5}{5 \\cdot \\left(\\frac{2}{5}\\right)^n + 7} = \\lim_{n \\to \\infty} \\frac{6 \\left(\\frac{2}{5}\\right)^n - 20}{5 \\left(\\frac{2}{5}\\right)^n + 7}$$\n\nSince $0 < \\frac{2}{5} < 1$, $\\lim_{n \\to \\infty} \\left(\\frac{2}{5}\\right)^n = 0$:\n$$= \\frac{6(0) - 20}{5(0) + 7} = -\\frac{20}{7}$$\n\nHence, option (a) is correct.",
    "needs_image": False
  },
  {
    "id": "math_ch14_q5",
    "subject": "Mathematics",
    "chapter": "Limits and Derivatives",
    "chapter_number": 14,
    "year": 2010,
    "question": "$\\lim_{n \\to \\infty} \\left[ n \\sin\\frac{2\\pi}{3n} \\cdot \\cos\\frac{2\\pi}{3n} \\right] =$",
    "options": [
      "2π/3",
      "π/6",
      "π/3",
      "1"
    ],
    "correct_answer": 0,
    "explanation": "Using the double angle identity $2\\sin\\theta\\cos\\theta = \\sin(2\\theta)$:\n$$n \\sin\\frac{2\\pi}{3n} \\cos\\frac{2\\pi}{3n} = \\frac{n}{2} \\sin\\left(\\frac{4\\pi}{3n}\\right)$$\n\nTaking limit as $n \\to \\infty$:\n$$\\lim_{n \\to \\infty} \\frac{n}{2} \\sin\\left(\\frac{4\\pi}{3n}\\right) = \\lim_{n \\to \\infty} \\frac{1}{2} \\cdot \\frac{\\sin\\left(\\frac{4\\pi}{3n}\\right)}{\\frac{4\\pi}{3n}} \\cdot \\frac{4\\pi}{3} = \\frac{1}{2} (1) \\cdot \\frac{4\\pi}{3} = \\frac{2\\pi}{3}$$\n\nHence, option (a) is correct.",
    "needs_image": False
  },
  {
    "id": "math_ch14_q6",
    "subject": "Mathematics",
    "chapter": "Limits and Derivatives",
    "chapter_number": 14,
    "year": 2011,
    "question": "$\\lim_{x \\to a} \\frac{\\sqrt{a+2x} - \\sqrt{3x}}{\\sqrt{3a+x} - 2\\sqrt{x}} =$",
    "options": [
      "2/3",
      "2/√3",
      "3√3/2",
      "2/(3√3)"
    ],
    "correct_answer": 3,
    "explanation": "Rationalizing both the numerator and denominator:\n$$\\lim_{x \\to a} \\frac{(a+2x) - 3x}{(3a+x) - 4x} \\cdot \\frac{\\sqrt{3a+x} + 2\\sqrt{x}}{\\sqrt{a+2x} + \\sqrt{3x}}$$\n$$= \\lim_{x \\to a} \\frac{a - x}{3(a - x)} \\cdot \\frac{\\sqrt{3a+x} + 2\\sqrt{x}}{\\sqrt{a+2x} + \\sqrt{3x}}$$\n$$= \\frac{1}{3} \\cdot \\frac{\\sqrt{4a} + 2\\sqrt{a}}{\\sqrt{3a} + \\sqrt{3a}} = \\frac{1}{3} \\cdot \\frac{4\\sqrt{a}}{2\\sqrt{3}\\sqrt{a}} = \\frac{1}{3} \\cdot \\frac{2}{\\sqrt{3}} = \\frac{2}{3\\sqrt{3}}$$\n\nHence, option (d) is correct.",
    "needs_image": False
  },
  {
    "id": "math_ch14_q7",
    "subject": "Mathematics",
    "chapter": "Limits and Derivatives",
    "chapter_number": 14,
    "year": 2011,
    "question": "$f(x) = \\frac{\\sin^2 x}{1 + \\cot x} + \\frac{\\cos^2 x}{1 + \\tan x}$, then $f'\\left(\\frac{\\pi}{4}\\right)$ is",
    "options": [
      "√3",
      "1/√3",
      "0",
      "-√3"
    ],
    "correct_answer": 2,
    "explanation": "Simplifying $f(x)$:\n$$f(x) = \\frac{\\sin^2 x}{1 + \\frac{\\cos x}{\\sin x}} + \\frac{\\cos^2 x}{1 + \\frac{\\sin x}{\\cos x}} = \\frac{\\sin^3 x}{\\sin x + \\cos x} + \\frac{\\cos^3 x}{\\cos x + \\sin x}$$\n$$f(x) = \\frac{\\sin^3 x + \\cos^3 x}{\\sin x + \\cos x} = \\frac{(\\sin x + \\cos x)(\\sin^2 x - \\sin x \\cos x + \\cos^2 x)}{\\sin x + \\cos x} = 1 - \\sin x \\cos x = 1 - \\frac{1}{2}\\sin 2x$$\n\nDifferentiating with respect to $x$:\n$$f'(x) = -\\frac{1}{2} (2\\cos 2x) = -\\cos 2x$$\n\nAt $x = \\frac{\\pi}{4}$:\n$$f'\\left(\\frac{\\pi}{4}\\right) = -\\cos\\left(2 \\cdot \\frac{\\pi}{4}\\right) = -\\cos\\frac{\\pi}{2} = 0$$\n\nHence, option (c) is correct.",
    "needs_image": False
  },
  {
    "id": "math_ch14_q8",
    "subject": "Mathematics",
    "chapter": "Limits and Derivatives",
    "chapter_number": 14,
    "year": 2012,
    "question": "$\\lim_{x \\to 0} \\frac{x 2^x - x}{1 - \\cos x} =$",
    "options": [
      "1/2",
      "2 log 2",
      "log 2",
      "(1/2) log 2"
    ],
    "correct_answer": 1,
    "explanation": "Factoring the numerator:\n$$\\lim_{x \\to 0} \\frac{x(2^x - 1)}{1 - \\cos x} = \\lim_{x \\to 0} \\left[ \\frac{2^x - 1}{x} \\cdot \\frac{x^2}{1 - \\cos x} \\right]$$\n\nUsing standard limits $\\lim_{x \\to 0} \\frac{2^x - 1}{x} = \\log 2$ and $\\lim_{x \\to 0} \\frac{1 - \\cos x}{x^2} = \\frac{1}{2}$:\n$$= (\\log 2) \\cdot \\frac{1}{\\frac{1}{2}} = 2\\log 2$$\n\nHence, option (b) is correct.",
    "needs_image": False
  },
  {
    "id": "math_ch14_q9",
    "subject": "Mathematics",
    "chapter": "Limits and Derivatives",
    "chapter_number": 14,
    "year": 2012,
    "question": "If $f(x) = \\sin[\\pi^2]x + \\cos[-\\pi^2]x$ then $f'(x)$ is, here $[\\pi^2]$ and $[-\\pi^2]$ are greatest integer function not greater than its value",
    "options": [
      "-1",
      "sin 9x + cos 9x",
      "9 cos 9x - 10 sin 10x",
      "0"
    ],
    "correct_answer": 2,
    "explanation": "Since $\\pi \\approx 3.1416$, $\\pi^2 \\approx 9.8696$:\n- $[\\pi^2] = [9.8696] = 9$\n- $[-\\pi^2] = [-9.8696] = -10$\n\nTherefore:\n$$f(x) = \\sin(9x) + \\cos(-10x) = \\sin(9x) + \\cos(10x)$$\n\nDifferentiating with respect to $x$:\n$$f'(x) = 9\\cos(9x) - 10\\sin(10x)$$\n\nHence, option (c) is correct.",
    "needs_image": False
  },
  {
    "id": "math_ch14_q10",
    "subject": "Mathematics",
    "chapter": "Limits and Derivatives",
    "chapter_number": 14,
    "year": 2013,
    "question": "$\\lim_{x \\to 0} \\frac{\\log_e(1+x)}{3^x - 1} =$",
    "options": [
      "log_e 3",
      "0",
      "log_3 e",
      "1"
    ],
    "correct_answer": 2,
    "explanation": "Dividing numerator and denominator by $x$:\n$$\\lim_{x \\to 0} \\frac{\\frac{\\log_e(1+x)}{x}}{\\frac{3^x - 1}{x}} = \\frac{1}{\\log_e 3} = \\log_3 e$$\n\nHence, option (c) is correct.",
    "needs_image": False
  },
  {
    "id": "math_ch14_q11",
    "subject": "Mathematics",
    "chapter": "Limits and Derivatives",
    "chapter_number": 14,
    "year": 2014,
    "question": "If $y = (1+x)(1+x^2)(1+x^4)$, then $\\frac{dy}{dx}$ at $x=1$ is",
    "options": [
      "20",
      "28",
      "1",
      "0"
    ],
    "correct_answer": 1,
    "explanation": "Multiplying and dividing by $(1-x)$ for $x \\ne 1$:\n$$y = \\frac{(1-x)(1+x)(1+x^2)(1+x^4)}{1-x} = \\frac{1 - x^8}{1 - x} = 1 + x + x^2 + x^3 + x^4 + x^5 + x^6 + x^7$$\n\nDifferentiating with respect to $x$:\n$$\\frac{dy}{dx} = 1 + 2x + 3x^2 + 4x^3 + 5x^4 + 6x^5 + 7x^6$$\n\nAt $x = 1$:\n$$\\left. \\frac{dy}{dx} \\right|_{x=1} = 1 + 2 + 3 + 4 + 5 + 6 + 7 = \\frac{7 \\times 8}{2} = 28$$\n\nHence, option (b) is correct.",
    "needs_image": False
  },
  {
    "id": "math_ch14_q12",
    "subject": "Mathematics",
    "chapter": "Limits and Derivatives",
    "chapter_number": 14,
    "year": 2014,
    "question": "If the function $f(x)$ satisfies $\\lim_{x \\to 1} \\frac{f(x) - 2}{x^2 - 1} = \\pi$, then $\\lim_{x \\to 1} f(x) =$",
    "options": [
      "1",
      "2",
      "0",
      "3"
    ],
    "correct_answer": 1,
    "explanation": "Since $\\lim_{x \\to 1} (x^2 - 1) = 0$ and the quotient limit exists and equals $\\pi$, the numerator must approach 0:\n$$\\lim_{x \\to 1} [f(x) - 2] = \\lim_{x \\to 1} \\left[ \\frac{f(x) - 2}{x^2 - 1} \\cdot (x^2 - 1) \\right] = \\pi \\cdot 0 = 0$$\n$$\\lim_{x \\to 1} f(x) - 2 = 0 \\implies \\lim_{x \\to 1} f(x) = 2$$\n\nHence, option (b) is correct.",
    "needs_image": False
  },
  {
    "id": "math_ch14_q13",
    "subject": "Mathematics",
    "chapter": "Limits and Derivatives",
    "chapter_number": 14,
    "year": 2014,
    "question": "If the function $f(x)$ defined by $f(x) = \\frac{x^{100}}{100} + \\frac{x^{99}}{99} + \\dots + \\frac{x^2}{2} + x + 1$, then $f'(0) =$",
    "options": [
      "100 f'(0)",
      "100",
      "1",
      "-1"
    ],
    "correct_answer": 2,
    "explanation": "Differentiating $f(x)$ term by term:\n$$f'(x) = x^{99} + x^{98} + x^{97} + \\dots + x + 1 + 0$$\n\nEvaluating at $x = 0$:\n$$f'(0) = 0 + 0 + \\dots + 0 + 1 = 1$$\n\nHence, option (c) is correct.",
    "needs_image": False
  },
  {
    "id": "math_ch14_q14",
    "subject": "Mathematics",
    "chapter": "Limits and Derivatives",
    "chapter_number": 14,
    "year": 2015,
    "question": "$\\lim_{x \\to 0} \\frac{1 - \\cos x}{x^2}$ is _____.",
    "options": [
      "3",
      "1/3",
      "2",
      "1/2"
    ],
    "correct_answer": 3,
    "explanation": "Using the trigonometric identity $1 - \\cos x = 2\\sin^2\\left(\\frac{x}{2}\\right)$:\n$$\\lim_{x \\to 0} \\frac{2\\sin^2(x/2)}{x^2} = 2 \\lim_{x \\to 0} \\left( \\frac{\\sin(x/2)}{x/2} \\right)^2 \\cdot \\frac{1}{4} = 2(1)^2 \\cdot \\frac{1}{4} = \\frac{1}{2}$$\n\nHence, option (d) is correct.",
    "needs_image": False
  },
  {
    "id": "math_ch14_q15",
    "subject": "Mathematics",
    "chapter": "Limits and Derivatives",
    "chapter_number": 14,
    "year": 2015,
    "question": "If $y = f(x^2 + 2)$ and $f'(3) = 5$, then $\\frac{dy}{dx}$ at $x = 1$ is _____.",
    "options": [
      "25",
      "10",
      "5",
      "15"
    ],
    "correct_answer": 1,
    "explanation": "Using the chain rule:\n$$\\frac{dy}{dx} = f'(x^2 + 2) \\cdot \\frac{d}{dx}(x^2 + 2) = f'(x^2 + 2) \\cdot (2x)$$\n\nAt $x = 1$:\n$$\\left. \\frac{dy}{dx} \\right|_{x=1} = f'(1^2 + 2) \\cdot 2(1) = f'(3) \\cdot 2 = 5 \\cdot 2 = 10$$\n\nHence, option (b) is correct.",
    "needs_image": False
  },
  {
    "id": "math_ch14_q16",
    "subject": "Mathematics",
    "chapter": "Limits and Derivatives",
    "chapter_number": 14,
    "year": 2015,
    "question": "If the function $g(x)$ is defined by $g(x) = \\frac{x^{200}}{200} + \\frac{x^{199}}{199} + \\frac{x^{198}}{198} + \\dots + \\frac{x^2}{2} + x + 5$, then $g'(0) = _____$.",
    "options": [
      "200",
      "5",
      "1",
      "100"
    ],
    "correct_answer": 2,
    "explanation": "Differentiating $g(x)$:\n$$g'(x) = x^{199} + x^{198} + \\dots + x + 1 + 0$$\n\nAt $x = 0$:\n$$g'(0) = 0 + 0 + \\dots + 0 + 1 = 1$$\n\nHence, option (c) is correct.",
    "needs_image": False
  },
  {
    "id": "math_ch14_q17",
    "subject": "Mathematics",
    "chapter": "Limits and Derivatives",
    "chapter_number": 14,
    "year": 2016,
    "question": "$\\lim_{x \\to 0} \\frac{x e^x - \\sin x}{x}$ is equal to",
    "options": [
      "3",
      "1",
      "0",
      "2"
    ],
    "correct_answer": 2,
    "explanation": "Splitting the fraction:\n$$\\lim_{x \\to 0} \\left( \\frac{x e^x}{x} - \\frac{\\sin x}{x} \\right) = \\lim_{x \\to 0} e^x - \\lim_{x \\to 0} \\frac{\\sin x}{x} = e^0 - 1 = 1 - 1 = 0$$\n\nHence, option (c) is correct.",
    "needs_image": False
  },
  {
    "id": "math_ch14_q18",
    "subject": "Mathematics",
    "chapter": "Limits and Derivatives",
    "chapter_number": 14,
    "year": 2017,
    "question": "The value of $\\lim_{\\theta \\to 0} \\frac{1 - \\cos 4\\theta}{1 - \\cos 6\\theta}$ is",
    "options": [
      "9/4",
      "4/9",
      "9/3",
      "3/4"
    ],
    "correct_answer": 1,
    "explanation": "Using the standard limit $\\lim_{u \\to 0} \\frac{1 - \\cos(ku)}{u^2} = \\frac{k^2}{2}$:\n$$\\lim_{\\theta \\to 0} \\frac{1 - \\cos 4\\theta}{1 - \\cos 6\\theta} = \\lim_{\\theta \\to 0} \\frac{\\frac{1 - \\cos 4\\theta}{\\theta^2}}{\\frac{1 - \\cos 6\\theta}{\\theta^2}} = \\frac{\\frac{4^2}{2}}{\\frac{6^2}{2}} = \\frac{16}{36} = \\frac{4}{9}$$\n\nHence, option (b) is correct.",
    "needs_image": False
  },
  {
    "id": "math_ch14_q19",
    "subject": "Mathematics",
    "chapter": "Limits and Derivatives",
    "chapter_number": 14,
    "year": 2017,
    "question": "The value of $\\lim_{x \\to 0} \\frac{|x|}{x}$ is",
    "options": [
      "1",
      "-1",
      "0",
      "Does not exist"
    ],
    "correct_answer": 3,
    "explanation": "- Left Hand Limit (LHL):\n$$\\lim_{x \\to 0^-} \\frac{|x|}{x} = \\lim_{h \\to 0} \\frac{|-h|}{-h} = \\lim_{h \\to 0} \\frac{h}{-h} = -1$$\n- Right Hand Limit (RHL):\n$$\\lim_{x \\to 0^+} \\frac{|x|}{x} = \\lim_{h \\to 0} \\frac{|h|}{h} = \\lim_{h \\to 0} \\frac{h}{h} = +1$$\n\nSince $\\text{LHL} \\ne \\text{RHL}$, the limit does not exist.\n\nHence, option (d) is correct.",
    "needs_image": False
  },
  {
    "id": "math_ch14_q20",
    "subject": "Mathematics",
    "chapter": "Limits and Derivatives",
    "chapter_number": 14,
    "year": 2018,
    "question": "If $[x]$ represents the greatest integer function and $f(x) = x - [x] - \\cos x$, then $f'\\left(\\frac{\\pi}{2}\\right) =$",
    "options": [
      "0",
      "2",
      "1",
      "does not exist"
    ],
    "correct_answer": 1,
    "explanation": "In an open interval around $x = \\frac{\\pi}{2} \\approx 1.5708$ (e.g., for $1 < x < 2$):\n$$[x] = 1 = \\text{constant}$$\n\nTherefore, for $x \\in (1, 2)$:\n$$f(x) = x - 1 - \\cos x$$\n\nDifferentiating with respect to $x$:\n$$f'(x) = 1 - 0 - (-\\sin x) = 1 + \\sin x$$\n\nAt $x = \\frac{\\pi}{2}$:\n$$f'\\left(\\frac{\\pi}{2}\\right) = 1 + \\sin\\frac{\\pi}{2} = 1 + 1 = 2$$\n\nHence, option (b) is correct.",
    "needs_image": False
  },
  {
    "id": "math_ch14_q21",
    "subject": "Mathematics",
    "chapter": "Limits and Derivatives",
    "chapter_number": 14,
    "year": 2019,
    "question": "$\\sum_{r=1}^n (2r - 1) = x$, then $\\lim_{n \\to \\infty} \\left[ \\frac{1^3}{x^2} + \\frac{2^3}{x^2} + \\frac{3^3}{x^2} + \\dots + \\frac{n^3}{x^2} \\right] =$",
    "options": [
      "1/2",
      "1",
      "1/4",
      "4"
    ],
    "correct_answer": 2,
    "explanation": "1. Sum of first $n$ odd natural numbers:\n$$x = \\sum_{r=1}^n (2r - 1) = n^2 \\implies x^2 = n^4$$\n\n2. Sum of cubes of first $n$ natural numbers:\n$$\\sum_{r=1}^n r^3 = \\frac{n^2(n+1)^2}{4}$$\n\n3. Evaluating the limit:\n$$\\lim_{n \\to \\infty} \\frac{\\sum_{r=1}^n r^3}{x^2} = \\lim_{n \\to \\infty} \\frac{\\frac{n^2(n+1)^2}{4}}{n^4} = \\lim_{n \\to \\infty} \\frac{1}{4} \\left(1 + \\frac{1}{n}\\right)^2 = \\frac{1}{4}(1)^2 = \\frac{1}{4}$$\n\nHence, option (c) is correct.",
    "needs_image": False
  },
  {
    "id": "math_ch14_q22",
    "subject": "Mathematics",
    "chapter": "Limits and Derivatives",
    "chapter_number": 14,
    "year": 2019,
    "question": "$\\lim_{x \\to 0} \\left( \\frac{\\tan x}{\\sqrt{2x+4} - 2} \\right)$ is equal to",
    "options": [
      "3",
      "4",
      "6",
      "2"
    ],
    "correct_answer": 3,
    "explanation": "Rationalizing the denominator:\n$$\\lim_{x \\to 0} \\frac{\\tan x}{\\sqrt{2x+4} - 2} = \\lim_{x \\to 0} \\frac{\\tan x (\\sqrt{2x+4} + 2)}{(2x+4) - 4} = \\lim_{x \\to 0} \\frac{\\tan x}{2x} (\\sqrt{2x+4} + 2)$$\n$$= \\frac{1}{2} \\left( \\lim_{x \\to 0} \\frac{\\tan x}{x} \\right) (\\sqrt{0+4} + 2) = \\frac{1}{2} (1) (2 + 2) = \\frac{4}{2} = 2$$\n\nHence, option (d) is correct.",
    "needs_image": False
  },
  {
    "id": "math_ch14_q23",
    "subject": "Mathematics",
    "chapter": "Limits and Derivatives",
    "chapter_number": 14,
    "year": 2020,
    "question": "The right hand and left hand limit of the function $f(x) = \\begin{cases} \\frac{e^{1/x} - 1}{e^{1/x} + 1}, & \\text{if } x \\ne 0 \\\\ 0, & \\text{if } x = 0 \\end{cases}$ are respectively",
    "options": [
      "1 and -1",
      "-1 and -1",
      "-1 and 1",
      "1 and 1"
    ],
    "correct_answer": 0,
    "explanation": "- Right Hand Limit (RHL):\nAs $x \\to 0^+$, $\\frac{1}{x} \\to +\\infty \\implies e^{1/x} \\to \\infty$:\n$$\\text{RHL} = \\lim_{x \\to 0^+} \\frac{1 - e^{-1/x}}{1 + e^{-1/x}} = \\frac{1 - 0}{1 + 0} = 1$$\n\n- Left Hand Limit (LHL):\nAs $x \\to 0^-$, $\\frac{1}{x} \\to -\\infty \\implies e^{1/x} \\to 0$:\n$$\\text{LHL} = \\lim_{x \\to 0^-} \\frac{e^{1/x} - 1}{e^{1/x} + 1} = \\frac{0 - 1}{0 + 1} = -1$$\n\nThus, RHL and LHL are $1$ and $-1$ respectively.\n\nHence, option (a) is correct.",
    "needs_image": False
  },
  {
    "id": "math_ch14_q24",
    "subject": "Mathematics",
    "chapter": "Limits and Derivatives",
    "chapter_number": 14,
    "year": 2021,
    "question": "Consider the following statements:\nStatement 1: $\\lim_{x \\to 1} \\frac{ax^2 + bx + c}{cx^2 + bx + a}$ is 1 (where $a+b+c \\ne 0$)\nStatement 2: $\\lim_{x \\to -2} \\frac{\\frac{1}{x} + \\frac{1}{2}}{x + 2}$ is $\\frac{1}{4}$",
    "options": [
      "Only statement 2 is true",
      "Only statement 1 is true",
      "Both statements 1 and 2 are true",
      "Both statements 1 and 2 are false"
    ],
    "correct_answer": 1,
    "explanation": "- Statement 1:\n$$\\lim_{x \\to 1} \\frac{ax^2 + bx + c}{cx^2 + bx + a} = \\frac{a(1)^2 + b(1) + c}{c(1)^2 + b(1) + a} = \\frac{a+b+c}{a+b+c} = 1 \\quad (\\text{True})$$\n\n- Statement 2:\n$$\\lim_{x \\to -2} \\frac{\\frac{2+x}{2x}}{x+2} = \\lim_{x \\to -2} \\frac{1}{2x} = \\frac{1}{2(-2)} = -\\frac{1}{4} \\ne \\frac{1}{4} \\quad (\\text{False})$$\n\nTherefore, only statement 1 is true.\n\nHence, option (b) is correct.",
    "needs_image": False
  },
  {
    "id": "math_ch14_q25",
    "subject": "Mathematics",
    "chapter": "Limits and Derivatives",
    "chapter_number": 14,
    "year": 2022,
    "question": "If $f(x) = \\begin{cases} x^2 - 1, & 0 < x < 2 \\\\ 2x + 3, & 2 \\le x < 3 \\end{cases}$, the quadratic equation whose roots are $\\lim_{x \\to 2^-} f(x)$ and $\\lim_{x \\to 2^+} f(x)$ is",
    "options": [
      "x² - 14x + 49 = 0",
      "x² - 6x + 9 = 0",
      "x² - 10x + 21 = 0",
      "x² - 7x + 8 = 0"
    ],
    "correct_answer": 2,
    "explanation": "1. $\\alpha = \\lim_{x \\to 2^-} f(x) = \\lim_{x \\to 2^-} (x^2 - 1) = 2^2 - 1 = 3$\n2. $\\beta = \\lim_{x \\to 2^+} f(x) = \\lim_{x \\to 2^+} (2x + 3) = 2(2) + 3 = 7$\n\nQuadratic equation with roots $\\alpha = 3$ and $\\beta = 7$:\n$$x^2 - (\\alpha + \\beta)x + \\alpha \\beta = 0$$\n$$x^2 - (3 + 7)x + (3 \\times 7) = 0 \\implies x^2 - 10x + 21 = 0$$\n\nHence, option (c) is correct.",
    "needs_image": False
  },
  {
    "id": "math_ch14_q26",
    "subject": "Mathematics",
    "chapter": "Limits and Derivatives",
    "chapter_number": 14,
    "year": 2022,
    "question": "$\\lim_{y \\to 0} \\frac{\\sqrt{3 + y^3} - \\sqrt{3}}{y^3} =$",
    "options": [
      "1/(2√3)",
      "2√3",
      "1/(3√2)",
      "3√2"
    ],
    "correct_answer": 0,
    "explanation": "Rationalizing the numerator:\n$$\\lim_{y \\to 0} \\frac{(\\sqrt{3 + y^3} - \\sqrt{3})(\\sqrt{3 + y^3} + \\sqrt{3})}{y^3(\\sqrt{3 + y^3} + \\sqrt{3})} = \\lim_{y \\to 0} \\frac{(3 + y^3) - 3}{y^3(\\sqrt{3 + y^3} + \\sqrt{3})}$$\n$$= \\lim_{y \\to 0} \\frac{y^3}{y^3(\\sqrt{3 + y^3} + \\sqrt{3})} = \\lim_{y \\to 0} \\frac{1}{\\sqrt{3 + y^3} + \\sqrt{3}} = \\frac{1}{\\sqrt{3} + \\sqrt{3}} = \\frac{1}{2\\sqrt{3}}$$\n\nHence, option (a) is correct.",
    "needs_image": False
  },
  {
    "id": "math_ch14_q27",
    "subject": "Mathematics",
    "chapter": "Limits and Derivatives",
    "chapter_number": 14,
    "year": 2023,
    "question": "If $y = (1+x^2)\\tan^{-1}x - x$ then $\\frac{dy}{dx}$ is",
    "options": [
      "2x tan⁻¹x",
      "x² tan⁻¹x",
      "(tan⁻¹x)/x",
      "x tan⁻¹x"
    ],
    "correct_answer": 0,
    "explanation": "Using product rule on the first term:\n$$\\frac{dy}{dx} = \\frac{d}{dx}(1+x^2) \\cdot \\tan^{-1}x + (1+x^2) \\cdot \\frac{d}{dx}(\\tan^{-1}x) - \\frac{d}{dx}(x)$$\n$$\\frac{dy}{dx} = (2x) \\tan^{-1}x + (1+x^2) \\left( \\frac{1}{1+x^2} \\right) - 1$$\n$$\\frac{dy}{dx} = 2x\\tan^{-1}x + 1 - 1 = 2x\\tan^{-1}x$$\n\nHence, option (a) is correct.",
    "needs_image": False
  },
  {
    "id": "math_ch14_q28",
    "subject": "Mathematics",
    "chapter": "Limits and Derivatives",
    "chapter_number": 14,
    "year": 2023,
    "question": "If $\\lim_{x \\to 0} \\frac{\\sin(2+x) - \\sin(2-x)}{x} = A \\cos B$, then the values of $A$ and $B$ respectively are",
    "options": [
      "2, 1",
      "2, 2",
      "1, 1",
      "1, 2"
    ],
    "correct_answer": 1,
    "explanation": "Using the transformation formula $\\sin C - \\sin D = 2\\cos\\left(\\frac{C+D}{2}\\right)\\sin\\left(\\frac{C-D}{2}\\right)$:\n$$\\sin(2+x) - \\sin(2-x) = 2\\cos\\left(\\frac{4}{2}\\right)\\sin\\left(\\frac{2x}{2}\\right) = 2\\cos 2 \\sin x$$\n\nTaking the limit:\n$$\\lim_{x \\to 0} \\frac{2\\cos 2 \\sin x}{x} = 2\\cos 2 \\lim_{x \\to 0} \\frac{\\sin x}{x} = 2\\cos 2 (1) = 2\\cos 2$$\n\nComparing with $A \\cos B$:\n$$A = 2, \\quad B = 2$$\n\nHence, option (b) is correct.",
    "needs_image": False
  },
  {
    "id": "math_ch14_q29",
    "subject": "Mathematics",
    "chapter": "Limits and Derivatives",
    "chapter_number": 14,
    "year": 2024,
    "question": "$\\lim_{x \\to \\frac{\\pi}{4}} \\frac{\\sqrt{2}\\cos x - 1}{\\cot x - 1}$ is equal to",
    "options": [
      "2",
      "√2",
      "1/2",
      "1/√2"
    ],
    "correct_answer": 2,
    "explanation": "This limit is of $\\frac{0}{0}$ form. Applying L'Hôpital's Rule:\n$$\\lim_{x \\to \\frac{\\pi}{4}} \\frac{\\frac{d}{dx}(\\sqrt{2}\\cos x - 1)}{\\frac{d}{dx}(\\cot x - 1)} = \\lim_{x \\to \\frac{\\pi}{4}} \\frac{-\\sqrt{2}\\sin x}{-\\csc^2 x} = \\lim_{x \\to \\frac{\\pi}{4}} \\sqrt{2}\\sin^3 x$$\n\nEvaluating at $x = \\frac{\\pi}{4}$:\n$$= \\sqrt{2} \\cdot \\left(\\frac{1}{\\sqrt{2}}\\right)^3 = \\sqrt{2} \\cdot \\frac{1}{2\\sqrt{2}} = \\frac{1}{2}$$\n\nHence, option (c) is correct.",
    "needs_image": False
  }
]

out_file = "src/data/pyq_maths_ch14.json"
with open(out_file, "w", encoding="utf-8") as f:
    json.dump(questions, f, indent=2, ensure_ascii=False)

print(f"Generated {len(questions)} questions in {out_file} successfully!")
