import React, { useEffect, useState, useRef } from "react";
import { getSuggestions } from "../../services/GeocodingService";

function SuggestionsList({ searchTerm, onSelect, onClose }) {
  const [suggestions, setSuggestions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const suggestionListRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    console.log(
      "SearchTerm changed:",
      searchTerm,
      "length:",
      searchTerm.length
    );

    if (searchTerm.length < 3) {
      console.log("Search term too short, clearing suggestions");
      setSuggestions([]);
      return;
    }

    console.log("Fetching suggestions for:", searchTerm);

    debounceRef.current = setTimeout(async () => {
      try {
        const results = await getSuggestions(searchTerm);
        console.log("Suggestions received:", results);
        setSuggestions(results);
      } catch (err) {
        console.error("Error getting suggestions:", err);
      }
    }, 200);
  }, [searchTerm]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        suggestionListRef.current &&
        !suggestionListRef.current.contains(e.target)
      ) {
        console.log("Click outside suggestions list, closing");
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

  console.log(
    "Rendering SuggestionsList, suggestions count:",
    suggestions.length
  );

  if (suggestions.length === 0) {
    console.log("No suggestions to show, returning null");
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
