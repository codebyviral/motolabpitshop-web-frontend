import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import { Home, LoginForm } from "./Pages/index.js";
import "./App.css";

function App() {
  return (
    <>
      <div className="App">
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginForm />} />
          </Routes>
        </Router>
      </div>
    </>
  );
}

export default App;
