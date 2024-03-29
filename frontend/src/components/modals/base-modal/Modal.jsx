import React, { useRef, useState, useEffect } from "react";
import { CloseOutlined } from '@ant-design/icons';

import "./Modal.css";

function Modal(
        { isOpen, hasCloseBtn = true, onClose, title, description = null, children }
    ) {
    const [isModalOpen, setIsModalOpen] = useState(isOpen);
    const modalRef = useRef(null);

    const handleCloseModal = () => {
        if (onClose) onClose();
        setIsModalOpen(false);
    }

    const handleKeyDown = (event) => {
        if (event.key === "Escape") handleCloseModal();
    }

    useEffect(() => setIsModalOpen(isOpen), [isOpen]);

    useEffect(() => {
        const modalElement = modalRef.current;
        if (modalElement) {
            if (isModalOpen) {
                modalElement.showModal();
                document.body.classList.add("stop-background-scroll");
            } else {
                modalElement.close();
                document.body.classList.remove("stop-background-scroll");
            }
        }
    }, [isModalOpen]);

	return (
        <dialog ref={modalRef} onKeyDown={handleKeyDown} className="modal modal-center">
            <div className="modal-content">
                {hasCloseBtn && (
                    <button className="modal-close-btn" onClick={handleCloseModal}>
                        <CloseOutlined />
                    </button>
                )}
                <div className="modal-header-container">
                    <h3 className="form-extra-title-spacing">{title}</h3>
                    <p className="body-2">{description}</p>
                </div>
                {children}
            </div>
        </dialog>
	);
}

export default Modal;
