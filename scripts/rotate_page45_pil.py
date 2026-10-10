from PIL import Image

im = Image.open("scratch/physics17/pdf_p45.png")
im_rot = im.rotate(180, expand=True)
im_rot.save("scratch/physics17/pdf_p45_rot.png")

w, h = im_rot.size
im_rot.crop((0, 0, w // 2 + 30, h)).save("scratch/physics17/p45_rot_l.png")
im_rot.crop((w // 2 - 30, 0, w, h)).save("scratch/physics17/p45_rot_r.png")

print("Rotated using PIL!")
