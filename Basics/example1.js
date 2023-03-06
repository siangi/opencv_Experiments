
let imgElement = document.getElementById("imageSrc");
imgElement.onload = showCannyEdges;
let inputElement = document.querySelector("#fileInput");

inputElement.addEventListener(
  "change",
  (e) => {
    imgElement.src = URL.createObjectURL(e.target.files[0]);
  },
  false
);


function showImageOnCanvas() {
    let mat = cv.imread(imgElement);
    cv.imshow("outputCanvas", mat);
    console.log('image width: ' + mat.cols + '\n' +
            'image height: ' + mat.rows + '\n' +
            'image size: ' + mat.size().width + '*' + mat.size().height + '\n' +
            'image depth: ' + mat.depth() + '\n' +
            'image channels ' + mat.channels() + '\n' +
            'image type: ' + mat.type() + '\n');

    let row = 3, col = 4;
    if (mat.isContinuous()) {
        let R = mat.ucharAt(row, col * mat.channels());
        let G = mat.ucharAt(row, col * mat.channels() + 1);
        let B = mat.ucharAt(row, col * mat.channels() + 2);
        let A = mat.ucharAt(row, col * mat.channels() + 3);
        let pixel = mat.ucharPtr(row, col);
        console.log("color1 values of [3,4]", R,G,B,A, pixel);
    }
    mat.delete();
}

function showRegionOfInterest(){
    let full = cv.imread(imgElement);
    let region = new cv.Mat();
    let rect = new cv.Rect(150, 150, 100, 50);
    region = full.roi(rect);

    cv.imshow("outputCanvas", region);
    full.delete();
    region.delete();
}

function showGrayscale(){
    let full = cv.imread(imgElement);
    let gray = new cv.Mat();
    cv.cvtColor(full, gray, cv.COLOR_RGBA2GRAY, 0);
    
    cv.imshow("outputCanvas", gray);
    full.delete();
    gray.delete();
}

function showThresholdInRange(){
    let full = cv.imread(imgElement);
    let thresholded = new cv.Mat();
    let low = new cv.Mat(full.rows, full.cols, full.type(), [0,0,0,0]);
    let high = new cv.Mat(full.rows, full.cols, full.type(), [150,150,150,255]);
    cv.inRange(full, low, high, thresholded);

    cv.imshow("outputCanvas", thresholded);
    full.delete();
    thresholded.delete();
    low.delete();
    high.delete();
}

function showDownscaled(){
    let full = cv.imread(imgElement);
    let downscaled = new cv.Mat();
    let newSize = new cv.Size(0, 0)
    cv.resize(full, downscaled, newSize, 0.05, 0.05, cv.INTER_AREA)

    cv.imshow("outputCanvas", downscaled);
    full.delete();
    downscaled.delete();
}

function showGaussianBlurred(){
    let full = cv.imread(imgElement);
    let blurred = new cv.Mat();
    let kSize = new cv.Size(5, 5);
    cv.GaussianBlur(full, blurred, kSize, 0, 0, cv.BORDER_DEFAULT);
    cv.imshow("outputCanvas", blurred);
    full.delete();
    blurred.delete();
}

function showCannyEdges(){
    let full = cv.imread(imgElement);
    let gray = new cv.Mat();
    let blurred = new cv.Mat();
    let edges = new cv.Mat();
    let kSize = new cv.Size(5, 5);
    cv.cvtColor(full, gray, cv.COLOR_RGBA2GRAY, 0);
    cv.GaussianBlur(gray, blurred, kSize, 0, 0, cv.BORDER_DEFAULT);
    cv.Canny(blurred, edges, 50, 100, 3, false)

    cv.imshow("outputCanvas", edges);
    full.delete();
    gray.delete();
    blurred.delete(); 
    edges.delete();
}