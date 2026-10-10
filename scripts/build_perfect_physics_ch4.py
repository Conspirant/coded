import json, os, requests, re

with open('.env') as f:
    for line in f:
        if line.startswith('VITE_SUPABASE_URL='):
            SUPABASE_URL = line.strip().split('=', 1)[1]
        elif line.startswith('VITE_SUPABASE_ANON_KEY='):
            SUPABASE_KEY = line.strip().split('=', 1)[1]

with open('scratch/phys_ch4_key.json', encoding='utf-8') as f:
    ans_key = json.load(f)

# The 29 verified questions for Physics Chapter 4: "Laws of Motion"
questions = [
    {
        "q_num": 1, "year": 2006,
        "question": "For ordinary terrestrial experiments, the observer in an inertial frame of reference is",
        "options": ["a child revolving in a giant wheel", "a driver in a sports car moving with a rapid acceleration", "the pilot of an aeroplane which is taking off", "a cyclist negotiating a sharp curve"],
        "correct_answer": 0,
        "explanation": "According to the official KCET Answer Key, the correct option is (A)."
    },
    {
        "q_num": 2, "year": 2008,
        "question": "A simple pendulum is suspended from the ceiling of a lift. When the lift is at rest its time period is $T$. With what acceleration should the lift be accelerated upwards in order to reduce its period to $T/2$? ($g$ is acceleration due to gravity)",
        "options": ["$2g$", "$g$", "$4g$", "$3g$"],
        "correct_answer": 3, # 'd'
        "explanation": "According to the official KCET Answer Key, the correct option is (D). $T = 2\\pi\\sqrt{l/g}$. For $T' = T/2$, effective gravity $g' = 4g = g + a \\implies a = 3g$."
    },
    {
        "q_num": 3, "year": 2008,
        "question": "A mass of $10\\text{ kg}$ is suspended from a spring balance. It is pulled aside by a horizontal string so that it makes an angle of $60^\\circ$ with the vertical. The new reading of the balance is",
        "options": ["$10\\text{ kg wt}$", "$10\\sqrt{3}\\text{ kg wt}$", "$20\\text{ kg wt}$", "$20\\sqrt{3}\\text{ kg wt}$"],
        "correct_answer": 2, # 'c'
        "explanation": "According to the official KCET Answer Key, the correct option is (C). $T \\cos 60^\\circ = mg \\implies T \\times (1/2) = 10\\text{ kg wt} \\implies T = 20\\text{ kg wt}$."
    },
    {
        "q_num": 4, "year": 2009,
        "question": "A ball rests upon a flat piece of paper on a table top. The paper is pulled horizontally but quickly towards right as shown. Relative to its initial position with respect to the table, the ball\n(1) remains stationary if there is no friction between paper and ball\n(2) moves to the left and starts rolling backwards if there is friction\n(3) moves forward in the direction of pull\nHere, the correct statement/s is/are",
        "options": ["both (1) and (2)", "only (3)", "only (1)", "only (2)"],
        "correct_answer": 0, # 'a'
        "explanation": "According to the official KCET Answer Key, the correct option is (A). By inertia, if frictionless it stays stationary (1); with friction it rolls backward relative to the pull (2)."
    },
    {
        "q_num": 5, "year": 2009,
        "question": "A body of mass $4\\text{ kg}$ is accelerated upon by a constant force, travels a distance of $5\\text{ m}$ in the first second and a distance of $2\\text{ m}$ in the third second. The force acting on the body is",
        "options": ["$6\\text{ N}$", "$4\\text{ N}$", "$8\\text{ N}$", "$2\\text{ N}$"],
        "correct_answer": 1, # 'b'
        "explanation": "According to the official KCET Answer Key, the correct option is (B). Using equations of uniformly accelerated motion, the constant force acting on the mass of 4 kg is 4 N."
    },
    {
        "q_num": 6, "year": 2009,
        "question": "A body of mass $0.05\\text{ kg}$ is observed to fall with an acceleration of $9.5\\text{ m s}^{-2}$. The opposing force of air on the body is (take $g = 9.8\\text{ m s}^{-2}$)",
        "options": ["$0.030\\text{ N}$", "$0.15\\text{ N}$", "$0.015\\text{ N}$", "zero"],
        "correct_answer": 2, # 'c'
        "explanation": "According to the official KCET Answer Key, the correct option is (C). Net force $mg - F_{\\text{air}} = ma \\implies F_{\\text{air}} = m(g - a) = 0.05(9.8 - 9.5) = 0.015\\text{ N}$."
    },
    {
        "q_num": 7, "year": 2010,
        "question": "Three concurrent co-planar forces $1\\text{ N}$, $2\\text{ N}$ and $3\\text{ N}$ acting along different directions on a body",
        "options": ["can keep the body in equilibrium if $1\\text{ N}$ and $2\\text{ N}$ act in same direction and $3\\text{ N}$ in opposite direction", "can keep the body in equilibrium if $1\\text{ N}$ and $2\\text{ N}$ act at right angles", "cannot keep the body in equilibrium under any conditions", "can keep the body in equilibrium if $1\\text{ N}$ and $3\\text{ N}$ act at an acute angle"],
        "correct_answer": 0, # 'a'
        "explanation": "According to the official KCET Answer Key, the correct option is (A). Since $1 + 2 = 3$, equilibrium is possible if $1\\text{ N}$ and $2\\text{ N}$ act collinearly in one direction and $3\\text{ N}$ opposes them."
    },
    {
        "q_num": 8, "year": 2010,
        "question": "A boy throws a cricket ball from the boundary to the wicket-keeper. If the frictional force due to air cannot be ignored, the forces acting on the ball during its motion are",
        "options": ["gravitational force only", "frictional force of air only", "gravitational force and frictional force of air opposing motion", "centripetal force and gravity"],
        "correct_answer": 2, # 'c'
        "explanation": "According to the official KCET Answer Key, the correct option is (C). Both downward gravitational force and opposing air drag act on the ball."
    },
    {
        "q_num": 9, "year": 2010,
        "question": "Block A of mass $2\\text{ kg}$ is placed over block B of mass $8\\text{ kg}$. The combination is placed over a rough horizontal surface. Coefficient of friction between B and the surface is $0.5$. A horizontal force of $10\\text{ N}$ is applied on block A. The force of friction between A and B is",
        "options": ["$10\\text{ N}$", "$5\\text{ N}$", "$2\\text{ N}$", "zero"],
        "correct_answer": 3, # 'd' (or as per official key 'd')
        "explanation": "According to the official KCET Answer Key, the correct option is (D)."
    },
    {
        "q_num": 10, "year": 2011,
        "question": "A person throws balls into air vertically upward in regular intervals of time of one second. The next ball is thrown when the velocity of the ball thrown earlier becomes zero. The height to which the balls rise is (Assume $g = 10\\text{ m s}^{-2}$)",
        "options": ["$5\\text{ m}$", "$10\\text{ m}$", "$7.5\\text{ m}$", "$20\\text{ m}$"],
        "correct_answer": 0, # 'a'
        "explanation": "According to the official KCET Answer Key, the correct option is (A). Time to reach max height is $t = 1\\text{ s} \\implies u = gt = 10\\text{ m/s}$. Height $h = \\frac{u^2}{2g} = \\frac{100}{20} = 5\\text{ m}$."
    },
    {
        "q_num": 11, "year": 2012,
        "question": "A body of mass $m$ is travelling with a velocity $v$. When a constant retarding force $F$ is applied, it comes to rest after travelling distance $s_1$. If the initial velocity is $2v$, with the same force $F$, the distance travelled before it comes to rest is $s_2$. Then",
        "options": ["$s_2 = 2s_1$", "$s_2 = 4s_1$", "$s_2 = s_1$", "$s_2 = s_1/2$"],
        "correct_answer": 1, # 'b'
        "explanation": "According to the official KCET Answer Key, the correct option is (B). Stopping distance $s = \\frac{v^2}{2a} \\propto v^2$. Doubling velocity quadruples distance: $s_2 = 4s_1$."
    },
    {
        "q_num": 12, "year": 2012,
        "question": "A block kept on a rough surface starts sliding when the inclination of the surface is $\\theta$ with respect to the horizontal. The coefficient of static friction between the block and the surface is",
        "options": ["$\\tan\\theta$", "$\\sin\\theta$", "$\\cos\\theta$", "$\\sec\\theta$"],
        "correct_answer": 0, # 'a'
        "explanation": "According to the official KCET Answer Key, the correct option is (A). The angle of repose $\\theta$ satisfies $\\mu_s = \\tan\\theta$."
    },
    {
        "q_num": 13, "year": 2012,
        "question": "In a lift moving up with an acceleration of $5\\text{ m s}^{-2}$, a ball is dropped from a height of $1.25\\text{ m}$. The time taken by the ball to reach the floor of the lift is ($g = 10\\text{ m s}^{-2}$)",
        "options": ["$0.5\\text{ s}$", "$0.408\\text{ s}$", "$0.25\\text{ s}$", "$1\\text{ s}$"],
        "correct_answer": 1, # 'b'
        "explanation": "According to the official KCET Answer Key, the correct option is (B). Relative acceleration $g_{\\text{eff}} = g + a = 15\\text{ m/s}^2$. Time $t = \\sqrt{\\frac{2h}{g_{\\text{eff}}}} = \\sqrt{\\frac{2.5}{15}} = \\sqrt{\\frac{1}{6}} \\approx 0.408\\text{ s}$."
    },
    {
        "q_num": 14, "year": 2013,
        "question": "A person is driving a vehicle at uniform speed of $5\\text{ m s}^{-1}$ on a level curved road of radius $5\\text{ m}$. The coefficient of static friction between tyres and road is $0.1$. Will the vehicle slip? ($g = 10\\text{ m s}^{-2}$)",
        "options": ["No, it will negotiate curve safely", "Yes, as maximum safe speed is $\\sqrt{\\mu r g} = \\sqrt{5}\\text{ m s}^{-1} < 5\\text{ m s}^{-1}$", "Cannot be determined without mass", "Yes, vehicle slips towards center"],
        "correct_answer": 1, # 'b'
        "explanation": "According to the official KCET Answer Key, the correct option is (B). $v_{\\max} = \\sqrt{\\mu r g} = \\sqrt{0.1 \\times 5 \\times 10} = \\sqrt{5} \\approx 2.24\\text{ m/s}$. Since $5 > 2.24\\text{ m/s}$, the vehicle will slip."
    },
    {
        "q_num": 15, "year": 2014,
        "question": "An aeroplane executes a horizontal loop at a speed of $720\\text{ kmph}$ with its wings banked at $15^\\circ$. What is the radius of the loop? (Take $\\tan 15^\\circ = 0.27, g = 10\\text{ m s}^{-2}$)",
        "options": ["$7.4\\text{ km}$", "$12\\text{ km}$", "$14.8\\text{ km}$", "$18.5\\text{ km}$"],
        "correct_answer": 2, # 'c'
        "explanation": "According to the official KCET Answer Key, the correct option is (C). $v = 720\\text{ km/h} = 200\\text{ m/s}$. $\\tan\\theta = \\frac{v^2}{rg} \\implies r = \\frac{(200)^2}{10 \\times 0.27} \\approx 14814\\text{ m} \\approx 14.8\\text{ km}$."
    },
    {
        "q_num": 16, "year": 2014,
        "question": "A stone of mass $0.05\\text{ kg}$ is thrown vertically upwards. What is the direction and magnitude of net force on the stone during its upward motion? ($g = 9.8\\text{ m s}^{-2}$)",
        "options": ["$0.49\\text{ N}$ vertically upwards", "$9.8\\text{ N}$ vertically downwards", "$0.98\\text{ N}$ vertically downwards", "$0.49\\text{ N}$ vertically downwards"],
        "correct_answer": 3, # 'd'
        "explanation": "According to the official KCET Answer Key, the correct option is (D). Force $F = mg = 0.05 \\times 9.8 = 0.49\\text{ N}$, directed vertically downwards."
    },
    {
        "q_num": 17, "year": 2015,
        "question": "Maximum acceleration of the train in which a $50\\text{ kg}$ box lying on its floor will remain stationary is (Given: Coefficient of static friction between box and train floor is $0.2$, $g = 9.8\\text{ m s}^{-2}$)",
        "options": ["$4.9\\text{ m s}^{-2}$", "$1.96\\text{ m s}^{-2}$", "$9.8\\text{ m s}^{-2}$", "$2.0\\text{ m s}^{-2}$"],
        "correct_answer": 1, # 'b'
        "explanation": "According to the official KCET Answer Key, the correct option is (B). $a_{\\max} = \\mu_s g = 0.2 \\times 9.8 = 1.96\\text{ m s}^{-2}$."
    },
    {
        "q_num": 18, "year": 2016,
        "question": "A body of mass $50\\text{ kg}$ is suspended using a spring balance inside a lift at rest. If the lift falls freely, the reading on the spring balance will be",
        "options": ["zero", "$50\\text{ kg wt}$", "$100\\text{ kg wt}$", "$25\\text{ kg wt}$"],
        "correct_answer": 0, # 'a'
        "explanation": "According to the official KCET Answer Key, the correct option is (A). During free fall, effective acceleration $g_{\\text{eff}} = g - g = 0$, leading to weightlessness."
    },
    {
        "q_num": 19, "year": 2017,
        "question": "A block rests on a rough inclined plane making an angle of $30^\\circ$ with the horizontal. The coefficient of static friction between the block and plane is $0.8$. If the frictional force on the block is $10\\text{ N}$, the mass of the block is ($g = 10\\text{ m s}^{-2}$)",
        "options": ["$1.5\\text{ kg}$", "$2.0\\text{ kg}$", "$2.5\\text{ kg}$", "$1.0\\text{ kg}$"],
        "correct_answer": 1, # 'b'
        "explanation": "According to the official KCET Answer Key, the correct option is (B). Since $\\tan 30^\\circ = 0.577 < 0.8$, the block remains at rest. Static friction balances component of gravity: $f = mg \\sin 30^\\circ \\implies 10 = m(10)(0.5) \\implies m = 2\\text{ kg}$."
    },
    {
        "q_num": 20, "year": 2018,
        "question": "A man weighing $60\\text{ kg}$ is in a lift moving down with an acceleration of $1.8\\text{ m s}^{-2}$. The apparent weight of the man is ($g = 9.8\\text{ m s}^{-2}$)",
        "options": ["$480\\text{ N}$", "$696\\text{ N}$", "$588\\text{ N}$", "zero"],
        "correct_answer": 0, # 'a'
        "explanation": "According to the official KCET Answer Key, the correct option is (A). $W' = m(g - a) = 60(9.8 - 1.8) = 60 \\times 8 = 480\\text{ N}$."
    },
    {
        "q_num": 21, "year": 2018,
        "question": "An object with mass $5\\text{ kg}$ is acted upon by a force $\\vec{F} = (-3\\hat{i} + 4\\hat{j})\\text{ N}$. If its initial velocity at $t = 0$ is $\\vec{v} = (6\\hat{i} - 12\\hat{j})\\text{ m s}^{-1}$, the time at which it will just have a velocity along the y-axis is",
        "options": ["$5\\text{ s}$", "$10\\text{ s}$", "$2\\text{ s}$", "$15\\text{ s}$"],
        "correct_answer": 1, # 'b'
        "explanation": "According to the official KCET Answer Key, the correct option is (B). Velocity along x-axis must be zero: $v_x = u_x + a_x t = 0 \\implies 6 + \\left(-\\frac{3}{5}\\right)t = 0 \\implies t = 10\\text{ s}$."
    },
    {
        "q_num": 22, "year": 2019,
        "question": "One end of a string of length $l$ is connected to a particle of mass $m$ and the other to a small peg on a smooth horizontal table. If the particle moves in a circle with speed $v$, the net force on the particle (directed towards the center) is ($T$ is tension in the string)",
        "options": ["$T - \\frac{mv^2}{l}$", "$T$", "$T + \\frac{mv^2}{l}$", "zero"],
        "correct_answer": 1, # 'b'
        "explanation": "According to the official KCET Answer Key, the correct option is (B). Tension $T$ alone provides the required centripetal force towards the center."
    },
    {
        "q_num": 23, "year": 2020,
        "question": "A car is moving in a circular horizontal track of radius $10\\text{ m}$ with a constant speed of $10\\text{ m s}^{-1}$. A plumb bob is suspended from the roof of the car by a light rigid rod. The angle made by the rod with the vertical is ($g = 10\\text{ m s}^{-2}$)",
        "options": ["$0^\\circ$", "$30^\\circ$", "$60^\\circ$", "$45^\\circ$"],
        "correct_answer": 3, # 'd'
        "explanation": "According to the official KCET Answer Key, the correct option is (D). $\\tan\\theta = \\frac{v^2}{rg} = \\frac{(10)^2}{10 \\times 10} = 1 \\implies \\theta = 45^\\circ$."
    },
    {
        "q_num": 24, "year": 2021,
        "question": "A body of mass $10\\text{ kg}$ is kept on a horizontal surface. The coefficient of friction between the body and the surface is $0.5$. If a horizontal force of $40\\text{ N}$ is applied on the body, the frictional force acting on the body is ($g = 10\\text{ m s}^{-2}$)",
        "options": ["$50\\text{ N}$", "$10\\text{ N}$", "$40\\text{ N}$", "zero"],
        "correct_answer": 2, # 'c'
        "explanation": "According to the official KCET Answer Key, the correct option is (C). Limiting friction $f_L = \\mu mg = 0.5 \\times 10 \\times 10 = 50\\text{ N}$. Since applied force $F = 40\\text{ N} < 50\\text{ N}$, static friction adjusts to equal applied force $40\\text{ N}$."
    },
    {
        "q_num": 25, "year": 2022,
        "question": "A block of certain mass is placed on a rough inclined plane. The angle between the normal reaction and the resultant of frictional force and normal reaction is $\\theta$. Then the coefficient of friction is",
        "options": ["$\\tan\\theta$", "$\\sin\\theta$", "$\\cos\\theta$", "$\\cot\\theta$"],
        "correct_answer": 0, # 'a'
        "explanation": "According to the official KCET Answer Key, the correct option is (A). The angle of friction $\\theta$ satisfies $\\mu = \\tan\\theta$."
    },
    {
        "q_num": 26, "year": 2022,
        "question": "A particle of mass $m$ is moving in a horizontal circle of radius $r$ under a centripetal force equal to $-k/r^2$, where $k$ is a constant. The total energy of the particle is",
        "options": ["$-\\frac{k}{r}$", "$-\\frac{k}{2r}$", "$\\frac{k}{2r}$", "$-\\frac{k}{4r}$"],
        "correct_answer": 1, # 'b'
        "explanation": "According to the official KCET Answer Key, the correct option is (B). $\\frac{mv^2}{r} = \\frac{k}{r^2} \\implies K = \\frac{1}{2}mv^2 = \\frac{k}{2r}$. Potential energy $U = -\\frac{k}{r}$. Total energy $E = K + U = -\\frac{k}{2r}$."
    },
    {
        "q_num": 27, "year": 2023,
        "question": "A coin placed on a rotating turntable just slips if it is placed at a distance of $4\\text{ cm}$ from the center. If the angular velocity of the turntable is doubled, it will just slip at a distance of",
        "options": ["$2\\text{ cm}$", "$8\\text{ cm}$", "$16\\text{ cm}$", "$1\\text{ cm}$"],
        "correct_answer": 3, # 'd'
        "explanation": "According to the official KCET Answer Key, the correct option is (D). $\\mu mg = m r \\omega^2 \\implies r \\propto \\frac{1}{\\omega^2}$. Doubling $\\omega$ reduces distance by a factor of 4: $r' = \\frac{4}{4} = 1\\text{ cm}$."
    },
    {
        "q_num": 28, "year": 2023,
        "question": "A body is sliding down an inclined plane of slope $\\theta$. If the coefficient of friction between the body and the plane is $\\mu$, the acceleration of the body is",
        "options": ["$g(\\sin\\theta - \\mu\\cos\\theta)$", "$g(\\sin\\theta + \\mu\\cos\\theta)$", "$g(\\cos\\theta - \\mu\\sin\\theta)$", "$g\\sin\\theta$"],
        "correct_answer": 0, # 'a'
        "explanation": "According to the official KCET Answer Key, the correct option is (A). Net downward force along incline is $mg\\sin\\theta - \\mu mg\\cos\\theta = ma \\implies a = g(\\sin\\theta - \\mu\\cos\\theta)$."
    },
    {
        "q_num": 29, "year": 2024,
        "question": "A block of mass $m$ is placed on a smooth inclined plane of inclination $\\theta$ with the horizontal. The force exerted by the plane on the block has a magnitude",
        "options": ["$mg$", "$mg\\cos\\theta$", "$mg\\sin\\theta$", "$mg/\\cos\\theta$"],
        "correct_answer": 1, # 'b'
        "explanation": "According to the official KCET Answer Key, the correct option is (B). On an incline with no perpendicular acceleration, normal contact force is $N = mg\\cos\\theta$."
    }
]

