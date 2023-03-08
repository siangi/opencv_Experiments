cropImage = function (el) {
    let imageOriginal = cv.imread("imageDestination");
    let imageGray = new cv.Mat();
    let imageDestination = new cv.Mat();
    let imageDestination_all_contours = new cv.Mat();
    let imageDestination_mask = new cv.Mat();
    let imageDestination_masked = new cv.Mat();
    let imageDestination_cropped = new cv.Mat();
    let imageDestination_resized = new cv.Mat();
    let imageDestination_convex_hull = new cv.Mat();
    let imageDestination_rectangle = new cv.Mat();
    let imageMorphed = new cv.Mat();
    let contours = new cv.MatVector();
    let hierarchy = new cv.Mat();
    let hull = new cv.MatVector();
    let tmp = new cv.Mat();
    let Color_red = new cv.Scalar(255, 0, 0, 255);
    let Color_white = new cv.Scalar(255, 255, 255, 255);
    let area_max = 0;
    var ii = 0;
    let hull_max = 0;
    //initialize saliency algorithm variables
    let hsv = new cv.Mat();
    let hsvt = new cv.Mat();
    let mask2 = new cv.Mat();
    let hist = new cv.Mat();
    let srcVec = new cv.MatVector();
    let dstVec = new cv.MatVector();
    let channels = [0, 1];
    let histSize = [2, 2];
    let ranges = [0, 180, 0, 256];

    /* Prepare Image for to find contours ********************************************************************/

    //convert original BGR image to GRAY
    cv.cvtColor(imageOriginal, imageGray, cv.COLOR_BGR2GRAY);

    //option 5: Attempt to use saliency algorithms
    //Reference: https://jacobgil.github.io/computervision/saliency-from-backproj
    //Back-project the Hue, Saturation histogram of the entire image, on the image itself.
    //The back-projection for each channel pixel is just the intensity, divided by how many pixels have that intensity.
    //It’s an attempt to assign each pixel a probability of belonging to the background.
    //We use only 2 bins for each channel. That means we quantize the image into 4 colors (since we have 2 channels).
    //The more levels we use, the more details we get in the saliency map.
    srcVec.push_back(imageOriginal);
    dstVec.push_back(imageOriginal);
    cv.cvtColor(imageOriginal, hsv, cv.COLOR_BGR2HSV);
    cv.cvtColor(imageOriginal, hsvt, cv.COLOR_BGR2HSV);
    // calculating object histogram
    cv.calcHist(srcVec, channels, mask2, hist, histSize, ranges, 1);
    // normalize histogram and apply backprojection
    cv.normalize(hist, hist, 0, 255, cv.NORM_MINMAX);
    cv.calcBackProject(dstVec, channels, hist, imageMorphed, ranges, 1);
    cv.imshow("imageDestination_threshold", imageMorphed);

    //Problem: The below actually produces less accuracy!
    //Process the back-projection to get a saliency map. Enhance the contrast of the saliency map with histogram equalization,
    //and invert the image. The goal is to produce a smooth saliency map where salient regions have bright pixels.
    /*          cv.normalize(imageMorphed,imageMorphed,0,255,cv.NORM_MINMAX);
    let salienciesVec = new cv.MatVector();
    salienciesVec.push_back(imageMorphed);
    salienciesVec.push_back(imageMorphed);
    salienciesVec.push_back(imageMorphed);
    let saliency = new cv.Mat();
    cv.merge(salienciesVec, saliency);
    cv.cvtColor(saliency, saliency, cv.COLOR_BGR2GRAY);
    cv.equalizeHist(saliency, saliency);
    cv.threshold(saliency, imageMorphed, 177, 200, cv.THRESH_BINARY);
    cv.imshow('imageDestination_threshold', imageMorphed);
*/

    /* Find the contours ********************************************************************/

    //Good reference: https://docs.opencv.org/master/d0/d43/tutorial_js_table_of_contents_contours.html
    //Good reference: https://docs.opencv.org/master/d4/d73/tutorial_py_contours_begin.html
    //RETR_LIST - Retrieves all the contours, but doesn't create any parent-child relationship.
    //RETR_EXTERNAL - Returns only extreme outer contour
    //RETR_CCOMP - Retrieves all the contours and arranges them to a 2-level hierarchy.
    //RETR_TREE - Retrieves all the contours and creates a full family hierarchy list.
    //CHAIN_APPROX_NONE - Stores all the contour points. That is, any 2 subsequent points (x1,y1) and (x2,y2) of the contour will be either horizontal, vertical or diagonal neighbors
    //CHAIN_APPROX_SIMPLE - Compresses horizontal, vertical, and diagonal segments and leaves only their end points. For example, an up-right rectangular contour is encoded with 4 points
    cv.findContours(imageMorphed, contours, hierarchy, cv.RETR_LIST, cv.CHAIN_APPROX_SIMPLE);

    imageDestination_all_contours = imageOriginal.clone();
    cv.drawContours(imageDestination_all_contours, contours, -1, Color_red, 3);
    cv.imshow("imageDestination_all_contours", imageDestination_all_contours);
    $("#messagetouser_all_contours").html("Found: " + contours.size() + " contours in image");

    /* Review each contour and find the one we think is the coin and get it's convex hull *********************************/

    //Ignore any contour that looks like it's the entire image
    area_of_75_percent_of_entire_image = imageOriginal.rows * imageOriginal.cols - imageOriginal.rows * imageOriginal.cols * 0.25;
    console.log("Image area: ", imageOriginal.rows * imageOriginal.cols, " 75% threshold: ", area_of_75_percent_of_entire_image);

    imageDestination_convex_hull = imageOriginal.clone();

    for (let i = 0; i < contours.size(); ++i) {
        let cnt = contours.get(i);
        let area = cv.contourArea(cnt, false);
        //console.log("console_hull i: ", i, " area: ", area, " area_max: ", area_max, " delta: ");
        if (area >= area_max && area < area_of_75_percent_of_entire_image) {
            //console.log("larger area found: (", i, ") ", area, " >= ", area_max)
            area_max = area;
            ii = i;
            //convex hull see reference: https://docs.opencv.org/3.4/dc/dcf/tutorial_js_contour_features.html
            cv.convexHull(cnt, tmp, false, true);
            hull_max = tmp;
        }
    }

    hull.push_back(hull_max);

    //no max contour found above
    if (ii === 0) {
        console.log("found only 1 contour, using it...");
        hull_max = contours.get(0);
    }

    // draw contours
    for (let i = 0; i < hull.size(); ++i) {
        cv.drawContours(imageDestination_convex_hull, hull, i, Color_red, 3, 8, hierarchy, 0);
    }

    cv.imshow("imageDestination_convex_hull", imageDestination_convex_hull);
    $("#messagetouser_convex_hull").html(
        "reviewed this many contours: " +
            ii +
            " in an Image with area: " +
            imageOriginal.rows * imageOriginal.cols +
            " We only looked at contours that were less than: " +
            area_of_75_percent_of_entire_image +
            " or 75% of the image area "
    );

    /* Mask the part of the image we think is the coin *********************************/

    //fit an ellipse around the largest contour
    let rotatedRect = cv.fitEllipse(hull_max);

    //create the mask using the ellipse that is around the contour
    let mask = new cv.Mat.ones(imageOriginal.size(), cv.CV_8UC3);
    cv.ellipse1(mask, rotatedRect, Color_white, -1, cv.LINE_8);
    cv.cvtColor(mask, mask, cv.COLOR_BGR2GRAY);
    cv.imshow("imageDestination_mask", mask);
    $("#messagetouser_mask").html("rows: " + mask.rows + " cols: " + mask.cols + " type: " + mask.type() + " depth: " + mask.depth() + " channels: " + mask.channels());

    //overlay the mask on the image
    cv.bitwise_and(imageOriginal, imageOriginal, imageDestination_masked, mask);
    cv.imshow("imageDestination_masked", imageDestination_masked);
    $("#messagetouser_masked").html(
        "rows: " +
            imageDestination_masked.rows +
            " cols: " +
            imageDestination_masked.cols +
            " type: " +
            imageDestination_masked.type() +
            " depth: " +
            imageDestination_masked.depth() +
            " channels: " +
            imageDestination_masked.channels()
    );

    /* Draw a rectangle around the selected ellipse from above *********************************/

    imageDestination_rectangle = imageDestination_masked.clone();
    let x1 = rotatedRect.center.x - (rotatedRect.size.width / 2) * 1.03; //extending it 3%, note: this can cause API to fail if number goes negative
    let y1 = rotatedRect.center.y - (rotatedRect.size.height / 2) * 1.03; //extending it 3%
    let x2 = rotatedRect.center.x + (rotatedRect.size.width / 2) * 1.03; //extending it 3%
    let y2 = rotatedRect.center.y + (rotatedRect.size.height / 2) * 1.03; //extending it 3%
    let xpoint1 = new cv.Point(x1, y2);
    let xpoint2 = new cv.Point(x2, y1);
    cv.rectangle(imageDestination_rectangle, xpoint1, xpoint2, Color_red, 3, cv.LINE_8, 0);
    cv.imshow("imageDestination_rectangle", imageDestination_rectangle);
    $("#messagetouser_rectangle").html("rect around image = point1: " + x1 + " : " + y1 + " point2: " + x2 + " : " + y2);

    /* Crop the contour out of the image  *********************************/

    imageDestination_cropped = imageDestination_masked.clone();
    let rect = new cv.Rect(x1, y1, x2 - x1, y2 - y1);
    imageDestination_cropped = imageDestination_cropped.roi(rect); //perform the crop
    cv.imshow("imageDestination_cropped", imageDestination_cropped);
    $("#messagetouser_cropped").html("rect to crop: x1: " + x1 + " y1: " + y1 + " x2: " + (x2 - x1) + " y2: " + (y2 - y1));

    //Step 4: Resize the contour
    let dsize = new cv.Size(1000, 1000);
    cv.resize(imageDestination_cropped, imageDestination_resized, dsize, 0, 0, cv.INTER_AREA);
    cv.imshow("imageDestination_resized", imageDestination_resized);
    $("#messagetouser_resized").html(
        "rows: " +
            imageDestination_resized.rows +
            " cols: " +
            imageDestination_resized.cols +
            " type: " +
            imageDestination_resized.type() +
            " depth: " +
            imageDestination_resized.depth() +
            " channels: " +
            imageDestination_resized.channels()
    );

    imageOriginal.delete();
    imageDestination.delete();
    imageDestination_all_contours.delete();
    imageDestination_mask.delete();
    imageDestination_masked.delete();
    imageDestination_cropped.delete();
    imageDestination_resized.delete();
    imageDestination_convex_hull.delete();
    imageDestination_rectangle.delete();
    imageMorphed.delete();
    contours.delete();
    hierarchy.delete();
    tmp.delete();
    hsv.delete();
    hsvt.delete();
    mask2.delete();
    hist.delete();
};
