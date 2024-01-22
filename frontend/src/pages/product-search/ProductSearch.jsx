import React, { useState } from "react";

import "./ProductSearch.css";
import ProductOption from "../../components/ProductOption";
import SearchBar from "../../components/search-bar/SearchBar";

function ProductSearch() {

    const [searchQuery, setSearchQuery] = useState("");
    const [productData, setProductData] = useState({"data": [], "pagination": {}})
    const [selectedProducts, setSelectedProducts] = useState([]);

    const onSearchSubmit = (event) => {
        event.preventDefault();
        const searchEndpoint = `${process.env.REACT_APP_BACKEND_BASE_API}/api/dummy/search-products?q=${searchQuery}`;
        fetch(searchEndpoint).then(res => res.json()).then(data => {
            setProductData(data.shopping_results);
        });
    }

    // TODO: Update unique product value from link to product_id.
    const onProductSelection = (link) => {
        if (selectedProducts.includes(link)) {
            setSelectedProducts(selectedProducts.filter(p => p !== link));
        } else {
            setSelectedProducts([...selectedProducts, link]);
        }
    }

	return (
		<div>
            <h1>Select products to compare</h1>
            <p>Obtain recommendations</p>
            <SearchBar onSearchSubmit={onSearchSubmit} query={searchQuery} setQuery={setSearchQuery}/>
            <p>TEMP DISPLAY: {searchQuery}</p>
            <p>TEMP DISPLAY: <br/> {selectedProducts}</p>
            <br/>
            {productData.data.map(product => (
                <ProductOption
                    data={product}
                    changeSelection={onProductSelection}
                    isSelected={selectedProducts.includes(product.link)}
                />
            ))}
            <br/>
            <button>Cancel</button>
            <button>Continue</button>
		</div>
	);
}

export default ProductSearch;
