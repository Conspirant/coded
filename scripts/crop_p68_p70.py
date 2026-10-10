import cv2

p68 = cv2.imread("scratch/phys21/pdf_p68.png")
p69 = cv2.imread("scratch/phys21/pdf_p69.png")
p70 = cv2.imread("scratch/phys21/pdf_p70.png")

# Let's crop bottom of p68, and p70
h68, w68, _ = p68.shape
h70, w70, _ = p70.shape

cv2.imwrite("scratch/phys21/p68_right_page.png", p68[:, w68//2:])
cv2.imwrite("scratch/phys21/p70_left_page.png", p70[:, :w70//2:])
print("Saved p68_right_page.png and p70_left_page.png")
