import { useEffect, useState,useRef } from "react";
import { fetchDataFromApi, patchData } from "../../utils/api";
import "./AdminKycList.css";

const AdminKYCList = () => {
  const [kycs, setKycs] = useState([]);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    const fetchKycs = async () => {
      try {
        const data = await fetchDataFromApi("/kyc/all");
        setKycs(data);
      } catch (err) {
        console.error("Failed to fetch KYC data:", err);
      }
    };

    fetchKycs();
  }, []);

  const handleApproval = async (id, status) => {
    try {
      const endpoint = status === "APPROVED" ? "approve" : "reject";
      await patchData(`/kyc/${endpoint}/${id}`);
      setKycs((prev) =>
        prev.map((k) => (k.id === id ? { ...k, status } : k))
      );
    } catch (err) {
      console.error(`Failed to update status to ${status}:`, err);
    }
  };

  const handlePreview = (url) => {
    if (!url || url.trim() === "") {
      alert("No file uploaded.");
      return;
    }
    setPreviewUrl(url);
  };

  return (
    <div className="admin-kyc-wrapper">
      <h3 className="admin-kyc-title">All KYC Submissions</h3>
      <div className="table-container">
        <table className="admin-kyc-table">
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Aadhar Number</th>
              <th>PAN Number</th>
              <th>Salary Slip</th>
              <th>Passport</th>
              <th>Bank Statement</th>
              <th>Aadhar Front</th>
              <th>Aadhar Back</th>
              <th>PAN Card</th>
              <th>Profile Image</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {kycs.map((kyc) => (
              <tr key={kyc.id}>
                <td>{kyc.fullName}</td>
                <td>{kyc.email}</td>
                <td>{kyc.phoneNumber}</td>
                <td>{kyc.address}</td>
                <td>{kyc.aadharNumber}</td>
                <td>{kyc.panNumber}</td>
                {["salarySlip", "passport", "bankStatement", "aadharFront", "aadharBack", "panCard", "image"].map((field) => (
                  <td key={field}>
                    {kyc[field] ? (
                      <span className="view-link" onClick={() => handlePreview(kyc[field])}>
                        View
                      </span>
                    ) : (
                      <span className="no-file">N/A</span>
                    )}
                  </td>
                ))}
                <td className={`status ${kyc.status?.toLowerCase()}`}>
                  {kyc.status}
                </td>

              <td>
                {kyc.status?.toUpperCase() === "PENDING" ? (
                  <div className="action-buttons">
                    <button
                      className="approve-btn"
                      onClick={() => handleApproval(kyc.id, "APPROVED")}
                    >
                      ✅ Approve
                    </button>
                    <button
                      className="reject-btn"
                      onClick={() => handleApproval(kyc.id, "REJECTED")}
                    >
                      ❌ Reject
                    </button>
                  </div>
                ) : (
                  <span>{kyc.status}</span>
                )}
              </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {previewUrl && (
        <DocumentModal fileUrl={previewUrl} onClose={() => setPreviewUrl(null)} />
      )}
    </div>
  );
};

const DocumentModal = ({ fileUrl, onClose }) => {
  const isImage = /\.(jpg|jpeg|png|webp|gif)$/i.test(fileUrl);
  const isPDF = /\.pdf$/i.test(fileUrl);

  // Open unsupported formats in new tab
  useEffect(() => {
    if (!isImage && !isPDF) {
      window.open(fileUrl, "_blank");
      onClose();
    }
  }, [fileUrl, isImage, isPDF, onClose]);

  const openInNewTab = () => {
    window.open(fileUrl, "_blank");
    onClose();
  };

  return (
    <div className="modal3-overlayy" onClick={onClose}>
      <div className="modal3-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal3-close" onClick={onClose}>✖</button>
        <div className="modal3-body">
          {isImage && (
            <img src={fileUrl} alt="Preview" className="modal3-image" />
          )}
          {isPDF && (
            <div className="pdf-container">
              <div className="pdf-header">
                <h3>PDF Document</h3>
                <button onClick={openInNewTab} className="open-external-btn">
                  Open in New Tab
                </button>
              </div>
              <div className="pdf-viewer">
                <iframe
                  src={fileUrl}
                  title="PDF Preview"
                  className="modal3-pdf"
                  onError={() => {
                    console.log("PDF failed to load, opening in new tab");
                    openInNewTab();
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminKYCList;
