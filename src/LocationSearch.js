import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";
import "./hh.css";

const LocationSearch = ({ onSelect }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate(); // Initialize useNavigate

  const handleInputChange = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length > 2) {
      try {
        const response = await axios.get(`https://photon.komoot.io/api/?q=${value}&limit=5&lang=en`);
        setSuggestions(response.data.features.map(feature => feature.properties.name + (feature.properties.city ? `, ${feature.properties.city}` : "")));
        setShowSuggestions(true);
      } catch (error) {
        console.error("Error fetching suggestions", error);
      }
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    if (onSelect) onSelect(suggestion);
    navigate("/services"); // Redirect to the services page
  };

  const handleClickOutside = (e) => {
    if (searchRef.current && !searchRef.current.contains(e.target)) {
      setShowSuggestions(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="location-search" ref={searchRef}>
      <input
        type="text"
        className="autocomplete-input"
        value={query}
        onChange={handleInputChange}
        placeholder="Enter a location"
      />
      {showSuggestions && (
        <ul className="suggestions-list">
          {suggestions.map((suggestion, index) => (
            <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LocationSearch;
