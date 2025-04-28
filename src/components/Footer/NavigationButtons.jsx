import React from "react";

function NavigationButtons({
  searchPerformed,
  onReset,
  onViewOriginal,
  onViewAntipode,
  onViewMcDonalds,
  searchCount,
  handlePurchase,
}) {
  if (!searchPerformed) {
    return null;
  }

  return (
    <div className="button-container">
      {searchCount > 0 ? (
        <button className="btn btn-blue" onClick={onReset}>
          Search Again ({searchCount} Left)
        </button>
      ) : (
        <>
          <button className="btn btn-purple" onClick={() => handlePurchase(5)}>
            Purchase 5 Searches ($0.99)
          </button>
          <button className="btn btn-orange" onClick={() => handlePurchase(15)}>
            Purchase 15 Searches ($2.49)
          </button>
        </>
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
