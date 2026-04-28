import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "./Home";
import "./App.css";

export function App() {
  return (
    <Router>
      <h1>Job Not Found</h1>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}
