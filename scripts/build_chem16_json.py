import json
import os

questions = [
    {
        "id": "chem_16_01",
        "subject": "Chemistry",
        "chapter": "Alcohols, Phenols and Ethers",
        "chapter_number": 16,
        "year": 2006,
        "question": "The reaction, $\\text{C}_2\\text{H}_5\\text{ONa} + \\text{C}_2\\text{H}_5\\text{I} \\rightarrow \\text{C}_2\\text{H}_5\\text{OC}_2\\text{H}_5 + \\text{NaI}$ is known as",
        "options": [
            "Kolbe's synthesis",
            "Wurtz's synthesis",
            "Williamson's synthesis",
            "Grignard's synthesis"
        ],
        "correct_answer": "Williamson's synthesis",
        "explanation": "**Williamson's synthesis** is an important laboratory method for preparing symmetrical and unsymmetrical ethers by reacting an alkyl halide with a sodium or potassium alkoxide via an $\\text{S}_\\text{N}2$ mechanism:\n$$\\text{R-ONa} + \\text{R'-X} \\xrightarrow{\\Delta} \\text{R-O-R'} + \\text{NaX}$$\nHere, $\\text{C}_2\\text{H}_5\\text{ONa} + \\text{C}_2\\text{H}_5\\text{I} \\rightarrow \\text{C}_2\\text{H}_5-\\text{O}-\\text{C}_2\\text{H}_5 + \\text{NaI}$ yields diethyl ether."
    },
    {
        "id": "chem_16_02",
        "subject": "Chemistry",
        "chapter": "Alcohols, Phenols and Ethers",
        "chapter_number": 16,
        "year": 2006,
        "question": "The catalyst used in the preparation of an alkyl chloride by the action of dry $\\text{HCl}$ on an alcohol is",
        "options": [
            "anhydrous $\\text{AlCl}_3$",
            "$\\text{FeCl}_3$",
            "anhydrous $\\text{ZnCl}_2$",
            "$\\text{Cu}$"
        ],
        "correct_answer": "anhydrous $\\text{ZnCl}_2$",
        "explanation": "In **Groves' process**, primary and secondary alcohols are converted to alkyl chlorides using a mixture of dry $\\text{HCl}$ gas and **anhydrous $\\text{ZnCl}_2$** (Lucas reagent). Anhydrous $\\text{ZnCl}_2$ acts as a Lewis acid catalyst by coordinating with the oxygen atom of the hydroxyl group, thereby weakening the $\\text{C}-\\text{O}$ bond to facilitate nucleophilic attack by chloride ions."
    },
    {
        "id": "chem_16_03",
        "subject": "Chemistry",
        "chapter": "Alcohols, Phenols and Ethers",
        "chapter_number": 16,
        "year": 2006,
        "question": "By heating phenol with chloroform in alkali, it is converted into",
        "options": [
            "salicylic acid",
            "salicylaldehyde",
            "anisole",
            "phenyl benzoate"
        ],
        "correct_answer": "salicylaldehyde",
        "explanation": "Heating phenol with chloroform ($\\text{CHCl}_3$) in the presence of aqueous $\\text{NaOH}$ at $\\sim 60^\\circ\\text{C}$ followed by acid hydrolysis introduces a formyl group ($-\\text{CHO}$) primarily at the ortho-position, forming **salicylaldehyde** (2-hydroxybenzaldehyde). This transformation is the **Reimer-Tiemann reaction**, in which dichlorocarbene ($:\\text{CCl}_2$) acts as the reactive electrophile."
    },
    {
        "id": "chem_16_04",
        "subject": "Chemistry",
        "chapter": "Alcohols, Phenols and Ethers",
        "chapter_number": 16,
        "year": 2007,
        "question": "Denatured alcohol is",
        "options": [
            "ethanol + methanol",
            "rectified spirit + methanol + naphtha",
            "undistilled ethanol",
            "rectified spirit"
        ],
        "correct_answer": "rectified spirit + methanol + naphtha",
        "explanation": "**Denatured alcohol** (or methylated spirit) is ethanol made unfit for human consumption by adding toxic and foul-smelling substances such as **methanol ($\sim 5-10\\%$)**, **pyridine**, and **mineral naphtha/copper sulphate** to commercial rectified spirit ($95.6\\%$ ethanol)."
    },
    {
        "id": "chem_16_05",
        "subject": "Chemistry",
        "chapter": "Alcohols, Phenols and Ethers",
        "chapter_number": 16,
        "year": 2008,
        "question": "Anisole can be prepared by the action of methyl iodide on sodium phenate. The reaction is called",
        "options": [
            "Fittig reaction",
            "Etard reaction",
            "Wurtz reaction",
            "Williamson reaction"
        ],
        "correct_answer": "Williamson reaction",
        "explanation": "The reaction of sodium phenoxide (sodium phenate, $\\text{C}_6\\text{H}_5\\text{O}^-\\text{Na}^+$) with methyl iodide ($\\text{CH}_3\\text{I}$) via an $\\text{S}_\\text{N}2$ nucleophilic substitution yields anisole (methoxybenzene):\n$$\\text{C}_6\\text{H}_5\\text{ONa} + \\text{CH}_3\\text{I} \\rightarrow \\text{C}_6\\text{H}_5\\text{OCH}_3 + \\text{NaI}$$\nThis is an example of **Williamson's ether synthesis**."
    },
    {
        "id": "chem_16_06",
        "subject": "Chemistry",
        "chapter": "Alcohols, Phenols and Ethers",
        "chapter_number": 16,
        "year": 2008,
        "question": "Catalytic dehydrogenation of a primary alcohol gives a",
        "options": [
            "ketone",
            "ester",
            "secondary alcohol",
            "aldehyde"
        ],
        "correct_answer": "aldehyde",
        "explanation": "When vapours of a primary alcohol are passed over heated copper catalyst at $573\\text{ K}$ ($300^\\circ\\text{C}$), catalytic dehydrogenation takes place to produce an **aldehyde**:\n$$\\text{R-CH}_2\\text{OH} \\xrightarrow{\\text{Cu}, 573\\text{ K}} \\text{R-CHO} + \\text{H}_2\\uparrow$$"
    },
    {
        "id": "chem_16_07",
        "subject": "Chemistry",
        "chapter": "Alcohols, Phenols and Ethers",
        "chapter_number": 16,
        "year": 2008,
        "question": "Among the following, which is least acidic?",
        "options": [
            "p-Nitrophenol",
            "p-Chlorophenol",
            "Phenol",
            "o-Cresol"
        ],
        "correct_answer": "o-Cresol",
        "explanation": "1. Electron-withdrawing groups ($-NO_2, -Cl$) stabilize the phenoxide anion via $-I$ and $-M$ effects, increasing acidity ($p\\text{-nitrophenol} > p\\text{-chlorophenol} > \\text{phenol}$).\n2. Electron-donating alkyl groups like methyl ($-CH_3$) exert $+I$ and hyperconjugative electron release, which destabilizes the phenoxide anion and decreases acidity.\n3. Therefore, **o-cresol** is less acidic than phenol and is the **least acidic** among the options."
    },
    {
        "id": "chem_16_08",
        "subject": "Chemistry",
        "chapter": "Alcohols, Phenols and Ethers",
        "chapter_number": 16,
        "year": 2009,
        "question": "The best method for the conversion of an alcohol into an alkyl chloride is by treating the alcohol with",
        "options": [
            "$\\text{PCl}_5$",
            "$\\text{SOCl}_2$ in presence of pyridine",
            "Dry $\\text{HCl}$ in the presence of anhydrous $\\text{ZnCl}_2$",
            "$\\text{PCl}_3$"
        ],
        "correct_answer": "$\\text{SOCl}_2$ in presence of pyridine",
        "explanation": "Treatment of an alcohol with thionyl chloride ($\\text{SOCl}_2$) in the presence of pyridine (**Darzens process**) is the preferred method because both by-products, sulfur dioxide ($\\text{SO}_2$) and hydrogen chloride ($\\text{HCl}$), are gases that escape from the reaction mixture, leaving behind pure alkyl chloride:\n$$\\text{R-OH} + \\text{SOCl}_2 \\xrightarrow{\\text{Pyridine}} \\text{R-Cl} + \\text{SO}_2\\uparrow + \\text{HCl}\\uparrow$$"
    },
    {
        "id": "chem_16_09",
        "subject": "Chemistry",
        "chapter": "Alcohols, Phenols and Ethers",
        "chapter_number": 16,
        "year": 2009,
        "question": "Lucas test is associated with",
        "options": [
            "phenol",
            "carboxylic acid",
            "alcohols",
            "aldehydes"
        ],
        "correct_answer": "alcohols",
        "explanation": "**Lucas test** is used to distinguish between primary ($1^\\circ$), secondary ($2^\\circ$), and tertiary ($3^\\circ$) aliphatic **alcohols** using Lucas reagent (equimolar concentrated $\\text{HCl}$ and anhydrous $\\text{ZnCl}_2$):\n- $3^\\circ$ alcohols produce immediate cloudiness/turbidity.\n- $2^\\circ$ alcohols produce turbidity within 5 minutes.\n- $1^\\circ$ alcohols do not produce turbidity at room temperature."
    },
    {
        "id": "chem_16_10",
        "subject": "Chemistry",
        "chapter": "Alcohols, Phenols and Ethers",
        "chapter_number": 16,
        "year": 2010,
        "question": "An organic compound 'A' with molecular formula $\\text{C}_3\\text{H}_8\\text{O}$ on treatment with heated copper at $573\\text{ K}$ gives 'B'. 'B' does not reduce Fehling's solution but gives positive iodoform test. The compound 'A' is",
        "options": [
            "propan-2-ol",
            "propan-1-ol",
            "ethoxyethane",
            "methoxyethane"
        ],
        "correct_answer": "propan-2-ol",
        "explanation": "1. Compound 'A' has formula $\\text{C}_3\\text{H}_8\\text{O}$. Dehydrogenation with $\\text{Cu}$ at $573\\text{ K}$ gives 'B'.\n2. 'B' does not reduce Fehling's solution, indicating it is a **ketone** (not an aldehyde).\n3. 'B' gives a positive iodoform test, confirming it contains a methyl ketone group ($\text{CH}_3\\text{-CO-}$, i.e., acetone $\\text{CH}_3\\text{COCH}_3$).\n4. Hence, precursor 'A' must be the secondary alcohol **propan-2-ol** ($\\text{CH}_3\\text{CH(OH)}\\text{CH}_3$)."
    },
    {
        "id": "chem_16_11",
        "subject": "Chemistry",
        "chapter": "Alcohols, Phenols and Ethers",
        "chapter_number": 16,
        "year": 2010,
        "question": "Phenol on treatment with 'X' gives 2,4,6-tribromophenol. 'X' is",
        "options": [
            "bromine in benzene",
            "bromine in water",
            "potassium bromide solution",
            "bromine in carbon tetrachloride at $0^\\circ\\text{C}$"
        ],
        "correct_answer": "bromine in water",
        "explanation": "In aqueous medium (**bromine water**), phenol strongly ionizes into phenoxide ion which exceedingly activates the benzene ring towards electrophilic aromatic substitution, causing simultaneous bromination at all ortho and para positions to yield a white precipitate of **2,4,6-tribromophenol**:\n$$\\text{C}_6\\text{H}_5\\text{OH} + 3\\text{Br}_2(\\text{aq}) \\rightarrow 2,4,6\\text{-tribromophenol}\\downarrow + 3\\text{HBr}$$\n(In non-polar solvents like $\\text{CS}_2$ or $\\text{CCl}_4$, only monobromophenol is formed)."
    },
    {
        "id": "chem_16_12",
        "subject": "Chemistry",
        "chapter": "Alcohols, Phenols and Ethers",
        "chapter_number": 16,
        "year": 2010,
        "question": "Reduction of ketones cannot give",
        "options": [
            "an aldehyde",
            "a primary alcohol",
            "a secondary alcohol",
            "a pinacol"
        ],
        "correct_answer": "a primary alcohol",
        "explanation": "Reduction of a ketone ($\\text{R-CO-R'}$) by reducing agents like $\\text{NaBH}_4$, $\\text{LiAlH}_4$, or $\\text{H}_2/\\text{Ni}$ always converts the carbonyl carbon attached to two alkyl groups into a secondary alcohol ($\\text{R-CH(OH)-R'}$). It can never produce a **primary alcohol** (which requires reduction of an aldehyde or ester/carboxylic acid)."
    },
    {
        "id": "chem_16_13",
        "subject": "Chemistry",
        "chapter": "Alcohols, Phenols and Ethers",
        "chapter_number": 16,
        "year": 2011,
        "question": "Identify B and D in the following sequence of reactions:\n$$\\text{CH}_2=\\text{CH}_2 \\xrightarrow[\\Delta]{\\text{conc. }\\text{H}_2\\text{SO}_4} \\text{A} \\xrightarrow{\\text{H}_2\\text{O}/\\Delta} \\text{B} \\xrightarrow{\\text{PBr}_3} \\text{C} \\xrightarrow{\\text{alc. KOH}} \\text{D}$$",
        "options": [
            "Methanol and bromoethane",
            "Ethyl hydrogen sulphate and alcoholic KOH",
            "Ethyl hydrogen sulphate and aqueous KOH",
            "Ethanol and ethene"
        ],
        "correct_answer": "Ethanol and ethene",
        "explanation": "1. Addition of conc. $\\text{H}_2\\text{SO}_4$ across ethene forms ethyl hydrogen sulphate (A):\n$$\\text{CH}_2=\\text{CH}_2 + \\text{H}_2\\text{SO}_4 \\rightarrow \\text{CH}_3\\text{CH}_2\\text{OSO}_3\\text{H}$$\n2. Hydrolysis of A on boiling with water yields **ethanol (B)**:\n$$\\text{CH}_3\\text{CH}_2\\text{OSO}_3\\text{H} + \\text{H}_2\\text{O} \\xrightarrow{\\Delta} \\text{CH}_3\\text{CH}_2\\text{OH} + \\text{H}_2\\text{SO}_4$$\n3. Reaction of ethanol with $\\text{PBr}_3$ gives ethyl bromide (C): $\\text{CH}_3\\text{CH}_2\\text{Br}$.\n4. Dehydrohalogenation of C with alcoholic $\\text{KOH}$ regenerates **ethene (D)**:\n$$\\text{CH}_3\\text{CH}_2\\text{Br} \\xrightarrow{\\text{alc. KOH}} \\text{CH}_2=\\text{CH}_2 + \\text{KBr} + \\text{H}_2\\text{O}$$"
    },
    {
        "id": "chem_16_14",
        "subject": "Chemistry",
        "chapter": "Alcohols, Phenols and Ethers",
        "chapter_number": 16,
        "year": 2011,
        "question": "The compound which gives turbidity immediately with Lucas reagent at room temperature is",
        "options": [
            "butan-1-ol",
            "butan-2-ol",
            "2-methylpropan-2-ol",
            "propan-1-ol"
        ],
        "correct_answer": "2-methylpropan-2-ol",
        "explanation": "Lucas reagent reacts with tertiary ($3^\\circ$) alcohols via an $\\text{S}_\\text{N}1$ pathway through a stable $3^\\circ$ carbocation intermediate, forming insoluble alkyl chloride turbidity **immediately** at room temperature. **2-Methylpropan-2-ol** (tert-butyl alcohol, $(\\text{CH}_3)_3\\text{C-OH}$) is a $3^\\circ$ alcohol, whereas butan-2-ol is $2^\\circ$ (5 min) and butan-1-ol/propan-1-ol are $1^\\circ$ (no reaction at room temperature)."
    },
    {
        "id": "chem_16_15",
        "subject": "Chemistry",
        "chapter": "Alcohols, Phenols and Ethers",
        "chapter_number": 16,
        "year": 2012,
        "question": "Power alcohol is a mixture of",
        "options": [
            "80% Petrol + 20% Ethanol + small quantity of Benzene",
            "80% Petrol + 20% Methanol + small quantity of Benzene",
            "80% Ethanol + 20% Petrol + small quantity of Benzene",
            "80% Methanol + 20% Ethanol + small quantity of Benzene"
        ],
        "correct_answer": "80% Petrol + 20% Ethanol + small quantity of Benzene",
        "explanation": "**Power alcohol** is a blended automotive motor fuel consisting of **$80\\%$ petrol (gasoline)** and **$20\\%$ absolute ethanol**, with a small amount of benzene, ether, or tetralin added as a co-solvent to prevent phase separation."
    },
    {
        "id": "chem_16_16",
        "subject": "Chemistry",
        "chapter": "Alcohols, Phenols and Ethers",
        "chapter_number": 16,
        "year": 2012,
        "question": "In the industrial synthesis of phenol from cumene:\n![Cumene Process Scheme](/pyq_images/chemistry/ch16/q16_scheme.png)\n$$\\text{Benzene} + \\text{CH}_3\\text{-CH}=\\text{CH}_2 \\xrightarrow[\\text{HCl}]{\\text{Anhyd. }\\text{AlCl}_3} \\text{A} \\xrightarrow[130^\\circ\\text{C}]{\\text{O}_2} \\text{B} \\xrightarrow[100^\\circ\\text{C}]{\\text{dil. }\\text{H}_2\\text{SO}_4} \\text{Phenol} + \\text{C}$$\nThe by-product 'C' is",
        "options": [
            "Water",
            "Ethanol",
            "Propanone",
            "Cumene hydroperoxide"
        ],
        "correct_answer": "Propanone",
        "explanation": "1. Friedel-Crafts alkylation of benzene with propene yields cumene (isopropylbenzene, A).\n2. Aerial oxidation of cumene at $130^\\circ\\text{C}$ produces cumene hydroperoxide (B).\n3. Acid-catalyzed cleavage of cumene hydroperoxide with dil. $\\text{H}_2\\text{SO}_4$ gives **phenol** and **propanone (acetone, C)** as an industrially valuable by-product:\n$$\\text{C}_6\\text{H}_5\\text{-CH(CH}_3)_2 \\xrightarrow{\\text{O}_2} \\text{C}_6\\text{H}_5\\text{-C(CH}_3)_2\\text{OOH} \\xrightarrow{\\text{H}^+} \\text{C}_6\\text{H}_5\\text{OH} + \\text{CH}_3\\text{COCH}_3$$"
    },
    {
        "id": "chem_16_17",
        "subject": "Chemistry",
        "chapter": "Alcohols, Phenols and Ethers",
        "chapter_number": 16,
        "year": 2013,
        "question": "Which of the following compounds has the lowest $\\text{p}K_a$ value (most acidic)?",
        "options": [
            "Phenol",
            "o-Cresol",
            "p-Nitrophenol",
            "p-Cresol"
        ],
        "correct_answer": "p-Nitrophenol",
        "explanation": "The acidity of phenols increases with the introduction of electron-withdrawing groups at ortho and para positions due to $-I$ and $-M$ resonance stabilization of the negative charge on the phenoxide ion.\n- **p-Nitrophenol** has a $\\text{p}K_a \\approx 7.1$ (lowest $\\text{p}K_a$, strongest acid).\n- Phenol has $\\text{p}K_a \\approx 10.0$.\n- Cresols have electron-donating methyl groups ($+I$), giving higher $\\text{p}K_a \\approx 10.2-10.3$."
    },
    {
        "id": "chem_16_18",
        "subject": "Chemistry",
        "chapter": "Alcohols, Phenols and Ethers",
        "chapter_number": 16,
        "year": 2014,
        "question": "In the reaction sequence:\n$$\\text{CH}_3\\text{-CH(CH}_3)\\text{-CHO} + \\text{CH}_3\\text{MgBr} \\xrightarrow{\\text{Ether}} \\text{A} \\xrightarrow{\\text{H}_3\\text{O}^+} \\text{B}$$\nThe IUPAC name of 'B' is",
        "options": [
            "3-methylbutan-2-ol",
            "2-methylbutan-3-ol",
            "2-methylbutan-2-ol",
            "pentan-2-ol"
        ],
        "correct_answer": "3-methylbutan-2-ol",
        "explanation": "1. 2-Methylpropanal (isobutyraldehyde, $(\\text{CH}_3)_2\\text{CH-CHO}$) reacts with methyl magnesium bromide ($\\text{CH}_3\\text{MgBr}$):\n$$\\text{(CH}_3)_2\\text{CH-CHO} + \\text{CH}_3\\text{MgBr} \\rightarrow (\\text{CH}_3)_2\\text{CH-CH(OMgBr)-CH}_3$$\n2. Hydrolysis yields $(\\text{CH}_3)_2\\text{CH-CH(OH)-CH}_3$.\n3. Numbering the carbon chain from the end closer to $-\\text{OH}$ gives: $\\text{C}_1\\text{H}_3-\\text{C}_2\\text{H(OH)}-\\text{C}_3\\text{H(CH}_3)-\\text{C}_4\\text{H}_3$, which is **3-methylbutan-2-ol**."
    },
    {
        "id": "chem_16_19",
        "subject": "Chemistry",
        "chapter": "Alcohols, Phenols and Ethers",
        "chapter_number": 16,
        "year": 2014,
        "question": "In the reaction:\n$$\\text{C}_6\\text{H}_5\\text{OH} \\xrightarrow{\\text{C}_6\\text{H}_5\\text{COCl/base}} \\text{X} \\xrightarrow{\\text{Nitration}} \\text{Y (Major product)}$$\n![Options for Y](/pyq_images/chemistry/ch16/q19_options.png)\n'Y' is",
        "options": [
            "4-nitrophenyl benzoate ($\\text{O}_2\\text{N-C}_6\\text{H}_4\\text{-O-CO-C}_6\\text{H}_5$)",
            "phenyl 3-nitrobenzoate ($\\text{C}_6\\text{H}_5\\text{-O-CO-C}_6\\text{H}_4\\text{-NO}_2$)",
            "3-nitrophenyl benzoate",
            "phenyl 4-nitrobenzoate"
        ],
        "correct_answer": "4-nitrophenyl benzoate ($\\text{O}_2\\text{N-C}_6\\text{H}_4\\text{-O-CO-C}_6\\text{H}_5$)",
        "explanation": "1. Schotten-Baumann benzoylation of phenol gives phenyl benzoate ($\\text{C}_6\\text{H}_5\\text{-O-CO-C}_6\\text{H}_5$, X).\n2. Phenyl benzoate contains two benzene rings: the phenolic ring attached to oxygen ($-O-CO-Ph$) and the benzoyl ring ($-CO-Ph$).\n3. The ester oxygen acts as an activating, ortho/para-directing group on the phenolic ring via $+M$ resonance, whereas the carbonyl group on the other ring is deactivating and meta-directing.\n4. Therefore, electrophilic aromatic nitration takes place preferentially at the para-position of the phenolic ring to produce **4-nitrophenyl benzoate**."
    },
    {
        "id": "chem_16_20",
        "subject": "Chemistry",
        "chapter": "Alcohols, Phenols and Ethers",
        "chapter_number": 16,
        "year": 2014,
        "question": "0.44 g of a monohydric alcohol when added to methyl magnesium iodide in ether liberates at S.T.P. $112\\text{ cm}^3$ of methane. With PCC, the same alcohol forms a carbonyl compound that answers silver mirror test. The monohydric alcohol is",
        "options": [
            "$\\text{CH}_3\\text{-CH(OH)-CH}_2\\text{-CH}_3$",
            "$(\\text{CH}_3)_3\\text{C-CH}_2\\text{OH}$",
            "$\\text{CH}_3\\text{-CH(OH)-CH}_2\\text{-CH}_2\\text{-CH}_3$",
            "$(\\text{CH}_3)_2\\text{CH-CH}_2\\text{OH}$"
        ],
        "correct_answer": "(\\text{CH}_3)_3\\text{C-CH}_2\\text{OH}",
        "explanation": "1. Reaction with Grignard reagent: $\\text{R-OH} + \\text{CH}_3\\text{MgI} \\rightarrow \\text{CH}_4\\uparrow + \\text{Mg(OR)I}$.\n2. Moles of $\\text{CH}_4$ liberated at STP $= \\frac{112\\text{ mL}}{22400\\text{ mL/mol}} = 0.005\\text{ mol}$.\n3. Molar mass of alcohol $= \\frac{0.44\\text{ g}}{0.005\\text{ mol}} = 88\\text{ g/mol}$.\n4. For a monohydric saturated alcohol $\\text{C}_n\\text{H}_{2n+1}\\text{OH}$:\n$$14n + 18 = 88 \\implies 14n = 70 \\implies n = 5 \\quad (\\text{C}_5\\text{H}_{12}\\text{O})$$\n5. Since oxidation with PCC gives a carbonyl compound answering the Tollens silver mirror test, it must be an aldehyde, meaning the precursor is a **primary alcohol** ($-\\text{CH}_2\\text{OH}$).\n6. Among the primary pentyl alcohols, **$(\\text{CH}_3)_3\\text{C-CH}_2\\text{OH}$** (2,2-dimethylpropan-1-ol / neopentyl alcohol, MW $= 88$) matches exactly."
    },
    {
        "id": "chem_16_21",
        "subject": "Chemistry",
        "chapter": "Alcohols, Phenols and Ethers",
        "chapter_number": 16,
        "year": 2015,
        "question": "Arrange the following compounds in the increasing order of their acidic strength:\n(i) m-Nitrophenol\n(ii) m-Cresol\n(iii) Phenol\n(iv) m-Chlorophenol",
        "options": [
            "$\\text{(i)} < \\text{(iv)} < \\text{(iii)} < \\text{(ii)}$",
            "$\\text{(ii)} < \\text{(iii)} < \\text{(i)} < \\text{(iv)}$",
            "$\\text{(ii)} < \\text{(iii)} < \\text{(iv)} < \\text{(i)}$",
            "$\\text{(iv)} < \\text{(ii)} < \\text{(iv)} < \\text{(i)}$"
        ],
        "correct_answer": "$\\text{(ii)} < \\text{(iii)} < \\text{(iv)} < \\text{(i)}$",
        "explanation": "1. (ii) **m-Cresol**: Electron-donating methyl group ($+I$) destabilizes phenoxide ion $\\rightarrow$ least acidic.\n2. (iii) **Phenol**: Standard unsubstituted benchmark.\n3. (iv) **m-Chlorophenol**: Chlorine exerts $-I$ inductive electron withdrawal at meta position $\\rightarrow$ increases acidity.\n4. (i) **m-Nitrophenol**: Stronger $-I$ effect of $-NO_2$ group than $-Cl$ $\\rightarrow$ most acidic among these.\nThus, the increasing order is: $\\text{(ii)} < \\text{(iii)} < \\text{(iv)} < \\text{(i)}$."
    },
    {
        "id": "chem_16_22",
        "subject": "Chemistry",
        "chapter": "Alcohols, Phenols and Ethers",
        "chapter_number": 16,
        "year": 2016,
        "question": "In the reaction:\n$$\\text{Ethanol} \\xrightarrow{\\text{PCl}_5} \\text{X} \\xrightarrow{\\text{alc. KOH}} \\text{Y} \\xrightarrow[\\text{Room temp.}]{\\text{H}_2\\text{SO}_4} \\text{Intermediate} \\xrightarrow{\\text{H}_2\\text{O}, \\Delta} \\text{Z}$$\nThe product 'Z' is",
        "options": [
            "$\\text{C}_2\\text{H}_4$",
            "$\\text{CH}_3\\text{CH}_2\\text{OCH}_2\\text{CH}_3$",
            "$\\text{CH}_3\\text{CH}_2\\text{OSO}_3\\text{H}$",
            "$\\text{CH}_3\\text{CH}_2\\text{OH}$"
        ],
        "correct_answer": "$\\text{CH}_3\\text{CH}_2\\text{OH}$",
        "explanation": "1. $\\text{CH}_3\\text{CH}_2\\text{OH} + \\text{PCl}_5 \\rightarrow \\text{CH}_3\\text{CH}_2\\text{Cl} \\text{ (X)}$.\n2. $\\text{CH}_3\\text{CH}_2\\text{Cl} \\xrightarrow{\\text{alc. KOH}} \\text{CH}_2=\\text{CH}_2 \\text{ (Y, ethene)}$.\n3. $\\text{CH}_2=\\text{CH}_2 + \\text{H}_2\\text{SO}_4 \\rightarrow \\text{CH}_3\\text{CH}_2\\text{OSO}_3\\text{H} \\text{ (ethyl hydrogen sulphate)}$.\n4. Hydrolysis with boiling water regenerates **ethanol (Z, $\\text{CH}_3\\text{CH}_2\\text{OH}$)**."
    },
    {
        "id": "chem_16_23",
        "subject": "Chemistry",
        "chapter": "Alcohols, Phenols and Ethers",
        "chapter_number": 16,
        "year": 2016,
        "question": "Which of the following compounds is most acidic?",
        "options": [
            "$\\text{Cl-CH}_2\\text{-CH}_2\\text{-OH}$",
            "$\\text{Cyclohexanol}$",
            "$\\text{Phenol}$",
            "$\\text{4-Nitrophenol}$"
        ],
        "correct_answer": "$\\text{4-Nitrophenol}$",
        "explanation": "Alcohols are far less acidic than phenols because alkoxide ions lack resonance stabilization. Among phenols, **4-nitrophenol** (p-nitrophenol) contains a strong electron-withdrawing nitro group ($-I$ and $-M$ effect) at the para position which extensively delocalizes the negative charge of the phenoxide ion, making it the **most acidic**."
    },
    {
        "id": "chem_16_24",
        "subject": "Chemistry",
        "chapter": "Alcohols, Phenols and Ethers",
        "chapter_number": 16,
        "year": 2016,
        "question": "The reaction which involves dichlorocarbene as an electrophile is",
        "options": [
            "Reimer-Tiemann reaction",
            "Kolbe's reaction",
            "Friedel-Crafts' acylation",
            "Fittig's reaction"
        ],
        "correct_answer": "Reimer-Tiemann reaction",
        "explanation": "In the **Reimer-Tiemann reaction**, base-induced $\\alpha$-elimination of $\\text{HCl}$ from chloroform generates **dichlorocarbene ($:\\text{CCl}_2$)**, an electron-deficient neutral electrophile with a sextet of electrons that attacks the activated phenoxide ring to form salicylaldehyde:\n$$\\text{CHCl}_3 + \\text{OH}^- \\rightleftharpoons :\\text{CCl}_3^- + \\text{H}_2\\text{O} \\rightarrow :\\text{CCl}_2 + \\text{Cl}^-$$"
    },
    {
        "id": "chem_16_25",
        "subject": "Chemistry",
        "chapter": "Alcohols, Phenols and Ethers",
        "chapter_number": 16,
        "year": 2016,
        "question": "Ethanol is converted into ethoxyethane",
        "options": [
            "by heating excess of ethanol with conc. $\\text{H}_2\\text{SO}_4$ at $140^\\circ\\text{C}$ (413 K)",
            "by heating ethanol with excess of conc. $\\text{H}_2\\text{SO}_4$ at 443 K",
            "by treating with conc. $\\text{H}_2\\text{SO}_4$ at room temperature",
            "by treating with conc. $\\text{H}_2\\text{SO}_4$ at 273 K"
        ],
        "correct_answer": "by heating excess of ethanol with conc. $\\text{H}_2\\text{SO}_4$ at $140^\\circ\\text{C}$ (413 K)",
        "explanation": "Intermolecular dehydration of excess ethanol with concentrated $\\text{H}_2\\text{SO}_4$ at **$140^\\circ\\text{C}$ ($413\\text{ K}$)** produces ethoxyethane (diethyl ether) via an $\\text{S}_\\text{N}2$ bimolecular substitution pathway:\n$$2\\text{C}_2\\text{H}_5\\text{OH} \\xrightarrow[413\\text{ K}]{\\text{conc. }\\text{H}_2\\text{SO}_4} \\text{C}_2\\text{H}_5\\text{-O-C}_2\\text{H}_5 + \\text{H}_2\\text{O}$$\n(At a higher temperature of $443\\text{ K}$, intramolecular elimination occurs to produce ethene)."
    },
    {
        "id": "chem_16_26",
        "subject": "Chemistry",
        "chapter": "Alcohols, Phenols and Ethers",
        "chapter_number": 16,
        "year": 2017,
        "question": "Which of the following orders is true regarding the acidic nature of phenol?",
        "options": [
            "$\\text{Phenol} > o\\text{-cresol} > o\\text{-nitrophenol}$",
            "$o\\text{-Cresol} < \\text{phenol} < o\\text{-nitrophenol}$",
            "$\\text{Phenol} < o\\text{-cresol} > o\\text{-nitrophenol}$",
            "$\\text{Phenol} < o\\text{-cresol} < o\\text{-nitrophenol}$"
        ],
        "correct_answer": "$o\\text{-Cresol} < \\text{phenol} < o\\text{-nitrophenol}$",
        "explanation": "- **o-Nitrophenol**: Strong $-I$ and $-M$ electron-withdrawing nitro group stabilizes the phenoxide anion $\\rightarrow$ strongest acid.\n- **Phenol**: Neutral unsubstituted phenol.\n- **o-Cresol**: Electron-donating $+I$ and hyperconjugative methyl group destabilizes the phenoxide anion $\\rightarrow$ weakest acid.\nHence: **$o\\text{-cresol} < \\text{phenol} < o\\text{-nitrophenol}$**."
    },
    {
        "id": "chem_16_27",
        "subject": "Chemistry",
        "chapter": "Alcohols, Phenols and Ethers",
        "chapter_number": 16,
        "year": 2017,
        "question": "Which of the following cannot be used to oxidize primary alcohols to aldehydes?",
        "options": [
            "$\\text{CrO}_3$ in anhydrous medium",
            "Pyridinium chlorochromate (PCC)",
            "$\\text{KMnO}_4$ in acidic medium",
            "Heating in presence of $\\text{Cu}$ at 573 K"
        ],
        "correct_answer": "$\\text{KMnO}_4$ in acidic medium",
        "explanation": "**$\\text{KMnO}_4$ in acidic medium** is a powerful oxidizing agent that directly oxidizes primary alcohols past the aldehyde stage all the way to **carboxylic acids**. Mild reagents such as PCC, Collins reagent ($\\text{CrO}_3$ in anhydrous medium), and catalytic dehydrogenation with $\\text{Cu}$ at $573\\text{ K}$ selectively stop oxidation at the **aldehyde** stage."
    },
    {
        "id": "chem_16_28",
        "subject": "Chemistry",
        "chapter": "Alcohols, Phenols and Ethers",
        "chapter_number": 16,
        "year": 2017,
        "question": "The products formed during the following reaction are:\n$$(\\text{CH}_3)_3\\text{C-O-CH}_3 + \\text{HI} \\rightarrow \\text{?}$$",
        "options": [
            "$\\text{CH}_3\\text{OH} + (\\text{CH}_3)_3\\text{C-I}$",
            "$\\text{CH}_4 + (\\text{CH}_3)_3\\text{C-OI}$",
            "$\\text{CH}_3\\text{I} + (\\text{CH}_3)_3\\text{C-OH}$",
            "$\\text{CH}_3\\text{OI} + (\\text{CH}_3)_3\\text{C-H}$"
        ],
        "correct_answer": "$\\text{CH}_3\\text{OH} + (\\text{CH}_3)_3\\text{C-I}$",
        "explanation": "In the cleavage of an ether where one of the alkyl groups is tertiary (tert-butyl methyl ether), protonation of ether oxygen is followed by departure of methanol ($\\text{CH}_3\\text{OH}$) via an $\\text{S}_\\text{N}1$ mechanism to generate a highly stable tertiary carbocation ($(\\text{CH}_3)_3\\text{C}^+$). Nucleophilic attack by iodide ion ($\text{I}^-$) on this carbocation forms **tert-butyl iodide** and **methanol**:\n$$(\\text{CH}_3)_3\\text{C-O-CH}_3 + \\text{HI} \\rightarrow (\\text{CH}_3)_3\\text{C-I} + \\text{CH}_3\\text{OH}$$"
    },
    {
        "id": "chem_16_29",
        "subject": "Chemistry",
        "chapter": "Alcohols, Phenols and Ethers",
        "chapter_number": 16,
        "year": 2018,
        "question": "Phenol can be distinguished from ethanol by the reagent",
        "options": [
            "bromine water",
            "sodium metal",
            "iron metal",
            "chlorine water"
        ],
        "correct_answer": "bromine water",
        "explanation": "Phenol reacts with **bromine water** to give an immediate white precipitate of 2,4,6-tribromophenol, whereas ethanol does not give any precipitate with bromine water. Both react with sodium metal to evolve $\\text{H}_2$ gas, so sodium metal cannot distinguish between them."
    },
    {
        "id": "chem_16_30",
        "subject": "Chemistry",
        "chapter": "Alcohols, Phenols and Ethers",
        "chapter_number": 16,
        "year": 2018,
        "question": "When the vapours of tertiary butyl alcohol are passed through heated copper at 573 K, the product formed is",
        "options": [
            "but-2-ene",
            "2-butanone",
            "2-methylpropene",
            "butan-2-ol"
        ],
        "correct_answer": "2-methylpropene",
        "explanation": "Tertiary alcohols do not possess an $\\alpha$-hydrogen for dehydrogenation; instead, when passed over heated copper catalyst at $573\\text{ K}$, tertiary butyl alcohol undergoes **dehydration** to yield an alkene, **2-methylpropene (isobutylene)**:\n$$(\\text{CH}_3)_3\\text{C-OH} \\xrightarrow{\\text{Cu}, 573\\text{ K}} (\\text{CH}_3)_2\\text{C}=\\text{CH}_2 + \\text{H}_2\\text{O}$$"
    },
    {
        "id": "chem_16_31",
        "subject": "Chemistry",
        "chapter": "Alcohols, Phenols and Ethers",
        "chapter_number": 16,
        "year": 2018,
        "question": "Arrange the following in the increasing order of acidic strength:\n(i) p-methoxyphenol\n(ii) p-methylphenol\n(iii) p-nitrophenol",
        "options": [
            "$\\text{(ii)} < \\text{(iii)} < \\text{(i)}$",
            "$\\text{(ii)} < \\text{(i)} < \\text{(iii)}$",
            "$\\text{(i)} < \\text{(ii)} < \\text{(iii)}$",
            "$\\text{(i)} < \\text{(iii)} < \\text{(ii)}$"
        ],
        "correct_answer": "$\\text{(i)} < \\text{(ii)} < \\text{(iii)}$",
        "explanation": "1. (i) **p-Methoxyphenol**: The $-\\text{OCH}_3$ group is strongly electron-donating by $+M$ resonance, destabilizing the phenoxide anion $\\rightarrow$ least acidic.\n2. (ii) **p-Methylphenol**: The $-\\text{CH}_3$ group is mildly electron-donating by $+I$ and hyperconjugation $\\rightarrow$ intermediate acidity.\n3. (iii) **p-Nitrophenol**: The $-\\text{NO}_2$ group is strongly electron-withdrawing by $-I$ and $-M$ resonance $\\rightarrow$ most acidic.\nThus, the increasing order is: $\\text{(i)} < \\text{(ii)} < \\text{(iii)}$."
    },
    {
        "id": "chem_16_32",
        "subject": "Chemistry",
        "chapter": "Alcohols, Phenols and Ethers",
        "chapter_number": 16,
        "year": 2018,
        "question": "In the reaction sequence:\n![Reaction Scheme](/pyq_images/chemistry/ch16/q32_scheme.png)\n$$\\text{C}_6\\text{H}_6 + \\text{H}_3\\text{C-CH}=\\text{CH}_2 \\xrightarrow[\\text{heat}]{\\text{AlCl}_3/\\text{ether}} \\text{X} \\xrightarrow[130^\\circ\\text{C}]{\\text{O}_2} \\text{Y} \\xrightarrow[\\text{heat}]{\\text{H}^+/\\text{H}_2\\text{O}} \\text{Phenol} + \\text{Z}$$\n'X' and 'Z' in the above sequence are",
        "options": [
            "iso-propyl benzene and acetone",
            "cumene peroxide and acetone",
            "cumene and acetaldehyde",
            "phenol and acetone"
        ],
        "correct_answer": "iso-propyl benzene and acetone",
        "explanation": "1. Alkylation of benzene with propene in the presence of anhydrous $\\text{AlCl}_3$ gives isopropylbenzene (**cumene, X**).\n2. Oxidation of cumene gives cumene hydroperoxide (Y).\n3. Acid hydrolysis converts Y into phenol and propanone (**acetone, Z**)."
    },
    {
        "id": "chem_16_33",
        "subject": "Chemistry",
        "chapter": "Alcohols, Phenols and Ethers",
        "chapter_number": 16,
        "year": 2019,
        "question": "Match the following acids with their corresponding $\\text{p}K_a$ values:\n$$\\begin{array}{|l|l|}\\hline\\textbf{Acid} & \\textbf{p}K_a \\\\\\hline\\text{A. Phenol} & \\text{i. } 16 \\\\\\text{B. p-Nitrophenol} & \\text{ii. } 0.78 \\\\\\text{C. Ethanol} & \\text{iii. } 10 \\\\\\text{D. Picric acid} & \\text{iv. } 7.1 \\\\\\hline\\end{array}$$\nChoose the correct match:",
        "options": [
            "A-iii, B-iv, C-i, D-ii",
            "A-i, B-iv, C-iii, D-ii",
            "A-iii, B-i, C-iv, D-ii",
            "A-iv, B-iii, C-i, D-ii"
        ],
        "correct_answer": "A-iii, B-iv, C-i, D-ii",
        "explanation": "A lower $\\text{p}K_a$ corresponds to higher acidity:\n- **Picric acid** (2,4,6-trinitrophenol) has three strong electron-withdrawing $-NO_2$ groups $\\rightarrow \\text{p}K_a = 0.78$ (D $\\rightarrow$ ii).\n- **p-Nitrophenol** has one $-NO_2$ group $\\rightarrow \\text{p}K_a = 7.1$ (B $\\rightarrow$ iv).\n- **Phenol** has standard phenolic acidity $\\rightarrow \\text{p}K_a = 10.0$ (A $\\rightarrow$ iii).\n- **Ethanol** is an aliphatic alcohol $\\rightarrow \\text{p}K_a = 16.0$ (C $\\rightarrow$ i).\nCorrect matching: **A-iii, B-iv, C-i, D-ii**."
    },
    {
        "id": "chem_16_34",
        "subject": "Chemistry",
        "chapter": "Alcohols, Phenols and Ethers",
        "chapter_number": 16,
        "year": 2019,
        "question": "Which of the following can be used to test the acidic nature of ethanol?",
        "options": [
            "Blue litmus solution",
            "$\\text{Na}_2\\text{CO}_3$",
            "$\\text{NaHCO}_3$",
            "$\\text{Na metal}$"
        ],
        "correct_answer": "$\\text{Na metal}$",
        "explanation": "Ethanol is a very weak acid (weaker than water, $\\text{p}K_a \\approx 16$) and does not turn blue litmus red nor does it decompose $\\text{Na}_2\\text{CO}_3$ or $\\text{NaHCO}_3$. However, it reacts with active **sodium metal** ($\\text{Na}$) to release effervescence of hydrogen gas, proving its weakly acidic nature:\n$$2\\text{C}_2\\text{H}_5\\text{OH} + 2\\text{Na} \\rightarrow 2\\text{C}_2\\text{H}_5\\text{ONa} + \\text{H}_2\\uparrow$$"
    },
    {
        "id": "chem_16_35",
        "subject": "Chemistry",
        "chapter": "Alcohols, Phenols and Ethers",
        "chapter_number": 16,
        "year": 2020,
        "question": "The steps involved in the conversion of propan-2-ol to propan-1-ol are in the order",
        "options": [
            "heating with $\\text{PCl}_5$, heating with alc. $\\text{KOH}$, acid catalysed addition of water",
            "heating with $\\text{PCl}_5$, heating with alc. $\\text{KOH}$, hydroboration oxidation",
            "dehydration, addition of $\\text{HBr}$ in presence of peroxide, heating with alc. $\\text{KOH}$",
            "dehydration, addition of $\\text{HBr}$ in presence of peroxide, boiling with aq. $\\text{KOH}$"
        ],
        "correct_answer": "dehydration, addition of $\\text{HBr}$ in presence of peroxide, boiling with aq. $\\text{KOH}$",
        "explanation": "1. **Dehydration**: Propan-2-ol is heated with conc. $\\text{H}_2\\text{SO}_4$ at $443\\text{ K}$ to yield propene ($\\text{CH}_3\\text{CH}=\\text{CH}_2$).\n2. **Anti-Markovnikov addition**: Propene is treated with $\\text{HBr}$ in the presence of organic peroxide (Kharasch effect) to form 1-bromopropane ($\\text{CH}_3\\text{CH}_2\\text{CH}_2\\text{Br}$).\n3. **Hydrolysis**: 1-Bromopropane is boiled with **aqueous $\\text{KOH}$** to undergo nucleophilic substitution yielding **propan-1-ol** ($\\text{CH}_3\\text{CH}_2\\text{CH}_2\\text{OH}$)."
    },
    {
        "id": "chem_16_36",
        "subject": "Chemistry",
        "chapter": "Alcohols, Phenols and Ethers",
        "chapter_number": 16,
        "year": 2020,
        "question": "Which of the following reaction combinations gives ether as the major product?\n$$\\text{P: } (\\text{CH}_3)_3\\text{C-Br} + \\text{CH}_3\\text{ONa}$$\n$$\\text{Q: } \\text{CH}_3\\text{Br} + (\\text{CH}_3)_3\\text{C-ONa}$$\n$$\\text{R: } \\text{C}_6\\text{H}_5\\text{-Br} + \\text{CH}_3\\text{ONa}$$\n$$\\text{S: } \\text{C}_6\\text{H}_5\\text{-ONa} + \\text{CH}_3\\text{Br}$$",
        "options": [
            "Both P and R",
            "Both Q and S",
            "Both P and Q",
            "Both R and S"
        ],
        "correct_answer": "Both Q and S",
        "explanation": "In Williamson ether synthesis via $\\text{S}_\\text{N}2$ substitution:\n- **P**: A $3^\\circ$ alkyl halide with a strong alkoxide base undergoes rapid **E2 elimination** to yield 2-methylpropene (alkene), not ether.\n- **Q**: A primary alkyl halide ($\\text{CH}_3\\text{Br}$) with sodium tert-butoxide gives tert-butyl methyl ether as the **major product** via $\\text{S}_\\text{N}2$.\n- **R**: Aryl halides ($\\text{C}_6\\text{H}_5\\text{Br}$) do not undergo nucleophilic substitution under standard conditions due to partial double-bond character of $\\text{C}-\\text{Br}$.\n- **S**: Sodium phenoxide with $\\text{CH}_3\\text{Br}$ smoothly gives anisole (ether) as the **major product**.\nTherefore, **Both Q and S** produce ethers as major products."
    },
    {
        "id": "chem_16_37",
        "subject": "Chemistry",
        "chapter": "Alcohols, Phenols and Ethers",
        "chapter_number": 16,
        "year": 2021,
        "question": "Nitration of 3-methylphenol (m-cresol) with dilute $\\text{HNO}_3$ gives:\n![Options for 3-Methylphenol Nitration](/pyq_images/chemistry/ch16/q37_options.png)",
        "options": [
            "4-nitro-3-methylphenol and 6-nitro-3-methylphenol (ortho/para to -OH)",
            "3-methyl-5-nitrophenol",
            "2,4,6-trinitro-3-methylphenol",
            "3-methyl-2-nitrophenol only"
        ],
        "correct_answer": "4-nitro-3-methylphenol and 6-nitro-3-methylphenol (ortho/para to -OH)",
        "explanation": "In 3-methylphenol (m-cresol), the phenolic $-\\text{OH}$ group has a much stronger activating ($+M$) directing effect than the methyl group ($+I$). Electrophilic nitration directed by $-\\text{OH}$ occurs predominantly at the ortho (position 6 or 2) and para (position 4) positions relative to the $-\\text{OH}$ group to yield a mixture of 4-nitro-3-methylphenol and 6-nitro-3-methylphenol."
    },
    {
        "id": "chem_16_38",
        "subject": "Chemistry",
        "chapter": "Alcohols, Phenols and Ethers",
        "chapter_number": 16,
        "year": 2021,
        "question": "In the reaction sequence:\n$$\\text{CH}_3\\text{CHO} \\xrightarrow[\\text{(ii) }\\text{H}_3\\text{O}^+]{\\text{(i) }\\text{CH}_3\\text{MgBr}} \\text{A} \\xrightarrow{\\text{conc. }\\text{H}_2\\text{SO}_4, \\Delta} \\text{B} \\xrightarrow[\\text{(ii) }\\text{H}_2\\text{O}_2, \\text{OH}^-]{\\text{(i) }\\text{B}_2\\text{H}_6} \\text{C}$$\n'A' and 'C' are",
        "options": [
            "identical",
            "position isomers",
            "functional isomers",
            "optical isomers"
        ],
        "correct_answer": "position isomers",
        "explanation": "1. Nucleophilic addition of $\\text{CH}_3\\text{MgBr}$ to acetaldehyde ($\\text{CH}_3\\text{CHO}$) followed by acid workup yields **propan-2-ol (A)**: $\\text{CH}_3\\text{-CH(OH)-CH}_3$.\n2. Acid-catalyzed dehydration of propan-2-ol gives propene (B): $\\text{CH}_3\\text{-CH}=\\text{CH}_2$.\n3. Hydroboration-oxidation of propene involves anti-Markovnikov hydration to give **propan-1-ol (C)**: $\\text{CH}_3\\text{CH}_2\\text{CH}_2\\text{OH}$.\n4. Propan-2-ol and propan-1-ol share the same carbon skeleton and molecular formula ($\\text{C}_3\\text{H}_8\\text{O}$) but differ in the position of the $-\\text{OH}$ group; hence, they are **position isomers**."
    },
    {
        "id": "chem_16_39",
        "subject": "Chemistry",
        "chapter": "Alcohols, Phenols and Ethers",
        "chapter_number": 16,
        "year": 2022,
        "question": "An organic compound with molecular formula $\\text{C}_7\\text{H}_8\\text{O}$ dissolves in $\\text{NaOH}$ and gives a characteristic colour with $\\text{FeCl}_3$. On treatment with bromine water, it gives a tribromo derivative $\\text{C}_7\\text{H}_5\\text{OBr}_3$. The compound is",
        "options": [
            "m-cresol",
            "p-cresol",
            "benzyl alcohol",
            "o-cresol"
        ],
        "correct_answer": "m-cresol",
        "explanation": "1. Solubility in $\\text{NaOH}$ and violet/colour reaction with neutral $\\text{FeCl}_3$ confirms the presence of a phenolic $-\\text{OH}$ group (rules out benzyl alcohol).\n2. Formula $\\text{C}_7\\text{H}_8\\text{O}$ indicates a cresol (methylphenol).\n3. In **m-cresol** (3-methylphenol), all three positions 2, 4, and 6 are ortho and para to the activating $-\\text{OH}$ group and are vacant; hence, it undergoes tribromination to give 2,4,6-tribromo-3-methylphenol ($\\text{C}_7\\text{H}_5\\text{OBr}_3$).\n4. (In o-cresol and p-cresol, one of the ortho or para positions is blocked by the methyl group, so they can only form dibromo derivatives)."
    },
    {
        "id": "chem_16_40",
        "subject": "Chemistry",
        "chapter": "Alcohols, Phenols and Ethers",
        "chapter_number": 16,
        "year": 2022,
        "question": "Among the following, the products formed by the reaction of anisole with $\\text{HI}$ are",
        "options": [
            "benzene + methanol",
            "phenol + methane",
            "phenol + iodomethane",
            "sodium phenate + methanol"
        ],
        "correct_answer": "phenol + iodomethane",
        "explanation": "In anisole ($\\text{C}_6\\text{H}_5\\text{-O-CH}_3$), the phenyl oxygen bond ($s p^2\\,\\text{C}-\\text{O}$) has partial double bond character due to resonance with the benzene ring and is much stronger and shorter than the alkyl oxygen bond ($s p^3\\,\\text{C}-\\text{O}$). Therefore, protonation by $\\text{HI}$ is followed by $\\text{I}^-$ nucleophilic attack on the smaller methyl group via an $\\text{S}_\\text{N}2$ mechanism, yielding **phenol** and **iodomethane ($\\text{CH}_3\\text{I}$)**:\n$$\\text{C}_6\\text{H}_5\\text{OCH}_3 + \\text{HI} \\xrightarrow{\\Delta} \\text{C}_6\\text{H}_5\\text{OH} + \\text{CH}_3\\text{I}$$"
    },
    {
        "id": "chem_16_41",
        "subject": "Chemistry",
        "chapter": "Alcohols, Phenols and Ethers",
        "chapter_number": 16,
        "year": 2022,
        "question": "In Kolbe's reaction for the synthesis of salicylic acid, the starting reactants are",
        "options": [
            "sodium phenate and $\\text{CCl}_4$",
            "phenol and $\\text{CHCl}_3$",
            "sodium phenate and $\\text{CO}_2$",
            "phenol and $\\text{CCl}_4$"
        ],
        "correct_answer": "sodium phenate and $\\text{CO}_2$",
        "explanation": "In **Kolbe's reaction** (Kolbe-Schmitt reaction), sodium phenoxide (sodium phenate, $\\text{C}_6\\text{H}_5\\text{ONa}$) is heated with carbon dioxide ($\\text{CO}_2$) at $400\\text{ K}$ ($125-140^\\circ\\text{C}$) under $4-7\\text{ atm}$ pressure, followed by acidification to produce 2-hydroxybenzoic acid (**salicylic acid**)."
    },
    {
        "id": "chem_16_42",
        "subject": "Chemistry",
        "chapter": "Alcohols, Phenols and Ethers",
        "chapter_number": 16,
        "year": 2022,
        "question": "Which of the following is most viscous?",
        "options": [
            "Ethylene glycol",
            "Glycerol",
            "Methanol",
            "Ethanol"
        ],
        "correct_answer": "Glycerol",
        "explanation": "Viscosity of alcohols is directly related to the extent and strength of intermolecular hydrogen bonding. **Glycerol** (propane-1,2,3-triol) possesses three $-\\text{OH}$ groups per molecule, leading to a highly dense, extensive three-dimensional intermolecular hydrogen-bonded network, making it significantly **more viscous** than monohydric alcohols (methanol, ethanol) and dihydric glycol."
    },
    {
        "id": "chem_16_43",
        "subject": "Chemistry",
        "chapter": "Alcohols, Phenols and Ethers",
        "chapter_number": 16,
        "year": 2023,
        "question": "The most suitable reagent for the conversion of a primary alcohol into an aldehyde is",
        "options": [
            "PCC (Pyridinium chlorochromate)",
            "alkaline $\\text{KMnO}_4$",
            "acidified $\\text{K}_2\\text{Cr}_2\\text{O}_7$",
            "$\\text{CrO}_3 / \\text{H}_2\\text{SO}_4$"
        ],
        "correct_answer": "PCC (Pyridinium chlorochromate)",
        "explanation": "**Pyridinium chlorochromate (PCC)** (Corey's reagent) dissolved in dichloromethane ($\\text{CH}_2\\text{Cl}_2$) is a mild and selective oxidizing agent that oxidizes primary alcohols specifically to **aldehydes** without causing over-oxidation to carboxylic acids."
    },
    {
        "id": "chem_16_44",
        "subject": "Chemistry",
        "chapter": "Alcohols, Phenols and Ethers",
        "chapter_number": 16,
        "year": 2023,
        "question": "The heating of phenyl methyl ether with $\\text{HI}$ produces an aromatic compound A which on treatment with concentrated $\\text{HNO}_3$ gives B. A and B respectively are",
        "options": [
            "methanol, ethanoic acid",
            "picric acid, phenol",
            "iodobenzene, 1-iodo-4-nitrobenzene",
            "phenol, picric acid"
        ],
        "correct_answer": "phenol, picric acid",
        "explanation": "1. Heating phenyl methyl ether (anisole, $\\text{C}_6\\text{H}_5\\text{OCH}_3$) with $\\text{HI}$ yields **phenol (A)** and methyl iodide ($\text{CH}_3\text{I}$).\n2. Treatment of phenol with concentrated $\\text{HNO}_3$ in the presence of concentrated $\\text{H}_2\\text{SO}_4$ causes complete nitration at all activated ortho and para positions, yielding 2,4,6-trinitrophenol (**picric acid, B**)."
    },
    {
        "id": "chem_16_45",
        "subject": "Chemistry",
        "chapter": "Alcohols, Phenols and Ethers",
        "chapter_number": 16,
        "year": 2023,
        "question": "In the reaction sequence:\n![Aspirin Synthesis Scheme](/pyq_images/chemistry/ch16/q45_scheme.png)\n$$\\text{Phenol} \\xrightarrow[\\text{(iii) }\\text{H}^+]{\\text{(i) }\\text{NaOH, (ii) }\\text{CO}_2} \\text{X} \\xrightarrow[\\text{H}^+]{(\\text{CH}_3\\text{CO})_2\\text{O}} \\text{Y (Major product)}$$\n'Y' in the above reaction is",
        "options": [
            "salicylaldehyde",
            "aspirin",
            "cumene",
            "picric acid"
        ],
        "correct_answer": "aspirin",
        "explanation": "1. Kolbe's reaction of phenol with $\\text{NaOH}$ and $\\text{CO}_2$ followed by acidification gives salicylic acid (2-hydroxybenzoic acid, X).\n2. Acetylation of salicylic acid using acetic anhydride in the presence of an acid catalyst acetylates the phenolic $-\\text{OH}$ group, yielding 2-acetoxybenzoic acid (**aspirin, Y**):\n$$\\text{C}_6\\text{H}_4(\\text{OH})(\\text{COOH}) + (\\text{CH}_3\\text{CO})_2\\text{O} \\xrightarrow{\\text{H}^+} \\text{C}_6\\text{H}_4(\\text{OCOCH}_3)(\\text{COOH}) + \\text{CH}_3\\text{COOH}$$"
    },
    {
        "id": "chem_16_46",
        "subject": "Chemistry",
        "chapter": "Alcohols, Phenols and Ethers",
        "chapter_number": 16,
        "year": 2024,
        "question": "8.8 g of a monohydric alcohol added to ethyl magnesium iodide in ether liberates $2240\\text{ cm}^3$ of ethane at STP. This monohydric alcohol when oxidised using pyridinium chlorochromate, forms a carbonyl compound that answers silver mirror test (Tollens test). The monohydric alcohol is",
        "options": [
            "butan-2-ol",
            "2,2-dimethylpropan-1-ol",
            "pentan-2-ol",
            "2,2-dimethylethan-1-ol"
        ],
        "correct_answer": "2,2-dimethylpropan-1-ol",
        "explanation": "1. Moles of ethane ($\\text{C}_2\\text{H}_6$) liberated at STP $= \\frac{2240\\text{ cm}^3}{22400\\text{ cm}^3/\\text{mol}} = 0.1\\text{ mol}$.\n2. Moles of alcohol reacted $= 0.1\\text{ mol}$.\n3. Molar mass of alcohol $= \\frac{8.8\\text{ g}}{0.1\\text{ mol}} = 88\\text{ g/mol}$.\n4. Molecular formula is $\\text{C}_5\\text{H}_{12}\\text{O}$ ($14n + 18 = 88 \\implies n = 5$).\n5. Since the PCC oxidation product gives a positive Tollens test (silver mirror), it must be an aldehyde, confirming that the alcohol is a **primary alcohol** ($1^\\circ$).\n6. Among the given options, **2,2-dimethylpropan-1-ol** (neopentyl alcohol, $(\\text{CH}_3)_3\\text{C-CH}_2\\text{OH}$) is a primary alcohol with molar mass $88\\text{ g/mol}$."
    },
    {
        "id": "chem_16_47",
        "subject": "Chemistry",
        "chapter": "Alcohols, Phenols and Ethers",
        "chapter_number": 16,
        "year": 2024,
        "question": "When a tertiary alcohol 'A' ($\\text{C}_4\\text{H}_{10}\\text{O}$) reacts with $20\\%\\,\\text{H}_3\\text{PO}_4$ at 358 K, it gives a compound 'B' ($\\text{C}_4\\text{H}_8$) as a major product. The IUPAC name of the compound 'B' is",
        "options": [
            "but-1-ene",
            "but-2-ene",
            "cyclobutane",
            "2-methylpropene"
        ],
        "correct_answer": "2-methylpropene",
        "explanation": "1. The only tertiary alcohol with molecular formula $\\text{C}_4\\text{H}_{10}\\text{O}$ is **2-methylpropan-2-ol** (tert-butyl alcohol, $(\\text{CH}_3)_3\\text{C-OH}$).\n2. Acid-catalyzed dehydration of 2-methylpropan-2-ol with $20\\%\\,\\text{H}_3\\text{PO}_4$ at $358\\text{ K}$ proceeds readily via a stable tertiary carbocation to eliminate a water molecule, yielding **2-methylpropene (isobutylene, B)**:\n$$(\\text{CH}_3)_3\\text{C-OH} \\xrightarrow[358\\text{ K}]{20\\%\\,\\text{H}_3\\text{PO}_4} (\\text{CH}_3)_2\\text{C}=\\text{CH}_2 + \\text{H}_2\\text{O}$$"
    },
    {
        "id": "chem_16_48",
        "subject": "Chemistry",
        "chapter": "Alcohols, Phenols and Ethers",
        "chapter_number": 16,
        "year": 2024,
        "question": "PCC is",
        "options": [
            "$\\text{K}_2\\text{Cr}_2\\text{O}_7 + \\text{pyridine}$",
            "$\\text{CrO}_3 + \\text{CHCl}_3$",
            "$\\text{CrO}_3 + \\text{H}_2\\text{SO}_4$",
            "a complex of chromium trioxide with pyridine and $\\text{HCl}$"
        ],
        "correct_answer": "a complex of chromium trioxide with pyridine and $\\text{HCl}$",
        "explanation": "**PCC (Pyridinium chlorochromate)**, $[\text{C}_5\text{H}_5\text{NH}]^+[\\text{CrO}_3\\text{Cl}]^-$, is prepared by dissolving **chromium trioxide ($\\text{CrO}_3$)** in aqueous hydrochloric acid ($\\text{HCl}$) and adding **pyridine**. It is a gentle, moisture-tolerant oxidizing agent widely used for converting primary alcohols to aldehydes and secondary alcohols to ketones in anhydrous dichloromethane."
    }
]

out_path = "src/data/pyq_chemistry_ch16.json"
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(questions, f, indent=2, ensure_ascii=False)

print(f"Successfully created {out_path} with {len(questions)} questions.")
