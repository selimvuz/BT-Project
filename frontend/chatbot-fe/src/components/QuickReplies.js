import React from "react";
import "./../styles/QuickReplies.css"; // QuickReplies için stil dosyası

// Hızlı cevaplarınızın listesi
export const quickReplies = [
  "Gündemde neler var?",
  "Bugün hava nasıl?",
  "Günlük hisse senedi fiyatları",
];

const QuickReplies = ({ replies, onReplyClick }) => {
  return (
    <div className="quick-replies-container">
      {replies.map((reply, index) => (
        <button
          key={index}
          className="quick-reply-button"
          onClick={() => onReplyClick(reply)}
          disabled={index === 2}
        >
          {reply}
        </button>
      ))}
    </div>
  );
};

export default QuickReplies;
