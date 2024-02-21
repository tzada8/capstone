import React from "react";

import FormModal from "../../form-modal/FormModal";

function PreferencesModal({ onSubmit, isOpen, onClose }) {
    // TODO: Maybe move list of preferences to backend (allows for dynamic set of products/options).
    const preferencesForm = {
        brand: {
            label: "Do you have a brand preference?",
            initial: "",
            type: "radio",
            options: [
                { value: "canon", display: "Canon" },
                { value: "nikon", display: "Nikon" },
                { value: "brand-no-preference", display: "No preference" },
            ]
        },
        megapixels: {
            label: "Do you have a preferred range of megapixels?",
            initial: "",
            type: "radio",
            options: [
                { value: "<15", display: "<15" },
                { value: "15-30", display: "15-30" },
                { value: "30-45", display: "30-45" },
                { value: ">45", display: ">45" },
                { value: "megapixels-no-preference", display: "No preference" },
            ]
        },
        lens_type: {
            label: "Do you have a preferred lens type?",
            initial: "",
            type: "radio",
            options: [
                { value: "fixed", display: "Fixed" },
                { value: "standard", display: "Standard" },
                { value: "lens_type-no-preference", display: "No preference" },
            ]
        },
        camera_type: {
            label: "Do you have a preferred camera type?",
            initial: "",
            type: "radio",
            options: [
                { value: "point-and-shoot", display: "Point and Shoot" },
                { value: "dslr", display: "DSLR" },
                { value: "mirrorless", display: "Mirrorless" },
                { value: "camera_type-no-preference", display: "No preference" },
            ]
        },
        budget: {
            label: "What is your ideal budget range?",
            initial: "",
            type: "radio",
            options: [
                { value: "<750", display: "<750" },
                { value: "750-1500", display: "750-1500" },
                { value: ">1500", display: ">1500" },
                { value: "budget-no-preference", display: "No budget" },
            ]
        },
    }

	return (
        <FormModal
            formTitle="Refine your search"
            formDescription={null}
            errorMessage={null}
            formQuestions={preferencesForm}
            onSubmit={onSubmit}
            isOpen={isOpen}
            onClose={onClose}
        />
	);
}

export default PreferencesModal;
