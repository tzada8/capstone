import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import "./ProductSearch.css";
import FeaturePriorityModal from "../../components/modals/content/feature-priority/FeaturePriorityModal";
import PreferencesModal from "../../components/modals/content/preferences/PreferencesModal";
import ProductOption from "../../components/ProductOption";
import SearchBar from "../../components/search-bar/SearchBar";

function ProductSearch() {
    const [searchQuery, setSearchQuery] = useState("");
    const [productData, setProductData] = useState([]);
    // TODO: Implement pagination.
    const [productPagination, setProductPagination] = useState({});
    const [mainSelectedProducts, setMainSelectedProducts] = useState([]);
    const [currentSelectedProducts, setCurrentSelectedProducts] = useState([]);

    const [isPreferencesModalOpen, setIsPreferencesModalOpen] = useState(false);
    const [preferencesModalData, setPreferencesModalData] = useState(null);

    const [isFeaturePriorityModalOpen, setIsFeaturePriorityModalOpen] = useState(false);
    const [featurePriorityModalData, setFeaturePriorityModalData] = useState(null);

    const location = useLocation();

    const navigate = useNavigate();

    const toComparisons = async (featurePriority) => {
        navigate("/comparisons", {state: {
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
            setProductPagination({});
            return;
        }
        const selectedIds = [...mainSelectedProducts.map(p => p.product_id), ...currentSelectedProducts.map(p => p.product_id)];
        const searchEndpoint = `${process.env.REACT_APP_BACKEND_BASE_API}/api/dummy/search-products?q=${q}`;
        fetch(searchEndpoint).then(res => res.json()).then(data => {
            const prodData = data.shopping_results.data.filter(p => !selectedIds.includes(p.product_id));
            setProductData(prodData);
            setProductPagination(data.shopping_results.pagination);
        });
        setSearchQuery(q);
    }

    useEffect(() => {
        const q = location.state === null ? "" : location.state.query;
        const searchEndpoint = `${process.env.REACT_APP_BACKEND_BASE_API}/api/dummy/search-products2?q=${q}`;
        fetch(searchEndpoint).then(res => res.json()).then(data => {
            setProductData(data.shopping_results.data);
            setProductPagination(data.shopping_results.pagination);
        });
        setSearchQuery(q);
        // TODO: Uncomment following once no longer need to use hardcoded backend data (replacing lines above).
        // _searchProductsHelper(searchQuery);
    }, [location.state]);

    const onSearchSubmit = (event) => {
        event.preventDefault();
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

    const handlePreferencesModalSubmit = (data) => {
        setPreferencesModalData(data);
        setIsPreferencesModalOpen(false);
        setIsFeaturePriorityModalOpen(true);
    }

    const handleFeaturePriorityModalSubmit = (data) => {
        setFeaturePriorityModalData(data);
        setIsFeaturePriorityModalOpen(false);
        toComparisons(data);
    }

	return (
		<div>
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

            <button>Cancel</button>
            <button
                disabled={mainSelectedProducts.length + currentSelectedProducts.length < 3}
                onClick={() => setIsPreferencesModalOpen(true)}
            >Continue</button>
            <br/>
            <br/>

            <PreferencesModal
                isOpen={isPreferencesModalOpen}
                onSubmit={handlePreferencesModalSubmit}
                onClose={() => setIsPreferencesModalOpen(false)}
            />

            <FeaturePriorityModal
                isOpen={isFeaturePriorityModalOpen}
                onSubmit={handleFeaturePriorityModalSubmit}
                onClose={() => setIsFeaturePriorityModalOpen(false)}
            />

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
		</div>
	);
}

export default ProductSearch;
