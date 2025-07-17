import React, { useEffect, useState } from "react";
import { fetchDataFromApi } from "../../utils/api";
import "./Associate.css";

const ViewAssociate = () => {
  const [associates, setAssociates] = useState([]);
  const [revenue, setRevenue] = useState([]);
  const [referrals, setReferrals] = useState([]);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    fetchAssociates();
    fetchRevenue();
    fetchReferrals();
  }, []);

  const fetchAssociates = async () => {
    try {
      const data = await fetchDataFromApi("/users/all-associates");
      setAssociates(data.associates);
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
    } catch (error) {
      console.error("Failed to fetch referrals:", error);
    }
  };

 const getReferralDetails = (id) => {
  return referrals
    .filter((r) => r.createdForId === id)
    .map((r) => {
      const percent = r.transactions?.[0]?.percent ?? "N/A";
      const commission = r.transactions?.reduce(
        (sum, tx) => sum + (tx.commission || 0),
        0
      ).toFixed(2);

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

  return (
    <div className="associate-container">
      <h2>Associate Commission Tracker</h2>
      <div className="table-wrapper">
        <table className="associate-table">
          <thead>
            <tr>
              <th>S No.</th>
              <th>Associate Name</th>
              <th>Email</th>
              <th>Level</th>
              <th>Details</th>
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
                  <td>
                    <button onClick={() => setExpanded(expanded === a.id ? null : a.id)}>
                      {expanded === a.id ? "Hide" : "Show"} Referral Details
                    </button>
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
                            <td colSpan={2}><b>Total Commission</b></td>
                            <td><b>₹ {getTotalCommission(a.id)}</b></td>
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
  );
};

export default ViewAssociate;
