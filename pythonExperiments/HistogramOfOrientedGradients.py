import numpy
import matplotlib as mpl
import matplotlib.pyplot as pyplot
from skimage.transform import resize
import skimage.feature
import skimage.io
import os
import csv

def hogFromPath(path):
    image = skimage.io.imread(path, as_gray=True) 
    # image = resize(image, (len(image)/4, math.floor(len(image[0])/4)))
    data, hog_image = skimage.feature.hog(image, orientations=8, pixels_per_cell=(16, 16), cells_per_block=(1,1), visualize=True, feature_vector=False)
    return data
    # fig, (ax1, ax2) = pyplot.subplots(1,2, figsize=(16,16), sharex=True, sharey=True)
    # ax1.imshow(image)
    # ax2.imshow(hog_image)


def largestInEachCell(full):
    lookedAtCounter = 0
    fulfilledCounter = 0
    magnitudeIsMax = [0, 0, 0, 0, 0, 0, 0, 0]
    for h_Idx in range(0, len(full)):
        for w_Idx in range(0, len(full[h_Idx])):
            magnitudes = full[h_Idx][w_Idx][0][0].copy()
            cellMaximum = max(magnitudes)
            for magnitudeIdx in range(0, len(magnitudes)):
                lookedAtCounter += 1
                if magnitudes[magnitudeIdx] == cellMaximum:
                    fulfilledCounter += 1
                    magnitudeIsMax[magnitudeIdx] += 1
    
    return magnitudeIsMax

def getDifferencesToSmallest(data):
    minimum = min(data)
    result = []
    for point in data:
        result.append(point - minimum)

    return result

def calcIntoRelativeValues(data):
    relative = []
    arraySum = sum(data)
    for val in data:
        relative.append(round(val / arraySum, 3))
    return relative

def testAllImagesInDirectory():
    directory = "C:\\Studium\BPROJ\\ArtVeeData\\"
    with open(directory + "hogAnalysis.csv", "w", encoding="utf8", newline="") as writeFile:
        csvWriter = csv.DictWriter(f=writeFile, fieldnames=["imageName", "normedAngleCounters", "relative0", "relative1", "relative2","relative3","relative4","relative5","relative6","relative7",], delimiter=";")
        csvWriter.writeheader()

        for file in os.listdir(directory):
            print("analysing: " + file)
            data = hogFromPath(directory + file)
            maxAngles = largestInEachCell(data)
            differences = getDifferencesToSmallest(maxAngles)
            relative = calcIntoRelativeValues(differences)
            resultDict = {
                "imageName": file,
                "normedAngleCounters": str(differences),
                "relative0": str(relative[0]),
                "relative1": str(relative[1]),
                "relative2": str(relative[2]),
                "relative3": str(relative[3]),
                "relative4": str(relative[4]),
                "relative5": str(relative[5]),
                "relative6": str(relative[6]),
                "relative7": str(relative[7]),
            }
            csvWriter.writerow(resultDict)

# data = hogFromPath("C:\\Studium\BPROJ\\ArtVeeData\\Anatomical study of the neck_ arm and leg muscles of a man_ Reijer Stolk _1906 - 1945_ .jpg")
# angleCounters = largestInEachCell(data)

# print(angleCounters)
# print(angleCounters)
testAllImagesInDirectory()

# pyplot.show()