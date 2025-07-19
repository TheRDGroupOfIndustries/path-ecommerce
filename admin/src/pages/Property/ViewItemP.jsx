import { useState, useEffect, useContext } from "react";
import { fetchDataFromApi, editData, deleteData } from "../../utils/api";
import { ChevronDown, Pencil, Trash2 } from "lucide-react";
import { myContext } from "../../App";

const ViewitemP = () => {
  const context = useContext(myContext);
  const [users, setUsers] = useState([]);
  const [filteredItem, setFilteredItem] = useState([]);
  const [availableCategories, setAvailableCategories] = useState(["All"]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [editingItem, setEditingItem] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchItems();
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 600);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchItems = async () => {
    const res = await fetchDataFromApi("/property/by-role");
    if (res && Array.isArray(res.data)) {
      setUsers(res.data);

      const uniqueCategories = Array.from(
        new Set(res.data.map((item) => item.category).filter(Boolean))
      );
      setAvailableCategories(["All", ...uniqueCategories]);
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
    setCurrentPage(1);
  }, [selectedCategory, users]);

  const totalPages = Math.ceil(filteredItem.length / ITEMS_PER_PAGE);
  const paginatedItems = filteredItem.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

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
        category: category?.toUpperCase(),
      };

      await editData(`/property/update/${editingItem}`, payload);

      context.setAlertBox({
        open: true,
        msg: "Item updated successfully!",
        error: false,
      });

      await fetchItems();
      setEditingItem(null);
      setEditForm({});
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error updating item:", error);
      context.setAlertBox({
        open: true,
        msg: "Error updating product",
        error: true,
      });
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this Item?")) {
      try {
        await deleteData(`/property/delete/${userId}`);
        setUsers(users.filter((user) => user.id !== userId));
        context.setAlertBox({
          open: true,
          msg: "Item deleted successfully!",
          error: false,
        });
      } catch (error) {
        console.error("Delete error:", error);
        context.setAlertBox({
          open: true,
          msg: "Failed to delete item.",
          error: true,
        });
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddImage = () => {
    if (editForm.newImage?.trim()) {
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

  const handleFileUpload = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onloadend = () => {
    setEditForm((prev) => ({
      ...prev,
      imageUrl: [...(prev.imageUrl || []), reader.result], // base64 string
    }));
  };
  reader.readAsDataURL(file);
};

  return (
    <div className="user-container">
      {isModalOpen && (
        <div
          style={{
            zIndex: 2001,
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              background: "rgba(30,32,48,0.55)",
              zIndex: 2001,
            }}
            onClick={() => setIsModalOpen(false)}
          />
          <div
            className="modal-edit-content"
            style={{
              zIndex: 2002,
              position: "fixed",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              background: "#fff",
              borderRadius: 12,
              padding: 24,
              maxWidth: 600,
              width: "90vw",
              boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
              transition: "none",
              animation: "none",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Edit Item</h2>
            <label>Name:</label>
            <input
              name="name"
              value={editForm.name || ""}
              onChange={handleInputChange}
            />
            <label>Description:</label>
            <textarea
              name="description"
              value={editForm.description || ""}
              onChange={handleInputChange}
            />
            <label>Category:</label>
            <input
              type="text"
              name="category"
              value={editForm.category || ""}
              onChange={handleInputChange}
              placeholder="Enter category"
            />
            <label>Images:</label>
            <div className="image-edit-grid">
              {editForm.imageUrl?.map((img, idx) => (
                <div key={idx} className="item-edit-btn">
                  <img src={img} alt={`img-${idx}`} width="60" height="60" />
                  <button onClick={() => removeImage(idx)}>Remove</button>
                </div>
              ))}
            </div>
            {/* Add via URL */}
        <input
          name="newImage"
          value={editForm.newImage || ""}
          onChange={handleInputChange}
          placeholder="Paste image URL"
        />
        <div className="add-img-button-editmodel">
          <button onClick={handleAddImage}>Add</button>
        </div>

        {/* Add via File Upload */}
        <label>Or Upload from Device:</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
        />

            <div className="modal-actions">
              <button onClick={handleSaveEdit}>Save</button>
              <button onClick={() => setIsModalOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="user-header">
        <div className="user-header-main">
          <h1>View Items</h1>
          <div className="custom-select-wrapper">
            <select
              id="roleFilter"
              value={selectedCategory}
              onChange={handleRoleFilter}
              className="role-filter"
            >
              <option value="Filter" disabled>
                Filter
              </option>
              {availableCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <span className="custom-arrow">
              <ChevronDown size={20} />
            </span>
          </div>
        </div>
        <div className="user-stats">
          <span>Total Items: {users.length}</span>
          <br />
          <span>Current Filtered: {filteredItem.length}</span>
        </div>
      </div>

      {filteredItem.length === 0 ? (
        <div className="no-products">
          <p>No Item found.</p>
        </div>
      ) : isMobile ? (
        <div className="user-list">
          {paginatedItems.map((user) => (
            <div className="user-card" key={user.id}>
              <div>
                {user.imageUrl?.[0] ? (
                  <img src={user.imageUrl[0]} alt={user.name} />
                ) : (
                  <div className="no-image">No image</div>
                )}
              </div>
              <div style={{ flex: 1 }}>
                <div className="user-name">
                  <strong>{user.name}</strong>
                </div>
                <div className="user-description">{user.description}</div>
                <div className="user-category">{user.category}</div>
                <div className="actions">
                  <div className="action-buttons">
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(user)}
                    >
                      <Pencil />
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(user.id)}
                    >
                      <Trash2 />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div className="pagination-controls">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              &lt; Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                className={currentPage === i + 1 ? "active" : ""}
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next &gt;
            </button>
          </div>
        </div>
      ) : (
        <div className="table-container">
          <table className="user-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Description</th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedItems.map((user) => (
                <tr key={user.id}>
                  <td>
                    {user.imageUrl?.[0] ? (
                      <img
                        src={user.imageUrl[0]}
                        alt={user.name}
                        width="50"
                        height="50"
                      />
                    ) : (
                      "No image"
                    )}
                  </td>
                  <td>{user.name}</td>
                  <td>
                    <div className="description-clamp">{user.description}</div>
                  </td>
                  <td>{user.category}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="edit-btn"
                        onClick={() => handleEdit(user)}
                      >
                        <Pencil />
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(user.id)}
                      >
                        <Trash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination-controls">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              &lt; Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                className={currentPage === i + 1 ? "active" : ""}
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next &gt;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewitemP;
