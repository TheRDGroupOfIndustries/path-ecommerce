import React, { useEffect, useState } from "react";
import { fetchDataFromApi } from "../../utils/api"; // adjust the path based on your structure
import "./Associate.css";

const ViewAssociate = () => {
  const [associates, setAssociates] = useState([]);
  const [revenue, setRevenue] = useState([]);
  const [referrals, setReferrals] = useState([]);

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

  const getCommission = (id) => {
    const entry = revenue.find((r) => r.associateId === id);
    return entry?.totalCommission?.toFixed(2) || "0.00";
  };

  const getReferralCode = (id) => {
    const referral = referrals.find((r) => r.createdForId === id);
    return referral?.referral || "N/A";
  };

  return (
    <div className="associate-container">
      <h2>Associate Commission Tracker</h2>
      <div className="table-wrapper">
        <table className="associate-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Associate Name</th>
              <th>Email</th>
              <th>Level</th>
              <th>Referral %</th>
              <th>Referral Code</th>
              <th>Commission Earned (₹)</th>
            </tr>
          </thead>
          <tbody>
            {associates?.map((a, index) => (
              <tr key={a.id}>
                <td>{index + 1}</td>
                <td>{a.name}</td>
                <td>{a.email}</td>
                <td>{a.associate?.level || "N/A"}</td>
                <td>{a.associate?.percent || "N/A"}%</td>
                <td>{getReferralCode(a.id)}</td>
                <td>₹ {getCommission(a.id)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewAssociate;
