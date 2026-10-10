import json

chem_questions = [
  {
    "subject": "Chemistry",
    "chapter": "Some Basic Concepts of Chemistry",
    "chapter_number": 1,
    "question": "The decomposition of a certain mass of $\\text{CaCO}_3$ gave $11.2\\text{ dm}^3$ of $\\text{CO}_2$ gas at STP. The mass of $\\text{KOH}$ required to completely neutralise the gas is",
    "options": [
      "$56\\text{ g}$",
      "$28\\text{ g}$",
      "$42\\text{ g}$",
      "$20\\text{ g}$"
    ],
    "correct_answer": 0,
    "year": 2006,
    "explanation": "At STP, $1\\text{ mole of gas} = 22.4\\text{ dm}^3$.\\nNumber of moles of $\\text{CO}_2 = \\frac{11.2}{22.4} = 0.5\\text{ mol}$.\\nReaction: $2\\text{KOH} + \\text{CO}_2 \\rightarrow \\text{K}_2\\text{CO}_3 + \\text{H}_2\\text{O}$.\\nThus, $1\\text{ mol of } \\text{CO}_2$ requires $2\\text{ mol of } \\text{KOH}$.\\n$0.5\\text{ mol of } \\text{CO}_2$ requires $1.0\\text{ mol of } \\text{KOH}$.\\nMolar mass of $\\text{KOH} = 39 + 16 + 1 = 56\\text{ g/mol}$.\\nMass required $= 1.0 \\times 56 = 56\\text{ g}$.",
    "needs_image": False,
    "image_url": ""
  },
  {
    "subject": "Chemistry",
    "chapter": "Some Basic Concepts of Chemistry",
    "chapter_number": 1,
    "question": "For the reaction, $\\text{Fe}_2\\text{O}_3 + 3\\text{CO} \\rightarrow 2\\text{Fe} + 3\\text{CO}_2$, the volume of carbon monoxide required to reduce one mole of ferric oxide at STP is",
    "options": [
      "$67.2\\text{ dm}^3$",
      "$11.2\\text{ dm}^3$",
      "$22.4\\text{ dm}^3$",
      "$44.8\\text{ dm}^3$"
    ],
    "correct_answer": 0,
    "year": 2008,
    "explanation": "From the stoichiometry of the reaction:\\n$1\\text{ mol of } \\text{Fe}_2\\text{O}_3 \\text{ reacts with } 3\\text{ moles of } \\text{CO}$.\\nVolume of $1\\text{ mole of any gas at STP} = 22.4\\text{ dm}^3$.\\nTherefore, volume of $\\text{CO} = 3 \\times 22.4\\text{ dm}^3 = 67.2\\text{ dm}^3$.",
    "needs_image": False,
    "image_url": ""
  },
  {
    "subject": "Chemistry",
    "chapter": "Some Basic Concepts of Chemistry",
    "chapter_number": 1,
    "question": "$10\\text{ cm}^3$ of $0.1\\text{ N}$ monobasic acid requires $15\\text{ cm}^3$ of sodium hydroxide solution. The normality of the $\\text{NaOH}$ solution is",
    "options": [
      "$0.066\\text{ N}$",
      "$0.66\\text{ N}$",
      "$1.5\\text{ N}$",
      "$0.15\\text{ N}$"
    ],
    "correct_answer": 0,
    "year": 2011,
    "explanation": "By normality equation:\\n$N_1 V_1 = N_2 V_2$\\n$0.1\\text{ N} \\times 10\\text{ cm}^3 = N_2 \\times 15\\text{ cm}^3$\\n$N_2 = \\frac{1}{15} \\approx 0.0667\\text{ N}$.",
    "needs_image": False,
    "image_url": ""
  },
  {
    "subject": "Chemistry",
    "chapter": "Some Basic Concepts of Chemistry",
    "chapter_number": 1,
    "question": "The number of gram molecules of chlorine in $12.044 \\times 10^{23}$ hydrogen chloride molecules is",
    "options": [
      "$1\\text{ mol}$",
      "$0.5\\text{ mol}$",
      "$2\\text{ mol}$",
      "$0.25\\text{ mol}$"
    ],
    "correct_answer": 0,
    "year": 2013,
    "explanation": "Number of $\\text{HCl}$ molecules $= 12.044 \\times 10^{23} = 2 \\times 6.022 \\times 10^{23} = 2\\text{ moles of HCl}$.\\n$1\\text{ mole of HCl}$ contains $0.5\\text{ mole of Cl}_2$ molecule.\\nHence, $2\\text{ moles of HCl}$ contain $2 \\times 0.5 = 1\\text{ gram molecule of Cl}_2$.",
    "needs_image": False,
    "image_url": ""
  },
  {
    "subject": "Chemistry",
    "chapter": "Some Basic Concepts of Chemistry",
    "chapter_number": 1,
    "question": "The mass of $0.1\\text{ mole}$ of methane ($\\text{CH}_4$) is",
    "options": [
      "$1.6\\text{ g}$",
      "$0.1\\text{ g}$",
      "$1\\text{ g}$",
      "$16\\text{ g}$"
    ],
    "correct_answer": 0,
    "year": 2015,
    "explanation": "Molar mass of methane ($\\text{CH}_4$) $= 12 + (4 \\times 1) = 16\\text{ g/mol}$.\\nMass $= \\text{Moles} \\times \\text{Molar mass} = 0.1 \\times 16 = 1.6\\text{ g}$.",
    "needs_image": False,
    "image_url": ""
  },
  {
    "subject": "Chemistry",
    "chapter": "Some Basic Concepts of Chemistry",
    "chapter_number": 1,
    "question": "$80\\text{ g}$ of oxygen contains as many atoms as in",
    "options": [
      "$10\\text{ g of hydrogen}$",
      "$5\\text{ g of hydrogen}$",
      "$1\\text{ g of hydrogen}$",
      "$2.5\\text{ g of hydrogen}$"
    ],
    "correct_answer": 1,
    "year": 2017,
    "explanation": "Number of gram atoms of oxygen $= \\frac{80\\text{ g}}{16\\text{ g/mol}} = 5\\text{ gram atoms}$.\\n$5\\text{ gram atoms of hydrogen} = 5 \\times 1\\text{ g} = 5\\text{ g of hydrogen}$.",
    "needs_image": False,
    "image_url": ""
  },
  {
    "subject": "Chemistry",
    "chapter": "Some Basic Concepts of Chemistry",
    "chapter_number": 1,
    "question": "The molarity of an orthophosphoric acid ($\\text{H}_3\\text{PO}_4$) solution is $3\\text{ M}$. Its normality is",
    "options": [
      "$9\\text{ N}$",
      "$3\\text{ N}$",
      "$1\\text{ N}$",
      "$6\\text{ N}$"
    ],
    "correct_answer": 0,
    "year": 2019,
    "explanation": "Normality $= \\text{Molarity} \\times \\text{Basicity}$.\\n$\\text{H}_3\\text{PO}_4$ is a tribasic acid (basicity $= 3$).\\nNormality $= 3\\text{ M} \\times 3 = 9\\text{ N}$.",
    "needs_image": False,
    "image_url": ""
  },
  {
    "subject": "Chemistry",
    "chapter": "Some Basic Concepts of Chemistry",
    "chapter_number": 1,
    "question": "Which of the following has the maximum number of atoms of oxygen?",
    "options": [
      "$2\\text{ g of } \\text{CO}$",
      "$2\\text{ g of } \\text{H}_2\\text{O}$",
      "$2\\text{ g of } \\text{CO}_2$",
      "$2\\text{ g of } \\text{CH}_3\\text{OH}$"
    ],
    "correct_answer": 1,
    "year": 2021,
    "explanation": "Moles of oxygen atoms:\\nIn $2\\text{ g of H}_2\\text{O}$: $\\frac{2}{18} \\times 1 = 0.111\\text{ mol}$.\\nIn $2\\text{ g of CO}$: $\\frac{2}{28} \\times 1 = 0.071\\text{ mol}$.\\nIn $2\\text{ g of CO}_2$: $\\frac{2}{44} \\times 2 = 0.091\\text{ mol}$.\\nIn $2\\text{ g of CH}_3\\text{OH}$: $\\frac{2}{32} \\times 1 = 0.0625\\text{ mol}$.\\nHence, $2\\text{ g of H}_2\\text{O}$ has the maximum number of oxygen atoms.",
    "needs_image": False,
    "image_url": ""
  }
]

