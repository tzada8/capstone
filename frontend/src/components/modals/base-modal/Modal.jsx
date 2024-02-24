import React, { useRef, useState, useEffect } from "react";
import { CloseOutlined } from '@ant-design/icons';

import "./Modal.css";

function Modal({ isOpen, hasCloseBtn = true, onClose, children }) {
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
            } else {
                modalElement.close();
            }
        }
    }, [isModalOpen]);

	return (
        <dialog ref={modalRef} onKeyDown={handleKeyDown} className="modal modal-center">
            {hasCloseBtn && (
                <button className="modal-close-btn" onClick={handleCloseModal}>
                    <CloseOutlined />
                </button>
            )}
            {children}
        </dialog>
	);
}

export default Modal;
