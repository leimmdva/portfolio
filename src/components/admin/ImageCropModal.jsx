import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { getCroppedImage } from "../../utils/cropImage.js";

// Output size roughly matches the card/cover aspect ratio used across the site.
const OUTPUT_WIDTH = 1200;
const OUTPUT_HEIGHT = 675; // 16:9

export default function ImageCropModal({ imageSrc, onCancel, onConfirm }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [saving, setSaving] = useState(false);

  const onCropComplete = useCallback((_, pixels) => setCroppedAreaPixels(pixels), []);

  const handleConfirm = async () => {
    if (!croppedAreaPixels) return;
    setSaving(true);
    try {
      const dataUrl = await getCroppedImage(imageSrc, croppedAreaPixels, OUTPUT_WIDTH, OUTPUT_HEIGHT);
      onConfirm(dataUrl);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h3>Resmi kırp</h3>
        <div className="cropper-area">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={OUTPUT_WIDTH / OUTPUT_HEIGHT}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>
        <div className="field">
          <label>Yakınlaştır</label>
          <input
            type="range"
            min={1}
            max={3}
            step={0.05}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
          />
        </div>
        <div className="admin-form-actions">
          <button className="btn btn-primary" onClick={handleConfirm} disabled={saving}>
            {saving ? "Kırpılıyor..." : "Kırp ve kullan"}
          </button>
          <button className="btn btn-outline" onClick={onCancel}>
            Vazgeç
          </button>
        </div>
      </div>
    </div>
  );
}
