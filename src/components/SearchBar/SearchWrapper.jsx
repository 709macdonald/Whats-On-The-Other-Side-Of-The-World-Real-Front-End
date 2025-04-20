import React, { useState } from "react";
import SearchInputBar from "./SearchInputBar";
import SuggestionsList from "./SuggestionsList";
import { geocodeLocation } from "../../services/GeocodingService";

function SearchWrapper({ onPlaceSelected }) {
  const [searchTerm, setSearchTerm] = useState(""); // 👈 updates on every keystroke

  const handleSearch = async (value) => {
    setSearchTerm(value); // ⬅️ still update this so the list can fetch suggestions

    if (value.trim() === "") return;

    const location = await geocodeLocation(value);
    if (location && onPlaceSelected) {
      onPlaceSelected({ lat: location.lat, lng: location.lng });
    }
  };

  const handleSuggestionSelect = (suggestion) => {
    setSearchTerm(suggestion.text); // update input text
    if (onPlaceSelected) {
      onPlaceSelected({ lat: suggestion.lat, lng: suggestion.lng });
    }
  };

  return (
    <div style={{ position: "relative", width: "100%", maxWidth: "500px" }}>
      <SearchInputBar
        onSearch={handleSearch}
        onInputChange={(val) => setSearchTerm(val)} // 👈 track keystrokes
        inputValue={searchTerm} // 👈 controlled input
      />
      <SuggestionsList
        searchTerm={searchTerm}
        onSelect={handleSuggestionSelect}
      />
    </div>
  );
}

export default SearchWrapper;
