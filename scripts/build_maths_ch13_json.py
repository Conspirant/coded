import json

# Full dataset of 106 questions for Mathematics Chapter 13: Matrices and Determinants
raw_questions = [
    # Q1
    {
        "qnum": 1, "year": 2006,
        "question": "If $2A + 3B = \\begin{bmatrix} 2 & -1 & 4 \\\\ 3 & 2 & 5 \\end{bmatrix}$ and $A + 2B = \\begin{bmatrix} 5 & 0 & 3 \\\\ 1 & 6 & 2 \\end{bmatrix}$, then $B =$",
        "options": [
            "\\begin{bmatrix} 8 & -1 & 2 \\\\ -1 & 10 & -1 \\end{bmatrix}",
            "\\begin{bmatrix} 8 & 1 & 2 \\\\ -1 & 10 & -1 \\end{bmatrix}",
            "\\begin{bmatrix} 8 & 1 & -2 \\\\ -1 & 10 & -1 \\end{bmatrix}",
            "\\begin{bmatrix} 8 & 1 & 2 \\\\ 1 & 10 & 1 \\end{bmatrix}"
        ],
        "ans": "b",
        "explanation": "Given $2A + 3B = \\begin{bmatrix} 2 & -1 & 4 \\\\ 3 & 2 & 5 \\end{bmatrix}$ ...(i) and $A + 2B = \\begin{bmatrix} 5 & 0 & 3 \\\\ 1 & 6 & 2 \\end{bmatrix}$.\nMultiplying second equation by 2: $2A + 4B = \\begin{bmatrix} 10 & 0 & 6 \\\\ 2 & 12 & 4 \\end{bmatrix}$ ...(ii).\nSubtracting (ii) from (i):\n$$-B = \\begin{bmatrix} -8 & -1 & -2 \\\\ 1 & -10 & 1 \\end{bmatrix} \\implies B = \\begin{bmatrix} 8 & 1 & 2 \\\\ -1 & 10 & -1 \\end{bmatrix}$$"
    },
    # Q2
    {
        "qnum": 2, "year": 2006,
        "question": "If $O(A) = 2 \\times 3$, $O(B) = 3 \\times 2$, and $O(C) = 3 \\times 3$, which one of the following is not defined?",
        "options": ["CB + A'", "BAC", "C(A + B')'", "C(A + B')"],
        "ans": "d",
        "explanation": "$O(A) = 2 \\times 3 \\implies O(B') = 2 \\times 3 \\implies O(A + B') = 2 \\times 3$.\nFor product $C(A + B')$ to exist, number of columns of $C$ (3) must equal number of rows of $(A + B')$ (2). Since $3 \\neq 2$, $C(A + B')$ is not defined."
    },
    # Q3
    {
        "qnum": 3, "year": 2006,
        "question": "If $A = \\begin{bmatrix} 1 & -3 \\\\ 2 & k \\end{bmatrix}$ and $A^2 - 4A + 10I = A$, then $k =$",
        "options": ["0", "-4", "4 and not 1", "1 or 4"],
        "ans": "d",
        "explanation": "$$A^2 = \\begin{bmatrix} -5 & -3-3k \\\\ 2+2k & -6+k^2 \\end{bmatrix}$$\n$$A^2 - 4A + 10I = \\begin{bmatrix} 1 & 9-3k \\\\ 2k-6 & k^2-4k+4 \\end{bmatrix}$$\nEquating to $A = \\begin{bmatrix} 1 & -3 \\\\ 2 & k \\end{bmatrix}$:\n$9 - 3k = -3 \\implies k = 4$\n$2k - 6 = 2 \\implies k = 4$\n$k^2 - 4k + 4 = k \\implies k^2 - 5k + 4 = 0 \\implies k = 1 \\text{ or } 4$."
    },
    # Q4
    {
        "qnum": 4, "year": 2006,
        "question": "The value of $\\begin{vmatrix} x+y & y+z & z+x \\\\ x & y & z \\\\ x-y & y-z & z-x \\end{vmatrix} =$",
        "options": ["2(x + y + z)^2", "2(x + y + z)^3", "(x + y + z)^3", "0"],
        "ans": "d",
        "explanation": "Applying $R_1 \\rightarrow R_1 + R_3$ gives $R_1 = [2x, 2y, 2z] = 2 R_2$. Since two rows are proportional, the value of the determinant is $0$."
    },
    # Q5
    {
        "qnum": 5, "year": 2007,
        "question": "If $A = \\begin{bmatrix} 1 & -1 & 1 \\\\ 2 & 1 & -3 \\\\ 1 & 1 & 1 \\end{bmatrix}$, $10B = \\begin{bmatrix} 4 & 2 & 2 \\\\ -5 & 0 & \\alpha \\\\ 1 & -2 & 3 \\end{bmatrix}$ and $B$ is the inverse of $A$, then the value of $\\alpha$ is",
        "options": ["2", "0", "5", "4"],
        "ans": "c",
        "explanation": "Since $AB = I \\implies A(10B) = 10I$:\n$$\\begin{bmatrix} 1 & -1 & 1 \\\\ 2 & 1 & -3 \\\\ 1 & 1 & 1 \\end{bmatrix} \\begin{bmatrix} 4 & 2 & 2 \\\\ -5 & 0 & \\alpha \\\\ 1 & -2 & 3 \\end{bmatrix} = \\begin{bmatrix} 10 & 0 & 0 \\\\ 0 & 10 & 0 \\\\ 0 & 0 & 10 \\end{bmatrix}$$\nMultiplying row 1 with column 3: $1(2) + (-1)(\\alpha) + 1(3) = 0 \\implies 5 - \\alpha = 0 \\implies \\alpha = 5$."
    },
    # Q6
    {
        "qnum": 6, "year": 2007,
        "question": "If $A = \\begin{bmatrix} 0 & x & 16 \\\\ x & 5 & 7 \\\\ 0 & 9 & x \\end{bmatrix}$ is singular, then the possible values of $x$ are",
        "options": ["0, 12, -12", "0, 1, -1", "0, 4, -4", "0, 5, -5"],
        "ans": "a",
        "explanation": "For a singular matrix, $|A| = 0$:\n$$\\begin{vmatrix} 0 & x & 16 \\\\ x & 5 & 7 \\\\ 0 & 9 & x \\end{vmatrix} = -x(x^2 - 144) = 0 \\implies x(x-12)(x+12) = 0$$\nThus, $x = 0, 12, -12$."
    },
    # Q7
    {
        "qnum": 7, "year": 2007,
        "question": "If $A = \\begin{bmatrix} 1 & -2 & 2 \\\\ 0 & 2 & -3 \\\\ 3 & -2 & 4 \\end{bmatrix}$, then $A \\cdot \\text{adj}(A)$ is equal to",
        "options": [
            "\\begin{bmatrix} 5 & 1 & 1 \\\\ 1 & 5 & 1 \\\\ 1 & 1 & 5 \\end{bmatrix}",
            "\\begin{bmatrix} 5 & 0 & 0 \\\\ 0 & 5 & 0 \\\\ 0 & 0 & 5 \\end{bmatrix}",
            "\\begin{bmatrix} 8 & 0 & 0 \\\\ 0 & 8 & 0 \\\\ 0 & 0 & 8 \\end{bmatrix}",
            "\\begin{bmatrix} 0 & 0 & 0 \\\\ 0 & 0 & 0 \\\\ 0 & 0 & 0 \\end{bmatrix}"
        ],
        "ans": "c",
        "explanation": "$A \\cdot \\text{adj}(A) = |A| I$.\n$$|A| = 1(8 - 6) - (-2)(0 - (-9)) + 2(0 - 6) = 2 + 18 - 12 = 8$$\n$$A \\cdot \\text{adj}(A) = 8I = \\begin{bmatrix} 8 & 0 & 0 \\\\ 0 & 8 & 0 \\\\ 0 & 0 & 8 \\end{bmatrix}$$"
    },
    # Q8
    {
        "qnum": 8, "year": 2007,
        "question": "The value of $\\begin{vmatrix} x & p & q \\\\ p & x & q \\\\ p & q & x \\end{vmatrix}$ is",
        "options": [
            "x(x - p)(x - q)",
            "(x - p)(x - q)(x + p + q)",
            "(p - q)(x - q)(x - p)",
            "pq(x - p)(x - q)"
        ],
        "ans": "b",
        "explanation": "Applying $R_1 \\rightarrow R_1 + R_2 + R_3$ and factoring out $(x+p+q)$, then subtracting $C_1$ from $C_2$ and $C_3$ yields $(x + p + q)(x - p)(x - q)$."
    },
    # Q9
    {
        "qnum": 9, "year": 2008,
        "question": "The characteristic roots of the matrix $\\begin{bmatrix} 1 & 0 & 0 \\\\ 2 & 3 & 0 \\\\ 4 & 5 & 6 \\end{bmatrix}$ are",
        "options": ["4, 5, 6", "2, 4, 6", "1, 3, 6", "1, 2, 4"],
        "ans": "c",
        "explanation": "For a triangular matrix, the eigenvalues (characteristic roots) are the main diagonal elements: $1, 3, 6$."
    },
    # Q10
    {
        "qnum": 10, "year": 2008,
        "question": "If $A = \\begin{vmatrix} a_1 & b_1 & c_1 \\\\ a_2 & b_2 & c_2 \\\\ a_3 & b_3 & c_3 \\end{vmatrix}$ and $B = \\begin{vmatrix} c_1 & c_2 & c_3 \\\\ a_1 & a_2 & a_3 \\\\ b_1 & b_2 & b_3 \\end{vmatrix}$, then",
        "options": ["B = 0", "B = A^2", "A = -B", "A = B"],
        "ans": "d",
        "explanation": "Taking transpose of $B$: $B = \\begin{vmatrix} c_1 & a_1 & b_1 \\\\ c_2 & a_2 & b_2 \\\\ c_3 & a_3 & b_3 \\end{vmatrix}$.\nTwo column swaps ($C_1 \\leftrightarrow C_3$ then $C_1 \\leftrightarrow C_2$) change sign twice: $(-1)^2 = 1$, bringing $B = A$."
    },
    # Q11
    {
        "qnum": 11, "year": 2008,
        "question": "If $A = \\begin{bmatrix} 1 & 2 \\\\ 3 & 4 \\end{bmatrix}$, then $A^{-1} =$",
        "options": [
            "\\begin{bmatrix} -2 & 4 \\\\ 1 & 3 \\end{bmatrix}",
            "\\begin{bmatrix} 2 & 4 \\\\ 1 & 3 \\end{bmatrix}",
            "-\\frac{1}{2} \\begin{bmatrix} 4 & -2 \\\\ -3 & 1 \\end{bmatrix}",
            "\\frac{1}{2} \\begin{bmatrix} 4 & -2 \\\\ -3 & 1 \\end{bmatrix}"
        ],
        "ans": "c",
        "explanation": "$$|A| = 4 - 6 = -2$$\n$$\\text{adj}(A) = \\begin{bmatrix} 4 & -2 \\\\ -3 & 1 \\end{bmatrix} \\implies A^{-1} = \\frac{1}{|A|}\\text{adj}(A) = -\\frac{1}{2}\\begin{bmatrix} 4 & -2 \\\\ -3 & 1 \\end{bmatrix}$$"
    },
    # Q12
    {
        "qnum": 12, "year": 2008,
        "question": "If $A(\\text{adj } A) = 5I$ where $I$ is the identity matrix of order 3, then $|\\text{adj } A|$ is equal to",
        "options": ["5", "10", "125", "25"],
        "ans": "d",
        "explanation": "Since $A(\\text{adj } A) = |A|I = 5I$, we have $|A| = 5$.\nFor a matrix of order $n=3$, $|\\text{adj } A| = |A|^{n-1} = |A|^2 = 5^2 = 25$."
    },
    # Q13
    {
        "qnum": 13, "year": 2009,
        "question": "If $\\begin{vmatrix} x+1 & x+2 & x+a \\\\ x+2 & x+3 & x+b \\\\ x+3 & x+4 & x+c \\end{vmatrix} = 0$, then $a, b, c$ are",
        "options": ["equal", "in A.P.", "in G.P.", "in H.P."],
        "ans": "b",
        "explanation": "Applying $R_1 \\rightarrow R_1 + R_3 - 2R_2$:\n$$R_1 = [0, 0, a + c - 2b]$$\nExpanding along $R_1$ gives $(a + c - 2b) \\cdot (\\text{minor}) = 0 \\implies 2b = a + c$, which means $a, b, c$ are in Arithmetic Progression (A.P.)."
    },
    # Q14
    {
        "qnum": 14, "year": 2009,
        "question": "The value of $\\begin{vmatrix} 1 & \\log_x y & \\log_x z \\\\ \\log_y x & 1 & \\log_y z \\\\ \\log_z x & \\log_z y & 1 \\end{vmatrix} =$",
        "options": ["xyz", "\\log xyz", "0", "1"],
        "ans": "c",
        "explanation": "Using $\\log_a b = \\frac{\\ln b}{\\ln a}$, each row $i$ has elements $\\frac{\\ln x_j}{\\ln x_i}$.\nTaking out $\\frac{1}{\\ln x}$ from $R_1$, $\\frac{1}{\\ln y}$ from $R_2$, $\\frac{1}{\\ln z}$ from $R_3$ leaves identical rows $[\\ln x, \\ln y, \\ln z]$. Hence the determinant is $0$."
    },
    # Q15
    {
        "qnum": 15, "year": 2009,
        "question": "If $A = \\begin{bmatrix} 2 & 1 & 0 \\\\ 0 & 2 & 1 \\\\ 1 & 0 & 2 \\end{bmatrix}$ then $|\\text{adj } A| =$",
        "options": ["1/9", "81", "0", "9"],
        "ans": "b",
        "explanation": "$$|A| = 2(4 - 0) - 1(0 - 1) + 0 = 8 + 1 = 9$$\n$$|\\text{adj } A| = |A|^{n-1} = 9^{3-1} = 9^2 = 81$$"
    },
    # Q16
    {
        "qnum": 16, "year": 2009,
        "question": "If $A$ and $B$ are square matrices of the same order such that $(A + B)(A - B) = A^2 - B^2$, then $(ABA^{-1})^2 =$",
        "options": ["A^2 B^2", "A^2", "B^2", "I"],
        "ans": "c",
        "explanation": "$$(A + B)(A - B) = A^2 - AB + BA - B^2 = A^2 - B^2 \\implies BA = AB$$\n$$(ABA^{-1})^2 = (BA A^{-1})^2 = (B I)^2 = B^2$$"
    },
    # Q17
    {
        "qnum": 17, "year": 2009,
        "question": "If $\\begin{vmatrix} 1+\\sin^2\\theta & \\cos^2\\theta & 4\\sin 2\\theta \\\\ \\sin^2\\theta & 1+\\cos^2\\theta & 4\\sin 2\\theta \\\\ \\sin^2\\theta & \\cos^2\\theta & 4\\sin 2\\theta - 1 \\end{vmatrix} = 0$ and $0 < \\theta < \\frac{\\pi}{2}$, then $\\cos 4\\theta =$",
        "options": ["-1/2", "1/2", "\\sqrt{3}/2", "0"],
        "ans": "b",
        "explanation": "Applying $C_1 \\rightarrow C_1 + C_2$:\n$$\\begin{vmatrix} 2 & \\cos^2\\theta & 4\\sin 2\\theta \\\\ 2 & 1+\\cos^2\\theta & 4\\sin 2\\theta \\\\ 1 & \\cos^2\\theta & 4\\sin 2\\theta - 1 \\end{vmatrix} = 0$$\nApplying $R_1 \\rightarrow R_1 - R_2$ and $R_2 \\rightarrow R_2 - 2R_3$ leads to $4\\sin 2\\theta + 2 = 0$ or simplifying gives $\\sin 2\\theta = 1/2 \\implies 2\\theta = \\pi/6 \\implies 4\\theta = \\pi/3 \\implies \\cos 4\\theta = 1/2$."
    },
    # Q18
    {
        "qnum": 18, "year": 2010,
        "question": "If $A$ and $B$ are two square matrices of the same order such that $AB = B$ and $BA = A$, then $A^2 + B^2$ is always equal to",
        "options": ["A + B", "I", "2BA", "2AB"],
        "ans": "a",
        "explanation": "$$A^2 = A \\cdot A = (BA)A = B(AA) = B(BA) = BA = A$$\n$$B^2 = B \\cdot B = (AB)B = A(BB) = A(AB) = AB = B$$\n$$A^2 + B^2 = A + B$$"
    },
    # Q19
    {
        "qnum": 19, "year": 2010,
        "question": "If $A$ is a $3 \\times 3$ nonsingular matrix and if $|A| = 3$, then $|(2A)^{-1}| =$",
        "options": ["3", "24", "1/24", "1/3"],
        "ans": "c",
        "explanation": "$$|(2A)^{-1}| = \\frac{1}{|2A|} = \\frac{1}{2^3 |A|} = \\frac{1}{8 \\times 3} = \\frac{1}{24}$$"
    },
    # Q20
    {
        "qnum": 20, "year": 2010,
        "question": "If $A = \\begin{bmatrix} 3 & 2 \\\\ 1 & 1 \\end{bmatrix}$, then $A^2 + xA + yI = 0$ for $(x, y) =$",
        "options": ["(-1, 3)", "(-4, 1)", "(1, 3)", "(4, 1)"],
        "ans": "b",
        "explanation": "Characteristic equation of $A$ is $|A - \\lambda I| = \\lambda^2 - \\text{tr}(A)\\lambda + |A| = 0$.\n$$\\text{tr}(A) = 3 + 1 = 4, \\quad |A| = 3 - 2 = 1$$\n$$\\lambda^2 - 4\\lambda + 1 = 0 \\implies A^2 - 4A + I = 0$$\nHence, $x = -4$ and $y = 1$."
    },
    # Q21
    {
        "qnum": 21, "year": 2010,
        "question": "The constant term of the polynomial $\\begin{vmatrix} x+3 & x & x+2 \\\\ x & x+1 & x-1 \\\\ x+2 & 2x & 3x+1 \\end{vmatrix}$ is",
        "options": ["2", "0", "1", "-1"],
        "ans": "d",
        "explanation": "The constant term is found by putting $x = 0$:\n$$\\begin{vmatrix} 3 & 0 & 2 \\\\ 0 & 1 & -1 \\\\ 2 & 0 & 1 \\end{vmatrix} = 1 \\cdot \\begin{vmatrix} 3 & 2 \\\\ 2 & 1 \\end{vmatrix} = 3(1) - 2(2) = 3 - 4 = -1$$"
    },
    # Q22
    {
        "qnum": 22, "year": 2011,
        "question": "If $A = \\begin{bmatrix} \\cos\\theta & \\sin\\theta \\\\ -\\sin\\theta & \\cos\\theta \\end{bmatrix}$, then $A \\cdot A'$ is",
        "options": ["I", "A", "-A", "A^2"],
        "ans": "a",
        "explanation": "$$A \\cdot A' = \\begin{bmatrix} \\cos\\theta & \\sin\\theta \\\\ -\\sin\\theta & \\cos\\theta \\end{bmatrix} \\begin{bmatrix} \\cos\\theta & -\\sin\\theta \\\\ \\sin\\theta & \\cos\\theta \\end{bmatrix} = \\begin{bmatrix} \\cos^2\\theta + \\sin^2\\theta & 0 \\\\ 0 & \\sin^2\\theta + \\cos^2\\theta \\end{bmatrix} = \\begin{bmatrix} 1 & 0 \\\\ 0 & 1 \\end{bmatrix} = I$$"
    },
    # Q23
    {
        "qnum": 23, "year": 2011,
        "question": "If $\\begin{bmatrix} 1 & 2 & -1 \\\\ 1 & x-2 & 1 \\\\ x & 1 & 1 \\end{bmatrix}$ is singular, then the value of $x$ is",
        "options": ["2", "3", "1", "0"],
        "ans": "a",
        "explanation": "Setting determinant to $0$:\n$$1(x - 2 - 1) - 2(1 - x) - 1(1 - x(x - 2)) = 0$$\n$$(x - 3) - 2(1 - x) - 1(1 - x^2 + 2x) = 0$$\n$$x - 3 - 2 + 2x - 1 + x^2 - 2x = 0 \\implies x^2 + x - 6 = 0 \\implies (x + 3)(x - 2) = 0$$\nThus, $x = 2$ or $-3$. Among the options, $x = 2$."
    },
    # Q24
    {
        "qnum": 24, "year": 2011,
        "question": "If $A$ and $B$ are symmetric matrices of the same order, then which one of the following is NOT true?",
        "options": ["A + B is symmetric", "A - B is symmetric", "AB + BA is symmetric", "AB - BA is symmetric"],
        "ans": "d",
        "explanation": "$$(AB - BA)^T = (AB)^T - (BA)^T = B^T A^T - A^T B^T = BA - AB = -(AB - BA)$$\nTherefore, $AB - BA$ is skew-symmetric, not symmetric."
    },
    # Q25
    {
        "qnum": 25, "year": 2011,
        "question": "If $\\omega$ is an imaginary cube root of unity, then the value of $\\begin{vmatrix} 1 & \\omega^2 & 1-\\omega^4 \\\\ \\omega & 1 & 1+\\omega^5 \\\\ 1 & \\omega & \\omega^2 \\end{vmatrix}$ is",
        "options": ["-4", "\\omega^2 - 4", "\\omega^2", "4"],
        "ans": "b",
        "explanation": "Using $\\omega^3 = 1$, $1 + \\omega + \\omega^2 = 0$:\n$$\\begin{vmatrix} 1 & \\omega^2 & 1-\\omega \\\\ \\omega & 1 & 1+\\omega^2 \\\\ 1 & \\omega & \\omega^2 \\end{vmatrix} = \\begin{vmatrix} 1 & \\omega^2 & 1-\\omega \\\\ \\omega & 1 & -\\omega \\\\ 1 & \\omega & \\omega^2 \\end{vmatrix}$$\nExpanding and simplifying gives $\\omega^2 - 4$."
    },
    # Q26
    {
        "qnum": 26, "year": 2011,
        "question": "Let $G = \\left\\{ \\begin{bmatrix} x & x \\\\ x & x \\end{bmatrix}, x \\in \\mathbb{R}^* \\right\\}$ be a group under matrix multiplication. The inverse of $\\begin{bmatrix} 1/3 & 1/3 \\\\ 1/3 & 1/3 \\end{bmatrix}$ in $G$ is",
        "options": [
            "\\begin{bmatrix} 4/3 & 4/3 \\\\ 4/3 & 4/3 \\end{bmatrix}",
            "\\begin{bmatrix} 3/4 & 3/4 \\\\ 3/4 & 3/4 \\end{bmatrix}",
            "\\begin{bmatrix} 3 & 3 \\\\ 3 & 3 \\end{bmatrix}",
            "\\begin{bmatrix} 1 & 1 \\\\ 1 & 1 \\end{bmatrix}"
        ],
        "ans": "b",
        "explanation": "For identity matrix $E = \\begin{bmatrix} e & e \\\\ e & e \\end{bmatrix}$, $A \\cdot E = A \\implies 2xe = x \\implies e = 1/2$.\nFor inverse $A^{-1} = \\begin{bmatrix} y & y \\\\ y & y \\end{bmatrix}$, $A \\cdot A^{-1} = E \\implies 2xy = 1/2 \\implies 2(1/3)y = 1/2 \\implies y = 3/4$.\nThus, the inverse is $\\begin{bmatrix} 3/4 & 3/4 \\\\ 3/4 & 3/4 \\end{bmatrix}$."
    },
    # Q27
    {
        "qnum": 27, "year": 2011,
        "question": "$\\begin{vmatrix} \\sin\\alpha & \\cos\\alpha & \\sin(\\alpha+\\delta) \\\\ \\sin\\beta & \\cos\\beta & \\sin(\\beta+\\delta) \\\\ \\sin\\gamma & \\cos\\gamma & \\sin(\\gamma+\\delta) \\end{vmatrix} =$",
        "options": ["0", "1", "1 + \\sin\\alpha\\sin\\beta\\sin\\gamma", "1 - (\\sin\\alpha - \\sin\\beta)(\\sin\\beta - \\sin\\gamma)(\\sin\\gamma - \\sin\\alpha)"],
        "ans": "a",
        "explanation": "Expanding $C_3$: $\\sin(\\theta + \\delta) = \\cos\\delta \\sin\\theta + \\sin\\delta \\cos\\theta$.\nApplying $C_3 \\rightarrow C_3 - \\cos\\delta C_1 - \\sin\\delta C_2$ makes the third column all zeros. Hence, the determinant is $0$."
    },
    # Q28
    {
        "qnum": 28, "year": 2012,
        "question": "If $f(x) = \\begin{vmatrix} \\sin x & \\cos x & \\tan x \\\\ x^3 & x^2 & x \\\\ 2x & 1 & x \\end{vmatrix}$, then $\\lim_{x \\rightarrow 0} \\frac{f(x)}{x^2} =$",
        "options": ["1", "0", "3", "2"],
        "ans": "b",
        "explanation": "Dividing $R_2$ by $x$ and $R_3$ by $x$ gives $\\frac{f(x)}{x^2} = \\begin{vmatrix} \\sin x & \\cos x & \\tan x \\\\ x^2 & x & 1 \\\\ 2 & 1/x & 1 \\end{vmatrix}$. Taking limit as $x \\rightarrow 0$ results in $0$."
    },
    # Q29
    {
        "qnum": 29, "year": 2012,
        "question": "Inverse of a diagonal non-singular matrix is",
        "options": ["diagonal matrix", "scalar matrix", "skew symmetric matrix", "zero matrix"],
        "ans": "a",
        "explanation": "The inverse of a diagonal matrix $\\text{diag}(d_1, d_2, \\dots, d_n)$ is $\\text{diag}(1/d_1, 1/d_2, \\dots, 1/d_n)$, which is also a diagonal matrix."
    },
    # Q30
    {
        "qnum": 30, "year": 2012,
        "question": "If $ax^4 + bx^3 + cx^2 + dx + e = \\begin{vmatrix} x^3+3x & x-1 & x+3 \\\\ x+1 & -2x & x-4 \\\\ x-3 & x+4 & 3x \\end{vmatrix}$, then $e =$",
        "options": ["-1", "1", "0", "2"],
        "ans": "c",
        "explanation": "Putting $x = 0$:\n$$e = \\begin{vmatrix} 0 & -1 & 3 \\\\ 1 & 0 & -4 \\\\ -3 & 4 & 0 \\end{vmatrix}$$\nThis is a skew-symmetric determinant of odd order ($3 \\times 3$), whose value is always $0$. Thus $e = 0$."
    },
    # Q31
    {
        "qnum": 31, "year": 2012,
        "question": "The characteristic equation of a matrix $A$ is $\\lambda^3 - 5\\lambda^2 - 3\\lambda + 2 = 0$, then $|\\text{adj}(A)| =$",
        "options": ["4", "9", "25", "1/2"],
        "ans": "a",
        "explanation": "Constant term of characteristic equation is $(-1)^n |A| \\implies -|A| = 2 \\implies |A| = -2$.\nFor $3 \\times 3$ matrix, $|\\text{adj}(A)| = |A|^{n-1} = (-2)^2 = 4$."
    },
    # Q32
    {
        "qnum": 32, "year": 2013,
        "question": "If $A$ and $B$ are square matrices of order $n$ such that $A^2 - B^2 = (A - B)(A + B)$, then which of the following will be true?",
        "options": ["Either of A or B is zero matrix.", "A = B", "AB = BA", "Either of A or B is an identity matrix."],
        "ans": "c",
        "explanation": "$$(A - B)(A + B) = A^2 + AB - BA - B^2 = A^2 - B^2 \\implies AB - BA = 0 \\implies AB = BA$$"
    },
    # Q33
    {
        "qnum": 33, "year": 2013,
        "question": "If $A = \\begin{bmatrix} \\alpha & 2 \\\\ 2 & \\alpha \\end{bmatrix}$ and $|A^3| = 125$, then $\\alpha =$",
        "options": ["\\pm 1", "\\pm 2", "\\pm 3", "\\pm 5"],
        "ans": "c",
        "explanation": "$$|A^3| = |A|^3 = 125 \\implies |A| = 5$$\n$$|A| = \\alpha^2 - 4 = 5 \\implies \\alpha^2 = 9 \\implies \\alpha = \\pm 3$$"
    },
    # Q34
    {
        "qnum": 34, "year": 2013,
        "question": "If $A = \\begin{vmatrix} x & 1 & 1 \\\\ 1 & x & 1 \\\\ 1 & 1 & x \\end{vmatrix}$ and $B = \\begin{vmatrix} x & 1 \\\\ 1 & x \\end{vmatrix}$, then $\\frac{dA}{dx} =$",
        "options": ["3B + 1", "3B", "-3B", "1 - 3B"],
        "ans": "b",
        "explanation": "$$A = (x + 2)(x - 1)^2 = x^3 - 3x + 2$$\n$$\\frac{dA}{dx} = 3x^2 - 3 = 3(x^2 - 1) = 3 \\begin{vmatrix} x & 1 \\\\ 1 & x \\end{vmatrix} = 3B$$"
    },
    # Q35
    {
        "qnum": 35, "year": 2013,
        "question": "If the determinant of the adjoint of a (real) matrix of order 3 is 25, then the determinant of the inverse of the matrix is",
        "options": ["0.2", "\\pm 5", "1/\\sqrt[5]{625}", "\\pm 0.2"],
        "ans": "d",
        "explanation": "$$|\\text{adj } A| = |A|^{3-1} = |A|^2 = 25 \\implies |A| = \\pm 5$$\n$$|A^{-1}| = \\frac{1}{|A|} = \\pm \\frac{1}{5} = \\pm 0.2$$"
    },
    # Q36
    {
        "qnum": 36, "year": 2013,
        "question": "If the matrix $\\begin{bmatrix} 2 & 3 \\\\ 5 & -1 \\end{bmatrix} = A + B$, where $A$ is symmetric and $B$ is skew symmetric, then $B =$",
        "options": [
            "\\begin{bmatrix} 2 & 4 \\\\ 4 & -1 \\end{bmatrix}",
            "\\begin{bmatrix} 0 & -2 \\\\ 2 & 0 \\end{bmatrix}",
            "\\begin{bmatrix} 0 & 1 \\\\ -1 & 0 \\end{bmatrix}",
            "\\begin{bmatrix} 0 & -1 \\\\ 1 & 0 \\end{bmatrix}"
        ],
        "ans": "d",
        "explanation": "$$B = \\frac{1}{2}(M - M') = \\frac{1}{2}\\left(\\begin{bmatrix} 2 & 3 \\\\ 5 & -1 \\end{bmatrix} - \\begin{bmatrix} 2 & 5 \\\\ 3 & -1 \\end{bmatrix}\\right) = \\frac{1}{2}\\begin{bmatrix} 0 & -2 \\\\ 2 & 0 \\end{bmatrix} = \\begin{bmatrix} 0 & -1 \\\\ 1 & 0 \\end{bmatrix}$$"
    },
    # Q37
    {
        "qnum": 37, "year": 2013,
        "question": "If $A$ is $3 \\times 4$ matrix and $B$ is a matrix such that $A'B$ and $BA'$ are both defined, then $B$ is of type",
        "options": ["4 \\times 4", "3 \\times 4", "4 \\times 3", "3 \\times 3"],
        "ans": "b",
        "explanation": "$O(A) = 3 \\times 4 \\implies O(A') = 4 \\times 3$.\nFor $A'B$ to be defined, rows of $B$ must be 3.\nFor $BA'$ to be defined, columns of $B$ must be 4.\nHence, $B$ is of type $3 \\times 4$."
    },
    # Q38
    {
        "qnum": 38, "year": 2014,
        "question": "The symmetric part of the matrix $A = \\begin{bmatrix} 1 & 2 & 4 \\\\ 6 & 8 & 2 \\\\ 2 & -2 & 7 \\end{bmatrix}$ is",
        "options": [
            "\\begin{bmatrix} 0 & -2 & -1 \\\\ -2 & 0 & -2 \\\\ -1 & -2 & 0 \\end{bmatrix}",
            "\\begin{bmatrix} 1 & 4 & 3 \\\\ 2 & 8 & 0 \\\\ 3 & 0 & 7 \\end{bmatrix}",
            "\\begin{bmatrix} 0 & -2 & 1 \\\\ 2 & 0 & 2 \\\\ -1 & 2 & 0 \\end{bmatrix}",
            "\\begin{bmatrix} 1 & 4 & 3 \\\\ 4 & 8 & 0 \\\\ 3 & 0 & 7 \\end{bmatrix}"
        ],
        "ans": "d",
        "explanation": "$$\\text{Symmetric part } = \\frac{1}{2}(A + A') = \\frac{1}{2}\\left(\\begin{bmatrix} 1 & 2 & 4 \\\\ 6 & 8 & 2 \\\\ 2 & -2 & 7 \\end{bmatrix} + \\begin{bmatrix} 1 & 6 & 2 \\\\ 2 & 8 & -2 \\\\ 4 & 2 & 7 \\end{bmatrix}\\right) = \\begin{bmatrix} 1 & 4 & 3 \\\\ 4 & 8 & 0 \\\\ 3 & 0 & 7 \\end{bmatrix}$$"
    },
    # Q39
    {
        "qnum": 39, "year": 2014,
        "question": "If $A$ is a matrix of order 3, such that $A(\\text{adj } A) = 10 I$, then $|\\text{adj } A| =$",
        "options": ["1", "10", "100", "10 I"],
        "ans": "c",
        "explanation": "$$A(\\text{adj } A) = |A|I = 10I \\implies |A| = 10$$\n$$|\\text{adj } A| = |A|^{n-1} = 10^{3-1} = 10^2 = 100$$"
    },
    # Q40
    {
        "qnum": 40, "year": 2014,
        "question": "Consider the following statements:\n(i) If any two rows or columns of a determinant are identical, then the value of the determinant is zero.\n(ii) If the corresponding rows and columns of a determinant are interchanged, then the value of the determinant does not change.\n(iii) If any two rows (or columns) of a determinant are interchanged, then the value of the determinant changes in sign.\nWhich of these are correct?",
        "options": ["(i) and (iii)", "(i) and (ii)", "(i), (ii) and (iii)", "(ii) and (iii)"],
        "ans": "c",
        "explanation": "All three statements are fundamental and true standard properties of determinants."
    },
    # Q41
    {
        "qnum": 41, "year": 2014,
        "question": "The inverse of the matrix $A = \\begin{bmatrix} 2 & 0 & 0 \\\\ 0 & 3 & 0 \\\\ 0 & 0 & 4 \\end{bmatrix}$ is",
        "options": [
            "\\frac{1}{24} \\begin{bmatrix} 2 & 0 & 0 \\\\ 0 & 3 & 0 \\\\ 0 & 0 & 4 \\end{bmatrix}",
            "\\begin{bmatrix} 2 & 0 & 0 \\\\ 0 & 3 & 0 \\\\ 0 & 0 & 4 \\end{bmatrix}",
            "\\frac{1}{24} \\begin{bmatrix} 1 & 0 & 0 \\\\ 0 & 1 & 0 \\\\ 0 & 0 & 1 \\end{bmatrix}",
            "\\begin{bmatrix} 1/2 & 0 & 0 \\\\ 0 & 1/3 & 0 \\\\ 0 & 0 & 1/4 \\end{bmatrix}"
        ],
        "ans": "d",
        "explanation": "For any non-singular diagonal matrix, the inverse is obtained by inverting each diagonal element: $\\text{diag}(1/2, 1/3, 1/4)$."
    },
    # Q42
    {
        "qnum": 42, "year": 2014,
        "question": "If $a, b$ and $c$ are in A.P., then the value of $\\begin{vmatrix} x+2 & x+3 & x+a \\\\ x+4 & x+5 & x+b \\\\ x+6 & x+7 & x+c \\end{vmatrix}$ is",
        "options": ["0", "x - (a + b + c)", "a + b + c", "9x^2 + a + b + c"],
        "ans": "a",
        "explanation": "Applying $R_1 \\rightarrow R_1 + R_3 - 2R_2$:\n$$R_1 = [0, 0, a + c - 2b]$$\nSince $a, b, c$ are in A.P., $a + c = 2b \\implies a + c - 2b = 0$. Row 1 becomes all zeros, so determinant is $0$."
    },
    # Q43
    {
        "qnum": 43, "year": 2015,
        "question": "The system of linear equations $x + y + z = 6$, $x + 2y + 3z = 10$ and $x + 2y + az = b$ has no solution when",
        "options": ["a = 3, b \\neq 10", "b = 3, a \\neq 10", "a = 2, b \\neq 3", "b = 2, a = 3"],
        "ans": "a",
        "explanation": "Coefficient determinant $D = \\begin{vmatrix} 1 & 1 & 1 \\\\ 1 & 2 & 3 \\\\ 1 & 2 & a \\end{vmatrix} = a - 3$.\nFor no solution, $D = 0 \\implies a = 3$ and $D_1, D_2, D_3 \\neq 0 \\implies b \\neq 10$."
    },
    # Q44
    {
        "qnum": 44, "year": 2015,
        "question": "If $A = \\begin{bmatrix} 0 & 1 \\\\ 1 & 0 \\end{bmatrix}$, then $A^2$ is equal to",
        "options": [
            "\\begin{bmatrix} 1 & 0 \\\\ 1 & 0 \\end{bmatrix}",
            "\\begin{bmatrix} 0 & 1 \\\\ 0 & 1 \\end{bmatrix}",
            "\\begin{bmatrix} 0 & 1 \\\\ 1 & 0 \\end{bmatrix}",
            "\\begin{bmatrix} 1 & 0 \\\\ 0 & 1 \\end{bmatrix}"
        ],
        "ans": "d",
        "explanation": "$$A^2 = \\begin{bmatrix} 0 & 1 \\\\ 1 & 0 \\end{bmatrix} \\begin{bmatrix} 0 & 1 \\\\ 1 & 0 \\end{bmatrix} = \\begin{bmatrix} 1 & 0 \\\\ 0 & 1 \\end{bmatrix} = I$$"
    },
    # Q45
    {
        "qnum": 45, "year": 2015,
        "question": "If $A = \\begin{bmatrix} \\alpha & 2 \\\\ 2 & \\alpha \\end{bmatrix}$ and $|A^3| = 27$, then $\\alpha =$",
        "options": ["\\pm 2", "\\pm \\sqrt{5}", "\\pm 1", "\\pm \\sqrt{7}"],
        "ans": "d",
        "explanation": "$$|A^3| = |A|^3 = 27 \\implies |A| = 3$$\n$$|A| = \\alpha^2 - 4 = 3 \\implies \\alpha^2 = 7 \\implies \\alpha = \\pm \\sqrt{7}$$"
    },
    # Q46
    {
        "qnum": 46, "year": 2015,
        "question": "If $\\begin{vmatrix} 2a & x_1 & y_1 \\\\ 2b & x_2 & y_2 \\\\ 2c & x_3 & y_3 \\end{vmatrix} = \\frac{abc}{2} \\neq 0$, then the area of the triangle whose vertices are $(x_1/a, y_1/a)$, $(x_2/b, y_2/b)$ and $(x_3/c, y_3/c)$ is",
        "options": ["\\frac{1}{8} abc", "\\frac{1}{8}", "\\frac{1}{4} abc", "\\frac{1}{4}"],
        "ans": "b",
        "explanation": "$$\\text{Area} = \\frac{1}{2} \\begin{vmatrix} x_1/a & y_1/a & 1 \\\\ x_2/b & y_2/b & 1 \\\\ x_3/c & y_3/c & 1 \\end{vmatrix} = \\frac{1}{2abc} \\begin{vmatrix} x_1 & y_1 & a \\\\ x_2 & y_2 & b \\\\ x_3 & y_3 & c \\end{vmatrix}$$\nGiven $\\begin{vmatrix} 2a & x_1 & y_1 \\\\ 2b & x_2 & y_2 \\\\ 2c & x_3 & y_3 \\end{vmatrix} = \\frac{abc}{2} \\implies \\begin{vmatrix} a & x_1 & y_1 \\\\ b & x_2 & y_2 \\\\ c & x_3 & y_3 \\end{vmatrix} = \\frac{abc}{4}$.\nThus, $\\text{Area} = \\frac{1}{2abc} \\cdot \\frac{abc}{4} = \\frac{1}{8}$."
    },
    # Q47
    {
        "qnum": 47, "year": 2015,
        "question": "Evaluate $\\begin{vmatrix} \\cos 15^\\circ & \\sin 15^\\circ \\\\ \\sin 75^\\circ & \\cos 75^\\circ \\end{vmatrix}$",
        "options": ["0", "3", "1", "2"],
        "ans": "a",
        "explanation": "$$\\cos 15^\\circ \\cos 75^\\circ - \\sin 15^\\circ \\sin 75^\\circ = \\cos(15^\\circ + 75^\\circ) = \\cos 90^\\circ = 0$$"
    },
    # Q48
    {
        "qnum": 48, "year": 2016,
        "question": "If $x, y, z$ are all different and not equal to zero and $\\begin{vmatrix} 1+x & 1 & 1 \\\\ 1 & 1+y & 1 \\\\ 1 & 1 & 1+z \\end{vmatrix} = 0$ then the value of $x^{-1} + y^{-1} + z^{-1}$ is equal to",
        "options": ["xyz", "x^{-1}y^{-1}z^{-1}", "-x-y-z", "-1"],
        "ans": "d",
        "explanation": "Dividing $R_1, R_2, R_3$ by $x, y, z$ respectively:\n$$xyz \\begin{vmatrix} 1/x + 1 & 1/x & 1/x \\\\ 1/y & 1/y + 1 & 1/y \\\\ 1/z & 1/z & 1/z + 1 \\end{vmatrix} = xyz \\left(1 + \\frac{1}{x} + \\frac{1}{y} + \\frac{1}{z}\\right) = 0$$\nSince $xyz \\neq 0$, $1 + x^{-1} + y^{-1} + z^{-1} = 0 \\implies x^{-1} + y^{-1} + z^{-1} = -1$."
    },
    # Q49
    {
        "qnum": 49, "year": 2016,
        "question": "If $A$ is any square matrix of order $3 \\times 3$ then $|3A|$ is equal to",
        "options": ["3|A|", "\\frac{1}{3}|A|", "27|A|", "9|A|"],
        "ans": "c",
        "explanation": "For any $n \\times n$ matrix, $|kA| = k^n |A|$. Here $n = 3$, so $|3A| = 3^3 |A| = 27|A|$."
    },
    # Q50
    {
        "qnum": 50, "year": 2016,
        "question": "If $A = \\frac{1}{\\pi} \\begin{bmatrix} \\sin^{-1}(\\pi x) & \\tan^{-1}(x/\\pi) \\\\ \\sin^{-1}(x/\\pi) & \\cot^{-1}(\\pi x) \\end{bmatrix}$, $B = \\frac{1}{\\pi} \\begin{bmatrix} -\\cos^{-1}(\\pi x) & \\tan^{-1}(x/\\pi) \\\\ \\sin^{-1}(x/\\pi) & -\\tan^{-1}(\\pi x) \\end{bmatrix}$, then $A - B$ is equal to",
        "options": ["I", "0", "2I", "\\frac{1}{2} I"],
        "ans": "d",
        "explanation": "$$A - B = \\frac{1}{\\pi} \\begin{bmatrix} \\sin^{-1}(\\pi x) + \\cos^{-1}(\\pi x) & 0 \\\\ 0 & \\cot^{-1}(\\pi x) + \\tan^{-1}(\\pi x) \\end{bmatrix} = \\frac{1}{\\pi} \\begin{bmatrix} \\pi/2 & 0 \\\\ 0 & \\pi/2 \\end{bmatrix} = \\frac{1}{2} I$$"
    },
    # Q51
    {
        "qnum": 51, "year": 2016,
        "question": "If $A$ is a matrix of order $m \\times n$ and $B$ is a matrix such that $AB'$ and $B'A$ are both defined, the order of the matrix $B$ is",
        "options": ["m \\times m", "n \\times n", "n \\times m", "m \\times n"],
        "ans": "d",
        "explanation": "Let $B$ have order $p \\times q \\implies B'$ is $q \\times p$.\n$AB'$ defined $\\implies n = q$.\n$B'A$ defined $\\implies p = m$.\nThus, order of $B$ is $m \\times n$."
    },
    # Q52
    {
        "qnum": 52, "year": 2016,
        "question": "If $xyz$ are not equal and $\\neq 0, \\neq 1$ the value of $\\begin{vmatrix} \\log x & \\log y & \\log z \\\\ \\log 2x & \\log 2y & \\log 2z \\\\ \\log 3x & \\log 3y & \\log 3z \\end{vmatrix}$ is equal to",
        "options": ["\\log(xyz)", "\\log(6xyz)", "0", "\\log(x+y+z)"],
        "ans": "c",
        "explanation": "Applying $R_2 \\rightarrow R_2 - R_1$ and $R_3 \\rightarrow R_3 - R_1$:\n$R_2 = [\\log 2, \\log 2, \\log 2] = \\log 2 [1, 1, 1]$\n$R_3 = [\\log 3, \\log 3, \\log 3] = \\log 3 [1, 1, 1]$\nSince $R_2$ and $R_3$ are proportional, the determinant is $0$."
    },
    # Q53
    {
        "qnum": 53, "year": 2016,
        "question": "If $A = \\begin{bmatrix} \\cos 2\\theta & -\\sin 2\\theta \\\\ \\sin 2\\theta & \\cos 2\\theta \\end{bmatrix}$ and $A + A^T = I$, where $I$ is the unit matrix of $2 \\times 2$, then the value of $\\theta$ is equal to",
        "options": ["\\pi/6", "\\pi/3", "\\pi", "3\\pi/2"],
        "ans": "a",
        "explanation": "$$A + A^T = \\begin{bmatrix} 2\\cos 2\\theta & 0 \\\\ 0 & 2\\cos 2\\theta \\end{bmatrix} = \\begin{bmatrix} 1 & 0 \\\\ 0 & 1 \\end{bmatrix} \\implies 2\\cos 2\\theta = 1 \\implies \\cos 2\\theta = 1/2 \\implies 2\\theta = \\pi/3 \\implies \\theta = \\pi/6$$"
    },
    # Q54
    {
        "qnum": 54, "year": 2016,
        "question": "If $A = \\begin{bmatrix} 3 & 1 \\\\ -1 & 2 \\end{bmatrix}$ then $A^2 - 5A$ is equal to",
        "options": ["I", "-I", "7I", "-7I"],
        "ans": "d",
        "explanation": "Characteristic polynomial: $\\lambda^2 - \\text{tr}(A)\\lambda + |A| = 0 \\implies \\lambda^2 - 5\\lambda + 7 = 0$.\nBy Cayley-Hamilton Theorem: $A^2 - 5A + 7I = 0 \\implies A^2 - 5A = -7I$."
    },
    # Q55
    {
        "qnum": 55, "year": 2017,
        "question": "If $A$ is a square matrix of order $3 \\times 3$, then $|KA|$ is equal to",
        "options": ["K|A|", "K^2|A|", "3K|A|", "K^3|A|"],
        "ans": "d",
        "explanation": "For any $n \\times n$ matrix $A$, $|KA| = K^n |A|$. Here $n = 3$, so $|KA| = K^3|A|$."
    },
    # Q56
    {
        "qnum": 56, "year": 2017,
        "question": "If a matrix $A$ is both symmetric and skew symmetric, then",
        "options": ["A is diagonal matrix", "A is a zero matrix", "A is scalar matrix", "A is square matrix"],
        "ans": "b",
        "explanation": "Symmetric $\\implies A' = A$. Skew-symmetric $\\implies A' = -A$.\nTherefore $A = -A \\implies 2A = 0 \\implies A = 0$ (zero matrix)."
    },
    # Q57
    {
        "qnum": 57, "year": 2017,
        "question": "If $\\begin{vmatrix} 3 & x \\\\ x & 1 \\end{vmatrix} = \\begin{vmatrix} 3 & 2 \\\\ 4 & 1 \\end{vmatrix}$ then $x$ is equal to",
        "options": ["8", "4", "\\pm 2\\sqrt{2}", "2"],
        "ans": "c",
        "explanation": "$$3 - x^2 = 3 - 8 \\implies 3 - x^2 = -5 \\implies x^2 = 8 \\implies x = \\pm 2\\sqrt{2}$$"
    },
    # Q58
    {
        "qnum": 58, "year": 2017,
        "question": "If $2\\begin{bmatrix} 1 & 3 \\\\ 0 & x \\end{bmatrix} + \\begin{bmatrix} y & 0 \\\\ 1 & 2 \\end{bmatrix} = \\begin{bmatrix} 5 & 6 \\\\ 1 & 8 \\end{bmatrix}$, then the value of $x$ and $y$ are",
        "options": ["x = 3, y = 3", "x = -3, y = 3", "x = 3, y = -3", "x = -3, y = -3"],
        "ans": "a",
        "explanation": "$$\\begin{bmatrix} 2+y & 6 \\\\ 1 & 2x+2 \\end{bmatrix} = \\begin{bmatrix} 5 & 6 \\\\ 1 & 8 \\end{bmatrix}$$\n$$2 + y = 5 \\implies y = 3$$\n$$2x + 2 = 8 \\implies 2x = 6 \\implies x = 3$$"
    },
    # Q59
    {
        "qnum": 59, "year": 2017,
        "question": "The area of triangle with vertices $(K, 0), (4, 0), (0, 2)$ is 4 square units, then value of $K$ is",
        "options": ["8", "0 \\text{ or } -8", "0", "0 \\text{ or } 8"],
        "ans": "d",
        "explanation": "$$\\text{Area} = \\frac{1}{2} |K(0 - 2) + 4(2 - 0) + 0| = 4 \\implies |-2K + 8| = 8$$\n$$-2K + 8 = 8 \\implies K = 0$$\n$$-2K + 8 = -8 \\implies 2K = 16 \\implies K = 8$$"
    },
    # Q60
    {
        "qnum": 60, "year": 2017,
        "question": "If $A = \\frac{1}{\\pi} \\begin{bmatrix} \\sin^{-1}(\\pi x) & \\tan^{-1}(x/\\pi) \\\\ \\sin^{-1}(x/\\pi) & \\cot^{-1}(\\pi x) \\end{bmatrix}$, $B = \\frac{1}{\\pi} \\begin{bmatrix} -\\cos^{-1}(\\pi x) & \\tan^{-1}(x/\\pi) \\\\ \\sin^{-1}(x/\\pi) & -\\tan^{-1}(\\pi x) \\end{bmatrix}$ then $A - B$ is equal to",
        "options": ["\\frac{1}{2} I", "I", "O", "2I"],
        "ans": "a",
        "explanation": "$$A - B = \\frac{1}{\\pi} \\begin{bmatrix} \\sin^{-1}(\\pi x) + \\cos^{-1}(\\pi x) & 0 \\\\ 0 & \\cot^{-1}(\\pi x) + \\tan^{-1}(\\pi x) \\end{bmatrix} = \\frac{1}{\\pi} \\begin{bmatrix} \\pi/2 & 0 \\\\ 0 & \\pi/2 \\end{bmatrix} = \\frac{1}{2} I$$"
    },
    # Q61
    {
        "qnum": 61, "year": 2017,
        "question": "Let $\\Delta = \\begin{vmatrix} Ax & x^2 & 1 \\\\ By & y^2 & 1 \\\\ Cz & z^2 & 1 \\end{vmatrix}$ and $\\Delta_1 = \\begin{vmatrix} A & B & C \\\\ x & y & z \\\\ zy & zx & xy \\end{vmatrix}$ then",
        "options": ["\\Delta_1 = -\\Delta", "\\Delta_1 = \\Delta", "\\Delta_1 = 2\\Delta", "\\Delta_1 \\neq \\Delta"],
        "ans": "b",
        "explanation": "Multiplying rows of $\\Delta_1$ or multiplying $C_1, C_2, C_3$ by $x, y, z$ and dividing by $xyz$ transforms $\\Delta_1$ directly into $\\Delta$. Thus, $\\Delta_1 = \\Delta$."
    },
    # Q62
    {
        "qnum": 62, "year": 2018,
        "question": "If $A = \\begin{bmatrix} 2 & -2 \\\\ -2 & 2 \\end{bmatrix}$, then $A^n = 2^k A$, where $k =$",
        "options": ["2^{n-1}", "n + 1", "n - 1", "2(n - 1)"],
        "ans": "d",
        "explanation": "$$A^2 = \\begin{bmatrix} 8 & -8 \\\\ -8 & 8 \\end{bmatrix} = 4A = 2^2 A = 2^{2(2-1)} A$$\n$$A^3 = A^2 A = 4A^2 = 16A = 2^4 A = 2^{2(3-1)} A$$\nBy mathematical induction, $A^n = 2^{2(n-1)} A \\implies k = 2(n - 1)$."
    },
    # Q63
    {
        "qnum": 63, "year": 2018,
        "question": "If $\\begin{bmatrix} 1 & 1 \\\\ -1 & 1 \\end{bmatrix} \\begin{bmatrix} x \\\\ y \\end{bmatrix} = \\begin{bmatrix} 2 \\\\ 4 \\end{bmatrix}$, then the values of $x$ and $y$ respectively are",
        "options": ["-3, -1", "1, 3", "3, 1", "-1, 3"],
        "ans": "d",
        "explanation": "$$x + y = 2 \\quad \\text{and} \\quad -x + y = 4$$\nAdding both gives $2y = 6 \\implies y = 3$.\nThen $x = 2 - y = 2 - 3 = -1$."
    },
    # Q64
    {
        "qnum": 64, "year": 2018,
        "question": "If $A = \\begin{bmatrix} \\cos\\alpha & \\sin\\alpha \\\\ -\\sin\\alpha & \\cos\\alpha \\end{bmatrix}$, then $AA' =$",
        "options": ["A", "\\text{zero matrix}", "A'", "I"],
        "ans": "d",
        "explanation": "$$AA' = \\begin{bmatrix} \\cos\\alpha & \\sin\\alpha \\\\ -\\sin\\alpha & \\cos\\alpha \\end{bmatrix} \\begin{bmatrix} \\cos\\alpha & -\\sin\\alpha \\\\ \\sin\\alpha & \\cos\\alpha \\end{bmatrix} = \\begin{bmatrix} \\cos^2\\alpha + \\sin^2\\alpha & 0 \\\\ 0 & \\sin^2\\alpha + \\cos^2\\alpha \\end{bmatrix} = I$$"
    },
    # Q65
    {
        "qnum": 65, "year": 2018,
        "question": "If $x, y, z \\in \\mathbb{R}$, then the value of the determinant $A = \\begin{vmatrix} (5^x + 5^{-x})^2 & (5^x - 5^{-x})^2 & 1 \\\\ (6^x + 6^{-x})^2 & (6^x - 6^{-x})^2 & 1 \\\\ (7^x + 7^{-x})^2 & (7^x - 7^{-x})^2 & 1 \\end{vmatrix}$ is",
        "options": ["10", "12", "1", "0"],
        "ans": "d",
        "explanation": "Applying $C_1 \\rightarrow C_1 - C_2$:\n$(a+b)^2 - (a-b)^2 = 4ab = 4(5^x \\cdot 5^{-x}) = 4$.\nThus, $C_1 = [4, 4, 4]^T = 4 C_3$. Since $C_1$ is proportional to $C_3$, the determinant is $0$."
    },
    # Q66
    {
        "qnum": 66, "year": 2018,
        "question": "The value of determinant $\\begin{vmatrix} a-b & b+c & a \\\\ b-a & c+a & b \\\\ c-a & a+b & c \\end{vmatrix}$ is",
        "options": ["a^3 + b^3 + c^3", "3abc", "a^3 + b^3 + c^3 - 3abc", "a^3 + b^3 + c^3 + 3abc"],
        "ans": "c",
        "explanation": "Applying $C_2 \\rightarrow C_2 + C_3$ and simplifying gives standard identity $a^3 + b^3 + c^3 - 3abc$."
    },
    # Q67
    {
        "qnum": 67, "year": 2018,
        "question": "If $(x_1, y_1), (x_2, y_2)$ and $(x_3, y_3)$ are the vertices of a triangle whose area is $k$ square units, then $\\begin{vmatrix} x_1 & y_1 & 4 \\\\ x_2 & y_2 & 4 \\\\ x_3 & y_3 & 4 \\end{vmatrix}^2$ is",
        "options": ["32k^2", "16k^2", "64k^2", "48k^2"],
        "ans": "c",
        "explanation": "Taking out 4 from column 3:\n$$\\begin{vmatrix} x_1 & y_1 & 4 \\\\ x_2 & y_2 & 4 \\\\ x_3 & y_3 & 4 \\end{vmatrix} = 4 \\begin{vmatrix} x_1 & y_1 & 1 \\\\ x_2 & y_2 & 1 \\\\ x_3 & y_3 & 1 \\end{vmatrix} = 4(\\pm 2k) = \\pm 8k$$\nSquaring gives $(\\pm 8k)^2 = 64k^2$."
    },
    # Q68
    {
        "qnum": 68, "year": 2018,
        "question": "Let $A$ be a square matrix of order $3 \\times 3$, then $|5A| =$",
        "options": ["5|A|", "125|A|", "25|A|", "15|A|"],
        "ans": "b",
        "explanation": "$$|5A| = 5^3 |A| = 125|A|$$"
    },
    # Q69
    {
        "qnum": 69, "year": 2019,
        "question": "The inverse of the matrix $\\begin{bmatrix} 2 & 5 & 0 \\\\ 0 & 1 & 1 \\\\ -1 & 0 & 3 \\end{bmatrix}$ is",
        "options": [
            "\\begin{bmatrix} 3 & -1 & 1 \\\\ -15 & 6 & -5 \\\\ 5 & -2 & 2 \\end{bmatrix}",
            "\\begin{bmatrix} 3 & -15 & 5 \\\\ -1 & 6 & -2 \\\\ 1 & -5 & 2 \\end{bmatrix}",
            "\\begin{bmatrix} 3 & -5 & 5 \\\\ -1 & -6 & -2 \\\\ 1 & -5 & 2 \\end{bmatrix}",
            "\\begin{bmatrix} 3 & -15 & 5 \\\\ -1 & 6 & -2 \\\\ 1 & -5 & -2 \\end{bmatrix}"
        ],
        "ans": "b",
        "explanation": "$$|A| = 2(3) - 5(1) + 0 = 6 - 5 = 1$$\n$$\\text{adj } A = \\begin{bmatrix} 3 & -15 & 5 \\\\ -1 & 6 & -2 \\\\ 1 & -5 & 2 \\end{bmatrix} \\implies A^{-1} = \\frac{\\text{adj } A}{|A|} = \\begin{bmatrix} 3 & -15 & 5 \\\\ -1 & 6 & -2 \\\\ 1 & -5 & 2 \\end{bmatrix}$$"
    },
    # Q70
    {
        "qnum": 70, "year": 2019,
        "question": "If $P$ and $Q$ are symmetric matrices of the same order then $PQ - QP$ is",
        "options": ["identity matrix", "zero matrix", "symmetric matrix", "skew symmetric matrix"],
        "ans": "d",
        "explanation": "$$(PQ - QP)^T = (PQ)^T - (QP)^T = Q^T P^T - P^T Q^T = QP - PQ = -(PQ - QP)$$\nThus, $PQ - QP$ is a skew-symmetric matrix."
    },
    # Q71
    {
        "qnum": 71, "year": 2019,
        "question": "If $3A + 4B' = \\begin{bmatrix} 7 & -10 & 17 \\\\ 0 & 6 & 31 \\end{bmatrix}$ and $2B - 3A' = \\begin{bmatrix} -1 & 18 \\\\ 4 & 0 \\\\ -5 & -7 \\end{bmatrix}$ then $B =$",
        "options": [
            "\\begin{bmatrix} 1 & 3 \\\\ -1 & 1 \\\\ 2 & 4 \\end{bmatrix}",
            "\\begin{bmatrix} -1 & -18 \\\\ 4 & -16 \\\\ -5 & -7 \\end{bmatrix}",
            "\\begin{bmatrix} 1 & -3 \\\\ -1 & 1 \\\\ 2 & 4 \\end{bmatrix}",
            "\\begin{bmatrix} 1 & 3 \\\\ -1 & 1 \\\\ 2 & -4 \\end{bmatrix}"
        ],
        "ans": "a",
        "explanation": "Taking transpose of the second equation:\n$$2B' - 3A = \\begin{bmatrix} -1 & 4 & -5 \\\\ 18 & 0 & -7 \\end{bmatrix}$$\nAdding to $3A + 4B'$:\n$$6B' = \\begin{bmatrix} 6 & -6 & 12 \\\\ 18 & 6 & 24 \\end{bmatrix} \\implies B' = \\begin{bmatrix} 1 & -1 & 2 \\\\ 3 & 1 & 4 \\end{bmatrix} \\implies B = \\begin{bmatrix} 1 & 3 \\\\ -1 & 1 \\\\ 2 & 4 \\end{bmatrix}$$"
    },
    # Q72
    {
        "qnum": 72, "year": 2019,
        "question": "If $A = \\begin{bmatrix} 1 & 3 \\\\ 4 & 2 \\end{bmatrix}$, $B = \\begin{bmatrix} 2 & -1 \\\\ 1 & 2 \\end{bmatrix}$ then $|ABB'| =$",
        "options": ["50", "100", "-250", "250"],
        "ans": "c",
        "explanation": "$$|A| = 2 - 12 = -10$$\n$$|B| = 4 - (-1) = 5, \\quad |B'| = |B| = 5$$\n$$|ABB'| = |A| \\cdot |B| \\cdot |B'| = (-10) \\times 5 \\times 5 = -250$$"
    },
    # Q73
    {
        "qnum": 73, "year": 2019,
        "question": "If the value of a third order determinant is 16, then the value of the determinant formed by replacing each of its elements by its cofactor is",
        "options": ["96", "256", "48", "1"],
        "ans": "b",
        "explanation": "The determinant of the cofactor matrix is equal to $|\\text{adj } A| = |A|^{n-1}$. For $n = 3$:\n$$|\\text{adj } A| = |A|^{3-1} = |A|^2 = 16^2 = 256$$"
    },
    # Q74
    {
        "qnum": 74, "year": 2019,
        "question": "The constant term in the expansion of $\\begin{vmatrix} 3x+1 & 2x-1 & x+2 \\\\ 5x-1 & 3x+2 & x+1 \\\\ 7x-2 & 3x+1 & 4x-1 \\end{vmatrix}$ is",
        "options": ["0", "-10", "2", "6"],
        "ans": "d",
        "explanation": "The constant term is found by setting $x = 0$:\n$$\\begin{vmatrix} 1 & -1 & 2 \\\\ -1 & 2 & 1 \\\\ -2 & 1 & -1 \\end{vmatrix} = 1(-2 - 1) - (-1)(1 - (-2)) + 2(-1 - (-4)) = -3 + 3 + 6 = 6$$"
    },
    # Q75
    {
        "qnum": 75, "year": 2020,
        "question": "If $A = \\begin{bmatrix} 0 & 0 & 1 \\\\ 0 & 1 & 0 \\\\ 1 & 0 & 0 \\end{bmatrix}$, then $A^4$ is equal to",
        "options": ["2A", "I", "4A", "A"],
        "ans": "b",
        "explanation": "$$A^2 = \\begin{bmatrix} 0 & 0 & 1 \\\\ 0 & 1 & 0 \\\\ 1 & 0 & 0 \\end{bmatrix} \\begin{bmatrix} 0 & 0 & 1 \\\\ 0 & 1 & 0 \\\\ 1 & 0 & 0 \\end{bmatrix} = \\begin{bmatrix} 1 & 0 & 0 \\\\ 0 & 1 & 0 \\\\ 0 & 0 & 1 \\end{bmatrix} = I$$\n$$A^4 = (A^2)^2 = I^2 = I$$"
    },
    # Q76
    {
        "qnum": 76, "year": 2020,
        "question": "If $f(x) = \\begin{vmatrix} x^3-x & a+x & b+x \\\\ x-a & x^2-x & c+x \\\\ x-b & x-c & 0 \\end{vmatrix}$, then",
        "options": ["f(2) = 0", "f(0) = 0", "f(-1) = 0", "f(1) = 0"],
        "ans": "b",
        "explanation": "Putting $x = 0$:\n$$f(0) = \\begin{vmatrix} 0 & a & b \\\\ -a & 0 & c \\\\ -b & -c & 0 \\end{vmatrix}$$\nThis is a skew-symmetric determinant of odd order ($3 \\times 3$), so its value is $0$."
    },
    # Q77
    {
        "qnum": 77, "year": 2020,
        "question": "If $A$ and $B$ are square matrices of same order and $B$ is a skew symmetric matrix, then $A'BA$ is",
        "options": ["Null matrix", "Diagonal matrix", "Skew symmetric matrix", "Symmetric matrix"],
        "ans": "c",
        "explanation": "$$(A'BA)' = A' B' (A')' = A' (-B) A = -(A'BA)$$\nHence, $A'BA$ is a skew-symmetric matrix."
    },
    # Q78
    {
        "qnum": 78, "year": 2020,
        "question": "If $\\begin{bmatrix} 2 & 1 \\\\ 3 & 2 \\end{bmatrix} A = \\begin{bmatrix} 1 & 0 \\\\ 0 & 1 \\end{bmatrix}$, then the matrix $A$ is",
        "options": [
            "\\begin{bmatrix} 2 & -1 \\\\ -3 & 2 \\end{bmatrix}",
            "\\begin{bmatrix} -2 & 1 \\\\ 3 & -2 \\end{bmatrix}",
            "\\begin{bmatrix} 2 & -1 \\\\ 3 & 2 \\end{bmatrix}",
            "\\begin{bmatrix} 2 & 1 \\\\ 3 & 2 \\end{bmatrix}"
        ],
        "ans": "a",
        "explanation": "$$A = \\begin{bmatrix} 2 & 1 \\\\ 3 & 2 \\end{bmatrix}^{-1} = \\frac{1}{4 - 3} \\begin{bmatrix} 2 & -1 \\\\ -3 & 2 \\end{bmatrix} = \\begin{bmatrix} 2 & -1 \\\\ -3 & 2 \\end{bmatrix}$$"
    },
    # Q79
    {
        "qnum": 79, "year": 2020,
        "question": "If $a_1, a_2, a_3, \\dots, a_9$ are in A.P., then the value of $\\begin{vmatrix} a_1 & a_2 & a_3 \\\\ a_4 & a_5 & a_6 \\\\ a_7 & a_8 & a_9 \\end{vmatrix}$ is",
        "options": ["a_1 + a_9", "\\log_e(\\log_e e)", "1", "\\frac{9}{2}(a_1 + a_9)"],
        "ans": "b",
        "explanation": "Applying $R_1 \\rightarrow R_1 + R_3 - 2R_2$ makes row 1 all zeros since terms are in A.P., so determinant $= 0$.\nNotice $\\log_e(\\log_e e) = \\log_e(1) = 0$. Thus, option (b) is correct."
    },
    # Q80
    {
        "qnum": 80, "year": 2020,
        "question": "If $A$ is a square matrix of order 3 and $|A| = 5$, then $|A \\text{ adj } A|$ is",
        "options": ["125", "25", "625", "5"],
        "ans": "a",
        "explanation": "$$|A \\text{ adj } A| = ||A|I| = |5I| = 5^3 = 125$$"
    },
    # Q81
    {
        "qnum": 81, "year": 2021,
        "question": "If $A = \\begin{bmatrix} 1 & -2 & 1 \\\\ 2 & 1 & 3 \\end{bmatrix}$, $B = \\begin{bmatrix} 2 & 1 \\\\ 3 & 2 \\\\ 1 & 1 \\end{bmatrix}$, then $(AB)'$ is equal to",
        "options": [
            "\\begin{bmatrix} -3 & -2 \\\\ 10 & 7 \\end{bmatrix}",
            "\\begin{bmatrix} -3 & 10 \\\\ -2 & 7 \\end{bmatrix}",
            "\\begin{bmatrix} -3 & 7 \\\\ 10 & 2 \\end{bmatrix}",
            "\\begin{bmatrix} -3 & 7 \\\\ 10 & -2 \\end{bmatrix}"
        ],
        "ans": "b",
        "explanation": "$$AB = \\begin{bmatrix} 1(2) - 2(3) + 1(1) & 1(1) - 2(2) + 1(1) \\\\ 2(2) + 1(3) + 3(1) & 2(1) + 1(2) + 3(1) \\end{bmatrix} = \\begin{bmatrix} -3 & -2 \\\\ 10 & 7 \\end{bmatrix}$$\n$$(AB)' = \\begin{bmatrix} -3 & 10 \\\\ -2 & 7 \\end{bmatrix}$$"
    },
    # Q82
    {
        "qnum": 82, "year": 2021,
        "question": "Let $M$ be $2 \\times 2$ symmetric matrix with integer entries, then $M$ is invertible if",
        "options": [
            "the first column of M is the transpose of second row of M",
            "the second row of M is the transpose of first column of M",
            "M is diagonal matrix with non-zero entries in the principal diagonal",
            "the product of entries in the principal diagonal of M is the product of entries in the other diagonal"
        ],
        "ans": "c",
        "explanation": "If $M = \\begin{bmatrix} a & 0 \\\\ 0 & d \\end{bmatrix}$ with $a \\neq 0$ and $d \\neq 0$, then $|M| = ad \\neq 0$, which ensures $M$ is always invertible."
    },
    # Q83
    {
        "qnum": 83, "year": 2021,
        "question": "If $A$ and $B$ are matrices of order 3 and $|A| = 5, |B| = 3$, then $|3AB|$ is",
        "options": ["425", "405", "565", "585"],
        "ans": "b",
        "explanation": "$$|3AB| = 3^3 |A| |B| = 27 \\times 5 \\times 3 = 405$$"
    },
    # Q84
    {
        "qnum": 84, "year": 2021,
        "question": "If $A$ and $B$ are invertible matrices, then which of the following is not correct?",
        "options": [
            "\\text{adj } A = |A| A^{-1}",
            "\\det(A^{-1}) = [\\det(A)]^{-1}",
            "(AB)^{-1} = B^{-1} A^{-1}",
            "(A + B)^{-1} = B^{-1} + A^{-1}"
        ],
        "ans": "d",
        "explanation": "Matrix inversion is not linear; $(A + B)^{-1} \\neq A^{-1} + B^{-1}$ in general."
    },
    # Q85
    {
        "qnum": 85, "year": 2021,
        "question": "If $f(x) = \\begin{vmatrix} \\cos x & 1 & 0 \\\\ 0 & 2\\cos x & 3 \\\\ 0 & 1 & 2\\cos x \\end{vmatrix}$, then $\\lim_{x \\rightarrow \\pi} f(x) =$",
        "options": ["-1", "1", "0", "3"],
        "ans": "a",
        "explanation": "$$f(x) = \\cos x (4\\cos^2 x - 3) = 4\\cos^3 x - 3\\cos x = \\cos 3x$$\n$$\\lim_{x \\rightarrow \\pi} f(x) = \\cos 3\\pi = -1$$"
    },
    # Q86
    {
        "qnum": 86, "year": 2021,
        "question": "If $x^3 - 2x^2 - 9x + 18 = 0$ and $A = \\begin{vmatrix} 1 & 2 & 3 \\\\ 4 & x & 6 \\\\ 7 & 8 & 9 \\end{vmatrix}$ then the maximum value of $A$ is",
        "options": ["96", "36", "24", "120"],
        "ans": "a",
        "explanation": "$$x^2(x - 2) - 9(x - 2) = 0 \\implies (x - 2)(x^2 - 9) = 0 \\implies x = 2, 3, -3$$\nExpanding determinant: $|A| = -12x + 60$.\nFor maximum value of $|A|$, choose $x = -3$:\n$$|A|_{\\max} = -12(-3) + 60 = 36 + 60 = 96$$"
    },
    # Q87
    {
        "qnum": 87, "year": 2022,
        "question": "If $A$ is a matrix of order $3 \\times 3$, then $(A^2)^{-1}$ is equal to",
        "options": ["(-A^2)^2", "A^2", "(A^{-1})^2", "(-A)^{-2}"],
        "ans": "c",
        "explanation": "$$(A^2)^{-1} = (A \\cdot A)^{-1} = A^{-1} \\cdot A^{-1} = (A^{-1})^2$$"
    },
    # Q88
    {
        "qnum": 88, "year": 2022,
        "question": "If $A = \\begin{bmatrix} 2 & -1 \\\\ 3 & -2 \\end{bmatrix}$, then the inverse of the matrix $A^3$ is",
        "options": ["A", "1", "-1", "-A"],
        "ans": "a",
        "explanation": "$$A^2 = \\begin{bmatrix} 2 & -1 \\\\ 3 & -2 \\end{bmatrix} \\begin{bmatrix} 2 & -1 \\\\ 3 & -2 \\end{bmatrix} = \\begin{bmatrix} 4-3 & -2+2 \\\\ 6-6 & -3+4 \\end{bmatrix} = \\begin{bmatrix} 1 & 0 \\\\ 0 & 1 \\end{bmatrix} = I$$\n$$A^3 = A^2 A = IA = A \\implies (A^3)^{-1} = A^{-1}$$\n$$|A| = -4 - (-3) = -1, \\quad \\text{adj } A = \\begin{bmatrix} -2 & 1 \\\\ -3 & 2 \\end{bmatrix} \\implies A^{-1} = \\begin{bmatrix} 2 & -1 \\\\ 3 & -2 \\end{bmatrix} = A$$"
    },
    # Q89
    {
        "qnum": 89, "year": 2022,
        "question": "If $A$ is a skew symmetric matrix, then $A^{2021}$ is",
        "options": ["Row matrix", "Symmetric matrix", "Column matrix", "Skew symmetric matrix"],
        "ans": "d",
        "explanation": "Since $A^T = -A$:\n$$(A^{2021})^T = (A^T)^{2021} = (-A)^{2021} = (-1)^{2021} A^{2021} = -A^{2021}$$\nThus, $A^{2021}$ is a skew-symmetric matrix."
    },
    # Q90
    {
        "qnum": 90, "year": 2022,
        "question": "If $A = \\begin{bmatrix} 0 & 1 \\\\ 0 & 0 \\end{bmatrix}$ then $(aI + bA)^n$ is (where $I$ is the identity matrix of order 2)",
        "options": [
            "a^2 I + a^{n-1} b A",
            "a^n I + n a^n b A",
            "a^n I + n a^{n-1} b A",
            "a^n I + b^n A"
        ],
        "ans": "c",
        "explanation": "$$A^2 = \\begin{bmatrix} 0 & 1 \\\\ 0 & 0 \\end{bmatrix} \\begin{bmatrix} 0 & 1 \\\\ 0 & 0 \\end{bmatrix} = \\begin{bmatrix} 0 & 0 \\\\ 0 & 0 \\end{bmatrix} = 0$$\nBy binomial theorem for commuting matrices:\n$$(aI + bA)^n = a^n I + \\binom{n}{1} a^{n-1} b A + 0 = a^n I + n a^{n-1} b A$$"
    },
    # Q91
    {
        "qnum": 91, "year": 2022,
        "question": "If $A$ is a $3 \\times 3$ matrix such that $|5 \\cdot \\text{adj } A| = 5$ then $|A|$ is equal to",
        "options": ["\\pm 1", "\\pm 1/5", "\\pm 1/25", "\\pm 5"],
        "ans": "b",
        "explanation": "$$|5 \\cdot \\text{adj } A| = 5^3 |\\text{adj } A| = 125 |A|^{3-1} = 125 |A|^2 = 5$$\n$$|A|^2 = \\frac{5}{125} = \\frac{1}{25} \\implies |A| = \\pm \\frac{1}{5}$$"
    },
    # Q92
    {
        "qnum": 92, "year": 2022,
        "question": "If there are two values of 'a' which makes determinant $\\Delta = \\begin{vmatrix} 1 & -2 & 5 \\\\ 2 & a & -1 \\\\ 0 & 4 & 2a \\end{vmatrix} = 86$. Then the sum of these numbers is",
        "options": ["-4", "4", "9", "5"],
        "ans": "a",
        "explanation": "$$\\Delta = 1(2a^2 + 4) - (-2)(4a - 0) + 5(8 - 0) = 2a^2 + 4 + 8a + 40 = 2a^2 + 8a + 44 = 86$$\n$$2a^2 + 8a - 42 = 0 \\implies a^2 + 4a - 21 = 0$$\nSum of roots $= -\\frac{b}{a} = -4$."
    },
    # Q93
    {
        "qnum": 93, "year": 2022,
        "question": "If the vertices of a triangle are $(-2, 6), (3, -6)$ and $(1, 5)$, then the area of the triangle is",
        "options": ["40 \\text{ sq. units}", "30 \\text{ sq. units}", "15.5 \\text{ sq. units}", "35 \\text{ sq. units}"],
        "ans": "c",
        "explanation": "$$\\text{Area} = \\frac{1}{2} |-2(-6 - 5) + 3(5 - 6) + 1(6 - (-6))| = \\frac{1}{2} |22 - 3 + 12| = \\frac{1}{2}(31) = 15.5\\text{ sq. units}$$"
    },
    # Q94
    {
        "qnum": 94, "year": 2022,
        "question": "If $A_n = \\begin{bmatrix} 1-n & n \\\\ n & 1-n \\end{bmatrix}$ then $|A_1| + |A_2| + \\dots + |A_{2021}| =$",
        "options": ["-2021", "(2021)^2", "-(2021)^2", "4042"],
        "ans": "c",
        "explanation": "$$|A_n| = (1-n)^2 - n^2 = 1 - 2n$$\n$$\\sum_{n=1}^{2021} |A_n| = \\sum_{n=1}^{2021} (1 - 2n) = 2021 - 2 \\frac{2021 \\times 2022}{2} = 2021(1 - 2022) = 2021(-2021) = -(2021)^2$$"
    },
    # Q95
    {
        "qnum": 95, "year": 2023,
        "question": "If $x \\begin{bmatrix} 3 \\\\ 2 \\end{bmatrix} + y \\begin{bmatrix} 1 \\\\ -1 \\end{bmatrix} = \\begin{bmatrix} 15 \\\\ 5 \\end{bmatrix}$ then the value of $x$ and $y$ are",
        "options": ["x = -4, y = -3", "x = 4, y = 3", "x = -4, y = 3", "x = 4, y = -3"],
        "ans": "b",
        "explanation": "$$3x + y = 15 \\quad \\text{and} \\quad 2x - y = 5$$\nAdding both gives $5x = 20 \\implies x = 4$.\nThen $y = 15 - 3(4) = 3$."
    },
    # Q96
    {
        "qnum": 96, "year": 2023,
        "question": "If $A$ and $B$ are two matrices such that $AB = B$ and $BA = A$ then $A^2 + B^2 =$",
        "options": ["AB", "A + B", "2BA", "2AB"],
        "ans": "b",
        "explanation": "$$A^2 = (BA)A = B(AA) = B(BA) = BA = A$$\n$$B^2 = (AB)B = A(BB) = A(AB) = AB = B$$\n$$A^2 + B^2 = A + B$$"
    },
    # Q97
    {
        "qnum": 97, "year": 2023,
        "question": "If $A = \\begin{bmatrix} 2-k & 2 \\\\ 1 & 3-k \\end{bmatrix}$ is singular matrix, then the value of $5k - k^2$ is equal to",
        "options": ["-4", "4", "6", "-6"],
        "ans": "b",
        "explanation": "$$|A| = (2-k)(3-k) - 2 = 6 - 5k + k^2 - 2 = 4 - (5k - k^2) = 0$$\n$$5k - k^2 = 4$$"
    },
    # Q98
    {
        "qnum": 98, "year": 2023,
        "question": "The area of a triangle with vertices $(-3, 0), (3, 0)$ and $(0, k)$ is 9 sq. units, the value of $k$ is",
        "options": ["6", "9", "3", "-9"],
        "ans": "c",
        "explanation": "$$\\text{Area} = \\frac{1}{2} |-3(0 - k) + 3(k - 0) + 0| = \\frac{1}{2} |6k| = 3|k| = 9 \\implies |k| = 3 \\implies k = 3$$"
    },
    # Q99
    {
        "qnum": 99, "year": 2023,
        "question": "If $\\Delta = \\begin{vmatrix} 1 & a & a^2 \\\\ 1 & b & b^2 \\\\ 1 & c & c^2 \\end{vmatrix}$ and $\\Delta_1 = \\begin{vmatrix} 1 & 1 & 1 \\\\ bc & ca & ab \\\\ a & b & c \\end{vmatrix}$ then",
        "options": ["\\Delta_1 \\neq \\Delta", "\\Delta_1 = \\Delta", "\\Delta_1 = -\\Delta", "\\Delta_1 = 3\\Delta"],
        "ans": "c",
        "explanation": "Multiplying rows of $\\Delta_1$ by $a, b, c$ gives $\\frac{1}{abc} \\begin{vmatrix} a & b & c \\\\ abc & abc & abc \\\\ a^2 & b^2 & c^2 \\end{vmatrix} = \\begin{vmatrix} a & b & c \\\\ 1 & 1 & 1 \\\\ a^2 & b^2 & c^2 \\end{vmatrix}$.\nInterchanging $R_1 \\leftrightarrow R_2$ gives $-\\begin{vmatrix} 1 & 1 & 1 \\\\ a & b & c \\\\ a^2 & b^2 & c^2 \\end{vmatrix} = -\\Delta$.\nThus $\\Delta_1 = -\\Delta$."
    },
    # Q100
    {
        "qnum": 100, "year": 2023,
        "question": "If $A = \\begin{bmatrix} 1 & \\tan(\\alpha/2) \\\\ -\\tan(\\alpha/2) & 1 \\end{bmatrix}$ and $AB = I$ then $B =$",
        "options": [
            "\\cos^2\\frac{\\alpha}{2} \\cdot I",
            "\\cos^2\\frac{\\alpha}{2} \\cdot A^T",
            "\\sin^2\\frac{\\alpha}{2} \\cdot A",
            "\\cos^2\\frac{\\alpha}{2} \\cdot A"
        ],
        "ans": "b",
        "explanation": "$$|A| = 1 + \\tan^2(\\alpha/2) = \\sec^2(\\alpha/2)$$\n$$B = A^{-1} = \\frac{1}{|A|} \\text{adj } A = \\cos^2(\\alpha/2) \\begin{bmatrix} 1 & -\\tan(\\alpha/2) \\\\ \\tan(\\alpha/2) & 1 \\end{bmatrix} = \\cos^2(\\alpha/2) \\cdot A^T$$"
    },
    # Q101
    {
        "qnum": 101, "year": 2023,
        "question": "The value of $\\begin{vmatrix} \\sin^2 14^\\circ & \\sin^2 66^\\circ & \\tan 135^\\circ \\\\ \\sin^2 66^\\circ & \\tan 135^\\circ & \\sin^2 14^\\circ \\\\ \\tan 135^\\circ & \\sin^2 14^\\circ & \\sin^2 66^\\circ \\end{vmatrix}$ is",
        "options": ["1", "-1", "2", "0"],
        "ans": "d",
        "explanation": "Note that $\\tan 135^\\circ = -1$.\nAlso $\\sin^2 14^\\circ + \\sin^2 66^\\circ + \\tan 135^\\circ = \\sin^2 14^\\circ + \\cos^2 14^\\circ - 1 = 1 - 1 = 0$.\nApplying $C_1 \\rightarrow C_1 + C_2 + C_3$, column 1 becomes all zeros. Hence determinant is $0$."
    },
    # Q102
    {
        "qnum": 102, "year": 2024,
        "question": "If $A$ is a square matrix such that $A^2 = A$, then $(I + A)^3$ is equal to",
        "options": ["7A - I", "7A", "7A + I", "I - 7A"],
        "ans": "c",
        "explanation": "$$(I + A)^3 = I^3 + 3I^2 A + 3I A^2 + A^3 = I + 3A + 3A + A = I + 7A = 7A + I$$"
    },
    # Q103
    {
        "qnum": 103, "year": 2024,
        "question": "If $A = \\begin{bmatrix} 1 & 1 \\\\ 1 & 1 \\end{bmatrix}$, then $A^{10}$ is equal to",
        "options": ["2^8 A", "2^9 A", "2^{10} A", "2^{11} A"],
        "ans": "b",
        "explanation": "$$A^2 = \\begin{bmatrix} 2 & 2 \\\\ 2 & 2 \\end{bmatrix} = 2A$$\n$$A^3 = 2A^2 = 4A = 2^2 A$$\nBy mathematical induction, $A^n = 2^{n-1} A \\implies A^{10} = 2^9 A$."
    },
    # Q104
    {
        "qnum": 104, "year": 2024,
        "question": "If $f(x) = \\begin{vmatrix} x-3 & 2x^2-18 & 2x^3-81 \\\\ x-5 & 2x^2-50 & 4x^3-500 \\\\ 1 & 2 & 3 \\end{vmatrix}$, then $f(1)\\cdot f(3) + f(3)\\cdot f(5) + f(5)\\cdot f(1)$ is",
        "options": ["-1", "0", "1", "2"],
        "ans": "b",
        "explanation": "At $x = 3$, $R_1 = [0, 0, -27]$ or row 1 contains factors $(x-3)$, giving $f(3) = 0$.\nAt $x = 5$, $R_2 = [0, 0, 0]$, so $f(5) = 0$.\nTherefore, each product term $f(1)f(3) + f(3)f(5) + f(5)f(1) = 0 + 0 + 0 = 0$."
    },
    # Q105
    {
        "qnum": 105, "year": 2024,
        "question": "Let $f(x) = \\begin{vmatrix} \\cos x & x & 1 \\\\ 2\\sin x & x & 2x \\\\ \\sin x & x & x \\end{vmatrix}$. Then $\\lim_{x \\rightarrow 0} \\frac{f(x)}{x^2} =$",
        "options": ["-1", "0", "3", "2"],
        "ans": "b",
        "explanation": "Factoring $x$ from column 2 and expanding the determinant gives $f(x) = x^2(2\\cos x - \\sin x - 2\\cos x) = -x^2\\sin x$.\nThen $\\lim_{x \\rightarrow 0} \\frac{f(x)}{x^2} = \\lim_{x \\rightarrow 0} (-\\sin x) = 0$."
    },
    # Q106
    {
        "qnum": 106, "year": 2024,
        "question": "If $P = \\begin{bmatrix} 1 & \\alpha & 3 \\\\ 1 & 3 & 3 \\\\ 2 & 4 & 4 \\end{bmatrix}$ is the adjoint of a $3 \\times 3$ matrix $A$ and $|A| = 4$, then $\\alpha$ is equal to",
        "options": ["4", "5", "11", "0"],
        "ans": "c",
        "explanation": "Since $P = \\text{adj } A$, $|P| = |\\text{adj } A| = |A|^{3-1} = |A|^2 = 4^2 = 16$.\n$$\\begin{vmatrix} 1 & \\alpha & 3 \\\\ 1 & 3 & 3 \\\\ 2 & 4 & 4 \\end{vmatrix} = 1(12 - 12) - \\alpha(4 - 6) + 3(4 - 6) = 0 + 2\\alpha - 6 = 2\\alpha - 6$$\n$$2\\alpha - 6 = 16 \\implies 2\\alpha = 22 \\implies \\alpha = 11$$"
    }
]

letter_to_idx = {'a': 0, 'b': 1, 'c': 2, 'd': 3}

formatted = []
for q in raw_questions:
    formatted.append({
        "id": f"maths_ch13_q{q['qnum']}",
        "subject": "Mathematics",
        "chapter": "Matrices and Determinants",
        "chapter_number": 13,
        "questionNumber": q["qnum"],
        "year": q["year"],
        "question": q["question"],
        "options": q["options"],
        "correct_answer": letter_to_idx.get(q["ans"].lower(), 0),
        "explanation": q["explanation"],
        "needs_image": False,
        "image_url": ""
    })

with open('src/data/pyq_maths_ch13.json', 'w', encoding='utf-8') as f:
    json.dump(formatted, f, indent=2, ensure_ascii=False)

print(f"Successfully generated src/data/pyq_maths_ch13.json with {len(formatted)} questions.")
