import React, { useState } from "react";
import SearchInputBar from "./SearchInputBar";
import SuggestionsList from "./SuggestionsList";
import { geocodeLocation } from "../../services/GeocodingService";

function SearchWrapper({ onPlaceSelected }) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = async (value) => {
    setSearchTerm(value);

    if (value.trim() === "") return;

    const location = await geocodeLocation(value);
    if (location && onPlaceSelected) {
      onPlaceSelected({ lat: location.lat, lng: location.lng });
    }
  };

  const handleSuggestionSelect = (suggestion) => {
    setSearchTerm(suggestion.text);
    if (onPlaceSelected) {
      onPlaceSelected({ lat: suggestion.lat, lng: suggestion.lng });
    }
  };

  return (
    <div>
      <SearchInputBar onSearch={handleSearch} />
      <SuggestionsList
        searchTerm={searchTerm}
        onSelect={handleSuggestionSelect}
      />
    </div>
  );
}

export default SearchWrapper;
