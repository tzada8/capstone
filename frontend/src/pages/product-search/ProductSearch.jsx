import React, { useState, useEffect, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import "./ProductSearch.css";
import { routes } from "../../routes/Routes";
import ConstantLoading from "../../components/loading/ConstantLoading";
import FeaturePriorityModal from "../../components/modals/content/feature-priority/FeaturePriorityModal";
import Loading from "../../components/loading/Loading";
import Navbar from "../../components/navbar/Navbar";
import ProductOption from "../../components/product-option/ProductOption";
import SearchBar from "../../components/search-bar/SearchBar";

function ProductSearch() {
    const numPickedForYou = 3;
    const minProductsSelected = 3;
    const maxProductsSelected = 10;
    const paginatedInterval = 20;

    const [isSearchLoading, setIsSearchLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingPercent, setLoadingPercent] = useState(0);

    const [searchQuery, setSearchQuery] = useState("");
    const [productData, setProductData] = useState([]);
    const [paginationStart, setPaginationStart] = useState(paginatedInterval);
    const [mainSelectedProducts, setMainSelectedProducts] = useState([]);
    const [currentSelectedProducts, setCurrentSelectedProducts] = useState([]);
    const allSelectedProducts = [...mainSelectedProducts, ...currentSelectedProducts];
    const numProductsSelected = mainSelectedProducts.length + currentSelectedProducts.length;

    const [showRecommendations, setShowRecommendations] = useState(null);
    const [isPreferencesSkipped, setIsPreferencesSkipped] = useState(null);
    const [preferencesModalData, setPreferencesModalData] = useState(null);
    const [isFeaturePriorityModalOpen, setIsFeaturePriorityModalOpen] = useState(false);

    const location = useLocation();

    const navigate = useNavigate();
    const toComparisons = async (featurePriority) => {
        const productResults = await fullSelectedProducts(preferencesModalData, featurePriority);
        navigate(routes.comparisons, {state: {
            selectedProducts: productResults[0],
            "recommendations": productResults[1],
            "showRecommendations": showRecommendations,
        }})
    }

    const productSelectionNumber = (product) => {
        return allSelectedProducts.includes(product) ? (allSelectedProducts.indexOf(product) + 1) : null;
    }

    const fullSelectedProducts = async (preferences, importance) => {
        const basicProductParams = allSelectedProducts.map(p => ({product_id: p.product_id, source: p.source}));
        
        setIsLoading(true);
        setLoadingPercent(0);
        const numExtraApiCalls = showRecommendations ? 4 : 3;
        const loadingInterval = 100 / (basicProductParams.length + numExtraApiCalls);

        // Basic info for all products.
        const productsBasicInfo = await Promise.all(basicProductParams.map(async p => {
            try {
                // TODO: Comment out dummy basic info for actual data.
                const productEndpoint = `${process.env.REACT_APP_BACKEND_BASE_API}/api/product/basic-info?source=${p.source}&product_id=${p.product_id}`;
                // const productEndpoint = `${process.env.REACT_APP_BACKEND_BASE_API}/api/dummy/product/basic-info`;
                const response = await fetch(productEndpoint);
                setLoadingPercent(prevLoadingPercent => prevLoadingPercent + loadingInterval);
                return await response.json();
            } catch (e) {
                console.log("Error fetching basic info:", e);
            }
        }));

        // Get product recommendations.
        let recommendationResults = [];
        if (showRecommendations) {
            try {
                // TODO: Comment out dummy recommendations for actual data.
                const recEndpoint = `${process.env.REACT_APP_BACKEND_BASE_API}/api/recommendation`;
                const recommendationData = {
                    "preferences": preferences,
                    "importance": importance,
                    "selected_products": productsBasicInfo,
                }
                const recResponse = await fetch(recEndpoint, {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(recommendationData),
                });
                // const recEndpoint = `${process.env.REACT_APP_BACKEND_BASE_API}/api/dummy/recommendation`;
                // const recResponse = await fetch(recEndpoint);
                const recResults = await recResponse.json();

                // TODO: Remove below 6 lines.
                // for (let i = 0; i < productsBasicInfo.length; i++) {
                //     productsBasicInfo[i].basic_info.title = `Product ${i + 1}`;
                // }
                // for (let i = 0; i < productsBasicInfo.length; i++) {
                //     productsBasicInfo[i].basic_info.product_id = String(i + 1).repeat(3);
                // }
                // const recMap = new Map(recResults.map((item, index) => [item.title, index]));
                // productsBasicInfo.sort((a, b) => recMap.get(a.basic_info.title) - recMap.get(b.basic_info.title));
                const recMap = new Map(recResults.map((item, index) => [item.product_id, index]));
                productsBasicInfo.sort((a, b) => recMap.get(a.basic_info.product_id) - recMap.get(b.basic_info.product_id));

                for (let i = 0; i < productsBasicInfo.length; i++) {
                    productsBasicInfo[i].basic_info.score = recResults[i].score;
                    recResults[i].product_page_url = productsBasicInfo[i].basic_info.product_page_url;
                }
                recommendationResults = recResults;
                setLoadingPercent(prevLoadingPercent => prevLoadingPercent + loadingInterval);
            } catch (e) {
                console.log("Error fetching recommendations:", e);
            }
        }

        // Get detailed info for top 3 products.
        const top3ProductParams = productsBasicInfo.slice(0, 3).map(p => (
            { product_id: p.basic_info.product_id, source: p.basic_info.source, product_title: p.basic_info.title }
        ));
        const productsDetailedInfo = await Promise.all(top3ProductParams.map(async p => {
            try {
                // TODO: Comment out dummy detailed info for actual data.
                const productEndpoint = `${process.env.REACT_APP_BACKEND_BASE_API}/api/product/detailed-info?source=${p.source}&product_id=${p.product_id}&product_title=${p.product_title}`;
                // const productEndpoint = `${process.env.REACT_APP_BACKEND_BASE_API}/api/dummy/product/detailed-info`;
                const response = await fetch(productEndpoint);
                setLoadingPercent(prevLoadingPercent => prevLoadingPercent + loadingInterval);
                return await response.json();
            } catch (e) {
                console.log("Error fetching detailed info:", e);
            }
        }))
        for (let i = 0; i < productsDetailedInfo.length; i++) {
            productsBasicInfo[i] = {...productsBasicInfo[i], ...productsDetailedInfo[i]}
        }

        setIsLoading(false);
        setLoadingPercent(0);
        return [productsBasicInfo, recommendationResults];
    }

    const _fetchProductSearch = async (q) => {
        setIsSearchLoading(true);
        try {
            // TODO: Comment out dummy product search info for actual search.
            const searchEndpoint = `${process.env.REACT_APP_BACKEND_BASE_API}/api/search-products?q=${q}`;
            // const searchEndpoint = `${process.env.REACT_APP_BACKEND_BASE_API}/api/dummy/search-products?q=${q}`;
            const response = await fetch(searchEndpoint);
            const data = await response.json();
            setProductData(data.shopping_results.data);
        } catch (e) {
            console.log("Error fetching initial products:", e);
        }
        setIsSearchLoading(false);
    }

    const _searchProductsHelper = useCallback((q) => {
        if (q === "") {
            setSearchQuery(q);
            setProductData([]);
            return;
        }
        _fetchProductSearch(q);
        setSearchQuery(q);
    }, [])

    useEffect(() => {
        const q = location.state === null ? "" : location.state.query;
        const preferences = location.state === null ? null : location.state.preferences;
        const showRecommendations = location.state === null ? null : location.state.showRecommendations;
        const isPreferencesSkipped = location.state === null ? null : location.state.isPreferencesSkipped;
        setPreferencesModalData(preferences);
        setShowRecommendations(showRecommendations);
        setIsPreferencesSkipped(isPreferencesSkipped);
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

    const handleLoadMoreProducts = async () => {
        setIsSearchLoading(true);
        try {
            // TODO: Comment out dummy load more for actual load more search.
            const searchEndpoint = `${process.env.REACT_APP_BACKEND_BASE_API}/api/search-products?q=${searchQuery}&start=${paginationStart}`;
            // const searchEndpoint = `${process.env.REACT_APP_BACKEND_BASE_API}/api/dummy/search-products?q=${searchQuery}&start=${paginationStart}`;
            const response = await fetch(searchEndpoint);
            const data =  await response.json();
            const moreProdData = data.shopping_results.data;
            setProductData([...productData, ...moreProdData]);
            setPaginationStart(paginationStart + paginatedInterval);
        } catch (e) {
            console.log("Error loading more products:", e);
        }
        setIsSearchLoading(false);
    }

    const isNextButtonDisabled = numProductsSelected < minProductsSelected || numProductsSelected > maxProductsSelected;

	return (
        <div>
            <ConstantLoading isLoading={isSearchLoading} />
            <Loading isLoading={isLoading} percent={loadingPercent} size={200} strokeWidth={12} />

            {productData.length > 0 && numProductsSelected > 2 && <div className="fixed-buttons-container">
                <div className="fixed-buttons">
                    <button
                        disabled={isNextButtonDisabled}
                        onClick={() => showRecommendations ? setIsFeaturePriorityModalOpen(true) : toComparisons()}
                        className={`${isNextButtonDisabled ? "disabled-button" : "primary-button"} primary-button-size`}
                    >Next</button>
                </div>
            </div>}
            
            <div className="page-margin">
                <FeaturePriorityModal
                    isOpen={isFeaturePriorityModalOpen}
                    onSubmit={handleFeaturePriorityModalSubmit}
                    onClose={() => setIsFeaturePriorityModalOpen(false)}
                />

                <Navbar/>

                <Link className="body-1-medium back" to={routes.home}>← Back</Link>

                <div className="content-product-search">
                    <h2 className="center-text max-width-heading">Select multiple products to compare</h2>
                    <br/>
                    <div className="search-and-selected">
                        <p className="body-1">
                            <span className="body-1-bold">Select 3 or more</span> products that you are interested in
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

                    {productData.length === 0 && <div className="all-products-empty">
                        <h4>Search products</h4>
                        <p className="body-1">Search for an item, or enter the specific URL of the products you want to compare</p>
                    </div>}

                    {productData.length > 0 && showRecommendations && !isPreferencesSkipped && <div>
                        <br/>
                        <h4>Picked for you</h4>
                        <p className="body-1">Based on how much you liked previous recommendation rankings and answers to question</p>
                        <br/>
                        <div className="picked-for-you">
                            {productData.slice(0, numPickedForYou).map((product, i) => (
                                <ProductOption
                                    key={i}
                                    data={product}
                                    selectionNumber={productSelectionNumber(product)}
                                    changeSelection={onProductSelection}
                                />
                            ))}
                        </div>
                        <br/>
                        <br/>
                        <br/>
                        <br/>
                    </div>}

                    {productData.length > 0 && <h4>All products</h4>}
                    <br/>
                    <div className="all-products">
                        {mainSelectedProducts.map((product, i) => (
                            <ProductOption
                                key={i}
                                data={product}
                                selectionNumber={productSelectionNumber(product)}
                                changeSelection={onProductSelection}
                            />
                        ))}
                        {productData.slice(numPickedForYou).map((product, i) => (
                            <ProductOption
                                key={i}
                                data={product}
                                selectionNumber={productSelectionNumber(product)}
                                changeSelection={onProductSelection}
                            />
                        ))}
                    </div>
                    <br/>
                    {productData.length > 0 && <button
                        onClick={handleLoadMoreProducts}
                        className="alternative-button primary-button-size center-button"
                    >Load more</button>}
                </div>
            </div>
        </div>
	);
}

export default ProductSearch;
