import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Home.css";
import SearchBar from "../../components/search-bar/SearchBar";

function Home() {
    const [searchQuery, setSearchQuery] = useState("");

    const navigate = useNavigate();
    const toProductSearch = () => {
        navigate("/product-search", {state: {query: searchQuery}})
    }

	return (
		<div>
            <h1>Making purchasing decisions easier with <b>simplified</b> specs & product reviews</h1>
            <br/>
            <SearchBar onSearchSubmit={() => toProductSearch()} query={searchQuery} setQuery={setSearchQuery}/>
		</div>
	);
}

export default Home;
