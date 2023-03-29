import Masonry from "react-masonry-component";

export const StackOExample = ({ items }) => (
    <Masonry
        className={"grid"}
        options={{
            transitionDuration: 0,
            // use outer width of grid-sizer for columnWidth
            columnWidth: ".grid-sizer",
            // do not use .grid-sizer in layout
            itemSelector: ".grid-item",
            percentPosition: true,
        }}
    >
        {/* .grid-sizer empty element, only used for element sizing */}
        <div className="grid-sizer"></div>
        {items.map((item, index) => (index === 0 ? <div key={index} className="grid-item grid-item--width2"></div> : <div key={index} className="grid-item"></div>))}
    </Masonry>
);
