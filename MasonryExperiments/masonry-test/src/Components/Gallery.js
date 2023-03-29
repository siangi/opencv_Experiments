import * as React from "react";
import Masonry from "react-masonry-component";

const masonryOptions = {
    transitionDuration: 0,
    columnWidth: ".grid-sizer",
    itemSelector: ".grid-item",
    gutter: 10,
};
class Gallery extends React.Component {
    // get 6 the full folder
    images = [
        { filename: "32. Plafond du Tombeau de Pa-Nehasi _Drah-Aboul-Negga_ _1911_ .jpg", resolution: [632, 800] },
        { filename: "A Shop and Two Figures _1882_ .jpg", resolution: [1253, 800] },
        { filename: "Einige Spitzen _1925_ .jpg", resolution: [573, 800] },
        { filename: "Abstract design based on berries and flowers _1900_ .jpg", resolution: [933, 800] },
        { filename: "Clouds _1910-1912_ .jpg", resolution: [651, 800] },
        { filename: "Artichoke _1915_ .jpg", resolution: [491, 800] },
        { filename: "Conversation _1935_ .jpg", resolution: [1137, 800] },
    ];

    render() {
        function sizeClassesFromResolution(width, height) {
            let format = width / height;
            let sizeClasses = "";

            if (format >= 3) {
                sizeClasses += "grid-item-width3";
            } else if (format >= 2) {
                sizeClasses += "grid-item-width2";
            } else if (format <= 1) {
                sizeClasses += "grid-item-height2";
            } else if (format < 0.5) {
                sizeClasses += "grid-item-height3";
            }

            return sizeClasses;
        }

        function imageClassFromResolution(width, height) {
            let format = width / height;

            if (format < 0.8) {
                return "image-wide";
            } else {
                return "image-tall";
            }
        }

        const childElements = this.images.map((element, index) => {
            let source = process.env.PUBLIC_URL + "/testImages/" + element.filename;
            return (
                <div className={"grid-item " + sizeClassesFromResolution(element.resolution[0], element.resolution[1])}>
                    <img src={source} alt={element.filename} className={imageClassFromResolution(element.resolution[0], element.resolution[1])}></img>
                </div>
            );
        });

        return (
            <div>
                <Masonry
                    className={"grid"} // default ''
                    elementType={"div"} // default 'div'
                    options={masonryOptions}
                    disableImagesLoaded={false} // default false
                    updateOnEachImageLoad={false} // default false and works only if disableImagesLoaded is false
                >
                    <div className="grid-sizer"></div>
                    {childElements}
                </Masonry>
            </div>
        );
    }
}

export default Gallery;
