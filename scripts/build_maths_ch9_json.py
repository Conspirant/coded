import json

questions = [
  {
    "id": "math_ch9_q1",
    "subject": "Mathematics",
    "chapter": "Straight Lines",
    "chapter_number": 9,
    "year": 2006,
    "question": "If the lines $x + 3y - 9 = 0$, $4x + by - 2 = 0$ and $2x - y - 4 = 0$ are concurrent, then $b$ equals",
    "options": [
      "-5",
      "5",
      "1",
      "0"
    ],
    "correct_answer": 0,
    "explanation": "For three straight lines $a_1 x + b_1 y + c_1 = 0$, $a_2 x + b_2 y + c_2 = 0$, and $a_3 x + b_3 y + c_3 = 0$ to be concurrent, the determinant of their coefficients must vanish:\n$$\\begin{vmatrix} 1 & 3 & -9 \\\\ 4 & b & -2 \\\\ 2 & -1 & -4 \\end{vmatrix} = 0$$\nExpanding along row 1:\n$$1(-4b - 2) - 3(-16 + 4) - 9(-4 - 2b) = 0$$\n$$-4b - 2 - 3(-12) + 36 + 18b = 0$$\n$$14b - 2 + 36 + 36 = 0 \\implies 14b + 70 = 0 \\implies b = -5$$",
    "needs_image": False
  },
  {
    "id": "math_ch9_q2",
    "subject": "Mathematics",
    "chapter": "Straight Lines",
    "chapter_number": 9,
    "year": 2007,
    "question": "ABC is a triangle. $G$ is the centroid. $D$ is the mid point of $BC$. If $A = (2, 3)$ and $G = (7, 5)$, then the point $D$ is",
    "options": [
      "$\\left(\\frac{9}{2}, 4\\right)$",
      "$\\left(\\frac{19}{2}, 6\\right)$",
      "$\\left(\\frac{11}{2}, \\frac{11}{2}\\right)$",
      "$\\left(8, \\frac{13}{2}\\right)$"
    ],
    "correct_answer": 1,
    "explanation": "The centroid $G$ divides each median $AD$ internally in the ratio $2 : 1$, where $A = (2, 3)$, $G = (7, 5)$, and $D = (x, y)$ is the midpoint of $BC$.\nUsing section formula:\n$$G = \\left(\\frac{2x + 1(2)}{2 + 1}, \\frac{2y + 1(3)}{2 + 1}\\right) = (7, 5)$$\nEquating components:\n$$\\frac{2x + 2}{3} = 7 \\implies 2x + 2 = 21 \\implies x = \\frac{19}{2}$$\n$$\\frac{2y + 3}{3} = 5 \\implies 2y + 3 = 15 \\implies y = 6$$\nTherefore, $D = \\left(\\frac{19}{2}, 6\\right)$.",
    "needs_image": False
  },
  {
    "id": "math_ch9_q3",
    "subject": "Mathematics",
    "chapter": "Straight Lines",
    "chapter_number": 9,
    "year": 2007,
    "question": "The orthocentre of the triangle with vertices $A(0, 0)$, $B\\left(0, \\frac{3}{2}\\right)$, $C(-5, 0)$ is",
    "options": [
      "$\\left(\\frac{5}{2}, \\frac{3}{4}\\right)$",
      "$\\left(\\frac{-5}{2}, \\frac{3}{4}\\right)$",
      "$\\left(-5, \\frac{3}{2}\\right)$",
      "$(0, 0)$"
    ],
    "correct_answer": 3,
    "explanation": "Vertex $A(0, 0)$ is the origin, $B\\left(0, \\frac{3}{2}\\right)$ lies on the $y$-axis, and $C(-5, 0)$ lies on the $x$-axis.\nBecause the $x$-axis and $y$-axis are perpendicular, the angle at vertex $A$ is $\\angle BAC = 90^\\circ$.\nIn any right-angled triangle, the orthocentre coincides with the vertex containing the right angle. Hence, the orthocentre of $\\triangle ABC$ is $A(0, 0)$.",
    "needs_image": False
  },
  {
    "id": "math_ch9_q4",
    "subject": "Mathematics",
    "chapter": "Straight Lines",
    "chapter_number": 9,
    "year": 2007,
    "question": "The co-ordinates of the foot of the perpendicular drawn from the point $(3, 4)$ on the line $2x + y - 7 = 0$ is",
    "options": [
      "$\\left(\\frac{9}{5}, \\frac{17}{5}\\right)$",
      "$(1, 5)$",
      "$(-5, 1)$",
      "$(1, -5)$"
    ],
    "correct_answer": 0,
    "explanation": "The coordinates of the foot of the perpendicular $(h, k)$ from $(x_1, y_1) = (3, 4)$ onto the line $ax + by + c = 0$ ($2x + y - 7 = 0$) satisfy:\n$$\\frac{h - x_1}{a} = \\frac{k - y_1}{b} = -\\frac{ax_1 + by_1 + c}{a^2 + b^2}$$\nHere $a = 2, b = 1, c = -7$:\n$$\\frac{h - 3}{2} = \\frac{k - 4}{1} = -\\frac{2(3) + 1(4) - 7}{2^2 + 1^2} = -\\frac{3}{5}$$\nSolving for $h$ and $k$:\n$$h = 3 + 2\\left(-\\frac{3}{5}\\right) = 3 - \\frac{6}{5} = \\frac{9}{5}$$\n$$k = 4 + 1\\left(-\\frac{3}{5}\\right) = 4 - \\frac{3}{5} = \\frac{17}{5}$$\nThus, the foot of the perpendicular is $\\left(\\frac{9}{5}, \\frac{17}{5}\\right)$.",
    "needs_image": False
  },
  {
    "id": "math_ch9_q5",
    "subject": "Mathematics",
    "chapter": "Straight Lines",
    "chapter_number": 9,
    "year": 2008,
    "question": "The centroid of the triangle $ABC$ where $A \\equiv (2, 3)$, $B \\equiv (8, 10)$ and $C \\equiv (5, 5)$ is",
    "options": [
      "$(6, 6)$",
      "$(15, 18)$",
      "$(5, 6)$",
      "$(6, 5)$"
    ],
    "correct_answer": 2,
    "explanation": "The centroid $G(x, y)$ of a triangle with vertices $(x_1, y_1)$, $(x_2, y_2)$, $(x_3, y_3)$ is given by:\n$$G = \\left(\\frac{x_1 + x_2 + x_3}{3}, \\frac{y_1 + y_2 + y_3}{3}\\right)$$\nSubstituting $A(2, 3)$, $B(8, 10)$, and $C(5, 5)$:\n$$G = \\left(\\frac{2 + 8 + 5}{3}, \\frac{3 + 10 + 5}{3}\\right) = \\left(\\frac{15}{3}, \\frac{18}{3}\\right) = (5, 6)$$",
    "needs_image": False
  },
  {
    "id": "math_ch9_q6",
    "subject": "Mathematics",
    "chapter": "Straight Lines",
    "chapter_number": 9,
    "year": 2009,
    "question": "If $ax + by = 1$, where $a, b, x$ and $y$ are integers, then which one of the following is not true ?",
    "options": [
      "$(b, y) = 1$",
      "$(a, b) = 1$",
      "$(a, y) = 1$",
      "$(x, y) = 1$"
    ],
    "correct_answer": 3,
    "explanation": "By Bézout's identity, the linear Diophantine equation $ax + by = 1$ has integer solutions if and only if $\\gcd(a, b) = 1$. Similarly, rewrite as $a(x) + y(b) = 1$ gives $\\gcd(a, y) = 1$, and $b(y) + x(a) = 1$ gives $\\gcd(b, x) = 1$. However, the integer solution values $x$ and $y$ themselves need not be coprime; $\\gcd(x, y) = 1$ is not necessarily true.",
    "needs_image": False
  },
  {
    "id": "math_ch9_q7",
    "subject": "Mathematics",
    "chapter": "Straight Lines",
    "chapter_number": 9,
    "year": 2009,
    "question": "The foot of the perpendicular from the point $(2, 4)$ upon $x + y = 4$ is",
    "options": [
      "$(1, 3)$",
      "$(3, -1)$",
      "$(2, 2)$",
      "$(4, 0)$"
    ],
    "correct_answer": 0,
    "explanation": "Let the foot of the perpendicular from $(x_1, y_1) = (2, 4)$ on the line $x + y - 4 = 0$ be $(h, k)$.\nUsing the formula:\n$$\\frac{h - x_1}{a} = \\frac{k - y_1}{b} = -\\frac{ax_1 + by_1 + c}{a^2 + b^2}$$\nHere $a = 1, b = 1, c = -4$:\n$$\\frac{h - 2}{1} = \\frac{k - 4}{1} = -\\frac{1(2) + 1(4) - 4}{1^2 + 1^2} = -\\frac{2}{2} = -1$$\n$$\\implies h = 2 - 1 = 1, \\quad k = 4 - 1 = 3$$\nThus, the foot of the perpendicular is $(1, 3)$.",
    "needs_image": False
  },
  {
    "id": "math_ch9_q8",
    "subject": "Mathematics",
    "chapter": "Straight Lines",
    "chapter_number": 9,
    "year": 2009,
    "question": "The vertices of triangle are $(6, 0)$, $(0, 6)$ and $(6, 6)$. The distance between its circumcentre and centroid is",
    "options": [
      "$1$",
      "$2\\sqrt{2}$",
      "$2$",
      "$\\sqrt{2}$"
    ],
    "correct_answer": 3,
    "explanation": "Let $A = (6, 0)$, $B = (0, 6)$, and $C = (6, 6)$.\nCalculating squared side lengths:\n$$AB^2 = (6 - 0)^2 + (0 - 6)^2 = 72$$\n$$BC^2 = (6 - 0)^2 + (6 - 6)^2 = 36$$\n$$CA^2 = (6 - 6)^2 + (6 - 0)^2 = 36$$\nSince $BC^2 + CA^2 = 36 + 36 = 72 = AB^2$, $\\triangle ABC$ is a right-angled triangle with hypotenuse $AB$ and right angle at $C(6, 6)$.\n1. Circumcentre $O$ is the midpoint of hypotenuse $AB$:\n$$O = \\left(\\frac{6 + 0}{2}, \\frac{0 + 6}{2}\\right) = (3, 3)$$\n2. Centroid $G$ is:\n$$G = \\left(\\frac{6 + 0 + 6}{3}, \\frac{0 + 6 + 6}{3}\\right) = (4, 4)$$\n3. The distance between circumcentre and centroid is:\n$$OG = \\sqrt{(4 - 3)^2 + (4 - 3)^2} = \\sqrt{1 + 1} = \\sqrt{2}$$",
    "needs_image": False
  },
  {
    "id": "math_ch9_q9",
    "subject": "Mathematics",
    "chapter": "Straight Lines",
    "chapter_number": 9,
    "year": 2010,
    "question": "The line joining $A(2, -7)$ and $B(6, 5)$ is divided into 4 equal parts by the points $P$, $Q$ and $R$ such that $AQ = RP = QB$. The midpoint of $PR$ is",
    "options": [
      "$(-8, 1)$",
      "$(4, 12)$",
      "$(8, -2)$",
      "$(4, -1)$"
    ],
    "correct_answer": 3,
    "explanation": "Since points $P, Q, R$ divide the segment $AB$ into 4 equal parts, $Q$ is both the midpoint of segment $AB$ and the midpoint of segment $PR$.\nCoordinates of midpoint $Q$:\n$$Q = \\left(\\frac{x_1 + x_2}{2}, \\frac{y_1 + y_2}{2}\\right) = \\left(\\frac{2 + 6}{2}, \\frac{-7 + 5}{2}\\right) = \\left(\\frac{8}{2}, \\frac{-2}{2}\\right) = (4, -1)$$",
    "needs_image": False
  },
  {
    "id": "math_ch9_q10",
    "subject": "Mathematics",
    "chapter": "Straight Lines",
    "chapter_number": 9,
    "year": 2011,
    "question": "If lines represented by $x + 3y - 6 = 0$, $2x + y - 4 = 0$ and $kx - 3y + 1 = 0$ are concurrent, then the value of $k$ is",
    "options": [
      "$6/19$",
      "$19/6$",
      "$-19/6$",
      "$-6/19$"
    ],
    "correct_answer": 1,
    "explanation": "For concurrency of three lines, the coefficient determinant must equal zero:\n$$\\begin{vmatrix} 1 & 3 & -6 \\\\ 2 & 1 & -4 \\\\ k & -3 & 1 \\end{vmatrix} = 0$$\nExpanding along row 3:\n$$k(-12 - (-6)) - (-3)(-4 - (-12)) + 1(1 - 6) = 0$$\n$$k(-6) + 3(8) - 5 = 0 \\implies -6k + 19 = 0 \\implies k = \\frac{19}{6}$$",
    "needs_image": False
  },
  {
    "id": "math_ch9_q11",
    "subject": "Mathematics",
    "chapter": "Straight Lines",
    "chapter_number": 9,
    "year": 2012,
    "question": "The points $(11, 9)$, $(2, 1)$ and $(2, -1)$ are the midpoints of the sides of the triangle. Then the centroid is",
    "options": [
      "$(5, 3)$",
      "$(-5, -3)$",
      "$(5, -3)$",
      "$(3, 5)$"
    ],
    "correct_answer": 0,
    "explanation": "The centroid of the triangle formed by connecting the midpoints of the sides of any triangle is identical to the centroid of the parent triangle.\n$$G = \\left(\\frac{11 + 2 + 2}{3}, \\frac{9 + 1 + (-1)}{3}\\right) = \\left(\\frac{15}{3}, \\frac{9}{3}\\right) = (5, 3)$$",
    "needs_image": False
  },
  {
    "id": "math_ch9_q12",
    "subject": "Mathematics",
    "chapter": "Straight Lines",
    "chapter_number": 9,
    "year": 2012,
    "question": "The reflection of the point $(1, 1)$ along the line $y = -x$ is",
    "options": [
      "$(1, -1)$",
      "$(0, 0)$",
      "$(-1, 1)$",
      "$(-1, -1)$"
    ],
    "correct_answer": 3,
    "explanation": "The image (reflection) of a point $(x_1, y_1)$ across the line $x + y = 0$ (or $y = -x$) is obtained by interchanging the coordinates and reversing their signs: $(x', y') = (-y_1, -x_1)$.\nFor the point $(1, 1)$, its reflection is $(-1, -1)$.",
    "needs_image": False
  },
  {
    "id": "math_ch9_q13",
    "subject": "Mathematics",
    "chapter": "Straight Lines",
    "chapter_number": 9,
    "year": 2013,
    "question": "If the line $6x - 7y + 8 + \\lambda(3x - y + 5) = 0$ is parallel to $y$-axis, then $\\lambda =$",
    "options": [
      "$-7$",
      "$-2$",
      "$7$",
      "$2$"
    ],
    "correct_answer": 0,
    "explanation": "Grouping like terms in standard form $Ax + By + C = 0$:\n$$(6 + 3\\lambda)x + (-7 - \\lambda)y + (8 + 5\\lambda) = 0$$\nA straight line is parallel to the $y$-axis (vertical line) when the coefficient of $y$ vanishes ($B = 0$):\n$$-7 - \\lambda = 0 \\implies \\lambda = -7$$",
    "needs_image": False
  },
  {
    "id": "math_ch9_q14",
    "subject": "Mathematics",
    "chapter": "Straight Lines",
    "chapter_number": 9,
    "year": 2013,
    "question": "The minimum area of the triangle formed by the variable line $3\\cos\\theta \\cdot x + 4\\sin\\theta \\cdot y = 12$ and the co-ordinate axes is",
    "options": [
      "$144$",
      "$25/2$",
      "$49/4$",
      "$12$"
    ],
    "correct_answer": 3,
    "explanation": "Convert the equation into intercept form $\\frac{x}{a} + \\frac{y}{b} = 1$:\n$$\\frac{x}{4/\\cos\\theta} + \\frac{y}{3/\\sin\\theta} = 1$$\nHere $a = \\frac{4}{\\cos\\theta}$ and $b = \\frac{3}{\\sin\\theta}$.\nThe area $\\Delta$ of the triangle formed with the axes is:\n$$\\Delta = \\frac{1}{2}|a \\cdot b| = \\frac{1}{2} \\cdot \\frac{12}{|\\sin\\theta\\cos\\theta|} = \\frac{12}{|2\\sin\\theta\\cos\\theta|} = \\frac{12}{|\\sin 2\\theta|}$$\nSince $|\\sin 2\\theta| \\le 1$, the minimum area occurs when $|\\sin 2\\theta| = 1$:\n$$\\Delta_{\\min} = \\frac{12}{1} = 12$$",
    "needs_image": False
  },
  {
    "id": "math_ch9_q15",
    "subject": "Mathematics",
    "chapter": "Straight Lines",
    "chapter_number": 9,
    "year": 2014,
    "question": "A straight line passes through the points $(5, 0)$ and $(0, 3)$. The length of perpendicular from the point $(4, 4)$ on the line is",
    "options": [
      "$\\frac{15}{\\sqrt{34}}$",
      "$\\frac{\\sqrt{17}}{2}$",
      "$\\frac{17}{2}$",
      "$\\sqrt{\\frac{17}{2}}$"
    ],
    "correct_answer": 3,
    "explanation": "Equation of the line passing through $(5, 0)$ and $(0, 3)$ in intercept form:\n$$\\frac{x}{5} + \\frac{y}{3} = 1 \\implies 3x + 5y - 15 = 0$$\nThe perpendicular distance $p$ from the point $(4, 4)$ is:\n$$p = \\frac{|3(4) + 5(4) - 15|}{\\sqrt{3^2 + 5^2}} = \\frac{|12 + 20 - 15|}{\\sqrt{34}} = \\frac{17}{\\sqrt{34}} = \\frac{\\sqrt{17} \\times \\sqrt{17}}{\\sqrt{17} \\times \\sqrt{2}} = \\sqrt{\\frac{17}{2}}$$",
    "needs_image": False
  },
  {
    "id": "math_ch9_q16",
    "subject": "Mathematics",
    "chapter": "Straight Lines",
    "chapter_number": 9,
    "year": 2015,
    "question": "A line passes through $(2, 2)$ and is perpendicular to the line $3x + y = 3$. Its $y$-intercept is",
    "options": [
      "$2/3$",
      "$1$",
      "$1/3$",
      "$4/3$"
    ],
    "correct_answer": 3,
    "explanation": "The slope of the line $3x + y = 3$ is $m_1 = -3$.\nThe slope of a line perpendicular to it is $m = -\\frac{1}{m_1} = \\frac{1}{3}$.\nEquation of the line passing through $(2, 2)$:\n$$y - 2 = \\frac{1}{3}(x - 2) \\implies 3y - 6 = x - 2 \\implies x - 3y = -4$$\nExpressing in intercept form $\\frac{x}{-4} + \\frac{y}{4/3} = 1$, the $y$-intercept is $\\frac{4}{3}$.",
    "needs_image": False
  },
  {
    "id": "math_ch9_q17",
    "subject": "Mathematics",
    "chapter": "Straight Lines",
    "chapter_number": 9,
    "year": 2016,
    "question": "If the straight lines $2x + 3y - 3 = 0$ and $x + ky + 7 = 0$ are perpendicular, then the value of $k$ is",
    "options": [
      "$2/3$",
      "$3/2$",
      "$-2/3$",
      "$-3/2$"
    ],
    "correct_answer": 2,
    "explanation": "Two lines $a_1 x + b_1 y + c_1 = 0$ and $a_2 x + b_2 y + c_2 = 0$ are perpendicular if and only if:\n$$a_1 a_2 + b_1 b_2 = 0$$\nSubstituting $a_1 = 2, b_1 = 3, a_2 = 1, b_2 = k$:\n$$2(1) + 3(k) = 0 \\implies 2 + 3k = 0 \\implies k = -\\frac{2}{3}$$",
    "needs_image": False
  },
  {
    "id": "math_ch9_q18",
    "subject": "Mathematics",
    "chapter": "Straight Lines",
    "chapter_number": 9,
    "year": 2017,
    "question": "Equation of line passing through the point $(1, 2)$ and perpendicular to the line $y = 3x - 1$ is",
    "options": [
      "$x - 3y = 0$",
      "$x + 3y = 0$",
      "$x + 3y - 7 = 0$",
      "$x + 3y + 7 = 0$"
    ],
    "correct_answer": 2,
    "explanation": "The slope of the line $y = 3x - 1$ is $m = 3$.\nThe slope of any line perpendicular to it is $m' = -\\frac{1}{3}$.\nUsing point-slope form for $(x_1, y_1) = (1, 2)$:\n$$y - 2 = -\\frac{1}{3}(x - 1) \\implies 3(y - 2) = -x + 1 \\implies x + 3y - 7 = 0$$",
    "needs_image": False
  },
  {
    "id": "math_ch9_q19",
    "subject": "Mathematics",
    "chapter": "Straight Lines",
    "chapter_number": 9,
    "year": 2018,
    "question": "The equation of the line parallel to the line $3x - 4y + 2 = 0$ and passing through $(-2, 3)$ is",
    "options": [
      "$3x - 4y + 18 = 0$",
      "$3x - 4y - 18 = 0$",
      "$3x + 4y + 18 = 0$",
      "$3x + 4y - 18 = 0$"
    ],
    "correct_answer": 0,
    "explanation": "Any line parallel to $3x - 4y + 2 = 0$ has the form $3x - 4y + k = 0$.\nSubstituting the coordinates $(-2, 3)$:\n$$3(-2) - 4(3) + k = 0 \\implies -6 - 12 + k = 0 \\implies k = 18$$\nThus, the equation is $3x - 4y + 18 = 0$.",
    "needs_image": False
  },
  {
    "id": "math_ch9_q20",
    "subject": "Mathematics",
    "chapter": "Straight Lines",
    "chapter_number": 9,
    "year": 2019,
    "question": "A line cuts off equal intercepts on the co-ordinate axes. The angle made by this line with the positive direction of X-axis is",
    "options": [
      "$45^\\circ$",
      "$120^\\circ$",
      "$90^\\circ$",
      "$135^\\circ$"
    ],
    "correct_answer": 3,
    "explanation": "The intercept equation of a line with equal non-zero intercepts $a$ is:\n$$\\frac{x}{a} + \\frac{y}{a} = 1 \\implies x + y = a \\implies y = -x + a$$\nThe slope of the line is $m = -1$.\nSince $m = \\tan\\theta = -1$, the angle $\\theta$ made with the positive $x$-axis is:\n$$\\theta = 180^\\circ - 45^\\circ = 135^\\circ$$",
    "needs_image": False
  },
  {
    "id": "math_ch9_q21",
    "subject": "Mathematics",
    "chapter": "Straight Lines",
    "chapter_number": 9,
    "year": 2020,
    "question": "The two lines $lx + my = n$ and $l'x + m'y = n'$ are perpendicular if",
    "options": [
      "$lm' = ml'$",
      "$lm + l'm' = 0$",
      "$lm' + ml' = 0$",
      "$ll' + mm' = 0$"
    ],
    "correct_answer": 3,
    "explanation": "The slopes of the two lines are $m_1 = -\\frac{l}{m}$ and $m_2 = -\\frac{l'}{m'}$.\nFor perpendicular lines:\n$$m_1 m_2 = -1 \\implies \\left(-\\frac{l}{m}\\right)\\left(-\\frac{l'}{m'}\\right) = -1 \\implies \\frac{ll'}{mm'} = -1 \\implies ll' + mm' = 0$$",
    "needs_image": False
  },
  {
    "id": "math_ch9_q22",
    "subject": "Mathematics",
    "chapter": "Straight Lines",
    "chapter_number": 9,
    "year": 2022,
    "question": "If the straight line $2x - 3y + 17 = 0$ is perpendicular to the line passing through the points $(7, 17)$ and $(15, \\beta)$, then $\\beta$ equals",
    "options": [
      "$-5$",
      "$29$",
      "$5$",
      "$-29$"
    ],
    "correct_answer": 2,
    "explanation": "Slope of line $2x - 3y + 17 = 0$ is $m_1 = \\frac{2}{3}$.\nSlope of line joining $(7, 17)$ and $(15, \\beta)$ is $m_2 = \\frac{\\beta - 17}{15 - 7} = \\frac{\\beta - 17}{8}$.\nSince the lines are perpendicular:\n$$m_1 m_2 = -1 \\implies \\left(\\frac{2}{3}\\right)\\left(\\frac{\\beta - 17}{8}\\right) = -1 \\implies \\frac{\\beta - 17}{12} = -1 \\implies \\beta - 17 = -12 \\implies \\beta = 5$$",
    "needs_image": False
  },
  {
    "id": "math_ch9_q23",
    "subject": "Mathematics",
    "chapter": "Straight Lines",
    "chapter_number": 9,
    "year": 2023,
    "question": "A line passes through $(2, 2)$ and is perpendicular to the line $3x + y = 3$. Its $y$-intercept is",
    "options": [
      "$1$",
      "$1/3$",
      "$4/3$",
      "$2/3$"
    ],
    "correct_answer": 2,
    "explanation": "Slope of line $3x + y = 3$ is $m_1 = -3$.\nSlope of perpendicular line is $m = \\frac{1}{3}$.\nEquation of the line passing through $(2, 2)$:\n$$y - 2 = \\frac{1}{3}(x - 2) \\implies 3y - 6 = x - 2 \\implies x - 3y + 4 = 0$$\nSetting $x = 0$ gives $y = \\frac{4}{3}$.",
    "needs_image": False
  },
  {
    "id": "math_ch9_q24",
    "subject": "Mathematics",
    "chapter": "Straight Lines",
    "chapter_number": 9,
    "year": 2024,
    "question": "The angle between the line $x + y = 3$ and the line joining the points $(1, 1)$ and $(-3, 4)$ is",
    "options": [
      "$\\tan^{-1}(7)$",
      "$\\tan^{-1}\\left(-\\frac{1}{7}\\right)$",
      "$\\tan^{-1}\\left(\\frac{1}{7}\\right)$",
      "$\\tan^{-1}\\left(\\frac{2}{7}\\right)$"
    ],
    "correct_answer": 2,
    "explanation": "Slope of the line $x + y = 3$ is $m_1 = -1$.\nSlope of the line joining $(1, 1)$ and $(-3, 4)$ is $m_2 = \\frac{4 - 1}{-3 - 1} = -\\frac{3}{4}$.\nThe acute angle $\\theta$ between them is given by:\n$$\\tan\\theta = \\left|\\frac{m_2 - m_1}{1 + m_1 m_2}\\right| = \\left|\\frac{-\\frac{3}{4} - (-1)}{1 + (-1)\\left(-\\frac{3}{4}\\right)}\\right| = \\left|\\frac{\\frac{1}{4}}{\\frac{7}{4}}\\right| = \\frac{1}{7}$$\n$$\\implies \\theta = \\tan^{-1}\\left(\\frac{1}{7}\\right)$$",
    "needs_image": False
  }
]

with open('src/data/pyq_maths_ch9.json', 'w', encoding='utf-8') as f:
    json.dump(questions, f, indent=2, ensure_ascii=False)

print(f"Successfully generated src/data/pyq_maths_ch9.json with {len(questions)} questions.")
