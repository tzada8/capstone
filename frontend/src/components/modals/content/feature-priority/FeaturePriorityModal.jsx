import React, { useState } from "react";
import { Button } from "antd";

import "./FeaturePriorityModal.css";
import Modal from "../../base-modal/Modal";

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
        "1": { label: "1.", initial: "", options: featurePriorityOptions },
        "2": { label: "2.", initial: "", options: featurePriorityOptions },
        "3": { label: "3.", initial: "", options: featurePriorityOptions },
        "4": { label: "4.", initial: "", options: featurePriorityOptions },
        "5": { label: "5.", initial: "", options: featurePriorityOptions },
    }

    const defaultFormState = () => {
        const initialFormState = {};
        Object.keys(featurePriorityForm).forEach(key => {
            initialFormState[key] = featurePriorityForm[key].initial;
        })
        return initialFormState;
    }

    const [formState, setFormState] = useState(defaultFormState());

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormState((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }))
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        onSubmit(formState);
    }

    const handleSkip = (event) => {
        event.preventDefault();
        onSubmit(defaultFormState());
        setFormState(defaultFormState());
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
                {Object.keys(featurePriorityForm).map(question => (
                    <div className="form-row-select">
                    <label className="body-1-medium select-label-question">{featurePriorityForm[question].label}</label>
                    <select
                        className={`body-1 select-label`}
                        id={question}
                        name={question}
                        value={formState[question]}
                        onChange={handleInputChange}
                    >
                        {featurePriorityForm[question].options.map(option => (
                            <option value={option.value}>{option.display}</option>
                        ))}
                    </select>
                </div>
                ))}
                <Button htmlType="submit" type="primary" size="large" block className="primary-button form-button-spacing form-button-size">Next</Button>
                <Button onClick={handleSkip} type="primary" size="large" block ghost className="primary-button form-button-size">Skip</Button>
            </form>
        </Modal>
	);
}

export default FeaturePriorityModal;
