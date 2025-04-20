import React, { useState, useRef } from "react";

function SearchInputBar({ onSearch }) {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef(null);

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onSearch(inputValue);
    }
  };

  const handleClick = () => {
    onSearch(inputValue);
  };

  return (
    <div className="search-container">
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Search for a location..."
        className="search-input"
        autoComplete="off"
      />
      <button className="search-button" onClick={handleClick}>
        Search
      </button>
    </div>
  );
}

export default SearchInputBar;