math_questions = [
  {
    "subject": "Mathematics",
    "chapter": "Sets",
    "chapter_number": 1,
    "question": "The set $A = \\{x \\in \\mathbb{R} : |2x + 3| < 7\\}$ is equal to the set",
    "options": [
      "$\\{x \\in \\mathbb{R} : -5 < x < 2\\}$",
      "$\\{x \\in \\mathbb{R} : -7 < x < 7\\}$",
      "$\\{x \\in \\mathbb{R} : -3 < x < 2\\}$",
      "$\\{x \\in \\mathbb{R} : -2 < x < 5\\}$"
    ],
    "correct_answer": 0,
    "year": 2006,
    "explanation": "$|2x + 3| < 7 \\implies -7 < 2x + 3 < 7$.\\nSubtract 3 throughout:\\n$-10 < 2x < 4$.\\nDivide by 2:\\n$-5 < x < 2$.\\nHence, $A = \\{x \\in \\mathbb{R} : -5 < x < 2\\}$.",
    "needs_image": False,
    "image_url": ""
  },
  {
    "subject": "Mathematics",
    "chapter": "Sets",
    "chapter_number": 1,
    "question": "The set-builder form of the set $A = \\{-1, 1\\}$ is",
    "options": [
      "$\\{x : x^2 - 1 = 0, x \\in \\mathbb{R}\\}$",
      "$\\{x : x^2 + 1 = 0, x \\in \\mathbb{R}\\}$",
      "$\\{x : x^2 - 9 = 0, x \\in \\mathbb{R}\\}$",
      "$\\{x : x \\text{ is a prime number}\\}$"
    ],
    "correct_answer": 0,
    "year": 2014,
    "explanation": "The roots of $x^2 - 1 = 0$ are $x = \\pm 1$.\\nTherefore, $A = \\{-1, 1\\} = \\{x : x^2 - 1 = 0, x \\in \\mathbb{R}\\}$.",
    "needs_image": False,
    "image_url": ""
  },
  {
    "subject": "Mathematics",
    "chapter": "Sets",
    "chapter_number": 1,
    "question": "Which of the following is an empty set?",
    "options": [
      "$\\{x : x^2 - 9 = 0, x \\in \\mathbb{R}\\}$",
      "$\\{x : x^2 - 1 = 0, x \\in \\mathbb{R}\\}$",
      "$\\{x : x^2 + 1 = 0, x \\in \\mathbb{R}\\}$",
      "$\\{x : x^2 = x + 2, x \\in \\mathbb{R}\\}$"
    ],
    "correct_answer": 2,
    "year": 2017,
    "explanation": "For $x^2 + 1 = 0$, $x^2 = -1 \\implies x = \\pm i$, which has no real solutions ($x \\notin \\mathbb{R}$).\\nTherefore, $\\{x : x^2 + 1 = 0, x \\in \\mathbb{R}\\} = \\emptyset$.",
    "needs_image": False,
    "image_url": ""
  },
  {
    "subject": "Mathematics",
    "chapter": "Sets",
    "chapter_number": 1,
    "question": "If $A$ and $B$ are two sets such that $n(A) = 17$, $n(B) = 23$, and $n(A \\cup B) = 38$, then $n(A \\cap B)$ is",
    "options": [
      "$2$",
      "$4$",
      "$6$",
      "$8$"
    ],
    "correct_answer": 0,
    "year": 2020,
    "explanation": "Using the principle of inclusion-exclusion:\\n$n(A \\cup B) = n(A) + n(B) - n(A \\cap B)$\\n$38 = 17 + 23 - n(A \\cap B)$\\n$38 = 40 - n(A \\cap B) \\implies n(A \\cap B) = 40 - 38 = 2$.",
    "needs_image": False,
    "image_url": ""
  },
  {
    "subject": "Mathematics",
    "chapter": "Sets",
    "chapter_number": 1,
    "question": "If a set $A$ has $n$ elements, then the total number of non-empty proper subsets of $A$ is",
    "options": [
      "$2^n$",
      "$2^n - 1$",
      "$2^n - 2$",
      "$2^{n-1}$"
    ],
    "correct_answer": 2,
    "year": 2023,
    "explanation": "Total number of subsets of a set with $n$ elements $= 2^n$.\\nProper subsets exclude the set itself $= 2^n - 1$.\\nNon-empty proper subsets exclude both the empty set $\\emptyset$ and the set itself $= 2^n - 2$.",
    "needs_image": False,
    "image_url": ""
  }
]

with open('src/data/pyq_chemistry_ch1.json', 'w', encoding='utf-8') as f:
    json.dump(chem_questions, f, indent=2)
print(f"Saved {len(chem_questions)} Chemistry questions!")

with open('src/data/pyq_maths_ch1.json', 'w', encoding='utf-8') as f:
    json.dump(math_questions, f, indent=2)
print(f"Saved {len(math_questions)} Mathematics questions!")
