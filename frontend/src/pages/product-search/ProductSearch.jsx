import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "antd";

import "./ProductSearch.css";
import { routes } from "../../routes/Routes";
import FeaturePriorityModal from "../../components/modals/content/feature-priority/FeaturePriorityModal";
import Footer from "../../components/footer/Footer";
import Loading from "../../components/loading/Loading";
import Navbar from "../../components/navbar/Navbar";
import ProductOption from "../../components/product-option/ProductOption";
import SearchBar from "../../components/search-bar/SearchBar";

function ProductSearch() {
    const numPickedForYou = 3;
    const minProductsSelected = 3;

    const [isLoading, setIsLoading] = useState(false);
    const [loadingPercent, setLoadingPercent] = useState(0);

    const [searchQuery, setSearchQuery] = useState("");
    const [productData, setProductData] = useState([]);
    const [paginationStart, setPaginationStart] = useState(0);
    const [mainSelectedProducts, setMainSelectedProducts] = useState([]);
    const [currentSelectedProducts, setCurrentSelectedProducts] = useState([]);
    const allSelectedProducts = [...mainSelectedProducts, ...currentSelectedProducts];
    const numProductsSelected = mainSelectedProducts.length + currentSelectedProducts.length;

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

    const productSelectionNumber = (product) => {
        return allSelectedProducts.includes(product) ? (allSelectedProducts.indexOf(product) + 1) : null;
    }

    const fullSelectedProducts = async () => {
        const selectedProductIds = allSelectedProducts.map(p => ({product_id: p.product_id, source: p.source}));

        setIsLoading(true);
        setLoadingPercent(0);
        const loadingInterval = 100 / selectedProductIds.length;
        const detailedSelectedProducts = await Promise.all(selectedProductIds.map(async p => {
            // const productEndpoint = `${process.env.REACT_APP_BACKEND_BASE_API}/api/product?source=${p.source}&product_id=${p.product_id}`;
            const productEndpoint = `${process.env.REACT_APP_BACKEND_BASE_API}/api/dummy/product`;
            const response = await fetch(productEndpoint);
            setLoadingPercent(prevLoadingPercent => prevLoadingPercent + loadingInterval);
            return await response.json();
        }));
        setIsLoading(false);
        setLoadingPercent(0);
        return detailedSelectedProducts;
    }

    const _searchProductsHelper = (q) => {
        if (q === "") {
            setSearchQuery(q);
            setProductData([]);
            return;
        }
        const selectedIds = allSelectedProducts.map(p => p.product_id);
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
            setMainSelectedProducts(allSelectedProducts);
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
        <div>
            <Loading isLoading={isLoading} percent={loadingPercent} />
            <div className="fixed-buttons-container">
                <div className="fixed-buttons">
                    <Button
                        onClick={() => navigate(routes.home)}
                        type="primary" size="large" ghost className="primary-button sticky-button"
                    >Cancel</Button>
                    <Button
                        disabled={numProductsSelected < minProductsSelected}
                        onClick={() => setIsFeaturePriorityModalOpen(true)}
                        type="primary" size="large" className="primary-button sticky-button disabled-button-background"
                    >Next</Button>
                </div>
            </div>
            <div className="page-margin">
                <FeaturePriorityModal
                    isOpen={isFeaturePriorityModalOpen}
                    onSubmit={handleFeaturePriorityModalSubmit}
                    onClose={() => setIsFeaturePriorityModalOpen(false)}
                />

                <Navbar isComparisonNav={false} />

                <h1>Select products to compare</h1>
                <br/>
                <p className="body-1 center-text">Obtain recommendations for the products you select you will like most using a likeability</p>
                <p className="body-1 center-text">rating based off of your learned preferences and aggregated product reviews</p>
                <br/>
                <div className="search-and-selected">
                    <SearchBar
                        isButtonInsideBar={true}
                        onSearchSubmit={onSearchSubmit}
                        query={searchQuery}
                        setQuery={setSearchQuery}
                    />
                    <p className={`body-1-medium num-selected ${numProductsSelected < minProductsSelected ? "" : "min-selection"}`}>
                        {numProductsSelected} Selected
                    </p>
                </div>

                <br/>
                <div className="picked-for-you">
                    <h4>Picked for you</h4>
                    <p className="body-1">Based on how much you liked previous recommendation rankings and answers to question</p>
                    {productData.slice(0, numPickedForYou).map(product => (
                        <ProductOption
                            data={product}
                            selectionNumber={productSelectionNumber(product)}
                            changeSelection={onProductSelection}
                        />
                    ))}
                </div>
                <br/>

                <div className="all-products">
                    <h4>All products</h4>
                    {mainSelectedProducts.map(product => (
                        <ProductOption
                            data={product}
                            selectionNumber={productSelectionNumber(product)}
                            changeSelection={onProductSelection}
                        />
                    ))}
                    {productData.slice(numPickedForYou).map(product => (
                        <ProductOption
                            data={product}
                            selectionNumber={productSelectionNumber(product)}
                            changeSelection={onProductSelection}
                        />
                    ))}
                </div>

                <br/>
                {productData.length > 0 && <Button
                    onClick={handleLoadMoreProducts}
                    type="primary" size="large" className="alternative-button center-button"
                >Load more</Button>}
                <Footer />
            </div>
        </div>
	);
}

export default ProductSearch;
