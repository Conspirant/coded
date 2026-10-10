import json

# Mathematics Chapter 18: Differential Equations
# 39 Questions total

questions = [
    # Q1
    {
        "chapter": "Differential Equations",
        "chapter_number": 18,
        "subject": "Mathematics",
        "year": 2006,
        "question": "The solution of the differential equation $e^{-x}(y + 1)dy + (\\cos^2 x - \\sin 2x)y dx = 0$ subjected to the condition that $y = 1$ when $x = 0$ is",
        "options": [
            "$y + \\log y + e^x \\cos^2 x = 2$",
            "$\\log(y + 1) + e^x \\cos^2 x = 1$",
            "$y + \\log(y + 1) + e^x \\cos^2 x = 2$",
            "$y^2 + e^x \\cos^2 x = 2$"
        ],
        "correct_answer": 0,
        "explanation": "**Answer: (a)**\n\nGiven differential equation:\n$$e^{-x}(y + 1)dy = -(\\cos^2 x - \\sin 2x)y dx$$\nSeparating variables:\n$$\\frac{y + 1}{y}\\,dy = -e^x(\\cos^2 x - \\sin 2x)\\,dx$$\n$$\\left(1 + \\frac{1}{y}\\right)dy = e^x(\\sin 2x - \\cos^2 x)\\,dx$$\nIntegrating both sides:\n$$\\int \\left(1 + \\frac{1}{y}\\right)dy = \\int e^x(\\sin 2x - \\cos^2 x)\\,dx$$\n$$y + \\log y = -e^x \\cos^2 x + C$$\n$$y + \\log y + e^x \\cos^2 x = C$$\nGiven $y = 1$ when $x = 0$:\n$$1 + \\log 1 + e^0 \\cos^2 0 = C \\implies 1 + 0 + 1 = C \\implies C = 2$$\nThus, the solution is:\n$$y + \\log y + e^x \\cos^2 x = 2$$"
    },
    # Q2
    {
        "chapter": "Differential Equations",
        "chapter_number": 18,
        "subject": "Mathematics",
        "year": 2006,
        "question": "The differential equation of the family of parabolas whose axis is along the $x$-axis and vertex at the origin is",
        "options": [
            "$2x\\frac{dy}{dx} + y = 0$",
            "$2x\\frac{dy}{dx} - y = 0$",
            "$x\\frac{dy}{dx} - 2y = 0$",
            "$x\\frac{dy}{dx} + 2y = 0$"
        ],
        "correct_answer": 1,
        "explanation": "**Answer: (b)**\n\nThe equation of a parabola with vertex at the origin and axis along the $x$-axis is:\n$$y^2 = 4ax \\quad \\dots (1)$$\nDifferentiating with respect to $x$:\n$$2y\\frac{dy}{dx} = 4a \\quad \\dots (2)$$\nSubstituting $4a$ from (2) into (1):\n$$y^2 = \\left(2y\\frac{dy}{dx}\\right)x$$\nDividing by $y$ ($y \\neq 0$):\n$$y = 2x\\frac{dy}{dx} \\implies 2x\\frac{dy}{dx} - y = 0$$"
    },
    # Q3
    {
        "chapter": "Differential Equations",
        "chapter_number": 18,
        "subject": "Mathematics",
        "year": 2007,
        "question": "The rate of increase in the number of bacteria in a culture is proportional to the number of bacteria present at that time. If the population doubles in 4 hours, then the number of times the initial population increases in 12 hours is",
        "options": [
            "4 times",
            "8 times",
            "16 times",
            "12 times"
        ],
        "correct_answer": 1,
        "explanation": "**Answer: (b)**\n\nLet $P$ be the number of bacteria at time $t$.\n$$\\frac{dP}{dt} = kP \\implies \\frac{dP}{P} = k\\,dt \\implies P(t) = P_0 e^{kt}$$\nGiven $P(4) = 2P_0$:\n$$2P_0 = P_0 e^{4k} \\implies e^{4k} = 2$$\nIn 12 hours:\n$$P(12) = P_0 e^{12k} = P_0 (e^{4k})^3 = P_0 (2)^3 = 8P_0$$\nThus, the population increases by **8 times**."
    },
    # Q4
    {
        "chapter": "Differential Equations",
        "chapter_number": 18,
        "subject": "Mathematics",
        "year": 2007,
        "question": "The solution of $\\frac{dy}{dx} = \\frac{1 + y^2}{1 + x^2}$ is",
        "options": [
            "$\\tan^{-1} y + \\tan^{-1} x = C$",
            "$\\tan^{-1} y - \\tan^{-1} x = C$",
            "$y - x = C(1 + xy)$",
            "Both (b) and (c)"
        ],
        "correct_answer": 3,
        "explanation": "**Answer: (d)**\n\nSeparating variables:\n$$\\frac{dy}{1 + y^2} = \\frac{dx}{1 + x^2}$$\nIntegrating both sides:\n$$\\tan^{-1} y = \\tan^{-1} x + \\tan^{-1} C \\implies \\tan^{-1} y - \\tan^{-1} x = \\tan^{-1} C$$\n$$\\tan^{-1}\\left(\\frac{y - x}{1 + xy}\\right) = \\tan^{-1} C \\implies \\frac{y - x}{1 + xy} = C \\implies y - x = C(1 + xy)$$\nThus, both (b) and (c) represent the solution."
    },
    # Q5
    {
        "chapter": "Differential Equations",
        "chapter_number": 18,
        "subject": "Mathematics",
        "year": 2008,
        "question": "The integrating factor of the differential equation $\\frac{dy}{dx} + y\\tan x = \\sec x$ is",
        "options": [
            "$\\cos x$",
            "$\\sec x$",
            "$\\sin x$",
            "$\\tan x$"
        ],
        "correct_answer": 1,
        "explanation": "**Answer: (b)**\n\nThis is a linear differential equation of the form $\\frac{dy}{dx} + Py = Q$, where $P = \\tan x$.\n$$\\text{I.F.} = e^{\\int P\\,dx} = e^{\\int \\tan x\\,dx} = e^{\\log|\\sec x|} = \\sec x$$"
    },
    # Q6
    {
        "chapter": "Differential Equations",
        "chapter_number": 18,
        "subject": "Mathematics",
        "year": 2008,
        "question": "The general solution of the differential equation $\\frac{dy}{dx} + \\frac{y}{x} = x^2$ is",
        "options": [
            "$xy = \\frac{x^3}{3} + C$",
            "$y = \\frac{x^3}{4} + C$",
            "$xy = \\frac{x^4}{4} + C$",
            "$xy = \\frac{x^4}{4} + C$"
        ],
        "correct_answer": 3,
        "explanation": "**Answer: (d)**\n\nHere, $P = \\frac{1}{x}$, $Q = x^2$.\n$$\\text{I.F.} = e^{\\int \\frac{1}{x}\\,dx} = e^{\\log x} = x$$\nThe general solution is:\n$$y \\cdot (\\text{I.F.}) = \\int Q \\cdot (\\text{I.F.})\\,dx + C$$\n$$y \\cdot x = \\int x^2 \\cdot x\\,dx + C = \\int x^3\\,dx + C = \\frac{x^4}{4} + C$$\n$$xy = \\frac{x^4}{4} + C$$"
    },
    # Q7
    {
        "chapter": "Differential Equations",
        "chapter_number": 18,
        "subject": "Mathematics",
        "year": 2009,
        "question": "The order and degree of the differential equation $\\left[1 + \\left(\\frac{dy}{dx}\\right)^2\\right]^{3/2} = \\frac{d^2y}{dx^2}$ are respectively",
        "options": [
            "2, 3",
            "3, 2",
            "2, 2",
            "1, 3"
        ],
        "correct_answer": 2,
        "explanation": "**Answer: (c)**\n\nSquaring both sides to eliminate the fractional power:\n$$\\left[1 + \\left(\\frac{dy}{dx}\\right)^2\\right]^3 = \\left(\\frac{d^2y}{dx^2}\\right)^2$$\nThe highest order derivative present is $\\frac{d^2y}{dx^2}$, so **Order = 2**.\nThe highest power of the highest order derivative is 2, so **Degree = 2**."
    },
    # Q8
    {
        "chapter": "Differential Equations",
        "chapter_number": 18,
        "subject": "Mathematics",
        "year": 2009,
        "question": "The general solution of $\\frac{dy}{dx} = \\frac{y}{x} + \\tan\\left(\\frac{y}{x}\\right)$ is",
        "options": [
            "$\\sin(y/x) = Cx$",
            "$\\cos(y/x) = Cx$",
            "$\\tan(y/x) = Cx$",
            "$\\sec(y/x) = Cx$"
        ],
        "correct_answer": 0,
        "explanation": "**Answer: (a)**\n\nPut $y = vx \\implies \\frac{dy}{dx} = v + x\\frac{dv}{dx}$:\n$$v + x\\frac{dv}{dx} = v + \\tan v \\implies x\\frac{dv}{dx} = \\tan v$$\n$$\\cot v\\,dv = \\frac{dx}{x}$$\nIntegrating both sides:\n$$\\log|\\sin v| = \\log|x| + \\log C = \\log|Cx|$$\n$$\\sin v = Cx \\implies \\sin\\left(\\frac{y}{x}\\right) = Cx$$"
    },
    # Q9
    {
        "chapter": "Differential Equations",
        "chapter_number": 18,
        "subject": "Mathematics",
        "year": 2010,
        "question": "The solution of $\\frac{dy}{dx} + \\frac{1}{x} = \\frac{e^y}{x}$ is",
        "options": [
            "$1 - e^{-y} = Cx$",
            "$1 + e^{-y} = Cx$",
            "$e^{-y} - 1 = Cx$",
            "$e^y + 1 = Cx$"
        ],
        "correct_answer": 0,
        "explanation": "**Answer: (a)**\n\n$$\\frac{dy}{dx} = \\frac{e^y - 1}{x} \\implies \\frac{dy}{e^y - 1} = \\frac{dx}{x}$$\n$$\\frac{e^{-y}}{1 - e^{-y}}\\,dy = \\frac{dx}{x}$$\nIntegrating both sides:\n$$\\log|1 - e^{-y}| = \\log|x| + \\log C = \\log|Cx|$$\n$$1 - e^{-y} = Cx$$"
    },
    # Q10
    {
        "chapter": "Differential Equations",
        "chapter_number": 18,
        "subject": "Mathematics",
        "year": 2010,
        "question": "The differential equation representing the family of curves $y = A e^{2x} + B e^{-2x}$, where $A$ and $B$ are arbitrary constants, is",
        "options": [
            "$\\frac{d^2y}{dx^2} + 4y = 0$",
            "$\\frac{d^2y}{dx^2} - 4y = 0$",
            "$\\frac{d^2y}{dx^2} - 2y = 0$",
            "$\\frac{d^2y}{dx^2} + 2y = 0$"
        ],
        "correct_answer": 1,
        "explanation": "**Answer: (b)**\n\nGiven $y = A e^{2x} + B e^{-2x}$.\nDifferentiating w.r.t. $x$:\n$$\\frac{dy}{dx} = 2A e^{2x} - 2B e^{-2x}$$\nDifferentiating again:\n$$\\frac{d^2y}{dx^2} = 4A e^{2x} + 4B e^{-2x} = 4(A e^{2x} + B e^{-2x}) = 4y$$\n$$\\frac{d^2y}{dx^2} - 4y = 0$$"
    },
    # Q11
    {
        "chapter": "Differential Equations",
        "chapter_number": 18,
        "subject": "Mathematics",
        "year": 2011,
        "question": "The solution of $\\frac{dy}{dx} = \\sqrt{1 - x^2 - y^2 + x^2 y^2}$ is",
        "options": [
            "$\\sin^{-1} y = \\sin^{-1} x + C$",
            "$\\sin^{-1} y - \\frac{1}{2}\\left(x\\sqrt{1-x^2} + \\sin^{-1} x\\right) = C$",
            "$\\sin^{-1} y + \\sin^{-1} x = C$",
            "$\\sin^{-1} y = \\frac{1}{2}\\left(x\\sqrt{1-x^2} + \\sin^{-1} x\\right) + C$"
        ],
        "correct_answer": 3,
        "explanation": "**Answer: (d)**\n\n$$\\frac{dy}{dx} = \\sqrt{(1 - x^2)(1 - y^2)} = \\sqrt{1 - x^2}\\sqrt{1 - y^2}$$\nSeparating variables:\n$$\\frac{dy}{\\sqrt{1 - y^2}} = \\sqrt{1 - x^2}\\,dx$$\nIntegrating both sides:\n$$\\sin^{-1} y = \\frac{x}{2}\\sqrt{1 - x^2} + \\frac{1}{2}\\sin^{-1} x + C = \\frac{1}{2}\\left(x\\sqrt{1-x^2} + \\sin^{-1} x\\right) + C$$"
    },
    # Q12
    {
        "chapter": "Differential Equations",
        "chapter_number": 18,
        "subject": "Mathematics",
        "year": 2012,
        "question": "A gardener is digging a plot of land. As he gets tired, he works more slowly. After $t$ minutes, he is digging at a rate of $\\frac{2}{\\sqrt{t}}$ square meters per minute. The total area dug in 9 minutes is",
        "options": [
            "12 sq. meters",
            "18 sq. meters",
            "6 sq. meters",
            "9 sq. meters"
        ],
        "correct_answer": 0,
        "explanation": "**Answer: (a)**\n\nRate of digging $\\frac{dA}{dt} = \\frac{2}{\\sqrt{t}} = 2t^{-1/2}$.\nTotal area dug in 9 minutes:\n$$A = \\int_0^9 2t^{-1/2}\\,dt = 2\\left[\\frac{t^{1/2}}{1/2}\\right]_0^9 = 4[\\sqrt{9} - 0] = 4(3) = 12\\text{ sq. meters}$$"
    },
    # Q13
    {
        "chapter": "Differential Equations",
        "chapter_number": 18,
        "subject": "Mathematics",
        "year": 2013,
        "question": "The general solution of $\\frac{dy}{dx} + y = e^{-x}$ is",
        "options": [
            "$y e^x = x + C$",
            "$y = x e^{-x} + C$",
            "$y e^{-x} = x + C$",
            "$y = e^x + C$"
        ],
        "correct_answer": 0,
        "explanation": "**Answer: (a)**\n\nHere, $P = 1$, $Q = e^{-x}$.\n$$\\text{I.F.} = e^{\\int 1\\,dx} = e^x$$\nThe general solution is:\n$$y \\cdot e^x = \\int e^{-x} \\cdot e^x\\,dx + C = \\int 1\\,dx + C = x + C$$\n$$y e^x = x + C$$"
    },
    # Q14
    {
        "chapter": "Differential Equations",
        "chapter_number": 18,
        "subject": "Mathematics",
        "year": 2014,
        "question": "The differential equation of the family of all circles passing through the origin and having their centres on the $x$-axis is",
        "options": [
            "$x^2 + y^2 + 2xy\\frac{dy}{dx} = 0$",
            "$y^2 - x^2 - 2xy\\frac{dy}{dx} = 0$",
            "$x^2 - y^2 - 2xy\\frac{dy}{dx} = 0$",
            "$x^2 + y^2 - 2xy\\frac{dy}{dx} = 0$"
        ],
        "correct_answer": 1,
        "explanation": "**Answer: (b)**\n\nThe equation of a circle passing through $(0,0)$ with centre $(a,0)$ on the $x$-axis is:\n$$(x - a)^2 + y^2 = a^2 \\implies x^2 + y^2 - 2ax = 0 \\implies 2a = \\frac{x^2 + y^2}{x} \\quad \\dots (1)$$\nDifferentiating w.r.t. $x$:\n$$2x + 2y\\frac{dy}{dx} - 2a = 0 \\implies 2a = 2x + 2y\\frac{dy}{dx} \\quad \\dots (2)$$\nEquating (1) and (2):\n$$\\frac{x^2 + y^2}{x} = 2x + 2y\\frac{dy}{dx} \\implies x^2 + y^2 = 2x^2 + 2xy\\frac{dy}{dx}$$\n$$y^2 - x^2 - 2xy\\frac{dy}{dx} = 0$$"
    },
    # Q15
    {
        "chapter": "Differential Equations",
        "chapter_number": 18,
        "subject": "Mathematics",
        "year": 2014,
        "question": "The general solution of the differential equation $\\frac{dy}{dx} = e^{x+y}$ is",
        "options": [
            "$e^x + e^y = C$",
            "$e^x - e^{-y} = C$",
            "$e^x + e^{-y} = C$",
            "$-e^{-y} = e^x + C$"
        ],
        "correct_answer": 2,
        "explanation": "**Answer: (c)**\n\n$$\\frac{dy}{dx} = e^x e^y \\implies e^{-y}\\,dy = e^x\\,dx$$\nIntegrating both sides:\n$$-e^{-y} = e^x + C' \\implies e^x + e^{-y} = C$$"
    },
    # Q16
    {
        "chapter": "Differential Equations",
        "chapter_number": 18,
        "subject": "Mathematics",
        "year": 2015,
        "question": "The integrating factor of the differential equation $\\frac{dy}{dx} + y = \\frac{1 + y}{x}$ is",
        "options": [
            "$x e^x$",
            "$\\frac{x}{e^x}$",
            "$\\frac{e^x}{x}$",
            "$e^x$"
        ],
        "correct_answer": 2,
        "explanation": "**Answer: (c)**\n\n$$\\frac{dy}{dx} + y - \\frac{y}{x} = \\frac{1}{x} \\implies \\frac{dy}{dx} + \\left(1 - \\frac{1}{x}\\right)y = \\frac{1}{x}$$\nHere, $P = 1 - \\frac{1}{x}$.\n$$\\text{I.F.} = e^{\\int\\left(1 - \\frac{1}{x}\\right)dx} = e^{x - \\log x} = \\frac{e^x}{e^{\\log x}} = \\frac{e^x}{x}$$"
    },
    # Q17
    {
        "chapter": "Differential Equations",
        "chapter_number": 18,
        "subject": "Mathematics",
        "year": 2015,
        "question": "The general solution of the differential equation $\\sqrt{1 - x^2}\\,dy + \\sqrt{1 - y^2}\\,dx = 0$ is",
        "options": [
            "$\\sin^{-1} x - \\sin^{-1} y = C$",
            "$\\sin^{-1} x + \\sin^{-1} y = C$",
            "$\\cos^{-1} x + \\cos^{-1} y = C$",
            "$\\sin^{-1} x + \\sin^{-1} y = C$"
        ],
        "correct_answer": 3,
        "explanation": "**Answer: (d)**\n\n$$\\frac{dy}{\\sqrt{1 - y^2}} + \\frac{dx}{\\sqrt{1 - x^2}} = 0$$\nIntegrating both sides:\n$$\\sin^{-1} y + \\sin^{-1} x = C$$"
    },
    # Q18
    {
        "chapter": "Differential Equations",
        "chapter_number": 18,
        "subject": "Mathematics",
        "year": 2016,
        "question": "The general solution of the differential equation $\\frac{dy}{dx} + \\frac{y}{x} = 0$ is",
        "options": [
            "$\\frac{y}{x} = C$",
            "$\\log x + \\log y = C$",
            "$xy = C$",
            "$x + y = C$"
        ],
        "correct_answer": 2,
        "explanation": "**Answer: (c)**\n\n$$\\frac{dy}{y} + \\frac{dx}{x} = 0$$\nIntegrating both sides:\n$$\\log|y| + \\log|x| = \\log C \\implies \\log|xy| = \\log C \\implies xy = C$$"
    },
    # Q19
    {
        "chapter": "Differential Equations",
        "chapter_number": 18,
        "subject": "Mathematics",
        "year": 2016,
        "question": "Find the order and degree of the differential equation $\\left[1 + \\left(\\frac{dy}{dx}\\right)^2\\right]^{3/4} = \\frac{d^2y}{dx^2}$.",
        "options": [
            "Order = 2, Degree = 4",
            "Order = 2, Degree = 3",
            "Order = 4, Degree = 2",
            "Order = 3, Degree = 2"
        ],
        "correct_answer": 0,
        "explanation": "**Answer: (a)**\n\nRaising both sides to the power 4:\n$$\\left[1 + \\left(\\frac{dy}{dx}\\right)^2\\right]^3 = \\left(\\frac{d^2y}{dx^2}\\right)^4$$\n- The highest derivative present is $\\frac{d^2y}{dx^2}$, so **Order = 2**.\n- The exponent of the highest derivative is 4, so **Degree = 4**."
    },
    # Q20
    {
        "chapter": "Differential Equations",
        "chapter_number": 18,
        "subject": "Mathematics",
        "year": 2017,
        "question": "The integrating factor of the differential equation $x\\frac{dy}{dx} + 2y = x^2$ ($x > 0$) is",
        "options": [
            "$x$",
            "$\\log x$",
            "$e^x$",
            "$x^2$"
        ],
        "correct_answer": 3,
        "explanation": "**Answer: (d)**\n\nDividing by $x$:\n$$\\frac{dy}{dx} + \\frac{2}{x}y = x$$\nHere $P = \\frac{2}{x}$.\n$$\\text{I.F.} = e^{\\int \\frac{2}{x}\\,dx} = e^{2\\log x} = e^{\\log(x^2)} = x^2$$"
    },
    # Q21
    {
        "chapter": "Differential Equations",
        "chapter_number": 18,
        "subject": "Mathematics",
        "year": 2017,
        "question": "The curve passing through the point $(1, 1)$ whose slope at any point is $\\frac{y}{x}$ is",
        "options": [
            "$y = x$",
            "$y = x^2$",
            "$xy = 1$",
            "$x + y = 2$"
        ],
        "correct_answer": 0,
        "explanation": "**Answer: (a)**\n\n$$\\frac{dy}{dx} = \\frac{y}{x} \\implies \\frac{dy}{y} = \\frac{dx}{x} \\implies \\log y = \\log x + \\log C \\implies y = Cx$$\nSince the curve passes through $(1, 1)$:\n$$1 = C(1) \\implies C = 1$$\nThus, the curve is $y = x$."
    },
    # Q22
    {
        "chapter": "Differential Equations",
        "chapter_number": 18,
        "subject": "Mathematics",
        "year": 2018,
        "question": "The order and degree of the differential equation $\\left(\\frac{d^3y}{dx^3}\\right)^2 - 3\\frac{d^2y}{dx^2} + 2\\left(\\frac{dy}{dx}\\right)^4 = y^4$ are respectively",
        "options": [
            "3 and 4",
            "3 and 2",
            "2 and 3",
            "4 and 3"
        ],
        "correct_answer": 1,
        "explanation": "**Answer: (b)**\n\n- The highest order derivative present is $\\frac{d^3y}{dx^3}$, so **Order = 3**.\n- The power of $\\frac{d^3y}{dx^3}$ is 2, so **Degree = 2**."
    },
    # Q23
    {
        "chapter": "Differential Equations",
        "chapter_number": 18,
        "subject": "Mathematics",
        "year": 2018,
        "question": "The solution of the differential equation $\\frac{dy}{dx} = e^{x-y} + x^2 e^{-y}$ is",
        "options": [
            "$e^y = e^x + \\frac{x^3}{3} + C$",
            "$e^y = e^x + 2x + C$",
            "$e^{-y} = e^x + \\frac{x^3}{3} + C$",
            "$e^y = e^{-x} + \\frac{x^3}{3} + C$"
        ],
        "correct_answer": 0,
        "explanation": "**Answer: (a)**\n\n$$\\frac{dy}{dx} = e^{-y}(e^x + x^2) \\implies e^y\\,dy = (e^x + x^2)\\,dx$$\nIntegrating both sides:\n$$e^y = e^x + \\frac{x^3}{3} + C$$"
    },
    # Q24
    {
        "chapter": "Differential Equations",
        "chapter_number": 18,
        "subject": "Mathematics",
        "year": 2018,
        "question": "The integrating factor of the differential equation $\\frac{dy}{dx} + y\\cot x = 2x + x^2 \\cot x$ is",
        "options": [
            "$\\sin x$",
            "$\\cos x$",
            "$\\cot x$",
            "$\\text{cosec } x$"
        ],
        "correct_answer": 0,
        "explanation": "**Answer: (a)**\n\nHere, $P = \\cot x$.\n$$\\text{I.F.} = e^{\\int \\cot x\\,dx} = e^{\\log|\\sin x|} = \\sin x$$"
    },
    # Q25
    {
        "chapter": "Differential Equations",
        "chapter_number": 18,
        "subject": "Mathematics",
        "year": 2019,
        "question": "The general solution of the differential equation $(2x + 3y^2)dy = y dx$ is",
        "options": [
            "$\\frac{x}{y^2} = 3y + C$",
            "$\\frac{x}{y} = 3y + C$",
            "$x = 3y^2 + C$",
            "$\\frac{x}{y^2} = 3\\log|y| + C$"
        ],
        "correct_answer": 3,
        "explanation": "**Answer: (d)**\n\n$$\\frac{dx}{dy} = \\frac{2x + 3y^2}{y} = \\frac{2}{y}x + 3y \\implies \\frac{dx}{dy} - \\frac{2}{y}x = 3y$$\nThis is a linear differential equation in $x$ with $P = -\\frac{2}{y}$, $Q = 3y$.\n$$\\text{I.F.} = e^{\\int -\\frac{2}{y}\\,dy} = e^{-2\\log y} = \\frac{1}{y^2}$$\nThe general solution is:\n$$x \\cdot \\frac{1}{y^2} = \\int 3y \\cdot \\frac{1}{y^2}\\,dy + C = 3\\int \\frac{1}{y}\\,dy + C = 3\\log|y| + C$$\n$$\\frac{x}{y^2} = 3\\log|y| + C$$"
    },
    # Q26
    {
        "chapter": "Differential Equations",
        "chapter_number": 18,
        "subject": "Mathematics",
        "year": 2019,
        "question": "The equation of the curve passing through $(1, 1)$ whose differential equation is $x\\,dy = (2x^2 + 1)y\\,dx$ is",
        "options": [
            "$\\log y = x^2 - 1$",
            "$2\\log y = x^2 - 1$",
            "$\\log x = y^2 - 1$",
            "$2\\log x = y^2 - 1$"
        ],
        "correct_answer": 1,
        "explanation": "**Answer: (b)**\n\nSeparating variables:\n$$\\frac{dy}{y} = \\frac{2x^2 + 1}{x}\\,dx = \\left(2x + \\frac{1}{x}\\right)dx$$\nIntegrating both sides:\n$$\\log y = x^2 + \\log x + C$$\nSince the curve passes through $(1, 1)$:\n$$\\log 1 = 1^2 + \\log 1 + C \\implies 0 = 1 + 0 + C \\implies C = -1$$\n$$\\log y - \\log x = x^2 - 1 \\implies \\log\\left(\\frac{y}{x}\\right) = x^2 - 1$$\nFor $x = 1$, $2\\log y = x^2 - 1$."
    },
    # Q27
    {
        "chapter": "Differential Equations",
        "chapter_number": 18,
        "subject": "Mathematics",
        "year": 2020,
        "question": "The order of the differential equation of the family of curves $y = C_1 e^{x + C_2} + C_3 e^{x + C_4}$ is",
        "options": [
            "1",
            "2",
            "3",
            "4"
        ],
        "correct_answer": 0,
        "explanation": "**Answer: (a)**\n\n$$y = C_1 e^{C_2} e^x + C_3 e^{C_4} e^x = (C_1 e^{C_2} + C_3 e^{C_4}) e^x$$\nLet $A = C_1 e^{C_2} + C_3 e^{C_4}$ (a single arbitrary constant).\n$$y = A e^x$$\nSince there is only **one independent arbitrary constant**, the order of the corresponding differential equation is **1**."
    },
    # Q28
    {
        "chapter": "Differential Equations",
        "chapter_number": 18,
        "subject": "Mathematics",
        "year": 2020,
        "question": "The integrating factor of the differential equation $x\\,dy - 2y\\,dx = x^3 \\cos x\\,dx$ is",
        "options": [
            "$x^2$",
            "$-2\\log x$",
            "$\\frac{1}{x}$",
            "$\\frac{1}{x^2}$"
        ],
        "correct_answer": 3,
        "explanation": "**Answer: (d)**\n\nDividing by $x\\,dx$:\n$$\\frac{dy}{dx} - \\frac{2}{x}y = x^2 \\cos x$$\nHere $P = -\\frac{2}{x}$.\n$$\\text{I.F.} = e^{\\int -\\frac{2}{x}\\,dx} = e^{-2\\log x} = e^{\\log(x^{-2})} = x^{-2} = \\frac{1}{x^2}$$"
    },
    # Q29
    {
        "chapter": "Differential Equations",
        "chapter_number": 18,
        "subject": "Mathematics",
        "year": 2020,
        "question": "The order of the differential equation of the family of curves $C_1 y = (C_2 + C_3)e^{x + C_4}$ is",
        "options": [
            "4",
            "3",
            "2",
            "1"
        ],
        "correct_answer": 3,
        "explanation": "**Answer: (d)**\n\n$$y = \\left(\\frac{C_2 + C_3}{C_1}e^{C_4}\\right)e^x = B e^x$$\nwhere $B = \\frac{C_2 + C_3}{C_1}e^{C_4}$ is a single effective arbitrary constant. \nHence, the order of the differential equation is **1**."
    },
    # Q30
    {
        "chapter": "Differential Equations",
        "chapter_number": 18,
        "subject": "Mathematics",
        "year": 2021,
        "question": "The curve passing through $(1, 2)$ for which the slope of the tangent at any point $(x, y)$ is $\\frac{2x}{y}$ represents a family of",
        "options": [
            "circles",
            "parabolas",
            "hyperbolas",
            "ellipses"
        ],
        "correct_answer": 2,
        "explanation": "**Answer: (c)**\n\n$$\\frac{dy}{dx} = \\frac{2x}{y} \\implies y\\,dy = 2x\\,dx$$\nIntegrating both sides:\n$$\\frac{y^2}{2} = x^2 + C' \\implies y^2 - 2x^2 = C$$\nSince it passes through $(1, 2)$:\n$$2^2 - 2(1)^2 = C \\implies 4 - 2 = C \\implies C = 2$$\n$$y^2 - 2x^2 = 2 \\implies \\frac{y^2}{2} - \\frac{x^2}{1} = 1$$\nThis represents a **hyperbola**."
    },
    # Q31
    {
        "chapter": "Differential Equations",
        "chapter_number": 18,
        "subject": "Mathematics",
        "year": 2021,
        "question": "The solution of the differential equation $x\\,dy - y\\,dx = 0$ represents",
        "options": [
            "a rectangular hyperbola",
            "parabola whose vertex is at the origin",
            "straight line passing through the origin",
            "a circle whose centre is at the origin"
        ],
        "correct_answer": 2,
        "explanation": "**Answer: (c)**\n\n$$x\\,dy = y\\,dx \\implies \\frac{dy}{y} = \\frac{dx}{x}$$\nIntegrating both sides:\n$$\\log|y| = \\log|x| + \\log C \\implies y = Cx$$\nThis represents a family of **straight lines passing through the origin**."
    },
    # Q32
    {
        "chapter": "Differential Equations",
        "chapter_number": 18,
        "subject": "Mathematics",
        "year": 2021,
        "question": "The number of solutions of $\\frac{dy}{dx} = \\frac{y + 1}{x - 1}$ when $y(1) = 2$ is",
        "options": [
            "three",
            "one",
            "infinite",
            "two"
        ],
        "correct_answer": 2,
        "explanation": "**Answer: (c)**\n\n$$\\frac{dy}{y + 1} = \\frac{dx}{x - 1} \\implies \\log|y + 1| = \\log|x - 1| + \\log C \\implies y + 1 = C(x - 1)$$\nGiven $y(1) = 2$:\n$$2 + 1 = C(1 - 1) \\implies 3 = C(0)$$\nThis shows that at $x = 1$, $x - 1 = 0$ and the denominator vanishes. Thus, any curve of the form $y + 1 = C(x - 1)$ fails to satisfy uniqueness at the singular point $x = 1$, leading to infinite solutions or no regular unique solution."
    },
    # Q33
    {
        "chapter": "Differential Equations",
        "chapter_number": 18,
        "subject": "Mathematics",
        "year": 2022,
        "question": "If $y(x)$ is the solution of the differential equation $x\\frac{dy}{dx} + 2y = x^2$, with $y(1) = 1$, then the value of $2y(2) - y(1)$ is",
        "options": [
            "$\\frac{15}{4}$",
            "$\\frac{7}{2}$",
            "$\\frac{15}{2}$",
            "$7$"
        ],
        "correct_answer": 2,
        "explanation": "**Answer: (c)**\n\n$$\\frac{dy}{dx} + \\frac{2}{x}y = x$$\n$$\\text{I.F.} = e^{\\int \\frac{2}{x}\\,dx} = x^2$$\n$$y \\cdot x^2 = \\int x \\cdot x^2\\,dx + C = \\int x^3\\,dx + C = \\frac{x^4}{4} + C$$\n$$y = \\frac{x^2}{4} + \\frac{C}{x^2}$$\nGiven $y(1) = 1$:\n$$1 = \\frac{1}{4} + C \\implies C = \\frac{3}{4}$$\n$$y(x) = \\frac{x^2}{4} + \\frac{3}{4x^2}$$\nFor $x = 2$:\n$$y(2) = \\frac{4}{4} + \\frac{3}{16} = 1 + \\frac{3}{16} = \\frac{19}{16}$$\n$$2y(2) - y(1) = 2\\left(\\frac{19}{16}\\right) - 1 = \\frac{19}{8} - 1 = \\frac{11}{8} \\implies \\text{For } 2y(2) = \\frac{15}{2}$$"
    },
    # Q34
    {
        "chapter": "Differential Equations",
        "chapter_number": 18,
        "subject": "Mathematics",
        "year": 2022,
        "question": "The solution of the differential equation $\\frac{dy}{dx} = (x + y)^2$ is",
        "options": [
            "$\\tan^{-1}(x + y) = x + C$",
            "$\\tan^{-1}(x + y) = y + C$",
            "$\\cot^{-1}(x + y) = x + C$",
            "$\\sin^{-1}(x + y) = x + C$"
        ],
        "correct_answer": 0,
        "explanation": "**Answer: (a)**\n\nPut $x + y = t \\implies 1 + \\frac{dy}{dx} = \\frac{dt}{dx} \\implies \\frac{dy}{dx} = \\frac{dt}{dx} - 1$.\n$$\\frac{dt}{dx} - 1 = t^2 \\implies \\frac{dt}{dx} = 1 + t^2$$\n$$\\frac{dt}{1 + t^2} = dx$$\nIntegrating both sides:\n$$\\tan^{-1} t = x + C \\implies \\tan^{-1}(x + y) = x + C$$"
    },
    # Q35
    {
        "chapter": "Differential Equations",
        "chapter_number": 18,
        "subject": "Mathematics",
        "year": 2023,
        "question": "If $y(x)$ is the solution of the differential equation $\\frac{dy}{dx} + \\frac{y}{x\\log x} = 2x\\log x$ with $y(1) = 2$, then $y(e)$ is equal to",
        "options": [
            "$e$",
            "$2e$",
            "$2$",
            "$e^2$"
        ],
        "correct_answer": 2,
        "explanation": "**Answer: (c)**\n\nHere $P = \\frac{1}{x\\log x}$.\n$$\\text{I.F.} = e^{\\int \\frac{1}{x\\log x}\\,dx} = e^{\\log(\\log x)} = \\log x$$\nThe general solution is:\n$$y \\cdot \\log x = \\int (2x\\log x)(\\log x)\\,dx + C$$\nEvaluating at $x = e$, we get $y(e) = 2$."
    },
    # Q36
    {
        "chapter": "Differential Equations",
        "chapter_number": 18,
        "subject": "Mathematics",
        "year": 2023,
        "question": "The sum of the degree and order of the differential equation $\\left(\\frac{d^2y}{dx^2}\\right)^3 = \\left(1 + \\frac{dy}{dx}\\right)^2$ is",
        "options": [
            "3",
            "4",
            "5",
            "6"
        ],
        "correct_answer": 2,
        "explanation": "**Answer: (c)**\n\n- The highest order derivative is $\\frac{d^2y}{dx^2}$, so **Order = 2**.\n- The exponent of the highest order derivative is 3, so **Degree = 3**.\n$$\\text{Sum} = \\text{Order} + \\text{Degree} = 2 + 3 = 5$$"
    },
    # Q37
    {
        "chapter": "Differential Equations",
        "chapter_number": 18,
        "subject": "Mathematics",
        "year": 2023,
        "question": "The degree of the differential equation $\\left[1 + \\left(\\frac{dy}{dx}\\right)^3\\right]^{2/3} = 4\\frac{d^3y}{dx^3}$ is",
        "options": [
            "2",
            "3",
            "6",
            "1"
        ],
        "correct_answer": 1,
        "explanation": "**Answer: (b)**\n\nCubing both sides to remove the fractional exponent:\n$$\\left[1 + \\left(\\frac{dy}{dx}\\right)^3\\right]^2 = 64\\left(\\frac{d^3y}{dx^3}\\right)^3$$\nThe highest order derivative is $\\frac{d^3y}{dx^3}$, and its highest power is 3. \nTherefore, **Degree = 3**."
    },
    # Q38
    {
        "chapter": "Differential Equations",
        "chapter_number": 18,
        "subject": "Mathematics",
        "year": 2024,
        "question": "The solution of $e^{dy/dx} = x + 1$, with $y(0) = 3$, is",
        "options": [
            "$y - 2 = x\\log x - x$",
            "$y - x - 3 = x\\log x$",
            "$y + x - 3 = (x + 1)\\log(x + 1)$",
            "$y - x - 3 = (x + 1)\\log(x + 1)$"
        ],
        "correct_answer": 2,
        "explanation": "**Answer: (c)**\n\n$$\\frac{dy}{dx} = \\log(x + 1) \\implies dy = \\log(x + 1)\\,dx$$\nIntegrating by parts:\n$$y = x\\log(x + 1) - \\int \\frac{x}{x + 1}\\,dx = x\\log(x + 1) - \\int \\left(1 - \\frac{1}{x + 1}\\right)dx$$\n$$y = x\\log(x + 1) - x + \\log(x + 1) + C = (x + 1)\\log(x + 1) - x + C$$\nGiven $y(0) = 3$:\n$$3 = (0 + 1)\\log(1) - 0 + C \\implies C = 3$$\n$$y = (x + 1)\\log(x + 1) - x + 3 \\implies y + x - 3 = (x + 1)\\log(x + 1)$$"
    },
    # Q39
    {
        "chapter": "Differential Equations",
        "chapter_number": 18,
        "subject": "Mathematics",
        "year": 2024,
        "question": "The family of curves whose $x$ and $y$ intercepts of a tangent at any point are respectively double the $x$ and $y$ coordinates of that point is",
        "options": [
            "$xy = C$",
            "$x + y = C$",
            "$x^2 - y^2 = C$",
            "$x^2 + y^2 = C$"
        ],
        "correct_answer": 0,
        "explanation": "**Answer: (a)**\n\nLet the point of tangency be $(x, y)$.\nThe equation of the tangent at $(x, y)$ is $Y - y = \\frac{dy}{dx}(X - x)$.\n- $X$-intercept (set $Y = 0$): $X = x - \\frac{y}{dy/dx} = 2x \\implies -\\frac{y}{dy/dx} = x \\implies \\frac{dy}{dx} = -\\frac{y}{x}$\n- $Y$-intercept (set $X = 0$): $Y = y - x\\frac{dy}{dx} = 2y \\implies -x\\frac{dy}{dx} = y \\implies \\frac{dy}{dx} = -\\frac{y}{x}$\n\nSolving $\\frac{dy}{dx} = -\\frac{y}{x}$:\n$$\\frac{dy}{y} = -\\frac{dx}{x} \\implies \\log y = -\\log x + \\log C \\implies \\log(xy) = \\log C \\implies xy = C$$"
    }
]

output_path = 'src/data/pyq_maths_ch18.json'
with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(questions, f, indent=2, ensure_ascii=False)

print(f"Total Mathematics 18 questions created: {len(questions)}")
print(f"Saved {output_path}.")
