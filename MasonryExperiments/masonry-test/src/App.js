import "./App.css";
import Gallery from "./Components/Gallery";
import MuuriGallery from "./Components/MuuriGallery";

function App() {
    // let divList = ["1", "2", "3", "4"];
    return (
        <div className="App">
            {/* <StackOExample items={divList}></StackOExample> */}
            <MuuriGallery></MuuriGallery>
        </div>
    );
}

export default App;
