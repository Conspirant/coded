import json, os

questions = [
  {
    "id": "chem_ch15_q1",
    "subject": "Chemistry",
    "year": 2006,
    "question": "Methyl bromide is converted into ethane by heating it in ether medium with:",
    "options": [
      "$\\text{Al}$",
      "$\\text{Zn}$",
      "$\\text{Na}$",
      "$\\text{Mg}$"
    ],
    "explanation": "When methyl bromide (an alkyl halide) in dry ether is treated with metallic sodium ($\\text{Na}$), it undergoes Wurtz reaction to form ethane:\n$$2\\text{CH}_3\\text{Br} + 2\\text{Na} \\xrightarrow{\\text{dry ether}} \\text{CH}_3-\\text{CH}_3 + 2\\text{NaBr}$$\nHence, option (c) is correct.",
    "chapter": "Haloalkanes and Haloarenes",
    "chapter_number": 15,
    "correct_answer": 2,
    "needs_image": False
  },
  {
    "id": "chem_ch15_q2",
    "subject": "Chemistry",
    "year": 2006,
    "question": "Beilstein test is used for the detection of:",
    "options": [
      "Nitrogen",
      "Sulfur",
      "Halogens",
      "Carbon and Hydrogen"
    ],
    "explanation": "Beilstein test is a qualitative test used for the detection of halogens ($\\text{Cl, Br, I}$) in organic compounds. When an organic compound containing halogen is heated on a clean copper wire in a Bunsen flame, volatile copper halides are formed which impart a characteristic green or bluish-green colour to the flame.",
    "chapter": "Haloalkanes and Haloarenes",
    "chapter_number": 15,
    "correct_answer": 2,
    "needs_image": False
  },
  {
    "id": "chem_ch15_q3",
    "subject": "Chemistry",
    "year": 2006,
    "question": "Which of the following compounds is optically active?",
    "options": [
      "$\\text{CH}_3-\\text{CH}_2-\\text{CH}(\\text{Br})-\\text{CHO}$",
      "$\\text{CH}_3-\\text{CH}_2-\\text{CH}_2-\\text{CHO}$",
      "$(\\text{CH}_3)_2\\text{C}(\\text{Br})-\\text{CHO}$",
      "$\\text{CH}_3-\\text{CH}_2-\\text{C}(\\text{CH}_3)_2-\\text{CHO}$"
    ],
    "explanation": "A compound is optically active if it possesses at least one asymmetric (chiral) carbon atom attached to four distinct groups.\nIn $\\text{CH}_3-\\text{CH}_2-\\text{C}^*\\text{H}(\\text{Br})-\\text{CHO}$, the C-2 carbon is bonded to:\n1. $-\\text{H}$\n2. $-\\text{Br}$\n3. $-\\text{CHO}$\n4. $-\\text{CH}_2\\text{CH}_3$\nSince all four attached groups are different, it is a chiral center, making the molecule optically active.",
    "chapter": "Haloalkanes and Haloarenes",
    "chapter_number": 15,
    "correct_answer": 0,
    "needs_image": False
  },
  {
    "id": "chem_ch15_q4",
    "subject": "Chemistry",
    "year": 2007,
    "question": "An alkyl halide reacts with alcoholic potassium cyanide ($\\text{KCN}$) to give primarily:",
    "options": [
      "Alkyl isocyanide",
      "Nitroalkane",
      "Alkyl cyanide (Alkanenitrile)",
      "Alkane"
    ],
    "explanation": "Cyanide ion ($\\text{CN}^-$) is an ambident nucleophile. $\\text{KCN}$ is predominantly ionic in nature and provides free cyanide ions in solution. Attack primarily occurs through the carbon atom because the $\\text{C}-\\text{C}$ bond is thermodynamically more stable than the $\\text{C}-\\text{N}$ bond. Hence, alkyl cyanides (alkanenitriles, $\\text{R}-\\text{CN}$) are obtained as the major product.",
    "chapter": "Haloalkanes and Haloarenes",
    "chapter_number": 15,
    "correct_answer": 2,
    "needs_image": False
  },
  {
    "id": "chem_ch15_q5",
    "subject": "Chemistry",
    "year": 2007,
    "question": "Chloroform on exposure to air and sunlight produces a highly poisonous gas known as:",
    "options": [
      "Mustard gas",
      "Phosgene ($\\text{COCl}_2$)",
      "Lewisite",
      "Tear gas"
    ],
    "explanation": "Chloroform ($\\text{CHCl}_3$) is slowly oxidized by air in the presence of light to produce carbonyl chloride (phosgene, $\\text{COCl}_2$), an extremely poisonous gas:\n$$2\\text{CHCl}_3 + \\text{O}_2 \\xrightarrow{\\text{light}} 2\\text{COCl}_2 + 2\\text{HCl}$$",
    "chapter": "Haloalkanes and Haloarenes",
    "chapter_number": 15,
    "correct_answer": 1,
    "needs_image": False
  },
  {
    "id": "chem_ch15_q6",
    "subject": "Chemistry",
    "year": 2007,
    "question": "Which of the following alkyl halides undergoes $\\text{S}_\\text{N}1$ reaction most rapidly?",
    "options": [
      "Tertiary alkyl halide",
      "Secondary alkyl halide",
      "Primary alkyl halide",
      "Methyl halide"
    ],
    "explanation": "The rate-determining step in an $\\text{S}_\\text{N}1$ mechanism is the formation of a carbocation intermediate. The stability of carbocations follows the order:\n$$3^\\circ > 2^\\circ > 1^\\circ > \\text{CH}_3^+$$\nDue to maximum stability of the tertiary carbocation, tertiary alkyl halides ($3^\\circ$) undergo $\\text{S}_\\text{N}1$ reaction most rapidly.",
    "chapter": "Haloalkanes and Haloarenes",
    "chapter_number": 15,
    "correct_answer": 0,
    "needs_image": False
  },
  {
    "id": "chem_ch15_q7",
    "subject": "Chemistry",
    "year": 2008,
    "question": "Reaction of ethyl bromide with silver cyanide ($\\text{AgCN}$) yields:",
    "options": [
      "Ethyl cyanide",
      "Ethane",
      "Ethyl amine",
      "Ethyl isocyanide"
    ],
    "explanation": "$\\text{AgCN}$ is predominantly covalent in nature, so the nitrogen atom with its lone pair is free to act as the nucleophile. Therefore, attack occurs through nitrogen, yielding ethyl isocyanide ($\\text{C}_2\\text{H}_5\\text{NC}$) as the major product:\n$$\\text{C}_2\\text{H}_5\\text{Br} + \\text{AgCN} \\to \\text{C}_2\\text{H}_5\\text{NC} + \\text{AgBr}$$",
    "chapter": "Haloalkanes and Haloarenes",
    "chapter_number": 15,
    "correct_answer": 3,
    "needs_image": False
  },
  {
    "id": "chem_ch15_q8",
    "subject": "Chemistry",
    "year": 2008,
    "question": "Chlorobenzene on heating with metallic sodium in dry ether gives diphenyl. This reaction is called:",
    "options": [
      "Wurtz reaction",
      "Friedel-Crafts reaction",
      "Frankland reaction",
      "Fittig reaction"
    ],
    "explanation": "When aryl halides react with metallic sodium in dry ether to form diphenyl (biphenyl), the reaction is known as Fittig reaction:\n$$2\\text{C}_6\\text{H}_5\\text{Cl} + 2\\text{Na} \\xrightarrow{\\text{dry ether}} \\text{C}_6\\text{H}_5-\\text{C}_6\\text{H}_5 + 2\\text{NaCl}$$",
    "chapter": "Haloalkanes and Haloarenes",
    "chapter_number": 15,
    "correct_answer": 3,
    "needs_image": False
  },
  {
    "id": "chem_ch15_q9",
    "subject": "Chemistry",
    "year": 2009,
    "question": "The boiling points of alkyl halides decrease in the order:",
    "options": [
      "$\\text{R}-\\text{Cl} > \\text{R}-\\text{Br} > \\text{R}-\\text{I} > \\text{R}-\\text{F}$",
      "$\\text{R}-\\text{F} > \\text{R}-\\text{Cl} > \\text{R}-\\text{Br} > \\text{R}-\\text{I}$",
      "$\\text{R}-\\text{Br} > \\text{R}-\\text{I} > \\text{R}-\\text{Cl} > \\text{R}-\\text{F}$",
      "$\\text{R}-\\text{I} > \\text{R}-\\text{Br} > \\text{R}-\\text{Cl} > \\text{R}-\\text{F}$"
    ],
    "explanation": "For a given alkyl group, as the size and mass of the halogen atom increase, the magnitude of van der Waals forces of attraction increases. Thus, the boiling points follow the order:\n$$\\text{R}-\\text{I} > \\text{R}-\\text{Br} > \\text{R}-\\text{Cl} > \\text{R}-\\text{F}$$",
    "chapter": "Haloalkanes and Haloarenes",
    "chapter_number": 15,
    "correct_answer": 3,
    "needs_image": False
  },
  {
    "id": "chem_ch15_q10",
    "subject": "Chemistry",
    "year": 2009,
    "question": "Which among the following compounds has the highest dipole moment?",
    "options": [
      "$\\text{CCl}_4$",
      "$\\text{CHCl}_3$",
      "$\\text{CH}_2\\text{Cl}_2$",
      "$\\text{CH}_3\\text{Cl}$"
    ],
    "explanation": "The experimental dipole moments are:\n- $\\text{CH}_3\\text{Cl}: 1.87\\text{ D}$\n- $\\text{CH}_2\\text{Cl}_2: 1.60\\text{ D}$\n- $\\text{CHCl}_3: 1.04\\text{ D}$\n- $\\text{CCl}_4: 0\\text{ D}$ (symmetric tetrahedral structure, dipole vectors cancel completely).\nThus, methyl chloride ($\\text{CH}_3\\text{Cl}$) has the highest dipole moment.",
    "chapter": "Haloalkanes and Haloarenes",
    "chapter_number": 15,
    "correct_answer": 3,
    "needs_image": False
  },
  {
    "id": "chem_ch15_q11",
    "subject": "Chemistry",
    "year": 2010,
    "question": "An organic halogen compound used as a fire extinguisher under the trade name Pyrene is:",
    "options": [
      "$\\text{CCl}_4$",
      "$\\text{CHCl}_3$",
      "$\\text{CHI}_3$",
      "$\\text{CH}_2\\text{Cl}_2$"
    ],
    "explanation": "Carbon tetrachloride ($\\text{CCl}_4$) produces dense non-combustible vapours that blanket flames, cutting off oxygen. It is marketed under the commercial name Pyrene for use in fire extinguishers.",
    "chapter": "Haloalkanes and Haloarenes",
    "chapter_number": 15,
    "correct_answer": 0,
    "needs_image": False
  },
  {
    "id": "chem_ch15_q12",
    "subject": "Chemistry",
    "year": 2010,
    "question": "A mixture of 1-chloropropane and 2-chloropropane when treated with metallic sodium in dry ether gives:",
    "options": [
      "$n$-Hexane only",
      "$2,3$-Dimethylbutane only",
      "A mixture of $n$-hexane, $2,3$-dimethylbutane and $2$-methylpentane",
      "Propane and propene"
    ],
    "explanation": "When two different alkyl halides ($\\text{R}_1-\\text{X}$ and $\\text{R}_2-\\text{X}$) are treated with sodium in dry ether, three different alkane products are formed:\n1. Self-coupling of 1-chloropropane gives $n$-hexane ($\\text{CH}_3\\text{CH}_2\\text{CH}_2-\\text{CH}_2\\text{CH}_2\\text{CH}_3$).\n2. Self-coupling of 2-chloropropane gives $2,3$-dimethylbutane ($(\\text{CH}_3)_2\\text{CH}-\\text{CH}(\\text{CH}_3)_2$).\n3. Cross-coupling of 1-chloropropane and 2-chloropropane gives $2$-methylpentane ($\\text{CH}_3\\text{CH}_2\\text{CH}_2-\\text{CH}(\\text{CH}_3)_2$).",
    "chapter": "Haloalkanes and Haloarenes",
    "chapter_number": 15,
    "correct_answer": 2,
    "needs_image": False
  },
  {
    "id": "chem_ch15_q13",
    "subject": "Chemistry",
    "year": 2011,
    "question": "The conversion of an alkyl halide into an alkene by heating with alcoholic $\\text{KOH}$ is an example of:",
    "options": [
      "$\\beta$-Elimination (Dehydrohalogenation)",
      "Nucleophilic substitution",
      "Electrophilic addition",
      "Free radical substitution"
    ],
    "explanation": "Heating an alkyl halide with alcoholic $\\text{KOH}$ results in the removal of a hydrogen atom from the $\\beta$-carbon and a halogen atom from the $\\alpha$-carbon to form an alkene. This process is a $\\beta$-elimination reaction (dehydrohalogenation).",
    "chapter": "Haloalkanes and Haloarenes",
    "chapter_number": 15,
    "correct_answer": 0,
    "needs_image": False
  },
  {
    "id": "chem_ch15_q14",
    "subject": "Chemistry",
    "year": 2011,
    "question": "Which of the following undergoes nucleophilic substitution reaction predominantly with complete inversion of configuration?",
    "options": [
      "$3^\\circ$ Alkyl halide",
      "Benzyl halide",
      "Allyl halide",
      "$1^\\circ$ Alkyl halide"
    ],
    "explanation": "Primary ($1^\\circ$) alkyl halides react via the bimolecular $\\text{S}_\\text{N}2$ mechanism involving a backside nucleophilic attack in a single concerted step. This concerted attack leads to complete Walden inversion (inversion of configuration).",
    "chapter": "Haloalkanes and Haloarenes",
    "chapter_number": 15,
    "correct_answer": 3,
    "needs_image": False
  },
  {
    "id": "chem_ch15_q15",
    "subject": "Chemistry",
    "year": 2012,
    "question": "Chlorobenzene is extremely less reactive towards nucleophilic substitution compared to chloroethane because of:",
    "options": [
      "Inductive effect",
      "Steric hindrance",
      "Electronegativity difference",
      "Resonance stabilization, partial double bond character of $\\text{C}-\\text{Cl}$ bond and $sp^2$ hybridized carbon"
    ],
    "explanation": "Chlorobenzene is less reactive towards nucleophilic substitution due to:\n1. Resonance effect: The lone pair of electrons on chlorine delocalizes with the $\\pi$-electrons of the benzene ring, imparting partial double bond character to the $\\text{C}-\\text{Cl}$ bond.\n2. Difference in hybridization: The carbon attached to chlorine in chlorobenzene is $sp^2$ hybridized (more electronegative, shorter and stronger bond) compared to $sp^3$ in haloalkanes.\n3. Instability of phenyl cation and repulsion between incoming nucleophile and electron-rich $\\pi$-cloud.",
    "chapter": "Haloalkanes and Haloarenes",
    "chapter_number": 15,
    "correct_answer": 3,
    "needs_image": False
  },
  {
    "id": "chem_ch15_q16",
    "subject": "Chemistry",
    "year": 2012,
    "question": "Finkelstein reaction is used for the preparation of alkyl iodides by the reaction of alkyl chlorides/bromides with:",
    "options": [
      "$\\text{AgF}$ in water",
      "$\\text{HI}$ in ether",
      "$\\text{NaI}$ in dry acetone",
      "$\\text{KI}$ in alcohol"
    ],
    "explanation": "Finkelstein reaction involves halogen exchange where alkyl chlorides or bromides react with $\\text{NaI}$ in dry acetone to precipitate $\\text{NaCl}$ or $\\text{NaBr}$ (which are insoluble in acetone) and drive the equilibrium forward:\n$$\\text{R}-\\text{X} + \\text{NaI} \\xrightarrow{\\text{dry acetone}} \\text{R}-\\text{I} + \\text{NaX}\\downarrow \\quad (\\text{X} = \\text{Cl, Br})$$",
    "chapter": "Haloalkanes and Haloarenes",
    "chapter_number": 15,
    "correct_answer": 2,
    "needs_image": False
  },
  {
    "id": "chem_ch15_q17",
    "subject": "Chemistry",
    "year": 2013,
    "question": "When toluene is treated with chlorine in the presence of sunlight and boiling condition, the product formed is:",
    "options": [
      "$o$-Chlorotoluene",
      "$p$-Chlorotoluene",
      "$m$-Chlorotoluene",
      "Benzyl chloride / Benzo trichloride"
    ],
    "explanation": "In the presence of sunlight ($h\\nu$) and heat, chlorination of toluene occurs via a free radical mechanism at the side-chain (methyl group) rather than the aromatic ring, giving benzyl chloride ($\\text{C}_6\\text{H}_5\\text{CH}_2\\text{Cl}$), and on further chlorination, benzal chloride and benzotrichloride.",
    "chapter": "Haloalkanes and Haloarenes",
    "chapter_number": 15,
    "correct_answer": 3,
    "needs_image": False
  },
  {
    "id": "chem_ch15_q18",
    "subject": "Chemistry",
    "year": 2013,
    "question": "Grignard reagent is prepared by the reaction of alkyl halide with metallic magnesium in the presence of:",
    "options": [
      "Alcohol",
      "Water",
      "Liquid ammonia",
      "Dry ether"
    ],
    "explanation": "Grignard reagents ($\\text{RMgX}$) are highly reactive and react vigorously with protic solvents (water, alcohols) to form alkanes. Therefore, they are prepared by reacting an alkyl halide with magnesium metal in moisture-free dry ether medium:\n$$\\text{R}-\\text{X} + \\text{Mg} \\xrightarrow{\\text{dry ether}} \\text{R}-\\text{Mg}-\\text{X}$$",
    "chapter": "Haloalkanes and Haloarenes",
    "chapter_number": 15,
    "correct_answer": 3,
    "needs_image": False
  },
  {
    "id": "chem_ch15_q19",
    "subject": "Chemistry",
    "year": 2014,
    "question": "2-Bromopentane when heated with alcoholic $\\text{KOH}$ gives predominantly pent-2-ene. This is in accordance with:",
    "options": [
      "Saytzeff's rule",
      "Markovnikov's rule",
      "Hund's rule",
      "Anti-Markovnikov's rule"
    ],
    "explanation": "According to Saytzeff's (Zaitsev's) rule, in dehydrohalogenation reactions, the preferred alkene product is the one that has the greater number of alkyl substituents attached to the double-bonded carbon atoms (the more substituted, thermodynamically more stable alkene). Thus, pent-2-ene is the major product over pent-1-ene.",
    "chapter": "Haloalkanes and Haloarenes",
    "chapter_number": 15,
    "correct_answer": 0,
    "needs_image": False
  },
  {
    "id": "chem_ch15_q20",
    "subject": "Chemistry",
    "year": 2014,
    "question": "Which of the following reagents is used to convert alkyl chloride into alkyl fluoride (Swarts reaction)?",
    "options": [
      "$\\text{KF}$",
      "$\\text{AgF}$ (or $\\text{Hg}_2\\text{F}_2, \\text{CoF}_3, \\text{SbF}_3$)",
      "$\\text{HF}$",
      "$\\text{NaF}$"
    ],
    "explanation": "Swarts reaction is used to synthesize alkyl fluorides by heating alkyl chlorides or bromides with metallic fluorides such as $\\text{AgF}, \\text{Hg}_2\\text{F}_2, \\text{CoF}_3,\\text{ or }\\text{SbF}_3$:\n$$\\text{R}-\\text{Cl} + \\text{AgF} \\to \\text{R}-\\text{F} + \\text{AgCl}\\downarrow$$",
    "chapter": "Haloalkanes and Haloarenes",
    "chapter_number": 15,
    "correct_answer": 1,
    "needs_image": False
  },
  {
    "id": "chem_ch15_q21",
    "subject": "Chemistry",
    "year": 2015,
    "question": "A racemic mixture is optically inactive due to:",
    "options": [
      "External compensation",
      "Internal compensation",
      "Absence of chiral carbons",
      "Presence of a plane of symmetry"
    ],
    "explanation": "A racemic mixture contains equimolar (50:50) amounts of two enantiomers (dextro and laevo forms). The optical rotation produced by one enantiomer is exactly cancelled by the equal and opposite rotation produced by the other enantiomer. This cancellation occurring between different molecules is called external compensation.",
    "chapter": "Haloalkanes and Haloarenes",
    "chapter_number": 15,
    "correct_answer": 0,
    "needs_image": False
  },
  {
    "id": "chem_ch15_q22",
    "subject": "Chemistry",
    "year": 2015,
    "question": "Which of the following compounds will react fastest with aqueous $\\text{AgNO}_3$?",
    "options": [
      "$\\text{CH}_3\\text{Cl}$",
      "$\\text{CH}_2=\\text{CH}-\\text{Cl}$",
      "$(\\text{CH}_3)_3\\text{C}-\\text{Cl}$",
      "$\\text{C}_6\\text{H}_5\\text{Cl}$"
    ],
    "explanation": "Reaction with aqueous $\\text{AgNO}_3$ proceeds via an $\\text{S}_\\text{N}1$ mechanism involving the loss of $\\text{Cl}^-$ to form a carbocation, which precipitates as $\\text{AgCl}$. Tertiary butyl chloride ($(\\text{CH}_3)_3\\text{C}-\\text{Cl}$) readily forms the highly stable $3^\\circ$ carbocation ($(\\text{CH}_3)_3\\text{C}^+$) and therefore reacts fastest.",
    "chapter": "Haloalkanes and Haloarenes",
    "chapter_number": 15,
    "correct_answer": 2,
    "needs_image": False
  },
  {
    "id": "chem_ch15_q23",
    "subject": "Chemistry",
    "year": 2015,
    "question": "In the reaction of chlorobenzene with methyl chloride in the presence of anhydrous $\\text{AlCl}_3$, the major product is:",
    "options": [
      "$o$-Chlorotoluene",
      "$p$-Chlorotoluene",
      "$m$-Chlorotoluene",
      "Toluene"
    ],
    "explanation": "Chlorine is an ortho-para directing group due to its $+R$ resonance effect. Electrophilic substitution (Friedel-Crafts alkylation) occurs at ortho and para positions. Due to steric hindrance at the ortho position, $p$-chlorotoluene is the major product.",
    "chapter": "Haloalkanes and Haloarenes",
    "chapter_number": 15,
    "correct_answer": 1,
    "needs_image": False
  },
  {
    "id": "chem_ch15_q24",
    "subject": "Chemistry",
    "year": 2016,
    "question": "The IUPAC name of the compound $(\\text{CH}_3)_3\\text{C}-\\text{CH}_2\\text{Br}$ is:",
    "options": [
      "1-Bromo-3-methylbutane",
      "2,2-Dimethyl-1-bromopropane",
      "1-Bromo-2-methylpropane",
      "1-Bromo-2,2-dimethylpropane"
    ],
    "explanation": "Numbering the longest 3-carbon chain starting from the carbon bearing the bromine atom:\n$$\\overset{1}{\\text{C}}\\text{H}_2(\\text{Br})-\\overset{2}{\\text{C}}(\\text{CH}_3)_2-\\overset{3}{\\text{C}}\\text{H}_3$$\n- Position 1 has a bromo group.\n- Position 2 has two methyl groups.\nThus, the IUPAC name is 1-Bromo-2,2-dimethylpropane.",
    "chapter": "Haloalkanes and Haloarenes",
    "chapter_number": 15,
    "correct_answer": 3,
    "needs_image": False
  },
  {
    "id": "chem_ch15_q25",
    "subject": "Chemistry",
    "year": 2016,
    "question": "Which of the following is an allylic halide?",
    "options": [
      "$\\text{CH}_2=\\text{CH}-\\text{Cl}$",
      "$\\text{CH}_2=\\text{CH}-\\text{CH}_2\\text{Cl}$",
      "$\\text{CH}_3-\\text{CH}_2-\\text{Cl}$",
      "$\\text{C}_6\\text{H}_5-\\text{Cl}$"
    ],
    "explanation": "Allylic halides are compounds in which the halogen atom is bonded to an $sp^3$-hybridized carbon atom adjacent to a carbon-carbon double bond (the allylic carbon). $\\text{CH}_2=\\text{CH}-\\text{CH}_2\\text{Cl}$ is allyl chloride (3-chloroprop-1-ene).",
    "chapter": "Haloalkanes and Haloarenes",
    "chapter_number": 15,
    "correct_answer": 1,
    "needs_image": False
  },
  {
    "id": "chem_ch15_q26",
    "subject": "Chemistry",
    "year": 2017,
    "question": "An organic compound $A$ with molecular formula $\\text{C}_4\\text{H}_9\\text{Br}$ on reaction with alcoholic $\\text{KOH}$ gives an alkene $B$. $B$ on ozonolysis gives acetone and formaldehyde. Compound $A$ is:",
    "options": [
      "1-Bromobutane",
      "2-Bromobutane",
      "1-Bromo-2-methylpropane",
      "2-Bromo-2-methylpropane"
    ],
    "explanation": "The ozonolysis products are acetone ($(\\text{CH}_3)_2\\text{C}=\\text{O}$) and formaldehyde ($\text{H}_2\\text{C}=\\text{O}$). Joining these fragments gives the alkene $B$ as 2-methylpropene ($(\\text{CH}_3)_2\\text{C}=\\text{CH}_2$).\nDehydrohalogenation of 2-bromo-2-methylpropane ($(\\text{CH}_3)_3\\text{C}-\\text{Br}$) or 1-bromo-2-methylpropane ($(\\text{CH}_3)_2\\text{CH}-\\text{CH}_2\\text{Br}$) gives 2-methylpropene. Given tertiary halide $3^\\circ$ reactivity with alc. KOH, $A$ is 2-bromo-2-methylpropane.",
    "chapter": "Haloalkanes and Haloarenes",
    "chapter_number": 15,
    "correct_answer": 3,
    "needs_image": False
  },
  {
    "id": "chem_ch15_q27",
    "subject": "Chemistry",
    "year": 2017,
    "question": "In the following reaction sequence, identify the final product $Z$:\n\n![Reaction Scheme](/pyq_images/chemistry/ch15/q27_reaction_scheme.png)\n$$\\text{C}_6\\text{H}_5\\text{NH}_2 \\xrightarrow{\\text{NaNO}_2 + \\text{HCl},\\ 273-278\\text{ K}} X \\xrightarrow{\\text{Cu}_2\\text{Cl}_2 + \\text{HCl}} Y \\xrightarrow{\\text{Na / dry ether}} Z$$",
    "options": [
      "Biphenyl (Diphenyl)",
      "Chlorobenzene",
      "Benzene",
      "Phenol"
    ],
    "explanation": "1. Diazotization of aniline gives benzene diazonium chloride: $X = \\text{C}_6\\text{H}_5\\text{N}_2^+\\text{Cl}^-$.\n2. Sandmeyer reaction of $X$ with $\\text{Cu}_2\\text{Cl}_2/\\text{HCl}$ yields chlorobenzene: $Y = \\text{C}_6\\text{H}_5\\text{Cl}$.\n3. Fittig reaction of chlorobenzene with $\\text{Na}$ in dry ether yields biphenyl (diphenyl): $Z = \\text{C}_6\\text{H}_5-\\text{C}_6\\text{H}_5$.",
    "chapter": "Haloalkanes and Haloarenes",
    "chapter_number": 15,
    "correct_answer": 0,
    "needs_image": True
  },
  {
    "id": "chem_ch15_q28",
    "subject": "Chemistry",
    "year": 2018,
    "question": "Which of the following compounds gives a yellow precipitate on heating with iodine and aqueous $\\text{NaOH}$ (Iodoform test)?",
    "options": [
      "Methanol",
      "1-Propanol",
      "Benzophenone",
      "2-Propanol (or Ethanol)"
    ],
    "explanation": "Compounds containing the $\\text{CH}_3-\\text{CH}(\\text{OH})-$ or $\\text{CH}_3-\\text{C}=\\text{O}$ group answer the haloform (iodoform) test, producing a characteristic yellow precipitate of iodoform ($\\text{CHI}_3$). 2-Propanol contains the $\\text{CH}_3\\text{CH}(\\text{OH})-$ group and oxidizes to acetone, which gives a positive iodoform test.",
    "chapter": "Haloalkanes and Haloarenes",
    "chapter_number": 15,
    "correct_answer": 3,
    "needs_image": False
  },
  {
    "id": "chem_ch15_q29",
    "subject": "Chemistry",
    "year": 2018,
    "question": "The order of reactivity of various alkyl halides towards $\\text{S}_\\text{N}2$ displacement is:",
    "options": [
      "$3^\\circ > 2^\\circ > 1^\\circ > \\text{CH}_3\\text{X}$",
      "$1^\\circ > 2^\\circ > 3^\\circ > \\text{CH}_3\\text{X}$",
      "$3^\\circ > 1^\\circ > 2^\\circ > \\text{CH}_3\\text{X}$",
      "$\\text{CH}_3\\text{X} > 1^\\circ > 2^\\circ > 3^\\circ$"
    ],
    "explanation": "In an $\\text{S}_\\text{N}2$ mechanism, nucleophilic attack occurs from the backside. Bulky alkyl groups create steric hindrance around the transition state, slowing down the reaction. Thus, reactivity follows the order:\n$$\\text{CH}_3\\text{X} > 1^\\circ > 2^\\circ > 3^\\circ$$",
    "chapter": "Haloalkanes and Haloarenes",
    "chapter_number": 15,
    "correct_answer": 3,
    "needs_image": False
  },
  {
    "id": "chem_ch15_q30",
    "subject": "Chemistry",
    "year": 2019,
    "question": "Freon-12 ($\\text{CCl}_2\\text{F}_2$) is manufactured from carbon tetrachloride by:",
    "options": [
      "Finkelstein reaction",
      "Swarts reaction",
      "Wurtz reaction",
      "Sandmeyer reaction"
    ],
    "explanation": "Freon-12 (dichlorodifluoromethane, $\\text{CCl}_2\\text{F}_2$) is synthesized by heating carbon tetrachloride with antimony trifluoride ($\\text{SbF}_3$) in the presence of $\\text{SbCl}_5$ catalyst (Swarts reaction):\n$$3\\text{CCl}_4 + 2\\text{SbF}_3 \\xrightarrow{\\text{SbCl}_5} 3\\text{CCl}_2\\text{F}_2 + 2\\text{SbCl}_3$$",
    "chapter": "Haloalkanes and Haloarenes",
    "chapter_number": 15,
    "correct_answer": 1,
    "needs_image": False
  },
  {
    "id": "chem_ch15_q31",
    "subject": "Chemistry",
    "year": 2019,
    "question": "Which of the following compounds exhibits optical isomerism (enantiomerism)?",
    "options": [
      "2-Methylbutane",
      "2-Chloropropane",
      "1-Chlorobutane",
      "2-Chlorobutane"
    ],
    "explanation": "In 2-chlorobutane ($\\text{CH}_3-\\text{C}^*\\text{H}(\\text{Cl})-\\text{CH}_2\\text{CH}_3$), the C-2 carbon is chiral as it is bonded to four different groups: $-\\text{H}$, $-\\text{Cl}$, $-\\text{CH}_3$, and $-\\text{C}_2\\text{H}_5$. Therefore, it possesses a non-superimposable mirror image and exhibits optical isomerism.",
    "chapter": "Haloalkanes and Haloarenes",
    "chapter_number": 15,
    "correct_answer": 3,
    "needs_image": False
  },
  {
    "id": "chem_ch15_q32",
    "subject": "Chemistry",
    "year": 2020,
    "question": "An organic halide with formula $\\text{C}_5\\text{H}_{11}\\text{Cl}$ gives only one monochloro derivative on further chlorination. The compound is:",
    "options": [
      "2,2-Dimethylpropane",
      "2-Methylbutane",
      "Neopentyl chloride (1-Chloro-2,2-dimethylpropane)",
      "1-Chloropentane"
    ],
    "explanation": "Neopentyl chloride ($(\\text{CH}_3)_3\\text{C}-\\text{CH}_2\\text{Cl}$) has nine equivalent methyl hydrogens and two equivalent methylene hydrogens, giving a highly symmetrical structure that yields minimal isomeric derivatives.",
    "chapter": "Haloalkanes and Haloarenes",
    "chapter_number": 15,
    "correct_answer": 2,
    "needs_image": False
  },
  {
    "id": "chem_ch15_q33",
    "subject": "Chemistry",
    "year": 2020,
    "question": "The conversion of chlorobenzene into phenol by heating with aqueous $\\text{NaOH}$ at $623\\text{ K}$ and $300\\text{ atm}$ followed by acidification is known as:",
    "options": [
      "Dow's process",
      "Raschig process",
      "Kolbe's process",
      "Wurtz-Fittig process"
    ],
    "explanation": "The industrial preparation of phenol from chlorobenzene by treatment with $6-8\\%\\ \\text{NaOH}$ at $623\\text{ K}$ and $300\\text{ atm}$ pressure to form sodium phenoxide, followed by acidification with dilute $\\text{HCl}$, is called Dow's process.",
    "chapter": "Haloalkanes and Haloarenes",
    "chapter_number": 15,
    "correct_answer": 0,
    "needs_image": False
  },
  {
    "id": "chem_ch15_q34",
    "subject": "Chemistry",
    "year": 2020,
    "question": "Alkyl halides react with potassium nitrite ($\\text{KNO}_2$) to give alkyl nitrites because:",
    "options": [
      "$\\text{KNO}_2$ is predominantly ionic and oxygen has a negative charge",
      "$\\text{KNO}_2$ is covalent and nitrogen is free",
      "Nitrite ion is not an ambident nucleophile",
      "$\\text{C}-\\text{N}$ bond is weaker than $\\text{C}-\\text{O}$ bond"
    ],
    "explanation": "$\\text{KNO}_2$ is predominantly ionic: $\\text{K}^+ [\\text{O}-\\text{N}=\\text{O}]^-$. The negative charge resides on the oxygen atom, which acts as the nucleophilic center, leading to the formation of alkyl nitrites ($\\text{R}-\\text{O}-\\text{N}=\\text{O}$). In contrast, covalent $\\text{AgNO}_2$ attacks through nitrogen to yield nitroalkanes ($\\text{R}-\\text{NO}_2$).",
    "chapter": "Haloalkanes and Haloarenes",
    "chapter_number": 15,
    "correct_answer": 0,
    "needs_image": False
  },
  {
    "id": "chem_ch15_q35",
    "subject": "Chemistry",
    "year": 2021,
    "question": "The presence of a nitro group ($-\\text{NO}_2$) at ortho and para positions of chlorobenzene:",
    "options": [
      "Decreases the reactivity towards nucleophilic substitution",
      "Increases the reactivity towards nucleophilic substitution",
      "Deactivates the benzene ring towards all substitutions",
      "Has no effect on reactivity"
    ],
    "explanation": "The strong electron-withdrawing nitro group ($-\\text{I}$ and $-\\text{R}$ effects) stabilizes the negative charge of the intermediate carbanion (Meisenheimer complex) formed during nucleophilic aromatic substitution when present at $o$- and $p$-positions. This significantly increases the reactivity of haloarenes towards nucleophilic substitution.",
    "chapter": "Haloalkanes and Haloarenes",
    "chapter_number": 15,
    "correct_answer": 1,
    "needs_image": False
  },
  {
    "id": "chem_ch15_q36",
    "subject": "Chemistry",
    "year": 2021,
    "question": "Which of the following haloalkanes is most reactive towards aqueous $\\text{KOH}$ via $\\text{S}_\\text{N}1$ pathway?",
    "options": [
      "$2$-Bromo-$2$-methylpropane",
      "$2$-Bromobutane",
      "$1$-Bromobutane",
      "Bromomethane"
    ],
    "explanation": "$2$-Bromo-$2$-methylpropane is a tertiary ($3^\\circ$) alkyl halide. Ionization yields the stable tertiary carbocation ($(\\text{CH}_3)_3\\text{C}^+$), making it the most reactive towards $\\text{S}_\\text{N}1$ solvolysis.",
    "chapter": "Haloalkanes and Haloarenes",
    "chapter_number": 15,
    "correct_answer": 0,
    "needs_image": False
  },
  {
    "id": "chem_ch15_q37",
    "subject": "Chemistry",
    "year": 2021,
    "question": "In the reaction:\n\n![Reaction Scheme](/pyq_images/chemistry/ch15/q37_reaction_scheme.png)\n$$\\text{CH}_3-\\text{CH}_2-\\text{CH}_2-\\text{Br} + \\text{NaI} \\xrightarrow{\\text{dry acetone}} \\text{CH}_3-\\text{CH}_2-\\text{CH}_2-\\text{I} + \\text{NaBr}\\downarrow$$\nThis reaction is classified as:",
    "options": [
      "Finkelstein reaction",
      "Swarts reaction",
      "Wurtz reaction",
      "Corey-House synthesis"
    ],
    "explanation": "The reaction of an alkyl bromide with sodium iodide ($\\text{NaI}$) in dry acetone to form an alkyl iodide is the classic Finkelstein reaction.",
    "chapter": "Haloalkanes and Haloarenes",
    "chapter_number": 15,
    "correct_answer": 0,
    "needs_image": True
  },
  {
    "id": "chem_ch15_q38",
    "subject": "Chemistry",
    "year": 2022,
    "question": "Which among the following has the highest boiling point?",
    "options": [
      "$n$-Butyl chloride",
      "Isobutyl chloride",
      "sec-Butyl chloride",
      "tert-Butyl chloride"
    ],
    "explanation": "For isomeric alkyl halides, as branching increases, the surface area decreases and the molecule becomes more spherical, resulting in weaker van der Waals forces. Therefore, the straight-chain isomer ($n$-butyl chloride) has the largest surface area and the highest boiling point:\n$$n\\text{-Butyl chloride} > \\text{Isobutyl chloride} > \\text{sec-Butyl chloride} > \\text{tert-Butyl chloride}$$",
    "chapter": "Haloalkanes and Haloarenes",
    "chapter_number": 15,
    "correct_answer": 3,
    "needs_image": False
  },
  {
    "id": "chem_ch15_q39",
    "subject": "Chemistry",
    "year": 2022,
    "question": "DDT is prepared by heating chlorobenzene with chloral in the presence of concentrated $\\text{H}_2\\text{SO}_4$. The chemical name of DDT is:",
    "options": [
      "$p,p'$-Dichlorodiphenyltrichloroethane",
      "$o,p'$-Dichlorodiphenyltrichloroethane",
      "$p,p'$-Dichlorodiphenyldichloroethane",
      "$m,p'$-Dichlorodiphenyltrichloroethane"
    ],
    "explanation": "DDT is prepared by condensing chloral ($\\text{CCl}_3\\text{CHO}$) with two molecules of chlorobenzene in the presence of concentrated $\\text{H}_2\\text{SO}_4$. Its chemical name is $2,2$-bis($p$-chlorophenyl)-$1,1,1$-trichloroethane ($p,p'$-dichlorodiphenyltrichloroethane).",
    "chapter": "Haloalkanes and Haloarenes",
    "chapter_number": 15,
    "correct_answer": 0,
    "needs_image": False
  },
  {
    "id": "chem_ch15_q40",
    "subject": "Chemistry",
    "year": 2023,
    "question": "A mixture of an alkyl halide and an aryl halide treated with metallic sodium in dry ether gives an alkylarene. This reaction is called:",
    "options": [
      "Wurtz-Fittig reaction",
      "Fittig reaction",
      "Wurtz reaction",
      "Ullmann reaction"
    ],
    "explanation": "The reaction of an aryl halide and an alkyl halide with sodium metal in dry ether gives an alkylarene and is known as the Wurtz-Fittig reaction:\n$$\\text{C}_6\\text{H}_5\\text{Br} + 2\\text{Na} + \\text{Br}-\\text{CH}_3 \\xrightarrow{\\text{dry ether}} \\text{C}_6\\text{H}_5-\\text{CH}_3 + 2\\text{NaBr}$$",
    "chapter": "Haloalkanes and Haloarenes",
    "chapter_number": 15,
    "correct_answer": 0,
    "needs_image": False
  },
  {
    "id": "chem_ch15_q41",
    "subject": "Chemistry",
    "year": 2023,
    "question": "Which of the following alkyl halides undergoes dehydrohalogenation most readily?",
    "options": [
      "$\\text{R}-\\text{Cl}$",
      "$\\text{R}-\\text{I}$",
      "$\\text{R}-\\text{Br}$",
      "$\\text{R}-\\text{F}$"
    ],
    "explanation": "The rate of dehydrohalogenation depends on the bond dissociation enthalpy and leaving group ability of the halide ion. Since $\\text{I}^-$ is the best leaving group with the lowest $\\text{C}-\\text{I}$ bond energy, alkyl iodides ($\\text{R}-\\text{I}$) undergo dehydrohalogenation most readily:\n$$\\text{R}-\\text{I} > \\text{R}-\\text{Br} > \\text{R}-\\text{Cl} > \\text{R}-\\text{F}$$",
    "chapter": "Haloalkanes and Haloarenes",
    "chapter_number": 15,
    "correct_answer": 1,
    "needs_image": False
  },
  {
    "id": "chem_ch15_q42",
    "subject": "Chemistry",
    "year": 2024,
    "question": "A haloalkane undergoes $\\text{S}_\\text{N}2$ or $\\text{S}_\\text{N}1$ reaction depending on:",
    "options": [
      "Structure of alkyl halide, nature of nucleophile, solvent polarity, and leaving group ability",
      "Low temperature only",
      "Type of halogen atom only",
      "Stability of the haloalkane only"
    ],
    "explanation": "The mechanism followed ($\\text{S}_\\text{N}1$ vs $\\text{S}_\\text{N}2$) depends comprehensively on:\n1. Structure of alkyl halide ($3^\\circ$ favors $\\text{S}_\\text{N}1$, $1^\\circ$ favors $\\text{S}_\\text{N}2$).\n2. Nature and concentration of nucleophile (strong/high conc. favors $\\text{S}_\\text{N}2$).\n3. Polarity of solvent (polar protic favors $\\text{S}_\\text{N}1$, polar aprotic favors $\\text{S}_\\text{N}2$).\n4. Nature of leaving group.",
    "chapter": "Haloalkanes and Haloarenes",
    "chapter_number": 15,
    "correct_answer": 0,
    "needs_image": False
  },
  {
    "id": "chem_ch15_q43",
    "subject": "Chemistry",
    "year": 2024,
    "question": "2-Methylpropane can be prepared by Wurtz reaction. The haloalkanes taken along with metallic sodium and dry ether are:",
    "options": [
      "Chloromethane and 2-chloropropane",
      "Chloroethane and chloromethane",
      "Chloroethane and 1-chloropropane",
      "Chloromethane and 1-chloropropane"
    ],
    "explanation": "2-Methylpropane (isobutane, $(\\text{CH}_3)_2\\text{CH}-\\text{CH}_3$) has an isopropyl group connected to a methyl group. In a cross-Wurtz reaction, coupling chloromethane ($\\text{CH}_3\\text{Cl}$) and 2-chloropropane ($(\\text{CH}_3)_2\\text{CH}-\\text{Cl}$) with sodium gives:\n$$\\text{CH}_3\\text{Cl} + 2\\text{Na} + \\text{Cl}-\\text{CH}(\\text{CH}_3)_2 \\xrightarrow{\\text{dry ether}} \\text{CH}_3-\\text{CH}(\\text{CH}_3)_2 + 2\\text{NaCl}$$",
    "chapter": "Haloalkanes and Haloarenes",
    "chapter_number": 15,
    "correct_answer": 0,
    "needs_image": False
  },
  {
    "id": "chem_ch15_q44",
    "subject": "Chemistry",
    "year": 2024,
    "question": "In the following scheme of reactions:\n\n![Reaction Pathway](/pyq_images/chemistry/ch15/q44_reaction_pathway.png)\n$$\\text{C}_2\\text{H}_5\\text{Cl} \\xrightarrow{X} \\text{C}_2\\text{H}_5\\text{F}$$\n$$\\text{C}_2\\text{H}_5\\text{Cl} \\xrightarrow{Y} \\text{CH}_2=\\text{CH}_2$$\n$$\\text{C}_2\\text{H}_5\\text{Cl} \\xrightarrow{Z} \\text{C}_4\\text{H}_{10}$$\nReagents $X$, $Y$, and $Z$ respectively are:",
    "options": [
      "$\\text{AgF}$, alcoholic $\\text{KOH}$, and benzene",
      "$\\text{HF}$, aqueous $\\text{KOH}$, and $\\text{Na}$ in dry ether",
      "$\\text{AgF}$, alcoholic $\\text{KOH}$, and $\\text{Na}$ in dry ether",
      "$\\text{KF}$, aqueous $\\text{NaOH}$, and $\\text{Mg}$ in ether"
    ],
    "explanation": "1. Swarts reaction for fluorination: $X = \\text{AgF}$.\n2. Dehydrohalogenation to ethylene: $Y = \\text{alcoholic KOH}$.\n3. Wurtz coupling to $n$-butane: $Z = \\text{Na in dry ether}$.\nHence, option (c) is correct.",
    "chapter": "Haloalkanes and Haloarenes",
    "chapter_number": 15,
    "correct_answer": 2,
    "needs_image": True
  },
  {
    "id": "chem_ch15_q45",
    "subject": "Chemistry",
    "year": 2024,
    "question": "The major product formed when chlorobenzene is treated with concentrated $\\text{HNO}_3$ and concentrated $\\text{H}_2\\text{SO}_4$ is:",
    "options": [
      "$m$-Nitrochlorobenzene",
      "$o$-Nitrochlorobenzene",
      "$1,3,5$-Trinitrochlorobenzene",
      "$1$-Chloro-$4$-nitrobenzene ($p$-Nitrochlorobenzene)"
    ],
    "explanation": "Nitration of chlorobenzene with conc. $\\text{HNO}_3$ and conc. $\\text{H}_2\\text{SO}_4$ yields a mixture of ortho and para nitrochlorobenzene. Because chlorine is $o,p$-directing and the para-isomer experiences less steric repulsion, $1$-chloro-$4$-nitrobenzene ($p$-nitrochlorobenzene) is the major product.",
    "chapter": "Haloalkanes and Haloarenes",
    "chapter_number": 15,
    "correct_answer": 3,
    "needs_image": False
  },
  {
    "id": "chem_ch15_q46",
    "subject": "Chemistry",
    "year": 2024,
    "question": "When 2-bromopentane is treated with sodium ethoxide in ethanol, the major alkene obtained is:",
    "options": [
      "Pent-1-ene",
      "Pent-1-yne",
      "cis-Pent-2-ene",
      "trans-Pent-2-ene"
    ],
    "explanation": "Dehydrohalogenation of 2-bromopentane with a small base ($\\text{C}_2\\text{H}_5\\text{O}^-$) gives the Saytzeff product (pent-2-ene) as the major product. Between cis and trans geometrical isomers, trans-pent-2-ene is thermodynamically more stable due to minimized steric hindrance between alkyl substituents across the double bond.",
    "chapter": "Haloalkanes and Haloarenes",
    "chapter_number": 15,
    "correct_answer": 3,
    "needs_image": False
  }
]

out_path = 'src/data/pyq_chemistry_ch15.json'
with open(out_path, 'w', encoding='utf-8') as f:
    json.dump(questions, f, ensure_ascii=False, indent=2)

print(f'Successfully wrote {len(questions)} questions to {out_path}')
