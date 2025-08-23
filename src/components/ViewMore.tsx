'use client'
import React, { useState } from "react";
import Modal from "./Modal";

interface ViewMoreProps {
    title: string;
    text: string;
    charLimit?: number; // number of chars to show before truncation
    className?: string;
}

const ViewMore: React.FC<ViewMoreProps> = ({ title, text, charLimit = 100, className }) => {
    const [isModalOpen, setModalOpen] = useState(false);

    // Check if text needs truncation
    const isTruncated = text.length > charLimit;
    const truncatedText = isTruncated ? text.slice(0, charLimit) + "…" : text;

    return (
        <>
            <div className={className}>
                <span>{truncatedText}</span>
                {isTruncated && (
                    <button
                        onClick={() => setModalOpen(true)}
                        className="ml-1 text-blue-600 hover:underline text-sm"
                        aria-label="View more"
                    >
                        View More
                    </button>
                )}
            </div>

            {isModalOpen && (
                <Modal
                    isOpen={isModalOpen}
                    onClose={() => setModalOpen(false)}
                    title={title || "View More"}
                >
                    <div className="whitespace-pre-wrap">{text}</div>
                </Modal>
            )}
        </>
    );
};

export default ViewMore;
