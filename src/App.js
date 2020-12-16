import React from "react";

import InteractiveMap from "./components/InteractiveMap";
import ModelViewerThree from "./components/ModelViewerThree";

// "homepage": "https://robertasliekis.github.io/skaudvile/",
// "homepage": "http://zemelapis.kernave.org/",

function App() {
  return (
    <div className="App">
      <div className="overflow-wrapper">
        <div className="website-wrapper">
          <InteractiveMap />
        </div>
      </div>
    </div>
  );
}

export default App;
