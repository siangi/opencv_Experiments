import React from "react";
import DraggableGrid, { DraggableItem } from "ruuri";
import { useRef, useEffect } from "react";

function MuuriGallery() {
    const gridRef = useRef(null)

    function refreshMuuriLayout(event){
        gridRef.current.grid.refreshItems().layout();
    }
    let images = [
        { filename: "32. Plafond du Tombeau de Pa-Nehasi _Drah-Aboul-Negga_ _1911_ .jpg", resolution: [632, 800], main: false },
        { filename: "A Shop and Two Figures _1882_ .jpg", resolution: [1253, 800], main: false },
        { filename: "Einige Spitzen _1925_ .jpg", resolution: [573, 800], main: false },
        { filename: "Abstract design based on berries and flowers _1900_ .jpg", resolution: [933, 800], main: false },
        { filename: "Clouds _1910-1912_ .jpg", resolution: [651, 800], main: false },
        { filename: "Artichoke _1915_ .jpg", resolution: [491, 800], main: false },
        { filename: "Conversation _1935_ .jpg", resolution: [1137, 800], main: false },
        { filename: "Untitled_ Leaf XXIII _1920-1921_ .jpg", resolution: [1099, 800], main: false },
        { filename: "Ursulina II _1925_ .jpg", resolution: [637, 800], main: false },
        { filename: "V noci _1936_ .jpg", resolution: [533, 800], main: false },
        { filename: "Variation _around 1921_ .jpg", resolution: [597, 800], main: false },
        { filename: "Vegetable-Analytic _1932_ .jpg", resolution: [315, 800], main: false },
        { filename: "Venus _1904_05_ .jpg", resolution: [1567, 800], main: false },
        { filename: "Venus _1917_ .jpg", resolution: [604, 800], main: false },
        { filename: "Vigala Sass ja saatanlik jänes II paneel _2010_ .jpg", resolution: [448, 800], main: false , main: false},
        { filename: "Vrouwenkop met half gesloten ogen in profiel naar links _1943-11-16_ .jpg", resolution: [507, 800], main: false },
        { filename: "Wiese mit Storch und Frosch _1920_ .jpg", resolution: [596, 800], main: false },
        { filename: "Winter in the High Tatras _1927_ .jpg", resolution: [1100, 800], main: false },
        { filename: "Winter Landscape in Moonlight _1919_ .jpg", resolution: [713, 800], main: false },
        { filename: "Le Temps __1929_ .jpg", resolution: [2659, 800], main: false },
        { filename: "In Vaudeville_ Acrobatic Male Dancer with Top Hat _1920_ .jpg", resolution: [495, 800], main: false },
        { filename: "Aussee II _1911_14_ .jpg", resolution: [1858, 800], main: false },
    ];

    const shuffledArray = images
        .map((value) => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value)
        .slice(0, 7)
    
    shuffledArray[Math.floor(shuffledArray.length / 2)].main = true;

    //https://docs.muuri.dev/grid-options.html
    //https://www.npmjs.com/package/ruuri
    const childElements = shuffledArray.map((element, index) => {
        let source = process.env.PUBLIC_URL + "/testImages/" + element.filename;
        return (
            <DraggableItem key={index} className="grid-item">
                {/*  { width: "calc(4vw + 15vw * " + element.resolution[0] + "/ 1400)"}*/}
                {element.main?
                    <img src={source} className="main-image" alt={element.resolution[0] / element.resolution[1] + "format"} style={{ width: "calc(14vw + 25vw * " + element.resolution[0] + "/ 1400)"}} onLoad={() => refreshMuuriLayout()}></img>
                    :<img src={source} alt={element.resolution[0] / element.resolution[1] + "format"} style={{ width: "calc(7vw + 20vw * " + element.resolution[0] + "/ 1400)"}} onLoad={() => refreshMuuriLayout()}></img>
                }
            </DraggableItem>
        );
    });

    return (
        <div>
            <DraggableGrid
                containerClass= "grid"
                dragEnabled={false}
                itemClass= "grid-item-container"
                layout={{
                    fillGaps: false,
                }}
                ref={gridRef}
            >
                {childElements}
            </DraggableGrid>
        </div>
    );
}

export default MuuriGallery;
