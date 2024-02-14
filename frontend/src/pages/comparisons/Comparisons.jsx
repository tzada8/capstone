import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import ComparisonSection from "../../components/comparison/comparison-section/ComparisonSection";
import RecommendationTable from "../../components/recommendation-table/RecommendationTable";

import BasicInfoData from "../../components/comparison/comparison-data/BasicInfoData";
import ReviewsData from "../../components/comparison/comparison-data/ReviewsData";
import SpecificationsData from "../../components/comparison/comparison-data/SpecificationsData";
import VideosData from "../../components/comparison/comparison-data/VideosData";

function Comparisons() {
    // TODO: Remove temp recommendations once endpoint implemented.
    const recommendations = [
        {
            rank: 1,
            title: "Canon EOS 4000D",
            price: 471.97,
            source: "Best Buy",
            score: 4.2,
        },
        {
            rank: 2,
            title: "Canon EOS Rebel T10o",
            price: 564.95,
            source: "Walmart",
            score: 6.8,
        },
        {
            rank: 3,
            title: "Canon EOS Rebel T7",
            price: 599.99,
            source: "Amazon",
            score: 3.3,
        },
        {
            rank: 4,
            title: "Camera 4",
            price: 11.11,
            source: "Amazon",
            score: 0.1,
        },
        {
            rank: 5,
            title: "Camera 5",
            price: 12345.33,
            source: "Amazon",
            score: 9.7,
        },
    ]

    // const numProductsDisplayed = 3;
    const defaultProductStructure = {
        basic_info: { images: [], price: {} },
        reviews: { top_positive: {}, top_negative: {} },
        expert_review: {},
        specifications: [],
        videos: [],
    }

    const location = useLocation();

    const [showMoreComparisons, setShowMoreComparisons] = useState(false);
    const [product1Data, setProduct1Data] = useState(defaultProductStructure);
    const [product2Data, setProduct2Data] = useState(defaultProductStructure);
    const [product3Data, setProduct3Data] = useState(defaultProductStructure);
    // TODO: See if possible to have 1 list `products` for state instead of 3 states.
    // const [products, setProducts] = useState(Array(numProductsDisplayed).fill(defaultProductStructure));

    useEffect(() => {
        // TODO: Use for recommendations.
        const recommendationData = location.state === null ? { 
            "preferences": {}, "importance": {}, "selected_products": [],
        } : {
            "preferences": location.state.preferences,
            "importance": location.state.featurePriority,
            "selected_products": location.state.selectedProducts,
        }

        console.log("RECOMMENDATION DATA", recommendationData)

        // TODO: From recommendations, extract highest 3 rated.
        const topProducts = location.state === null ? [] : location.state.selectedProducts.slice(0, 3);
        // const product1Endpoint = `${process.env.REACT_APP_BACKEND_BASE_API}/api/product?source=${topProducts[0].source}&product_id=${topProducts[0].product_id}`;
        const product1Endpoint = `${process.env.REACT_APP_BACKEND_BASE_API}/api/dummy/product`;
        fetch(product1Endpoint).then(res => res.json()).then(data => {
            setProduct1Data(data);
        });
        const product2Endpoint = `${process.env.REACT_APP_BACKEND_BASE_API}/api/dummy/product`;
        fetch(product2Endpoint).then(res => res.json()).then(data => {
            setProduct2Data(data);
        });
        const product3Endpoint = `${process.env.REACT_APP_BACKEND_BASE_API}/api/dummy/product`;
        fetch(product3Endpoint).then(res => res.json()).then(data => {
            setProduct3Data(data);
        });
    }, []);

	return (
		<div>
            <h1>Recommend items by likeability</h1>
            <p>Scored by how much we think you'll like it based upon learning your preferences and reviews.</p>
            <br/>
            <RecommendationTable recommendations={showMoreComparisons ? recommendations : recommendations.slice(0, 3)} />
            <br/>
            <button onClick={() => setShowMoreComparisons(!showMoreComparisons)}>
                {showMoreComparisons ? "Hide full list" : "Show full list"}
            </button>

            <br/>
            <br/>
            <br/>

            <h1>Compare products</h1>
            <p>Get help choosing from analyzed insights, fast.</p>
            <br/>
            <br/>

            <ComparisonSection
                section_title={null}
                product1={<BasicInfoData basicInfo={product1Data.basic_info} />}
                product2={<BasicInfoData basicInfo={product2Data.basic_info} />}
                product3={<BasicInfoData basicInfo={product3Data.basic_info} />}
            />

            <ComparisonSection
                section_title="Specifications"
                product1={<SpecificationsData specifications={product1Data.specifications} />}
                product2={<SpecificationsData specifications={product2Data.specifications} />}
                product3={<SpecificationsData specifications={product3Data.specifications} />}
            />
            <ComparisonSection
                section_title="Summary of written reviews"
                product1={<ReviewsData reviews={product1Data.reviews} />}
                product2={<ReviewsData reviews={product2Data.reviews} />}
                product3={<ReviewsData reviews={product3Data.reviews} />}
            />
            <ComparisonSection
                section_title="Most helpful video reviews"
                product1={<VideosData videos={product1Data.videos.slice(0, 4)} />}
                product2={<VideosData videos={product2Data.videos.slice(0, 4)} />}
                product3={<VideosData videos={product3Data.videos.slice(0, 4)} />}
            />
		</div>
	);
}

export default Comparisons;
