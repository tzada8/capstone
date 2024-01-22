import React from "react";

import "./SearchBar.css";

function SearchBar(props) {
	return (
        <form onSubmit={props.onSearchSubmit}>
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
