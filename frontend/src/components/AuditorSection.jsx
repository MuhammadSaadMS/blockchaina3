import { useState } from "react";
import BrandFrame from "./BrandFrame";

const statusLabels = ["Manufactured", "InTransit", "Delivered"];

export default function AuditorSection({ onAudit }) {
  const [queryId, setQueryId] = useState("");
  const [result, setResult] = useState(null);

  const search = async () => {
    const data = await onAudit(queryId);
    setResult(data);
  };

  return (
    <BrandFrame title="Auditor View">
      <div className="audit-search">
        <input
          value={queryId}
          onChange={(e) => setQueryId(e.target.value)}
          type="number"
          min="1"
          placeholder="Enter Product ID"
        />
        <button type="button" onClick={search}>
          Search History
        </button>
      </div>

      {result && (
        <div className="audit-card">
          <h3>{result.product.name}</h3>
          <p>{result.product.description}</p>
          <p>
            Current Owner: <span>{result.product.currentOwner}</span>
          </p>
          <p>
            Status: <span>{statusLabels[Number(result.product.status)]}</span>
          </p>
          <h4>Movement History</h4>
          <ol>
            {result.history.map((owner, index) => (
              <li key={`${owner}-${index}`}>{owner}</li>
            ))}
          </ol>
        </div>
      )}
    </BrandFrame>
  );
}
