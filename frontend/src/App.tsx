import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "./Home";
import "./App.css";
import JobDetails from "./JobDetails";

export function App() {
  return (
    <Router>
      <h1>Job Not Found</h1>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/job/:jobId" element={<JobDetails />} />
      </Routes>
    </Router>
  );
}
