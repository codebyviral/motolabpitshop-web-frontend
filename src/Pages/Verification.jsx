import React, { useState, useEffect, useRef } from "react";
import { Header, Footer } from "../components/index";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const Verification = () => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [error, setError] = useState("");
  const [correctOtp, setCorrectOtp] = useState("");
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  const backendUrl = import.meta.env.VITE_BACKEND;

  // Handle timer countdown
  useEffect(() => {
    let interval = null;
    if (isOtpSent && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer, isOtpSent]);

  // Function to handle sending OTP
  const handleSendOtp = () => {
    setIsLoading(true);
    setError("");

    // Simulate API call with timeout
    setTimeout(async () => {
      try {
        // Get OTP from backend
        const otpResponse = await axios.get(
          `${backendUrl}/api/auth/get-otp?userId=${localStorage.getItem(
            "userId"
          )}`
        );
        setCorrectOtp(otpResponse.data.otp);
        setIsOtpSent(true);
        setIsLoading(false);
        setTimer(30); // 30-second countdown for resend

        // Focus first input after OTP is sent
        if (inputRefs.current[0]) {
          inputRefs.current[0].focus();
        }

        toast.success("OTP sent successfully!");
      } catch (error) {
        console.error("Error sending OTP:", error);
        toast.error("Failed to send OTP. Please try again.");
        setIsLoading(false);
      }
    }, 1500);
  };

  // Function to handle OTP resend
  const handleResendOtp = () => {
    setOtp(["", "", "", ""]);
    handleSendOtp();
  };

  // Handle input change for OTP digits
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(0, 1); // Take only first character
    setOtp(newOtp);

    // Auto-focus next input if current one is filled
    if (value && index < 3 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Handle backspace key
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      // Focus previous input on backspace if current is empty
      inputRefs.current[index - 1].focus();
    }
  };

  // Function to handle OTP submission
  const handleSubmitOtp = () => {
    setIsLoading(true);
    setError("");

    const otpString = otp.join("");

    // Simulate API verification with timeout
    setTimeout(async () => {
      try {
        if (otpString.length === 4) {
          const userId = localStorage.getItem("userId");
          const verifyOtpResponse = await axios.post(
            `${backendUrl}/api/auth/verify-account`,
            {
              userId,
              userOtp: otp.join(""),
            }
          );

          if (verifyOtpResponse.data.success) {
            setIsVerified(true);
            setError("");
            toast.success("OTP verified successfully!");
          } else {
            setError("Invalid OTP. Please try again.");
            toast.error("Invalid OTP. Please try again.");
          }
        } else {
          setError("Please enter all 4 digits");
          toast.error("Please enter all 4 digits");
        }
      } catch (error) {
        console.error("Error verifying OTP:", error);
        toast.error("An error occurred. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }, 1500);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />

      {/* Main content with reduced space after header */}
      <main className="flex-1 flex flex-col justify-center items-center py-8 px-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 sm:p-8 transition-all duration-300 border border-gray-100">
          {/* Decorative element at top */}
          <div className="w-full h-2 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-t-lg -mt-6 -mx-6 sm:-mx-8 mb-6"></div>

          <div className="text-center mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
              Verification
            </h2>
            <p className="text-gray-600 text-sm sm:text-base">
              {isOtpSent
                ? "Enter the 4-digit code sent to your device"
                : "Verify your account to continue"}
            </p>
          </div>

          {/* OTP Input Field */}
          {isOtpSent && !isVerified && (
            <div className="mb-6">
              <div className="flex justify-center gap-2 mb-6">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    className="w-12 sm:w-14 h-12 sm:h-14 text-center text-xl font-bold border-2 rounded-lg focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 focus:outline-none transition-all duration-200 shadow-sm"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    disabled={isLoading}
                  />
                ))}
              </div>

              {error && (
                <div className="text-red-500 text-sm text-center mb-4 bg-red-50 py-2 rounded-lg">
                  {error}
                </div>
              )}

              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-gray-500">
                  {timer > 0 ? `Resend in ${timer}s` : "Didn't receive code?"}
                </span>
                <button
                  onClick={handleResendOtp}
                  className={`text-sm font-medium ${
                    timer > 0
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-yellow-600 hover:text-yellow-700"
                  }`}
                  disabled={timer > 0 || isLoading}
                >
                  Resend Code
                </button>
              </div>
            </div>
          )}

          {/* Send OTP Button */}
          {!isOtpSent && (
            <button
              onClick={handleSendOtp}
              disabled={isLoading}
              className="w-full bg-yellow-500 text-white py-3 sm:py-4 rounded-lg font-medium tracking-wide hover:bg-yellow-600 focus:ring-4 focus:ring-yellow-300 focus:outline-none transition duration-200 flex justify-center items-center shadow-md hover:shadow-lg transform hover:-translate-y-1"
            >
              {isLoading ? (
                <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
              ) : null}
              {isLoading ? "Sending..." : "Send Verification Code"}
            </button>
          )}

          {/* Submit OTP Button */}
          {isOtpSent && !isVerified && (
            <button
              onClick={handleSubmitOtp}
              disabled={otp.join("").length !== 4 || isLoading}
              className={`w-full py-3 sm:py-4 rounded-lg font-medium tracking-wide transition duration-200 flex justify-center items-center shadow-md hover:shadow-lg transform hover:-translate-y-1 ${
                otp.join("").length === 4 && !isLoading
                  ? "bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-4 focus:ring-yellow-300"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
              }`}
            >
              {isLoading ? (
                <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
              ) : null}
              {isLoading ? "Verifying..." : "Verify Code"}
            </button>
          )}

          {/* Verification Success */}
          {isVerified && (
            <div className="mt-4 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-500 mb-4 shadow-sm">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Verification Successful!
              </h3>
              <p className="text-gray-600 mb-6">
                Your account has been verified successfully.
              </p>
              <button
                className="w-full bg-yellow-500 text-white py-3 rounded-lg font-medium hover:bg-yellow-600 transition duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                onClick={() => navigate("/")}
              >
                Continue to Motolab PitShop
              </button>
            </div>
          )}

          {/* Security note */}
          <div className="mt-6 text-center text-xs text-gray-400 flex items-center justify-center">
            <svg
              className="w-3 h-3 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              ></path>
            </svg>
            Secured by 256-bit encryption
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Verification;
