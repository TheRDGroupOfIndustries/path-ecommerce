import React, { useEffect, useState } from "react";
import "./Anouncment.css";
import {
  fetchDataFromApi,
  postData,
  patchData,
  deleteData,
} from "../../utils/api";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";

const AdminAnnouncment = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [input, setInput] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  const loadAnnouncements = async () => {
    try {
      const data = await fetchDataFromApi("/announcement/get");
      setAnnouncements(data);
    } catch (error) {
      console.error("Error loading announcements:", error);
    }
  };

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const handlePost = async () => {
    if (input.trim() === "") return;

    try {
      const newAnnouncement = await postData("/announcement/create", { text: input });
      setAnnouncements((prev) => [newAnnouncement, ...prev]);
      setInput("");
    } catch (error) {
      console.error("Failed to post announcement:", error);
    }
  };

  const handleEdit = (id, currentText) => {
    setEditingId(id);
    setEditText(currentText);
  };

  const handleSaveEdit = async (id) => {
    if (editText.trim() === "") return;
    try {
      const updated = await patchData(`/announcement/update/${id}`, { text: editText });
      setAnnouncements((prev) =>
        prev.map((a) => (a.id === id ? updated : a))
      );
      setEditingId(null);
      setEditText("");
    } catch (error) {
      console.error("Error updating announcement:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this announcement?")) return;

    try {
      await deleteData(`/announcement/delete/${id}`);
      setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    } catch (error) {
      console.error("Error deleting announcement:", error);
    }
  };

  return (
    <div className="announcement-container">
      <h2 className="announcement-title">📢 Announcements</h2>

      <div className="announcement-input">
        <textarea
          placeholder="Write a new announcement..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={handlePost}>Post</button>
      </div>

      <div className="announcement-list">
        {announcements.length === 0 ? (
          <p className="no-announcement">No announcements yet.</p>
        ) : (
          announcements.map((a) => (
            <div key={a.id} className="announcement-item">
              {editingId === a.id ? (
                <>
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                  />
                  <div className="edit-actions">
                    <button onClick={() => handleSaveEdit(a.id)}>💾 Save</button>
                    <button onClick={() => setEditingId(null)}>❌ Cancel</button>
                  </div>
                </>
              ) : (
                <>
                  <p>{a.text}</p>
                  <div className="announcement-meta">
                    <span className="timestamp">
                      🕒 {new Date(a.createdAt).toLocaleString()}
                    </span>
                    <div className="actions">
                      <button onClick={() => handleEdit(a.id, a.text)}><MdEdit /></button>
                      <button onClick={() => handleDelete(a.id)}><MdDelete/></button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminAnnouncment;
