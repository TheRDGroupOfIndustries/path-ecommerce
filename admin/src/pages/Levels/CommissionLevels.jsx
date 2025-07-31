import { useEffect, useState ,useContext} from "react";
import "./CommissionLevels.css";
import { patchData,fetchDataFromApi } from "../../utils/api"; 
import { myContext } from "../../App";

export default function CommissionLevels() {
  const context = useContext(myContext);
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false); 

  const mockLevels = Array.from({ length: 12 }).map((_, i) => ({
    level: i + 1,
    percent: 0,
  }));

  useEffect(() => {
    const timer = setTimeout(() => {
      setLevels(mockLevels);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
  fetchLevels();
}, []);


  const handleChange = (index, value) => {
    const updated = [...levels];
    updated[index].percent = value;
    setLevels(updated);
  };


    const fetchLevels = async () => {
      try {
        const res = await fetchDataFromApi("/level");
        if (Array.isArray(res)) {
          setLevels(res);
        } else {
          console.warn("Unexpected response format:", res);
        }

      } catch (error) {
        console.error("Failed to fetch levels:", error);
      } finally {
        setLoading(false);
      }
    };

const handleSave = async () => {
  setSaving(true);
  try {
    await patchData("/level/save", levels);
    context.setAlertBox({
        open: true,
        msg: "Commission Percent saved successfully!",
        error: false,
      });
    await fetchLevels(); 
  } catch (err) {
       context.setAlertBox({
        open: true,
        msg: "Failed to save commission Percent.",
        error: true,
      });
    console.error(err);
  } finally {
    setSaving(false);
  }
};


  if (loading) return <div>Loading...</div>;

  return (
    <>
      <div className="page-header">
        <h1>Commission Levels</h1>
        <p>Configure commission percentages for each referral level</p>
      </div>

      <div className="commission-container">
        <table className="commission-table" border="1" cellPadding={8} cellSpacing={0}>
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
                    value={lvl.percent}
                    onChange={(e) =>
                      handleChange(idx, parseFloat(e.target.value) || 0)
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button className="save-button" onClick={handleSave} disabled={saving}>
          {saving ? (
            <>
              <span className="spinner"></span> Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </button>
      </div>
    </>
  );
}

