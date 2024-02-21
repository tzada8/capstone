import React, { useState } from "react";

import "./FormModal.css";
import Modal from "../base-modal/Modal";

function FormModal(props) {
    const defaultFormState = () => {
        const initialFormState = {};
        Object.keys(props.formQuestions).forEach(key => {
            initialFormState[key] = props.formQuestions[key].initial;
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
        props.onSubmit(formState);
    }

    const handleSkip = (event) => {
        event.preventDefault();
        props.onSubmit(defaultFormState());
        setFormState(defaultFormState());
    }

	return (
        <Modal hasCloseBtn={true} isOpen={props.isOpen} onClose={props.onClose}>
            <h2>{props.formTitle}</h2>
            <p>{props.formDescription}</p>
            {props.errorMessage && <div style={{ color: 'red' }}>{props.errorMessage}</div>}
            <form onSubmit={handleSubmit}>
                {Object.keys(props.formQuestions).map(question => {
                    return props.formQuestions[question].type === "radio" ? (
                        <div className="form-row">
                            <p>{props.formQuestions[question].label}</p>
                            {props.formQuestions[question].options.map(option => (
                                <div>
                                    <input type="radio" id={option.value} name={question} value={option.value} onChange={handleInputChange}/>
                                    <label htmlFor={option.value} className="radio-label">{option.display}</label>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="form-row">
                            <label>{props.formQuestions[question].label}</label>
                            <select id={question} name={question} value={formState[question]} onChange={handleInputChange}>
                                {props.formQuestions[question].options.map(option => (
                                    <option value={option.value}>{option.display}</option>
                                ))}
                            </select>
                        </div>
                    )}
                )}
                <br/>
                <button onClick={handleSkip} className="skip-button">Skip</button>
                <br/>
                <button type="submit" className="continue-button">Continue</button>
            </form>
        </Modal>
	);
}

export default FormModal;
