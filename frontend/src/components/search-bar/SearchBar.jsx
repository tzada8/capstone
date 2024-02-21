import React from "react";

import "./SearchBar.css";

function SearchBar(props) {
    const handleSubmit = (event) => {
        event.preventDefault();
        props.onSearchSubmit();
    }

	return (
        <form onSubmit={handleSubmit}>
            <input
                className="search-input"
                type="text"
                onChange={e => props.setQuery(e.target.value)}
                value={props.query}
                placeholder="Search for a product"
            />
            <button type="submit">Search</button>
        </form>
	);
}

export default SearchBar;
