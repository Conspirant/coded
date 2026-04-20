const fs = require('fs');

const rawData = `Username	Marks	Rank	10s1	10s2	10s3	25may
Mathematicihilipili	146	59	C	h	✔	e
Xpyre2006	140	109	m	i	s	✔
Sleuth1167	138	23x	t	E	✔	x
Super-Time-8970	134	386	o	t	i	✔
After_Patient6299	132	398	c	1	✔	7
KRISHSHAH021007	130	56x	2	3		
shitsw	130	572			✔	
greenlifecar	130	648				✔
favsight	126	597		✔		
grapeybanana	125	254	✔			
MeasurementEast1634	124	2078				✔
introvert_dude_me	123	2459				✔
randomass_niggu-56	122	130x		✔		
DayExciting511	122	1271			✔	
Accomplished_Tales	121	47X	✔			
Unable_Crow3981	120	1600			✔	
not_Jiggg	120	1568			✔	
PrudentExpert9886	119	17XX			✔	
trav_brav	118	139X		✔		
Ok_Chemical_7267	117	799	✔			
AaapkiSarkar	117	781	✔			
ForeverIll5213	117	2019			✔	
Revolutionary-Pin345	114	26XX			✔	
No-Still6540	114	195x		✔		
aarav_2703	114	1930		✔		
hardik_kathuria	113	1243	✔			
drajeox	113	2851			✔	
Born-Coach-2696	112	3162			✔	
Large-Industry-9686	112	2270		✔		
Clear-Performer-7326	112	2311		✔		
Known-Exam-4495	112	1320	✔			
Spirited-Squirrel-57	112	3191			✔	
Available-Season4546	110	2754		✔		
Candy1773	110	3.6k			✔	
StateCurious	110	3580			✔	
Key-Newt-6953	110	35xx			✔	
No-Macaron-4265	109	1827	✔			
Glittering-Sun-8776	108	2017	✔			
isildur29	107	4.5k			✔	
Hattori-ninja	106	38xx		✔		
Same_Sandwich_8930	106	242X	✔			
krishna_abhi06	106	4.9k			✔	
Bitchless2511	105	2.5k	✔			
Mental_Reason_3423	105	5k			✔	
Artistic_Garbage6181	104	45XX		✔		
Healthy-Appeal-6396	103	4869		✔		
jalebi_bhaiii	103	3091	✔			
curiositylvl100	103	3064	✔			
No-Papaya-1785	103	49xx		✔		
ShelterHuge5418	103	3.1k	✔			
OperationClassic9690	103	4913		✔		
UnKnOwN1497	103	6k			✔	
Nice_Sink_9912	103	11800				✔
Last_Independent_211	103	118XX				✔
saifamd	102	537x				
slskskksksk	101	3.6k	✔			
LadyD3vilish	101	13.5k				✔
PhekneWalaAccount2	101	57XX		✔		
elatedwarchief	100	4k	✔			
Alert_Survey1903	100	6k		✔		
Warm-Bicycle-535	100	621x		✔		
Less-Instruction-860	100	14361				✔
Individual_Drop273	99	4208	✔			
random_user9999999	99	15202				✔
Happy_Ad_1743	99	6600		✔		
Savings_Ladder_4240	98	4.7k	✔			
Supersweetdumbass	98	70xx		✔		
void015	97	7450		✔		
PackNo9899	96	5.5k	✔			
LifeOption254	96	17566				✔
Unable-Sky1101	95	5938	✔			
Plastic_Reading_2361	95	9918			✔	
Naive_Vacation2926	94	7.4k		✔		
SpreadingSmile	94	977x		✔		
WeirdRanjan	94	10250			✔	
Typical-Reward-1092	93	20555				✔
star-shell08	93	6.7k	✔			
ZealousidealYou7575	93	9.7k		✔		
ib_baddies	92	725X	✔			
Stunning-Finance3452	90	8200	✔			
ponyooo-shua	90	12k		✔		
No_Inflation4089	90	11.xx k		✔		
AlivePomegranate5234	90	12k		✔		
muttibaaz	90	12.2k			✔	
AlternativeEvent4752	89	8.1k	✔			
Odd_Link_449	89	8777		89	12767		✔		
Thin-Intention-8472	89	17022		✔		
Ok_Evidence_366	88	94XX	✔			
NeatFickle3176	88	8.8k	✔			
CartographerGuilty38	87	15559			✔	
sus_independent_goat	86	10k				
SinceSinCity	86	107xx				
whosthatarpita	85	11k				
devilman_069	85	15.3k		✔		
More-Bid-1379	85	31k				✔
captain_bihari	84	18440			✔	
PhewDEnel	84	18.2k			✔	
Professional_Set5258	84	12.4k	✔			
hara-amrood1110	84	282xx				✔
akshanshiitian	84	32819				✔
BackgroundReaction60	83	13.4k	✔			
Noshit_yush	83	19XXX			✔	
user06_699	83	13466				
dionysusreincarnate	82	18.1k		✔		
75th_Kirito	82	198xx			✔	
Furious-little-shit	82	18k		✔		
Virtual_Hedgehog_313	82	19.9k			✔	
pratzel03	82	14.3xx	✔			
Due_Lawfulness_44	82	143xx	✔			
obnoxiousisomer	80	16k	✔			
Mountain-Bit-2754	80	19997		✔		
OutrageousLake9968	79	16k	✔			
One_Purple9543	79	16.6k	✔			
ketoenol_tautomerism	79	21.8k			✔	
Haunting_Singer_3646	79	35k				✔
pbeeppablo	78	19k	✔			
Outrageous_Pop_9083	77	19k	✔			
ElectricalSplit2364	77	23k		✔		
thandi-roti	77	43k				✔
OkYoung7606	77	43612				✔
Sufficient-Spite5418	76	20k	✔			
V1jeet	74	287XX			✔	
Pritish1808	74	18k				
Large-Equipment1805	74	50.4k				✔
heretolearn-2025	72	25k	✔			
6ix9ineisGoat	71	26k	✔			
aeri_0	71	26k	✔			
kaleshii_aurat	71	260XX	✔			
not_k_darshan	69	~22k			✔	
Evening-Foundation46	69	36556			✔	
One_Quote_6366	69	36388		✔		
Mayson_12	67	37261		✔		
EggGroundbreaking970	67	39k			✔	
Elegant_Nobody216	67	40k			✔	
Aditya--Singh	67	32.5k	✔			
Navjot2661	67	63k				✔
paper_dosa	66	38k		✔		
Navjot2661	65	63k				✔
One_Spell4742	64	38150				
Sulfur_dude	64	38363	✔			
Humble-Leek-4804	63	45k				
Apex_preadatorrr	63	47k			✔	
Famous-Drink3643	63	45k		✔		
AniKhud	63	39k	✔			
Ntagotnochill	62	49.5k			✔	
Ok_Election4958	61	50k			✔	
NahIdWin-FS	61	49.8k		✔		
Dry-Management-5914	60	52k		✔		
FearlessFan3895	60	43xxx	✔			
yash_jaiswal181	59	48k	✔			
CultZilla	57	51xxx				
Large-Proposal-1273	57	54xxx	✔			
POISON_loveuwu	56	57k	✔			
rish1207	55	66k		✔		
Glittering-Cloud-242	53	77993			✔	
siddharth517	53	73k			✔	
RoosterAcceptable610	52	71661	✔			
Complete_Librarian39	50	84581			✔	
Immediate_Morning510	47	93976		✔		`;