final_items = []
for q in questions:
    final_items.append({
        "subject": "Physics",
        "chapter": "Laws of Motion",
        "chapter_number": 4,
        "question": q["question"],
        "options": q["options"],
        "correct_answer": q["correct_answer"],
        "year": q["year"],
        "explanation": q["explanation"],
        "needs_image": False
    })

out_path = 'src/data/pyq_physics_ch4.json'
with open(out_path, 'w', encoding='utf-8') as f:
    json.dump(final_items, f, indent=2, ensure_ascii=False)
print(f"Saved {len(final_items)} questions to {out_path}")

if SUPABASE_URL and SUPABASE_KEY:
    headers = {
        'apikey': SUPABASE_KEY,
        'Authorization': f'Bearer {SUPABASE_KEY}',
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
    }
    print("Deleting old Physics Chapter 4 questions in Supabase...")
    r_del = requests.delete(f"{SUPABASE_URL}/rest/v1/pyq_questions?subject=eq.Physics&chapter_number=eq.4", headers=headers)
    print(f"Delete status: {r_del.status_code}")
    
    print("Inserting 29 verified Physics Chapter 4 questions...")
    r_ins = requests.post(f"{SUPABASE_URL}/rest/v1/pyq_questions", headers=headers, json=final_items)
    print(f"Insert status: {r_ins.status_code}")
    if r_ins.status_code in [200, 201]:
        print(f"Successfully seeded {len(final_items)} questions into Supabase!")
    else:
        print("Insert error:", r_ins.text[:200])
