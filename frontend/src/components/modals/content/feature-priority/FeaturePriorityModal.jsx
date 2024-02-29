import React, { useState, useRef } from "react";
import { Button } from "antd";

import "./FeaturePriorityModal.css";
import Modal from "../../base-modal/Modal";

function FeaturePriorityModal({ onSubmit, isOpen, onClose }) {
    // TODO: Maybe have list of features dependant on preferences to backend (allows for dynamic set of products/options).
    const [featurePriority, setFeaturePriority] = useState([
        { value: "brand", display: "Brand" },
        { value: "megapixels", display: "Number of megapixels" },
        { value: "lens_type", display: "Lens type" },
        { value: "camera_type", display: "Camera type" },
        { value: "budget", display: "Budget" },
        { value: "product_rating", display: "Product Rating" },
    ]);
    const dragFeature = useRef(0);
    const draggedOverFeature = useRef(0);

    const handleSort = () => {
        const featurePriorityClone = [...featurePriority];
        const temp = featurePriorityClone[dragFeature.current];
        featurePriorityClone[dragFeature.current] = featurePriorityClone[draggedOverFeature.current];
        featurePriorityClone[draggedOverFeature.current] = temp;
        setFeaturePriority(featurePriorityClone);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const formSubmit = {};
        featurePriority.forEach((fp, i) => formSubmit[String(i + 1)] = fp.value);
        onSubmit(formSubmit);
    }

    const handleSkip = (event) => {
        event.preventDefault();
        const formSkip = {};
        featurePriority.forEach((_, i) => formSkip[String(i + 1)] = "");
        onSubmit(formSkip);
    }

	return (
        <Modal
            title="Priority of features"
            description="Rank the features from highest to least importance to you"
            onSubmit={handleSubmit}
            isOpen={isOpen}
            onClose={onClose}
        >
            <form onSubmit={handleSubmit}>
                {featurePriority.map((feature, index) => (
                    <div className="form-row-select">
                        <p className="body-1-medium select-label-question">{String(index + 1)}.</p>
                        <div
                            className="select-label"
                            draggable
                            onDragStart={() => dragFeature.current = index}
                            onDragEnter={() => draggedOverFeature.current = index}
                            onDragEnd={handleSort}
                            onDragOver={(e) => e.preventDefault()}
                        >
                            <p className="body-1">{feature.display}</p>
                        </div>
                    </div>
                ))}
                <Button htmlType="submit" type="primary" size="large" block className="primary-button form-button-spacing form-button-size">Next</Button>
                <Button onClick={handleSkip} type="primary" size="large" block ghost className="primary-button form-button-size">Skip</Button>
            </form>
        </Modal>
	);
}

export default FeaturePriorityModal;
