import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { fetchDataFromApi,deleteData } from "../../utils/api";
import "./Support.css";
import { Trash2 } from "lucide-react";

const SupportDetails = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const selectedSubject = searchParams.get("subject");

  const storedUser = localStorage.getItem("user");
  const sellerId = storedUser ? JSON.parse(storedUser).id : null;

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const getSupportMessages = async () => {
      try {
        const res = await fetchDataFromApi(`/support/${sellerId}`);
        const normalizedSubject = selectedSubject?.trim().toLowerCase();
        const filtered = res.filter(
          (msg) => msg.subject?.trim().toLowerCase() === normalizedSubject
        );
        setMessages(filtered);
      } catch (err) {
        console.error("Failed to load messages", err);
      }
    };

    if (sellerId && selectedSubject) {
      getSupportMessages();
    }
  }, [selectedSubject, sellerId]);

  const handleDelete = async (id) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this message?");
  if (!confirmDelete) return;

  try {
    await deleteData(`/support/delete/${id}`);
    setMessages((prev) => prev.filter((msg) => msg.id !== id));
  } catch (error) {
    console.error("Failed to delete message", error);
  }
};

  return (
    <div className="support-details-container">
      <h2>{selectedSubject} Help Messages</h2>
      {messages.length === 0 ? (
        <p style={{color:"red"}}>No messages yet.</p>
      ) : (
        <table className="support-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Sub Subject</th>
              <th>Message</th>
              <th>Submitted At</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((msg) => (
              <tr key={msg.id}>
                <td>
                  <div className="user-info-cell">
                    <img src={msg.user.imageUrl} alt={msg.user.name} className="user-img" />
                    <span>{msg.user.name}</span>
                  </div>
                </td>
                <td>{msg.user.email}</td>
                <td>{msg.subSubject}</td>
                <td>{msg.message}</td>
                <td>{new Date(msg.createdAt).toLocaleString()}</td>
                <td>
                  <button className="delete-btn" title="Delete" onClick={() => handleDelete(msg.id)}>
                    <Trash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SupportDetails;
