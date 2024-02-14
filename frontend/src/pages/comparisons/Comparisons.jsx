import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import "./Comparisons.css";

import ComparisonSection from "../../components/comparison/comparison-section/ComparisonSection";
import RecommendationTable from "../../components/recommendation-table/RecommendationTable";

import BasicInfoData from "../../components/comparison/comparison-data/BasicInfoData";
import ReviewsData from "../../components/comparison/comparison-data/ReviewsData";
import SpecificationsData from "../../components/comparison/comparison-data/SpecificationsData";
import VideosData from "../../components/comparison/comparison-data/VideosData";

function Comparisons() {
    const numProductsDisplayed = 3;
    const defaultProductStructure = {
        basic_info: { images: [], price: {} },
        reviews: { top_positive: {}, top_negative: {} },
        expert_review: {},
        specifications: [],
        videos: [],
    }

    const [showMoreRecommendations, setShowMoreRecommendations] = useState(false);
    const [products, setProducts] = useState(Array(numProductsDisplayed).fill(defaultProductStructure));
    const [recommendations, setRecommendations] = useState([]);

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

        // TODO: Comment out dummy recommendations for actual data.
        // const recEndpoint = `${process.env.REACT_APP_BACKEND_BASE_API}/api/dummy/recommendation`;
        // fetch(recEndpoint).then(res => res.json()).then(data => setRecommendations(data));
        const recEndpoint = `${process.env.REACT_APP_BACKEND_BASE_API}/api/recommendation`;
        fetch(recEndpoint, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(recommendationData),
        }).then(res => res.json()).then(data => setRecommendations(data));

        // Sort products based on order of recommendations.
        const unsortedProducts = recommendationData["selected_products"];
        unsortedProducts.sort((a, b) => recommendations.indexOf(a) - recommendations.indexOf(b));
        setProducts(unsortedProducts);
    }, []);

	return (
		<div>
            <h1>Recommend items by likeability</h1>
            <p>Scored by how much we think you'll like it based upon learning your preferences and reviews.</p>
            <br/>
            <RecommendationTable recommendations={showMoreRecommendations ? recommendations : recommendations.slice(0, numProductsDisplayed)} />
            <br/>
            <button className="show-recommendation-table" onClick={() => setShowMoreRecommendations(!showMoreRecommendations)}>
                {showMoreRecommendations ? "Hide full list" : "Show full list"}
            </button>

            <br/>
            <br/>
            <br/>

            <h1>Compare products</h1>
            <p>Get help choosing from analyzed insights, fast.</p>
            <br/>
            <br/>

            {/* TODO: ComparisonSections can probably be updated to just take in list of products (instead of explicitly saying 1, 2, 3). */}
            {/* <ComparisonSection
                section_title={null}
                products={<BasicInfoData basicInfo={products.slice(0, 3)} />}
            /> */}
            <ComparisonSection
                section_title={null}
                product1={<BasicInfoData basicInfo={products[0].basic_info} />}
                product2={<BasicInfoData basicInfo={products[1].basic_info} />}
                product3={<BasicInfoData basicInfo={products[2].basic_info} />}
            />

            <ComparisonSection
                section_title="Specifications"
                product1={<SpecificationsData specifications={products[0].specifications} />}
                product2={<SpecificationsData specifications={products[1].specifications} />}
                product3={<SpecificationsData specifications={products[2].specifications} />}
            />
            <ComparisonSection
                section_title="Summary of written reviews"
                product1={<ReviewsData reviews={products[0].reviews} />}
                product2={<ReviewsData reviews={products[1].reviews} />}
                product3={<ReviewsData reviews={products[2].reviews} />}
            />
            <ComparisonSection
                section_title="Most helpful video reviews"
                product1={<VideosData videos={products[0].videos.slice(0, 4)} />}
                product2={<VideosData videos={products[1].videos.slice(0, 4)} />}
                product3={<VideosData videos={products[2].videos.slice(0, 4)} />}
            />
		</div>
	);
}

export default Comparisons;
