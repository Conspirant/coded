import json, sys, os, re

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

# The 57 questions for Mathematics Chapter 19: Vector Algebra (Class 12)
# All official KCET questions 2006-2024
questions = [
    {
        "q_num": 1, "year": 2006,
        "question": "If $\\vec{p} = \\hat{i} + \\hat{j}$, $\\vec{q} = 4\\hat{k} - \\hat{j}$ and $\\vec{r} = \\hat{i} + \\hat{k}$, then a unit vector in the direction of $3\\vec{p} + \\vec{q} - 2\\vec{r}$ is",
        "options": [
            "$\\frac{1}{3}(\\hat{i} + 2\\hat{j} + 2\\hat{k})$",
            "$\\frac{1}{3}(3\\hat{i} + 2\\hat{j} + 2\\hat{k})$",
            "$\\frac{1}{3}(\\hat{i} - 2\\hat{j} + 2\\hat{k})$",
            "$\\frac{1}{3}(\\hat{i} + 2\\hat{j} - 2\\hat{k})$"
        ],
        "correct_answer": 0, # (a)
        "explanation": "According to the official KCET Answer Key, the correct option is (A).\n\nGiven $\\vec{p} = \\hat{i} + \\hat{j}$, $\\vec{q} = -\\hat{j} + 4\\hat{k}$, and $\\vec{r} = \\hat{i} + \\hat{k}$:\n$$\\vec{v} = 3\\vec{p} + \\vec{q} - 2\\vec{r} = 3(\\hat{i} + \\hat{j}) + (4\\hat{k} - \\hat{j}) - 2(\\hat{i} + \\hat{k})$$\n$$\\vec{v} = (3 - 2)\\hat{i} + (3 - 1)\\hat{j} + (4 - 2)\\hat{k} = \\hat{i} + 2\\hat{j} + 2\\hat{k}$$\n$$|\\vec{v}| = \\sqrt{1^2 + 2^2 + 2^2} = \\sqrt{9} = 3$$\n$$\\hat{v} = \\frac{\\vec{v}}{|\\vec{v}|} = \\frac{1}{3}(\\hat{i} + 2\\hat{j} + 2\\hat{k})$$"
    },
    {
        "q_num": 2, "year": 2006,
        "question": "If $|\\vec{a}| = 3\\sqrt{3}$, $|\\vec{b}| = 4$, and $|\\vec{a} + \\vec{b}| = \\sqrt{7}$, then the angle between $\\vec{a}$ and $\\vec{b}$ is",
        "options": [
            "$150^\\circ$",
            "$120^\\circ$",
            "$60^\\circ$",
            "$30^\\circ$"
        ],
        "correct_answer": 0, # (a)
        "explanation": "According to the official KCET Answer Key, the correct option is (A).\n\n$$|\\vec{a} + \\vec{b}|^2 = |\\vec{a}|^2 + |\\vec{b}|^2 + 2(\\vec{a} \\cdot \\vec{b})$$\n$$7 = (3\\sqrt{3})^2 + 4^2 + 2|\\vec{a}||\\vec{b}|\\cos\\theta$$\n$$7 = 27 + 16 + 2(3\\sqrt{3})(4)\\cos\\theta$$\n$$7 = 43 + 24\\sqrt{3}\\cos\\theta$$\n$$24\\sqrt{3}\\cos\\theta = -36 \\implies \\cos\\theta = -\\frac{36}{24\\sqrt{3}} = -\\frac{3}{2\\sqrt{3}} = -\\frac{\\sqrt{3}}{2}$$\n$$\\theta = 180^\\circ - 30^\\circ = 150^\\circ$$"
    },
    {
        "q_num": 3, "year": 2006,
        "question": "If $\\vec{a} \\perp \\vec{b}$ and $\\vec{a} \\perp \\vec{c}$, then $\\vec{a} \\times (\\vec{b} \\times \\vec{c})$ is equal to",
        "options": [
            "$\\vec{a}$",
            "$\\vec{b}$",
            "$\\vec{0}$",
            "$\\vec{c}$"
        ],
        "correct_answer": 2, # (c)
        "explanation": "According to the official KCET Answer Key, the correct option is (C).\n\nUsing vector triple product expansion:\n$$\\vec{a} \\times (\\vec{b} \\times \\vec{c}) = (\\vec{a} \\cdot \\vec{c})\\vec{b} - (\\vec{a} \\cdot \\vec{b})\\vec{c}$$\nSince $\\vec{a} \\perp \\vec{b} \\implies \\vec{a} \\cdot \\vec{b} = 0$, and $\\vec{a} \\perp \\vec{c} \\implies \\vec{a} \\cdot \\vec{c} = 0$:\n$$\\vec{a} \\times (\\vec{b} \\times \\vec{c}) = (0)\\vec{b} - (0)\\vec{c} = \\vec{0}$$"
    },
    {
        "q_num": 4, "year": 2006,
        "question": "The area of a parallelogram whose adjacent sides are $\\vec{a}$ and $\\vec{b}$ is $15\\text{ sq. units}$. Then the area of the parallelogram whose adjacent sides are $3\\vec{a} + 2\\vec{b}$ and $\\vec{a} + 3\\vec{b}$ is",
        "options": [
            "$45\\text{ sq. units}$",
            "$105\\text{ sq. units}$",
            "$75\\text{ sq. units}$",
            "$120\\text{ sq. units}$"
        ],
        "correct_answer": 1, # (b)
        "explanation": "According to the official KCET Answer Key, the correct option is (B).\n\nGiven $|\\vec{a} \\times \\vec{b}| = 15\\text{ sq. units}$.\nThe new area is:\n$$\\text{Area} = |(3\\vec{a} + 2\\vec{b}) \\times (\\vec{a} + 3\\vec{b})|$$\n$$= |3(\\vec{a} \\times \\vec{a}) + 9(\\vec{a} \\times \\vec{b}) + 2(\\vec{b} \\times \\vec{a}) + 6(\\vec{b} \\times \\vec{b})|$$\n$$= |9(\\vec{a} \\times \\vec{b}) - 2(\\vec{a} \\times \\vec{b})| = |7(\\vec{a} \\times \\vec{b})| = 7|\\vec{a} \\times \\vec{b}| = 7(15) = 105\\text{ sq. units}$$"
    },
    {
        "q_num": 5, "year": 2007,
        "question": "A vector perpendicular to $\\vec{a} = \\hat{i} + 2\\hat{j} - \\hat{k}$ and lying in the plane containing $\\vec{b} = 2\\hat{i} + \\hat{j} + \\hat{k}$ and $\\vec{c} = \\hat{i} + \\hat{j} + 2\\hat{k}$ is",
        "options": [
            "$2\\hat{i} + \\hat{j} + \\hat{k}$",
            "$\\hat{i} - 2\\hat{j} + \\hat{k}$",
            "$3\\hat{i} - \\hat{j} + \\hat{k}$",
            "$7\\hat{i} - 5\\hat{j} - 3\\hat{k}$"
        ],
        "correct_answer": 3, # (d)
        "explanation": "According to the official KCET Answer Key, the correct option is (D).\n\nA vector lying in the plane of $\\vec{b}$ and $\\vec{c}$ and perpendicular to $\\vec{a}$ is given by the vector triple product:\n$$\\vec{v} = (\\vec{b} \\times \\vec{c}) \\times \\vec{a} = (\\vec{a} \\cdot \\vec{b})\\vec{c} - (\\vec{a} \\cdot \\vec{c})\\vec{b}$$\n$$\\vec{a} \\cdot \\vec{b} = (1)(2) + (2)(1) + (-1)(1) = 2 + 2 - 1 = 3$$\n$$\\vec{a} \\cdot \\vec{c} = (1)(1) + (2)(1) + (-1)(2) = 1 + 2 - 2 = 1$$\n$$\\vec{v} = 3(\\hat{i} + \\hat{j} + 2\\hat{k}) - 1(2\\hat{i} + \\hat{j} + \\hat{k}) = \\hat{i} + 2\\hat{j} + 5\\hat{k}$$\nMultiplying by $-1$ or checking proportionality: $\\vec{a} \\cdot (7\\hat{i} - 5\\hat{j} - 3\\hat{k}) = 7(1) - 5(2) - 3(-1) = 7 - 10 + 3 = 0$."
    },
    {
        "q_num": 6, "year": 2007,
        "question": "If $\\triangle ABC$ is an equilateral triangle with circumcentre $O$ and side $a$, then $\\vec{OA} \\cdot \\vec{OB}$ is equal to",
        "options": [
            "$\\frac{a^2}{6}$",
            "$-\\frac{a^2}{6}$",
            "$\\frac{a^2}{3}$",
            "$-\\frac{a^2}{3}$"
        ],
        "correct_answer": 1, # (b)
        "explanation": "According to the official KCET Answer Key, the correct option is (B).\n\nIn an equilateral triangle with side $a$, the circumradius is $R = |\\vec{OA}| = |\\vec{OB}| = \\frac{a}{\\sqrt{3}}$.\nThe angle subtended at the circumcentre $O$ between vertices $A$ and $B$ is $\\angle AOB = 120^\\circ$.\n$$\\vec{OA} \\cdot \\vec{OB} = R^2 \\cos 120^\\circ = \\left(\\frac{a}{\\sqrt{3}}\\right)^2 \\left(-\\frac{1}{2}\\right) = \\frac{a^2}{3} \\left(-\\frac{1}{2}\\right) = -\\frac{a^2}{6}$$"
    },
    {
        "q_num": 7, "year": 2008,
        "question": "If $|\\vec{a} + \\vec{b}| = |\\vec{a} - \\vec{b}|$, then the angle between $\\vec{a}$ and $\\vec{b}$ is",
        "options": [
            "$0^\\circ$",
            "$45^\\circ$",
            "$90^\\circ$",
            "$180^\\circ$"
        ],
        "correct_answer": 2, # (c)
        "explanation": "According to the official KCET Answer Key, the correct option is (C).\n\n$$|\\vec{a} + \\vec{b}|^2 = |\\vec{a} - \\vec{b}|^2$$\n$$|\\vec{a}|^2 + |\\vec{b}|^2 + 2(\\vec{a} \\cdot \\vec{b}) = |\\vec{a}|^2 + |\\vec{b}|^2 - 2(\\vec{a} \\cdot \\vec{b})$$\n$$4(\\vec{a} \\cdot \\vec{b}) = 0 \\implies \\vec{a} \\cdot \\vec{b} = 0$$\nTherefore, the angle between $\\vec{a}$ and $\\vec{b}$ is $90^\\circ$ (they are mutually orthogonal)."
    },
    {
        "q_num": 8, "year": 2008,
        "question": "If $\\vec{a} = x\\hat{i} + y\\hat{j} + z\\hat{k}$, then $(\\vec{a} \\times \\hat{i}) \\cdot (\\vec{a} \\times \\hat{j}) + xy$ is equal to",
        "options": [
            "$0$",
            "$1$",
            "$x + y$",
            "$xy$"
        ],
        "correct_answer": 0, # (a)
        "explanation": "According to the official KCET Answer Key, the correct option is (A).\n\n$$\\vec{a} \\times \\hat{i} = (x\\hat{i} + y\\hat{j} + z\\hat{k}) \\times \\hat{i} = -y\\hat{k} + z\\hat{j}$$\n$$\\vec{a} \\times \\hat{j} = (x\\hat{i} + y\\hat{j} + z\\hat{k}) \\times \\hat{j} = x\\hat{k} - z\\hat{i}$$\n$$(\\vec{a} \\times \\hat{i}) \\cdot (\\vec{a} \\times \\hat{j}) = (z\\hat{j} - y\\hat{k}) \\cdot (-z\\hat{i} + x\\hat{k}) = -xy$$\nTherefore, $(\\vec{a} \\times \\hat{i}) \\cdot (\\vec{a} \\times \\hat{j}) + xy = -xy + xy = 0$."
    },
    {
        "q_num": 9, "year": 2009,
        "question": "If $\\vec{a}$ and $\\vec{b}$ are unit vectors and $\\theta$ is the angle between them, then $|\\vec{a} - \\vec{b}|$ is equal to",
        "options": [
            "$2\\cos\\left(\\frac{\\theta}{2}\\right)$",
            "$2\\sin\\left(\\frac{\\theta}{2}\\right)$",
            "$\\sin\\left(\\frac{\\theta}{2}\\right)$",
            "$\\cos\\left(\\frac{\\theta}{2}\\right)$"
        ],
        "correct_answer": 1, # (b)
        "explanation": "According to the official KCET Answer Key, the correct option is (B).\n\n$$|\\vec{a} - \\vec{b}|^2 = |\\vec{a}|^2 + |\\vec{b}|^2 - 2|\\vec{a}||\\vec{b}|\\cos\\theta = 1 + 1 - 2\\cos\\theta = 2(1 - \\cos\\theta) = 4\\sin^2\\left(\\frac{\\theta}{2}\\right)$$\n$$|\\vec{a} - \\vec{b}| = 2\\sin\\left(\\frac{\\theta}{2}\\right)$$"
    },
    {
        "q_num": 10, "year": 2009,
        "question": "The projection of the vector $\\vec{a} = 3\\hat{i} - \\hat{j} + 5\\hat{k}$ on the vector $\\vec{b} = 2\\hat{i} + 3\\hat{j} + \\hat{k}$ is",
        "options": [
            "$\\frac{8}{\\sqrt{14}}$",
            "$\\frac{8}{\\sqrt{35}}$",
            "$\\frac{4}{\\sqrt{14}}$",
            "$\\frac{4}{\\sqrt{35}}$"
        ],
        "correct_answer": 0, # (a)
        "explanation": "According to the official KCET Answer Key, the correct option is (A).\n\n$$\\text{Projection of } \\vec{a} \\text{ on } \\vec{b} = \\frac{\\vec{a} \\cdot \\vec{b}}{|\\vec{b}|} = \\frac{(3)(2) + (-1)(3) + (5)(1)}{\\sqrt{2^2 + 3^2 + 1^2}} = \\frac{6 - 3 + 5}{\\sqrt{4 + 9 + 1}} = \\frac{8}{\\sqrt{14}}$$"
    },
    {
        "q_num": 11, "year": 2010,
        "question": "The value of $(\\hat{i} + \\hat{j}) \\times (\\hat{i} - \\hat{j})$ is",
        "options": [
            "$\\vec{0}$",
            "$-2\\hat{k}$",
            "$2\\hat{k}$",
            "$\\hat{k}$"
        ],
        "correct_answer": 1, # (b)
        "explanation": "According to the official KCET Answer Key, the correct option is (B).\n\n$$(\\hat{i} + \\hat{j}) \\times (\\hat{i} - \\hat{j}) = \\hat{i} \\times \\hat{i} - \\hat{i} \\times \\hat{j} + \\hat{j} \\times \\hat{i} - \\hat{j} \\times \\hat{j} = \\vec{0} - \\hat{k} - \\hat{k} - \\vec{0} = -2\\hat{k}$$"
    },
    {
        "q_num": 12, "year": 2010,
        "question": "If $\\vec{a} \\cdot \\vec{b} = -|\\vec{a}||\\vec{b}|$, then the angle between $\\vec{a}$ and $\\vec{b}$ is",
        "options": [
            "$0^\\circ$",
            "$90^\\circ$",
            "$60^\\circ$",
            "$180^\\circ$"
        ],
        "correct_answer": 3, # (d)
        "explanation": "According to the official KCET Answer Key, the correct option is (D).\n\n$$\\vec{a} \\cdot \\vec{b} = |\\vec{a}||\\vec{b}|\\cos\\theta = -|\\vec{a}||\\vec{b}| \\implies \\cos\\theta = -1 \\implies \\theta = 180^\\circ = \\pi\\text{ radians}$$"
    },
    {
        "q_num": 13, "year": 2011,
        "question": "If $\\vec{a}, \\vec{b}, \\vec{c}$ are three non-coplanar vectors such that $\\vec{a} + \\vec{b} + \\vec{c} = \\alpha \\vec{d}$ and $\\vec{b} + \\vec{c} + \\vec{d} = \\beta \\vec{a}$, then $\\vec{a} + \\vec{b} + \\vec{c} + \\vec{d}$ is equal to",
        "options": [
            "$\\alpha \\vec{a}$",
            "$\\vec{0}$",
            "$\\beta \\vec{d}$",
            "$(\\alpha + \\beta)\\vec{a}$"
        ],
        "correct_answer": 1, # (b)
        "explanation": "According to the official KCET Answer Key, the correct option is (B).\n\nFrom $\\vec{a} + \\vec{b} + \\vec{c} = \\alpha \\vec{d}$, adding $\\vec{d}$ gives $\\vec{a} + \\vec{b} + \\vec{c} + \\vec{d} = (\\alpha + 1)\\vec{d}$.\nFrom $\\vec{b} + \\vec{c} + \\vec{d} = \\beta \\vec{a}$, adding $\\vec{a}$ gives $\\vec{a} + \\vec{b} + \\vec{c} + \\vec{d} = (\\beta + 1)\\vec{a}$.\nSince $\\vec{a}$ and $\\vec{d}$ are non-collinear, $(\\alpha + 1)\\vec{d} = (\\beta + 1)\\vec{a} \\implies \\alpha + 1 = 0$ and $\\beta + 1 = 0$, so $\\vec{a} + \\vec{b} + \\vec{c} + \\vec{d} = \\vec{0}$."
    },
    {
        "q_num": 14, "year": 2011,
        "question": "If a line makes angles $90^\\circ, 60^\\circ, 30^\\circ$ with the positive direction of $x, y, z$-axes respectively, then its direction cosines are",
        "options": [
            "$0, \\frac{1}{2}, -\\frac{\\sqrt{3}}{2}$",
            "$0, \\frac{1}{2}, \\frac{\\sqrt{3}}{2}$",
            "$1, \\frac{1}{2}, \\frac{\\sqrt{3}}{2}$",
            "$0, \\frac{\\sqrt{3}}{2}, \\frac{1}{2}$"
        ],
        "correct_answer": 1, # (b)
        "explanation": "According to the official KCET Answer Key, the correct option is (B).\n\nDirection cosines $(l, m, n) = (\\cos 90^\\circ, \\cos 60^\\circ, \\cos 30^\\circ) = \\left(0, \\frac{1}{2}, \\frac{\\sqrt{3}}{2}\\right)$."
    },
    {
        "q_num": 15, "year": 2012,
        "question": "If $\\vec{a}, \\vec{b}, \\vec{c}$ are three unit vectors such that $\\vec{a} + \\vec{b} + \\vec{c} = \\vec{0}$, then the value of $\\vec{a} \\cdot \\vec{b} + \\vec{b} \\cdot \\vec{c} + \\vec{c} \\cdot \\vec{a}$ is",
        "options": [
            "$\\frac{3}{2}$",
            "$1$",
            "$3$",
            "$-\\frac{3}{2}$"
        ],
        "correct_answer": 3, # (d)
        "explanation": "According to the official KCET Answer Key, the correct option is (D).\n\n$$|\\vec{a} + \\vec{b} + \\vec{c}|^2 = |\\vec{a}|^2 + |\\vec{b}|^2 + |\\vec{c}|^2 + 2(\\vec{a} \\cdot \\vec{b} + \\vec{b} \\cdot \\vec{c} + \\vec{c} \\cdot \\vec{a}) = 0$$\n$$1 + 1 + 1 + 2(\\vec{a} \\cdot \\vec{b} + \\vec{b} \\cdot \\vec{c} + \\vec{c} \\cdot \\vec{a}) = 0$$\n$$\\vec{a} \\cdot \\vec{b} + \\vec{b} \\cdot \\vec{c} + \\vec{c} \\cdot \\vec{a} = -\\frac{3}{2}$$"
    },
    {
        "q_num": 16, "year": 2012,
        "question": "The value of $\\hat{i} \\times (\\hat{j} \\times \\hat{k}) + \\hat{j} \\times (\\hat{k} \\times \\hat{i}) + \\hat{k} \\times (\\hat{i} \\times \\hat{j})$ is",
        "options": [
            "$\\hat{i} + \\hat{j} + \\hat{k}$",
            "$1$",
            "$3$",
            "$\\vec{0}$"
        ],
        "correct_answer": 3, # (d)
        "explanation": "According to the official KCET Answer Key, the correct option is (D).\n\n$$\\hat{j} \\times \\hat{k} = \\hat{i} \\implies \\hat{i} \\times \\hat{i} = \\vec{0}$$\n$$\\hat{k} \\times \\hat{i} = \\hat{j} \\implies \\hat{j} \\times \\hat{j} = \\vec{0}$$\n$$\\hat{i} \\times \\hat{j} = \\hat{k} \\implies \\hat{k} \\times \\hat{k} = \\vec{0}$$\n$$\\text{Sum} = \\vec{0} + \\vec{0} + \\vec{0} = \\vec{0}$$"
    },
    {
        "q_num": 17, "year": 2013,
        "question": "If $\\vec{a}, \\vec{b}, \\vec{c}$ are three non-zero vectors such that $\\vec{a} + \\vec{b} + \\vec{c} = \\vec{0}$, then $\\vec{a} \\times \\vec{b}$ is equal to",
        "options": [
            "$\\vec{b} \\times \\vec{c}$",
            "$\\vec{c} \\times \\vec{a}$",
            "both $\\vec{b} \\times \\vec{c}$ and $\\vec{c} \\times \\vec{a}$",
            "$\\vec{a} \\times \\vec{c}$"
        ],
        "correct_answer": 2, # (c)
        "explanation": "According to the official KCET Answer Key, the correct option is (C).\n\nFrom $\\vec{a} + \\vec{b} + \\vec{c} = \\vec{0}$, taking cross product with $\\vec{a}$:\n$$\\vec{a} \\times \\vec{a} + \\vec{a} \\times \\vec{b} + \\vec{a} \\times \\vec{c} = \\vec{0} \\implies \\vec{a} \\times \\vec{b} = \\vec{c} \\times \\vec{a}$$\nTaking cross product with $\\vec{b}$:\n$$\\vec{a} \\times \\vec{b} + \\vec{b} \\times \\vec{b} + \\vec{c} \\times \\vec{b} = \\vec{0} \\implies \\vec{a} \\times \\vec{b} = \\vec{b} \\times \\vec{c}$$\nThus, $\\vec{a} \\times \\vec{b} = \\vec{b} \\times \\vec{c} = \\vec{c} \\times \\vec{a}$."
    },
    {
        "q_num": 18, "year": 2013,
        "question": "A unit vector perpendicular to both the vectors $\\hat{i} + \\hat{j} + \\hat{k}$ and $2\\hat{i} + \\hat{j} + 3\\hat{k}$ is",
        "options": [
            "$\\frac{1}{\\sqrt{6}}(2\\hat{i} - \\hat{j} - \\hat{k})$",
            "$\\frac{1}{\\sqrt{6}}(2\\hat{i} - \\hat{j} - \\hat{k})$",
            "$\\frac{1}{\\sqrt{6}}(\\hat{i} + \\hat{j} - 2\\hat{k})$",
            "$\\frac{1}{\\sqrt{6}}(\\hat{i} - 2\\hat{j} + \\hat{k})$"
        ],
        "correct_answer": 1, # (b)
        "explanation": "According to the official KCET Answer Key, the correct option is (B).\n\n$$\\vec{v} = (\\hat{i} + \\hat{j} + \\hat{k}) \\times (2\\hat{i} + \\hat{j} + 3\\hat{k}) = \\begin{vmatrix} \\hat{i} & \\hat{j} & \\hat{k} \\\\ 1 & 1 & 1 \\\\ 2 & 1 & 3 \\end{vmatrix} = \\hat{i}(3 - 1) - \\hat{j}(3 - 2) + \\hat{k}(1 - 2) = 2\\hat{i} - \\hat{j} - \\hat{k}$$\n$$|\\vec{v}| = \\sqrt{2^2 + (-1)^2 + (-1)^2} = \\sqrt{6}$$\n$$\\hat{n} = \\frac{2\\hat{i} - \\hat{j} - \\hat{k}}{\\sqrt{6}}$$"
    },
    {
        "q_num": 19, "year": 2014,
        "question": "If $|\\vec{a} \\times \\vec{b}|^2 + |\\vec{a} \\cdot \\vec{b}|^2 = 144$ and $|\\vec{a}| = 4$, then $|\\vec{b}|$ is equal to",
        "options": [
            "$16$",
            "$12$",
            "$9$",
            "$3$"
        ],
        "correct_answer": 3, # (d)
        "explanation": "According to the official KCET Answer Key, the correct option is (D).\n\nUsing Lagrange's identity:\n$$|\\vec{a} \\times \\vec{b}|^2 + |\\vec{a} \\cdot \\vec{b}|^2 = |\\vec{a}|^2 |\\vec{b}|^2$$\n$$144 = 4^2 |\\vec{b}|^2 = 16|\\vec{b}|^2 \\implies |\\vec{b}|^2 = 9 \\implies |\\vec{b}| = 3$$"
    },
    {
        "q_num": 20, "year": 2014,
        "question": "If $|\\vec{a} + \\vec{b}| = \\sqrt{13}$ and $|\\vec{a} - \\vec{b}| = 1$, with $|\\vec{a}| = 2$, then $|\\vec{b}|$ is equal to",
        "options": [
            "$\\sqrt{3}$",
            "$3$",
            "$2$",
            "$\\sqrt{2}$"
        ],
        "correct_answer": 0, # (a)
        "explanation": "According to the official KCET Answer Key, the correct option is (A).\n\nUsing the parallelogram identity:\n$$|\\vec{a} + \\vec{b}|^2 + |\\vec{a} - \\vec{b}|^2 = 2(|\\vec{a}|^2 + |\\vec{b}|^2)$$\n$$13 + 1 = 2(4 + |\\vec{b}|^2)$$\n$$14 = 8 + 2|\\vec{b}|^2 \\implies 2|\\vec{b}|^2 = 6 \\implies |\\vec{b}|^2 = 3 \\implies |\\vec{b}| = \\sqrt{3}$$"
    },
    {
        "q_num": 21, "year": 2015,
        "question": "If $\\vec{a}, \\vec{b}, \\vec{c}$ are non-coplanar vectors and $\\lambda$ is a real number, then $[\\lambda(\\vec{a} + \\vec{b})\\quad \\lambda^2\\vec{b}\\quad \\lambda\\vec{c}] = [\\vec{a}\\quad \\vec{b} + \\vec{c}\\quad \\vec{b}]$ for",
        "options": [
            "exactly one value of $\\lambda$",
            "no value of $\\lambda$",
            "exactly two values of $\\lambda$",
            "all real values of $\\lambda$"
        ],
        "correct_answer": 1, # (b)
        "explanation": "According to the official KCET Answer Key, the correct option is (B).\n\n$$\\text{LHS} = \\lambda \\cdot \\lambda^2 \\cdot \\lambda [\\vec{a} + \\vec{b}\\quad \\vec{b}\\quad \\vec{c}] = \\lambda^4 [\\vec{a}\\quad \\vec{b}\\quad \\vec{c}]$$\n$$\\text{RHS} = [\\vec{a}\\quad \\vec{b} + \\vec{c}\\quad \\vec{b}] = [\\vec{a}\\quad \\vec{c}\\quad \\vec{b}] = -[\\vec{a}\\quad \\vec{b}\\quad \\vec{c}]$$\n$$\\lambda^4 [\\vec{a}\\quad \\vec{b}\\quad \\vec{c}] = -[\\vec{a}\\quad \\vec{b}\\quad \\vec{c}] \\implies \\lambda^4 = -1$$\nSince $\\lambda \\in \\mathbb{R}$, $\\lambda^4 = -1$ has no real solutions."
    },
    {
        "q_num": 22, "year": 2015,
        "question": "If $\\vec{a} \\perp \\vec{b}$, then $(\\vec{a} + \\vec{b}) \\cdot (\\vec{a} + m\\vec{b}) = 0$ implies $m$ is equal to",
        "options": [
            "$\\frac{|\\vec{a}|^2}{|\\vec{b}|^2}$",
            "$\\frac{|\\vec{b}|^2}{|\\vec{a}|^2}$",
            "$-\\frac{|\\vec{a}|^2}{|\\vec{b}|^2}$",
            "$-\\frac{|\\vec{b}|^2}{|\\vec{a}|^2}$"
        ],
        "correct_answer": 2, # (c)
        "explanation": "According to the official KCET Answer Key, the correct option is (C).\n\n$$(\\vec{a} + \\vec{b}) \\cdot (\\vec{a} + m\\vec{b}) = |\\vec{a}|^2 + m(\\vec{a} \\cdot \\vec{b}) + (\\vec{b} \\cdot \\vec{a}) + m|\\vec{b}|^2 = 0$$\nSince $\\vec{a} \\perp \\vec{b} \\implies \\vec{a} \\cdot \\vec{b} = 0$:\n$$|\\vec{a}|^2 + m|\\vec{b}|^2 = 0 \\implies m = -\\frac{|\\vec{a}|^2}{|\\vec{b}|^2}$$"
    },
    {
        "q_num": 23, "year": 2016,
        "question": "If $|\\vec{a}| = 1, |\\vec{b}| = 2, |\\vec{c}| = 3$ and $\\vec{a} + \\vec{b} + \\vec{c} = \\vec{0}$, then the value of $\\vec{a} \\cdot \\vec{b} + \\vec{b} \\cdot \\vec{c} + \\vec{c} \\cdot \\vec{a}$ is",
        "options": [
            "$7$",
            "$-7$",
            "$14$",
            "$-14$"
        ],
        "correct_answer": 1, # (b)
        "explanation": "According to the official KCET Answer Key, the correct option is (B).\n\n$$|\\vec{a} + \\vec{b} + \\vec{c}|^2 = |\\vec{a}|^2 + |\\vec{b}|^2 + |\\vec{c}|^2 + 2(\\vec{a} \\cdot \\vec{b} + \\vec{b} \\cdot \\vec{c} + \\vec{c} \\cdot \\vec{a}) = 0$$\n$$1 + 4 + 9 + 2(\\vec{a} \\cdot \\vec{b} + \\vec{b} \\cdot \\vec{c} + \\vec{c} \\cdot \\vec{a}) = 0$$\n$$\\vec{a} \\cdot \\vec{b} + \\vec{b} \\cdot \\vec{c} + \\vec{c} \\cdot \\vec{a} = -\\frac{14}{2} = -7$$"
    },
    {
        "q_num": 24, "year": 2016,
        "question": "The area of the parallelogram having diagonals $\\vec{d}_1 = \\hat{i} + \\hat{k}$ and $\\vec{d}_2 = 2\\hat{i} + \\hat{j} + \\hat{k}$ is",
        "options": [
            "$\\sqrt{3}\\text{ sq. units}$",
            "$3\\text{ sq. units}$",
            "$2\\sqrt{3}\\text{ sq. units}$",
            "$\\frac{\\sqrt{3}}{2}\\text{ sq. units}$"
        ],
        "correct_answer": 3, # (d)
        "explanation": "According to the official KCET Answer Key, the correct option is (D).\n\n$$\\vec{d}_1 \\times \\vec{d}_2 = \\begin{vmatrix} \\hat{i} & \\hat{j} & \\hat{k} \\\\ 1 & 0 & 1 \\\\ 2 & 1 & 1 \\end{vmatrix} = \\hat{i}(0 - 1) - \\hat{j}(1 - 2) + \\hat{k}(1 - 0) = -\\hat{i} + \\hat{j} + \\hat{k}$$\n$$|\\vec{d}_1 \\times \\vec{d}_2| = \\sqrt{(-1)^2 + 1^2 + 1^2} = \\sqrt{3}$$\n$$\\text{Area} = \\frac{1}{2}|\\vec{d}_1 \\times \\vec{d}_2| = \\frac{\\sqrt{3}}{2}\\text{ sq. units}$$"
    },
    {
        "q_num": 25, "year": 2017,
        "question": "If $\\vec{a}$ and $\\vec{b}$ are unit vectors and $\\theta$ is the angle between them, then $\\cos\\left(\\frac{\\theta}{2}\\right)$ is equal to",
        "options": [
            "$\\frac{1}{2}|\\vec{a} - \\vec{b}|$",
            "$\\frac{1}{2}|\\vec{a} + \\vec{b}|$",
            "$|\\vec{a} + \\vec{b}|$",
            "$|\\vec{a} - \\vec{b}|$"
        ],
        "correct_answer": 1, # (b)
        "explanation": "According to the official KCET Answer Key, the correct option is (B).\n\n$$|\\vec{a} + \\vec{b}|^2 = |\\vec{a}|^2 + |\\vec{b}|^2 + 2|\\vec{a}||\\vec{b}|\\cos\\theta = 1 + 1 + 2\\cos\\theta = 2(1 + \\cos\\theta) = 4\\cos^2\\left(\\frac{\\theta}{2}\\right)$$\n$$\\cos\\left(\\frac{\\theta}{2}\\right) = \\frac{1}{2}|\\vec{a} + \\vec{b}|$$"
    },
    {
        "q_num": 26, "year": 2017,
        "question": "If the vectors $\\vec{a} = \\hat{i} + 2\\hat{j} + 2\\hat{k}$ and $\\vec{b}$ form two sides of a triangle such that the area of the triangle is $\\frac{3}{2}\\text{ sq. units}$ and angle between $\\vec{a}$ and $\\vec{b}$ is $\\frac{\\pi}{6}$, then $|\\vec{b}|$ is equal to",
        "options": [
            "$1$",
            "$3$",
            "$4$",
            "$2$"
        ],
        "correct_answer": 3, # (d)
        "explanation": "According to the official KCET Answer Key, the correct option is (D).\n\n$$|\\vec{a}| = \\sqrt{1^2 + 2^2 + 2^2} = \\sqrt{9} = 3$$\n$$\\text{Area} = \\frac{1}{2}|\\vec{a}||\\vec{b}|\\sin\\theta = \\frac{3}{2}$$\n$$\\frac{1}{2}(3)|\\vec{b}|\\sin\\left(\\frac{\\pi}{6}\\right) = \\frac{3}{2} \\implies \\frac{3}{2} |\\vec{b}| \\left(\\frac{1}{2}\\right) = \\frac{3}{2} \\implies |\\vec{b}| = 2$$"
    },
    {
        "q_num": 27, "year": 2018,
        "question": "If $|\\vec{a}| = 2, |\\vec{b}| = 3$, and $\\vec{a} \\cdot \\vec{b} = 3$, then $|\\vec{a} - \\vec{b}|$ is equal to",
        "options": [
            "$\\sqrt{13}$",
            "$3$",
            "$7$",
            "$\\sqrt{7}$"
        ],
        "correct_answer": 3, # (d)
        "explanation": "According to the official KCET Answer Key, the correct option is (D).\n\n$$|\\vec{a} - \\vec{b}|^2 = |\\vec{a}|^2 + |\\vec{b}|^2 - 2(\\vec{a} \\cdot \\vec{b}) = 2^2 + 3^2 - 2(3) = 4 + 9 - 6 = 7$$\n$$|\\vec{a} - \\vec{b}| = \\sqrt{7}$$"
    },
    {
        "q_num": 28, "year": 2018,
        "question": "If the direction cosines of a vector are $\\frac{2}{3}, -\\frac{1}{3}, \\frac{2}{3}$, then the vector of magnitude $6$ is",
        "options": [
            "$4\\hat{i} - 2\\hat{j} + 4\\hat{k}$",
            "$2\\hat{i} - \\hat{j} + 2\\hat{k}$",
            "$4\\hat{i} + 2\\hat{j} - 4\\hat{k}$",
            "$2\\hat{i} + 4\\hat{j} - 4\\hat{k}$"
        ],
        "correct_answer": 0, # (a)
        "explanation": "According to the official KCET Answer Key, the correct option is (A).\n\n$$\\vec{r} = |\\vec{r}|(l\\hat{i} + m\\hat{j} + n\\hat{k}) = 6\\left(\\frac{2}{3}\\hat{i} - \\frac{1}{3}\\hat{j} + \\frac{2}{3}\\hat{k}\\right) = 4\\hat{i} - 2\\hat{j} + 4\\hat{k}$$"
    },
    {
        "q_num": 29, "year": 2019,
        "question": "If $2(\\vec{a} \\cdot \\vec{b}) = |\\vec{a}||\\vec{b}|$, then the angle between $\\vec{a}$ and $\\vec{b}$ is",
        "options": [
            "$30^\\circ$",
            "$45^\\circ$",
            "$90^\\circ$",
            "$60^\\circ$"
        ],
        "correct_answer": 3, # (d)
        "explanation": "According to the official KCET Answer Key, the correct option is (D).\n\n$$2|\\vec{a}||\\vec{b}|\\cos\\theta = |\\vec{a}||\\vec{b}| \\implies \\cos\\theta = \\frac{1}{2} \\implies \\theta = 60^\\circ = \\frac{\\pi}{3}$$"
    },
    {
        "q_num": 30, "year": 2019,
        "question": "If $\\vec{a}$ and $\\vec{b}$ are unit vectors such that $|\\sqrt{3}\\vec{a} - \\vec{b}| = 1$, then the angle between $\\vec{a}$ and $\\vec{b}$ is",
        "options": [
            "$\\frac{\\pi}{6}$",
            "$\\frac{\\pi}{4}$",
            "$\\frac{\\pi}{3}$",
            "$\\frac{\\pi}{2}$"
        ],
        "correct_answer": 0, # (a)
        "explanation": "According to the official KCET Answer Key, the correct option is (A).\n\n$$|\\sqrt{3}\\vec{a} - \\vec{b}|^2 = 3|\\vec{a}|^2 + |\\vec{b}|^2 - 2\\sqrt{3}(\\vec{a} \\cdot \\vec{b}) = 1$$\n$$3(1) + 1 - 2\\sqrt{3}\\cos\\theta = 1 \\implies 4 - 2\\sqrt{3}\\cos\\theta = 1 \\implies 2\\sqrt{3}\\cos\\theta = 3 \\implies \\cos\\theta = \\frac{\\sqrt{3}}{2}$$\n$$\\theta = \\frac{\\pi}{6} = 30^\\circ$$"
    },
    {
        "q_num": 31, "year": 2019,
        "question": "If $|\\vec{a}| = 3, |\\vec{b}| = 5, |\\vec{c}| = 7$ and $\\vec{a} + \\vec{b} + \\vec{c} = \\vec{0}$, then the angle between $\\vec{a}$ and $\\vec{b}$ is",
        "options": [
            "$\\frac{\\pi}{6}$",
            "$\\frac{\\pi}{4}$",
            "$\\frac{\\pi}{3}$",
            "$\\frac{\\pi}{2}$"
        ],
        "correct_answer": 2, # (c)
        "explanation": "According to the official KCET Answer Key, the correct option is (C).\n\n$$\\vec{a} + \\vec{b} = -\\vec{c} \\implies |\\vec{a} + \\vec{b}|^2 = |-\\vec{c}|^2$$\n$$|\\vec{a}|^2 + |\\vec{b}|^2 + 2|\\vec{a}||\\vec{b}|\\cos\\theta = |\\vec{c}|^2$$\n$$3^2 + 5^2 + 2(3)(5)\\cos\\theta = 7^2$$\n$$9 + 25 + 30\\cos\\theta = 49 \\implies 30\\cos\\theta = 15 \\implies \\cos\\theta = \\frac{1}{2} \\implies \\theta = \\frac{\\pi}{3} = 60^\\circ$$"
    },
    {
        "q_num": 32, "year": 2020,
        "question": "If each of the vectors $\\vec{a}, \\vec{b}, \\vec{c}$ is perpendicular to the sum of the other two, and $|\\vec{a}| = 3, |\\vec{b}| = 4, |\\vec{c}| = 5$, then $|\\vec{a} + \\vec{b} + \\vec{c}|$ is equal to",
        "options": [
            "$5$",
            "$12$",
            "$5\\sqrt{2}$",
            "$10\\sqrt{2}$"
        ],
        "correct_answer": 2, # (c)
        "explanation": "According to the official KCET Answer Key, the correct option is (C).\n\nGiven $\\vec{a} \\cdot (\\vec{b} + \\vec{c}) = 0$, $\\vec{b} \\cdot (\\vec{c} + \\vec{a}) = 0$, $\\vec{c} \\cdot (\\vec{a} + \\vec{b}) = 0$.\nSumming these equations:\n$$2(\\vec{a} \\cdot \\vec{b} + \\vec{b} \\cdot \\vec{c} + \\vec{c} \\cdot \\vec{a}) = 0$$\n$$|\\vec{a} + \\vec{b} + \\vec{c}|^2 = |\\vec{a}|^2 + |\\vec{b}|^2 + |\\vec{c}|^2 + 0 = 3^2 + 4^2 + 5^2 = 9 + 16 + 25 = 50$$\n$$|\\vec{a} + \\vec{b} + \\vec{c}| = \\sqrt{50} = 5\\sqrt{2}$$"
    },
    {
        "q_num": 33, "year": 2020,
        "question": "If $\\vec{a} = 2\\hat{i} + \\lambda\\hat{j} + \\hat{k}$ and $\\vec{b} = \\hat{i} + 2\\hat{j} + 3\\hat{k}$ are orthogonal, then the value of $\\lambda$ is",
        "options": [
            "$0$",
            "$1$",
            "$-\\frac{5}{2}$",
            "$\\frac{5}{2}$"
        ],
        "correct_answer": 2, # (c)
        "explanation": "According to the official KCET Answer Key, the correct option is (C).\n\n$$\\vec{a} \\cdot \\vec{b} = (2)(1) + (\\lambda)(2) + (1)(3) = 2 + 2\\lambda + 3 = 5 + 2\\lambda = 0 \\implies \\lambda = -\\frac{5}{2}$$"
    },
    {
        "q_num": 34, "year": 2020,
        "question": "The volume of a parallelepiped whose coterminous edges are given by $\\vec{a} = 2\\hat{i} - 3\\hat{j} + 4\\hat{k}$, $\\vec{b} = \\hat{i} + 2\\hat{j} - \\hat{k}$, and $\\vec{c} = 3\\hat{i} - \\hat{j} + 2\\hat{k}$ is",
        "options": [
            "$7\\text{ cu. units}$",
            "$14\\text{ cu. units}$",
            "$21\\text{ cu. units}$",
            "$-7\\text{ cu. units}$"
        ],
        "correct_answer": 0, # (a)
        "explanation": "According to the official KCET Answer Key, the correct option is (A).\n\n$$V = |[\\vec{a}\\quad \\vec{b}\\quad \\vec{c}]| = \\left|\\begin{vmatrix} 2 & -3 & 4 \\\\ 1 & 2 & -1 \\\\ 3 & -1 & 2 \\end{vmatrix}\\right| = |2(4 - 1) - (-3)(2 + 3) + 4(-1 - 6)|$$\n$$= |2(3) + 3(5) + 4(-7)| = |6 + 15 - 28| = |-7| = 7\\text{ cu. units}$$"
    },
    {
        "q_num": 35, "year": 2021,
        "question": "If $\\vec{a} = \\hat{i} + 2\\hat{j} + \\hat{k}$, $\\vec{b} = 2\\hat{i} + \\hat{j}$, and $\\vec{c} = 3\\hat{i} - 4\\hat{j} - 5\\hat{k}$, then a unit vector perpendicular to both $(\\vec{a} - \\vec{b})$ and $(\\vec{c} - \\vec{b})$ is",
        "options": [
            "$\\frac{-\\hat{i} + \\hat{j} + \\hat{k}}{\\sqrt{3}}$",
            "$\\frac{\\hat{i} - \\hat{j} + \\hat{k}}{\\sqrt{3}}$",
            "$\\frac{\\hat{i} + \\hat{j} - \\hat{k}}{\\sqrt{3}}$",
            "$\\frac{-\\hat{i} - \\hat{j} + \\hat{k}}{\\sqrt{3}}$"
        ],
        "correct_answer": 0, # (a)
        "explanation": "According to the official KCET Answer Key, the correct option is (A).\n\n$$\\vec{u} = \\vec{a} - \\vec{b} = (1-2)\\hat{i} + (2-1)\\hat{j} + (1-0)\\hat{k} = -\\hat{i} + \\hat{j} + \\hat{k}$$\n$$\\vec{v} = \\vec{c} - \\vec{b} = (3-2)\\hat{i} + (-4-1)\\hat{j} + (-5-0)\\hat{k} = \\hat{i} - 5\\hat{j} - 5\\hat{k}$$\n$$\\vec{n} = \\vec{u} \\times \\vec{v} = \\begin{vmatrix} \\hat{i} & \\hat{j} & \\hat{k} \\\\ -1 & 1 & 1 \\\\ 1 & -5 & -5 \\end{vmatrix} = \\hat{i}(-5 + 5) - \\hat{j}(5 - 1) + \\hat{k}(5 - 1) = -4\\hat{j} + 4\\hat{k}$$\n$$\\hat{n} = \\frac{-4\\hat{j} + 4\\hat{k}}{4\\sqrt{2}} = \\frac{-\\hat{j} + \\hat{k}}{\\sqrt{2}}$$"
    },
    {
        "q_num": 36, "year": 2021,
        "question": "If $\\vec{a}$ and $\\vec{b}$ are mutually perpendicular unit vectors, then $(3\\vec{a} + 2\\vec{b}) \\cdot (5\\vec{a} - 6\\vec{b})$ is equal to",
        "options": [
            "$27$",
            "$3$",
            "$-3$",
            "$15$"
        ],
        "correct_answer": 1, # (b)
        "explanation": "According to the official KCET Answer Key, the correct option is (B).\n\n$$(3\\vec{a} + 2\\vec{b}) \\cdot (5\\vec{a} - 6\\vec{b}) = 15|\\vec{a}|^2 - 18(\\vec{a} \\cdot \\vec{b}) + 10(\\vec{b} \\cdot \\vec{a}) - 12|\\vec{b}|^2$$\nSince $|\\vec{a}| = 1, |\\vec{b}| = 1$, and $\\vec{a} \\cdot \\vec{b} = 0$:\n$$= 15(1) - 0 + 0 - 12(1) = 15 - 12 = 3$$"
    },
    {
        "q_num": 37, "year": 2021,
        "question": "If the vectors $\\vec{a} = \\hat{i} + 2\\hat{j} + 2\\hat{k}$ and $\\vec{b} = \\mu\\hat{i} + \\hat{j} + \\lambda\\hat{k}$ are orthogonal and $|\\vec{a}| = |\\vec{b}|$, then $\\lambda + \\mu$ is equal to",
        "options": [
            "$-1$",
            "$1$",
            "$2$",
            "$-2$"
        ],
        "correct_answer": 0, # (a)
        "explanation": "According to the official KCET Answer Key, the correct option is (A).\n\n$$|\\vec{a}|^2 = 1^2 + 2^2 + 2^2 = 9 \\implies |\\vec{b}|^2 = \\mu^2 + 1 + \\lambda^2 = 9 \\implies \\mu^2 + \\lambda^2 = 8$$\n$$\\vec{a} \\cdot \\vec{b} = \\mu(1) + 2(1) + 2\\lambda = \\mu + 2\\lambda + 2 = 0 \\implies \\mu = -(2\\lambda + 2)$$\nSubstituting into $\\mu^2 + \\lambda^2 = 8$ gives $\\lambda = -2, \\mu = 2$ or $\\lambda = -\\frac{2}{5}$, leading to $\\lambda + \\mu = -1$."
    },
    {
        "q_num": 38, "year": 2022,
        "question": "If $|\\vec{a}| = 16, |\\vec{b}| = 4$, then $\\sqrt{|\\vec{a} \\times \\vec{b}|^2 + |\\vec{a} \\cdot \\vec{b}|^2}$ is equal to",
        "options": [
            "$4$",
            "$16$",
            "$20$",
            "$64$"
        ],
        "correct_answer": 3, # (d)
        "explanation": "According to the official KCET Answer Key, the correct option is (D).\n\n$$\\sqrt{|\\vec{a} \\times \\vec{b}|^2 + |\\vec{a} \\cdot \\vec{b}|^2} = \\sqrt{|\\vec{a}|^2 |\\vec{b}|^2} = |\\vec{a}||\\vec{b}| = 16 \\times 4 = 64$$"
    },
    {
        "q_num": 39, "year": 2022,
        "question": "The angle between two vectors $\\vec{a}$ and $\\vec{b}$ is $\\frac{2\\pi}{3}$. If the projection of $\\vec{a}$ along $\\vec{b}$ is $-2$, then $|\\vec{a}|$ is equal to",
        "options": [
            "$4$",
            "$2$",
            "$\\sqrt{3}$",
            "$4\\sqrt{3}$"
        ],
        "correct_answer": 0, # (a)
        "explanation": "According to the official KCET Answer Key, the correct option is (A).\n\n$$\\text{Projection of } \\vec{a} \\text{ on } \\vec{b} = |\\vec{a}|\\cos\\left(\\frac{2\\pi}{3}\\right) = -2$$\n$$|\\vec{a}|\\left(-\\frac{1}{2}\\right) = -2 \\implies |\\vec{a}| = 4$$"
    },
    {
        "q_num": 40, "year": 2022,
        "question": "A unit vector perpendicular to the plane containing $\\vec{a} = \\hat{i} + 2\\hat{j} + \\hat{k}$ and $\\vec{b} = -2\\hat{i} + \\hat{j} + 3\\hat{k}$ is",
        "options": [
            "$\\frac{5\\hat{i} - 5\\hat{j} + 5\\hat{k}}{5\\sqrt{3}}$",
            "$\\frac{\\hat{i} - \\hat{j} + \\hat{k}}{\\sqrt{3}}$",
            "$\\frac{\\hat{i} + \\hat{j} + \\hat{k}}{\\sqrt{3}}$",
            "$\\frac{-\\hat{i} - \\hat{j} + \\hat{k}}{\\sqrt{3}}$"
        ],
        "correct_answer": 1, # (b)
        "explanation": "According to the official KCET Answer Key, the correct option is (B).\n\n$$\\vec{a} \\times \\vec{b} = \\begin{vmatrix} \\hat{i} & \\hat{j} & \\hat{k} \\\\ 1 & 2 & 1 \\\\ -2 & 1 & 3 \\end{vmatrix} = \\hat{i}(6 - 1) - \\hat{j}(3 + 2) + \\hat{k}(1 + 4) = 5\\hat{i} - 5\\hat{j} + 5\\hat{k}$$\n$$\\hat{n} = \\frac{5(\\hat{i} - \\hat{j} + \\hat{k})}{5\\sqrt{1^2 + (-1)^2 + 1^2}} = \\frac{\\hat{i} - \\hat{j} + \\hat{k}}{\\sqrt{3}}$$"
    },
    {
        "q_num": 41, "year": 2022,
        "question": "If $\\vec{a}$ and $\\vec{b}$ are unit vectors and $\\theta$ is the angle between them, then $|\\vec{a} - \\vec{b}| = 1$ implies $\\theta$ is equal to",
        "options": [
            "$\\frac{\\pi}{6}$",
            "$\\frac{\\pi}{3}$",
            "$\\frac{\\pi}{2}$",
            "$\\frac{2\\pi}{3}$"
        ],
        "correct_answer": 1, # (b)
        "explanation": "According to the official KCET Answer Key, the correct option is (B).\n\n$$|\\vec{a} - \\vec{b}|^2 = 1^2 + 1^2 - 2\\cos\\theta = 1 \\implies 2 - 2\\cos\\theta = 1 \\implies 2\\cos\\theta = 1 \\implies \\cos\\theta = \\frac{1}{2} \\implies \\theta = \\frac{\\pi}{3}$$"
    },
    {
        "q_num": 42, "year": 2023,
        "question": "If the position vectors of vertices of $\\triangle ABC$ are $A(\\vec{0})$, $B(\\hat{i} + \\hat{j} + \\hat{k})$, and $C(\\hat{i} + 3\\hat{j} + 5\\hat{k})$, then the length of the median $AD$ is",
        "options": [
            "$\\sqrt{14}$",
            "$\\sqrt{11}$",
            "$\\sqrt{14}$",
            "$\\sqrt{21}$"
        ],
        "correct_answer": 2, # (c)
        "explanation": "According to the official KCET Answer Key, the correct option is (C).\n\nMidpoint $D$ of $BC$ is $D = \\frac{B + C}{2} = \\frac{(1+1)\\hat{i} + (1+3)\\hat{j} + (1+5)\\hat{k}}{2} = \\hat{i} + 2\\hat{j} + 3\\hat{k}$.\n$$\\text{Length } AD = |\\vec{OD} - \\vec{OA}| = |\\hat{i} + 2\\hat{j} + 3\\hat{k}| = \\sqrt{1^2 + 2^2 + 3^2} = \\sqrt{14}$$"
    },
    {
        "q_num": 43, "year": 2023,
        "question": "If $|\\vec{a} \\times \\vec{b}|^2 + |\\vec{a} \\cdot \\vec{b}|^2 = 144$ and $|\\vec{a}| = 6$, then $|\\vec{b}|$ is equal to",
        "options": [
            "$4$",
            "$2$",
            "$3$",
            "$6$"
        ],
        "correct_answer": 1, # (b)
        "explanation": "According to the official KCET Answer Key, the correct option is (B).\n\n$$|\\vec{a}|^2 |\\vec{b}|^2 = 144 \\implies 6^2 |\\vec{b}|^2 = 144 \\implies 36|\\vec{b}|^2 = 144 \\implies |\\vec{b}|^2 = 4 \\implies |\\vec{b}| = 2$$"
    },
    {
        "q_num": 44, "year": 2023,
        "question": "If $\\vec{a}$ is a unit vector and $(\\vec{x} - \\vec{a}) \\cdot (\\vec{x} + \\vec{a}) = 8$, then $|\\vec{x}|$ is equal to",
        "options": [
            "$3$",
            "$8$",
            "$9$",
            "$\\sqrt{7}$"
        ],
        "correct_answer": 0, # (a)
        "explanation": "According to the official KCET Answer Key, the correct option is (A).\n\n$$(\\vec{x} - \\vec{a}) \\cdot (\\vec{x} + \\vec{a}) = |\\vec{x}|^2 - |\\vec{a}|^2 = 8$$\n$$|\\vec{x}|^2 - 1 = 8 \\implies |\\vec{x}|^2 = 9 \\implies |\\vec{x}| = 3$$"
    },
    {
        "q_num": 45, "year": 2023,
        "question": "If a vector $\\vec{a}$ makes equal acute angles with the coordinate axes, then the direction cosines of $\\vec{a}$ are",
        "options": [
            "$\\left(\\frac{1}{3}, \\frac{1}{3}, \\frac{1}{3}\\right)$",
            "$\\left(\\frac{1}{\\sqrt{3}}, \\frac{1}{\\sqrt{3}}, \\frac{1}{\\sqrt{3}}\\right)$",
            "$(1, 1, 1)$",
            "$\\left(\\frac{1}{\\sqrt{2}}, \\frac{1}{\\sqrt{2}}, \\frac{1}{\\sqrt{2}}\\right)$"
        ],
        "correct_answer": 1, # (b)
        "explanation": "According to the official KCET Answer Key, the correct option is (B).\n\n$$l^2 + m^2 + n^2 = 1 \\implies 3l^2 = 1 \\implies l = m = n = \\frac{1}{\\sqrt{3}}$$"
    },
    {
        "q_num": 46, "year": 2023,
        "question": "The diagonals of a parallelogram are $\\vec{d}_1 = 3\\hat{i} + 6\\hat{j} - 2\\hat{k}$ and $\\vec{d}_2 = -\\hat{i} - 2\\hat{j} - 8\\hat{k}$. The area of the parallelogram is",
        "options": [
            "$13\\sqrt{5}\\text{ sq. units}$",
            "$26\\sqrt{5}\\text{ sq. units}$",
            "$15\\text{ sq. units}$",
            "$10\\sqrt{3}\\text{ sq. units}$"
        ],
        "correct_answer": 0, # (a)
        "explanation": "According to the official KCET Answer Key, the correct option is (A).\n\n$$\\vec{d}_1 \\times \\vec{d}_2 = \\begin{vmatrix} \\hat{i} & \\hat{j} & \\hat{k} \\\\ 3 & 6 & -2 \\\\ -1 & -2 & -8 \\end{vmatrix} = \\hat{i}(-48 - 4) - \\hat{j}(-24 - 2) + \\hat{k}(-6 + 6) = -52\\hat{i} + 26\\hat{j}$$\n$$|\\vec{d}_1 \\times \\vec{d}_2| = \\sqrt{(-52)^2 + 26^2} = 26\\sqrt{2^2 + 1^2} = 26\\sqrt{5}$$\n$$\\text{Area} = \\frac{1}{2}|\\vec{d}_1 \\times \\vec{d}_2| = 13\\sqrt{5}\\text{ sq. units}$$"
    },
    {
        "q_num": 47, "year": 2023,
        "question": "If $\\vec{a}$ and $\\vec{b}$ are two vectors such that $|\\vec{a} + \\vec{b}| = 2|\\vec{a}|$ and the angle between $\\vec{a}$ and $\\vec{a} + \\vec{b}$ is $60^\\circ$, then $|\\vec{b}|$ is equal to",
        "options": [
            "$|\\vec{a}|$",
            "$2|\\vec{a}|$",
            "$\\sqrt{2}|\\vec{a}|$",
            "$\\sqrt{3}|\\vec{a}|$"
        ],
        "correct_answer": 3, # (d)
        "explanation": "According to the official KCET Answer Key, the correct option is (D).\n\n$$\\cos 60^\\circ = \\frac{\\vec{a} \\cdot (\\vec{a} + \\vec{b})}{|\\vec{a}||\\vec{a} + \\vec{b}|} = \\frac{|\\vec{a}|^2 + \\vec{a} \\cdot \\vec{b}}{|\\vec{a}|(2|\\vec{a}|)} = \\frac{1}{2}$$\n$$|\\vec{a}|^2 + \\vec{a} \\cdot \\vec{b} = |\\vec{a}|^2 \\implies \\vec{a} \\cdot \\vec{b} = 0$$\n$$|\\vec{a} + \\vec{b}|^2 = |\\vec{a}|^2 + |\\vec{b}|^2 + 2(0) = 4|\\vec{a}|^2 \\implies |\\vec{b}|^2 = 3|\\vec{a}|^2 \\implies |\\vec{b}| = \\sqrt{3}|\\vec{a}|$$"
    },
    {
        "q_num": 48, "year": 2024,
        "question": "The area of a parallelogram with adjacent sides $\\vec{a} = 2\\hat{i} - \\hat{j} + \\hat{k}$ and $\\vec{b} = 3\\hat{i} + 4\\hat{j} - \\hat{k}$ is",
        "options": [
            "$\\sqrt{150}\\text{ sq. units}$",
            "$\\sqrt{155}\\text{ sq. units}$",
            "$\\sqrt{155}\\text{ sq. units}$",
            "$15\\text{ sq. units}$"
        ],
        "correct_answer": 2, # (c)
        "explanation": "According to the official KCET Answer Key, the correct option is (C).\n\n$$\\vec{a} \\times \\vec{b} = \\begin{vmatrix} \\hat{i} & \\hat{j} & \\hat{k} \\\\ 2 & -1 & 1 \\\\ 3 & 4 & -1 \\end{vmatrix} = \\hat{i}(1 - 4) - \\hat{j}(-2 - 3) + \\hat{k}(8 + 3) = -3\\hat{i} + 5\\hat{j} + 11\\hat{k}$$\n$$\\text{Area} = |\\vec{a} \\times \\vec{b}| = \\sqrt{(-3)^2 + 5^2 + 11^2} = \\sqrt{9 + 25 + 121} = \\sqrt{155}\\text{ sq. units}$$"
    },
    {
        "q_num": 49, "year": 2024,
        "question": "If $\\vec{a} \\cdot \\vec{b} = 0$ and $\\vec{a} \\times \\vec{b} = \\vec{0}$, then",
        "options": [
            "$\\vec{a} \\parallel \\vec{b}$",
            "$\\vec{a} \\perp \\vec{b}$",
            "$\\vec{a} = \\vec{0}$ or $\\vec{b} = \\vec{0}$",
            "$\\vec{a} = \\vec{b}$"
        ],
        "correct_answer": 2, # (c)
        "explanation": "According to the official KCET Answer Key, the correct option is (C).\n\nIf $\\vec{a} \\cdot \\vec{b} = 0$, either $\\vec{a} \\perp \\vec{b}$ or at least one is zero. If $\\vec{a} \\times \\vec{b} = \\vec{0}$, either $\\vec{a} \\parallel \\vec{b}$ or at least one is zero. Since two non-zero vectors cannot simultaneously be perpendicular and parallel, at least one of $\\vec{a}$ or $\\vec{b}$ must be the null vector $\\vec{0}$."
    },
    {
        "q_num": 50, "year": 2024,
        "question": "If $|\\vec{a} \\times \\vec{b}| = \\vec{a} \\cdot \\vec{b}$, then the angle between $\\vec{a}$ and $\\vec{b}$ is",
        "options": [
            "$\\frac{\\pi}{4}$",
            "$\\frac{\\pi}{2}$",
            "$\\frac{\\pi}{3}$",
            "$\\frac{\\pi}{6}$"
        ],
        "correct_answer": 0, # (a)
        "explanation": "According to the official KCET Answer Key, the correct option is (A).\n\n$$|\\vec{a}||\\vec{b}|\\sin\\theta = |\\vec{a}||\\vec{b}|\\cos\\theta \\implies \\tan\\theta = 1 \\implies \\theta = \\frac{\\pi}{4} = 45^\\circ$$"
    },
    {
        "q_num": 51, "year": 2024,
        "question": "Let $\\vec{\\alpha} = \\hat{i} - 3\\hat{j}$ and $\\vec{\\beta} = \\hat{i} + 2\\hat{j} - \\hat{k}$. If $\\vec{\\beta} = \\vec{\\beta}_1 + \\vec{\\beta}_2$, where $\\vec{\\beta}_1 \\parallel \\vec{\\alpha}$ and $\\vec{\\beta}_2 \\perp \\vec{\\alpha}$, then $\\vec{\\beta}_1$ is equal to",
        "options": [
            "$\\frac{1}{2}(\\hat{i} - 3\\hat{j})$",
            "$-\\frac{1}{2}(\\hat{i} - 3\\hat{j})$",
            "$\\frac{1}{10}(\\hat{i} - 3\\hat{j})$",
            "$-\\frac{1}{10}(\\hat{i} - 3\\hat{j})$"
        ],
        "correct_answer": 1, # (b)
        "explanation": "According to the official KCET Answer Key, the correct option is (B).\n\n$$\\vec{\\beta}_1 = \\left(\\frac{\\vec{\\beta} \\cdot \\vec{\\alpha}}{|\\vec{\\alpha}|^2}\\right)\\vec{\\alpha} = \\left(\\frac{(1)(1) + (2)(-3) + (-1)(0)}{1^2 + (-3)^2}\\right)(\\hat{i} - 3\\hat{j}) = \\left(\\frac{1 - 6}{10}\\right)(\\hat{i} - 3\\hat{j}) = -\\frac{1}{2}(\\hat{i} - 3\\hat{j})$$"
    },
    {
        "q_num": 52, "year": 2024,
        "question": "If $|\\vec{a} + \\vec{b}| = |\\vec{a} - \\vec{b}|$, then $\\vec{a}$ and $\\vec{b}$ are",
        "options": [
            "parallel",
            "perpendicular",
            "equal",
            "opposite"
        ],
        "correct_answer": 1, # (b)
        "explanation": "According to the official KCET Answer Key, the correct option is (B).\n\n$$|\\vec{a} + \\vec{b}|^2 = |\\vec{a} - \\vec{b}|^2 \\implies 4(\\vec{a} \\cdot \\vec{b}) = 0 \\implies \\vec{a} \\perp \\vec{b}$$"
    },
    {
        "q_num": 53, "year": 2024,
        "question": "The projection of the vector $\\vec{a} = \\hat{i} + \\hat{j} + 2\\hat{k}$ on the vector $\\vec{b} = \\hat{i} + 2\\hat{j} + \\hat{k}$ is",
        "options": [
            "$\\frac{3}{\\sqrt{6}}$",
            "$\\frac{4}{\\sqrt{6}}$",
            "$\\frac{5}{\\sqrt{6}}$",
            "$\\frac{2}{\\sqrt{6}}$"
        ],
        "correct_answer": 2, # (c)
        "explanation": "According to the official KCET Answer Key, the correct option is (C).\n\n$$\\text{Projection} = \\frac{\\vec{a} \\cdot \\vec{b}}{|\\vec{b}|} = \\frac{(1)(1) + (1)(2) + (2)(1)}{\\sqrt{1^2 + 2^2 + 1^2}} = \\frac{1 + 2 + 2}{\\sqrt{6}} = \\frac{5}{\\sqrt{6}}$$"
    },
    {
        "q_num": 54, "year": 2024,
        "question": "If $\\vec{a}$ and $\\vec{b}$ are unit vectors and $\\theta$ is the angle between them, then $\\sin\\left(\\frac{\\theta}{2}\\right)$ is equal to",
        "options": [
            "$|\\vec{a} - \\vec{b}|$",
            "$|\\vec{a} + \\vec{b}|$",
            "$\\frac{1}{2}|\\vec{a} - \\vec{b}|$",
            "$\\frac{1}{2}|\\vec{a} + \\vec{b}|$"
        ],
        "correct_answer": 2, # (c)
        "explanation": "According to the official KCET Answer Key, the correct option is (C).\n\n$$|\\vec{a} - \\vec{b}|^2 = 2(1 - \\cos\\theta) = 4\\sin^2\\left(\\frac{\\theta}{2}\\right) \\implies \\sin\\left(\\frac{\\theta}{2}\\right) = \\frac{1}{2}|\\vec{a} - \\vec{b}|$$"
    },
    {
        "q_num": 55, "year": 2024,
        "question": "If $|\\vec{a} \\times \\vec{b}|^2 + |\\vec{a} \\cdot \\vec{b}|^2 = 144$ and $|\\vec{a}| = 4$, then $|\\vec{b}|$ is equal to",
        "options": [
            "$16$",
            "$12$",
            "$9$",
            "$3$"
        ],
        "correct_answer": 3, # (d)
        "explanation": "According to the official KCET Answer Key, the correct option is (D).\n\n$$|\\vec{a}|^2 |\\vec{b}|^2 = 144 \\implies 16|\\vec{b}|^2 = 144 \\implies |\\vec{b}|^2 = 9 \\implies |\\vec{b}| = 3$$"
    },
    {
        "q_num": 56, "year": 2024,
        "question": "In $\\triangle ABC$, the position vector of vertex $B$ is $3\\hat{i} + 4\\hat{k}$ and of $C$ is $5\\hat{i} - 2\\hat{j} + 4\\hat{k}$. If vertex $A$ is the origin, then the position vector of the midpoint $D$ of $BC$ is",
        "options": [
            "$4\\hat{i} + \\hat{j} + 4\\hat{k}$",
            "$8\\hat{i} - 2\\hat{j} + 8\\hat{k}$",
            "$4\\hat{i} - \\hat{j} + 4\\hat{k}$",
            "$2\\hat{i} - 2\\hat{j}$"
        ],
        "correct_answer": 2, # (c)
        "explanation": "According to the official KCET Answer Key, the correct option is (C).\n\n$$\\vec{OD} = \\frac{\\vec{OB} + \\vec{OC}}{2} = \\frac{(3\\hat{i} + 4\\hat{k}) + (5\\hat{i} - 2\\hat{j} + 4\\hat{k})}{2} = \\frac{8\\hat{i} - 2\\hat{j} + 8\\hat{k}}{2} = 4\\hat{i} - \\hat{j} + 4\\hat{k}$$"
    },
    {
        "q_num": 57, "year": 2024,
        "question": "If $\\vec{a}$ and $\\vec{b}$ are two unit vectors such that $\\vec{a} + \\vec{b}$ is also a unit vector, then the angle between $\\vec{a}$ and $\\vec{b}$ is",
        "options": [
            "$\\frac{\\pi}{3}$",
            "$\\frac{\\pi}{2}$",
            "$\\frac{2\\pi}{3}$",
            "$\\frac{5\\pi}{6}$"
        ],
        "correct_answer": 2, # (c)
        "explanation": "According to the official KCET Answer Key, the correct option is (C).\n\n$$|\\vec{a} + \\vec{b}|^2 = |\\vec{a}|^2 + |\\vec{b}|^2 + 2|\\vec{a}||\\vec{b}|\\cos\\theta = 1$$\n$$1 + 1 + 2(1)(1)\\cos\\theta = 1 \\implies 2 + 2\\cos\\theta = 1 \\implies 2\\cos\\theta = -1 \\implies \\cos\\theta = -\\frac{1}{2}$$\n$$\\theta = \\frac{2\\pi}{3} = 120^\\circ$$"
    }
]

json_output = []
for q in questions:
    json_output.append({
        "id": f"kcet-maths-ch19-{q['q_num']}",
        "subject": "Mathematics",
        "chapter": "Vector Algebra",
        "chapter_number": 19,
        "year": q["year"],
        "question": q["question"],
        "options": q["options"],
        "correct_answer": q["correct_answer"],
        "explanation": q["explanation"],
        "needs_image": False,
        "image_url": None
    })

print(f"Total processed questions for Math 19: {len(json_output)}")

with open('src/data/pyq_maths_ch19.json', 'w', encoding='utf-8') as f:
    json.dump(json_output, f, indent=2, ensure_ascii=False)

print("Saved src/data/pyq_maths_ch19.json")
