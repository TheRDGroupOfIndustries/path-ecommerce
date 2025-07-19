import React, { useEffect, useState } from "react";
import { fetchDataFromApi } from "../../utils/api";
import "./Associate.css";
import axios from "axios";

function EditAssociate({closeModal, id, level, percentageInt}) {
  const [selectedLevel, setSelectedLevel] = useState(level);
  const [percentage, setPercentage] = useState(percentageInt);
  const listLevel = Array.from({ length: 13 }, (_, i) => i); //till 12

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
    const req = await axios.put(`${import.meta.env.VITE_BASE_URL}/manage-associate/update/${id}`, {
      level: selectedLevel,
      percent: percentage
    })
    if (req.status === 200) {
      closeModal()
      window.location.reload();
      setLoading(false);
    }
  }
  return (
    <div
      style={{
        position: "absolute",
        inset: "0",
        background: "rgba(0, 0, 0, 0.8)",
        zIndex: 999,
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
      onClick={closeModal}
        style={{
          width: "3rem",
          height: "3rem",
          background: "#ff000d60",
          position: "absolute",
          top: "6rem",
          borderRadius: "70px",
          display: "grid",
          placeItems: "center",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-x-icon lucide-x"
        >
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
      </div>
      <div
        style={{
          width: "95%",
          height: "auto",
          background: "white",
          borderRadius: "16px",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "20px",
        }}
      >
        <h3 style={{ fontWeight: "800", fontSize: "1.5rem" }}>
          Edit Level & Percentage
        </h3>
        <select
          className="associate-select"
          defaultValue={selectedLevel}
          onChange={(e) => setSelectedLevel(e.target.value)}
          style={{
            width: "100%",
            padding: "18px",
            marginTop: "10px",
            background: "#eeeeee",
            border: "none",
            borderRadius: "8px",
            outline: "none",
          }}
        >
          {listLevel.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>

        <select
          className="associate-select"
          value={percentage}
          onChange={(e) => setPercentage(e.target.value)}
          style={{
            width: "100%",
            padding: "18px",
            marginTop: "10px",
            background: "#eeeeee",
            border: "none",
            borderRadius: "8px",
            outline: "none",
          }}
        >
          <option value="" disabled selected defaultValue={percentage}>
            Select percentage
          </option>
          {percentageList.length > 0 &&
            percentageList.map((level) => (
              <option key={level} value={level}>
                {level}
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
            marginTop: "10px",
            outline: "none",
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
        const res = await axios.delete(`${import.meta.env.VITE_BASE_URL}/manage-associate/delete/${id}`);
        if (res.status === 200) {
          fetchAssociates();
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
                    <td>{a.name.toLowerCase().split(" ")[0]}-{a.associate.percent}</td>
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
                          setPercentageInt(getReferralDetails(a.id)[0].percent);
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
