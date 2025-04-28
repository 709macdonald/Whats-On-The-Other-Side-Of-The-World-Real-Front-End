import React from "react";

function NavigationButtons({
  searchPerformed,
  onReset,
  onViewOriginal,
  onViewAntipode,
  onViewMcDonalds,
  searchCount,
  handlePurchase, // ⬅️ Add this
}) {
  if (!searchPerformed) {
    return null;
  }

  return (
    <div className="button-container">
      <div style={{ textAlign: "center", marginBottom: "10px" }}>
        {searchCount > 0 ? (
          <p>You have {searchCount} searches left.</p>
        ) : (
          <p>You have no searches left. Please purchase more to continue!</p>
        )}
      </div>

      {searchCount > 0 ? (
        <button className="btn btn-blue" onClick={onReset}>
          Search Again
        </button>
      ) : (
        <button className="btn btn-purple" onClick={() => handlePurchase(5)}>
          Purchase 5 Searches ($0.99)
        </button>
      )}

      <button className="btn btn-green" onClick={onViewOriginal}>
        My Location
      </button>

      <button className="btn btn-red" onClick={onViewAntipode}>
        Other Side Of The World
      </button>

      <button className="btn btn-yellow" onClick={onViewMcDonalds}>
        Nearest McDonald's
      </button>
    </div>
  );
}

export default NavigationButtons;
