import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import { useLocation } from 'react-router-dom';

const SearchBar = () => {
  const { search, setSearch, showSearch, setShowSearch } = useContext(ShopContext);
  const [visible, setVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.includes('collection')) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [location.pathname, showSearch]);

  return showSearch && visible ? (
    <div className='border-t border-b bg-gray-50 text-center py-3'>
      <div className='inline-flex items-center border border-gray-400 px-4 py-2 rounded-full w-[90%] sm:w-1/2'>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className='flex-1 outline-none bg-inherit text-sm'
          type='text'
          placeholder='Search'
        />
        <img className='w-4 ml-2' src={assets.search_icon} alt='Search icon' />
      </div>
      <img
        onClick={() => setShowSearch(false)}
        className='inline w-3 ml-3 cursor-pointer'
        src={assets.cross_icon}
        alt='Close icon'
      />
    </div>
  ) : null;
};

export default SearchBar;
