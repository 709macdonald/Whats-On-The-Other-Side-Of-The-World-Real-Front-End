import React, { useEffect, useState, useRef } from "react";
import { getSuggestions } from "../../services/GeocodingService";

function SuggestionsList({ searchTerm, onSelect, onClose }) {
  const [suggestions, setSuggestions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const suggestionListRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (searchTerm.length < 3) {
      setSuggestions([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      try {
        const results = await getSuggestions(searchTerm);
        setSuggestions(results);
      } catch (err) {
        // Error handling is kept but without console.error
      }
    }, 200);
  }, [searchTerm]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        suggestionListRef.current &&
        !suggestionListRef.current.contains(e.target)
      ) {
        onClose?.();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  useEffect(() => {
    if (selectedIndex >= 0 && suggestionListRef.current) {
      const el = suggestionListRef.current.children[selectedIndex];
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }
  }, [selectedIndex]);

  if (suggestions.length === 0) {
    return null;
  }

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
