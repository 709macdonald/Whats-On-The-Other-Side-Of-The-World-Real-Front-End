import React, { useState } from "react";
import SearchInputBar from "./SearchInputBar";
import SuggestionsList from "./SuggestionsList";
import { geocodeLocation } from "../../services/GeocodingService";

function SearchWrapper({ onPlaceSelected, searchCount, handlePurchase }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSearch = async (value) => {
    setSearchTerm(value);
    setShowSuggestions(false);

    if (value.trim() === "") return;

    const location = await geocodeLocation(value);
    if (location && onPlaceSelected) {
      onPlaceSelected({ lat: location.lat, lng: location.lng });
    }
  };

  const handleInputChange = (val) => {
    setSearchTerm(val);
    if (val.trim().length >= 2) {
      setShowSuggestions(true);
    }
  };

  const handleSuggestionSelect = (suggestion) => {
    setSearchTerm(suggestion.text);
    setShowSuggestions(false);

    if (onPlaceSelected) {
      onPlaceSelected({ lat: suggestion.lat, lng: suggestion.lng });
    }
  };

  return (
    <div className="search-wrapper-container">
      <div className="Search-Wrapper">
        {searchCount > 0 ? (
          <>
            <SearchInputBar
              onSearch={handleSearch}
              onInputChange={handleInputChange}
              inputValue={searchTerm}
              onFocus={() => setShowSuggestions(true)}
            />
            {showSuggestions ? (
              <SuggestionsList
                searchTerm={searchTerm}
                onSelect={handleSuggestionSelect}
                onClose={() => setShowSuggestions(false)}
              />
            ) : (
              <div style={{ display: "none" }}>Suggestions hidden</div>
            )}
          </>
        ) : (
          <>
            <h2 className="out-of-searches-msg">You're out of searches!</h2>
            <p>Please purchase more to continue exploring.</p>
            <div
              style={{
                display: "flex",
                gap: "10px",
                flexDirection: "column",
                marginTop: "20px",
              }}
            >
              <button
                className="search-button"
                onClick={() => handlePurchase(5)}
              >
                Purchase 5 Searches ($0.99)
              </button>
              <button
                className="search-button"
                onClick={() => handlePurchase(15)}
              >
                Purchase 15 Searches ($2.49)
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default SearchWrapper;
