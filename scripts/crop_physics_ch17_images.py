import os
from PIL import Image

out_dir = "public/pyq_images/physics/ch17"
os.makedirs(out_dir, exist_ok=True)

p45 = Image.open("scratch/physics17/pdf_p45_90.png")
p46 = Image.open("scratch/physics17/pdf_p46.png")
p47 = Image.open("scratch/physics17/pdf_p47.png")
p48 = Image.open("scratch/physics17/pdf_p48.png")
p49 = Image.open("scratch/physics17/pdf_p49.png")

# 1. Page 45 (2098 x 1700)
# Q3: Circuit (x: 290..490, y: 1020..1220)
p45.crop((280, 1020, 500, 1240)).save(f"{out_dir}/q3_circuit.png")

# Q5: Graph (x: 520..1020, y: 380..740)
p45.crop((540, 390, 1000, 740)).save(f"{out_dir}/q5_graph.png")

# Q6: Triangle PQR (x: 750..1020, y: 780..1050)
p45.crop((750, 780, 1010, 1050)).save(f"{out_dir}/q6_triangle.png")

# Q7: Wheatstone network (x: 820..1020, y: 1150..1380)
p45.crop((820, 1140, 1020, 1380)).save(f"{out_dir}/q7_bridge.png")

# Q10: Circuit with ammeter (x: 1140..1520, y: 460..760)
p45.crop((1140, 470, 1530, 765)).save(f"{out_dir}/q10_circuit.png")

# Q12: Resistor network ABCD (x: 1140..1520, y: 1240..1460)
p45.crop((1140, 1235, 1530, 1465)).save(f"{out_dir}/q12_network.png")

# Q13: Potential difference line (x: 1080..1530, y: 1580..1690)
p45.crop((1080, 1580, 1530, 1690)).save(f"{out_dir}/q13_line.png")

# Q17: Voltmeters A, B, C (x: 1670..1950, y: 1200..1330)
p45.crop((1670, 1200, 1950, 1340)).save(f"{out_dir}/q17_voltmeters.png")

# Q18: Bulbs B1, B2, B3 with key K (x: 1650..1950, y: 1540..1690)
p45.crop((1650, 1540, 1950, 1690)).save(f"{out_dir}/q18_bulbs.png")


# 2. Page 46 (1700 x 1349)
# In pdf_p46.png:
# Left half is book page 86, right half is book page 87
# Q19: Circuit (x: 180..380, y: 360..510)
p46.crop((180, 360, 380, 520)).save(f"{out_dir}/q19_circuit.png")

# Q22: Bridge network (x: 200..380, y: 1070..1220)
p46.crop((190, 1060, 380, 1220)).save(f"{out_dir}/q22_bridge.png")

# Q23: Graphs (x: 480..820, y: 430..720)
p46.crop((480, 440, 810, 720)).save(f"{out_dir}/q23_graphs.png")

# Q25: Circuit (x: 520..770, y: 1170..1290)
p46.crop((520, 1160, 780, 1300)).save(f"{out_dir}/q25_circuit.png")

# Q26: Parallel circuit (x: 950..1250, y: 110..220)
p46.crop((950, 110, 1260, 220)).save(f"{out_dir}/q26_circuit.png")

# Q28: Circuit (x: 1000..1300, y: 530..640)
p46.crop((1000, 530, 1300, 640)).save(f"{out_dir}/q28_circuit.png")

# Q35: Ammeter and voltmeter (x: 1380..1680, y: 640..760)
p46.crop((1380, 640, 1680, 760)).save(f"{out_dir}/q35_circuit.png")

# Q36: Opposing cells (x: 1370..1680, y: 970..1090)
p46.crop((1370, 960, 1680, 1100)).save(f"{out_dir}/q36_circuit.png")


# 3. Page 47 (1700 x 1385)
# Q37: Capacitor circuit (x: 130..350, y: 110..270)
p47.crop((130, 110, 350, 275)).save(f"{out_dir}/q37_circuit.png")

# Q39: R vs T graph (x: 170..340, y: 580..720)
p47.crop((170, 580, 340, 725)).save(f"{out_dir}/q39_graph.png")

# Q40: Circuit (x: 110..380, y: 900..1000)
p47.crop((110, 900, 380, 1010)).save(f"{out_dir}/q40_circuit.png")

# Q41: Star network at O (x: 130..380, y: 1110..1300)
p47.crop((130, 1110, 380, 1300)).save(f"{out_dir}/q41_star.png")

# Q42: Ladder network (x: 480..760, y: 145..325)
p47.crop((480, 145, 760, 330)).save(f"{out_dir}/q42_network.png")

# Q45: Four graphs (x: 460..810, y: 840..1140)
p47.crop((460, 840, 810, 1145)).save(f"{out_dir}/q45_graphs.png")

# Q46: Junction network (x: 690..820, y: 1170..1310)
p47.crop((690, 1170, 820, 1320)).save(f"{out_dir}/q46_junction.png")

# Q47: Circular circuit (x: 950..1280, y: 130..340)
p47.crop((950, 130, 1280, 345)).save(f"{out_dir}/q47_circular.png")

# Q51: Triangular bridge (x: 1000..1250, y: 930..1090)
p47.crop((1000, 930, 1250, 1095)).save(f"{out_dir}/q51_triangle.png")

# Q52: Five parallel resistors (x: 1360..1680, y: 100..220)
p47.crop((1360, 100, 1680, 225)).save(f"{out_dir}/q52_parallel.png")

# Q54: I-V graph P and Q (x: 1420..1620, y: 650..780)
p47.crop((1420, 650, 1630, 785)).save(f"{out_dir}/q54_graph.png")


# 4. Page 48 (1700 x 1443)
# Q57: Bridge circuit (x: 120..390, y: 170..310)
p48.crop((120, 170, 390, 310)).save(f"{out_dir}/q57_circuit.png")

# Q59: V-I graph (x: 170..350, y: 625..775)
p48.crop((170, 625, 350, 775)).save(f"{out_dir}/q59_graph.png")

# Q62: Cubical network (x: 520..770, y: 160..350)
p48.crop((520, 160, 770, 350)).save(f"{out_dir}/q62_cube.png")

# Q63: I-V curve slope (x: 640..800, y: 520..645)
p48.crop((640, 520, 800, 645)).save(f"{out_dir}/q63_graph.png")

# Q75: Infinite ladder (x: 930..1270, y: 600..730)
p48.crop((930, 600, 1270, 730)).save(f"{out_dir}/q75_ladder.png")

# Q77: Ladder bridge (x: 900..1300, y: 1100..1230)
p48.crop((900, 1100, 1300, 1230)).save(f"{out_dir}/q77_ladder.png")


# 5. Page 49 (1700 x 1431)
# Q78: I vs t graph (x: 160..340, y: 290..450)
p49.crop((160, 290, 340, 450)).save(f"{out_dir}/q78_graph.png")

# Q79: I-V graph 100C and 400C (x: 540..740, y: 155..330)
p49.crop((540, 155, 740, 330)).save(f"{out_dir}/q79_graph.png")

print("All Physics Chapter 17 diagrams cropped successfully!")
