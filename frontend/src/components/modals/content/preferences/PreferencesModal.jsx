import React, { useState } from "react";

import "./PreferencesModal.css";
import Modal from "../../base-modals/Modal";

const initialPreferencesModalData = {
    brand: "",
    megapixels: "",
    lens_type: "",
    camera_type: "",
    budget: "",
}

function PreferencesModal({ onSubmit, isOpen, onClose }) {
    const [formState, setFormState] = useState(initialPreferencesModalData);

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
        setFormState(initialPreferencesModalData);
    }

    // TODO: Add error handling (e.g. budget >= $0)
    // TODO: Maybe move list of preferences to backend (allows for dynamic set of products/options)
	return (
        <Modal hasCloseBtn={true} isOpen={isOpen} onClose={onClose}>
            <h2>Preferences</h2>
            <p>Answer the following to refine your search</p>
            <form onSubmit={handleSubmit}>
                <div className="form-row">
                    <label htmlFor="brand">Brand</label>
                    <select
                        id="brand"
                        name="brand"
                        value={formState.brand}
                        onChange={handleInputChange}
                    >
                        <option value=""></option>
                        <option value="canon">Canon</option>
                        <option value="nikon">Nikon</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div className="form-row">
                    <label htmlFor="megapixels">Number of Megapixels</label>
                    <select
                        id="megapixels"
                        name="megapixels"
                        value={formState.megapixels}
                        onChange={handleInputChange}
                    >
                        <option value=""></option>
                        <option value="<15">{"<15"}</option>
                        <option value="15-30">15-30</option>
                        <option value="30-45">30-45</option>
                        <option value=">45">{">45"}</option>
                    </select>
                </div>
                <div className="form-row">
                    <label htmlFor="lens_type">Lens Type</label>
                    <select
                        id="lens_type"
                        name="lens_type"
                        value={formState.lens_type}
                        onChange={handleInputChange}
                    >
                        <option value=""></option>
                        <option value="fixed">Fixed</option>
                        <option value="standard">Standard</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div className="form-row">
                    <label htmlFor="camera_type">Camera Type</label>
                    <select
                        id="camera_type"
                        name="camera_type"
                        value={formState.camera_type}
                        onChange={handleInputChange}
                    >
                        <option value=""></option>
                        <option value="point-and-shoot">Point and Shoot</option>
                        <option value="dslr">DSLR</option>
                        <option value="mirrorless">Mirrorless</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div className="form-row">
                    <label htmlFor="budget">Budget</label>
                    <select
                        id="budget"
                        name="budget"
                        value={formState.budget}
                        onChange={handleInputChange}
                    >
                        <option value="<750">{"<750"}</option>
                        <option value="750-1500">750-1500</option>
                        <option value=">1500">{">1500"}</option>
                    </select>
                </div>
                <div className="button-container">
                    <button type="submit" className="left-button">Skip</button>
                    <button type="submit" className="right-button">Continue</button>
                </div>
            </form>
        </Modal>
	);
}

export default PreferencesModal;
