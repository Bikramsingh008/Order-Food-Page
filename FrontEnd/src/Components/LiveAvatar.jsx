import React from "react";
import "./LiveAvatar.css";

const LiveAvatar = ({ src, alt, size = "md", className = "", onClick }) => {
  return (
    <div
      className={`live-avatar-wrapper size-${size} ${className}`}
      onClick={onClick}
    >
      <div className="live-avatar-frame">
        <img src={src} alt={alt || "Sticker Avatar"} className="live-avatar-img" />
      </div>
    </div>
  );
};

export default LiveAvatar;
