import React, { useState } from "react";
import SearchInputBar from "./SearchInputBar";
import SuggestionsList from "./SuggestionsList";
import { geocodeLocation } from "../../services/GeocodingService";

function SearchWrapper({ onPlaceSelected }) {
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
    setShowSuggestions(true); // start showing suggestions on typing
  };

  const handleSuggestionSelect = (suggestion) => {
    setSearchTerm(suggestion.text);
    setShowSuggestions(false);

    if (onPlaceSelected) {
      onPlaceSelected({ lat: suggestion.lat, lng: suggestion.lng });
    }
  };

  return (
    <div style={{ position: "relative", width: "100%", maxWidth: "500px" }}>
      <SearchInputBar
        onSearch={handleSearch}
        onInputChange={handleInputChange}
        inputValue={searchTerm}
        onFocus={() => setShowSuggestions(true)}
      />
      {showSuggestions && (
        <SuggestionsList
          searchTerm={searchTerm}
          onSelect={handleSuggestionSelect}
          onClose={() => setShowSuggestions(false)}
        />
      )}
    </div>
  );
}

export default SearchWrapper;
