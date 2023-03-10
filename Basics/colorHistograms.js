let imgElement = document.getElementById("imageSrc");
imgElement.onload = () => {
    // calcHueHistogram();
  fullHSVHistogram();
};

let inputElement = document.querySelector("#fileInput");
inputElement.addEventListener(
  "change",
  (e) => {
    imgElement.src = URL.createObjectURL(e.target.files[0]);
  },
  false
);

function calcGrayHistogram() {
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

function calcHueHistogram() {
  let base = cv.imread(imgElement);
  let hsv = new cv.Mat();
  cv.cvtColor(base, hsv, cv.COLOR_RGB2HSV, 0);
  let hsvVectors = new cv.MatVector();
  cv.split(hsv, hsvVectors);
  let hues = hsvVectors.get(0);
  let huesVector = new cv.MatVector();
  huesVector.push_back(hues);
  let histogram = new cv.Mat();
  let mask = new cv.Mat();
  const binCount = 180;
  cv.calcHist(huesVector, [0], mask, histogram, [binCount], [0, 180], false);

  // plot histogram
  let color = new cv.Scalar(255, 0, 0);
  let scale = 2;
  let plot = new cv.Mat.zeros(base.rows, binCount * scale, cv.CV_8UC3);
  for (let i = 0; i < binCount; i++) {
    // use 32F because normal data gives 4 times as many values
    let binVal = (histogram.data32F[i] * base.rows) / binCount;
    let point1 = new cv.Point(i * scale, base.rows - 1);
    let point2 = new cv.Point((i + 1) * scale - 1, base.rows - binVal);
    cv.rectangle(plot, point1, point2, color, cv.FILLED);
  }
  

  cv.imshow("outputCanvas", plot);
  

  console.log(histogram.data32F);
  base.delete();
  hsv.delete();
  hues.delete();
}

function fullHSVHistogram() {
  let base = cv.imread(imgElement);
  let hsv = new cv.Mat();
  let mask = new cv.Mat();
  let histogram = new cv.Mat();
  let hist_dimensions = [18, 25, 25]
  cv.cvtColor(base, hsv, cv.COLOR_RGB2HSV, 0);
  let vector = new cv.MatVector();
  vector.push_back(hsv);

  cv.calcHist(
    vector,
    [0, 1, 2],
    mask,
    histogram,
    hist_dimensions,
    [0, 180, 0, 256, 0, 256],
    false
  );
  cv.normalize(histogram, histogram, 0, 100, cv.NORM_MINMAX);
 
    let biggest = getBiggestValuesLocations(histogram, hist_dimensions[0], hist_dimensions[1], hist_dimensions[2]);
    console.log(biggest);
}

function getBiggestValuesLocations(histogram, amount, dim1, dim2, dim3){
    let biggest = [];
    let dummy = new ValuePosition(-1, [-1, -1, -1]);
    biggest.push(dummy)
    let counter = 0;
    for (i = 0; i < dim1; i++){
        for(j = 0; j < dim2; i++){
            for(k = 0; k < dim3; k++){
                // let newVal = histogram.floatAt(i, j, k);
                // if(biggest[biggest.length - 1].value < newVal){
                //     let toPush = new ValuePosition(newVal, [i,j,k]);
                //     biggest.push(toPush);
                //     biggest.sort((a, b) => a.value - b.value);
                //     if(biggest.length > amount){
                //         biggest.pop();
                //     }
                // }
                counter++;
            }
        }
    }

    return biggest;

}
