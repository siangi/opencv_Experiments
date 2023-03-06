let imgElement = document.getElementById("imageSrc");
imgElement.onload = showGrabCutForeground;
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
    console.log(
        "image width: " +
            mat.cols +
            "\n" +
            "image height: " +
            mat.rows +
            "\n" +
            "image size: " +
            mat.size().width +
            "*" +
            mat.size().height +
            "\n" +
            "image depth: " +
            mat.depth() +
            "\n" +
            "image channels " +
            mat.channels() +
            "\n" +
            "image type: " +
            mat.type() +
            "\n"
    );

    let row = 3,
        col = 4;
    if (mat.isContinuous()) {
        let R = mat.ucharAt(row, col * mat.channels());
        let G = mat.ucharAt(row, col * mat.channels() + 1);
        let B = mat.ucharAt(row, col * mat.channels() + 2);
        let A = mat.ucharAt(row, col * mat.channels() + 3);
        let pixel = mat.ucharPtr(row, col);
        console.log("color1 values of [3,4]", R, G, B, A, pixel);
    }
    mat.delete();
}

function showRegionOfInterest() {
    let full = cv.imread(imgElement);
    let region = new cv.Mat();
    let rect = new cv.Rect(150, 150, 100, 50);
    region = full.roi(rect);

    cv.imshow("outputCanvas", region);
    full.delete();
    region.delete();
}

function showGrayscale() {
    let full = cv.imread(imgElement);
    let gray = new cv.Mat();
    cv.cvtColor(full, gray, cv.COLOR_RGBA2GRAY, 0);

    cv.imshow("outputCanvas", gray);
    full.delete();
    gray.delete();
}

function showThresholdInRange() {
    let full = cv.imread(imgElement);
    let thresholded = new cv.Mat();
    let low = new cv.Mat(full.rows, full.cols, full.type(), [0, 0, 0, 0]);
    let high = new cv.Mat(full.rows, full.cols, full.type(), [150, 150, 150, 255]);
    cv.inRange(full, low, high, thresholded);

    cv.imshow("outputCanvas", thresholded);
    full.delete();
    thresholded.delete();
    low.delete();
    high.delete();
}

function showDownscaled() {
    let full = cv.imread(imgElement);
    let downscaled = new cv.Mat();
    let newSize = new cv.Size(0, 0);
    cv.resize(full, downscaled, newSize, 0.05, 0.05, cv.INTER_AREA);

    cv.imshow("outputCanvas", downscaled);
    full.delete();
    downscaled.delete();
}

function showGaussianBlurred() {
    let full = cv.imread(imgElement);
    let blurred = new cv.Mat();
    let kSize = new cv.Size(5, 5);
    cv.GaussianBlur(full, blurred, kSize, 0, 0, cv.BORDER_DEFAULT);
    cv.imshow("outputCanvas", blurred);
    full.delete();
    blurred.delete();
}

function showCannyEdges() {
    let full = cv.imread(imgElement);
    let gray = new cv.Mat();
    let blurred = new cv.Mat();
    let edges = new cv.Mat();
    let kSize = new cv.Size(5, 5);
    cv.cvtColor(full, gray, cv.COLOR_RGBA2GRAY, 0);
    cv.GaussianBlur(gray, blurred, kSize, 0, 0, cv.BORDER_DEFAULT);
    cv.Canny(blurred, blurred, 50, 100, 3, false);

    cv.imshow("outputCanvas", blurred);
    full.delete();
    gray.delete();
    blurred.delete();
    edges.delete();
}

function calcHistogram() {
    let base = cv.imread(imgElement);
    cv.cvtColor(base, base, cv.COLOR_RGBA2GRAY, 0);
    let srcVec = new cv.MatVector();
    srcVec.push_back(base);
    let histogram = new cv.Mat();
    let mask = new cv.Mat();

    cv.calcHist(srcVec, [0], mask, histogram, [256], [0, 255], false);
    console.log(histogram.data);
    console.log(histogram.data[250]);
    cv.imshow("outputCanvas", base);
    base.delete();
}

function equalizedImage() {
    let base = cv.imread(imgElement);
    cv.cvtColor(base, base, cv.COLOR_RGBA2GRAY, 0);
    cv.equalizeHist(base, base);
    cv.imshow("outputCanvas", base);
    base.delete();
}

