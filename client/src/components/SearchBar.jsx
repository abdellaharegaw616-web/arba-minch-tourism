import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { services } from '../data/services';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef(null);

  // All searchable content - memoized to prevent re-creation on every render
  const searchableContent = useMemo(() => [
    ...services.map(s => ({ type: 'service', title: s.name, description: s.description, price: s.price, icon: s.icon, link: '/services' })),
    { type: 'page', title: 'Home', description: 'Welcome to Arba Minch Tourism', link: '/' },
    { type: 'page', title: 'Gallery', description: 'View Arba Minch attractions', link: '/gallery' },
    { type: 'page', title: 'Booking', description: 'Book your tour', link: '/booking' },
    { type: 'page', title: 'Live Chat', description: 'Chat with our guides', link: '/translator' },
    { type: 'page', title: 'Dashboard', description: 'View your bookings', link: '/dashboard' },
    { type: 'attraction', title: 'Lake Chamo', description: 'Crocodiles and hippos', link: '/gallery' },
    { type: 'attraction', title: 'Nech Sar Park', description: 'Zebras and gazelles', link: '/gallery' },
    { type: 'attraction', title: 'Forty Springs', description: 'Natural springs', link: '/gallery' },
    { type: 'attraction', title: 'Dorze Village', description: 'Traditional bamboo houses', link: '/gallery' },
    { type: 'attraction', title: 'Bridge of God', description: 'Land bridge between lakes', link: '/gallery' },
  ], []); // Remove services dependency since it's an outer scope value

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.length > 1) {
      const filtered = searchableContent.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered.slice(0, 10));
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [query, searchableContent]);

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
  };

  const getResultIcon = (type) => {
    const icons = {
      service: '💼',
      page: '📄',
      attraction: '🏞️',
    };
    return icons[type] || '🔍';
  };

  return (
    <div ref={searchRef} className="relative">
      <div className="relative">
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search services, attractions..."
          className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-dark-100 text-gray-900 dark:text-white"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            ❌
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-dark-100 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 max-h-96 overflow-y-auto">
          {results.map((result, index) => (
            <Link
              key={index}
              to={result.link}
              onClick={() => setIsOpen(false)}
              className="flex items-start p-3 hover:bg-gray-50 dark:hover:bg-dark-200 transition-colors border-b border-gray-100 dark:border-gray-800 last:border-0"
            >
              <div className="text-2xl mr-3">{getResultIcon(result.type)}</div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 dark:text-white">{result.title}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">{result.description}</p>
                {result.price && (
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">${result.price}</p>
                )}
              </div>
              <span className="text-xs text-gray-400 capitalize">{result.type}</span>
            </Link>
          ))}
        </div>
      )}

      {isOpen && query.length > 1 && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-dark-100 rounded-lg shadow-xl p-4 text-center text-gray-500">
          No results found for "{query}"
        </div>
      )}
    </div>
  );
};

export default SearchBar;
