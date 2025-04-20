function SearchInputBar({ onSearch, onInputChange, inputValue, onFocus }) {
  const handleChange = (e) => {
    const val = e.target.value;
    onInputChange?.(val);
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
        type="text"
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={onFocus}
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