function showHoughTransform(){
    let base = cv.imread(imgElement);
    let dst = cv.Mat.zeros(base.rows, base.cols, cv.CV_8UC3);
    let lines = new cv.Mat();
    cv.cvtColor(base, base, cv.COLOR_RGBA2GRAY, 0);
    cv.Canny(base,base, 50,200, 3);

    cv.HoughLines(base, lines, 1, Math.PI / 180, 100, 0,0,0, Math.PI);

    for (let i = 0; i < lines.rows; ++i) {
        let rho = lines.data32F[i * 2];
        let theta = lines.data32F[i * 2 + 1];
        let a = Math.cos(theta);
        let b = Math.sin(theta);
        let x0 = a * rho;
        let y0 = b * rho;
        let startPoint = {x: x0 - 1000 * b, y: y0 + 1000 * a};
        let endPoint = {x: x0 + 1000 * b, y: y0 - 1000 * a};
        cv.line(dst, startPoint, endPoint, [255, 0, 0, 255]);
    }
    
    cv.imshow("outputCanvas", dst)
    cv.imshow("progressCanvas", base);
    base.delete();
    dst.delete();
    
}

function showProbabislisticHough(){
    let base = cv.imread(imgElement);
    let dst = cv.Mat.zeros(base.rows, base.cols, cv.CV_8UC3);
    let lines = new cv.Mat();
    cv.cvtColor(base, base, cv.COLOR_RGBA2GRAY, 0);
    cv.Canny(base,base, 50,200, 3);

    cv.HoughLinesP(base, lines, 1, Math.PI / 180, 50, 50,5);

    for(let i = 0; i < lines.rows; ++i){
        let startPoint = new cv.Point(lines.data32S[i * 4], lines.data32S[i * 4 + 1]);
        let endPoint = new cv.Point(lines.data32S[i * 4 + 2], lines.data32S[i * 4 + 3]);
        cv.line(dst, startPoint, endPoint, [255, 0, 0, 255]);
    }
    cv.imshow("progressCanvas", base);
    cv.imshow("outputCanvas", dst)

    base.delete();
    dst.delete();
}

function compareHoughTransforms(){
    let base = cv.imread(imgElement);
    let probResult = cv.imread(imgElement);
    let probLines = new cv.Mat();
    let normResult = cv.imread(imgElement);
    let normLines = new cv.Mat();

    cv.cvtColor(base, base, cv.COLOR_RGBA2GRAY, 0);
    cv.Canny(base,base, 50,200, 3);


    cv.HoughLinesP(base, probLines, 1, Math.PI / 180, 50, 50,5);
    cv.HoughLines(base, normLines, 1, Math.PI / 180, 150, 0,0,0, Math.PI);

    for(let i = 0; i < probLines.rows; ++i){
        let startPoint = new cv.Point(probLines.data32S[i * 4], probLines.data32S[i * 4 + 1]);
        let endPoint = new cv.Point(probLines.data32S[i * 4 + 2], probLines.data32S[i * 4 + 3]);
        cv.line(probResult, startPoint, endPoint, [255, 0, 0, 255]);
    }
    console.log(normLines.data32F);

    for (let i = 0; i < normLines.rows; ++i) {
        let rho = normLines.data32F[i * 2];
        let theta = normLines.data32F[i * 2 + 1];
        let a = Math.cos(theta);
        let b = Math.sin(theta);
        let x0 = a * rho;
        let y0 = b * rho;
        let startPoint = {x: x0 - 1000 * b, y: y0 + 1000 * a};
        let endPoint = {x: x0 + 1000 * b, y: y0 - 1000 * a};
        cv.line(normResult, startPoint, endPoint, [255, 0, 0, 255]);
    }

    cv.imshow("progressCanvas", normResult);
    cv.imshow("outputCanvas", probResult)

    base.delete();
    probResult.delete();
}

function showGrabCutForeground(){
    let base = cv.imread(imgElement);
    let goalSize = new cv.Size(0,0)
    cv.pyrDown(base, base, goalSize, cv.BORDER_DEFAULT);
  
    cv.imshow('progressCanvas', base);
    cv.cvtColor(base, base, cv.COLOR_RGBA2RGB, 0);
    let mask = new cv.Mat();
    let bgdModel = new cv.Mat();
    let fgdModel = new cv.Mat();
    let rect = new cv.Rect(20, 20, base.cols - 20, base.rows - 20);

    cv.grabCut(base, mask, rect, bgdModel, fgdModel, 3, cv.GC_INIT_WITH_RECT);
    for (let i = 0; i < base.rows; i++) {
        for (let j = 0; j < base.cols; j++) {
            if (mask.ucharPtr(i, j)[0] == 0 || mask.ucharPtr(i, j)[0] == 2) {
                base.ucharPtr(i, j)[0] = 0;
                base.ucharPtr(i, j)[1] = 0;
                base.ucharPtr(i, j)[2] = 0;
            }
        }
    }
    cv.imshow('outputCanvas', base);
    base.delete();
    mask.delete();
    bgdModel.delete();
    fgdModel.delete();
}
