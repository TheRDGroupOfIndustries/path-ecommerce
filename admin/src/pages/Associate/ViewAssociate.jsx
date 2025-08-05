import React, { useEffect, useState } from "react"
import { fetchDataFromApi, editData, deleteData } from "../../utils/api"
import "./ViewAssociate.css"
import { Eye,EyeOff,Pencil,Trash,Search } from "lucide-react"

function EditAssociate({ closeModal, id, level, percentageInt }) {
  const [selectedLevel, setSelectedLevel] = useState(level ?? 0)
  const [percentage, setPercentage] = useState(percentageInt ?? "")
  const [percentageList, setPercentageList] = useState([])
  const [loading, setLoading] = useState(false)
  

  useEffect(() => {
    const tempList = []
    for (let i = 0; i <= 20; i++) {
      tempList.push(5 * i)
    }
    setPercentageList(tempList)
  }, [])

  const handleSave = async () => {
    setLoading(true)
    try {
      const res = await editData(`/manage-associate/update/${id}`, {
        level: Number(selectedLevel),
        percent: Number(percentage),
      })
      if (res) {
        closeModal()
        window.location.reload()
      }
    } catch (error) {
      console.error("Failed to update associate:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal5-overlay">
      <div className="modal5-container">
        <button className="modal5-close" onClick={closeModal}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>

        <div className="modal5-header">
          <h3>Edit Level & Percentage</h3>
        </div>

        <div className="modal5-body">
          <div className="form5-group">
            <label htmlFor="level">Level</label>
            <select
              id="level"
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(Number(e.target.value))}
              className="form5-select"
            >
              {Array.from({ length: 13 }, (_, i) => (
                <option key={i} value={i}>
                  Level {i}
                </option>
              ))}
            </select>
          </div>

          <div className="form5-group">
            <label htmlFor="percentage">Percentage</label>
            <select
              id="percentage"
              value={percentage}
              onChange={(e) => setPercentage(Number(e.target.value))}
              className="form5-select"
            >
              <option value="" disabled>
                Select percentage
              </option>
              {percentageList.map((p) => (
                <option key={p} value={p}>
                  {p}%
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="modal5-footer">
          <button onClick={handleSave} disabled={loading} className="btn btn-primary">
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  )
}

const ViewAssociate = () => {
  const [associates, setAssociates] = useState([])
  const [loading, setLoading] = useState(true)
  const [referrals, setReferrals] = useState([])
  const [expanded, setExpanded] = useState(null)
  const [model, setModel] = useState(false)
  const [level, setLevel] = useState(0)
  const [percentageInt, setPercentageInt] = useState(0)
  const [id, setId] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    try {
      setLoading(true)
      await Promise.all([fetchAssociates(), fetchReferrals()])
    } catch (err) {
      console.error("Error fetching data:", err)
    } finally {
      setLoading(false)
    }
  }

  const fetchAssociates = async () => {
    const data = await fetchDataFromApi("/users/all-associates")
    setAssociates(data.associates)
  }

  const fetchReferrals = async () => {
    const data = await fetchDataFromApi("/referral/all")
    setReferrals(data.data || [])
  }

  const getReferralDetails = (associateId) => {
    return referrals
      .filter((r) => r.createdFor.id === associateId)
      .map((r) => {
        const percent = r.transactions?.[0]?.percent ?? "N/A"
        const commission = r.totalRevenue?.toFixed(2) || "0.01"
        const signupUsers = r.usedAtSignupUsers || []
        const purchaseUsers = r.usedAtPurchaseUsers || []
        const enquiryUsers = r.usedInEnquiries || []
        return {
          code: r.referralCode,
          percent,
          commission,
          signupUsers,
          purchaseUsers,
          enquiryUsers,
          userCount: signupUsers.length + purchaseUsers.length + enquiryUsers.length,
        }
      })
  }

  const getTotalCommission = (id) => {
    if (!Array.isArray(referrals)) return "0.01"
    const total = referrals
      .filter((r) => r.createdFor.id === id)
      .reduce((sum, r) => sum + (r.totalRevenue || 0), 0)
    return total.toFixed(2)
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this associate?")) {
      try {
        const res = await deleteData(`/manage-associate/delete/${id}`)
        if (res) fetchAssociates()
      } catch (error) {
        console.error("Failed to delete associate:", error)
      }
    }
  }

  useEffect(() => {
  const trimmed = searchQuery.trim();

  const timer = setTimeout(() => {
    if (trimmed.length === 0) {
      fetchAssociates();
    } else if (trimmed.length >= 3) {
      handleSearch();
    }
  }, 300); 

  return () => clearTimeout(timer); 
}, [searchQuery]);


const handleSearch = async () => {
  const trimmed = searchQuery.trim();

  if (trimmed.length === 0) {
    await fetchAssociates();
    return;
  }

  if (trimmed.length < 2) {
    return; 
  }

  try {
    const res = await fetchDataFromApi(`/referral/search-associate?name=${encodeURIComponent(trimmed)}`);
    if (res && Array.isArray(res.results)) {
      setAssociates(res.results);
    } else {
      console.error("Unexpected search response:", res);
      setAssociates([]);
    }
  } catch (err) {
    console.error("Search failed:", err);
  }
};


  return (
    <>
      {model && (
        <EditAssociate closeModal={() => setModel(false)} id={id} level={level} percentageInt={percentageInt} />
      )}

      {loading ? (
        <div className="loading-container">
          <p>Loading associates and referrals...</p>
          <img src="SPC.png" alt="Loading..." className="loading-logo" />
        </div>
      ) : (
        <div className="associate-container">
          <div className="page-header">
            <h1>Associate Commission Tracker</h1>
            <p>Manage and track associate commissions and referral details</p>
          </div>

          <div className="search-section2">
            <div className="search-container2">
              <input
                type="text"
                placeholder="Search associate name..."
                className="search-input2"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <button className="search-button2" onClick={handleSearch}>
                <Search size={18} />
              </button>
            </div>
          </div>

        <div className="table-container">
          <div className="table-wrapper">
            <table className="associate-table">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Associate</th>
                  <th>Level</th>
                  <th>Percent</th>
                  <th>Referral</th>
                  <th>Total Commission</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {associates.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="no-data">
                      <div className="no-data-content">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="48"
                          height="48"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                          <path d="m22 2-5 10-5-5 10-5z" />
                        </svg>
                        <h3>No Associates Found</h3>
                        <p>No associate details are available at the moment.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  associates.map((associate, index) => (
                    <React.Fragment key={associate.id}>
                      <tr className="main-row">
                        <td className="serial-number">{index + 1}</td>
                        <td className="associate-info">
                          <div className="associate-details">
                            <div className="name">{associate.name}</div>
                            <div className="email">{associate.email}</div>
                          </div>
                        </td>
                        <td className="level">
                          <span className="level-badge">Level&nbsp;{associate.associate?.level || "N/A"}</span>
                        </td>
                        <td className="percentage">
                          <span className="percentage-badge">{associate.associate?.percent || "N/A"}%</span>
                        </td>
                        <td className="referral-code">
                          <code>
                            {associate.name.toLowerCase().split(" ")[0]}-{associate.associate?.percent ?? "N/A"}
                          </code>
                        </td>
                        <td className="total-commission">
                          <span className="commission-amount">₹{getTotalCommission(associate.id)}</span>
                        </td>
                        <td className="actions">
                          <div className="action-buttons">
                            <button
                              className="view-btn"
                              onClick={() => setExpanded(expanded === associate.id ? null : associate.id)}
                            >
                              {expanded === associate.id ? <EyeOff /> : <Eye />}
                            </button>
                            <button
                              className="edit-btn"
                              onClick={() => {
                                setModel(true)
                                setLevel(associate.associate?.level || 0)
                                setPercentageInt(associate.associate?.percent ?? 0)
                                setId(associate.id)
                              }}
                            >
                             <Pencil />
                            </button>
                            <button className="delete-btn" onClick={() => handleDelete(associate.id)}>
                              <Trash />
                            </button>
                          </div>
                        </td>
                      </tr>

                      {expanded === associate.id && (
                        <tr className="expanded-row">
                          <td colSpan={7}>
                            <div className="details-container">
                              <h4>Referral Details for {associate.name}</h4>

                              {getReferralDetails(associate.id).length === 0 ? (
                                <div className="no-referrals">
                                  <p>No referral data available for this associate.</p>
                                </div>
                              ) : (
                                <div className="referral-details">
                                  {getReferralDetails(associate.id).map((ref, idx) => (
                                    <div key={idx} className="referral-card">
                                      <div className="referral-header">
                                        <div className="referral-code-display">
                                          <strong>Code:</strong> <code>{ref.code}</code>
                                        </div>
                                        <div className="referral-stats">
                                          <div className="stat1">
                                            <span className="stat1-label">Total Users:</span>
                                            <span className="stat1-value">{ref.userCount}</span>
                                          </div>
  
                                          <div className="stat1">
                                            <span className="stat1-label">Commission:</span>
                                            <span className="stat1-value commission">₹{ref.commission}</span>
                                          </div>
                                        </div>
                                      </div>

                                      <div className="user-categories">
                                        <div className="user-category">
                                          <h5>Signup Users ({ref.signupUsers.length})</h5>
                                          {ref.signupUsers.length > 0 ? (
                                            <ul className="user-list">
                                              {ref.signupUsers.map((user, i) => (
                                                <li key={i} className="user-item">
                                                  <span className="user-name">{user.name}</span>
                                                  <span className="user-email">{user.email}</span>
                                                </li>
                                              ))}
                                            </ul>
                                          ) : (
                                            <p className="no-users">No signup users</p>
                                          )}
                                        </div>

                                        <div className="user-category">
                                          <h5>Purchase Users ({ref.purchaseUsers.length})</h5>
                                          {ref.purchaseUsers.length > 0 ? (
                                            <ul className="user-list">
                                              {ref.purchaseUsers.map((user, i) => (
                                                <li key={i} className="user-item">
                                                  <span className="user-name">{user.name}</span>
                                                  <span className="user-email">{user.email}</span>
                                                </li>
                                              ))}
                                            </ul>
                                          ) : (
                                            <p className="no-users">No purchase users</p>
                                          )}
                                        </div>

                                        <div className="user-category">
                                          <h5>Enquiry Users ({ref.enquiryUsers.length})</h5>
                                          {ref.enquiryUsers.length > 0 ? (
                                            <ul className="user-list">
                                              {ref.enquiryUsers.map((user, i) => (
                                                <li key={i} className="user-item">
                                                  <span className="user-name">{user.name}</span>
                                                  <span className="user-email">{user.email}</span>
                                                </li>
                                              ))}
                                            </ul>
                                          ) : (
                                            <p className="no-users">No enquiry users</p>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )}
    </>
  )
}

export default ViewAssociate


