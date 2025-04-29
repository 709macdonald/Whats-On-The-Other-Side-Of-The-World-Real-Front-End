import React from "react";

function NavigationButtons({
  searchPerformed,
  onReset,
  onViewOriginal,
  onViewAntipode,
  onViewMcDonalds,
  searchCount,
}) {
  if (!searchPerformed) {
    return null;
  }

  const adjustedSearchCount = searchCount - 1;

  return (
    <div className="button-container">
      <button className="btn btn-yellow" onClick={onViewMcDonalds}>
        Nearest McDonald's
      </button>

      <button className="btn btn-green" onClick={onViewOriginal}>
        My Location
      </button>

      <button className="btn btn-red" onClick={onViewAntipode}>
        Other Side Of The World
      </button>

      {searchCount > 0 && (
        <button className="btn btn-blue" onClick={onReset}>
          Search Again ({adjustedSearchCount >= 0 ? adjustedSearchCount : 0}{" "}
          Left)
        </button>
      )}
    </div>
  );
}

export default NavigationButtons;
