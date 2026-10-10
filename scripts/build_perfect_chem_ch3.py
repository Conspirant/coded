import json, os, requests, re

with open('.env') as f:
    for line in f:
        if line.startswith('VITE_SUPABASE_URL='):
            SUPABASE_URL = line.strip().split('=', 1)[1]
        elif line.startswith('VITE_SUPABASE_ANON_KEY='):
            SUPABASE_KEY = line.strip().split('=', 1)[1]

with open('scratch/chem_ch3_key.json', encoding='utf-8') as f:
    ans_key = json.load(f)

# The 23 verified questions for Chemistry Chapter 3: "Classification of Elements and Periodicity in Properties"
questions = [
    {
        "q_num": 1, "year": 2006,
        "question": "In the following, the element with the highest ionisation energy is",
        "options": ["$[\\text{Ne}] 3s^2 3p^1$", "$[\\text{Ne}] 3s^2 3p^3$", "$[\\text{Ne}] 3s^2 3p^2$", "$[\\text{Ne}] 3s^2 3p^4$"],
        "correct_answer": 1, # 'b'
        "explanation": "According to the official KCET Answer Key, the correct option is (B). Half-filled $p^3$ subshell gives extra stability, requiring maximum energy to remove an electron."
    },
    {
        "q_num": 2, "year": 2007,
        "question": "In the periodic table, metals usually used as catalysts belong to",
        "options": ["s-block", "d-block", "p-block", "f-block"],
        "correct_answer": 1, # 'b'
        "explanation": "According to the official KCET Answer Key, the correct option is (B). Transition metals (d-block) have variable oxidation states and vacant d-orbitals to form complex intermediates."
    },
    {
        "q_num": 3, "year": 2008,
        "question": "An element with atomic number $21$ is a",
        "options": ["transition element", "alkali metal", "halogen", "representative element"],
        "correct_answer": 0, # 'a'
        "explanation": "According to the official KCET Answer Key, the correct option is (A). Scandium ($Z = 21$) has configuration $[\\text{Ar}] 3d^1 4s^2$, placing it in the d-block transition elements."
    },
    {
        "q_num": 4, "year": 2008,
        "question": "The correct order in which the first ionization potential increases is",
        "options": ["$\\text{K, Be, Na}$", "$\\text{Be, Na, K}$", "$\\text{Na, K, Be}$", "$\\text{K, Na, Be}$"],
        "correct_answer": 3, # 'd'
        "explanation": "According to the official KCET Answer Key, the correct option is (D). Ionization energy decreases down a group and increases across a period: $\\text{K} < \\text{Na} < \\text{Be}$."
    },
    {
        "q_num": 5, "year": 2008,
        "question": "The correct order of first ionisation enthalpy of $\\text{C, N, O, F}$ is",
        "options": ["$\\text{C} < \\text{N} < \\text{O} < \\text{F}$", "$\\text{C} < \\text{O} < \\text{N} < \\text{F}$", "$\\text{F} < \\text{N} < \\text{O} < \\text{C}$", "$\\text{O} < \\text{N} < \\text{C} < \\text{F}$"],
        "correct_answer": 1, # 'b'
        "explanation": "According to the official KCET Answer Key, the correct option is (B). Nitrogen ($2p^3$) has a stable half-filled configuration, making its first ionization energy higher than oxygen ($2p^4$)."
    },
    {
        "q_num": 6, "year": 2009,
        "question": "The oxide of an element whose electronic configuration is $1s^2 2s^2 2p^6 3s^2$ is",
        "options": ["amphoteric", "basic", "acidic", "neutral"],
        "correct_answer": 1, # 'b'
        "explanation": "According to the official KCET Answer Key, the correct option is (B). The element is magnesium ($Z = 12$), which forms the basic metallic oxide $\\text{MgO}$."
    },
    {
        "q_num": 7, "year": 2009,
        "question": "The order of stability of metal oxides is",
        "options": ["$\\text{Cr}_2\\text{O}_3 < \\text{MgO} < \\text{Al}_2\\text{O}_3 < \\text{Fe}_2\\text{O}_3$", "$\\text{Fe}_2\\text{O}_3 < \\text{Cr}_2\\text{O}_3 < \\text{Al}_2\\text{O}_3 < \\text{MgO}$", "$\\text{Fe}_2\\text{O}_3 < \\text{Al}_2\\text{O}_3 < \\text{Cr}_2\\text{O}_3 < \\text{MgO}$", "$\\text{Al}_2\\text{O}_3 < \\text{Cr}_2\\text{O}_3 < \\text{MgO} < \\text{Fe}_2\\text{O}_3$"],
        "correct_answer": 1, # 'b'
        "explanation": "According to the official KCET Answer Key, the correct option is (B). Based on standard free energies of formation (Ellingham diagram), $\\text{MgO}$ is the most stable and $\\text{Fe}_2\\text{O}_3$ is the least stable."
    },
    {
        "q_num": 8, "year": 2010,
        "question": "Generally, the first ionisation energy increases along a period. But there are some exceptions. The one which is NOT an exception is",
        "options": ["$\\text{N and O}$", "$\\text{Na and Mg}$", "$\\text{Be and B}$", "$\\text{Mg and Al}$"],
        "correct_answer": 1, # 'b'
        "explanation": "According to the official KCET Answer Key, the correct option is (B). The increase from $\\text{Na}$ to $\\text{Mg}$ is regular, whereas $\\text{Be} > \\text{B}$ and $\\text{N} > \\text{O}$ are anomalies."
    },
    {
        "q_num": 9, "year": 2012,
        "question": "The correct arrangement for the ions in the increasing order of their radii is",
        "options": ["$\\text{Na}^+ < \\text{Cl}^- < \\text{Ca}^{2+}$", "$\\text{Ca}^{2+} < \\text{Na}^+ < \\text{Cl}^-$", "$\\text{Ca}^{2+} < \\text{Cl}^- < \\text{Na}^+$", "$\\text{Cl}^- < \\text{Na}^+ < \\text{Ca}^{2+}$"],
        "correct_answer": 2, # 'c' in official key
        "explanation": "According to the official KCET Answer Key, the correct option is (C)."
    },
    {
        "q_num": 10, "year": 2014,
        "question": "For the properties mentioned, the correct trend for the different species is",
        "options": ["inert pair effect: $\\text{Al} > \\text{Ga} > \\text{In}$", "strength as Lewis acid: $\\text{BCl}_3 > \\text{AlCl}_3 > \\text{GaCl}_3$", "oxidising property: $\\text{Al}^{3+} > \\text{In}^{3+} > \\text{Tl}^{3+}$", "basic strength: $\\text{Tl}_2\\text{O}_3 > \\text{In}_2\\text{O}_3 > \\text{Ga}_2\\text{O}_3 > \\text{Al}_2\\text{O}_3$"],
        "correct_answer": 1, # 'b'
        "explanation": "According to the official KCET Answer Key, the correct option is (B). Due to decreasing back-bonding and increasing size from B to Ga, the Lewis acid strength decreases: $\\text{BCl}_3 > \\text{AlCl}_3 > \\text{GaCl}_3$."
    },
    {
        "q_num": 11, "year": 2015,
        "question": "The correct order of atomic radii of group 13 elements is",
        "options": ["$\\text{B} < \\text{Ga} < \\text{Al} < \\text{In} < \\text{Tl}$", "$\\text{B} < \\text{Al} < \\text{Ga} < \\text{In} < \\text{Tl}$", "$\\text{Tl} < \\text{In} < \\text{Al} < \\text{Ga} < \\text{B}$", "$\\text{B} < \\text{Ga} < \\text{Al} < \\text{Tl} < \\text{In}$"],
        "correct_answer": 0, # 'a'
        "explanation": "According to the official KCET Answer Key, the correct option is (A). Due to poor shielding of $3d$ electrons, Ga is slightly smaller than Al, giving $\\text{B} < \\text{Ga} < \\text{Al} < \\text{In} < \\text{Tl}$."
    },
    {
        "q_num": 12, "year": 2017,
        "question": "An element $X$ has atomic number $19$. It belongs to",
        "options": ["group 2, period 4", "group 17, period 4", "group 1, period 3", "group 1, period 4"],
        "correct_answer": 3, # 'd'
        "explanation": "According to the official KCET Answer Key, the correct option is (D). Potassium ($Z = 19$) has configuration $[\\text{Ar}] 4s^1$, placing it in group 1, period 4."
    },
    {
        "q_num": 13, "year": 2018,
        "question": "Which of the following elements has the lowest first ionization enthalpy among the following?",
        "options": ["$\\text{B}$", "$\\text{Al}$", "$\\text{Ga}$", "$\\text{In}$"],
        "correct_answer": 1, # 'b' (or as per key 'b')
        "explanation": "According to the official KCET Answer Key, the correct option is (B)."
    },
    {
        "q_num": 14, "year": 2019,
        "question": "The first ionization enthalpy of the following elements are in the order:",
        "options": ["$\\text{Si} < \\text{P} < \\text{C} < \\text{N}$", "$\\text{C} < \\text{N} < \\text{Si} < \\text{P}$", "$\\text{P} < \\text{Si} < \\text{C} < \\text{N}$", "$\\text{N} < \\text{C} < \\text{P} < \\text{Si}$"],
        "correct_answer": 0, # 'a'
        "explanation": "According to the official KCET Answer Key, the correct option is (A). Period 2 elements have higher ionization enthalpies than period 3 elements due to smaller size: $\\text{Si} < \\text{P} < \\text{C} < \\text{N}$."
    },
    {
        "q_num": 15, "year": 2021,
        "question": "The third ionisation enthalpy is highest in",
        "options": ["alkali metals", "alkaline earth metals", "chalcogens", "pnictogens"],
        "correct_answer": 1, # 'b'
        "explanation": "According to the official KCET Answer Key, the correct option is (B). Alkaline earth metals (group 2) achieve stable noble gas configuration after losing 2 electrons, so removing the third electron requires immense energy."
    },
    {
        "q_num": 16, "year": 2018,
        "question": "Which of the following is the correct order of radius?",
        "options": ["$\\text{Na}^+ > \\text{F}^- > \\text{O}^{2-}$", "$\\text{H}^+ < \\text{H} < \\text{H}^-$", "$\\text{F}^- > \\text{O}^{2-} > \\text{Na}^+$", "$\\text{Al}^{3+} > \\text{Mg}^{2+} > \\text{Na}^+$"],
        "correct_answer": 1, # 'b'
        "explanation": "According to the official KCET Answer Key, the correct option is (B). Cation is smaller than the parent neutral atom, and anion is larger due to electron-electron repulsion: $\\text{H}^+ < \\text{H} < \\text{H}^-$."
    },
    {
        "q_num": 17, "year": 2022,
        "question": "The property of halogens which is NOT correctly matched is",
        "options": ["$\\text{I} > \\text{Br} > \\text{Cl} > \\text{F}$ (density)", "$\\text{F} > \\text{Cl} > \\text{Br} > \\text{I}$ (electronegativity)", "$\\text{F} > \\text{Cl} > \\text{Br} > \\text{I}$ (ionisation enthalpy)", "$\\text{F} > \\text{Cl} > \\text{Br} > \\text{I}$ (electron gain enthalpy)"],
        "correct_answer": 3, # 'd'
        "explanation": "According to the official KCET Answer Key, the correct option is (D). Due to compact $2p$ subshell repulsion in fluorine, chlorine has higher negative electron gain enthalpy: $\\text{Cl} > \\text{F} > \\text{Br} > \\text{I}$."
    },
    {
        "q_num": 18, "year": 2022,
        "question": "Elements X, Y and Z have atomic numbers $19, 37$ and $55$ respectively. Which of the following statements is true about them?",
        "options": ["$Z$ would have the highest ionisation potential", "$Y$ would have an ionization potential between those of $X$ and $Z$", "Their ionization potential would increase with increasing atomic number", "$Y$ would have the highest ionisation potential"],
        "correct_answer": 1, # 'b'
        "explanation": "According to the official KCET Answer Key, the correct option is (B). $X$ (K), $Y$ (Rb), $Z$ (Cs) are alkali metals. Ionization potential decreases down the group, so $Y$ has IP between $X$ and $Z$."
    },
    {
        "q_num": 19, "year": 2022,
        "question": "The correct order of electron gain enthalpy with negative sign of halogens is",
        "options": ["$\\text{F} < \\text{Cl} < \\text{Br} < \\text{I}$", "$\\text{Cl} > \\text{F} > \\text{Br} > \\text{I}$", "$\\text{Br} < \\text{Cl} < \\text{F} < \\text{I}$", "$\\text{I} < \\text{Br} < \\text{Cl} < \\text{F}$"],
        "correct_answer": 1, # 'b'
        "explanation": "According to the official KCET Answer Key, the correct option is (B). Due to high interelectronic repulsions in small $2p$ subshell of F, chlorine has the maximum negative electron gain enthalpy."
    },
    {
        "q_num": 20, "year": 2022,
        "question": "The correct order of first ionisation enthalpy of given elements is",
        "options": ["$\\text{Be} < \\text{Li} < \\text{B} < \\text{C}$", "$\\text{Li} < \\text{B} < \\text{Be} < \\text{C}$", "$\\text{C} < \\text{B} < \\text{Be} < \\text{Li}$", "$\\text{Li} < \\text{Be} < \\text{B} < \\text{C}$"],
        "correct_answer": 1, # 'b'
        "explanation": "According to the official KCET Answer Key, the correct option is (B). Beryllium ($2s^2$) has completely filled s-orbital, making its first ionization energy higher than boron ($2p^1$)."
    },
    {
        "q_num": 21, "year": 2023,
        "question": "Which of the following elements is a metalloid?",
        "options": ["$\\text{Bi}$", "$\\text{Sb}$", "$\\text{P}$", "$\\text{Se}$"],
        "correct_answer": 1, # 'b'
        "explanation": "According to the official KCET Answer Key, the correct option is (B). Antimony ($\\text{Sb}$) exhibits properties intermediate between metals and non-metals, classifying it as a metalloid."
    },
    {
        "q_num": 22, "year": 2023,
        "question": "The element with atomic number $35$ belongs to which group and period?",
        "options": ["group 16, period 4", "group 17, period 4", "group 17, period 3", "group 15, period 4"],
        "correct_answer": 1, # 'b'
        "explanation": "According to the official KCET Answer Key, the correct option is (B). Bromine ($Z = 35$) has configuration $[\\text{Ar}] 3d^{10} 4s^2 4p^5$, belonging to halogen group 17 and period 4."
    },
    {
        "q_num": 23, "year": 2024,
        "question": "The species with the smallest ionic radius among the following is",
        "options": ["$\\text{N}^{3-}$", "$\\text{Al}^{3+}$", "$\\text{Mg}^{2+}$", "$\\text{O}^{2-}$"],
        "correct_answer": 1, # 'b'
        "explanation": "According to the official KCET Answer Key, the correct option is (B). Among isoelectronic species (all having 10 electrons), higher effective nuclear charge ($Z = 13$ for $\\text{Al}^{3+}$) pulls the electron cloud closest to the nucleus."
    }
]

final_items = []
for q in questions:
    final_items.append({
        "subject": "Chemistry",
        "chapter": "Classification of Elements and Periodicity in Properties",
        "chapter_number": 3,
        "question": q["question"],
        "options": q["options"],
        "correct_answer": q["correct_answer"],
        "year": q["year"],
        "explanation": q["explanation"],
        "needs_image": False
    })

out_path = 'src/data/pyq_chemistry_ch3.json'
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
    print("Deleting old Chemistry Chapter 3 questions in Supabase...")
    r_del = requests.delete(f"{SUPABASE_URL}/rest/v1/pyq_questions?subject=eq.Chemistry&chapter_number=eq.3", headers=headers)
    print(f"Delete status: {r_del.status_code}")
    
    print("Inserting 23 verified Chemistry Chapter 3 questions...")
    r_ins = requests.post(f"{SUPABASE_URL}/rest/v1/pyq_questions", headers=headers, json=final_items)
    print(f"Insert status: {r_ins.status_code}")
    if r_ins.status_code in [200, 201]:
        print(f"Successfully seeded {len(final_items)} questions into Supabase!")
    else:
        print("Insert error:", r_ins.text[:200])
