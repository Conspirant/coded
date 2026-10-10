import json

questions = [
  {
    "id": "chem_ch9_q1",
    "subject": "Chemistry",
    "chapter": "Hydrocarbons",
    "chapter_number": 9,
    "year": 2006,
    "question": "Identify the product $Y$ in the following reaction sequence:\n\n![Reaction](/pyq_images/chemistry/ch9/q1.png)",
    "options": [
      "pentane",
      "cyclobutane",
      "cyclopentane",
      "cyclopentanone"
    ],
    "correct_answer": 2,
    "explanation": "Calcium adipate on heating undergoes dry distillation and loses $\\text{CaCO}_3$ to yield cyclopentanone ($X$). Further reduction of cyclopentanone with $\\text{Zn-Hg} / \\text{conc. HCl}$ (Clemmensen reduction) converts the carbonyl $>\\text{C}=\\text{O}$ group to a methylene $-\\text{CH}_2-$ group, giving cyclopentane ($Y$):\n\n![Explanation](/pyq_images/chemistry/ch9/exp_q1.png)",
    "needs_image": True,
    "image_url": "/pyq_images/chemistry/ch9/q1.png"
  },
  {
    "id": "chem_ch9_q2",
    "subject": "Chemistry",
    "chapter": "Hydrocarbons",
    "chapter_number": 9,
    "year": 2006,
    "question": "Which cycloalkane has the lowest heat of combustion per $\\text{CH}_2$ group?",
    "options": [
      "Cyclopropane",
      "Cyclobutane",
      "Cyclopentane",
      "Cyclohexane"
    ],
    "correct_answer": 3,
    "explanation": "Heat of combustion per $-\\text{CH}_2-$ group is a direct measure of ring strain and thermodynamic instability. Cyclohexane exists in a completely strain-free chair conformation (all bond angles are tetrahedral $109.5^\\circ$ and all $\\text{C}-\\text{H}$ bonds are staggered), hence it is the most stable cycloalkane and possesses the lowest heat of combustion per $-\\text{CH}_2-$ group ($658.6\\text{ kJ/mol}$).",
    "needs_image": False
  },
  {
    "id": "chem_ch9_q3",
    "subject": "Chemistry",
    "chapter": "Hydrocarbons",
    "chapter_number": 9,
    "year": 2007,
    "question": "In acetylene molecule, between the carbon atoms there are",
    "options": [
      "three pi bonds",
      "one sigma and two pi bonds",
      "two sigma and one pi bonds",
      "three sigma bonds"
    ],
    "correct_answer": 1,
    "explanation": "In acetylene ($\\text{H}-\\text{C}\\equiv\\text{C}-\\text{H}$), the carbon atoms undergo $sp$ hybridization. Between the two carbon atoms, there is a triple bond consisting of one $\\sigma$ bond (formed by axial overlap of $sp$ hybrid orbitals) and two $\\pi$ bonds (formed by lateral overlap of unhybridized $2p_y$ and $2p_z$ orbitals).",
    "needs_image": False
  },
  {
    "id": "chem_ch9_q4",
    "subject": "Chemistry",
    "chapter": "Hydrocarbons",
    "chapter_number": 9,
    "year": 2007,
    "question": "According to Bayer's strain theory which is highly stable?",
    "options": [
      "Cyclobutane",
      "Cyclopentane",
      "Cycloheptane",
      "Cyclohexane"
    ],
    "correct_answer": 1,
    "explanation": "According to Baeyer's strain theory (which assumed all rings are planar), the angle strain $d$ is given by $d = \\frac{1}{2}(109^\\circ 28' - \\text{ring angle})$. For cyclopentane (ring angle $108^\\circ$), $d = \\frac{1}{2}(109^\\circ 28' - 108^\\circ) = +0^\\circ 44'$, which is the minimum deviation among planar rings. Hence, Baeyer's theory predicts cyclopentane to be the most stable.",
    "needs_image": False
  },
  {
    "id": "chem_ch9_q5",
    "subject": "Chemistry",
    "chapter": "Hydrocarbons",
    "chapter_number": 9,
    "year": 2007,
    "question": "Benzene reacts with chlorine in sunlight to give a final product",
    "options": [
      "$\\text{CCl}_4$",
      "$\\text{C}_6\\text{H}_6\\text{Cl}_6$",
      "$\\text{C}_6\\text{Cl}_6$",
      "$\\text{C}_6\\text{H}_5\\text{Cl}$"
    ],
    "correct_answer": 1,
    "explanation": "In the presence of sunlight ($h\\nu$) and absence of a Lewis acid catalyst, benzene undergoes a free-radical addition reaction with three molecules of chlorine to produce benzene hexachloride (BHC or gammaxene), $\\text{C}_6\\text{H}_6\\text{Cl}_6$:\n$$\\text{C}_6\\text{H}_6 + 3\\text{Cl}_2 \\xrightarrow{h\\nu} \\text{C}_6\\text{H}_6\\text{Cl}_6$$",
    "needs_image": False
  },
  {
    "id": "chem_ch9_q6",
    "subject": "Chemistry",
    "chapter": "Hydrocarbons",
    "chapter_number": 9,
    "year": 2008,
    "question": "The angle strain in cyclobutane is",
    "options": [
      "$19^\\circ 22'$",
      "$9^\\circ 44'$",
      "$24^\\circ 44'$",
      "$29^\\circ 16'$"
    ],
    "correct_answer": 1,
    "explanation": "Angle strain ($d$) in planar cycloalkanes according to Baeyer's strain theory is:\n$$d = \\frac{1}{2}(109^\\circ 28' - \\alpha)$$\nFor cyclobutane, the internal angle of a square is $\\alpha = 90^\\circ$:\n$$d = \\frac{1}{2}(109^\\circ 28' - 90^\\circ) = \\frac{1}{2}(19^\\circ 28') = 9^\\circ 44'$$",
    "needs_image": False
  },
  {
    "id": "chem_ch9_q7",
    "subject": "Chemistry",
    "chapter": "Hydrocarbons",
    "chapter_number": 9,
    "year": 2008,
    "question": "The reagent used to convert an alkyne to alkene is",
    "options": [
      "$\\text{Zn} - \\text{Hg}/\\text{HCl}$",
      "$\\text{Pd}/\\text{H}_2$",
      "$\\text{Zn}/\\text{HCl}$",
      "$\\text{Sn}/\\text{HCl}$"
    ],
    "correct_answer": 1,
    "explanation": "Alkynes are partially hydrogenated to alkenes by catalytic hydrogenation using $\\text{H}_2$ over palladium catalyst (e.g., Lindlar's catalyst $\\text{Pd}/\\text{BaSO}_4$ or $\\text{Pd}/\\text{C}$ poisoned with quinoline/lead acetate):\n$$\\text{HC}\\equiv\\text{CH} \\xrightarrow{\\text{H}_2, \\text{Pd/C}} \\text{CH}_2=\\text{CH}_2$$",
    "needs_image": False
  },
  {
    "id": "chem_ch9_q8",
    "subject": "Chemistry",
    "chapter": "Hydrocarbons",
    "chapter_number": 9,
    "year": 2009,
    "question": "In electrophilic aromatic substitution reaction, the nitro group is meta directing because it",
    "options": [
      "decreases electron density at meta position",
      "increases electron density at meta position",
      "increases electron density at ortho and para positions",
      "decreases electron density at ortho and para positions"
    ],
    "correct_answer": 3,
    "explanation": "The nitro group ($-\\text{NO}_2$) has powerful electron-withdrawing inductive ($-I$) and resonance ($-R$) effects. Resonance structures show positive charges residing at the ortho and para positions of the benzene ring. Consequently, electron density is substantially depleted at the ortho and para positions relative to the meta position, making the meta position comparatively less electron-deficient and thus directing incoming electrophiles to the meta position.",
    "needs_image": False
  },
  {
    "id": "chem_ch9_q9",
    "subject": "Chemistry",
    "chapter": "Hydrocarbons",
    "chapter_number": 9,
    "year": 2009,
    "question": "The electrophile involved in the sulphonation of benzene is",
    "options": [
      "$\\text{SO}_3^{2-}$",
      "$\\text{H}_3\\text{O}^+$",
      "$\\text{SO}_3$",
      "$\\text{SO}_3^+$"
    ],
    "correct_answer": 2,
    "explanation": "In the sulphonation of benzene using concentrated $\\text{H}_2\\text{SO}_4$ or fuming sulfuric acid, self-ionization of sulfuric acid generates neutral sulfur trioxide:\n$$2\\text{H}_2\\text{SO}_4 \\rightleftharpoons \\text{H}_3\\text{O}^+ + \\text{HSO}_4^- + \\text{SO}_3$$\nIn $\\text{SO}_3$, the central sulfur atom is bonded to three electronegative oxygen atoms, giving it a strong partial positive charge $(\\delta+)$, making it an electron-seeking neutral electrophile that attacks the aromatic $\\pi$-cloud.",
    "needs_image": False
  },
  {
    "id": "chem_ch9_q10",
    "subject": "Chemistry",
    "chapter": "Hydrocarbons",
    "chapter_number": 9,
    "year": 2009,
    "question": "The carbon-carbon bond length in benzene is",
    "options": [
      "same as in $\\text{C}_2\\text{H}_4$",
      "in between $\\text{C}_2\\text{H}_6$ and $\\text{C}_2\\text{H}_2$",
      "in between $\\text{C}_2\\text{H}_4$ and $\\text{C}_2\\text{H}_2$",
      "in between $\\text{C}_2\\text{H}_6$ and $\\text{C}_2\\text{H}_4$"
    ],
    "correct_answer": 3,
    "explanation": "Due to resonance and complete delocalisation of $\\operatorname{\\pi}$-electrons in the aromatic benzene ring, all carbon-carbon bonds are equivalent with a bond length of $1.39\\text{ \\AA}$ ($139\\text{ pm}$). This bond length is intermediate between a pure single $\\text{C}-\\text{C}$ bond in ethane ($\\text{C}_2\\text{H}_6$, $1.54\\text{ \\AA}$) and a pure double $\\text{C}=\\text{C}$ bond in ethene ($\\text{C}_2\\text{H}_4$, $1.34\\text{ \\AA}$).",
    "needs_image": False
  },
  {
    "id": "chem_ch9_q11",
    "subject": "Chemistry",
    "chapter": "Hydrocarbons",
    "chapter_number": 9,
    "year": 2010,
    "question": "Which one of the following conformations of cyclohexane is the least stable?",
    "options": [
      "Half-chair",
      "Boat",
      "Twisted-boat",
      "Chair"
    ],
    "correct_answer": 0,
    "explanation": "The order of stability of cyclohexane conformers is:\n$$\\text{Chair} > \\text{Twist-boat} > \\text{Boat} > \\text{Half-chair}$$\nIn the half-chair conformer, five of the six carbon atoms lie in a single plane, causing severe angle strain as well as severe torsional strain from eclipsed $\\text{C}-\\text{H}$ bonds. It has the highest potential energy ($45\\text{ kJ/mol}$ above chair form) and is thus the least stable.",
    "needs_image": False
  },
  {
    "id": "chem_ch9_q12",
    "subject": "Chemistry",
    "chapter": "Hydrocarbons",
    "chapter_number": 9,
    "year": 2011,
    "question": "Which one of the following is the most energetic conformation of cyclohexane?",
    "options": [
      "Boat",
      "Twisted boat",
      "Chair",
      "Half-chair"
    ],
    "correct_answer": 3,
    "explanation": "The relative potential energy sequence of conformations of cyclohexane is:\n$$\\text{Half-chair } (\\sim 45\\text{ kJ/mol}) > \\text{Boat } (\\sim 29\\text{ kJ/mol}) > \\text{Twist-boat } (\\sim 23\\text{ kJ/mol}) > \\text{Chair } (0\\text{ kJ/mol})$$\nTherefore, the half-chair conformation possesses the highest energy (most energetic).",
    "needs_image": False
  },
  {
    "id": "chem_ch9_q13",
    "subject": "Chemistry",
    "chapter": "Hydrocarbons",
    "chapter_number": 9,
    "year": 2011,
    "question": "Ethyl benzene cannot be prepared by",
    "options": [
      "Wurtz reaction",
      "Wurtz-Fittig reaction",
      "Friedel-Crafts reaction",
      "Clemmensen reduction"
    ],
    "correct_answer": 0,
    "explanation": "Wurtz reaction involves the coupling of two alkyl halides with sodium in dry ether to form higher symmetrical alkanes ($2\\text{R}-\\text{X} + 2\\text{Na} \\to \\text{R}-\\text{R} + 2\\text{NaX}$). An alkyl halide and an aryl halide react via the Wurtz-Fittig reaction (not Wurtz reaction). Hence, ethylbenzene cannot be prepared by the Wurtz reaction.",
    "needs_image": False
  },
  {
    "id": "chem_ch9_q14",
    "subject": "Chemistry",
    "chapter": "Hydrocarbons",
    "chapter_number": 9,
    "year": 2011,
    "question": "Which one of the following is an intermediate in the reaction of benzene with $\\text{CH}_3\\text{Cl}$ in the presence of anhydrous $\\text{AlCl}_3$?",
    "options": [
      "$\\text{Cl}^+$",
      "$\\text{CH}_3^-$",
      "$\\text{CH}_3^+$",
      "Arenium ion"
    ],
    "correct_answer": 2,
    "explanation": "In Friedel-Crafts alkylation, anhydrous $\\text{AlCl}_3$ acts as a Lewis acid and abstracts a chloride ion from methyl chloride to generate the methyl carbocation electrophile:\n$$\\text{CH}_3\\text{Cl} + \\text{AlCl}_3 \\to \\text{CH}_3^+ + \\text{AlCl}_4^-$$",
    "needs_image": False
  },
  {
    "id": "chem_ch9_q15",
    "subject": "Chemistry",
    "chapter": "Hydrocarbons",
    "chapter_number": 9,
    "year": 2012,
    "question": "Which one of the following is not formed when a mixture of methyl bromide and bromobenzene is heated with sodium metal in the presence of dry ether?",
    "options": [
      "Ethane",
      "Diphenyl",
      "Propane",
      "Toluene"
    ],
    "correct_answer": 2,
    "explanation": "When methyl bromide ($\\text{CH}_3\\text{Br}$) and bromobenzene ($\\text{C}_6\\text{H}_5\\text{Br}$) react with sodium in dry ether, three cross/self-coupling products are obtained:\n1. Self-coupling of $\\text{CH}_3\\text{Br}$: $\\text{CH}_3-\\text{CH}_3$ (ethane)\n2. Cross-coupling (Wurtz-Fittig): $\\text{C}_6\\text{H}_5-\\text{CH}_3$ (toluene)\n3. Self-coupling of $\\text{C}_6\\text{H}_5\\text{Br}$ (Fittig): $\\text{C}_6\\text{H}_5-\\text{C}_6\\text{H}_5$ (diphenyl / biphenyl)\nPropane cannot be formed in this reaction.",
    "needs_image": False
  },
  {
    "id": "chem_ch9_q16",
    "subject": "Chemistry",
    "chapter": "Hydrocarbons",
    "chapter_number": 9,
    "year": 2013,
    "question": "Conversion of benzene to acetophenone can be brought by",
    "options": [
      "Wurtz reaction",
      "Wurtz-Fittig's reaction",
      "Friedel-Crafts alkylation",
      "Friedel-Crafts acylation"
    ],
    "correct_answer": 3,
    "explanation": "Benzene reacts with acetyl chloride ($\\text{CH}_3\\text{COCl}$) in the presence of anhydrous $\\text{AlCl}_3$ to yield acetophenone via Friedel-Crafts acylation:\n$$\\text{C}_6\\text{H}_6 + \\text{CH}_3\\text{COCl} \\xrightarrow{\\text{Anhyd. } \\text{AlCl}_3} \\text{C}_6\\text{H}_5\\text{COCH}_3 + \\text{HCl}$$\n\n![Explanation](/pyq_images/chemistry/ch9/exp_q16.png)",
    "needs_image": False
  },
  {
    "id": "chem_ch9_q17",
    "subject": "Chemistry",
    "chapter": "Hydrocarbons",
    "chapter_number": 9,
    "year": 2013,
    "question": "Methane can be converted into ethane by the reactions",
    "options": [
      "chlorination followed by the reaction with alcoholic $\\text{KOH}$",
      "chlorination followed by the reaction with aqueous $\\text{KOH}$",
      "chlorination followed by Wurtz reaction",
      "chlorination followed by decarboxylation"
    ],
    "correct_answer": 2,
    "explanation": "Step 1: Methane is monochlorinated under photochemical conditions to yield chloromethane:\n$$\\text{CH}_4 + \\text{Cl}_2 \\xrightarrow{h\\nu} \\text{CH}_3\\text{Cl} + \\text{HCl}$$\nStep 2: Chloromethane is treated with sodium metal in dry ether (Wurtz reaction) to double the carbon chain length and yield ethane:\n$$2\\text{CH}_3\\text{Cl} + 2\\text{Na} \\xrightarrow{\\text{dry ether}} \\text{CH}_3-\\text{CH}_3 + 2\\text{NaCl}$$",
    "needs_image": False
  },
  {
    "id": "chem_ch9_q18",
    "subject": "Chemistry",
    "chapter": "Hydrocarbons",
    "chapter_number": 9,
    "year": 2013,
    "question": "Least energetic conformation of cyclohexane is",
    "options": [
      "chair conformation",
      "boat conformation",
      "cis conformation",
      "E-Z form"
    ],
    "correct_answer": 0,
    "explanation": "The chair conformation of cyclohexane is free of both angle strain (all $\\text{C}-\\text{C}-\\text{C}$ angles are ideal tetrahedral $109.5^\\circ$) and torsional strain (all adjacent $\\text{C}-\\text{H}$ bonds are fully staggered with no eclipsing interactions or flagpole repulsions). Consequently, it has the lowest potential energy (least energetic) and is the most stable conformation.",
    "needs_image": False
  },
  {
    "id": "chem_ch9_q19",
    "subject": "Chemistry",
    "chapter": "Hydrocarbons",
    "chapter_number": 9,
    "year": 2014,
    "question": "The correct statement is",
    "options": [
      "cyclohexadiene and cyclohexene cannot be isolated with ease during controlled hydrogenation of benzene",
      "one mole each of benzene and hydrogen when reacted gives $1/3\\text{ mole}$ of cyclohexane and $2/3\\text{ mole}$ unreacted hydrogen",
      "hydrogenation of benzene to cyclohexane is an endothermic process",
      "it is easier to hydrogenate benzene when compared to cyclohexene"
    ],
    "correct_answer": 0,
    "explanation": "Hydrogenation of the first double bond in benzene requires breaking the high aromatic resonance stabilization energy ($150.5\\text{ kJ/mol}$), making the first addition step the slowest (rate-determining). The resulting non-aromatic intermediates (1,3-cyclohexadiene and cyclohexene) hydrogenate much faster than benzene itself. Therefore, partially hydrogenated products cannot be isolated with ease, and benzene directly gives cyclohexane:\n\n![Explanation](/pyq_images/chemistry/ch9/exp_q19.png)",
    "needs_image": False
  },
  {
    "id": "chem_ch9_q20",
    "subject": "Chemistry",
    "chapter": "Hydrocarbons",
    "chapter_number": 9,
    "year": 2015,
    "question": "Identify 'Q' in the following sequence of reactions:\n\n![Reaction](/pyq_images/chemistry/ch9/q20.png)",
    "options": [
      "1-chloro-1-ethylcyclohexane",
      "1-acetylcyclohex-1-ene",
      "vinylcyclohexane",
      "ethynylcyclohexane"
    ],
    "correct_answer": 3,
    "explanation": "1. Acetylcyclohexane reacts with $\\text{PCl}_5$ to replace the carbonyl oxygen with two chlorine atoms, forming the gem-dichloride 1-(1,1-dichloroethyl)cyclohexane ($P$).\n2. Elimination with excess strong base $\\text{NaNH}_2$ (or alcoholic $\\text{KOH}$ followed by $\\text{NaNH}_2$) causes two successive dehydrohalogenation steps (loss of $2\\text{HCl}$) to yield ethynylcyclohexane ($Q$):\n\n![Explanation](/pyq_images/chemistry/ch9/exp_q20.png)",
    "needs_image": True,
    "image_url": "/pyq_images/chemistry/ch9/q20.png"
  },
  {
    "id": "chem_ch9_q21",
    "subject": "Chemistry",
    "chapter": "Hydrocarbons",
    "chapter_number": 9,
    "year": 2015,
    "question": "Number of possible alkynes with formula $\\text{C}_5\\text{H}_8$ is",
    "options": [
      "3",
      "5",
      "2",
      "4"
    ],
    "correct_answer": 0,
    "explanation": "For molecular formula $\\text{C}_5\\text{H}_8$, three acyclic isomeric alkynes exist:\n1. $\\text{HC}\\equiv\\text{C}-\\text{CH}_2-\\text{CH}_2-\\text{CH}_3$ (pent-1-yne)\n2. $\\text{H}_3\\text{C}-\\text{C}\\equiv\\text{C}-\\text{CH}_2-\\text{CH}_3$ (pent-2-yne)\n3. $\\text{HC}\\equiv\\text{C}-\\text{CH}(\\text{CH}_3)-\\text{CH}_3$ (3-methylbut-1-yne)",
    "needs_image": False
  },
  {
    "id": "chem_ch9_q22",
    "subject": "Chemistry",
    "chapter": "Hydrocarbons",
    "chapter_number": 9,
    "year": 2016,
    "question": "Electrophile that participates in nitration of benzene is",
    "options": [
      "$\\text{NO}^+$",
      "$\\text{NO}_2^+$",
      "$\\text{NO}$",
      "$\\text{NO}_3^-$"
    ],
    "correct_answer": 1,
    "explanation": "In nitration using nitrating mixture (conc. $\\text{HNO}_3 + \\text{conc. } \\text{H}_2\\text{SO}_4$), sulfuric acid protonates nitric acid, which then loses water to produce the active linear electrophile, the nitronium ion ($\\text{NO}_2^+$):\n$$\\text{HNO}_3 + 2\\text{H}_2\\text{SO}_4 \\to \\text{NO}_2^+ + 2\\text{HSO}_4^- + \\text{H}_3\\text{O}^+$$",
    "needs_image": False
  },
  {
    "id": "chem_ch9_q23",
    "subject": "Chemistry",
    "chapter": "Hydrocarbons",
    "chapter_number": 9,
    "year": 2017,
    "question": "Toluene reacts with halogen in presence of iron (III) chloride giving ortho- and para-halo compounds. The reaction is",
    "options": [
      "free radical addition reaction",
      "electrophilic elimination reaction",
      "nucleophilic substitution reaction",
      "electrophilic substitution reaction"
    ],
    "correct_answer": 3,
    "explanation": "Reaction of toluene with halogen in the presence of Lewis acid catalyst $\\text{FeCl}_3$ generates halonium ion electrophiles ($X^+$), which substitute an aromatic proton at the activating ortho and para positions of the toluene ring. This is an electrophilic aromatic substitution (EAS) reaction.",
    "needs_image": False
  },
  {
    "id": "chem_ch9_q24",
    "subject": "Chemistry",
    "chapter": "Hydrocarbons",
    "chapter_number": 9,
    "year": 2017,
    "question": "For the preparation of alkanes, aqueous solution of sodium or potassium salt of carboxylic acid is subjected to",
    "options": [
      "hydrogenation",
      "oxidation",
      "electrolysis",
      "hydrolysis"
    ],
    "correct_answer": 2,
    "explanation": "Electrolysis of an aqueous solution of sodium or potassium salt of a carboxylic acid is known as Kolbe's electrolytic reaction. At the anode, carboxylate anions undergo oxidation followed by decarboxylation and free radical dimerisation to produce alkanes containing twice the number of alkyl carbons:\n$$\\text{At anode: } 2\\text{RCOO}^- - 2e^- \\to 2\\text{RCOO}^\\bullet \\to \\text{R}-\\text{R} + 2\\text{CO}_2$$",
    "needs_image": False
  },
  {
    "id": "chem_ch9_q25",
    "subject": "Chemistry",
    "chapter": "Hydrocarbons",
    "chapter_number": 9,
    "year": 2018,
    "question": "Identify the following compound which exhibits geometrical isomerism.",
    "options": [
      "But-2-ene",
      "But-1-ene",
      "Butane",
      "Iso-butane"
    ],
    "correct_answer": 0,
    "explanation": "Geometrical (cis-trans) isomerism requires restricted rotation around a double bond and two different groups attached to each doubly bonded carbon atom ($ab\\text{C}=\\text{C}ab$). In but-2-ene ($\\text{CH}_3-\\text{CH}=\\text{CH}-\\text{CH}_3$), each $sp^2$ carbon carries a $-\\text{H}$ and a $-\\text{CH}_3$ group, forming *cis*-but-2-ene and *trans*-but-2-ene:\n\n![Explanation](/pyq_images/chemistry/ch9/exp_q25.png)",
    "needs_image": False
  },
  {
    "id": "chem_ch9_q26",
    "subject": "Chemistry",
    "chapter": "Hydrocarbons",
    "chapter_number": 9,
    "year": 2018,
    "question": "The reagent 'X' used for the following reaction is\n$$\\text{R}-\\text{C}\\equiv\\text{C}-\\text{R}' + \\text{H}_2 \\xrightarrow{\\text{X}} \\text{cis-alkene}$$",
    "options": [
      "$\\text{Ni}$",
      "$\\text{Pd/C}$",
      "$\\text{LiAlH}_4$",
      "$\\text{Na/liquid NH}_3$"
    ],
    "correct_answer": 1,
    "explanation": "Selective syn-hydrogenation of internal alkynes to *cis*-alkenes is performed using Lindlar's catalyst, which consists of palladium supported on calcium carbonate or charcoal ($\\text{Pd/C}$) deactivated/poisoned with quinoline or lead acetate.",
    "needs_image": False
  },
  {
    "id": "chem_ch9_q27",
    "subject": "Chemistry",
    "chapter": "Hydrocarbons",
    "chapter_number": 9,
    "year": 2018,
    "question": "$n$-Propyl chloride reacts with sodium metal in dry ether to give",
    "options": [
      "$\\text{CH}_3-\\text{CH}_2-\\text{CH}_2-\\text{CH}_2-\\text{CH}_2-\\text{CH}_3$",
      "$\\text{CH}_3-\\text{CH}_2-\\text{CH}_3$",
      "$\\text{CH}_3-\\text{CH}_2-\\text{CH}_2-\\text{CH}_3$",
      "$\\text{CH}_3-\\text{CH}_2-\\text{CH}_2-\\text{CH}_2-\\text{CH}_2-\\text{CH}_2-\\text{CH}_3$"
    ],
    "correct_answer": 0,
    "explanation": "According to the Wurtz reaction, two molecules of $n$-propyl chloride couple in the presence of sodium in dry ether to give $n$-hexane:\n$$2\\text{CH}_3-\\text{CH}_2-\\text{CH}_2-\\text{Cl} + 2\\text{Na} \\xrightarrow{\\text{dry ether}} \\text{CH}_3-(\\text{CH}_2)_4-\\text{CH}_3 + 2\\text{NaCl}$$",
    "needs_image": False
  },
  {
    "id": "chem_ch9_q28",
    "subject": "Chemistry",
    "chapter": "Hydrocarbons",
    "chapter_number": 9,
    "year": 2019,
    "question": "The alkyl halides required to prepare 2,5-dimethylhexane by Wurtz reaction are\n\n![Reaction](/pyq_images/chemistry/ch9/q28.png)",
    "options": [
      "1-chlorobutane and 1-chloropropane",
      "2-chloropropane and 1-chloropropane",
      "isobutyl chloride (1-chloro-2-methylpropane)",
      "tert-butyl chloride and 1-chloropropane"
    ],
    "correct_answer": 2,
    "explanation": "2,5-Dimethylhexane is a symmetrical alkane: $(\\text{CH}_3)_2\\text{CH}-\\text{CH}_2-\\text{CH}_2-\\text{CH}(\\text{CH}_3)_2$. In the Wurtz reaction, symmetrical alkanes are cleanly obtained in high yield by coupling two molecules of the corresponding single alkyl halide. Treating isobutyl chloride (1-chloro-2-methylpropane) with sodium in dry ether yields 2,5-dimethylhexane:\n$$2(\\text{CH}_3)_2\\text{CH}-\\text{CH}_2\\text{Cl} + 2\\text{Na} \\xrightarrow{\\text{dry ether}} (\\text{CH}_3)_2\\text{CH}-\\text{CH}_2-\\text{CH}_2-\\text{CH}(\\text{CH}_3)_2 + 2\\text{NaCl}$$",
    "needs_image": True,
    "image_url": "/pyq_images/chemistry/ch9/q28.png"
  },
  {
    "id": "chem_ch9_q29",
    "subject": "Chemistry",
    "chapter": "Hydrocarbons",
    "chapter_number": 2019,
    "year": 2019,
    "question": "2-Butyne is reduced to *trans*-but-2-ene using",
    "options": [
      "$\\text{H}_2/\\text{Ni}$",
      "$\\text{Na in liq. NH}_3$",
      "$\\text{H}_2/\\text{Pd}-\\text{C}$",
      "$\\text{Zn in dil. HCl}$"
    ],
    "correct_answer": 1,
    "explanation": "Birch reduction of non-terminal alkynes using sodium or lithium in liquid ammonia at $196-200\\text{ K}$ proceeds via anti-addition of hydrogen to selectively yield *trans*-alkenes:\n\n![Explanation](/pyq_images/chemistry/ch9/exp_q29.png)",
    "needs_image": False
  },
  {
    "id": "chem_ch9_q30",
    "subject": "Chemistry",
    "chapter": "Hydrocarbons",
    "chapter_number": 9,
    "year": 2020,
    "question": "Identify 'X' in the following reaction:\n\n![Reaction](/pyq_images/chemistry/ch9/q30.png)",
    "options": [
      "Hexachlorobenzene",
      "Benzene hexachloride",
      "Chlorobenzene",
      "1,2-Dichlorobenzene"
    ],
    "correct_answer": 0,
    "explanation": "When benzene reacts with excess chlorine in dark and cold conditions in the presence of anhydrous $\\text{AlCl}_3$ catalyst, all six aromatic hydrogens undergo electrophilic aromatic substitution to form hexachlorobenzene ($\\text{C}_6\\text{Cl}_6$) and $6\\text{HCl}$:\n\n![Explanation](/pyq_images/chemistry/ch9/exp_q30.png)",
    "needs_image": True,
    "image_url": "/pyq_images/chemistry/ch9/q30.png"
  },
  {
    "id": "chem_ch9_q31",
    "subject": "Chemistry",
    "chapter": "Hydrocarbons",
    "chapter_number": 9,
    "year": 2021,
    "question": "Arrange benzene, $n$-hexane and ethyne in decreasing order of their acidic behaviour.",
    "options": [
      "$\\text{Benzene} > n\\text{-hexane} > \\text{ethyne}$",
      "$n\\text{-Hexane} > \\text{benzene} > \\text{ethyne}$",
      "$\\text{Ethyne} > n\\text{-hexane} > \\text{benzene}$",
      "$\\text{Ethyne} > \\text{benzene} > n\\text{-hexane}$"
    ],
    "correct_answer": 3,
    "explanation": "Acidity of hydrocarbons depends on the electronegativity and percentage $s$-character of the hybridized carbon bonded to hydrogen:\n- Ethyne ($\\text{HC}\\equiv\\text{CH}$): $sp$ hybridised ($50\\%\\text{ } s$-character, $\\text{p}K_a \\approx 25$)\n- Benzene ($\\text{C}_6\\text{H}_6$): $sp^2$ hybridised ($33.3\\%\\text{ } s$-character, $\\text{p}K_a \\approx 43$)\n- $n$-Hexane: $sp^3$ hybridised ($25\\%\\text{ } s$-character, $\\text{p}K_a \\approx 50$)\nGreater $s$-character stabilizes the conjugate carbanion conjugate base, hence acidity order is:\n$$\\text{Ethyne} > \\text{Benzene} > n\\text{-Hexane}$$",
    "needs_image": False
  },
  {
    "id": "chem_ch9_q32",
    "subject": "Chemistry",
    "chapter": "Hydrocarbons",
    "chapter_number": 9,
    "year": 2021,
    "question": "Peroxide effect is observed with the addition of $\\text{HBr}$ but not with the addition of $\\text{HI}$ to unsymmetrical alkene because",
    "options": [
      "$\\text{H}-\\text{I}$ bond is stronger than $\\text{H}-\\text{Br}$ and is not cleaved by the free radical",
      "$\\text{H}-\\text{I}$ bond is weaker than $\\text{H}-\\text{Br}$ bond so that iodine free radicals combine to form iodine molecules",
      "bond strength of $\\text{HI}$ and $\\text{HBr}$ are same but free radicals are formed in $\\text{HBr}$",
      "all of these"
    ],
    "correct_answer": 1,
    "explanation": "The $\\text{H}-\\text{I}$ bond is relatively weak ($296.8\\text{ kJ/mol}$, compared to $363.7\\text{ kJ/mol}$ for $\\text{H}-\\text{Br}$). Alkoxy radicals can abstract hydrogen to form iodine free radicals ($\\text{I}^\\bullet$), but the addition of $\\text{I}^\\bullet$ to a $\\text{C}=\\text{C}$ double bond is an endothermic process. Instead, iodine free radicals rapidly dimerize to form stable iodine molecules ($2\\text{I}^\\bullet \\to \\text{I}_2$), so the radical chain mechanism fails.",
    "needs_image": False
  },
  {
    "id": "chem_ch9_q33",
    "subject": "Chemistry",
    "chapter": "Hydrocarbons",
    "chapter_number": 9,
    "year": 2022,
    "question": "The major product obtained when ethanol is heated with excess of conc. $\\text{H}_2\\text{SO}_4$ at $443\\text{ K}$ is",
    "options": [
      "ethane",
      "methane",
      "ethene",
      "ethyne"
    ],
    "correct_answer": 2,
    "explanation": "Heating ethanol with excess concentrated $\\text{H}_2\\text{SO}_4$ at $443\\text{ K}$ ($170^\\circ\\text{C}$) causes intramolecular dehydration to yield ethene:\n$$\\text{CH}_3\\text{CH}_2\\text{OH} \\xrightarrow[443\\text{ K}]{\\text{conc. } \\text{H}_2\\text{SO}_4} \\text{CH}_2=\\text{CH}_2 + \\text{H}_2\\text{O}$$\n(At lower temperatures around $413\\text{ K}$, intermolecular dehydration yields diethyl ether instead).",
    "needs_image": False
  },
  {
    "id": "chem_ch9_q34",
    "subject": "Chemistry",
    "chapter": "Hydrocarbons",
    "chapter_number": 9,
    "year": 2022,
    "question": "Identify $A$ and $B$ in the reaction:\n$$\\text{Propene} \\begin{cases} \\xrightarrow{\\text{HBr (benzoyl peroxide)}} A \\text{ (Major product)} \\\\ \\xrightarrow{\\text{HI}} B \\text{ (Major product)} \\end{cases}$$",
    "options": [
      "$A: \\text{CH}_3-\\text{CH}(\\text{Br})-\\text{CH}_3$, $B: \\text{CH}_3-\\text{CH}_2-\\text{CH}_2-\\text{I}$",
      "$A: \\text{CH}_3-\\text{CH}(\\text{Br})-\\text{CH}_3$, $B: \\text{CH}_3-\\text{CH}(\\text{I})-\\text{CH}_3$",
      "$A: \\text{CH}_3-\\text{CH}_2-\\text{CH}_2-\\text{Br}$, $B: \\text{CH}_3-\\text{CH}_2-\\text{CH}_2-\\text{I}$",
      "$A: \\text{CH}_3-\\text{CH}_2-\\text{CH}_2-\\text{Br}$, $B: \\text{CH}_3-\\text{CH}(\\text{I})-\\text{CH}_3$"
    ],
    "correct_answer": 3,
    "explanation": "1. Addition of $\\text{HBr}$ in the presence of benzoyl peroxide follows the Kharasch effect (anti-Markovnikov addition) to yield 1-bromopropane ($A$):\n$$\\text{CH}_3-\\text{CH}=\\text{CH}_2 + \\text{HBr} \\xrightarrow{\\text{Peroxide}} \\text{CH}_3-\\text{CH}_2-\\text{CH}_2\\text{Br}$$\n2. The peroxide effect does not operate with $\\text{HI}$, so addition follows Markovnikov's rule to yield 2-iodopropane ($B$):\n$$\\text{CH}_3-\\text{CH}=\\text{CH}_2 + \\text{HI} \\to \\text{CH}_3-\\text{CH}(\\text{I})-\\text{CH}_3$$",
    "needs_image": False
  },
  {
    "id": "chem_ch9_q35",
    "subject": "Chemistry",
    "chapter": "Hydrocarbons",
    "chapter_number": 9,
    "year": 2023,
    "question": "IUPAC name of the compound is\n\n![Compound](/pyq_images/chemistry/ch9/q35.png)",
    "options": [
      "2, 3-dimethylbut-2-ene",
      "2, 3-dimethylbutyne",
      "1, 1, 2, 2-tetramethylethene",
      "2, 3-dimethylbutene"
    ],
    "correct_answer": 0,
    "explanation": "The longest continuous carbon chain containing the double bond has four carbon atoms (but-2-ene). There are two methyl substituents at positions 2 and 3: $(\\text{CH}_3)_2\\text{C}=\\text{C}(\\text{CH}_3)_2$. Thus, the IUPAC name is 2,3-dimethylbut-2-ene.",
    "needs_image": True,
    "image_url": "/pyq_images/chemistry/ch9/q35.png"
  },
  {
    "id": "chem_ch9_q36",
    "subject": "Chemistry",
    "chapter": "Hydrocarbons",
    "chapter_number": 9,
    "year": 2023,
    "question": "Among the following:\n\n![Aromatic species](/pyq_images/chemistry/ch9/q36.png)\nThe set which represents aromatic species is",
    "options": [
      "I, II and III",
      "III, IV and V",
      "II and III",
      "I, II and IV"
    ],
    "correct_answer": 3,
    "explanation": "According to Hückel's rule, a cyclic planar conjugated system is aromatic if it contains $(4n+2)\\pi$ electrons:\n- I (Benzene): planar, cyclic, fully conjugated with $6\\pi$ electrons ($n=1$) $\\to$ Aromatic\n- II (Naphthalene): planar, bicyclic, fully conjugated with $10\\pi$ electrons ($n=2$) $\\to$ Aromatic\n- III (Cyclobutadiene): $4\\pi$ electrons ($4n, n=1$) $\\to$ Antiaromatic\n- IV (Cyclopentadienyl anion): planar, cyclic with $6\\pi$ electrons ($n=1$) $\\to$ Aromatic\n- V (Cyclooctatetraene): non-planar tub conformation with $8\\pi$ electrons $\\to$ Non-aromatic\nTherefore, I, II, and IV are aromatic species.",
    "needs_image": True,
    "image_url": "/pyq_images/chemistry/ch9/q36.png"
  },
  {
    "id": "chem_ch9_q37",
    "subject": "Chemistry",
    "chapter": "Hydrocarbons",
    "chapter_number": 9,
    "year": 2024,
    "question": "Sodium ethanoate on heating with soda lime gives 'X'. Electrolysis of aqueous solution of sodium ethanoate gives 'Y'. 'X' and 'Y' respectively are",
    "options": [
      "methane and ethane",
      "methane and methane",
      "ethane and methane",
      "ethane and ethane"
    ],
    "correct_answer": 0,
    "explanation": "1. Decarboxylation of sodium ethanoate with soda lime ($\\text{NaOH} + \\text{CaO}$ in $3:1$ ratio) upon heating removes carbon dioxide as sodium carbonate to give methane ($X$):\n$$\\text{CH}_3\\text{COONa} + \\text{NaOH} \\xrightarrow[\\Delta]{\\text{CaO}} \\text{CH}_4 (X) + \\text{Na}_2\\text{CO}_3$$\n2. Kolbe's electrolytic decarboxylation of aqueous sodium ethanoate at the anode yields ethane ($Y$):\n$$2\\text{CH}_3\\text{COONa} + 2\\text{H}_2\\text{O} \\xrightarrow{\\text{Electrolysis}} \\text{CH}_3-\\text{CH}_3 (Y) + 2\\text{CO}_2 + 2\\text{NaOH} + \\text{H}_2$$",
    "needs_image": False
  },
  {
    "id": "chem_ch9_q38",
    "subject": "Chemistry",
    "chapter": "Hydrocarbons",
    "chapter_number": 9,
    "year": 2024,
    "question": "But-1-yne on reaction with dil. $\\text{H}_2\\text{SO}_4$ in presence of $\\text{Hg}^{2+}$ ions at $333\\text{ K}$ gives\n\n![Reaction](/pyq_images/chemistry/ch9/q38.png)",
    "options": [
      "$\\text{CH}_3\\text{CH}_2\\text{COCH}_3$",
      "$\\text{CH}_3\\text{CH}_2\\text{CH}_2\\text{CHO}$",
      "$\\text{CH}_2=\\text{CH}-\\text{COCH}_3$",
      "$\\text{CH}_3\\text{CH}=\\text{CH}-\\text{CHO}$"
    ],
    "correct_answer": 0,
    "explanation": "Hydration of but-1-yne (Kucherov reaction) involves Markovnikov addition of water across the triple bond catalyzed by $\\text{HgSO}_4 / \\text{H}_2\\text{SO}_4$ to form an unstable enol intermediate, which immediately tautomerises to the more stable ketone, butan-2-one:\n$$\\text{CH}_3\\text{CH}_2\\text{C}\\equiv\\text{CH} + \\text{H}_2\\text{O} \\xrightarrow[\\text{H}_2\\text{SO}_4]{\\text{Hg}^{2+}} \\left[\\text{CH}_3\\text{CH}_2\\text{C}(\\text{OH})=\\text{CH}_2\\right] \\xrightarrow{\\text{Tautomerisation}} \\text{CH}_3\\text{CH}_2\\text{COCH}_3$$\n\n![Explanation](/pyq_images/chemistry/ch9/exp_q38.png)",
    "needs_image": True,
    "image_url": "/pyq_images/chemistry/ch9/q38.png"
  }
]

with open('src/data/pyq_chemistry_ch9.json', 'w', encoding='utf-8') as f:
    json.dump(questions, f, indent=2, ensure_ascii=False)

print(f"Successfully generated src/data/pyq_chemistry_ch9.json with {len(questions)} questions.")
