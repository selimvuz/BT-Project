import React from 'react';
import './../styles/QuickReplies.css'; // QuickReplies için stil dosyası

const QuickReplies = ({ replies, onReplyClick }) => {
    return (
        <div className="quick-replies-container">
            {replies.map((reply, index) => (
                <button
                    key={index}
                    className="quick-reply-button"
                    onClick={() => onReplyClick(reply)}
                >
                    {reply}
                </button>
            ))}
        </div>
    );
};

export default QuickReplies;
