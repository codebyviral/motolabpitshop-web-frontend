import React from "react";
import { Share2 } from "lucide-react";
import { toast } from "react-toastify";

const ShareIcon = ({ url, title }) => {
  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

  const handleShare = async () => {
    if (isMobile && navigator.share) {
      try {
        await navigator.share({
          title: title,
          url: url,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      // Fallback for desktop: Copy link to clipboard
      try {
        await navigator.clipboard.writeText(url);
        toast("Link copied to clipboard!");
      } catch (error) {
        console.error("Error copying link:", error);
      }
    }
  };

  return (
    <div className="mt-2" onClick={handleShare} style={{ cursor: "pointer" }}>
      <Share2 size={24} />
    </div>
  );
};

export default ShareIcon;
