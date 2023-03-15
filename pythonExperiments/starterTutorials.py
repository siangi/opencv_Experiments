import cv2 as cv
import sys

img = cv.imread("D:\Studium\Bachelor\ArtVeeData\_Ammunition__ And remember _ bonds buy bullets_ _1918_ .jpg");

if img is None:
    sys.exit("Could not read the image.")

cv.imshow("Display window", img)
k = cv.waitKey(0)
