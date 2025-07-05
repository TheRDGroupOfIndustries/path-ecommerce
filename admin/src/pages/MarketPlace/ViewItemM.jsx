import { useState, useEffect } from "react";
import { fetchDataFromApi, editData, deleteData } from "../../utils/api";
import { MdDelete, MdEdit } from "react-icons/md";
import './AddItemM.css'

const ViewitemM = () => {
  const [users, setUsers] = useState([]);
  const [filteredItem, setFilteredItem] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [editingItem, setEditingItem] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);

  const category = ["All", "Cloth", "Makeup", "Shoes","Furniture","Electronic"];

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchItems();
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 600);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchItems = async () => {
    const res = await fetchDataFromApi("/marketplace/get-all");
    if (res && Array.isArray(res.marketplaces)) {
      setUsers(res.marketplaces);
    } else {
      console.error("Unexpected API response:", res);
      setUsers([]);
    }
  };

  useEffect(() => {
    const filtered =
      selectedCategory === "All"
        ? users
        : users.filter(
            (user) =>
              user.category?.toLowerCase() === selectedCategory.toLowerCase()
          );
    setFilteredItem(filtered);
  }, [selectedCategory, users]);

  const handleRoleFilter = (e) => setSelectedCategory(e.target.value);

  const handleEdit = (user) => {
    setEditingItem(user.id);
    const { id, _id, ...data } = user;
    setEditForm({ ...data, newImage: "" });
    setIsModalOpen(true);
  };

  const handleSaveEdit = async () => {
    const { name, description, imageUrl, category, createdById } = editForm;
    try {
      const payload = {
        name,
        description,
        imageUrl,
        createdById,
        category: category.toUpperCase(),
      };
      await editData(`/marketplace/update/${editingItem}`, payload);
      await fetchItems();
      setEditingItem(null);
      setEditForm({});
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error updating item:", error);
      alert("Failed to update item.");
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this Item?")) {
      try {
        await deleteData(`/marketplace/delete/${userId}`);
        setUsers(users.filter((user) => user.id !== userId));
      } catch (error) {
        console.error("Delete error:", error);
        alert("Failed to delete item.");
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddImage = () => {
    if (editForm.newImage.trim()) {
      setEditForm((prev) => ({
        ...prev,
        imageUrl: [...(prev.imageUrl || []), prev.newImage.trim()],
        newImage: "",
      }));
    }
  };

  const removeImage = (idx) => {
    setEditForm((prev) => ({
      ...prev,
      imageUrl: prev.imageUrl.filter((_, index) => index !== idx),
    }));
  };

  return (
    <div className="user-container">
      <div className="user-header">
        <h1>View Items</h1>
        <div className="user-stats">
          <span>Total Items: {filteredItem.length}</span>
        </div>
      </div>

      <div className="filter-section">
        <label htmlFor="roleFilter">Filter by Category:</label>
        <select id="roleFilter" value={selectedCategory} onChange={handleRoleFilter} className="role-filter">
          {category.map((role) => (
            <option key={role} value={role}>{role}</option>
          ))}
        </select>
      </div>

      {filteredItem.length === 0 ? (
        <div className="no-products">
          <p>No Item found.</p>
        </div>
      ) : (
        isMobile ? (
          <div className="user-list">
            {filteredItem.map((user) => (
              <div className="user-card" key={user.id}>
                <div>
                  {user.imageUrl?.[0] ? (
                    <img src={user.imageUrl[0]} alt={user.name} />
                  ) : (
                    <div className="no-image">No image</div>
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <div className="user-name"><strong>{user.name}</strong></div>
                  <div className="user-description description-clamp">{user.description}</div>
                  <div className="user-category">{user.category}</div>
                  <div className="actions">
                    <div className="action-buttons">
                      <button className="edit-btn" onClick={() => handleEdit(user)}><MdEdit /></button>
                      <button className="delete-btn" onClick={() => handleDelete(user.id)}><MdDelete /></button>
                    </div>
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
                  <th>Image</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItem.map((user, index) => (
                  <tr key={user.id}>
                    <td>{index + 1}</td>
                    <td>{user.name}</td>
                    <td>
                      {user.imageUrl?.[0] ? (
                        <img src={user.imageUrl[0]} alt={user.name} width="50" height="50" />
                      ) : (
                        "No image"
                      )}
                    </td>

                    <td><div className="description-clamp">
                      {user.description}
                    </div></td>

                    <td>{user.category}</td>
                    <td>
                      <div className="action-buttons">
                        <button className="edit-btn" onClick={() => handleEdit(user)}><MdEdit /></button>
                        <button className="delete-btn" onClick={() => handleDelete(user.id)}><MdDelete /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Edit Item</h2>
            <label>Name:</label>
            <input name="name" value={editForm.name || ""} onChange={handleInputChange} />

            <label>Description:</label>
            <textarea name="description" value={editForm.description || ""} onChange={handleInputChange} />

            <label>Category:</label>
            <select name="category" value={editForm.category || ""} onChange={handleInputChange}>
              <option value="CLOTH">Cloth</option>
              <option value="MAKEUP">Makeup</option>
              <option value="SHOES">Shoes</option>
            </select>

            <label>Images:</label>
            <div className="image-edit-grid">
              {editForm.imageUrl?.map((img, idx) => (
                <div key={idx} className="item-edit-btn">
                  <img src={img} alt={`img-${idx}`} width="60" height="60" />
                  <button onClick={() => removeImage(idx)}>Remove</button>
                </div>
              ))}
            </div>
            <input
              name="newImage"
              value={editForm.newImage || ""}
              onChange={handleInputChange}
              placeholder="Add new image URL"
            />
            <button onClick={handleAddImage}>Add Image</button>

            <div className="modal-actions">
              <button onClick={handleSaveEdit}>Save</button>
              <button onClick={() => setIsModalOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewitemM;

