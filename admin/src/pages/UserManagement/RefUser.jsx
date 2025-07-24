import { useState, useEffect, useContext } from "react";
import "./User.css";
import { myContext } from "../../App";
import { fetchDataFromApi } from "../../utils/api"; // Adjust the path if needed

const RefUser = () => {
  const context = useContext(myContext);
  const [referredUsers, setReferredUsers] = useState([]);

  useEffect(() => {
    fetchAndMergeData();
  }, []);

  const fetchAndMergeData = async () => {
    try {
      const allUsersRes = await fetchDataFromApi("/users/get-all");
      const referralDetailsRes = await fetchDataFromApi("/users/signup-referral");

      const allUsers = allUsersRes.users || [];
      const referralDetails = referralDetailsRes.users || [];

      const usersWithReferral = allUsers.filter((user) => user.usedReferralId);

      const mergedUsers = usersWithReferral.map((user) => {
        const referral = referralDetails.find((r) => r.id === user.id) || {};
        return {
          ...user,
          usedReferralCode: referral.usedReferralCode || "-",
          usedReferralOwner: referral.usedReferralOwner || "-",
          associateLevel: referral.associateLevel ?? "-",
          associatePercent: referral.associatePercent ?? "-",
        };
      });

      setReferredUsers(mergedUsers);
    } catch (error) {
      console.error("Error fetching or merging data:", error);
      context.setAlertBox({
        open: true,
        msg: "Failed to load referred users",
        error: true,
      });
    }
  };

  return (
    <div className="user-container">
      <div className="user-header">
        <h1>Users with Referral</h1>
        <p>Total: {referredUsers.length}</p> {/* ✅ Fixed variable name */}
      </div>

      {referredUsers.length === 0 ? (
        <div className="no-products"><p>No referred users found.</p></div>
      ) : (
        <div className="table-container">
          <table className="user-table">
            <thead>
              <tr>
                <th>Photo</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Referral Code</th>
                <th>Associate</th>
                <th>Level</th>
                <th>Percent</th>
              </tr>
            </thead>
            <tbody>
              {referredUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <img
                      src={user.imageUrl || "/placeholder.svg"}
                      alt="User"
                      className="user-photo"
                    />
                  </td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.phone || "-"}</td>
        
                  <td>{user.usedReferralCode}</td>
                  <td>{user.usedReferralOwner}</td>
                  <td>{user.associateLevel}</td>
                  <td>{user.associatePercent}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RefUser;
