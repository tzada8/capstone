import React from "react";
import { Button } from "antd";

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
            <Button type="primary" size="large" className="primary-button" htmlType="submit">Search</Button>
        </form>
	);
}

export default SearchBar;
