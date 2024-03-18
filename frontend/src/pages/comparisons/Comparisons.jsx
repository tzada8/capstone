import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import "./Comparisons.css";

import ComparisonSection from "../../components/comparison/comparison-section/ComparisonSection";
import ConstantLoading from "../../components/loading/ConstantLoading";
import Footer from "../../components/footer/Footer";
import Navbar from "../../components/navbar/Navbar";
import RecommendationTable from "../../components/recommendation-table/RecommendationTable";

import BasicInfoData from "../../components/comparison/comparison-data/BasicInfoData";
import ReviewsData from "../../components/comparison/comparison-data/ReviewsData";
import SpecificationsData from "../../components/comparison/comparison-data/SpecificationsData";
import SwitchProduct from "../../components/comparison/comparison-data/SwitchProduct";
import VideosData from "../../components/comparison/comparison-data/VideosData";

function Comparisons() {
    const numDisplayed = 3;
    const defaultProductStructure = {
        basic_info: { images: [], price: {} },
        reviews: { top_positive: {}, top_negative: {}, expert_review: {}, summary: [] },
        specifications: [],
        videos: [],
    }

    const [isLoading, setIsLoading] = useState(false);
    const [showRecommendations, setShowRecommendations] = useState(null);
    const [isFirstSection, setisFirstSection] = useState(true);
    const [products, setProducts] = useState(Array(numDisplayed).fill(defaultProductStructure));
    const [recommendations, setRecommendations] = useState([]);
    const [productTitles, setProductTitles] = useState([]);

    const location = useLocation();

    useEffect(() => {
        const comparisonsData = location.state === null ? { 
            "selectedProducts": Array(numDisplayed).fill(defaultProductStructure),
            "showRecommendations": null,
            "recommendations": [],
        } : {
            "selectedProducts": location.state.selectedProducts,
            "showRecommendations": location.state.showRecommendations,
            "recommendations": location.state.recommendations,
        }
        setShowRecommendations(comparisonsData.showRecommendations);
        setRecommendations(comparisonsData.recommendations);
        setProducts(comparisonsData.selectedProducts);
        setProductTitles(comparisonsData.selectedProducts.map((p, i) => {
            return {
                product_id: p.basic_info.product_id,
                title: p.basic_info.title,
                disabled: (i < numDisplayed ? true : false),
            };
        }));
        console.log("COMPARISONS DATA", comparisonsData);
    }, [location.state]);

    const handleProductSwitch = async (event) => {
        setIsLoading(true);
        const previousProducts = [...products];
        // TODO: Set loading functionality.

        const currIndex = Number(event.target.name.replace("switch-product-", ""))
        const newIndex = previousProducts.findIndex(p => p.basic_info.product_id === event.target.value);
        const newProduct = previousProducts[newIndex];

        // Get detailed info if don't already have it saved.
        const detailedDataKeys = ["reviews", "videos"];
        const isMissingDetailedInfo = !(detailedDataKeys.some(e => Object.keys(newProduct).includes(e)));
        if (isMissingDetailedInfo) {
            // const productEndpoint = `${process.env.REACT_APP_BACKEND_BASE_API}/api/product/detailed-info?source=${newProduct.basic_info.source}&product_id=${newProduct.basic_info.product_id}&product_title=${newProduct.basic_info.title}`;
            const productEndpoint = `${process.env.REACT_APP_BACKEND_BASE_API}/api/dummy/product/detailed-info`;
            const response = await fetch(productEndpoint);
            const detailedData = await response.json();
            const newDetailedProduct = {...newProduct, ...detailedData};
            previousProducts[newIndex] = newDetailedProduct;
        }

        // Update disabled state.
        const tempCurr = previousProducts[currIndex];
        const previousProductTitles = [...productTitles];
        const currTitleIndex = previousProductTitles.findIndex(p => p.product_id === tempCurr.basic_info.product_id);
        const newTitleIndex = previousProductTitles.findIndex(p => p.product_id === newProduct.basic_info.product_id);
        previousProductTitles[currTitleIndex].disabled = false;
        previousProductTitles[newTitleIndex].disabled = true;
        setProductTitles(previousProductTitles);

        // Switch products.
        previousProducts[currIndex] = previousProducts[newIndex];
        previousProducts[newIndex] = tempCurr;
        setProducts(previousProducts);

        setIsLoading(false);
    }

	return (
		<div>
            <ConstantLoading isLoading={isLoading} />
            {showRecommendations && !isFirstSection ?
                <div className="recommendation-section-nav"><Navbar/></div> :
                <div className="page-margin"><Navbar/></div>
            }

            {showRecommendations && !isFirstSection && <div className="recommendation-section">
                <br/>
                <h2 className="center-text max-width-heading">All product scores</h2>
                <br/>
                <RecommendationTable recommendations={recommendations} />
                <br/>
                <button className="body-1-bold scroll-down" onClick={() => document.getElementById("compare").scrollIntoView()}>Scroll to see comparison table ↓</button>
            </div>}

            <div className="page-margin">
                {(!showRecommendations || !isFirstSection) && <div>
                    <br/>
                    <h2 className="center-text max-width-heading" id="compare">Compare products</h2>
                    <br/>
                    <p className="body-1 center-text max-width-body">Get help choosing from analyzed insights, fast.</p>
                    <br/>
                    <br/>
                </div>}

                {showRecommendations && isFirstSection && <div>
                    <p className="body-1 center-text max-width-body">Based on your preferences and product reviews</p>
                    <br/>
                    <h2 className="center-text max-width-heading" id="compare">We think you'll like...</h2>
                    <br/>
                    <button className="body-1-bold all-comparisons" onClick={() => setisFirstSection(!isFirstSection)}>See how other products are scored →</button>
                    <br/>
                    <br/>
                </div>}

                {showRecommendations && <ComparisonSection
                    products={products.slice(0, numDisplayed).map((p, i) => {
                        return <SwitchProduct i={i} selectedId={p.basic_info.product_id} productTitles={productTitles} handleSwitch={handleProductSwitch} />
                    })}
                />}

                <div>
                    <ComparisonSection
                        products={products.slice(0, numDisplayed).map(p => <BasicInfoData basicInfo={p.basic_info} />)}
                    />
                    <ComparisonSection
                        sectionTitle="Specifications"
                        products={products.slice(0, numDisplayed).map(p => <SpecificationsData specifications={p.specifications} />)}
                    />
                    <ComparisonSection
                        sectionTitle="Summary of written reviews"
                        products={products.slice(0, numDisplayed).map(p => <ReviewsData reviews={p.reviews} />)}
                    />
                    <ComparisonSection
                        sectionTitle="Most helpful video reviews"
                        products={products.slice(0, numDisplayed).map(p => <VideosData videos={p.videos} />)}
                    />
                </div>
                <Footer />
            </div>
		</div>
	);
}

export default Comparisons;
