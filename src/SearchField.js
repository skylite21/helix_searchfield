import React, { useState, useEffect, useRef } from 'react';
import './searchfield.css';

const SearchField = ({ options = [], onChange = () => {}, placeholder = 'Search...' }) => {
  const [opened, setOpened] = useState(false);
  const container = useRef(null);
  // amit a user beir
  const [searchTerm, setSearchTerm] = useState('');
  // amit a user kiválaszt
  const [selectedItem, setSelectedItem] = useState('');
  const [searchResults, setSearchResults] = useState(options);
  const [cursorIndex, setCursorIndex] = useState(-1);

  const handleOutsideClick = (event) => {
    console.log('clicked');
    if (!container.current?.contains(event.target)) setOpened(false);
  };

  function handleInput(input) {
    setSearchTerm(input);
    setSelectedItem(input);
    setOpened(false);
  }

  useEffect(() => {
    if (opened) {
      const results = options.filter((option) => option.includes(searchTerm.toLowerCase()));
      setSearchResults(results);
    }
  }, [searchTerm, options]);

  useEffect(() => {
    document.addEventListener('click', handleOutsideClick);
    return () => {
      console.log('dropdown unmounted');
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);
  return (
    <div className={opened ? 'search-field' : 'search-field rounded'} ref={container}>
      <span className='search-icon' />
      <input
        className='input-real'
        value={searchTerm}
        onChange={(event) => {
          setSearchTerm(event.target.value);
          setOpened(true);
        }}
        onClick={() => {
          setOpened(!opened);
        }}
      />
      {opened && (
        <div className='options'>
          {searchResults.map((option, index) => (
            <button
              key={option}
              className={`option ${index === cursorIndex ? 'hover' : ''}`}
              onClick={() => {
                handleInput(option);
              }}>
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchField;
