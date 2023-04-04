import cv2 as cv
import numpy as np

def grayScaleHistogram(img):
    gray = cv.cvtColor(img, cv.COLOR_BGR2GRAY)
    hist = cv.calcHist([gray], [0], None,[256], [0,256])
    return hist

def fullRGBHistogram(img):
    rgb = cv.cvtColor(img, cv.COLOR_BGR2RGB)
    histDimensions = [256, 256, 256]
    histRanges =[0, 256, 0,256, 0,256]
    combined = cv.calcHist(rgb, [0,1,2], None, histDimensions, histRanges)
    return combined

def RGBMergedSinglesHistogram(img):
    # Split the image into its color channels
    b, g, r = cv.split(img)

    # Set the histogram parameters
    histSize = [256]
    range = [0, 256]

    # Calculate the histograms for each color channel
    histR = cv.calcHist([r], [0], None, histSize, range)
    histG = cv.calcHist([g], [0], None, histSize, range)
    histB = cv.calcHist([b], [0], None, histSize, range)

    hist = cv.merge([histR, histG, histB])
    return hist

def fullHSVHistogram(img):
    hsv = cv.cvtColor(img, cv.COLOR_BGR2HSV)
    histDimensions = [180,100,100]
    histRanges = [0,180,0,256,0,256]
    combined = cv.calcHist(hsv, [0,1,2], None, histDimensions, histRanges)
    return combined

def biggestValuesLocations(histogram, amount):
    reshaped = histogram.copy()
    reshaped = cv.Mat.reshape(histogram, 1)
    results =cv.minMaxLoc(reshaped)
    print(results)

def plotHistograms(histograms, colors):
    for i in range(len(histograms)):
        pyplot.plot(histograms[i], colors[i])
    
    pyplot.show()

def findMaxInMultidimensional(multiDim):
    flattened = cv.merge(multiDim)
    maxIdx = np.unravel_index(np.argmax(flattened), flattened.shape)
    max = np.max(flattened)
    return(max, maxIdx)

def multipleLargestMultiDimensional(multiDim, amount, needsMerging):
    if needsMerging:
        flattened = cv.merge([multiDim[0], multiDim[1], multiDim[2]])
    else:
        flattened = multiDim

    results = []
    for i in range(0, amount):
        flatIdx = np.argmax(flattened)
        multiIdx = np.unravel_index(flatIdx, flattened.shape)
        max = np.max(flattened)
        flattened[multiIdx[0]][multiIdx[1]][multiIdx[2]] = -1
        results.append((max, multiIdx))

    return results



img = cv.imread("C:\\Studium\\BPROJ\\opencv_Experiments\\pythonExperiments\\HistogramTestSwatch.png")
# histogram = grayScaleHistogram(img)
# plotHistograms([histogram], ["b"])

hsvhist = fullHSVHistogram(img)
rgbHist = fullRGBHistogram(img)
premerged = RGBMergedSinglesHistogram(img)
print(multipleLargestMultiDimensional(premerged, 1, False))
print(multipleLargestMultiDimensional(rgbHist, 1, True))

# biggestValuesLocations(hsvhist, 5)