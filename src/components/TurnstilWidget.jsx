import { useEffect, useRef } from "react";

const TurnstileWidget = ({ onVerify }) => {
  const turnstileRef = useRef(null);

  useEffect(() => {
    // Ensure the Turnstile script is loaded
    if (window.turnstile) {
      window.onloadTurnstileCallback = () => {
        window.turnstile.render(turnstileRef.current, {
          sitekey: "0x4AAAAAABCSq5REsM_iHNzP", // Replace with your actual sitekey
          callback: (token) => {
            console.log(`Challenge Success ${token}`);
            onVerify(token); // Pass the token to the parent component
          },
        });
      };
    }

    // Cleanup on unmount
    return () => {
      if (window.turnstile) {
        window.turnstile.reset(turnstileRef.current);
      }
    };
  }, [onVerify]);

  return (
    <div
      ref={turnstileRef}
      id="cloudflare-container"
      style={{ margin: "20px 0" }}
    />
  );
};

export default TurnstileWidget;