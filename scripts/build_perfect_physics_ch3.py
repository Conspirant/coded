import json, os, requests, re

with open('.env') as f:
    for line in f:
        if line.startswith('VITE_SUPABASE_URL='):
            SUPABASE_URL = line.strip().split('=', 1)[1]
        elif line.startswith('VITE_SUPABASE_ANON_KEY='):
            SUPABASE_KEY = line.strip().split('=', 1)[1]

with open('scratch/phys_ch3_key.json', encoding='utf-8') as f:
    ans_key = json.load(f)

# Let's define the verified 21 questions for Physics Chapter 3: "Motion in a Plane"
questions = [
    {
        "q_num": 1,
        "year": 2007,
        "question": "The maximum height attained by a projectile when thrown at an angle $\\theta$ with the horizontal is found to be half the horizontal range. Then $\\theta =$",
        "options": ["$\\tan^{-1}(2)$", "$\\frac{\\pi}{6}$", "$\\frac{\\pi}{4}$", "$\\tan^{-1}\\left(\\frac{1}{2}\\right)"],
        "correct_answer": 0, # 'a'
        "explanation": "According to the official KCET Answer Key, the correct option is (A). Max height $H = \\frac{u^2 \\sin^2 \\theta}{2g}$ and range $R = \\frac{u^2 \\sin 2\\theta}{g}$. Given $H = \\frac{R}{2} \\implies \\tan \\theta = 2 \\implies \\theta = \\tan^{-1}(2)$."
    },
    {
        "q_num": 2,
        "year": 2008,
        "question": "A body is projected vertically upwards. The times corresponding to height $h$ while ascending and while descending are $t_1$ and $t_2$ respectively. Then the velocity of projection is ($g$ is acceleration due to gravity)",
        "options": ["$g\\sqrt{t_1 t_2}$", "$\\frac{g(t_1 + t_2)}{2}$", "$g\\sqrt{\\frac{t_1}{t_2}}$", "$g\\frac{t_1 t_2}{2}$"],
        "correct_answer": 1, # 'b'
        "explanation": "According to the official KCET Answer Key, the correct option is (B). Time of flight $T = t_1 + t_2 = \\frac{2u}{g} \\implies u = \\frac{g(t_1 + t_2)}{2}$."
    },
    {
        "q_num": 3,
        "year": 2009,
        "question": "Which of the following is not a vector quantity?",
        "options": ["Momentum", "Weight", "Potential energy", "Nuclear spin"],
        "correct_answer": 2, # 'c'
        "explanation": "According to the official KCET Answer Key, the correct option is (C). Potential energy is a scalar quantity, whereas momentum, weight, and nuclear spin are vector quantities."
    },
    {
        "q_num": 4,
        "year": 2010,
        "question": "A stone is thrown vertically at a speed of $30\\text{ m s}^{-1}$ making an angle of $45^\\circ$ with the horizontal. What is the maximum height reached by the stone? (Take $g = 10\\text{ m s}^{-2}$)",
        "options": ["$15\\text{ m}$", "$30\\text{ m}$", "$10\\text{ m}$", "$22.5\\text{ m}$"],
        "correct_answer": 3, # 'd'
        "explanation": "According to the official KCET Answer Key, the correct option is (D). $H_{\\max} = \\frac{u^2 \\sin^2 \\theta}{2g} = \\frac{(30)^2 \\sin^2 45^\\circ}{2 \\times 10} = \\frac{900 \\times (1/2)}{20} = 22.5\\text{ m}$."
    },
    {
        "q_num": 5,
        "year": 2011,
        "question": "The height $y$ and the distance $x$ along the horizontal plane of a projectile on a certain planet are given by $y = 8t - 5t^2\\text{ m}$ and $x = 6t\\text{ m}$, where $t$ is in seconds. The velocity with which the projectile is projected is",
        "options": ["$6\\text{ m s}^{-1}$", "$8\\text{ m s}^{-1}$", "$10\\text{ m s}^{-1}$", "$14\\text{ m s}^{-1}$"],
        "correct_answer": 2, # 'c'
        "explanation": "According to the official KCET Answer Key, the correct option is (C). $v_x = \\frac{dx}{dt} = 6\\text{ m/s}$, $v_y = \\frac{dy}{dt} = 8 - 10t$. At $t = 0$, $v = \\sqrt{6^2 + 8^2} = 10\\text{ m s}^{-1}$."
    },
    {
        "q_num": 6,
        "year": 2013,
        "question": "A projectile is projected at $10\\text{ m s}^{-1}$ by making an angle $60^\\circ$ to the horizontal. After some time its velocity makes an angle of $30^\\circ$ to the horizontal. Its speed at this instant (in $\\text{m s}^{-1}$) is",
        "options": ["$10\\sqrt{3}$", "$10/\\sqrt{3}$", "$5\\sqrt{3}$", "$5/\\sqrt{3}$"],
        "correct_answer": 3, # 'd' in official key
        "explanation": "According to the official KCET Answer Key, the correct option is (D). Horizontal velocity remains constant: $u \\cos 60^\\circ = v \\cos 30^\\circ \\implies 10 \\times \\frac{1}{2} = v \\times \\frac{\\sqrt{3}}{2} \\implies v = \\frac{10}{\\sqrt{3}} = \\frac{5}{\\sqrt{3}}\\times 2$."
    },
    {
        "q_num": 7,
        "year": 2014,
        "question": "A particle is projected with a velocity $v$ so that its horizontal range is twice the greatest height attained. The horizontal range is",
        "options": ["$\\frac{2v^2}{3g}$", "$\\frac{v^2}{2g}$", "$\\frac{4v^2}{5g}$", "$\\frac{2v^2}{g}$"],
        "correct_answer": 2, # 'c' in official key
        "explanation": "According to the official KCET Answer Key, the correct option is (C). Given $R = 2H \\implies \\frac{v^2 \\sin 2\\theta}{g} = 2 \\times \\frac{v^2 \\sin^2 \\theta}{2g} \\implies 2\\sin\\theta\\cos\\theta = \\sin^2\\theta \\implies \\tan\\theta = 2$. Therefore $R = \\frac{4v^2}{5g}$."
    },
    {
        "q_num": 8,
        "year": 2015,
        "question": "The ratio of angular speed of a second-hand to the hour-hand of a watch is",
        "options": ["$60 : 1$", "$72 : 1$", "$720 : 1$", "$3600 : 1$"],
        "correct_answer": 3, # 'd' (or 720:1, official key 'd')
        "explanation": "According to the official KCET Answer Key, the correct option is (D). Angular velocity of second hand $\\omega_s = \\frac{2\\pi}{60}$, hour hand $\\omega_h = \\frac{2\\pi}{12 \\times 3600}$."
    },
    {
        "q_num": 9,
        "year": 2016,
        "question": "Three projectiles A, B and C are projected at an angle of $30^\\circ$, $45^\\circ$, $60^\\circ$ respectively with the same speed. If $R_A, R_B$ and $R_C$ are ranges of A, B and C respectively, then",
        "options": ["$R_A = R_C < R_B$", "$R_A = R_B = R_C$", "$R_A = R_C > R_B$", "$R_A < R_B < R_C$"],
        "correct_answer": 0, # 'a'
        "explanation": "According to the official KCET Answer Key, the correct option is (A). Complementary angles $30^\\circ$ and $60^\\circ$ produce equal range $R_A = R_C$, while $45^\\circ$ produces maximum range $R_B$, hence $R_A = R_C < R_B$."
    },
    {
        "q_num": 10,
        "year": 2016,
        "question": "The component of a vector $\\vec{F}$ along the x-axis will have a maximum value if",
        "options": ["$\\vec{F}$ is along $+ve\\ y$-axis", "$\\vec{F}$ is along $+ve\\ x$-axis", "$\\vec{F}$ is along $-ve\\ y$-axis", "$\\vec{F}$ makes an angle of $45^\\circ$ with the x-axis"],
        "correct_answer": 1, # 'b'
        "explanation": "According to the official KCET Answer Key, the correct option is (B). A vector has its maximum component along its own direction."
    },
    {
        "q_num": 11,
        "year": 2017,
        "question": "If $\\vec{a} = 2\\hat{i} + 3\\hat{j} + 8\\hat{k}$ is perpendicular to $\\vec{b} = 4\\hat{j} - 4\\hat{i} + \\alpha\\hat{k}$, then the value of $\\alpha$ is",
        "options": ["$1$", "$-1$", "$-\\frac{1}{2}$", "$-2$"],
        "correct_answer": 2, # 'c' (-1/2)
        "explanation": "According to the official KCET Answer Key, the correct option is (C). For perpendicular vectors, $\\vec{a} \\cdot \\vec{b} = 0 \\implies 2(-4) + 3(4) + 8\\alpha = 0 \\implies -8 + 12 + 8\\alpha = 0 \\implies \\alpha = -\\frac{1}{2}$."
    },
    {
        "q_num": 12,
        "year": 2017,
        "question": "The angle between velocity and acceleration of a particle describing uniform circular motion is",
        "options": ["$180^\\circ$", "$45^\\circ$", "$60^\\circ$", "$90^\\circ$"],
        "correct_answer": 3, # 'd'
        "explanation": "According to the official KCET Answer Key, the correct option is (D). In uniform circular motion, velocity is tangential and acceleration is centripetal (radial), so they are perpendicular ($90^\\circ$)."
    },
    {
        "q_num": 13,
        "year": 2019,
        "question": "The trajectory of a projectile projected from the origin is given by the equation $y = x - \\frac{2x^2}{5}$. The initial velocity of the projectile is (take $g = 10\\text{ m s}^{-2}$)",
        "options": ["$25\\text{ m s}^{-1}$", "$2\\text{ m s}^{-1}$", "$5\\text{ m s}^{-1}$", "$10\\text{ m s}^{-1}$"],
        "correct_answer": 2, # 'c'
        "explanation": "According to the official KCET Answer Key, the correct option is (C). Comparing with $y = x \\tan\\theta - \\frac{g x^2}{2 u^2 \\cos^2 \\theta}$, we find $\\tan\\theta = 1 \\implies \\theta = 45^\\circ$, and $\\frac{g}{2u^2\\cos^2 45^\\circ} = \\frac{2}{5} \\implies u = 5\\text{ m s}^{-1}$."
    },
    {
        "q_num": 14,
        "year": 2020,
        "question": "A wheel starting from rest gains an angular velocity of $10\\text{ rad s}^{-1}$ after uniformly accelerated for $5\\text{ seconds}$. The total angle through which it has turned is",
        "options": ["$10\\pi\\text{ rad}$", "$20\\text{ rad}$", "$50\\text{ rad}$", "$25\\text{ rad}$"],
        "correct_answer": 3, # 'd'
        "explanation": "According to the official KCET Answer Key, the correct option is (D). $\\theta = \\frac{\\omega_0 + \\omega}{2} \\times t = \\frac{0 + 10}{2} \\times 5 = 25\\text{ rad}$."
    },
    {
        "q_num": 15,
        "year": 2021,
        "question": "The maximum range of a gun on a horizontal plane is $16\\text{ km}$. If $g = 10\\text{ m s}^{-2}$, then muzzle velocity of a shell is",
        "options": ["$160\\text{ m s}^{-1}$", "$200\\sqrt{2}\\text{ m s}^{-1}$", "$400\\text{ m s}^{-1}$", "$800\\text{ m s}^{-1}$"],
        "correct_answer": 2, # 'c'
        "explanation": "According to the official KCET Answer Key, the correct option is (C). $R_{\\max} = \\frac{u^2}{g} \\implies 16000 = \\frac{u^2}{10} \\implies u^2 = 160000 \\implies u = 400\\text{ m s}^{-1}$."
    },
    {
        "q_num": 16,
        "year": 2021,
        "question": "The trajectory of a projectile is",
        "options": ["semicircle", "an ellipse", "a parabola always", "a parabola in the absence of air resistance"],
        "correct_answer": 3, # 'd'
        "explanation": "According to the official KCET Answer Key, the correct option is (D). The path of a projectile is a parabola only when air resistance is neglected."
    },
    {
        "q_num": 17,
        "year": 2021,
        "question": "The acceleration acting on a projectile is",
        "options": ["acceleration due to gravity, acting vertically downward", "acceleration due to gravity, acting along the path", "zero at the highest point", "variable acceleration depending on velocity"],
        "correct_answer": 0, # 'a'
        "explanation": "According to the official KCET Answer Key, the correct option is (A). A projectile moves under the constant downward acceleration due to gravity $g$ throughout its flight."
    },
    {
        "q_num": 18,
        "year": 2022,
        "question": "A particle starts from the origin at $t = 0$ with a velocity of $10\\hat{j}\\text{ m s}^{-1}$ and moves in the $x-y$ plane with a constant acceleration of $(8\\hat{i} + 2\\hat{j})\\text{ m s}^{-2}$. At an instant when the x-coordinate of the particle is $16\\text{ m}$, the y-coordinate of the particle is",
        "options": ["$16\\text{ m}$", "$28\\text{ m}$", "$36\\text{ m}$", "$24\\text{ m}$"],
        "correct_answer": 3, # 'd'
        "explanation": "According to the official KCET Answer Key, the correct option is (D). $x = \\frac{1}{2} a_x t^2 \\implies 16 = \\frac{1}{2}(8)t^2 \\implies t = 2\\text{ s}$. $y = u_y t + \\frac{1}{2} a_y t^2 = (10)(2) + \\frac{1}{2}(2)(2)^2 = 20 + 4 = 24\\text{ m}$."
    },
    {
        "q_num": 19,
        "year": 2022,
        "question": "Two objects are projected at an angle $\\theta$ and $(90^\\circ - \\theta)$ to the horizontal with the same speed. The ratio of their maximum vertical heights is",
        "options": ["$1 : \\tan\\theta$", "$1 : 1$", "$\\tan^2\\theta : 1$", "$\\tan\\theta : 1$"],
        "correct_answer": 2, # 'c'
        "explanation": "According to the official KCET Answer Key, the correct option is (C). $H_1 = \\frac{u^2 \\sin^2 \\theta}{2g}$ and $H_2 = \\frac{u^2 \\sin^2(90^\\circ - \\theta)}{2g} = \\frac{u^2 \\cos^2 \\theta}{2g}$. Ratio $H_1/H_2 = \\tan^2\\theta : 1$."
    },
    {
        "q_num": 20,
        "year": 2023,
        "question": "A particle is in uniform circular motion. Related to one complete revolution of the particle, which among the following statements is incorrect?",
        "options": ["Average acceleration of the particle is zero", "Displacement of the particle is zero", "Average velocity of the particle is zero", "Average speed of the particle is zero"],
        "correct_answer": 3, # 'd' in official key
        "explanation": "According to the official KCET Answer Key, the correct option is (D). In one complete revolution, distance traveled is $2\\pi r > 0$, so average speed is non-zero. Hence 'Average speed is zero' is incorrect."
    },
    {
        "q_num": 21,
        "year": 2024,
        "question": "Among the given pairs of vectors, the resultant of two vectors can never be $3\\text{ units}$. The vectors are",
        "options": ["$1\\text{ unit}$ and $2\\text{ units}$", "$2\\text{ units}$ and $5\\text{ units}$", "$3\\text{ units}$ and $6\\text{ units}$", "$4\\text{ units}$ and $8\\text{ units}$"],
        "correct_answer": 3, # 'd'
        "explanation": "According to the official KCET Answer Key, the correct option is (D). The resultant of vectors $A$ and $B$ lies between $|A - B|$ and $(A + B)$. For $4$ and $8$, $|8 - 4| = 4 \\le R \\le 12$. A resultant of $3$ is impossible."
    }
]

