import { fetchDataFromApi,deleteData,editData } from "../../utils/api"
import { useState, useEffect } from "react"
import "./Product.css"
import { useContext } from "react"
import { myContext } from "../../App"
import EditModal from "./EditModal";
import { Eye,Pencil,Trash2 } from "lucide-react";

const ViewProduct = () => {
  const context = useContext(myContext);
  const [products, setProducts] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [filterRating, setFilterRating] = useState("all")
  const [filterCategory, setFilterCategory] = useState("all");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);
  
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

  const filteredProducts = products.filter((product) => {
  const ratingMatch =
    filterRating === "all" ||
    product.ratings === Number.parseInt(filterRating);
  const categoryMatch =
    filterCategory === "all" ||
    product.category.toLowerCase() === filterCategory.toLowerCase();

  return ratingMatch && categoryMatch;
});

  return (
    <div className="product-container">
      <div className="product-header">
        <h1>View Products</h1>
        <div className="product-stats">Total Products: {products.length}</div>
      </div>

    <div className="filter-container">
      <div className="filter-section">
        <label>Filter by Rating:</label>
        <select value={filterRating} onChange={(e) => setFilterRating(e.target.value)} className="rating-filter">
          <option value="all">All Ratings</option>
          <option value="5">5 Stars</option>
          <option value="4">4 Stars</option>
          <option value="3">3 Stars</option>
          <option value="2">2 Stars</option>
          <option value="1">1 Star</option>
        </select>
      </div>
 
   <div className="filter-section">
      <label>Filter by Category:</label>
     <select
     value={filterCategory}
     onChange={(e) => setFilterCategory(e.target.value)}
     className="rating-filter">
      <option value="all">All Categories</option>
      <option value="Electronics">Electronics</option>
      <option value="cloth">Cloth</option>
      <option value="Books">Books</option>
      <option value="Furniture">Furniture</option>
      <option value="Accessories">Accessories</option>
      <option value="Foot Wear">Foot Wear</option>
     </select>
  </div>
 </div>

      {filteredProducts.length === 0 ? (
        <div className="no-products">
          <p>No products found.</p>
        </div>
      ) : (
        isMobile ? (
          <div className="product-list">
            {filteredProducts.map((product) => (
              <div className="product-card" key={product.id}>
                <div className="product-image-cell">
                  {product.images.length > 0 ? (
                    <img src={product.images?.[0] || "/placeholder.svg"} alt={product.name} />
                  ) : (
                    <div className="no-image">No Image</div>
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <div className="product-name"><strong>{product.name}</strong></div>
                  <div className="product-description description-clamp">{product.description}</div>
                  <span className="price-badge">₹{product.price}</span>
                  {product.discount > 0 ? (
                    <span className="discount-badge">{product.discount}%</span>
                  ) : (
                    <span className="no-discount">No Discount</span>
                  )}
                  <div className="rating-display">
                    {"★".repeat(product.ratings)}{"☆".repeat(5 - product.ratings)}
                  </div>
                  <div className="features-preview">
                    {product.features.slice(0, 2).map((feature, index) => (
                      <span key={index} className="feature-tag">{feature}</span>
                    ))}
                    {product.features.length > 2 && (
                      <span className="more-features">+{product.features.length - 2} more</span>
                    )}
                  </div>
                  <div><strong>{product.category}</strong></div>
                  <div className="actions">
                    <div className="action-buttons">
                      <button onClick={() => handleViewDetails(product)} className="view-btn">View</button>
                      <button onClick={() => handleEdit(product)} className="edit-btn">Edit</button>
                      <button onClick={() => handleDelete(product.id)} className="delete-btn">Delete</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="table-container">
            <table className="product-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Discount</th>
                  <th>Rating</th>
                  <th>Category</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <div className="product-image-cell">
                        {product.images.length > 0 ? (
                          <img src={product.images?.[0] || "/placeholder.svg"} alt={product.name} />
                        ) : (
                          <div className="no-image">No Image</div>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="product-name">
                        <strong>{product.name}</strong>
                        <p className="product-description description-clamp">{product.description}</p>
                      </div>
                    </td>
                    <td>
                      <span className="price-badge">₹{product.price}</span>
                    </td>
                    <td>
                      {product.discount > 0 ? (
                        <span className="discount-badge">{product.discount}%</span>
                      ) : (
                        <span className="no-discount">No Discount</span>
                      )}
                    </td>
                    <td>
                      <div className="rating-display">
                        {"★".repeat(product.ratings)}
                        {"☆".repeat(5 - product.ratings)}
                      </div>
                    </td>
  
                    <td>
                       <strong>{product.category}</strong>
                    </td>
                    <td className="actions">
                      <div className="action-buttons">
                        <button onClick={() => handleViewDetails(product)} className="view-btn">
                          <Eye />
                        </button>
                        <button onClick={() => handleEdit(product)} className="edit-btn">
                         <Pencil />
                        </button>
                        <button onClick={() => handleDelete(product.id)} className="delete-btn">
                         <Trash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}

     {/* Edit Modal */}
          {showEditModal && (
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
          )}


      {/* View Product Details Modal */}
      {showModal && selectedProduct && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Product Details</h3>
              <button className="modal-close" onClick={closeModal}>
                ×
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




