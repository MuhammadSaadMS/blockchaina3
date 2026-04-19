import { useState } from "react";
import BrandFrame from "./BrandFrame";

export default function ManufacturerSection({ onRegister }) {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    await onRegister(id, name, description);
    setId("");
    setName("");
    setDescription("");
  };

  return (
    <BrandFrame title="Manufacturer Console">
      <form className="form-grid" onSubmit={submit}>
        <label>
          Product ID
          <input value={id} onChange={(e) => setId(e.target.value)} type="number" min="1" required />
        </label>
        <label>
          Product Name
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Organic Coffee" required />
        </label>
        <label>
          Description
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Batch details, origin, and quality notes"
            rows="3"
            required
          />
        </label>
        <button type="submit">Register Product</button>
      </form>
    </BrandFrame>
  );
}
