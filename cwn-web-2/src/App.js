import "./App.css";
import Home from "./containers/Home";
import { HashRouter, Routes, Route } from "react-router-dom";
import "antd/dist/antd.css";

function App() {
  return (
    <div className="App">
      <HashRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path=":glyph" element={<Home />} />
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;
