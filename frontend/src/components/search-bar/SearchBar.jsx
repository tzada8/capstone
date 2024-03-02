import React from "react";
import { SearchOutlined } from '@ant-design/icons';

import "./SearchBar.css";

function SearchBar(props) {
    const searchBarClass = props.isButtonInsideBar ? "search-input-inside" : "search-input-outside"

    const handleSubmit = (event) => {
        event.preventDefault();
        props.onSearchSubmit();
    }

	return (
        <form onSubmit={handleSubmit}>
            <div className={props.isButtonInsideBar ? "search-container-inside" : "search-container-outside"}>
                <input
                    className={`body-1 ${searchBarClass}`}
                    type="text"
                    onChange={e => props.setQuery(e.target.value)}
                    value={props.query}
                    placeholder="Search for a product"
                />
                {props.isButtonInsideBar ? (
                    <button className="search-icon" type="submit"><SearchOutlined /></button>
                ) : (
                    <button type="submit" className="primary-button search-button-size">Search</button>
                )}
            </div>
        </form>
	);
}

export default SearchBar;
