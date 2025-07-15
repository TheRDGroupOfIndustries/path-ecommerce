import { useState, useEffect } from "react";
import { fetchDataFromApi, deleteData } from "../../utils/api";
import { Trash2 } from "lucide-react";

const Enquiry = () => {
  const [users, setUsers] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);


  useEffect(() => {
    window.scrollTo(0, 0);
    fetchEnquiry();
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 600);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchEnquiry = async () => {
    const res = await fetchDataFromApi("/enquiry/get-all");
    if (res && Array.isArray(res)) {
      setUsers(res);
    } else {
      console.error("Unexpected API response:", res);
      setUsers([]);
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this Item?")) {
      try {
        await deleteData(`/enquiry/delete/${userId}`);
        setUsers(users.filter((user) => user.id !== userId));
      } catch (error) {
        console.error("Delete error:", error);
        alert("Failed to delete item.");
      }
    }
  };

  return (
    <div className="user-container">
      <div className="user-header">
        <h1>View Enquiries</h1>
        <div className="user-stats">
          <span>Total Enquiry: {users.length}</span>
        </div>
      </div>

     {users.length === 0 ? (
        <div className="no-products">
          <p>No Item found.</p>
        </div>
      ) : (
        isMobile ? (
          <div className="user-list">
            {users.map((user) => (
              <div className="user-card" key={user.id}>
                <div style={{ flex: 1 }}>
                  <div className="user-name"><strong>{user.name}</strong></div>
                  <div className="user-description description-clamp">{user.message}</div>
                  <div className="user-category">{user.email}</div>
                   <div className="user-category">{user.phone}</div>
                  <div className="actions">
                    <div className="action-buttons">
                      <button className="delete-btn" onClick={() => handleDelete(user.id)}><Trash2 /></button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="table-container">
            <table className="user-table">
              <thead>
                <tr>
                  <th>Serial</th>
                  <th>Name</th>
                  <th>Message</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user.id}>
                    <td>{index + 1}</td>
                    <td>{user.name}</td>
                    <td><div className="description-clamp">
                      {user.message}
                    </div></td>

                    <td>{user.email}</td>
                    <td>{user.phone}</td>
                    <td>
                      <div className="action-buttons">
                      <button className="delete-btn" onClick={() => handleDelete(user.id)}><Trash2 /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}
    </div>
  );
};

export default Enquiry;





