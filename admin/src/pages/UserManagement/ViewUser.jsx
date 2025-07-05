import { useState, useEffect } from "react";
import "./User.css";
import { fetchDataFromApi, editData, deleteData } from "../../utils/api";
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import { useContext } from "react"
import { myContext } from "../../App"

const ViewUser = () => {
  const context = useContext(myContext)
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedRole, setSelectedRole] = useState("All");
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);

  const roles = ["All", "ADMIN", "SELLER", "USER", "ASSOCIATE"];

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchUsers();
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 600);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchUsers = async () => {
    const res = await fetchDataFromApi("/users/get-all");
    if (res && Array.isArray(res.users)) {
      setUsers(res.users);
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
  }, [selectedRole, users]);

  const handleRoleFilter = (e) => {
    setSelectedRole(e.target.value);
  };

  const handleEdit = (user) => {
    setEditingUser(user.id);
    const { id, _id, ...dataWithoutId } = user;
    setEditForm({
      ...dataWithoutId,
      role: user.role || "USER",
    });
  };

  const handleSaveEdit = async () => {
  try {
    const {
      name,
      email,
      phone,
      password,
      role,
      createdById,
      imageUrl,
    } = editForm;

    const payload = {
      name,
      email,
      phone,
      password,
      createdById,
      role: role.toUpperCase(),
      imageUrl, 
    };

    await editData(`/users/update-user/${editingUser}`, payload);
    console.log("Updating:", `/users/update-user/${editingUser}`, payload);

    await fetchUsers(); 
    setEditingUser(null);
    setEditForm({});
  } catch (error) {
    console.error("Error updating user:", error);
    context.setAlertBox({
      open: true,
      msg: "Failed to update user!",
      error: true,
    });
  }
};


  const handleCancelEdit = () => {
    setEditingUser(null);
    setEditForm({});
  };

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteData(`/users/delete-user/${userId}`);
        setUsers(users.filter((user) => user.id !== userId));
      } catch (error) {
        console.error("Delete error:", error);
         context.setAlertBox({
      open: true,
      msg: "Failed to delete user!",
      error: true,
    });
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="user-container">
      <div className="user-header">
        <h1>User Details</h1>
        <div className="user-stats">
          <span className="total-users">Total Users: {filteredUsers.length}</span>
        </div>
      </div>

      <div className="filter-section">
        <label htmlFor="roleFilter">Filter by Role:</label>
        <select
          id="roleFilter"
          value={selectedRole}
          onChange={handleRoleFilter}
          className="role-filter"
        >
          {roles.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="no-products">
          <p>No User found.</p>
        </div>
      ) : (
        isMobile ? (
          <div className="user-list">
            {filteredUsers.map((user) => (
              <div className="user-card" key={user.id}>
                <div style={{ flex: 1 }}>
                  {editingUser === user.id ? (
                    <>
                      <input
                        type="text"
                        name="name"
                        value={editForm.name || ""}
                        onChange={handleInputChange}
                        className="edit-input"
                        placeholder="Name"
                      />
                      <input
                        type="email"
                        name="email"
                        value={editForm.email || ""}
                        onChange={handleInputChange}
                        className="edit-input"
                        placeholder="Email"
                      />
                      <input
                        type="tel"
                        name="phone"
                        value={editForm.phone || ""}
                        onChange={handleInputChange}
                        className="edit-input"
                        placeholder="Phone"
                      />
                      <select
                        name="role"
                        value={editForm.role}
                        onChange={handleInputChange}
                        className="edit-select"
                      >
                        <option value="ADMIN">Admin</option>
                        <option value="SELLER">Seller</option>
                        <option value="USER">User</option>
                        <option value="ASSOCIATE">Associate</option>
                      </select>
                      <div className="edit-actions">
                        <button onClick={handleSaveEdit} className="save-btn" title="Save">✓</button>
                        <button onClick={handleCancelEdit} className="cancel-btn" title="Cancel">✕</button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="user-name"><strong>{user.name}</strong></div>
                      <div className="user-description">{user.email}</div>
                      <div className="user-description">{user.phone}</div>
                      <div className="user-category">{user.role}</div>
                      <div className="actions">
                        <div className="action-buttons">
                          <button className="edit-btn" onClick={() => handleEdit(user)}><MdEdit /></button>
                          <button className="delete-btn" onClick={() => handleDelete(user.id)}><MdDelete /></button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="table-container">
            <table className="user-table">
              <thead>
                <tr>
                  <th>Serial No.</th>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  {/* <th>Password</th> */}
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers?.map((user, index) => (
                  <tr key={user.id}>
                    <td>{index + 1}</td>
                  
                  <td>
              {editingUser === user.id ? (
                <div>
                  <input
                    type="text"
                    name="imageUrl"
                    value={editForm.imageUrl || ""}
                    onChange={handleInputChange}
                    className="edit-input"
                    placeholder="Enter image URL"
                  />
                </div>
              ) : (
                <img
                  src={user.imageUrl || "/placeholder.svg"}
                  alt="User"
                />
              )}
            </td>

                    <td>
                      {editingUser === user.id ? (
                        <input
                          type="text"
                          name="name"
                          value={editForm.name || ""}
                          onChange={handleInputChange}
                          className="edit-input"
                        />
                      ) : (
                        user.name
                      )}
                    </td>
                    <td>
                      {editingUser === user.id ? (
                        <input
                          type="email"
                          name="email"
                          value={editForm.email || ""}
                          onChange={handleInputChange}
                          className="edit-input"
                        />
                      ) : (
                        user.email
                      )}
                    </td>
                    <td>
                      {editingUser === user.id ? (
                        <input
                          type="tel"
                          name="phone"
                          value={editForm.phone || ""}
                          onChange={handleInputChange}
                          className="edit-input"
                        />
                      ) : (
                        user.phone
                      )}
                    </td>
                    {/* <td>
                      {editingUser === user.id ? (
                        <input
                          type="password"
                          name="password"
                          value={editForm.password || ""}
                          onChange={handleInputChange}
                          className="edit-input"
                        />
                      ) : (
                        user.password
                      )}
                    </td> */}
                    <td>
                      {editingUser === user.id ? (
                        <select
                          name="role"
                          value={editForm.role}
                          onChange={handleInputChange}
                          className="edit-select"
                        >
                          <option value="ADMIN">Admin</option>
                          <option value="SELLER">Seller</option>
                          <option value="USER">User</option>
                          <option value="ASSOCIATE">Associate</option>
                        </select>
                      ) : (
                        <span className={`role-badge role-${user.role?.toLowerCase()}`}>
                          {user.role}
                        </span>
                      )}
                    </td>
                    <td className="actions">
                      {editingUser === user.id ? (
                        <div className="edit-actions">
                          <button onClick={handleSaveEdit} className="save-btn" title="Save">
                            ✓
                          </button>
                          <button onClick={handleCancelEdit} className="cancel-btn" title="Cancel">
                            ✕
                          </button>
                        </div>
                      ) : (
                        <div className="action-buttons">
                          <button
                            onClick={() => handleEdit(user)}
                            className="edit-btn"
                            title="Edit"
                          >
                            <MdEdit/>
                          </button>
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="delete-btn"
                            title="Delete"
                          >
                            <MdDelete />
                          </button>
                        </div>
                      )}
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

export default ViewUser;
