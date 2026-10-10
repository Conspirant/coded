import cv2

p69 = cv2.imread("scratch/phys21/pdf_p69.png")
p71 = cv2.imread("scratch/phys21/pdf_p71.png")

h69, w69, _ = p69.shape
h71, w71, _ = p71.shape

# Let's crop the bottom half of p69 left page
cv2.imwrite("scratch/phys21/p69_bottom_left.png", p69[int(h69*0.55):, :int(w69*0.55)])
# Let's crop p71
cv2.imwrite("scratch/phys21/p71_page.png", p71)
print("Saved p69_bottom_left.png and p71_page.png")
