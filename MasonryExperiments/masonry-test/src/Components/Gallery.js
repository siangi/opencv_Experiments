import * as React from "react";
import Masonry from "react-masonry-component";

const masonryOptions = {
    transitionDuration: 0,
    columnWidth: ".grid-sizer",
    itemSelector: ".grid-item",
    gutter: 20,
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
        const childElements = this.images.map((element, index) => {
            let source = process.env.PUBLIC_URL + "/testImages/" + element.filename;
            return (
                <img
                    src={source}
                    alt={element.resolution[0] / element.resolution[1] + "format"}
                    className="grid-item grid-width-fluid"
                    style={{ width: "calc(10% + 20% * " + element.resolution[0] + "/ 1400)" }}
                ></img>
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
