import React from "react";

interface HangUpButtonProps {
    onClick: () => void;
}

const HangUpButton: React.FC<HangUpButtonProps> = ({ onClick }) => (
    <button onClick={onClick} className="px-6 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600">
        ❌ Hang Up
    </button>
);

export default HangUpButton;
