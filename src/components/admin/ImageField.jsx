import { useRef, useState } from "react";
import { readFileAsDataUrl } from "../../utils/cropImage.js";
import ImageCropModal from "./ImageCropModal.jsx";

export default function ImageField({ label, value, onChange }) {
  const fileInputRef = useRef(null);
  const [pendingSrc, setPendingSrc] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow picking the same file again later
    if (!file) return;
    const dataUrl = await readFileAsDataUrl(file);
    setPendingSrc(dataUrl);
  };

  return (
    <div className="field">
      <label>{label}</label>
      <div className="image-field">
        <input type="text" placeholder="https://..." value={value} onChange={(e) => onChange(e.target.value)} />
        <button type="button" className="btn btn-outline" onClick={() => fileInputRef.current?.click()}>
          Bilgisayardan yükle
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
      </div>
      {value && (
        <div className="image-field-preview">
          <img src={value} alt="" />
        </div>
      )}

      {pendingSrc && (
        <ImageCropModal
          imageSrc={pendingSrc}
          onCancel={() => setPendingSrc(null)}
          onConfirm={(croppedDataUrl) => {
            onChange(croppedDataUrl);
            setPendingSrc(null);
          }}
        />
      )}
    </div>
  );
}
