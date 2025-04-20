import React, { useEffect, useState, useRef } from "react";
import { getSuggestions } from "../../services/GeocodingService";

function SuggestionsList({ searchTerm, onSelect }) {
  const [suggestions, setSuggestions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const suggestionListRef = useRef(null);

  useEffect(() => {
    const fetch = async () => {
      if (searchTerm.length < 3) {
        setSuggestions([]);
        return;
      }

      try {
        const results = await getSuggestions(searchTerm);
        setSuggestions(results);
      } catch (err) {
        console.error("Error getting suggestions:", err);
      }
    };

    fetch();
  }, [searchTerm]);

  useEffect(() => {
    if (selectedIndex >= 0 && suggestionListRef.current) {
      const el = suggestionListRef.current.children[selectedIndex];
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }
  }, [selectedIndex]);

  if (suggestions.length === 0) return null;

  return (
    <ul ref={suggestionListRef} className="suggestions-list">
      {suggestions.map((suggestion, index) => (
        <li
          key={index}
          className={`suggestion-item ${
            index === selectedIndex ? "selected" : ""
          }`}
          onClick={() => onSelect(suggestion)}
          onMouseEnter={() => setSelectedIndex(index)}
        >
          {suggestion.text}
        </li>
      ))}
    </ul>
  );
}

export default SuggestionsList;
