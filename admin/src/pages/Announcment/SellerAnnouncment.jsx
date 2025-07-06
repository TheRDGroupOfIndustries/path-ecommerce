import React, { useEffect, useState } from "react";
import { fetchDataFromApi } from "../../utils/api";
import "./Anouncment.css"; // Reuse same CSS for layout

const SellerAnnouncment = () => {
  const [announcements, setAnnouncements] = useState([]);

  const loadAnnouncements = async () => {
    try {
      const data = await fetchDataFromApi("/announcement/get");
      setAnnouncements(data);
    } catch (error) {
      console.error("Error fetching announcements:", error);
    }
  };

  useEffect(() => {
    loadAnnouncements();
  }, []);

  return (
    <div className="announcement-container">
      <h2 className="announcement-title">📢 Announcements</h2>

      <div className="announcement-list">
        {announcements.length === 0 ? (
          <p className="no-announcement">No announcements available.</p>
        ) : (
          announcements.map((a) => (
            <div key={a.id} className="announcement-item">
              <p>{a.text}</p>
              <span className="timestamp">
                🕒 {new Date(a.createdAt).toLocaleString()}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SellerAnnouncment;
