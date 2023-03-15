import cv2 as cv
from matplotlib import pyplot

def grayScaleHistogram(img):
    gray = cv.cvtColor(img, cv.COLOR_BGR2GRAY)
    hist = cv.calcHist([gray], [0], None,[256], [0,256])
    return hist

def fullHSVHistogram(img):
    hsv = cv.cvtColor(img, cv.COLOR_RGB2HSV)
    histDimensions = [18,25,25]
    histRanges = [0,180,0,256,0,256]
    histogram = cv.calcHist(hsv, [0,1,2], None, histDimensions, histRanges)
    return histogram

def biggestValuesLocations(histogram, amount):
    reshaped = histogram.copy()
    reshaped = cv.Mat.reshape(histogram, 1)
    results =cv.minMaxLoc(reshaped)
    print(results)

def plotHistograms(histograms, colors):
    for i in range(len(histograms)):
        pyplot.plot(histograms[i], colors[i])
    
    pyplot.show()


img = cv.imread("D:\Studium\Bachelor\ArtVeeData\_Ammunition__ And remember _ bonds buy bullets_ _1918_ .jpg");
# histogram = grayScaleHistogram(img)
# plotHistograms([histogram], ["b"])

hsvhist = fullHSVHistogram(img)
biggestValuesLocations(hsvhist, 5)