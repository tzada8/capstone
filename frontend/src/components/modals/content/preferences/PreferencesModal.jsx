import React, { useState } from "react";

import "./PreferencesModal.css";
import Modal from "../../base-modal/Modal";

function PreferencesModal({ onSubmit, isOpen, onClose }) {
    // TODO: Maybe move list of preferences to backend (allows for dynamic set of products/options).
    const preferencesForm = {
        budget: {
            label: "What is your ideal budget range?",
            initial: "",
            options: [
                { value: "<750", display: "<750" },
                { value: "750-1500", display: "750-1500" },
                { value: ">1500", display: ">1500" },
                { value: "budget-no-preference", display: "No budget" },
            ]
        },
        camera_type: {
            label: "Do you have a preferred camera type?",
            initial: "",
            options: [
                { value: "point-and-shoot", display: "Point and Shoot" },
                { value: "dslr", display: "DSLR" },
                { value: "mirrorless", display: "Mirrorless" },
                { value: "camera_type-no-preference", display: "Not listed / No preference" },
            ]
        },
        brand: {
            label: "Do you have a brand preference?",
            initial: "",
            options: [
                { value: "canon", display: "Canon" },
                { value: "nikon", display: "Nikon" },
                { value: "brand-no-preference", display: "Not listed / No preference" },
            ]
        },
        lens_type: {
            label: "Do you have a preferred lens type?",
            initial: "",
            options: [
                { value: "fixed", display: "Fixed" },
                { value: "standard", display: "Standard" },
                { value: "lens_type-no-preference", display: "Not listed / No preference" },
            ]
        },
        megapixels: {
            label: "Do you have a preferred range of megapixels?",
            initial: "",
            options: [
                { value: "<15", display: "<15" },
                { value: "15-30", display: "15-30" },
                { value: "30-45", display: "30-45" },
                { value: ">45", display: ">45" },
                { value: "megapixels-no-preference", display: "Not listed / No preference" },
            ]
        },
    }

    const defaultFormState = () => {
        const initialFormState = {};
        Object.keys(preferencesForm).forEach(key => {
            initialFormState[key] = preferencesForm[key].initial;
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
            title="Refine your search"
            onSubmit={onSubmit}
            isOpen={isOpen}
            onClose={onClose}
        >
            <form onSubmit={handleSubmit}>
                {Object.keys(preferencesForm).map(question => (
                    <div className="form-row-radio">
                        <p className="body-2 radio-label-question">{preferencesForm[question].label}</p>
                        {preferencesForm[question].options.map(option => (
                            <div>
                                <input type="radio" id={option.value} name={question} value={option.value} onChange={handleInputChange}/>
                                <label htmlFor={option.value} className="body-1-medium radio-label">{option.display}</label>
                            </div>
                        ))}
                    </div>
                ))}
            </form>
            <button type="submit" className="primary-button form-button-spacing form-button-size">Next</button>
            <button onClick={handleSkip} className="primary-button-inverted form-button-size">Skip</button>
        </Modal>
	);
}

export default PreferencesModal;
