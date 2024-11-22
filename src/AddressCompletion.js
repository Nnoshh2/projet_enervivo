import React, { useState, useEffect, useRef } from 'react';
import './Main.css';

const AddressCompletion = ({ containerId, suggestionsContainerId, noSuggestionText = 'No suggestion' }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [controller, setController] = useState(null);
  const containerRef = useRef(null);
  const suggestionsContainerRef = useRef(null);

  useEffect(() => {
    containerRef.current = document.getElementById(containerId);
    suggestionsContainerRef.current = document.getElementById(suggestionsContainerId);

    const handleKeyUp = () => {
      if (controller) {
        controller.abort();
      }

      const newController = new AbortController();
      setController(newController);

      const queryValue = containerRef.current.value.trim();
      setQuery(queryValue);

      if (queryValue.length > 3) {
        queryForSuggestions(queryValue, newController.signal);
      } else {
        resetSuggestions();
      }
    };

    containerRef.current.addEventListener('keyup', handleKeyUp);

    return () => {
      containerRef.current.removeEventListener('keyup', handleKeyUp);
    };
  }, [controller]);

  const resetSuggestions = () => {
    setSuggestions([]);
    suggestionsContainerRef.current.style.display = 'none';
  };

  const queryForSuggestions = (query, signal) => {
    const url = `https://data.geopf.fr/geocodage/search?index=address&limit=10&q=${encodeURIComponent(query)}`;
    fetch(url, { signal })
      .then(response => {
        if (!response.ok) {
          throw new Error('HTTP Error : ' + response.status);
        }
        return response.json();
      })
      .then(data => {
        resetSuggestions();
        if (data.features && data.features.length) {
          setSuggestions(data.features.slice(0, 5));  // Limiter à 5 suggestions
          suggestionsContainerRef.current.style.display = 'block';
        } else {
          setSuggestions([{ properties: { label: noSuggestionText } }]);
          suggestionsContainerRef.current.style.display = 'block';
        }
      })
      .catch(error => {
        if (error.name !== 'AbortError') {
          console.error('Error :', error);
        }
      });
  };

  const handleSuggestionClick = (feature) => {
    const { label } = feature.properties;
    const [longitude, latitude] = feature.geometry.coordinates;
    containerRef.current.value = label;
    suggestionsContainerRef.current.value = label;
    containerRef.current.dispatchEvent(new CustomEvent('address_selected', {
      detail: {
        latitude,
        longitude
      }
    }));
    resetSuggestions();
  };

  return (
    <div>
      {suggestions.map((feature, index) => (
        <div
          key={index}
          className="addressbar"
          onClick={() => handleSuggestionClick(feature)}
        >
          {feature.properties.label}
        </div>
      ))}
    </div>
  );
};

export default AddressCompletion;
