import extcolors as ext
import colorgram 
import time


def getExtColorPalette(path):
    return(ext.extract_from_path(path, limit=5))

#use this, it's faster
def getColorgramPalette(path):
    palette = colorgram.extract(path, 5)
    hsvPalette = []

    for color in palette:
        hsvPalette.append((color.hsl, color.proportion))
    
    return hsvPalette

print(getColorgramPalette("C:\\Studium\\BPROJ\\opencv_Experiments\\pythonExperiments\\HistogramTestSwatch.png"))
