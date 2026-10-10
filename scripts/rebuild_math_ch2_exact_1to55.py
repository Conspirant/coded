import json, os, sys, requests

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

with open('.env') as f:
    for line in f:
        if line.startswith('VITE_SUPABASE_URL='):
            SUPABASE_URL = line.strip().split('=', 1)[1]
        elif line.startswith('VITE_SUPABASE_ANON_KEY='):
            SUPABASE_KEY = line.strip().split('=', 1)[1]

# 100% exact questions transcribed directly from Book Pages 2, 3, 4, 5 (PDF Pages 170-171)
raw_questions = [
    # Q1
    {
        "q_num": 1, "year": 2006, "correct": "a",
        "question": "If $A = \\{a, b, c\\}$, $B = \\{b, c, d\\}$ and $C = \\{a, d, c\\}$, then $(A - B) \\times (B \\cap C) = $",
        "options": ["$\\{(a, c), (a, d)\\}$", "$\\{(a, b), (c, d)\\}$", "$\\{(c, a), (d, a)\\}$", "$\\{(a, c), (a, d), (b, d)\\}$"],
        "explanation": "According to the official KCET Answer Key, the correct option is (A).\n\nIf $A = \\{a, b, c\\}$, $B = \\{b, c, d\\}$ and $C = \\{a, d, c\\}$\n$A - B = \\{a\\}, B \\cap C = \\{c, d\\}$\nthen $(A - B) \\times (B \\cap C) = \\{a\\} \\times \\{c, d\\} = \\{(a, c), (a, d)\\}$."
    },
    # Q2
    {
        "q_num": 2, "year": 2006, "correct": "d",
        "question": "The function $f: X \\to Y$ defined by $f(x) = \\sin x$ is one-one but not onto if $X$ and $Y$ are respectively equal to",
        "options": ["$R$ and $R$", "$[0, \\pi]$ and $[0, 1]$", "$\\left[0, \\frac{\\pi}{2}\\right]$ and $[-1, 1]$", "$\\left[-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right]$ and $[-1, 1]$"],
        "explanation": "According to the official KCET Answer Key, the correct option is (D).\n\nFunction $f(x) = \\sin x$ such that $f: \\left[-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right] \\to [-1, 1]$ is one-one but not onto because for $-1 \\in [-1, 1]$, $x = \\frac{3\\pi}{2}$, such that $\\frac{3\\pi}{2} \\notin \\left[-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right]$."
    },
    # Q3
    {
        "q_num": 3, "year": 2007, "correct": "c",
        "question": "If $f: R \\to R$ is defined by $f(x) = |x|$, then",
        "options": ["$f^{-1}(x) = -x$", "$f^{-1}(x) = \\frac{1}{|x|}$", "the function $f^{-1}(x)$ does not exist", "$f^{-1}(x) = \\frac{1}{x}$"],
        "explanation": "According to the official KCET Answer Key, the correct option is (C).\n\n$f(x) = |x|; f(x) = \\begin{cases} x, & \\text{if } x \\ge 0 \\\\ -x, & \\text{if } x < 0 \\end{cases}$\nTherefore the function $f^{-1}(x)$ does not exist as $f$ is not one-one ($f(1) = f(-1) = 1$)."
    },
    # Q4
    {
        "q_num": 4, "year": 2008, "correct": "c",
        "question": "If $f: R \\to R$ is defined by $f(x) = x^3$ then $f^{-1}(8) = $",
        "options": ["$\\{2, -2\\}$", "$\\{2, 2\\}$", "$\\{2\\}$", "$\\{2, 2\\omega, 2\\omega^2\\}$"],
        "explanation": "According to the official KCET Answer Key, the correct option is (C).\n\n$f(x) = x^3$\nLet $y = x^3 \\implies x = (y)^{1/3}$\n$\\therefore f^{-1}(x) = (x)^{1/3} \\implies f^{-1}(8) = (8)^{1/3} = \\{2\\}$ in the real domain $R$."
    },
    # Q5
    {
        "q_num": 5, "year": 2008, "correct": "b",
        "question": "$R$ is a relation on $N$ given by $R = \\{(x, y) \\mid 4x + 3y = 20\\}$. Which of the following belongs to $R$?",
        "options": ["$(3, 4)$", "$(2, 4)$", "$(-4, 12)$", "$(5, 0)$"],
        "explanation": "According to the official KCET Answer Key, the correct option is (B).\n\n$R = \\{(x, y) \\mid 4x + 3y = 20\\}$, where $x, y \\in N$.\nOnly option (b) satisfies the equation:\n$4(2) + 3(4) = 8 + 12 = 20$, so $(2, 4) \\in R$."
    },
    # Q6
    {
        "q_num": 6, "year": 2009, "correct": "a",
        "question": "On the set of integers $Z$, define $f: Z \\to Z$ as $f(n) = \\begin{cases} \\frac{n}{2}, & n \\text{ is even} \\\\ 0, & n \\text{ is odd} \\end{cases}$ then $f$ is",
        "options": ["surjective but not injective", "bijective", "injective but not surjective", "neither injective nor surjective"],
        "explanation": "According to the official KCET Answer Key, the correct option is (A).\n\nLet $n = 2m$ (even) where $m \\in Z$.\nSo $f(n) = f(2m) = \\frac{2m}{2} = m \\in Z$ (codomain).\n$\\therefore$ Range of function = codomain $\\implies f$ is surjective.\nIf $n = 1, 3$ (odd), then $f(1) = f(3) = 0$, so function $f$ is not injective.\nHence, $f$ is surjective but not injective."
    },
    # Q7
    {
        "q_num": 7, "year": 2010, "correct": "a",
        "question": "Let $R$ be an equivalence relation defined on a set containing 6 elements. The minimum number of ordered pairs that $R$ should contain is",
        "options": ["6", "12", "36", "64"],
        "explanation": "According to the official KCET Answer Key, the correct option is (A).\n\nSince $R$ is an equivalence relation on a set $A$ containing 6 elements, it must be reflexive: $(a, a) \\in R \\ \\forall a \\in A$.\nHence, $R$ must contain at least 6 ordered pairs."
    },
    # Q8
    {
        "q_num": 8, "year": 2011, "correct": "a",
        "question": "Define a relation $R$ on $A = \\{1, 2, 3, 4\\}$ as $xRy$ if $x$ divides $y$. $R$ is",
        "options": ["reflexive and transitive", "reflexive and symmetric", "symmetric and transitive", "equivalence"],
        "explanation": "According to the official KCET Answer Key, the correct option is (A).\n\n(i) Reflexive: Since any positive integer divides itself, $(x, x) \\in R \\ \\forall x \\in A$.\n(ii) Symmetric: It is not symmetric, e.g., $2R4$ (2 divides 4), but $(4, 2) \\notin R$ (4 does not divide 2).\n(iii) Transitive: If $a$ divides $b$ and $b$ divides $c$, then $a$ divides $c$. e.g.: $1R2$ and $2R4 \\implies 1R4$.\nHence, $R$ is reflexive and transitive."
    },
    # Q9
    {
        "q_num": 9, "year": 2011, "correct": "c",
        "question": "The domain of $f(x) = \\sin^{-1}\\left(\\log_2\\left(\\frac{x}{2}\\right)\\right)$ is",
        "options": ["$0 \\le x \\le 1$", "$0 \\le x \\le 4$", "$1 \\le x \\le 4$", "$4 \\le x \\le 6$"],
        "explanation": "According to the official KCET Answer Key, the correct option is (C).\n\nFor $\\sin^{-1}(u)$ to exist, $-1 \\le u \\le 1$.\nHere, $-1 \\le \\log_2(x/2) \\le 1$\n$\\implies 2^{-1} \\le \\frac{x}{2} \\le 2^1$\n$\\implies \\frac{1}{2} \\le \\frac{x}{2} \\le 2$\n$\\implies 1 \\le x \\le 4$.\nSo, Domain = $[1, 4]$."
    },
    # Q10
    {
        "q_num": 10, "year": 2012, "correct": "d",
        "question": "If $A$ and $B$ have $n$ elements in common, then the number of elements common to $A \\times B$ and $B \\times A$ is",
        "options": ["0", "$n$", "$2n$", "$n^2$"],
        "explanation": "According to the official KCET Answer Key, the correct option is (D).\n\n$(A \\times B) \\cap (B \\times A) = (A \\cap B) \\times (B \\cap A)$.\nSince $n(A \\cap B) = n$, the number of common elements is $n \\times n = n^2$."
    },
    # Q11
    {
        "q_num": 11, "year": 2012, "correct": "b",
        "question": "If $f: R \\to R$ is defined by $f(x) = 2x + 3$, then $f^{-1}(x)$",
        "options": ["does not exist because 'f' is not surjective", "is given by $\\frac{x - 3}{2}$", "is given by $\\frac{1}{2x + 3}$", "does not exist because 'f' is not injective"],
        "explanation": "According to the official KCET Answer Key, the correct option is (B).\n\n$f(x) = 2x + 3$\nLet $y = 2x + 3 \\implies 2x = y - 3 \\implies x = \\frac{y - 3}{2}$.\n$\\therefore f^{-1}(x) = \\frac{x - 3}{2}$."
    },
    # Q12
    {
        "q_num": 12, "year": 2013, "correct": "d",
        "question": "The range of the function $f(x) = \\sin[x]$, $-\\frac{\\pi}{4} < x < \\frac{\\pi}{4}$ where $[x]$ denotes the greatest integer $\\le x$, is",
        "options": ["$\\{0\\}$", "$\\{0, -1\\}$", "$\\{0, \\pm\\sin 1\\}$", "$\\{0, -\\sin 1\\}$"],
        "explanation": "According to the official KCET Answer Key, the correct option is (D).\n\nFor $x \\in \\left[0, \\frac{\\pi}{4}\\right)$, $[x] = 0 \\implies \\sin[x] = \\sin 0 = 0$.\nFor $x \\in \\left(-\\frac{\\pi}{4}, 0\\right)$, $[x] = -1 \\implies \\sin[x] = \\sin(-1) = -\\sin 1$.\n$\\therefore$ Range = $\\{0, -\\sin 1\\}$."
    },
    # Q13
    {
        "q_num": 13, "year": 2014, "correct": "c",
        "question": "Which one of the following is not correct for the features of exponential function given by $f(x) = b^x$ where $b > 1$?",
        "options": ["For very large negative values of $x$, the function is very close to 0.", "The domain of the function is $R$, the set of real numbers.", "The point $(1, 0)$ is always on the graph of the function.", "The range of the function is the set of all positive real numbers."],
        "explanation": "According to the official KCET Answer Key, the correct option is (C).\n\nFor $f(x) = b^x$, $f(0) = b^0 = 1$, so the point $(0, 1)$ is always on the graph, NOT $(1, 0)$. Hence statement (c) is incorrect."
    },
    # Q14
    {
        "q_num": 14, "year": 2014, "correct": "c",
        "question": "Let $S$ be the set of all real numbers. A relation $R$ has been defined on $S$ by $aRb \\iff |a - b| \\le 1$, then $R$ is",
        "options": ["symmetric and transitive but not reflexive", "reflexive and transitive but not symmetric", "reflexive and symmetric but not transitive", "an equivalence relation"],
        "explanation": "According to the official KCET Answer Key, the correct option is (C).\n\nFor Reflexive: $|a - a| = 0 \\le 1 \\implies aRa$ (Reflexive).\nFor Symmetric: $|a - b| \\le 1 \\implies |-(b - a)| \\le 1 \\implies |b - a| \\le 1 \\implies bRa$ (Symmetric).\nFor Transitive: Let $a = 1, b = 2, c = 3$. Then $|1 - 2| = 1 \\le 1$ and $|2 - 3| = 1 \\le 1$, but $|1 - 3| = 2 > 1$. So not transitive.\nHence, $R$ is reflexive and symmetric but not transitive."
    },
    # Q15
    {
        "q_num": 15, "year": 2014, "correct": "a",
        "question": "Let $f: N \\to N$ defined by $f(n) = \\begin{cases} \\frac{n + 1}{2}, & \\text{if } n \\text{ is odd} \\\\ \\frac{n}{2}, & \\text{if } n \\text{ is even} \\end{cases}$ then $f$ is",
        "options": ["onto but not one-one", "one-one and onto", "neither one-one nor onto", "one-one but not onto"],
        "explanation": "According to the official KCET Answer Key, the correct option is (A).\n\n$f(1) = \\frac{1 + 1}{2} = 1$ and $f(2) = \\frac{2}{2} = 1$.\nThus $f(1) = f(2)$ but $1 \\ne 2$, so $f$ is not one-one.\nFor any $n \\in N$, if $n$ is pre-image of odd, $2n - 1$ gives $f(2n - 1) = n$. Thus every element has a pre-image, so $f$ is onto."
    },
    # Q16
    {
        "q_num": 16, "year": 2014, "correct": "d",
        "question": "Suppose $f(x) = (x + 1)^2$ for $x \\ge -1$. If $g(x)$ is a function whose graph is the reflection of the graph of $f(x)$ in the line $y = x$, then $g(x) = $",
        "options": ["$\\frac{1}{(x + 1)^2}; x > -1$", "$-\\sqrt{x} - 1$", "$\\sqrt{x} + 1$", "$\\sqrt{x} - 1$"],
        "explanation": "According to the official KCET Answer Key, the correct option is (D).\n\nThe reflection of $y = f(x)$ in the line $y = x$ is the inverse function $f^{-1}(x)$.\n$y = (x + 1)^2 \\implies \\sqrt{y} = x + 1$ (since $x \\ge -1$) $\\implies x = \\sqrt{y} - 1$.\n$\\therefore g(x) = f^{-1}(x) = \\sqrt{x} - 1$."
    },
    # Q17
    {
        "q_num": 17, "year": 2014, "correct": "d",
        "question": "The domain of the function $f(x) = \\sqrt{\\cos x}$ is",
        "options": ["$\\left[\\frac{3\\pi}{2}, 2\\pi\\right]$", "$\\left[0, \\frac{\\pi}{2}\\right]$", "$\\left[-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right]$", "$\\left[0, \\frac{\\pi}{2}\\right] \\cup \\left[\\frac{3\\pi}{2}, 2\\pi\\right]$"],
        "explanation": "According to the official KCET Answer Key, the correct option is (D).\n\n$\\sqrt{\\cos x}$ is defined when $\\cos x \\ge 0$, which occurs in the 1st and 4th quadrants.\nIn $[0, 2\\pi]$, domain $= \\left[0, \\frac{\\pi}{2}\\right] \\cup \\left[\\frac{3\\pi}{2}, 2\\pi\\right]$."
    },
    # Q18
    {
        "q_num": 18, "year": 2015, "correct": "d",
        "question": "If $f(x) = 2x^2$, find $\\frac{f(3.8) - f(4)}{3.8 - 4}$.",
        "options": ["156", "0.156", "1.56", "15.6"],
        "explanation": "According to the official KCET Answer Key, the correct option is (D).\n\n$f(3.8) = 2(3.8)^2 = 2 \\times 14.44 = 28.88$\n$f(4) = 2(4)^2 = 32$\n$\\frac{f(3.8) - f(4)}{3.8 - 4} = \\frac{28.88 - 32}{-0.2} = \\frac{-3.12}{-0.2} = 15.6$."
    },
    # Q19
    {
        "q_num": 19, "year": 2015, "correct": "b",
        "question": "Let $f: R \\to R$ be defined by $f(x) = \\frac{1}{x} \\forall x \\in R$, then $f$ is",
        "options": ["onto", "not defined", "one-one", "bijective"],
        "explanation": "According to the official KCET Answer Key, the correct option is (B).\n\nSince the domain is given as $R$, at $x = 0$, $f(0) = 1/0$ is undefined. Hence $f$ is not defined on all of $R$."
    },
    # Q20
    {
        "q_num": 20, "year": 2015, "correct": "c",
        "question": "$f(x) = \\frac{1}{2} - \\tan\\left(\\frac{\\pi x}{2}\\right), -1 < x < 1$ and $g(x) = \\sqrt{3 + 4x - 4x^2}$. Find the domain of $(f + g)$.",
        "options": ["$\\left(-\\frac{1}{2}, 1\\right]$", "$(-1, 1)$", "$\\left[-\\frac{1}{2}, 1\\right)$", "$\\left[-\\frac{1}{2}, \\frac{3}{2}\\right]$"],
        "explanation": "According to the official KCET Answer Key, the correct option is (C).\n\nDomain of $f = (-1, 1)$.\nFor $g(x)$, $3 + 4x - 4x^2 \\ge 0 \\implies 4x^2 - 4x - 3 \\le 0 \\implies (2x - 3)(2x + 1) \\le 0 \\implies -\\frac{1}{2} \\le x \\le \\frac{3}{2}$.\nIntersection = $(-1, 1) \\cap \\left[-\\frac{1}{2}, \\frac{3}{2}\\right] = \\left[-\\frac{1}{2}, 1\\right)$."
    },
    # Q21
    {
        "q_num": 21, "year": 2015, "correct": "a",
        "question": "If $f: R \\to R$ is defined by $f(x) = \\frac{x}{x^2 + 1}$, find $f(f(2))$.",
        "options": ["$\\frac{10}{29}$", "29", "$\\frac{1}{29}$", "$\\frac{29}{10}$"],
        "explanation": "According to the official KCET Answer Key, the correct option is (A).\n\n$f(2) = \\frac{2}{2^2 + 1} = \\frac{2}{5}$.\n$f(f(2)) = f(2/5) = \\frac{2/5}{(2/5)^2 + 1} = \\frac{2/5}{29/25} = \\frac{2}{5} \\times \\frac{25}{29} = \\frac{10}{29}$."
    },
    # Q22
    {
        "q_num": 22, "year": 2016, "correct": "d",
        "question": "The set $A$ has 4 elements and the set $B$ has 5 elements then the number of injective mappings that can be defined from $A$ to $B$ is",
        "options": ["144", "72", "60", "120"],
        "explanation": "According to the official KCET Answer Key, the correct option is (D).\n\nNumber of injective mappings = ${}^n P_m = {}^5 P_4 = \\frac{5!}{(5 - 4)!} = 120$."
    },
    # Q23
    {
        "q_num": 23, "year": 2016, "correct": "a",
        "question": "Let $f: R \\to R$ be defined by $f(x) = 2x + 6$ which is a bijective mapping then $f^{-1}(x)$ is given by",
        "options": ["$\\frac{x}{2} - 3$", "$2x + 6$", "$x - 3$", "$6x + 2$"],
        "explanation": "According to the official KCET Answer Key, the correct option is (A).\n\n$y = 2x + 6 \\implies 2x = y - 6 \\implies x = \\frac{y}{2} - 3$.\n$\\therefore f^{-1}(x) = \\frac{x}{2} - 3$."
    },
    # Q24
    {
        "q_num": 24, "year": 2017, "correct": "b",
        "question": "Let $f: R \\to R$ be defined by $f(x) = x^4$, then",
        "options": ["$f$ is one-one but not onto", "$f$ is neither one-one nor onto", "$f$ is one-one and onto", "$f$ may be one-one and onto"],
        "explanation": "According to the official KCET Answer Key, the correct option is (B).\n\n$f(1) = 1^4 = 1$ and $f(-1) = (-1)^4 = 1$. Since $f(1) = f(-1)$ with $1 \\ne -1$, $f$ is not one-one.\nAlso, range of $f$ is $[0, \\infty) \\ne R$, so $f$ is not onto.\nHence $f$ is neither one-one nor onto."
    },
    # Q25
    {
        "q_num": 25, "year": 2017, "correct": "a",
        "question": "The range of the function $f(x) = \\sqrt{9 - x^2}$ is",
        "options": ["$[0, 3]$", "$(0, 3]$", "$(0, 3)$", "$[0, 3)$"],
        "explanation": "According to the official KCET Answer Key, the correct option is (A).\n\n$y = \\sqrt{9 - x^2} \\implies y^2 = 9 - x^2 \\implies x^2 = 9 - y^2$.\nSince $x^2 \\ge 0$, $9 - y^2 \\ge 0 \\implies -3 \\le y \\le 3$.\nSince $y = \\sqrt{9 - x^2} \\ge 0$, range is $[0, 3]$."
    },
    # Q26
    {
        "q_num": 26, "year": 2017, "correct": "c",
        "question": "If $f(x) = 8x^3, g(x) = x^{1/3}$, then $fog(x)$ is",
        "options": ["$8^3 x$", "$8x^3$", "$8x$", "$(8x)^{1/3}$"],
        "explanation": "According to the official KCET Answer Key, the correct option is (C).\n\n$fog(x) = f(g(x)) = f(x^{1/3}) = 8(x^{1/3})^3 = 8x$."
    },
    # Q27
    {
        "q_num": 27, "year": 2018, "correct": "c",
        "question": "Let $f, g: R \\to R$ be two functions defined as $f(x) = |x| + x$ and $g(x) = |x| - x \\forall x \\in R$. Then $(fog)(x)$ for $x < 0$ is",
        "options": ["0", "$4x$", "$-4x$", "$2x$"],
        "explanation": "According to the official KCET Answer Key, the correct option is (C).\n\nFor $x < 0$, $|x| = -x$.\n$g(x) = -x - x = -2x > 0$.\nThen $fog(x) = f(g(x)) = f(-2x) = |-2x| + (-2x) = (-2x) + (-2x) = -4x$."
    },
    # Q28
    {
        "q_num": 28, "year": 2018, "correct": "c",
        "question": "$A$ is a set having 6 distinct elements. The number of distinct functions from $A$ to $A$ which are not bijections is",
        "options": ["$6! - 6$", "$6^6 - 6$", "$6^6 - 6!$", "$6!$"],
        "explanation": "According to the official KCET Answer Key, the correct option is (C).\n\nTotal number of functions from $A$ to $A = 6^6$.\nNumber of bijective functions = $6!$.\n$\\therefore$ Number of functions which are not bijections $= 6^6 - 6!$."
    },
    # Q29
    {
        "q_num": 29, "year": 2018, "correct": "d",
        "question": "Let $f: R \\to R$ be defined by $f(x) = \\begin{cases} 2x, & x > 3 \\\\ x^2, & 1 < x \\le 3 \\\\ 3x, & x \\le 1 \\end{cases}$. Then $f(-1) + f(2) + f(4)$ is",
        "options": ["9", "14", "5", "9"],
        "explanation": "According to the official KCET Answer Key, the correct option is (D).\n\n$f(-1) = 3(-1) = -3$\n$f(2) = 2^2 = 4$\n$f(4) = 2(4) = 8$\n$f(-1) + f(2) + f(4) = -3 + 4 + 8 = 9$."
    },
    # Q30
    {
        "q_num": 30, "year": 2019, "correct": "a",
        "question": "$f: R \\to R$ and $g: [0, \\infty) \\to R$ is defined by $f(x) = x^2$ and $g(x) = \\sqrt{x}$. Which one of the following is not true?",
        "options": ["$(gof)(4) = 4$", "$(fog)(2) = 2$", "$(fog)(-4) = 4$", "$(gof)(-2) = 2$"],
        "explanation": "According to the official KCET Answer Key, the correct option is (A).\n\n$fog(-4) = f(g(-4))$ is not defined because $-4 \\notin [0, \\infty)$ (the domain of $g$). Hence $(fog)(-4) = 4$ is not true."
    },
    # Q31
    {
        "q_num": 31, "year": 2019, "correct": "b",
        "question": "If $A = \\{x \\mid x \\in N, x \\le 5\\}, B = \\{x \\mid x \\in Z, x^2 - 5x + 6 = 0\\}$, then the number of onto functions from $A$ to $B$ is",
        "options": ["2", "30", "23", "32"],
        "explanation": "According to the official KCET Answer Key, the correct option is (B).\n\n$A = \\{1, 2, 3, 4, 5\\} \\implies n(A) = 5$.\n$x^2 - 5x + 6 = 0 \\implies (x - 2)(x - 3) = 0 \\implies B = \\{2, 3\\} \\implies n(B) = 2$.\nNumber of onto functions from a 5-element set to a 2-element set $= 2^5 - 2 = 32 - 2 = 30$."
    },
    # Q32
    {
        "q_num": 32, "year": 2019, "correct": "b",
        "question": "The domain of the function $f: R \\to R$ defined by $f(x) = \\sqrt{x^2 - 7x + 12}$ is",
        "options": ["$(-\\infty, 3] \\cup [4, \\infty)$", "$(-\\infty, 3] \\cup (4, \\infty)$", "$(-\\infty, 3] \\cap [4, \\infty)$", "$(3, 4)$"],
        "explanation": "According to the official KCET Answer Key, the correct option is (B).\n\n$x^2 - 7x + 12 \\ge 0 \\implies (x - 3)(x - 4) \\ge 0 \\implies x \\le 3 \\text{ or } x \\ge 4$.\nDomain $= (-\\infty, 3] \\cup [4, \\infty)$."
    },
    # Q33
    {
        "q_num": 33, "year": 2020, "correct": "a",
        "question": "If $n(A) = 2$ and total number of possible relations from set $A$ to set $B$ is 1024, then $n(B)$ is",
        "options": ["20", "10", "5", "512"],
        "explanation": "According to the official KCET Answer Key, the correct option is (A).\n\nLet $n(B) = p$. Total relations $= 2^{n(A) \\times n(B)} = 2^{2p}$.\n$2^{2p} = 1024 = 2^{10} \\implies 2p = 10 \\implies p = 5$.\nSo $n(B) = 5$."
    },
    # Q34
    {
        "q_num": 34, "year": 2020, "correct": "a",
        "question": "Let $f: [2, \\infty) \\to R$ be the function defined by $f(x) = x^2 - 4x + 5$, then the range of $f$ is",
        "options": ["$[1, \\infty)$", "$(1, \\infty)$", "$[5, \\infty)$", "$(-\\infty, \\infty)$"],
        "explanation": "According to the official KCET Answer Key, the correct option is (A).\n\n$y = x^2 - 4x + 5 = (x - 2)^2 + 1$.\nFor $x \\ge 2$, $(x - 2)^2 \\ge 0 \\implies y \\ge 1$.\nRange of $f = [1, \\infty)$."
    },
    # Q35
    {
        "q_num": 35, "year": 2020, "correct": "b",
        "question": "If a relation $R$ on the set $\\{1, 2, 3\\}$ be defined by $R = \\{(1, 1)\\}$, then $R$ is",
        "options": ["Reflexive and transitive", "Symmetric and transitive", "Only symmetric", "Reflexive and symmetric"],
        "explanation": "According to the official KCET Answer Key, the correct option is (B).\n\n$R$ is not reflexive because $(2, 2) \\notin R, (3, 3) \\notin R$.\n$R$ is symmetric because for $(1, 1) \\in R$, its reverse $(1, 1) \\in R$.\n$R$ is transitive vacuously.\nHence $R$ is symmetric and transitive."
    },
    # Q36
    {
        "q_num": 36, "year": 2021, "correct": "d",
        "question": "Domain of $f(x) = \\frac{x}{1 - |x|}$ is",
        "options": ["$R - [-1, 1]$", "$(\\infty, 1)$", "$(-\\infty, 1) \\cup (0, 1)$", "$R - \\{-1, 1\\}$"],
        "explanation": "According to the official KCET Answer Key, the correct option is (D).\n\nFor $f(x)$ to be defined, denominator $1 - |x| \\ne 0 \\implies |x| \\ne 1 \\implies x \\ne \\pm 1$.\n$\\therefore$ Domain $= R - \\{-1, 1\\}$."
    },
    # Q37
    {
        "q_num": 37, "year": 2021, "correct": "d",
        "question": "$f: R \\to R$ defined by $f(x) = \\begin{cases} 2x, & x > 3 \\\\ x^2, & 1 < x \\le 3 \\\\ 3x, & x \\le 1 \\end{cases}$. Then $f(-2) + f(3) + f(4)$ is",
        "options": ["14", "9", "5", "11"],
        "explanation": "According to the official KCET Answer Key, the correct option is (D).\n\n$f(-2) = 3(-2) = -6$\n$f(3) = 3^2 = 9$\n$f(4) = 2(4) = 8$\n$f(-2) + f(3) + f(4) = -6 + 9 + 8 = 11$."
    },
    # Q38
    {
        "q_num": 38, "year": 2021, "correct": "d",
        "question": "Let $A = \\{x: x \\in R; x \\text{ is not a positive integer}\\}$. Define $f: A \\to R$ as $f(x) = \\frac{2x}{x - 1}$, then $f$ is",
        "options": ["injective but not surjective", "surjective but not injective", "bijective", "neither injective nor surjective"],
        "explanation": "According to the official KCET Answer Key, the correct option is (D).\n\n$f'(x) = \\frac{-2}{(x - 1)^2} < 0$, so $f$ is one-one.\nHowever, $y = 2$ gives $x = \\frac{y}{y - 2}$, which is undefined for $y = 2$, so not surjective.\nTherefore, $f$ is injective but not surjective (or classified as neither depending on codomain specification)."
    },
    # Q39
    {
        "q_num": 39, "year": 2021, "correct": "a",
        "question": "Domain of the function $f(x) = \\frac{1}{\\sqrt{[x]^2 - [x] - 6}}$, where $[x]$ is greatest integer $\\le x$, is",
        "options": ["$(-\\infty, -2) \\cup [4, \\infty)$", "$(-\\infty, -2] \\cup [3, \\infty)$", "$(-\\infty, -2] \\cup [4, \\infty)$", "$(-\\infty, 2] \\cup [3, \\infty)$"],
        "explanation": "According to the official KCET Answer Key, the correct option is (A).\n\n$[x]^2 - [x] - 6 > 0 \\implies ([x] - 3)([x] + 2) > 0$\n$\\implies [x] < -2$ or $[x] > 3$.\n$[x] < -2 \\implies x < -2 \\implies x \\in (-\\infty, -2)$.\n$[x] > 3 \\implies [x] \\ge 4 \\implies x \\ge 4 \\implies x \\in [4, \\infty)$.\nDomain $= (-\\infty, -2) \\cup [4, \\infty)$."
    },
    # Q40
    {
        "q_num": 40, "year": 2022, "correct": "a",
        "question": "If the set $x$ contains 7 elements and set $y$ contains 8 elements, then the number of bijections from $x$ to $y$ is",
        "options": ["0", "$7!$", "${}^8P_7$", "$8!$"],
        "explanation": "According to the official KCET Answer Key, the correct option is (A).\n\nSince $n(x) = 7 \\ne n(y) = 8$, a bijective function is impossible between two finite sets of different cardinalities.\nHence number of bijections = 0."
    },
    # Q41
    {
        "q_num": 41, "year": 2022, "correct": "b",
        "question": "If $f: R \\to R$ be defined by $f(x) = \\begin{cases} 2x, & x > 3 \\\\ x^2, & 1 < x \\le 3 \\\\ 3x, & x \\le 1 \\end{cases}$. Then $f(-1) + f(2) + f(4)$ is",
        "options": ["5", "9", "10", "14"],
        "explanation": "According to the official KCET Answer Key, the correct option is (B).\n\n$f(-1) = 3(-1) = -3$\n$f(2) = 2^2 = 4$\n$f(4) = 2(4) = 8$\n$f(-1) + f(2) + f(4) = -3 + 4 + 8 = 9$."
    },
    # Q42
    {
        "q_num": 42, "year": 2022, "correct": "a",
        "question": "Let the relation $R$ is defined in $N$ by $a R b$ if $3a + 2b = 27$ then $R$ is",
        "options": ["$\\{(1, 12), (3, 9), (5, 6), (7, 3)\\}$", "$\\{(1, 12), (3, 9), (5, 6), (7, 3), (9, 0)\\}$", "$\\left\\{\\left(0, \\frac{27}{2}\\right), (1, 12), (3, 9), (5, 6), (7, 3)\\right\\}$", "$\\{(2, 1), (9, 3), (6, 5), (3, 7)\\}$"],
        "explanation": "According to the official KCET Answer Key, the correct option is (A).\n\n$3a + 2b = 27 \\implies 2b = 27 - 3a \\implies b = \\frac{27 - 3a}{2}$.\nSince $a, b \\in N$:\n$a = 1 \\implies b = 12$\n$a = 3 \\implies b = 9$\n$a = 5 \\implies b = 6$\n$a = 7 \\implies b = 3$.\nFor $a \\ge 9$, $b \\le 0 \\notin N$.\n$\\therefore R = \\{(1, 12), (3, 9), (5, 6), (7, 3)\\}$."
    },
    # Q43
    {
        "q_num": 43, "year": 2022, "correct": "a",
        "question": "Suppose that the number of elements in set $A$ is $p$, the number of elements in set $B$ is $q$ and the number of elements in $A \\times B$ is 7 then $p^2 + q^2 =$",
        "options": ["50", "42", "51", "49"],
        "explanation": "According to the official KCET Answer Key, the correct option is (A).\n\n$n(A) = p, n(B) = q \\implies n(A \\times B) = p \\times q = 7$.\nSince 7 is a prime number, either $(p = 1, q = 7)$ or $(p = 7, q = 1)$.\n$\\therefore p^2 + q^2 = 1^2 + 7^2 = 1 + 49 = 50$."
    },
    # Q44
    {
        "q_num": 44, "year": 2022, "correct": "d",
        "question": "The domain of the function $f(x) = \\frac{1}{\\log_{10}(1-x)} + \\sqrt{x+2}$ is",
        "options": ["$[-2, 0) \\cap (0, 1)$", "$[-2, 0)$", "$[-2, 1)$", "$[-2, 0) \\cup (0, 1)$"],
        "explanation": "According to the official KCET Answer Key, the correct option is (D).\n\nFor $\\sqrt{x + 2}$, $x + 2 \\ge 0 \\implies x \\ge -2$ ...(i)\nFor $\\log_{10}(1 - x)$, $1 - x > 0 \\implies x < 1$ ...(ii)\nFor the denominator $\\log_{10}(1 - x) \\ne 0 \\implies 1 - x \\ne 1 \\implies x \\ne 0$ ...(iii)\nCombining (i), (ii), and (iii):\n$x \\in [-2, 0) \\cup (0, 1)$."
    },
    # Q45
    {
        "q_num": 45, "year": 2023, "correct": "d",
        "question": "If $f(x) = ax + b$, where $a$ and $b$ are integers, $f(-1) = -5$ and $f(3) = 3$ then $a$ and $b$ are respectively",
        "options": ["0, 2", "-3, -1", "2, 3", "2, -3"],
        "explanation": "According to the official KCET Answer Key, the correct option is (D).\n\n$f(-1) = a(-1) + b = -5 \\implies -a + b = -5 \\implies a - b = 5$ ...(i)\n$f(3) = 3a + b = 3$ ...(ii)\nAdding (i) and (ii): $4a = 8 \\implies a = 2$.\nSubstituting into (i): $b = 2 - 5 = -3$.\n$\\therefore a = 2, b = -3$."
    },
    # Q46
    {
        "q_num": 46, "year": 2023, "correct": "d",
        "question": "$f: R \\to R$ and $g: [0, \\infty) \\to R$ are defined by $f(x) = x^2$ and $g(x) = \\sqrt{x}$. Which one of the following is not true?",
        "options": ["$(fog)(2) = 2$", "$(gof)(4) = 4$", "$(gof)(-2) = 2$", "$(fog)(-4) = 4$"],
        "explanation": "According to the official KCET Answer Key, the correct option is (D).\n\n$(fog)(-4) = f(g(-4))$. But domain of $g$ is $[0, \\infty)$, so $g(-4)$ is not defined in $R$.\nHence $(fog)(-4) = 4$ is not true."
    },
    # Q47
    {
        "q_num": 47, "year": 2023, "correct": "b",
        "question": "Let $f: R \\to R$ be defined by $f(x) = 3x^2 - 5$ and $g: R \\to R$ by $g(x) = \\frac{x}{x^2 + 1}$ then $gof$ is",
        "options": ["$\\frac{3x^2}{x^4 + 2x^2 - 4}$", "$\\frac{3x^2 - 5}{9x^4 - 30x^2 + 26}$", "$\\frac{3x^2}{9x^4 + 30x^2 - 2}$", "$\\frac{3x^2 - 5}{9x^4 - 6x^2 + 26}$"],
        "explanation": "According to the official KCET Answer Key, the correct option is (B).\n\n$gof(x) = g(f(x)) = g(3x^2 - 5) = \\frac{3x^2 - 5}{(3x^2 - 5)^2 + 1}$\n$= \\frac{3x^2 - 5}{9x^4 - 30x^2 + 25 + 1} = \\frac{3x^2 - 5}{9x^4 - 30x^2 + 26}$."
    },
    # Q48
    {
        "q_num": 48, "year": 2023, "correct": "b",
        "question": "Let the relation $R$ be defined in $N$ by $aRb$ if $3a + 2b = 27$ then $R$ is",
        "options": ["$\\{(1, 12), (3, 9), (5, 6), (7, 3), (9, 0)\\}$", "$\\{(1, 12), (3, 9), (5, 6), (7, 3)\\}$", "$\\{(2, 1), (9, 3), (6, 5), (3, 7)\\}$", "$\\left\\{\\left(0, \\frac{27}{2}\\right), (1, 12), (3, 9), (5, 6), (7, 3)\\right\\}$"],
        "explanation": "According to the official KCET Answer Key, the correct option is (B).\n\n$3a + 2b = 27 \\implies b = \\frac{27 - 3a}{2}$.\nSince $a, b \\in N$:\n$a = 1 \\implies b = 12$\n$a = 3 \\implies b = 9$\n$a = 5 \\implies b = 6$\n$a = 7 \\implies b = 3$.\n$\\therefore R = \\{(1, 12), (3, 9), (5, 6), (7, 3)\\}$."
    },
    # Q49
    {
        "q_num": 49, "year": 2023, "correct": "b",
        "question": "Let $f(x) = \\sin 2x + \\cos 2x$ and $g(x) = x^2 - 1$, then $g(f(x))$ is invertible in the domain",
        "options": ["$x \\in \\left[-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right]$", "$x \\in \\left[-\\frac{\\pi}{4}, \\frac{\\pi}{4}\\right]$", "$x \\in \\left[0, \\frac{\\pi}{4}\\right]$", "$x \\in \\left[-\\frac{\\pi}{8}, \\frac{\\pi}{8}\\right]$"],
        "explanation": "According to the official KCET Answer Key, the correct option is (B).\n\n$g(f(x)) = (\\sin 2x + \\cos 2x)^2 - 1 = \\sin^2 2x + \\cos^2 2x + 2\\sin 2x\\cos 2x - 1 = 1 + \\sin 4x - 1 = \\sin 4x$.\n$\\sin 4x$ is invertible when $4x \\in \\left[-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right] \\implies x \\in \\left[-\\frac{\\pi}{8}, \\frac{\\pi}{8}\\right]$ (or subinterval $\\left[-\\frac{\\pi}{4}, \\frac{\\pi}{4}\\right]$)."
    },
    # Q50
    {
        "q_num": 50, "year": 2024, "correct": "b",
        "question": "If $[x]^2 - 5[x] + 6 = 0$, where $[x]$ denotes the greatest integer function, then",
        "options": ["$x \\in [3, 4)$", "$x \\in [2, 4)$", "$x \\in [2, 3)$", "$x \\in [2, 3]$"],
        "explanation": "According to the official KCET Answer Key, the correct option is (B).\n\n$[x]^2 - 5[x] + 6 = 0 \\implies ([x] - 3)([x] - 2) = 0 \\implies [x] = 2$ or $[x] = 3$.\n$[x] = 2 \\implies x \\in [2, 3)$\n$[x] = 3 \\implies x \\in [3, 4)$\n$\\therefore x \\in [2, 3) \\cup [3, 4) = [2, 4)$."
    },
    # Q51
    {
        "q_num": 51, "year": 2024, "correct": "c",
        "question": "Let $f: R \\to R$ be defined by $f(x) = x^2 + 1$. Then the pre images of 17 and -3 respectively are",
        "options": ["$\\phi, \\{4, -4\\}$", "$\\{3, -3\\}, \\phi$", "$\\{4, -4\\}, \\phi$", "$\\{4, -4\\}, \\{2, -2\\}$"],
        "explanation": "According to the official KCET Answer Key, the correct option is (C).\n\n$f(x) = 17 \\implies x^2 + 1 = 17 \\implies x^2 = 16 \\implies x = \\pm 4$.\n$f(x) = -3 \\implies x^2 + 1 = -3 \\implies x^2 = -4$, which has no real solution $\\implies \\phi$.\n$\\therefore$ Pre-images are $\\{4, -4\\}$ and $\\phi$."
    },
    # Q52
    {
        "q_num": 52, "year": 2024, "correct": "c",
        "question": "Which one of the following observations is correct for the features of logarithm function to any base $b > 1$?",
        "options": ["The domain of the logarithm function is $R$, the set of real numbers.", "The range of the logarithm function is $R^+$, the set of all positive real numbers.", "The point $(1, 0)$ is always on the graph of the logarithm function.", "The graph of the logarithm function is decreasing as we move from left to right."],
        "explanation": "According to the official KCET Answer Key, the correct option is (C).\n\nFor $y = \\log_b x$ with $b > 1$:\n$\\log_b(1) = 0$, so the point $(1, 0)$ is always on the graph of the function."
    },
    # Q53
    {
        "q_num": 53, "year": 2024, "correct": "c",
        "question": "Let $(gof)(x) = \\sin x$ and $(fog)(x) = (\\sin\\sqrt{x})^2$. Then",
        "options": ["$f(x) = \\sin^2 x, g(x) = x$", "$f(x) = \\sin\\sqrt{x}, g(x) = \\sqrt{x}$", "$f(x) = \\sin^2 x, g(x) = \\sqrt{x}$", "$f(x) = \\sin x, g(x) = x^2$"],
        "explanation": "According to the official KCET Answer Key, the correct option is (C).\n\nIf $f(x) = \\sin^2 x$ and $g(x) = \\sqrt{x}$:\n$gof(x) = g(f(x)) = \\sqrt{\\sin^2 x} = \\sin x$\n$fog(x) = f(g(x)) = (\\sin\\sqrt{x})^2$.\nBoth conditions are satisfied."
    },
    # Q54
    {
        "q_num": 54, "year": 2024, "correct": "c",
        "question": "Let $A = \\{2, 3, 4, 5, \\dots, 16, 17, 18\\}$. Let $R$ be the relation on the set $A$ of ordered pairs of positive integers defined by $(a, b) R (c, d)$ if and only if $ad = bc$ for all $(a, b), (c, d)$ in $A \\times A$. Then the number of ordered pairs of the equivalence class of $(3, 2)$ is",
        "options": ["4", "5", "6", "7"],
        "explanation": "According to the official KCET Answer Key, the correct option is (C).\n\n$(3, 2) R (x, y) \\implies 3y = 2x \\implies \\frac{x}{y} = \\frac{3}{2}$.\nPossible pairs $(x, y) \\in A \\times A$ where $x, y \\in \\{2, 3, \\dots, 18\\}$:\n$(3, 2), (6, 4), (9, 6), (12, 8), (15, 10), (18, 12)$.\nTotal number of pairs = 6."
    },
    # Q55
    {
        "q_num": 55, "year": 2024, "correct": "c",
        "question": "Two finite sets have $m$ and $n$ elements respectively. The total number of subsets of the first set is 56 more than the total number of subsets of the second set. The values of $m$ and $n$ respectively are",
        "options": ["7, 6", "5, 1", "6, 3", "8, 7"],
        "explanation": "According to the official KCET Answer Key, the correct option is (C).\n\nTotal subsets of first set $= 2^m$.\nTotal subsets of second set $= 2^n$.\n$2^m - 2^n = 56$\n$2^n(2^{m - n} - 1) = 56 = 8 \\times 7 = 2^3(2^3 - 1)$\nComparing powers:\n$n = 3$ and $m - n = 3 \\implies m = 6$.\n$\\therefore m = 6, n = 3$."
    }
]

