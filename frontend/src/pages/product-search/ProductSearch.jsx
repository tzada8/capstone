import React, { useState } from "react";

import "./ProductSearch.css";
import ProductOption from "../../components/ProductOption";
import SearchBar from "../../components/search-bar/SearchBar";

function ProductSearch() {

    const [searchQuery, setSearchQuery] = useState("");
    const [productData, setProductData] = useState({"data": [], "pagination": {}})

    const onSearchSubmit = (event) => {
        event.preventDefault();
        const searchEndpoint = `${process.env.REACT_APP_BACKEND_BASE_API}/api/dummy/search-products?q=${searchQuery}`;
        fetch(searchEndpoint).then(res => res.json()).then(data => {
            setProductData(data.shopping_results);
        });
    }

	return (
		<div>
            <h1>Select products to compare</h1>
            <p>Obtain recommendations</p>
            <SearchBar onSearchSubmit={onSearchSubmit} query={searchQuery} setQuery={setSearchQuery}/>
            <p>{searchQuery}</p>
            <br/>
            {productData.data.map(product => (
                <ProductOption
                    thumbnail={product.thumbnail}
                    title={product.title}
                    rating={product.rating}
                    reviews={product.reviews}
                    extensions={product.extensions}
                    price={product.price}
                    link={product.link}
                    source={product.source}
                />
            ))}
            <br/>
            <button>Cancel</button>
            <button>Continue</button>
		</div>
	);
}

export default ProductSearch;
