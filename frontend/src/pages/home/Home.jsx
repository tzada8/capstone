import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Home.css";
import SearchBar from "../../components/search-bar/SearchBar";

function Home() {
    const [currentNumber, setCurrentNumber] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");

    const navigate = useNavigate();
    const toProductSearch = () => {
        navigate("/product-search", {state: {query: searchQuery}})
    }

    const handleNumberClick = () => {
        fetch(`${process.env.REACT_APP_BACKEND_BASE_API}/api/number`, {
            "method": "POST",
            headers: {"Content-Type": "application/json"},
            "body": JSON.stringify({number: Number(currentNumber)}),
        }).then(res => res.json()).then(data => {
            setCurrentNumber(data.number);
        });
    }

    const handleNumberChange = (event) => {
        setCurrentNumber(event.target.value);
    }

	return (
		<div>
            <input type="number" onChange={handleNumberChange} />
            <button onClick={handleNumberClick}>Change Number</button>
            <p>The current number is {currentNumber}.</p>
            <p>Environment: {process.env.REACT_APP_ENVIRONMENT}.</p>

            <SearchBar onSearchSubmit={() => toProductSearch()} query={searchQuery} setQuery={setSearchQuery}/>
		</div>
	);
}

export default Home;