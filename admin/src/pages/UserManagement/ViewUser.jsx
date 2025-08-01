import { useState, useEffect, useContext } from "react";
import "./User.css";
import { fetchDataFromApi, editData, deleteData } from "../../utils/api";
import { myContext } from "../../App";
import { ChevronDown, Pencil, Trash2,Search } from "lucide-react";

const ViewUser = () => {
  const context = useContext(myContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedRole, setSelectedRole] = useState("All");
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const USERS_PER_PAGE = 5;

  const roles = ["All", "ADMIN", "SELLER", "USER", "ASSOCIATE"];

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchUsers();
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 600);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchUsers = async () => {
    const res = await fetchDataFromApi("/users/get-all");
    if (res && Array.isArray(res.users)) {
      setUsers(res.users);
      console.log(res.users)
    } else {
      console.error("Unexpected API response:", res);
      setUsers([]);
    }
  };

  useEffect(() => {
    const filtered =
      selectedRole === "All"
        ? users
        : users.filter((user) => user.role === selectedRole);
    setFilteredUsers(filtered);
    setCurrentPage(1); 
  }, [selectedRole, users]);

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * USERS_PER_PAGE,
    currentPage * USERS_PER_PAGE
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleRoleFilter = (e) => setSelectedRole(e.target.value);

 const handleEdit = (user) => {
  setEditingUser(user.id);
  const { id, _id, ...dataWithoutId } = user;
  setEditForm({ ...dataWithoutId, originalEmail: user.email, role: user.role || "USER" });
  setImagePreview(user.imageUrl || null);
  setIsModalOpen(true);
};


 const handleSaveEdit = async () => {
   setLoading(true); 
  try {
    const { name, email, phone, password, role, createdById, imageFile, originalEmail } = editForm;
    let payload;
    let isFormData = false;
    const emailChanged = email.trim().toLowerCase() !== originalEmail?.trim().toLowerCase();

    if (imageFile) {
      payload = new FormData();
      payload.append("name", name);
      payload.append("phone", phone);
      if (emailChanged) payload.append("email", email.trim());
      if (password) payload.append("password", password);
      if (createdById) payload.append("createdById", createdById);
      payload.append("role", role.toUpperCase());
      payload.append("image", imageFile);
      isFormData = true;
    } else {
      payload = {
        name,
        phone,
        ...(emailChanged && { email: email.trim() }),
        ...(password && { password }),
        ...(createdById && { createdById }),
        role: role.toUpperCase(),
      };
    }

    await editData(`/users/update-user/${editingUser}`, payload, isFormData);
    context.setAlertBox({ open: true, msg: "User updated Successfully!", error: false });
    await fetchUsers();
    setEditingUser(null);
    setEditForm({});
    setIsModalOpen(false);
    setImagePreview(null);
  } catch (error) {
    console.error("Error updating user:", error);
    context.setAlertBox({ open: true, msg: "Failed to update user!", error: true });
  }
  finally {
    setLoading(false); 
  }
};


  const handleCancelEdit = () => {
    setEditingUser(null);
    setEditForm({});
    setIsModalOpen(false);
    setImagePreview(null);
  };

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteData(`/users/delete-user/${userId}`);
        setUsers(users.filter((user) => user.id !== userId));
      } catch (error) {
        console.error("Delete error:", error);
        context.setAlertBox({ open: true, msg: "Failed to delete user!", error: true });
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  //search
useEffect(() => {
  if (searchQuery.length >= 2) {
    handleSearch(); // auto search after 2 characters
  }
}, [searchQuery]);

useEffect(() => {
  if (searchQuery.length >= 2) {
    handleSearch();
  } else if (searchQuery.length === 0) {
    const filtered = selectedRole === "All"
      ? users
      : users.filter(user => user.role?.toLowerCase() === selectedRole.toLowerCase());
    setFilteredUsers(filtered);
  }
}, [searchQuery]);

  const handleSearch = async () => {
  if (!searchQuery.trim()) {
    await fetchUsers();
    return;
  }
  try {
    const res = await fetchDataFromApi(`/users/search?q=${encodeURIComponent(searchQuery)}`);
    if (res && Array.isArray(res.users)) {
      setFilteredUsers(res.users);
    } else {
      console.error("Unexpected search response:", res);
      setFilteredUsers([]);
    }
    setCurrentPage(1);
  } catch (err) {
    console.error("Search failed:", err);
    context.setAlertBox({ open: true, msg: "Failed to search!", error: true });
  }
};


  return (
    <div className="user-container">
      <div className="user-header">
        <div className="user-header-main">
          <h1>Members</h1>
          <div className="custom-select-wrapper" data-selected={selectedRole}>
            <select
              id="roleFilter"
              value={selectedRole}
              onChange={handleRoleFilter}
              className="role-filter"
            >
              <option value="Filter" disabled>Filter</option>
              {roles.map((role) => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
            <span className="custom-arrow"><ChevronDown size={20} /></span>
          </div>

        <div className="search-section">
          <div className="search-container">
           <input
          type="text"
          placeholder="Search..."
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
         onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
        />
        <button className="search-button" onClick={handleSearch}>
          <Search size={18} />
        </button>
          </div>
        </div>

        </div>
        <div className="user-stats">
          <span>Total members: {users.length}</span><br />
          <span>current used: {filteredUsers.length}</span>
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="no-products"><p>No User found.</p></div>
      ) : isMobile ? (
        <div className="user-list">
          {paginatedUsers.map((user) => (
            <div className="user-card" key={user.id}>
              <img src={user.imageUrl || "/placeholder.svg"} alt="User" className="user-photo" />
              <div style={{ flex: 1 }}>
                <div className="user-name"><strong>{user.name}</strong></div>
                <div className="user-description">{user.email}</div>
              <div className="user-description" >{user.phone}</div>
                <span className={`role-badge role-${user.role?.toLowerCase()}`}>{user.role}</span>
                <div className="actions">
                  <div className="action-buttons">
                    <button className="edit-btn" onClick={() => handleEdit(user)}><Pencil /></button>
                    <button className="delete-btn" onClick={() => handleDelete(user.id)}><Trash2 /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {/* Pagination Controls */}
          <div className="pagination-controls">
            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>&lt; Prev</button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                className={currentPage === i + 1 ? "active" : ""}
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>Next &gt;</button>
          </div>
        </div>
      ) : (
        <div className="table-container">
          <table className="user-table">
            <thead>
              <tr>
                <th>Photo</th>
                <th>Name</th>
                <th>Mobile</th>
                <th>Email</th>
                <th>Status</th>
                <th>Referral</th>
                <th>Operation</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((user, index) => (
                <tr key={user.id}>
                  <td>
                    <img
                      src={user.imageUrl || "/placeholder.svg"}
                      alt="profile"
                      className="user-photo"
                    />
                  </td>
                  <td>{user.name}</td>
                  <td> {user.phone ? user.phone : "-"} </td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`role-badge role-${user.role?.toLowerCase()}`}>{user.role}</span>
                  </td>
                 <td>
                <span className={user.usedReferralId ? "bg-yellow-100 text-yellow-700 px-2 py-2 rounded" : ""}>
                  {user.usedReferralId ? "Yes" : "No"}
                </span>
              </td>

                  <td className="actions">
                    <div className="action-buttons">
                      <button onClick={() => handleEdit(user)} className="edit-btn" title="Edit"><Pencil /></button>
                      <button onClick={() => handleDelete(user.id)} className="delete-btn" title="Delete"><Trash2 /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Pagination Controls */}
          <div className="pagination-controls">
            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>&lt; Prev</button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                className={currentPage === i + 1 ? "active" : ""}
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>Next &gt;</button>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="modal-edit" onClick={handleCancelEdit}>
          <div
            className="modal-edit-content"
            onClick={e => e.stopPropagation()}
          >
            <h2>Edit User</h2>
            <label>Name:</label>
            <input type="text" name="name" value={editForm.name || ""} onChange={handleInputChange} className="edit-input" />

            <label>Email:</label>
            <input type="email" name="email" value={editForm.email || ""} onChange={handleInputChange} className="edit-input" />

            <label>Mobile:</label>
            <input type="tel" name="phone" value={editForm.phone || ""} onChange={handleInputChange} className="edit-input" />

            <label>Role:</label>
            <select name="role" value={editForm.role} onChange={handleInputChange} className="edit-select">
              <option value="ADMIN">Admin</option>
              <option value="SELLER">Seller</option>
              <option value="USER">User</option>
              <option value="ASSOCIATE">Associate</option>
            </select>

            <label>Image:</label>
            <input
              type="file"
              accept="image/*"
              onChange={e => {
                const file = e.target.files[0];
                setEditForm(prev => ({ ...prev, imageFile: file }));
                setImagePreview(file ? URL.createObjectURL(file) : null);
              }}
            />
            {imagePreview && (
              <div style={{ margin: "10px 0" }}>
                <img src={imagePreview} alt="Preview" style={{ width: 80, height: 80, borderRadius: 8, objectFit: "cover" }} />
              </div>
            )}

            <div className="modal-actions" style={{ marginTop: 20, display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={handleSaveEdit} className="save-btn" disabled={loading}>
                 {loading ? (
              <>
                <span className="spinner" /> Saving...
              </>
            ) : (
              "Save →"
            )}
              </button>
              <button onClick={handleCancelEdit} className="cancel-btn">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewUser;
