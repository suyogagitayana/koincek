import React, { useState } from 'react';
import { Search, X } from 'react-feather';

const SearchBar = ({
    iconSize = 16,
    placeholder = 'Type and Enter to search . . .',
    onSearch = () => {}
}) => {
    const [search, setSearch] = useState('');

    const onEnter = e => e.key === 'Enter' && onSearch({search});

    const onDelete = () => {
        setSearch('');
        onSearch();
    };

    return (
        <>
            <div className='flex justify-center items-center p-2 text-gray-600 z-10'>
                <Search size={iconSize} />
            </div>
            <input
                type='text'
                value={search}
                className='border-gray-200 rounded-2xl border-solid border-1 w-full px-8 py-2 h-8 text-xs -ml-8'
                placeholder={placeholder}
                onChange={e => setSearch(e.target.value)}
                onKeyDown={onEnter} />
            {search && <div className='flex justify-center items-center p-2 text-gray-600 cursor-pointer -ml-8' onClick={onDelete}>
                <X size={iconSize} />
            </div>}
        </>
    );
};

export default SearchBar;