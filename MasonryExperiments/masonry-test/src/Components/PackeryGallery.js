import React from "react";

function PackeryTry() {
    const images = [
        { filename: "32. Plafond du Tombeau de Pa-Nehasi _Drah-Aboul-Negga_ _1911_ .jpg", resolution: [632, 800] },
        { filename: "A Shop and Two Figures _1882_ .jpg", resolution: [1253, 800] },
        { filename: "Einige Spitzen _1925_ .jpg", resolution: [573, 800] },
        { filename: "Abstract design based on berries and flowers _1900_ .jpg", resolution: [933, 800] },
        { filename: "Clouds _1910-1912_ .jpg", resolution: [651, 800] },
        { filename: "Artichoke _1915_ .jpg", resolution: [491, 800] },
        { filename: "Conversation _1935_ .jpg", resolution: [1137, 800] },
        { filename: "Untitled_ Leaf XXIII _1920-1921_ .jpg", resolution: [1099, 800] },
        { filename: "Ursulina II _1925_ .jpg", resolution: [637, 800] },
        { filename: "V noci _1936_ .jpg", resolution: [533, 800] },
        { filename: "Variation _around 1921_ .jpg", resolution: [597, 800] },
        { filename: "Vegetable-Analytic _1932_ .jpg", resolution: [315, 800] },
        { filename: "Venus _1904_05_ .jpg", resolution: [1567, 800] },
        { filename: "Venus _1917_ .jpg", resolution: [604, 800] },
        { filename: "Vigala Sass ja saatanlik jänes II paneel _2010_ .jpg", resolution: [448, 800] },
        { filename: "Vrouwenkop met half gesloten ogen in profiel naar links _1943-11-16_ .jpg", resolution: [507, 800] },
        { filename: "Wiese mit Storch und Frosch _1920_ .jpg", resolution: [596, 800] },
        { filename: "Winter in the High Tatras _1927_ .jpg", resolution: [1100, 800] },
        { filename: "Winter Landscape in Moonlight _1919_ .jpg", resolution: [713, 800] },
        { filename: "Zeilboten _1906_ .jpg", resolution: [573, 800] },
    ];

    const shuffledArray = images
        .map((value) => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value)
        .slice(0, 10)
        .sort((a, b) => a.resolution[0] - b.resolution[0]);

    const childElements = shuffledArray.map((element, index) => {
        let source = process.env.PUBLIC_URL + "/testImages/" + element.filename;
        return (
            <img
                src={source}
                alt={element.resolution[0] / element.resolution[1] + "format"}
                className="grid-item grid-width-fluid"
                style={{ width: "calc(7% + 23% * " + element.resolution[0] + "/ 1400)" }}
            ></img>
        );
    });

    return <div className="grid">{childElements}</div>;
}

export default PackeryTry;
