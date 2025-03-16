import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import { Home } from "./Pages/index.js";
import "./App.css";

function App() {
  return (
    <>
      <div className="App">
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </Router>
      </div>
    </>
  );
}

export default App;
