import { useEffect, useState } from "react"
import { fetchDataFromApi, deleteData } from "../../utils/api"
import { Trash2, MessageSquareReply } from "lucide-react"
import "./Support.css"

const Support = () => {
  const [messages, setMessages] = useState([])
  const [filteredMessages, setFilteredMessages] = useState([])
  const [activeFilter, setActiveFilter] = useState("All")
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)

  const [selectedMessage, setSelectedMessage] = useState(null)
  const [replySubject, setReplySubject] = useState("")
  const [replyMessage, setReplyMessage] = useState("")
  const [helpMessage, setHelpMessage] = useState("")


  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;


  const storedUser = localStorage.getItem("user")
  const user = storedUser ? JSON.parse(storedUser) : null
  const sellerId = user?.id
  const isAdmin = user?.role === "ADMIN"

  const filterOptions = isAdmin ? ["All", "Order", "Enquiry", "Other"] : ["All", "Order", "Enquiry"]

  useEffect(() => {
    const getSupportMessages = async () => {
      if (!sellerId && !isAdmin) return

      try {
        setLoading(true)
        const res = await fetchDataFromApi(
          isAdmin ? "/support/admin" : `/support/${sellerId}`
        )
        setMessages(res)
        setFilteredMessages(res)
      } catch (err) {
        console.error("Failed to load messages", err)
      } finally {
        setLoading(false)
      }
    }

    getSupportMessages()
  }, [sellerId, isAdmin])

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this message?")
    if (!confirmDelete) return

    try {
      await deleteData(`/support/delete/${id}`)
      const updated = messages.filter((msg) => msg.id !== id)
      setMessages(updated)

      const filtered = activeFilter === "All"
        ? updated
        : updated.filter((msg) => msg.subject?.toLowerCase() === activeFilter.toLowerCase())
      setFilteredMessages(filtered)
    } catch (error) {
      console.error("Failed to delete message", error)
    }
  }

  const handleFilterChange = (filter) => {
    setActiveFilter(filter)
    setCurrentPage(1);

    if (filter === "All") {
      setFilteredMessages(messages)
    } else {
      const filtered = messages.filter(
        (msg) => msg.subject?.toLowerCase() === filter.toLowerCase()
      )
      setFilteredMessages(filtered)
    }
  }

  const handleViewDetails = (msg) => {
    setSelectedMessage(msg)
    setReplySubject(msg.subject || "")
    setHelpMessage(msg.message || "")
    setReplyMessage("")
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedMessage(null)
    setReplySubject("")
    setHelpMessage("")
    setReplyMessage("")
  }

  const handleReplySubmit = () => {
    console.log("Reply Submitted")
    console.log("Subject:", replySubject)
    console.log("Message:", replyMessage)
    alert("Reply submitted successfully!")
    closeModal()
  }

  if (loading) {
    return <div className="support-loading">Loading support messages...</div>
  }

    // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMessages = filteredMessages.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredMessages.length / itemsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="support-container">
      <div className="support-header">
        <h3 className="support-title">{isAdmin ? "Admin" : "Seller"} Help Messages</h3>
        <div className="support-count">Total Message: {filteredMessages.length}</div>
      </div>

      <div className="filter-pills">
        {filterOptions.map((filter) => (
          <button
            key={filter}
            className={`filter-pill ${activeFilter === filter ? "active" : ""}`}
            onClick={() => handleFilterChange(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      {filteredMessages.length === 0 ? (
        <div className="no-messages">
          <p>No messages found for the selected filter.</p>
        </div>
      ) : (
        <>
        <div className="support-table-container">
          <table className="support-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Message</th>
                <th>Sub Subject</th>
                <th>Submitted At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentMessages.map((msg) => (
                <tr key={msg.id}>
                  <td>
                    <div className="user-info">
                      <img
                        src={msg.user?.imageUrl || "/placeholder.svg?height=32&width=32"}
                        alt={msg.user?.name || "User"}
                        className="user-avatar"
                      />
                      <span className="user-name">{msg.user?.name || "Unknown User"}</span>
                    </div>
                  </td>
                  <td>{msg.user?.email || "No email"}</td>
                  <td className="message-cell">
                    <div className="message-content">{msg.message}</div>
                  </td>
                  <td>
                    <span className="sub-subject-badge">{msg.subSubject || msg.subject}</span>
                  </td>
                  {/* <td>{msg.subject}</td> */}
                  <td className="date-cell">
                    {new Date(msg.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="action-btn view-btn"
                        title="View Details"
                        onClick={() => handleViewDetails(msg)}
                      >
                        <MessageSquareReply size={13} />
                      </button>
                      <button
                        className="action-btn delete-btn"
                        title="Delete Message"
                        onClick={() => handleDelete(msg.id)}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

       <div className="pagination">
            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
                className={currentPage === i + 1 ? "active-page" : ""}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
</>

      )}

      {/* Reply Modal */}
      {showModal && selectedMessage && (
        <div className="modal-overlay" style={{ zIndex: 2001 }} onClick={closeModal}>
          <div
            className="modal-content"
            style={{ zIndex: 2002 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>Reply Form</h3>
              <button className="modal-close" onClick={closeModal} title="Close">
                &times;
              </button>
            </div>

            <div className="modal-body">
              <div className="detail-section">
                <h4>Reply to Message</h4>
                <div className="detail-grid">
                  <div className="detail-item full-width">
                    <label>
                      <strong>Subject:</strong>
                    </label>
                    <input
                      type="text"
                      value={replySubject}
                      onChange={(e) => setReplySubject(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "8px",
                        marginTop: "4px",
                        borderRadius: "6px",
                        border: "1px solid #ccc",
                      }}
                    />
                  </div>

                  <div className="detail-item full-width" style={{ marginTop: "12px" }}>
                    <label>
                      <strong>Message:</strong>
                    </label>
                    <textarea
                      rows="2"
                      value={helpMessage}
                      onChange={(e) => setHelpMessage(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "8px",
                        marginTop: "4px",
                        borderRadius: "6px",
                        border: "1px solid #ccc",
                      }}
                    ></textarea>
                  </div>

                   <div className="detail-item full-width" style={{ marginTop: "12px" }}>
                    <label>
                      <strong>Reply:</strong>
                    </label>
                    <textarea
                      rows="3"
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "8px",
                        marginTop: "4px",
                        borderRadius: "6px",
                        border: "1px solid #ccc",
                      }}
                    ></textarea>
                  </div>

                  <div style={{ marginTop: "16px", textAlign: "left" }}>
                    <button
                      onClick={handleReplySubmit}
                      style={{
                        backgroundColor: "#3b82f6",
                        color: "white",
                        padding: "10px 16px",
                        borderRadius: "6px",
                        border: "none",
                        cursor: "pointer",
                        fontWeight: "bold",
                      }}
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Support


