function parseRank(rankStr) {
  rankStr = rankStr.toLowerCase().replace(/~/g, '').trim();
  rankStr = rankStr.replace(/x/g, '0');
  if (rankStr.includes('k')) {
    const numStr = rankStr.replace('k', '');
    return Math.round(parseFloat(numStr) * 1000);
  }
  return parseInt(rankStr, 10);
}

const lines = rawData.split('\\n');
const results = {
  '10s1': [],
  '10s2': [],
  '10s3': [],
  '25may': [],
  'unknown': []
};

for (let i = 1; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) continue;
  
  // Custom parsing as split by tab might break because of weird spacing in text
  // We'll use regex to extract Marks and Rank.
  const parts = line.split(/[\\s\\t]+/);
  if (parts.length < 3) continue;

  let marks = parseInt(parts[1], 10);
  if (isNaN(marks)) continue;
  
  let rank = parseRank(parts[2]);
  if (isNaN(rank)) {
    // If username had space, it shifted everything
    marks = parseInt(parts[2], 10);
    rank = parseRank(parts[3]);
    if (isNaN(marks) || isNaN(rank)) continue;
  }
  
  // Find checkmark column by searching for '✔' in line
  let shift = 'unknown';
  const originalParts = line.split('\\t');
  
  // The structure is User \\t Marks \\t Rank \\t 10s1 \\t 10s2 \\t 10s3 \\t 25may
  // Some rows are missing tabs
  let checkIdx = originalParts.findIndex(p => p.includes('✔'));
  if (checkIdx === 3) shift = '10s1';
  else if (checkIdx === 4) shift = '10s2';
  else if (checkIdx === 5) shift = '10s3';
  else if (checkIdx === 6) shift = '25may';
  else {
    // Fallback logic by trying to pinpoint where ✔ is.
    if (line.includes('✔')) {
      const remainingCols = originalParts.slice(3);
      if (remainingCols.length > 0) {
        checkIdx = remainingCols.findIndex(p => p.includes('✔'));
        if (checkIdx === 0) shift = '10s1';
        else if (checkIdx === 1) shift = '10s2';
        else if (checkIdx === 2) shift = '10s3';
        else if (checkIdx === 3) shift = '25may';
      }
    }
  }
  
  results[shift].push({ marks, rank });
}

console.log("Counts per shift:");
for (const [s, arr] of Object.entries(results)) {
  console.log(\`\${s}: \${arr.length} pts\`);
}

fs.writeFileSync('C:/Users/risha/OneDrive/Desktop/coded-main/scripts/shifts_data.json', JSON.stringify(results, null, 2));

