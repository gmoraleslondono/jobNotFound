import { useEffect, useState } from "react";
import axios from "axios";

export const Home = () => {
  const [jobsList, setJobsList] = useState([]);

  const fetchJobsList = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/jobsList");
      console.log(response.data.hits);
      setJobsList(response.data.hits);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchJobsList();
  }, []);

  return (
    <div>
      <h1>Welcome to Job Not Found</h1>
      <p>Your one-stop solution for finding the perfect job.</p>
      <div>
        {jobsList.map((job: any, index: number) => (
          <div key={index}>
            <h2>{job.headline}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};
