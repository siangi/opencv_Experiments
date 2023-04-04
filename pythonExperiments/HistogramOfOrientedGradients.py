import matplotlib.pyplot as pyplot
import skimage.feature
import skimage.io

image = skimage.io.imread("C:\\Studium\BPROJ\\ArtVeeData\\Cubist head _c. 1914_ .jpg", as_gray=True) 

data, hog_image = skimage.feature.hog(image, orientations=8, pixels_per_cell=(16, 16), cells_per_block=(1,1), visualize=True)
fig, ax2 = pyplot.subplots(1,1, figsize=(16,8), sharex=True, sharey=True)
# ax1.imshow(image)
ax2.imshow(hog_image)

pyplot.show()