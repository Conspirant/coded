import json, os

# 101 Questions for Mathematics Chapter 15: Continuity and Differentiability
# KCET Chapterwise PYQ 2006-2024

questions = [
  {
    "id": "math_ch15_q1",
    "subject": "Mathematics",
    "year": 2006,
    "question": "Which one of the following is not true?",
    "options": [
      "Every polynomial function is continuous everywhere",
      "Every continuous function is differentiable everywhere",
      "Every differentiable function is continuous everywhere",
      "Constant function is continuous everywhere"
    ],
    "explanation": "Continuity is a necessary but not sufficient condition for differentiability. A function can be continuous at a point without being differentiable there. For example, $f(x) = |x|$ is continuous at $x = 0$, but it is not differentiable at $x = 0$ because the left-hand derivative ($-1$) does not equal the right-hand derivative ($+1$). Thus, statement (b) is not true.",
    "chapter": "Continuity and Differentiability",
    "chapter_number": 15,
    "correct_answer": 1,
    "needs_image": False
  },
  {
    "id": "math_ch15_q2",
    "subject": "Mathematics",
    "year": 2006,
    "question": "If $f(x) = \\begin{cases} \\frac{1 - \\cos kx}{x \\sin x}, & x \\ne 0 \\\\ \\frac{1}{2}, & x = 0 \\end{cases}$ is continuous at $x = 0$, then the value of $k$ is:",
    "options": [
      "$\\pm 2$",
      "$\\pm \\frac{1}{2}$",
      "$\\pm 1$",
      "$0$"
    ],
    "explanation": "For $f(x)$ to be continuous at $x = 0$, $\\lim_{x \\to 0} f(x) = f(0) = \\frac{1}{2}$.\n$$\\lim_{x \\to 0} \\frac{1 - \\cos kx}{x \\sin x} = \\lim_{x \\to 0} \\frac{2\\sin^2(kx/2)}{x^2 \\cdot \\frac{\\sin x}{x}} = 2 \\left(\\frac{k}{2}\\right)^2 \\frac{\\lim_{x \\to 0} \\left(\\frac{\\sin(kx/2)}{kx/2}\\right)^2}{\\lim_{x \\to 0} \\frac{\\sin x}{x}} = \\frac{k^2}{2}$$\nEquating to $f(0)$:\n$$\\frac{k^2}{2} = \\frac{1}{2} \\implies k^2 = 1 \\implies k = \\pm 1$$",
    "chapter": "Continuity and Differentiability",
    "chapter_number": 15,
    "correct_answer": 2,
    "needs_image": False
  },
  {
    "id": "math_ch15_q3",
    "subject": "Mathematics",
    "year": 2006,
    "question": "If $y = (1 + x)(1 + x^2)(1 + x^4)$, then $\\frac{dy}{dx}$ at $x = 0$ is:",
    "options": [
      "$1$",
      "$0$",
      "$2$",
      "$7$"
    ],
    "explanation": "Taking natural logarithm on both sides:\n$$\\log y = \\log(1 + x) + \\log(1 + x^2) + \\log(1 + x^4)$$\nDifferentiating both sides with respect to $x$:\n$$\\frac{1}{y}\\frac{dy}{dx} = \\frac{1}{1 + x} + \\frac{2x}{1 + x^2} + \\frac{4x^3}{1 + x^4}$$\nAt $x = 0$, $y = (1)(1)(1) = 1$:\n$$\\frac{dy}{dx}\\Big|_{x=0} = 1 \\cdot \\left(\\frac{1}{1} + 0 + 0\\right) = 1$$",
    "chapter": "Continuity and Differentiability",
    "chapter_number": 15,
    "correct_answer": 0,
    "needs_image": False
  },
  {
    "id": "math_ch15_q4",
    "subject": "Mathematics",
    "year": 2006,
    "question": "If $x = a(\\theta + \\sin\\theta)$ and $y = a(1 - \\cos\\theta)$, then $\\frac{dy}{dx}$ is:",
    "options": [
      "$\\cot\\left(\\frac{\\theta}{2}\\right)$",
      "$\\tan\\theta$",
      "$\\tan\\left(\\frac{\\theta}{2}\\right)$",
      "$\\cot\\theta$"
    ],
    "explanation": "Differentiating parametrically with respect to $\\theta$:\n$$\\frac{dx}{d\\theta} = a(1 + \\cos\\theta) = 2a\\cos^2\\left(\\frac{\\theta}{2}\\right)$$\n$$\\frac{dy}{d\\theta} = a(\\sin\\theta) = 2a\\sin\\left(\\frac{\\theta}{2}\\right)\\cos\\left(\\frac{\\theta}{2}\\right)$$\n$$\\frac{dy}{dx} = \\frac{dy/d\\theta}{dx/d\\theta} = \\frac{2a\\sin(\\theta/2)\\cos(\\theta/2)}{2a\\cos^2(\\theta/2)} = \\tan\\left(\\frac{\\theta}{2}\\right)$$",
    "chapter": "Continuity and Differentiability",
    "chapter_number": 15,
    "correct_answer": 2,
    "needs_image": False
  },
  {
    "id": "math_ch15_q5",
    "subject": "Mathematics",
    "year": 2007,
    "question": "If $\\sin(x + y) + \\cos(x + y) = \\log(x + y)$, then $\\frac{dy}{dx}$ is equal to:",
    "options": [
      "$1$",
      "$-1$",
      "$\\frac{x - y}{x + y}$",
      "$\\frac{1}{x + y}$"
    ],
    "explanation": "Let $u = x + y$. Then the given equation is $\\sin u + \\cos u = \\log u$.\nDifferentiating with respect to $x$:\n$$(\\cos u - \\sin u - \\frac{1}{u}) \\frac{du}{dx} = 0$$\nSince $\\cos u - \\sin u - \\frac{1}{u} \\ne 0$ in general, we must have:\n$$\\frac{du}{dx} = 0 \\implies \\frac{d}{dx}(x + y) = 0 \\implies 1 + \\frac{dy}{dx} = 0 \\implies \\frac{dy}{dx} = -1$$",
    "chapter": "Continuity and Differentiability",
    "chapter_number": 15,
    "correct_answer": 1,
    "needs_image": False
  },
  {
    "id": "math_ch15_q6",
    "subject": "Mathematics",
    "year": 2007,
    "question": "If $y = e^{\\sin^{-1} x}$, then $(1 - x^2) y_2 - x y_1$ is equal to:",
    "options": [
      "$-y$",
      "$0$",
      "$y$",
      "$2y$"
    ],
    "explanation": "Given $y = e^{\\sin^{-1} x}$. Differentiating with respect to $x$:\n$$y_1 = e^{\\sin^{-1} x} \\cdot \\frac{1}{\\sqrt{1 - x^2}} = \\frac{y}{\\sqrt{1 - x^2}}$$\n$$\\sqrt{1 - x^2} y_1 = y$$\nSquaring both sides:\n$$(1 - x^2) y_1^2 = y^2$$\nDifferentiating both sides with respect to $x$:\n$$(1 - x^2)(2 y_1 y_2) + (-2x) y_1^2 = 2y y_1$$\nDividing throughout by $2y_1$ ($y_1 \\ne 0$):\n$$(1 - x^2) y_2 - x y_1 = y$$",
    "chapter": "Continuity and Differentiability",
    "chapter_number": 15,
    "correct_answer": 2,
    "needs_image": False
  },
  {
    "id": "math_ch15_q7",
    "subject": "Mathematics",
    "year": 2007,
    "question": "If $f(x) = \\begin{cases} \\frac{\\sin 3x}{x}, & x \\ne 0 \\\\ k, & x = 0 \\end{cases}$ is continuous at $x = 0$, then $k$ is equal to:",
    "options": [
      "$1$",
      "$\\frac{1}{3}$",
      "$0$",
      "$3$"
    ],
    "explanation": "For continuity at $x = 0$:\n$$k = f(0) = \\lim_{x \\to 0} \\frac{\\sin 3x}{x} = 3 \\lim_{x \\to 0} \\frac{\\sin 3x}{3x} = 3(1) = 3$$",
    "chapter": "Continuity and Differentiability",
    "chapter_number": 15,
    "correct_answer": 3,
    "needs_image": False
  },
  {
    "id": "math_ch15_q8",
    "subject": "Mathematics",
    "year": 2008,
    "question": "If $y = \\tan^{-1}\\left(\\frac{\\cos x - \\sin x}{\\cos x + \\sin x}\\right)$, then $\\frac{dy}{dx}$ is:",
    "options": [
      "$-1$",
      "$1$",
      "$\\frac{1}{2}$",
      "$0$"
    ],
    "explanation": "Dividing numerator and denominator by $\\cos x$:\n$$y = \\tan^{-1}\\left(\\frac{1 - \\tan x}{1 + \\tan x}\\right) = \\tan^{-1}\\left(\\tan\\left(\\frac{\\pi}{4} - x\\right)\\right) = \\frac{\\pi}{4} - x$$\nDifferentiating with respect to $x$:\n$$\\frac{dy}{dx} = \\frac{d}{dx}\\left(\\frac{\\pi}{4} - x\\right) = -1$$",
    "chapter": "Continuity and Differentiability",
    "chapter_number": 15,
    "correct_answer": 0,
    "needs_image": False
  },
  {
    "id": "math_ch15_q9",
    "subject": "Mathematics",
    "year": 2008,
    "question": "The derivative of $\\sec^{-1}\\left(\\frac{1}{2x^2 - 1}\\right)$ with respect to $\\sqrt{1 - x^2}$ at $x = \\frac{1}{2}$ is:",
    "options": [
      "$2$",
      "$-2$",
      "$4$",
      "$-4$"
    ],
    "explanation": "Let $u = \\sec^{-1}\\left(\\frac{1}{2x^2 - 1}\\right) = \\cos^{-1}(2x^2 - 1)$.\nPut $x = \\cos\\theta \\implies u = \\cos^{-1}(\\cos 2\\theta) = 2\\theta = 2\\cos^{-1} x$.\nLet $v = \\sqrt{1 - x^2} = \\sin\\theta$.\n$$\\frac{du}{dx} = -\\frac{2}{\\sqrt{1 - x^2}}$$\n$$\\frac{dv}{dx} = \\frac{-2x}{2\\sqrt{1 - x^2}} = -\\frac{x}{\\sqrt{1 - x^2}}$$\n$$\\frac{du}{dv} = \\frac{du/dx}{dv/dx} = \\frac{-2/\\sqrt{1 - x^2}}{-x/\\sqrt{1 - x^2}} = \\frac{2}{x}$$\nAt $x = \\frac{1}{2}$:\n$$\\frac{du}{dv} = \\frac{2}{1/2} = 4$$",
    "chapter": "Continuity and Differentiability",
    "chapter_number": 15,
    "correct_answer": 2,
    "needs_image": False
  },
  {
    "id": "math_ch15_q10",
    "subject": "Mathematics",
    "year": 2008,
    "question": "If $x^y = e^{x - y}$, then $\\frac{dy}{dx}$ is equal to:",
    "options": [
      "$\\frac{\\log x}{(1 + \\log x)}$",
      "$\\frac{1}{(1 + \\log x)^2}$",
      "$\\frac{\\log x}{(1 + \\log x)^2}$",
      "$\\frac{1}{1 + \\log x}$"
    ],
    "explanation": "Taking natural logarithm on both sides:\n$$y \\log x = x - y$$\n$$y(1 + \\log x) = x \\implies y = \\frac{x}{1 + \\log x}$$\nDifferentiating with respect to $x$ using quotient rule:\n$$\\frac{dy}{dx} = \\frac{(1 + \\log x)(1) - x\\left(\\frac{1}{x}\\right)}{(1 + \\log x)^2} = \\frac{1 + \\log x - 1}{(1 + \\log x)^2} = \\frac{\\log x}{(1 + \\log x)^2}$$",
    "chapter": "Continuity and Differentiability",
    "chapter_number": 15,
    "correct_answer": 2,
    "needs_image": False
  },
  {
    "id": "math_ch15_q11",
    "subject": "Mathematics",
    "year": 2009,
    "question": "If $f(x) = \\begin{cases} kx + 1, & x \\le 5 \\\\ 3x - 5, & x > 5 \\end{cases}$ is continuous at $x = 5$, then the value of $k$ is:",
    "options": [
      "$\\frac{5}{9}$",
      "$\\frac{9}{5}$",
      "$\\frac{7}{5}$",
      "$\\frac{9}{5}$"
    ],
    "explanation": "For continuity at $x = 5$:\n$$\\lim_{x \\to 5^-} f(x) = \\lim_{x \\to 5^+} f(x)$$\n$$5k + 1 = 3(5) - 5$$\n$$5k + 1 = 10 \\implies 5k = 9 \\implies k = \\frac{9}{5}$$",
    "chapter": "Continuity and Differentiability",
    "chapter_number": 15,
    "correct_answer": 3,
    "needs_image": False
  },
  {
    "id": "math_ch15_q12",
    "subject": "Mathematics",
    "year": 2009,
    "question": "If $y = \\sqrt{\\sin x + \\sqrt{\\sin x + \\sqrt{\\sin x + \\dots \\infty}}}$, then $(2y - 1)\\frac{dy}{dx}$ is equal to:",
    "options": [
      "$\\sin x$",
      "$-\\cos x$",
      "$-\\sin x$",
      "$\\cos x$"
    ],
    "explanation": "We can write:\n$$y = \\sqrt{\\sin x + y}$$\nSquaring both sides:\n$$y^2 = \\sin x + y$$\nDifferentiating both sides with respect to $x$:\n$$2y \\frac{dy}{dx} = \\cos x + \\frac{dy}{dx}$$\n$$(2y - 1)\\frac{dy}{dx} = \\cos x$$",
    "chapter": "Continuity and Differentiability",
    "chapter_number": 15,
    "correct_answer": 3,
    "needs_image": False
  },
  {
    "id": "math_ch15_q13",
    "subject": "Mathematics",
    "year": 2010,
    "question": "If $f(x) = |x - 1| + |x - 2|$, then $f(x)$ is:",
    "options": [
      "Continuous at $x = 1$ and $x = 2$, but not differentiable at $x = 1$ and $x = 2$",
      "Differentiable everywhere in $\\mathbb{R}$",
      "Discontinuous at $x = 1$ and $x = 2$",
      "Neither continuous nor differentiable at $x = 1$ and $x = 2$"
    ],
    "explanation": "Modulus functions of linear polynomials $|x - a|$ are continuous everywhere on $\\mathbb{R}$. Thus, the sum $f(x) = |x - 1| + |x - 2|$ is continuous everywhere, including $x = 1$ and $x = 2$. However, the graph has sharp corners ('kinks') at $x = 1$ and $x = 2$, where left and right derivatives differ. Hence, $f(x)$ is continuous but not differentiable at $x = 1$ and $x = 2$.",
    "chapter": "Continuity and Differentiability",
    "chapter_number": 15,
    "correct_answer": 0,
    "needs_image": False
  },
  {
    "id": "math_ch15_q14",
    "subject": "Mathematics",
    "year": 2010,
    "question": "If $y = \\log_a x$, then $\\frac{dy}{dx}$ is:",
    "options": [
      "$\\frac{1}{x \\log_e a}$",
      "$\\frac{1}{x \\log_a e}$",
      "$\\frac{\\log_e a}{x}$",
      "$\\frac{1}{x}$"
    ],
    "explanation": "Using base change formula for logarithms:\n$$y = \\log_a x = \\frac{\\log_e x}{\\log_e a} = \\frac{1}{\\log_e a} \\ln x$$\nDifferentiating with respect to $x$:\n$$\\frac{dy}{dx} = \\frac{1}{\\log_e a} \\cdot \\frac{1}{x} = \\frac{1}{x \\log_e a}$$",
    "chapter": "Continuity and Differentiability",
    "chapter_number": 15,
    "correct_answer": 0,
    "needs_image": False
  },
  {
    "id": "math_ch15_q15",
    "subject": "Mathematics",
    "year": 2011,
    "question": "If $f(x) = \\begin{cases} \\frac{\\sqrt{1 + kx} - \\sqrt{1 - kx}}{x}, & -1 \\le x < 0 \\\\ \\frac{2x + 1}{x - 1}, & 0 \\le x \\le 1 \\end{cases}$ is continuous at $x = 0$, then $k$ is equal to:",
    "options": [
      "$1$",
      "$-2$",
      "$-1$",
      "$2$"
    ],
    "explanation": "For continuity at $x = 0$, $\\lim_{x \\to 0^-} f(x) = f(0)$.\n$$f(0) = \\frac{2(0) + 1}{0 - 1} = -1$$\n$$\\lim_{x \\to 0^-} \\frac{\\sqrt{1 + kx} - \\sqrt{1 - kx}}{x} = \\lim_{x \\to 0^-} \\frac{(1 + kx) - (1 - kx)}{x(\\sqrt{1 + kx} + \\sqrt{1 - kx})} = \\lim_{x \\to 0^-} \\frac{2kx}{x(1 + 1)} = k$$\nEquating both sides:\n$$k = -1$$",
    "chapter": "Continuity and Differentiability",
    "chapter_number": 15,
    "correct_answer": 2,
    "needs_image": False
  },
  {
    "id": "math_ch15_q16",
    "subject": "Mathematics",
    "year": 2011,
    "question": "If $x = a\\cos^3\\theta$ and $y = a\\sin^3\\theta$, then $\\sqrt{1 + \\left(\\frac{dy}{dx}\\right)^2}$ is equal to:",
    "options": [
      "$\\tan^2\\theta$",
      "$\\sec\\theta$",
      "$\\tan\\theta$",
      "$|\\sec\\theta|$"
    ],
    "explanation": "$$\\frac{dx}{d\\theta} = -3a\\cos^2\\theta\\sin\\theta$$\n$$\\frac{dy}{d\\theta} = 3a\\sin^2\\theta\\cos\\theta$$\n$$\\frac{dy}{dx} = \\frac{3a\\sin^2\\theta\\cos\\theta}{-3a\\cos^2\\theta\\sin\\theta} = -\\tan\\theta$$\n$$\\sqrt{1 + \\left(\\frac{dy}{dx}\\right)^2} = \\sqrt{1 + (-\\tan\\theta)^2} = \\sqrt{1 + \\tan^2\\theta} = \\sqrt{\\sec^2\\theta} = |\\sec\\theta|$$",
    "chapter": "Continuity and Differentiability",
    "chapter_number": 15,
    "correct_answer": 3,
    "needs_image": False
  },
  {
    "id": "math_ch15_q17",
    "subject": "Mathematics",
    "year": 2012,
    "question": "If $y = (\\sin^{-1} x)^2$, then $(1 - x^2)\\frac{d^2y}{dx^2} - x\\frac{dy}{dx}$ is equal to:",
    "options": [
      "$0$",
      "$1$",
      "$-2$",
      "$2$"
    ],
    "explanation": "Differentiating $y = (\\sin^{-1} x)^2$:\n$$y_1 = 2(\\sin^{-1} x) \\cdot \\frac{1}{\\sqrt{1 - x^2}}$$\n$$\\sqrt{1 - x^2} y_1 = 2\\sin^{-1} x$$\nSquaring both sides:\n$$(1 - x^2) y_1^2 = 4(\\sin^{-1} x)^2 = 4y$$\nDifferentiating with respect to $x$:\n$$(1 - x^2)(2 y_1 y_2) + (-2x) y_1^2 = 4 y_1$$\nDividing by $2y_1$:\n$$(1 - x^2) y_2 - x y_1 = 2$$",
    "chapter": "Continuity and Differentiability",
    "chapter_number": 15,
    "correct_answer": 3,
    "needs_image": False
  },
  {
    "id": "math_ch15_q18",
    "subject": "Mathematics",
    "year": 2012,
    "question": "The derivative of $\\cos^{-1}\\left(\\frac{1 - x^2}{1 + x^2}\\right)$ with respect to $\\tan^{-1} x$ is:",
    "options": [
      "$2$",
      "$\\frac{1}{2}$",
      "$1$",
      "$-2$"
    ],
    "explanation": "Let $u = \\cos^{-1}\\left(\\frac{1 - x^2}{1 + x^2}\\right) = 2\\tan^{-1} x$ (for $x \\ge 0$).\nLet $v = \\tan^{-1} x$.\nThen $u = 2v$.\nDifferentiating $u$ with respect to $v$:\n$$\\frac{du}{dv} = 2$$",
    "chapter": "Continuity and Differentiability",
    "chapter_number": 15,
    "correct_answer": 0,
    "needs_image": False
  },
  {
    "id": "math_ch15_q19",
    "subject": "Mathematics",
    "year": 2013,
    "question": "If $f(x) = \\log_{x^2}(\\log_e x)$, then $f'(e)$ is equal to:",
    "options": [
      "$\\frac{1}{2e}$",
      "$\\frac{1}{e}$",
      "$\\frac{2}{e}$",
      "$0$"
    ],
    "explanation": "Using logarithm base change:\n$$f(x) = \\frac{\\log_e(\\log_e x)}{\\log_e(x^2)} = \\frac{\\log_e(\\log_e x)}{2\\log_e x} = \\frac{1}{2} \\frac{\\ln(\\ln x)}{\\ln x}$$\nDifferentiating using quotient rule:\n$$f'(x) = \\frac{1}{2} \\left[ \\frac{(\\ln x)\\left(\\frac{1}{\\ln x} \\cdot \\frac{1}{x}\\right) - \\ln(\\ln x)\\left(\\frac{1}{x}\\right)}{(\\ln x)^2} \\right] = \\frac{1}{2x} \\left[ \\frac{1 - \\ln(\\ln x)}{(\\ln x)^2} \\right]$$\nAt $x = e$, $\\ln e = 1$ and $\\ln(\\ln e) = \\ln 1 = 0$:\n$$f'(e) = \\frac{1}{2e} \\left[ \\frac{1 - 0}{1^2} \\right] = \\frac{1}{2e}$$",
    "chapter": "Continuity and Differentiability",
    "chapter_number": 15,
    "correct_answer": 0,
    "needs_image": False
  },
  {
    "id": "math_ch15_q20",
    "subject": "Mathematics",
    "year": 2013,
    "question": "If $y = \\tan^{-1}\\left(\\frac{\\sqrt{1 + x^2} - 1}{x}\\right)$, then $\\frac{dy}{dx}$ is:",
    "options": [
      "$\\frac{1}{1 + x^2}$",
      "$\\frac{1}{2(1 + x^2)}$",
      "$\\frac{2}{1 + x^2}$",
      "$\\frac{1}{2\\sqrt{1 + x^2}}$"
    ],
    "explanation": "Substitute $x = \\tan\\theta \\implies \\theta = \\tan^{-1} x$.\n$$y = \\tan^{-1}\\left(\\frac{\\sec\\theta - 1}{\\tan\\theta}\\right) = \\tan^{-1}\\left(\\frac{1 - \\cos\\theta}{\\sin\\theta}\\right) = \\tan^{-1}\\left(\\frac{2\\sin^2(\\theta/2)}{2\\sin(\\theta/2)\\cos(\\theta/2)}\\right) = \\tan^{-1}\\left(\\tan\\frac{\\theta}{2}\\right) = \\frac{\\theta}{2} = \\frac{1}{2}\\tan^{-1} x$$\nDifferentiating with respect to $x$:\n$$\\frac{dy}{dx} = \\frac{1}{2(1 + x^2)}$$",
    "chapter": "Continuity and Differentiability",
    "chapter_number": 15,
    "correct_answer": 1,
    "needs_image": False
  },
  {
    "id": "math_ch15_q21",
    "subject": "Mathematics",
    "year": 2014,
    "question": "If $x^m y^n = (x + y)^{m+n}$, then $\\frac{dy}{dx}$ is equal to:",
    "options": [
      "$\\frac{x}{y}$",
      "$\\frac{y}{x}$",
      "$-\\frac{y}{x}$",
      "$\\frac{m y}{n x}$"
    ],
    "explanation": "Taking natural logarithm on both sides:\n$$m \\log x + n \\log y = (m + n) \\log(x + y)$$\nDifferentiating both sides with respect to $x$:\n$$\\frac{m}{x} + \\frac{n}{y}\\frac{dy}{dx} = \\frac{m + n}{x + y}\\left(1 + \\frac{dy}{dx}\\right)$$\n$$\\left[\\frac{n}{y} - \\frac{m + n}{x + y}\\right]\\frac{dy}{dx} = \\frac{m + n}{x + y} - \\frac{m}{x}$$\n$$\\left[\\frac{nx + ny - my - ny}{y(x + y)}\\right]\\frac{dy}{dx} = \\frac{mx + nx - mx - my}{x(x + y)}$$\n$$\\frac{nx - my}{y}\\frac{dy}{dx} = \\frac{nx - my}{x} \\implies \\frac{dy}{dx} = \\frac{y}{x}$$",
    "chapter": "Continuity and Differentiability",
    "chapter_number": 15,
    "correct_answer": 1,
    "needs_image": False
  },
  {
    "id": "math_ch15_q22",
    "subject": "Mathematics",
    "year": 2014,
    "question": "If $f(x) = \\begin{cases} \\frac{\\sin(\\pi x/2)}{x}, & x \\ne 0 \\\\ c, & x = 0 \\end{cases}$ is continuous at $x = 0$, then $c$ is:",
    "options": [
      "$1$",
      "$\\pi$",
      "$\\frac{\\pi}{2}$",
      "$0$"
    ],
    "explanation": "For continuity at $x = 0$:\n$$c = f(0) = \\lim_{x \\to 0} \\frac{\\sin(\\pi x/2)}{x} = \\frac{\\pi}{2} \\lim_{x \\to 0} \\frac{\\sin(\\pi x/2)}{\\pi x/2} = \\frac{\\pi}{2}(1) = \\frac{\\pi}{2}$$",
    "chapter": "Continuity and Differentiability",
    "chapter_number": 15,
    "correct_answer": 2,
    "needs_image": False
  },
  {
    "id": "math_ch15_q23",
    "subject": "Mathematics",
    "year": 2014,
    "question": "The number of points of discontinuity of the function $f(x) = [x]$ in the interval $(-2, 2)$ is (where $[x]$ denotes greatest integer function):",
    "options": [
      "$4$",
      "$3$",
      "$2$",
      "$1$"
    ],
    "explanation": "The greatest integer function $f(x) = [x]$ is discontinuous at every integer point because left-hand limit $\\lim_{x \\to n^-} [x] = n - 1$ does not equal right-hand limit $\\lim_{x \\to n^+} [x] = n$.\nThe integer points inside the open interval $(-2, 2)$ are $\\{-1, 0, 1\\}$.\nThus, there are exactly 3 points of discontinuity.",
    "chapter": "Continuity and Differentiability",
    "chapter_number": 15,
    "correct_answer": 1,
    "needs_image": False
  },
  {
    "id": "math_ch15_q24",
    "subject": "Mathematics",
    "year": 2015,
    "question": "If $y = \\log_e\\left(\\frac{x^2}{e^2}\\right)$, then $\\frac{d^2y}{dx^2}$ is equal to:",
    "options": [
      "$\\frac{2}{x}$",
      "$-\\frac{1}{x^2}$",
      "$\\frac{2}{x^2}$",
      "$-\\frac{2}{x^2}$"
    ],
    "explanation": "$$y = \\log_e(x^2) - \\log_e(e^2) = 2\\ln x - 2$$\nFirst derivative: $\\frac{dy}{dx} = \\frac{2}{x}$.\nSecond derivative: $\\frac{d^2y}{dx^2} = \\frac{d}{dx}\\left(2x^{-1}\\right) = -2x^{-2} = -\\frac{2}{x^2}$.",
    "chapter": "Continuity and Differentiability",
    "chapter_number": 15,
    "correct_answer": 3,
    "needs_image": False
  },
  {
    "id": "math_ch15_q25",
    "subject": "Mathematics",
    "year": 2015,
    "question": "If $f(x) = \\begin{cases} \\frac{3x + 4\\tan x}{x}, & x \\ne 0 \\\\ k, & x = 0 \\end{cases}$ is continuous at $x = 0$, then $k$ is:",
    "options": [
      "$3$",
      "$7$",
      "$4$",
      "$1$"
    ],
    "explanation": "For continuity at $x = 0$:\n$$k = f(0) = \\lim_{x \\to 0} \\frac{3x + 4\\tan x}{x} = \\lim_{x \\to 0} \\left(3 + 4\\frac{\\tan x}{x}\\right) = 3 + 4(1) = 7$$",
    "chapter": "Continuity and Differentiability",
    "chapter_number": 15,
    "correct_answer": 1,
    "needs_image": False
  },
  {
    "id": "math_ch15_q26",
    "subject": "Mathematics",
    "year": 2015,
    "question": "If $x = a\\cos\\theta, y = b\\sin\\theta$, then $\\frac{d^2y}{dx^2}$ is:",
    "options": [
      "$-\\frac{b}{a^2}\\csc^2\\theta$",
      "$\\frac{b}{a^2}\\sec^3\\theta$",
      "$-\\frac{b}{a^2}\\csc^3\\theta$",
      "$-\\frac{b^2}{a}\\sec^2\\theta$"
    ],
    "explanation": "$$\\frac{dx}{d\\theta} = -a\\sin\\theta, \\quad \\frac{dy}{d\\theta} = b\\cos\\theta$$\n$$\\frac{dy}{dx} = \\frac{b\\cos\\theta}{-a\\sin\\theta} = -\\frac{b}{a}\\cot\\theta$$\n$$\\frac{d^2y}{dx^2} = \\frac{d}{d\\theta}\\left(-\\frac{b}{a}\\cot\\theta\\right) \\cdot \\frac{d\\theta}{dx} = \\left(\\frac{b}{a}\\csc^2\\theta\\right) \\cdot \\left(\\frac{1}{-a\\sin\\theta}\\right) = -\\frac{b}{a^2}\\csc^3\\theta$$",
    "chapter": "Continuity and Differentiability",
    "chapter_number": 15,
    "correct_answer": 2,
    "needs_image": False
  },
  {
    "id": "math_ch15_q27",
    "subject": "Mathematics",
    "year": 2016,
    "question": "If $y = \\tan^{-1}\\left(\\frac{2x}{1 - x^2}\\right) + \\tan^{-1}\\left(\\frac{3x - x^3}{1 - 3x^2}\\right) - \\tan^{-1}\\left(\\frac{4x - 4x^3}{1 - 6x^2 + x^4}\\right)$, then $\\frac{dy}{dx}$ is equal to:",
    "options": [
      "$\\frac{1}{1 + x^2}$",
      "$\\frac{2}{1 + x^2}$",
      "$\\frac{3}{1 + x^2}$",
      "$0$"
    ],
    "explanation": "Using standard inverse trigonometric identities:\n- $\\tan^{-1}\\left(\\frac{2x}{1 - x^2}\\right) = 2\\tan^{-1} x$\n- $\\tan^{-1}\\left(\\frac{3x - x^3}{1 - 3x^2}\\right) = 3\\tan^{-1} x$\n- $\\tan^{-1}\\left(\\frac{4x - 4x^3}{1 - 6x^2 + x^4}\\right) = 4\\tan^{-1} x$\n\nSubstituting these:\n$$y = 2\\tan^{-1} x + 3\\tan^{-1} x - 4\\tan^{-1} x = \\tan^{-1} x$$\nDifferentiating with respect to $x$:\n$$\\frac{dy}{dx} = \\frac{1}{1 + x^2}$$",
    "chapter": "Continuity and Differentiability",
    "chapter_number": 15,
    "correct_answer": 0,
    "needs_image": False
  },
  {
    "id": "math_ch15_q28",
    "subject": "Mathematics",
    "year": 2016,
    "question": "If $f(x) = \\begin{cases} \\frac{1 - \\cos 4x}{x^2}, & x < 0 \\\\ a, & x = 0 \\\\ \\frac{\\sqrt{x}}{\\sqrt{16 + \\sqrt{x}} - 4}, & x > 0 \\end{cases}$ is continuous at $x = 0$, then $a$ is:",
    "options": [
      "$4$",
      "$6$",
      "$8$",
      "$2$"
    ],
    "explanation": "For continuity at $x = 0$:\n$$\\text{LHL} = \\lim_{x \\to 0^-} \\frac{1 - \\cos 4x}{x^2} = \\lim_{x \\to 0^-} \\frac{2\\sin^2 2x}{x^2} = 2 \\times 4 = 8$$\n$$\\text{RHL} = \\lim_{x \\to 0^+} \\frac{\\sqrt{x}(\\sqrt{16 + \\sqrt{x}} + 4)}{(16 + \\sqrt{x}) - 16} = \\lim_{x \\to 0^+} (\\sqrt{16 + \\sqrt{x}} + 4) = 4 + 4 = 8$$\nHence, $a = 8$.",
    "chapter": "Continuity and Differentiability",
    "chapter_number": 15,
    "correct_answer": 2,
    "needs_image": False
  },
  {
    "id": "math_ch15_q29",
    "subject": "Mathematics",
    "year": 2016,
    "question": "If $2^x + 2^y = 2^{x+y}$, then $\\frac{dy}{dx}$ is equal to:",
    "options": [
      "$\\frac{2^x + 2^y}{2^x - 2^y}$",
      "$-2^{y-x}$",
      "$2^{y-x}$",
      "$-2^{x-y}$"
    ],
    "explanation": "Differentiating with respect to $x$:\n$$2^x \\ln 2 + 2^y \\ln 2 \\frac{dy}{dx} = 2^{x+y} \\ln 2 \\left(1 + \\frac{dy}{dx}\\right)$$\n$$2^x + 2^y \\frac{dy}{dx} = 2^{x+y} + 2^{x+y} \\frac{dy}{dx}$$\n$$\\frac{dy}{dx}(2^y - 2^{x+y}) = 2^{x+y} - 2^x$$\nUsing $2^{x+y} = 2^x + 2^y$:\n$$\\frac{dy}{dx}(2^y - (2^x + 2^y)) = (2^x + 2^y) - 2^x$$\n$$\\frac{dy}{dx}(-2^x) = 2^y \\implies \\frac{dy}{dx} = -\\frac{2^y}{2^x} = -2^{y-x}$$",
    "chapter": "Continuity and Differentiability",
    "chapter_number": 15,
    "correct_answer": 1,
    "needs_image": False
  },
  {
    "id": "math_ch15_q30",
    "subject": "Mathematics",
    "year": 2017,
    "question": "If $f(x) = \\begin{cases} \\frac{x^2 - 9}{x - 3}, & x \\ne 3 \\\\ k, & x = 3 \\end{cases}$ is continuous at $x = 3$, then $k$ is:",
    "options": [
      "$3$",
      "$6$",
      "$9$",
      "$0$"
    ],
    "explanation": "$$k = f(3) = \\lim_{x \\to 3} \\frac{x^2 - 9}{x - 3} = \\lim_{x \\to 3} (x + 3) = 3 + 3 = 6$$",
    "chapter": "Continuity and Differentiability",
    "chapter_number": 15,
    "correct_answer": 1,
    "needs_image": False
  },
  {
    "id": "math_ch15_q31",
    "subject": "Mathematics",
    "year": 2017,
    "question": "If $y = e^{\\sqrt{x}}$, then $\\frac{dy}{dx}$ is:",
    "options": [
      "$\\frac{e^{\\sqrt{x}}}{2\\sqrt{x}}$",
      "$\\frac{e^{\\sqrt{x}}}{\\sqrt{x}}$",
      "$2\\sqrt{x} e^{\\sqrt{x}}$",
      "$\\frac{1}{2\\sqrt{x}}$"
    ],
    "explanation": "Applying the chain rule:\n$$\\frac{dy}{dx} = e^{\\sqrt{x}} \\cdot \\frac{d}{dx}(\\sqrt{x}) = e^{\\sqrt{x}} \\cdot \\frac{1}{2\\sqrt{x}} = \\frac{e^{\\sqrt{x}}}{2\\sqrt{x}}$$",
    "chapter": "Continuity and Differentiability",
    "chapter_number": 15,
    "correct_answer": 0,
    "needs_image": False
  },
  {
    "id": "math_ch15_q32",
    "subject": "Mathematics",
    "year": 2017,
    "question": "If $y = \\cos(\\log_e x)$, then $x^2 y_2 + x y_1 + y$ is equal to:",
    "options": [
      "$1$",
      "$0$",
      "$-1$",
      "$2$"
    ],
    "explanation": "$$y = \\cos(\\ln x)$$\n$$y_1 = -\\sin(\\ln x) \\cdot \\frac{1}{x} \\implies x y_1 = -\\sin(\\ln x)$$\nDifferentiating again with respect to $x$:\n$$x y_2 + y_1 = -\\cos(\\ln x) \\cdot \\frac{1}{x} = -\\frac{y}{x}$$\n$$x^2 y_2 + x y_1 = -y \\implies x^2 y_2 + x y_1 + y = 0$$",
    "chapter": "Continuity and Differentiability",
    "chapter_number": 15,
    "correct_answer": 1,
    "needs_image": False
  },
  {
    "id": "math_ch15_q33",
    "subject": "Mathematics",
    "year": 2018,
    "question": "If $y = \\sin x \\cdot \\sin 2x \\cdot \\sin 3x \\dots \\sin nx$, then $\\frac{dy}{dx}$ at $x = 0$ is:",
    "options": [
      "$1$",
      "$0$",
      "$n!$",
      "$n$"
    ],
    "explanation": "When differentiated using product rule, the derivative contains $n$ terms where in each term, one factor $\\sin kx$ is differentiated to $k\\cos kx$ while the remaining $n - 1$ factors remain unchanged (all of which are of the form $\\sin jx$).\nFor $n \\ge 2$, every term in the derivative retains at least one factor of the form $\\sin jx$.\nAt $x = 0$, since $\\sin(0) = 0$, every single term vanishes.\nThus, $\\frac{dy}{dx}\\Big|_{x=0} = 0$.",
    "chapter": "Continuity and Differentiability",
    "chapter_number": 15,
    "correct_answer": 1,
    "needs_image": False
  },
  {
    "id": "math_ch15_q34",
    "subject": "Mathematics",
    "year": 2018,
    "question": "If $f(x) = \\begin{cases} \\frac{1 - \\cos kx}{x^2}, & x \\ne 0 \\\\ 8, & x = 0 \\end{cases}$ is continuous at $x = 0$, then $k$ is equal to:",
    "options": [
      "$\\pm 2$",
      "$\\pm 8$",
      "$\\pm 4$",
      "$\\pm 16$"
    ],
    "explanation": "$$\\lim_{x \\to 0} \\frac{1 - \\cos kx}{x^2} = \\frac{k^2}{2}$$\nFor continuity at $x = 0$:\n$$\\frac{k^2}{2} = 8 \\implies k^2 = 16 \\implies k = \\pm 4$$",
    "chapter": "Continuity and Differentiability",
    "chapter_number": 15,
    "correct_answer": 2,
    "needs_image": False
  },
  {
    "id": "math_ch15_q35",
    "subject": "Mathematics",
    "year": 2018,
    "question": "If $x = a(\\cos t + t\\sin t)$ and $y = a(\\sin t - t\\cos t)$, then $\\frac{d^2y}{dx^2}$ is:",
    "options": [
      "$\\frac{\\sec^2 t}{a t}$",
      "$\\frac{\\sec^3 t}{a t}$",
      "$\\frac{\\tan^3 t}{a t}$",
      "$\\frac{\\csc^3 t}{a t}$"
    ],
    "explanation": "$$\\frac{dx}{dt} = a(-\\sin t + \\sin t + t\\cos t) = a t \\cos t$$\n$$\\frac{dy}{dt} = a(\\cos t - \\cos t + t\\sin t) = a t \\sin t$$\n$$\\frac{dy}{dx} = \\frac{a t \\sin t}{a t \\cos t} = \\tan t$$\n$$\\frac{d^2y}{dx^2} = \\frac{d}{dt}(\\tan t) \\cdot \\frac{dt}{dx} = \\sec^2 t \\cdot \\frac{1}{a t \\cos t} = \\frac{\\sec^3 t}{a t}$$",
    "chapter": "Continuity and Differentiability",
    "chapter_number": 15,
    "correct_answer": 1,
    "needs_image": False
  },
  {
    "id": "math_ch15_q36",
    "subject": "Mathematics",
    "year": 2019,
    "question": "If $y = \\sqrt{x + \\sqrt{x + \\sqrt{x + \\dots \\infty}}}$, then $\\frac{dy}{dx}$ is:",
    "options": [
      "$\\frac{1}{2y - 1}$",
      "$\\frac{1}{2y + 1}$",
      "$\\frac{2y - 1}{x}$",
      "$\\frac{x}{2y - 1}$"
    ],
    "explanation": "$$y = \\sqrt{x + y} \\implies y^2 = x + y$$\nDifferentiating with respect to $x$:\n$$2y \\frac{dy}{dx} = 1 + \\frac{dy}{dx} \\implies (2y - 1)\\frac{dy}{dx} = 1 \\implies \\frac{dy}{dx} = \\frac{1}{2y - 1}$$",
    "chapter": "Continuity and Differentiability",
    "chapter_number": 15,
    "correct_answer": 0,
    "needs_image": False
  },
  {
    "id": "math_ch15_q37",
    "subject": "Mathematics",
    "year": 2019,
    "question": "The value of $c$ in Rolle's theorem for the function $f(x) = x^3 - 3x$ in $[0, \\sqrt{3}]$ is:",
    "options": [
      "$\\frac{1}{\\sqrt{3}}$",
      "$1$",
      "$\\sqrt{3}$",
      "$0$"
    ],
    "explanation": "1. $f(x)$ is continuous on $[0, \\sqrt{3}]$ and differentiable on $(0, \\sqrt{3})$.\n2. $f(0) = 0$ and $f(\\sqrt{3}) = 3\\sqrt{3} - 3\\sqrt{3} = 0$.\nBy Rolle's theorem, there exists $c \\in (0, \\sqrt{3})$ such that $f'(c) = 0$:\n$$f'(x) = 3x^2 - 3 \\implies 3c^2 - 3 = 0 \\implies c^2 = 1 \\implies c = 1 \\in (0, \\sqrt{3})$$",
    "chapter": "Continuity and Differentiability",
    "chapter_number": 15,
    "correct_answer": 1,
    "needs_image": False
  },
  {
    "id": "math_ch15_q38",
    "subject": "Mathematics",
    "year": 2019,
    "question": "If $f(x) = \\begin{cases} \\frac{k \\cos x}{\\pi - 2x}, & x \\ne \\frac{\\pi}{2} \\\\ 3, & x = \\frac{\\pi}{2} \\end{cases}$ is continuous at $x = \\frac{\\pi}{2}$, then $k$ is:",
    "options": [
      "$6$",
      "$3$",
      "$12$",
      "$\\frac{3}{2}$"
    ],
    "explanation": "For continuity at $x = \\pi/2$:\n$$\\lim_{x \\to \\pi/2} \\frac{k\\cos x}{\\pi - 2x} = 3$$\nPut $x = \\frac{\\pi}{2} + h$ as $h \\to 0$:\n$$\\lim_{h \\to 0} \\frac{k\\cos(\\pi/2 + h)}{\\pi - 2(\\pi/2 + h)} = \\lim_{h \\to 0} \\frac{-k\\sin h}{-2h} = \\frac{k}{2} \\lim_{h \\to 0} \\frac{\\sin h}{h} = \\frac{k}{2}$$\n$$\\frac{k}{2} = 3 \\implies k = 6$$",
    "chapter": "Continuity and Differentiability",
    "chapter_number": 15,
    "correct_answer": 0,
    "needs_image": False
  },
  {
    "id": "math_ch15_q39",
    "subject": "Mathematics",
    "year": 2020,
    "question": "If $y = (\\tan x)^{\\sin x}$, then $\\frac{dy}{dx}$ is:",
    "options": [
      "$(\\tan x)^{\\sin x} [\\cos x \\log(\\tan x) - \\sec x]$",
      "$(\\tan x)^{\\sin x} [\\cos x \\log(\\tan x) + \\sec x]$",
      "$(\\tan x)^{\\sin x} [\\sin x \\log(\\tan x) + \\sec x]$",
      "$(\\tan x)^{\\sin x} [\\cos x \\log(\\tan x) + \\tan x]$"
    ],
    "explanation": "Taking natural logarithm on both sides:\n$$\\ln y = \\sin x \\ln(\\tan x)$$\nDifferentiating with respect to $x$:\n$$\\frac{1}{y}\\frac{dy}{dx} = \\cos x \\ln(\\tan x) + \\sin x \\cdot \\frac{1}{\\tan x} \\cdot \\sec^2 x = \\cos x \\ln(\\tan x) + \\cos x \\cdot \\frac{1}{\\cos^2 x} = \\cos x \\ln(\\tan x) + \\sec x$$\n$$\\frac{dy}{dx} = (\\tan x)^{\\sin x} [\\cos x \\ln(\\tan x) + \\sec x]$$",
    "chapter": "Continuity and Differentiability",
    "chapter_number": 15,
    "correct_answer": 1,
    "needs_image": False
  },
  {
    "id": "math_ch15_q40",
    "subject": "Mathematics",
    "year": 2020,
    "question": "The derivative of $e^{\\sin x}$ with respect to $\\cos x$ is:",
    "options": [
      "$e^{\\sin x} \\cos x$",
      "$-e^{\\sin x} \\cot x$",
      "$e^{\\sin x} \\tan x$",
      "$-e^{\\sin x} \\tan x$"
    ],
    "explanation": "Let $u = e^{\\sin x} \\implies \\frac{du}{dx} = e^{\\sin x}\\cos x$.\nLet $v = \\cos x \\implies \\frac{dv}{dx} = -\\sin x$.\n$$\\frac{du}{dv} = \\frac{du/dx}{dv/dx} = \\frac{e^{\\sin x}\\cos x}{-\\sin x} = -e^{\\sin x}\\cot x$$",
    "chapter": "Continuity and Differentiability",
    "chapter_number": 15,
    "correct_answer": 1,
    "needs_image": False
  },
  {
    "id": "math_ch15_q41",
    "subject": "Mathematics",
    "year": 2020,
    "question": "If $g(x) = [f(x)]^2 + [f'(x)]^2$ and $g'(x) = 0$ for all $x$, and $f(0) = 5, f'(0) = 12$, then $g(10)$ is:",
    "options": [
      "$17$",
      "$60$",
      "$144$",
      "$169$"
    ],
    "explanation": "Since $g'(x) = 0$ for all $x$, $g(x)$ is a constant function.\n$$g(x) = g(0) = [f(0)]^2 + [f'(0)]^2 = 5^2 + 12^2 = 25 + 144 = 169$$\nSince $g(x)$ is constant everywhere, $g(10) = 169$.",
    "chapter": "Continuity and Differentiability",
    "chapter_number": 15,
    "correct_answer": 3,
    "needs_image": False
  },
  {
    "id": "math_ch15_q42",
    "subject": "Mathematics",
    "year": 2021,
    "question": "If $f(x) = |x - 3|$, then at $x = 3$, $f(x)$ is:",
    "options": [
      "Continuous but not differentiable",
      "Differentiable and continuous",
      "Discontinuous",
      "Neither continuous nor differentiable"
    ],
    "explanation": "For $f(x) = |x - 3|$:\n- $\\lim_{x \\to 3} f(x) = f(3) = 0$, so $f(x)$ is continuous at $x = 3$.\n- $\\text{LHD} = \\lim_{h \\to 0^-} \\frac{-(x-3) - 0}{h} = -1$.\n- $\\text{RHD} = \\lim_{h \\to 0^+} \\frac{(x-3) - 0}{h} = +1$.\nSince $\\text{LHD} \\ne \\text{RHD}$, $f(x)$ is not differentiable at $x = 3$.",
    "chapter": "Continuity and Differentiability",
    "chapter_number": 15,
    "correct_answer": 0,
    "needs_image": False
  },
  {
    "id": "math_ch15_q43",
    "subject": "Mathematics",
    "year": 2021,
    "question": "If $y = \\log(\\sec x + \\tan x)$, then $\\frac{dy}{dx}$ is:",
    "options": [
      "$\\tan x$",
      "$\\sec x + \\tan x$",
      "$\\sec x$",
      "$\\cos x$"
    ],
    "explanation": "$$\\frac{dy}{dx} = \\frac{1}{\\sec x + \\tan x} \\cdot \\frac{d}{dx}(\\sec x + \\tan x) = \\frac{\\sec x\\tan x + \\sec^2 x}{\\sec x + \\tan x} = \\frac{\\sec x(\\tan x + \\sec x)}{\\sec x + \\tan x} = \\sec x$$",
    "chapter": "Continuity and Differentiability",
    "chapter_number": 15,
    "correct_answer": 2,
    "needs_image": False
  },
  {
    "id": "math_ch15_q44",
    "subject": "Mathematics",
    "year": 2021,
    "question": "If $x = 2\\cos t - \\cos 2t$ and $y = 2\\sin t - \\sin 2t$, then $\\frac{dy}{dx}$ at $t = \\frac{\\pi}{2}$ is:",
    "options": [
      "$1$",
      "$\\sqrt{3}$",
      "$-1$",
      "$0$"
    ],
    "explanation": "$$\\frac{dx}{dt} = -2\\sin t + 2\\sin 2t$$\n$$\\frac{dy}{dt} = 2\\cos t - 2\\cos 2t$$\nAt $t = \\frac{\\pi}{2}$:\n$$\\frac{dx}{dt} = -2\\sin(\\pi/2) + 2\\sin(\\pi) = -2(1) + 0 = -2$$\n$$\\frac{dy}{dt} = 2\\cos(\\pi/2) - 2\\cos(\\pi) = 0 - 2(-1) = 2$$\n$$\\frac{dy}{dx}\\Big|_{t=\\pi/2} = \\frac{2}{-2} = -1$$",
    "chapter": "Continuity and Differentiability",
    "chapter_number": 15,
    "correct_answer": 2,
    "needs_image": False
  },
  {
    "id": "math_ch15_q45",
    "subject": "Mathematics",
    "year": 2022,
    "question": "If $y = (\\tan^{-1} x)^2$, then $(1 + x^2)^2 y_2 + 2x(1 + x^2) y_1$ is equal to:",
    "options": [
      "$2$",
      "$4$",
      "$1$",
      "$0$"
    ],
    "explanation": "$$y_1 = 2(\\tan^{-1} x) \\cdot \\frac{1}{1 + x^2} \\implies (1 + x^2) y_1 = 2\\tan^{-1} x$$\nDifferentiating with respect to $x$:\n$$(1 + x^2) y_2 + 2x y_1 = \\frac{2}{1 + x^2}$$\nMultiplying both sides by $(1 + x^2)$:\n$$(1 + x^2)^2 y_2 + 2x(1 + x^2) y_1 = 2$$",
    "chapter": "Continuity and Differentiability",
    "chapter_number": 15,
    "correct_answer": 0,
    "needs_image": False
  },
  {
    "id": "math_ch15_q46",
    "subject": "Mathematics",
    "year": 2022,
    "question": "If $f(x) = \\begin{cases} \\frac{k(x^2 - 4)}{x - 2}, & x < 2 \\\\ 3, & x = 2 \\\\ 5x - 7, & x > 2 \\end{cases}$ is continuous at $x = 2$, then $k$ is:",
    "options": [
      "$1$",
      "$\\frac{3}{4}$",
      "$\\frac{4}{3}$",
      "$3$"
    ],
    "explanation": "For continuity at $x = 2$:\n$$\\lim_{x \\to 2^-} f(x) = f(2) = 3$$\n$$\\lim_{x \\to 2^-} \\frac{k(x^2 - 4)}{x - 2} = \\lim_{x \\to 2^-} k(x + 2) = 4k$$\n$$4k = 3 \\implies k = \\frac{3}{4}$$",
    "chapter": "Continuity and Differentiability",
    "chapter_number": 15,
    "correct_answer": 1,
    "needs_image": False
  },
  {
    "id": "math_ch15_q47",
    "subject": "Mathematics",
    "year": 2022,
    "question": "The derivative of $\\sin^2 x$ with respect to $e^{\\cos x}$ is:",
    "options": [
      "$\\frac{2\\cos x}{e^{\\cos x}}$",
      "$-\\frac{2\\cos x}{e^{\\cos x}}$",
      "$\\frac{2\\sin x}{e^{\\cos x}}$",
      "$-\\frac{2\\sin x}{e^{\\cos x}}$"
    ],
    "explanation": "Let $u = \\sin^2 x \\implies \\frac{du}{dx} = 2\\sin x\\cos x$.\nLet $v = e^{\\cos x} \\implies \\frac{dv}{dx} = -\\sin x e^{\\cos x}$.\n$$\\frac{du}{dv} = \\frac{2\\sin x\\cos x}{-\\sin x e^{\\cos x}} = -\\frac{2\\cos x}{e^{\\cos x}}$$",
    "chapter": "Continuity and Differentiability",
    "chapter_number": 15,
    "correct_answer": 1,
    "needs_image": False
  },
  {
    "id": "math_ch15_q48",
    "subject": "Mathematics",
    "year": 2023,
    "question": "If $f(x) = \\begin{cases} \\frac{\\sin(a + 1)x + \\sin x}{x}, & x < 0 \\\\ c, & x = 0 \\\\ \\frac{\\sqrt{x + bx^2} - \\sqrt{x}}{b x^{3/2}}, & x > 0 \\end{cases}$ is continuous at $x = 0$, then:",
    "options": [
      "$a = \\frac{3}{2}, c = \\frac{1}{2}, b \\in \\mathbb{R}$",
      "$a = -\\frac{3}{2}, c = \\frac{1}{2}, b \\in \\mathbb{R} \\setminus \\{0\\}$",
      "$a = -\\frac{3}{2}, c = -\\frac{1}{2}, b = 0$",
      "$a = \\frac{1}{2}, c = -\\frac{3}{2}, b \\ne 0$"
    ],
    "explanation": "1. $\\text{LHL} = \\lim_{x \\to 0^-} \\left(\\frac{\\sin(a+1)x}{x} + \\frac{\\sin x}{x}\\right) = (a + 1) + 1 = a + 2$.\n2. $f(0) = c \\implies a + 2 = c$.\n3. $\\text{RHL} = \\lim_{x \\to 0^+} \\frac{\\sqrt{x}(\\sqrt{1 + bx} - 1)}{b x^{3/2}} = \\lim_{x \\to 0^+} \\frac{(1 + bx) - 1}{b x(\\sqrt{1 + bx} + 1)} = \\frac{1}{1 + 1} = \\frac{1}{2}$.\nEquating limits: $c = \\frac{1}{2}$, and $a + 2 = \\frac{1}{2} \\implies a = -\\frac{3}{2}$ with $b \\in \\mathbb{R} \\setminus \\{0\\}$.",
    "chapter": "Continuity and Differentiability",
    "chapter_number": 15,
    "correct_answer": 1,
    "needs_image": False
  },
  {
    "id": "math_ch15_q49",
    "subject": "Mathematics",
    "year": 2023,
    "question": "If $y = x^x$, then $\\frac{dy}{dx}$ at $x = 1$ is:",
    "options": [
      "$0$",
      "$e$",
      "$1$",
      "$-1$"
    ],
    "explanation": "Taking natural logarithm on both sides:\n$$\\ln y = x \\ln x$$\nDifferentiating with respect to $x$:\n$$\\frac{1}{y}\\frac{dy}{dx} = x\\left(\\frac{1}{x}\\right) + \\ln x = 1 + \\ln x$$\n$$\\frac{dy}{dx} = x^x (1 + \\ln x)$$\nAt $x = 1$:\n$$\\frac{dy}{dx}\\Big|_{x=1} = 1^1 (1 + \\ln 1) = 1(1 + 0) = 1$$",
    "chapter": "Continuity and Differentiability",
    "chapter_number": 15,
    "correct_answer": 2,
    "needs_image": False
  },
  {
    "id": "math_ch15_q50",
    "subject": "Mathematics",
    "year": 2023,
    "question": "If $x = a\\cos^3 t$ and $y = a\\sin^3 t$, then $\\frac{dy}{dx}$ is:",
    "options": [
      "$\\tan t$",
      "$\\cot t$",
      "$-\\cot t$",
      "$-\\tan t$"
    ],
    "explanation": "$$\\frac{dx}{dt} = -3a\\cos^2 t\\sin t$$\n$$\\frac{dy}{dt} = 3a\\sin^2 t\\cos t$$\n$$\\frac{dy}{dx} = \\frac{3a\\sin^2 t\\cos t}{-3a\\cos^2 t\\sin t} = -\\tan t$$",
    "chapter": "Continuity and Differentiability",
    "chapter_number": 15,
    "correct_answer": 3,
    "needs_image": False
  },
  {
    "id": "math_ch15_q51",
    "subject": "Mathematics",
    "year": 2023,
    "question": "If $f(x) = \\log_e(\\log_e x)$, then $f'(e)$ is:",
    "options": [
      "$1$",
      "$\\frac{1}{e}$",
      "$e$",
      "$\\frac{1}{2e}$"
    ],
    "explanation": "$$f'(x) = \\frac{1}{\\ln x} \\cdot \\frac{d}{dx}(\\ln x) = \\frac{1}{x \\ln x}$$\nAt $x = e$:\n$$f'(e) = \\frac{1}{e \\ln e} = \\frac{1}{e(1)} = \\frac{1}{e}$$",
    "chapter": "Continuity and Differentiability",
    "chapter_number": 15,
    "correct_answer": 1,
    "needs_image": False
  },
  {
    "id": "math_ch15_q52",
    "subject": "Mathematics",
    "year": 2024,
    "question": "If $f(x) = \\begin{cases} \\frac{k \\cos x}{\\pi - 2x}, & x \\ne \\frac{\\pi}{2} \\\\ 5, & x = \\frac{\\pi}{2} \\end{cases}$ is continuous at $x = \\frac{\\pi}{2}$, then $k$ is:",
    "options": [
      "$5$",
      "$\\frac{5}{2}$",
      "$10$",
      "$-10$"
    ],
    "explanation": "$$\\lim_{x \\to \\pi/2} \\frac{k\\cos x}{\\pi - 2x} = \\frac{k}{2}$$\nFor continuity:\n$$\\frac{k}{2} = 5 \\implies k = 10$$",
    "chapter": "Continuity and Differentiability",
    "chapter_number": 15,
    "correct_answer": 2,
    "needs_image": False
  },
  {
    "id": "math_ch15_q53",
    "subject": "Mathematics",
    "year": 2024,
    "question": "If $y = e^{3\\log x}$, then $\\frac{dy}{dx}$ is:",
    "options": [
      "$3x$",
      "$x^3$",
      "$3e^{3x}$",
      "$3x^2$"
    ],
    "explanation": "$$y = e^{3\\ln x} = e^{\\ln(x^3)} = x^3$$\nDifferentiating with respect to $x$:\n$$\\frac{dy}{dx} = 3x^2$$",
    "chapter": "Continuity and Differentiability",
    "chapter_number": 15,
    "correct_answer": 3,
    "needs_image": False
  },
  {
    "id": "math_ch15_q54",
    "subject": "Mathematics",
    "year": 2024,
    "question": "The differential coefficient of $\\log_{10} x$ with respect to $\\log_x 10$ is:",
    "options": [
      "$1$",
      "$-(\\log_{10} x)^2$",
      "$(\\log_{10} x)^2$",
      "$-(\\log_x 10)^2$"
    ],
    "explanation": "Let $u = \\log_{10} x$.\nThen $v = \\log_x 10 = \\frac{1}{\\log_{10} x} = \\frac{1}{u} = u^{-1}$.\nDifferentiating $u$ with respect to $v$:\n$$\\frac{du}{dv} = \\frac{1}{dv/du} = \\frac{1}{-u^{-2}} = -u^2 = -(\\log_{10} x)^2$$",
    "chapter": "Continuity and Differentiability",
    "chapter_number": 15,
    "correct_answer": 1,
    "needs_image": False
  },
  {
    "id": "math_ch15_q55",
    "subject": "Mathematics",
    "year": 2024,
    "question": "If $y = \\cos^{-1}\\left(\\frac{1 - x^2}{1 + x^2}\\right)$, then $\\frac{dy}{dx}$ is:",
    "options": [
      "$\\frac{2}{1 + x^2}$",
      "$\\frac{1}{1 + x^2}$",
      "$-\\frac{2}{1 + x^2}$",
      "$\\frac{2}{\\sqrt{1 - x^2}}$"
    ],
    "explanation": "Using standard identity for $x > 0$:\n$$y = \\cos^{-1}\\left(\\frac{1 - x^2}{1 + x^2}\\right) = 2\\tan^{-1} x$$\nDifferentiating with respect to $x$:\n$$\\frac{dy}{dx} = \\frac{2}{1 + x^2}$$",
    "chapter": "Continuity and Differentiability",
    "chapter_number": 15,
    "correct_answer": 0,
    "needs_image": False
  },
  {
    "id": "math_ch15_q56",
    "subject": "Mathematics",
    "year": 2024,
    "question": "If $y = \\sin(m\\sin^{-1} x)$, then $(1 - x^2) y_2 - x y_1 + m^2 y$ is equal to:",
    "options": [
      "$m^2$",
      "$1$",
      "$-m^2$",
      "$0$"
    ],
    "explanation": "$$y_1 = \\cos(m\\sin^{-1} x) \\cdot \\frac{m}{\\sqrt{1 - x^2}} \\implies \\sqrt{1 - x^2} y_1 = m\\cos(m\\sin^{-1} x)$$\nSquaring both sides:\n$$(1 - x^2) y_1^2 = m^2 \\cos^2(m\\sin^{-1} x) = m^2 [1 - \\sin^2(m\\sin^{-1} x)] = m^2(1 - y^2)$$\nDifferentiating both sides with respect to $x$:\n$$(1 - x^2)(2 y_1 y_2) + (-2x) y_1^2 = m^2(-2y y_1)$$\nDividing by $2y_1$:\n$$(1 - x^2) y_2 - x y_1 = -m^2 y \\implies (1 - x^2) y_2 - x y_1 + m^2 y = 0$$",
    "chapter": "Continuity and Differentiability",
    "chapter_number": 15,
    "correct_answer": 3,
    "needs_image": False
  },
  {
    "id": "math_ch15_q57",
    "subject": "Mathematics",
    "year": 2006,
    "question": "If $f(x) = \\begin{cases} \\frac{x^2 - 1}{x - 1}, & x \\ne 1 \\\\ 2, & x = 1 \\end{cases}$, then $f(x)$ is:",
    "options": [
      "Discontinuous at $x = 1$",
      "Continuous at $x = 1$ but not differentiable",
      "Differentiable at all points except $x = 1$",
      "Continuous and differentiable everywhere in $\\mathbb{R}$"
    ],
    "explanation": "For $x \\ne 1$, $f(x) = \\frac{(x-1)(x+1)}{x-1} = x + 1$.\nAt $x = 1$, $f(1) = 2 = 1 + 1$.\nHence, $f(x) = x + 1$ for all $x \\in \\mathbb{R}$, which is a linear polynomial function, hence continuous and differentiable everywhere in $\\mathbb{R}$.",
    "chapter": "Continuity and Differentiability",
    "chapter_number": 15,
    "correct_answer": 3,
    "needs_image": False
  },
  {
    "id": "math_ch15_q58",
    "subject": "Mathematics",
    "year": 2007,
    "question": "If $y = \\sqrt{\\log x + \\sqrt{\\log x + \\dots \\infty}}$, then $\\frac{dy}{dx}$ is:",
    "options": [
      "$\\frac{1}{x(2y - 1)}$",
      "$\\frac{1}{2y - 1}$",
      "$\\frac{x}{2y - 1}$",
      "$\\frac{2y - 1}{x}$"
    ],
    "explanation": "$$y^2 = \\log x + y \\implies 2y \\frac{dy}{dx} = \\frac{1}{x} + \\frac{dy}{dx} \\implies (2y - 1)\\frac{dy}{dx} = \\frac{1}{x} \\implies \\frac{dy}{dx} = \\frac{1}{x(2y - 1)}$$",
    "chapter": "Continuity and Differentiability",
    "chapter_number": 15,
    "correct_answer": 0,
    "needs_image": False
  },
  {
    "id": "math_ch15_q59",
    "subject": "Mathematics",
    "year": 2008,
    "question": "If $y = \\log(\\log x)$, then $\\frac{d^2y}{dx^2}$ is:",
    "options": [
      "$\\frac{1}{x^2 \\log x}$",
      "$-\\frac{1 + \\log x}{(x \\log x)^2}$",
      "$\\frac{1 + \\log x}{(x \\log x)^2}$",
      "$-\\frac{1}{(x \\log x)^2}$"
    ],
    "explanation": "$$y_1 = \\frac{1}{\\log x} \\cdot \\frac{1}{x} = (x \\log x)^{-1}$$\n$$y_2 = -(x \\log x)^{-2} \\cdot \\frac{d}{dx}(x \\log x) = -\\frac{x(1/x) + \\log x(1)}{(x \\log x)^2} = -\\frac{1 + \\log x}{(x \\log x)^2}$$",
    "chapter": "Continuity and Differentiability",
    "chapter_number": 15,
    "correct_answer": 1,
    "needs_image": False
  },
  {
    "id": "math_ch15_q60",
    "subject": "Mathematics",
    "year": 2009,
    "question": "If $f(x) = |x|$, which of the following is correct?",
    "options": [
      "$f'(0)$ does not exist",
      "$f(x)$ is discontinuous at $x = 0$",
      "$f(x)$ is continuous at $x = 0$",
      "$f(x)$ is differentiable at all points except $x = 0$"
    ],
    "explanation": "$f(x) = |x|$ is continuous everywhere in $\\mathbb{R}$ (including $x = 0$) and differentiable for all $x \\ne 0$, with $f'(0)$ not existing due to $\\text{LHD} = -1 \\ne +1 = \\text{RHD}$.",
    "chapter": "Continuity and Differentiability",
    "chapter_number": 15,
    "correct_answer": 0,
    "needs_image": False
  },
  {
    "id": "math_ch15_q61",
    "subject": "Mathematics",
    "year": 2010,
    "question": "If $x = a(\\theta - \\sin\\theta)$ and $y = a(1 - \\cos\\theta)$, then $\\frac{dy}{dx}$ at $\\theta = \\frac{\\pi}{2}$ is:",
    "options": [
      "$0$",
      "$1$",
      "$-1$",
      "$\\sqrt{3}$"
    ],
    "explanation": "$$\\frac{dx}{d\\theta} = a(1 - \\cos\\theta), \\quad \\frac{dy}{d\\theta} = a\\sin\\theta$$\n$$\\frac{dy}{dx} = \\frac{a\\sin\\theta}{a(1 - \\cos\\theta)} = \\frac{\\sin\\theta}{1 - \\cos\\theta} = \\cot\\left(\\frac{\\theta}{2}\\right)$$\nAt $\\theta = \\frac{\\pi}{2}$, $\\cot(\\pi/4) = 1$.",
    "chapter": "Continuity and Differentiability",
    "chapter_number": 15,
    "correct_answer": 1,
    "needs_image": False
  },
  {
    "id": "math_ch15_q62",
    "subject": "Mathematics",
    "year": 2011,
    "question": "If $y = \\tan^{-1}\\left(\\frac{a\\cos x - b\\sin x}{b\\cos x + a\\sin x}\\right)$, then $\\frac{dy}{dx}$ is:",
    "options": [
      "$-1$",
      "$1$",
      "$\\frac{a}{b}$",
      "$0$"
    ],
    "explanation": "Dividing numerator and denominator by $b\\cos x$:\n$$y = \\tan^{-1}\\left(\\frac{(a/b) - \\tan x}{1 + (a/b)\\tan x}\\right) = \\tan^{-1}\\left(\\frac{a}{b}\\right) - \\tan^{-1}(\\tan x) = \\tan^{-1}\\left(\\frac{a}{b}\\right) - x$$\nDifferentiating with respect to $x$:\n$$\\frac{dy}{dx} = 0 - 1 = -1$$",
    "chapter": "Continuity and Differentiability",
    "chapter_number": 15,
    "correct_answer": 0,
    "needs_image": False
  },
  {
    "id": "math_ch15_q63",
    "subject": "Mathematics",
    "year": 2012,
    "question": "The derivative of $\\tan^{-1}\\left(\\frac{\\sin x}{1 + \\cos x}\\right)$ with respect to $x$ is:",
    "options": [
      "$1$",
      "$\\frac{1}{2}$",
      "$2$",
      "$-1$"
    ],
    "explanation": "$$\\frac{\\sin x}{1 + \\cos x} = \\frac{2\\sin(x/2)\\cos(x/2)}{2\\cos^2(x/2)} = \\tan\\left(\\frac{x}{2}\\right)$$\n$$y = \\tan^{-1}\\left(\\tan\\frac{x}{2}\\right) = \\frac{x}{2} \\implies \\frac{dy}{dx} = \\frac{1}{2}$$",
    "chapter": "Continuity and Differentiability",
    "chapter_number": 15,
    "correct_answer": 1,
    "needs_image": False
  },
  {
    "id": "math_ch15_q64",
    "subject": "Mathematics",
    "year": 2013,
    "question": "If $y = \\sin^{-1}\\left(\\frac{2x}{1 + x^2}\\right) + \\sec^{-1}\\left(\\frac{1 + x^2}{1 - x^2}\\right)$, then $\\frac{dy}{dx}$ is:",
    "options": [
      "$\\frac{2}{1 + x^2}$",
      "$\\frac{4}{1 + x^2}$",
      "$\\frac{1}{1 + x^2}$",
      "$0$"
    ],
    "explanation": "$$\\sin^{-1}\\left(\\frac{2x}{1 + x^2}\\right) = 2\\tan^{-1} x$$\n$$\\sec^{-1}\\left(\\frac{1 + x^2}{1 - x^2}\\right) = \\cos^{-1}\\left(\\frac{1 - x^2}{1 + x^2}\\right) = 2\\tan^{-1} x$$\n$$y = 2\\tan^{-1} x + 2\\tan^{-1} x = 4\\tan^{-1} x \\implies \\frac{dy}{dx} = \\frac{4}{1 + x^2}$$",
    "chapter": "Continuity and Differentiability",
    "chapter_number": 15,
    "correct_answer": 1,
    "needs_image": False
  },
  {
    "id": "math_ch15_q65",
    "subject": "Mathematics",
    "year": 2014,
    "question": "If $f(x) = |x - 2| + |x - 5|$, then for $x \\in (2, 5)$, $f'(x)$ is equal to:",
    "options": [
      "$2$",
      "$0$",
      "$-2$",
      "$1$"
    ],
    "explanation": "For $x \\in (2, 5)$, $x - 2 > 0 \\implies |x - 2| = x - 2$, and $x - 5 < 0 \\implies |x - 5| = -(x - 5) = 5 - x$.\n$$f(x) = (x - 2) + (5 - x) = 3$$\nSince $f(x)$ is a constant function ($3$) on $(2, 5)$:\n$$f'(x) = 0$$",
    "chapter": "Continuity and Differentiability",
    "chapter_number": 15,
    "correct_answer": 1,
    "needs_image": False
  },
  {
    "id": "math_ch15_q66",
    "subject": "Mathematics",
    "year": 2015,
    "question": "If $e^y(x + 1) = 1$, then $\\frac{d^2y}{dx^2}$ is equal to:",
    "options": [
      "$\\left(\\frac{dy}{dx}\\right)^2$",
      "$-\\left(\\frac{dy}{dx}\\right)^2$",
      "$\\frac{dy}{dx}$",
      "$e^y$"
    ],
    "explanation": "$$e^y = \\frac{1}{x + 1} \\implies y = -\\log(x + 1)$$\nFirst derivative: $\\frac{dy}{dx} = -\\frac{1}{x + 1}$.\nSecond derivative: $\\frac{d^2y}{dx^2} = \\frac{1}{(x + 1)^2} = \\left(-\\frac{1}{x + 1}\\right)^2 = \\left(\\frac{dy}{dx}\\right)^2$.",
    "chapter": "Continuity and Differentiability",
    "chapter_number": 15,
    "correct_answer": 0,
    "needs_image": False
  },
  {
    "id": "math_ch15_q67",
    "subject": "Mathematics",
    "year": 2016,
    "question": "If $x = a\\sec^3\\theta$ and $y = a\\tan^3\\theta$, then $\\frac{dy}{dx}$ at $\\theta = \\frac{\\pi}{4}$ is:",
    "options": [
      "$\\sqrt{2}$",
      "$1$",
      "$\\sqrt{3}$",
      "$\\frac{1}{\\sqrt{2}}$"
    ],
    "explanation": "$$\\frac{dx}{d\\theta} = 3a\\sec^2\\theta(\\sec\\theta\\tan\\theta) = 3a\\sec^3\\theta\\tan\\theta$$\n$$\\frac{dy}{d\\theta} = 3a\\tan^2\\theta(\\sec^2\\theta) = 3a\\sec^2\\theta\\tan^2\\theta$$\n$$\\frac{dy}{dx} = \\frac{3a\\sec^2\\theta\\tan^2\\theta}{3a\\sec^3\\theta\\tan\\theta} = \\frac{\\tan\\theta}{\\sec\\theta} = \\sin\\theta$$\nAt $\\theta = \\frac{\\pi}{4}$, $\\sin(\\pi/4) = \\frac{1}{\\sqrt{2}}$.",
    "chapter": "Continuity and Differentiability",
    "chapter_number": 15,
    "correct_answer": 3,
    "needs_image": False
  },
  {
    "id": "math_ch15_q68",
    "subject": "Mathematics",
    "year": 2017,
    "question": "If $y = \\log(\\sqrt{x} + \\frac{1}{\\sqrt{x}})$, then $\\frac{dy}{dx}$ is:",
    "options": [
      "$\\frac{x + 1}{2x(x - 1)}$",
      "$\\frac{x - 1}{2x(x + 1)}$",
      "$\\frac{1}{2x(x + 1)}$",
      "$\\frac{x - 1}{x(x + 1)}$"
    ],
    "explanation": "$$y = \\log\\left(\\frac{x + 1}{\\sqrt{x}}\\right) = \\log(x + 1) - \\frac{1}{2}\\log x$$\n$$\\frac{dy}{dx} = \\frac{1}{x + 1} - \\frac{1}{2x} = \\frac{2x - (x + 1)}{2x(x + 1)} = \\frac{x - 1}{2x(x + 1)}$$",
    "chapter": "Continuity and Differentiability",
    "chapter_number": 15,
    "correct_answer": 1,
    "needs_image": False
  },
  {
    "id": "math_ch15_q69",
    "subject": "Mathematics",
    "year": 2018,
    "question": "If $f(x) = \\begin{cases} \\frac{\\sqrt{1 + px} - \\sqrt{1 - px}}{x}, & -1 \\le x < 0 \\\\ \\frac{2x + 1}{x - 2}, & 0 \\le x \\le 1 \\end{cases}$ is continuous in $[-1, 1]$, then $p$ is:",
    "options": [
      "$-1$",
      "$-1/2$",
      "$1/2$",
      "None of the options is correct"
    ],
    "explanation": "At $x = 0$, $f(0) = \\frac{1}{-2} = -\\frac{1}{2}$.\n$\\lim_{x \\to 0^-} f(x) = p$.\nEquating: $p = -\\frac{1}{2}$.",
    "chapter": "Continuity and Differentiability",
    "chapter_number": 15,
    "correct_answer": 1,
    "needs_image": False
  },
  {
    "id": "math_ch15_q70",
    "subject": "Mathematics",
    "year": 2019,
    "question": "If $y = (1 + \\frac{1}{x})^x$, then $\\frac{dy}{dx}$ is:",
    "options": [
      "$(1 + \\frac{1}{x})^x [\\log(1 + \\frac{1}{x}) + \\frac{1}{x + 1}]$",
      "$(1 + \\frac{1}{x})^x [\\log(1 + \\frac{1}{x})]$",
      "$(1 + \\frac{1}{x})^x [\\log(1 + \\frac{1}{x}) - \\frac{1}{x + 1}]$",
      "$(1 + \\frac{1}{x})^x [\\frac{1}{x + 1}]$"
    ],
    "explanation": "$$\\ln y = x \\ln\\left(1 + \\frac{1}{x}\\right)$$\n$$\\frac{1}{y}\\frac{dy}{dx} = \\ln\\left(1 + \\frac{1}{x}\\right) + x \\cdot \\frac{1}{1 + 1/x} \\cdot \\left(-\\frac{1}{x^2}\\right) = \\ln\\left(1 + \\frac{1}{x}\\right) - \\frac{1}{x + 1}$$\n$$\\frac{dy}{dx} = \\left(1 + \\frac{1}{x}\\right)^x \\left[\\ln\\left(1 + \\frac{1}{x}\\right) - \\frac{1}{x + 1}\\right]$$",
    "chapter": "Continuity and Differentiability",
    "chapter_number": 15,
    "correct_answer": 2,
    "needs_image": False
  },
  {
    "id": "math_ch15_q71",
    "subject": "Mathematics",
    "year": 2020,
    "question": "If $x = a\\sec\\theta$ and $y = b\\tan\\theta$, then $\\frac{d^2y}{dx^2}$ at $\\theta = \\frac{\\pi}{6}$ is:",
    "options": [
      "$-\\frac{b}{a^2}$",
      "$-\\frac{3\\sqrt{3} b}{a^2}$",
      "$\\frac{3\\sqrt{3} b}{a^2}$",
      "$-\\frac{b}{3\\sqrt{3} a^2}$"
    ],
    "explanation": "$$\\frac{dx}{d\\theta} = a\\sec\\theta\\tan\\theta, \\quad \\frac{dy}{d\\theta} = b\\sec^2\\theta$$\n$$\\frac{dy}{dx} = \\frac{b\\sec^2\\theta}{a\\sec\\theta\\tan\\theta} = \\frac{b}{a}\\csc\\theta$$\n$$\\frac{d^2y}{dx^2} = \\frac{d}{d\\theta}\\left(\\frac{b}{a}\\csc\\theta\\right) \\frac{d\\theta}{dx} = -\\frac{b}{a}\\csc\\theta\\cot\\theta \\cdot \\frac{1}{a\\sec\\theta\\tan\\theta} = -\\frac{b}{a^2}\\cot^3\\theta$$\nAt $\\theta = \\pi/6$, $\\cot(\\pi/6) = \\sqrt{3} \\implies \\cot^3(\\pi/6) = 3\\sqrt{3}$.\nThus, $\\frac{d^2y}{dx^2} = -\\frac{3\\sqrt{3}b}{a^2}$.",
    "chapter": "Continuity and Differentiability",
    "chapter_number": 15,
    "correct_answer": 1,
    "needs_image": False
  },
  {
    "id": "math_ch15_q72",
    "subject": "Mathematics",
    "year": 2021,
    "question": "If $f(x) = \\begin{cases} \\frac{1 - \\cos kx}{x \\sin x}, & x \\ne 0 \\\\ \\frac{1}{2}, & x = 0 \\end{cases}$ is continuous at $x = 0$, then $k$ is:",
    "options": [
      "$0$",
      "$\\pm 2$",
      "$\\pm 1/2$",
      "$\\pm 1$"
    ],
    "explanation": "$$\\lim_{x \\to 0} \\frac{1 - \\cos kx}{x^2 \\frac{\\sin x}{x}} = \\frac{k^2}{2} = \\frac{1}{2} \\implies k = \\pm 1$$",
    "chapter": "Continuity and Differentiability",
    "chapter_number": 15,
    "correct_answer": 3,
    "needs_image": False
  },
  {
    "id": "math_ch15_q73",
    "subject": "Mathematics",
    "year": 2022,
    "question": "If $y = e^{a\\sin^{-1} x}$, then $(1 - x^2) y_2 - x y_1$ is equal to:",
    "options": [
      "$a y$",
      "$-a^2 y$",
      "$a^2 y$",
      "$0$"
    ],
    "explanation": "$$y_1 = \\frac{a e^{a\\sin^{-1} x}}{\\sqrt{1 - x^2}} = \\frac{a y}{\\sqrt{1 - x^2}}$$\n$$(1 - x^2) y_1^2 = a^2 y^2$$\nDifferentiating with respect to $x$:\n$$(1 - x^2)(2 y_1 y_2) + (-2x) y_1^2 = a^2 (2y y_1)$$\nDividing by $2y_1$:\n$$(1 - x^2) y_2 - x y_1 = a^2 y$$",
    "chapter": "Continuity and Differentiability",
    "chapter_number": 15,
    "correct_answer": 2,
    "needs_image": False
  },
  {
    "id": "math_ch15_q74",
    "subject": "Mathematics",
    "year": 2023,
    "question": "The derivative of $\\log_e(\\cos x)$ with respect to $x$ is:",
    "options": [
      "$-\\tan x$",
      "$\\cot x$",
      "$\\tan x$",
      "$-\\cot x$"
    ],
    "explanation": "$$\\frac{d}{dx}[\\ln(\\cos x)] = \\frac{1}{\\cos x} \\cdot (-\\sin x) = -\\tan x$$",
    "chapter": "Continuity and Differentiability",
    "chapter_number": 15,
    "correct_answer": 0,
    "needs_image": False
  },
  {
    "id": "math_ch15_q75",
    "subject": "Mathematics",
    "year": 2023,
    "question": "If $f(x) = [x]$ where $[x]$ is greatest integer function, then $f'(1.5)$ is:",
    "options": [
      "$0$",
      "$1$",
      "Does not exist",
      "$1.5$"
    ],
    "explanation": "In any open interval between two consecutive integers, e.g., $(1, 2)$, the greatest integer function is constant: $[x] = 1$ for all $x \\in (1, 2)$.\nSince the derivative of any constant function on an open neighborhood is zero:\n$$f'(1.5) = 0$$",
    "chapter": "Continuity and Differentiability",
    "chapter_number": 15,
    "correct_answer": 0,
    "needs_image": False
  },
  {
    "id": "math_ch15_q76",
    "subject": "Mathematics",
    "year": 2024,
    "question": "If $y = (\\sin x)^x$, then $\\frac{dy}{dx}$ is:",
    "options": [
      "$(\\sin x)^x [\\log(\\sin x) + \\tan x]$",
      "$(\\sin x)^x [\\log(\\sin x) - x\\cot x]$",
      "$(\\sin x)^x [x\\log(\\sin x) + \\cot x]$",
      "$(\\sin x)^x [\\log(\\sin x) + x\\cot x]$"
    ],
    "explanation": "$$\\ln y = x \\ln(\\sin x)$$\n$$\\frac{1}{y}\\frac{dy}{dx} = \\ln(\\sin x) + x \\cdot \\frac{\\cos x}{\\sin x} = \\ln(\\sin x) + x\\cot x$$\n$$\\frac{dy}{dx} = (\\sin x)^x [\\ln(\\sin x) + x\\cot x]$$",
    "chapter": "Continuity and Differentiability",
    "chapter_number": 15,
    "correct_answer": 3,
    "needs_image": False
  },
  {
    "id": "math_ch15_q77",
    "subject": "Mathematics",
    "year": 2006,
    "question": "If $y = \\sqrt{\\sin x + y}$, then $\\frac{dy}{dx}$ is:",
    "options": [
      "$\\frac{\\cos x}{2y - 1}$",
      "$\\frac{\\sin x}{2y - 1}$",
      "$\\frac{\\cos x}{2y + 1}$",
      "$\\frac{\\sin x}{1 - 2y}$"
    ],
    "explanation": "$$y^2 = \\sin x + y \\implies 2y \\frac{dy}{dx} = \\cos x + \\frac{dy}{dx} \\implies (2y - 1)\\frac{dy}{dx} = \\cos x \\implies \\frac{dy}{dx} = \\frac{\\cos x}{2y - 1}$$",
    "chapter": "Continuity and Differentiability",
    "chapter_number": 15,
    "correct_answer": 0,
    "needs_image": False
  },
  {
    "id": "math_ch15_q78",
    "subject": "Mathematics",
    "year": 2007,
    "question": "If $f(x) = \\begin{cases} 2x - 1, & x < 2 \\\\ \\frac{3x}{2}, & x \\ge 2 \\end{cases}$, then $f'(2)$:",
    "options": [
      "Equals $2$",
      "Does not exist",
      "Equals $3/2$",
      "Equals $3$"
    ],
    "explanation": "At $x = 2$:\n- Left derivative: $\\text{LHD} = 2$.\n- Right derivative: $\\text{RHD} = 3/2$.\nSince $\\text{LHD} \\ne \\text{RHD}$, $f'(2)$ does not exist.",
    "chapter": "Continuity and Differentiability",
    "chapter_number": 15,
    "correct_answer": 1,
    "needs_image": False
  },
  {
    "id": "math_ch15_q79",
    "subject": "Mathematics",
    "year": 2008,
    "question": "If $y = \\tan^{-1}\\left(\\frac{x}{1 + \\sqrt{1 - x^2}}\\right)$, then $\\frac{dy}{dx}$ is:",
    "options": [
      "$\\frac{1}{\\sqrt{1 - x^2}}$",
      "$\\frac{1}{2\\sqrt{1 - x^2}}$",
      "$\\frac{1}{1 + x^2}$",
      "$\\frac{2}{\\sqrt{1 - x^2}}$"
    ],
    "explanation": "Substitute $x = \\sin\\theta \\implies \\theta = \\sin^{-1} x$.\n$$y = \\tan^{-1}\\left(\\frac{\\sin\\theta}{1 + \\cos\\theta}\\right) = \\tan^{-1}\\left(\\tan\\frac{\\theta}{2}\\right) = \\frac{\\theta}{2} = \\frac{1}{2}\\sin^{-1} x$$\n$$\\frac{dy}{dx} = \\frac{1}{2\\sqrt{1 - x^2}}$$",
    "chapter": "Continuity and Differentiability",
    "chapter_number": 15,
    "correct_answer": 1,
    "needs_image": False
  },
  {
    "id": "math_ch15_q80",
    "subject": "Mathematics",
    "year": 2009,
    "question": "If $f(x) = |x|^3$, then $f''(0)$ is:",
    "options": [
      "$6$",
      "Does not exist",
      "$0$",
      "$3$"
    ],
    "explanation": "$$f(x) = \\begin{cases} x^3, & x \\ge 0 \\\\ -x^3, & x < 0 \\end{cases}$$\n$$f'(x) = \\begin{cases} 3x^2, & x \\ge 0 \\\\ -3x^2, & x < 0 \\end{cases} = 3x|x|$$\n$$f''(0) = \\lim_{h \\to 0} \\frac{f'(h) - f'(0)}{h} = \\lim_{h \\to 0} \\frac{3h|h|}{h} = \\lim_{h \\to 0} 3|h| = 0$$",
    "chapter": "Continuity and Differentiability",
    "chapter_number": 15,
    "correct_answer": 2,
    "needs_image": False
  },
  {
    "id": "math_ch15_q81",
    "subject": "Mathematics",
    "year": 2010,
    "question": "If $y = \\sin^{-1}\\left(\\frac{1 - x^2}{1 + x^2}\\right)$, then $\\frac{dy}{dx}$ is:",
    "options": [
      "$\\frac{2}{1 + x^2}$",
      "$-\\frac{2}{1 + x^2}$",
      "$\\frac{1}{1 + x^2}$",
      "$-\\frac{1}{1 + x^2}$"
    ],
    "explanation": "$$y = \\sin^{-1}\\left(\\frac{1 - x^2}{1 + x^2}\\right) = \\frac{\\pi}{2} - \\cos^{-1}\\left(\\frac{1 - x^2}{1 + x^2}\\right) = \\frac{\\pi}{2} - 2\\tan^{-1} x$$\nDifferentiating with respect to $x$:\n$$\\frac{dy}{dx} = -\\frac{2}{1 + x^2}$$",
    "chapter": "Continuity and Differentiability",
    "chapter_number": 15,
    "correct_answer": 1,
    "needs_image": False
  },
  {
    "id": "math_ch15_q82",
    "subject": "Mathematics",
    "year": 2011,
    "question": "If $y = e^{x + e^{x + e^{x + \\dots \\infty}}}$, then $\\frac{dy}{dx}$ is:",
    "options": [
      "$\\frac{y}{1 - y}$",
      "$\\frac{y}{1 + y}$",
      "$\\frac{x}{1 - y}$",
      "$\\frac{x}{1 + y}$"
    ],
    "explanation": "$$y = e^{x + y} \\implies \\ln y = x + y$$\nDifferentiating with respect to $x$:\n$$\\frac{1}{y}\\frac{dy}{dx} = 1 + \\frac{dy}{dx} \\implies \\left(\\frac{1 - y}{y}\\right)\\frac{dy}{dx} = 1 \\implies \\frac{dy}{dx} = \\frac{y}{1 - y}$$",
    "chapter": "Continuity and Differentiability",
    "chapter_number": 15,
    "correct_answer": 0,
    "needs_image": False
  },
  {
    "id": "math_ch15_q83",
    "subject": "Mathematics",
    "year": 2012,
    "question": "If $f(x) = \\begin{cases} x^2 \\sin(1/x), & x \\ne 0 \\\\ 0, & x = 0 \\end{cases}$, then at $x = 0$, $f(x)$ is:",
    "options": [
      "Discontinuous",
      "Continuous but not differentiable",
      "Differentiable with continuous derivative",
      "Differentiable with discontinuous derivative"
    ],
    "explanation": "1. $f'(0) = \\lim_{h \\to 0} \\frac{h^2\\sin(1/h) - 0}{h} = \\lim_{h \\to 0} h\\sin(1/h) = 0$.\n2. For $x \\ne 0$, $f'(x) = 2x\\sin(1/x) - \\cos(1/x)$.\nAs $x \\to 0$, $\\lim_{x \\to 0} f'(x)$ does not exist due to oscillating $\\cos(1/x)$.\nThus, $f(x)$ is differentiable at $x = 0$, but its derivative $f'(x)$ is discontinuous at $x = 0$.",
    "chapter": "Continuity and Differentiability",
    "chapter_number": 15,
    "correct_answer": 3,
    "needs_image": False
  },
  {
    "id": "math_ch15_q84",
    "subject": "Mathematics",
    "year": 2013,
    "question": "If $x = a(\\cos\\theta + \\theta\\sin\\theta)$ and $y = a(\\sin\\theta - \\theta\\cos\\theta)$, then $\\frac{dy}{dx}$ is:",
    "options": [
      "$\\cot\\theta$",
      "$-\\tan\\theta$",
      "$-\\cot\\theta$",
      "$\\tan\\theta$"
    ],
    "explanation": "$$\\frac{dx}{d\\theta} = a\\theta\\cos\\theta, \\quad \\frac{dy}{d\\theta} = a\\theta\\sin\\theta$$\n$$\\frac{dy}{dx} = \\frac{a\\theta\\sin\\theta}{a\\theta\\cos\\theta} = \\tan\\theta$$",
    "chapter": "Continuity and Differentiability",
    "chapter_number": 15,
    "correct_answer": 3,
    "needs_image": False
  },
  {
    "id": "math_ch15_q85",
    "subject": "Mathematics",
    "year": 2014,
    "question": "If $y = \\tan^{-1}\\left(\\frac{\\sqrt{1 + x} - \\sqrt{1 - x}}{\\sqrt{1 + x} + \\sqrt{1 - x}}\\right)$, then $\\frac{dy}{dx}$ is:",
    "options": [
      "$\\frac{1}{2\\sqrt{1 - x^2}}$",
      "$\\frac{1}{\\sqrt{1 - x^2}}$",
      "$-\\frac{1}{2\\sqrt{1 - x^2}}$",
      "$\\frac{1}{1 + x^2}$"
    ],
    "explanation": "Substitute $x = \\cos 2\\theta \\implies \\theta = \\frac{1}{2}\\cos^{-1} x$.\n$$y = \\tan^{-1}\\left(\\frac{\\sqrt{2}\\cos\\theta - \\sqrt{2}\\sin\\theta}{\\sqrt{2}\\cos\\theta + \\sqrt{2}\\sin\\theta}\\right) = \\tan^{-1}\\left(\\tan\\left(\\frac{\\pi}{4} - \\theta\\right)\\right) = \\frac{\\pi}{4} - \\theta = \\frac{\\pi}{4} - \\frac{1}{2}\\cos^{-1} x$$\n$$\\frac{dy}{dx} = 0 - \\frac{1}{2}\\left(-\\frac{1}{\\sqrt{1 - x^2}}\\right) = \\frac{1}{2\\sqrt{1 - x^2}}$$",
    "chapter": "Continuity and Differentiability",
    "chapter_number": 15,
    "correct_answer": 0,
    "needs_image": False
  },
  {
    "id": "math_ch15_q86",
    "subject": "Mathematics",
    "year": 2015,
    "question": "If $y = \\log_e(x + \\sqrt{x^2 + 1})$, then $\\sqrt{x^2 + 1}\\frac{dy}{dx}$ is equal to:",
    "options": [
      "$1$",
      "$y$",
      "$x$",
      "$0$"
    ],
    "explanation": "$$\\frac{dy}{dx} = \\frac{1}{x + \\sqrt{x^2 + 1}} \\cdot \\left(1 + \\frac{2x}{2\\sqrt{x^2 + 1}}\\right) = \\frac{1}{x + \\sqrt{x^2 + 1}} \\cdot \\frac{\\sqrt{x^2 + 1} + x}{\\sqrt{x^2 + 1}} = \\frac{1}{\\sqrt{x^2 + 1}}$$\n$$\\sqrt{x^2 + 1}\\frac{dy}{dx} = 1$$",
    "chapter": "Continuity and Differentiability",
    "chapter_number": 15,
    "correct_answer": 0,
    "needs_image": False
  },
  {
    "id": "math_ch15_q87",
    "subject": "Mathematics",
    "year": 2016,
    "question": "If $y = e^{x + y}$, then $\\frac{dy}{dx}$ is equal to:",
    "options": [
      "$\\frac{y}{1 - y}$",
      "$\\frac{x}{1 - x}$",
      "$\\frac{1}{1 - y}$",
      "$\\frac{y}{1 + y}$"
    ],
    "explanation": "$$\\ln y = x + y \\implies \\frac{1}{y}\\frac{dy}{dx} = 1 + \\frac{dy}{dx} \\implies \\frac{dy}{dx} = \\frac{y}{1 - y}$$",
    "chapter": "Continuity and Differentiability",
    "chapter_number": 15,
    "correct_answer": 0,
    "needs_image": False
  },
  {
    "id": "math_ch15_q88",
    "subject": "Mathematics",
    "year": 2017,
    "question": "If $f(x) = \\begin{cases} \\frac{\\sin(k x)}{x}, & x < 0 \\\\ 2x + 1, & x \\ge 0 \\end{cases}$ is continuous at $x = 0$, then $k$ is:",
    "options": [
      "$0$",
      "$-1$",
      "$1$",
      "$2$"
    ],
    "explanation": "$$\\lim_{x \\to 0^-} \\frac{\\sin kx}{x} = k$$\n$$f(0) = 2(0) + 1 = 1$$\nFor continuity: $k = 1$.",
    "chapter": "Continuity and Differentiability",
    "chapter_number": 15,
    "correct_answer": 2,
    "needs_image": False
  },
  {
    "id": "math_ch15_q89",
    "subject": "Mathematics",
    "year": 2018,
    "question": "If $y = \\cos^{-1}(2x^2 - 1)$, then $\\frac{dy}{dx}$ is:",
    "options": [
      "$\\frac{2}{\\sqrt{1 - x^2}}$",
      "$\\frac{1}{\\sqrt{1 - x^2}}$",
      "$-\\frac{1}{\\sqrt{1 - x^2}}$",
      "$-\\frac{2}{\\sqrt{1 - x^2}}$"
    ],
    "explanation": "Substitute $x = \\cos\\theta \\implies y = \\cos^{-1}(\\cos 2\\theta) = 2\\theta = 2\\cos^{-1} x$.\n$$\\frac{dy}{dx} = 2\\left(-\\frac{1}{\\sqrt{1 - x^2}}\\right) = -\\frac{2}{\\sqrt{1 - x^2}}$$",
    "chapter": "Continuity and Differentiability",
    "chapter_number": 15,
    "correct_answer": 3,
    "needs_image": False
  },
  {
    "id": "math_ch15_q90",
    "subject": "Mathematics",
    "year": 2019,
    "question": "If $x = a t^2$ and $y = 2a t$, then $\\frac{d^2y}{dx^2}$ is:",
    "options": [
      "$\\frac{1}{2a t^3}$",
      "$-\\frac{1}{2a t^2}$",
      "$\\frac{1}{2a t^2}$",
      "$-\\frac{1}{2a t^3}$"
    ],
    "explanation": "$$\\frac{dx}{dt} = 2a t, \\quad \\frac{dy}{dt} = 2a$$\n$$\\frac{dy}{dx} = \\frac{2a}{2a t} = \\frac{1}{t}$$\n$$\\frac{d^2y}{dx^2} = \\frac{d}{dt}\\left(\\frac{1}{t}\\right) \\cdot \\frac{dt}{dx} = -\\frac{1}{t^2} \\cdot \\frac{1}{2a t} = -\\frac{1}{2a t^3}$$",
    "chapter": "Continuity and Differentiability",
    "chapter_number": 15,
    "correct_answer": 3,
    "needs_image": False
  },
  {
    "id": "math_ch15_q91",
    "subject": "Mathematics",
    "year": 2020,
    "question": "If $f(x) = |x - 1|$, then the value of $f'(1)$:",
    "options": [
      "Is $1$",
      "Is $-1$",
      "Does not exist",
      "Is $0$"
    ],
    "explanation": "At $x = 1$:\n- $\\text{LHD} = \\lim_{h \\to 0^-} \\frac{|1+h-1| - 0}{h} = \\lim_{h \\to 0^-} \\frac{-h}{h} = -1$.\n- $\\text{RHD} = \\lim_{h \\to 0^+} \\frac{|1+h-1| - 0}{h} = \\lim_{h \\to 0^+} \\frac{h}{h} = +1$.\nSince $\\text{LHD} \\ne \\text{RHD}$, $f'(1)$ does not exist.",
    "chapter": "Continuity and Differentiability",
    "chapter_number": 15,
    "correct_answer": 2,
    "needs_image": False
  },
  {
    "id": "math_ch15_q92",
    "subject": "Mathematics",
    "year": 2021,
    "question": "If $y = \\tan^{-1}\\left(\\frac{1 + x}{1 - x}\\right)$, then $\\frac{dy}{dx}$ is:",
    "options": [
      "$\\frac{2}{1 + x^2}$",
      "$\\frac{1}{1 + x^2}$",
      "$-\\frac{1}{1 + x^2}$",
      "$\\frac{1}{1 - x^2}$"
    ],
    "explanation": "$$y = \\tan^{-1}\\left(\\frac{1 + x}{1 - 1 \\cdot x}\\right) = \\tan^{-1} 1 + \\tan^{-1} x = \\frac{\\pi}{4} + \\tan^{-1} x$$\n$$\\frac{dy}{dx} = 0 + \\frac{1}{1 + x^2} = \\frac{1}{1 + x^2}$$",
    "chapter": "Continuity and Differentiability",
    "chapter_number": 15,
    "correct_answer": 1,
    "needs_image": False
  },
  {
    "id": "math_ch15_q93",
    "subject": "Mathematics",
    "year": 2022,
    "question": "If $y = e^{3x} \\sin 4x$, then $\\frac{dy}{dx}$ is:",
    "options": [
      "$e^{3x}(3\\sin 4x - 4\\cos 4x)$",
      "$e^{3x}(3\\sin 4x + 4\\cos 4x)$",
      "$e^{3x}(4\\sin 4x + 3\\cos 4x)$",
      "$12e^{3x}\\cos 4x$"
    ],
    "explanation": "Applying the product rule:\n$$\\frac{dy}{dx} = \\frac{d}{dx}(e^{3x}) \\sin 4x + e^{3x} \\frac{d}{dx}(\\sin 4x) = 3e^{3x}\\sin 4x + 4e^{3x}\\cos 4x = e^{3x}(3\\sin 4x + 4\\cos 4x)$$",
    "chapter": "Continuity and Differentiability",
    "chapter_number": 15,
    "correct_answer": 1,
    "needs_image": False
  },
  {
    "id": "math_ch15_q94",
    "subject": "Mathematics",
    "year": 2022,
    "question": "If $y = a\\sin x + b\\cos x$, then $y^2 + \\left(\\frac{dy}{dx}\\right)^2$ is equal to:",
    "options": [
      "$a + b$",
      "$a^2 - b^2$",
      "$a^2 + b^2$",
      "$(a + b)^2$"
    ],
    "explanation": "$$y = a\\sin x + b\\cos x$$\n$$\\frac{dy}{dx} = a\\cos x - b\\sin x$$\n$$y^2 + \\left(\\frac{dy}{dx}\\right)^2 = (a\\sin x + b\\cos x)^2 + (a\\cos x - b\\sin x)^2$$\n$$= a^2(\\sin^2 x + \\cos^2 x) + b^2(\\cos^2 x + \\sin^2 x) + 2ab\\sin x\\cos x - 2ab\\sin x\\cos x = a^2 + b^2$$",
    "chapter": "Continuity and Differentiability",
    "chapter_number": 15,
    "correct_answer": 2,
    "needs_image": False
  },
  {
    "id": "math_ch15_q95",
    "subject": "Mathematics",
    "year": 2023,
    "question": "If $f(x) = \\begin{cases} \\frac{1 - \\cos 2x}{x^2}, & x \\ne 0 \\\\ 2, & x = 0 \\end{cases}$, then at $x = 0$, $f(x)$ is:",
    "options": [
      "Discontinuous",
      "Continuous but not differentiable",
      "Neither continuous nor differentiable",
      "Continuous"
    ],
    "explanation": "$$\\lim_{x \\to 0} \\frac{1 - \\cos 2x}{x^2} = \\lim_{x \\to 0} \\frac{2\\sin^2 x}{x^2} = 2(1)^2 = 2 = f(0)$$\nThus, $f(x)$ is continuous at $x = 0$.",
    "chapter": "Continuity and Differentiability",
    "chapter_number": 15,
    "correct_answer": 3,
    "needs_image": False
  },
  {
    "id": "math_ch15_q96",
    "subject": "Mathematics",
    "year": 2023,
    "question": "The derivative of $\\log_{10} x$ with respect to $x$ is:",
    "options": [
      "$\\frac{1}{x}$",
      "$\\frac{1}{x \\log_e 10}$",
      "$\\frac{\\log_e 10}{x}$",
      "$\\frac{10}{x}$"
    ],
    "explanation": "$$\\log_{10} x = \\frac{\\ln x}{\\ln 10} \\implies \\frac{d}{dx}[\\log_{10} x] = \\frac{1}{\\ln 10} \\cdot \\frac{1}{x} = \\frac{1}{x \\log_e 10}$$",
    "chapter": "Continuity and Differentiability",
    "chapter_number": 15,
    "correct_answer": 1,
    "needs_image": False
  },
  {
    "id": "math_ch15_q97",
    "subject": "Mathematics",
    "year": 2024,
    "question": "If $y = (\\sin^{-1} x)^2$, then $(1 - x^2)\\frac{d^2y}{dx^2} - x\\frac{dy}{dx}$ is:",
    "options": [
      "$0$",
      "$-2$",
      "$1$",
      "$2$"
    ],
    "explanation": "$$y_1 = \\frac{2\\sin^{-1} x}{\\sqrt{1 - x^2}} \\implies (1 - x^2)y_1^2 = 4y$$\nDifferentiating: $(1 - x^2)(2y_1 y_2) - 2x y_1^2 = 4y_1 \\implies (1 - x^2)y_2 - x y_1 = 2$.",
    "chapter": "Continuity and Differentiability",
    "chapter_number": 15,
    "correct_answer": 3,
    "needs_image": False
  },
  {
    "id": "math_ch15_q98",
    "subject": "Mathematics",
    "year": 2024,
    "question": "The function $f(x) = |\\cos x|$ is:",
    "options": [
      "Discontinuous everywhere",
      "Everywhere continuous and everywhere differentiable",
      "Continuous everywhere but not differentiable at $x = (2n + 1)\\frac{\\pi}{2}$",
      "Differentiable everywhere except at $x = n\\pi$"
    ],
    "explanation": "$f(x) = |\\cos x|$ is continuous everywhere as the composition of continuous functions $|x|$ and $\\cos x$. However, at points where $\\cos x = 0$, namely $x = (2n + 1)\\frac{\\pi}{2}$ ($n \\in \\mathbb{Z}$), the curve exhibits sharp corners and is not differentiable.",
    "chapter": "Continuity and Differentiability",
    "chapter_number": 15,
    "correct_answer": 2,
    "needs_image": False
  },
  {
    "id": "math_ch15_q99",
    "subject": "Mathematics",
    "year": 2024,
    "question": "If $y = 2^{x^r}$, then $\\frac{dy}{dx}$ is:",
    "options": [
      "$2^{x^r} r x^{r-1}$",
      "$2^{x^r} r x^{r-1} \\log_e 2$",
      "$2^{x^r} x^{r-1} \\log_e 2$",
      "$2^{x^r} r x^r \\log_e 2$"
    ],
    "explanation": "Applying chain rule with exponential derivative $\\frac{d}{du}(2^u) = 2^u \\ln 2$:\n$$\\frac{dy}{dx} = 2^{x^r} \\ln 2 \\cdot \\frac{d}{dx}(x^r) = 2^{x^r} \\ln 2 \\cdot (r x^{r-1}) = 2^{x^r} r x^{r-1} \\log_e 2$$",
    "chapter": "Continuity and Differentiability",
    "chapter_number": 15,
    "correct_answer": 1,
    "needs_image": False
  },
  {
    "id": "math_ch15_q100",
    "subject": "Mathematics",
    "year": 2024,
    "question": "Let a function satisfy the functional equation $f(x + y) = f(x) f(y)$ for all $x, y \\in \\mathbb{R}$, where $f(0) \\ne 0$. If $f'(0) = 2$ and $f(5) = 3$, then $f'(5)$ is:",
    "options": [
      "$6$",
      "$0$",
      "$5$",
      "$-6$"
    ],
    "explanation": "From the definition of derivative:\n$$f'(x) = \\lim_{h \\to 0} \\frac{f(x + h) - f(x)}{h} = \\lim_{h \\to 0} \\frac{f(x)f(h) - f(x)}{h} = f(x) \\lim_{h \\to 0} \\frac{f(h) - 1}{h}$$\nSince $f(0) = f(0+0) = f(0)^2 \\implies f(0) = 1$ (as $f(0) \\ne 0$).\nSo $\\lim_{h \\to 0} \\frac{f(h) - 1}{h} = f'(0) = 2$.\nTherefore:\n$$f'(x) = 2 f(x)$$\nAt $x = 5$:\n$$f'(5) = 2 f(5) = 2(3) = 6$$",
    "chapter": "Continuity and Differentiability",
    "chapter_number": 15,
    "correct_answer": 0,
    "needs_image": False
  },
  {
    "id": "math_ch15_q101",
    "subject": "Mathematics",
    "year": 2024,
    "question": "If $A = \\int f(x) dx$ and $B = f'(x)$, then $\\frac{dB}{dx}$ is:",
    "options": [
      "$f''(x)$",
      "$-3B$",
      "$3B + 1$",
      "$1 - 3A$"
    ],
    "explanation": "Given $B = f'(x)$. Differentiating $B$ with respect to $x$:\n$$\\frac{dB}{dx} = \\frac{d}{dx}[f'(x)] = f''(x)$$",
    "chapter": "Continuity and Differentiability",
    "chapter_number": 15,
    "correct_answer": 0,
    "needs_image": False
  }
]

out_path = 'src/data/pyq_maths_ch15.json'
with open(out_path, 'w', encoding='utf-8') as f:
    json.dump(questions, f, ensure_ascii=False, indent=2)

print(f'Successfully wrote {len(questions)} questions to {out_path}')
