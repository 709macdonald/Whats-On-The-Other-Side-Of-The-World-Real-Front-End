import React from "react";
import NavigationButtons from "./NavigationButtons";

function Footer({
  onReset,
  searchPerformed = false,
  onViewOriginal,
  onViewAntipode,
  onViewMcDonalds,
  searchCount,
}) {
  return (
    <div className="footer">
      <NavigationButtons
        searchPerformed={searchPerformed}
        onReset={onReset}
        onViewOriginal={onViewOriginal}
        onViewAntipode={onViewAntipode}
        onViewMcDonalds={onViewMcDonalds}
        searchCount={searchCount}
      />
    </div>
  );
}

export default Footer;
