import { ImCross } from "react-icons/im";
import { Rating } from "@mui/material";
import './Product.css';

export default function EditModal({
  show,
  onClose,
  formData,
  onChange,
  onSubmit,
  tempInputs,
  handleTempInputChange,
  addImage,
  removeImage,
  addArrayItem,
  removeArrayItem,
  rating,
  setRating,
  setFormRating,
  handleFileUpload ,
  loading
}) {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Edit Product</h3>
          <button onClick={onClose}><ImCross /></button>
        </div>

        <form onSubmit={onSubmit}>
          {/* Basic Fields */}
          <input type="text" name="name" value={formData.name} onChange={onChange} placeholder="Name" required />
          <textarea name="description" value={formData.description} onChange={onChange} rows="4" required />
          <input type="text" name="price" value={formData.price} onChange={onChange} placeholder="Price" required />
          <input type="number" name="discount" value={formData.discount} onChange={onChange} placeholder="Discount" min="0" max="100" />
          <input type="text" name="category" value={formData.category} onChange={onChange} placeholder="Category" required />

          {/* Rating */}
          <Rating
            name="rating"
            value={Number(rating)}
            onChange={(e, newValue) => {
              setRating(newValue);
              setFormRating(newValue);
            }}
          />

          {/* Trendy Toggle */}
          <div className="form-sectionn"><br />
            <h4>Is Trendy?</h4>
            <select
              name="isTrendy"
              value={formData.isTrendy}
              onChange={onChange}
              className="trendy-select"
            >
              <option value=""> Select </option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>

          {/* Image Section (URL + File) */}
          <h4>Product Images</h4>
          <input
            type="url"
            name="image"
            value={tempInputs.image}
            onChange={handleTempInputChange}
            placeholder="Enter image URL"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                addImage();
                e.preventDefault();
              }
            }}
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileUpload(e, "images")}
          />
          <div className="image-preview2-grid">
            {formData.images.map((img, idx) => (
              <div key={idx} className="preview2-item image-preview">
                <button type="button" onClick={() => removeImage(idx)}><ImCross /></button>
                <img src={img} alt={`img-${idx}`} />
              </div>
            ))}
          </div>

          {/* Features */}
          <div className="form-section">
            <h4>Features</h4>
            <input
              type="text"
              name="feature"
              value={tempInputs.feature}
              onChange={handleTempInputChange}
              placeholder="Add feature"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  addArrayItem("features", "feature");
                  e.preventDefault();
                }
              }}
            />
            <div className="preview2-tags">
              {formData.features.map((f, i) => (
                <div key={i} className="preview2-tag">
                  <span>{f}</span>
                  <button type="button" onClick={() => removeArrayItem("features", i)}><ImCross /></button>
                </div>
              ))}
            </div>
          </div>

          {/* Highlights (URL + File Upload) */}
          <div className="form-section">
            <h4>Highlights</h4>
            <input
              type="url"
              name="highlight"
              value={tempInputs.highlight}
              onChange={handleTempInputChange}
              placeholder="Enter highlight URL"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  addArrayItem("highlights", "highlight");
                  e.preventDefault();
                }
              }}
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileUpload(e, "highlights")}
            />
            <div className="preview2-grid">
              {formData.highlights.map((h, i) => (
                <div key={i} className="preview2-item image-preview2">
                  <button type="button" onClick={() => removeArrayItem("highlights", i)}><ImCross /></button>
                  <img src={h} alt={`highlight-${i}`} />
                </div>
              ))}
            </div>
          </div>

          {/* Inside Box */}
          <div className="form-section">
            <h4>Inside Box</h4>
            <input
              type="text"
              name="insideBoxItem"
              value={tempInputs.insideBoxItem}
              onChange={handleTempInputChange}
              placeholder="Add box item"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  addArrayItem("insideBox", "insideBoxItem");
                  e.preventDefault();
                }
              }}
            />
            <div className="preview2-tags">
              {formData.insideBox.map((item, i) => (
                <div key={i} className="preview2-tag">
                  <span>{item}</span>
                  <button type="button" onClick={() => removeArrayItem("insideBox", i)}><ImCross /></button>
                </div>
              ))}
            </div>
          </div>

          <button type="submit" className="btn-save" disabled={loading}>
              {loading ? (
              <>
                <span className="spinner" /> Saving...
              </>
            ) : (
              "Save →"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
