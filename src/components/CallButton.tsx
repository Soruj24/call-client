import React from "react";

interface CallButtonProps {
    onClick: () => void;
}

const CallButton: React.FC<CallButtonProps> = ({ onClick }) => (
    <button onClick={onClick} className="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600">
        📞 Start Call
    </button>
);

export default CallButton;
