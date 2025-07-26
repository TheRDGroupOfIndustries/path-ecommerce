import { useState, useEffect } from "react";
import { fetchDataFromApi, deleteData } from "../../utils/api";
import { Trash2, X, Eye } from "lucide-react";
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
      console.log(res);
      
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
    let itemData = {};
    if (user.marketplaceId) {
      res = await fetchDataFromApi(`/marketplace/get-by-id/${user.marketplaceId}`);
      if (res?.marketplace) {
        itemData = { ...res.marketplace, type: "marketplace" };
      }
    } else if (user.propertyId) {
      res = await fetchDataFromApi(`/property/get-by-id/${user.propertyId}`);
      if (res) {
        itemData = { ...res.properties, type: "property" };
      }
    }

    setModalData({
      ...itemData,
      subject: user.subject,
      referralCode: user.referralCode,
      associate: user.associate,
    });
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
                {/* <div className="user-category">{user.phone}</div> */}

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
                <th>Type</th>
                <th>Referral</th>
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
                  {/* <td>{user.phone}</td> */}

                  <td>{user.marketplace ? "Marketplace" : "Property"}</td>
                  <td>{user.referralCode ? "Yes" : "No"}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="view-btn" onClick={() => openModal(user)}><Eye /></button>
                      <button className="delete-btn" onClick={() => handleDelete(user.id)}><Trash2 /></button>
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

            <h1>
              {modalData.type === "marketplace" ? "Marketplace Item" : "Property"} Details
            </h1>

            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
              <tbody>
                <tr>
                  <td style={{ padding: "8px", fontWeight: "bold" }}>Subject</td>
                  <td style={{ padding: "8px" }}>{modalData.subject}</td>
                </tr>
                <tr>
                  <td style={{ padding: "8px", fontWeight: "bold" }}>Name</td>
                  <td style={{ padding: "8px" }}>{modalData.name}</td>
                </tr>
                <tr>
                  <td style={{ padding: "8px", fontWeight: "bold" }}>Category</td>
                  <td style={{ padding: "8px" }}>{modalData.category || "N/A"}</td>
                </tr>
                <tr>
                  <td style={{ padding: "8px", fontWeight: "bold", verticalAlign: "top" }}>Description</td>
                  <td style={{ padding: "8px" }}>
                    <div className="clamp-description">{modalData.description}</div>
                  </td>
                </tr>

                  {/* Referral Code */}
                {modalData.referralCode && (
                  <tr>
                    <td style={{ padding: "8px", fontWeight: "bold" }}>Referral Code</td>
                    <td style={{ padding: "8px" }}>{modalData.referralCode}</td>
                  </tr>
                )}

                {/* Associate Details */}
                {modalData.associate && (
                  <>
                    <tr>
                      <td style={{ padding: "8px", fontWeight: "bold" }}>Associate Name</td>
                      <td style={{ padding: "8px" }}>{modalData.associate.name}</td>
                    </tr>
                    <tr>
                      <td style={{ padding: "8px", fontWeight: "bold" }}>Associate Email</td>
                      <td style={{ padding: "8px" }}>{modalData.associate.email}</td>
                    </tr>
                    <tr>
                      <td style={{ padding: "8px", fontWeight: "bold" }}>Associate Phone</td>
                      <td style={{ padding: "8px" }}>{modalData.associate.phone}</td>
                    </tr>
                  </>
                )}

                <tr>
                  <td style={{ padding: "8px", fontWeight: "bold" }}>Image</td>
                  <td style={{ padding: "8px" }}>
                    {modalData.image ? (
                      <img src={modalData.image} alt={modalData.name} style={{ maxWidth: "100%", borderRadius: "8px" }} />
                    ) : Array.isArray(modalData.imageUrl) && modalData.imageUrl.length > 0 ? (
                      <img src={modalData.imageUrl[0]} alt={modalData.name} style={{ maxWidth: "100%", borderRadius: "8px" }} />
                    ) : "No image available"}
                  </td>
                </tr>
              
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Enquiry;



