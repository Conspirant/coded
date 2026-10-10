import os
from PIL import Image

out_dir = "public/pyq_images/physics/ch16"
os.makedirs(out_dir, exist_ok=True)

def crop_box(img_path, box, save_name):
    img = Image.open(img_path)
    w, h = img.size
    crop_area = (int(box[0] * w), int(box[1] * h), int(box[2] * w), int(box[3] * h))
    cropped = img.crop(crop_area)
    cropped.save(os.path.join(out_dir, save_name))
    print(f"Saved {save_name} with size {cropped.size}")

# p38_l.png
crop_box("scratch/physics16/p38_l.png", [0.33, 0.658, 0.475, 0.725], "q3_gang_capacitor.png")
crop_box("scratch/physics16/p38_l.png", [0.55, 0.408, 0.93, 0.485], "q5_dielectric_slab.png")

# p38_r.png:
crop_box("scratch/physics16/p38_r.png", [0.08, 0.525, 0.38, 0.620], "q12_circuit.png")
crop_box("scratch/physics16/p38_r.png", [0.08, 0.695, 0.40, 0.800], "q13_circuit.png")
crop_box("scratch/physics16/p38_r.png", [0.57, 0.150, 0.88, 0.200], "q15_ladder.png")
crop_box("scratch/physics16/p38_r.png", [0.62, 0.300, 0.83, 0.378], "q16_dots.png")
crop_box("scratch/physics16/p38_r.png", [0.56, 0.490, 0.85, 0.640], "q17_network.png")
crop_box("scratch/physics16/p38_r.png", [0.58, 0.755, 0.89, 0.825], "q18_network.png")

# p39_l.png:
crop_box("scratch/physics16/p39_l.png", [0.17, 0.235, 0.41, 0.320], "q21_network.png")
crop_box("scratch/physics16/p39_l.png", [0.20, 0.435, 0.38, 0.565], "q22_plates.png")

# p39_r.png:
crop_box("scratch/physics16/p39_r.png", [0.12, 0.155, 0.39, 0.245], "q33_plates.png")
crop_box("scratch/physics16/p39_r.png", [0.18, 0.870, 0.42, 0.925], "q38_bridge.png")
crop_box("scratch/physics16/p39_r.png", [0.62, 0.460, 0.83, 0.540], "q42_network.png")

# p40_l.png:
crop_box("scratch/physics16/p40_l.png", [0.15, 0.070, 0.37, 0.210], "q45_graph.png")
crop_box("scratch/physics16/p40_l.png", [0.31, 0.430, 0.49, 0.505], "q47_field.png")
crop_box("scratch/physics16/p40_l.png", [0.77, 0.575, 0.98, 0.655], "q54_graph.png")

# p40_r.png:
crop_box("scratch/physics16/p40_r.png", [0.13, 0.345, 0.43, 0.425], "q58_capacitors.png")
crop_box("scratch/physics16/p40_r.png", [0.14, 0.605, 0.40, 0.705], "q59_curved_path.png")
