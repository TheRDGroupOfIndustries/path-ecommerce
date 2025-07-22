// src/pages/Support/Support.jsx
import { useNavigate } from "react-router-dom";
import "./Support.css";

const subjects = ["Order", "Enquiry", "Product", "Refund"];

const Support = () => {
  const navigate = useNavigate();

  const handleClick = (subject) => {
  navigate(`/supportDetails?subject=${subject}`);

};

  return (
    <div className="support-container">
      <h2>Support Center</h2>
      <div className="subject-grid">
        {subjects.map((subject, index) => (
          <div key={index} className="subject-box" onClick={() => handleClick(subject)}>
            {subject}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Support;
