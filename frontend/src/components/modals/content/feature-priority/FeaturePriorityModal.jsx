import React from "react";

import FormModal from "../../form-modal/FormModal";

function FeaturePriorityModal({ onSubmit, isOpen, onClose }) {
    // TODO: Maybe have list of features dependant on preferences to backend (allows for dynamic set of products/options).
    const featurePriorityOptions = [
        { value: "", display: "Please select" },
        { value: "brand", display: "Brand" },
        { value: "megapixels", display: "Number of megapixels" },
        { value: "lens_type", display: "Lens type" },
        { value: "camera_type", display: "Camera type" },
        { value: "budget", display: "Budget" },
    ]
    
    const featurePriorityForm = {
        "1": { label: "1.", initial: "", type: "select", options: featurePriorityOptions },
        "2": { label: "2.", initial: "", type: "select", options: featurePriorityOptions },
        "3": { label: "3.", initial: "", type: "select", options: featurePriorityOptions },
        "4": { label: "4.", initial: "", type: "select", options: featurePriorityOptions },
        "5": { label: "5.", initial: "", type: "select", options: featurePriorityOptions },
    }

    // TODO: Add error handling (e.g. cannot choose same feature twice).
	return (
        <FormModal
            formTitle="Priority of features"
            formDescription="Rank the features from highest to least importance to you"
            formQuestions={featurePriorityForm}
            onSubmit={onSubmit}
            isOpen={isOpen}
            onClose={onClose}
        />
	);
}

export default FeaturePriorityModal;
