import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import "./Comparisons.css";

import ComparisonSection from "../../components/comparison/comparison-section/ComparisonSection";
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
        reviews: { top_positive: {}, top_negative: {} },
        expert_review: {},
        specifications: [],
        videos: [],
    }

    const [showMoreRecommendations, setShowMoreRecommendations] = useState(false);
    const [products, setProducts] = useState(Array(numDisplayed).fill(defaultProductStructure));
    const [recommendations, setRecommendations] = useState([]);
    const [productTitles, setProductTitles] = useState([]);

    const location = useLocation();

    useEffect(() => {
        const recommendationData = location.state === null ? { 
            "preferences": {}, "importance": {}, "selected_products": [],
        } : {
            "preferences": location.state.preferences,
            "importance": location.state.featurePriority,
            "selected_products": location.state.selectedProducts,
        }
        console.log("RECOMMENDATION DATA", recommendationData)

        // TODO: Remove. Temp just to rename products.
        const renameProducts = recommendationData["selected_products"].map((p, i) => {
            p.basic_info.title = `Product ${i + 1}`
            return p;
        })

        // const unsortedProducts = recommendationData["selected_products"];
        const unsortedProducts = renameProducts;

        // TODO: Comment out dummy recommendations for actual data.
        const recEndpoint = `${process.env.REACT_APP_BACKEND_BASE_API}/api/dummy/recommendation`;
        fetch(recEndpoint).then(res => res.json()).then(data => {
            setRecommendations(data);
            unsortedProducts.sort((a, b) => data.indexOf(a) - data.indexOf(b));
            setProducts(unsortedProducts);
            setProductTitles(unsortedProducts.map(p => p.basic_info.title));
        });
        // const recEndpoint = `${process.env.REACT_APP_BACKEND_BASE_API}/api/recommendation`;
        // fetch(recEndpoint, {
        //     method: "POST",
        //     headers: {"Content-Type": "application/json"},
        //     body: JSON.stringify(recommendationData),
        // }).then(res => res.json()).then(data => {
        //     setRecommendations(data);
        //     unsortedProducts.sort((a, b) => data.indexOf(a) - data.indexOf(b));
        //     setProducts(unsortedProducts);
        //     setProductTitles(unsortedProducts.map(p => p.basic_info.title));
        // });        
    }, [location.state]);

    const handleProductSwitch = (event) => {
        const previousProducts = [...products];
        const currIndex = Number(event.target.name.replace("switch-product-", ""))
        const newTitle = event.target.value;
        const newIndex = previousProducts.findIndex(p => p.basic_info.title === newTitle);
        const tempCurr = previousProducts[currIndex];
        previousProducts[currIndex] = previousProducts[newIndex];
        previousProducts[newIndex] = tempCurr;
        setProducts(previousProducts);
    }

	return (
		<div>
            <Navbar isComparisonNav={true} />

            <div className="recommendation-section">
                <h1 className="center-text max-width-heading">Recommend items by likeability</h1>
                <br/>
                <p className="body-1 center-text max-width-body">Scored by how much we think you'll like it based upon learning your preferences and reviews.</p>
                <br/>
                <RecommendationTable recommendations={showMoreRecommendations ? recommendations : recommendations.slice(0, numDisplayed)} />
                <br/>
                <button
                    onClick={() => setShowMoreRecommendations(!showMoreRecommendations)}
                    className="alternative-button primary-button-size center-button"
                >{showMoreRecommendations ? "Show less" : "Show more"}</button>
            </div>

            <br/>
            <br/>
            <br/>

            <div className="page-margin">
                <h1 className="center-text max-width-heading">Compare products</h1>
                <br/>
                <p className="body-1 center-text max-width-body">Get help choosing from analyzed insights, fast.</p>
                <br/>
                <br/>
                <br/>

                <ComparisonSection
                    products={products.slice(0, numDisplayed).map((p, i) => {
                        return <SwitchProduct i={i} selectedTitle={p.basic_info.title} productTitles={productTitles} handleSwitch={handleProductSwitch} />
                    })}
                />
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
                    products={products.slice(0, numDisplayed).map(p => <VideosData videos={p.videos.slice(0, numDisplayed)} />)}
                />
            </div>
            <Footer />
		</div>
	);
}

export default Comparisons;
