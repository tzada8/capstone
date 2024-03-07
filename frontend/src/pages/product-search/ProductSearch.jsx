import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";

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
    const maxProductsSelected = 10;

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

    const _searchProductsHelper = useCallback((q) => {
        if (q === "") {
            setSearchQuery(q);
            setProductData([]);
            return;
        }
        const searchEndpoint = `${process.env.REACT_APP_BACKEND_BASE_API}/api/dummy/search-products?q=${q}`;
        fetch(searchEndpoint).then(res => res.json()).then(data => {
            setProductData(data.shopping_results.data);
        });
        setSearchQuery(q);
    }, [])

    useEffect(() => {
        const q = location.state === null ? "" : location.state.query;
        const preferences = location.state === null ? null : location.state.preferences;
        setPreferencesModalData(preferences);
        _searchProductsHelper(q);
    }, [location.state, _searchProductsHelper]);

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

    const isNextButtonDisabled = numProductsSelected < minProductsSelected || numProductsSelected > maxProductsSelected;

	return (
        <div>
            <Loading isLoading={isLoading} percent={loadingPercent} size={200} strokeWidth={12} />
            <div className="fixed-buttons-container">
                <div className="fixed-buttons">
                    <button
                        onClick={() => navigate(routes.home)}
                        className="primary-button-inverted primary-button-size"
                    >Cancel</button>
                    <button
                        disabled={isNextButtonDisabled}
                        onClick={() => setIsFeaturePriorityModalOpen(true)}
                        className={`${isNextButtonDisabled ? "disabled-button" : "primary-button"} primary-button-size`}
                    >Next</button>
                </div>
            </div>
            <div className="page-margin">
                <FeaturePriorityModal
                    isOpen={isFeaturePriorityModalOpen}
                    onSubmit={handleFeaturePriorityModalSubmit}
                    onClose={() => setIsFeaturePriorityModalOpen(false)}
                />

                <Navbar isComparisonNav={false} />

                <h1 className="center-text max-width-heading">Compare products</h1>
                <br/>
                <div className="search-and-selected">
                    <p className="body-1">
                        <span className="body-1-bold">Select 3 or more</span> products to compare predicted likability and details
                    </p>
                    <p className="body-1-medium num-selected min-selection">
                        {numProductsSelected} Selected
                    </p>
                </div>
                <SearchBar
                    isButtonInsideBar={true}
                    onSearchSubmit={onSearchSubmit}
                    query={searchQuery}
                    setQuery={setSearchQuery}
                />

                <br/>
                <div>
                    <h4>Picked for you</h4>
                    <p className="body-1 max-width-body">Based on how much you liked previous recommendation rankings and answers to question</p>
                    <br/>
                    <div className="picked-for-you">
                        {productData.slice(0, numPickedForYou).map(product => (
                            <ProductOption
                                data={product}
                                selectionNumber={productSelectionNumber(product)}
                                changeSelection={onProductSelection}
                            />
                        ))}
                    </div>
                </div>
                <br/>
                <br/>

                <div>
                    <h4>All products</h4>
                    <br/>
                    <div className="all-products">
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
                </div>

                <br/>
                {productData.length > 0 && <button
                    onClick={handleLoadMoreProducts}
                    className="alternative-button primary-button-size center-button"
                >Load more</button>}
                <Footer />
            </div>
        </div>
	);
}

export default ProductSearch;
