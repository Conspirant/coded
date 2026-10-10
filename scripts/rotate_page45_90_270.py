from PIL import Image

im = Image.open("scratch/physics17/pdf_p45.png")

# Try 90 deg clockwise (270 in PIL rotate or transpose)
im_90 = im.rotate(90, expand=True)
im_90.save("scratch/physics17/pdf_p45_90.png")

# Try 270 deg clockwise
im_270 = im.rotate(270, expand=True)
im_270.save("scratch/physics17/pdf_p45_270.png")

w90, h90 = im_90.size
im_90.crop((0, 0, w90 // 2 + 30, h90)).save("scratch/physics17/p45_90_l.png")
im_90.crop((w90 // 2 - 30, 0, w90, h90)).save("scratch/physics17/p45_90_r.png")

w270, h270 = im_270.size
im_270.crop((0, 0, w270 // 2 + 30, h270)).save("scratch/physics17/p45_270_l.png")
im_270.crop((w270 // 2 - 30, 0, w270, h270)).save("scratch/physics17/p45_270_r.png")

print("Saved 90 and 270 rotations.")