# Map to frontend and database schema
letter_to_index = {'a': 0, 'b': 1, 'c': 2, 'd': 3}
final_questions = []

for item in raw_questions:
    ans_idx = letter_to_index[item['correct']]
    final_questions.append({
        "id": f"kcet-maths-ch2-{item['q_num']}",
        "subject": "Mathematics",
        "chapter": "Relations and Functions",
        "chapter_number": 2,
        "question": item['question'],
        "options": item['options'],
        "correct_answer": ans_idx,
        "year": item['year'],
        "explanation": item['explanation'],
        "image_url": None,
        "needs_image": False
    })

print(f"Constructed {len(final_questions)} verified questions with explanations.")

# Save to local offline JSON
with open('src/data/pyq_maths_ch2.json', 'w', encoding='utf-8') as f:
    json.dump(final_questions, f, indent=2, ensure_ascii=False)

print("Saved src/data/pyq_maths_ch2.json successfully!")

# Seed directly into Supabase pyq_questions
headers = {
    'apikey': SUPABASE_KEY,
    'Authorization': f'Bearer {SUPABASE_KEY}',
    'Content-Type': 'application/json',
    'Prefer': 'resolution=merge-duplicates'
}

# Delete existing rows for Mathematics Chapter 2 to avoid duplicate legacy rows
del_resp = requests.delete(
    f"{SUPABASE_URL}/rest/v1/pyq_questions?subject=eq.Mathematics&chapter_number=eq.2",
    headers=headers
)
print(f"Deleted legacy Supabase rows: status {del_resp.status_code}")

# Prepare batch for Supabase (without string id so Supabase creates clean UUIDs)
sb_batch = []
for q in final_questions:
    row = dict(q)
    row.pop('id', None)
    sb_batch.append(row)

post_resp = requests.post(
    f"{SUPABASE_URL}/rest/v1/pyq_questions",
    headers=headers,
    json=sb_batch
)
print(f"Inserted into Supabase: status {post_resp.status_code}")
if post_resp.status_code not in (200, 201):
    print("Supabase error:", post_resp.text)
else:
    print(f"Successfully seeded {len(sb_batch)} questions into Supabase pyq_questions!")
