import { useState, useEffect } from "react";
import { fetchDataFromApi, deleteData } from "../../utils/api";
import { Trash2, X,Eye } from "lucide-react";
import "./Enquiry.css";

const Enquiry = () => {
  const [users, setUsers] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);
  const [modalData, setModalData] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchEnquiry();
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 600);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchEnquiry = async () => {
    const res = await fetchDataFromApi("/enquiry/by-role");
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

  const openModal = async (user) => {
  let res;
  if (user.marketplaceId) {
    res = await fetchDataFromApi(`/marketplace/get-by-id/${user.marketplaceId}`);
    if (res?.marketplace) {
      setModalData({ ...res.marketplace, type: "marketplace", subject: user.subject });
    } else {
      setModalData({ error: true });
    }
  } else if (user.propertyId) {
    res = await fetchDataFromApi(`/property/get-by-id/${user.propertyId}`);
    if (res) {
      setModalData({ ...res.properties, type: "property", subject: user.subject });
    } else {
      setModalData({ error: true });
    }
  } else {
    setModalData({ error: true });
  }
};



  const closeModal = () => setModalData(null);

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
      ) : isMobile ? (
        <div className="user-list">
          {users.map((user) => (
            <div className="user-card" key={user.id}>
              <div style={{ flex: 1 }}>
                <div className="user-name"><strong>{user.name}</strong></div>
                <div className="user-description description-clamp">{user.message}</div>
                <div className="user-category">{user.email}</div>
                <div className="user-category">{user.phone}</div>

                <div className="action-buttons">
                  <button className="delete-btn" onClick={() => handleDelete(user.id)}><Trash2 /></button>
                  <button className="view-btn" onClick={() => openModal(user)}>View Details</button>
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
                  <td><div className="description-clamp">{user.message}</div></td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="delete-btn" onClick={() => handleDelete(user.id)}><Trash2 /></button>
                      <button className="view-btn" onClick={() => openModal(user)}><Eye/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL */}
     {modalData && (
  <div className="modal-overlay">
    <div className="modal-box">
      <button className="close-btnn2" onClick={closeModal}><X /></button>

      {modalData.error ? (
        <p>This enquiry is not linked to any marketplace or property.</p>
      ) : (
        <>
          <h1>
            {modalData.type === "marketplace" ? "Marketplace Item" : "Property"} Details
          </h1>

          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
            <tbody>
              <tr>
                <td style={{ padding: "8px", fontWeight: "bold" }}>Subject:</td>
                <td style={{ padding: "8px" }}>{modalData.subject}</td>
              </tr>
              <tr>
                <td style={{ padding: "8px", fontWeight: "bold" }}>Name:</td>
                <td style={{ padding: "8px" }}>{modalData.name}</td>
              </tr>
              <tr>
                <td style={{ padding: "8px", fontWeight: "bold" }}>Category:</td>
                <td style={{ padding: "8px" }}>{modalData.category || "N/A"}</td>
              </tr>
              <tr>
                <td style={{ padding: "8px", fontWeight: "bold" }}>Description:</td>
                <td style={{ padding: "8px" }}>{modalData.description}</td>
              </tr>
              <tr>
                <td style={{ padding: "8px", fontWeight: "bold", verticalAlign: "top" }}>Image:</td>
                <td style={{ padding: "8px" }}>
                  {(modalData.image || modalData.imageUrl) ? (
                    <img
                      src={modalData.image || modalData.imageUrl}
                      alt={modalData.name}
                      style={{ maxWidth: "100%", borderRadius: "8px" }}
                    />
                  ) : (
                    "No image available"
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </>
      )}
    </div>
  </div>
)}

    </div>
  );
};

export default Enquiry;
