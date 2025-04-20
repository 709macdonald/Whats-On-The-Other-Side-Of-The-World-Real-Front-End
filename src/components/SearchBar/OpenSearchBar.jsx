import React, { useState, useEffect, useRef } from "react";
import {
  geocodeLocation,
  getSuggestions,
} from "../../services/GeocodingService";

function OpenSearchBar({ onPlaceSelected }) {
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const inputRef = useRef(null);
  const suggestionListRef = useRef(null);
  const debounceTimerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionListRef.current &&
        !suggestionListRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    setError("");
    setSelectedIndex(-1);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(async () => {
      if (value.length < 3) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      try {
        setLoading(true);
        const results = await getSuggestions(value);
        setSuggestions(results);
        setShowSuggestions(results.length > 0);
      } catch (err) {
        console.error("Error getting suggestions:", err);
      } finally {
        setLoading(false);
      }
    }, 50);
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion.text);
    setShowSuggestions(false);
    onPlaceSelected?.({ lat: suggestion.lat, lng: suggestion.lng });
    inputRef.current?.focus();
  };

  const handleSearch = async () => {
    if (inputValue.trim() === "") {
      setError("Please enter a location");
      return;
    }

    setLoading(true);
    setError("");
    setShowSuggestions(false);

    try {
      const location = await geocodeLocation(inputValue);
      if (location) {
        onPlaceSelected?.({ lat: location.lat, lng: location.lng });
      } else {
        setError("Location not found. Please try a different search.");
      }
    } catch (err) {
      console.error("Search error:", err);
      setError("Error searching for location. Please try again.");
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (
        showSuggestions &&
        selectedIndex >= 0 &&
        selectedIndex < suggestions.length
      ) {
        handleSuggestionClick(suggestions[selectedIndex]);
      } else {
        handleSearch();
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (showSuggestions) {
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (showSuggestions) {
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  useEffect(() => {
    if (selectedIndex >= 0 && suggestionListRef.current) {
      const el = suggestionListRef.current.children[selectedIndex];
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }
  }, [selectedIndex]);

  return (
    <div className="search-container">
      <input
        ref={inputRef}
        type="text"
        className="search-input"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onClick={() => {
          if (inputValue.length >= 3 && suggestions.length > 0) {
            setShowSuggestions(true);
          }
        }}
        placeholder="Search for a location..."
        disabled={loading}
        autoComplete="off"
      />
      <button
        onClick={handleSearch}
        className="search-button"
        disabled={loading}
      >
        {loading ? "Searching..." : "Search"}
      </button>

      {showSuggestions && suggestions.length > 0 && (
        <ul ref={suggestionListRef} className="suggestions-list">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className={`suggestion-item ${
                index === selectedIndex ? "selected" : ""
              }`}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              {suggestion.text}
            </li>
          ))}
        </ul>
      )}

      {error && <div className="search-error">{error}</div>}
    </div>
  );
}

export default OpenSearchBar;
