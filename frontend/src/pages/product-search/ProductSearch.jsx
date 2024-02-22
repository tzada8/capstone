import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "antd";

import "./ProductSearch.css";
import { routes } from "../../routes/Routes";
import FeaturePriorityModal from "../../components/modals/content/feature-priority/FeaturePriorityModal";
import Footer from "../../components/footer/Footer";
import Navbar from "../../components/navbar/Navbar";
import ProductOption from "../../components/product-option/ProductOption";
import SearchBar from "../../components/search-bar/SearchBar";

function ProductSearch() {
    const [searchQuery, setSearchQuery] = useState("");
    const [productData, setProductData] = useState([]);
    const [paginationStart, setPaginationStart] = useState(0);
    const [mainSelectedProducts, setMainSelectedProducts] = useState([]);
    const [currentSelectedProducts, setCurrentSelectedProducts] = useState([]);

    const [preferencesModalData, setPreferencesModalData] = useState(null);
    const [isFeaturePriorityModalOpen, setIsFeaturePriorityModalOpen] = useState(false);
    const [featurePriorityModalData, setFeaturePriorityModalData] = useState(null);

    const location = useLocation();

    const navigate = useNavigate();

    const toComparisons = async (featurePriority) => {
        navigate(routes.comparisons, {state: {
            selectedProducts: await fullSelectedProducts(),
            preferences: preferencesModalData,
            featurePriority: featurePriority,
        }})
    }

    const fullSelectedProducts = async () => {
        const currSelectedProducts = [...mainSelectedProducts, ...currentSelectedProducts];
        const selectedProductIds = currSelectedProducts.map(p => ({product_id: p.product_id, source: p.source}));
        const detailedSelectedProducts = await Promise.all(selectedProductIds.map(async p => {
            // const productEndpoint = `${process.env.REACT_APP_BACKEND_BASE_API}/api/product?source=${p.source}&product_id=$p.product_id}`;
            const productEndpoint = `${process.env.REACT_APP_BACKEND_BASE_API}/api/dummy/product`;
            const response = await fetch(productEndpoint);
            return await response.json();
        }));
        return detailedSelectedProducts;
    }

    const _searchProductsHelper = (q) => {
        if (q === "") {
            setSearchQuery(q);
            setProductData([]);
            return;
        }
        const selectedIds = [...mainSelectedProducts, ...currentSelectedProducts].map(p => p.product_id);
        const searchEndpoint = `${process.env.REACT_APP_BACKEND_BASE_API}/api/dummy/search-products?q=${q}`;
        fetch(searchEndpoint).then(res => res.json()).then(data => {
            const prodData = data.shopping_results.data.filter(p => !selectedIds.includes(p.product_id));
            setProductData(prodData);
        });
        setSearchQuery(q);
    }

    useEffect(() => {
        const q = location.state === null ? "" : location.state.query;
        const preferences = location.state === null ? null : location.state.preferences;
        setPreferencesModalData(preferences);
        _searchProductsHelper(q);
    }, [location.state]);

    const onSearchSubmit = () => {
        if (currentSelectedProducts.length !== 0) {
            setMainSelectedProducts([...mainSelectedProducts, ...currentSelectedProducts]);
            setCurrentSelectedProducts([]);
        }
        _searchProductsHelper(searchQuery);
    }

    const onProductSelection = (product) => {
        if (mainSelectedProducts.includes(product)) {
            setMainSelectedProducts(mainSelectedProducts.filter(p => p !== product));
            setProductData([...productData, product]);
        } else if (currentSelectedProducts.includes(product)) {
            setCurrentSelectedProducts(currentSelectedProducts.filter(p => p !== product));
        } else {
            setCurrentSelectedProducts([...currentSelectedProducts, product]);
        }
    }

    const handleFeaturePriorityModalSubmit = (data) => {
        setFeaturePriorityModalData(data);
        setIsFeaturePriorityModalOpen(false);
        toComparisons(data);
    }

    const handleLoadMoreProducts = () => {
        const searchEndpoint = `${process.env.REACT_APP_BACKEND_BASE_API}/api/dummy/search-products?q=${searchQuery}&start=${paginationStart}`;
        fetch(searchEndpoint).then(res => res.json()).then(data => {
            const moreProdData = data.shopping_results.data;
            setProductData([...productData, ...moreProdData])
        });
        setPaginationStart(paginationStart + 100);
    }

	return (
		<div className="page-margin">
            <FeaturePriorityModal
                isOpen={isFeaturePriorityModalOpen}
                onSubmit={handleFeaturePriorityModalSubmit}
                onClose={() => setIsFeaturePriorityModalOpen(false)}
            />

            <Navbar isComparisonNav={false} />

            <h1>Select products to compare</h1>
            <SearchBar onSearchSubmit={onSearchSubmit} query={searchQuery} setQuery={setSearchQuery}/>
            <br/>
            <p>SEARCH QUERY: {searchQuery}</p>
            <p># MAIN SELECTED PRODUCTS: {mainSelectedProducts.length}</p>
            <p># CURR SELECTED PRODUCTS: {currentSelectedProducts.length}</p>
            <p># PRODUCT OPTIONS: {productData.length}</p>
            <br/>

            <p><span style={{color: "red"}}>Red:</span> Unselected Products</p>
            <p><span style={{color: "blue"}}>Blue:</span> Selected Products</p>
            <p>{mainSelectedProducts.length + currentSelectedProducts.length} Selected</p>
            <br/>

            <Button
                onClick={() => navigate(routes.home)}
                type="primary" size="large" ghost className="primary-button"
            >Cancel</Button>
            <Button
                disabled={mainSelectedProducts.length + currentSelectedProducts.length < 3}
                onClick={() => setIsFeaturePriorityModalOpen(true)}
                type="primary" size="large" className="primary-button"
            >Next</Button>
            <br/>
            <br/>

            {mainSelectedProducts.map(product => (
                <ProductOption
                    data={product}
                    changeSelection={onProductSelection}
                    isSelected={mainSelectedProducts.includes(product)}
                />
            ))}
            {productData.map(product => (
                <ProductOption
                    data={product}
                    changeSelection={onProductSelection}
                    isSelected={currentSelectedProducts.includes(product)}
                />
            ))}

            <br/>
            {productData.length > 0 && <Button
                onClick={handleLoadMoreProducts}
                type="primary" size="large" className="alternative-button"
            >Load more</Button>}
            <Footer />
		</div>
	);
}

export default ProductSearch;
