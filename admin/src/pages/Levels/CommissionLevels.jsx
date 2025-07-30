import { useEffect, useState } from "react";
import "./CommissionLevels.css";

export default function CommissionLevels() {
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data: 12 levels with default commission percentages
  const mockLevels = Array.from({ length: 12 }).map((_, i) => ({
    level: i + 1,
    commission: 0,
  }));

  useEffect(() => {
    // Simulate async loading delay
    const timer = setTimeout(() => {
      setLevels(mockLevels);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleChange = (index, value) => {
    const updated = [...levels];
    updated[index].commission = value;
    setLevels(updated);
  };

  const handleSave = () => {
    alert("This is a mock save. No API call done.");
    console.log("Commission levels to save:", levels);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <div className="page-header">
        <h1>Commission Levels</h1>
        <p>Configure commission percentages for each referral level</p>
      </div>

      <div className="commission-container">
        <table
          className="commission-table"
          border="1"
          cellPadding={8}
          cellSpacing={0}
        >
          <thead>
            <tr>
              <th>Level</th>
              <th>Percentage (%)</th>
            </tr>
          </thead>
          <tbody>
            {levels.map((lvl, idx) => (
              <tr key={lvl.level}>
                <td>{lvl.level}</td>
                <td>
                  <input
                    type="number"
                    min={0}
                    step="0.1"
                    className="commission-input"
                    value={lvl.commission}
                    onChange={(e) =>
                      handleChange(idx, parseFloat(e.target.value) || 0)
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="save-button" onClick={handleSave}>
          Save Changes
        </button>
      </div>
    </>
  );
}
