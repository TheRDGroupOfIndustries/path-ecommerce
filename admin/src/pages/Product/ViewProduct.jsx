import { fetchDataFromApi,deleteData,editData } from "../../utils/api"
import { useState, useEffect } from "react"
import "./Product.css"
import { useContext } from "react"
import { myContext } from "../../App"
import EditModal from "./EditModal";
import { Star,Eye, Pencil, Trash2, ChevronDown } from "lucide-react";

const ViewProduct = () => {
  const context = useContext(myContext);
  const [products, setProducts] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [filterRating, setFilterRating] = useState("all")
  const [filterCategory, setFilterCategory] = useState("all");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);
  const [currentPage, setCurrentPage] = useState(1);
  const PRODUCTS_PER_PAGE = 4;
  
   const [editFormData, setEditFormData] = useState({
      name: "",
      description: "",
      price: "",
      discount: "",
      category: "",
      ratings: 0,
      features: [],
      highlights: [],
      insideBox: [],
      images: [],
      isTrendy:"",
    });

      const handleViewDetails = (product) => {
      setSelectedProduct(product)
      setShowModal(true)
      }

      const closeModal = () => {
      setShowModal(false)
      setSelectedProduct(null)
      }
  
    const [tempInputs, setTempInputs] = useState({
      image: "",
      feature: "",
      highlight: "",
      insideBoxItem: "",
    });
  
    const [ratingValue, setRatingValue] = useState(0);
  
    useEffect(() => {
  if (filterCategory === "all") {
    fetchingProduct();
  } else {
    fetchDataFromApi(`/product/get-by-category/${filterCategory}`)
      .then((res) => setProducts(res))
      .catch((error) => console.error("Error fetching by category:", error));
  }
}, [filterCategory]);


  const filteredProducts = products.filter((product) => {
  const ratingMatch =
    filterRating === "all" ||
    product.ratings === Number.parseInt(filterRating);
  const categoryMatch =
    filterCategory === "all" ||
    product.category.toLowerCase() === filterCategory.toLowerCase();

  return ratingMatch && categoryMatch;
});

  useEffect(() => {
    setCurrentPage(1);
  }, [filterCategory, products]);

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };
  
    const fetchingProduct = () => {
      fetchDataFromApi("/product/get-all")
        .then((res) => {
          setProducts(res);
        })
        .catch((error) => console.error("Error fetching Products:", error));
    };
  
    const handleEdit = (product) => {
      setSelectedProduct(product);
      setEditFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        discount: product.discount,
        category: product.category,
        ratings: product.ratings,
        features: [...product.features],
        highlights: [...product.highlights],
        insideBox: [...product.insideBox],
        images: [...product.images],
        isTrendy: product.isTrendy?.toString() || "", 
      });

      setRatingValue(product.ratings);
      setShowEditModal(true);
    };
  
    const handleEditChange = (e) => {
      const { name, value } = e.target;
      setEditFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    };
  
    const handleTempInputChange = (e) => {
      const { name, value } = e.target;
      setTempInputs((prev) => ({
        ...prev,
        [name]: value,
      }));
    };
  
    const addImage = () => {
      if (tempInputs.image.trim()) {
        setEditFormData((prev) => ({
          ...prev,
          images: [...prev.images, tempInputs.image.trim()],
        }));
        setTempInputs((prev) => ({ ...prev, image: "" }));
      }
    };
  
    const removeImage = (index) => {
      setEditFormData((prev) => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index),
      }));
    };
  
    const addArrayItem = (field, tempField) => {
      if (tempInputs[tempField].trim()) {
        setEditFormData((prev) => ({
          ...prev,
          [field]: [...prev[field], tempInputs[tempField].trim()],
        }));
        setTempInputs((prev) => ({ ...prev, [tempField]: "" }));
      }
    };
  
    const removeArrayItem = (field, index) => {
      setEditFormData((prev) => ({
        ...prev,
        [field]: prev[field].filter((_, i) => i !== index),
      }));
    };
  
    const handleEditSubmit = (e) => {
      e.preventDefault();
      const updatedData = { 
      ...editFormData, 
      ratings: ratingValue,
      isTrendy: editFormData.isTrendy === "true",
      discount: parseInt(editFormData.discount) || 0,
    };

      editData(`/product/update-product/${selectedProduct.id}`, updatedData)
        .then(() => {
          context.setAlertBox({
            open: true,
            msg: "Product updated successfully!",
            error: false,
          });
          setShowEditModal(false);
          fetchingProduct();
        })
        .catch(() => {
          context.setAlertBox({
            open: true,
            msg: "Error updating product",
            error: true,
          });
        });
    };
  
    const handleDelete = (id) => {
      if (window.confirm("Are you sure you want to delete this product?")) {
        deleteData(`/product/delete-product/${id}`)
          .then(() => {
            context.setAlertBox({
              open: true,
              msg: "Product deleted successfully!",
              error: false,
            });
            fetchingProduct();
          })
          .catch(() => {
            context.setAlertBox({
              open: true,
              msg: "Error deleting product",
              error: true,
            });
          });
      }
    };
    
  
    useEffect(() => {
      const handleResize = () => setIsMobile(window.innerWidth <= 600);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

  return (
    <div className="product-container">
      {/* Header Section Styled Like ViewItemM */}
      <div className="user-header">
        <div className="user-header-main">
          <h1>View Products</h1>
          <div className="custom-select-wrapper" style={{ position: 'relative' }}>
            <select
              id="categoryFilter"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="role-filter"
            >
              <option value="all">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="cloth">Cloth</option>
              <option value="Books">Books</option>
              <option value="Furniture">Furniture</option>
              <option value="Accessories">Accessories</option>
              <option value="Foot Wear">Foot Wear</option>
            </select>
            <span className="custom-arrow" style={{ position: 'absolute', right: 18, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#fff', fontSize: '1.2rem', zIndex: 3, display: 'flex', alignItems: 'center' }}>
              <ChevronDown size={20} />
            </span>
          </div>
        </div>
        <div className="user-stats">
          <span>Total Products: {products.length}</span><br />
          <span>Current Shown: {filteredProducts.length}</span>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="no-products">
          <p>No products found.</p>
        </div>
      ) : (
        isMobile ? (
          <div className="user-list">
            {paginatedProducts.map((product) => (
              <div className="user-card" key={product.id}>
                <div>
                  {product.images.length > 0 ? (
                    <img src={product.images?.[0] || "/placeholder.svg"} alt={product.name} />
                  ) : (
                    <div className="no-image">No Image</div>
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <div className="user-name"><strong>{product.name}</strong></div>
                  <div className="user-description description-clamp">{product.description}</div>
                  <div className="user-category"><strong>{product.category}</strong></div>
                  <div className="user-price"><span className="price-badge">₹{product.price}</span></div>
                  <div className="user-discount">
                    {product.discount > 0 ? (
                      <span className="discount-badge">{product.discount}%</span>
                    ) : (
                      <span className="no-discount">No Discount</span>
                    )}
                  </div>
                  <div className="user-rating rating-display">
                    <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                      <Star size={16} style={{ color: '#ffc107', verticalAlign: 'middle' }} />
                      <span className="rating-number" style={{ marginLeft: 4 }}>{product.ratings}</span>
                    </span>
                  </div>
                  <div className="actions">
                    <div className="action-buttons">
                      <button onClick={() => handleViewDetails(product)} className="view-btn" title="View"><Eye size={18} /></button>
                      <button onClick={() => handleEdit(product)} className="edit-btn" title="Edit"><Pencil size={18} /></button>
                      <button onClick={() => handleDelete(product.id)} className="delete-btn" title="Delete"><Trash2 size={18} /></button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
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
                  <th>Image</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Discount</th>
                  <th>Rating</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedProducts.map((product) => (
                  <tr key={product.id}>
                    <td>
                      {product.images.length > 0 ? (
                        <img src={product.images?.[0] || "/placeholder.svg"} alt={product.name} width="50" height="50" />
                      ) : (
                        "No Image"
                      )}
                    </td>
                    <td>{product.name}</td>
                    <td><div className="description-clamp">{product.description}</div></td>
                    <td>{product.category}</td>
                    <td><span className="price-badge">₹{product.price}</span></td>
                    <td>
                      {product.discount > 0 ? (
                        <span className="discount-badge">{product.discount}%</span>
                      ) : (
                        <span className="no-discount">No Discount</span>
                      )}
                    </td>
                    <td>
                      <div className="rating-display" style={{ display: 'inline-flex', alignItems: 'center' }}>
                        <Star size={16} style={{ color: '#ffc107', verticalAlign: 'middle' }} />
                        <span className="rating-number" style={{ marginLeft: 4 }}>{product.ratings}</span>
                      </div>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button onClick={() => handleViewDetails(product)} className="view-btn" title="View"><Eye size={18} /></button>
                        <button onClick={() => handleEdit(product)} className="edit-btn" title="Edit"><Pencil size={18} /></button>
                        <button onClick={() => handleDelete(product.id)} className="delete-btn" title="Delete"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
        )
      )}

      {/* Edit Modal and View Modal remain unchanged */}
      {/* Edit Modal */}
          {showEditModal && (
            <div className="modal-overlay" style={{ zIndex: 2001 }}>
              <div className="modal-content" style={{ zIndex: 2002, position: 'relative' }}>
                <EditModal
                  show={showEditModal}
                  onClose={() => setShowEditModal(false)}
                  formData={editFormData}
                  onChange={handleEditChange}
                  onSubmit={handleEditSubmit}
                  tempInputs={tempInputs}
                  handleTempInputChange={handleTempInputChange}
                  addImage={addImage}
                  removeImage={removeImage}
                  addArrayItem={addArrayItem}
                  removeArrayItem={removeArrayItem}
                  rating={ratingValue}
                  setRating={setRatingValue}
                  setFormRating={(val) =>
                    setEditFormData((prev) => ({ ...prev, ratings: val }))
                  }
                />
              </div>
            </div>
          )}


      {/* View Product Details Modal */}
      {showModal && selectedProduct && (
        <div className="modal-overlay" style={{ zIndex: 2001 }} onClick={closeModal}>
          <div className="modal-content" style={{ zIndex: 2002 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Product Details</h3>
              <button className="modal-close" onClick={closeModal} title="Close">
                &times;
              </button>
            </div>

            <div className="modal-body">
              <div className="detail-section">
                <h4>Basic Information</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <strong>Name:</strong> {selectedProduct.name}
                  </div>
                  <div className="detail-item">
                    <strong>Price:</strong> ₹{selectedProduct.price}
                  </div>
                  <div className="detail-item">
                    <strong>Discount:</strong> {selectedProduct.discount}%
                  </div>
                  <div className="detail-item">
                    <strong>Ratings:</strong> {selectedProduct.ratings}/5
                  </div>
                   <div className="detail-item">
                    <strong>isTrendy?:</strong>{" "}
                    {selectedProduct.isTrendy === true && <span className="badge1 green">Yes</span>}
                    {selectedProduct.isTrendy === false && <span className="badge1 red">No</span>}
                    {selectedProduct.isTrendy === null && <span className="badge1 gray">Not Set</span>}
                  </div>
                </div>
                <div className="detail-item full-width">
                  <strong>Description:</strong> {selectedProduct.description}
                </div>
              </div>

              {selectedProduct.images.length > 0 && (
                <div className="detail-section">
                  <h4>Images ({selectedProduct.images.length})</h4>
                  <div className="modal-images">
                    {selectedProduct.images.map((image, index) => (
                      <img key={index} src={image || "/placeholder.svg"} alt={`Product ${index + 1}`} />
                    ))}
                  </div>
                </div>
              )}

              {selectedProduct.features.length > 0 && (
                <div className="detail-section">
                  <h4>Features</h4>
                  <div className="detail-tags">
                    {selectedProduct.features.map((feature, index) => (
                      <span key={index} className="detail-tag">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            {selectedProduct.highlights.length > 0 && (
            <div className="detail-section">
              <h4>Highlights</h4>
              <div className="modal-images">
                {selectedProduct.highlights.map((highlight, index) => (
                  <img key={index} src={highlight || "/placeholder.svg"} alt={`Highlight ${index + 1}`} />
                ))}
              </div>
            </div>
            )}
            
              {selectedProduct.insideBox.length > 0 && (
                <div className="detail-section">
                  <h4>Inside Box</h4>
                  <div className="detail-tags">
                    {selectedProduct.insideBox.map((item, index) => (
                      <span key={index} className="detail-tag inbox-tag">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ViewProduct




