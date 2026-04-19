import { useState } from "react";
import BrandFrame from "./BrandFrame";

export default function TransferSection({ onStatusUpdate, onTransfer }) {
  const [productId, setProductId] = useState("");
  const [newOwner, setNewOwner] = useState("");

  return (
    <BrandFrame title="Owner / Transferee Operations">
      <div className="form-grid">
        <label>
          Product ID
          <input value={productId} onChange={(e) => setProductId(e.target.value)} type="number" min="1" required />
        </label>
        <label>
          Next Owner Address
          <input
            value={newOwner}
            onChange={(e) => setNewOwner(e.target.value)}
            placeholder="0x..."
            required
          />
        </label>
        <div className="button-row">
          <button type="button" onClick={() => onStatusUpdate(productId, 1)}>
            Set InTransit
          </button>
          <button type="button" onClick={() => onStatusUpdate(productId, 2)}>
            Set Delivered
          </button>
          <button type="button" onClick={() => onTransfer(productId, newOwner)}>
            Transfer To Next Role
          </button>
        </div>
      </div>
    </BrandFrame>
  );
}
