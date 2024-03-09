import React, { useState, useRef } from "react";

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
        { value: "product_rating", display: "Peer reviews and ratings" },
    ]);
    const dragFeature = useRef(0);
    const draggedOverFeature = useRef(0);

    const handleSort = () => {
        const featurePriorityClone = [...featurePriority];
        const movedFeature = featurePriorityClone.splice(dragFeature.current, 1)[0];
        featurePriorityClone.splice(draggedOverFeature.current, 0, movedFeature);
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
            description="Drag and drop to rank features from highest to lowest importance to you"
            onSubmit={handleSubmit}
            isOpen={isOpen}
            onClose={onClose}
        >
            <form onSubmit={handleSubmit}>
                {featurePriority.map((feature, index) => (
                    <div className="form-row-select">
                        <p className="body-1-medium select-label-question">{String(index + 1)}</p>
                        <div
                            className="draggable-option"
                            draggable
                            onDragStart={() => dragFeature.current = index}
                            onDragEnter={() => draggedOverFeature.current = index}
                            onDragEnd={handleSort}
                            onDragOver={(e) => e.preventDefault()}
                        >
                            <div className="select-label body-1">{feature.display}</div>
                            <div className="drag-outline-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                                    <path
                                        fill="currentColor"
                                        fill-rule="evenodd"
                                        d="M19 10a4 4 0 1 1-8 0a4 4 0 0 1 8 0m-4 18a4 4 0 1 0 0-8a4 4 0 0 0 0 8m0 14a4 4 0 1 0 0-8a4 4 0 0 0 0 8m22-32a4 4 0 1 1-8 0a4 4 0 0 1 8 0m-4 18a4 4 0 1 0 0-8a4 4 0 0 0 0 8m0 14a4 4 0 1 0 0-8a4 4 0 0 0 0 8"
                                        clip-rule="evenodd"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>
                ))}
                <button type="submit" className="primary-button form-button-spacing form-button-size">Next</button>
                <button onClick={handleSkip} className="primary-button-inverted form-button-size">Skip</button>
            </form>
        </Modal>
	);
}

export default FeaturePriorityModal;