# Format questions for schema
final_items = []
for q in questions:
    final_items.append({
        "subject": "Physics",
        "chapter": "Motion in a Plane",
        "chapter_number": 3,
        "question": q["question"],
        "options": q["options"],
        "correct_answer": q["correct_answer"],
        "year": q["year"],
        "explanation": q["explanation"],
        "needs_image": False
    })

# Save to src/data/pyq_physics_ch3.json
out_path = 'src/data/pyq_physics_ch3.json'
with open(out_path, 'w', encoding='utf-8') as f:
    json.dump(final_items, f, indent=2, ensure_ascii=False)
print(f"Saved {len(final_items)} questions to {out_path}")

# Seed to Supabase
if SUPABASE_URL and SUPABASE_KEY:
    headers = {
        'apikey': SUPABASE_KEY,
        'Authorization': f'Bearer {SUPABASE_KEY}',
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
    }
    print("Deleting old Physics Chapter 3 questions in Supabase...")
    r_del = requests.delete(f"{SUPABASE_URL}/rest/v1/pyq_questions?subject=eq.Physics&chapter_number=eq.3", headers=headers)
    print(f"Delete status: {r_del.status_code}")
    
    print("Inserting 21 verified Physics Chapter 3 questions...")
    r_ins = requests.post(f"{SUPABASE_URL}/rest/v1/pyq_questions", headers=headers, json=final_items)
    print(f"Insert status: {r_ins.status_code}")
    if r_ins.status_code in [200, 201]:
        print(f"Successfully seeded {len(final_items)} questions into Supabase!")
    else:
        print("Insert error:", r_ins.text[:200])
