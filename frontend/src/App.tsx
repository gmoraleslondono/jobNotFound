import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "./Home";
import { Favorites } from "./Favorites";
import { JobApplications } from "./JobApplications";
import { Header } from "./Header";
import "./App.css";
import { JobDetails } from "./JobDetails";

export function App() {
  return (
    <Router>
      <Header />
      <main className="app-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/applications" element={<JobApplications />} />
          <Route path="/job/:jobId" element={<JobDetails />} />
        </Routes>
      </main>
    </Router>
  );
}
