import React, { useEffect, useState } from "react";
import { fetchDataFromApi, editData,deleteData } from "../../utils/api";
import "./Associate.css";
function EditAssociate({ closeModal, id, level, percentageInt }) {
  const [selectedLevel, setSelectedLevel] = useState(level ?? 0);
  const [percentage, setPercentage] = useState(percentageInt ?? "");
  const [percentageList, setPercentageList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const tempList = [];
    for (let i = 0; i <= 20; i++) {
      tempList.push(5 * i);
    }
    setPercentageList(tempList);
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await editData(`/manage-associate/update/${id}`, {
        level: Number(selectedLevel),
        percent: Number(percentage),
      });

      if (res) {
        closeModal();
        window.location.reload();
      }
    } catch (error) {
      console.error("Failed to update associate:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0, 0, 0, 0.8)",
      zIndex: 99999,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}>
      <div style={{
        position: "relative",
        width: "50%",
        maxWidth: "600px",
        background: "white",
        borderRadius: "16px",
        padding: "40px 20px 20px 20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "20px",
      }}>
        {/* Close button at top right */}
        <div
          onClick={closeModal}
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            width: "2.5rem",
            height: "2.5rem",
            background: "#ff000d60",
            borderRadius: "50%",
            display: "grid",
            placeItems: "center",
            cursor: "pointer",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-x"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </div>

        <h3 style={{ fontWeight: "800", fontSize: "1.5rem" }}>
          Edit Level & Percentage
        </h3>

        <select
          value={selectedLevel}
          onChange={(e) => setSelectedLevel(Number(e.target.value))}
          style={{
            width: "100%",
            padding: "18px",
            background: "#eeeeee",
            border: "none",
            borderRadius: "8px",
            outline: "none",
          }}
        >
          {Array.from({ length: 13 }, (_, i) => (
            <option key={i} value={i}>
              Level {i}
            </option>
          ))}
        </select>

        <select
          value={percentage}
          onChange={(e) => setPercentage(Number(e.target.value))}
          style={{
            width: "100%",
            padding: "18px",
            background: "#eeeeee",
            border: "none",
            borderRadius: "8px",
            outline: "none",
          }}
        >
          <option value="" disabled>
            Select percentage
          </option>
          {percentageList.map((p) => (
            <option key={p} value={p}>
              {p}%
            </option>
          ))}
        </select>

        <button
          onClick={handleSave}
          disabled={loading}
          style={{
            width: "100%",
            background: "deepskyblue",
            border: "none",
            padding: "12px 0",
            color: "white",
            borderRadius: "8px",
          }}
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}


const ViewAssociate = () => {
  const [associates, setAssociates] = useState([]);
  const [revenue, setRevenue] = useState([]);
  const [referrals, setReferrals] = useState([]);
  const [expanded, setExpanded] = useState(null);

  const [model, setModel] = useState(false);
  const [level, setLevel] = useState(0);
  const [percentageInt, setPercentageInt] = useState(0);
  const [id, setId] = useState("")
  useEffect(() => {
    fetchAssociates();
    fetchRevenue();
    fetchReferrals();
  }, []);

  const fetchAssociates = async () => {
    try {
      const data = await fetchDataFromApi("/users/all-associates");
      setAssociates(data.associates);
      console.log(data);
      
    } catch (error) {
      console.error("Failed to fetch associates:", error);
    }
  };

  const fetchRevenue = async () => {
    try {
      const data = await fetchDataFromApi("/referral/revenue");
      setRevenue(data);
    } catch (error) {
      console.error("Failed to fetch revenue:", error);
    }
  };

  const fetchReferrals = async () => {
    try {
      const data = await fetchDataFromApi("/referral/all");
      setReferrals(data);
      // console.log(data);
      
    } catch (error) {
      console.error("Failed to fetch referrals:", error);
    }
  };

  const getReferralDetails = (id) => {
    return referrals
      .filter((r) => r.createdForId === id)
      .map((r) => {
        const percent = r.transactions?.[0]?.percent ?? "N/A";
        const commission = r.transactions
          ?.reduce((sum, tx) => sum + (tx.commission || 0), 0)
          .toFixed(2);
        return {
          code: r.referral,
          percent,
          commission,
        };
      });
  };

  // Get total commission for an associate
  const getTotalCommission = (id) => {
    const entry = revenue.find((r) => r.associateId === id);
    return entry?.totalCommission?.toFixed(2) || "0.00";
  };

 const handleDelete = async (id) => {
  if (window.confirm("Are you sure you want to delete this associate?")) {
    try {
      const res = await deleteData(`/manage-associate/delete/${id}`);
      if (res) {
        fetchAssociates(); // refresh list
      }
    } catch (error) {
      console.error("Failed to delete associate:", error);
    }
  }
};
 
  // console.log(model, level, percentageInt, expanded);
  return (
    <>
    {
      model && (
        <EditAssociate 
        closeModal={() => setModel(false)}
        id={id}
        level={level}
        percentageInt={percentageInt}
        />

      )
    }
      <div className="associate-container" style={{ position: "relative" }}>
        <h2>Associate Commission Tracker</h2>
        <div className="table-wrapper">
          <table className="associate-table">
            <thead>
              <tr>
                <th>S No.</th>
                <th>Associate Name</th>
                <th>Email</th>
                <th>Level</th>
                <th>Referral code</th>
                <th>Details</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {associates?.map((a, index) => (
                <React.Fragment key={a.id}>
                  <tr>
                    <td>{index + 1}</td>
                    <td>{a.name}</td>
                    <td>{a.email}</td>
                    <td>{a.associate?.level || "N/A"}</td>
                   <td>{a.name.toLowerCase().split(" ")[0]}-{a.associate?.percent ?? "N/A"}</td>

                    <td>
                      <button
                        onClick={() =>
                          setExpanded(expanded === a.id ? null : a.id)
                        }
                      >
                        {expanded === a.id ? "Hide" : "Show"} Details
                      </button>
                    </td>
                    <td
                      style={{
                        display: "flex",
                        gap: "18px",
                        padding: "25px 10px",
                      }}
                    >
                      <button
                        onClick={() => {
                          setModel(true);
                          setLevel(a.associate?.level);
                            // const firstReferral = getReferralDetails(a.id)[0];
                            setPercentageInt(a.associate?.percent ?? "");
                          setId(a.id)
                          // console.log(getReferralDetails(a.id)[0].percent);
                        }}
                        style={{ color: "deepskyblue" }}
                      >
                        Edit
                      </button>
                      <button style={{color: 'red'}}
                      onClick={() => handleDelete(a.id)}
                      >Delete</button>
                    </td>
                  </tr>
                  {expanded === a.id && (
                    <tr>
                      <td colSpan={5}>
                        <table className="subtable">
                          <thead>
                            <tr>
                              <th>Referral Code</th>
                              <th>Percentage (%)</th>
                              <th>Commission (₹)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {getReferralDetails(a.id).map((ref, idx) => (
                              <tr key={idx}>
                                <td>{ref.code}</td>
                                <td>{ref.percent}</td>
                                <td>₹ {ref.commission}</td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot>
                            <tr>
                              <td colSpan={2}>
                                <b>Total Commission</b>
                              </td>
                              <td>
                                <b>₹ {getTotalCommission(a.id)}</b>
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ViewAssociate;
