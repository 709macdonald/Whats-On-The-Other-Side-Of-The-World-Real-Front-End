import React, { useState, useEffect, useRef, useCallback, memo } from "react";
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

  const suggestionListRef = useRef(null);
  const inputRef = useRef(null);
  const debounceTimerRef = useRef(null);

  // Memoize the getSuggestions function call to prevent unnecessary re-renders
  const fetchSuggestions = useCallback(async (value) => {
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
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    setError("");
    setSelectedIndex(-1);

    // Clear any existing debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // For immediate feedback, we can fetch suggestions right away
    // A small debounce (50ms) can still help prevent too many API calls
    // but will feel almost instant to the user
    debounceTimerRef.current = setTimeout(() => {
      fetchSuggestions(value);
    }, 50); // Reduced from 300ms to 50ms for faster response
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion.text);
    setShowSuggestions(false);

    if (onPlaceSelected) {
      onPlaceSelected({
        lat: suggestion.lat,
        lng: suggestion.lng,
      });
    }

    // Return focus to input after suggestion is selected
    if (inputRef.current) {
      inputRef.current.focus();
    }
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
        console.log("Found coordinates:", {
          lat: location.lat,
          lng: location.lng,
        });

        if (onPlaceSelected) {
          onPlaceSelected({ lat: location.lat, lng: location.lng });
        }
      } else {
        setError("Location not found. Please try a different search.");
      }
    } catch (error) {
      console.error("Search error:", error);
      setError("Error searching for location. Please try again.");
    } finally {
      setLoading(false);
      // Return focus to input after search
      if (inputRef.current) {
        inputRef.current.focus();
      }
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

  // Use this effect to preserve cursor position when input value changes
  useEffect(() => {
    if (inputRef.current) {
      const cursorPosition = inputRef.current.selectionStart;
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.selectionStart = cursorPosition;
          inputRef.current.selectionEnd = cursorPosition;
        }
      }, 0);
    }
  }, [inputValue]);

  useEffect(() => {
    if (selectedIndex >= 0 && suggestionListRef.current) {
      const selectedElement = suggestionListRef.current.children[selectedIndex];
      if (selectedElement) {
        selectedElement.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    }
  }, [selectedIndex]);

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

  // Memoize the suggestion click handler
  const memoizedHandleSuggestionClick = useCallback((suggestion) => {
    handleSuggestionClick(suggestion);
  }, []);

  // Create a memoized suggestions list component
  const SuggestionsList = memo(
    ({ suggestions, selectedIndex, onSuggestionClick }) => {
      return (
        <ul ref={suggestionListRef} className="suggestions-list">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => onSuggestionClick(suggestion)}
              className={`suggestion-item ${
                index === selectedIndex ? "selected" : ""
              }`}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              {suggestion.text}
            </li>
          ))}
        </ul>
      );
    }
  );

  return (
    <div className="search-container">
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onClick={() =>
          inputValue.length >= 3 &&
          suggestions.length > 0 &&
          setShowSuggestions(true)
        }
        placeholder="Search for a location..."
        className="search-input"
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
        <SuggestionsList
          suggestions={suggestions}
          selectedIndex={selectedIndex}
          onSuggestionClick={memoizedHandleSuggestionClick}
        />
      )}

      {error && <div className="search-error">{error}</div>}
    </div>
  );
}

export default OpenSearchBar;
