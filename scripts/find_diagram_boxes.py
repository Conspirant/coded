from PIL import Image

def test_crop(img_path, box, name):
    im = Image.open(img_path)
    cropped = im.crop(box)
    cropped.save(name)
    print(f"Saved {name}: {cropped.size}")

# Test on p45_90 (size 1510 x 1224)
p45 = Image.open("scratch/physics17/pdf_p45_90.png")
print("p45_90 size:", p45.size)

# Test on p46 (size 1700 x 1350)
p46 = Image.open("scratch/physics17/pdf_p46.png")
print("p46 size:", p46.size)

# Test on p47
p47 = Image.open("scratch/physics17/pdf_p47.png")
print("p47 size:", p47.size)

# Test on p48
p48 = Image.open("scratch/physics17/pdf_p48.png")
print("p48 size:", p48.size)

# Test on p49
p49 = Image.open("scratch/physics17/pdf_p49.png")
print("p49 size:", p49.size)
